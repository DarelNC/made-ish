import { describe, expect, it } from "vitest";
import { buildEvent, cleanSource, deviceClass, refHost } from "../analytics/event.js";
import { visitorId } from "../analytics/visitor.js";

const IPHONE =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1";
const MAC =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36";
const NOW = Date.UTC(2026, 8, 20, 12);

const headers = (h) => new Headers({ "user-agent": MAC, "x-forwarded-for": "203.0.113.9, 10.0.0.1", ...h });

describe("deviceClass", () => {
  it("tells phones, tablets and desktops apart", () => {
    expect(deviceClass(IPHONE)).toBe("mobile");
    expect(deviceClass("Mozilla/5.0 (Linux; Android 14; Pixel 8) Mobile Safari")).toBe("mobile");
    expect(deviceClass("Mozilla/5.0 (Linux; Android 14; SM-X700) Safari")).toBe("tablet");
    expect(deviceClass("Mozilla/5.0 (iPad; CPU OS 18_0 like Mac OS X)")).toBe("tablet");
    expect(deviceClass(MAC)).toBe("desktop");
  });
});

describe("refHost", () => {
  it("reduces a referrer to a bare host", () => {
    expect(refHost("https://www.News.Ycombinator.com/item?id=1", "example.com")).toBe("news.ycombinator.com");
  });

  it("drops our own host, with or without www and port", () => {
    expect(refHost("https://www.example.com/", "example.com")).toBeNull();
    expect(refHost("http://localhost:3000/", "localhost:3000")).toBeNull();
  });

  it("returns null for empty or invalid input", () => {
    expect(refHost("", "example.com")).toBeNull();
    expect(refHost("not a url", "example.com")).toBeNull();
    expect(refHost(42, "example.com")).toBeNull();
  });
});

describe("cleanSource", () => {
  it("keeps short slugs and lowercases them", () => {
    expect(cleanSource("Newsletter")).toBe("newsletter");
    expect(cleanSource("hn_front-page.1")).toBe("hn_front-page.1");
  });

  it("drops anything else", () => {
    expect(cleanSource("<script>")).toBeNull();
    expect(cleanSource("a".repeat(33))).toBeNull();
    expect(cleanSource("")).toBeNull();
    expect(cleanSource(null)).toBeNull();
  });
});

describe("visitorId", () => {
  const base = { ip: "203.0.113.9", ua: MAC, salt: "s", now: NOW };

  it("is stable within a day and short", () => {
    expect(visitorId(base)).toBe(visitorId({ ...base, now: NOW + 3_600_000 }));
    expect(visitorId(base)).toMatch(/^[0-9a-f]{16}$/);
  });

  it("changes across days, salts, addresses and browsers", () => {
    const id = visitorId(base);
    expect(visitorId({ ...base, now: NOW + 86_400_000 })).not.toBe(id);
    expect(visitorId({ ...base, salt: "other" })).not.toBe(id);
    expect(visitorId({ ...base, ip: "203.0.113.10" })).not.toBe(id);
    expect(visitorId({ ...base, ua: IPHONE })).not.toBe(id);
  });

  it("does not contain the address", () => {
    expect(visitorId(base)).not.toContain("203");
  });
});

describe("buildEvent", () => {
  it("builds a click with the link id and no referrer fields", () => {
    const e = buildEvent({
      type: "click",
      link: "coined",
      headers: headers({ "x-vercel-ip-country": "ES" }),
      now: NOW,
      salt: "s",
    });
    expect(e).toMatchObject({ t: NOW, type: "click", link: "coined", country: "ES", device: "desktop" });
    expect(e).not.toHaveProperty("ref");
  });

  it("builds a view with a cleaned referrer and source", () => {
    const e = buildEvent({
      type: "view",
      headers: headers({ host: "links.example.com" }),
      ref: "https://news.ycombinator.com/",
      src: "HN",
      now: NOW,
      salt: "s",
    });
    expect(e).toMatchObject({ type: "view", ref: "news.ycombinator.com", src: "hn" });
    expect(e).not.toHaveProperty("link");
  });

  it("never stores the address or the user agent", () => {
    const e = buildEvent({ type: "view", headers: headers({}), now: NOW, salt: "s" });
    const json = JSON.stringify(e);
    expect(json).not.toContain("203.0.113.9");
    expect(json).not.toContain("Mozilla");
  });

  it("ignores a malformed country header", () => {
    const e = buildEvent({
      type: "click",
      link: "x",
      headers: headers({ "x-vercel-ip-country": "spain" }),
      now: NOW,
      salt: "s",
    });
    expect(e.country).toBeNull();
  });

  it("drops bots, missing user agents and prefetches", () => {
    const opts = { type: "view", now: NOW, salt: "s" };
    expect(buildEvent({ ...opts, headers: headers({ "user-agent": "Googlebot/2.1" }) })).toBeNull();
    expect(buildEvent({ ...opts, headers: headers({ "user-agent": "Slackbot-LinkExpanding 1.0" }) })).toBeNull();
    expect(buildEvent({ ...opts, headers: new Headers() })).toBeNull();
    expect(buildEvent({ ...opts, headers: headers({ "sec-purpose": "prefetch" }) })).toBeNull();
  });
});
