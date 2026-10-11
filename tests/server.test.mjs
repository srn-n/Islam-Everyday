import { test } from "node:test";
import assert from "node:assert/strict";
import { createAppServer, DEFAULT_PORT } from "../scripts/serve.mjs";

test("static server serves the app and data, blocks traversal, and shuts down", async () => {
  assert.equal(DEFAULT_PORT, 8090);
  const server = createAppServer();
  await new Promise(r => server.listen(0, "127.0.0.1", r)); // random free port, never the default
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    const home = await fetch(base + "/");
    assert.equal(home.status, 200); assert.match(home.headers.get("content-type"), /text\/html/); assert.equal(home.headers.get("cache-control"), "no-store");
    assert.match(await home.text(), /<title>Islam Everyday<\/title>/);
    const d = await fetch(base + "/data/quran/bn/001.json"); assert.equal(d.status, 200); assert.equal((await d.json()).t.length, 7);
    const f = await fetch(base + "/assets/fonts/hind-siliguri-bengali-400-normal.woff2"); assert.equal(f.headers.get("content-type"), "font/woff2"); await f.arrayBuffer();
    const m = await fetch(base + "/manifest.webmanifest"); assert.match(m.headers.get("content-type"), /manifest/); await m.text();
    const nf = await fetch(base + "/nope.js"); assert.equal(nf.status, 404); await nf.text();
    const tr = await fetch(base + "/..%2f..%2fetc%2fpasswd"); assert.ok([403, 404].includes(tr.status)); await tr.text();
  } finally {
    await new Promise(r => server.close(r));
  }
  assert.equal(server.listening, false);
});
