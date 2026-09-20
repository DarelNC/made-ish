# Analytics dashboard

The private page at `/stats`. Status: v1.

## What it shows

For the last 7, 30 or 90 days (`?days=`):

- Views, unique visitors, clicks, and click-through (clicks divided by views).
- Clicks per link, with a bar, unique clickers and each link's share of all clicks. Links with no clicks are still listed, at zero.
- Views and clicks per day.
- Top referrers, countries and device classes.
- Which store is active. If it is `none`, the page says nothing is being recorded, in place of showing zeros that look like real data.

## Access

One shared secret, `STATS_TOKEN`. The page shows a form, a server action compares the input to the env value in constant time, and on success sets an httpOnly, SameSite=Strict cookie holding a hash of the token. See [../product.md](../product.md) for why this is not an account system.

- In development with no `STATS_TOKEN` set, the page is open.
- In production with no `STATS_TOKEN` set, the page returns 404.
- The page is `noindex` and disallowed in `robots.txt`.

## Decisions

- **Server-rendered on request, no client fetching.** The events never leave the server except as already-summarized numbers.
- **Summaries are computed from the raw events each time.** Fine for a personal page. If the event count ever makes this slow, the store adapter is the place to add rollups, and `summarize` stays the same.
- **Bars are CSS**, no chart library. See [../stack.md](../stack.md).

## Later

One shared token is enough for a personal page but is the weakest part of the setup. Two ways to harden it, neither started: a stronger gate in front of `/stats`, or moving the dashboard out of the public deploy into its own private app that reads from the same store. The second makes sense once the production store is chosen.
