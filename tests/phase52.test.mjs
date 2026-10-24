// Phase 5.2: English explanations for the Daily Ayah, English (India)/(US) interface variants, themes and contrast,
// and static checks on the Today card, Hadith cards, Hijri calendar and day chart. Browser checks (prayer
// transitions, interactions, persistence) are in tests/browser/phase52.cjs.
import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { read, loadBrowser } from "./helpers.mjs";

const ctx = loadBrowser("assets/data.js", "assets/votd.js", "assets/votd-en.js", "assets/locale.js");
const V = ctx.DINSATHI_VOTD, E = ctx.IE_VOTD_EN, LOC = ctx.IE_LOCALE, { I18N } = ctx.DINSATHI;
const app = read("assets/app.js"), css = read("assets/app.css");

/* ---------- Daily Ayah English explanations ---------- */
test("every Daily Ayah entry has an English explanation for every verse it shows", () => {
  assert.equal(V.SCHEDULE.length, 180);
  let verses = 0;
  for (const e of V.SCHEDULE) {
    const ex = E.forPassage(e.s, e.a, e.b);
    assert.ok(ex.length >= 1, `${e.id}: explanation`);
    const covered = ex.flatMap(x => x.verses);
    for (let k = e.a; k <= e.b; k++) { verses++; assert.ok(covered.includes(k), `${e.id}: ${e.s}:${k}`); }
    for (const x of ex) assert.ok(x.text.length >= 15, `${e.id}: text is not empty`);
  }
  assert.equal(verses, 267);
  assert.equal(Object.keys(E.TEXT).length, 267, "only the schedule's verses are stored");
});

test("explanations are the publisher's text: verse-number prefix kept in the data, hidden on display only", () => {
  for (const [ref, x] of Object.entries(E.TEXT)) {
    assert.match(x, /^\d+(?:\s*(?:&|-|–)\s*\d+)?\.\s/, `${ref}: publisher's leading verse number`);
    assert.equal(x, x.normalize("NFC"), `${ref}: NFC`);
    assert.doesNotMatch(E.strip(x), /^\d+(?:\s*(?:&|-|–)\s*\d+)?\.\s/, `${ref}: prefix hidden`);
    assert.equal(x.endsWith(E.strip(x)), true, `${ref}: display text is the stored text minus the prefix`);
  }
  // The fingerprint recorded with the source matches the stored texts (any edit changes it).
  const fp = createHash("sha256").update(Object.keys(E.TEXT).map(r => r + "\t" + E.TEXT[r]).join("\n")).digest("hex").slice(0, 16);
  assert.equal(E.SOURCE.fingerprint, fp);
  assert.equal(fp, "d69cf3d34f7e3b25", "reviewed set of 267 explanations");
});

test("source, provenance and review status are recorded and the explanation is not labelled AI", () => {
  const S = E.SOURCE;
  assert.equal(S.publisher, "QuranEnc.com"); assert.equal(S.key, "english_mokhtasar"); assert.equal(S.retrieved, "2026-10-18");
  assert.equal(S.kind, "published-tafsir"); assert.equal(S.ai, false); assert.equal(S.version, null, "no version is published; none is invented");
  assert.match(S.status, /not independently reviewed by a qualified scholar/);
  assert.match(I18N.en.vd_expl_src, /QuranEnc\.com/); assert.match(I18N.en.vd_expl_src, /Not independently reviewed/);
  assert.match(I18N.en.vd_expl_label, /not the Qur'an text/);
  assert.doesNotMatch(read("assets/votd-en.js") + I18N.en.vd_expl_src, /AI-generated/);
  assert.match(app, /English explanation \(Verse for today\)/, "About lists the source");
});

test("grouped explanations are shown once for the verses they cover", () => {
  const g = E.forPassage(59, 22, 23); assert.equal(g.length, 1); assert.deepEqual([...g[0].verses], [22, 23]);
  const h = E.forPassage(79, 40, 41); assert.equal(h.length, 1);
  assert.equal(E.forPassage(94, 5, 6).length, 2);
});

test("sensitive explanations carry an editorial note and point at schedule verses", () => {
  const refs = new Set(V.SCHEDULE.flatMap(e => { const a = []; for (let k = e.a; k <= e.b; k++) a.push(e.s + ":" + k); return a; }));
  assert.ok(Object.keys(E.FLAGS).length >= 5);
  for (const [r, f] of Object.entries(E.FLAGS)) { assert.ok(refs.has(r), r); assert.ok(f.en && f.bn, r); }
  for (const r of ["1:7", "57:16", "5:32"]) assert.ok(E.FLAGS[r], r);
});

test("the English explanation is a separate layer: shown for English only, never mixed into the translation", () => {
  const f = app.slice(app.indexOf("function votdExpl"), app.indexOf("function fitClamps"));
  assert.match(f, /if \(bn\(\) \|\| !VE\) return ""/);
  assert.match(f, /class="tafsir en-ex clamp/);
  assert.match(app, /\$\{votdExpl\(e, many\)\}/);
  // The translation line still comes only from the translation data.
  assert.match(app, /const trText = ks\.map\(k => .*esc\(tr\.t\[k - 1\]\)\)/);
});

/* ---------- English (India) / English (US) ---------- */
test("language settings offer English (India), English (US) and Bangla; India is the default", () => {
  assert.deepEqual([...LOC.VARIANTS.map(v => v.id)], ["en-IN", "en-US", "bn"]);
  assert.equal(LOC.variant(undefined), "en-IN"); assert.equal(LOC.variant("en-AU"), "en-IN");
  assert.equal(LOC.tag("en", "en-US"), "en-US"); assert.equal(LOC.tag("bn", "en-US"), "bn-BD"); assert.equal(LOC.tag("en", null), "en-IN");
  assert.match(app, /const DEF = \{ lang: "en", loc: "en-IN"/);
  assert.doesNotMatch(app, /"en-AU"/, "no hard-coded Australian formats remain");
});

test("US spelling applies to interface words, keeps case, and leaves other words alone", () => {
  assert.equal(LOC.usSpell("Your favourite colour"), "Your favorite color");
  assert.equal(LOC.usSpell("Summarised from hadith"), "Summarized from hadith");
  assert.equal(LOC.usSpell("JEWELLERY"), "JEWELRY");
  assert.equal(LOC.spell("favourite", "en-IN"), "favourite");
  assert.equal(LOC.usSpell("Our Lord, honour"), "Our Lord, honor", "only listed words change");
  for (const [k, v] of Object.entries(I18N.en)) { const u = LOC.usSpell(v); assert.doesNotMatch(u, /\b(colour|favourite|jewellery|summarise|recognise|behaviour)\b/i, k); }
  assert.equal(LOC.OVERRIDES["en-US"].am, "AM");
});

test("religious texts are never respelled: the variant is applied in t() and the app's own notes only", () => {
  assert.match(app, /const t = k => \{\n  if \(st\.lang !== "en"\) return tRaw\(k\);/);
  for (const bad of [/sp\(tr\.t/, /spell\(tr\./, /sp\(h\[st\.lang\]/, /sp\(d\.en\)/, /LOC\.spell\(E\.TEXT/]) assert.doesNotMatch(app, bad);
});

test("switching language keeps the page and reading position", () => {
  const f = app.slice(app.indexOf("function switchLang"), app.indexOf("/* ---------------- events"));
  assert.match(f, /render\(false\)/); assert.doesNotMatch(f, /go\(/, "no navigation");
  assert.match(app, /case "setlang": switchLang/); assert.match(app, /case "lang": switchLang/);
  for (const sel of [".hadith", ".dua", ".ayah", ".name"]) assert.ok(app.includes(`"${sel}"`), sel);
});

test("every new interface string exists in English and Bangla", () => {
  const keys = ["lang_h", "vd_expl", "vd_expl_label", "vd_expl_src", "vd_flag", "began", "startsat", "adhannote", "theme_h", "pl_emerald", "pl_indigo",
    "cal_today", "cal_hint", "cal_calc", "cal_method", "cal_eve", "wd_title", "wd_intro", "wd_h1", "wd_r1", "wd_h2", "wd_r2", "wd_h3", "wd_h4", "wd_tash", "fp_check", "fp_note", "viz_cap", "viz_polar", "sunset"];
  for (const k of keys) { assert.ok(I18N.en[k], "en " + k); assert.ok(I18N.bn[k], "bn " + k); }
  const used = [...app.matchAll(/\bt\("(th_|wd_|cal_|fp_|viz_)?([a-z0-9_]+)"\)/g)].map(m => (m[1] || "") + m[2]);
  for (const k of used) assert.ok(I18N.en[k] != null && I18N.bn[k] != null, k);
});

/* ---------- Today card ---------- */
/* Phase 5.3 brought back one countdown on purpose: to the next prayer's start (never to an invented end of the current
   prayer). Everything else in this test is unchanged: start times, no "ends in/at", no per-prayer countdown. */
test("Today card shows start times and counts down only to the next prayer's start, never to an invented ending time", () => {
  const hero = app.slice(app.indexOf('<p class="eyebrow">${t("curp")}</p>'), app.indexOf('<p class="adhan-note">'));
  for (const gone of ["count-cur", 't("endsin")', 't("endsat")', 't("startsin")', "left("]) assert.ok(!hero.includes(gone), gone);
  assert.match(hero, /\$\{cdLine\(s, nx, /); assert.match(I18N.en.cd_until, /\{p\} begins in/);
  assert.match(hero, /t\("began"\)/); assert.match(hero, /clock\(hOf\(cur\.start, cur\.D\)\)/);
  assert.match(hero, /nx\.tomorrow \? t\("tomorrow_c"\) : t\("t_today"\)/);
  assert.match(hero, /cur\.D === s\.dm \?/, "Isha that began yesterday is labelled");
  assert.match(I18N.en.adhannote, /iqamah/);
  assert.doesNotMatch(app, /function left\(/);
});

/* ---------- Hadith cards ---------- */
test("Hadith cards use the shared Read more shell and keep the whole text in the page", () => {
  const f = app.slice(app.indexOf("function hadithList"), app.indexOf("function vHadith"));
  assert.match(f, /class="hd-main clamp/); assert.match(f, /data-act="hdmore"/); assert.match(f, /aria-expanded=/); assert.match(f, /aria-controls="hd-b-/);
  assert.match(f, /lang="ar" dir="rtl"/);
  assert.doesNotMatch(f, /slice\(|substring\(|substr\(/, "no truncation in code");
  assert.match(app, /const hOpen = new Set\(\)/);
  assert.match(css, /\.clamp\.open \.clamp-body,\.clamp\.fits \.clamp-body\{max-height:none\}/);
});

/* ---------- Themes ---------- */
const block = sel => { const i = css.indexOf(sel + "{"); assert.ok(i >= 0, sel); const b = css.slice(i, css.indexOf("}", i)); return Object.fromEntries([...b.matchAll(/--([a-z0-9-]+):\s*(#[0-9A-Fa-f]{6})/g)].map(m => [m[1], m[2]])); };
const lum = h => { const c = [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255).map(v => v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
/* Phase 5.3 split the Phase 5.2 themes into an appearance mode (System/Light/Dark: data-theme="light"|"dark") and a
   colour palette (data-palette), so every palette now has a light and a dark set. The checks below cover all of them. */
const THEMES = { light: block(":root"), dark: block(':root[data-theme="dark"]') };
for (const p of ["emerald", "sandstone", "burgundy", "indigo"]) { THEMES[p] = block(`:root[data-palette="${p}"]`); THEMES[p + "-dark"] = block(`:root[data-palette="${p}"][data-theme="dark"]`); }

test("every palette, light and dark, defines every colour token the primary theme defines", () => {
  const need = Object.keys(THEMES.dark);
  for (const n of Object.keys(THEMES).filter(n => n !== "light" && n !== "dark")) for (const k of need) assert.ok(THEMES[n][k], `${n}: --${k}`);
  assert.match(app, /const MODES = \["system", "light", "dark"\]/);
  assert.match(app, /PALETTES = \["classic", "emerald", "sandstone", "burgundy", "indigo"\]/);
  assert.match(css, /:root:not\(\[data-theme\]\)\{/, "the system dark fallback applies only when no mode has been set");
});

test("text contrast meets WCAG AA in all themes (body text AAA)", () => {
  for (const [n, T] of Object.entries(THEMES)) {
    for (const bg of ["surface", "ground", "surface-2"]) {
      assert.ok(ratio(T.ink, T[bg]) >= 7, `${n}: ink on ${bg}`);
      assert.ok(ratio(T.muted, T[bg]) >= 4.5, `${n}: muted on ${bg} ${ratio(T.muted, T[bg]).toFixed(2)}`);
    }
    assert.ok(ratio(T.accent, T.surface) >= 4.5, `${n}: accent text`);
    assert.ok(ratio(T["on-accent"], T.accent) >= 4.5, `${n}: on-accent`);
    // Phase 5.4: the primary light theme's gold was darkened very slightly (#9C6210 -> #996010) so gold on gold-soft
    // now also meets 4.5:1; before, it was 4.38:1 and was allowed as a recorded exception. No exception remains.
    assert.ok(ratio(T.gold, T["gold-soft"]) >= 4.5, `${n}: gold on gold-soft`);
    assert.ok(ratio(T.accent, T["accent-2"]) >= 4.5, `${n}: accent on accent-2`);
  }
});

test("glass is limited to navigation and controls, with solid fallbacks", () => {
  const g = css.slice(css.indexOf("/* Restrained glass"));
  assert.match(g, /@supports \(\(-webkit-backdrop-filter:blur\(1px\)\) or \(backdrop-filter:blur\(1px\)\)\)/);
  assert.match(g, /prefers-reduced-transparency:reduce/); assert.match(g, /prefers-contrast:more/);
  const sel = g.slice(g.indexOf("@supports"), g.indexOf("{", g.indexOf("@supports") + 60));
  for (const reading of [".card", ".verse", ".hadith", ".dua", ".tafsir", ".sheet"]) assert.ok(!sel.includes(reading), `reading surface ${reading} stays opaque`);
});

/* ---------- Calendar ---------- */
test("calendar days are focusable buttons with full labels, a popover, details and keyboard movement", () => {
  const f = app.slice(app.indexOf("function vCalendar"), app.indexOf("function calGo"));
  assert.match(f, /<button type="button" class="c\$\{/); assert.match(f, /data-act="calday"/); assert.match(f, /aria-label="\$\{esc\(label\)\}"/);
  assert.match(f, /tabindex="\$\{i\.k === calSel \? 0 : -1\}"/, "roving tabindex");
  assert.match(f, /id="cal-pop" class="cal-pop" role="tooltip"/); assert.match(f, /id="cal-detail" aria-live="polite"/);
  assert.match(f, /calMethod\(\)/);
  for (const k of ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End"]) assert.ok(app.includes(k), k);
  assert.match(app, /e\.pointerType === "mouse"\) showPop/, "hover popover is for mouse only; touch selects");
});

test("White Days: 13–15 marked, verified evidence with grades, Tashriq exception, calculated not sighted", () => {
  assert.match(app, /const wh = !!\(h && h\.d >= 13 && h\.d <= 15\)/);
  assert.match(app, /tash = !!\(h && h\.m === 12 && h\.d >= 11 && h\.d <= 13\)/);
  for (const u of ["https://sunnah.com/abudawud:2449", "https://sunnah.com/bukhari:1981", "https://sunnah.com/muslim:1160", "https://sunnah.com/muslim:1141a"]) assert.ok(app.includes(u), u);
  assert.match(I18N.en.wd_r1, /graded sahih by al-Albani/);
  assert.match(I18N.en.wd_h2, /the hadith itself says three days a month/);
  assert.match(I18N.en.cal_method, /calculated dates, not moon-sighting announcements/);
  assert.match(I18N.bn.wd_ev, /অনুবাদ নয়/, "Bangla summaries are labelled as summaries, not translations");
  assert.match(I18N.en.fp_h, /not a record of fasts kept/);
});

/* ---------- Day chart ---------- */
test("day chart: computed from solar position, sunrise/sunset as events, text schedule, reduced motion, polar fallback", () => {
  const f = app.slice(app.indexOf("function sunAlt"), app.indexOf("/* The Hijri day begins at maghrib, so"));
  assert.match(f, /sunPos\(jd\)/); assert.match(f, /PRAYERS\.map/);
  assert.match(f, /\["sunrise", tm\.sunrise\], \["sunset", tm\.maghrib\]/); assert.match(f, /class="evm"/);
  assert.match(f, /role="img" aria-labelledby="viz-cap"/); assert.match(f, /<figcaption id="viz-cap"/);
  assert.match(f, /const polar = hi < -0\.833 \|\| lo > -0\.833 \|\| !okTimes/); assert.match(f, /t\("viz_polar"\)/);
  assert.match(css, /@media \(prefers-reduced-motion:reduce\)\{\.view\.enter \.dayviz \.sunpath\{animation:none/);
  assert.match(app, /<ol class="times">/, "the text schedule stays next to the chart");
});

test("new scripts are loaded before app.js and precached", () => {
  const html = read("index.html"), sw = read("sw.js");
  for (const f of ["assets/votd-en.js", "assets/locale.js"]) { assert.ok(html.indexOf(f) > 0 && html.indexOf(f) < html.indexOf("assets/app.js"), f); assert.ok(sw.includes(`"${f}"`), f); }
});
