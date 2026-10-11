import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { read, json, exists, p, loadBrowser } from "./helpers.mjs";

const pngSize = f => { const b = readFileSync(p(f)); assert.equal(b.toString("ascii", 1, 4), "PNG", `${f} is a PNG`); return [b.readUInt32BE(16), b.readUInt32BE(20)]; };

test("public name is Islam Everyday everywhere users see it", () => {
  const m = json("manifest.webmanifest"), html = read("index.html"), { I18N } = loadBrowser("assets/data.js").DINSATHI;
  assert.equal(m.name, "Islam Everyday"); assert.equal(m.short_name, "Islam Everyday");
  assert.match(html, /<title>Islam Everyday<\/title>/); assert.match(html, /apple-mobile-web-app-title" content="Islam Everyday"/);
  assert.equal(I18N.en.brand, "Islam Everyday"); assert.equal(I18N.bn.brand, "Islam Everyday");
  // no old brand in anything shown to users (internal identifiers such as storage keys are allowed)
  const visible = [html, JSON.stringify(m), JSON.stringify(I18N), JSON.stringify(loadBrowser("assets/names.js").DINSATHI_NAMES), JSON.stringify(loadBrowser("assets/guide.js").IE_GUIDE)].join("\n");
  assert.doesNotMatch(visible, /DinSathi|দিনসাথী|দীনসাথী|Dinlipi/);
  for (const f of ["scripts/serve.mjs", "data/quran/editions.json"]) assert.doesNotMatch(read(f), /DinSathi/, `${f} still shows the old name`);
});

test("manifest, HTML and service worker icons exist with the declared sizes", () => {
  const m = json("manifest.webmanifest");
  assert.ok(m.icons.some(i => i.purpose === "maskable" && i.sizes === "512x512"));
  assert.ok(m.icons.some(i => (i.purpose || "any").includes("any") && i.sizes === "192x192"));
  for (const i of m.icons) { assert.ok(exists(i.src), i.src); if (i.type === "image/png") assert.equal(pngSize(i.src).join("x"), i.sizes, i.src); }
  for (const s of m.shortcuts || []) for (const i of s.icons || []) assert.ok(exists(i.src), i.src);
  assert.deepEqual(pngSize("icons/apple-touch-icon.png"), [180, 180]);
  assert.ok(exists("favicon.ico") && exists("icons/favicon.svg"));
  for (const f of ["brand/islam-everyday-icon.svg", "brand/islam-everyday-icon-maskable.svg", "brand/islam-everyday-icon-small.svg"]) { assert.ok(exists(f), f); assert.match(read(f), /<svg[^>]+viewBox="0 0 512 512"/); assert.doesNotMatch(read(f), /<text|<image|href="http/, `${f} is pure vector`); }
  const sw = read("sw.js"); assert.match(sw, /islam-everyday-app-v\d+/);
  for (const f of ["icons/icon-192.png", "icons/icon-512.png", "icons/maskable-512.png", "icons/apple-touch-icon.png", "icons/favicon.svg", "assets/guide.js"]) assert.ok(sw.includes(`"${f}"`), `sw precaches ${f}`);
});

test("no unfinished markers ship", () => {
  for (const f of ["index.html", "assets/app.js", "assets/app.css", "assets/data.js", "assets/names.js", "assets/guide.js", "sw.js", "README.md"]) assert.doesNotMatch(read(f), /\b(TODO|FIXME|XXX|lorem ipsum)\b/i, f);
});
