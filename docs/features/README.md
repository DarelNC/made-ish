# Features

One file per feature. A new feature gets a new doc here and an explicit decision: see [../rules.md](../rules.md) on v1 scope.

- [link-list.md](link-list.md): the public page and its data file. v1.
- [click-tracking.md](click-tracking.md): `/go/<id>` and the view beacon. v1.
- [analytics-dashboard.md](analytics-dashboard.md): the private `/stats` page. v1.
- [theme-picker.md](theme-picker.md): six themes and a picker. Added after the first review.

## Deliberately cut from v1

- **An admin UI to add and edit links.** Links are a file in the repo. An editor needs auth, storage and a form, all to save one commit. Revisit only if editing from a phone becomes a real need.
- **Multiple users or pages.** One owner, one page. See [../product.md](../product.md).
- **Link scheduling, A/B ordering, custom domains per link.** Nothing here needs them.
- **Social embeds, music players, email capture.** They are third-party scripts, which the hard rules forbid, and email capture is PII.
- **Live visitor counter.** Needs a persistent connection, and the answer is always "one".

## Backlog

- Production storage adapter (blocked on the decision in [../architecture.md](../architecture.md#open-decision-production-storage)).
- Open Graph image and a real favicon that matches the brand.
- `sitemap.xml`, `robots.txt` (partly done), `llms.txt`, JSON-LD.
- A private stats site that is separate from the public one, or stronger protection for `/stats` than one shared token. See [analytics-dashboard.md](analytics-dashboard.md).
- Per-link sparkline on `/stats`.
- CSV export of events.
- Browser `theme-color` that follows the chosen theme.
- A sarcastic rewrite of the page copy.
