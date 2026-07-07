import React from 'react';
import styled, { css } from 'styled-components';
import { Corners } from '../Corners/Corners';
import { riseIn, panelIn, EASE_OUT, EASE_SPRING } from '../../styles/animations';
import { PortfolioItem } from '../../data/portfolio';

/**
 * ============================================================================
 * Carousel — the horizontally sliding card row plus its hover detail panel.
 *
 * Geometry (desktop): 302px cards, 24px gaps → a 326px step, 4 cards in a
 * 1280px viewport with 8px breathing room on each side (1296px total).
 * On smaller screens App shrinks `visible`/`cardWidth` and everything here
 * re-derives from those two numbers, so the desktop layout stays exact.
 *
 * Hovering a card swaps in a full-width detail panel over the row; leaving
 * the panel dismisses it. Each card crossfades between its three photos as
 * App advances the shared image-cycle counter.
 * ============================================================================
 */

/* Gap between cards — part of the 326px step the track slides by */
const GAP = 24;

interface CarouselProps {
    /** Cards for the active view. */
    items: PortfolioItem[];
    /** Per-card-slot image indices (App cycles these over time). */
    imgIdx: number[];
    /** Index of the hovered card, or null when the panel is closed. */
    hovered: number | null;
    /** How many card-widths the track has been advanced. */
    offset: number;
    /** Cards visible at once — 4 on desktop. */
    visible: number;
    /** Card width in px — 302 on desktop. */
    cardWidth: number;
    /** True while the view-switch fade is running. */
    fading: boolean;
    onCardEnter: (index: number) => void;
    onPanelLeave: () => void;
    onPrev: () => void;
    onNext: () => void;
    onPauseChange: (paused: boolean) => void;
    /** Open the lightbox on a specific image of the hovered item. */
    onZoom: (images: string[], index: number) => void;
}

const Outer = styled.div`
    position: relative;
    padding: 24px 0 0;
`;

/* Fades/slides as a unit during view switches (the panel is NOT inside,
   matching the design — it lives on the Outer so it never double-fades) */
const FadeWrap = styled.div`
    position: relative;
    margin: 0 auto;
    transition: opacity 0.22s ease, transform 0.22s ${EASE_OUT};
`;

/* Prev/next chevrons. Sit outside the row on desktop; tucked inside when
   there is no spare viewport width (single-card mobile layout). */
const Arrow = styled.button<{ $side: 'left' | 'right'; $inset: boolean }>`
    position: absolute;
    ${({ $side, $inset }) => ($side === 'left' ? `left: ${$inset ? '2px' : '-54px'};` : `right: ${$inset ? '2px' : '-54px'};`)}
    top: 158px;
    width: 40px;
    height: 40px;
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

/* Clips the sliding track; the 8px padding keeps card shadows visible */
const Viewport = styled.div`
    overflow: hidden;
    padding: 8px;
    box-sizing: content-box;
`;

/* The row of cards — slides horizontally via inline translateX */
const TrackRow = styled.div`
    display: flex;
    gap: ${GAP}px;
    transition: transform 0.55s cubic-bezier(0.25, 1.25, 0.35, 1);
`;

/* One frosted-glass card; staggered rise-in delay arrives inline */
const Card = styled.div`
    position: relative;
    height: 340px;
    background: linear-gradient(160deg, rgba(210, 224, 234, 0.09) 0%, rgba(16, 21, 27, 0.48) 40%, rgba(16, 21, 27, 0.58) 100%);
    backdrop-filter: blur(18px) saturate(160%);
    -webkit-backdrop-filter: blur(18px) saturate(160%);
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

const CardImage = styled.img<{ $visible: boolean }>`
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: opacity 0.7s ease;
    opacity: ${({ $visible }) => ($visible ? 1 : 0)};
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
const DetailPanel = styled.div<{ $compact: boolean }>`
    position: absolute;
    top: 32px;
    z-index: 10;
    box-sizing: border-box;
    background: linear-gradient(150deg, rgba(210, 224, 234, 0.1) 0%, rgba(11, 15, 20, 0.88) 38%, rgba(11, 15, 20, 0.92) 100%);
    box-shadow: 0 24px 70px rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(26px) saturate(150%);
    -webkit-backdrop-filter: blur(26px) saturate(150%);
    border: 1px solid rgba(190, 205, 218, 0.35);
    animation: ${panelIn} 0.22s ${EASE_OUT} both;
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
    flex: 1;
    position: relative;
    overflow: hidden;
    border: 1px solid rgba(168, 186, 201, 0.18);
    background: rgba(8, 11, 14, 0.6);
    cursor: zoom-in;

    img {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.6s ${EASE_OUT};
    }

    &:hover img {
        transform: scale(1.06);
    }
`;

export const Carousel: React.FC<CarouselProps> = ({
    items,
    imgIdx,
    hovered,
    offset,
    visible,
    cardWidth,
    fading,
    onCardEnter,
    onPanelLeave,
    onPrev,
    onNext,
    onPauseChange,
    onZoom,
}) => {
    // All layout maths derive from the two responsive inputs
    const step = cardWidth + GAP;
    const containerW = visible * cardWidth + (visible - 1) * GAP;
    const compact = visible === 1;

    // Arrows only appear when there are more cards than fit on screen
    const showArrows = items.length > visible;

    // Currently hovered item (drives the detail panel)
    const h = hovered !== null ? items[hovered] : null;

    /* The panel scales out from the hovered card's on-screen position,
       clamped to the visible slots — same maths as the design source. */
    const panelOrigin =
        hovered !== null
            ? `${Math.max(0, Math.min(visible - 1, hovered - offset)) * step + cardWidth / 2}px 50%`
            : '50% 50%';

    return (
        <Outer>
            <FadeWrap
                style={{
                    width: containerW + 16,
                    opacity: fading ? 0 : 1,
                    transform: `translateY(${fading ? 12 : 0}px)`,
                }}
            >
                {showArrows && (
                    <>
                        <Arrow
                            $side="left"
                            $inset={compact}
                            aria-label="Previous"
                            onClick={onPrev}
                            onMouseEnter={() => onPauseChange(true)}
                            onMouseLeave={() => onPauseChange(false)}
                        >
                            <i className="fas fa-chevron-left" />
                        </Arrow>
                        <Arrow
                            $side="right"
                            $inset={compact}
                            aria-label="Next"
                            onClick={onNext}
                            onMouseEnter={() => onPauseChange(true)}
                            onMouseLeave={() => onPauseChange(false)}
                        >
                            <i className="fas fa-chevron-right" />
                        </Arrow>
                    </>
                )}

                <Viewport
                    style={{ width: containerW }}
                    onMouseEnter={() => onPauseChange(true)}
                    onMouseLeave={() => onPauseChange(false)}
                >
                    <TrackRow style={{ transform: `translateX(-${offset * step}px)` }}>
                        {items.map((item, i) => (
                            /* Keyed by slot index so the DOM survives view
                               switches — content swaps under the fade instead
                               of replaying the entrance stagger */
                            <Card
                                key={i}
                                style={{
                                    flex: `0 0 ${cardWidth}px`,
                                    animationDelay: `${0.55 + i * 0.055}s`,
                                }}
                                onMouseEnter={() => onCardEnter(i)}
                                onClick={() => onCardEnter(i)}
                            >
                                <Corners color="#AEBECB" opacity={0.55} />
                                <CardImageBox>
                                    {item.images.map((src, k) => (
                                        <CardImage
                                            key={k}
                                            src={src}
                                            alt=""
                                            loading="lazy"
                                            $visible={imgIdx[i] % 3 === k}
                                        />
                                    ))}
                                </CardImageBox>
                                <CardMeta>
                                    <CardTitle>{item.title}</CardTitle>
                                    <CardYears>{item.years}</CardYears>
                                </CardMeta>
                            </Card>
                        ))}
                    </TrackRow>
                </Viewport>
            </FadeWrap>

            {h && (
                <DetailPanel
                    $compact={compact}
                    onMouseLeave={onPanelLeave}
                    style={{
                        left: `calc(50% - ${containerW / 2}px)`,
                        width: containerW,
                        transformOrigin: panelOrigin,
                    }}
                >
                    <Corners color="#D8E2EC" />
                    <PanelInfo $compact={compact}>
                        <PanelCross>
                            <PanelCrossH />
                            <PanelCrossV />
                        </PanelCross>
                        <PanelTitle>{h.title}</PanelTitle>
                        <PanelYears>{h.years}</PanelYears>
                        <PanelDesc>{h.desc}</PanelDesc>
                        {h.link && (
                            <PanelLink href={h.link} target="_blank" rel="noopener noreferrer">
                                Visit Site ↗
                            </PanelLink>
                        )}
                    </PanelInfo>
                    <PanelImages $compact={compact}>
                        {h.images.map((src, k) => (
                            <PanelImageBox key={k} onClick={() => onZoom(h.images, k)}>
                                <img src={src} alt="" />
                            </PanelImageBox>
                        ))}
                    </PanelImages>
                </DetailPanel>
            )}
        </Outer>
    );
};
