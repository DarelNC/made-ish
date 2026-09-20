// The whole content of the page. Order here is the order on the page.
// An `id` is stored in analytics events, so never reuse one for a different link.

export const profile = {
  name: "DarelNC",
  handle: "github.com/DarelNC",
  bio: "Small web things and apps I made instead of doing something sensible. Pick one.",
};

/** @type {{ id: string, title: string, url: string, blurb: string, kind: "web" | "app" | "repo" | "other", status: "live" | "wip" | "retired" }[]} */
export const links = [
  {
    id: "coined",
    title: "Coined",
    url: "https://coined.vercel.app",
    blurb: "Finds what strangers named their variables, so you can skip the thinking.",
    kind: "web",
    status: "live",
  },
  {
    id: "congrats-probably",
    title: "Congratulations, Probably",
    url: "https://congrats-probably.vercel.app",
    blurb: "You roll a die. There are no choices, so nothing you do matters.",
    kind: "web",
    status: "live",
  },
  {
    id: "caffeinated",
    title: "Caffeinated",
    url: "https://github.com/DarelNC/caffeinated",
    blurb: "Keeps an Android screen on. Yes, that is the whole app.",
    kind: "app",
    status: "live",
  },
  {
    id: "github",
    title: "Everything else",
    url: "https://github.com/DarelNC",
    blurb: "The rest of what I started. Finishing is a separate topic.",
    kind: "repo",
    status: "live",
  },
];
