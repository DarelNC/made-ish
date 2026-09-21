import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { links } from "@/content/site";
import { loadSummary } from "@/lib/analytics/loadSummary";
import { STATS_COOKIE, cookieAuthorized } from "@/lib/statsAuth";
import { login, logout } from "./actions";

export const metadata = {
  title: "Stats",
  robots: { index: false, follow: false },
};

const RANGES = [7, 30, 90];
const pct = (x) => `${(x * 100).toFixed(x > 0 && x < 0.1 ? 1 : 0)}%`;
const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
const titleOf = (id) => links.find((l) => l.id === id)?.title ?? id;

export default async function Stats({ searchParams }) {
  const { days: rawDays, e } = await searchParams;
  const token = process.env.STATS_TOKEN;
  const devOpen = !token && process.env.NODE_ENV !== "production";
  if (!token && !devOpen) notFound();

  if (!devOpen) {
    const cookie = (await cookies()).get(STATS_COOKIE)?.value;
    if (!cookieAuthorized(cookie, token)) return <Gate failed={Boolean(e)} />;
  }

  const days = RANGES.includes(Number(rawDays)) ? Number(rawDays) : 30;
  const { storeName, summary: s } = await loadSummary(days);

  const maxClicks = Math.max(1, ...s.links.map((l) => l.clicks));
  const maxDay = Math.max(1, ...s.daily.map((d) => Math.max(d.views, d.clicks)));

  return (
    <div className="min-h-dvh bg-ink">
      <main className="mx-auto max-w-[760px] px-5 py-8 text-lime">
        <header className="flex items-start justify-between gap-4">
          <div>
            <p className="label text-lime/60">Private</p>
            <h1 className="mt-2 font-display text-5xl uppercase leading-none text-bone">Stats</h1>
          </div>
          {!devOpen && (
            <form action={logout}>
              <button className="label border border-lime/40 px-3 py-2 hover:bg-lime hover:text-ink">Lock</button>
            </form>
          )}
        </header>

        <nav className="mt-6 flex gap-2" aria-label="Range">
          {RANGES.map((r) => (
            <a
              key={r}
              href={`/stats?days=${r}`}
              aria-current={r === days ? "page" : undefined}
              className={`label px-3 py-2 ${r === days ? "bg-lime text-ink" : "border border-lime/40 hover:border-lime"}`}
            >
              {r} days
            </a>
          ))}
        </nav>

        {storeName === "none" && (
          <p className="mt-6 border-2 border-orange p-4 text-sm text-orange">
            No store is configured, so nothing is being recorded and every number below is zero. See
            docs/architecture.md, &ldquo;Open decision: production storage&rdquo;.
          </p>
        )}

        <section className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Tile label="Views" value={s.views} />
          <Tile label="Visitors" value={s.visitors} />
          <Tile label="Clicks" value={s.clicks} accent />
          <Tile label="Clicks per view" value={s.clicksPerView.toFixed(2)} />
        </section>

        <section className="mt-12">
          <h2 className="label text-lime/60">Clicks per link</h2>
          <ul className="mt-3 space-y-3">
            {s.links.map((l) => (
              <li key={l.id}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <span
                    className={`font-display text-lg uppercase ${l.removed ? "text-lime/50 line-through" : "text-bone"}`}
                  >
                    {titleOf(l.id)}
                  </span>
                  <span className="label whitespace-nowrap text-lime/70">
                    {plural(l.clicks, "click", "clicks")} / {plural(l.clickers, "person", "people")} / {pct(l.share)}
                  </span>
                </div>
                <div className="mt-1.5 h-3 bg-lime/10">
                  <div className="h-full bg-orange" style={{ width: `${(l.clicks / maxClicks) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="label text-lime/60">Per day (UTC)</h2>
          <div
            className="mt-3 flex h-40 items-end gap-px"
            role="img"
            aria-label={`Views and clicks per day, last ${days} days`}
          >
            {s.daily.map((d) => (
              <div
                key={d.day}
                className="flex h-full min-w-0 flex-1 items-end gap-px"
                title={`${d.day}: ${d.views} views, ${d.clicks} clicks`}
              >
                <div className="w-1/2 bg-lime/40" style={{ height: `${(d.views / maxDay) * 100}%` }} />
                <div className="w-1/2 bg-orange" style={{ height: `${(d.clicks / maxDay) * 100}%` }} />
              </div>
            ))}
          </div>
          <p className="label mt-2 flex justify-between text-lime/50">
            <span>{s.daily[0].day}</span>
            <span>
              <span className="text-lime/60">views</span> / <span className="text-orange">clicks</span>
            </span>
            <span>{s.daily.at(-1).day}</span>
          </p>
        </section>

        <section className="mt-12 grid gap-10 sm:grid-cols-3">
          <Ranked title="Where from" rows={s.from} total={s.views} />
          <Ranked title="Countries" rows={s.countries} total={s.views} />
          <Ranked title="Devices" rows={s.devices} total={s.views} />
        </section>

        <p className="label mt-14 text-lime/40">
          Store: {storeName}. Views come from a beacon, clicks from the redirect. Bots are dropped.
        </p>
      </main>
    </div>
  );
}

function Tile({ label, value, accent = false }) {
  return (
    <div className={`border-2 p-4 ${accent ? "border-orange" : "border-lime/30"}`}>
      <p className="font-display text-4xl leading-none text-bone">{value}</p>
      <p className="label mt-3 text-lime/60">{label}</p>
    </div>
  );
}

function Ranked({ title, rows, total }) {
  return (
    <div>
      <h2 className="label text-lime/60">{title}</h2>
      {rows.length === 0 ? (
        <p className="label mt-3 text-lime/40">Nothing yet</p>
      ) : (
        <ol className="mt-3 space-y-1.5">
          {rows.map((r) => (
            <li key={r.key} className="flex justify-between gap-3 text-sm">
              <span className="truncate text-bone">{r.key}</span>
              <span className="text-lime/70">
                {r.n} <span className="text-lime/40">{pct(total ? r.n / total : 0)}</span>
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

function Gate({ failed }) {
  return (
    <div className="min-h-dvh bg-ink">
      <main className="mx-auto flex min-h-dvh max-w-[420px] flex-col justify-center px-5 text-lime">
        <p className="label text-lime/60">Private</p>
        <h1 className="mt-2 font-display text-5xl uppercase leading-none text-bone">Stats</h1>
        <form action={login} className="mt-8 space-y-3">
          <label className="label block text-lime/70" htmlFor="token">
            Token
          </label>
          <input
            id="token"
            name="token"
            type="password"
            autoComplete="current-password"
            required
            autoFocus
            className="w-full border-2 border-lime/40 bg-transparent px-3 py-3 text-bone outline-none focus:border-lime"
          />
          {failed && <p className="label text-orange">That was not it.</p>}
          <button className="label w-full bg-lime px-3 py-3 text-ink hover:bg-orange">Open</button>
        </form>
      </main>
    </div>
  );
}
