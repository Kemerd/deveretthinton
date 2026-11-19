import React, { useState } from 'react';
import styled from 'styled-components';
import { Corners } from '../Corners/Corners';
import { riseIn, EASE_OUT, EASE_SPRING } from '../../styles/animations';
import { HATCH, HATCH_LIT, DOT_GRID } from '../../styles/textures';
import { ViewId, VIEW_ORDER, WorksKind, WORKS_KINDS } from '../../data/portfolio';

/**
 * ============================================================================
 * ViewTabs — the segmented control that switches between the four sections.
 *
 * A translucent pill slides beneath the active tab. The pill's easing curve
 * is context-sensitive: it overshoots playfully between the middle tabs but
 * switches to a non-overshooting curve at the outer tabs so it never pokes
 * past the container edge.
 *
 * Surface treatment:
 *   - the track is hatched, with a brighter band of hatch that follows the
 *     pointer and rests on the active tab;
 *   - the hatch is physically cut away behind the pill (not painted over),
 *     so the pill stays true glass and shows the page behind it;
 *   - inside the pill sits a faint dot grid instead.
 *
 * Works is special: once it is the active tab its label gives way to two
 * icon halves (software / hardware) and the pill shrinks to half width and
 * slides between them.
 * ============================================================================
 */

interface ViewTabsProps {
    /** Currently active view. */
    view: ViewId;
    /** Called with the tapped view id (already-active taps are ignored). */
    onSelect: (view: ViewId) => void;
    /** Which half of Works is showing — only meaningful while view is works. */
    worksKind: WorksKind;
    /** Called with the tapped half of the split Works tab. */
    onSelectWorksKind: (kind: WorksKind) => void;
    /** Per-tab width in px — 150 on desktop, shrunk by App on small screens. */
    tabWidth?: number;
}

/* Overshooting spring for middle-tab travel */
const PILL_EASE_SPRING = 'cubic-bezier(0.3, 1.65, 0.5, 1)';

/* Softer curve for travel that ends at the first or last tab */
const PILL_EASE_EDGE = 'cubic-bezier(0.2, 0.9, 0.3, 1)';

/* One duration for the pill and for the hole in the hatch that tracks it —
   they must stay locked together or the strokes peek out mid-slide */
const PILL_DURATION = '0.38s';

/* Gap between the pill and the track edge, and between the two half-pills */
const PILL_INSET = 3;
const SPLIT_GAP = 3;

/* Flat stand-in for the dark track glass, used to knock patterns out from
   behind labels. Its fully transparent twin keeps the shadow list the same
   length so the two states can cross-fade. */
const TRACK_SOLID = 'rgb(15, 19, 24)';
const TRACK_CLEAR = 'rgba(15, 19, 24, 0)';

/**
 * Stacked zero-offset shadows in the surface colour. Layering several small
 * blurs gives a dense core that hugs each glyph and a soft ~3px falloff,
 * which erases the pattern right behind the text without drawing a box.
 */
const labelHalo = (surface: string): string =>
    `0 0 1px ${surface}, 0 0 2px ${surface}, 0 0 3px ${surface}, 0 0 3px ${surface}, 0 0 4px ${surface}`;

/* Width of the hatch spotlight, measured in tabs. Wider than one tab so the
   light spills onto the neighbours and fades out rather than ending hard. */
const GLOW_SPAN_TABS = 2.6;

/* Font Awesome glyph + spoken name for each half of the split Works tab */
const WORKS_META: Record<WorksKind, { icon: string; label: string }> = {
    software: { icon: 'fas fa-code', label: 'Software' },
    hardware: { icon: 'fas fa-microchip', label: 'Hardware' },
};

/* Centres the control below the hero */
const Wrap = styled.div`
    display: flex;
    justify-content: center;
    padding: 44px 0 8px;
    animation: ${riseIn} 0.7s ${EASE_OUT} 0.45s both;
`;

/* Frosted-glass track holding the four buttons and the pill */
const Track = styled.div`
    position: relative;
    display: inline-flex;
    border: 1px solid rgba(168, 186, 201, 0.2);
    background: rgba(13, 17, 22, 0.6);
    backdrop-filter: blur(20px) saturate(150%);
    -webkit-backdrop-filter: blur(20px) saturate(150%);
`;

/* The sheet of hatching over the track. A clip-path (set inline) punches a
   pill-shaped hole in it, so nothing at all is drawn behind the pill. The
   hole's corners are animated with the pill's own curve and duration. */
const HatchSheet = styled.div`
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    background: ${HATCH};
`;

/* A second, brighter copy of the hatch that only shows through a soft
   horizontal spotlight. The strokes themselves never move — only the mask
   slides — so the lit strokes stay registered with the faint ones beneath
   and the bar reads as one sheet of hatching with light passing over it.
   Lives inside HatchSheet, so it inherits the same hole. */
const HatchGlow = styled.div`
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: ${HATCH_LIT};
    -webkit-mask-image: linear-gradient(90deg, transparent 0%, #000 50%, transparent 100%);
    mask-image: linear-gradient(90deg, transparent 0%, #000 50%, transparent 100%);
    -webkit-mask-repeat: no-repeat;
    mask-repeat: no-repeat;
    transition: -webkit-mask-position 0.5s ${EASE_OUT}, mask-position 0.5s ${EASE_OUT};
`;

/* The sliding highlight. Geometry + easing arrive via inline style since
   they change with the active tab; everything static lives here. The fill
   is the original see-through steel tint with a faint dot grid on top. */
const Pill = styled.div`
    position: absolute;
    top: ${PILL_INSET}px;
    bottom: ${PILL_INSET}px;
    background: ${DOT_GRID}, rgba(190, 205, 218, 0.13);
    border: 1px solid rgba(190, 205, 218, 0.2);
    box-sizing: border-box;
    z-index: 0;
`;

const TabButton = styled.button<{ $active: boolean; $dissolved?: boolean }>`
    position: relative;
    z-index: 1;
    padding: 14px 0;
    border: none;
    cursor: pointer;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 12px;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    background: transparent;
    transition: color 0.2s ease, text-shadow 0.3s ease, opacity 0.22s ease, filter 0.3s ease,
        transform 0.35s ${EASE_SPRING};
    color: ${({ $active }) => ($active ? '#FFFFFF' : 'rgba(215, 226, 235, 0.55)')};
    /* Feathered knock-out behind the letters so no stroke runs through the
       text. The active label sits on the pill, where the hatch is already
       cut away, so its halo is fully transparent. */
    text-shadow: ${({ $active }) => labelHalo($active ? TRACK_CLEAR : TRACK_SOLID)};

    &:hover {
        color: #FFFFFF;
        transform: translateY(-1px);
    }

    &:active {
        transform: scale(0.9);
    }

    /* The Works label once the tab has split: it blurs and shrinks away to
       make room for the two icons, and stops taking input */
    ${({ $dissolved }) =>
        $dissolved &&
        `
        opacity: 0;
        filter: blur(5px);
        transform: scale(0.72);
        pointer-events: none;
    `}
`;

/* The Works slot: one tab's worth of width holding both the plain label and
   the two icon halves stacked on top of it */
const WorksSlot = styled.div`
    position: relative;
    z-index: 1;
    display: flex;
`;

/* Overlay row for the two halves — sits exactly over the label */
const Halves = styled.div`
    position: absolute;
    inset: 0;
    display: flex;
    pointer-events: none;
`;

/* One icon half. Closed, each half is tucked toward the centre seam and
   invisible; opening springs them apart, the right one a beat later. */
const HalfButton = styled.button<{ $open: boolean; $active: boolean; $side: 'left' | 'right' }>`
    flex: 1 1 0;
    min-width: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    border: none;
    cursor: pointer;
    background: transparent;
    font-size: 14px;
    color: ${({ $active }) => ($active ? '#FFFFFF' : 'rgba(215, 226, 235, 0.55)')};
    text-shadow: ${({ $active }) => labelHalo($active ? TRACK_CLEAR : TRACK_SOLID)};
    opacity: ${({ $open }) => ($open ? 1 : 0)};
    pointer-events: ${({ $open }) => ($open ? 'auto' : 'none')};
    transform: ${({ $open, $side }) =>
        $open ? 'translateX(0) scale(1)' : `translateX(${$side === 'left' ? 18 : -18}px) scale(0.35)`};
    transition: color 0.2s ease, text-shadow 0.3s ease,
        opacity 0.22s ease ${({ $open, $side }) => ($open ? ($side === 'left' ? '0.1s' : '0.16s') : '0s')},
        transform 0.5s ${EASE_SPRING} ${({ $open, $side }) => ($open ? ($side === 'left' ? '0.08s' : '0.14s') : '0s')};

    &:hover {
        color: #FFFFFF;
    }

    &:hover i {
        transform: translateY(-1px) scale(1.12);
    }

    &:active i {
        transform: scale(0.82);
    }

    i {
        transition: transform 0.35s ${EASE_SPRING};
    }
`;

/* Hairline that draws itself down the middle of the split tab */
const Seam = styled.div<{ $open: boolean }>`
    position: absolute;
    left: 50%;
    top: 50%;
    width: 1px;
    height: ${({ $open }) => ($open ? '42%' : '0%')};
    transform: translate(-50%, -50%);
    background: rgba(190, 205, 218, 0.3);
    pointer-events: none;
    transition: height 0.45s ${EASE_SPRING} ${({ $open }) => ($open ? '0.12s' : '0s')};
`;

export const ViewTabs: React.FC<ViewTabsProps> = ({ view, onSelect, worksKind, onSelectWorksKind, tabWidth = 150 }) => {
    // Horizontal centre (px from the track's left) of whatever the pointer or
    // keyboard focus is on; null when neither is over the bar
    const [hoverCenter, setHoverCenter] = useState<number | null>(null);

    // Guard every input the geometry below depends on, so a bad prop can
    // never leak NaN into an inline style
    const tw = Number.isFinite(tabWidth) && tabWidth > 0 ? tabWidth : 150;
    const viewIdx = Math.max(0, VIEW_ORDER.indexOf(view));
    const kind: WorksKind = worksKind === 'hardware' ? 'hardware' : 'software';
    const trackWidth = tw * VIEW_ORDER.length;
    const half = tw / 2;

    // Works splits in two only while it is the active tab
    const split = view === 'works';
    const slotLeft = viewIdx * tw;

    // Pill geometry: a full tab normally, one half of the tab when split
    const pillWidth = split ? half - PILL_INSET - SPLIT_GAP / 2 : tw - PILL_INSET * 2;
    const pillLeft = split && kind === 'hardware' ? slotLeft + half + SPLIT_GAP / 2 : slotLeft + PILL_INSET;
    const pillRight = pillLeft + pillWidth;

    // A pill that comes to rest against either end of the track gets the
    // non-overshooting curve so it never pokes past the edge
    const restsOnEdge = pillLeft <= PILL_INSET + 0.5 || pillRight >= trackWidth - PILL_INSET - 0.5;
    const pillEase = restsOnEdge ? PILL_EASE_EDGE : PILL_EASE_SPRING;

    // The hole in the hatch: outer rectangle, then the pill's rectangle wound
    // the same way, filled even-odd so the inner one is subtracted. Same
    // vertex count every time, so the browser can tween it.
    const holeTop = `${PILL_INSET}px`;
    const holeBottom = `calc(100% - ${PILL_INSET}px)`;
    const hatchClip =
        'polygon(evenodd, 0px 0px, 100% 0px, 100% 100%, 0px 100%, 0px 0px, ' +
        `${pillLeft}px ${holeTop}, ${pillRight}px ${holeTop}, ${pillRight}px ${holeBottom}, ` +
        `${pillLeft}px ${holeBottom}, ${pillLeft}px ${holeTop})`;

    // The hatch spotlight previews whatever is hovered, then settles back on
    // the pill
    const glowCenter = hoverCenter !== null ? hoverCenter : pillLeft + pillWidth / 2;
    const glowWidth = tw * GLOW_SPAN_TABS;
    const glowSize = `${glowWidth}px 100%`;
    const glowPosition = `${glowCenter - glowWidth / 2}px 0`;

    return (
        <Wrap>
            <Track onMouseLeave={() => setHoverCenter(null)}>
                <Corners />
                <HatchSheet
                    style={{
                        clipPath: hatchClip,
                        transition: `clip-path ${PILL_DURATION} ${pillEase}`,
                    }}
                >
                    <HatchGlow
                        style={{
                            WebkitMaskSize: glowSize,
                            maskSize: glowSize,
                            WebkitMaskPosition: glowPosition,
                            maskPosition: glowPosition,
                        }}
                    />
                </HatchSheet>
                <Pill
                    style={{
                        width: pillWidth,
                        left: pillLeft,
                        transition: `left ${PILL_DURATION} ${pillEase}, width ${PILL_DURATION} ${pillEase}`,
                    }}
                />
                {VIEW_ORDER.map((id, idx) => {
                    const tabCenter = idx * tw + half;
                    const label = id.charAt(0).toUpperCase() + id.slice(1);

                    // Every tab except Works is a plain label button
                    if (id !== 'works') {
                        return (
                            <TabButton
                                key={id}
                                $active={view === id}
                                style={{ width: tw }}
                                onClick={() => onSelect(id)}
                                onMouseEnter={() => setHoverCenter(tabCenter)}
                                onFocus={() => setHoverCenter(tabCenter)}
                                onBlur={() => setHoverCenter(null)}
                            >
                                {label}
                            </TabButton>
                        );
                    }

                    // Works: the label, plus the two halves that replace it
                    return (
                        <WorksSlot key={id} style={{ width: tw }}>
                            <TabButton
                                $active={false}
                                $dissolved={split}
                                style={{ width: tw }}
                                tabIndex={split ? -1 : 0}
                                aria-hidden={split}
                                onClick={() => onSelect(id)}
                                onMouseEnter={() => setHoverCenter(tabCenter)}
                                onFocus={() => setHoverCenter(tabCenter)}
                                onBlur={() => setHoverCenter(null)}
                            >
                                {label}
                            </TabButton>
                            <Halves aria-hidden={!split}>
                                <Seam $open={split} />
                                {WORKS_KINDS.map((k, kIdx) => {
                                    const meta = WORKS_META[k];
                                    if (!meta) return null;
                                    const halfCenter = idx * tw + half * (kIdx + 0.5);
                                    return (
                                        <HalfButton
                                            key={k}
                                            $open={split}
                                            $active={split && kind === k}
                                            $side={kIdx === 0 ? 'left' : 'right'}
                                            tabIndex={split ? 0 : -1}
                                            aria-label={`${meta.label} works`}
                                            aria-pressed={split && kind === k}
                                            title={meta.label}
                                            onClick={() => onSelectWorksKind(k)}
                                            onMouseEnter={() => setHoverCenter(halfCenter)}
                                            onFocus={() => setHoverCenter(halfCenter)}
                                            onBlur={() => setHoverCenter(null)}
                                        >
                                            <i className={meta.icon} />
                                        </HalfButton>
                                    );
                                })}
                            </Halves>
                        </WorksSlot>
                    );
                })}
            </Track>
        </Wrap>
    );
};
