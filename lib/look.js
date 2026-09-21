// How each link looks in the zine theme, so no two neighbours are the same
// rectangle. Everything is chosen from the link's position in the list, which
// guarantees neighbours differ, and can be overridden per link with `look`
// in content/site.js. Pure: no DOM, no randomness.

export const COLORS = ["lime", "orange", "sky", "pink", "ink", "mint"];
export const PATTERNS = ["dots", "stripes", "checks", "grid", "none"];
export const SHAPES = ["leaf", "rect", "round", "tab"];
export const SIZES = ["s", "m", "l"];

const SIZE_CYCLE = ["l", "s", "m", "s", "m", "l"];
const TILTS = [-1.4, 1, -0.6, 1.6, -1.1, 0.7];

/** @param {string} title */
export function longestWord(title) {
  return Math.max(1, ...title.split(/\s+/).map((w) => w.length));
}

/** @template T @param {unknown} value @param {T[]} allowed @param {T} fallback @returns {T} */
const pick = (value, allowed, fallback) => (allowed.includes(/** @type {T} */ (value)) ? /** @type {T} */ (value) : fallback);

/**
 * @param {{ title: string, mark?: string, look?: { color?: string, pattern?: string, shape?: string, size?: string } }} link
 * @param {number} index
 */
export function lookFor(link, index) {
  const n = longestWord(link.title);

  // A long word cannot fit in a small tile, so long titles always get a wide one.
  let size = SIZE_CYCLE[index % SIZE_CYCLE.length];
  if (n >= 11) size = "l";
  else if (n >= 8 && size === "s") size = "m";

  const look = link.look || {};
  return {
    color: pick(look.color, COLORS, COLORS[index % COLORS.length]),
    pattern: pick(look.pattern, PATTERNS, PATTERNS[(index * 2 + 1) % PATTERNS.length]),
    shape: pick(look.shape, SHAPES, SHAPES[index % SHAPES.length]),
    size: pick(look.size, SIZES, size),
    tilt: TILTS[index % TILTS.length],
    mark: (link.mark || link.title.trim().charAt(0)).toUpperCase(),
    n,
  };
}
