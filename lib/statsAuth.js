import { createHash, timingSafeEqual } from "node:crypto";

export const STATS_COOKIE = "ot_stats";

/** @param {string} token */
export function cookieValue(token) {
  return createHash("sha256").update(`open-tabs:stats:${token}`).digest("hex");
}

/**
 * Constant-time comparison. Both sides are hashed first so the buffers always
 * have the same length.
 * @param {string | undefined} input
 * @param {string | undefined} expected
 */
export function tokenMatches(input, expected) {
  if (!input || !expected) return false;
  return timingSafeEqual(Buffer.from(cookieValue(input)), Buffer.from(cookieValue(expected)));
}

/**
 * @param {string | undefined} cookie value of STATS_COOKIE
 * @param {string | undefined} token STATS_TOKEN from the environment
 */
export function cookieAuthorized(cookie, token) {
  if (!cookie || !token) return false;
  const a = Buffer.from(cookie);
  const b = Buffer.from(cookieValue(token));
  return a.length === b.length && timingSafeEqual(a, b);
}
