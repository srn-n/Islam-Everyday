import { test } from "node:test";
import assert from "node:assert/strict";
import { json, read, exists, pad, quranMeta, skeleton } from "./helpers.mjs";

const META = quranMeta().meta;
const LANGS = ["ar", "en", "bn"];
const load = (l, s) => json(`data/quran/${l}/${pad(s)}.json`);
const textOf = (l, d) => (l === "bn" ? d.t : d);

test("surah metadata: 114 surahs, 6,236 ayat", () => {
  assert.equal(META.length, 114);
  assert.equal(META.reduce((a, m) => a + m[3], 0), 6236);
  META.forEach((m, i) => {
    assert.equal(m.length, 5, `surah ${i + 1} metadata shape`);
    assert.ok(m[0] && m[1] && m[2], `surah ${i + 1} names (ar/en/bn)`);
    assert.ok(Number.isInteger(m[3]) && m[3] > 0, `surah ${i + 1} ayah count`);
    assert.ok(["meccan", "medinan"].includes(m[4]), `surah ${i + 1} revelation place`);
  });
});

for (const l of LANGS) {
  test(`${l}: every surah file exists, parses and matches the ayah count`, () => {
    let total = 0;
    for (let s = 1; s <= 114; s++) {
      assert.ok(exists(`data/quran/${l}/${pad(s)}.json`), `${l} ${s} missing`);
      const d = load(l, s), t = textOf(l, d);
      assert.ok(Array.isArray(t), `${l} ${s}: text array`);
      assert.equal(t.length, META[s - 1][3], `${l} ${s}: ayah count`);
      t.forEach((v, k) => assert.ok(typeof v === "string" && v.trim().length > 0, `${l} ${s}:${k + 1} empty`));
      if (l === "bn") {
        assert.ok(Array.isArray(d.f) && d.f.length === t.length, `bn ${s}: footnote array aligned`);
        d.f.forEach((v, k) => assert.equal(typeof v, "string", `bn ${s}:${k + 1} footnote type`));
      }
      total += t.length;
    }
    assert.equal(total, 6236);
  });
}

test("alignment: languages agree ayah by ayah", () => {
  // A few Bangla verses are published with their own number prefix ("১. ..."): it must equal the ayah index.
  const bnDigits = s => s.replace(/[০-৯]/g, d => "০১২৩৪৫৬৭৮৯".indexOf(d));
  const mismatched = [];
  for (let s = 1; s <= 114; s++) load("bn", s).t.forEach((v, k) => { const m = /^\s*([০-৯]+)\s*[.।]/.exec(v); if (m && +bnDigits(m[1]) !== k + 1) mismatched.push(`${s}:${k + 1}`); });
  assert.deepEqual(mismatched, [], "Bangla number prefix does not match its position");
  // Spot checks at fixed positions across the Qur'an: Arabic (skeleton), English and Bangla must all fit the same verse.
  const spot = [
    [1, 1, "بسم الله", "In the name of Allah", "রহমান"],
    [2, 1, "الم", "Alif. Lam. Mim", "আলিফ"],
    [2, 255, "الحي القيوم", "There is no God save Him", "আল্লাহ্"], // Pickthall 1930 wording, restored in Phase 4
    [19, 1, "كهيعص", "Kaf. Ha. Ya. A'in. Sad", "কাফ"],
    [36, 1, "يس", "Ya Sin", "সীন"],
    [55, 13, "فبأي آلاء ربكما تكذبان", "favours of your Lord", "অনুগ্রহ"],
    [112, 1, "قل هو الله أحد", "He is Allah, the One", "আল্লাহ্"],
    [114, 6, "من الجنة والناس", "jinn", "জিন"]
  ];
  for (const [s, a, ar, en, bn] of spot) {
    assert.ok(skeleton(load("ar", s)[a - 1]).includes(skeleton(ar)), `ar ${s}:${a}`);
    assert.ok(load("en", s)[a - 1].includes(en), `en ${s}:${a}: "${load("en", s)[a - 1]}"`);
    assert.ok(load("bn", s).t[a - 1].includes(bn), `bn ${s}:${a}: "${load("bn", s).t[a - 1]}"`);
  }
});

test("editions.json: source, licence and attribution metadata for each language", () => {
  const e = json("data/quran/editions.json");
  for (const l of LANGS) {
    const x = e[l];
    assert.ok(x, `edition ${l}`);
    for (const k of ["id", "title", "sourceUrl", "license", "attribution", "inputSha256"]) assert.ok(x[k], `${l}.${k}`);
    assert.match(x.inputSha256, /^[0-9a-f]{64}$/);
  }
  assert.ok(e.en.translator && e.bn.translator, "translators named");
  assert.equal(e.bn.version, "1.1.1");
  assert.match(e.bn.license, /no modification/i);
  assert.match(e.en.license, /public domain/i);
});

test("coverage.json agrees with the data files", () => {
  const c = json("data/quran/coverage.json");
  assert.equal(c.expectedSurahs, 114);
  assert.equal(c.expectedAyahs, 6236);
  for (const l of LANGS) {
    const x = c.languages[l];
    assert.equal(x.ayahs, 6236, `${l} ayahs`);
    assert.equal(x.complete, true, `${l} complete`);
    assert.deepEqual(x.missing, []); assert.deepEqual(x.empty, []);
  }
  // recompute Bangla footnote statistics
  const marks = s => new Set([...s.matchAll(/\[([০-৯]+)\]/g)].map(m => m[1]));
  let withNotes = 0; const without = [];
  for (let s = 1; s <= 114; s++) { const d = load("bn", s); d.t.forEach((t, k) => { const f = d.f[k]; if (f.trim()) withNotes++; const m = marks(t), n = marks(f); if ([...m].some(x => !n.has(x))) without.push(`${s}:${k + 1}`); }); }
  assert.equal(c.languages.bn.footnotes.ayahsWithFootnotes, withNotes);
  assert.deepEqual(c.languages.bn.footnotes.markersWithoutNote, without);
});

test("Bangla footnotes only use markup the reader re-allows (<b>)", () => {
  for (let s = 1; s <= 114; s++) {
    const d = load("bn", s);
    for (const v of d.t.concat(d.f)) for (const tag of v.match(/<[^>]*>/g) || []) assert.match(tag, /^<\/?b>$/, `unexpected tag ${tag} in surah ${s}`);
  }
});

test("the app fetches translations only from local files (no runtime API)", () => {
  const app = read("assets/app.js");
  const fetches = [...app.matchAll(/fetch\(([^)]*)\)/g)].map(m => m[1]);
  assert.ok(fetches.length > 0);
  for (const f of fetches) assert.doesNotMatch(f, /https?:/, `remote fetch: ${f}`);
  assert.doesNotMatch(read("sw.js"), /fonts\.googleapis|gstatic/);
  assert.doesNotMatch(read("index.html"), /fonts\.googleapis|gstatic|https?:\/\/(?!www\.w3\.org)/);
});

