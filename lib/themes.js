// The five themes. Each one is a block of CSS variables and a few overrides
// in app/themes.css, keyed by <html data-theme="...">. Swatches here only
// draw the picker buttons.

export const STORAGE_KEY = "ot-theme";
export const DEFAULT_THEME = "cream";

export const THEMES = [
  { id: "cream", label: "Cream", swatch: ["#f5efe6", "#ff5a1f"] },
  { id: "maroon", label: "Maroon", swatch: ["#3a0f10", "#e6ff4f"] },
  { id: "newsprint", label: "Newsprint", swatch: ["#e9e1d0", "#e6ff4f"] },
  { id: "lime", label: "Lime", swatch: ["#e6ff4f", "#14100e"] },
  { id: "blueprint", label: "Blueprint", swatch: ["#0e2238", "#6ec8aa"] },
];

/**
 * A script that runs before first paint and sets data-theme, so the page
 * never flashes the wrong theme. A saved choice wins. Without one, a dark OS
 * gets blueprint and everything else gets cream.
 * Written as a string because it runs in <head>, before any bundle.
 */
export function themeInitScript() {
  const ids = JSON.stringify(THEMES.map((t) => t.id));
  return `(function(){try{var ids=${ids};var t=localStorage.getItem(${JSON.stringify(STORAGE_KEY)});if(ids.indexOf(t)<0){t=matchMedia("(prefers-color-scheme: dark)").matches?"blueprint":${JSON.stringify(DEFAULT_THEME)}}document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;
}
