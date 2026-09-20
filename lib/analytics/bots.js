// Crawlers, link previewers and headless tools. Not exhaustive on purpose:
// this only keeps the obvious noise out of a personal page's numbers.
const BOT = /bot|crawl|spider|slurp|preview|fetch|curl|wget|python-requests|httpclient|okhttp|headless|lighthouse|facebookexternalhit|embedly|whatsapp|telegram|discord|slack|skype|vkshare|pinterest|monitor|uptime/i;

/** @param {string | null | undefined} ua */
export function isBot(ua) {
  if (!ua) return true;
  return BOT.test(ua);
}
