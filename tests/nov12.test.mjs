// Nov 2026 (second batch, from the Notion tasks of 12 Nov): tabs, More order, sounds, notifications, scenes, motion,
// places, prayer guide pop-ups and the three-quarter, men/women How to pray.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { read, loadBrowser, p } from "./helpers.mjs";
const app = read("assets/app.js"), css = read("assets/app.css"), X = loadBrowser("assets/data.js").DINSATHI, { I18N } = X;

test("tabs: Today, Qur'an, Hadith, More; Duas lives in More; old links still work", () => {
  assert.match(app, /const TABS = \["today", "quran", "hadith", "more"\]/);
  assert.match(app, /const oldHash = h => h === "duas" \? "more\/duas" : h === "more\/hadith" \? "hadith" : h;/);
  const m = app.slice(app.indexOf("function vMore()"), app.indexOf("function vDev()"));
  const order = [...m.matchAll(/\["(\w+)", "\w+", /g)].map(x => x[1]);
  assert.deepEqual(order.slice(0, 5), ["duas", "names", "guide", "calendar", "dev"]);
  assert.match(app, /function vDev\(\) \{\n  return `<div class="page-head">\$\{back\(\)\}<h2>\$\{t\("dev"\)\}<\/h2><\/div>`;/, "blank for now");
});

test("notification sounds: phone default or one of three app sounds, each on its own channel", () => {
  assert.match(app, /const NF_SND = \["default", "drop", "tap", "breeze"\]/);
  // Each file must be a whole, unaltered WAV: the sizes in its header match the file (a copy that converted line
  // endings once added bytes and corrupted them). The app's copy and the Android copy are identical.
  for (const k of ["drop", "tap", "breeze"]) {
    const a = readFileSync(p(`android-app/android/app/src/main/res/raw/ie_${k}.wav`)), b = readFileSync(p(`assets/sounds/ie_${k}.wav`));
    assert.equal(a.toString("latin1", 0, 4), "RIFF", k); assert.equal(a.readUInt32LE(4) + 8, a.length, k + " RIFF size");
    assert.equal(a.toString("latin1", 36, 40), "data", k); assert.equal(a.readUInt32LE(40) + 44, a.length, k + " data size");
    assert.ok(a.equals(b), k + " same in both places");
  }
  assert.match(app, /deleteChannel/); assert.match(app, /const nfCh = \(base, s\) => s === "default" \? base : base \+ "_" \+ s;/);
});

test("voluntary prayer reminders: Tahajjud at the last third of the night, Duha mid-morning", () => {
  assert.match(app, /at = fj - \(fj - mg\) \/ 3/); assert.match(app, /sr \+ \(dh - sr\) \/ 2/);
  for (const k of ["nf_tahajjud", "nf_duha", "nf_tahajjud_b", "nf_duha_b", "nf_nafl"]) assert.ok(I18N.en[k] && I18N.bn[k], k);
  assert.match(I18N.en.nf_tahajjud_b, /Sahih al-Bukhari 1145/); assert.match(I18N.en.nf_duha_b, /Sahih Muslim 720/);
});

test("scenes: nine, a daily rotation with the mosque on Fridays", () => {
  assert.match(app, /const SCENES = \["landscape", "sky", "mosque", "dunes", "mountains", "sea", "forest", "fields", "canyon"\]/);
  assert.match(app, /if \(isFriD\(s\.d0\)\) return "mosque";/);
  for (const k of ["dunes", "mountains", "sea", "forest", "fields", "canyon", "auto"]) assert.ok(I18N.en["sc_" + k] && I18N.bn["sc_" + k], k);
});

test("places: every country in Asia is listed, grouped by country, with unique ids and working time zones", () => {
  const { CITIES, COUNTRIES, REGIONS } = X, ids = new Set();
  for (const c of CITIES) { assert.ok(!ids.has(c.id), c.id); ids.add(c.id); assert.ok(COUNTRIES[c.g], c.id); assert.doesNotThrow(() => new Intl.DateTimeFormat("en", { timeZone: c.zone }), c.zone); assert.ok(/[ঀ-৿]/.test(c.bn), c.id); }
  for (const cc of ["af", "am", "az", "bh", "bd", "bt", "bn", "kh", "cn", "cy", "ge", "in", "id", "ir", "iq", "jp", "jo", "kz", "kw", "kg", "la", "lb", "my", "mv", "mn", "mm", "np", "kp", "om", "pk", "ps", "ph", "qa", "sa", "sg", "kr", "lk", "sy", "tw", "tj", "th", "tl", "tr", "tm", "ae", "uz", "vn", "ye"]) assert.ok(CITIES.some(c => c.g === cc), cc);
  for (const id of ["syd", "dac", "lon", "nyc", "yyz", "dxb", "kua", "mak"]) assert.ok(ids.has(id), "kept " + id);
  for (const k of Object.values(COUNTRIES)) { assert.ok(REGIONS.some(r => r[0] === k.r)); assert.ok(X.METHODS[k.m]); }
});

test("How to pray: three-quarter view, men and women", () => {
  const SL = loadBrowser("assets/salah.js").IE_SALAH, F = loadBrowser("assets/salah-fig.js").IE_SALAH_FIG;
  const w = F.draw(F.pose("sujudW"), { who: "woman", points: true }), m = F.draw(F.pose("sujud"), { points: true });
  assert.match(w, /sl-scarf/); assert.doesNotMatch(w, /sl-pants|sl-cap/); assert.match(m, /sl-cap/); assert.match(m, /sl-pants/);
  assert.equal((w.match(/class="sl-pt"/g) || []).length, 7);
  const hw = SL.steps("hanafi", "woman");
  assert.equal(hw.find(s => s.id === "qiyam").pose, "chest"); assert.equal(hw.find(s => s.id === "takbir").pose, "shoulder");
  assert.equal(hw.find(s => s.id === "sujud").pose, "sujudW"); assert.equal(hw.find(s => s.id === "last").pose, "sitWf");
  assert.equal(SL.steps("shafii", "woman").find(s => s.id === "sujud").pose, "sujudC");
  assert.deepEqual(SL.steps("hanafi", "man").map(s => s.pose), SL.steps("hanafi").map(s => s.pose));
  for (const k of SL.SCHOOLS) for (const s of SL.steps(k, "woman")) { assert.ok(F.POSE[s.pose], s.pose); assert.ok(/[ঀ-৿]/.test(s.d.bn)); }
  assert.ok(F.inset("chest", 0.5, "woman").includes("si-scarf"));
  assert.ok(SL.notes("maliki", "woman").length === SL.NOTES.maliki.length + 1);
});

test("motion: Slide and Fade, with a suggestion from the Android version", () => {
  assert.match(app, /const moRec = \(\) => \{ const v = andVer\(\); return v == null \? null : v >= 12 \? "subtle" : "fade"; \}/);
  assert.equal(I18N.en.mo_subtle, "Slide"); assert.equal(I18N.en.mo_fade, "Fade");
  assert.match(css, /\.sheet\.pop\.on/); assert.match(css, /\.scrim\.blur/);
});
