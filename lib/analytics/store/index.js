import path from "node:path";
import { fileStore } from "./file.js";
import { noneStore } from "./none.js";
import { remoteStore } from "./remote.js";

/**
 * The store is chosen in one place. Adding a backend means adding a file in
 * this folder that exposes `{ name, append(event), read(since) }` and one line
 * here. Nothing else in the app knows which store is active.
 */
export function getStore() {
  const fallback = process.env.NODE_ENV === "production" ? "none" : "file";
  const choice = process.env.ANALYTICS_STORE || fallback;
  if (choice === "file") {
    return fileStore(process.env.ANALYTICS_FILE || path.join(process.cwd(), ".data", "events.ndjson"));
  }
  if (choice === "remote") {
    const url = process.env.COLLECTOR_URL;
    const key = process.env.COLLECTOR_KEY;
    if (!url || !key) {
      console.error("analytics: ANALYTICS_STORE=remote needs COLLECTOR_URL and COLLECTOR_KEY, falling back to none");
      return noneStore;
    }
    return remoteStore({ url, key });
  }
  return noneStore;
}
