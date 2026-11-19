import React from 'react';
import styled from 'styled-components';
import GlobalStyles from './styles/GlobalStyles';
import { Background } from './components/Background/Background';
import { Hero } from './components/Hero/Hero';
import { ViewTabs } from './components/ViewTabs/ViewTabs';
import { Carousel } from './components/Carousel/Carousel';
import { Lightbox, LightboxSource } from './components/Lightbox/Lightbox';
import { riseIn, EASE_OUT, SCRAMBLE_CHARSET } from './styles/animations';
import { ViewId, WorksKind, QUIPS, WORKS_QUIPS, getItems, SKILLS, PASSIONS, VITAE, WORKS } from './data/portfolio';

/**
 * ============================================================================
 * App — top-level state machine driving the whole page.
 *
 * Owns every piece of shared state: the active view, the carousel scroll
 * offset, the per-card image-cycle counters, the hovered card (detail
 * panel), the lightbox, and the scrambling quip text. Timers:
 *
 *   cycleTimer  (1100ms) — advances one card's photo at a time, round-robin
 *   carTimer    (2600ms) — auto-advances the carousel unless paused/hovered
 *   quipTimer   (30ms)   — runs the quip scramble morph during tab switches
 *   fadeT1               — holds the content swap until the cards have left
 *
 * A class component keeps this a straight port of the design's logic —
 * interval callbacks read fresh state via setState updaters, no stale
 * closure gymnastics required.
 * ============================================================================
 */

/* --------------------------------------------------------------------------
 * Design-time options carried over from the design file's prop panel.
 * bgMode: 'photo+grid' | 'photo' | 'grid'
 * ------------------------------------------------------------------------ */
const BG_MODE = 'photo+grid';
const SHOW_RETICLE = true;
const DECODE_ANIM = true;

/* Desktop card geometry — the responsive layout derives everything from
   these, and reproduces the design exactly at full width */
const CARD_W = 302;
const TAB_W = 150;

/* How long the outgoing cards get to leave before the content is swapped:
   the carousel's exit animation (300ms) plus its longest stagger. Keep in
   step with SWAP_OUT_MS / SWAP_OUT_STAGGER_MS in Carousel.tsx. */
const SWAP_OUT_TOTAL_MS = 380;

/* Longest section drives the photo-cycle counter array, so adding cards to
   any view needs no other change here */
const MAX_ITEMS = Math.max(SKILLS.length, PASSIONS.length, VITAE.length, WORKS.length);

/* Root surface: dark canvas, no horizontal scroll, SF Pro body text */
const Page = styled.div`
    min-height: 100vh;
    position: relative;
    overflow-x: hidden;
    font-family: 'SF Pro Text', system-ui, -apple-system, sans-serif;
    color: #E6ECF1;
    background: #0C1014;
`;

/* Centred content column above the fixed background stack */
const Content = styled.div`
    position: relative;
    z-index: 1;
    max-width: 1400px;
    margin: 0 auto;
    padding: 40px 32px 64px;

    @media (max-width: 760px) {
        padding: 24px 16px 48px;
    }
`;

/* The italic one-liner between the tabs and the carousel */
const Quip = styled.p`
    text-align: center;
    margin: 20px 0 8px;
    font-size: 14.5px;
    font-style: italic;
    font-weight: 300;
    color: rgba(198, 212, 223, 0.65);
    letter-spacing: 0.4px;
    animation: ${riseIn} 0.7s ${EASE_OUT} 0.55s both;
`;

/* Responsive figures derived from the viewport width */
interface LayoutMetrics {
    visible: number;
    cardWidth: number;
    tabWidth: number;
    /** Window width — the carousel fills it edge to edge with side cards. */
    viewportWidth: number;
}

interface AppState extends LayoutMetrics {
    view: ViewId;
    /** Which half of Works is showing; remembered while other tabs are open. */
    worksKind: WorksKind;
    /** Hovered card index — non-null means the detail panel is open. */
    hovered: number | null;
    /** Per-card-slot photo indices; slots cycle one at a time. */
    imgIdx: number[];
    /** Which slot the cycle timer touches next. */
    cycle: number;
    /** Carousel scroll position, in whole cards. */
    offset: number;
    /** True while the pointer is over the row/arrows (pauses auto-advance). */
    paused: boolean;
    /** True during the tab-switch fade-out/fade-in. */
    fading: boolean;
    /** Current (possibly mid-scramble) quip text. */
    qText: string;
    /** Lightbox contents, or null when closed. */
    lightbox: { imgs: string[]; idx: number; source: LightboxSource } | null;
}

class App extends React.Component<{}, AppState> {
    /* Timer handles — window.* variants so TypeScript sees numbers */
    private cycleTimer = 0;
    private carTimer = 0;
    private quipTimer = 0;
    private fadeT1 = 0;
    private preloadT = 0;

    /* Timestamp of the last tab switch — auto-advance holds off briefly */
    private lastSwitch = 0;

    state: AppState = {
        view: 'skills',
        worksKind: 'software',
        hovered: null,
        /* One photo-cycle counter per card, sized to the largest view so
           every card in every section has a slot (a short array would leave
           trailing cards with an undefined index and hide their photos) */
        imgIdx: new Array(MAX_ITEMS).fill(0),
        cycle: 0,
        offset: 0,
        paused: false,
        fading: false,
        qText: QUIPS.skills,
        lightbox: null,
        ...App.computeLayout(),
    };

    /* ----------------------------------------------------------------------
     * Responsive geometry. At >=1408px this returns the design's exact
     * desktop figures (4 × 302px cards, 150px tabs); below that we shed
     * cards, and only on phones do the cards themselves shrink.
     * -------------------------------------------------------------------- */
    static computeLayout(): LayoutMetrics {
        const vw = typeof window !== 'undefined' ? window.innerWidth : 1440;
        const tabWidth = Math.min(TAB_W, Math.floor((vw - 40) / 4));
        // 1296px row + 54px arrows each side + margin — needs ~1408px
        if (vw >= 1408) return { visible: 4, cardWidth: CARD_W, tabWidth, viewportWidth: vw };
        if (vw >= 1080) return { visible: 3, cardWidth: CARD_W, tabWidth, viewportWidth: vw };
        if (vw >= 760) return { visible: 2, cardWidth: CARD_W, tabWidth, viewportWidth: vw };
        return { visible: 1, cardWidth: Math.min(CARD_W, vw - 72), tabWidth, viewportWidth: vw };
    }

    componentDidMount() {
        /* Photo cycling: every 1.1s advance ONE card's image, round-robin
           across the view's cards — paused while hovering or fading */
        this.cycleTimer = window.setInterval(() => {
            if (this.state.hovered !== null || this.state.fading) return;
            const len = getItems(this.state.view, this.state.worksKind).length;
            // Nothing to cycle (and no modulo by zero) on an empty list
            if (len <= 0) return;
            this.setState((s) => {
                const imgIdx = s.imgIdx.slice();
                imgIdx[s.cycle % len] = (imgIdx[s.cycle % len] + 1) % 3;
                return { imgIdx, cycle: (s.cycle + 1) % len };
            });
        }, 1100);

        /* Carousel auto-advance: every 2.6s drift one card along. The row
           loops, so the offset just keeps counting — there is no rewind.
           Holds off while paused, hovered, fading, or right after a switch */
        this.carTimer = window.setInterval(() => {
            if (this.state.paused || this.state.hovered !== null || this.state.fading) return;
            if (this.lastSwitch && Date.now() - this.lastSwitch < 1400) return;
            if (!this.canScroll()) return;
            this.setState((s) => ({ offset: s.offset + 1 }));
        }, 2600);

        window.addEventListener('resize', this.handleResize);

        /* After the entrance settles, warm the cache with every image on
           the site so tab switches and photo cycles never pop in blank */
        this.preloadT = window.setTimeout(() => {
            const all = Array.from(
                new Set([...SKILLS, ...PASSIONS, ...VITAE, ...WORKS].flatMap((it) => it.images))
            );
            all.forEach((url, i) => {
                window.setTimeout(() => {
                    const load = () => {
                        const img = new Image();
                        img.src = url;
                    };
                    // Prefer idle time so we never contend with animation frames
                    if ('requestIdleCallback' in window) requestIdleCallback(load);
                    else load();
                }, i * 50);
            });
        }, 500);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
        window.clearInterval(this.cycleTimer);
        window.clearInterval(this.carTimer);
        window.clearInterval(this.quipTimer);
        window.clearTimeout(this.fadeT1);
        window.clearTimeout(this.preloadT);
    }

    /* The row only moves when there are more cards than fit in focus */
    private canScroll(): boolean {
        return getItems(this.state.view, this.state.worksKind).length > this.state.visible;
    }

    /* Re-derive geometry on resize. The offset needs no clamping — the row
       loops, and a list that fits ignores the offset altogether. */
    private handleResize = () => {
        this.setState(App.computeLayout());
    };

    /* ----------------------------------------------------------------------
     * Quip morph — scrambles the current quip into the target over 16
     * frames, revealing real characters left to right while the remainder
     * churns through random glyphs (spaces are preserved for shape).
     * -------------------------------------------------------------------- */
    private morphQuip(target: string) {
        window.clearInterval(this.quipTimer);
        const start = this.state.qText || '';
        let frame = 0;
        const total = 16;
        this.quipTimer = window.setInterval(() => {
            frame++;
            const p = frame / total;
            const len = Math.round(start.length + (target.length - start.length) * p);
            const reveal = Math.floor(p * target.length);
            let out = '';
            for (let i = 0; i < len; i++) {
                if (i < reveal) out += target[i] || '';
                else if (target[i] === ' ' || start[i] === ' ') out += ' ';
                else out += SCRAMBLE_CHARSET[Math.floor(Math.random() * SCRAMBLE_CHARSET.length)];
            }
            if (frame >= total) {
                out = target;
                window.clearInterval(this.quipTimer);
            }
            this.setState({ qText: out });
        }, 30);
    }

    /* ----------------------------------------------------------------------
     * Tab switch choreography: morph the quip, pre-warm the incoming view's
     * images, then hand over to the card swap. Works has a quip per half
     * (software / hardware), so it picks the one for the half on show.
     * -------------------------------------------------------------------- */
    private switchView = (id: ViewId) => {
        if (id === this.state.view) return;
        this.morphQuip(App.quipFor(id, this.state.worksKind));
        this.swapCards(id, this.state.worksKind);
    };

    /* ----------------------------------------------------------------------
     * Software / hardware toggle inside the split Works tab. Same swap as a
     * tab switch, and the quip morphs to the one written for that half.
     * -------------------------------------------------------------------- */
    private switchWorksKind = (kind: WorksKind) => {
        if (this.state.view !== 'works' || kind === this.state.worksKind) return;
        this.morphQuip(App.quipFor('works', kind));
        this.swapCards('works', kind);
    };

    /* The line shown under the tabs for a view. Falls back to the section's
       general quip if a half has none written. */
    private static quipFor(view: ViewId, worksKind: WorksKind): string {
        if (view === 'works') return WORKS_QUIPS[worksKind] || QUIPS.works;
        return QUIPS[view] || '';
    }

    /* ----------------------------------------------------------------------
     * Shared card swap: pre-warm the incoming list's images, let the cards
     * play their exit, then swap the content the instant they are gone —
     * which is also what starts the new set's entrance.
     * -------------------------------------------------------------------- */
    private swapCards(view: ViewId, worksKind: WorksKind) {
        // Preload the incoming list's images so cards never pop in blank
        getItems(view, worksKind).forEach((it) =>
            it.images.forEach((src) => {
                const im = new Image();
                im.src = src;
            })
        );

        this.lastSwitch = Date.now();
        window.clearTimeout(this.fadeT1);
        this.setState({ fading: true });
        // New content and the end of the exit land in ONE update: the carousel
        // starts the incoming cards' entrance on that very render, so a card
        // that mounts fresh never gets a frame of the outgoing animation.
        this.fadeT1 = window.setTimeout(() => {
            this.setState({ view, worksKind, hovered: null, offset: 0, cycle: 0, fading: false });
        }, SWAP_OUT_TOTAL_MS);
    }

    /* Move the row by a signed number of cards and dismiss any open detail
       panel. Used by the arrows (±1) and by clicking a soft-focus side card
       (however far it is from the in-focus group). */
    private shiftCards = (delta: number) => {
        if (!Number.isFinite(delta) || delta === 0 || !this.canScroll()) return;
        // Reset the auto-advance hold-off so it doesn't fire right on top of a manual move
        this.lastSwitch = Date.now();
        this.setState((s) => ({ offset: s.offset + Math.round(delta), hovered: null }));
    };

    private prevCard = () => this.shiftCards(-1);

    private nextCard = () => this.shiftCards(1);

    /* Lightbox plumbing — open at a photo, step with wrapping, close.
       `source` carries the caption and a way to find the clicked thumbnail
       on screen, which is what lets the photo fly out of it and back. */
    private openLightbox = (imgs: string[], idx: number, source?: LightboxSource) => {
        if (!Array.isArray(imgs) || imgs.length === 0) return;
        const safeIdx = Number.isInteger(idx) ? Math.max(0, Math.min(imgs.length - 1, idx)) : 0;
        this.setState({ lightbox: { imgs, idx: safeIdx, source: source || {} } });
    };

    private stepLightbox = (dir: number) => {
        this.setState((s) => {
            if (!s.lightbox || !Number.isFinite(dir)) return null;
            const len = s.lightbox.imgs.length;
            if (len <= 0) return null;
            // Double modulo so any signed step (not just ±1) wraps cleanly
            const next = (((s.lightbox.idx + Math.round(dir)) % len) + len) % len;
            return { lightbox: { ...s.lightbox, idx: next } };
        });
    };

    private closeLightbox = () => this.setState({ lightbox: null });

    render() {
        const {
            view,
            worksKind,
            hovered,
            imgIdx,
            offset,
            paused,
            fading,
            qText,
            lightbox,
            visible,
            cardWidth,
            tabWidth,
            viewportWidth,
        } = this.state;
        const items = getItems(view, worksKind);

        return (
            <>
                <GlobalStyles />
                <Page>
                    <Background
                        photoVisible={BG_MODE.includes('photo')}
                        gridVisible={BG_MODE.includes('grid')}
                        reticleVisible={SHOW_RETICLE}
                    />
                    <Content>
                        <Hero decodeAnim={DECODE_ANIM} />

                        <ViewTabs
                            view={view}
                            onSelect={this.switchView}
                            worksKind={worksKind}
                            onSelectWorksKind={this.switchWorksKind}
                            tabWidth={tabWidth}
                        />

                        <Quip>{qText}</Quip>

                        <Carousel
                            items={items}
                            imgIdx={imgIdx}
                            hovered={hovered}
                            offset={offset}
                            visible={visible}
                            cardWidth={cardWidth}
                            viewportWidth={viewportWidth}
                            fading={fading}
                            onCardEnter={(i) => this.setState({ hovered: i })}
                            onPanelLeave={() => this.setState({ hovered: null })}
                            onPrev={this.prevCard}
                            onNext={this.nextCard}
                            onShift={this.shiftCards}
                            onPauseChange={(p) => {
                                // Avoid redundant renders from repeated enter/leave
                                if (p !== paused) this.setState({ paused: p });
                            }}
                            onZoom={this.openLightbox}
                            zoomOpen={lightbox !== null}
                        />
                    </Content>
                </Page>

                {lightbox && (
                    <Lightbox
                        images={lightbox.imgs}
                        index={lightbox.idx}
                        title={lightbox.source.title}
                        rectOf={lightbox.source.rectOf}
                        onClose={this.closeLightbox}
                        onStep={this.stepLightbox}
                    />
                )}
            </>
        );
    }
}

export default App;
