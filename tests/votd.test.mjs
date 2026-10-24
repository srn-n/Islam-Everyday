// Daily Ayah: the reviewed 180-day schedule (Phase 5).
import { test } from "node:test";
import assert from "node:assert/strict";
import { loadBrowser, quranMeta, read, json, pad } from "./helpers.mjs";

const V = loadBrowser("assets/votd.js").DINSATHI_VOTD;
const META = quranMeta().meta;
const key = (y, m, d) => V.entryFor(y, m, d).id;

test("schedule: exactly 180 approved entries with unique, consecutive sequence numbers", () => {
  assert.equal(V.CYCLE, 180);
  assert.equal(V.SCHEDULE.length, 180);
  V.SCHEDULE.forEach((e, i) => {
    assert.equal(e.seq, i + 1, `sequence at ${i}`);
    assert.equal(e.id, "d" + String(i + 1).padStart(3, "0"));
    assert.equal(e.review, "checked", `${e.id} is reviewed`);
    for (const k of ["s", "surah", "a", "b", "theme", "why", "src"]) assert.ok(e[k] != null && e[k] !== "", `${e.id}.${k}`);
  });
  assert.equal(new Set(V.SCHEDULE.map(e => e.id)).size, 180);
});

test("schedule: every reference is a real, valid verse range and no passage repeats or overlaps", () => {
  const used = new Set();
  for (const e of V.SCHEDULE) {
    assert.ok(e.s >= 1 && e.s <= 114, `${e.id} surah`);
    assert.equal(e.surah, META[e.s - 1][1], `${e.id} surah name`);
    assert.ok(e.a >= 1 && e.a <= e.b && e.b <= META[e.s - 1][3], `${e.id} range ${e.s}:${e.a}-${e.b}`);
    assert.ok(e.b - e.a < 8, `${e.id} is a short passage`);
    for (let k = e.a; k <= e.b; k++) { const v = e.s + ":" + k; assert.ok(!used.has(v), `${v} appears twice`); used.add(v); }
    assert.match(e.src[0], new RegExp(`^https://quran\\.com/${e.s}/${e.a}(-${e.b})?$`));
  }
});

test("schedule: Arabic, English, Bangla and the short tafsir exist for every verse of every entry", () => {
  const cache = {};
  const get = (l, s) => cache[l + s] || (cache[l + s] = json(`data/quran/${l}/${pad(s)}.json`));
  for (const e of V.SCHEDULE) for (let k = e.a; k <= e.b; k++) {
    assert.ok(get("ar", e.s)[k - 1].trim(), `ar ${e.s}:${k}`);
    assert.ok(get("en", e.s)[k - 1].trim(), `en ${e.s}:${k}`);
    assert.ok(get("bn", e.s).t[k - 1].trim(), `bn ${e.s}:${k}`);
    assert.ok(get("bnt", e.s)[k - 1].trim(), `bnt ${e.s}:${k}`);
  }
});

test("schedule: themes follow the six 30-day blocks; context notes exist in both languages", () => {
  assert.equal(V.THEMES.length, 6);
  for (const e of V.SCHEDULE) { const t = V.themeOf(e); assert.ok(t && e.seq >= t.from && e.seq <= t.to, `${e.id} theme ${e.theme}`); assert.ok(t.en && t.bn); }
  const withCtx = V.SCHEDULE.filter(e => e.ctx);
  assert.ok(withCtx.length >= 40);
  for (const e of withCtx) { assert.ok(e.ctx.en.length > 20 && e.ctx.bn.length > 10, e.id); }
  // passages that address the Prophet directly carry a context note (for example 93:3-5)
  for (const ref of ["93:3", "94:5", "39:53", "21:83", "5:32"]) { const [s, a] = ref.split(":").map(Number); assert.ok(V.SCHEDULE.find(e => e.s === s && e.a === a).ctx, ref + " has a context note"); }
});

test("deterministic: the same date gives the same entry on repeated calls, and different days differ", () => {
  for (let i = 0; i < 3; i++) assert.equal(key(2026, 10, 17), key(2026, 10, 17));
  assert.notEqual(key(2026, 10, 17), key(2026, 10, 18));
  assert.equal(V.entryFor(2026, 1, 1).seq, 1, "anchor is Day 1");
});

test("cycle: day 180 is the last entry and day 181 starts again; dates before the anchor wrap the same way", () => {
  assert.equal(V.entryFor(2026, 6, 29).seq, 180);   // 179 days after 1 January 2026
  assert.equal(V.entryFor(2026, 6, 30).seq, 1);     // day 181
  assert.equal(V.entryFor(2025, 12, 31).seq, 180);  // the day before the anchor
  assert.equal(V.entryFor(2025, 7, 5).seq, 1);      // 180 days before the anchor
  const seen = new Set(); for (let n = 0; n < 180; n++) { const d = new Date(Date.UTC(2026, 0, 1 + n)); seen.add(key(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate())); }
  assert.equal(seen.size, 180, "every entry once per cycle");
});

test("calendar boundaries: month ends, leap days and year ends advance by exactly one entry", () => {
  const next = (y, m, d) => { const u = new Date(Date.UTC(y, m - 1, d + 1)); return [u.getUTCFullYear(), u.getUTCMonth() + 1, u.getUTCDate()]; };
  for (const day of [[2028, 2, 28], [2028, 2, 29], [2027, 2, 28], [2026, 12, 31], [2026, 4, 30], [2026, 10, 3]]) {
    const a = V.entryFor(...day).seq, b = V.entryFor(...next(...day)).seq;
    assert.equal(b, a === 180 ? 1 : a + 1, `after ${day.join("-")}`);
  }
  assert.equal(V.dayNumber(2028, 3, 1) - V.dayNumber(2028, 2, 28), 2, "leap day counted");
});

test("no random choice anywhere in the Daily Ayah path; language does not change the entry", () => {
  const app = read("assets/app.js"), body = app.slice(app.indexOf("function votdBody"), app.indexOf("/* Moon drawn"));
  assert.doesNotMatch(read("assets/votd.js") + body, /Math\.random/);
  assert.match(app, /VOTD\.entryFor\(s\.p\.year, s\.p\.month, s\.p\.day\)/, "entry depends only on the city's local date");
  assert.doesNotMatch(body, /slice\(|substr|…|text-overflow/, "whole passage shown");
  assert.match(body, /e\.ctx\[st\.lang\]/, "context note in the current language");
});
