import React from 'react';
import styled from 'styled-components';
import GlobalStyles from './styles/GlobalStyles';
import { Background } from './components/Background/Background';
import { Hero } from './components/Hero/Hero';
import { ViewTabs } from './components/ViewTabs/ViewTabs';
import { Carousel } from './components/Carousel/Carousel';
import { Lightbox } from './components/Lightbox/Lightbox';
import { riseIn, EASE_OUT, SCRAMBLE_CHARSET } from './styles/animations';
import { ViewId, QUIPS, getItems, SKILLS, PERSONAL, WORK, APPS } from './data/portfolio';

/**
 * ============================================================================
 * App — top-level state machine driving the whole page.
 *
 * Owns every piece of shared state: the active view, the carousel scroll
 * offset, the per-card image-cycle counters, the hovered card (detail
 * panel), the lightbox, and the scrambling quip text. Timers:
 *
 *   cycleTimer  (1100ms) — advances one card's photo at a time, round-robin
 *   carTimer    (1700ms) — auto-advances the carousel unless paused/hovered
 *   quipTimer   (30ms)   — runs the quip scramble morph during tab switches
 *   fadeT1/T2            — choreograph the 230ms out / 70ms in view fade
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
}

interface AppState extends LayoutMetrics {
    view: ViewId;
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
    lightbox: { imgs: string[]; idx: number } | null;
}

class App extends React.Component<{}, AppState> {
    /* Timer handles — window.* variants so TypeScript sees numbers */
    private cycleTimer = 0;
    private carTimer = 0;
    private quipTimer = 0;
    private fadeT1 = 0;
    private fadeT2 = 0;
    private preloadT = 0;

    /* Timestamp of the last tab switch — auto-advance holds off briefly */
    private lastSwitch = 0;

    state: AppState = {
        view: 'skills',
        hovered: null,
        imgIdx: [0, 0, 0, 0, 0, 0, 0, 0],
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
        if (vw >= 1408) return { visible: 4, cardWidth: CARD_W, tabWidth };
        if (vw >= 1080) return { visible: 3, cardWidth: CARD_W, tabWidth };
        if (vw >= 760) return { visible: 2, cardWidth: CARD_W, tabWidth };
        return { visible: 1, cardWidth: Math.min(CARD_W, vw - 72), tabWidth };
    }

    componentDidMount() {
        /* Photo cycling: every 1.1s advance ONE card's image, round-robin
           across the view's cards — paused while hovering or fading */
        this.cycleTimer = window.setInterval(() => {
            if (this.state.hovered !== null || this.state.fading) return;
            const len = getItems(this.state.view).length;
            this.setState((s) => {
                const imgIdx = s.imgIdx.slice();
                imgIdx[s.cycle % len] = (imgIdx[s.cycle % len] + 1) % 3;
                return { imgIdx, cycle: (s.cycle + 1) % len };
            });
        }, 1100);

        /* Carousel auto-advance: every 1.7s scroll one card, wrapping.
           Holds off while paused, hovered, fading, or right after a switch */
        this.carTimer = window.setInterval(() => {
            if (this.state.paused || this.state.hovered !== null || this.state.fading) return;
            if (this.lastSwitch && Date.now() - this.lastSwitch < 1400) return;
            const maxOff = this.maxOffset();
            if (maxOff === 0) return;
            this.setState((s) => ({ offset: (s.offset + 1) % (maxOff + 1) }));
        }, 1700);

        window.addEventListener('resize', this.handleResize);

        /* After the entrance settles, warm the cache with every image on
           the site so tab switches and photo cycles never pop in blank */
        this.preloadT = window.setTimeout(() => {
            const all = Array.from(
                new Set([...SKILLS, ...PERSONAL, ...WORK, ...APPS].flatMap((it) => it.images))
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
        window.clearTimeout(this.fadeT2);
        window.clearTimeout(this.preloadT);
    }

    /* Longest allowed scroll offset for the current view + viewport */
    private maxOffset(): number {
        return Math.max(0, getItems(this.state.view).length - this.state.visible);
    }

    /* Re-derive geometry on resize, clamping the offset into range */
    private handleResize = () => {
        const layout = App.computeLayout();
        this.setState((s) => ({
            ...layout,
            offset: Math.min(s.offset, Math.max(0, getItems(s.view).length - layout.visible)),
        }));
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
     * images, fade the row out (230ms), swap content, fade back in (70ms).
     * -------------------------------------------------------------------- */
    private switchView = (id: ViewId) => {
        if (id === this.state.view) return;
        this.morphQuip(QUIPS[id]);

        // Preload the incoming view's images so cards never pop in blank
        getItems(id).forEach((it) =>
            it.images.forEach((src) => {
                const im = new Image();
                im.src = src;
            })
        );

        this.lastSwitch = Date.now();
        window.clearTimeout(this.fadeT1);
        window.clearTimeout(this.fadeT2);
        this.setState({ fading: true });
        this.fadeT1 = window.setTimeout(() => {
            this.setState({ view: id, hovered: null, offset: 0, cycle: 0 });
            this.fadeT2 = window.setTimeout(() => this.setState({ fading: false }), 70);
        }, 230);
    };

    /* Manual arrows — wrap around and dismiss any open detail panel */
    private prevCard = () => {
        const maxOff = this.maxOffset();
        this.setState((s) => ({ offset: (s.offset + maxOff) % (maxOff + 1), hovered: null }));
    };

    private nextCard = () => {
        const maxOff = this.maxOffset();
        this.setState((s) => ({ offset: (s.offset + 1) % (maxOff + 1), hovered: null }));
    };

    /* Lightbox plumbing — open at a photo, step with wrapping, close */
    private openLightbox = (imgs: string[], idx: number) => {
        this.setState({ lightbox: { imgs, idx } });
    };

    private stepLightbox = (dir: number) => {
        this.setState((s) => {
            if (!s.lightbox) return null;
            const len = s.lightbox.imgs.length;
            return { lightbox: { imgs: s.lightbox.imgs, idx: (s.lightbox.idx + dir + len) % len } };
        });
    };

    private closeLightbox = () => this.setState({ lightbox: null });

    render() {
        const { view, hovered, imgIdx, offset, paused, fading, qText, lightbox, visible, cardWidth, tabWidth } = this.state;
        const items = getItems(view);

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

                        <ViewTabs view={view} onSelect={this.switchView} tabWidth={tabWidth} />

                        <Quip>{qText}</Quip>

                        <Carousel
                            items={items}
                            imgIdx={imgIdx}
                            hovered={hovered}
                            offset={offset}
                            visible={visible}
                            cardWidth={cardWidth}
                            fading={fading}
                            onCardEnter={(i) => this.setState({ hovered: i })}
                            onPanelLeave={() => this.setState({ hovered: null })}
                            onPrev={this.prevCard}
                            onNext={this.nextCard}
                            onPauseChange={(p) => {
                                // Avoid redundant renders from repeated enter/leave
                                if (p !== paused) this.setState({ paused: p });
                            }}
                            onZoom={this.openLightbox}
                        />
                    </Content>
                </Page>

                {lightbox && (
                    <Lightbox
                        images={lightbox.imgs}
                        index={lightbox.idx}
                        onClose={this.closeLightbox}
                        onStep={this.stepLightbox}
                    />
                )}
            </>
        );
    }
}

export default App;
