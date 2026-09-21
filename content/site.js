// The whole content of the page. Order here is the order on the page.
// An `id` is stored in analytics events, so never reuse one for a different link.

export const profile = {
  // Two short words or phrases. The first is solid, the second is the loud one.
  headline: ["Things", "I made"],
  bio: "Small web things and apps I made instead of doing something sensible. Pick one.",
};

/**
 * @type {{
 *   id: string,
 *   title: string,
 *   url: string,
 *   blurb: string,
 *   kind: "web" | "app" | "repo" | "other",
 *   status: "live" | "wip" | "retired",
 *   mark?: string,
 *   look?: { color?: string, pattern?: string, shape?: string, size?: string },
 * }[]}
 *
 * `mark` is the big glyph on the link's tile (one or two characters, defaults
 * to the first letter of the title). `look` overrides the color, pattern,
 * shape or size that lib/look.js would otherwise pick from the position.
 */
export const links = [
  {
    id: "coined",
    title: "Coined",
    url: "https://coined.vercel.app",
    blurb: "Finds what strangers named their variables, so you can skip the thinking.",
    kind: "web",
    status: "live",
    mark: "¢",
  },
  {
    id: "congrats-probably",
    title: "Congratulations, Probably",
    url: "https://congrats-probably.vercel.app",
    blurb: "You roll a die. There are no choices, so nothing you do matters.",
    kind: "web",
    status: "live",
    mark: "6",
  },
  {
    id: "caffeinated",
    title: "Caffeinated",
    url: "https://github.com/DarelNC/caffeinated",
    blurb: "Keeps an Android screen on. Yes, that is the whole app.",
    kind: "app",
    status: "live",
    mark: "Zz",
  },
  {
    id: "github",
    title: "Everything else",
    url: "https://github.com/DarelNC",
    blurb: "The rest of what I started. Finishing is a separate topic.",
    kind: "repo",
    status: "live",
    mark: "&",
  },
];
