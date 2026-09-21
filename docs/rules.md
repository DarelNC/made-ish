# Rules

Durable project memory. Short on purpose: each concern has its own file, linked below.

## What this is

A one-page link hub (a Linktree-style page) that lists the sites and apps I build, with first-party analytics: page views, visitors, and clicks per link. Deployed on Vercel. Codename `open-tabs`, provisional (see [product.md](product.md)).

## v1 scope

- A mobile-first public page that lists links from a file in the repo.
- Every outbound click goes through `/go/<id>`, which records the click and redirects.
- Page views recorded by a small beacon.
- A private `/stats` page that reads the recorded events.
- Six switchable themes.

What was left out is in [features/README.md](features/README.md).

## Hard rules

- **No third-party runtime services and no paid plans.** Analytics are first-party: our own endpoints, our own storage. Fonts come through `next/font`, which downloads them at build time and serves them from our domain. See [architecture.md](architecture.md).
- **No cookies, no stored IPs, no accounts.** Visitors are counted with a daily-rotating hash. See [product.md](product.md).
- **Tracking never blocks or breaks a redirect.** If recording fails, the visitor still lands where they were going.
- **Links live in `content/site.js`**, not in a database. Adding a link is a commit.
- **Plain JavaScript**, not TypeScript. The tradeoff is covered by keeping the event and aggregation code small, pure and tested. See [stack.md](stack.md).
- **Mobile first.** Design at 375px, then widen.
- **UI work follows [design.md](design.md), and any new UI is checked in all six themes.** Text follows [writing.md](writing.md).
- **Default branch is `master`.**
- **No Claude attribution in commits or PRs**, and commit messages are one line. Enforced by the workspace `CLAUDE.md`.

## Documentation and review are tiered

- **Fast lane:** typos, copy, formatting, small fixes, routine work on something already decided. No doc, no review.
- **Decision lane:** a new dependency, an architecture or stack choice, a scope call, a UX direction. Write it in the doc for its concern in the same unit of work, and do one honest adversarial pass first: the strongest reason it might be wrong. If nothing survives, say so.
- **Publish gate:** docs must be caught up before anything goes public. Run [publishing.md](publishing.md).

## Open decisions

- **Production analytics storage.** The store is an adapter and only `file` (dev) and `none` exist. See [architecture.md](architecture.md#open-decision-production-storage).

## Where the rules came from

Adapted from the workspace rules library (`../rules/`), one file each:

| Library file | Here | Change |
| --- | --- | --- |
| `architecture.md` | [architecture.md](architecture.md) | Upstream and failover sections dropped (there is no upstream API). Kept the "keep pure logic separate from where data comes from" rule and applied it to events and storage. |
| `stack.md` | [stack.md](stack.md) | Rewritten for this deployment shape. |
| `design.md` | [design.md](design.md) | Constraint kept as is. Added the chosen direction and the rejected ones. |
| `writing.md` | [writing.md](writing.md) | Copied. |
| `product.md` | [product.md](product.md) | Naming pass and the no-accounts rule applied to this project. |
| `publishing.md` | [publishing.md](publishing.md) | Copied, mobile section dropped, web section kept. |
| `process.md` | this file | The `docs/` layout is this folder. The tiers are the section above. |
