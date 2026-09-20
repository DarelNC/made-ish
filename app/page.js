import Arrow from "@/components/Arrow";
import Beacon from "@/components/Beacon";
import { links, profile } from "@/content/site";

const STATUS = {
  live: { label: "live", chip: "bg-lime text-ink" },
  wip: { label: "in progress", chip: "bg-orange text-ink" },
  retired: { label: "retired", chip: "border border-lime/60 text-lime/70" },
};

const two = (n) => String(n).padStart(2, "0");

export default function Home() {
  const summary = ["live", "wip", "retired"]
    .map((status) => [links.filter((l) => l.status === status).length, STATUS[status].label])
    .filter(([n]) => n > 0)
    .map(([n, label]) => `${n} ${label}`)
    .join(" / ");
  const size = Math.max(profile.name.length, 5);

  return (
    <div className="hatch min-h-dvh">
      <Beacon />

      <div className="mx-auto grid max-w-[1120px] gap-12 px-5 pb-16 pt-10 lg:grid-cols-[5fr_7fr] lg:gap-20 lg:px-10 lg:pt-20">
        <header className="lg:sticky lg:top-20 lg:self-start">
          <p className="label">{profile.handle}</p>

          <h1 className="headline mt-5">
            <span className="headline-word" style={{ "--n": size }}>
              {profile.name}
            </span>
            <span className="headline-word outline" style={{ "--n": size }}>
              links
            </span>
          </h1>

          <p className="mt-8 max-w-[34ch] text-base font-normal leading-relaxed">{profile.bio}</p>

          <p className="mt-8 inline-block bg-ink px-4 pb-2 pt-1 font-serif text-3xl font-bold italic leading-tight text-orange">
            {links.length} {links.length === 1 ? "link" : "links"}
          </p>
          <p className="label mt-3 text-ink/70">{summary}</p>
        </header>

        <main>
          <ol className="space-y-4 lg:space-y-5">
            {links.map((l, i) => (
              <li key={l.id}>
                <a href={`/go/${l.id}`} className="slab">
                  <span className="slab-body">
                    <span className="flex items-center gap-2">
                      <span className="label text-current opacity-70">{two(i + 1)}</span>
                      <span className={`label px-2 py-0.5 text-[0.6875rem] ${STATUS[l.status].chip}`}>
                        {l.kind} / {STATUS[l.status].label}
                      </span>
                    </span>
                    <span
                      className={`slab-title mt-2 block ${l.status === "retired" ? "line-through decoration-2" : ""}`}
                      style={{ "--n": Math.max(...l.title.split(/\s+/).map((w) => w.length)) }}
                    >
                      {l.title}
                    </span>
                    <span className="mt-1.5 block text-[0.8125rem] leading-snug opacity-80 lg:text-sm">{l.blurb}</span>
                  </span>
                  <Arrow />
                </a>
              </li>
            ))}
          </ol>
        </main>
      </div>
    </div>
  );
}
