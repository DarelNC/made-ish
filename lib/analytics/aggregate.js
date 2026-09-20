const DAY = 86_400_000;

/** @param {number} ms */
const dayKey = (ms) => new Date(ms).toISOString().slice(0, 10);

/** @param {Map<string, number>} counts @param {number} limit */
function ranked(counts, limit) {
  return [...counts.entries()]
    .map(([key, n]) => ({ key, n }))
    .sort((a, b) => b.n - a.n || a.key.localeCompare(b.key))
    .slice(0, limit);
}

/** @param {Map<string, number>} m @param {string} k */
const bump = (m, k) => m.set(k, (m.get(k) || 0) + 1);

/** First instant (UTC midnight) of the window that ends today and spans `days` days. */
export function windowStart(now, days) {
  return Date.UTC(...ymd(now)) - (days - 1) * DAY;
}

/** @param {number} ms @returns {[number, number, number]} */
function ymd(ms) {
  const d = new Date(ms);
  return [d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()];
}

/**
 * Events in, numbers out. Pure: it does not know where events came from.
 * Windows are UTC days, so "today" is the UTC day.
 *
 * @param {{ t: number, type: "view" | "click", link?: string, ref?: string | null, src?: string | null, country?: string | null, device?: string, visitor?: string }[]} events
 * @param {{ now: number, days: number, linkIds: string[] }} options
 */
export function summarize(events, { now, days, linkIds }) {
  const since = windowStart(now, days);
  const inWindow = events.filter((e) => e.t >= since && e.t < since + days * DAY);

  const daily = new Map();
  for (let i = 0; i < days; i++) daily.set(dayKey(since + i * DAY), { views: 0, clicks: 0 });

  const viewers = new Set();
  const perLink = new Map(linkIds.map((id) => [id, { clicks: 0, clickers: new Set() }]));
  const from = new Map();
  const countries = new Map();
  const devices = new Map();
  let views = 0;
  let clicks = 0;

  for (const e of inWindow) {
    const bucket = daily.get(dayKey(e.t));
    if (e.type === "view") {
      views++;
      if (bucket) bucket.views++;
      if (e.visitor) viewers.add(e.visitor);
      bump(from, e.src || e.ref || "direct");
      bump(countries, e.country || "unknown");
      bump(devices, e.device || "unknown");
    } else if (e.type === "click" && e.link) {
      clicks++;
      if (bucket) bucket.clicks++;
      if (!perLink.has(e.link)) perLink.set(e.link, { clicks: 0, clickers: new Set() });
      const entry = perLink.get(e.link);
      entry.clicks++;
      if (e.visitor) entry.clickers.add(e.visitor);
    }
  }

  const known = new Set(linkIds);
  const links = [...perLink.entries()]
    .map(([id, v]) => ({
      id,
      clicks: v.clicks,
      clickers: v.clickers.size,
      share: clicks ? v.clicks / clicks : 0,
      removed: !known.has(id),
    }))
    .sort((a, b) => b.clicks - a.clicks || linkIds.indexOf(a.id) - linkIds.indexOf(b.id));

  return {
    since,
    days,
    views,
    visitors: viewers.size,
    clicks,
    clicksPerView: views ? clicks / views : 0,
    links,
    daily: [...daily.entries()].map(([day, v]) => ({ day, ...v })),
    from: ranked(from, 8),
    countries: ranked(countries, 8),
    devices: ranked(devices, 4),
  };
}
