# Product

## Name: made-ish

Chosen 2026-09-21 after two collision rounds (see below). It was `open-tabs` while it was a codename. The hyphen is part of the name: it makes "made" and "ish" readable as two words for people who do not know the suffix, and it is free on every registry checked.

The page shows no personal name or handle. It shows the project name, made-ish, top left (`profile.brand` in `content/site.js`), then the headline and bio.

### Naming checks so far

**`zine` (checked 2026-09-21): crowded, not a good project name.** The word is generic and already used by developer tools in the same space.

- **Closest collisions:** `kristoff-it/zine`, a Zig static site generator for personal sites and blogs (about 1.6k stars, zine-ssg.io), and `zineland/zine`, a Rust magazine builder (about 900 stars). A repo called `zine` would sit beside them in every GitHub search.
- **Taken:** the npm package `zine` (an old pub/sub library) and `zine-cli`, the GitHub user `zine`, `zine.vercel.app` and `zine-app.vercel.app`, and an App Store writing app called Zine.
- **Domains (DNS check only, not authoritative):** `zine.com`, `.app` (for sale), `.dev`, `.io`, `.me`, `.page`, `.to`, `.fyi`, `getzine.com` (for sale), `usezine.com` and `zine.studio` are registered. No DNS records were found for `zine.link`, `zine.so`, `zine.bio`, `zinehq.com` and `zines.link`, which may be free or parked. Verify at a registrar.
- **Trademark:** not searched at the USPTO or EUIPO. A web search found only an abandoned "Innovative Digital Zine" filing.
- **Fine as a theme name.** Inside the app, "Zine" is only the name of one look, so none of this matters there. It matters for the repo, the package and the domain.

**Second round (checked 2026-09-21): `made-ish`, `halfdone`, `sundry`.**

| Name | npm | GitHub user | GitHub repos | `.vercel.app` | Domains (DNS only) | Other |
| --- | --- | --- | --- | --- | --- | --- |
| `made-ish` | free (`made-ish`, `madeish`) | free | none named this | free | every TLD tried has no DNS, including `made-ish.com`, `.app`, `.dev`, `.io`, `.link` | `madeish.com` is registered. A merch brand called "Madeish" (madeinyourbrand.com) turned up in one web search, unrelated field |
| `halfdone` | free | taken (empty account) | 26, none notable | `halfdone` free, `half-done` taken | `.com` and `.dev` registered, others no DNS | **Halfdone Development** (halfdone.com) is a software company, tagline "because programs are never done". Same field and nearly the same joke. Avoid |
| `sundry` | taken (a reverse proxy) | taken (empty account) | 494, top one has 60 stars | taken (a branding studio) | `.com`, `.app`, `.dev`, `.io`, `.me`, `.page`, `.studio` registered, `.link`, `.so`, `.bio` no DNS | crowded |

**Result:** `made-ish` is the only clean one. The hyphen is what makes it work: it reads as "made" plus "ish" for readers who do not know the suffix, and it is free on every registry checked. The apostrophe idea does not survive URLs, package names or repo names, so it is out. DNS results are not authoritative.

## What it is for

A place to list the webs, apps and similar things I build, so one link can point to all of them, with numbers on what people actually open. It is a personal page. It is not a multi-user product, not a Linktree competitor, and has no plan to become one.

## No accounts, no PII

There is one owner and no visitor accounts. Visitors are never asked for anything and never get a cookie.

**What is recorded per event:** time, event type, link id, referrer host, country (from the platform header), a coarse device class, and a visitor hash.

**The visitor hash** is the first 16 hex characters of `sha256(daySalt + ip + userAgent)`, where `daySalt` is the UTC date plus a secret `VISITOR_SALT`. The IP is used to compute the hash in memory and is never stored. Because the date changes the salt, the same person cannot be followed from one day to the next, and the hash cannot be reversed to an address once the secret is gone. This is the same approach Plausible documents, applied to a much smaller system.

**Do Not Track** is honoured by the beacon: if the browser sends it, no view is recorded. Clicks go through a redirect the browser makes on its own, so they cannot be skipped this way, and they carry the same data-minimal event.

## The owner login is a decision, not a default

`/stats` is protected by one shared secret (`STATS_TOKEN`), entered once in a form and remembered in an httpOnly cookie. That is deliberately not an account system: one person, no signup, no password reset, nothing to store. If a second person ever needs access, that is a new decision with its own entry here.
