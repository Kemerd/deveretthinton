import React from 'react';
import styled, { keyframes } from 'styled-components';

/**
 * ============================================================================
 * Background — the fixed, non-interactive backdrop stack behind the page.
 *
 * Layer order (back to front):
 *   0. Looping hangar flythrough video (fills the frame, muted)
 *   1. Desaturated hangar photo — cross-fades to reveal the video, then
 *      fades back in to mask the video's loop seam
 *   2. Dark vertical gradient wash
 *   3. 56px blueprint grid (two crossed repeating gradients)
 *   4. Decorative reticle (slow-spinning ring, top right) + small crosshair
 *   5. Radial vignette pulling the edges down
 *
 * The photo/video cross-fade choreography lives in <PhotoBackdrop />; every
 * layer above the wash is unaffected and keeps the page perfectly readable
 * regardless of which backdrop is currently showing.
 * ============================================================================
 */

interface BackgroundProps {
    /** Show the photographic layer (bgMode contains "photo"). */
    photoVisible?: boolean;
    /** Show the blueprint grid layer (bgMode contains "grid"). */
    gridVisible?: boolean;
    /** Show the decorative reticle + crosshair pair. */
    reticleVisible?: boolean;
}

/* ----------------------------------------------------------------------------
 * Backdrop tuning constants
 *
 * FADE_LEAD_SECONDS — how long before the video ends we begin bringing the
 * photo back in. The photo must be fully opaque by the time the video wraps so
 * the viewer never sees the hard cut at the loop point.
 * -------------------------------------------------------------------------- */
const VIDEO_SRC = '/img/bg_fly.mp4';
const FADE_LEAD_SECONDS = 2;

/* One full revolution every 90 seconds — barely perceptible on purpose */
const slowSpin = keyframes`
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
`;

/* Fixed stack that sits behind all content and ignores the pointer */
const Stack = styled.div`
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
`;

/* Layer 0: the looping flythrough video, sat furthest back so the photo can
   cross-fade over the top of it. Shares the photo's colour grade so the two
   backdrops read as one continuous surface as they trade places. */
const Video = styled.video`
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: saturate(0.45) brightness(0.5) contrast(1.05);
`;

/* Layer 1: the photo, heavily desaturated and darkened.

   $mounted drives the master fade-in on first paint (0 → full). $revealVideo,
   once the video is playing, drops the photo the rest of the way to fully
   transparent so the live video shows through; flipping it back to false near
   the loop seam brings the photo home again. We animate opacity with a spring
   feel via a long ease so the swap is buttery, per Apple HIG. */
const Photo = styled.img<{ $mounted: boolean; $revealVideo: boolean }>`
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    /* Base grade is 0.5; hide entirely while the video is revealed */
    opacity: ${({ $mounted, $revealVideo }) => ($revealVideo ? 0 : $mounted ? 0.5 : 0)};
    filter: saturate(0.45) brightness(0.5) contrast(1.05);
    /* Slow, symmetric cross-fade in both directions */
    transition: opacity 1.4s cubic-bezier(0.4, 0, 0.2, 1);
    will-change: opacity;
`;

/* Layer 2: vertical gradient wash to keep text readable */
const Wash = styled.div`
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, rgba(10, 14, 18, 0.82) 0%, rgba(12, 16, 20, 0.72) 45%, rgba(10, 13, 17, 0.9) 100%);
`;

/* Layer 3: faint 56px engineering grid */
const Grid = styled.div`
    position: absolute;
    inset: 0;
    background-image:
        repeating-linear-gradient(0deg, rgba(168, 186, 201, 0.045) 0px, rgba(168, 186, 201, 0.045) 1px, transparent 1px, transparent 56px),
        repeating-linear-gradient(90deg, rgba(168, 186, 201, 0.045) 0px, rgba(168, 186, 201, 0.045) 1px, transparent 1px, transparent 56px);
`;

/* Layer 4a: the large reticle, partially off-canvas top right */
const Reticle = styled.div`
    position: absolute;
    top: 12%;
    right: -90px;
    width: 300px;
    height: 300px;
`;

/* Outer ring spins slowly; its top edge is brighter to read as motion */
const ReticleRing = styled.div`
    position: absolute;
    inset: 0;
    border: 1px solid rgba(168, 186, 201, 0.1);
    border-radius: 50%;
    animation: ${slowSpin} 90s linear infinite;
    border-top-color: rgba(168, 186, 201, 0.22);
`;

const ReticleInner = styled.div`
    position: absolute;
    inset: 40px;
    border: 1px solid rgba(168, 186, 201, 0.07);
    border-radius: 50%;
`;

/* Crosshair lines that extend slightly past the reticle circle */
const ReticleH = styled.div`
    position: absolute;
    top: 50%;
    left: -14px;
    right: -14px;
    height: 1px;
    background: rgba(168, 186, 201, 0.12);
`;

const ReticleV = styled.div`
    position: absolute;
    left: 50%;
    top: -14px;
    bottom: -14px;
    width: 1px;
    background: rgba(168, 186, 201, 0.12);
`;

/* Layer 4b: tiny lone crosshair near the bottom left */
const SmallCross = styled.div`
    position: absolute;
    bottom: 14%;
    left: 4%;
    width: 18px;
    height: 18px;
`;

const SmallCrossH = styled.div`
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: rgba(168, 186, 201, 0.28);
`;

const SmallCrossV = styled.div`
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    width: 1px;
    background: rgba(168, 186, 201, 0.28);
`;

/* Layer 5: radial vignette to focus the centre of the page */
const Vignette = styled.div`
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at center, transparent 55%, rgba(6, 9, 12, 0.55) 100%);
`;

export const Background: React.FC<BackgroundProps> = ({
    photoVisible = true,
    gridVisible = true,
    reticleVisible = true,
}) => {
    /* Handle to the underlying <video> so we can poll its playback clock. */
    const videoRef = React.useRef<HTMLVideoElement>(null);

    /* Drives the photo's first-paint fade-in (mirrors the old load behaviour). */
    const [mounted, setMounted] = React.useState(false);

    /* When true, the photo is fully transparent and the live video shows
       through. We toggle this in the timeupdate loop below. */
    const [revealVideo, setRevealVideo] = React.useState(false);

    /* ------------------------------------------------------------------
     * Fade the photo in on mount, then hand control to the video's clock:
     *   - As soon as the video can play we reveal it (photo → transparent).
     *   - FADE_LEAD_SECONDS before the end we bring the photo back so the
     *     loop's hard cut happens hidden behind an opaque photo.
     *   - When the video wraps to the top we reveal it again — repeating
     *     the cross-fade for every loop.
     * ------------------------------------------------------------------ */
    React.useEffect(() => {
        // Kick the master fade-in on the next frame so the transition runs.
        const raf = requestAnimationFrame(() => setMounted(true));

        const video = videoRef.current;
        if (!video) return () => cancelAnimationFrame(raf);

        // Reveal the video once there's enough buffered to play smoothly.
        const handleCanPlay = () => {
            video.play().catch(() => {
                /* Autoplay can be blocked; the photo simply stays put. */
            });
            setRevealVideo(true);
        };

        // Watch the clock: hide the video shortly before the seam, show it
        // again immediately after the loop restarts.
        const handleTimeUpdate = () => {
            if (!video.duration || Number.isNaN(video.duration)) return;
            const remaining = video.duration - video.currentTime;
            if (remaining <= FADE_LEAD_SECONDS) {
                // Approaching the loop point → mask it with the photo.
                setRevealVideo(false);
            } else {
                // Comfortably inside the clip → keep the video exposed.
                setRevealVideo(true);
            }
        };

        video.addEventListener('canplay', handleCanPlay);
        video.addEventListener('timeupdate', handleTimeUpdate);

        return () => {
            cancelAnimationFrame(raf);
            video.removeEventListener('canplay', handleCanPlay);
            video.removeEventListener('timeupdate', handleTimeUpdate);
        };
    }, []);

    return (
    <Stack>
        {photoVisible && (
            <>
                {/* Layer 0: looping flythrough, muted + inline for autoplay */}
                <Video
                    ref={videoRef}
                    src={VIDEO_SRC}
                    muted
                    loop
                    playsInline
                    preload="auto"
                    autoPlay
                    aria-hidden="true"
                />
                {/* Layer 1: photo that cross-fades over the video */}
                <Photo
                    src="/img/bg.jpg"
                    alt=""
                    $mounted={mounted}
                    $revealVideo={revealVideo}
                />
            </>
        )}
        <Wash />
        {gridVisible && <Grid />}
        {reticleVisible && (
            <>
                <Reticle>
                    <ReticleRing />
                    <ReticleInner />
                    <ReticleH />
                    <ReticleV />
                </Reticle>
                <SmallCross>
                    <SmallCrossH />
                    <SmallCrossV />
                </SmallCross>
            </>
        )}
        <Vignette />
    </Stack>
    );
};
