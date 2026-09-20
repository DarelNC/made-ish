# Publishing rules

Copied from the workspace rules library. The mobile section is dropped. Project-specific additions are at the end.

Run this checklist before a repo becomes public, and again before posting a link anywhere. Tick items off in the project's untracked `next-steps.md`, not in the repo. Every item comes from a real miss or check in this workspace.

## Identity and history

- **Every commit uses the public identity** (`DarelNC <darelchcrespo@hotmail.com>`). Check every branch with `git log --all --format='%an <%ae>' | sort | uniq -c`. Commits made on another machine carry that machine's git config, so set `user.name` and `user.email` globally on every machine before committing there.
- **No Claude or AI attribution** in commits or PRs: no author, co-author or "Generated with" line.
- **Scan the full history for secrets**, not only the current tree: API keys, tokens (`ghp_`, `github_pat_`), private key blocks, keystores, `.env` files, `google-services.json`, `local.properties`.
- **No personal absolute paths** committed.
- **Bad history means a rewrite and a force push.** Do it before the repo has forks or stars, get explicit approval each time, and push every branch that contains the bad commits.

**Origin:** caffeinated had three commits under a second email because they were made on a Linux machine with its own git config. Coined's whole history was rewritten for the same reason.

## Repo files

- **LICENSE** (MIT unless there's a reason otherwise) and a **README** that follows the section below.
- **`.gitignore`** covers dependencies, build output, `.env*` (except `.env.example`) and local notes such as `next-steps.md`.
- **`.env.example`** contains no real values.
- **Package metadata** is filled in: description, author, license, repository, bugs, and homepage (the live URL if deployed).
- **Placeholder identifiers are replaced.** Package names and working codenames (see the naming pass in [product.md](product.md)), and the placeholder profile and links in `content/site.js`.
- **Community files as the project warrants:** `CONTRIBUTING.md`, `SECURITY.md`, `CODE_OF_CONDUCT.md`. Needed for anything that invites outside contributions, optional for a small toy.
- **CI** runs install, lint and tests on push and PR to the default branch. Its job name is what branch protection requires.

## README

- **Written for visitors, not for you.** Notes to yourself (naming reminders, "before this goes public") belong in `docs/` or `next-steps.md`.
- **The first sentence says what the thing is.** Then how to run or use it, the stack, and the license.
- **Live demo link if deployed.** If there's no release or demo, say so in one plain line.
- **Real screenshots** for anything with a UI.
- **Every claim checked against the code:** versions, features, permissions, scripts. A stale README is the most common miss (congrats-probably said React 18 while `package.json` had 19).
- **Follows [writing.md](writing.md).**

## Docs and text

- **Read `docs/` once as a stranger would.** Nothing personal, nothing embarrassing, nothing that only makes sense to you.
- **Run the writing.md self-check on every tracked text file**, not only the README: docs, `CONTRIBUTING.md`, `SECURITY.md`, `llms.txt`, code comments and UI strings. `git ls-files | xargs grep -l -e "$(printf '\xe2\x80\x94')" -e "$(printf '\xe2\x80\x93')"` finds the dashes.
- **Generated files are exempt** (for example `AGENTS.md`, which `next dev` rewrites). Don't fight the generator.

## GitHub settings

- **About:** a one-sentence description, the website (the live URL, or empty), and 6 to 10 topics covering language, framework and purpose.
- **Default branch is `master`** (see [stack.md](stack.md)). Other branches can hold work in progress, but the default must always be presentable.
- **Branch protection on the default branch:** require a PR, one approval and the CI check. Leave admin bypass on so the owner can still push directly, and leave force pushes off.
- **Private vulnerability reporting** enabled if `SECURITY.md` points to it.

## Web projects

- **Deployed and checked in production**, not only locally. New routes can 404 for a minute after a deploy because of edge caching, so recheck before assuming a bug.
- **Favicon that matches the brand, Open Graph image, page title and description**, plus `sitemap.xml`, `robots.txt`, `llms.txt` and JSON-LD where they fit.
- **Deploy only from the default branch.** On Vercel, set the Ignored Build Step to build production only.
- **Environment variables live in the host**, never in the repo.

## Last check, then post

- **Open the repo logged out in a private window.** The README renders, links work, images load.
- **Post only after every item above is done.** Pick the places deliberately (Show HN, social, relevant subreddits).

## Project-specific

- **`STATS_TOKEN` and `VISITOR_SALT` are set in Vercel**, both long and random. Without `STATS_TOKEN`, `/stats` returns 404 in production. Without `VISITOR_SALT`, the visitor hash falls back to a fixed string and is weaker.
- **The production storage decision is made** (see [architecture.md](architecture.md#open-decision-production-storage)), or the README says plainly that analytics are not recorded in the hosted version.
- **Click a link on the deployed page** and confirm the event appears in `/stats`.
- **The design references** in `docs/references/` are the owner's own posters. Keep them only if that is intended to be public.
