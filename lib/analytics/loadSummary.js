import { links } from "../../content/site.js";
import { summarize, windowStart } from "./aggregate.js";
import { getStore } from "./store/index.js";

/** Read the active store and summarize the last `days` days. */
export async function loadSummary(days) {
  const store = getStore();
  const now = Date.now();
  const summary = summarize(await store.read(windowStart(now, days)), {
    now,
    days,
    linkIds: links.map((l) => l.id),
  });
  return { storeName: store.name, summary };
}
