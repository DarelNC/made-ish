import { describe, expect, it } from "vitest";
import { DEFAULT_THEME, STORAGE_KEY, THEMES, themeInitScript } from "../themes.js";

function run({ saved, dark = false, throws = false }) {
  const root = { attrs: {}, setAttribute(k, v) { this.attrs[k] = v; } };
  const document = { documentElement: root };
  const localStorage = {
    getItem(key) {
      if (throws) throw new Error("blocked");
      return key === STORAGE_KEY ? saved ?? null : null;
    },
  };
  const matchMedia = () => ({ matches: dark });
  new Function("document", "localStorage", "matchMedia", themeInitScript())(document, localStorage, matchMedia);
  return root.attrs["data-theme"];
}

describe("THEMES", () => {
  it("has five themes with unique ids and a valid default", () => {
    const ids = THEMES.map((t) => t.id);
    expect(ids).toHaveLength(5);
    expect(new Set(ids).size).toBe(5);
    expect(ids).toContain(DEFAULT_THEME);
  });

  it("gives every theme a label and two hex swatches", () => {
    for (const t of THEMES) {
      expect(t.label).toBeTruthy();
      expect(t.swatch).toHaveLength(2);
      for (const c of t.swatch) expect(c).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });
});

describe("themeInitScript", () => {
  it("uses the saved theme when it is valid", () => {
    expect(run({ saved: "maroon" })).toBe("maroon");
    expect(run({ saved: "lime", dark: true })).toBe("lime");
  });

  it("falls back on the OS preference: dark gets blueprint, light gets cream", () => {
    expect(run({ dark: true })).toBe("blueprint");
    expect(run({ dark: false })).toBe("cream");
  });

  it("ignores a saved value that is not a theme", () => {
    expect(run({ saved: "hotpink" })).toBe("cream");
    expect(run({ saved: "hotpink", dark: true })).toBe("blueprint");
  });

  it("does not throw when storage is blocked", () => {
    expect(() => run({ throws: true })).not.toThrow();
  });
});
