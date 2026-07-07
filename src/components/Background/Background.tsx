import React from 'react';
import styled, { keyframes } from 'styled-components';

/**
 * ============================================================================
 * Background — the fixed, non-interactive backdrop stack behind the page.
 *
 * Layer order (back to front):
 *   1. Desaturated hangar photo
 *   2. Dark vertical gradient wash
 *   3. 56px blueprint grid (two crossed repeating gradients)
 *   4. Decorative reticle (slow-spinning ring, top right) + small crosshair
 *   5. Radial vignette pulling the edges down
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

/* Layer 1: the photo, heavily desaturated and darkened */
const Photo = styled.img`
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.5;
    filter: saturate(0.45) brightness(0.5) contrast(1.05);
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
}) => (
    <Stack>
        {photoVisible && <Photo src="/img/bg.jpg" alt="" />}
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
