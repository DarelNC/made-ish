# Design

## Role

When touching UI, act as a senior product UI/UX designer with a strong point of view, not as a tool filling in a scaffold with defaults. Every visual decision (layout, type, color, spacing, motion) is a decision.

## The constraint

**Do not ship anything that looks AI-generated.** Banned when they show up together and untouched: purple-blue gradients, a centered hero with two pill buttons, glassmorphism cards, gradient text, icon-in-a-circle badges from a default set, the three-column feature grid, stock blob backgrounds, one default sans everywhere, neon glow on dark, a fake logo strip.

Self-check before shipping UI work: would this specific choice look identical on a random AI-generated SaaS landing page? If yes, it is not done.

## Direction: chaos and maximalist, acid lime

The owner has five poster styles used across their apps (files in [references/](references/)). This project starts from **#4, acid lime**, and takes elements from it instead of reproducing it. The poster is a one-off composition. This is a link hub that has to work as a tool, so it borrows the parts that do a job and leaves the rest.

**Taken from the poster:** the lime ground with diagonal hatch, black slabs that snap to orange with a hard shadow, the shouting display type with an outlined second line, the orange italic serif in a black box, the light uppercase mono for labels, the palette.

**Left behind on purpose:** the vertical rail, the top caption bar and clock, the spelled-out number headline, the big counter box, the pull quote, the poster footer, and any copy or branding that belonged to that one poster. Those made the page read as a social profile card. A link page needs to get someone to a link in one screen.

| Token | Value | Use |
| --- | --- | --- |
| `lime` | `#e6ff4f` | Page ground, accent text on black |
| `ink` | `#14100e` | Slabs, type on lime |
| `orange` | `#ff5a1f` | Hover fill, "in progress" chips, the italic tag |
| `bone` | `#f5efe6` | Numbers and titles on the stats page |

Contrast rules that follow from the values: orange is never text on lime (about 2:1). It is a fill with ink text on it, or text on ink. Lime text on ink and ink text on lime are both well above AA.

### Type

- **Display:** Archivo Black. Uppercase, tight leading. Solid on one line, outlined (`-webkit-text-stroke`) on the next. Sized to fit its column, so a longer name shrinks instead of overflowing.
- **Accent:** Playfair Display, bold italic, lowercase. Used once, in the orange tag.
- **Labels and body:** JetBrains Mono. Light and uppercase for labels, regular weight for the bio. Its slashed zero matches the posters.

### Layout (mobile first)

- **Under 1024px:** one column. Name and bio on top, then the links. The first link is visible without scrolling on a phone.
- **1024px and up:** two columns, 5 to 7. The name, bio and count stay pinned on the left while the links scroll on the right, inside a 1120px frame.
- **Links are black slabs** with an index, a kind and status chip, a title and a one-line blurb. They are at least 72px tall on a phone and 88px on desktop. Hover, focus and press fill them orange and shift them with a hard offset shadow.
- Retired links stay listed with a strikethrough. A link page that only shows successes is a brochure.

### Motion

Hard and quick: 120ms, stepped. Slabs snap to their hover state. Nothing fades in on load. `prefers-reduced-motion` removes the shift. Hover styles only apply on devices that can hover, so a tap on a phone does not leave a slab stuck in orange.

### Iconography

One custom arrow glyph drawn in SVG for outbound links. No icon library.

## Reuse check

This direction comes from the owner's own poster set, not from inertia between projects. The monospace reads here as a spec-sheet label, not as a terminal signal.

## Tried and not chosen (kept for later)

Only the winner is implemented. The others are recorded so they can come back as themes on purpose.

- **#1 cream editorial:** giant black numeral on cream with a single orange bar and a ruled list. Calmest of the five. Best candidate for a "quiet" theme.
- **#2 maroon marquee:** dark red gradient, dashed orbit circles, a scrolling ticker and a tape label. Most chaotic, weakest legibility for a long list.
- **#3 newsprint halftone:** dot-screen paper, masthead rules, a stamp. Strong editorial feel, but needs two columns to work, which fights mobile first.
- **#5 blueprint navy:** engineering drawing with a parts list and dimension lines. The parts list is a natural link list. Runner-up.

## Decision log

- **First build copied poster #4 whole** (rail, caption bar, clock, number headline, quote, footer). Rejected by the owner: it read like an Instagram page and not like a link hub, and it had no desktop layout. Rebuilt as above.
