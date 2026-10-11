import { test } from "node:test";
import assert from "node:assert/strict";
import { loadBrowser, quranMeta, read } from "./helpers.mjs";

const V = loadBrowser("assets/votd.js").DINSATHI_VOTD;
const COUNTS = quranMeta().meta.map(m => m[3]);

test("deterministic: the same date always gives the same ayah", () => {
  assert.deepEqual(V.verseFor(2026, 10, 11, COUNTS), V.verseFor(2026, 10, 11, COUNTS));
  assert.notDeepEqual(V.verseFor(2026, 10, 11, COUNTS), V.verseFor(2026, 10, 12, COUNTS));
});

test("covers the complete Qur'an: 6,236 consecutive days visit every ayah exactly once", () => {
  assert.equal(V.TOTAL, 6236); assert.ok(V.coprime);
  const seen = new Set(), start = Date.UTC(2026, 0, 1);
  for (let k = 0; k < 6236; k++) { const d = new Date(start + k * 864e5); const [s, a] = V.verseFor(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate(), COUNTS); seen.add(s + ":" + a); }
  assert.equal(seen.size, 6236);
});

test("locate maps the ends of the corpus correctly", () => {
  assert.deepEqual([...V.locate(0, COUNTS)], [1, 1]);
  assert.deepEqual([...V.locate(7, COUNTS)], [2, 1]);
  assert.deepEqual([...V.locate(6235, COUNTS)], [114, 6]);
  assert.throws(() => V.locate(6236, COUNTS));
});

test("the longest ayah (2:282) is reachable", () => {
  const target = COUNTS.slice(0, 1).reduce((a, b) => a + b, 0) + 281; let found = false;
  for (let n = 0; n < 6236 && !found; n++) if (((n * V.STEP + V.OFFSET) % 6236) === target) found = true;
  assert.ok(found);
});

test("the app shows the whole verse (no truncation in the Verse for today card)", () => {
  const app = read("assets/app.js"), body = app.slice(app.indexOf("function votdBody"), app.indexOf("/* Moon drawn"));
  assert.ok(body.length > 100);
  assert.doesNotMatch(body, /slice\(|substr|…|text-overflow/);
  assert.doesNotMatch(read("assets/app.css"), /\.verse-(ar|tr)\{[^}]*(line-clamp|text-overflow)/);
});
