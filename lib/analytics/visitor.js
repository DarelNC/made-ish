import { createHash } from "node:crypto";

/**
 * A daily-rotating, non-reversible visitor id. The address is used here and
 * never stored. See docs/product.md.
 * @param {{ ip: string, ua: string, salt: string, now: number }} input
 */
export function visitorId({ ip, ua, salt, now }) {
  const day = new Date(now).toISOString().slice(0, 10);
  return createHash("sha256").update(`${salt}|${day}|${ip}|${ua}`).digest("hex").slice(0, 16);
}
