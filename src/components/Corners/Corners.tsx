import React from 'react';
import styled from 'styled-components';

/**
 * ============================================================================
 * Corners — the recurring blueprint-style "+" registration marks pinned to
 * the four corners of panels, cards, and buttons.
 *
 * Each mark sits fully OUTSIDE the parent's border but flush against it:
 * the crosshair's 1px strokes occupy the pixel column/row immediately
 * adjacent to the border's outer edge (1px stroke | 1px border, touching,
 * no gap, no overlap). The parent must be position:relative, own a border
 * of `borderWidth` px, and must NOT clip overflow.
 *
 * The square is normalised to an odd size (arm + 1px stroke + arm) so every
 * mark is perfectly symmetric — identical width and height, equal arms.
 * ============================================================================
 */

interface CornersProps {
    /** Square size of each mark in px — panels use 11, small buttons use 9.
        Even values are rounded down to the nearest odd so the + stays symmetric. */
    size?: number;
    /** Stroke colour of the crosshair lines. */
    color?: string;
    /** Opacity applied to the whole overlay (cards dim theirs to 0.55). */
    opacity?: number;
    /** Parent's border width in px — the marks butt up against its outer edge. */
    borderWidth?: number;
}

/* Full-bleed overlay that never intercepts pointer events. */
const Overlay = styled.span<{ $opacity: number }>`
    position: absolute;
    inset: 0;
    pointer-events: none;
    opacity: ${({ $opacity }) => $opacity};
`;

/* A single crosshair mark. Which corner it sits on comes via $corner; $off
   pushes the mark outward so its centre strokes hug the border's outside. */
const Mark = styled.span<{ $span: number; $arm: number; $off: number; $color: string; $corner: 'tl' | 'tr' | 'bl' | 'br' }>`
    position: absolute;
    width: ${({ $span }) => $span}px;
    height: ${({ $span }) => $span}px;

    /* Anchor to the requested corner. Absolute offsets measure from the
       parent's padding box (inside the border), so $off already accounts
       for hopping over the border itself. */
    ${({ $off, $corner }) => {
        const off = `${$off}px`;
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
        left: ${({ $arm }) => $arm}px;
        top: 0;
        width: 1px;
        height: ${({ $span }) => $span}px;
        background: ${({ $color }) => $color};
    }

    /* Horizontal stroke of the crosshair */
    &::after {
        content: '';
        position: absolute;
        top: ${({ $arm }) => $arm}px;
        left: 0;
        width: ${({ $span }) => $span}px;
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
    borderWidth = 1,
}) => {
    /* Arm length either side of the 1px stroke; forces an odd, symmetric
       square (span × span) regardless of the size passed in. */
    const arm = Math.floor((size - 1) / 2);
    const span = arm * 2 + 1;

    /* Offset from the anchored sides. Walks the centre stroke past the
       padding-box edge (arm), past the stroke's own width (1), and past the
       parent's border (borderWidth), landing it flush against the border's
       outer edge — outside the box, touching, never overlapping. */
    const off = -(arm + 1 + borderWidth);

    return (
        <Overlay $opacity={opacity} aria-hidden="true">
            <Mark $span={span} $arm={arm} $off={off} $color={color} $corner="tl" />
            <Mark $span={span} $arm={arm} $off={off} $color={color} $corner="tr" />
            <Mark $span={span} $arm={arm} $off={off} $color={color} $corner="bl" />
            <Mark $span={span} $arm={arm} $off={off} $color={color} $corner="br" />
        </Overlay>
    );
};
