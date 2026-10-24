// Phase 5.4: release audit checks. Solar calculations against an independent algorithm, Qur'an data integrity
// across languages, Hadith reference labels and Bangla numerals, the wording of approximations and zakat validation.
import { test } from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { read, json, loadBrowser } from "./helpers.mjs";

const app = read("assets/app.js");
const { I18N } = loadBrowser("assets/data.js").DINSATHI;
const hctx = loadBrowser("assets/hadith.js", "assets/nawawi.js"), HD = hctx.IE_HADITH, NW = hctx.IE_NAWAWI;
const fn = name => { const i = app.indexOf(`function ${name}(`); assert.ok(i >= 0, name); let d = 0; for (let k = app.indexOf("{", i); ; k++) { if (app[k] === "{") d++; else if (app[k] === "}" && --d === 0) return app.slice(i, k + 1); } };

/* NOAA solar calculator algorithm (Meeus-based), written independently of the app's formulas. */
function noaa(y, m, d, lat, lng, tz) {
  const jdn = Date.UTC(y, m - 1, d) / 864e5 + 2440587.5, r = x => x * Math.PI / 180, dg = x => x * 180 / Math.PI;
  const at = h => {
    const T = (jdn + (h - tz) / 24 - 2451545) / 36525, L0 = (280.46646 + T * (36000.76983 + T * 0.0003032)) % 360, M = 357.52911 + T * (35999.05029 - 0.0001537 * T), e = 0.016708634 - T * (0.000042037 + 0.0000001267 * T);
    const C = Math.sin(r(M)) * (1.914602 - T * (0.004817 + 0.000014 * T)) + Math.sin(r(2 * M)) * (0.019993 - 0.000101 * T) + Math.sin(r(3 * M)) * 0.000289;
    const om = 125.04 - 1934.136 * T, lam = L0 + C - 0.00569 - 0.00478 * Math.sin(r(om)), eps = 23 + (26 + (21.448 - T * (46.815 + T * (0.00059 - T * 0.001813))) / 60) / 60 + 0.00256 * Math.cos(r(om));
    const dec = dg(Math.asin(Math.sin(r(eps)) * Math.sin(r(lam)))), yv = Math.tan(r(eps / 2)) ** 2;
    const eq = 4 * dg(yv * Math.sin(2 * r(L0)) - 2 * e * Math.sin(r(M)) + 4 * e * yv * Math.sin(r(M)) * Math.cos(2 * r(L0)) - 0.5 * yv * yv * Math.sin(4 * r(L0)) - 1.25 * e * e * Math.sin(2 * r(M)));
    return { dec, eq };
  };
  const noonAt = h => 720 - 4 * lng - at(h).eq + tz * 60;
  const ev = (g, s) => { const { dec } = at(g / 60); const x = Math.cos(r(90.833)) / (Math.cos(r(lat)) * Math.cos(r(dec))) - Math.tan(r(lat)) * Math.tan(r(dec)); return noonAt(g / 60) + s * 4 * dg(Math.acos(x)); };
  const noon = noonAt(12);
  return { sunrise: ev(ev(noon - 360, -1), -1) / 60, dhuhr: noon / 60, maghrib: ev(ev(noon + 360, 1), 1) / 60 };
}

test("solar times match an independent NOAA calculation within 1 minute (sunrise, solar noon, sunset)", () => {
  const c = { METHODS: { MWL: { f: 18, i: 17 } } }; vm.createContext(c);
  vm.runInContext("const rad = d => d * Math.PI / 180, deg = r => r * 180 / Math.PI, fix = (a, b) => ((a % b) + b) % b;\n" + [fn("julian"), fn("sunPos"), fn("prayerTimes")].join("\n"), c);
  const cases = [[-33.8688, 151.2093, 11, 2026, 10, 19], [-33.8688, 151.2093, 10, 2026, 6, 21], [-33.8688, 151.2093, 11, 2026, 10, 4], [-33.8688, 151.2093, 10, 2026, 4, 5],
    [23.8103, 90.4125, 6, 2026, 10, 19], [23.8103, 90.4125, 6, 2026, 3, 20], [21.4225, 39.8262, 3, 2026, 12, 21], [51.5074, -0.1278, 1, 2026, 6, 21], [51.5074, -0.1278, 0, 2026, 12, 21],
    [43.65, -79.38, -4, 2026, 9, 1], [64.15, -21.94, 0, 2026, 3, 20], [69.65, 18.96, 1, 2026, 3, 1], [1.35, 103.82, 8, 2026, 7, 1], [-37.81, 144.96, 11, 2027, 1, 1]];
  for (const [lat, lng, tz, y, m, d] of cases) {
    const a = c.prayerTimes(y, m, d, lat, lng, tz, "MWL", 1), b = noaa(y, m, d, lat, lng, tz);
    for (const k of ["sunrise", "dhuhr", "maghrib"]) assert.ok(Math.abs(a[k] - b[k]) * 60 < 1, `${lat},${lng} ${y}-${m}-${d} ${k}: ${((a[k] - b[k]) * 60).toFixed(2)} min`);
  }
});

test("day times use the zone offset of the day itself, so DST change days stay consistent", () => {
  const f = fn("dayTimes");
  assert.match(f, /tzOffset\(c\.zone, new Date\(Date\.UTC\(y, m - 1, d, 12\) - c\.lng \/ 15 \* 36e5\)\)/, "offset taken at local solar noon of that date");
  assert.match(f, /abs: k => base \+ tm\[k\] \* 36e5/, "absolute instants, so countdowns are real elapsed time");
});

test("Qur'an data: the same verse ids in Arabic, English, Bangla and the Bangla short tafsir", () => {
  let total = 0;
  for (let s = 1; s <= 114; s++) {
    const p = String(s).padStart(3, "0"), ar = json(`data/quran/ar/${p}.json`), en = json(`data/quran/en/${p}.json`), bn = json(`data/quran/bn/${p}.json`).t, bnt = json(`data/quran/bnt/${p}.json`);
    assert.ok(ar.length === en.length && en.length === bn.length && bn.length === bnt.length, `surah ${s}`);
    total += ar.length;
  }
  assert.equal(total, 6236);
});

test("English translation: every correction applied, none reverted, 24 adopted 1930 readings flagged, held readings kept", () => {
  const C = json("data/quran/en-corrections.json").corrections, verse = r => { const [s, a] = r.split(":").map(Number); return json(`data/quran/en/${String(s).padStart(3, "0")}.json`)[a - 1]; };
  assert.equal(C.length, 393);
  assert.equal(new Set(C.map(c => c.ref)).size, 393, "one entry per verse");
  for (const c of C) { const v = verse(c.ref); assert.ok(v.includes(c.corrected), c.ref); if (!c.corrected.includes(c.source)) assert.ok(!v.includes(c.source), `${c.ref} source wording is gone`); }
  assert.deepEqual(C.filter(c => c.review).map(c => c.ref).sort(), ["10:83", "2:100", "2:159", "20:84", "3:144", "3:161", "3:163", "3:23", "33:63", "36:65", "4:11", "43:32", "43:81", "5:19", "5:93", "6:12", "6:54", "63:6", "66:5", "68:19", "69:17", "7:137", "7:89", "78:33"].sort());
  assert.match(verse("2:57"), /they wronged Us not/); assert.match(verse("82:9"), /ye deny the Judgment/);
  // the electronic text's mechanical rewordings must not come back
  const all = Array.from({ length: 114 }, (_, i) => json(`data/quran/en/${String(i + 1).padStart(3, "0")}.json`).join("\n")).join("\n");
  for (const bad of [/Your Allah is One Allah/, /there is no Allah save/, /any Allah beside/, /\bMakka\b/, /Master of the Day of Judgment/, /nor have a ye/]) assert.doesNotMatch(all, bad);
});

test("Hadith: Bangla notes use Bangla numerals; references use sunnah.com's own numbers", () => {
  for (const h of HD.HADITH) if (h.note) assert.doesNotMatch(h.note.bn, /[0-9]/, `${h.id} Bangla note`);
  for (const h of NW.HADITH) if (h.note) assert.doesNotMatch(h.note.bn, /[0-9]/, `an-Nawawi ${h.n} Bangla note`);
  const refs = HD.HADITH.flatMap(h => h.refs.map(r => r.c + ":" + r.n));
  assert.ok(refs.includes("muslim:2318a") && refs.includes("muslim:1893a"), "sunnah.com lists these as 2318a and 1893a");
  assert.ok(!refs.includes("muslim:2318") && !refs.includes("muslim:1893"));
});

test("approximate margins are worded as approximate in both languages", () => {
  for (const k of ["fw_sunrise", "fw_afterfajr", "fw_soon_sunrise"]) assert.match(I18N.en[k], /about/, k);
  for (const k of ["fw_soon_zenith", "fw_soon_sunset"]) { assert.match(I18N.en[k], /^From about \{t\}/, k); assert.match(I18N.bn[k], /^প্রায় \{t\}/, "bn " + k); }
  assert.match(I18N.en.fw_b3, /The sources give no minutes; this app uses about 15 minutes after sunrise, 10 minutes before Dhuhr and 15 minutes before sunset as approximations/);
});

test("zakat validation message names every reason a value is ignored", () => {
  assert.match(I18N.en.zk_invalid, /not valid numbers, were negative or were unrealistically large/);
  assert.match(I18N.bn.zk_invalid, /অবাস্তব/);
  assert.match(read("assets/zakat.js"), /n > MAX/);
});

test("no interface text claims scholarly approval", () => {
  const texts = [...Object.values(I18N.en), ...Object.values(I18N.bn)].filter(v => typeof v === "string");
  for (const v of texts) assert.doesNotMatch(v, /\b(approved|endorsed|certified|verified) by (a |the )?(qualified )?(scholar|mufti|imam)/i, v.slice(0, 80));
  assert.doesNotMatch(app, /scholar[- ]approved|approved by (a |the )?scholar/i);
  assert.match(NW.SOURCE.review, /Not reviewed by a qualified scholar/); assert.match(HD.SOURCE.review, /Not reviewed by a qualified scholar/);
});
