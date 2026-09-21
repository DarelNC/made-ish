import Arrow from "@/components/Arrow";
import Beacon from "@/components/Beacon";
import ThemePicker from "@/components/ThemePicker";
import { links, profile } from "@/content/site";
import { lookFor } from "@/lib/look";

const STATUS = {
  live: "working",
  wip: "half done",
  retired: "dead",
};

const two = (n) => String(n).padStart(2, "0");

export default function Home() {
  const summary = Object.keys(STATUS)
    .map((status) => [links.filter((l) => l.status === status).length, STATUS[status]])
    .filter(([n]) => n > 0)
    .map(([n, label]) => `${n} ${label}`)
    .join(" / ");
  const [first, second] = profile.headline;
  const size = Math.max(first.length, second.length, 5);
  const ticker = Array(3).fill(links.map((l) => l.title).join("  *  ")).join("  *  ");

  return (
    <div className="page">
      <Beacon />

      {/* Decoration. Every theme shows its own pieces and hides the rest. */}
      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          <span>{ticker}</span>
          <span>{ticker}</span>
        </div>
      </div>
      <div className="orbit" aria-hidden="true" />

      <div className="shell mx-auto grid max-w-[1120px] gap-x-20 gap-y-12 px-5 pb-16 pt-6 lg:grid-cols-[5fr_7fr] lg:px-10 lg:pt-10">
        <div className="topbar lg:col-span-2">
          <p className="brand">{profile.brand}</p>
          <ThemePicker />
        </div>

        <header className="head lg:sticky lg:top-10 lg:self-start">
          <p className="dim label" aria-hidden="true">
            Not to scale
          </p>

          <h1 className="headline mt-5">
            <span className="hw hw-1" style={{ "--n": size }}>
              {first}
            </span>{" "}
            <span className="hw hw-2" style={{ "--n": size }}>
              {second}
            </span>
          </h1>

          <p className="bio">{profile.bio}</p>

          <p className="tag">
            {links.length} {links.length === 1 ? "link" : "links"}, go on
          </p>
          <span className="stamp label" aria-hidden="true">
            Untested
          </span>
          <div className="bar" aria-hidden="true" />
          <p className="label muted mt-3">{summary}</p>
        </header>

        <main>
          <ol className="list">
            {links.map((l, i) => {
              const look = lookFor(l, i);
              return (
                <li
                  key={l.id}
                  className="tile"
                  data-color={look.color}
                  data-pattern={look.pattern}
                  data-shape={look.shape}
                  data-size={look.size}
                  style={{ "--tilt": `${look.tilt}deg` }}
                >
                  <a href={`/go/${l.id}`} className="slab">
                    <span className="glyph" aria-hidden="true">
                      {look.mark}
                    </span>
                    <span className="slab-body">
                      <span className="flex items-center gap-2">
                        <span className="label opacity-70">{two(i + 1)}</span>
                        <span className={`chip chip-${l.status}`}>
                          {l.kind} / {STATUS[l.status]}
                        </span>
                      </span>
                      <span
                        className={`slab-title mt-2 block ${l.status === "retired" ? "line-through decoration-2" : ""}`}
                        style={{ "--n": look.n }}
                      >
                        {l.title}
                      </span>
                      <span className="slab-blurb mt-1.5 block text-[0.8125rem] leading-snug lg:text-sm">{l.blurb}</span>
                    </span>
                    <Arrow className="arrow" />
                  </a>
                </li>
              );
            })}
          </ol>
        </main>
      </div>
    </div>
  );
}
