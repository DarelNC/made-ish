// The whole content of the page. Order here is the order on the page.
// An `id` is stored in analytics events, so never reuse one for a different link.

export const profile = {
  name: "DarelNC",
  handle: "github.com/DarelNC",
  bio: "Small web things and apps I build. Everything lives at one of these links.",
};

/** @type {{ id: string, title: string, url: string, blurb: string, kind: "web" | "app" | "repo" | "other", status: "live" | "wip" | "retired" }[]} */
export const links = [
  {
    id: "coined",
    title: "Coined",
    url: "https://coined.vercel.app",
    blurb: "Variable names, found in real public code.",
    kind: "web",
    status: "live",
  },
  {
    id: "congrats-probably",
    title: "Congratulations, Probably",
    url: "https://congrats-probably.vercel.app",
    blurb: "A game about luck. You roll a die, that is all.",
    kind: "web",
    status: "live",
  },
  {
    id: "caffeinated",
    title: "Caffeinated",
    url: "https://github.com/DarelNC/caffeinated",
    blurb: "Keeps an Android screen awake for as long as you say.",
    kind: "app",
    status: "live",
  },
  {
    id: "github",
    title: "Everything else",
    url: "https://github.com/DarelNC",
    blurb: "The rest of the open tabs, on GitHub.",
    kind: "repo",
    status: "live",
  },
];
