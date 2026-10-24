// Phase 5.3: prayer countdown, prohibited-time notes, day-chart labels, appearance mode and palettes, zakat, the Hijri
// calendar layout, an-Nawawi's Forty Hadith and the larger general library, and interaction styles. Browser checks
// (live countdown, boundaries in a real page, theme persistence, layout) are in tests/browser/phase53.cjs.
import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import vm from "node:vm";
import { read, json, loadBrowser } from "./helpers.mjs";

const app = read("assets/app.js"), css = read("assets/app.css"), html = read("index.html"), sw = read("sw.js");
const { I18N } = loadBrowser("assets/data.js").DINSATHI;
const DV = loadBrowser("assets/dayviz.js").IE_DAYVIZ;
const ZK = loadBrowser("assets/zakat.js").IE_ZAKAT;
const hctx = loadBrowser("assets/hadith.js", "assets/nawawi.js"), HD = hctx.IE_HADITH, NW = hctx.IE_NAWAWI;
const plain = x => JSON.parse(JSON.stringify(x));

/* Pull a top-level function out of app.js so it can be run on its own (the app itself is one browser IIFE). */
function fn(name) {
  const i = app.indexOf(`function ${name}(`); assert.ok(i >= 0, name);
  let d = 0, j = app.indexOf("{", i);
  for (let k = j; k < app.length; k++) { if (app[k] === "{") d++; else if (app[k] === "}" && --d === 0) return app.slice(i, k + 1); }
  throw new Error(name);
}
const pad2 = n => String(n).padStart(2, "0");
function sandbox(extra = {}) {
  const c = Object.assign({ num: x => String(x), pad2, st: { log: {} }, FORB_SOON: 10 }, extra);
  vm.createContext(c);
  vm.runInContext([fn("countdown"), fn("timesOk"), fn("forbiddenNow")].join("\n"), c);
  return c;
}
/* A day with times in hours; abs(k) gives epoch ms like the app's dayTimes(). */
const BASE = Date.UTC(2026, 9, 19, 0, 0, 0);
const day = tm => ({ tm, abs: k => BASE + tm[k] * 3600e3 });
const SYD = { fajr: 4.7, sunrise: 6.05, dhuhr: 12.4, asr: 15.9, maghrib: 18.75, isha: 20.05 };
const at = h => BASE + Math.round(h * 3600e3);

/* ---------- countdown ---------- */
test("countdown: HH:MM:SS, rounds down, never negative, past 24 h", () => {
  const c = sandbox();
  assert.equal(c.countdown(0), "00:00:00");
  assert.equal(c.countdown(999), "00:00:00");
  assert.equal(c.countdown(61_000), "00:01:01");
  assert.equal(c.countdown(3 * 3600e3 + 25 * 60e3 + 9_400), "03:25:09");
  assert.equal(c.countdown(-5000), "00:00:00");
  assert.equal(c.countdown(25 * 3600e3), "25:00:00");
});

test("countdown targets the next prayer's start, labelled as such, with a safe fallback", () => {
  const f = fn("cdLine");
  // Face 7 (intentional): the label goes through pName so Friday shows "Jumu'ah" for Dhuhr; the key is unchanged.
  assert.match(f, /t\("cd_until"\)\.replace\("\{p\}", pName\(nx\.k, isFriD\(nx\.D\)\)\)/);
  assert.match(f, /id="count-next"/); assert.match(f, /cd_off/);
  assert.match(I18N.en.cd_until, /begins in/); assert.ok(I18N.bn.cd_until);
  assert.doesNotMatch(app, /t\("endsin"\)|t\("endsat"\)/, "no invented end time");
  // the 1-second timer re-renders at a prayer change and updates the text in between
  assert.match(app, /\$\("count-next"\)/);
});

test("timesOk rejects missing, out-of-order and polar-night times", () => {
  const c = sandbox();
  assert.equal(c.timesOk(day(SYD)), true);
  assert.equal(c.timesOk(day({ ...SYD, isha: NaN })), false);
  assert.equal(c.timesOk(day({ ...SYD, asr: 11 })), false, "asr before dhuhr");
  assert.equal(c.timesOk(day({ ...SYD, maghrib: 21, isha: 5.5 })), false, "isha wrapped past midnight");
  assert.equal(c.timesOk(day({ ...SYD, fajr: -1 })), false);
});

/* ---------- prohibited times ---------- */
test("prohibited times: sun-based windows and their boundaries", () => {
  const c = sandbox(), D = day(SYD), s = h => ({ now: at(h), key: "2026-10-19", d0: D });
  const k = h => { const r = c.forbiddenNow(s(h)); return r ? r.state + ":" + r.k : null; };
  // sunrise 06:03 → until 06:18
  assert.equal(k(6.05 - 11 / 60), null, "11 min before sunrise: nothing");
  assert.equal(k(6.05 - 10 / 60), "soon:sunrise");
  assert.equal(k(6.05), "now:sunrise");
  assert.equal(k(6.05 + 14.9 / 60), "now:sunrise");
  assert.equal(k(6.05 + 15 / 60), null, "ends 15 min after sunrise");
  // zenith: 10 min before dhuhr up to dhuhr
  assert.equal(k(12.4 - 20 / 60), "soon:zenith");
  assert.equal(k(12.4 - 10 / 60), "now:zenith");
  assert.equal(k(12.4), null, "Dhuhr time has begun");
  // sunset: 15 min before maghrib up to maghrib
  assert.equal(k(18.75 - 25 / 60), "soon:sunset");
  assert.equal(k(18.75 - 15 / 60), "now:sunset");
  assert.equal(k(18.75), null);
  assert.equal(k(9), null); assert.equal(k(22), null);
});

test("prohibited times: after-Fajr and after-Asr notes only once that prayer is marked prayed", () => {
  const D = day(SYD), s = h => ({ now: at(h), key: "2026-10-19", d0: D });
  const none = sandbox(), done = sandbox({ st: { log: { "2026-10-19": { fajr: true, asr: true } } } });
  assert.equal(none.forbiddenNow(s(5.2)), null, "Fajr not marked: no note");
  assert.equal(done.forbiddenNow(s(5.2)).k, "afterfajr");
  assert.equal(none.forbiddenNow(s(16.5)), null);
  assert.equal(done.forbiddenNow(s(16.5)).k, "afterasr");
  assert.equal(done.forbiddenNow(s(18.75 - 10 / 60)).k, "sunset", "the sun-based period takes over before sunset");
  assert.equal(done.forbiddenNow(s(6.05 + 5 / 60)).k, "sunrise");
});

test("prohibited times: no warning at all when the day's times are unreliable", () => {
  const c = sandbox();
  for (const bad of [{ ...SYD, sunrise: NaN }, { ...SYD, maghrib: 25 }, { ...SYD, dhuhr: 3 }]) {
    for (const h of [6.05, 12.3, 18.6]) assert.equal(c.forbiddenNow({ now: at(h), key: "k", d0: day(bad) }), null);
  }
});

test("prohibited times: compact non-bold line, sources and method recorded, both languages", () => {
  const f = fn("forbiddenLine");
  assert.match(f, /class="forb-warn"/); assert.match(f, /role="note"/); assert.match(f, /data-act="forbinfo"/);
  assert.doesNotMatch(f, /<b>|<strong>/);
  const rule = css.slice(css.indexOf(".forb-warn{"), css.indexOf("}", css.indexOf(".forb-warn{")));
  assert.ok(rule.length > 0 && !/font-weight:\s*(6|7|8|bold)/.test(rule), "not bold");
  for (const u of ["https://sunnah.com/muslim:831", "https://sunnah.com/bukhari:586", "binbaz.org.sa/fatwas/18495"]) assert.ok(app.includes(u), u);
  assert.match(app, /spear's length/, "method notes the sources give no minutes");
  const keys = Object.keys(I18N.en).filter(k => k.startsWith("fw_"));
  assert.ok(keys.length >= 10);
  for (const k of keys) assert.ok(I18N.bn[k], "bn " + k);
});

/* ---------- day chart labels ---------- */
const overlaps = (xs, items, gap) => xs.some((x, i) => i && x - items[i].w / 2 < xs[i - 1] + items[i - 1].w / 2 + gap - 1e-9);
test("day chart labels: chronological, never overlapping, inside the chart, near their events", () => {
  const items = [{ x: 60, w: 30 }, { x: 70, w: 30 }, { x: 150, w: 34 }, { x: 200, w: 26 }, { x: 205, w: 26 }];
  const xs = DV.layoutLabels(items, 8, 292, 4);
  assert.equal(xs.length, items.length);
  for (let i = 1; i < xs.length; i++) assert.ok(xs[i] > xs[i - 1], "order kept");
  assert.ok(!overlaps(xs, items, 4), "no overlap");
  xs.forEach((x, i) => { assert.ok(x - items[i].w / 2 >= 8 - 1e-9 && x + items[i].w / 2 <= 292 + 1e-9); });
  assert.equal(xs[2], 150, "a label with room stays exactly on its event");
});

test("day chart labels: random schedules and edges (property check)", () => {
  let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  for (let run = 0; run < 400; run++) {
    const n = 2 + Math.floor(rnd() * 6), items = [];
    let x = 8; for (let i = 0; i < n; i++) { x += rnd() * 70; items.push({ x: Math.min(292, x), w: 18 + rnd() * 26 }); }
    const xs = DV.layoutLabels(items, 8, 292, 4);
    for (let i = 1; i < n; i++) assert.ok(xs[i] > xs[i - 1]);
    const total = items.reduce((a, it) => a + it.w, 0) + 4 * (n - 1);
    if (total <= 284) { assert.ok(!overlaps(xs, items, 4), `run ${run}`); xs.forEach((c, i) => assert.ok(c - items[i].w / 2 >= 8 - 1e-6 && c + items[i].w / 2 <= 292 + 1e-6)); }
  }
  // all crammed at the right edge, and a row too narrow for them all
  const edge = DV.layoutLabels([{ x: 290, w: 40 }, { x: 291, w: 40 }, { x: 292, w: 40 }], 8, 292, 4);
  assert.ok(edge[2] + 20 <= 292 + 1e-9 && edge[0] < edge[1] && edge[1] < edge[2]);
  const narrow = DV.layoutLabels([{ x: 10, w: 60 }, { x: 11, w: 60 }, { x: 12, w: 60 }], 0, 100, 4);
  assert.ok(narrow[0] < narrow[1] && narrow[1] < narrow[2], "still in order when it cannot fit");
  assert.deepEqual(plain(DV.layoutLabels([], 0, 10)), []);
});

test("day chart uses the layout for both rows, keeps the top-bar animation and computes from the times", () => {
  const f = app.slice(app.indexOf("function dayViz"), app.indexOf("function dayViz") + 6000);
  assert.match(f, /DV\.layoutLabels\(/); assert.match(f, /class="lead"/);
  assert.match(css, /\.dayviz \.lead\{fill:none/);
  assert.match(html.indexOf("assets/dayviz.js") < html.indexOf("assets/app.js") ? "ok" : "", /ok/);
});

/* ---------- appearance ---------- */
const lum = h => { const c = [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255).map(v => v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const block = sel => { const i = css.indexOf(sel + "{"); assert.ok(i >= 0, sel); const b = css.slice(i, css.indexOf("}", i)); return Object.fromEntries([...b.matchAll(/--([a-z0-9-]+):\s*(#[0-9A-Fa-f]{6})/g)].map(m => [m[1], m[2]])); };
const SETS = { "classic-light": block(":root"), "classic-dark": block(':root[data-theme="dark"]') };
// Face 7 (intentional): three light themes and three dark themes; no theme has a set for the other appearance.
for (const p of ["emerald", "sandstone"]) SETS[p + "-light"] = block(`:root[data-palette="${p}"]`);
for (const p of ["indigo", "plum"]) SETS[p + "-dark"] = block(`:root[data-palette="${p}"][data-theme="dark"]`);

test("themes (Face 7): Classic Teal, Emerald Ivory, Sandstone Teal for light; Midnight Jade, Indigo Moon, Plum Dusk for dark", () => {
  for (const k of ["pl_classic", "pl_emerald", "pl_sandstone", "pl_jade", "pl_indigo", "pl_plum", "th_light", "th_dark", "md_system", "md_light", "md_dark", "appearance"]) { assert.ok(I18N.en[k], k); assert.ok(I18N.bn[k], "bn " + k); }
  assert.equal(I18N.en.pl_classic, "Classic Teal"); assert.equal(I18N.en.pl_emerald, "Emerald Ivory"); assert.equal(I18N.en.pl_sandstone, "Sandstone Teal");
  assert.equal(I18N.en.pl_jade, "Midnight Jade"); assert.equal(I18N.en.pl_indigo, "Indigo Moon"); assert.equal(I18N.en.pl_plum, "Plum Dusk");
  assert.match(I18N.en.th_light, /Recommended for light appearance/); assert.match(I18N.en.th_dark, /Recommended for dark appearance/);
  assert.ok(!I18N.en.pl_burgundy, "Burgundy is no longer offered as a light theme");
  assert.equal(Object.keys(SETS).length, 6);
});

test("palettes: focus ring, controls and text keep contrast in every palette and mode", () => {
  for (const [n, T] of Object.entries(SETS)) {
    for (const bg of ["surface", "ground"]) assert.ok(ratio(T.gold, T[bg]) >= 3, `${n}: focus ring (gold) on ${bg} ${ratio(T.gold, T[bg]).toFixed(2)}`);
    assert.ok(ratio(T.accent, T.ground) >= 4.5, `${n}: accent on ground`);
    assert.ok(ratio(T.danger || T.ink, T.surface) >= 4.5, `${n}: danger on surface`);
    assert.ok(ratio(T.line, T.surface) >= 1.1, `${n}: card edge visible`);
  }
  assert.match(css, /:focus-visible\{outline:2px solid var\(--gold\)/);
});

function boot(saved, { prefersDark = false, host = null } = {}) {
  const attrs = {}; if (host) attrs["data-theme"] = host;
  const r = { style: {}, getAttribute: k => (k in attrs ? attrs[k] : null), setAttribute: (k, v) => { attrs[k] = String(v); }, removeAttribute: k => { delete attrs[k]; } };
  const c = { document: { documentElement: r }, localStorage: { getItem: () => (saved == null ? null : JSON.stringify(saved)) }, matchMedia: q => ({ matches: /dark/.test(q) && prefersDark }) };
  c.window = c; vm.createContext(c); vm.runInContext(read("assets/theme-boot.js"), c);
  return { theme: attrs["data-theme"], palette: attrs["data-palette"] || "classic", scheme: r.style.colorScheme, host: attrs["data-host-theme"], glass: attrs["data-glass"], motion: attrs["data-motion"] };
}
test("theme boot: mode and palette applied before paint, system preference followed, old settings migrated", () => {
  // Face 7 (intentional): boot also sets data-glass and data-motion; their defaults are balanced and subtle.
  assert.deepEqual(boot(null), { theme: "light", palette: "classic", scheme: "light", host: undefined, glass: "balanced", motion: "subtle" });
  assert.equal(boot(null, { prefersDark: true }).theme, "dark");
  assert.equal(boot({ mode: "light" }, { prefersDark: true }).theme, "light", "explicit light beats the system");
  // Face 7 migration (intentional): Phase 5.3 burgundy becomes Plum Dusk in dark; light falls back to Classic Teal.
  assert.equal(boot({ mode: "dark", palette: "burgundy" }).palette, "plum");
  assert.equal(boot({ mode: "light", palette: "burgundy" }).palette, "classic");
  assert.equal(boot({ mode: "dark", palette: "emerald" }).palette, "classic", "emerald has no dark set: dark uses Midnight Jade (base tokens)");
  assert.equal(boot({ mode: "light", palette: "sandstone" }).palette, "sandstone");
  assert.equal(boot({ mode: "dark", lightTheme: "emerald", darkTheme: "indigo" }).palette, "indigo");
  assert.equal(boot({ mode: "light", lightTheme: "emerald", darkTheme: "indigo", palette: "burgundy" }).palette, "emerald", "saved Face 7 themes win over the old palette");
  assert.equal(boot({ glass: "solid", motion: "off" }).glass, "solid"); assert.equal(boot({ glass: "x", motion: "off" }).motion, "off");
  assert.equal(boot({ mode: "dark", palette: "burgundy" }).theme, "dark");
  assert.deepEqual([boot({ theme: "emerald" }).theme, boot({ theme: "emerald" }).palette], ["light", "emerald"]);
  assert.deepEqual([boot({ theme: "indigo" }).theme, boot({ theme: "indigo" }).palette], ["dark", "indigo"]);
  assert.equal(boot({ theme: "dark" }).theme, "dark");
  assert.equal(boot({ theme: "system" }, { prefersDark: true }).theme, "dark");
  const h = boot({ mode: "system" }, { host: "dark" }); assert.equal(h.theme, "dark"); assert.equal(h.host, "dark");
  assert.equal(boot("not json").theme, "light");
});

test("theme boot runs in <head> before the stylesheets, and the app follows system changes", () => {
  const head = html.slice(0, html.indexOf("</head>"));
  const b = head.indexOf("assets/theme-boot.js"), c = head.indexOf("assets/app.css");
  assert.ok(b > 0 && c > 0 && b < c, "boot script before CSS");
  assert.match(head, /<meta name="color-scheme" content="light dark">/);
  assert.match(app, /addEventListener\("change"/); assert.match(app, /prefers-color-scheme: dark/);
  assert.match(app, /case "setmode"/); assert.match(app, /case "setth"/); // Face 7: setpalette → setth
});

/* ---------- zakat ---------- */
test("zakat: same formula, 2.5% only at or above nisab, nothing counted twice", () => {
  const r = ZK.calc({ v: { cash: "5000", gold: "2000", silver: "0", inv: "1000", biz: "500", recv: "500", debt: "1000" }, basis: "silver", weights: "tola", price: "1.5" });
  assert.equal(r.assets, 9000); assert.equal(r.owed, 1000); assert.equal(r.net, 8000);
  assert.ok(Math.abs(r.nisab - 612.36 * 1.5) < 1e-9); assert.equal(r.state, "above"); assert.equal(r.due, 200);
  assert.equal(r.lines.length, 6, "each asset field once"); assert.equal(r.debts.length, 1, "one debts field");
  const g85 = ZK.calc({ v: { cash: "100" }, basis: "gold", weights: "g85", price: "150" });
  assert.equal(g85.grams, 85); assert.equal(g85.nisab, 12750); assert.equal(g85.state, "below"); assert.equal(g85.due, 0);
  const eq = ZK.calc({ v: { cash: "918.54" }, basis: "silver", weights: "tola", price: "1.5" });
  assert.equal(eq.state, "above", "exactly at nisab counts");
});

test("zakat: no price, blank, negative, invalid and huge values are handled and reported", () => {
  const np = ZK.calc({ v: { cash: "100000" }, basis: "silver", price: "" });
  assert.equal(np.state, "noprice"); assert.equal(np.due, 0);
  const bad = ZK.calc({ v: { cash: "-50", gold: "abc", silver: "1e20", inv: "  ", biz: "10" }, basis: "silver", price: "x" });
  assert.deepEqual(plain(bad.invalid).sort(), ["cash", "gold", "price", "silver"]);
  assert.equal(bad.assets, 10); assert.equal(bad.state, "noprice");
  const neg = ZK.calc({ v: { cash: "100", debt: "500" }, basis: "silver", price: "1" });
  assert.equal(neg.net, -400); assert.equal(neg.netClamped, 0); assert.equal(neg.due, 0); assert.equal(neg.state, "below");
  assert.equal(ZK.calc({ v: {}, basis: "nope", weights: "nope", price: "1" }).basis, "silver");
  assert.equal(ZK.calc({ v: {}, basis: "nope", weights: "nope", price: "1" }).weights, "tola");
});

test("zakat page: disclaimer (English and Bangla), visible formula, grouped inputs, sources kept apart", () => {
  const f = app.slice(app.indexOf("function vZakat"), app.indexOf("function vZakat") + 9000);
  assert.equal(I18N.en.zk_disclaimer, "This calculator provides a general educational estimate, not a binding religious ruling or financial advice. Zakat obligations and eligible deductions may differ according to the type of assets, circumstances and scholarly interpretation. Verify current Nisab values and consult a qualified scholar or trusted Zakat authority if you are unsure.", "brief's wording, verbatim");
  assert.ok(I18N.bn.zk_disclaimer && /[ঀ-৿]/.test(I18N.bn.zk_disclaimer));
  assert.match(f, /t\("zk_disclaimer"\)/);
  assert.match(app, /https:\/\/sunnah\.com\/bukhari:8/); assert.match(app, /https:\/\/islamicrelief\.org\.au\//);
  assert.match(app, /t\("zk_formula"\)/);
  for (const k of Object.keys(I18N.en).filter(k => /^(zk|zh|zq|za|zr)_/.test(k))) assert.ok(I18N.bn[k], "bn " + k);
  assert.doesNotMatch(read("assets/zakat.js"), /price\s*[:=]\s*\d/, "no built-in metal price");
});

/* ---------- calendar layout ---------- */
test("calendar layout: calendar beside a compact side column, White Days full width, notes kept", () => {
  const f = app.slice(app.indexOf("function vCalendar"), app.indexOf("function calGo"));
  assert.ok(f.indexOf('class="cal-side"') > f.indexOf('class="card pad cal-card"'));
  assert.ok(f.indexOf('id="cal-detail"') > f.indexOf('class="cal-side"') && f.indexOf('class="card pad cal-plan"') > f.indexOf('id="cal-detail"'));
  assert.ok(f.indexOf("wd-card") > f.indexOf("cal-plan"));
  assert.match(f, /calFasts\(s\)/); assert.match(fn("calDetail"), /id="fp-note"/, "personal notes are kept");
  assert.match(css, /grid-template-areas:"head head" "cal side" "wd wd"/);
  assert.match(css, /\.wd-card>\.wd-src\{grid-column:1\/-1;grid-template-columns:repeat\(2,minmax\(0,1fr\)\)\}/);
  for (const k of ["up_title", "fp_list", "fp_none", "up_dates"]) { assert.ok(I18N.en[k]); assert.ok(I18N.bn[k]); }
  assert.match(fn("calFasts"), /k >= s\.key/, "only today onwards");
});

/* ---------- hadith collections ---------- */
const H = json("tests/fixtures/hadith-hashes.json");
const h12 = s => createHash("sha256").update(s.normalize("NFC")).digest("hex").slice(0, 12);
const nwText = r => r.shared ? Object.assign({}, r, (g => ({ ar: g.ar, en: g.en, bn: g.bn, attribution: g.attribution, grade: g.grade.he }))(HD.HADITH.find(h => h.id === r.shared))) : r;

test("an-Nawawi's Forty: all 42, numbered 1–42, each linked to sunnah.com/nawawi40 and HadeethEnc", () => {
  assert.equal(NW.HADITH.length, 42); assert.equal(NW.SOURCE.count, 42);
  NW.HADITH.forEach((r, i) => {
    assert.equal(r.n, i + 1);
    assert.equal(r.link, `https://sunnah.com/nawawi40:${r.n}`);
    for (const x of r.refs) { assert.ok(NW.COLLECTIONS[x.c], x.c); assert.equal(x.url, `https://sunnah.com/${x.c}:${x.n}`); assert.match(x.n, /^\d+[a-z]?$/); }
    const t = nwText(r);
    assert.match(t.ar, /[؀-ۿ]/); assert.match(t.bn, /[ঀ-৿]/); assert.ok(t.en.length > 30);
    assert.equal(t.ar, t.ar.normalize("NFC"));
    assert.equal(r.review, "source-checked");
  });
  assert.equal(new Set(NW.HADITH.map(r => r.he)).size, 42, "42 distinct HadeethEnc entries");
});

test("an-Nawawi's Forty: texts, takhrij and grades are exactly as retrieved (hashes)", () => {
  let n = 0;
  for (const r0 of NW.HADITH) {
    const r = nwText(r0);
    for (const [k, v] of [["ar", r.ar], ["en", r.en], ["bn", r.bn], ["aa", r.attribution.ar], ["ea", r.attribution.en], ["ba", r.attribution.bn], ["ag", r.grade.ar], ["eg", r.grade.en], ["bg", r.grade.bn]]) {
      assert.equal(h12(v), H.nawawi[`${r.n}.${k}`], `${r.n}.${k}`); n++;
    }
  }
  assert.equal(n, 378);
});

test("an-Nawawi's Forty: Sahih and Hasan kept apart; Hasan and an-Nawawi-only grades are flagged for review", () => {
  const flagged = NW.HADITH.filter(r => r.flag).map(r => r.n);
  assert.deepEqual(plain(flagged), [12, 18, 30, 31, 32, 33, 39, 41, 42]);
  for (const r0 of NW.HADITH) {
    const r = nwText(r0);
    assert.equal(r.cls, /hasan/i.test(r.grade.en) ? "hasan" : "sahih", `${r.n} class from grade text`);
    if (r.cls === "hasan") assert.equal(r.flag, "grade", `${r.n} hasan is flagged`);
    if (r.refs.some(x => x.c === "bukhari" || x.c === "muslim")) assert.ok(!r.flag, `${r.n} in the Sahihayn is not flagged`);
  }
  assert.match(NW.FLAGS.grade.en, /not checked them independently/); assert.ok(NW.FLAGS.grade.bn);
  assert.match(NW.SOURCE.review, /Not reviewed by a qualified scholar/);
  for (const n of [8, 14]) assert.match(NW.HADITH[n - 1].note.en, /^Context note \(editorial\)/);
});

test("an-Nawawi's Forty is a separate collection; the shared numbers point at the same general entries", () => {
  for (const r of NW.HADITH.filter(r => r.shared)) {
    const g = HD.HADITH.find(h => h.id === r.shared);
    assert.ok(g, r.shared); assert.equal(g.he, r.he, `${r.n} is the same HadeethEnc entry`);
    assert.equal(r.ar, undefined, "text not duplicated");
  }
  assert.deepEqual(plain(NW.HADITH.filter(r => r.shared).map(r => [r.n, r.shared])), [[15, "h10"], [36, "h03"]]);
  for (const r of NW.HADITH) for (const id of r.also) assert.ok(HD.HADITH.some(h => h.id === id), id);
  const genHe = new Set(HD.HADITH.map(h => h.he));
  assert.equal(NW.HADITH.filter(r => genHe.has(r.he)).length, 2, "only the two shared entries overlap");
  const v = fn("vHadith");
  assert.match(v, /st\.hcol === "nawawi"/); assert.match(v, /nawawiList\(\)/); assert.match(v, /hadithList\(\)/);
  assert.match(v, /role="group"/); assert.match(v, /aria-pressed/);
  assert.match(app, /unPUA/, "private-use glyph removed on display");
  assert.match(NW.HADITH[10].ar, //, "…but kept in the data, unchanged");
});

test("general library: 16 more Bukhari/Muslim narrations, verified and categorised; selection documented", () => {
  const add = HD.HADITH.slice(24);
  assert.equal(add.length, 16);
  assert.deepEqual(plain(add.map(h => h.id)), Array.from({ length: 16 }, (_, i) => "h" + (25 + i)));
  for (const h of add) {
    for (const [k, v] of [["ar", h.ar], ["en", h.en], ["bn", h.bn], ["aa", h.attribution.ar], ["ea", h.attribution.en], ["ba", h.attribution.bn], ["ag", h.grade.he.ar], ["eg", h.grade.he.en], ["bg", h.grade.he.bn]])
      assert.equal(h12(v), H.general[`${h.he}.${k}`], `${h.id}.${k}`);
    assert.ok(h.cats.length >= 2);
    if (h.refs.some(x => x.wording === "similar")) assert.ok(h.note && h.note.en && h.note.bn, `${h.id} explains the similar reference`);
  }
  assert.match(read("assets/hadith.js"), /24 from Phase 5, 16 added in Phase 5\.3/);
});

test("hadith collection UI: numbering, progress, jump list, language and keyboard", () => {
  const f = fn("nawawiList");
  assert.match(f, /lang="ar" dir="rtl"/); assert.match(f, /class="hd-main clamp/); assert.match(f, /data-act="nwread"/); assert.match(f, /aria-pressed="\$\{done\}"/);
  assert.match(f, /data-act="nwgo"/); assert.match(f, /tabindex="-1"/);
  assert.match(fn("vHadith"), /class="nw-jump" aria-label=/);
  assert.match(app, /st\.nwread = Array\.isArray\(st\.nwread\)/, "saved progress is cleaned on load");
  for (const k of ["hc_label", "hc_gen", "hc_nw", "nw_title", "nw_intro", "nw_prog", "nw_jump", "nw_no", "nw_mark", "nw_done", "nw_sahih", "nw_hasan", "nw_flag", "nw_takhrij", "nw_refs", "nw_refs_none", "nw_also", "nw_review"]) { assert.ok(I18N.en[k], k); assert.ok(I18N.bn[k], "bn " + k); }
});

/* ---------- every string, scripts, interactions ---------- */
test("every t() key used by the app exists in English and Bangla", () => {
  const used = new Set([...app.matchAll(/\bt\("([a-z0-9_]+)"\)/g)].map(m => m[1]));
  const missing = [...used].filter(k => I18N.en[k] == null || I18N.bn[k] == null);
  assert.deepEqual(missing, []);
});

test("new scripts load before app.js and are precached", () => {
  for (const f of ["assets/dayviz.js", "assets/zakat.js", "assets/nawawi.js", "assets/theme-boot.js"]) {
    assert.ok(html.includes(f), f); assert.ok(sw.includes(`"${f}"`), "sw " + f);
    if (f !== "assets/theme-boot.js") assert.ok(html.indexOf(f) < html.indexOf("assets/app.js"), f);
  }
});

test("interactions: subtle lift by default, Playful spring kept, Off and reduced motion stop movement, never on texts", () => {
  // Face 7 (intentional): the Phase 5.3 spring became the "Playful" level of the new Interaction motion setting;
  // the default "Subtle" level lifts by 1px without the spring. Reduced motion still turns all movement off.
  const i = css.indexOf("/* Interaction motion (Face 7"), blk = css.slice(i);
  assert.ok(i > 0);
  assert.match(blk, /@media \(hover:hover\) and \(pointer:fine\)/);
  assert.match(blk, /:focus-visible\{transform:translateY\(-1px\)\}/);
  assert.match(blk, /:root\[data-motion="playful"\] :is\([^)]*\):focus-visible\{transform:translateY\(-1px\) scale\(1\.03\)\}/);
  assert.match(blk, /:root\[data-motion="playful"\] :is\([^)]*\):active\{transform:scale\(\.95\)\}/);
  assert.match(blk, /var\(--spring\)/);
  assert.match(blk, /:root\[data-motion="off"\]/);
  const rm = blk.slice(blk.indexOf("@media (prefers-reduced-motion:reduce)"));
  for (const sel of [".btn", ".chip", ".icon-btn", ".nw-jump button", ".th-card"]) assert.ok(rm.includes(sel), sel);
  assert.match(rm, /transform:none!important/);
  for (const text of [".ar", ".hd-ar", ".hd-tr", ".dua", ".ayah", ".verse"]) assert.ok(!new RegExp(`(^|[,\\s(])\\${text}[,:{\\s)]`).test(blk.slice(0, blk.indexOf("@media (prefers-reduced-motion"))), `no animation on ${text}`);
});

test("credits list the new sources and every credit row is its own array entry", () => {
  const f = fn("vAbout");
  assert.doesNotMatch(f, /"\]\s*\n\s*\[/, "a missing comma would turn the next row into an index lookup");
  // Face 7 (intentional): zakat was removed from the UI, so its credit row is gone.
  for (const k of ["An-Nawawi's Forty Hadith", "Prohibited-time notes", "40 narrations"]) assert.ok(f.includes(k), k);
  assert.ok(!f.includes('["Zakat",'), "no zakat credit row");
  for (const k of ["ইমাম নববীর চল্লিশ হাদীস", "নিষিদ্ধ সময়ের সতর্কতা", "৪০টি হাদীস"]) assert.ok(f.includes(k), k);
});
