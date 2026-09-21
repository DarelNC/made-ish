# made-ish

A one-page link hub for the sites and apps I build, with click and visit analytics that run on the same deploy. Mobile first, no cookies, no third-party scripts.

There is no live demo yet.

## Run it

```bash
git clone https://github.com/DarelNC/made-ish.git
cd made-ish
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Events are written to `.data/events.ndjson` in development, and `/stats` is open when no token is set.

Copy `.env.example` to `.env.local` to set a stats token or change where events go.

## Make it yours

Everything on the page comes from [`content/site.js`](content/site.js): a profile and a list of links. Add a link, commit, deploy. The page has six themes and a picker at the top. New visitors get a light or dark one to match their system, and the choice is remembered on their device. The default theme gives every link its own color, pattern, shape and glyph.

## How the analytics work

Every link on the page points to `/go/<id>`. That route answers with a redirect and records the click after it, so a failing store cannot slow anyone down. A small beacon records one view per page load. `/stats` shows views, visitors, clicks per link, a daily series, referrers, countries and devices.

No cookies are set, no IP address is stored, and bots and prefetches are dropped. Visitors are counted with a hash that changes every day. The details are in [`docs/product.md`](docs/product.md).

Production storage is not decided yet. On Vercel there is no durable disk, so the hosted version runs with a store that records nothing, and `/stats` says so. The options are in [`docs/architecture.md`](docs/architecture.md).

## Stack

Next.js 16 (App Router), plain JavaScript, Tailwind CSS 4 and Vitest. Fonts are downloaded at build time and served from the same domain. Reasons for each choice are in [`docs/stack.md`](docs/stack.md).

```bash
npm run lint
npm test
```

## Docs

Decisions are written down in [`docs/`](docs/): rules, architecture, stack, design, writing, product, and one file per feature.

## License

MIT. See [`LICENSE`](LICENSE).
