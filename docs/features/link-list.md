# Link list

The public page at `/`. Status: v1.

## What it does

Shows a short headline, a bio and a link count, and one tile or row per entry in `content/site.js`. The page carries no personal name or handle. It is a static page: no request-time work, served from the CDN. Layout is one column on phones and two on desktop, and it can be switched between six themes, see [../design.md](../design.md) and [theme-picker.md](theme-picker.md).

## Data

`content/site.js` exports `profile` (`headline`, a pair of short words, and `bio`) and `links`.

```js
{
  id: "coined",            // stable, used in /go/<id> and in stored events
  title: "Coined",
  url: "https://coined.vercel.app",
  blurb: "Variable names from real public code.",
  kind: "web",             // "web" | "app" | "repo" | "other"
  status: "live",          // "live" | "wip" | "retired"
  mark: "¢",              // optional: the big glyph on the tile (defaults to the first letter)
  look: { color: "pink" }, // optional: override color, pattern, shape or size
}
```

Order in the file is the order on the page. An `id` must never be reused for a different link, because old events reference it.

## Decisions

- **The count and the status summary are derived** from the list, so the page never says a number that is wrong.
- **Every slab links to `/go/<id>`, not to the real URL.** That is what makes clicks countable. The cost is that right-click "copy link" gives the redirect URL. Accepted.
- **Slabs are plain anchors**, not `next/link`, so nothing is prefetched and a prefetch cannot count as a click.
- **Each link has its own look.** In the default theme, `lib/look.js` picks a color, pattern, shape, size and tilt for each link from its position, so neighbours always differ, and `mark` gives it a glyph. Long titles always get a wide tile. `look` in the data overrides any of them. The other themes ignore all of this and show a uniform list.
