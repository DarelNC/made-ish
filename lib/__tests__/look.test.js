import { describe, expect, it } from "vitest";
import { COLORS, PATTERNS, SHAPES, SIZES, longestWord, lookFor } from "../look.js";

const link = (title, extra = {}) => ({ title, ...extra });
const looks = (titles) => titles.map((t, i) => lookFor(link(t), i));

describe("longestWord", () => {
  it("measures the longest word, not the whole title", () => {
    expect(longestWord("Coined")).toBe(6);
    expect(longestWord("Congratulations, Probably")).toBe(16);
    expect(longestWord("Everything else")).toBe(10);
  });
});

describe("lookFor", () => {
  it("never gives two neighbours the same color, pattern or shape", () => {
    const l = looks(Array(24).fill("Same"));
    for (let i = 1; i < l.length; i++) {
      expect(l[i].color).not.toBe(l[i - 1].color);
      expect(l[i].pattern).not.toBe(l[i - 1].pattern);
      expect(l[i].shape).not.toBe(l[i - 1].shape);
    }
  });

  it("only produces known values", () => {
    for (const l of looks(Array(12).fill("Thing"))) {
      expect(COLORS).toContain(l.color);
      expect(PATTERNS).toContain(l.pattern);
      expect(SHAPES).toContain(l.shape);
      expect(SIZES).toContain(l.size);
    }
  });

  it("is stable for the same position", () => {
    expect(lookFor(link("Coined"), 2)).toEqual(lookFor(link("Coined"), 2));
  });

  it("gives long words a wide tile and never a small one for 8 or more letters", () => {
    for (let i = 0; i < 12; i++) {
      expect(lookFor(link("Caffeinated"), i).size).toBe("l");
      expect(lookFor(link("Everything"), i).size).not.toBe("s");
    }
  });

  it("uses the given mark, or the first letter of the title", () => {
    expect(lookFor(link("Coined", { mark: "¢" }), 0).mark).toBe("¢");
    expect(lookFor(link("coined"), 0).mark).toBe("C");
  });

  it("honours a valid override and ignores an invalid one", () => {
    const l = lookFor(link("Coined", { look: { color: "pink", pattern: "nope", size: "l" } }), 0);
    expect(l.color).toBe("pink");
    expect(l.size).toBe("l");
    expect(l.pattern).toBe(PATTERNS[1]);
  });
});
