import { test } from "node:test";
import assert from "node:assert/strict";
import { loadBrowser, read } from "./helpers.mjs";

const G = loadBrowser("assets/guide.js").IE_GUIDE;
const nonblank = s => typeof s === "string" && s.trim().length > 0;
const FARD = { fajr: 2, dhuhr: 4, asr: 4, maghrib: 3, isha: 4 };

test("five prayers with the agreed fard counts in both schools", () => {
  assert.deepEqual([...G.prayers.map(p => p.k)], ["fajr", "dhuhr", "asr", "maghrib", "isha"]);
  for (const p of G.prayers) for (const sc of ["hanafi", "shafii"]) {
    const f = p[sc].filter(x => x.kind === "fard");
    assert.equal(f.length, 1, `${p.k}/${sc} one fard block`); assert.equal(f[0].n, FARD[p.k], `${p.k}/${sc} fard count`);
    for (const x of p[sc]) { assert.ok(["fard", "wajib", "sm", "sg", "witr"].includes(x.kind)); assert.ok(["before", "fard", "after", "witr"].includes(x.when)); assert.ok(Number.isInteger(x.n) && x.n > 0); }
    // order: before -> fard -> after -> witr
    const rank = { before: 0, fard: 1, after: 2, witr: 3 }, r = p[sc].map(x => rank[x.when]);
    assert.deepEqual([...r], [...r].sort((a, b) => a - b), `${p.k}/${sc} order`);
  }
});

test("Witr is wajib only in the Hanafi column; the other column says sunnah-based witr", () => {
  const isha = G.prayers.find(p => p.k === "isha");
  assert.ok(isha.hanafi.some(x => x.kind === "wajib" && x.n === 3));
  assert.ok(isha.shafii.some(x => x.kind === "witr") && !isha.shafii.some(x => x.kind === "wajib"));
  assert.match(isha.note.en, /Hanafi: Witr is wajib/); assert.match(isha.note.en, /majority/i);
});

test("every note, term and source is localized and resolvable", () => {
  for (const p of G.prayers) { assert.ok(nonblank(p.note.en) && nonblank(p.note.bn), p.k); assert.ok(p.src.length >= 3, `${p.k} sources`); for (const id of p.src) assert.ok(G.refs[id], `${p.k}: unknown source ${id}`); }
  for (const x of G.terms) { assert.ok(nonblank(x.en[0]) && nonblank(x.en[1]) && nonblank(x.bn[0]) && nonblank(x.bn[1]), x.k); for (const id of x.src) assert.ok(G.refs[id], `${x.k}: ${id}`); }
  for (const [k, n] of Object.entries(G.notes)) { assert.ok(nonblank(n.en) && nonblank(n.bn), k); for (const id of n.src || []) assert.ok(G.refs[id], `${k}: ${id}`); }
  for (const [id, r] of Object.entries(G.refs)) { assert.ok(nonblank(r.en) && nonblank(r.bn), id); assert.match(r.url, /^https:\/\/(sunnah\.com|islamqa\.org|islamqa\.info|islamweb\.net)\//, id); }
  assert.match(G.notes.review.en, /not a fatwa/i); assert.match(G.notes.review.en, /not yet been independently reviewed/i);
});

test("the guide is reachable from navigation in both languages", () => {
  const app = read("assets/app.js"), { I18N } = loadBrowser("assets/data.js").DINSATHI;
  assert.match(app, /\["guide", "guide", "more\/guide"\]/, "sidebar entry");
  assert.match(app, /\["guide", "guide", t\("guide_s"\)\]/, "More menu entry");
  assert.ok(I18N.en.guide && I18N.bn.guide && I18N.en.guide !== I18N.bn.guide);
});
