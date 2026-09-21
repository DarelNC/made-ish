# Theme picker

Six visual themes and a control to switch between them. Status: v1. The reasoning and the theme table are in [../design.md](../design.md).

## What it does

A row of six square swatches at the top of the page. Tapping one switches the whole page at once. The choice is remembered on that device.

## Flow

1. An inline script in `<head>` runs before first paint and sets `<html data-theme>`. A saved, valid choice wins. Otherwise a dark OS gets `blueprint` and everything else gets `zine`.
2. `ThemePicker` reads the attribute, renders the swatches, and on a tap writes the new attribute and saves it to `localStorage` under `madeish-theme`.
3. CSS in `app/themes.css` does the rest. No component knows which theme is active.

## Decisions

- **Stored in `localStorage`, not a cookie.** Nothing about the choice reaches the server, so it stays inside the no-cookies rule in [../product.md](../product.md).
- **The picker is a client component and the page is still static.** The server always renders `zine`, the script corrects it before paint, and `suppressHydrationWarning` on `<html>` covers the one attribute that differs.
- **Analytics do not record the chosen theme.** It would be a fun number and it is not needed. Revisit if you want to know which theme people pick.
- **`/stats` ignores themes.**

## Not done

- The browser's `theme-color` (the tint of the mobile address bar) does not follow the theme yet.
