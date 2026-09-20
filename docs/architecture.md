# Architecture

## Shape

One Next.js app, one Vercel deploy. No separate service.

```
visitor ── GET /            static page (links, headline, counts derived from content/site.js)
   │          └─ beacon ──▶ POST /api/hit       records a "view"
   │
   └─ tap a link ─────────▶ GET /go/<id>        records a "click", then 302 to the real URL

owner ──── GET /stats       server-rendered, token gated, reads events and summarizes them
```

The public page is static, so it is served from the CDN and costs no function invocation. Views are recorded by a tiny client beacon instead of by server-rendering the page. That also filters out most bots for free, since they do not run JavaScript.

## Three layers, kept apart

1. **`buildEvent`** (pure): request facts in (headers, referrer, path, time), a normalized event out. Knows nothing about storage.
2. **A store adapter**: `append(event)` and `read({ since })`. Knows nothing about what an event means.
3. **`summarize`** (pure): a list of events in, totals, per-link numbers and series out. Knows nothing about where events came from.

Each layer is unit-tested without a network or a disk. Swapping the store never touches the other two, which is what makes the open decision below cheap to change later.

## Event shape

```js
{
  t: 1789900000000,        // ms since epoch, server clock
  type: "view" | "click",
  link: "coined",          // click only
  ref: "news.ycombinator.com" | null,   // view only, host only, own host removed
  src: "newsletter" | null,             // view only, from ?ref= or ?utm_source=
  country: "ES" | null,    // from the x-vercel-ip-country header
  device: "mobile" | "tablet" | "desktop",
  visitor: "9f2c1a...",    // 16 hex chars, see product.md
}
```

Nothing else is stored. No IP, no full user agent, no full URL, no query string beyond `src`.

## Tracking must not break the product

- `/go/<id>` computes the redirect first and records inside `after()`, so a slow or failing store cannot delay or cancel the redirect. The recording is also wrapped in a try/catch.
- Known bots (by user agent) and prefetch requests are dropped before they reach the store.
- An unknown `<id>` redirects to `/`.

## Known limits

- **Spoofable.** Anyone can POST fake views to `/api/hit` or fetch `/go/<id>` in a loop. For a personal link page that is acceptable. If it ever matters, the fix is rate limiting at the store, not more client code.
- **Unique visitors are approximate.** The hash rotates daily and mixes IP and user agent, so one person on two networks counts twice and two people on one office network with the same browser count once.

## Open decision: production storage

Vercel functions have no durable disk, so the `file` adapter only works in development. Until this is decided, production runs the `none` adapter: links, redirects and the public page all work, and nothing is recorded. `/stats` says so.

Options, with the constraint "no third-party services, no paid plans":

| Option | Fits the constraint | Cost | Notes |
| --- | --- | --- | --- |
| Free Vercel Marketplace store (Upstash Redis, Neon Postgres) | Partly. It is a free tier, but it is a third-party account and its limits and terms are the vendor's. | 0 | Least work. One env var and one adapter file. |
| Own collector: a small process with SQLite on a box I already own (Raspberry Pi, old laptop, VPS) | Yes | 0 if the box exists | Second deployable that has to stay up. The adapter would POST to it, or `/stats` would read from it. |
| Vercel Web Analytics | Vercel is already the host | 0 on Hobby, but check the current plan limits | Built for page views. Per-link click events and data export are the parts to verify before relying on it. |
| Run `next start` on my own machine | Yes | 0 | Gives up Vercel, which is a stated requirement. |

No choice made yet. The adapter interface is the same for all of them.
