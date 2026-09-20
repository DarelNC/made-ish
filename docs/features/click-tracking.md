# Click tracking

`GET /go/<id>` and `POST /api/hit`. Status: v1. Architecture in [../architecture.md](../architecture.md).

## Flow

**Click:** the browser requests `/go/<id>`. The handler looks up the link, answers `302` to its URL with `Cache-Control: no-store`, and records a `click` event in `after()`. An unknown id redirects to `/`.

**View:** the page loads a small client component that sends one `sendBeacon` to `/api/hit` with the referrer and the `ref` or `utm_source` query value. It skips the beacon when Do Not Track is on. The handler answers `204`.

## Dropped before recording

- User agents that look like bots or link previewers.
- Requests with a prefetch purpose header.
- A beacon body that is not JSON, or is larger than 1KB.

## Decisions

- **Redirect first, record after.** A store outage or a slow write must never delay a redirect. See the failure rules in [../architecture.md](../architecture.md#tracking-must-not-break-the-product).
- **`302`, not `301`.** A `301` gets cached by browsers and the next click would skip the server and never be counted.
- **No `?ref=` on outbound links.** Adding a parameter to someone else's URL is not ours to do.
- **Referrer is stored as a host**, without path or query, and the page's own host is removed.

## Not handled

Duplicate clicks from a double tap count twice. Real double taps are rare enough that de-duplicating would cost more than it saves.
