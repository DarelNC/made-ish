import http from "node:http";
import { afterEach, describe, expect, it } from "vitest";
import { remoteStore } from "../analytics/store/remote.js";

let server;
let base;

async function listen(handler) {
  server = http.createServer(handler);
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  base = `http://127.0.0.1:${server.address().port}`;
}

afterEach(async () => {
  if (server) await new Promise((resolve) => server.close(resolve));
  server = undefined;
});

describe("remoteStore", () => {
  it("posts the event as JSON with the project's key", async () => {
    const seen = [];
    await listen((req, res) => {
      let body = "";
      req.on("data", (c) => (body += c));
      req.on("end", () => {
        seen.push({ method: req.method, url: req.url, key: req.headers["x-api-key"], body: JSON.parse(body) });
        res.writeHead(202, { "content-type": "application/json" }).end('{"accepted":1}');
      });
    });

    await remoteStore({ url: base, key: "k1" }).append({ t: 1, type: "view" });

    expect(seen).toEqual([{ method: "POST", url: "/collect", key: "k1", body: { t: 1, type: "view" } }]);
  });

  it("never throws when the collector is unreachable", async () => {
    const store = remoteStore({ url: "http://127.0.0.1:1", key: "k1" });
    await expect(store.append({ t: 1, type: "view" })).resolves.toBeUndefined();
  });

  it("never throws when the collector answers with an error status", async () => {
    await listen((req, res) => res.writeHead(401).end("no"));
    await expect(remoteStore({ url: base, key: "bad" }).append({ t: 1, type: "view" })).resolves.toBeUndefined();
  });

  it("gives up instead of hanging when the collector never responds", async () => {
    await listen(() => {}); // never calls res.end
    const start = Date.now();
    await remoteStore({ url: base, key: "k1" }).append({ t: 1, type: "view" });
    expect(Date.now() - start).toBeLessThan(3500);
  });

  it("read() is a no-op: the dashboard reads the collector directly", async () => {
    await expect(remoteStore({ url: base ?? "http://x", key: "k" }).read(0)).resolves.toEqual([]);
  });
});
