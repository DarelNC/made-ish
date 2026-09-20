# Link list

The public page at `/`. Status: v1.

## What it does

Shows the owner's name, bio and a link count next to a list of links, one per entry in `content/site.js`. It is a static page: no request-time work, served from the CDN. Layout is one column on phones and two on desktop, and it can be switched between five themes, see [../design.md](../design.md) and [theme-picker.md](theme-picker.md).

## Data

`content/site.js` exports `profile` (`name`, `handle`, `bio`) and `links`.

```js
{
  id: "coined",            // stable, used in /go/<id> and in stored events
  title: "Coined",
  url: "https://coined.vercel.app",
  blurb: "Variable names from real public code.",
  kind: "web",             // "web" | "app" | "repo" | "other"
  status: "live",          // "live" | "wip" | "retired"
}
```

Order in the file is the order on the page. An `id` must never be reused for a different link, because old events reference it.

## Decisions

- **The count and the status summary are derived** from the list, so the page never says a number that is wrong.
- **Every slab links to `/go/<id>`, not to the real URL.** That is what makes clicks countable. The cost is that right-click "copy link" gives the redirect URL. Accepted.
- **Slabs are plain anchors**, not `next/link`, so nothing is prefetched and a prefetch cannot count as a click.
