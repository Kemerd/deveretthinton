import React from 'react';
import styled from 'styled-components';

/**
 * ============================================================================
 * Corners — the recurring blueprint-style "+" registration marks that sit
 * just outside the four corners of panels, cards, and buttons.
 *
 * Each mark is a small square straddling a corner, drawn as a crosshair via
 * its ::before (vertical stroke) and ::after (horizontal stroke). The mark
 * hangs half outside its parent, so the parent must be position:relative
 * and must NOT clip overflow.
 * ============================================================================
 */

interface CornersProps {
    /** Square size of each mark in px — panels use 11, small buttons use 9. */
    size?: number;
    /** Stroke colour of the crosshair lines. */
    color?: string;
    /** Opacity applied to the whole overlay (cards dim theirs to 0.55). */
    opacity?: number;
}

/* Full-bleed overlay that never intercepts pointer events. */
const Overlay = styled.span<{ $opacity: number }>`
    position: absolute;
    inset: 0;
    pointer-events: none;
    opacity: ${({ $opacity }) => $opacity};
`;

/* A single crosshair mark. Which corner it sits on comes via $corner;
   the negative offset centres the mark on the parent's border line. */
const Mark = styled.span<{ $size: number; $color: string; $corner: 'tl' | 'tr' | 'bl' | 'br' }>`
    position: absolute;
    width: ${({ $size }) => $size}px;
    height: ${({ $size }) => $size}px;

    /* Anchor to the requested corner, hanging halfway outside the box */
    ${({ $size, $corner }) => {
        const off = `-${($size - 1) / 2}px`;
        switch ($corner) {
            case 'tl': return `top:${off}; left:${off};`;
            case 'tr': return `top:${off}; right:${off};`;
            case 'bl': return `bottom:${off}; left:${off};`;
            default: return `bottom:${off}; right:${off};`;
        }
    }}

    /* Vertical stroke of the crosshair */
    &::before {
        content: '';
        position: absolute;
        left: ${({ $size }) => ($size - 1) / 2}px;
        top: 0;
        width: 1px;
        height: ${({ $size }) => $size}px;
        background: ${({ $color }) => $color};
    }

    /* Horizontal stroke of the crosshair */
    &::after {
        content: '';
        position: absolute;
        top: ${({ $size }) => ($size - 1) / 2}px;
        left: 0;
        width: ${({ $size }) => $size}px;
        height: 1px;
        background: ${({ $color }) => $color};
    }
`;

/**
 * Drop inside any position:relative container to decorate its corners.
 * Defaults match the large-panel variant from the design (11px, #BCCBD8).
 */
export const Corners: React.FC<CornersProps> = ({
    size = 11,
    color = '#BCCBD8',
    opacity = 1,
}) => (
    <Overlay $opacity={opacity} aria-hidden="true">
        <Mark $size={size} $color={color} $corner="tl" />
        <Mark $size={size} $color={color} $corner="tr" />
        <Mark $size={size} $color={color} $corner="bl" />
        <Mark $size={size} $color={color} $corner="br" />
    </Overlay>
);
