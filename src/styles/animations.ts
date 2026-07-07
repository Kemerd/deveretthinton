import { keyframes } from 'styled-components';

/**
 * ============================================================================
 * Shared motion vocabulary for the whole page.
 *
 * Everything on the site enters with one of three moves:
 *   riseIn  — content panels drift up 14px while fading in
 *   fadeIn  — plain opacity fade (lightbox scrim)
 *   panelIn — pop from 90% scale (detail panel, lightbox frame)
 *
 * The two easing curves are used everywhere for consistency:
 *   EASE_OUT    — long, soft deceleration for entrances
 *   EASE_SPRING — overshooting spring for hover/press feedback
 * ============================================================================
 */

export const riseIn = keyframes`
    from { opacity: 0; transform: translateY(14px); }
    to { opacity: 1; transform: translateY(0); }
`;

export const fadeIn = keyframes`
    from { opacity: 0; }
    to { opacity: 1; }
`;

export const panelIn = keyframes`
    from { opacity: 0; transform: scale(0.9); }
    to { opacity: 1; transform: scale(1); }
`;

/* Soft deceleration — every entrance animation uses this curve */
export const EASE_OUT = 'cubic-bezier(0.16, 1, 0.3, 1)';

/* Springy overshoot — button hovers, presses, and arrow feedback */
export const EASE_SPRING = 'cubic-bezier(0.34, 1.56, 0.64, 1)';

/* Character sets used by the text scramble effects (name + quip) */
export const SCRAMBLE_CHARSET = 'ABCDEFGHKMNPRSTVXZ0123456789/<>+=';
