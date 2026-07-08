/**
 * generate-flag-favicon.js
 * ------------------------
 * Renders a simplified American flag and packs it into a real multi-size
 * favicon.ico (16 / 32 / 48 px) with ZERO dependencies — no sharp, no
 * ImageMagick, just Node built-ins and some honest byte-pushing.
 *
 * The design mirrors public/favicon.svg exactly:
 *   - 7 stripes (4 red, 3 white) — 13 stripes alias into mush at tab size
 *   - Blue canton over the top 4 stripes, 40% of the flag length
 *   - 3-2-3 staggered white dots standing in for the star field
 *   - Official 19:10 flag aspect ratio, centered vertically in the square
 *     canvas with transparent letterbox bands above and below
 *
 * ICO container layout (classic BMP-style entries, readable everywhere):
 *   ICONDIR (6 bytes) -> ICONDIRENTRY[n] (16 bytes each) -> image blobs
 *   Each blob: BITMAPINFOHEADER (40 bytes, height doubled for the AND mask)
 *              + bottom-up BGRA pixel rows + all-zero 1bpp AND mask (opaque)
 *
 * Usage: node scripts/generate-flag-favicon.js
 */

const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// Design constants — everything is expressed in a 32x32 "design space" so the
// raster output matches the SVG coordinates 1:1, then scaled per icon size.
// ---------------------------------------------------------------------------

// Traditional Old Glory colors (same values as favicon.svg)
const RED = [0xB2, 0x22, 0x34];
const WHITE = [0xFF, 0xFF, 0xFF];
const BLUE = [0x3C, 0x3B, 0x6E];

// Number of stripes in the simplified design
const STRIPES = 7;

// Flag geometry: official US flag ratio is 10:19 (hoist:fly).
// Full canvas width, letterboxed vertically with transparent bands.
const FLAG_H = 32 * (10 / 19);          // ≈ 16.842 design units tall
const FLAG_Y0 = (32 - FLAG_H) / 2;      // ≈ 7.579 — top edge of the flag
const STRIPE_H = FLAG_H / STRIPES;      // ≈ 2.406 per stripe

// Canton (blue star field) dimensions in design units
const CANTON_W = 12.8;                  // 40% of the flag length
const CANTON_H = STRIPE_H * 4;          // exactly the top 4 of 7 stripes

// Star-dot centers (3-2-3 stagger) and radius, in design units.
// Rows sit at 1/4, 1/2, 3/4 of the canton height below the flag's top edge.
const DOTS = [
    [2.18, FLAG_Y0 + CANTON_H * 0.25], [6.4, FLAG_Y0 + CANTON_H * 0.25], [10.62, FLAG_Y0 + CANTON_H * 0.25],
    [4.29, FLAG_Y0 + CANTON_H * 0.5], [8.51, FLAG_Y0 + CANTON_H * 0.5],
    [2.18, FLAG_Y0 + CANTON_H * 0.75], [6.4, FLAG_Y0 + CANTON_H * 0.75], [10.62, FLAG_Y0 + CANTON_H * 0.75],
];
const DOT_R = 1.0;

// Supersampling factor for anti-aliasing
const SUPERSAMPLE = 4; // 4x4 = 16 samples per pixel, plenty for flat shapes

// ---------------------------------------------------------------------------
// Flag rasterizer — returns the color at a single point in design space
// ---------------------------------------------------------------------------

/**
 * Sample the flag design at design-space coordinates (u, v), both in [0, 32).
 * Returns an [r, g, b] color inside the flag, or null in the transparent
 * letterbox bands. Order of tests matters: dots over canton over stripes.
 */
function sampleFlag(u, v) {
    // Outside the 19:10 flag band -> transparent letterbox
    if (v < FLAG_Y0 || v >= FLAG_Y0 + FLAG_H) return null;

    // Star dots win over everything (they only exist inside the canton anyway)
    for (const [dx, dy] of DOTS) {
        const ddx = u - dx;
        const ddy = v - dy;
        if (ddx * ddx + ddy * ddy <= DOT_R * DOT_R) return WHITE;
    }

    // Blue canton covers the top-left corner of the flag
    if (u < CANTON_W && v < FLAG_Y0 + CANTON_H) return BLUE;

    // Stripes: even rows red, odd rows white (top stripe is red)
    const stripe = Math.min(STRIPES - 1, Math.floor((v - FLAG_Y0) / STRIPE_H));
    return (stripe % 2 === 0) ? RED : WHITE;
}

/**
 * Render the flag into a top-down RGBA buffer at the given pixel size,
 * supersampling each pixel so stripe/canton/dot edges come out smooth.
 */
function renderFlag(size) {
    const rgba = Buffer.alloc(size * size * 4);
    const step = 1 / SUPERSAMPLE;

    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            let r = 0, g = 0, b = 0, hits = 0;

            // Average a SUPERSAMPLE x SUPERSAMPLE grid of design-space samples.
            // Samples in the transparent letterbox return null and only lower
            // the pixel's coverage (alpha) rather than its color.
            for (let sy = 0; sy < SUPERSAMPLE; sy++) {
                for (let sx = 0; sx < SUPERSAMPLE; sx++) {
                    const u = ((x + (sx + 0.5) * step) / size) * 32;
                    const v = ((y + (sy + 0.5) * step) / size) * 32;
                    const c = sampleFlag(u, v);
                    if (c) {
                        r += c[0];
                        g += c[1];
                        b += c[2];
                        hits++;
                    }
                }
            }

            const n = SUPERSAMPLE * SUPERSAMPLE;
            const i = (y * size + x) * 4;
            // Straight (non-premultiplied) alpha: color is the average of the
            // covered samples, alpha is the fraction of samples covered.
            rgba[i] = hits ? Math.round(r / hits) : 0;
            rgba[i + 1] = hits ? Math.round(g / hits) : 0;
            rgba[i + 2] = hits ? Math.round(b / hits) : 0;
            rgba[i + 3] = Math.round((hits / n) * 255);
        }
    }

    return rgba;
}

// ---------------------------------------------------------------------------
// ICO encoding — classic BMP-style entries (maximum compatibility)
// ---------------------------------------------------------------------------

/**
 * Wrap a top-down RGBA buffer into an ICO image blob:
 * BITMAPINFOHEADER + bottom-up BGRA rows + all-zero AND mask.
 */
function encodeIcoImage(size, rgba) {
    // --- BITMAPINFOHEADER (40 bytes) ---
    const header = Buffer.alloc(40);
    header.writeUInt32LE(40, 0);           // biSize
    header.writeInt32LE(size, 4);          // biWidth
    header.writeInt32LE(size * 2, 8);      // biHeight (XOR + AND planes)
    header.writeUInt16LE(1, 12);           // biPlanes
    header.writeUInt16LE(32, 14);          // biBitCount (BGRA)
    // Remaining fields (compression, sizes, etc.) stay zero — BI_RGB

    // --- XOR plane: pixel data, bottom-up row order, BGRA byte order ---
    const xor = Buffer.alloc(size * size * 4);
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const src = ((size - 1 - y) * size + x) * 4; // flip vertically
            const dst = (y * size + x) * 4;
            xor[dst] = rgba[src + 2];     // B
            xor[dst + 1] = rgba[src + 1]; // G
            xor[dst + 2] = rgba[src];     // R
            xor[dst + 3] = rgba[src + 3]; // A
        }
    }

    // --- AND plane: 1bpp mask, rows padded to 32-bit boundaries ---
    // Modern decoders use the alpha channel, but legacy ones honor this mask:
    // bit set = transparent. Mark the letterbox pixels (alpha < 128), and keep
    // the same bottom-up row order as the XOR plane.
    const andStride = Math.ceil(size / 32) * 4;
    const and = Buffer.alloc(andStride * size);
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const alpha = rgba[((size - 1 - y) * size + x) * 4 + 3];
            if (alpha < 128) {
                and[y * andStride + (x >> 3)] |= 0x80 >> (x & 7);
            }
        }
    }

    return Buffer.concat([header, xor, and]);
}

/**
 * Assemble the full .ico file from a list of pixel sizes.
 */
function buildIco(sizes) {
    // Render + encode every size up front so we can compute offsets
    const images = sizes.map((size) => ({
        size,
        data: encodeIcoImage(size, renderFlag(size)),
    }));

    // --- ICONDIR (6 bytes) ---
    const dir = Buffer.alloc(6);
    dir.writeUInt16LE(0, 0);             // reserved
    dir.writeUInt16LE(1, 2);             // type: 1 = icon
    dir.writeUInt16LE(images.length, 4); // image count

    // --- ICONDIRENTRY table (16 bytes per image) ---
    const entries = Buffer.alloc(16 * images.length);
    let offset = 6 + entries.length; // blobs start right after the table

    images.forEach((img, i) => {
        const base = i * 16;
        entries.writeUInt8(img.size === 256 ? 0 : img.size, base);     // width
        entries.writeUInt8(img.size === 256 ? 0 : img.size, base + 1); // height
        entries.writeUInt8(0, base + 2);                // color count (truecolor)
        entries.writeUInt8(0, base + 3);                // reserved
        entries.writeUInt16LE(1, base + 4);             // planes
        entries.writeUInt16LE(32, base + 6);            // bits per pixel
        entries.writeUInt32LE(img.data.length, base + 8);  // blob size
        entries.writeUInt32LE(offset, base + 12);          // blob offset
        offset += img.data.length;
    });

    return Buffer.concat([dir, entries, ...images.map((img) => img.data)]);
}

// ---------------------------------------------------------------------------
// Main — write public/favicon.ico
// ---------------------------------------------------------------------------

const outPath = path.join(__dirname, '..', 'public', 'favicon.ico');
const ico = buildIco([16, 32, 48]);
fs.writeFileSync(outPath, ico);
console.log(`Wrote ${outPath} (${ico.length} bytes, sizes: 16/32/48)`);
