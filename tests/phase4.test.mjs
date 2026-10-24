// Phase 4: English translation corrections, Bangla short tafsir, dua previews and the extra worship record.
import { test } from "node:test";
import assert from "node:assert/strict";
import { json, read, exists, pad, quranMeta, loadBrowser } from "./helpers.mjs";

const META = quranMeta().meta;
const en = s => json(`data/quran/en/${pad(s)}.json`);

/* ---------- Task 1: English translation ---------- */
test("en-corrections.json: every correction is applied, mapped to a real ayah and explained", () => {
  const c = json("data/quran/en-corrections.json");
  assert.match(c.basis, /Pickthall/); assert.match(c.basis, /1930/);
  assert.ok(Array.isArray(c.witnesses) && c.witnesses.length >= 2, "two witnesses of the 1930 edition");
  assert.equal(c.corrections.filter(x => x.round === 1).length, 91, "Phase 4 corrections");
  const seen = new Set();
  for (const x of c.corrections) {
    const [s, a] = x.ref.split(":").map(Number);
    assert.ok(s >= 1 && s <= 114 && a >= 1 && a <= META[s - 1][3], `${x.ref} is a real ayah`);
    assert.ok(!seen.has(x.ref), `${x.ref} listed once`); seen.add(x.ref);
    assert.notEqual(x.source, x.corrected, `${x.ref} changes something`);
    assert.ok(Array.isArray(x.reasons) && x.reasons.length > 0, `${x.ref} has a reason`);
    assert.equal(en(s)[a - 1], x.corrected, `${x.ref} correction is in the data`);
  }
});

test("en: no word-swap leftovers and no broken structure", () => {
  for (let s = 1; s <= 114; s++) en(s).forEach((v, k) => {
    const ref = `${s}:${k + 1}`;
    assert.doesNotMatch(v, /\bthe Allah\b|Allah-fearing|no Allah save/, `${ref} word-swap leftover`);
    assert.equal((v.match(/\(/g) || []).length, (v.match(/\)/g) || []).length, `${ref} parentheses balanced`);
    assert.doesNotMatch(v, /\s{2,}|^\s|\s$/, `${ref} stray whitespace`);
  });
});

test("en: spot checks of restored 1930 wording", () => {
  assert.equal(en(1)[3], "Owner of the Day of Judgment");
  assert.match(en(2)[254], /^Allah! There is no God save Him, the Alive, the Eternal\./);
  assert.match(en(114)[2], /^The God of mankind/);
});

/* ---------- Task 2: Bangla short tafsir ---------- */
test("bnt: one short tafsir entry for every ayah, aligned with the Qur'an metadata", () => {
  let total = 0;
  for (let s = 1; s <= 114; s++) {
    const t = json(`data/quran/bnt/${pad(s)}.json`);
    assert.ok(Array.isArray(t), `bnt ${s} array`);
    assert.equal(t.length, META[s - 1][3], `bnt ${s} ayah count`);
    t.forEach((v, k) => assert.ok(typeof v === "string" && v.trim().length > 0, `bnt ${s}:${k + 1} empty`));
    total += t.length;
  }
  assert.equal(total, 6236);
});

test("bnt: the explanation is never a copy of the translation (kept separate in data and UI)", () => {
  for (let s = 1; s <= 114; s++) {
    const t = json(`data/quran/bnt/${pad(s)}.json`), b = json(`data/quran/bn/${pad(s)}.json`).t;
    t.forEach((v, k) => assert.notEqual(v.trim(), b[k].trim(), `bnt ${s}:${k + 1} equals the translation`));
  }
  const e = json("data/quran/editions.json").bnt;
  assert.equal(e.version, "1.0.0");
  assert.match(e.kind, /not a translation/);
  assert.match(e.license, /no modification/i);
  assert.match(e.attribution, /QuranEnc/);
  const app = read("assets/app.js");
  assert.match(app, /class="tafsir"/);
  assert.match(app, /t\("tf_label"\)/, "tafsir block is labelled as not the Qur'an text");
  const { I18N } = loadBrowser("assets/data.js").DINSATHI;
  assert.match(I18N.bn.tf_label, /কুরআনের পাঠ নয়/);
});

test("bnfix: repairs every legacy-font character in the tafsir and leaves clean text untouched", () => {
  const { repair, LEFTOVER } = loadBrowser("assets/bnfix.js").IE_BNFIX;
  let fixed = 0;
  for (let s = 1; s <= 114; s++) for (const v of json(`data/quran/bnt/${pad(s)}.json`)) {
    const r = repair(v);
    assert.doesNotMatch(r, LEFTOVER, `leftover in surah ${s}`);
    if (LEFTOVER.test(v)) fixed++; else assert.equal(r, v, "clean text must be unchanged");
  }
  assert.ok(fixed > 1000);
  for (const [a, b] of [["ত্রæটি", "ত্রুটি"], ["কর্মকাÐ", "কর্মকাণ্ড"], ["¯্রষ্টা", "স্রষ্টা"], ["সত্তে¡ও", "সত্ত্বেও"], ["দ্ব›দ্ব", "দ্বন্দ্ব"], ["যতœ", "যত্ন"]])
    assert.equal(repair(a), b.normalize("NFC"), a);
});

/* ---------- Task 3: dua cards ---------- */
test("dua cards: preview with an accessible Read more / Show less control", () => {
  const app = read("assets/app.js"), css = read("assets/app.css");
  assert.match(app, /class="dua-body" id="dua-b-\$\{i\}"/);
  assert.match(app, /data-act="duamore"[^>]*aria-expanded="\$\{open\}" aria-controls="dua-b-\$\{i\}"/);
  assert.match(app, /case "duamore"/);
  assert.match(css, /\.dua-body\{[^}]*max-height:var\(--dua-h\)/, "preview height");
  assert.match(css, /\.dua\.open \.dua-body,\.dua\.fits \.dua-body\{max-height:none\}/, "opened card shows the whole dua");
  assert.doesNotMatch(css, /\.dua-body\{[^}]*overflow-y:(auto|scroll)/, "no nested scroll area");
  const { I18N } = loadBrowser("assets/data.js").DINSATHI;
  for (const l of ["en", "bn"]) assert.ok(I18N[l].readmore && I18N[l].readless);
});

/* ---------- Task 4: extra worship ---------- */
const XT = () => loadBrowser("assets/xtrack.js").IE_XTRACK;

test("xtrack: mark, undo, no duplicates, correct date", () => {
  const x = XT();
  let r = x.toggle({}, "2026-10-13", "tahajjud");
  assert.equal(r.done, true);
  assert.deepEqual(JSON.parse(JSON.stringify(r.log)), { "2026-10-13": { tahajjud: true } });
  r = x.toggle(r.log, "2026-10-13", "witr");
  r = x.toggle(r.log, "2026-10-12", "fast");
  assert.deepEqual(Object.keys(r.log).sort(), ["2026-10-12", "2026-10-13"]);
  const before = JSON.stringify(r.log);
  const u = x.toggle(r.log, "2026-10-13", "tahajjud");
  assert.equal(u.done, false);
  assert.equal(JSON.stringify(r.log), before, "input is not mutated");
  assert.deepEqual(JSON.parse(JSON.stringify(u.log["2026-10-13"])), { witr: true });
  const empty = x.toggle(x.toggle({}, "2026-10-13", "duha").log, "2026-10-13", "duha");
  assert.deepEqual(JSON.parse(JSON.stringify(empty.log)), {}, "an undone day is removed, not kept as {}");
  assert.throws(() => x.toggle({}, "13/10/2026", "duha"));
  assert.throws(() => x.toggle({}, "2026-10-13", "fajr"), /unknown item/, "fard prayers are not extra worship items");
});

test("xtrack: saved data is cleaned, pruned and counted by date", () => {
  const x = XT();
  const c = x.clean({ "2026-10-13": { tahajjud: true, witr: 1, fajr: true, fast: true }, "bad": { duha: true }, "2026-10-01": {}, "2026-10-02": null });
  assert.deepEqual(JSON.parse(JSON.stringify(c)), { "2026-10-13": { tahajjud: true, fast: true } });
  for (const junk of [null, undefined, 5, "x", []]) assert.deepEqual(JSON.parse(JSON.stringify(x.clean(junk))), {});
  const log = { "2026-10-13": { fast: true }, "2026-10-10": { fast: true, duha: true }, "2026-01-01": { fast: true } };
  assert.deepEqual(Object.keys(x.prune(log, new Set(["2026-10-13", "2026-10-10"]))), ["2026-10-13", "2026-10-10"]);
  assert.equal(x.count(log, ["2026-10-13", "2026-10-12", "2026-10-11", "2026-10-10"], "fast"), 2);
  assert.equal(x.count(log, ["2026-10-13"], "duha"), 0);
});

test("extra worship is wired separately from the five fard records", () => {
  const app = read("assets/app.js");
  assert.match(app, /xlog: \{\}/, "own key in the saved state");
  const h = app.slice(app.indexOf('case "xw":'), app.indexOf('case "surah":'));
  assert.ok(h.length > 100);
  assert.doesNotMatch(h, /st\.log|pruneLog/, "the extra worship handler never touches the fard log");
  assert.match(h, /snapshot\(\)\.key !== snap\.key/, "re-checks the date before recording");
  assert.ok(h.indexOf("save()") < h.indexOf('classList.add("just")'), "effect runs after the state update");
  const css = read("assets/app.css");
  assert.match(css, /@media \(prefers-reduced-motion:reduce\)\{\.xw li\.just\{animation:none\}/);
  const { I18N } = loadBrowser("assets/data.js").DINSATHI;
  for (const l of ["en", "bn"]) for (const k of ["extra", "x_tahajjud", "x_duha", "x_rawatib", "x_witr", "x_witr_hanafi", "x_witr_shafii", "x_witr_any", "x_fast", "x_done", "x_undone"]) assert.ok(I18N[l][k], `${l}.${k}`);
  for (const k of ["x_witr_hanafi", "x_witr_shafii", "x_witr_any"]) assert.match(I18N.en[k], /wajib|sunnah/i, `${k} names Witr's status`);
  assert.match(I18N.en.x_witr_hanafi, /below fard/, "Hanafi wajib is not presented as fard");
});

test("new scripts are loaded before app.js and precached", () => {
  const html = read("index.html"), sw = read("sw.js");
  for (const f of ["assets/bnfix.js", "assets/xtrack.js"]) {
    assert.ok(exists(f));
    assert.ok(html.indexOf(f) > 0 && html.indexOf(f) < html.indexOf("assets/app.js"), `${f} before app.js`);
    assert.ok(sw.includes(`"${f}"`), `${f} precached`);
  }
  assert.match(sw, /\(ar\|en\|bn\|bnt\)/, "offline save accepts the tafsir files");
});
