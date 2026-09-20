import { appendFile, mkdir, readFile } from "node:fs/promises";
import path from "node:path";

/**
 * Newline-delimited JSON on local disk. For development and for running
 * `next start` on a machine you own. Vercel functions have no durable disk,
 * so this is not a production store there.
 * @param {string} file
 */
export function fileStore(file) {
  return {
    name: "file",
    /** @param {object} event */
    async append(event) {
      await mkdir(path.dirname(file), { recursive: true });
      await appendFile(file, `${JSON.stringify(event)}\n`, "utf8");
    },
    /** @param {number} since ms since epoch */
    async read(since) {
      let text;
      try {
        text = await readFile(file, "utf8");
      } catch (err) {
        if (/** @type {NodeJS.ErrnoException} */ (err).code === "ENOENT") return [];
        throw err;
      }
      const events = [];
      for (const line of text.split("\n")) {
        if (!line) continue;
        try {
          const event = JSON.parse(line);
          if (event.t >= since) events.push(event);
        } catch {
          // a torn or hand-edited line is skipped, not fatal
        }
      }
      return events;
    },
  };
}
