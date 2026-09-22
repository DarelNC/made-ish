// Sends events to the collector (single-point-of-failure, modules/analytics)
// instead of keeping them here. Write only: reading happens on the separate
// private dashboard, which calls the collector's own summary endpoint
// directly. See docs/architecture.md, "Open decision: production storage".
const TIMEOUT_MS = 3000;

/**
 * @param {{ url: string, key: string }} config
 *   `url` is the collector's origin, e.g. "https://backend.hexstock.com".
 *   `key` is this project's key in the collector's ANALYTICS_PROJECTS.
 */
export function remoteStore({ url, key }) {
  return {
    name: "remote",
    /** @param {object} event */
    async append(event) {
      try {
        const res = await fetch(`${url}/collect`, {
          method: "POST",
          headers: { "content-type": "application/json", "x-api-key": key },
          body: JSON.stringify(event),
          signal: AbortSignal.timeout(TIMEOUT_MS),
        });
        if (!res.ok) console.error(`analytics: collector answered ${res.status}`);
      } catch (err) {
        // The collector being down or slow must never be the reason a visitor
        // waits on a redirect. record() also catches, this is defense in depth
        // and gives a clearer log line than record()'s generic one.
        console.error("analytics: could not reach the collector", err);
      }
    },
    /**
     * Nothing reads through this store. The dashboard reads the collector's
     * own summary endpoint, which does its own aggregation, so pulling raw
     * events back into a Vercel function would just duplicate that work.
     */
    async read() {
      return [];
    },
  };
}
