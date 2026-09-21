# Product

## Name: provisional

`open-tabs` is a working codename, picked because a list of links reads as a set of open tabs. Before this goes public: check collisions, and check the domain and handle. Until then it is not settled, however long it has been in the file names.

The page shows no personal name or handle, only the headline and bio in `content/site.js`. The project name only shows up in the repo and package.

## What it is for

A place to list the webs, apps and similar things I build, so one link can point to all of them, with numbers on what people actually open. It is a personal page. It is not a multi-user product, not a Linktree competitor, and has no plan to become one.

## No accounts, no PII

There is one owner and no visitor accounts. Visitors are never asked for anything and never get a cookie.

**What is recorded per event:** time, event type, link id, referrer host, country (from the platform header), a coarse device class, and a visitor hash.

**The visitor hash** is the first 16 hex characters of `sha256(daySalt + ip + userAgent)`, where `daySalt` is the UTC date plus a secret `VISITOR_SALT`. The IP is used to compute the hash in memory and is never stored. Because the date changes the salt, the same person cannot be followed from one day to the next, and the hash cannot be reversed to an address once the secret is gone. This is the same approach Plausible documents, applied to a much smaller system.

**Do Not Track** is honoured by the beacon: if the browser sends it, no view is recorded. Clicks go through a redirect the browser makes on its own, so they cannot be skipped this way, and they carry the same data-minimal event.

## The owner login is a decision, not a default

`/stats` is protected by one shared secret (`STATS_TOKEN`), entered once in a form and remembered in an httpOnly cookie. That is deliberately not an account system: one person, no signup, no password reset, nothing to store. If a second person ever needs access, that is a new decision with its own entry here.
