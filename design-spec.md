# deveretthinton.com — Design Language Spec (for matching the resume)

This is the exact visual system from the live site, extracted from the source. Reproduce these details precisely — the identity lives in the small stuff.

## Core palette

- Page background: near-black blue `#0A0E12` → `#0C1014` (the site uses a dark gradient wash: `linear-gradient(to bottom, rgba(10,14,18,0.82), rgba(12,16,20,0.72) 45%, rgba(10,13,17,0.9))` over imagery; on paper/PDF just use solid `#0B0F13`).
- **The one hairline color that defines everything: steel blue `rgb(168, 186, 201)`** at various alphas. Every line, border, grid, and crosshair uses this hue — never pure white, never gray.
- Body text: `rgba(226, 234, 240, 0.88)`. Headings: `#FFFFFF` / `#DCE6ED`.
- Muted mono labels: `rgba(158, 178, 195, 0.65–0.85)`.

## Background: blueprint grid

A faint 56px engineering grid over the whole page, drawn with 1px lines of the steel blue at 4.5% opacity:

```css
background-image:
  repeating-linear-gradient(0deg,  rgba(168,186,201,0.045) 0 1px, transparent 1px 56px),
  repeating-linear-gradient(90deg, rgba(168,186,201,0.045) 0 1px, transparent 1px 56px);
```

Optionally add a radial vignette on top: `radial-gradient(ellipse at center, transparent 55%, rgba(6,9,12,0.55) 100%)`.

## Panels / cards

- **Square corners. `border-radius: 0` on panels.** No rounded cards.
- Border: `1px solid rgba(168, 186, 201, 0.18)`.
- Fill: a subtle top-lit glass gradient, NOT a flat color:
  `background: linear-gradient(160deg, rgba(210,224,234,0.10) 0%, rgba(15,20,26,0.5) 35%, rgba(15,20,26,0.6) 100%);`
- Shadow: `box-shadow: 0 18px 60px rgba(0,0,0,0.4);`
- Internal dividers: `border-top: 1px solid rgba(168,186,201,0.14)`.
- Panels must NOT clip overflow (`overflow: visible`) because the corner marks sit outside the border.

## The "+" corner registration marks (the signature detail)

Every panel gets a small blueprint-style crosshair `+` at each of its four corners. Exact geometry:

- Each mark is an **11×11px square** (small buttons use 9×9) containing a 1px vertical stroke and 1px horizontal stroke crossing at center — arm length 5px each side of the stroke.
- Stroke color `#BCCBD8`, drawn at full opacity on big panels, `opacity: 0.55` on smaller cards.
- Position: the mark sits **fully OUTSIDE the panel's border, flush against it** — its center strokes visually extend the panel's edges past the corner. With an 11px mark and a 1px border, offset each mark by `-7px` (that's `-(arm 5 + stroke 1 + border 1)`) from its corner, e.g. top-left mark: `top: -7px; left: -7px;`.
- Pure-CSS recipe (one span per corner inside a `position: relative` panel):

```css
.corner {
  position: absolute; width: 11px; height: 11px; pointer-events: none;
  background:
    linear-gradient(#BCCBD8, #BCCBD8) 5px 0 / 1px 11px no-repeat,  /* vertical stroke */
    linear-gradient(#BCCBD8, #BCCBD8) 0 5px / 11px 1px no-repeat;  /* horizontal stroke */
}
.corner.tl { top: -7px; left: -7px; }
.corner.tr { top: -7px; right: -7px; }
.corner.bl { bottom: -7px; left: -7px; }
.corner.br { bottom: -7px; right: -7px; }
```

## Typography

- Display/headers: "Artico" / "Artico Expanded" (fallback: `system-ui, -apple-system, sans-serif`), weight 700, tight negative letter-spacing (-0.4 to -0.5px), line-height ~1.1–1.2.
- Body: SF Pro Text style, 16–17px, line-height 1.5–1.65, color `rgba(226,234,240,0.88)`.
- **Technical labels / section tags: `IBM Plex Mono`, 10–12px, UPPERCASE, letter-spacing 2–3px**, color `rgba(158,178,195,0.65–0.85)`. This mono-label treatment is a key part of the look — use it for section headers, dates, metadata.

## Buttons / interactive chips

- Square (no radius), `border: 1px solid rgba(168,186,201,0.4)`, fill `rgba(168,186,201,0.08)`.
- Label in IBM Plex Mono, 12px, uppercase, letter-spacing 2px, color `#DCE6ED`.
- Small 9px corner `+` marks on buttons too.
- Hover: fill `rgba(168,186,201,0.18)`, border `rgba(210,224,234,0.7)`, lift `translateY(-2px)`.

## Decorative accents (use sparingly)

- A thin reticle: concentric 1px circles (`rgba(168,186,201,0.1)` outer, `0.07` inner) with 1px crosshair lines (`0.12`) extending slightly past the ring.
- Tiny lone 18px crosshairs floating in empty space, strokes at `rgba(168,186,201,0.28)`.
- Framed images: `border: 1px solid rgba(168,186,201,0.35)`, square corners.

## Summary of the vibe

Dark aviation/engineering blueprint: one steel-blue hue for all linework at varying opacity, square corners everywhere, hairline 1px borders, external `+` registration marks on every panel corner, faint 56px grid, uppercase mono micro-labels, glassy gradient panel fills. Nothing rounded, nothing colorful — restraint and precision.
