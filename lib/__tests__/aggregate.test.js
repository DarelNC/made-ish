import { describe, expect, it } from "vitest";
import { summarize, windowStart } from "../analytics/aggregate.js";

const DAY = 86_400_000;
const NOW = Date.UTC(2026, 8, 20, 12);
const opts = { now: NOW, days: 7, linkIds: ["a", "b", "c"] };

const view = (t, extra = {}) => ({ t, type: "view", visitor: "v1", ref: null, src: null, country: "ES", device: "mobile", ...extra });
const click = (t, link, extra = {}) => ({ t, type: "click", link, visitor: "v1", ...extra });

describe("windowStart", () => {
  it("starts at UTC midnight, days-1 days back", () => {
    expect(windowStart(NOW, 1)).toBe(Date.UTC(2026, 8, 20));
    expect(windowStart(NOW, 7)).toBe(Date.UTC(2026, 8, 14));
  });
});

describe("summarize", () => {
  it("returns zeros and a full daily series for no events", () => {
    const s = summarize([], opts);
    expect(s).toMatchObject({ views: 0, visitors: 0, clicks: 0, clicksPerView: 0 });
    expect(s.daily).toHaveLength(7);
    expect(s.daily[0].day).toBe("2026-09-14");
    expect(s.daily[6].day).toBe("2026-09-20");
    expect(s.links.map((l) => l.id)).toEqual(["a", "b", "c"]);
    expect(s.links.every((l) => l.clicks === 0)).toBe(true);
  });

  it("counts views, unique visitors, clicks and clicks per view", () => {
    const s = summarize(
      [view(NOW), view(NOW - 1000), view(NOW - 2000, { visitor: "v2" }), click(NOW, "a"), click(NOW, "a", { visitor: "v2" })],
      opts,
    );
    expect(s.views).toBe(3);
    expect(s.visitors).toBe(2);
    expect(s.clicks).toBe(2);
    expect(s.clicksPerView).toBeCloseTo(2 / 3);
  });

  it("ranks links by clicks, counts unique clickers and computes share", () => {
    const s = summarize(
      [click(NOW, "b"), click(NOW, "b"), click(NOW, "b", { visitor: "v2" }), click(NOW, "a")],
      opts,
    );
    expect(s.links.map((l) => l.id)).toEqual(["b", "a", "c"]);
    expect(s.links[0]).toMatchObject({ id: "b", clicks: 3, clickers: 2, share: 0.75, removed: false });
    expect(s.links[2]).toMatchObject({ id: "c", clicks: 0, share: 0 });
  });

  it("keeps clicks on links that no longer exist and flags them", () => {
    const s = summarize([click(NOW, "gone")], opts);
    expect(s.links.find((l) => l.id === "gone")).toMatchObject({ clicks: 1, removed: true });
  });

  it("buckets events into UTC days", () => {
    const s = summarize([view(NOW), view(NOW - DAY), click(NOW - DAY, "a")], opts);
    expect(s.daily.at(-1)).toMatchObject({ day: "2026-09-20", views: 1, clicks: 0 });
    expect(s.daily.at(-2)).toMatchObject({ day: "2026-09-19", views: 1, clicks: 1 });
  });

  it("ignores events outside the window", () => {
    const s = summarize([view(NOW - 30 * DAY), view(NOW + 2 * DAY)], opts);
    expect(s.views).toBe(0);
  });

  it("ranks sources, preferring src, then ref, then direct", () => {
    const s = summarize(
      [
        view(NOW, { src: "newsletter", ref: "mail.example.com" }),
        view(NOW, { ref: "news.ycombinator.com", visitor: "v2" }),
        view(NOW, { ref: "news.ycombinator.com", visitor: "v3" }),
        view(NOW, { visitor: "v4" }),
      ],
      opts,
    );
    expect(s.from).toEqual([
      { key: "news.ycombinator.com", n: 2 },
      { key: "direct", n: 1 },
      { key: "newsletter", n: 1 },
    ]);
  });

  it("ranks countries and devices from views only", () => {
    const s = summarize(
      [view(NOW, { country: "ES" }), view(NOW, { country: "ES", device: "desktop" }), view(NOW, { country: null })],
      opts,
    );
    expect(s.countries[0]).toEqual({ key: "ES", n: 2 });
    expect(s.countries[1]).toEqual({ key: "unknown", n: 1 });
    expect(s.devices[0]).toEqual({ key: "mobile", n: 2 });
  });
});
