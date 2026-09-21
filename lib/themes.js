// The five themes. Each one is a block of CSS variables and a few overrides
// in app/themes.css, keyed by <html data-theme="...">. `label` is the plain
// name (used for screen readers), `mood` is the name people see. Swatches
// only draw the picker buttons.

export const STORAGE_KEY = "madeish-theme";
export const DEFAULT_THEME = "zine";

export const THEMES = [
  { id: "zine", label: "Zine", mood: "Cut and paste", swatch: ["#ece5d6", "#8ecbff"] },
  { id: "cream", label: "Cream", mood: "Easy on the eyes", swatch: ["#f5efe6", "#ff5a1f"] },
  { id: "maroon", label: "Maroon", mood: "Brooding", swatch: ["#3a0f10", "#e6ff4f"] },
  { id: "newsprint", label: "Newsprint", mood: "Yesterday's news", swatch: ["#e9e1d0", "#e6ff4f"] },
  { id: "lime", label: "Lime", mood: "Eye damage", swatch: ["#e6ff4f", "#14100e"] },
  { id: "blueprint", label: "Blueprint", mood: "Very serious", swatch: ["#0e2238", "#6ec8aa"] },
];

/**
 * A script that runs before first paint and sets data-theme, so the page
 * never flashes the wrong theme. A saved choice wins. Without one, a dark OS
 * gets blueprint and everything else gets the default (zine).
 * Written as a string because it runs in <head>, before any bundle.
 */
export function themeInitScript() {
  const ids = JSON.stringify(THEMES.map((t) => t.id));
  return `(function(){try{var ids=${ids};var t=localStorage.getItem(${JSON.stringify(STORAGE_KEY)});if(ids.indexOf(t)<0){t=matchMedia("(prefers-color-scheme: dark)").matches?"blueprint":${JSON.stringify(DEFAULT_THEME)}}document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;
}
