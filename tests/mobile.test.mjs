// Phone optimisation (October 2026): load size, touch targets, install as an app.
import { test } from "node:test";
import assert from "node:assert/strict";
import { gzipSync } from "node:zlib";
import { read, exists, loadBrowser } from "./helpers.mjs";

const app = read("assets/app.js"), css = read("assets/app.css"), html = read("index.html"), sw = read("sw.js");
const lazy = JSON.parse(app.match(/const LAZY = (\{[^\n]+\});/)[1].replace(/(\w+):/g, '"$1":'));
const lazyFiles = [...new Set(Object.values(lazy).flat())].map(n => `assets/${n}.js`);

test("page data is loaded on demand, not before the first screen", () => {
  for (const f of lazyFiles) {
    assert.ok(exists(f), f);
    assert.ok(!html.includes(`src="${f}"`), `${f} must not block the first screen`);
    assert.ok(sw.includes(`"${f}"`), `${f} still precached for offline`);
  }
  for (const g of ["names", "guide", "hadith", "study", "stories", "legal"]) assert.ok(lazy[g], g);
  assert.ok(lazy.guide.includes("names"), "the Prayer guide uses the 99 Names citation list");
});

test("first-screen scripts stay small (gzipped budget)", () => {
  const scripts = [...html.matchAll(/<script src="([^"]+)"/g)].map(m => m[1]);
  const kb = scripts.reduce((s, f) => s + gzipSync(read(f)).length, 0) / 1024;
  assert.ok(kb < 260, `first-screen JS is ${kb.toFixed(0)} KB gzipped (budget 260 KB)`);
});

test("routes and shared links wait for their page data", () => {
  assert.match(app, /const g = routeGroup\(R\);\s*\n\s*if \(g && !lazyDone\.has\(g\)\)/);
  assert.match(app, /function deepParse\(h\) \{\n  let m;\n  \{ const g = hashGroup\(h\); if \(g && !lazyDone\.has\(g\)\) return null; \}/);
  assert.match(app, /case "lazyretry":/);
  const { I18N } = loadBrowser("assets/data.js").DINSATHI;
  for (const k of ["pgloading", "pgfail", "inst_t", "inst_s", "inst_btn", "inst_ios", "inst_done"]) assert.ok(I18N.en[k] && I18N.bn[k], k);
});

test("the service worker registers after the page has loaded", () => {
  assert.match(app, /addEventListener\("load", \(\) => setTimeout\(reg, 1500\), \{ once: true \}\)/);
});

test("English pages do not download the Bangla font for the language button", () => {
  assert.match(css, /@media \(pointer:coarse\)\{\.lang-btn\{font-family:system-ui/);
});

test("touch screens get 44px tap targets", () => {
  const block = css.slice(css.indexOf("@media (pointer:coarse){"));
  for (const sel of [".chip", ".btn.sm", ".seg>button", ".icon-btn", ".linkish", ".switch::before"]) assert.ok(block.includes(sel), sel);
  assert.match(block, /min-height:44px/);
});

test("header buttons' accessible names include their visible text", () => {
  assert.match(app, /data-act="loc" aria-label="\$\{esc\(cname\(c\) \+ ", " \+ t\("chooseloc"\)\)\}"/);
  assert.match(app, /data-act="lang" aria-label="\$\{\(bn\(\) \? "EN" : "বাং"\) \+ ", "/);
});

test("install: own button for Chrome, instructions for iPhone, hidden once installed", () => {
  assert.match(app, /addEventListener\("beforeinstallprompt"/);
  assert.match(app, /addEventListener\("appinstalled"/);
  assert.match(app, /display-mode: standalone/);
  assert.match(app, /case "install":/);
});

test("manifest is complete for a rich install sheet", () => {
  const m = JSON.parse(read("manifest.webmanifest"));
  assert.equal(m.display, "standalone");
  assert.ok(m.id && m.start_url && m.scope);
  assert.ok(m.icons.some(i => i.purpose === "maskable" && i.sizes === "512x512"));
  assert.ok(m.screenshots.some(s => s.form_factor === "narrow"));
  for (const s of m.screenshots) assert.ok(exists(s.src), s.src);
  assert.deepEqual(m.launch_handler, { client_mode: "focus-existing" });
  assert.ok(m.shortcuts.length >= 3);
});

test("desktop keeps the previous behaviour; the phone-only changes are scoped to touch screens", () => {
  assert.match(app, /const phone = \(\) => \{ try \{ return matchMedia\("\(pointer: coarse\)"\)\.matches;/);
  assert.match(app, /if \(!phone\(\)\) Object\.keys\(LAZY\)\.forEach\(g => need\(g\)/);
  assert.match(app, /if \(NATIVE \|\| standalone\(\) \|\| !phone\(\)\) return "";/);
  assert.match(css, /@media \(pointer:fine\)\{\.boot\{visibility:hidden\}\}/);
});

test("counts that depend on page data are recomputed once it loads", () => {
  assert.match(app, /NW_N = NW \? NW\.HADITH\.length : 0;\n\}/);
  assert.doesNotMatch(app, /^const NW_N =/m);
});
