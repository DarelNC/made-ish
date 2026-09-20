# Design

## Role

When touching UI, act as a senior product UI/UX designer with a strong point of view, not as a tool filling in a scaffold with defaults. Every visual decision (layout, type, color, spacing, motion) is a decision.

## The constraint

**Do not ship anything that looks AI-generated.** Banned when they show up together and untouched: purple-blue gradients, a centered hero with two pill buttons, glassmorphism cards, gradient text, icon-in-a-circle badges from a default set, the three-column feature grid, stock blob backgrounds, one default sans everywhere, neon glow on dark, a fake logo strip.

Self-check before shipping UI work: would this specific choice look identical on a random AI-generated SaaS landing page? If yes, it is not done.

## Direction: chaos and maximalist, five themes

The owner has five poster styles used across their apps (files in [references/](references/)). All five are built as themes on one shared markup, with a picker at the top of the page. The posters are one-off compositions, and this is a link hub that has to work as a tool, so each theme borrows what does a job (ground, type, how a link looks, one or two pieces of decoration) and leaves the poster copy and branding behind.

The first build copied poster #4 whole (rail, caption bar, clock, number headline, quote, footer). The owner rejected it: it read like a social profile card, had no desktop layout, and the lime hurt their eyes. Themes came next.

### The themes

| Theme | Poster | Ground | Links look like | Decoration |
| --- | --- | --- | --- | --- |
| `cream` | 1 | `#f5efe6` paper | ruled rows, orange snap on hover | serif italic "links", one orange bar |
| `maroon` | 2 | dark red gradient over a faint grid | dashed rows, lime snap | scrolling ticker of your links, dashed orbit circle, tape-label tag |
| `newsprint` | 3 | `#e9e1d0` with a dot screen | heavy ruled rows, lime highlight with hard shadow | masthead rules, lime highlighted word, "unfiled" stamp |
| `lime` | 4 | `#e6ff4f` with diagonal hatch | black slabs, orange snap and hard shadow | outlined second word |
| `blueprint` | 5 | `#0e2238` with a drawn grid | bordered parts list, dashed dividers | outlined first word, dimension line, inset frame |

Shared by all five: the inks (`#14100e`, `#f5efe6`, `#ff5a1f`, `#e6ff4f`, plus the navy and maroon grounds), the three type families, the layout, and the 120ms stepped snap on hover.

### How it is built

- **One markup, five blocks of variables.** `app/themes.css` has one block per theme, keyed by `<html data-theme>`. Components read semantic variables (`--bg`, `--fg`, `--slab-bg`, `--snap-bg`, and so on) and never a color. A variable cannot express a ruled row or a ticker, so each block also holds the few overrides it needs. The variable list is at the top of that file.
- **Decoration is always in the markup and hidden by default.** Each theme turns on its own pieces, so nothing is duplicated per theme.
- **Adding a theme** means one block in `themes.css` and one entry in `lib/themes.js`.
- **Contrast:** orange is never small text on lime or cream. It is a fill with ink text on it, or text on ink or navy. The exceptions are the large italic tag and the large "links" word in `cream`, which are big enough for the large-text threshold.

### Choosing and remembering

- **First visit:** a dark OS gets `blueprint`, everything else gets `cream`. Lime was the first default and hurt the owner's eyes, so it is now one option among five.
- **The picker** is five square swatches at the top, each drawn in that theme's two colors. It is a radio group with real labels. The choice is saved in `localStorage`, with no cookie and nothing sent to the server. Blocked or private-mode storage only means the choice lasts until reload.
- **No flash.** A small inline script in `<head>` sets `data-theme` before first paint. It is tested in `lib/__tests__/themes.test.js`.
- `/stats` ignores themes and keeps its own dark look.

### Type

- **Display:** Archivo Black, uppercase, sized to fit its column so a longer name shrinks instead of overflowing.
- **Accent:** Playfair Display, bold italic. Used for the count tag and, in `cream`, for the second headline word.
- **Labels and body:** JetBrains Mono, light and uppercase for labels, regular weight for the bio.

### Layout (mobile first)

- **Under 1024px:** one column. Picker, name and bio, then the links.
- **1024px and up:** two columns, 5 to 7. The name, bio and count stay pinned on the left while the links scroll on the right, inside a 1120px frame.
- Links are at least 72px tall on a phone and 88px on desktop. Retired links stay listed with a strikethrough, because a link page that only shows successes is a brochure.

### Motion

Hard and quick: 120ms, stepped. Nothing fades in on load. The ticker scrolls slowly. `prefers-reduced-motion` stops the ticker and the hover shift. Hover styles only apply on devices that can hover, so a tap on a phone does not leave a link stuck in its snap color.

### Iconography

One custom arrow glyph drawn in SVG. No icon library.

## Reuse check

The five directions come from the owner's own poster set, not from inertia between projects. The monospace reads here as a spec-sheet label, not as a terminal signal.

## Adversarial pass on five themes

Strongest objection: five themes means every new piece of UI has to be checked five times, and only a browser can check it, so the themes will drift and one will quietly break. Answer: the markup is shared and components use variables only, so a new element is styled once, and a theme can only break through its own short block of overrides. The cost is real, though: **any new UI must be looked at in all five themes, on a phone and on desktop, before it ships.** A second objection, that a picker adds noise to a link page, is answered by keeping it small and at the top.
