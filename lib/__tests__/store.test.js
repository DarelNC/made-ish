import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { fileStore } from "../analytics/store/file.js";
import { noneStore } from "../analytics/store/none.js";

let dir;
beforeEach(async () => {
  dir = await mkdtemp(path.join(tmpdir(), "made-ish-"));
});
afterEach(() => rm(dir, { recursive: true, force: true }));

describe("fileStore", () => {
  it("returns nothing when the file does not exist", async () => {
    expect(await fileStore(path.join(dir, "missing.ndjson")).read(0)).toEqual([]);
  });

  it("appends events, creating folders, and reads them back", async () => {
    const store = fileStore(path.join(dir, "nested", "events.ndjson"));
    await store.append({ t: 1, type: "view" });
    await store.append({ t: 2, type: "click", link: "a" });
    expect(await store.read(0)).toEqual([
      { t: 1, type: "view" },
      { t: 2, type: "click", link: "a" },
    ]);
  });

  it("filters by time and skips broken lines", async () => {
    const file = path.join(dir, "events.ndjson");
    await writeFile(file, '{"t":1}\nnot json\n{"t":5}\n\n');
    expect(await fileStore(file).read(2)).toEqual([{ t: 5 }]);
  });
});

describe("noneStore", () => {
  it("accepts events and keeps nothing", async () => {
    await noneStore.append({ t: 1 });
    expect(await noneStore.read(0)).toEqual([]);
  });
});
