import { isBot } from "./bots.js";
import { visitorId } from "./visitor.js";

const MAX_SRC = 32;

/** @param {string} ua */
export function deviceClass(ua) {
  if (/ipad|tablet|android(?!.*mobile)/i.test(ua)) return "tablet";
  if (/mobi|iphone|ipod|android/i.test(ua)) return "mobile";
  return "desktop";
}

/** @param {string | null | undefined} host */
function bareHost(host) {
  if (!host) return null;
  return host.toLowerCase().replace(/:\d+$/, "").replace(/^www\./, "") || null;
}

/**
 * The referrer as a bare host, or null for direct visits and our own pages.
 * @param {unknown} raw
 * @param {string | null} ownHost
 */
export function refHost(raw, ownHost) {
  if (typeof raw !== "string" || !raw) return null;
  try {
    const host = bareHost(new URL(raw).hostname);
    return host && host !== bareHost(ownHost) ? host : null;
  } catch {
    return null;
  }
}

/**
 * A campaign label from ?ref= or ?utm_source=. Anything odd is dropped.
 * @param {unknown} raw
 */
export function cleanSource(raw) {
  if (typeof raw !== "string") return null;
  const s = raw.trim().toLowerCase();
  return s.length > 0 && s.length <= MAX_SRC && /^[a-z0-9_.-]+$/.test(s) ? s : null;
}

/** @param {Headers} headers */
function clientIp(headers) {
  const forwarded = headers.get("x-forwarded-for");
  return (forwarded ? forwarded.split(",")[0].trim() : headers.get("x-real-ip")) || "";
}

/**
 * Request facts in, a stored event out. Returns null for traffic that should
 * not be counted (bots, prefetches). Pure: no clock, no env, no I/O.
 *
 * @param {{
 *   type: "view" | "click",
 *   link?: string,
 *   headers: Headers,
 *   ref?: unknown,
 *   src?: unknown,
 *   now: number,
 *   salt: string,
 * }} input
 */
export function buildEvent({ type, link, headers, ref, src, now, salt }) {
  const ua = headers.get("user-agent") || "";
  if (isBot(ua)) return null;
  const purpose = `${headers.get("sec-purpose") || ""}${headers.get("purpose") || ""}`;
  if (/prefetch|prerender/i.test(purpose)) return null;

  const country = headers.get("x-vercel-ip-country");
  /** @type {Record<string, unknown>} */
  const event = {
    t: now,
    type,
    country: country && /^[A-Z]{2}$/.test(country) ? country : null,
    device: deviceClass(ua),
    visitor: visitorId({ ip: clientIp(headers), ua, salt, now }),
  };
  if (type === "click") event.link = link;
  if (type === "view") {
    const ownHost = headers.get("x-forwarded-host") || headers.get("host");
    event.ref = refHost(ref, ownHost);
    event.src = cleanSource(src);
  }
  return event;
}
