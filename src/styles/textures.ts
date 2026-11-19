/**
 * ============================================================================
 * Shared surface textures.
 *
 * Two quiet patterns layered over the glass panels, both drawn in the same
 * steel blue as every hairline on the site so they read as part of the
 * linework rather than as decoration:
 *
 *   HATCH — 1px diagonal strokes every 7px (control surfaces, e.g. the tabs)
 *   GRAIN — a 4px dot matrix (large panels, e.g. the hero)
 *
 * Each value is a complete background layer, so it drops straight into a
 * comma-separated `background` list ahead of the panel's own fill.
 * ============================================================================
 */

/* Diagonal hatching — 135deg, one 1px stroke per 7px period */
export const HATCH =
    'repeating-linear-gradient(135deg, rgba(168, 186, 201, 0.07) 0 1px, transparent 1px 7px)';

/* The same hatch at a brighter stroke. Drawn on the identical 7px period, so
   when it is stacked over HATCH from the same origin the strokes land exactly
   on top of each other and simply read as "lit". */
export const HATCH_LIT =
    'repeating-linear-gradient(135deg, rgba(190, 205, 218, 0.2) 0 1px, transparent 1px 7px)';

/* Spaced dot grid — one dot per 12px cell, with barely-there rules running
   through the dots so they read as intersections of a plotting grid. Used
   where a surface should read as "selected" against the hatching around it.
   The rules are offset half a cell so they pass through the dot centres. */
export const DOT_GRID =
    'radial-gradient(rgba(215, 226, 236, 0.2) 0.45px, transparent 0.95px) 0 0 / 12px 12px, ' +
    'linear-gradient(rgba(190, 205, 218, 0.02) 1px, transparent 1px) 0 6px / 12px 12px, ' +
    'linear-gradient(90deg, rgba(190, 205, 218, 0.02) 1px, transparent 1px) 6px 0 / 12px 12px';

/* Dot grain — one soft 1px dot per 4px cell, anchored to the top-left corner */
export const GRAIN =
    'radial-gradient(rgba(168, 186, 201, 0.07) 1px, transparent 1.4px) 0 0 / 4px 4px';
