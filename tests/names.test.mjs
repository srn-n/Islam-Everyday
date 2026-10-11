import { test } from "node:test";
import assert from "node:assert/strict";
import { loadBrowser, json, pad, skeleton, quranMeta, read } from "./helpers.mjs";

const D = loadBrowser("assets/names.js").DINSATHI_NAMES;
const META = quranMeta().meta;
const loc = s => /^[\s\S]*\S[\s\S]*$/.test(s || "");
const citeOk = id => { const k = id.indexOf(":"), w = k < 0 ? id : id.slice(0, k); return !!D.works[w]; };
const arCache = {};
const verse = (s, a) => (arCache[s] || (arCache[s] = json(`data/quran/ar/${pad(s)}.json`)))[a - 1];

test("review policy is per entry and never claims scholar approval", () => {
  assert.equal(D.meta.review, "not-independently-reviewed");
  assert.match(D.meta.reviewText.en, /independently reviewed by a qualified scholar/i);
  assert.ok(loc(D.meta.reviewText.bn));
  assert.doesNotMatch(JSON.stringify(D), /scholar[- ]approved|approved by (a )?scholar|globally verified|verified globally/i);
  const app = read("assets/app.js"), data = read("assets/data.js");
  for (const st of ["commentary", "related", "text", "none"]) assert.match(data, new RegExp(`rv_${st}:"[^"]+"`), `review sentence for ${st}`);
  assert.equal((data.match(/rv_none:"/g) || []).length, 2, "review sentences in English and Bangla");
  assert.doesNotMatch(app, /review-flag/, "no collection-wide review banner in the UI");
});

test("99 entries with stable, unique ids and numbering", () => {
  assert.equal(D.names.length, 99);
  const ids = new Set();
  D.names.forEach((x, i) => {
    assert.match(x.id, /^[a-z0-9-]+$/, `id format ${x.id}`);
    assert.ok(!ids.has(x.id), `duplicate id ${x.id}`); ids.add(x.id);
    assert.equal(x.n, i + 1);
  });
});

test("each entry has Arabic, transliteration and localized meanings", () => {
  for (const x of D.names) {
    assert.match(x.ar, /[؀-ۿ]/, `${x.id} ar`);
    for (const k of ["tl", "bt", "en", "bn"]) assert.ok(loc(x[k]), `${x.id}.${k}`);
    assert.match(x.bt + x.bn, /[ঀ-৿]/, `${x.id} Bangla script`);
  }
});

test("every entry has nonblank localized content, citations for its explanation, and a known status", () => {
  for (const x of D.names) {
    assert.ok(["commentary", "related", "text", "none"].includes(x.status), `${x.id} status`);
    for (const part of ["expl", "refl"]) { assert.ok(loc(x[part].en) && x[part].en.length > 40, `${x.id}.${part}.en`); assert.ok(loc(x[part].bn) && x[part].bn.length > 30, `${x.id}.${part}.bn`); }
    assert.ok(x.expl.src.length > 0, `${x.id}: explanation must cite what it relies on`);
    assert.ok(x.quran.length + x.hadith.length > 0, `${x.id}: textual evidence`);
    if (x.note) { assert.ok(loc(x.note.en) && loc(x.note.bn), `${x.id}.note`); assert.ok(Array.isArray(x.note.src) && x.note.src.length, `${x.id}.note.src`); }
    const tafsir = x.expl.src.some(id => /^(saadi|ibnkathir):/.test(id));
    if (x.status === "commentary" || x.status === "related") assert.ok(tafsir, `${x.id}: ${x.status} needs a tafsir citation`);
    if (x.status === "text") assert.ok(!tafsir && x.expl.src.every(id => D.hadith[id] || id.startsWith("quran:")), `${x.id}: text-only explanation cites only Qur'an/hadith`);
    if (x.status === "none") { assert.ok(!tafsir, `${x.id}: "none" must not cite commentary`); assert.ok(x.note, `${x.id}: "none" explains its status in a note`); }
  }
});

test("every citation resolves to a known work with a valid locator", () => {
  const all = D.names.flatMap(x => [...x.hadith, ...x.expl.src, ...(x.note ? x.note.src : [])]).concat(D.meta.collection.hadith, D.meta.collection.note.src);
  for (const id of all.filter(i => i.startsWith("quran:"))) { const [s, a] = id.slice(6).split(":").map(Number); assert.ok(s >= 1 && s <= 114 && a >= 1 && a <= META[s - 1][3], `bad Qur'an locator ${id}`); }
  for (const id of all) {
    assert.ok(citeOk(id), `unknown work in ${id}`);
    const [w, ...rest] = id.split(":"), l = rest.join(":");
    if (D.works[w].kind === "tafsir") { const [s, a] = l.split(":").map(Number); assert.ok(s >= 1 && s <= 114 && a >= 1 && a <= META[s - 1][3], `bad tafsir locator ${id}`); }
    if (D.works[w].kind === "hadith") assert.ok(D.hadith[id], `hadith ${id} lacks a verified description`);
  }
  for (const w of Object.values(D.works)) assert.match(w.url, /^https:\/\//);
  for (const [id, h] of Object.entries(D.hadith)) { assert.ok(citeOk(id)); assert.ok(loc(h.en) && loc(h.bn) && loc(h.grade), `hadith ${id}`); }
});

test("Qur'an evidence: references exist and the quoted words appear in the bundled Arabic text", () => {
  const refs = D.names.flatMap(x => x.quran.map(q => [x.id, q])).concat(D.meta.collection.quran.map(q => ["collection", q]));
  assert.ok(refs.length > 100);
  for (const [id, q] of refs) {
    const [s, a] = q.ref.split(":").map(Number);
    assert.ok(s >= 1 && s <= 114 && a >= 1 && a <= META[s - 1][3], `${id}: bad ref ${q.ref}`);
    assert.ok(["name", "verb", "related"].includes(q.form), `${id}: form`);
    assert.ok(skeleton(verse(s, a)).includes(skeleton(q.match)), `${id}: "${q.match}" not found in ${q.ref}`);
  }
});

test("coverage summary (printed for the report)", () => {
  const by = {}; for (const x of D.names) by[x.status] = (by[x.status] || 0) + 1;
  const cites = new Set(D.names.flatMap(x => [...x.quran.map(q => "quran:" + q.ref), ...x.hadith, ...x.expl.src, ...(x.note ? x.note.src : [])]));
  const c = D.meta.collection; [...c.quran.map(q => "quran:" + q.ref), ...c.hadith, ...c.note.src].forEach(x => cites.add(x));
  const works = new Set([...cites].map(c => c.split(":")[0]));
  const kinds = {}; for (const id of cites) { const k = D.works[id.split(":")[0]].kind; kinds[k] = (kinds[k] || 0) + 1; }
  console.log(`names coverage: ${JSON.stringify(by)}; distinct citations: ${cites.size} (${Object.entries(kinds).map(([k, v]) => v + " " + k).join(", ")}); distinct works: ${works.size}`);
  assert.equal(Object.values(by).reduce((a, b) => a + b, 0), 99);
});
