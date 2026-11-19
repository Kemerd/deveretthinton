import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { Corners } from '../Corners/Corners';
import { fadeIn, EASE_OUT, EASE_SPRING } from '../../styles/animations';

/**
 * ============================================================================
 * Lightbox — fullscreen zoom view for the detail panel photos.
 *
 * The photo does not simply appear: it lifts out of the thumbnail that was
 * clicked, grows to full size, and on dismissal settles back into whichever
 * thumbnail matches the photo on screen at that moment. Both moves run on
 * transform + clip-path only, so the compositor does the work.
 *
 * Clicking the photo or the scrim (or pressing Escape) closes it; the
 * chevrons, the tick marks in the dock and the arrow keys step through the
 * item's photos.
 * ============================================================================
 */

/** A rectangle in viewport coordinates. */
export interface LightboxRect {
    left: number;
    top: number;
    width: number;
    height: number;
}

/** Where a zoom came from — lets the photo fly out of, and back to, its thumbnail. */
export interface LightboxSource {
    /** Caption shown in the dock (the item's title). */
    title?: string;
    /** Live on-screen rectangle of the thumbnail for image `index`, or null if it is gone. */
    rectOf?: (index: number) => LightboxRect | null;
}

interface LightboxProps extends LightboxSource {
    /** Image set being browsed. */
    images: string[];
    /** Index of the image currently shown. */
    index: number;
    onClose: () => void;
    /** Step forward (+n) or back (-n), wrapping at the ends. */
    onStep: (dir: number) => void;
}

/* Timings. The way in is floaty with a slight settle; the way out is brisk. */
const OPEN_MS = 560;
const CLOSE_MS = 320;
const EASE_FLY_IN = 'cubic-bezier(0.22, 1.16, 0.36, 1)';
const EASE_FLY_OUT = 'cubic-bezier(0.4, 0, 0.2, 1)';

/* The frame's corner marks and its drop shadow sit outside its box. Ending
   the clip well beyond the edges lets both grow in with the photo instead
   of popping on when the flight finishes. */
const CLIP_OPEN = 'inset(-140px -140px)';

const fadeOut = keyframes`
    from { opacity: 1; }
    to { opacity: 0; }
`;

/* A stepped-to photo slides in a short way from the side it came from */
const stepFromRight = keyframes`
    from { opacity: 0; transform: translate3d(34px, 0, 0) scale(0.985); }
    to { opacity: 1; transform: translate3d(0, 0, 0) scale(1); }
`;

const stepFromLeft = keyframes`
    from { opacity: 0; transform: translate3d(-34px, 0, 0) scale(0.985); }
    to { opacity: 1; transform: translate3d(0, 0, 0) scale(1); }
`;

/* The dock keeps its horizontal centring through its entrance */
const dockIn = keyframes`
    from { opacity: 0; transform: translate3d(-50%, 12px, 0); }
    to { opacity: 1; transform: translate3d(-50%, 0, 0); }
`;

/* Fullscreen layer. Centres the frame, leaving room for the dock below it.
   Clicking anywhere that isn't a control or the photo closes the view. */
const Root = styled.div`
    position: fixed;
    inset: 0;
    z-index: 100;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 56px 24px 92px;
    cursor: zoom-out;

    @media (max-width: 720px) {
        padding: 64px 16px 96px;
    }
`;

/* Blurred scrim, on its own layer so it can fade without taking the photo
   with it — the photo is busy flying to or from its thumbnail. */
const Backdrop = styled.div<{ $closing: boolean }>`
    position: absolute;
    inset: 0;
    background: rgba(8, 11, 15, 0.78);
    backdrop-filter: blur(22px) saturate(150%);
    -webkit-backdrop-filter: blur(22px) saturate(150%);
    animation: ${({ $closing }) =>
        $closing
            ? css`${fadeOut} ${CLOSE_MS}ms ease both`
            : css`${fadeIn} 0.32s ease both`};
`;

/* Shared styling for the round-trip controls. The entrance animates opacity
   only, which leaves transform free for the hover and press feedback. */
const ControlButton = styled.button<{ $closing: boolean }>`
    position: absolute;
    width: 42px;
    height: 42px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(16, 21, 27, 0.6);
    border: 1px solid rgba(168, 186, 201, 0.35);
    color: rgba(220, 230, 238, 0.9);
    font-size: 14px;
    cursor: pointer;
    z-index: 2;
    transition: transform 0.35s ${EASE_SPRING}, background 0.2s ease;
    animation: ${({ $closing }) =>
        $closing
            ? css`${fadeOut} 0.16s ease both`
            : css`${fadeIn} 0.4s ease 0.16s both`};

    &:hover {
        background: rgba(168, 186, 201, 0.18);
        transform: scale(1.08);
    }

    &:active {
        transform: scale(0.86);
    }
`;

/* Side chevrons on roomy screens; on narrow ones they drop to the bottom
   corners, level with the dock, so they never sit on top of the photo. */
const PrevButton = styled(ControlButton)`
    left: 28px;
    top: 50%;
    margin-top: -21px;

    @media (max-width: 720px) {
        left: 16px;
        top: auto;
        bottom: 24px;
        margin-top: 0;
    }
`;

const NextButton = styled(ControlButton)`
    right: 28px;
    top: 50%;
    margin-top: -21px;

    @media (max-width: 720px) {
        right: 16px;
        top: auto;
        bottom: 24px;
        margin-top: 0;
    }
`;

const CloseButton = styled(ControlButton)`
    top: 28px;
    right: 28px;
    font-size: 16px;

    @media (max-width: 720px) {
        top: 14px;
        right: 16px;
    }
`;

/* Bordered frame around the zoomed image, with corner marks. Hidden until
   the photo's size is known, so the flight starts from the right shape. */
const Frame = styled.div`
    position: relative;
    z-index: 1;
    padding: 10px;
    background: rgba(11, 15, 20, 0.8);
    border: 1px solid rgba(190, 205, 218, 0.4);
    box-shadow: 0 30px 90px rgba(0, 0, 0, 0.55);
    visibility: hidden;
    cursor: zoom-out;
    will-change: transform;
`;

/* The photo itself, letterboxed into the space the Root's padding leaves.
   $dir: 0 on first show (the frame's flight covers it), ±1 when stepped. */
const Zoomed = styled.img<{ $dir: number }>`
    display: block;
    max-width: min(calc(100vw - 180px), 1800px);
    max-height: calc(100vh - 170px);
    max-height: calc(100dvh - 170px);
    object-fit: contain;
    ${({ $dir }) =>
        $dir !== 0 &&
        css`
            animation: ${$dir > 0 ? stepFromRight : stepFromLeft} 0.46s ${EASE_OUT} both;
        `}

    @media (max-width: 720px) {
        max-width: calc(100vw - 54px);
        max-height: calc(100vh - 182px);
        max-height: calc(100dvh - 182px);
    }

    @media (prefers-reduced-motion: reduce) {
        animation: none;
    }
`;

/* Caption + position, centred under the photo */
const Dock = styled.div<{ $closing: boolean }>`
    position: absolute;
    left: 50%;
    bottom: 26px;
    z-index: 2;
    display: flex;
    align-items: center;
    gap: 16px;
    max-width: calc(100vw - 150px);
    padding: 9px 16px;
    box-sizing: border-box;
    background: rgba(16, 21, 27, 0.6);
    border: 1px solid rgba(168, 186, 201, 0.28);
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    letter-spacing: 1.6px;
    text-transform: uppercase;
    color: rgba(220, 230, 238, 0.86);
    cursor: default;
    transform: translate3d(-50%, 0, 0);
    animation: ${({ $closing }) =>
        $closing
            ? css`${fadeOut} 0.16s ease both`
            : css`${dockIn} 0.55s ${EASE_OUT} 0.14s both`};
`;

const DockTitle = styled.span`
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const DockCount = styled.span`
    flex: none;
    color: rgba(168, 186, 201, 0.75);
`;

const Ticks = styled.span`
    flex: none;
    display: flex;
    align-items: center;
    gap: 5px;
`;

/* One tick per photo. The bar itself is 2px tall; the padding around it is
   the real hit area, so it is still comfortable to press. */
const Tick = styled.button<{ $active: boolean }>`
    padding: 9px 0;
    background: none;
    border: 0;
    cursor: pointer;

    &::before {
        content: '';
        display: block;
        height: 2px;
        width: ${({ $active }) => ($active ? 26 : 12)}px;
        background: ${({ $active }) => ($active ? 'rgba(220, 230, 238, 0.95)' : 'rgba(168, 186, 201, 0.38)')};
        transition: width 0.45s ${EASE_SPRING}, background 0.25s ease;
    }

    &:hover::before {
        background: rgba(220, 230, 238, 0.8);
    }
`;

/* Two digits, so the counter doesn't change width as it steps */
const pad2 = (n: number): string => (n < 10 ? `0${n}` : `${n}`);

/* True when the visitor has asked the system for less motion */
const prefersReducedMotion = (): boolean =>
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Works out the transform + clip that make `frame` sit exactly over `thumb`:
 * scaled so it covers the thumbnail (as the thumbnail's own cropped photo
 * does) and clipped down to the thumbnail's outline. Returns null when
 * either rectangle is unusable.
 */
const flightTo = (frame: DOMRect, thumb: LightboxRect | null): { transform: string; clipPath: string } | null => {
    if (!thumb || !(thumb.width > 0) || !(thumb.height > 0)) return null;
    if (!(frame.width > 0) || !(frame.height > 0)) return null;

    // Uniform scale — the photo is never squashed, only cropped by the clip
    const scale = Math.max(thumb.width / frame.width, thumb.height / frame.height);
    if (!Number.isFinite(scale) || scale <= 0) return null;

    // Centre-to-centre travel
    const dx = thumb.left + thumb.width / 2 - (frame.left + frame.width / 2);
    const dy = thumb.top + thumb.height / 2 - (frame.top + frame.height / 2);

    // How much to trim off each side, in the frame's own unscaled pixels
    const clipX = Math.max(0, (frame.width - thumb.width / scale) / 2);
    const clipY = Math.max(0, (frame.height - thumb.height / scale) / 2);

    return {
        transform: `translate3d(${dx}px, ${dy}px, 0) scale(${scale})`,
        clipPath: `inset(${clipY}px ${clipX}px)`,
    };
};

export const Lightbox: React.FC<LightboxProps> = ({ images, index, title, rectOf, onClose, onStep }) => {
    const frameRef = useRef<HTMLDivElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);
    const closeRef = useRef<HTMLButtonElement>(null);

    // Guards so the entrance runs once and a second close request is ignored
    const flownRef = useRef(false);
    const closingRef = useRef(false);
    const closeTimer = useRef(0);
    const [closing, setClosing] = useState(false);

    // Which way the last step went: 0 until the first step, then ±1
    const dirRef = useRef(0);

    const count = images.length;
    const safeIndex = count > 0 ? Math.max(0, Math.min(count - 1, index)) : 0;

    /* ------------------------------------------------------------------
     * Entrance. Runs as soon as the photo's size is known — straight away
     * for a cached photo, otherwise from the image's load event.
     * ---------------------------------------------------------------- */
    const flyIn = useCallback(() => {
        const frame = frameRef.current;
        const img = imgRef.current;
        if (flownRef.current || !frame || !img) return;
        // No dimensions yet: the load handler will call back in
        if (!img.complete || !(img.naturalWidth > 0)) return;
        flownRef.current = true;
        frame.style.visibility = 'visible';

        // Older engines without the animation API simply show the photo
        if (typeof frame.animate !== 'function') return;

        const from = prefersReducedMotion()
            ? null
            : flightTo(frame.getBoundingClientRect(), rectOf ? rectOf(safeIndex) : null);

        if (from) {
            // Lift out of the thumbnail and grow into place
            frame.animate(
                [
                    { transform: from.transform, clipPath: from.clipPath },
                    { transform: 'translate3d(0, 0, 0) scale(1)', clipPath: CLIP_OPEN },
                ],
                { duration: OPEN_MS, easing: EASE_FLY_IN }
            );
        } else {
            // No thumbnail to come from (or less motion wanted): a soft fade up
            frame.animate(
                [
                    { opacity: 0, transform: 'scale(0.96)' },
                    { opacity: 1, transform: 'scale(1)' },
                ],
                { duration: 280, easing: 'ease-out' }
            );
        }
    }, [rectOf, safeIndex]);

    // Before first paint, so a cached photo never flashes at full size first
    useLayoutEffect(() => {
        flyIn();
    }, [flyIn]);

    /* ------------------------------------------------------------------
     * Exit. Plays the flight back to the thumbnail, then tells App to
     * unmount us. A timer (not the animation's finish event) ends it, so
     * the view can never get stuck open.
     * ---------------------------------------------------------------- */
    const requestClose = useCallback(() => {
        if (closingRef.current) return;
        closingRef.current = true;
        setClosing(true);

        const frame = frameRef.current;
        if (frame && typeof frame.animate === 'function') {
            const to = prefersReducedMotion()
                ? null
                : flightTo(frame.getBoundingClientRect(), rectOf ? rectOf(safeIndex) : null);

            if (to) {
                // Shrink back into the thumbnail, dissolving over the last stretch
                frame.animate(
                    [
                        { transform: 'translate3d(0, 0, 0) scale(1)', clipPath: CLIP_OPEN, opacity: 1 },
                        { opacity: 1, offset: 0.62 },
                        { transform: to.transform, clipPath: to.clipPath, opacity: 0 },
                    ],
                    { duration: CLOSE_MS, easing: EASE_FLY_OUT, fill: 'forwards' }
                );
            } else {
                frame.animate(
                    [
                        { opacity: 1, transform: 'scale(1)' },
                        { opacity: 0, transform: 'scale(0.96)' },
                    ],
                    { duration: CLOSE_MS, easing: 'ease', fill: 'forwards' }
                );
            }
        }

        closeTimer.current = window.setTimeout(onClose, CLOSE_MS);
    }, [onClose, rectOf, safeIndex]);

    // A pending close must not fire into an unmounted component
    useEffect(() => () => window.clearTimeout(closeTimer.current), []);

    /* Stepping remembers its direction so the next photo slides in from the
       matching side. Ignored once the view is on its way out. */
    const step = useCallback(
        (dir: number) => {
            if (closingRef.current || count < 2 || !Number.isFinite(dir) || dir === 0) return;
            dirRef.current = dir > 0 ? 1 : -1;
            onStep(dir);
        },
        [count, onStep]
    );

    /* Keyboard driving: Escape closes, arrows step. Bound only while open
       since this component unmounts with the lightbox. */
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') requestClose();
            if (e.key === 'ArrowLeft') step(-1);
            if (e.key === 'ArrowRight') step(1);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [requestClose, step]);

    /* Move keyboard focus into the dialog while it is open, and hand it back
       to whatever had it once the view closes. */
    useEffect(() => {
        const previous = document.activeElement as HTMLElement | null;
        if (closeRef.current) closeRef.current.focus({ preventScroll: true });
        return () => {
            if (previous && typeof previous.focus === 'function' && previous.isConnected) {
                previous.focus({ preventScroll: true });
            }
        };
    }, []);

    // Nothing to show — bail rather than render a broken frame
    if (count === 0) return null;

    // Controls swallow their own clicks so they never reach the scrim
    const stop = (e: React.MouseEvent) => e.stopPropagation();

    return (
        <Root role="dialog" aria-modal="true" aria-label={title ? `${title} photos` : 'Photos'} onClick={requestClose}>
            <Backdrop $closing={closing} />

            {count > 1 && (
                <>
                    <PrevButton
                        $closing={closing}
                        aria-label="Previous image"
                        onClick={(e) => {
                            stop(e);
                            step(-1);
                        }}
                    >
                        <i className="fas fa-chevron-left" />
                    </PrevButton>
                    <NextButton
                        $closing={closing}
                        aria-label="Next image"
                        onClick={(e) => {
                            stop(e);
                            step(1);
                        }}
                    >
                        <i className="fas fa-chevron-right" />
                    </NextButton>
                </>
            )}

            <CloseButton
                ref={closeRef}
                $closing={closing}
                aria-label="Close"
                onClick={(e) => {
                    stop(e);
                    requestClose();
                }}
            >
                <i className="fas fa-xmark" />
            </CloseButton>

            {/* Clicking the zoomed photo un-zooms it, same as clicking the scrim.
                The click is still stopped here so it only ever closes once. */}
            <Frame
                ref={frameRef}
                onClick={(e) => {
                    stop(e);
                    requestClose();
                }}
            >
                <Corners color="#D8E2EC" />
                {/* Re-keyed per photo so each one plays its own slide-in */}
                <Zoomed
                    key={safeIndex}
                    ref={imgRef}
                    src={images[safeIndex]}
                    alt={title ? `${title}, photo ${safeIndex + 1} of ${count}` : ''}
                    $dir={dirRef.current}
                    onLoad={flyIn}
                    draggable={false}
                />
            </Frame>

            <Dock $closing={closing} onClick={stop}>
                {title && <DockTitle>{title}</DockTitle>}
                {count > 1 && (
                    <Ticks>
                        {images.map((_, k) => (
                            <Tick
                                key={k}
                                $active={k === safeIndex}
                                aria-label={`Show photo ${k + 1}`}
                                aria-current={k === safeIndex}
                                onClick={() => step(k - safeIndex)}
                            />
                        ))}
                    </Ticks>
                )}
                <DockCount>
                    {pad2(safeIndex + 1)} / {pad2(count)}
                </DockCount>
            </Dock>
        </Root>
    );
};
