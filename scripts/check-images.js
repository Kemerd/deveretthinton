/**
 * ============================================================================
 * check-images — verifies every image path referenced in the portfolio data
 * actually exists on disk under /public.
 *
 * The carousel renders images with a bare <img src>, so a typo or a missing
 * file degrades to a broken-image icon at runtime with no build error. This
 * catches that before a deploy instead of after.
 *
 *   node scripts/check-images.js
 *
 * Exits non-zero when something is missing, so it can gate a deploy.
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DATA = path.join(ROOT, 'src', 'data', 'portfolio.ts');
const PUBLIC = path.join(ROOT, 'public');

/* Pull every '/img/...' string literal out of the data file. Matching the
   leading slash keeps this to site-root asset paths and ignores everything
   else (URLs, copy, identifiers). */
const source = fs.readFileSync(DATA, 'utf8');
const referenced = [...source.matchAll(/['"](\/img\/[^'"]+)['"]/g)].map((m) => m[1]);

const unique = [...new Set(referenced)];
const missing = unique.filter((rel) => !fs.existsSync(path.join(PUBLIC, rel)));

console.log(`Checked ${unique.length} image paths in src/data/portfolio.ts`);

if (missing.length === 0) {
    console.log('All images present.');
    process.exit(0);
}

/* Group the misses by folder so the fix list reads as "drop these here" */
const byDir = missing.reduce((acc, rel) => {
    const dir = path.posix.dirname(rel);
    (acc[dir] = acc[dir] || []).push(path.posix.basename(rel));
    return acc;
}, {});

console.error(`\nMISSING ${missing.length} file(s):\n`);
for (const [dir, files] of Object.entries(byDir)) {
    console.error(`  public${dir}/`);
    files.forEach((f) => console.error(`      ${f}`));
}
console.error('');
process.exit(1);
