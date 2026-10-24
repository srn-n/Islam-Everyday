import { test } from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { read, exists, loadBrowser } from "./helpers.mjs";

const SCRIPTS = ["assets/quran-meta.js", "assets/data.js", "assets/votd.js", "assets/names.js", "assets/bnfix.js", "assets/xtrack.js", "assets/hadith.js", "assets/glossary.js", "assets/app.js", "sw.js"];

test("all scripts parse", () => { for (const f of SCRIPTS) assert.doesNotThrow(() => new vm.Script(read(f), { filename: f }), f); });

test("data.js exposes the expected data", () => {
  const X = loadBrowser("assets/data.js").DINSATHI;
  for (const k of ["I18N", "TL", "DUAS", "DUA_CATS", "CITIES", "METHODS", "EVENTS", "HM", "CURRENCIES"]) assert.ok(X[k], k);
  assert.equal(X.TR, undefined, "self-written draft translations must not ship");
  assert.ok(X.DUAS.length >= 10 && X.CITIES.length >= 20);
});

test("every UI string the app uses exists in English and Bangla", () => {
  const { I18N } = loadBrowser("assets/data.js").DINSATHI, app = read("assets/app.js");
  const keys = new Set([...app.matchAll(/\bt\("([a-z0-9_]+)"\)/g)].map(m => m[1]));
  assert.ok(keys.size > 50);
  const missing = [...keys].filter(k => I18N.en[k] == null || I18N.bn[k] == null);
  assert.deepEqual(missing, []);
});

test("index.html loads every script and stylesheet it needs, all local", () => {
  const html = read("index.html");
  const refs = [...html.matchAll(/(?:src|href)="([^"]+)"/g)].map(m => m[1]);
  for (const f of ["assets/fonts.css", "assets/app.css", "assets/quran-meta.js", "assets/data.js", "assets/votd.js", "assets/names.js", "assets/app.js"]) assert.ok(refs.includes(f), f);
  for (const r of refs) { assert.doesNotMatch(r, /^https?:/, `remote asset ${r}`); assert.ok(exists(r), `missing ${r}`); }
  assert.ok(html.indexOf("assets/names.js") < html.indexOf("assets/app.js") && html.indexOf("assets/votd.js") < html.indexOf("assets/app.js"));
});

test("fonts.css points at bundled font files with licences", () => {
  const css = read("assets/fonts.css"), urls = [...css.matchAll(/url\(([^)]+)\)/g)].map(m => m[1]);
  assert.ok(urls.length >= 10);
  for (const u of urls) assert.ok(exists("assets/" + u), u);
  for (const l of ["HindSiliguri-OFL.txt", "ScheherazadeNew-OFL.txt", "TiroBangla-OFL.txt"]) assert.ok(exists("assets/fonts/licenses/" + l), l);
});

test("service worker precaches files that exist and only caches same-origin requests", () => {
  const sw = read("sw.js"), core = JSON.parse(sw.slice(sw.indexOf("const CORE = ") + 13, sw.indexOf("];", sw.indexOf("const CORE")) + 1).replace(/'/g, '"'));
  for (const f of core) if (f !== "./") assert.ok(exists(f), `sw CORE missing ${f}`);
  assert.match(sw, /u\.origin !== location\.origin\) return/);
});

test("no analytics, trackers or accounts", () => {
  const all = SCRIPTS.map(read).join("\n") + read("index.html");
  assert.doesNotMatch(all, /google-analytics|gtag\(|googletagmanager|plausible|mixpanel|segment\.io|sentry|firebase|signin|sign-in|login/i);
});
