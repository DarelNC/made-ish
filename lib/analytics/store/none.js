// Records nothing. The default in production until a real store is chosen,
// so the page and the redirects work without pretending to keep data.
export const noneStore = {
  name: "none",
  async append() {},
  async read() {
    return [];
  },
};
