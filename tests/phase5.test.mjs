// Phase 5: Hadith library, English corrections round 2, word help, tracker date navigation.
import { test } from "node:test";
import assert from "node:assert/strict";
import { json, read, exists, pad, loadBrowser, quranMeta } from "./helpers.mjs";

const HD = loadBrowser("assets/hadith.js").IE_HADITH;
const XT = () => loadBrowser("assets/xtrack.js").IE_XTRACK;
const plain = x => JSON.parse(JSON.stringify(x));

/* ---------- Hadith ---------- */
test("hadith: 40 canonical records (24 from Phase 5, 16 added in Phase 5.3), each with a verified reference, grade, source and both translations", () => {
  assert.equal(HD.HADITH.length, 40);
  const ids = new Set(), heIds = new Set();
  for (const h of HD.HADITH) {
    assert.ok(!ids.has(h.id) && !heIds.has(h.he), `${h.id} is stored once`); ids.add(h.id); heIds.add(h.he);
    for (const k of ["ar", "en", "bn"]) assert.ok(typeof h[k] === "string" && h[k].trim().length > 20, `${h.id}.${k}`);
    assert.match(h.ar, /[؀-ۿ]/, `${h.id} Arabic`);
    assert.match(h.bn, /[ঀ-৿]/, `${h.id} Bangla`);
    assert.equal(h.ar, h.ar.normalize("NFC"));
    assert.ok(h.refs.length >= 1 && h.refs.some(x => x.wording !== "similar"), `${h.id} has a reference matching the wording shown`);
    for (const x of h.refs) {
      assert.ok(["bukhari", "muslim"].includes(x.c), `${h.id} only Sahih al-Bukhari / Sahih Muslim`);
      assert.match(x.n, /^\d+[a-z]?$/, `${h.id} number ${x.n}`);
      assert.equal(x.url, `https://sunnah.com/${x.c}:${x.n}`);
      assert.ok(["shown", "close", "similar"].includes(x.wording));
    }
    assert.match(h.grade.he.en, /^Authentic/, `${h.id} graded Authentic by HadeethEnc`);
    assert.equal(h.grade.he.ar, "صحيح");
    assert.ok(h.grade.collection.en.startsWith("Sahih:") && h.grade.collection.bn);
    assert.match(h.source.en, /^https:\/\/hadeethenc\.com\/en\/browse\/hadith\/\d+$/);
    assert.ok(h.narrator.en && h.narrator.bn);
    assert.equal(h.review, "source-checked", "review status is stated, not claimed as scholar-approved");
    if (h.note) assert.ok(h.note.en && h.note.bn, `${h.id} note in both languages`);
  }
});

test("hadith: the five requested references are included with their exact numbers", () => {
  const has = (c, n) => HD.HADITH.some(h => h.refs.some(x => x.c === c && x.n === n));
  for (const [c, n] of [["muslim", "2999"], ["bukhari", "7405"], ["muslim", "2699a"], ["bukhari", "6412"], ["bukhari", "39"]]) assert.ok(has(c, n), `${c} ${n}`);
});

test("hadith: categories match the brief, every record belongs to at least one, and filtering never duplicates", () => {
  const want = ["When You Feel Sad", "When You Feel Alone", "When You Need Hope", "When You Need Reassurance", "When You Need Motivation", "When You Feel Grateful", "Strengthening Your Faith", "When You Need Guidance", "Seeking Knowledge", "When You Need Patience", "Becoming a Better Person", "Daily Worship and Dhikr"];
  assert.deepEqual([...HD.CATEGORIES.map(c => c[1])], want);
  assert.equal(HD.CATEGORIES.find(c => c[0] === "reassure")[2], "দুশ্চিন্তা হলে");
  const cats = new Set(HD.CATEGORIES.map(c => c[0]));
  for (const h of HD.HADITH) { assert.ok(h.cats.length >= 1); for (const c of h.cats) assert.ok(cats.has(c), `${h.id} category ${c}`); assert.equal(new Set(h.cats).size, h.cats.length); }
  for (const [c] of HD.CATEGORIES) {
    const list = HD.HADITH.filter(h => h.cats.includes(c));
    assert.ok(list.length >= 2, `${c} has at least two`);
    assert.equal(new Set(list.map(h => h.id)).size, list.length);
  }
  const multi = HD.HADITH.filter(h => h.cats.length > 1);
  assert.ok(multi.length > 10, "multi-category records are stored once");
});

test("hadith: the source terms and the review limits are recorded with the data", () => {
  assert.match(HD.SOURCE.terms, /no modification/i);
  assert.match(HD.SOURCE.review, /not reviewed by a qualified scholar/i);
  assert.match(HD.SOURCE.categories, /editorial/i);
  const app = read("assets/app.js");
  assert.match(app, /data-act="hcat"/);
  assert.match(app, /h\.refs\.filter\(x => x\.wording !== "similar"\)\.map|refs\.map\(x => `<a href="\$\{x\.url\}"/, "reference link on every card");
  assert.doesNotMatch(app.slice(app.indexOf("function hadithList"), app.indexOf("function vHadith")), /slice\(|substr|…/, "no truncation");
  assert.match(app, /"hadith", "hadith", "more\/hadith"/, "sidebar entry");
});

/* ---------- English translation round 2 ---------- */
test("en corrections round 2: each is a small, checked change and the Arabic is untouched", () => {
  const c = json("data/quran/en-corrections.json"), r2 = c.corrections.filter(x => x.round === 2);
  assert.equal(r2.length, 60);
  for (const x of r2) {
    assert.equal(x.checks.length, 3, `${x.ref} three checks recorded`);
    const a = x.source.split(/\s+/), b = x.corrected.split(/\s+/);
    assert.ok(Math.abs(a.length - b.length) <= 2, `${x.ref} small change`);
    const [s, n] = x.ref.split(":").map(Number);
    assert.equal(json(`data/quran/en/${pad(s)}.json`)[n - 1], x.corrected);
  }
  const en = s => json(`data/quran/en/${pad(s)}.json`);
  assert.match(en(22)[36], /their blood reach not Allah/);
  assert.match(en(12)[30], /This is not a human being\. This is no other than/);
  for (let s = 1; s <= 114; s++) for (const v of en(s)) assert.doesNotMatch(v, /\b(fairseeming|poordue|wordly|wiled)\b/);
  const ed = json("data/quran/editions.json").en;
  assert.match(ed.notices[0], new RegExp(`${c.corrections.length} verses of the Tanzil text are corrected to the 1930 wording`));
});

test("word help: older words explained outside the translation", () => {
  const G = loadBrowser("assets/glossary.js").IE_GLOSS;
  assert.deepEqual(plain(G.forText("Lo! He hath knowledge")), [["lo", "look, indeed"], ["hath", "has"]]);
  assert.deepEqual(plain(G.forText("He knoweth the teeth")), [["-eth", "older verb ending for -s, as in “knoweth”"]]);
  assert.deepEqual(plain(G.forText("Praise be to Allah")), []);
  const app = read("assets/app.js");
  assert.match(app, /class="gloss"><span class="gl-h">\$\{t\("gl_title"\)\}/, "labelled as help");
  assert.match(app, /\$\{st\.gloss \? glossLine\(tr\.t\[k\]\) : ""\}/, "reader shows it only when switched on");
  const { I18N } = loadBrowser("assets/data.js").DINSATHI;
  assert.match(I18N.en.gl_title, /not part of the translation/);
});

/* ---------- Prayer tracker date navigation ---------- */
test("tracker dates: day arithmetic across months, leap days, year ends and DST dates", () => {
  const x = XT();
  assert.equal(x.shift("2026-03-31", 1), "2026-04-01");
  assert.equal(x.shift("2028-02-28", 1), "2028-02-29");
  assert.equal(x.shift("2028-02-29", 1), "2028-03-01");
  assert.equal(x.shift("2027-02-28", 1), "2027-03-01");
  assert.equal(x.shift("2026-01-01", -1), "2025-12-31");
  assert.equal(x.shift("2026-04-05", -1), "2026-04-04", "Sydney DST ends on 5 April 2026");
  assert.equal(x.shift("2026-10-04", -1), "2026-10-03", "Sydney DST starts on 4 October 2026");
  assert.equal(x.diff("2026-10-01", "2026-10-17"), 16);
  assert.equal(x.valid("2027-02-29"), false);
  assert.equal(x.clamp("2027-01-01", "2026-06-20", "2026-10-17"), "2026-10-17", "future dates cannot be selected");
  assert.equal(x.clamp("2020-01-01", "2026-06-20", "2026-10-17"), "2026-06-20");
  assert.equal(x.clamp("nonsense", "2026-06-20", "2026-10-17"), "2026-10-17");
});

test("tracker: each prayer on each date toggles independently and other dates are untouched", () => {
  const x = XT();
  const log = { "2026-10-17": { fajr: true }, "2026-10-16": { isha: true } };
  const r = x.togglePrayer(log, "2026-10-16", "fajr");
  assert.equal(r.done, true);
  assert.deepEqual(plain(r.log["2026-10-17"]), { fajr: true }, "today unchanged");
  assert.deepEqual(plain(r.log["2026-10-16"]), { isha: true, fajr: true });
  assert.deepEqual(plain(log["2026-10-16"]), { isha: true }, "input not mutated");
  const u = x.togglePrayer(r.log, "2026-10-16", "fajr");
  assert.equal(u.done, false); assert.equal(u.log["2026-10-16"].fajr, false);
  assert.throws(() => x.togglePrayer({}, "2026-10-16", "tahajjud"));
  assert.throws(() => x.togglePrayer({}, "16/10/2026", "fajr"));
});

test("tracker UI: selected date, previous/next, picker limited to stored days, empty state, separate handler", () => {
  const app = read("assets/app.js");
  for (const m of [/data-act="tday" data-k="prev"/, /data-act="tday" data-k="next"/, /type="date" id="t-date"[^>]*min="\$\{min\}" max="\$\{s\.key\}"/, /data-act="trk" data-k="\$\{p\}"/, /t\("t_empty"\)/, /t\("t_today"\)/, /t\("t_yday"\)/, /t\("t_past"\)/])
    assert.match(app, m);
  const h = app.slice(app.indexOf('case "trk":'), app.indexOf('case "tday":'));
  assert.match(h, /XT\.togglePrayer\(st\.log, k, d\.k\)/, "writes only the selected date");
  assert.match(app, /const KEEP_DAYS = 120;/);
  assert.match(app, /keep\.add\(dkey\(y, m, d\)\); \[y, m, d\] = shiftDay/, "same 120-day retention as before");
  const { I18N } = loadBrowser("assets/data.js").DINSATHI;
  for (const l of ["en", "bn"]) for (const k of ["t_today", "t_yday", "t_past", "t_prev", "t_next", "t_pick", "t_back", "t_empty", "t_count", "t_keep"]) assert.ok(I18N[l][k], `${l}.${k}`);
});

/* ---------- wiring ---------- */
test("phase 5 scripts load before app.js and are precached; caches moved to v6", () => {
  const html = read("index.html"), sw = read("sw.js");
  for (const f of ["assets/hadith.js", "assets/glossary.js"]) {
    assert.ok(exists(f)); assert.ok(html.indexOf(f) > 0 && html.indexOf(f) < html.indexOf("assets/app.js"), f); assert.ok(sw.includes(`"${f}"`), f);
  }
  assert.match(sw, /islam-everyday-app-v6/); assert.match(sw, /islam-everyday-data-v6/);
  assert.ok(quranMeta().meta.length === 114);
});
