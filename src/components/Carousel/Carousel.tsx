import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { LightboxRect, LightboxSource } from '../Lightbox/Lightbox';
import styled, { css, keyframes } from 'styled-components';
import { Corners } from '../Corners/Corners';
import { riseIn, panelIn, EASE_OUT, EASE_SPRING } from '../../styles/animations';
import { PortfolioItem } from '../../data/portfolio';

/**
 * ============================================================================
 * Carousel — the horizontally sliding card row plus its hover detail panel.
 *
 * Geometry (desktop): 302px cards, 24px gaps → a 326px step, 4 cards in
 * focus across 1280px. On smaller screens App shrinks `visible`/`cardWidth`
 * and everything here re-derives from those numbers.
 *
 * The row runs edge to edge: the in-focus group sits in the middle of the
 * window and the neighbouring cards carry on to both screen edges, each one
 * a step smaller, dimmer and softer than the last, like a shallow depth of
 * field. The row loops endlessly, and clicking a soft-focus card pulls it
 * into focus.
 *
 * Hovering a card swaps in a full-width detail panel over the row; leaving
 * the panel dismisses it. Each card crossfades between its three photos as
 * App advances the shared image-cycle counter.
 * ============================================================================
 */

/* Gap between cards — part of the 326px step the row slides by */
const GAP = 24;

/* Card height, and the breathing room above/below it on the stage so the
   card shadows and corner marks are never clipped */
const CARD_H = 340;
const STAGE_PAD = 8;

/* The slide: long and unhurried, with a small overshoot at the end so it
   still lands like a spring rather than just coasting to a stop */
const SLIDE_MS = 1050;
const EASE_FLOAT = 'cubic-bezier(0.22, 1.2, 0.36, 1)';

/* Prev/next button edge length */
const ARROW_SIZE = 40;

/* Detail panel timing: how long the pointer must rest on a card before the
   panel opens, how long it lingers after the pointer leaves, and how long
   its exit animation runs */
const HOVER_OPEN_MS = 160;
const HOVER_CLOSE_MS = 340;
const PANEL_OUT_MS = 200;

/* Panel entrance curve — a quick start with a very slight settle at the end */
const EASE_PANEL = 'cubic-bezier(0.2, 1.12, 0.32, 1)';

/* Section switch. The outgoing cards give a tiny pop, then fall away out of
   focus; the incoming set drops in from above and settles. App waits
   SWAP_OUT_TOTAL_MS (duration + the longest stagger, kept in step with the
   same figure there) before it swaps the content underneath. */
const SWAP_OUT_MS = 300;
const SWAP_IN_MS = 640;
const SWAP_OUT_STAGGER_MS = 16;
const SWAP_IN_STAGGER_MS = 46;

/* Only transform, opacity and a small blur are animated — all handled by the
   compositor on a few card-sized layers, for well under a second */
const swapOut = keyframes`
    0%   { opacity: 1; transform: translate3d(0, 0, 0) scale(1); filter: blur(0px) brightness(1); }
    22%  { opacity: 1; transform: translate3d(0, -5px, 0) scale(1.035); filter: blur(0px) brightness(1.06); }
    100% { opacity: 0; transform: translate3d(0, 84px, 0) scale(0.9); filter: blur(7px) brightness(1.15); }
`;

const swapIn = keyframes`
    0%   { opacity: 0; transform: translate3d(0, -64px, 0) scale(0.95); filter: blur(6px) brightness(1.12); }
    55%  { opacity: 1; filter: blur(0px) brightness(1); }
    100% { opacity: 1; transform: translate3d(0, 0, 0) scale(1); filter: blur(0px) brightness(1); }
`;

/* Panel exit: ease back a little and fade */
const panelOut = keyframes`
    from { opacity: 1; transform: scale(1); }
    to { opacity: 0; transform: scale(0.97); }
`;

/* Photo cross-fade duration inside a card */
const PHOTO_FADE_MS = 900;

/* Each card starts its slide a hair after its inner neighbour, which turns
   the row's movement into a soft ripple instead of one rigid block */
const RIPPLE_MS = 26;

/**
 * Depth of field, by how many places a card sits outside the in-focus group.
 * Fixed steps (not a continuous function of position) keep the blur work
 * small and predictable. The mild brightness/saturation lift is what sells
 * it as lens blur rather than fog: out-of-focus highlights bloom a little.
 */
const DEPTH = [
    { scale: 1, opacity: 1, blur: 0 },
    { scale: 0.955, opacity: 0.6, blur: 2.5 },
    { scale: 0.92, opacity: 0.36, blur: 5 },
    { scale: 0.89, opacity: 0.2, blur: 7 },
];

/* Crop anchor for one of an item's photos, if the data asks for one.
   Undefined leaves the browser's default centre crop in place. */
const focusOf = (item: PortfolioItem | null | undefined, k: number): string | undefined => {
    const focus = item && Array.isArray(item.imageFocus) ? item.imageFocus[k] : undefined;
    return typeof focus === 'string' && focus.length > 0 ? focus : undefined;
};

/* Positive modulo — JS's % keeps the sign of the left operand */
const mod = (n: number, m: number): number => (m > 0 ? ((n % m) + m) % m : 0);

interface CarouselProps {
    /** Cards for the active view. */
    items: PortfolioItem[];
    /** Per-card image indices, by item index (App cycles these over time). */
    imgIdx: number[];
    /** Item index of the hovered card, or null when the panel is closed. */
    hovered: number | null;
    /** How many cards the row has been advanced. Unbounded — the row loops. */
    offset: number;
    /** Cards in focus at once — 4 on desktop. */
    visible: number;
    /** Card width in px — 302 on desktop. */
    cardWidth: number;
    /** Window width in px — decides how many soft-focus cards flank the row. */
    viewportWidth: number;
    /** True while the view-switch fade is running. */
    fading: boolean;
    onCardEnter: (index: number) => void;
    onPanelLeave: () => void;
    onPrev: () => void;
    onNext: () => void;
    /** Advance the row by a signed number of cards (clicking a side card). */
    onShift: (delta: number) => void;
    onPauseChange: (paused: boolean) => void;
    /** Open the lightbox on a specific image of the hovered item. */
    onZoom: (images: string[], index: number, source?: LightboxSource) => void;
    /** True while the lightbox is open — the detail panel holds still under it. */
    zoomOpen: boolean;
}

const Outer = styled.div`
    position: relative;
    padding: 24px 0 0;
`;

/* Sized to the in-focus group and centred, so the arrows and the stage can
   both be placed from its middle. It no longer fades as a unit on a section
   switch — each card animates out and in on its own (see Swap). Keep it
   free of opacity/filter/mask: any of those would cut the cards' frosted
   glass off from the page behind. */
const FadeWrap = styled.div`
    position: relative;
    margin: 0 auto;
`;

/* Prev/next chevrons. Each one floats over the middle of the first
   soft-focus card beside the in-focus group — the card it will pull in —
   or as close to that as the window allows. With no room outside the group
   at all (single-card mobile layout) they tuck just inside its edges. */
const Arrow = styled.button`
    position: absolute;
    /* Horizontal position arrives inline, measured from the row's centre */
    top: ${STAGE_PAD + CARD_H / 2 - ARROW_SIZE / 2}px;
    width: ${ARROW_SIZE}px;
    height: ${ARROW_SIZE}px;
    margin-left: ${-ARROW_SIZE / 2}px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(16, 21, 27, 0.6);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(168, 186, 201, 0.3);
    color: rgba(220, 230, 238, 0.85);
    cursor: pointer;
    font-size: 13px;
    z-index: 5;
    transition: transform 0.35s ${EASE_SPRING}, background 0.2s ease, border-color 0.2s ease;

    &:hover {
        background: rgba(168, 186, 201, 0.16);
        border-color: rgba(210, 224, 234, 0.6);
        transform: scale(1.1);
    }

    &:active {
        transform: scale(0.85);
    }
`;

/* Full-bleed stage. It breaks out of the content column to span the whole
   window, and every card is placed on it absolutely, measured from its
   centre line. Pointer events are off here so the empty stretches never
   block anything; each slot switches them back on for itself.
   Deliberately no mask or filter on this element: either would cut the
   in-focus cards' frosted glass off from the page behind them. The row
   fades out toward the screen edges through the cards' own opacity. */
const Stage = styled.div`
    position: relative;
    left: 50%;
    width: 100vw;
    height: ${CARD_H + STAGE_PAD * 2}px;
    transform: translateX(-50%);
    pointer-events: none;
`;

/* One position on the stage. Only compositor-friendly properties move:
   transform and opacity do the travelling, and the soft-focus filter changes
   in a few fixed steps rather than continuously, so there is never more than
   a handful of small layers being re-blurred, and only while a slide is in
   flight. Everything position-dependent arrives inline. */
const Slot = styled.div`
    position: absolute;
    top: ${STAGE_PAD}px;
    left: 50%;
    /* transform only — hinting opacity here would isolate the slot and stop
       the in-focus card's backdrop blur from seeing the page */
    will-change: transform;
    transition: transform ${SLIDE_MS}ms ${EASE_FLOAT}, opacity ${Math.round(SLIDE_MS * 0.75)}ms ease,
        filter ${SLIDE_MS}ms ease;

    /* Respect a system-level request for less motion: no travel, no blur */
    @media (prefers-reduced-motion: reduce) {
        transition-duration: 1ms;
        filter: none !important;
    }
`;

/* Carries the section-switch animation for one card. It is a separate layer
   from Slot (which owns the card's place in the row) and from Card (which
   owns the first-paint entrance and the hover lift), so none of the three
   ever fights another for the transform. Idle, it has no animation at all —
   a lingering filter here would cut the card's frosted glass off from the
   page behind it. */
const Swap = styled.div<{ $phase: 'idle' | 'out' | 'in' }>`
    ${({ $phase }) =>
        $phase === 'out'
            ? css`
                  animation: ${swapOut} ${SWAP_OUT_MS}ms cubic-bezier(0.45, 0, 0.9, 0.55) both;
              `
            : $phase === 'in'
              ? css`
                    animation: ${swapIn} ${SWAP_IN_MS}ms ${EASE_FLOAT} both;
                `
              : ''}

    /* Less-motion preference: cut straight to the new set */
    @media (prefers-reduced-motion: reduce) {
        animation: none;
    }
`;

/* One frosted-glass card; staggered rise-in delay arrives inline. Only the
   in-focus cards pay for live backdrop blur — the soft-focus ones off to the
   sides are already blurred as a whole, so they get a plain fill instead. */
const Card = styled.div<{ $focus: boolean }>`
    position: relative;
    height: ${CARD_H}px;
    background: linear-gradient(160deg, rgba(210, 224, 234, 0.09) 0%, rgba(16, 21, 27, 0.48) 40%, rgba(16, 21, 27, 0.58) 100%);
    ${({ $focus }) =>
        $focus &&
        css`
            backdrop-filter: blur(18px) saturate(160%);
            -webkit-backdrop-filter: blur(18px) saturate(160%);
        `}
    border: 1px solid rgba(168, 186, 201, 0.16);
    box-shadow: 0 10px 34px rgba(0, 0, 0, 0.32);
    padding: 14px;
    box-sizing: border-box;
    cursor: pointer;
    transition: border-color 0.2s ease, transform 0.25s ${EASE_OUT};
    animation: ${riseIn} 0.6s ${EASE_OUT} both;

    &:hover {
        border-color: rgba(190, 205, 218, 0.45);
        transform: translateY(-2px);
    }
`;

/* Photo window inside the card — the three images stack and crossfade */
const CardImageBox = styled.div`
    position: relative;
    height: 238px;
    overflow: hidden;
    border: 1px solid rgba(168, 186, 201, 0.12);
    background: rgba(8, 11, 14, 0.6);
`;

/* The incoming photo fades in on top while the outgoing one stays fully
   opaque underneath, and only drops out once it is completely covered.
   (Fading both at once let the dark box show through halfway, which read as
   a flicker on every change.) */
const CardImage = styled.img<{ $visible: boolean }>`
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: ${({ $visible }) => ($visible ? 1 : 0)};
    opacity: ${({ $visible }) => ($visible ? 1 : 0)};
    transition: ${({ $visible }) => ($visible ? `opacity ${PHOTO_FADE_MS}ms ease` : `opacity 0s linear ${PHOTO_FADE_MS}ms`)};
`;

const CardMeta = styled.div`
    padding: 16px 4px 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
`;

const CardTitle = styled.h3`
    margin: 0;
    font-family: 'SF Pro Display', system-ui, sans-serif;
    font-size: 16px;
    font-weight: 500;
    letter-spacing: -0.2px;
    color: #EDF2F6;
`;

const CardYears = styled.span`
    font-family: 'IBM Plex Mono', monospace;
    font-size: 10.5px;
    letter-spacing: 1.8px;
    text-transform: uppercase;
    color: rgba(158, 178, 195, 0.7);
`;

/* Expanded detail panel that replaces the row while a card is hovered.
   $compact switches to a stacked layout for the single-card mobile view. */
const DetailPanel = styled.div<{ $compact: boolean; $closing: boolean }>`
    position: absolute;
    top: 32px;
    z-index: 10;
    box-sizing: border-box;
    background: linear-gradient(150deg, rgba(210, 224, 234, 0.1) 0%, rgba(11, 15, 20, 0.88) 38%, rgba(11, 15, 20, 0.92) 100%);
    box-shadow: 0 24px 70px rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(26px) saturate(150%);
    -webkit-backdrop-filter: blur(26px) saturate(150%);
    border: 1px solid rgba(190, 205, 218, 0.35);
    /* Grows out of the hovered card with a soft landing; on the way out it
       eases back a touch and fades, and stops taking the pointer at once so
       the row underneath is usable again straight away */
    ${({ $closing }) =>
        $closing
            ? css`
                  animation: ${panelOut} ${PANEL_OUT_MS}ms ease both;
                  pointer-events: none;
              `
            : css`
                  animation: ${panelIn} 0.36s ${EASE_PANEL} both;
              `}
    display: flex;
    gap: 24px;
    padding: 26px;

    ${({ $compact }) =>
        $compact
            ? css`
                  flex-direction: column;
                  height: auto;
              `
            : css`
                  height: 340px;
              `}
`;

/* Left column of the panel: crosshair, title, years, blurb, optional link */
const PanelInfo = styled.div<{ $compact: boolean }>`
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 14px;

    /* The text settles in line by line just behind the panel itself */
    & > * {
        animation: ${riseIn} 0.5s ${EASE_OUT} both;
    }
    & > *:nth-child(1) { animation-delay: 0.05s; }
    & > *:nth-child(2) { animation-delay: 0.09s; }
    & > *:nth-child(3) { animation-delay: 0.13s; }
    & > *:nth-child(4) { animation-delay: 0.17s; }
    & > *:nth-child(5) { animation-delay: 0.21s; }

    ${({ $compact }) =>
        $compact
            ? css`
                  padding: 4px;
              `
            : css`
                  flex: 0 0 400px;
                  padding: 8px 20px 8px 8px;
                  border-right: 1px solid rgba(168, 186, 201, 0.14);
              `}
`;

const PanelCross = styled.div`
    width: 18px;
    height: 18px;
    position: relative;
    margin-bottom: 2px;
`;

const PanelCrossH = styled.div`
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: rgba(168, 186, 201, 0.5);
`;

const PanelCrossV = styled.div`
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    width: 1px;
    background: rgba(168, 186, 201, 0.5);
`;

const PanelTitle = styled.h3`
    margin: 0;
    font-family: 'SF Pro Display', system-ui, sans-serif;
    font-size: 28px;
    font-weight: 700;
    letter-spacing: -0.4px;
    line-height: 1.15;
    color: #F2F6F9;
`;

const PanelYears = styled.span`
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: rgba(158, 178, 195, 0.8);
`;

const PanelDesc = styled.p`
    margin: 0;
    font-size: 14.5px;
    line-height: 1.65;
    color: rgba(226, 234, 240, 0.85);
`;

const PanelLink = styled.a`
    align-self: flex-start;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #BFD1DE;
    border-bottom: 1px solid rgba(168, 186, 201, 0.4);
    padding-bottom: 2px;
    transition: color 0.2s ease, border-color 0.2s ease;

    &:hover {
        color: #FFFFFF;
        border-color: rgba(255, 255, 255, 0.8);
    }
`;

/* Right side of the panel: the item's three photos, zoomable */
const PanelImages = styled.div<{ $compact: boolean }>`
    flex: 1;
    display: flex;
    gap: 16px;

    ${({ $compact }) =>
        $compact &&
        css`
            height: 140px;
        `}
`;

const PanelImageBox = styled.div`
    flex: 1 1 0;
    min-width: 0;
    position: relative;
    overflow: hidden;
    border: 1px solid rgba(168, 186, 201, 0.18);
    background: rgba(8, 11, 14, 0.6);
    cursor: zoom-in;
    /* Balloon: the photo under the pointer swells to more than twice its
       share of the row and its neighbours give way, on the same floaty
       spring as the cards. Three small boxes re-flowing is cheap, and it is
       limited to real pointers so a tap on a phone doesn't leave one stuck. */
    transition: flex-grow 0.62s ${EASE_FLOAT}, border-color 0.3s ease;

    @media (hover: hover) {
        &:hover {
            flex-grow: 2.3;
            border-color: rgba(190, 205, 218, 0.5);
        }

        /* The ones not being looked at step back a little */
        ${PanelImages}:hover &:not(:hover) img {
            opacity: 0.5;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        transition: none;
    }

    /* Photos follow the text in, one after another */
    animation: ${riseIn} 0.5s ${EASE_OUT} both;
    &:nth-child(1) { animation-delay: 0.1s; }
    &:nth-child(2) { animation-delay: 0.16s; }
    &:nth-child(3) { animation-delay: 0.22s; }

    img {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.6s ${EASE_OUT}, opacity 0.35s ease;
    }

    &:hover img {
        transform: scale(1.03);
    }
`;

export const Carousel: React.FC<CarouselProps> = ({
    items,
    imgIdx,
    hovered,
    offset,
    visible,
    cardWidth,
    viewportWidth,
    fading,
    onCardEnter,
    onPanelLeave,
    onPrev,
    onNext,
    onShift,
    onPauseChange,
    onZoom,
    zoomOpen,
}) => {
    /* The staggered rise-in is for the first paint only. Cards that mount
       later (new ones arriving at the far edges as the row loops) skip the
       delay, otherwise they would sit invisible for half a second. */
    const settledRef = useRef(false);
    useEffect(() => {
        const t = window.setTimeout(() => {
            settledRef.current = true;
        }, 1600);
        return () => window.clearTimeout(t);
    }, []);

    // All layout maths derive from the responsive inputs
    const len = items.length;
    const step = cardWidth + GAP;
    // A short list (fewer cards than fit) shrinks the row to its own width,
    // so it sits centred instead of leaving empty slots on the right
    const slots = Math.max(1, Math.min(visible, len));
    const containerW = slots * cardWidth + (slots - 1) * GAP;
    const compact = visible === 1;

    // The row loops endlessly once there are more cards than fit in focus;
    // a list that fits simply sits still, so its offset is ignored
    const loop = len > visible;
    const showArrows = loop;
    const base = loop && Number.isFinite(offset) ? Math.round(offset) : 0;

    /* Soft-focus cards flanking the in-focus group. Enough to reach both
       screen edges, but never so many that the same card would appear twice
       at once — the spare cards are split between the two sides. */
    const safeViewport = Number.isFinite(viewportWidth) && viewportWidth > 0 ? viewportWidth : containerW;
    const sideWanted = loop ? Math.max(0, Math.ceil((safeViewport - containerW) / 2 / step)) : 0;
    const spare = Math.max(0, len - slots);
    const sideLeft = Math.min(Math.floor(spare / 2), sideWanted);
    const sideRight = Math.min(spare - Math.floor(spare / 2), sideWanted);

    /* One extra, fully transparent place beyond each end. A card sliding off
       the end fades into it, and a new one fades in from it, so nothing ever
       pops in or out of existence mid-slide. */
    const firstPos = loop ? -sideLeft - 1 : 0;
    const lastPos = loop ? slots + sideRight : slots - 1;
    const positions: number[] = [];
    for (let p = firstPos; p <= lastPos; p++) positions.push(p);

    /* Arrow placement, as a distance from the row's centre line. Ideal spot:
       the middle of the first soft-focus card. Pulled inward if that would
       run off the window, and tucked inside the group's own edge when there
       is no room outside it at all. */
    const neighbourCentre = containerW / 2 + GAP + cardWidth / 2;
    const edgeLimit = safeViewport / 2 - ARROW_SIZE / 2 - 16;
    const justOutside = containerW / 2 + ARROW_SIZE / 2 + 6;
    const arrowReach =
        edgeLimit >= justOutside
            ? Math.min(neighbourCentre, edgeLimit)
            : Math.max(0, containerW / 2 - ARROW_SIZE / 2 - 2);

    // Currently hovered item (drives the detail panel)
    const h = hovered !== null ? items[hovered] || null : null;

    /* The panel scales out from the hovered card's on-screen position,
       clamped to the in-focus slots. */
    const panelOrigin =
        hovered !== null
            ? `${Math.max(0, Math.min(slots - 1, mod(hovered - base, len))) * step + cardWidth / 2}px 50%`
            : '50% 50%';

    /* ------------------------------------------------------------------
     * Detail panel manners.
     *   - Opening waits for a short dwell, so sweeping the pointer across
     *     the row doesn't throw a panel up under it. A click opens at once.
     *   - Closing waits a beat after the pointer leaves, and coming back in
     *     that time cancels it, so a small overshoot off the edge is forgiven.
     *   - The panel is kept mounted while it plays its exit, instead of
     *     blinking out of existence.
     * ---------------------------------------------------------------- */
    const openTimer = useRef(0);
    const closeTimer = useRef(0);

    // Never let a pending timer fire into an unmounted component
    useEffect(
        () => () => {
            window.clearTimeout(openTimer.current);
            window.clearTimeout(closeTimer.current);
        },
        []
    );

    const askOpen = (idx: number, immediate: boolean) => {
        window.clearTimeout(openTimer.current);
        window.clearTimeout(closeTimer.current);
        if (immediate) {
            onCardEnter(idx);
            return;
        }
        openTimer.current = window.setTimeout(() => onCardEnter(idx), HOVER_OPEN_MS);
    };

    const cancelOpen = () => window.clearTimeout(openTimer.current);

    /* While a photo is zoomed the panel must stay exactly where it is: the
       photo flies back into its thumbnail when the zoom closes. Kept in a
       ref so the handlers below always see the current value. */
    const zoomRef = useRef(zoomOpen);
    zoomRef.current = zoomOpen;

    const askClose = () => {
        if (zoomRef.current) return;
        window.clearTimeout(openTimer.current);
        window.clearTimeout(closeTimer.current);
        closeTimer.current = window.setTimeout(onPanelLeave, HOVER_CLOSE_MS);
    };

    const cancelClose = () => window.clearTimeout(closeTimer.current);

    /* When the zoom closes the pointer may be nowhere near the panel any
       more, and no leave event will ever arrive to say so. Give the browser
       a moment to work out what is under the pointer, then close the panel
       if it isn't being hovered. */
    const panelRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (zoomOpen) {
            window.clearTimeout(closeTimer.current);
            return;
        }
        const t = window.setTimeout(() => {
            const el = panelRef.current;
            if (el && !el.matches(':hover')) askClose();
        }, 180);
        return () => window.clearTimeout(t);
        // askClose only reads refs and the latest props, so zoomOpen is the one real trigger
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [zoomOpen]);

    /* Live on-screen rectangle of one of the panel's photo boxes. Handed to
       the lightbox so it knows where to fly from and back to; measured on
       demand because the boxes change size as they are hovered. */
    const imagesRef = useRef<HTMLDivElement>(null);
    const thumbRect = useCallback((i: number): LightboxRect | null => {
        const row = imagesRef.current;
        if (!row || !Number.isInteger(i) || i < 0) return null;
        const el = row.children[i];
        if (!el || !el.isConnected) return null;
        const r = el.getBoundingClientRect();
        if (!(r.width > 0) || !(r.height > 0)) return null;
        return { left: r.left, top: r.top, width: r.width, height: r.height };
    }, []);

    /* What the panel is actually showing. It trails the hovered item by the
       length of the exit animation: when the hover ends the last item stays
       on screen, flagged as closing, until the animation has played. */
    const [panel, setPanel] = useState<{ item: PortfolioItem; origin: string; closing: boolean } | null>(null);
    useEffect(() => {
        if (h) {
            setPanel({ item: h, origin: panelOrigin, closing: false });
            return;
        }
        setPanel((p) => (p ? { ...p, closing: true } : null));
        const t = window.setTimeout(() => setPanel(null), PANEL_OUT_MS);
        return () => window.clearTimeout(t);
    }, [h, panelOrigin]);

    /* Section-switch phase for the cards. While App is switching they play
       their exit; the moment the new content lands they play the entrance,
       and once that has finished the animation is removed altogether.
       A layout effect (not a plain effect) flips to "arriving" before the
       browser paints, so the new cards never flash at rest for a frame. */
    const [arriving, setArriving] = useState(false);
    const wasFading = useRef(fading);
    useLayoutEffect(() => {
        const justLanded = wasFading.current && !fading;
        wasFading.current = fading;
        if (!justLanded) return;
        setArriving(true);
        // Long enough for the last, most-delayed card to finish settling
        const t = window.setTimeout(() => setArriving(false), SWAP_IN_MS + SWAP_IN_STAGGER_MS * 6 + 80);
        return () => window.clearTimeout(t);
    }, [fading]);
    const phase: 'idle' | 'out' | 'in' = fading ? 'out' : arriving ? 'in' : 'idle';

    return (
        <Outer>
            <FadeWrap style={{ width: containerW + 16 }}>
                {showArrows && (
                    <>
                        <Arrow
                            style={{ left: `calc(50% - ${arrowReach}px)` }}
                            aria-label="Previous"
                            onClick={onPrev}
                            onMouseEnter={() => onPauseChange(true)}
                            onMouseLeave={() => onPauseChange(false)}
                        >
                            <i className="fas fa-chevron-left" />
                        </Arrow>
                        <Arrow
                            style={{ left: `calc(50% + ${arrowReach}px)` }}
                            aria-label="Next"
                            onClick={onNext}
                            onMouseEnter={() => onPauseChange(true)}
                            onMouseLeave={() => onPauseChange(false)}
                        >
                            <i className="fas fa-chevron-right" />
                        </Arrow>
                    </>
                )}

                <Stage>
                    {positions.map((pos) => {
                        // Absolute place in the endless row, and the item that lands there
                        const n = base + pos;
                        const idx = mod(n, len);
                        const item = items[idx];
                        if (!item) return null;

                        // How far outside the in-focus group this place sits (0 = in focus)
                        const inFocus = pos >= 0 && pos < slots;
                        const outside = pos < 0 ? -pos : pos >= slots ? pos - slots + 1 : 0;
                        const ghost = loop && (pos === firstPos || pos === lastPos);
                        const depth = DEPTH[Math.min(outside, DEPTH.length - 1)];

                        // Distance from the row's centre line, in px and in cards
                        const fromCentre = pos - (slots - 1) / 2;
                        const x = fromCentre * step;

                        // Photo index for this item — guarded, the counter array is App's
                        const photo = Number.isFinite(imgIdx[idx]) ? imgIdx[idx] % 3 : 0;

                        return (
                            /* Keyed by the absolute place, so a card keeps its DOM
                               node as it travels (that is what lets it animate) and
                               the nodes also survive view switches — content swaps
                               under the fade instead of replaying the entrance */
                            <Slot
                                key={n}
                                style={{
                                    width: cardWidth,
                                    marginLeft: -cardWidth / 2,
                                    transform: `translate3d(${x}px, 0, 0) scale(${depth.scale})`,
                                    opacity: ghost ? 0 : depth.opacity,
                                    filter:
                                        depth.blur > 0
                                            ? `blur(${depth.blur}px) brightness(1.1) saturate(1.18)`
                                            : 'none',
                                    transitionDelay: `${Math.round(Math.abs(fromCentre) * RIPPLE_MS)}ms`,
                                    pointerEvents: ghost ? 'none' : 'auto',
                                    zIndex: inFocus ? 2 : 1,
                                }}
                                onMouseEnter={() => onPauseChange(true)}
                                onMouseLeave={() => onPauseChange(false)}
                            >
                                <Swap
                                    $phase={phase}
                                    style={{
                                        // Ripple outward from the middle of the row
                                        animationDelay: `${Math.round(
                                            Math.abs(fromCentre) *
                                                (phase === 'out' ? SWAP_OUT_STAGGER_MS : SWAP_IN_STAGGER_MS)
                                        )}ms`,
                                    }}
                                >
                                <Card
                                    $focus={inFocus}
                                    aria-hidden={!inFocus}
                                    style={{
                                        animationDelay: settledRef.current
                                            ? '0s'
                                            : `${0.55 + Math.max(0, pos) * 0.055}s`,
                                    }}
                                    onMouseEnter={inFocus ? () => askOpen(idx, false) : undefined}
                                    onMouseLeave={inFocus ? cancelOpen : undefined}
                                    onClick={() => {
                                        // In focus: open the detail panel right away. Off to
                                        // the side: bring that card into focus instead.
                                        if (inFocus) askOpen(idx, true);
                                        else onShift(pos < 0 ? pos : pos - (slots - 1));
                                    }}
                                >
                                    {/* The corner marks poke out past the card's edges,
                                        so they show around an open detail panel —
                                        fade them away while one is up */}
                                    <Corners color="#AEBECB" opacity={h ? 0 : 0.55} />
                                    <CardImageBox>
                                        {item.images.map((src, k) => (
                                            <CardImage
                                                key={k}
                                                src={src}
                                                alt=""
                                                loading="lazy"
                                                $visible={photo === k}
                                                style={{ objectPosition: focusOf(item, k) }}
                                            />
                                        ))}
                                    </CardImageBox>
                                    <CardMeta>
                                        <CardTitle>{item.title}</CardTitle>
                                        <CardYears>{item.years}</CardYears>
                                    </CardMeta>
                                </Card>
                                </Swap>
                            </Slot>
                        );
                    })}
                </Stage>
            </FadeWrap>

            {panel && (
                <DetailPanel
                    ref={panelRef}
                    $compact={compact}
                    $closing={panel.closing}
                    onMouseEnter={cancelClose}
                    onMouseLeave={askClose}
                    style={{
                        left: `calc(50% - ${containerW / 2}px)`,
                        width: containerW,
                        transformOrigin: panel.origin,
                    }}
                >
                    <Corners color="#D8E2EC" />
                    <PanelInfo $compact={compact}>
                        <PanelCross>
                            <PanelCrossH />
                            <PanelCrossV />
                        </PanelCross>
                        <PanelTitle>{panel.item.title}</PanelTitle>
                        <PanelYears>{panel.item.years}</PanelYears>
                        <PanelDesc>{panel.item.desc}</PanelDesc>
                        {panel.item.link && (
                            <PanelLink href={panel.item.link} target="_blank" rel="noopener noreferrer">
                                Visit Site ↗
                            </PanelLink>
                        )}
                    </PanelInfo>
                    <PanelImages ref={imagesRef} $compact={compact}>
                        {panel.item.images.map((src, k) => (
                            <PanelImageBox
                                key={k}
                                onClick={() =>
                                    onZoom(panel.item.images, k, { title: panel.item.title, rectOf: thumbRect })
                                }
                            >
                                <img src={src} alt="" style={{ objectPosition: focusOf(panel.item, k) }} />
                            </PanelImageBox>
                        ))}
                    </PanelImages>
                </DetailPanel>
            )}
        </Outer>
    );
};
