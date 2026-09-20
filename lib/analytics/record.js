import { buildEvent } from "./event.js";
import { getStore } from "./store/index.js";

/**
 * Build an event from a request and store it. Never throws: recording is a
 * side effect and must not be able to break a redirect or a page.
 * @param {Omit<Parameters<typeof buildEvent>[0], "now" | "salt">} input
 */
export async function record(input) {
  try {
    const event = buildEvent({
      ...input,
      now: Date.now(),
      salt: process.env.VISITOR_SALT || "open-tabs",
    });
    if (event) await getStore().append(event);
  } catch (err) {
    console.error("analytics: could not record event", err);
  }
}
