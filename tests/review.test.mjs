// Phase 4/5 final review: English edition integrity, untouched Arabic/Bangla data, cross-language alignment,
// service-worker cache safety and offline messaging, tracker today-only labelling.
import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readdirSync, statSync, readFileSync } from "node:fs";
import vm from "node:vm";
import { json, read, p, pad, loadBrowser, quranMeta } from "./helpers.mjs";

const en = s => json(`data/quran/en/${pad(s)}.json`);
const verse = ref => { const [s, a] = ref.split(":").map(Number); return en(s)[a - 1]; };
const C = json("data/quran/en-corrections.json");

/* ---------- English: one edition, every change traceable ---------- */
test("edition: corrections are traceable, one per verse, applied exactly, in three rounds", () => {
  assert.match(C.basis, /first edition.*1930/);
  assert.ok(C.witnesses.some(w => w.id === "MN40248ucmf_9") && C.witnesses.filter(w => !w.role).length === 3, "three 1930 copies recorded");
  const refs = C.corrections.map(x => x.ref);
  assert.equal(new Set(refs).size, refs.length, "one entry per verse");
  const by = r => C.corrections.filter(x => x.round === r).length;
  assert.deepEqual([by(1), by(2), by(3)], [91, 60, 242]);
  for (const x of C.corrections) {
    assert.equal(verse(x.ref), x.corrected, `${x.ref} applied`);
    assert.notEqual(x.source, x.corrected, `${x.ref} changes something`);
    assert.ok(x.reasons.length >= 1, `${x.ref} reason`);
    if (x.round >= 2) assert.equal(x.checks.length, 3, `${x.ref} three checks`);
  }
  const ed = json("data/quran/editions.json").en;
  assert.match(ed.notices[0], new RegExp(`${C.corrections.length} verses`));
  assert.match(ed.license, /public domain/i);
  assert.match(ed.license, /non-commercial/);
});

test("edition: no electronic-text artefacts or rewordings remain", () => {
  for (let s = 1; s <= 114; s++) for (const v of en(s)) {
    assert.doesNotMatch(v, /\bno (other )?Allah (save|beside)|any Allah beside|Allah-fearing|One Allah\b|\bMakka\b/, v.slice(0, 80));
  }
  assert.match(verse("1:4"), /^Owner of the Day/);
  assert.match(verse("2:255"), /There is no God save Him/);
  for (const r of ["4:16", "4:149", "30:47", "33:5", "33:25", "33:27", "33:40", "33:43", "33:50", "33:51", "33:52", "33:55", "33:73"]) assert.doesNotMatch(verse(r), /Allah is ever|He is ever|is ever incumbent/, r);
  assert.match(verse("2:257"), /Protecting Friend/);
  assert.match(verse("4:135"), /nearer unto both \(than ye are\)/, "the mixed Phase 5 correction is revised");
  assert.match(verse("43:81"), /The Beneficent One hath no son\. I am first among the worshippers$/);
  assert.match(verse("5:44"), /And barter not My revelations/);
  assert.match(verse("17:59"), /We send not portents save to warn$/);
  assert.doesNotMatch(verse("42:47"), /have a ye/);
});

test("edition: misprints of the 1930 printing and held-back readings are not reproduced; review items are flagged", () => {
  assert.match(verse("2:57"), /they wronged Us not/);
  assert.match(verse("82:9"), /ye deny/);
  assert.match(verse("5:67"), /thou wilt not/);
  assert.match(verse("20:109"), /whose word He accepteth/);
  assert.match(verse("3:147"), /make our foothold/);
  assert.match(verse("4:94"), /Thou art not/);
  assert.match(verse("2:129"), /art the Mighty/);
  assert.doesNotMatch(verse("2:129") + verse("7:161") + verse("71:17"), /\bthe the\b/);
  const flagged = C.corrections.filter(x => x.review).map(x => x.ref);
  for (const r of ["2:100", "3:23", "3:161", "43:81", "69:17", "6:54", "63:6"]) assert.ok(flagged.includes(r), `${r} flagged for review`);
  assert.match(C.policy, /2:57/); assert.match(C.policy, /82:9/);
  const audit = read("docs/translation-audit.md");
  assert.match(audit, /Edition decision/); assert.match(audit, /No printed edition with the digital text's wording was found/);
});

test("glossary explains words without changing the translation", () => {
  const G = loadBrowser("assets/glossary.js").IE_GLOSS;
  const v = verse("33:5"); const before = v;
  G.forText(v);
  assert.equal(verse("33:5"), before);
  assert.match(read("assets/app.js"), /\$\{esc\(tr\.t\[k\]\)\}<\/p>\$\{st\.gloss \? glossLine\(tr\.t\[k\]\) : ""\}/, "glossary rendered after the translation, outside it");
});

/* ---------- Arabic, Bangla and short tafsir untouched; languages aligned ---------- */
const fp = lang => { const h = createHash("sha256"); for (let i = 1; i <= 114; i++) h.update(readFileSync(p("data", "quran", lang, pad(i) + ".json"))); return h.digest("hex").slice(0, 16); };
test("Arabic, Bangla and Al-Mukhtasar files are byte-identical to the reviewed versions", () => {
  assert.equal(fp("ar"), "ab0b1571a48e63b9");
  assert.equal(fp("bn"), "01fb4f363faa6024");
  assert.equal(fp("bnt"), "4ef3b18d71e27a19");
});

test("every surah has the same number of ayat in Arabic, English, Bangla and the short tafsir", () => {
  const meta = quranMeta().meta;
  for (let s = 1; s <= 114; s++) {
    const n = meta[s - 1][3];
    assert.equal(json(`data/quran/ar/${pad(s)}.json`).length, n, `ar ${s}`);
    assert.equal(en(s).length, n, `en ${s}`);
    assert.equal(json(`data/quran/bn/${pad(s)}.json`).t.length, n, `bn ${s}`);
    assert.equal(json(`data/quran/bnt/${pad(s)}.json`).length, n, `bnt ${s}`);
  }
});

/* ---------- service worker ---------- */
function loadSW(existing) {
  const handlers = {}, deleted = [], opened = [], added = [];
  const cacheObj = name => ({ addAll: async reqs => { added.push(...reqs); }, match: async () => undefined, put: async () => {} });
  const ctx = {
    self: { addEventListener: (t, f) => (handlers[t] = f), skipWaiting: () => Promise.resolve(), clients: { claim: () => Promise.resolve() } },
    caches: { keys: async () => existing, delete: async k => { deleted.push(k); return true; }, open: async n => { opened.push(n); return cacheObj(n); }, match: async () => undefined },
    location: { origin: "https://example.github.io" }, Request: class { constructor(u, o) { this.url = u; this.cache = o && o.cache; } }, URL, fetch: async () => ({ ok: true }), Promise
  };
  vm.createContext(ctx); vm.runInContext(read("sw.js"), ctx);
  return { handlers, deleted, opened, added, run: async (t, e = {}) => { let w; await handlers[t]({ ...e, waitUntil: x => (w = x) }); await w; } };
}
test("service worker: activation deletes only this app's old caches, never another app's on the same origin", async () => {
  const sw = loadSW(["islam-everyday-app-v5", "islam-everyday-data-v5", "islam-everyday-app-v4", "dinsathi-web-v2", "dinsathi-data-v3", "other-project-cache", "workbox-precache-v2", "islam-everyday-app-v6", "islam-everyday-data-v6"]);
  await sw.run("activate");
  assert.deepEqual([...sw.deleted].sort(), ["dinsathi-data-v3", "dinsathi-web-v2", "islam-everyday-app-v4", "islam-everyday-app-v5", "islam-everyday-data-v5"]);
});
test("service worker: install precaches every script index.html loads, bypassing the HTTP cache", async () => {
  const sw = loadSW([]);
  await sw.run("install");
  const urls = sw.added.map(r => r.url);
  assert.ok(sw.added.every(r => r.cache === "reload"), "cache: reload");
  for (const m of read("index.html").matchAll(/<script[^>]+src="([^"]+)"/g)) assert.ok(urls.includes(m[1]), `${m[1]} precached`);
  for (const f of ["assets/hadith.js", "assets/glossary.js", "assets/xtrack.js", "assets/bnfix.js"]) assert.ok(urls.includes(f));
  for (const u of urls) if (u !== "./") assert.ok(statSync(p(u)).isFile(), `${u} exists`);
});
test("service worker: the DATA cache version matches the Qur'an data, and the app's offline flag follows it", () => {
  const files = []; (function walk(d) { for (const f of readdirSync(d).sort()) { const q = d + "/" + f; if (statSync(p(q)).isDirectory()) walk(q); else if (f.endsWith(".json") && f !== "coverage.json") files.push(q); } })("data/quran");
  const h = createHash("sha256"); for (const f of files) { h.update(f); h.update("\0"); h.update(readFileSync(p(f))); }
  const sw = read("sw.js"), rev = sw.match(/DATA_REV = "([0-9a-f]{12})"/)[1], data = sw.match(/DATA = "islam-everyday-data-(v\d+)"/)[1];
  assert.equal(h.digest("hex").slice(0, 12), rev, "Qur'an data changed: give sw.js a new DATA version and DATA_REV");
  assert.equal({ v6: "d4ab4a46286f" }[data], rev, "a new DATA_REV needs a new DATA version name");
  const app = read("assets/app.js");
  assert.match(app, new RegExp(`OFFLINE_FLAG = KEY \\+ "\\.offline\\.${data}"`), "offline flag versioned with DATA");
  assert.match(app, /OLD_OFFLINE_FLAGS = \[3, 4, 5\]/);
  assert.match(sw, /failed\+\+/, "partial saves are reported");
  assert.match(app, /if \(m\.failed\)/, "a partial save is not marked as saved");
  const { I18N } = loadBrowser("assets/data.js").DINSATHI;
  for (const l of ["en", "bn"]) for (const k of ["q_resave", "q_savefail", "x_today_only"]) assert.ok(I18N[l][k], `${l}.${k}`);
});

/* ---------- tracker / extra worship ---------- */
test("extra worship is labelled as today's record, with a note when the tracker shows another date", () => {
  const app = read("assets/app.js"), x = app.slice(app.indexOf("function vExtra"), app.indexOf("/* ---------------- routing"));
  assert.match(x, /<span class="badge">\$\{t\("t_today"\)\}<\/span>/);
  assert.match(x, /trackKey\(s\) !== s\.key \? `<p class="note xw-note" role="note">\$\{t\("x_today_only"\)\}/);
  assert.match(app, /XT\.toggle\(st\.xlog, snap\.key, k\)/, "extra worship writes today's key only");
});
