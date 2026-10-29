/* Islam Everyday (project folder: DinSathi-Web) — daily Muslim companion (English / বাংলা). Plain JS, no build step required. */
(() => {
"use strict";
const QM = window.QURAN_META, X = window.DINSATHI;
const { I18N, TL, DUAS, DUA_CATS, CITIES, METHODS, EVENTS, HM, CURRENCIES } = X;
const VOTD = window.DINSATHI_VOTD;
const FIX = window.IE_BNFIX || { repair: s => s }, XT = window.IE_XTRACK, GL = window.IE_GLOSS;
const LOC = window.IE_LOCALE, VE = window.IE_VOTD_EN, DV = window.IE_DAYVIZ;
/* Phone speed (Oct 2026): page data that the Today screen does not need is loaded only when its page opens, so a phone
   downloads about a third of the scripts before the first screen appears. LAZY lists each group's files in load order;
   bindLazy() picks up the globals they define. The service worker still precaches all of them for offline use. */
const LAZY = { names: ["names", "name-stories"], guide: ["names", "guide"], hadith: ["hadith", "nawawi"], study: ["study", "study-notes"], stories: ["stories"], legal: ["legal"] };
let NM, NAMES = [], GD, HD, NW, SD, ST, LG = null, HCOLL = {}, NW_N = 0;
const lazyDone = new Set(), lazyP = {}, lazyFiles = new Set();
/* Phones (touch screen) get the on-demand loading; computers with a mouse keep the previous behaviour: everything is
   loaded straight after the first screen, so their pages open with no "Loading…" step. */
const phone = () => { try { return matchMedia("(pointer: coarse)").matches; } catch (e) { return false; } };
function bindLazy() {
  NM = window.DINSATHI_NAMES; NAMES = NM ? NM.names : []; GD = window.IE_GUIDE; HD = window.IE_HADITH; NW = window.IE_NAWAWI;
  SD = window.IE_STUDY; ST = window.IE_STORIES; LG = window.IE_LEGAL || null;
  HCOLL = Object.assign({}, NW ? NW.COLLECTIONS : {}, HD ? HD.COLLECTIONS : {});
  NW_N = NW ? NW.HADITH.length : 0;
}
bindLazy();
for (const g in LAZY) if ({ names: NM && window.IE_NAME_STORIES, guide: NM && GD, hadith: HD && NW, study: SD, stories: ST, legal: LG }[g]) lazyDone.add(g); // already on the page
function need(g) {
  if (!g || lazyDone.has(g)) return Promise.resolve();
  if (!lazyP[g]) lazyP[g] = LAZY[g].reduce((p, n) => p.then(() => lazyFiles.has(n) ? 0 : new Promise((ok, no) => {
    const sc = document.createElement("script"); sc.src = "assets/" + n + ".js";
    sc.onload = () => { lazyFiles.add(n); ok(); }; sc.onerror = () => { sc.remove(); no(new Error(n)); }; document.head.appendChild(sc);
  })), Promise.resolve()).then(() => { bindLazy(); lazyDone.add(g); }, e => { delete lazyP[g]; throw e; });
  return lazyP[g];
}
/* Which group a route or a shared link needs (null: nothing extra). */
const routeGroup = r => r.tab === "quran" ? (r.sub === "stories" ? "stories" : (r.sub === "all" || r.surah) ? null : "study")
  : r.tab === "more" ? ({ names: "names", guide: "guide", hadith: "hadith", about: "legal", terms: "legal", privacy: "legal" }[r.sub] || null) : null;
const hashGroup = h => /^story\//.test(h) ? "stories" : /^name\//.test(h) ? "names" : /^(hadith|nawawi)\//.test(h) ? "hadith" : null;
const PRAYERS = ["fajr", "dhuhr", "asr", "maghrib", "isha"], ROWS = ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"];
const TABS = ["today", "quran", "duas", "more"];
const mq = (() => { try { return matchMedia("(min-width: 1024px)"); } catch (e) { return { matches: false }; } })();
const desk = () => !!mq.matches;
/* Running inside the Android app (Capacitor)? Everything is bundled there, so no service worker is needed. */
const NATIVE = (() => { try { return !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform()); } catch (e) { return false; } })();

/* ---------------- state ---------------- */
const KEY = "dinsathi.web.v1";
const DEF = { lang: "en", loc: "en-IN", mode: "system", lightTheme: "classic", darkTheme: "jade", glass: "balanced", motion: "subtle", scene: "landscape", city: "syd", gps: null, method: "MWL", asr: 1, hadj: 0, ar: 1, tl: true,
  school: null, log: {}, xlog: {}, fplan: {}, gloss: false, last: null, read: [], bm: [], fav: [], tab: "today", hcol: "general", nwread: [],
  zk: { cur: "AUD", basis: "silver", w: "tola", price: "", v: {} } };
let st = JSON.parse(JSON.stringify(DEF));
try {
  const s = JSON.parse(localStorage.getItem(KEY) || "null");
  if (s && typeof s === "object") {
    st = Object.assign(st, s);
    st.zk = Object.assign({}, DEF.zk, s.zk || {});
  }
  st.xlog = XT.clean(st.xlog);
  if (!st.fplan || typeof st.fplan !== "object" || Array.isArray(st.fplan)) st.fplan = {};
  if (st.hcol !== "nawawi") st.hcol = "general";
  st.nwread = Array.isArray(st.nwread) ? [...new Set(st.nwread.filter(n => Number.isInteger(n) && n >= 1 && n <= 42))] : [];
} catch (e) {}
let saveT = 0;
const save = () => { clearTimeout(saveT); saveT = setTimeout(() => { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} }, 120); };

/* ---------------- helpers ---------------- */
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
/* Face 7.1: the honorific ﷺ is set in the Arabic font (span.saw), as elsewhere in the app, so it never falls back to
   a missing glyph inside Latin or Bangla text. */
const sawS = h => String(h).replace(/ﷺ/g, '<span class="saw" lang="ar">ﷺ</span>');
const escS = x => sawS(esc(x));
const bn = () => st.lang === "bn";
/* Interface strings. English has two variants (st.loc, see assets/locale.js): the US one changes a few strings
   and uses US spelling. Bangla has none. Results are cached per variant. */
const tRaw = k => (I18N[st.lang] && I18N[st.lang][k] != null ? I18N[st.lang][k] : (I18N.en[k] != null ? I18N.en[k] : k));
const tCache = {};
const t = k => {
  if (st.lang !== "en") return tRaw(k);
  const v = LOC.variant(st.loc), o = LOC.OVERRIDES[v];
  if (o[k] != null) return o[k];
  const c = tCache[v] || (tCache[v] = {});
  return c[k] != null ? c[k] : (c[k] = LOC.spell(tRaw(k), v));
};
/* Locale for dates and numbers: bn-BD, en-IN or en-US. */
const LT = () => LOC.tag(st.lang, st.loc);
/* The app's own English notes (not religious texts) follow the variant's spelling too. */
const sp = s => (st.lang === "en" ? LOC.spell(s, st.loc) : s);
const num = x => bn() ? String(x).replace(/\d/g, d => "০১২৩৪৫৬৭৮৯"[d]) : String(x);
const L = o => (bn() ? o.bn : o.en);
const reduce = (() => { try { return matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) { return false; } })();
const buzz = p => { try { navigator.vibrate && navigator.vibrate(p); } catch (e) {} };
const pad2 = n => String(n).padStart(2, "0");

const STAR = (c, R, r) => { let d = ""; for (let k = 0; k < 16; k++) { const a = (k * 22.5 - 90) * Math.PI / 180, q = k % 2 ? r : R; d += (k ? "L" : "M") + (c + q * Math.cos(a)).toFixed(2) + " " + (c + q * Math.sin(a)).toFixed(2); } return d + "Z"; };
const P = {
  today: '<path d="M3 18h18M6 18a6 6 0 0 1 12 0M12 5v3M4.5 9.5l2 2M19.5 9.5l-2 2"/>',
  stories: '<path d="M5 4.5h11.5A1.5 1.5 0 0 1 18 6v14H6.5A1.5 1.5 0 0 1 5 18.5z"/><path d="M5 18.5A1.5 1.5 0 0 1 6.5 17H18"/><path d="M8.5 8h6M8.5 11h4"/>',
  quran: '<path d="M12 6.5c-2-1.5-5-2-8-1.5v13c3-.5 6 0 8 1.5 2-1.5 5-2 8-1.5V5c-3-.5-6 0-8 1.5zM12 6.5V20"/>',
  duas: '<path d="M19.5 14.5A8 8 0 1 1 9.5 4.5a6.5 6.5 0 0 0 10 10z"/>',
  more: '<rect x="4" y="4" width="6.5" height="6.5" rx="2"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="2"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="2"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="2"/>',
  pin: '<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',
  gear: '<path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2.2"/><circle cx="9" cy="17" r="2.2"/>',
  names: '<path d="' + STAR(12, 9.5, 6.6) + '"/>',
  calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
  zakat: '<ellipse cx="12" cy="6.5" rx="7" ry="2.8"/><path d="M5 6.5v5c0 1.6 3.1 2.8 7 2.8s7-1.2 7-2.8v-5M5 11.5v5c0 1.6 3.1 2.8 7 2.8s7-1.2 7-2.8v-5"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.6v.4"/>',
  lock: '<rect x="5" y="10.5" width="14" height="10" rx="2.5"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5M12 14.5v2.5"/>',
  doc: '<path d="M7 3.5h7l4 4V19a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 19V5A1.5 1.5 0 0 1 7.5 3.5z"/><path d="M14 3.5V8h4M9 12.5h6M9 16h6"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/>',
  back: '<path d="M15 5l-7 7 7 7"/>',
  chev: '<path d="M9 5l7 7-7 7"/>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="3"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
  bm: '<path d="M6.5 4h11v16l-5.5-4-5.5 4z"/>',
  heart: '<path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.3a4.3 4.3 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20z"/>',
  locate: '<circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="7.5"/><path d="M12 1.8v2.7M12 19.5v2.7M1.8 12h2.7M19.5 12h2.7"/>',
  aa: '<path d="M3.5 18l4.5-12 4.5 12M5.3 13.5h5.4M14.5 18l3-8 3 8M15.6 15.5h3.8"/>',
  play: '<path d="M8 5.5v13l10-6.5z"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  guide: '<path d="M5 20V10a7 7 0 0 1 14 0v10M3 20h18M12 13v7M9.5 16h5"/>',
  hadith: '<path d="M7 3.5h10a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-13a2 2 0 0 1 2-2z"/><path d="M9 8h6M9 11.5h6M9 15h3.5"/>',
  share: '<circle cx="18" cy="5.5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="18.5" r="2.5"/><path d="M8.2 10.8l7.6-4.1M8.2 13.2l7.6 4.1"/>',
  image: '<rect x="3.5" y="4.5" width="17" height="15" rx="3"/><circle cx="9" cy="10" r="1.8"/><path d="M20.5 16l-5-5-8.5 8.5"/>',
  link: '<path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1 1"/><path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1-1"/>',
  mail: '<rect x="3.5" y="5.5" width="17" height="13" rx="2.5"/><path d="M4.5 7l7.5 6 7.5-6"/>',
  flag: '<path d="M5.5 21V4.5M5.5 5h11l-2 4 2 4h-11"/>',
  bulb: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z"/>',
  bug: '<rect x="7.5" y="7.5" width="9" height="12" rx="4.5"/><path d="M12 7.5V19.5M4 13h3.5M16.5 13H20M5 8l2.7 2M19 8l-2.7 2M5 19l2.7-2M19 19l-2.7-2M9.5 7.5a2.5 2.5 0 0 1 5 0"/>',
  ext: '<path d="M14 4h6v6M20 4l-9 9M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4"/>'
};
const ic = (n, cls) => `<svg viewBox="0 0 24 24" aria-hidden="true"${cls ? ` class="${cls}"` : ""}>${P[n]}</svg>`;

/* ---------------- theme ---------------- */
/* Appearance (Face 7). The mode (System, Light, Dark) picks the appearance; each appearance has three themes and
   remembers its own choice: st.lightTheme (classic | emerald | sandstone) and st.darkTheme (jade | indigo | plum).
   A light theme is only ever shown in the light appearance and a dark theme only in the dark one.
   Migration, idempotent and non-destructive (st.palette/st.mode are left in place):
   - Phase 5.2 st.theme: light/dark/system keep that mode; emerald → light + Emerald; indigo → dark + Indigo.
   - Phase 5.3 st.palette: emerald/sandstone → that light theme; indigo → Indigo Moon; burgundy → Plum Dusk
     (Burgundy had a light variant; it is no longer offered as a light theme, so light falls back to Classic Teal).
   assets/theme-boot.js applies the same rules before first paint. st.glass, st.motion and st.scene are new. */
const MODES = ["system", "light", "dark"], LIGHT_TH = ["classic", "emerald", "sandstone"], DARK_TH = ["jade", "indigo", "plum"];
const GLASS = ["subtle", "balanced", "high", "solid"], MOTION = ["off", "subtle", "playful"], SCENES = ["landscape", "sky", "mosque"];
(() => {
  const old = st.theme, raw = (() => { try { return JSON.parse(localStorage.getItem(KEY) || "{}") || {}; } catch (e) { return {}; } })();
  if (!MODES.includes(raw.mode) || !MODES.includes(st.mode)) st.mode = old === "light" || old === "dark" ? old : old === "emerald" ? "light" : old === "indigo" ? "dark" : MODES.includes(raw.mode) ? raw.mode : "system";
  const pal = raw.palette || (old === "emerald" || old === "indigo" ? old : "classic");
  if (!LIGHT_TH.includes(raw.lightTheme)) st.lightTheme = pal === "emerald" || pal === "sandstone" ? pal : "classic";
  if (!DARK_TH.includes(raw.darkTheme)) st.darkTheme = pal === "indigo" ? "indigo" : pal === "burgundy" ? "plum" : "jade";
  if (!GLASS.includes(st.glass)) st.glass = "balanced";
  if (!MOTION.includes(st.motion)) st.motion = "subtle";
  if (!SCENES.includes(st.scene)) st.scene = "landscape";
  delete st.theme;
})();
const hostTheme = document.documentElement.getAttribute("data-host-theme");
const darkMq = (() => { try { return matchMedia("(prefers-color-scheme: dark)"); } catch (e) { return { matches: false }; } })();
const schemeNow = () => st.mode === "system" ? (hostTheme ? hostTheme : (darkMq.matches ? "dark" : "light")) : st.mode;
const themeNow = () => schemeNow() === "dark" ? st.darkTheme : st.lightTheme;
function applyTheme() {
  const r = document.documentElement, sc = schemeNow(), th = themeNow();
  r.setAttribute("data-theme", sc);
  if (th !== "classic" && th !== "jade") r.setAttribute("data-palette", th); else r.removeAttribute("data-palette");
  r.setAttribute("data-glass", st.glass);
  r.setAttribute("data-motion", st.motion);
  r.style.colorScheme = sc;
  r.lang = bn() ? "bn" : LOC.variant(st.loc);
  r.style.setProperty("--ar-scale", st.ar);
  const m = document.querySelector('meta[name="theme-color"]');
  if (m) m.content = getComputedStyle(r).getPropertyValue("--ground").trim() || "#EEF3F1";
}
// Following the system: redraw when the OS or browser switches between light and dark.
try { darkMq.addEventListener("change", () => { if (st.mode === "system") { applyTheme(); render(false); } }); } catch (e) {}

/* ---------------- location ---------------- */
const city = () => (st.city === "gps" && st.gps) ? st.gps : (CITIES.find(c => c.id === st.city) || CITIES[0]);
const cname = c => c.id === "gps" ? t("myloc") : L(c);

/* ---------------- astronomy ---------------- */
const rad = d => d * Math.PI / 180, deg = r => r * 180 / Math.PI, fix = (a, b) => ((a % b) + b) % b;
function julian(y, m, d) { if (m <= 2) { y -= 1; m += 12; } const A = Math.floor(y / 100), B = 2 - A + Math.floor(A / 4); return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + B - 1524.5; }
function sunPos(jd) {
  const d = jd - 2451545, g = fix(357.529 + 0.98560028 * d, 360), q = fix(280.459 + 0.98564736 * d, 360),
    Lm = fix(q + 1.915 * Math.sin(rad(g)) + 0.02 * Math.sin(rad(2 * g)), 360), e = 23.439 - 0.00000036 * d;
  const RA = fix(deg(Math.atan2(Math.cos(rad(e)) * Math.sin(rad(Lm)), Math.cos(rad(Lm)))) / 15, 24);
  return { decl: deg(Math.asin(Math.sin(rad(e)) * Math.sin(rad(Lm)))), eqt: fix(q / 15 - RA + 12, 24) - 12 };
}
function prayerTimes(y, m, d, lat, lng, tz, method, asrF) {
  const M = METHODS[method] || METHODS.MWL, jd0 = julian(y, m, d) - lng / 360;
  const mid = h => fix(12 - sunPos(jd0 + h / 24).eqt, 24);
  const ang = (a, h, dir) => {
    const s = sunPos(jd0 + h / 24), x = (-Math.sin(rad(a)) - Math.sin(rad(s.decl)) * Math.sin(rad(lat))) / (Math.cos(rad(s.decl)) * Math.cos(rad(lat)));
    return mid(h) + dir * deg(Math.acos(Math.max(-1, Math.min(1, x)))) / 15;
  };
  const asrT = h => { const s = sunPos(jd0 + h / 24); return ang(-deg(Math.atan(1 / (asrF + Math.tan(rad(Math.abs(lat - s.decl)))))), h, 1); };
  const adj = h => h + tz - lng / 15;
  const o = { fajr: adj(ang(M.f, 5, -1)), sunrise: adj(ang(0.833, 6, -1)), dhuhr: adj(mid(12)), asr: adj(asrT(13)), maghrib: adj(ang(0.833, 18, 1)) };
  o.isha = M.im ? o.maghrib + M.im / 60 : adj(ang(M.i, 18, 1));
  return o;
}
function zoneParts(zone, date) {
  const p = {};
  const f = new Intl.DateTimeFormat("en-US", { timeZone: zone, hourCycle: "h23", year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric" });
  for (const x of f.formatToParts(date)) if (x.type !== "literal") p[x.type] = +x.value;
  return p;
}
function tzOffset(zone, date) { const p = zoneParts(zone, date); return (Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second) - Math.floor(date.getTime() / 1000) * 1000) / 36e5; }
const dkey = (y, m, d) => y + "-" + pad2(m) + "-" + pad2(d);
function shiftDay(y, m, d, n) { const u = new Date(Date.UTC(y, m - 1, d + n)); return [u.getUTCFullYear(), u.getUTCMonth() + 1, u.getUTCDate()]; }
function dayTimes(c, y, m, d) {
  const tz = tzOffset(c.zone, new Date(Date.UTC(y, m - 1, d, 12) - c.lng / 15 * 36e5));
  const tm = prayerTimes(y, m, d, c.lat, c.lng, tz, st.method, +st.asr), base = Date.UTC(y, m - 1, d) - tz * 36e5;
  return { tm, base, tz, abs: k => base + tm[k] * 36e5 };
}
function snapshot() {
  const c = city(), now = Date.now(), p = zoneParts(c.zone, new Date(now));
  const d0 = dayTimes(c, p.year, p.month, p.day), d1 = dayTimes(c, ...shiftDay(p.year, p.month, p.day, 1)), dm = dayTimes(c, ...shiftDay(p.year, p.month, p.day, -1));
  let next = null;
  for (const k of PRAYERS) if (d0.abs(k) > now) { next = { k, at: d0.abs(k) }; break; }
  if (!next) next = { k: "fajr", at: d1.abs("fajr"), tomorrow: true };
  return { c, p, d0, d1, dm, next, now, nowH: p.hour + p.minute / 60 + p.second / 3600, key: dkey(p.year, p.month, p.day) };
}
function period(s) {
  const n = s.now, a = k => s.d0.abs(k);
  if (n < a("fajr")) return "night"; if (n < a("sunrise")) return "dawn"; if (n < a("dhuhr")) return "morning";
  if (n < a("asr")) return "noon"; if (n < a("maghrib")) return "afternoon"; if (n < a("isha")) return "dusk"; return "night";
}
/* Sky palette for the Today card (Phase 5.3): the prayer periods above, plus "sunrise" (first 30 minutes after sunrise)
   and "golden" (last 40 minutes before sunset), so the colours follow the real light of the selected city. */
function skyPeriod(s) {
  const n = s.now, a = k => s.d0.abs(k), p = period(s);
  if (p === "morning" && n < a("sunrise") + 30 * 6e4) return "sunrise";
  if (p === "afternoon" && n >= a("maghrib") - 40 * 6e4) return "golden";
  return p;
}
function cdLine(s, nx, ok) {
  if (!ok) return `<p class="cd cd-off">${t("cd_off")}</p>`;
  return `<p class="cd" aria-live="off"><span class="lbl">${t("cd_until").replace("{p}", pName(nx.k, isFriD(nx.D)))}</span> <b class="tnum" id="count-next">${countdown(nx.at - s.now)}</b></p>`;
}
/* Live countdown to the next prayer's start (Phase 5.3). It never claims an end time for the current prayer:
   the label names the next prayer. Hours are always shown (01:24:35). */
function countdown(ms) { const s = Math.max(0, Math.floor(ms / 1000)); return num(pad2(Math.floor(s / 3600)) + ":" + pad2(Math.floor(s % 3600 / 60)) + ":" + pad2(s % 60)); }
/* Today's times are usable only if they are finite and in order (high latitudes can break the formulas). */
function timesOk(D) { const tm = D.tm, o = ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"]; return o.every(k => Number.isFinite(tm[k]) && tm[k] >= 0 && tm[k] <= 24) && o.every((k, i) => !i || tm[k] > tm[o[i - 1]]) && tm.isha - tm.maghrib <= 8; }
/* Times when voluntary (nafl) prayer is avoided (Phase 5.3). Sources: Sahih Muslim 831 (three times tied to the sun),
   Sahih al-Bukhari 586 (after the Fajr and Asr prayers), and Ibn Baz's fatwa "Awqat an-nahy 'an salat an-nafilah".
   Sunrise, solar transit (Dhuhr) and sunset come from the same solar formulas as the prayer times, for the selected city
   and date. The sources describe the sunrise period as "until the sun has risen a spear's length" and the zenith period
   as "short", without minutes; this app uses 15 and 10 minutes as stated approximations (the same windows as the
   "Times to avoid" card). The "after Fajr" and "after Asr" periods depend on having prayed, so they are shown only
   when that prayer is ticked in today's tracker. Nothing is shown when the times are not reliable. */
const FORB_SOON = 10; // minutes of notice before a sun-based period begins
function forbiddenNow(s) {
  if (!timesOk(s.d0)) return null;
  const n = s.now, A = k => s.d0.abs(k), m = 6e4, done = st.log[s.key] || {};
  const win = [
    { k: "sunrise", from: A("sunrise"), to: A("sunrise") + 15 * m, sun: true },
    { k: "zenith", from: A("dhuhr") - 10 * m, to: A("dhuhr"), sun: true },
    { k: "sunset", from: A("maghrib") - 15 * m, to: A("maghrib"), sun: true },
    { k: "afterfajr", from: A("fajr"), to: A("sunrise"), need: "fajr" },
    { k: "afterasr", from: A("asr"), to: A("maghrib") - 15 * m, need: "asr" }
  ];
  const act = win.find(w => w.sun && n >= w.from && n < w.to) || win.find(w => w.need && done[w.need] && n >= w.from && n < w.to);
  if (act) return Object.assign({ state: "now" }, act);
  const soon = win.find(w => w.sun && n < w.from && w.from - n <= FORB_SOON * m);
  return soon ? Object.assign({ state: "soon" }, soon) : null;
}
function forbiddenLine(s) {
  const f = forbiddenNow(s); if (!f) return "";
  const at = ms => clock(hOf(ms, s.d0));
  const txt = f.state === "soon" ? t("fw_soon_" + f.k).replace("{t}", at(f.from)).replace("{e}", at(f.to))
    : t("fw_" + f.k).replace("{e}", at(f.k === "afterfajr" ? f.to + 15 * 6e4 : f.k === "afterasr" ? s.d0.abs("maghrib") : f.to));
  return `<p class="forb-warn" id="forb-warn" role="note"><span>${esc(txt)}</span> <button type="button" class="linkish" data-act="forbinfo">${t("fw_why")}</button></p>`;
}
/* Current prayer period and next prayer, from the same schedule the chart uses.
   Periods: Fajr→sunrise, Dhuhr→Asr, Asr→Maghrib, Maghrib→Isha, Isha→next day's Fajr.
   Between sunrise and Dhuhr no obligatory prayer is in progress (cur = null). */
function prayerState(s) {
  const now = s.now, items = [];
  for (const D of [s.dm, s.d0, s.d1]) {
    items.push({ k: "fajr", start: D.abs("fajr"), end: D.abs("sunrise"), D });
    items.push({ k: "dhuhr", start: D.abs("dhuhr"), end: D.abs("asr"), D });
    items.push({ k: "asr", start: D.abs("asr"), end: D.abs("maghrib"), D });
    items.push({ k: "maghrib", start: D.abs("maghrib"), end: D.abs("isha"), D });
  }
  items.push({ k: "isha", start: s.dm.abs("isha"), end: s.d0.abs("fajr"), D: s.dm });
  items.push({ k: "isha", start: s.d0.abs("isha"), end: s.d1.abs("fajr"), D: s.d0 });
  const cur = items.find(x => x.start <= now && now < x.end) || null;
  const nx = items.filter(x => x.start > now).sort((a, b) => a.start - b.start)[0];
  return { cur, next: { k: nx.k, at: nx.start, D: nx.D, tomorrow: nx.D === s.d1 } };
}
/* Hour-of-day for an absolute time, measured from the local midnight of day D. */
const hOf = (ms, D) => (ms - D.base) / 36e5;
function extras(s) {
  const tm = s.d0.tm, h = ms => (ms - s.d0.base) / 36e5;
  const ns = s.d0.abs("maghrib"), night = s.d1.abs("fajr") - ns;
  return { sehri: tm.fajr, iftar: tm.maghrib, ishraq: tm.sunrise + 0.25, duhaEnd: tm.dhuhr - 1 / 6,
    midnight: h(ns + night / 2), tahajjud: h(ns + night * 2 / 3),
    forb: [["fsun", tm.sunrise, tm.sunrise + 0.25], ["fzaw", tm.dhuhr - 1 / 6, tm.dhuhr], ["fset", tm.maghrib - 0.25, tm.maghrib]] };
}
function clock(h) {
  let m = Math.round(h * 60); m = ((m % 1440) + 1440) % 1440;
  const H = Math.floor(m / 60), mm = pad2(m % 60), h12 = H % 12 || 12;
  return num(h12 + ":" + mm) + " " + (H < 12 ? t("am") : t("pm"));
}

/* Friday (Face 7): on a Friday the Dhuhr row is labelled Jumu'ah. It is a display label only: the time is the same
   calculated Dhuhr start, and the tracker still stores it under "dhuhr". D is one day's times (dayTimes); the local
   date's weekday is read at local noon. */
const isFriD = D => !!D && new Date(D.base + D.tz * 36e5 + 432e5).getUTCDay() === 5;
const isFriK = k => { const [y, m, d] = XT.parts(k); return new Date(Date.UTC(y, m - 1, d)).getUTCDay() === 5; };
const pName = (k, fri) => k === "dhuhr" && fri ? t("jumuah") : t(k);

/* ---------------- hijri ---------------- */
function hijri(date) {
  const dt = new Date(date.getTime() + st.hadj * 864e5);
  try {
    const f = new Intl.DateTimeFormat("en-u-ca-islamic-umalqura-nu-latn", { day: "numeric", month: "numeric", year: "numeric", timeZone: city().zone });
    const p = {}; for (const x of f.formatToParts(dt)) if (x.type !== "literal") p[x.type] = parseInt(x.value, 10);
    return p.day && p.month ? { d: p.day, m: p.month, y: p.year } : null;
  } catch (e) { return null; }
}
const hText = h => h ? `${num(h.d)} ${HM[st.lang][h.m - 1]} ${num(h.y)} ${t("ah")}` : "";
const localNoon = (y, m, d) => { const c = city(), g = new Date(Date.UTC(y, m - 1, d, 12)); return new Date(g.getTime() - tzOffset(c.zone, g) * 36e5); };
function eventsOn(h) { return h ? EVENTS.filter(e => e.m === h.m && e.d === h.d) : []; }

/* ---------------- tracker ---------------- */
function streak(s) {
  let n = 0, [y, m, d] = [s.p.year, s.p.month, s.p.day];
  const full = k => { const o = st.log[k] || {}; return PRAYERS.every(p => o[p]); };
  if (!full(s.key)) [y, m, d] = shiftDay(y, m, d, -1);
  while (full(dkey(y, m, d)) && n < 400) { n++; [y, m, d] = shiftDay(y, m, d, -1); }
  return n;
}
function pruneLog(s) { const keep = new Set(); let [y, m, d] = [s.p.year, s.p.month, s.p.day]; for (let i = 0; i < 120; i++) { keep.add(dkey(y, m, d)); [y, m, d] = shiftDay(y, m, d, -1); } for (const k of Object.keys(st.log)) if (!keep.has(k)) delete st.log[k]; }

/* Word help for Pickthall's older English (assets/glossary.js). Shown under the English translation only, labelled
   as help and kept outside the translation text. */
const glossLine = text => { if (bn() || !GL) return ""; const g = GL.forText(text); return g.length ? `<p class="gloss"><span class="gl-h">${t("gl_title")}</span> ${g.map(([w, m]) => `<span class="gl"><i>${esc(w)}</i> = ${esc(m)}</span>`).join(" · ")}</p>` : ""; };

/* ---------------- tracker date navigation (Phase 5) ----------------
   The tracker opens on today's date in the selected city. Earlier dates can be chosen to record or correct the five
   prayers for that date; each date has its own record in st.log, so editing a past date never changes today.
   Dates are handled as Y-M-D keys only (XT.shift / XT.clamp), never parsed as UTC timestamps. Records are kept for
   120 days (pruneLog), so the picker allows today and the 119 days before it; future dates cannot be selected. */
const KEEP_DAYS = 120;
let tSel = null;                                   // selected date key, or null for today
const trackKey = s => tSel ? XT.clamp(tSel, XT.shift(s.key, -(KEEP_DAYS - 1)), s.key) : s.key;
const longDay = k => { const [y, m, d] = XT.parts(k); return new Intl.DateTimeFormat(LT(), { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(Date.UTC(y, m - 1, d, 12))); };
function trackDay(s) {
  const k = trackKey(s), min = XT.shift(s.key, -(KEEP_DAYS - 1)), ago = XT.diff(k, s.key), o = st.log[k] || {}, n = PRAYERS.filter(p => o[p]).length;
  const rel = ago === 0 ? t("t_today") : ago === 1 ? t("t_yday") : t("t_past");
  return `<div class="tday${ago ? " past" : ""}">
    <div class="tnav" role="group" aria-label="${esc(t("t_date"))}">
      <button type="button" class="icon-btn" data-act="tday" data-k="prev" aria-label="${esc(t("t_prev"))}"${k === min ? " disabled" : ""}>${ic("back")}</button>
      <p class="tdate" aria-live="polite"><b>${esc(longDay(k))}</b><span class="badge ${ago ? "past" : "cur"}">${rel}</span></p>
      <button type="button" class="icon-btn" data-act="tday" data-k="next" aria-label="${esc(t("t_next"))}"${ago === 0 ? " disabled" : ""}>${ic("chev")}</button>
    </div>
    <div class="tpick"><label for="t-date">${t("t_pick")}</label><input type="date" id="t-date" class="field" value="${k}" min="${min}" max="${s.key}">${ago ? `<button type="button" class="linkish" data-act="tday" data-k="today">${t("t_back")}</button>` : ""}</div>
    <ul class="tlist">${PRAYERS.map(p => `<li><span>${pName(p, isFriK(k))}</span><button type="button" class="tick${justTicked === p ? " just" : ""}" data-act="trk" data-k="${p}" aria-pressed="${!!o[p]}" aria-label="${esc(t("markp"))}: ${esc(pName(p, isFriK(k)))}, ${esc(longDay(k))}"><i><svg viewBox="0 0 16 16"><path d="M3.5 8.5l3 3 6-7"/></svg></i></button></li>`).join("")}</ul>
    <p class="note" aria-live="polite">${n ? (bn() ? `${num(5)}-এর মধ্যে ${num(n)} ${t("t_count")}` : `${n} ${t("of")} 5 ${t("t_count")}`) : t("t_empty")}</p>
    <p class="note tkeep">${t("t_keep")}</p>
  </div>`;
}

/* Prayer tracker history (Face 7.1): a 7-day × 5-prayer grid. The cells are information only (filled square =
   recorded, hollow = not recorded); the one control for each prayer is the list below. The day headings are date
   pickers for that list (data-act="tsel"), labelled as such, and show today and the selected day by frame and text. */
function fardGraph(s) {
  const tk = trackKey(s), days = lastDays(s, 7).reverse(), fmt = new Intl.DateTimeFormat(LT(), { weekday: "short", timeZone: "UTC" });
  const dnum = k => num(XT.parts(k)[2]);
  const head = days.map(k => { const [yy, mm, dd] = XT.parts(k), isT = k === s.key, sel = k === tk, o = st.log[k] || {}, c = PRAYERS.filter(p => o[p]).length;
    return `<button type="button" class="fg-day${isT ? " today" : ""}${sel ? " sel" : ""}" data-act="tsel" data-k="${k}" aria-pressed="${sel}" aria-label="${esc(t("fg_pick").replace("{d}", longDay(k)))}, ${esc(`${num(c)}/${num(5)}`)}"><span class="fg-wd">${esc(fmt.format(new Date(Date.UTC(yy, mm - 1, dd, 12))))}</span><b>${dnum(k)}</b>${isT ? `<small class="sr">${t("t_today")}</small><i class="fg-tbar" aria-hidden="true"></i>` : ""}</button>`; }).join("");
  const rows = PRAYERS.map(p => `<span class="fg-p">${t(p)}</span>${days.map(k => { const on = !!(st.log[k] || {})[p]; return `<i class="fg-c${on ? " on" : ""}${k === tk ? " sel" : ""}${k === s.key ? " today" : ""}"></i>`; }).join("")}`).join("");
  const tot = days.map(k => { const o = st.log[k] || {}; return `<span class="fg-n${k === tk ? " sel" : ""}">${num(PRAYERS.filter(p => o[p]).length)}</span>`; }).join("");
  const sr = days.map(k => { const o = st.log[k] || {}, got = PRAYERS.filter(p => o[p]); return `${longDay(k)}: ${t("fg_sr").replace("{n}", num(got.length))}${got.length ? " (" + got.map(p => t(p)).join(", ") + ")" : ""}`; }).join(". ");
  return `<figure class="fg" aria-labelledby="fg-h">
    <figcaption class="fg-top"><span class="wt-h" id="fg-h">${t("fg_h")}</span><span class="fg-key" aria-hidden="true"><span><i class="fg-c on"></i>${t("fg_on")}</span><span><i class="fg-c"></i>${t("fg_off")}</span><span><i class="fg-tbar"></i>${t("t_today")}</span></span></figcaption>
    <div class="fg-grid"><span class="fg-corner" aria-hidden="true"></span>${head}<div class="fg-body" aria-hidden="true">${rows}<span class="fg-p fg-tl">${t("fg_total")}</span>${tot}</div></div>
    <p class="sr">${esc(sr)}.</p>
    <p class="note fg-hint">${t("fg_hint")}</p>
  </figure>`;
}

/* ---------------- extra worship (kept apart from the fard log; see assets/xtrack.js) ---------------- */
const lastDays = (s, n) => { const out = []; let [y, m, d] = [s.p.year, s.p.month, s.p.day]; for (let i = 0; i < n; i++) { out.push(dkey(y, m, d)); [y, m, d] = shiftDay(y, m, d, -1); } return out; };
/* Witr is labelled as in the Prayer guide: wajib in the Hanafi school, a confirmed sunnah for the majority. */
const witrKind = () => t(st.school === "hanafi" ? "x_witr_hanafi" : st.school === "shafii" ? "x_witr_shafii" : "x_witr_any");
const xCount = (k, s) => k === "fast" ? t("x_fast_s").replace("{n}", num(XT.count(st.xlog, lastDays(s, 30), "fast"))) : t("x_week").replace("{n}", num(XT.count(st.xlog, lastDays(s, 7), k)));
/* Face 7.1: each practice has its own small history strip, drawn from its own records only: the last 7 days for the
   voluntary prayers, the last 30 days for voluntary fasting. Oldest on the left, today on the right (outlined).
   There is no combined score, and nothing here touches the five-prayer count or streak. */
const xStrip = (k, s) => { const days = lastDays(s, k === "fast" ? 30 : 7).reverse();
  return `<span class="xs${k === "fast" ? " x30" : ""}" role="img" aria-label="${esc(t(k === "fast" ? "x_fast" : "x_" + k))}: ${esc(xCount(k, s))}">${days.map(d => `<i class="${(st.xlog[d] || {})[k] ? "on" : ""}${d === s.key ? " today" : ""}"></i>`).join("")}</span>`; };
function xRow(k, s) {
  const on = !!(st.xlog[s.key] || {})[k], label = t(k === "fast" ? "x_fast" : "x_" + k);
  const kind = k === "witr" ? witrKind() : k === "fast" ? t("x_fast_k") : t("x_" + k + "_s");
  return `<li class="x-${k}"><span class="nm"><b>${label}</b><small>${esc(kind)}</small><span class="xh">${xStrip(k, s)}<small class="xc">${xCount(k, s)}</small></span></span><button type="button" class="tick xtick" data-act="xw" data-k="${k}" aria-pressed="${on}" aria-label="${esc(t("markx"))}: ${esc(label)}"><i><svg viewBox="0 0 16 16"><path d="M3.5 8.5l3 3 6-7"/></svg></i></button></li>`;
}
/* Extra worship (Face 7.1: its own card again, separate from the Prayer tracker; still stored apart in xlog). */
function vExtra(s) {
  // Fasts are recorded per civil date, so the Hijri date of that day's daytime decides the notes below.
  const h = hijri(localNoon(s.p.year, s.p.month, s.p.day));
  const note = !h ? "" : h.m === 9 ? t("x_ramadan") : (h.m === 10 && h.d === 1) || (h.m === 12 && h.d >= 10 && h.d <= 13) ? t("x_nofast") : "";
  return `<section class="card pad a-extra" aria-labelledby="xw-h">
    <div class="row wt-head"><div class="grow"><h3 class="sec-title" id="xw-h">${t("extra")}</h3><p class="note">${t("extra_n")}</p></div><span class="badge cur">${t("t_today")}</span></div>
    ${trackKey(s) !== s.key ? `<p class="note xw-note" role="note">${t("x_today_only")}</p>` : ""}
    <div class="xw-groups">
      <div class="xw-grp" role="group" aria-labelledby="xwg-p"><p class="wt-h" id="xwg-p">${t("x_prayers")}</p>
        <ul class="xw">${["tahajjud", "duha", "rawatib", "witr"].map(k => xRow(k, s)).join("")}</ul>
        ${st.school ? "" : `<p class="note"><button type="button" class="linkish" data-act="go" data-tab="more" data-sub="guide">${t("x_school")}</button></p>`}</div>
      <div class="xw-grp" role="group" aria-labelledby="xwg-f"><p class="wt-h" id="xwg-f">${t("x_fasting")}</p>
        <ul class="xw">${xRow("fast", s)}</ul>
        ${note ? `<p class="note xw-note">${note}</p>` : ""}</div>
    </div>
    <p class="note xs-key"><span class="xs" aria-hidden="true"><i class="on"></i></span> ${t("xs_on")} <span class="xs" aria-hidden="true"><i></i></span> ${t("xs_off")} · ${t("xs_sep")}</p>
  </section>`;
}

/* ---------------- routing ---------------- */
let R = { tab: TABS.includes(st.tab) ? st.tab : "today", sub: null, surah: 0, ayah: 0 };
/* Face 7: zakat removed from the UI (route, nav, More, About). st.zk and assets/zakat.js are kept untouched; old #more/zakat links fall back to More. */
const SUBS = ["guide", "hadith", "names", "calendar", "settings", "about", "terms", "privacy", "feedback"];
const hashSub = h => SUBS.includes(h) ? h : (h.startsWith("more/") && SUBS.includes(h.slice(5)) ? h.slice(5) : null);
const h0 = (location.hash || "").slice(1), d0 = deepParse(h0); // Face 7.3: a shared link to one item
if (d0) R = Object.assign({ sub: null, surah: 0, ayah: 0, study: 0, story: null }, d0.r);
else if (TABS.includes(h0)) R.tab = h0;
else if (h0 === "quran/all") R = { tab: "quran", sub: "all", surah: 0, ayah: 0 }; // Face 7: link to the full list of 114 surahs
else if (h0 === "stories" || h0 === "quran/stories") R = { tab: "quran", sub: "stories", surah: 0, ayah: 0 }; // Face 7.1
else if (hashSub(h0)) R = { tab: "more", sub: hashSub(h0), surah: 0, ayah: 0 };
else if (h0.startsWith("more/")) R = { tab: "more", sub: null, surah: 0, ayah: 0 }; // unknown or removed page (e.g. more/zakat) → More
let depth = 0;
function go(r, push = true) {
  R = Object.assign({ tab: R.tab, sub: null, surah: 0, ayah: 0, study: 0, story: null }, r);
  st.tab = R.tab; save();
  if (push) { try { history.pushState(R, ""); depth++; } catch (e) {} }
  render(true);
  if (!R.ayah) window.scrollTo(0, 0);
}
/* A route for a typed or linked hash (#stories, #more/guide, …), or null. */
const hashRoute = h => TABS.includes(h) ? { tab: h } : h === "quran/all" ? { tab: "quran", sub: "all" } : (h === "stories" || h === "quran/stories") ? { tab: "quran", sub: "stories" }
  : hashSub(h) ? { tab: "more", sub: hashSub(h) } : h.startsWith("more/") ? { tab: "more" } : null;
/* A shared link to an item whose page data is not loaded yet: load it, then handle the link again. */
const deepWait = hh => { const g = hashGroup(hh); if (!g || lazyDone.has(g)) return false;
  need(g).then(() => { if ((location.hash || "").slice(1) === hh) dispatchEvent(new HashChangeEvent("hashchange")); }, () => toast(t("pgfail"))); return true; };
addEventListener("hashchange", () => {
  const hh0 = (location.hash || "").slice(1); if (deepWait(hh0)) return;
  const hh = hh0, dd = deepParse(hh);
  if (dd) { if ($("sheet").classList.contains("on")) closeSheet(); deepPre(dd); go(dd.r, false); try { history.replaceState(R, ""); } catch (e) {} deepPost(dd); return; }
  const r = hashRoute(hh);
  // Face 7.1 fix: record the route on this history entry, so Back from a page opened after a link returns here.
  if (r) { go(r, false); try { history.replaceState(R, ""); } catch (e) {} }
});
addEventListener("popstate", e => { depth = Math.max(0, depth - 1);
  if (e.state && e.state.tab) { R = e.state; render(true); return; }
  // An entry without app state (for example one created by a link to #stories): route from its hash.
  const hh = (location.hash || "").slice(1); if (deepWait(hh)) return;
  const dd = deepParse(hh);
  if (dd) { deepPre(dd); go(dd.r, false); deepPost(dd); return; }
  const r = hashRoute(hh); go(r || { tab: "today" }, false); });
try { history.replaceState(R, ""); } catch (e) {}

/* ---------------- shell ---------------- */
function header() {
  const c = city();
  $("top").innerHTML = `
    <button type="button" class="brand" data-act="home" aria-label="${esc(t("brand"))}">${LOGO}<b>${t("brand")}</b></button>
    <span class="hdate">${esc(dateLine())}</span>
    <button type="button" class="chip-btn" data-act="loc" aria-label="${esc(cname(c) + ", " + t("chooseloc"))}">${ic("pin")}<span>${esc(cname(c))}</span></button>
    <button type="button" class="icon-btn lang-btn" data-act="lang" aria-label="${(bn() ? "EN" : "বাং") + ", " + esc(t("langswitch"))}">${bn() ? "EN" : "বাং"}</button>
    <button type="button" class="icon-btn" data-act="go" data-tab="more" data-sub="settings" aria-label="${esc(t("settings"))}">${ic("gear")}</button>`;
}
function nav() {
  const i = TABS.indexOf(R.tab);
  $("tabs").innerHTML = `<span class="ind" style="transform:translateX(${i * 100}%)"></span>` +
    TABS.map(id => `<button type="button" data-act="tab" data-tab="${id}"${id === R.tab ? ' aria-current="page"' : ""}>${ic(id)}<span>${t(id === "quran" ? "study_nav" : id)}</span></button>`).join("");
}
let post = [], heroAnim = false;
function render(anim) {
  // A redraw of the same page (for example the Today page each minute) puts keyboard focus back on the same control.
  const fa = !anim && document.activeElement, fd = fa && $("view").contains(fa) && fa.dataset && fa.dataset.act ? fa.dataset : null;
  applyTheme(); header(); nav(); side();
  const v = $("view"); post = []; heroAnim = !!anim;
  v.className = "view v-" + (R.tab === "more" ? (R.sub || "more") : R.tab);
  let f;
  if (R.tab === "today") f = vToday;
  // Face 7: the Qur'an tab opens the curated study library; the full reader (all 114 surahs) is R.sub === "all".
  else if (R.tab === "quran" && R.sub === "stories") f = R.story ? vStory : vStories; // Face 7.1 Qur'an Stories
  else if (R.tab === "quran") f = R.sub === "all" || R.surah ? (desk() ? vQuranDesk : (R.surah ? vReader : vQuran)) : (desk() ? vStudyDesk : (R.study ? vStudyDetail : vStudy));
  else if (R.tab === "duas") f = vDuas;
  
  else f = { guide: vGuide, hadith: vHadith, names: vNames, calendar: vCalendar, settings: vSettings, about: vAbout, terms: () => vLegal("terms"), privacy: () => vLegal("privacy"), feedback: vFeedback }[R.sub] || vMore;
  const g = routeGroup(R);
  if (g && !lazyDone.has(g)) { // page data not loaded yet: show a short loading state, then draw the page
    v.innerHTML = `<div class="lazy-wait" role="status"><span class="spin" aria-hidden="true"></span>${esc(t("pgloading"))}</div>`;
    need(g).then(() => { if (routeGroup(R) === g) render(anim); },
      () => { if (routeGroup(R) === g) v.innerHTML = `<div class="lazy-wait" role="alert"><p>${esc(t("pgfail"))}</p><button type="button" class="btn soft" data-act="lazyretry">${esc(t("retry"))}</button></div>`; });
    return;
  }
  v.innerHTML = f() + siteFoot();
  if (anim && !reduce) { v.classList.remove("enter"); [...v.children].forEach((el, i) => el.style.setProperty("--i", Math.min(i, 8))); void v.offsetWidth; v.classList.add("enter"); }
  else v.classList.remove("enter");
  post.forEach(fn => fn());
  fitClamps();
  if (fd) { const el = [...v.querySelectorAll("[data-act]")].find(x => x.dataset.act === fd.act && x.dataset.k === fd.k && x.dataset.i === fd.i && x.dataset.s === fd.s); if (el) el.focus({ preventScroll: true }); }
}
const back = (label) => `<button type="button" class="icon-btn" data-act="back" aria-label="${esc(label || t("back"))}">${ic("back")}</button>`;

/* ---------------- toast / burst / sheet ---------------- */
let toastT = 0;
function toast(msg) { const el = $("toast"); el.textContent = msg; el.classList.add("on"); clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove("on"), 2200); }
function burst(x, y) {
  if (reduce) return;
  const b = document.createElement("div"); b.className = "burst"; b.style.left = x + "px"; b.style.top = y + "px";
  for (let k = 0; k < 14; k++) { const i = document.createElement("i"); i.style.setProperty("--a", (k * 360 / 14) + "deg"); i.style.setProperty("--c", k % 2 ? "var(--accent)" : "var(--gold)"); b.appendChild(i); }
  document.body.appendChild(b); setTimeout(() => b.remove(), 900);
}
/* Bottom sheet / dialog. Focus moves into it, Tab is kept inside, and focus returns to the opener on close. */
let sheetReturn = null;
function openSheet(html, returnTo) {
  const sh = $("sheet"), wasOpen = sh.classList.contains("on");
  if (!wasOpen) sheetReturn = returnTo || document.activeElement;
  sh.innerHTML = `<div class="grab"></div><button type="button" class="icon-btn sheet-x" data-act="closesheet" aria-label="${esc(t("close"))}">${ic("x")}</button>` + html;
  const h = sh.querySelector("h2, h3"); if (h) { h.id = h.id || "sheet-title"; sh.setAttribute("aria-labelledby", h.id); } else sh.removeAttribute("aria-labelledby");
  sh.inert = false; sh.classList.add("on"); $("scrim").classList.add("on"); sh.setAttribute("aria-hidden", "false");
  $("view").setAttribute("aria-hidden", "true");
  const f = sh.querySelector("[data-autofocus]") || sh.querySelector(".sheet-x");
  setTimeout(() => { if (sh.classList.contains("on") && !sh.contains(document.activeElement)) f.focus({ preventScroll: true }); }, 30);
  sh.scrollTop = 0;
}
function closeSheet() {
  const sh = $("sheet"); if (!sh.classList.contains("on")) return;
  sh.classList.remove("on"); $("scrim").classList.remove("on"); sh.setAttribute("aria-hidden", "true"); sh.inert = true; /* a closed sheet keeps its content in the DOM: make it unreachable by Tab */ $("view").removeAttribute("aria-hidden");
  const r = sheetReturn; sheetReturn = null;
  if (r && document.contains(r) && r.focus) r.focus({ preventScroll: true });
}
function trapSheet(e) {
  const sh = $("sheet"); if (!sh.classList.contains("on")) return;
  const f = [...sh.querySelectorAll('a[href],button:not([disabled]),input,select,textarea,summary,[tabindex]:not([tabindex="-1"])')].filter(x => x.offsetParent !== null);
  if (!f.length) return; const first = f[0], last = f[f.length - 1];
  if (e.shiftKey && (document.activeElement === first || !sh.contains(document.activeElement))) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && (document.activeElement === last || !sh.contains(document.activeElement))) { e.preventDefault(); first.focus(); }
}
function copyText(txt) {
  try { navigator.clipboard.writeText(txt).then(() => toast(t("copied")), () => toast(t("copyfail"))); }
  catch (e) { toast(t("copyfail")); }
}

/* ---------------- hero landscape ---------------- */
const SCENE = (() => {
  const W = 800, H = 400;
  function ridge(seed, base, amp, rough) {
    let sd = seed; const rnd = () => { sd = (sd * 16807) % 2147483647; return sd / 2147483647; };
    const n = 65, y = new Array(n).fill(base);
    y[0] = base + (rnd() - 0.5) * amp; y[n - 1] = base + (rnd() - 0.5) * amp;
    for (let step = n - 1, a = amp; step > 1; step /= 2, a *= rough)
      for (let i = step / 2; i < n; i += step) y[i] = (y[i - step / 2] + y[i + step / 2]) / 2 + (rnd() - 0.5) * a;
    const at = x => { const f = x / W * (n - 1), i = Math.min(n - 2, Math.floor(f)); return y[i] + (y[i + 1] - y[i]) * (f - i); };
    let d = `M0 ${H}`; y.forEach((v, i) => { d += `L${(i * W / (n - 1)).toFixed(1)} ${v.toFixed(1)}`; });
    return { d: d + `L${W} ${H}Z`, at };
  }
  const far = ridge(7, 262, 110, 0.56), mid = ridge(23, 300, 80, 0.52), near = ridge(41, 352, 34, 0.5);
  // small mosque on the near ridge: two domes, a minaret, finials
  const mx = 468, g = near.at(mx + 22) + 2;
  const mosque = `M${mx} ${g}V${g - 14}H${mx + 44}V${g}Z` +
    `M${mx + 8} ${g - 14}a14 14 0 0 1 28 0Z` + `M${mx + 21} ${g - 28}h2v-6h-2Z` +
    `M${mx + 50} ${g}V${g - 40}h5V${g}Z` + `M${mx + 49} ${g - 40}h7l-3.5 -7Z` +
    `M${mx - 12} ${g}V${g - 8}H${mx}V${g}Z` + `M${mx - 10} ${g - 8}a4 4 0 0 1 8 0Z`;
  // Face 7 "Mosque silhouette" scene: one larger, restrained building on a flat ground, kept to the right so the text
  // on the left stays clear. Arched door and windows are cut out (even-odd fill).
  const G = 362, cx = 652;
  const big = `M${cx - 78} ${G}V${G - 34}H${cx + 78}V${G}Z` +
    `M${cx - 40} ${G - 34}a40 40 0 0 1 80 0Z` + `M${cx - 6} ${G - 34}v-2h12v2Z` + `M${cx - 1.2} ${G - 74}h2.4v-12h-2.4Z` + `M${cx} ${G - 90}a4 4 0 1 1 0.01 0Z` +
    `M${cx - 70} ${G - 34}a13 13 0 0 1 26 0Z` + `M${cx + 44} ${G - 34}a13 13 0 0 1 26 0Z` +
    `M${cx - 104} ${G}V${G - 96}h12V${G}Z` + `M${cx - 106} ${G - 96}h16l-8 -18Z` + `M${cx - 104} ${G - 70}h12v3h-12Z` +
    `M${cx + 92} ${G}V${G - 96}h12V${G}Z` + `M${cx + 90} ${G - 96}h16l-8 -18Z` + `M${cx + 92} ${G - 70}h12v3h-12Z` +
    `M${cx - 9} ${G}v-14a9 9 0 0 1 18 0v14Z` + `M${cx - 52} ${G - 8}v-12a5 5 0 0 1 10 0v12Z` + `M${cx + 42} ${G - 8}v-12a5 5 0 0 1 10 0v12Z`;
  const dunes = ridge(59, 344, 18, 0.45);
  return { far: far.d, mid: mid.d, near: near.d, mosque, big, dunes: dunes.d, G };
})();
/* Prayer scene (Face 7, st.scene): "landscape" is the original scene and the default; "sky" keeps only the sky,
   clouds and a low horizon so the sun/moon arc leads; "mosque" draws one quiet silhouette. All three use the same
   time-of-day colours (--s1…--m3) and the same scrim, so the text contrast is unchanged. If the SVG fails to draw,
   the sky gradient and scrim behind the text remain. */
function heroScene() {
  const sc = SCENES.includes(st.scene) ? st.scene : "landscape";
  const clouds = `<svg class="sky-clouds" viewBox="0 0 800 400" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
    <defs><filter id="cl-f" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.0055 0.018" numOctaves="4" seed="5" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1.9 0 0 0 -0.78" result="a"/><feFlood class="cl-flood" result="c"/><feComposite in="c" in2="a" operator="in"/><feGaussianBlur stdDeviation="1.2"/></filter>
    <linearGradient id="cl-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="1"/><stop offset=".75" stop-color="#fff" stop-opacity=".35"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
    <mask id="cl-m"><rect width="800" height="300" fill="url(#cl-g)"/></mask></defs>
    <g mask="url(#cl-m)"><rect class="cloud" width="800" height="300" filter="url(#cl-f)"/></g>
  </svg>`;
  const hz = `<defs><linearGradient id="hz-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="hz0"/><stop offset="1" class="hz1"/></linearGradient></defs>`;
  if (sc === "sky") return clouds + `<svg class="sky-land" viewBox="0 0 800 400" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">${hz}
    <rect y="250" width="800" height="150" fill="url(#hz-g)"/><path class="hl-mid sc-low" d="M0 372 Q400 360 800 372V400H0Z"/><path class="sc-hzn" d="M0 372.5 Q400 360.5 800 372.5"/></svg>`;
  if (sc === "mosque") return clouds + `<svg class="sky-land" viewBox="0 0 800 400" preserveAspectRatio="xMaxYMax slice" aria-hidden="true" focusable="false">${hz}
    <rect y="240" width="800" height="160" fill="url(#hz-g)"/><path class="hl-far sc-dune" d="${SCENE.dunes}"/><path class="hl-near" fill-rule="evenodd" d="${SCENE.big}"/><rect class="hl-near" y="${SCENE.G - 1}" width="800" height="${401 - SCENE.G}"/></svg>`;
  return clouds + `
  <svg class="sky-land" viewBox="0 0 800 400" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
    <defs><linearGradient id="hz-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="hz0"/><stop offset="1" class="hz1"/></linearGradient>
    <filter id="gr-f"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter></defs>
    <path class="hl-far" d="${SCENE.far}"/><rect y="220" width="800" height="180" fill="url(#hz-g)"/>
    <path class="hl-mid" d="${SCENE.mid}"/><path class="hl-near" d="${SCENE.near}"/><path class="hl-near" d="${SCENE.mosque}"/>
    <rect class="grain" width="800" height="400" filter="url(#gr-f)"/>
  </svg>`;
}

/* ---------------- TODAY ---------------- */
let snap = null;
function vToday() {
  const s = snap = snapshot(), tm = s.d0.tm, ex = extras(s), done = st.log[s.key] || {};
  const per = skyPeriod(s), n = PRAYERS.filter(k => done[k]).length, ok = timesOk(s.d0), fri = isFriD(s.d0);
  const ps = s.ps = prayerState(s), cur = ps.cur, nx = ps.next;
  const hj = hijriNow(s);
  const greg = new Intl.DateTimeFormat(LT(), { timeZone: s.c.zone, weekday: "long", day: "numeric", month: "long" }).format(new Date(s.now));
  // sun / moon position along the arc
  let f;
  if (s.now >= s.d0.abs("sunrise") && s.now < s.d0.abs("maghrib")) f = (s.now - s.d0.abs("sunrise")) / (s.d0.abs("maghrib") - s.d0.abs("sunrise"));
  else { const a = s.now < s.d0.abs("fajr") || s.now < s.d0.abs("sunrise") ? s.dm.abs("maghrib") : s.d0.abs("maghrib"), b = s.now < s.d0.abs("sunrise") ? s.d0.abs("sunrise") : s.d1.abs("sunrise"); f = (s.now - a) / (b - a); }
  f = Math.max(0, Math.min(1, f));
  const stars = (per === "night" || per === "dusk" || per === "dawn") ? `<div class="stars" aria-hidden="true">${[[12, 18], [24, 9], [38, 22], [55, 12], [70, 26], [83, 10], [91, 30], [64, 6], [47, 33], [30, 38], [8, 40], [76, 40]].map(([x, y], i) => `<i style="left:${x}%;top:${y}%;animation-delay:${(i * 0.37).toFixed(2)}s"></i>`).join("")}</div>` : "";
  const ARC = "M178 150 Q262 -24 340 150";
  // At night the orb is the moon, drawn with its phase for the Hijri day (mirrored in the southern hemisphere).
  const moonUp = per === "night" || per === "dusk" || per === "dawn";
  post.push(() => animateArc(f));
  let [y, m, d] = [s.p.year, s.p.month, s.p.day];
  const nowStr = ex.forb.find(w => s.nowH >= w[1] && s.nowH < w[2]);
  const ev = (() => { for (let i = 0; i < 400; i++) { const [a1, b1, c1] = shiftDay(y, m, d, i); const h = hijri(localNoon(a1, b1, c1)); const e = eventsOn(h).filter(x => !x.minor); if (e.length) return { e: e[0], i }; } return null; })();
  // Face 7: Thursday/Friday may use a reviewed day entry (assets/votd-day.js); otherwise the normal schedule.
  const wdNow = new Date(Date.UTC(s.p.year, s.p.month - 1, s.p.day)).getUTCDay();
  const dayV = window.IE_VOTD_DAY ? window.IE_VOTD_DAY.pick(wdNow) : null;
  const v = votdPick = dayV ? Object.assign({ day: wdNow }, dayV) : VOTD.entryFor(s.p.year, s.p.month, s.p.day);
  return `
  <section class="sky a-hero" data-p="${per}" data-scene="${st.scene}" aria-label="${esc(t("curp"))}">
    ${heroScene()}
    ${stars}
    <svg class="arc" viewBox="0 0 340 160" aria-hidden="true"><defs><radialGradient id="glow-g"><stop offset="0" class="gl0"/><stop offset="1" class="gl1"/></radialGradient></defs><path class="horizon" d="M0 150H340" stroke-width="1" fill="none"/><path id="arcpath" class="track" d="${ARC}" fill="none" stroke-width="1.5"/><path id="trail" class="trail" d="${ARC}" pathLength="100" stroke-dasharray="0 100" fill="none" stroke-width="2" stroke-linecap="round"/><circle id="glow" cx="178" cy="150" r="58" fill="url(#glow-g)"/><circle id="orb" class="orb${moonUp ? " hide" : ""}" cx="178" cy="150" r="9"/>${moonUp ? `<g id="moonG" class="moong" transform="translate(178 150)">${moonPhase(hj ? hj.d : 1, s.c.lat, 9)}</g>` : ""}</svg>
    <div class="sky-scrim" aria-hidden="true"></div>
    <div class="sky-body">
      <p class="eyebrow">${t("curp")}</p>
      ${cur ? `<h1 id="cur-name">${pName(cur.k, isFriD(cur.D))}</h1>
      <p class="at" id="cur-start"><span class="lbl">${t("began")}</span> <b class="tnum">${clock(hOf(cur.start, cur.D))}</b>${cur.D === s.dm ? ` <span class="rel">${t("yday")}</span>` : ""}</p>
      ${cdLine(s, nx, ok)}`
      : `<h1 class="h1-sm" id="cur-name">${t("nocur")}</h1>
      <p class="at" id="cur-start">${t("fajrended").replace("{t}", clock(tm.sunrise))}</p>
      ${cdLine(s, nx, ok)}`}
      ${forbiddenLine(s)}
      <div class="next-pill" id="next-pill">
        <span class="np-l"><span class="np-k">${t("next")}</span><b>${pName(nx.k, isFriD(nx.D))}</b></span>
        <span class="np-r"><span class="np-k">${t("startsat")}</span><b class="tnum">${clock(hOf(nx.at, nx.D))}</b><span class="np-day">${nx.tomorrow ? t("tomorrow_c") : t("t_today")}</span></span>
      </div>
      <p class="dates">${esc(greg)}<br>${esc(hText(hj))}</p>
      <p class="adhan-note">${t("adhannote")}</p>
    </div>
  </section>

  <section class="card a-times">
    <div class="row pad" style="padding-bottom:0"><h3 class="grow">${t("ptimes")}</h3><span class="note">${esc(L(METHODS[st.method]).short)}${+st.asr === 2 ? " · " + t("hanafi") : ""}</span></div>
    ${dayViz(s)}
    <ol class="times">${ROWS.map(k => { const isC = cur && cur.k === k, isN = nx.k === k; let when = "", hrs = tm[k];
      if (isC && cur.D === s.dm) { hrs = hOf(cur.start, s.dm); when = t("yday"); }
      else if (isN && nx.tomorrow) { hrs = hOf(nx.at, s.d1); when = t("tomorrow"); }
      // Face 7.1: the rows are information only (name, time, current/next). Completion lives in the Prayer tracker alone.
      return `<li class="${k === "sunrise" ? "minor" : ""}${isC ? " is-cur" : ""}${isN ? " is-next" : ""}"${isC ? ' aria-current="time"' : ""}><span class="nm">${pName(k, fri)}${isC ? `<span class="badge cur">${t("curb")}</span>` : ""}${isN ? `<span class="badge nxt">${t("nextb")}</span>` : ""}</span><span class="tm">${clock(hrs)}${when ? `<small class="when">${when}</small>` : ""}</span></li>`; }).join("")}</ol>
    ${fri ? `<p class="note jum-note" role="note">${t("jum_note")}</p>` : ""}
    <p class="note times-foot">${t("pm_hint")} <a href="#trk-h" class="linkish">${t("pm_go")}</a></p>
  </section>

  <section class="card verse a-verse" aria-labelledby="votd-h">
    <h3 class="sec-title" id="votd-h">${t("votd")}</h3>
    ${votdBody(v)}
  </section>

  <section class="card pad a-track" aria-labelledby="trk-h">
    <div class="row wt-head"><div class="grow"><h3 class="sec-title" id="trk-h">${t("wtracker")}</h3><p class="note">${bn() ? `${num(5)}-এর মধ্যে ${num(n)} ${t("prayedtoday")}` : `${n} ${t("of")} 5 ${t("prayedtoday")}`}</p></div>
    <div class="streak"><strong>${num(streak(s))}</strong><span class="note">${t("daystreak")}</span></div></div>
    ${fardGraph(s)}
    ${trackDay(s)}
  </section>

  ${vExtra(s)}

  <section class="card pad a-forb">
    <h3 class="sec-title">${t("forbidden")}${nowStr ? ` <span class="badge now">${t("now")}</span>` : ""}</h3>
    <ul class="list-kv forb" style="margin-top:6px">${ex.forb.map(w => `<li${w === nowStr ? ' class="warn" aria-current="time"' : ""}><span>${t(w[0])}${w === nowStr ? `<span class="sr"> (${t("nowwin")})</span>` : ""}</span><span class="v">${clock(w[1])} – ${clock(w[2])}</span></li>`).join("")}</ul>
    <h3 class="sec-title" style="margin-top:18px">${t("optional")}</h3>
    <ul class="list-kv" style="margin-top:6px">
      <li><span>${t("ishraq")}</span><span class="v">${clock(ex.ishraq)} – ${clock(ex.duhaEnd)}</span></li>
      <li><span>${t("midnight")}</span><span class="v">${clock(ex.midnight)}</span></li>
      <li><span>${t("tahajjud")}</span><span class="v">${t("from")} ${clock(ex.tahajjud)}</span></li>
    </ul>
    <p class="note" style="margin-top:8px">${t("approx")} <button type="button" class="linkish" data-act="forbinfo">${t("fw_why")}</button></p>
  </section>

  <button type="button" class="hcal a-tiles" data-act="go" data-tab="more" data-sub="calendar" aria-label="${esc(t("calendar") + ": " + hText(hj))}">
    ${moonSvg(hj ? hj.d : 1, s.c.lat)}
    <span class="hc-main"><span class="hc-title">${t("calendar")}</span>
      <span class="hc-day">${hj ? `<b>${num(hj.d)}</b> ${HM[st.lang][hj.m - 1]}` : ""}</span>
      <span class="hc-sub">${hj ? num(hj.y) + " " + t("ah") + " · " : ""}${esc(greg)}</span></span>
    ${ic("chev", "hc-chev")}
    ${ev ? `<span class="hc-ev"><i aria-hidden="true"></i>${esc(L(ev.e))} · ${ev.i ? t("inn").replace("{n}", num(ev.i)) : t("todayl")}</span>` : ""}
  </button>

  <section class="card pad a-fast">
    <h3 class="sec-title">${t("fasting")}</h3>
    <div class="duo" style="margin-top:10px"><div class="kv"><span class="note">${t("sehri")}</span><span class="v">${clock(ex.sehri)}</span></div><div class="kv"><span class="note">${t("iftar")}</span><span class="v">${clock(ex.iftar)}</span></div></div>
  </section>`;
}
/* Prayer-day chart (Phase 5.2): the sun's altitude through the city's local day, computed from the same solar
   position as the prayer times, with the horizon, sunrise and sunset (marked as events, not prayers), the five
   prayer start times and the current time. The text schedule directly below it is the full, accessible version;
   the chart repeats it in its label. Where the sun does not rise or set, or twilight does not end (high latitudes),
   or the times are not in order, the chart is replaced by a note. */
function sunAlt(s, h) {
  const c = s.c, D = s.d0, ut = h - D.tz, jd = julian(s.p.year, s.p.month, s.p.day) + ut / 24, sp = sunPos(jd);
  const H = rad(15 * (ut + c.lng / 15 + sp.eqt - 12));
  return deg(Math.asin(Math.sin(rad(c.lat)) * Math.sin(rad(sp.decl)) + Math.cos(rad(c.lat)) * Math.cos(rad(sp.decl)) * Math.cos(H)));
}
function dayViz(s) {
  const tm = s.d0.tm, order = ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"], fri = isFriD(s.d0), pn = k => pName(k, fri);
  const pts = []; for (let i = 0; i <= 96; i++) { const h = i / 4; pts.push([h, sunAlt(s, h)]); }
  const hi = Math.max(...pts.map(p => p[1])), lo = Math.min(...pts.map(p => p[1]));
  const okTimes = order.every(k => Number.isFinite(tm[k]) && tm[k] >= 0 && tm[k] <= 24) && order.every((k, i) => !i || tm[k] > tm[order[i - 1]]);
  const polar = hi < -0.833 || lo > -0.833 || !okTimes || (tm.isha - tm.maghrib) > 8;
  const sched = `${t("sunrise")} ${clock(tm.sunrise)}, ${t("sunset")} ${clock(tm.maghrib)}. ${PRAYERS.map(k => `${pn(k)} ${clock(tm[k])}`).join(", ")}`;
  if (polar) return `<p class="viz-polar note" role="note">${t("viz_polar")}</p>`;
  const W = 300, X0 = 8, X1 = 292, Y0 = 34, Y1 = 124, top = Math.max(hi, 20), bot = Math.min(lo, -20);
  const x = h => X0 + (X1 - X0) * h / 24, y = a => Y0 + (Y1 - Y0) * (top - a) / (top - bot), yH = y(0);
  const path = pts.map((p, i) => (i ? "L" : "M") + x(p[0]).toFixed(1) + " " + y(p[1]).toFixed(1)).join("");
  // Prayer labels: one row, in time order, each placed as close as possible to its own time (assets/dayviz.js);
  // a leader line joins the label to its dot when the label had to move.
  const fs = bn() ? 11.5 : 10.5, wants = PRAYERS.map(k => ({ k, x: x(tm[k]), w: DV.textW(pn(k), fs) }));
  const lx = DV.layoutLabels(wants, X0, X1, 4), lab = wants.map((o, i) => ({ k: o.k, cx: o.x, lx: lx[i] }));
  const nowX = x(s.nowH), nowA = sunAlt(s, s.nowH);
  const LY = 16;
  const marks = lab.map(o => { const cy = y(sunAlt(s, tm[o.k])); return `<g class="pr${(s.ps && s.ps.cur && s.ps.cur.k === o.k && s.ps.cur.D === s.d0) ? " cur" : ""}" data-k="${o.k}"><path class="lead" d="M${o.lx.toFixed(1)} ${LY + 4}L${o.lx.toFixed(1)} ${LY + 9}L${o.cx.toFixed(1)} ${Y0 - 2}L${o.cx.toFixed(1)} ${(cy - 4).toFixed(1)}"/><circle cx="${o.cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="3.6"/><text x="${o.lx.toFixed(1)}" y="${LY}" text-anchor="middle">${esc(pn(o.k))}</text></g>`; }).join("");
  const evs = [["sunrise", tm.sunrise], ["sunset", tm.maghrib]].map(([k, h]) => ({ k, x: x(h), w: DV.textW(t(k), fs - 1) })), elx = DV.layoutLabels(evs, X0, X1, 6);
  const ev = evs.map((o, i) => `<g class="evm" data-k="${o.k}"><path d="M${o.x.toFixed(1)} ${(yH - 4).toFixed(1)}l4 4l-4 4l-4 -4z"/><text x="${elx[i].toFixed(1)}" y="${(Y1 + 13).toFixed(1)}" text-anchor="middle">${esc(t(o.k))}</text></g>`).join("");
  const ticks = [6, 12, 18].map(h => `<line class="tl" x1="${x(h).toFixed(1)}" x2="${x(h).toFixed(1)}" y1="${Y1}" y2="${Y1 + 3}"/><text class="tk" x="${x(h).toFixed(1)}" y="${(Y1 + 27).toFixed(1)}" text-anchor="middle">${clock(h)}</text>`).join("");
  return `<figure class="dayviz">
    <svg viewBox="0 0 ${W} ${Y1 + 32}" role="img" aria-labelledby="viz-cap">
      <rect class="sky-day" x="${X0}" y="${Y0}" width="${X1 - X0}" height="${(yH - Y0).toFixed(1)}" rx="6"/>
      <rect class="sky-night" x="${X0}" y="${yH.toFixed(1)}" width="${X1 - X0}" height="${(Y1 - yH).toFixed(1)}" rx="6"/>
      <line class="horizon" x1="${X0}" x2="${X1}" y1="${yH.toFixed(1)}" y2="${yH.toFixed(1)}"/>
      <path class="sunpath" d="${path}" pathLength="100"/>
      ${ev}${marks}
      <line class="now" x1="${nowX.toFixed(1)}" x2="${nowX.toFixed(1)}" y1="${Y0}" y2="${Y1}"/>
      <circle class="sun${nowA < -0.833 ? " below" : ""}" cx="${nowX.toFixed(1)}" cy="${y(nowA).toFixed(1)}" r="5.5"/>
      ${ticks}
    </svg>
    <figcaption id="viz-cap" class="sr">${esc(t("viz_cap"))} ${esc(sched)}. ${esc(t("viz_now"))} ${clock(s.nowH)}.</figcaption>
    <p class="viz-key note" aria-hidden="true"><span><i class="k-pr"></i>${t("viz_k_pr")}</span><span><i class="k-ev"></i>${t("viz_k_ev")}</span><span><i class="k-sun"></i>${t("viz_k_sun")}</span></p>
  </figure>`;
}
/* The Hijri day begins at maghrib, so after maghrib the Today page and menus show the next Hijri date. */
function hijriNow(s) { return hijri(new Date(s.now + (s.now >= s.d0.abs("maghrib") ? 864e5 : 0))); }
let votdPick = null;
const COUNTS = QM.meta.map(m => m[3]);
/* Verse for today: whole ayah (never truncated) in Arabic and the selected translation. */
function votdBody(e) {
  // e: one entry of the 180-day schedule (assets/votd.js). The texts come from the Qur'an data files for its verses.
  const i = e.s, ks = []; for (let k = e.a; k <= e.b; k++) ks.push(k);
  const th = VOTD.themeOf(e), range = e.b > e.a ? `${num(e.a)}–${num(e.b)}` : num(e.a);
  const head = e.day != null ? `<p class="votd-day">${t(e.day === 5 ? "vd_fri" : "vd_thu")} · ${esc(th[st.lang])}</p><p class="note votd-daynote">${t("vd_daynote")}</p>`
    : `<p class="votd-day">${t("vd_day").replace("{n}", num(e.seq)).replace("{t}", num(VOTD.CYCLE))} · ${esc(th[st.lang])}</p>`;
  const ref = `<span class="verse-ref">${esc(sname(i))} · ${num(i)}:${range}</span>`;
  const foot = `<div class="verse-foot">${ref}<button type="button" class="btn soft" data-act="surah" data-s="${i}" data-a="${e.a}">${t("readsurah")}</button></div>`;
  if (!qReady(i)) {
    if (qFailed(i)) return `${head}<p class="note">${t("fail")}</p><div><button type="button" class="btn" data-act="retry">${t("retry")}</button></div>${foot}`;
    qEnsure(i).catch(() => {}).then(() => { if (R.tab === "today" && !R.sub) render(false); });
    return `${head}<p class="note" aria-busy="true">${t("loading")}</p>${foot}`;
  }
  const tr = QS[st.lang + ":" + i], ar = QS["ar:" + i], many = ks.length > 1;
  const arN = k => String(k).replace(/\d/g, d => "٠١٢٣٤٥٦٧٨٩"[d]);
  const arText = ks.map(k => ar[k - 1] + (many ? ` <span class="ayah-n">﴿${arN(k)}﴾</span>` : "")).join(" ");
  // Face 7.1: in English the Verse for today uses the Rowwad Translation Center's plain modern English (QuranEnc,
  // assets/en-rwwad.js), shown exactly as published with its own footnotes; the reader keeps Pickthall.
  const RW = window.IE_RWWAD, rw = !bn() && RW && ks.every(k => RW.get(i, k)) ? ks.map(k => RW.get(i, k)) : null;
  const fnSup = x => esc(x).replace(/\[(\d+)\]/g, '<sup class="rw-fn">[$1]</sup>');
  const trText = rw ? rw.map(([x], j) => (many ? `<sup class="vn">${num(ks[j])}</sup>` : "") + fnSup(x)).join(" ")
    : ks.map(k => (many ? `<sup class="vn">${num(k)}</sup>` : "") + esc(tr.t[k - 1])).join(" ");
  const rwNotes = rw ? rw.map(([, f], j) => f ? (many ? `<b>${num(i)}:${num(ks[j])}</b><br>` : "") + esc(f).replace(/\n\s*/g, "<br>") : "").filter(Boolean) : [];
  // Short tafsir: the publisher sometimes explains a group of verses together, so identical texts are shown once.
  const tfs = []; if (bn() && QS["bnt:" + i]) ks.forEach(k => { const x = QS["bnt:" + i][k - 1]; if (x && !tfs.includes(x)) tfs.push(x); });
  const fns = tr.f ? ks.map(k => tr.f[k - 1] ? (many ? `<b>${num(i)}:${num(k)}</b><br>` : "") + richText(tr.f[k - 1]) : "").filter(Boolean) : [];
  return `${head}
    <p class="ar verse-ar" lang="ar" dir="rtl">${arText}</p>
    <p class="verse-tr" lang="${st.lang}">${trText}</p>
    ${rw ? `<p class="note rw-src">${t("rw_src").replace("{v}", esc(RW.META.version))}</p>${rwNotes.length ? `<details class="fn rw-notes"><summary>${t("rw_notes")}</summary><div lang="en">${rwNotes.join("<br><br>")}</div></details>` : ""}` : glossLine(ks.map(k => tr.t[k - 1]).join(" "))}
    ${tfs.length ? `<aside class="tafsir" lang="bn" aria-label="${esc(t("tafsir"))}"><p class="tf-h"><b>${t("tafsir")}</b> <span>${t("tf_label")}</span></p>${tfs.map(x => `<p>${esc(FIX.repair(x))}</p>`).join("")}</aside>` : ""}
    ${votdExpl(e, many)}
    ${e.ctx ? `<p class="votd-ctx"><b>${t("vd_ctx")}</b> ${esc(e.ctx[st.lang]).replace(/ﷺ/g, '<span class="saw" lang="ar">ﷺ</span>')}</p>` : ""}
    ${fns.length ? `<details class="fn"><summary>${t("footnotes")}</summary><div lang="bn">${fns.join("<br><br>")}</div></details>` : ""}
    ${shActs("verse", `${i}:${e.a}-${e.b}`, `${sname(i)} ${num(i)}:${range}`)}
    ${foot}`;
}
/* English explanation (Phase 5.2): Al-Mukhtasar, English edition, from assets/votd-en.js, shown unchanged under its
   own heading so it is never mistaken for the translation. Long explanations open in place with "Read more". */
let vxOpen = null;
function votdExpl(e, many) {
  if (bn() || !VE) return "";
  const ex = VE.forPassage(e.s, e.a, e.b); if (!ex.length) return "";
  const open = vxOpen === e.id, fl = VE.flagsFor(e.s, e.a, e.b);
  const vr = v => v.length > 1 ? `${e.s}:${v[0]}–${v[v.length - 1]}` : `${e.s}:${v[0]}`;
  return `<aside class="tafsir en-ex clamp${open ? " open" : ""}" lang="en" aria-labelledby="vx-h">
    <p class="tf-h" id="vx-h"><b>${t("vd_expl")}</b> <span>${t("vd_expl_label")}</span></p>
    <div class="clamp-body" id="vx-body">${ex.map(x => `<p>${many || x.verses.length > 1 ? `<b class="ex-v">${vr(x.verses)}</b> ` : ""}${esc(x.text)}</p>`).join("")}</div>
    <button type="button" class="linkish clamp-more" data-act="vxmore" data-id="${e.id}" aria-expanded="${open}" aria-controls="vx-body">${t(open ? "readless" : "readmore")}</button>
    ${fl.map(f => `<p class="ex-flag" role="note"><b>${t("vd_flag")}</b> ${esc(sp(f.en))}</p>`).join("")}
    <p class="ex-src">${t("vd_expl_src")}</p>
  </aside>`;
}
/* Generic "Read more": a .clamp box shows a preview of its .clamp-body; when the content (nearly) fits, it is shown whole
   and the button is hidden. Used by the verse explanation and the Hadith cards. Re-run after any change. */
function fitClamps() {
  document.querySelectorAll(".clamp").forEach(c => {
    if (c.classList.contains("open")) return;
    c.classList.remove("fits");
    const b = c.querySelector(".clamp-body");
    if (b && b.scrollHeight <= b.clientHeight + 48) c.classList.add("fits");
  });
}
function toggleClamp(b, open) {
  const c = b.closest(".clamp"); c.classList.toggle("open", open);
  b.setAttribute("aria-expanded", open); b.textContent = t(open ? "readless" : "readmore");
  if (!open) { fitClamps(); const r = c.getBoundingClientRect(); if (r.top < 0) c.scrollIntoView({ block: "start", behavior: reduce ? "auto" : "smooth" }); }
}
/* Moon disc of radius R centred on 0,0 with the lit part for the Hijri day (same geometry as moonSvg). */
function moonPhase(day, lat, R) {
  const p = Math.min(0.999, Math.max(0, (day - 1) / 29.53)), k = Math.cos(2 * Math.PI * p), rx = (R * Math.abs(k)).toFixed(2), wax = p < 0.5, gib = k < 0;
  const d = wax ? `M0 ${-R}A${R} ${R} 0 0 1 0 ${R}A${rx} ${R} 0 0 ${gib ? 1 : 0} 0 ${-R}Z` : `M0 ${-R}A${R} ${R} 0 0 0 0 ${R}A${rx} ${R} 0 0 ${gib ? 0 : 1} 0 ${-R}Z`;
  return `<circle class="mn-dark" r="${R}"/><path class="mn-lit" d="${d}"${lat < 0 ? ' transform="scale(-1 1)"' : ""}/>`;
}
/* Moon drawn for the Hijri day; the lit side is mirrored for the southern hemisphere. */
function moonSvg(day, lat) {
  const R = 26, c = 32, p = Math.min(0.999, Math.max(0, (day - 1) / 29.53)), k = Math.cos(2 * Math.PI * p);
  const rx = (R * Math.abs(k)).toFixed(2), wax = p < 0.5, gib = k < 0;
  const d = wax ? `M${c} ${c - R}A${R} ${R} 0 0 1 ${c} ${c + R}A${rx} ${R} 0 0 ${gib ? 1 : 0} ${c} ${c - R}Z`
                : `M${c} ${c - R}A${R} ${R} 0 0 0 ${c} ${c + R}A${rx} ${R} 0 0 ${gib ? 0 : 1} ${c} ${c - R}Z`;
  return `<svg class="hc-moon" viewBox="0 0 64 64" aria-hidden="true"><circle class="mn-glow" cx="${c}" cy="${c}" r="31"/><circle class="mn-dark" cx="${c}" cy="${c}" r="${R}"/><path class="mn-lit" d="${d}"${lat < 0 ? ` transform="matrix(-1 0 0 1 ${2 * c} 0)"` : ""}/></svg>`;
}
let justTicked = null;
function animateArc(f) {
  const p = $("arcpath"), o = $("orb"), tr = $("trail"); if (!p || !p.getTotalLength) return;
  const Ln = p.getTotalLength();
  const gl = $("glow");
  const mg = $("moonG");
  const setP = x => { const pt = p.getPointAtLength(Ln * x); o.setAttribute("cx", pt.x.toFixed(1)); o.setAttribute("cy", pt.y.toFixed(1)); if (mg) mg.setAttribute("transform", `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)})`); if (gl) { gl.setAttribute("cx", pt.x.toFixed(1)); gl.setAttribute("cy", pt.y.toFixed(1)); } tr.setAttribute("stroke-dasharray", `${(x * 100).toFixed(2)} 100`); };
  if (reduce || !heroAnim) { setP(f); return; }
  const t0 = performance.now(), D = 1500;
  const step = now => { const k = Math.min(1, (now - t0) / D), e = 1 - Math.pow(1 - k, 3); setP(f * e); if (k < 1) requestAnimationFrame(step); };
  requestAnimationFrame(step);
}
setInterval(() => {
  if (R.tab !== "today" || !snap || document.hidden) return;
  const now = Date.now();
  const ps = snap.ps, cur = ps && ps.cur;
  if (now >= snap.next.at || (ps && now >= ps.next.at) || (cur && now >= cur.end) || zoneParts(snap.c.zone, new Date(now)).minute !== snap.p.minute) { render(false); return; }
  const c = $("count-next"); if (c && ps) c.textContent = countdown(ps.next.at - now);
}, 1000);
document.addEventListener("visibilitychange", () => { if (!document.hidden && R.tab === "today") render(false); });

/* ---------------- QURAN ---------------- */
let qQuery = "", qFilter = "all";
/* Qur'an text and translations live in data/quran/{ar,en,bn}/NNN.json and are fetched per surah on demand
   (the service worker keeps every fetched surah for offline use). Nothing is fetched from outside this site. */
const QS = {}, QP = {}, QERR = {};
const qpad = i => String(i).padStart(3, "0");
function qLoad(lang, i) {
  const k = lang + ":" + i;
  if (QS[k]) return Promise.resolve(QS[k]);
  if (QP[k]) return QP[k];
  delete QERR[k];
  return (QP[k] = fetch(`data/quran/${lang}/${qpad(i)}.json`).then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(j => (QS[k] = lang === "bn" ? j : lang === "en" ? { t: j, f: null } : j))
    .catch(e => { QERR[k] = true; throw e; })
    .finally(() => { delete QP[k]; }));
}
/* In Bangla the short tafsir (data/quran/bnt) is loaded too; if it fails, the verse still shows without it. */
const qReady = i => QS["ar:" + i] && QS[st.lang + ":" + i] && (!bn() || QS["bnt:" + i] || QERR["bnt:" + i]);
const qFailed = i => QERR["ar:" + i] || QERR[st.lang + ":" + i];
const qEnsure = i => Promise.all([qLoad("ar", i), qLoad(st.lang, i), bn() ? qLoad("bnt", i).catch(() => null) : null]);
/* Short explanation of one ayah, shown apart from the translation and labelled as not being the Qur'an text.
   The text is shown as published; FIX.repair only restores old font-encoding characters (see assets/bnfix.js). */
const tafsir = (i, k) => {
  const x = bn() && QS["bnt:" + i] && QS["bnt:" + i][k];
  return x ? `<aside class="tafsir" lang="bn" aria-label="${esc(t("tafsir"))} ${num(i)}:${num(k + 1)}"><p class="tf-h"><b>${t("tafsir")}</b> <span>${t("tf_label")}</span></p><p>${esc(FIX.repair(x))}</p></aside>` : "";
};
/* Bangla footnotes are published with <b> only; everything is escaped, then <b> is restored. */
const richText = s => esc(s || "").replace(/&lt;(\/?)b&gt;/g, "<$1b>").replace(/\n{2,}/g, "<br><br>").replace(/\n/g, "<br>");
const trCredit = () => bn() ? "অনুবাদ: ড. আবু বকর মুহাম্মাদ যাকারিয়া, সংস্করণ ১.১.১, QuranEnc.com" : "Translation: Marmaduke Pickthall (1930), public domain; text via Tanzil";
const sname = i => bn() ? QM.meta[i - 1][2] : QM.meta[i - 1][1];
function listRows() {
  const q = qQuery.trim().toLowerCase(), out = [];
  QM.meta.forEach((m, ix) => {
    const i = ix + 1;
    if (qFilter === "read" && !st.read.includes(i)) return;
    if (q && !(m[1].toLowerCase().includes(q) || m[2].includes(qQuery.trim()) || String(i) === q || num(i) === qQuery.trim() || m[0].includes(qQuery.trim()))) return;
    out.push(`<li><button type="button" class="rowlink" data-act="surah" data-s="${i}"${R.surah === i ? ' aria-current="true"' : ""}><span class="no"><span>${num(i)}</span></span><span class="nm">${esc(sname(i))}<small>${num(m[3])} ${t("verses")} · ${t(m[4])}${st.read.includes(i) ? ` · <span class="done">✓ ${t("readmark")}</span>` : ""}</small></span><span class="an" lang="ar">${m[0]}</span></button></li>`);
  });
  return out.join("") || `<li class="note" style="padding:16px 0">${t("none")}</li>`;
}
function ring(val, max) {
  const C = 2 * Math.PI * 26, frac = max ? val / max : 0;
  post.push(() => { const r = $("ringfg"); if (r) requestAnimationFrame(() => r.setAttribute("stroke-dashoffset", (C * (1 - frac)).toFixed(2))); });
  return `<svg class="ring" viewBox="0 0 64 64" aria-hidden="true"><circle class="bg" cx="32" cy="32" r="26" fill="none" stroke-width="6"/><circle id="ringfg" class="fg" cx="32" cy="32" r="26" fill="none" stroke-width="6" stroke-linecap="round" transform="rotate(-90 32 32)" stroke-dasharray="${C.toFixed(2)}" stroke-dashoffset="${(reduce ? C * (1 - frac) : C).toFixed(2)}"/><text x="32" y="36.5" text-anchor="middle">${num(Math.round(frac * 100))}%</text></svg>`;
}
function vQuran() {
  const last = st.last && st.last.s ? st.last : null;
  const bms = st.bm.slice(-6).reverse();
  return `
  <div class="page-head">${desk() ? "" : back(t("study_nav"))}<h2>${t("allsurahs")}</h2></div>
  ${desk() ? `<button type="button" class="btn ghost sm st-backlib" data-act="go" data-tab="quran">${ic("back")} ${t("st_lib")}</button>` : ""}
  <section class="card pad row">${ring(st.read.length, 114)}<div class="grow"><b>${bn() ? `${num(114)}টির মধ্যে ${num(st.read.length)}টি সূরা পড়া হয়েছে` : `${st.read.length} of 114 surahs read`}</b><p class="note">${t("khatmnote")}</p></div></section>
  ${!NATIVE && offlineStale() ? `<p class="note card pad" role="note">${t("q_resave")} <button type="button" class="linkish" data-act="go" data-tab="more" data-sub="settings">${t("settings")}</button></p>` : ""}
  ${last ? `<button type="button" class="card pad row" style="text-align:left;width:100%" data-act="surah" data-s="${last.s}" data-a="${last.a}"><span class="grow"><span class="eyebrow">${t("cont")}</span><br><b>${esc(sname(last.s))}</b> <span class="note">${num(last.s)}:${num(last.a)}</span></span>${ic("chev", "chev")}</button>` : ""}
  ${bms.length ? `<section><p class="eyebrow" style="margin-bottom:8px">${t("bookmarks")}</p><div class="chips">${bms.map(b => { const [s1, a1] = b.split(":"); return `<button type="button" class="chip" data-act="surah" data-s="${s1}" data-a="${a1}">${esc(sname(+s1))} ${num(s1)}:${num(a1)}</button>`; }).join("")}</div></section>` : ""}
  <div class="search">${ic("search")}<input id="q-search" class="field" type="search" inputmode="search" autocomplete="off" placeholder="${esc(t("search"))}" aria-label="${esc(t("search"))}" value="${esc(qQuery)}"></div>
  <div class="chips">${[["all", t("all")], ["read", t("readmark")]].map(([k, l]) => `<button type="button" class="chip" data-act="qf" data-k="${k}" aria-pressed="${qFilter === k}">${l}</button>`).join("")}</div>
  <ul id="surah-list">${listRows()}</ul>`;
}
let obs = null;
function vReader() {
  const i = R.surah, m = QM.meta[i - 1], tl = TL[i] && TL[i][st.lang], isRead = st.read.includes(i);
  let body;
  if (!qReady(i) && qFailed(i)) body = `<p class="note">${t("fail")}</p><div><button type="button" class="btn" data-act="retry">${t("retry")}</button></div>`;
  else if (!qReady(i)) { body = `<p class="note">${t("loading")}</p>`; qEnsure(i).catch(() => {}).then(() => { if (R.tab === "quran" && R.surah === i) render(false); }); }
  else {
    const ar = QS["ar:" + i], tr = QS[st.lang + ":" + i];
    body = (i !== 1 && i !== 9 ? `<p class="ar bismillah" lang="ar">${QM.starter[1][0]}</p>` : "") +
      `<ol>${ar.map((a, k) => { const id = i + ":" + (k + 1), on = st.bm.includes(id), fn = tr.f && tr.f[k]; return `<li class="ayah" id="a-${k + 1}" data-a="${k + 1}"><div class="ayah-bar"><span class="n">${num(i)}:${num(k + 1)}</span><button type="button" class="mini" data-act="bm" data-id="${id}" aria-pressed="${on}" aria-label="${esc(t("bookmark"))} ${num(i)}:${num(k + 1)}">${ic("bm")}</button><button type="button" class="mini" data-act="copyayah" data-k="${k}" aria-label="${esc(t("copy"))} ${num(i)}:${num(k + 1)}">${ic("copy")}</button></div><p class="ar" lang="ar">${a}</p>${st.tl && tl ? `<p class="tl">${esc(tl[k])}</p>` : ""}<p class="tr" lang="${st.lang}">${esc(tr.t[k])}</p>${st.gloss ? glossLine(tr.t[k]) : ""}${tafsir(i, k)}${fn ? `<details class="fn"><summary>${t("footnotes")}</summary><div lang="bn">${richText(fn)}</div></details>` : ""}</li>`; }).join("")}</ol>
      <p class="note credit">${esc(trCredit())}${bn() && QS["bnt:" + i] ? " · " + esc(t("tf_credit")) : ""} · <button type="button" class="linkish" data-act="go" data-tab="more" data-sub="about">${t("sources")}</button></p>
      <div class="row" style="gap:10px;padding-block:8px 4px"><button type="button" class="btn grow${isRead ? " soft" : ""}" data-act="markread">${isRead ? "✓ " + t("readmark") : t("markread")}</button>${i < 114 ? `<button type="button" class="btn ghost" data-act="surah" data-s="${i + 1}">${t("next2")} ${ic("chev")}</button>` : ""}</div>`;
    post.push(() => {
      if (R.ayah) { const el = $("a-" + R.ayah); if (el) { if (R.keepOff != null) { const a = R.ayah; holdPos(() => $("a-" + a), R.keepOff); } else { el.scrollIntoView({ block: "start", behavior: reduce ? "auto" : "smooth" }); el.classList.add("mark"); } } R.ayah = 0; R.keepOff = null; }
      if ("IntersectionObserver" in window) {
        if (obs) obs.disconnect();
        obs = new IntersectionObserver(es => { for (const e of es) if (e.isIntersecting) { st.last = { s: i, a: +e.target.dataset.a }; save(); } }, { rootMargin: "-35% 0px -60% 0px" });
        document.querySelectorAll(".ayah").forEach(el => obs.observe(el));
      }
    });
  }
  return `
  <div class="reader-head">${desk() ? "" : back(t("allsurahs"))}<div class="grow"><b>${esc(sname(i))}</b> <span class="an" lang="ar" style="font-family:var(--arabic);color:var(--accent)">${m[0]}</span><br><small class="note">${num(m[3])} ${t("verses")} · ${t(m[4])}</small></div><button type="button" class="icon-btn" data-act="aa" aria-label="${esc(t("textsettings"))}">${ic("aa")}</button></div>
  ${body}`;
}
function aaSheet() {
  openSheet(`<h3>${t("textsettings")}</h3><ul class="set" style="margin-top:6px">
    <li><span class="lb">${t("arsize")}<small>${t("arsizeh")}</small></span><input id="ar-size" type="range" min="0.8" max="1.6" step="0.1" value="${st.ar}" aria-label="${esc(t("arsize"))}"></li>
    <li><span class="lb">${t("showtl")}<small>${t("showtlh")}</small></span><button type="button" class="switch" role="switch" data-act="tl" aria-checked="${st.tl}" aria-label="${esc(t("showtl"))}"></button></li>
    <li><span class="lb">${t("gl_set")}<small>${t("gl_seth")}</small></span><button type="button" class="switch" role="switch" data-act="gloss" aria-checked="${st.gloss}" aria-label="${esc(t("gl_set"))}"></button></li></ul>
    <p class="ar" lang="ar" style="margin-top:8px">${QM.starter[112][0]}</p>`);
}

/* ---------------- QUR'AN STUDY (Face 7) ----------------
   A curated learning collection (assets/study.js): Juz 'Amma and eight other widely studied surahs. The notes are
   draft editorial study aids, labelled as such; the Qur'an text itself is read in the full reader, which keeps the
   existing progress (st.read), last position (st.last) and bookmarks (st.bm) unchanged. */
let stQuery = "", stGroup = "all", stTheme = "all";
const stName = n => sname(n);
const stThemeName = id => { const x = SD.THEMES.find(z => z[0] === id); return x ? (bn() ? x[2] : x[1]) : id; };
const stList = () => { const q = stQuery.trim().toLowerCase(), qa = stQuery.trim(); return SD.SURAHS.filter(x => (stGroup === "all" || x.group === stGroup) && (stTheme === "all" || x.themes.includes(stTheme)) &&
  (!q || [QM.meta[x.n - 1][1], QM.meta[x.n - 1][2], x.meaning, String(x.n), num(x.n)].join(" ").toLowerCase().includes(q) || QM.meta[x.n - 1][0].includes(qa))); };
function studyRows(sel) {
  const l = stList();
  return l.length ? l.map(x => { const m = QM.meta[x.n - 1]; return `<li><button type="button" class="rowlink" data-act="study" data-s="${x.n}"${sel === x.n ? ' aria-current="true"' : ""}><span class="no"><span>${num(x.n)}</span></span><span class="nm">${esc(stName(x.n))}<small>${num(m[3])} ${t("verses")} · ${t(m[4])}${st.read.includes(x.n) ? ` · <span class="done">✓ ${t("readmark")}</span>` : ""}</small>${window.IE_STUDY_NOTES && IE_STUDY_NOTES.get(x.n) ? `<small class="st-short">${esc(IE_STUDY_NOTES.get(x.n).short[st.lang] || IE_STUDY_NOTES.get(x.n).short.en)}</small>` : ""}<small class="st-th">${x.themes.map(stThemeName).map(esc).join(" · ")}</small></span><span class="an" lang="ar">${m[0]}</span></button></li>`; }).join("")
    : `<li class="note" style="padding:16px 0">${t("none")}</li>`;
}
function studyList(sel) {
  const last = st.last && st.last.s ? st.last : null, bms = st.bm.slice(-6).reverse();
  const g = [["all", t("all") + " (" + num(SD.SURAHS.length) + ")"]].concat(SD.GROUPS.map(x => [x[0], (bn() ? x[2] : x[1]) + " (" + num(SD.SURAHS.filter(s => s.group === x[0]).length) + ")"]));
  return `<div class="page-head"><h2>${t("study_nav")}</h2></div>
  ${quranSwitch("study")}
  <section class="card pad st-intro"><p><b>${t("st_title")}</b></p><p class="note">${t("st_intro")}</p><p class="note st-draft" role="note">${t("st_draft")}</p></section>
  <div class="st-actions">
    ${last ? `<button type="button" class="card pad row st-cont" data-act="surah" data-s="${last.s}" data-a="${last.a}"><span class="grow"><span class="eyebrow">${t("cont")}</span><br><b>${esc(sname(last.s))}</b> <span class="note">${num(last.s)}:${num(last.a)}</span></span>${ic("chev", "chev")}</button>` : ""}
    <button type="button" class="btn ghost st-all" data-act="go" data-tab="quran" data-sub="all">${ic("quran")} ${t("st_all")}</button>
  </div>
  ${bms.length ? `<section><p class="eyebrow" style="margin-bottom:8px">${t("bookmarks")}</p><div class="chips">${bms.map(b => { const [s1, a1] = b.split(":"); return `<button type="button" class="chip" data-act="surah" data-s="${s1}" data-a="${a1}">${esc(sname(+s1))} ${num(s1)}:${num(a1)}</button>`; }).join("")}</div></section>` : ""}
  <div class="search">${ic("search")}<input id="st-search" class="field" type="search" inputmode="search" autocomplete="off" placeholder="${esc(t("st_search"))}" aria-label="${esc(t("st_search"))}" aria-controls="study-list" value="${esc(stQuery)}"></div>
  <div class="chips" role="group" aria-label="${esc(t("st_coll"))}">${g.map(([k, l]) => `<button type="button" class="chip" data-act="stg" data-k="${k}" aria-pressed="${stGroup === k}">${esc(l)}</button>`).join("")}</div>
  <div class="chips st-themes" role="group" aria-label="${esc(t("st_themes"))}">${[["all", t("st_anytheme")]].concat(SD.THEMES.map(x => [x[0], bn() ? x[2] : x[1]])).map(([k, l]) => `<button type="button" class="chip" data-act="stt" data-k="${k}" aria-pressed="${stTheme === k}">${esc(l)}</button>`).join("")}</div>
  <p class="note" id="study-count" aria-live="polite">${t("st_count").replace("{n}", num(stList().length))}</p>
  <ul id="study-list">${studyRows(sel)}</ul>`;
}
function refreshStudy() {
  document.querySelectorAll('[data-act="stg"]').forEach(x => x.setAttribute("aria-pressed", x.dataset.k === stGroup));
  document.querySelectorAll('[data-act="stt"]').forEach(x => x.setAttribute("aria-pressed", x.dataset.k === stTheme));
  const l = $("study-list"); if (l) l.innerHTML = studyRows(R.study || (desk() ? stDeskSel() : 0));
  const c = $("study-count"); if (c) c.textContent = t("st_count").replace("{n}", num(stList().length));
}
/* ---------------- Qur'an Stories (Face 7.1) ----------------
   A separate section next to Qur'an study (assets/stories.js). Every part of a story is labelled by source type, Qur'an
   references open the reader, hadith references link to sunnah.com with their grading, and each story says what the
   sources do not tell us. All of it is a draft awaiting qualified review, and says so. */
let sgGroup = "all", sgQuery = "";
const quranSwitch = cur => `<div class="seg q-switch" role="group" aria-label="${esc(t("q_switch"))}">${[["study", t("study_nav"), "quran", ""], ["stories", t("stories_nav"), "quran", "stories"]].map(([k, l, tab, sub]) => `<button type="button" data-act="go" data-tab="${tab}"${sub ? ` data-sub="${sub}"` : ""} aria-pressed="${cur === k}">${l}</button>`).join("")}</div>`;
const srcLabel = k => `<span class="sk sk-${k}">${t("sk_" + k)}</span>`;
function storyList() {
  if (!ST) return "";
  const L2 = o => o[st.lang] || o.en, q = sgQuery.trim().toLowerCase();
  const l = ST.STORIES.filter(x => (sgGroup === "all" || x.group === sgGroup) && (!q || (x.title.en + " " + x.title.bn + " " + x.short.en + " " + x.short.bn).toLowerCase().includes(q)));
  return l.length ? l.map(x => `<li><button type="button" class="card sg-card" data-act="story" data-k="${x.id}"><span class="sg-kinds">${[...new Set(x.parts.map(p => p.kind))].map(srcLabel).join("")}</span><b class="sg-t">${escS(L2(x.title))}</b><span class="sg-s">${escS(L2(x.short))}</span><span class="sg-go">${t("sg_read")} ${ic("chev", "chev")}</span></button></li>`).join("")
    : `<li class="note" style="padding:16px 0">${t("none")}</li>`;
}
function refreshStories() { const el = $("sg-list"); if (el) el.innerHTML = storyList(); document.querySelectorAll('[data-act="sgrp"]').forEach(b => b.setAttribute("aria-pressed", b.dataset.k === sgGroup)); const c = $("sg-count"); if (c) c.textContent = t("sg_count").replace("{n}", num(document.querySelectorAll("#sg-list .sg-card").length)); }
function vStories() {
  if (!ST) return `<p class="note">${t("none")}</p>`;
  const g = [["all", t("all") + " (" + num(ST.STORIES.length) + ")"]].concat(ST.GROUPS.map(x => [x[0], (bn() ? x[2] : x[1]) + " (" + num(ST.STORIES.filter(s => s.group === x[0]).length) + ")"]));
  post.push(() => refreshStories());
  return `<div class="page-head"><h2>${t("stories_nav")}</h2></div>
  ${quranSwitch("stories")}
  <section class="card pad st-intro"><p><b>${t("sg_title")}</b></p><p class="note">${sawS(t("sg_intro"))}</p>
    <ul class="sg-legend">${[["quran", "sg_lq"], ["hadith", "sg_lh"], ["tafsir", "sg_lt"]].map(([k, l]) => `<li>${srcLabel(k)} <span>${t(l)}</span></li>`).join("")}</ul>
    <p class="note st-draft" role="note">${t("sg_draft")}</p></section>
  <div class="sg-tools"><div class="search">${ic("search")}<input id="sg-search" class="field" type="search" inputmode="search" autocomplete="off" placeholder="${esc(t("sg_search"))}" aria-label="${esc(t("sg_search"))}" aria-controls="sg-list" value="${esc(sgQuery)}"></div>
  <div class="chips sg-chips" role="group" aria-label="${esc(t("st_coll"))}">${g.map(([k, l]) => `<button type="button" class="chip" data-act="sgrp" data-k="${k}" aria-pressed="${sgGroup === k}">${escS(l)}</button>`).join("")}</div>
  <p class="note" id="sg-count" aria-live="polite"></p></div>
  <ul class="sg-list" id="sg-list">${storyList()}</ul>`;
}
function vStory() {
  const x = ST && ST.get(R.story); if (!x) return vStories();
  const L2 = o => o[st.lang] || o.en;
  const qref = r => { const m = String(r).match(/^(\d+):(\d+)/); return m ? `<button type="button" class="st-ref" data-act="surah" data-s="${m[1]}" data-a="${m[2]}" aria-label="${esc(t("st_open").replace("{r}", r))}">${esc(num(r))}</button>` : esc(r); };
  const hl = x.hadith || [];
  const href = r => { const h = hl.find(z => z.label === r); return h ? `<a class="st-ref" href="${h.url}" target="_blank" rel="noopener noreferrer">${esc(h.label)}</a> <span class="note sg-grade">${t("sg_grade")}: ${esc(h.grade)}</span>` : esc(r); };
  return `<div class="page-head">${back()}<h2>${escS(L2(x.title))}</h2></div>
  <article class="card pad sg-detail" aria-labelledby="sg-h">
    <h3 class="sr" id="sg-h">${escS(L2(x.title))}</h3>
    <p class="sg-lead">${escS(L2(x.short))}</p>
    ${shActs("story", x.id, L2(x.title))}
    <p class="st-draft" role="note">${t("sg_draftnote")}</p>
    ${x.story && x.story.en && x.story.en[0] ? `<section class="sg-story" aria-labelledby="sg-st-h"><h3 class="sg-sec" id="sg-st-h">${t("sg_story")}</h3><p class="note">${t("sg_story_n")} <button type="button" class="linkish" data-act="sgjump">${t("sg_jump")}</button></p>
      <div class="sg-prose">${(x.story[st.lang] && x.story[st.lang][0] ? x.story[st.lang] : x.story.en).map(p => `<p>${escS(p)}</p>`).join("")}</div></section>` : ""}
    <section class="sg-refsec" aria-labelledby="sg-ref-h"><h3 class="sg-sec" id="sg-ref-h" tabindex="-1">${t("sg_refs")}</h3><p class="note">${t("sg_refs_n")}</p>
    ${x.parts.map(p => `<section class="sg-part sg-${p.kind}"><p class="sg-ph">${srcLabel(p.kind)} <span class="sg-refs">${p.refs.map(p.kind === "hadith" ? href : qref).join(" ")}</span></p><p>${escS(L2(p.text))}</p></section>`).join("")}
    <section class="sg-unknown"><h4 class="st-sub">${t("sg_unknown")}</h4><p>${escS(L2(x.unknown))}</p></section></section>
    <section><h4 class="st-sub">${t("sg_why")}</h4><p>${escS(L2(x.why))}</p><p class="note">${t("sg_why_n")}</p></section>
    <section class="st-example"><h4 class="st-sub">${t("sg_ex")}</h4><p class="st-exlab">${t("sg_ex_n")}</p><p>${escS(L2(x.example))}</p></section>
    <details class="fn st-src"><summary>${t("st_src")}</summary><div><p>${t("sg_src1")}</p><p>${t("st_src3")}</p><p>${t("st_src4")}</p></div></details>
  </article>`;
}

function studyDetail(n) {
  const x = SD.SURAHS.find(z => z.n === n); if (!x) return `<p class="note">${t("none")}</p>`;
  const m = QM.meta[n - 1], L2 = o => o[st.lang] || o.en, isRead = st.read.includes(n), bmc = st.bm.filter(b => +b.split(":")[0] === n).length;
  const N = window.IE_STUDY_NOTES ? window.IE_STUDY_NOTES.get(n) : null;
  // Verse references open the full reader at that verse; they are links to the text, never the text itself.
  const refBtn = r => { const mm = String(r).match(/^(\d+):(\d+)/); return mm ? `<button type="button" class="st-ref" data-act="surah" data-s="${mm[1]}" data-a="${mm[2]}" aria-label="${esc(t("st_open").replace("{r}", r))}">${esc(num(r))}</button>` : esc(r); };
  const srcTag = k => `<span class="st-srctag st-src-${k}">${t(k === "t" ? "st_src_t" : "st_src_q")}</span>`;
  return `<article class="card pad st-detail" aria-labelledby="st-h-${n}">
    <header class="st-head"><span class="st-no" aria-hidden="true">${num(n)}</span><div class="grow"><h3 id="st-h-${n}" class="st-name" tabindex="-1">${esc(stName(n))} <span class="an" lang="ar">${m[0]}</span></h3>
      <p class="note">${st.lang === "en" ? `“${esc(x.meaning)}” · ` : ""}${t("surah")} ${num(n)} · ${num(m[3])} ${t("verses")} · <span class="badge st-type">${t(x.type)}</span>${isRead ? ` · <span class="done">✓ ${t("readmark")}</span>` : ""}</p></div></header>
    <p class="st-draft" role="note">${t("st_draftnote")}</p>
    <section><h4 class="st-sub">${t("st_ov")}</h4><p>${escS(L2(N ? N.ov : x.ov))}</p>
      <ul class="st-chips" aria-label="${esc(t("st_learn"))}">${x.themes.map(k => `<li>${esc(stThemeName(k))}</li>`).join("")}</ul></section>
    ${N ? `<section><h4 class="st-sub">${t("st_flow")}</h4><p class="note">${t("st_flow_n")}</p>
      <ol class="st-flow">${N.flow.map(([a, b2, d]) => `<li>${refBtn(a === b2 ? `${n}:${a}` : `${n}:${a}–${b2}`)}<span>${escS(L2(d))}</span></li>`).join("")}</ol></section>
    <section><h4 class="st-sub">${t("st_concepts")}</h4><dl class="st-concepts">${N.concepts.map(c => `<div><dt>${escS(L2(c.term))}</dt><dd>${escS(L2(c.text))}<span class="st-cmeta">${srcTag(c.src)} ${String(c.ref).split(/[;,]\s*/).map(refBtn).join(" ")}</span></dd></div>`).join("")}</dl></section>
    <section><h4 class="st-sub">${t("st_take")}</h4><ul class="st-learn">${L2(N.take).map(z => `<li>${esc(z)}</li>`).join("")}</ul></section>
    <section class="st-example" aria-labelledby="st-ex-${n}"><h4 class="st-sub" id="st-ex-${n}">${t("st_ex")}</h4><p class="st-exlab">${t("st_ex_n")}</p><p>${escS(L2(N.example))}</p></section>` : ""}
    <section class="st-reflect"><h4 class="st-sub">${t("st_reflect")}</h4><p>${escS(L2(x.reflect))}</p><p class="note">${t("st_reflect_n")}</p></section>
    <section><h4 class="st-sub">${t("st_ctx")}</h4><p class="note">${esc(SD.context(x, st.lang))}</p></section>
    <div class="st-go"><button type="button" class="btn" data-act="surah" data-s="${n}" data-a="0">${t("st_read")}</button>${bmc ? `<span class="note">${t("st_bms").replace("{n}", num(bmc))}</span>` : ""}</div>
    <details class="fn st-src"><summary>${t("st_src")}</summary><div>
      <p>${t("st_src1")} <a href="${SD.SOURCE.classification.url}" target="_blank" rel="noopener noreferrer">Tanzil Quran Metadata 1.0</a> (<a href="https://creativecommons.org/licenses/by/3.0/" target="_blank" rel="noopener noreferrer">CC BY 3.0</a>).</p>
      <p>${t("st_src2")}</p>
      <p>${t("st_src3")}</p>
      <p>${t("st_src4")}</p>
    </div></details>
  </article>`;
}
function vStudy() { return studyList(0); }
function vStudyDetail() {
  return `<div class="page-head">${back(t("st_lib"))}<h2>${esc(stName(R.study))}</h2></div>${studyDetail(R.study)}`;
}
const stDeskSel = () => R.study || (st.last && SD.SURAHS.some(z => z.n === st.last.s) ? st.last.s : 1);
function vStudyDesk() {
  const n = stDeskSel();
  return `<div class="split"><aside class="pane-list" id="pane-list" aria-label="${esc(t("study_nav"))}">${studyList(n)}</aside><section class="pane-read" id="read-pane">${studyDetail(n)}</section></div>`;
}
function openStudyDesk(n) {
  R = Object.assign({}, R, { study: n });
  try { history.pushState(R, ""); depth++; } catch (e) {}
  const p = $("read-pane"); if (!p) { render(false); return; }
  p.innerHTML = studyDetail(n);
  if (!reduce) { p.classList.remove("enter-pane"); void p.offsetWidth; p.classList.add("enter-pane"); }
  document.querySelectorAll("#study-list .rowlink").forEach(b => { if (+b.dataset.s === n) b.setAttribute("aria-current", "true"); else b.removeAttribute("aria-current"); });
  const h = $("st-h-" + n); if (h) h.focus({ preventScroll: true });
  const top = p.getBoundingClientRect().top + scrollY - 90; if (scrollY > top) scrollTo({ top: Math.max(0, top), behavior: reduce ? "auto" : "smooth" });
}

/* ---------------- DUAS ---------------- */
let dQuery = "", dCat = "all";
/* Dua cards show an equal-height preview. A dua that does not fit gets a "Read more" button that opens the
   whole card in place (no inner scrolling). Which duas are open is kept while the list is filtered. */
const dOpen = new Set();
function duaList() {
  const q = dQuery.trim().toLowerCase();
  // Core remembrance (Face 7) is listed first; each dua keeps its position in DUAS, which is what favourites store.
  const list = DUAS.map((d, i) => [d, i]).filter(([d, i]) => (dCat === "all" || (dCat === "fav" ? st.fav.includes(i) : d.c === dCat)) &&
    (!q || [d.te, d.tb, d.en, d.bn, d.tl, d.bt].join(" ").toLowerCase().includes(q))).sort((x, y) => (y[0].c === "core") - (x[0].c === "core"));
  if (!list.length) return `<p class="note">${dCat === "fav" ? t("nofav") : t("none")}</p>`;
  return list.map(([d, i]) => { const fav = st.fav.includes(i); const open = dOpen.has(i); return `<article class="card dua${open ? " open" : ""}" data-i="${i}"><div class="dua-head"><h3>${esc(bn() ? d.tb : d.te)}${d.k ? `<span class="badge dk dk-${d.k}">${t(d.k === "quran" ? "dk_quran" : "dk_decl")}</span>` : ""}</h3><button type="button" class="mini" data-act="fav" data-i="${i}" aria-pressed="${fav}" aria-label="${esc(t("save"))}">${ic("heart")}</button><button type="button" class="mini" data-act="copydua" data-i="${i}" aria-label="${esc(t("sh_copyof").replace("{t}", bn() ? d.tb : d.te))}">${ic("copy")}</button><button type="button" class="mini" data-act="share" data-k="dua" data-key="${i}" aria-haspopup="dialog" aria-label="${esc(t("sh_shareof").replace("{t}", bn() ? d.tb : d.te))}">${ic("share")}</button></div><div class="dua-body" id="dua-b-${i}"><p class="ar" lang="ar">${d.ar}</p>${st.tl ? `<p class="tl">${esc(bn() ? d.bt : d.tl)}</p>` : ""}<p>${esc(bn() ? d.bn : d.en)}</p></div><button type="button" class="linkish dua-more" data-act="duamore" data-i="${i}" aria-expanded="${open}" aria-controls="dua-b-${i}">${t(open ? "readless" : "readmore")}</button><p class="ref">${esc(bn() ? d.rb : d.re)}</p>${duaExtra(d)}</article>`; }).join("");
}
/* Face 7 core remembrance: a short sourced note, links to the sources, and (for a Qur'an verse) the way to read it in
   the reader with the translator's notes; marked as not yet reviewed by a qualified scholar. */
const duaExtra = d => !d.k ? "" : `<div class="dua-x">${d.fe && !bn() ? `<details class="fn rw-notes"><summary>${t("rw_notes")}</summary><div lang="en">${esc(d.fe).replace(/\n\s*/g, "<br>")}</div></details>` : ""}${d.ne ? `<p class="note">${esc(bn() ? d.nb : d.ne)}</p>` : ""}<p class="note">${(d.links || []).map(([e, b2, u]) => `<a href="${u}" target="_blank" rel="noopener noreferrer">${esc(bn() ? b2 : e)}</a>`).join(" · ")}${d.read ? ` · <button type="button" class="linkish" data-act="surah" data-s="${d.read[0]}" data-a="${d.read[1]}">${t("dk_read")}</button>` : ""}</p><p class="note dua-rev">${t("dk_review")}</p></div>`;
/* Marks cards whose content (nearly) fits the preview, so they show in full with no "Read more" button. Re-run after any change. */
function fitDuas() {
  document.querySelectorAll("#dua-list .dua").forEach(c => {
    if (c.classList.contains("open")) return;
    c.classList.remove("fits");
    const b = c.querySelector(".dua-body");
    // A dua that is only a couple of lines longer than the preview is shown whole rather than hidden behind a button.
    if (b && b.scrollHeight <= b.clientHeight + 64) c.classList.add("fits");
  });
}
function vDuas() {
  post.push(fitDuas);
  return `
  <div class="page-head"><h2>${t("duas")}</h2></div>
  <div class="search">${ic("search")}<input id="d-search" class="field" type="search" autocomplete="off" placeholder="${esc(t("dsearch"))}" aria-label="${esc(t("dsearch"))}" value="${esc(dQuery)}"></div>
  <div class="chips">${[["all", t("all")], ["fav", "♥ " + t("saved")]].concat(DUA_CATS.map(c => [c[0], bn() ? c[2] : c[1]])).map(([k, l]) => `<button type="button" class="chip" data-act="dcat" data-k="${k}" aria-pressed="${dCat === k}">${esc(l)}</button>`).join("")}</div>
  <div id="dua-list" style="display:grid;gap:12px">${duaList()}</div>`;
}

/* ---------------- HADITH (Phase 5) ----------------
   Each narration is one record in assets/hadith.js with the categories it belongs to; filtering never copies it.
   The Arabic, translation, attribution and grade are shown exactly as HadeethEnc.com publishes them. */
let hCat = "all";
/* Hadith cards share one shell with the Dua cards: a preview of the Arabic and translation, opened in place with
   "Read more" (the whole text is always in the page; nothing is cut). Which cards are open survives filtering
   and language switching. */
const hOpen = new Set();
const hRef = x => `${HCOLL[x.c][st.lang]} ${num(x.label || x.n)}`;
/* Bangla translations quote some Arabic phrases inline; mark those runs as Arabic so they render right to left. */
const arRuns = s => esc(s).replace(/([؀-ۿ][؀-ۿً-ٰٟ\s،؛:\-]*[؀-ۿً-ٰٟ])/g, '<span class="ar-in" lang="ar" dir="rtl">$1</span>');
function hadithList() {
  const list = HD.HADITH.filter(h => hCat === "all" || h.cats.includes(hCat));
  return list.map(h => {
    const tr = h[st.lang], refs = h.refs.filter(x => x.wording !== "similar"), sim = h.refs.filter(x => x.wording === "similar");
    const open = hOpen.has(h.id), cats = h.cats.map(c => HD.CATEGORIES.find(x => x[0] === c)).filter(Boolean);
    return `<article class="card hadith" id="hd-${h.id}" aria-labelledby="hd-h-${h.id}">
      <div class="hd-head"><h3 id="hd-h-${h.id}" class="hd-title">${esc(hRef(refs[0] || h.refs[0]))}</h3><span class="hd-cat">${cats.map(c => esc(bn() ? c[2] : c[1])).join(" · ")}</span></div>
      <div class="hd-main clamp${open ? " open" : ""}">
        <div class="clamp-body" id="hd-b-${h.id}">
          <p class="ar hd-ar" lang="ar" dir="rtl">${esc(h.ar).replace(/\n/g, "<br>")}</p>
          <p class="hd-tr" lang="${st.lang}">${(bn() ? arRuns(tr) : esc(tr)).replace(/\n/g, "<br>")}</p>
        </div>
        <button type="button" class="linkish clamp-more" data-act="hdmore" data-id="${h.id}" aria-expanded="${open}" aria-controls="hd-b-${h.id}">${t(open ? "readless" : "readmore")}</button>
      </div>
      <p class="hd-ref">${refs.map(x => `<a href="${x.url}" target="_blank" rel="noopener noreferrer">${esc(hRef(x))}</a>`).join(" · ")} <span class="badge cur">${esc(h.grade.he[st.lang])}</span></p>
      ${shActs("hadith", h.id, hRef(refs[0] || h.refs[0]))}
      <details class="fn"><summary>${t("hd_src")}</summary><div>
        <p><b>${t("hd_narr")}:</b> ${esc(h.narrator[st.lang])}</p>
        <p><b>${t("hd_grade")}:</b> ${esc(h.grade.collection[st.lang])}. HadeethEnc: ${esc(h.attribution[st.lang])}, ${esc(h.grade.he[st.lang])}</p>
        ${sim.length ? `<p><b>${t("hd_similar")}:</b> ${sim.map(x => `<a href="${x.url}" target="_blank" rel="noopener noreferrer">${esc(hRef(x))}</a>`).join(", ")}</p>` : ""}
        ${h.note ? `<p class="hd-note"><b>${t("hd_note")}:</b> ${esc(h.note[st.lang])}</p>` : ""}
        <p><b>${t("hd_trans")}:</b> <a href="${h.source[st.lang]}" target="_blank" rel="noopener noreferrer">HadeethEnc.com</a> (${t("hd_expl")})</p>
      </div></details>
    </article>`;
  }).join("") || `<p class="note">${t("none")}</p>`;
}
/* An-Nawawi's Forty (Phase 5.3): a separate collection in assets/nawawi.js, numbered 1–42 as an-Nawawi numbered it.
   Numbers 15 and 36 are the same HadeethEnc entries as two general records, so their text is read from there. */
const unPUA = s => String(s).replace(/[\uE000-\uF8FF]/g, ""); // a private-use glyph in one HadeethEnc text; removed on display only
function nwRec(r) {
  if (!r.shared) return r;
  const g = HD.HADITH.find(h => h.id === r.shared);
  return Object.assign({}, r, { ar: g.ar, en: g.en, bn: g.bn, attribution: g.attribution, grade: g.grade.he, source: g.source });
}
const nwProg = () => t("nw_prog").replace("{k}", num(st.nwread.length)).replace("{n}", num(NW_N));
function nawawiList() {
  return NW.HADITH.map(r0 => {
    const r = nwRec(r0), n = r.n, id = "nw" + n, tr = r[st.lang], open = hOpen.has(id), done = st.nwread.includes(n);
    return `<article class="card hadith nw" id="nw-${n}" aria-labelledby="nw-h-${n}">
      <div class="hd-head"><span class="nw-no" aria-hidden="true">${num(n)}</span><h3 id="nw-h-${n}" class="hd-title" tabindex="-1">${esc(t("nw_no").replace("{n}", num(n)).replace("{t}", num(NW_N)))}</h3>
        <span class="nw-gr ${r.cls}">${t(r.cls === "hasan" ? "nw_hasan" : "nw_sahih")}</span>${r.flag ? `<span class="nw-flag">${t("nw_flag")}</span>` : ""}</div>
      <div class="hd-main clamp${open ? " open" : ""}">
        <div class="clamp-body" id="hd-b-${id}">
          <p class="ar hd-ar" lang="ar" dir="rtl">${esc(unPUA(r.ar)).replace(/\n/g, "<br>")}</p>
          <p class="hd-tr" lang="${st.lang}">${(bn() ? arRuns(tr) : esc(tr)).replace(/\n/g, "<br>")}</p>
        </div>
        <button type="button" class="linkish clamp-more" data-act="hdmore" data-id="${id}" aria-expanded="${open}" aria-controls="hd-b-${id}">${t(open ? "readless" : "readmore")}</button>
      </div>
      <p class="hd-ref"><a href="${r.link}" target="_blank" rel="noopener noreferrer">${esc(hRef({ c: "nawawi40", n: String(n) }))}</a>${r.refs.length ? " · " + r.refs.map(x => `<a href="${x.url}" target="_blank" rel="noopener noreferrer">${esc(hRef(x))}</a>`).join(" · ") : ""} <span class="badge cur">${esc(r.grade[st.lang])}</span></p>
      ${r.note ? `<p class="hd-note nw-note">${esc(r.note[st.lang])}</p>` : ""}
      ${shActs("nawawi", n, t("nw_no").replace("{n}", num(n)).replace("{t}", num(NW_N)))}
      <details class="fn"><summary>${t("hd_src")}</summary><div>
        <p><b>${t("nw_takhrij")}:</b> ${esc(r.attribution[st.lang])}</p>
        <p><b>${t("hd_grade")}:</b> HadeethEnc: ${esc(r.grade[st.lang])}${r.refs.filter(x => x.grade).map(x => ` · ${esc(hRef(x))}: ${esc(x.grade)} (sunnah.com)`).join("")}</p>
        ${r.flag ? `<p class="nw-flagtext">${esc(NW.FLAGS[r.flag][st.lang])}</p>` : ""}
        <p><b>${t("nw_refs")}:</b> ${r.refs.length ? r.refs.map(x => `<a href="${x.url}" target="_blank" rel="noopener noreferrer">${esc(hRef(x))}</a>`).join(", ") : t("nw_refs_none")}</p>
        ${r.also.length || r.shared ? `<p><b>${t("nw_also")}:</b> ${[r.shared].concat(r.also).filter(Boolean).map(x => `<button type="button" class="linkish" data-act="hgo" data-id="${x}">${esc(hRef(HD.HADITH.find(h => h.id === x).refs[0]))}</button>`).join(", ")}</p>` : ""}
        <p><b>${t("hd_trans")}:</b> <a href="${r.source[st.lang]}" target="_blank" rel="noopener noreferrer">HadeethEnc.com</a> (${t("hd_expl")})</p>
      </div></details>
      <div class="nw-foot"><button type="button" class="btn ghost sm nw-mark${done ? " soft" : ""}" data-act="nwread" data-n="${n}" aria-pressed="${done}">${done ? "✓ " + t("nw_done") : t("nw_mark")}</button>
        <span class="nw-nav">${n > 1 ? `<button type="button" class="linkish" data-act="nwgo" data-n="${n - 1}" aria-label="${esc(t("nw_no").replace("{n}", num(n - 1)).replace("{t}", num(NW_N)))}">← ${num(n - 1)}</button>` : ""}${n < NW_N ? `<button type="button" class="linkish" data-act="nwgo" data-n="${n + 1}" aria-label="${esc(t("nw_no").replace("{n}", num(n + 1)).replace("{t}", num(NW_N)))}">${num(n + 1)} →</button>` : ""}</span></div>
    </article>`;
  }).join("");
}
function vHadith() {
  const nw = NW && st.hcol === "nawawi";
  const sel = `<div class="seg hd-col" role="group" aria-label="${esc(t("hc_label"))}">${[["general", t("hc_gen").replace("{n}", num(HD.HADITH.length))], ["nawawi", t("hc_nw").replace("{n}", num(NW_N))]].filter(([k]) => k === "general" || NW).map(([k, l]) => `<button type="button" data-act="hcol" data-k="${k}" aria-pressed="${st.hcol === k}">${esc(l)}</button>`).join("")}</div>`;
  if (nw) return `<div class="page-head">${back()}<h2>${t("hadith")}</h2></div>
  ${sel}
  <section class="card pad hd-intro nw-intro"><h3 class="sec-title">${t("nw_title")}</h3><p>${t("nw_intro")}</p>
    <div class="nw-prog"><span id="nw-prog" aria-live="polite">${nwProg()}</span><span class="bar" aria-hidden="true"><i id="nw-bar" style="width:${(st.nwread.length / NW_N * 100).toFixed(1)}%"></i></span></div>
    <nav class="nw-jump" aria-label="${esc(t("nw_jump"))}">${NW.HADITH.map(r => `<button type="button" data-act="nwgo" data-n="${r.n}" class="${st.nwread.includes(r.n) ? "done" : ""}${r.flag ? " fl" : ""}" aria-label="${esc(t("nw_no").replace("{n}", num(r.n)).replace("{t}", num(NW_N)))}${st.nwread.includes(r.n) ? ", " + esc(t("nw_done")) : ""}">${num(r.n)}</button>`).join("")}</nav>
    <p class="note">${t("nw_review")}</p></section>
  <div id="hadith-list" class="hd-list">${nawawiList()}</div>`;
  const counts = Object.fromEntries(HD.CATEGORIES.map(c => [c[0], HD.HADITH.filter(h => h.cats.includes(c[0])).length]));
  return `<div class="page-head">${back()}<h2>${t("hadith")}</h2></div>
  ${NW ? sel : ""}
  <section class="card pad hd-intro"><p>${t("hd_intro")}</p><p class="note">${t("hd_review")}</p></section>
  <div class="chips hd-cats" role="group" aria-label="${esc(t("hd_cats"))}">${[["all", t("all") + " (" + num(HD.HADITH.length) + ")"]].concat(HD.CATEGORIES.map(c => [c[0], (bn() ? c[2] : c[1]) + " (" + num(counts[c[0]]) + ")"])).map(([k, l]) => `<button type="button" class="chip" data-act="hcat" data-k="${k}" aria-pressed="${hCat === k}">${esc(l)}</button>`).join("")}</div>
  <div id="hadith-list" class="hd-list">${hadithList()}</div>`;
}
function nwGo(n) {
  const el = $("nw-" + n); if (!el) return;
  scrollTo({ top: Math.max(0, el.getBoundingClientRect().top + scrollY - 84), behavior: reduce ? "auto" : "smooth" });
  const h = $("nw-h-" + n); if (h) h.focus({ preventScroll: true });
}

/* ---------------- MORE + sub pages ---------------- */
function vMore() {
  const s = snap || snapshot(), hj = hijriNow(s);
  const items = [["guide", "guide", t("guide_s")], ["hadith", "hadith", t("hadith_s")], ["names", "names", t("names_s")], ["calendar", "calendar", hText(hj)], ["settings", "gear", t("settings_s")], ["about", "info", t("about_s")], ["feedback", "mail", t("feedback_s")], ["privacy", "lock", t("privacy_s")], ["terms", "doc", t("terms_s")]];
  return `<div class="page-head"><h2>${t("more")}</h2></div>${installCard()}
  <ul class="card menu">${items.map(([k, icn, sub]) => `<li><button type="button" data-act="go" data-tab="more" data-sub="${k}"><span class="ic">${ic(icn)}</span><span class="grow"><b>${t(k === "names" ? "names99" : k)}</b><small>${esc(sub)}</small></span>${ic("chev", "chev")}</button></li>`).join("")}</ul>`;
}
/* Install as an app (Oct 2026). Chrome/Edge/Samsung Internet: our own button opens the browser's install dialog.
   iPhone/iPad Safari has no install API, so it gets the two-step instruction instead. Hidden once installed. */
let installEvt = null;
const standalone = () => { try { return matchMedia("(display-mode: standalone)").matches || navigator.standalone === true; } catch (e) { return false; } };
const iosLike = () => /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
addEventListener("beforeinstallprompt", e => { e.preventDefault(); installEvt = e; if (R.tab === "more" && !R.sub) render(false); });
addEventListener("appinstalled", () => { installEvt = null; toast(t("inst_done")); if (R.tab === "more" && !R.sub) render(false); });
function installCard() {
  if (NATIVE || standalone() || !phone()) return ""; // phones only
  const ios = !installEvt && iosLike();
  if (!installEvt && !ios) return "";
  return `<section class="card pad install"><img src="icons/icon-192.png" alt="" width="44" height="44"><span class="grow"><b>${t("inst_t")}</b><small>${t(ios ? "inst_ios" : "inst_s")}</small></span>${ios ? "" : `<button type="button" class="btn" data-act="install">${t("inst_btn")}</button>`}</section>`;
}
let nQuery = "";
const nameMatch = (x, q) => !q || [x.tl, x.bt, x.en, x.bn, x.ar, x.id, String(x.n), num(x.n)].concat(skel(x.ar)).join(" ").toLowerCase().includes(q);
const skel = s => String(s).replace(/[ً-ٰٟـ]/g, "").replace(/[آأإٱ]/g, "ا");
function namesList() {
  const q = skel(nQuery.trim().toLowerCase());
  const l = NAMES.map((x, i) => [x, i]).filter(([x]) => nameMatch(x, q));
  $("names-count") && ($("names-count").textContent = countText(l.length));
  return l.length ? l.map(([x, i]) => `<button type="button" class="card name" data-act="name" data-i="${i}" aria-haspopup="dialog" aria-label="${esc(`${num(x.n)}. ${bn() ? x.bt : x.tl}: ${bn() ? x.bn : x.en}`)}"><span class="i">${num(x.n)}</span><span class="ar" lang="ar">${x.ar}</span><b>${esc(bn() ? x.bt : x.tl)}</b><small>${esc(bn() ? x.bn : x.en)}</small>${x.status === "none" ? `<span class="pill muted">${t("noexpl")}</span>` : ""}</button>`).join("") : `<p class="note">${t("none")}</p>`;
}
const countText = k => bn() ? `${num(99)}টির মধ্যে ${num(k)}টি নাম` : `${k} of 99 names`;
function vNames() {
  return `<div class="page-head">${back()}<h2>${t("names99")}</h2></div>
  <div class="search">${ic("search")}<input id="n-search" class="field" type="search" autocomplete="off" placeholder="${esc(t("nsearch"))}" aria-label="${esc(t("nsearch"))}" aria-controls="names-list" value="${esc(nQuery)}"></div>
  <p class="note" id="names-count" aria-live="polite">${countText(NAMES.filter(x => nameMatch(x, skel(nQuery.trim().toLowerCase()))).length)}</p>
  <div class="names" id="names-list">${namesList()}</div>
  <section class="card pad"><h3 class="sec-title">${t("aboutlist")}</h3><p style="margin-top:6px">${esc(L(NM.meta.collection.note))}</p><p style="margin-top:8px">${esc(L(NM.meta.reviewText))}</p>${citeList(NM.meta.collection.note.src.concat(NM.meta.collection.hadith).concat(NM.meta.collection.quran.map(x => "quran:" + x.ref)))}</section>`;
}
/* A citation id is "work:locator". Returns {label, url, title}. */
function cite(id) {
  const k = id.indexOf(":"), w = k < 0 ? id : id.slice(0, k), loc = k < 0 ? "" : id.slice(k + 1), W = NM.works[w];
  if (!W) return { label: id, url: "", title: id };
  const [s1, a1] = loc.split(":");
  const url = W.url.replace("{s}", s1).replace("{a}", a1).replace("{n}", loc);
  const short = { quran: bn() ? "কুরআন" : "Qur'an", saadi: bn() ? "তাফসিরে সাদি" : "Tafsir al-Sa'di", ibnkathir: bn() ? "তাফসিরে ইবনে কাসির" : "Tafsir Ibn Kathir", bukhari: bn() ? "বুখারি" : "al-Bukhari", muslim: bn() ? "মুসলিম" : "Muslim", tirmidhi: bn() ? "তিরমিযি" : "at-Tirmidhi", abudawud: bn() ? "আবু দাউদ" : "Abu Dawud", ibnmajah: bn() ? "ইবনে মাজাহ" : "Ibn Majah", jamil2021: "Wan Jamil et al. 2021" }[w] || w;
  return { label: short + (loc ? " " + num(loc) : ""), url, title: W.title };
}
function citeList(ids) {
  const u = [...new Set(ids)];
  return u.length ? `<ol class="cites">${u.map(id => { const c = cite(id), h = NM.hadith[id]; return `<li><a href="${esc(c.url)}" target="_blank" rel="noopener noreferrer">${esc(c.label)} ${ic("ext", "ext")}<span class="sr"> (${t("opensnew")})</span></a><small>${esc(c.title)}${h ? ` · ${esc(L(h))}${h.grade ? ` <i>(${esc(h.grade)})</i>` : ""}` : ""}</small></li>`; }).join("")}</ol>` : "";
}
function nameSheet(i, opener) {
  const x = NAMES[i]; if (!x) return;
  const form = f => ({ name: t("f_name"), verb: t("f_verb"), related: t("f_related") }[f]);
  const ev = x.quran.map(v => { const [s1, a1] = v.ref.split(":").map(Number), tr = QS[st.lang + ":" + s1], arr = QS["ar:" + s1];
    return `<li><div class="ev-head"><button type="button" class="linkish" data-act="surah" data-s="${s1}" data-a="${a1}">${esc(sname(s1))} ${num(s1)}:${num(a1)}</button><span class="pill">${form(v.form)}</span></div>
      ${arr ? `<p class="ar" lang="ar" dir="rtl">${arr[a1 - 1]}</p>` : `<p class="ar" lang="ar" dir="rtl">${esc(v.match)} …</p>`}
      ${tr ? `<p class="tr" lang="${st.lang}">${esc(tr.t[a1 - 1])}</p>` : `<p class="note">${t("loading")}</p>`}</li>`; }).join("");
  const missing = [...new Set(x.quran.map(v => +v.ref.split(":")[0]))].filter(s1 => !(QS["ar:" + s1] && QS[st.lang + ":" + s1]));
  if (missing.length) Promise.all(missing.map(s1 => qEnsure(s1).catch(() => {}))).then(() => { if ($("sheet").classList.contains("on") && $("sheet").dataset.name === x.id) nameSheet(i); });
  const had = x.hadith.map(id => { const c = cite(id), h = NM.hadith[id]; return `<li><a href="${esc(c.url)}" target="_blank" rel="noopener noreferrer">${esc(c.label)} ${ic("ext", "ext")}<span class="sr"> (${t("opensnew")})</span></a>${h ? `<p>${esc(L(h))} <small class="note">(${esc(h.grade)})</small></p>` : ""}</li>`; }).join("");
  const allSrc = x.quran.map(v => "quran:" + v.ref).concat(x.hadith, x.expl.src, x.note ? x.note.src : []);
  openSheet(`<div class="name-sheet" lang="${st.lang}">
    <p class="eyebrow">${t("names99")} · ${num(x.n)}</p>
    <h3 class="ns-title">${esc(bn() ? x.bt : x.tl)}</h3>
    <p class="ar ns-ar" lang="ar" dir="rtl">${x.ar}</p>
    <dl class="ns-mean"><div><dt>English</dt><dd lang="en">${esc(x.en)}</dd></div><div><dt>বাংলা</dt><dd lang="bn">${esc(x.bn)}</dd></div></dl>
    ${shActs("name", i, bn() ? x.bt : x.tl)}
    <section aria-labelledby="ns-ev"><h4 id="ns-ev">${t("evidence")}</h4>
      ${ev ? `<ul class="ev">${ev}</ul>` : ""}${had ? `<ul class="ev had">${had}</ul>` : ""}${!ev && !had ? `<p class="note">${t("noevidence")}</p>` : ""}</section>
    <section aria-labelledby="ns-ex"><h4 id="ns-ex">${t(x.status === "commentary" ? "explanation" : "explanation2")}</h4><p>${esc(L(x.expl))}</p>
      <p class="ns-status note"><span>${t("basedon")}: ${x.expl.src.map(id => { const c = cite(id); return `<a href="${esc(c.url)}" target="_blank" rel="noopener noreferrer">${esc(c.label)}</a>`; }).join("; ")}.</span> <span>${t("rv_" + x.status)}</span></p></section>
    ${x.note ? `<section aria-labelledby="ns-nt"><h4 id="ns-nt">${t("scholarnote")}</h4><p>${esc(L(x.note))}</p></section>` : ""}
    <section class="refl" aria-labelledby="ns-rf"><h4 id="ns-rf">${t("reflection")}</h4><p class="note">${t("reflectionh")}</p><p>${esc(L(x.refl))}</p></section>
    ${(() => { const ns = window.IE_NAME_STORIES && IE_NAME_STORIES.get(x.id); if (!ns) return ""; const ps = (ns[st.lang] && ns[st.lang].length ? ns[st.lang] : ns.en);
      return `<section class="ns-story" aria-labelledby="ns-sy"><h4 id="ns-sy">${t("ns_story")}</h4><p class="note">${t("ns_story_n")}</p><div class="ns-prose">${ps.map(p => `<p>${esc(p)}</p>`).join("")}</div></section>`; })()}
    <section aria-labelledby="ns-src"><h4 id="ns-src">${t("sources")}</h4>${citeList(allSrc)}</section>
    <div class="row ns-nav"><button type="button" class="btn ghost" data-act="name" data-i="${(i + 98) % 99}">${ic("back")} ${t("prevname")}</button><button type="button" class="btn ghost" data-act="name" data-i="${(i + 1) % 99}">${t("nextname")} ${ic("chev")}</button></div>
  </div>`, opener);
  $("sheet").dataset.name = x.id;
}

/* ---------------- Copy & share (Face 7.3) ----------------
   Duas, the 99 Names, hadith (both collections) and Qur'an Stories can be copied and shared. Copy puts the Arabic (where there is
   Arabic), the meaning in the reader's language and the reference on the clipboard. Share offers a website link, and an image (JPG)
   for a dua or a Name, or a PDF (the browser's print window) for a hadith or a story. Images and PDFs are made on the device. */
// Links point at the website this page was opened from; the installed app (or a page opened from a file) has no web address, so it offers no link.
const SITE = !NATIVE && /^https?:$/.test(location.protocol) ? location.href.split("#")[0] : "";
const shUrl = h => SITE ? SITE + "#" + h : "";
const L3 = o => o ? (o[st.lang] || o.en || "") : "";
function shItem(kind, key) {
  if (kind === "dua") { const d = DUAS[+key]; if (!d) return null;
    return { kind, title: bn() ? d.tb : d.te, ar: d.ar, tl: bn() ? d.bt : d.tl, body: [bn() ? d.bn : d.en], ref: bn() ? d.rb : d.re, hash: "dua/" + (+key), img: true }; }
  if (kind === "name") { const x = NAMES[+key]; if (!x) return null;
    return { kind, title: `${num(x.n)}. ${bn() ? x.bt : x.tl}`, ar: x.ar, mean: bn() ? x.bn : x.en, body: [L(x.expl)], ref: t("basedon") + ": " + x.expl.src.map(id => cite(id).label).join("; "), hash: "name/" + x.n, img: true }; }
  if (kind === "hadith") { const h = HD.HADITH.find(z => z.id === key); if (!h) return null; const refs = h.refs.filter(x => x.wording !== "similar");
    return { kind, title: hRef(refs[0] || h.refs[0]), ar: h.ar, body: [h[st.lang]], ref: (refs.length ? refs : h.refs).map(hRef).join(" · ") + " · " + h.grade.he[st.lang], hash: "hadith/" + h.id, pdf: true }; }
  if (kind === "nawawi") { const r0 = NW && NW.HADITH.find(z => z.n === +key); if (!r0) return null; const r = nwRec(r0);
    return { kind, title: t("nw_title") + " · " + t("nw_no").replace("{n}", num(r.n)).replace("{t}", num(NW_N)), ar: unPUA(r.ar), body: [r[st.lang]], ref: [hRef({ c: "nawawi40", n: String(r.n) })].concat(r.refs.map(hRef)).join(" · ") + " · " + r.grade[st.lang], hash: "nawawi/" + r.n, pdf: true }; }
  if (kind === "verse") { const m = String(key).match(/^(\d+):(\d+)-(\d+)$/); if (!m) return null; const i = +m[1], a = +m[2], b2 = +m[3];
    if (!qReady(i)) return null; const ks = []; for (let k = a; k <= b2; k++) ks.push(k); const many = ks.length > 1;
    const RW = window.IE_RWWAD, rw = !bn() && RW && ks.every(k => RW.get(i, k)), tr = QS[st.lang + ":" + i], ar = QS["ar:" + i];
    const arN = k => String(k).replace(/\d/g, d => "٠١٢٣٤٥٦٧٨٩"[d]);
    const trTxt = ks.map(k => (many ? `(${num(k)}) ` : "") + (rw ? RW.get(i, k)[0] : tr.t[k - 1]).replace(/\s*\[[\d০-৯]+\]/g, "").replace(/ {2,}/g, " ")).join(" ");
    let ex = [], exH = "";
    if (bn()) { if (QS["bnt:" + i]) ks.forEach(k => { const z = QS["bnt:" + i][k - 1]; if (z && !ex.includes(z)) ex.push(z); }); ex = ex.map(z => FIX.repair(z)); exH = t("tafsir") + " · " + t("tf_label"); }
    else if (VE) { ex = VE.forPassage(i, a, b2).map(z => z.text); exH = t("vd_expl") + " · " + t("vd_expl_label"); }
    const where = `${sname(i)} ${num(i)}:${many ? num(a) + "–" + num(b2) : num(a)}`;
    return { kind, title: t("votd") + " · " + where, ar: ks.map(k => ar[k - 1] + (many ? ` ﴿${arN(k)}﴾` : "")).join(" "), body: [trTxt],
      ref: where + " · " + t(bn() ? "sh_tr_bn" : rw ? "sh_tr_rw" : "sh_tr_pk"), extra: ex.length ? exH + "\n" + ex.join("\n\n") : "", hash: `verse/${i}:${a}-${b2}`, img: true }; }
  if (kind === "story") { const x = ST && ST.get(key); if (!x) return null;
    const sp = x.story && x.story.en ? (x.story[st.lang] && x.story[st.lang][0] ? x.story[st.lang] : x.story.en) : [];
    const hl = x.hadith || [], plab = p => (p.kind === "hadith" ? p.refs.map(r => { const h = hl.find(z => z.label === r); return h ? `${h.label} (${t("sg_grade")}: ${h.grade})` : r; }) : p.refs.map(r => (bn() ? "কুরআন " : "Qur'an ") + num(r))).join(", ");
    return { kind, title: L3(x.title), lead: L3(x.short), body: sp, parts: x.parts.map(p => ({ h: t("sk_" + p.kind) + " · " + plab(p), p: L3(p.text) })), unknown: L3(x.unknown),
      ref: t("sg_refs") + ": " + x.parts.map(plab).join("; "), hash: "story/" + x.id, pdf: true }; }
  return null;
}
function shText(o) {
  const out = [o.title];
  if (o.ar) out.push("", o.ar);
  if (o.tl) out.push(o.tl);
  if (o.mean) out.push(o.mean);
  if (o.lead) out.push("", o.lead);
  if (o.body.length) out.push("", o.body.join("\n\n"));
  if (o.ref) out.push("", "— " + o.ref);
  if (o.extra) out.push("", o.extra);
  return out.join("\n");
}
const shActs = (kind, key, label) => `<div class="sh-acts"><button type="button" class="btn ghost sm" data-act="shcopyitem" data-k="${kind}" data-key="${esc(key)}" aria-label="${esc(t("sh_copyof").replace("{t}", label))}">${ic("copy")}<span>${t("copy")}</span></button><button type="button" class="btn ghost sm" data-act="share" data-k="${kind}" data-key="${esc(key)}" aria-haspopup="dialog" aria-label="${esc(t("sh_shareof").replace("{t}", label))}">${ic("share")}<span>${t("share")}</span></button></div>`;
const canFiles = () => { try { return !!(navigator.canShare && navigator.canShare({ files: [new File([""], "a.jpg", { type: "image/jpeg" })] })); } catch (e) { return false; } };
let shCur = null;
function shareSheet(kind, key, opener) {
  const o = shItem(kind, key); if (!o) return; shCur = { kind, key };
  const opt = (act, icn, label) => `<button type="button" class="opt" data-act="${act}">${ic(icn)}<span>${esc(label)}</span></button>`;
  openSheet(`<div class="sh-sheet"><p class="eyebrow">${t("sh_" + (kind === "nawawi" ? "hadith" : kind))}</p><h3 class="sh-h">${t("sh_title")}</h3><p class="sh-t">${esc(o.title)}</p>
    <div class="sh-opts">${o.img ? opt("shjpg", "image", t("sh_jpg")) + (canFiles() ? opt("shjpgshare", "share", t("sh_jpgshare")) : "") : ""}${o.pdf ? opt("shpdf", "doc", t("sh_pdf")) : ""}${SITE ? opt("shlink", "link", t("sh_link")) + (navigator.share ? opt("shnative", "share", t("sh_native")) : "") : ""}${opt("shcopy", "copy", t("sh_text"))}<a class="opt" href="${esc(fbMail("mistake", fbItem(kind, o)))}" data-fb="item">${ic("flag")}<span>${esc(t("fb_mistake"))}</span></a></div>
    ${o.pdf ? `<p class="note">${t("sh_pdf_n")}</p>` : ""}<p class="note">${t(SITE ? "sh_note" : "sh_note_app")}</p>
    ${kind === "name" ? `<div class="row"><button type="button" class="btn ghost" data-act="name" data-i="${+key}">${ic("back")} ${t("sh_backname")}</button></div>` : ""}</div>`, opener);
  delete $("sheet").dataset.name; // a Name sheet still loading its verses must not redraw over this one
}
/* The image: drawn on a canvas with the bundled fonts, in a fixed light palette so it reads the same wherever it is sent. */
async function shImage(o) {
  const SANS = '"DS Sans", system-ui, sans-serif', AR = '"DS Arabic", "Amiri", "Noto Naskh Arabic", serif', DISP = '"DS Display", Georgia, serif';
  const all = [o.title, o.tl, o.mean, o.ref].concat(o.body).filter(Boolean).join(" ");
  try { await Promise.all([document.fonts.load(`400 60px ${AR}`, o.ar || "ا"), document.fonts.load(`400 34px ${SANS}`, all), document.fonts.load(`600 34px ${SANS}`, all), document.fonts.load(`400 34px ${DISP}`, "Islam Everyday")]); } catch (e) {}
  const W = 1080, P = 96, MW = W - P * 2, c = document.createElement("canvas"), x = c.getContext("2d");
  const wrap = (txt, font, rtl) => { x.font = font; x.direction = rtl ? "rtl" : "ltr"; const out = [];
    String(txt).split("\n").forEach(par => { let line = ""; par.split(/\s+/).filter(Boolean).forEach(w => { const tt = line ? line + " " + w : w; if (line && x.measureText(tt).width > MW) { out.push(line); line = w; } else line = tt; }); if (line) out.push(line); });
    return out; };
  const blocks = [], add = (txt, font, lh, color, gap, align, rtl) => { if (txt) blocks.push({ lines: wrap(txt, font, rtl), font, lh, color, gap, align, rtl }); };
  const arPx = o.kind === "name" ? 128 : 60;
  add(o.title, `600 40px ${SANS}`, 56, "#0E6B5C", 0, "center");
  add(o.ar, `400 ${arPx}px ${AR}`, Math.round(arPx * (o.kind === "name" ? 1.45 : 2.15)), "#0F2420", 40, "center", true);
  add(o.tl, `400 32px ${SANS}`, 48, "#5A6E69", 24, "center");
  add(o.mean, `600 40px ${SANS}`, 56, "#0F2420", 22, "center");
  o.body.forEach((b, k) => add(b, `400 34px ${SANS}`, 52, "#1C3530", k ? 18 : 34, o.kind === "name" ? "left" : "center"));
  add(o.ref, `400 28px ${SANS}`, 42, "#8A5A12", 36, "center");
  const head = 168, foot = 150, bodyH = blocks.reduce((s, b) => s + b.gap + b.lines.length * b.lh, 0);
  const H = Math.max(W, head + bodyH + foot);
  c.width = W; c.height = H;
  x.fillStyle = "#F6F1E6"; x.fillRect(0, 0, W, H);
  x.fillStyle = "#FFFFFF"; x.beginPath(); (x.roundRect ? x.roundRect(40, 40, W - 80, H - 80, 36) : x.rect(40, 40, W - 80, H - 80)); x.fill();
  x.fillStyle = "#0E6B5C"; x.fillRect(40, 40, W - 80, 10);
  x.textBaseline = "middle"; x.direction = "ltr"; x.textAlign = "left"; x.font = `400 34px ${DISP}`; x.fillStyle = "#0E6B5C"; x.fillText("Islam Everyday", P, 112);
  x.textAlign = "right"; x.font = `600 24px ${SANS}`; x.fillStyle = "#8A5A12"; x.fillText(t("sh_" + (o.kind === "nawawi" ? "hadith" : o.kind)).toUpperCase(), W - P, 112);
  let y = head + Math.max(0, (H - head - foot - bodyH) / 2);
  blocks.forEach(b => { y += b.gap; x.font = b.font; x.fillStyle = b.color; x.direction = b.rtl ? "rtl" : "ltr"; x.textAlign = b.align;
    const bx = b.align === "center" ? W / 2 : P;
    b.lines.forEach(l => { x.fillText(l, bx, y + b.lh / 2); y += b.lh; }); });
  x.direction = "ltr"; x.textAlign = "center"; x.fillStyle = "#DCE6E2"; x.fillRect(P, H - foot + 10, MW, 2);
  x.font = `400 26px ${SANS}`; x.fillStyle = "#5A6E69";
  x.fillText(SITE ? shUrl(o.hash).replace(/^https?:\/\//, "") : "Islam Everyday", W / 2, H - foot / 2 - 6, MW);
  return new Promise(res => c.toBlob(res, "image/jpeg", 0.92));
}
async function shJpg(share) {
  const o = shCur && shItem(shCur.kind, shCur.key); if (!o) return;
  toast(t("sh_making"));
  let blob = null; try { blob = await shImage(o); } catch (e) {}
  if (!blob) { toast(t("sh_fail")); return; }
  const name = "islam-everyday-" + o.hash.replace("/", "-") + ".jpg";
  if (share) { try { await navigator.share({ files: [new File([blob], name, { type: "image/jpeg" })], title: o.title }); return; } catch (e) { if (e && e.name === "AbortError") return; } }
  const u = URL.createObjectURL(blob), a = document.createElement("a"); a.href = u; a.download = name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(u), 5000); toast(t("sh_saved"));
}
/* The PDF: the item is laid out in a print-only area and the browser's print window opens, where "Save as PDF" is a printer. */
function shPdf() {
  const o = shCur && shItem(shCur.kind, shCur.key); if (!o) return;
  let pa = $("print-area"); if (!pa) { pa = document.createElement("div"); pa.id = "print-area"; document.body.appendChild(pa); }
  pa.setAttribute("lang", st.lang);
  pa.innerHTML = `<header class="pr-head"><b>Islam Everyday</b><span>${t("sh_" + (o.kind === "nawawi" ? "hadith" : o.kind))}</span></header><h1>${escS(o.title)}</h1>
    ${o.lead ? `<p class="pr-lead">${escS(o.lead)}</p>` : ""}${o.ar ? `<p class="pr-ar" lang="ar" dir="rtl">${esc(o.ar).replace(/\n/g, "<br>")}</p>` : ""}${o.tl ? `<p class="pr-tl">${esc(o.tl)}</p>` : ""}${o.mean ? `<p class="pr-mean">${esc(o.mean)}</p>` : ""}
    ${o.kind === "story" && o.body.length ? `<h2>${t("sg_story")}</h2>` : ""}${o.body.map(p => `<p>${(o.kind === "story" ? escS(p) : (bn() ? arRuns(p) : esc(p))).replace(/\n/g, "<br>")}</p>`).join("")}
    ${o.parts ? `<h2>${t("sg_refs")}</h2>${o.parts.map(p => `<h3>${escS(p.h)}</h3><p>${escS(p.p)}</p>`).join("")}${o.unknown ? `<h3>${t("sg_unknown")}</h3><p>${escS(o.unknown)}</p>` : ""}` : `<p class="pr-ref">${escS(o.ref)}</p>`}
    <footer class="pr-foot">${SITE ? esc(shUrl(o.hash)) : "Islam Everyday"}</footer>`;
  closeSheet();
  const t0 = document.title; document.title = "Islam Everyday - " + o.title.replace(/[\\/:*?"<>|]/g, " ");
  const done = () => { document.body.classList.remove("printing"); document.title = t0; removeEventListener("afterprint", done); };
  document.body.classList.add("printing"); addEventListener("afterprint", done);
  setTimeout(() => { try { window.print(); } catch (e) { done(); } }, 380);
}
function shNative() {
  const o = shCur && shItem(shCur.kind, shCur.key); if (!o || !SITE) return;
  try { navigator.share({ title: o.title, text: o.title, url: shUrl(o.hash) }).catch(() => {}); } catch (e) {}
}
function shLink() {
  const o = shCur && shItem(shCur.kind, shCur.key); if (!o || !SITE) return;
  try { navigator.clipboard.writeText(shUrl(o.hash)).then(() => toast(t("sh_linkok")), () => toast(t("copyfail"))); } catch (e) { toast(t("copyfail")); }
}
/* Deep links: #dua/<index>, #name/<1–99>, #hadith/<id>, #nawawi/<1–42>, #story/<id>. */
function deepParse(h) {
  let m;
  { const g = hashGroup(h); if (g && !lazyDone.has(g)) return null; } // its data is not loaded yet (see deepWait)
  if ((m = h.match(/^story\/([\w-]+)$/)) && window.IE_STORIES && IE_STORIES.get(m[1])) return { kind: "story", key: m[1], r: { tab: "quran", sub: "stories", story: m[1] } };
  if ((m = h.match(/^verse\/(\d+):(\d+)-(\d+)$/)) && QM.meta[+m[1] - 1] && +m[2] >= 1 && +m[2] <= +m[3] && +m[3] <= QM.meta[+m[1] - 1][3]) return { kind: "verse", key: m[1] + ":" + m[2] + "-" + m[3], r: { tab: "quran", sub: "all", surah: +m[1], ayah: +m[2] } };
  if ((m = h.match(/^dua\/(\d+)$/)) && DUAS[+m[1]]) return { kind: "dua", key: +m[1], r: { tab: "duas" } };
  if ((m = h.match(/^name\/(\d+)$/)) && +m[1] >= 1 && NAMES[+m[1] - 1]) return { kind: "name", key: +m[1] - 1, r: { tab: "more", sub: "names" } };
  if ((m = h.match(/^hadith\/(\w+)$/)) && HD.HADITH.some(z => z.id === m[1])) return { kind: "hadith", key: m[1], r: { tab: "more", sub: "hadith" } };
  if ((m = h.match(/^nawawi\/(\d+)$/)) && NW && NW.HADITH.some(z => z.n === +m[1])) return { kind: "nawawi", key: +m[1], r: { tab: "more", sub: "hadith" } };
  return null;
}
function deepPre(d) {
  if (d.kind === "dua") { dQuery = ""; dCat = "all"; }
  else if (d.kind === "hadith") { st.hcol = "general"; hCat = "all"; save(); }
  else if (d.kind === "nawawi") { st.hcol = "nawawi"; save(); }
}
function deepPost(d) {
  setTimeout(() => {
    if (d.kind === "name") { nameSheet(d.key); return; }
    if (d.kind === "nawawi") { nwGo(d.key); return; }
    const el = d.kind === "dua" ? document.querySelector(`#dua-list .dua[data-i="${d.key}"]`) : d.kind === "hadith" ? $("hd-" + d.key) : null;
    const h = el && el.querySelector("h3");
    if (el) { scrollTo(0, Math.max(0, el.getBoundingClientRect().top + scrollY - 84)); el.classList.add("sh-hit"); setTimeout(() => el.classList.remove("sh-hit"), 2400); }
    if (h) { h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true }); }
  }, 60);
}

/* ---------------- Prayer guide ---------------- */
const KINDS = ["fard", "wajib", "sm", "sg", "nafl", "witr"];
const school = () => st.school === "hanafi" || st.school === "shafii" ? st.school : (+st.asr === 2 ? "hanafi" : "shafii");
function gCite(id) {
  const r = GD.refs[id], m = /^(bukhari|muslim|tirmidhi|abudawud):(.+)$/.exec(id);
  const lab = m ? cite(id).label : { badat: "Badat (Hanafi)", shafiifiqh: "Shafiifiqh (Shafi'i)", islamweb84719: "IslamWeb 84719", deoband12335: "Darul Uloom Deoband 12335", birmingham: "Darul Ifta Birmingham", islamqa36793: "IslamQA 36793" }[id] || id;
  return { label: lab, url: r.url, desc: L(r), grade: r.grade };
}
function gSources(ids) {
  return `<ol class="cites">${[...new Set(ids)].map(id => { const c = gCite(id); return `<li><a href="${esc(c.url)}" target="_blank" rel="noopener noreferrer">${esc(c.label)} ${ic("ext", "ext")}<span class="sr"> (${t("opensnew")})</span></a><small>${esc(c.desc)}${c.grade ? ` <i>(${esc(c.grade)})</i>` : ""}</small></li>`; }).join("")}</ol>`;
}
const unit = x => `<span class="u u-${x.kind}"><b>${num(x.n)}</b> ${t("k_" + x.kind)}</span>`;
const unitS = x => `<span class="u u-${x.kind}" title="${esc(t("k_" + x.kind))}"><b>${num(x.n)}</b>${t("k_" + x.kind + "_s")}<span class="sr"> (${esc(t("k_" + x.kind))})</span></span>`;
function vGuide() {
  const sc = school();
  const cell = (p, w) => { const xs = p[sc].filter(x => x.when === w); return xs.length ? xs.map(unitS).join("") : `<span class="u-none" aria-label="${esc(t("g_none"))}">—</span>`; };
  const rows = GD.prayers.map(p => `<tr><th scope="row">${t(p.k)}</th><td>${cell(p, "before")}</td><td>${cell(p, "fard")}</td><td>${cell(p, "after")}${p[sc].some(x => x.when === "witr") ? `<div class="then">${t("g_then")} ${p[sc].filter(x => x.when === "witr").map(unitS).join("")}</div>` : ""}</td></tr>`).join("");
  const detail = p => `<details class="card g-det"><summary><b>${t(p.k)}</b><span class="seq">${p[sc].map(x => `${num(x.n)}${t("k_" + x.kind + "_s")}`).join(" → ")}</span></summary>
    <div class="g-body"><ol class="g-order">${p[sc].map(x => `<li>${unit(x)} <span class="note">${t("w_" + x.when)}</span></li>`).join("")}</ol>
    <p>${esc(L(p.note))}</p>
    <p class="note g-status">${t("basedon")}: ${[...new Set(p.src)].map(id => { const c = gCite(id); return `<a href="${esc(c.url)}" target="_blank" rel="noopener noreferrer">${esc(c.label)}</a>`; }).join("; ")}. ${t("g_unreviewed")}</p></div></details>`;
  return `<div class="page-head">${back()}<h2>${t("guide")}</h2></div>
  <section class="card pad g-intro"><p>${t("g_intro")}</p>
    <div class="g-school"><p class="note" id="g-sch-l">${t("g_school")}</p><div class="seg" role="group" aria-labelledby="g-sch-l">${[["hanafi", t("hanafi_s")], ["shafii", t("shafii_s")]].map(([k, l]) => `<button type="button" data-act="school" data-k="${k}" aria-pressed="${sc === k}">${l}</button>`).join("")}</div></div>
    <p class="note">${t("g_schoolh")}</p></section>
  <section class="card pad">
    <h3 class="sec-title" id="g-sum">${t("g_summary")} · ${t(sc === "hanafi" ? "hanafi_s" : "shafii_s")}</h3>
    <div class="g-legend" aria-hidden="true">${KINDS.filter(k => GD.prayers.some(p => p[sc].some(x => x.kind === k))).map(k => `<span class="u u-${k}">${t("k_" + k)}</span>`).join("")}</div>
    <div class="g-wrap"><table class="g-table" aria-labelledby="g-sum"><thead><tr><th scope="col">${t("g_prayer")}</th><th scope="col">${t("w_before")}</th><th scope="col">${t("w_fard")}</th><th scope="col">${t("w_after")}</th></tr></thead><tbody>${rows}</tbody></table></div>
    <p class="note" style="margin-top:10px">${t("g_tablenote")}</p>
  </section>
  <section class="g-list"><h3 class="sec-title">${t("g_details")}</h3>${GD.prayers.map(detail).join("")}</section>
  <section class="g-list"><h3 class="sec-title">${t("g_terms")}</h3>${GD.terms.map(x => `<details class="card g-det"><summary><b>${esc(L(x)[0])}</b></summary><div class="g-body"><p>${esc(L(x)[1])}</p>${x.src.length ? `<p class="note g-status">${t("basedon")}: ${x.src.map(id => { const c = gCite(id); return `<a href="${esc(c.url)}" target="_blank" rel="noopener noreferrer">${esc(c.label)}</a>`; }).join("; ")}.</p>` : ""}</div></details>`).join("")}</section>
  <section class="card pad"><h3 class="sec-title">${t("g_schools")}</h3>
    <p style="margin-top:6px">${esc(L(GD.notes.maliki))}</p><p class="note g-status">${t("basedon")}: ${GD.notes.maliki.src.map(id => esc(gCite(id).label)).join("; ")}.</p>
    <p style="margin-top:10px">${esc(L(GD.notes.hanbali))}</p><p class="note g-status">${t("basedon")}: ${GD.notes.hanbali.src.map(id => esc(gCite(id).label)).join("; ")}.</p>
    <p style="margin-top:10px">${esc(L(GD.notes.scope))}</p></section>
  <section class="card pad"><h3 class="sec-title">${t("sources")}</h3>${gSources(GD.prayers.flatMap(p => p.src).concat(GD.terms.flatMap(x => x.src), GD.notes.maliki.src))}
    <p class="note" style="margin-top:10px">${esc(L(GD.notes.review))}</p></section>`;
}

let calM = null, calSel = null;
/* Hijri calendar (Phase 5.2). Every square is a button: hover (mouse) or keyboard focus shows a short popover,
   selecting a day shows its details below the month, arrow keys move between days (across months), Page Up /
   Page Down change month, Home / End go to the first / last day. Touch selects without a popover.
   All Hijri dates are calculated (Umm al-Qura via Intl, plus the user's adjustment); none is a sighting report. */
const calLoc = () => LT();
function calInfo(y, m, d, s) {
  const h = hijri(localNoon(y, m, d)), k = dkey(y, m, d), evs = eventsOn(h);
  const wh = !!(h && h.d >= 13 && h.d <= 15), tash = !!(h && h.m === 12 && h.d >= 11 && h.d <= 13);
  return { y, m, d, k, h, evs, major: evs.filter(e => !e.minor), wh, tash, ram: !!(h && h.m === 9), today: k === s.key, plan: st.fplan[k] || null };
}
const calLong = i => new Intl.DateTimeFormat(calLoc(), { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(Date.UTC(i.y, i.m - 1, i.d, 12)));
const hLong = h => h ? `${num(h.d)} ${HM[st.lang][h.m - 1]} ${num(h.y)} ${t("ah")}` : "";
function calMethod() {
  const a = st.hadj;
  return t("cal_method").replace("{adj}", a ? t("cal_adj").replace("{n}", num((a > 0 ? "+" : "−") + Math.abs(a))) : t("cal_noadj"));
}
function calPopHtml(i) {
  return `<b>${esc(calLong(i))}</b><span>${esc(hLong(i.h))}</span>${i.today ? `<span class="pp">${t("t_today")}</span>` : ""}${i.wh ? `<span class="pp wh">${t("wd_badge")}</span>` : ""}${i.major.map(e => `<span class="pp ev">${esc(L(e))}</span>`).join("")}${i.plan && i.plan.f ? `<span class="pp fp">${t("fp_planned")}</span>` : ""}<small>${t("cal_calc")}</small>`;
}
function calDetail(i) {
  const p = i.plan || {};
  return `<h3 class="sec-title" id="cal-dt">${esc(calLong(i))}</h3>
    <p class="cd-h">${esc(hLong(i.h))} <span class="badge past">${t("cal_calc")}</span></p>
    <ul class="cd-tags">${i.today ? `<li class="td">${t("t_today")}</li>` : ""}${i.wh ? `<li class="wh">${t("wd_badge")} (${num(i.h.d)})</li>` : ""}${i.evs.map(e => `<li class="ev">${esc(L(e))}</li>`).join("")}</ul>
    ${i.wh && i.tash ? `<p class="cd-warn" role="note">${t("wd_tash")}</p>` : i.wh && i.ram ? `<p class="note">${t("wd_ram")}</p>` : i.wh ? `<p class="note">${t("wd_day")} <a href="#wd-h" class="linkish">${t("wd_more")}</a></p>` : ""}
    <p class="note">${t("cal_eve")}</p>
    <div class="fplan">
      <label class="fp-row"><input type="checkbox" id="fp-check" data-k="${i.k}"${p.f ? " checked" : ""}${i.tash ? " disabled" : ""}> ${t("fp_check")}</label>
      <label class="fp-note">${t("fp_note")}<input type="text" id="fp-note" class="field" data-k="${i.k}" maxlength="140" autocomplete="off" value="${esc(p.n || "")}"></label>
      <p class="note">${t("fp_h")}</p>
    </div>`;
}
/* Fasting planner list: the next few days the user has marked (today onwards), from the notes saved on this device. */
function calFasts(s) {
  const df = o => new Intl.DateTimeFormat(calLoc(), Object.assign({ timeZone: "UTC" }, o));
  const fps = Object.keys(st.fplan).filter(k => /^\d{4}-\d\d-\d\d$/.test(k) && k >= s.key && st.fplan[k] && st.fplan[k].f).sort().slice(0, 4)
    .map(k => { const [a1, b1, c1] = XT.parts(k); return { k, n: st.fplan[k].n || "", g: new Date(Date.UTC(a1, b1 - 1, c1, 12)) }; });
  return fps.length ? `<ul class="cp-fasts">${fps.map(x => `<li><button type="button" class="chip" data-act="calgo" data-k="${x.k}">${esc(df({ weekday: "short", day: "numeric", month: "short" }).format(x.g))}${x.n ? ` · <span class="cp-n">${esc(x.n)}</span>` : ""}</button></li>`).join("")}</ul>` : `<p class="note">${t("fp_none")}</p>`;
}
function vCalendar() {
  const s = snap || snapshot();
  if (!calM) calM = [s.p.year, s.p.month];
  const [y, m] = calM, first = new Date(Date.UTC(y, m - 1, 1)), dim = new Date(Date.UTC(y, m, 0)).getUTCDate();
  if (!calSel || !calSel.startsWith(y + "-" + pad2(m) + "-")) calSel = (y === s.p.year && m === s.p.month) ? s.key : dkey(y, m, 1);
  const lead = (first.getUTCDay() + 6) % 7; // Monday first
  const loc = calLoc();
  const title = new Intl.DateTimeFormat(loc, { month: "long", year: "numeric", timeZone: "UTC" }).format(first);
  const wdf = (k, f) => new Intl.DateTimeFormat(loc, { weekday: f, timeZone: "UTC" }).format(new Date(Date.UTC(2024, 0, 1 + k)));
  const head = Array.from({ length: 7 }, (_, k) => `<span class="wd${k === 4 ? " fri" : ""}" aria-hidden="true" title="${esc(wdf(k, "long"))}">${wdf(k, "short")}</span>`).join("");
  let cells = '<span class="c pad" aria-hidden="true"></span>'.repeat(lead);
  const hms = new Set(); let sel = null;
  for (let d = 1; d <= dim; d++) {
    const i = calInfo(y, m, d, s); if (i.h) hms.add(i.h.m + "/" + i.h.y);
    if (i.k === calSel) sel = i;
    const label = `${calLong(i)}, ${hLong(i.h)}${i.today ? ", " + t("todayl") : ""}${i.wh ? ", " + t("wd_badge") : ""}${i.evs.length ? ", " + i.evs.map(L).join(", ") : ""}${i.plan && i.plan.f ? ", " + t("fp_planned") : ""}`;
    cells += `<button type="button" class="c${i.today ? " today" : ""}${i.major.length ? " ev" : ""}${i.wh ? " wh" : ""}${i.h && i.h.d === 1 ? " h1" : ""}${i.plan && i.plan.f ? " fp" : ""}" data-act="calday" data-k="${i.k}" aria-label="${esc(label)}" aria-pressed="${i.k === calSel}"${i.today ? ' aria-current="date"' : ""} tabindex="${i.k === calSel ? 0 : -1}"><b aria-hidden="true">${num(d)}</b><small aria-hidden="true">${i.h ? (i.h.d === 1 ? esc(HM[st.lang][i.h.m - 1].split(/[\s']/)[0]) : num(i.h.d)) : ""}</small></button>`;
  }
  const hm = [...hms].map(k => { const [mm, yy] = k.split("/"); return `<span class="nw">${esc(HM[st.lang][mm - 1])} ${num(yy)}</span>`; }).join(" – "); // each month name stays on one line
  const up = []; let [a, b, c] = [s.p.year, s.p.month, s.p.day];
  for (let i = 0; i < 400 && up.length < 4; i++) { const [a1, b1, c1] = shiftDay(a, b, c, i), h = hijri(localNoon(a1, b1, c1)); for (const e of eventsOn(h)) if (!e.minor) up.push({ e, i, h, g: new Date(Date.UTC(a1, b1 - 1, c1, 12)) }); }
  // Next White Days: the next run of Hijri 13–15 that has not finished yet.
  const wd = []; for (let i = 0; i < 60 && wd.length < 3; i++) { const [a1, b1, c1] = shiftDay(a, b, c, i), h = hijri(localNoon(a1, b1, c1)); if (h && h.d >= 13 && h.d <= 15 && (!wd.length || wd[wd.length - 1].h.m === h.m)) wd.push({ g: new Date(Date.UTC(a1, b1 - 1, c1, 12)), h, k: dkey(a1, b1, c1), y: a1, m: b1, d: c1 }); else if (wd.length) break; }
  const df = o => new Intl.DateTimeFormat(loc, Object.assign({ timeZone: "UTC" }, o));
  return `<div class="page-head">${back()}<h2>${t("calendar")}</h2></div>
  <section class="card pad cal-card" aria-labelledby="cal-title">
    <div class="cal-head"><button type="button" class="icon-btn" data-act="cal" data-d="-1" aria-label="${esc(t("prevm"))}">${ic("back")}</button><div class="t" aria-live="polite"><b id="cal-title">${esc(title)}</b><small>${hm}</small></div><button type="button" class="icon-btn" data-act="cal" data-d="1" aria-label="${esc(t("nextm"))}">${ic("chev")}</button></div>
    <div class="cal-tools"><button type="button" class="btn ghost sm" data-act="caltoday">${t("cal_today")}</button><p class="note cal-hint">${t("cal_hint")}</p></div>
    <div class="cal" role="group" aria-labelledby="cal-title" aria-describedby="cal-method">${head}${cells}</div>
    <div id="cal-pop" class="cal-pop" role="tooltip" hidden></div>
    <p class="cal-legend"><span><i class="lg-td" aria-hidden="true"></i>${t("t_today")}</span><span><i class="lg-sel" aria-hidden="true"></i>${t("cal_sel")}</span><span><i class="lg-wh" aria-hidden="true"></i>${t("whitedays")}</span><span><i class="lg-ev" aria-hidden="true"></i>${t("events")}</span><span><i class="lg-fp" aria-hidden="true"></i>${t("fp_planned")}</span></p>
    <p class="note" id="cal-method">${calMethod()}</p>
  </section>
  <div class="cal-side">
  <section class="card pad cal-detail" id="cal-detail" aria-live="polite" aria-labelledby="cal-dt">${sel ? calDetail(sel) : ""}</section>
  <section class="card pad cal-plan" aria-labelledby="up-h">
    <h3 class="sec-title" id="up-h">${t("up_title")}</h3>
    <h4 class="cp-sub">${t("fp_list")}</h4>
    <div id="cp-fasts">${calFasts(s)}</div>
    <h4 class="cp-sub">${t("up_dates")}</h4>
    <ul class="up-list compact">${up.map(u => `<li><span class="d" aria-hidden="true"><b>${esc(df({ day: "numeric" }).format(u.g))}</b><small>${esc(df({ month: "short" }).format(u.g))}</small></span><span class="e"><b>${esc(L(u.e))}</b><small>${esc(df({ weekday: "short", day: "numeric", month: "short" }).format(u.g))}${u.h ? ` · ${num(u.h.d)} ${HM[st.lang][u.h.m - 1]}` : ""}</small></span><span class="in">${u.i ? t("inn").replace("{n}", num(u.i)) : t("todayl")}</span></li>`).join("")}</ul>
  </section>
  </div>
  <section class="card pad wd-card" aria-labelledby="wd-h">
    <div class="wd-top">
      <h3 class="sec-title" id="wd-h">${t("wd_title")}</h3>
      <p>${t("wd_intro")}</p>
      ${wd.length ? `<p class="wd-next"><b>${t("wd_next")}:</b> ${wd.map(x => `<button type="button" class="chip" data-act="calgo" data-k="${x.k}">${esc(df({ weekday: "short", day: "numeric", month: "short" }).format(x.g))} · ${num(x.h.d)} ${esc(HM[st.lang][x.h.m - 1])}</button>`).join(" ")}</p>` : ""}
    </div>
    <h4 class="wd-sub">${t("wd_ev")}</h4>
    <ul class="wd-src">
      <li><p>${t("wd_h1")}</p><p class="ref"><a href="https://sunnah.com/abudawud:2449" target="_blank" rel="noopener noreferrer">${t("wd_r1")}</a></p></li>
      <li><p>${t("wd_h2")}</p><p class="ref"><a href="https://sunnah.com/bukhari:1981" target="_blank" rel="noopener noreferrer">${t("wd_r2")}</a></p></li>
      <li><p>${t("wd_h3")}</p><p class="ref"><a href="https://sunnah.com/muslim:1160" target="_blank" rel="noopener noreferrer">${t("wd_r3")}</a></p></li>
      <li><p>${t("wd_h4")}</p><p class="ref"><a href="https://sunnah.com/muslim:1141a" target="_blank" rel="noopener noreferrer">${t("wd_r4")}</a></p></li>
    </ul>
    <p class="note">${t("wd_review")}</p>
  </section>`;
}
/* Move the selection to a date key, changing month if needed, and keep keyboard focus on that day. */
function calGo(k, focus) {
  const [y, m] = XT.parts(k); calM = [y, m]; calSel = k; hidePop(); render(false);
  if (focus) { const el = document.querySelector(`.cal .c[data-k="${k}"]`); if (el) el.focus({ preventScroll: true }); }
}
function showPop(cell) {
  const pop = $("cal-pop"); if (!pop || !cell) return;
  const [y, m, d] = XT.parts(cell.dataset.k), s = snap || snapshot();
  pop.innerHTML = calPopHtml(calInfo(y, m, d, s)); pop.hidden = false;
  const box = cell.closest(".cal-card").getBoundingClientRect(), r = cell.getBoundingClientRect(), pw = pop.offsetWidth, ph = pop.offsetHeight;
  let left = r.left - box.left + r.width / 2 - pw / 2; left = Math.max(8, Math.min(left, box.width - pw - 8));
  let top = r.top - box.top - ph - 8; if (top < 8) top = r.bottom - box.top + 8;
  pop.style.left = left + "px"; pop.style.top = top + "px";
  cell.setAttribute("aria-describedby", "cal-pop");
}
function hidePop() { const pop = $("cal-pop"); if (pop) pop.hidden = true; document.querySelectorAll('.cal .c[aria-describedby="cal-pop"]').forEach(c => c.removeAttribute("aria-describedby")); }
let popPointer = "mouse";
document.addEventListener("pointerdown", e => { popPointer = e.pointerType || "mouse"; }, true);
document.addEventListener("pointerover", e => { const c = e.target.closest && e.target.closest(".cal .c[data-k]"); if (c && e.pointerType === "mouse") showPop(c); });
document.addEventListener("pointerout", e => { const c = e.target.closest && e.target.closest(".cal .c[data-k]"); if (c && e.pointerType === "mouse" && !c.contains(e.relatedTarget) && document.activeElement !== c) hidePop(); });
document.addEventListener("focusin", e => { const c = e.target.closest && e.target.closest(".cal .c[data-k]"); if (c && popPointer !== "touch" && c.matches(":focus-visible")) showPop(c); else if (!c) hidePop(); });
document.addEventListener("focusout", e => { const c = e.target.closest && e.target.closest(".cal .c[data-k]"); if (c && !(e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest(".cal .c[data-k]"))) hidePop(); });

/* Zakat (Phase 5.3) — dormant since Face 7: no route reaches this view (see SUBS). Kept, with assets/zakat.js and st.zk, so it can be restored without data loss. */
const ZK = window.IE_ZAKAT;
function zakatCalc() {
  const r = ZK.calc({ v: st.zk.v, basis: st.zk.basis, weights: st.zk.w, price: st.zk.price }), cur = st.zk.cur;
  const fmt = x => num(x.toLocaleString(bn() ? "en-IN" : LT(), { maximumFractionDigits: 2, minimumFractionDigits: 0 }));
  const money = x => `${esc(cur)} ${fmt(x)}`, metal = t(r.basis);
  const rows = r.lines.filter(([, x]) => x > 0).map(([k, x]) => `<tr><td>${t("z" + k)}</td><td class="tnum">${money(x)}</td></tr>`).join("") || `<tr><td colspan="2" class="note">${t("zk_none")}</td></tr>`;
  const head = r.state === "noprice" ? `<span class="note">${t("zknet")}</span><p class="big">${money(r.netClamped)}</p><p class="note">${t("zkprice")}</p>`
    : `<span class="note">${t("zkdue")}</span><p class="big">${money(r.due)}</p><p class="note">${r.state === "above" ? t("zkabove") : t("zkbelow")}</p>`;
  return `${head}
    ${r.invalid.length ? `<p class="zk-warn" role="alert">${t("zk_invalid").replace("{f}", r.invalid.map(k => k === "price" ? t("pricegram").replace("{m}", metal) : t("z" + k)).join(", "))}</p>` : ""}
    ${r.net < 0 ? `<p class="note">${t("zk_negnet")}</p>` : ""}
    <details class="zk-break"><summary>${t("zk_break")}</summary>
      <table class="zk-table"><tbody>${rows}
        <tr class="sum"><td>${t("zk_total")}</td><td class="tnum">${money(r.assets)}</td></tr>
        <tr><td>− ${t("zdebt")}</td><td class="tnum">${money(r.owed)}</td></tr>
        <tr class="sum"><td>${t("zknet")}</td><td class="tnum">${money(r.netClamped)}</td></tr>
        <tr><td>${t("nisab")} (${num(r.grams)} g ${metal} × ${r.price ? money(r.price) : "—"})</td><td class="tnum">${r.price ? money(r.nisab) : "—"}</td></tr>
        <tr class="sum"><td>${t("zkdue")}</td><td class="tnum">${money(r.due)}</td></tr>
      </tbody></table>
      <p class="zk-formula">${t("zk_formula")}</p>
    </details>`;
}
function vZakat() {
  if (!ZK.WEIGHTS[st.zk.w]) st.zk.w = "tola";
  const f = (k, lab) => `<label>${lab}<small class="zk-hint">${t("zh_" + k)}</small><input class="field tnum" id="zk-${k}" data-zk="${k}" type="number" inputmode="decimal" min="0" step="any" placeholder="0" value="${esc(st.zk.v[k] || "")}"></label>`;
  const learn = ["what", "nisab", "hawl", "est", "metal", "differ"];
  return `<div class="page-head">${back()}<h2>${t("zakat")}</h2></div>
  <p class="zk-disclaimer" role="note">${t("zk_disclaimer")}</p>
  <section class="result" id="zk-result" aria-live="polite">${zakatCalc()}</section>
  <section class="card pad form"><h3 class="sec-title">${t("zk_s1")}</h3>
    <label>${t("currency")}<small class="zk-hint">${t("zh_cur")}</small><select id="zk-cur" class="field">${CURRENCIES.map(c => `<option${c === st.zk.cur ? " selected" : ""}>${c}</option>`).join("")}</select></label>
    <div><p class="note" style="margin-bottom:6px">${t("nisabbasis")}</p><div class="seg">${[["silver", t("silver")], ["gold", t("gold")]].map(([k, l]) => `<button type="button" data-act="zkb" data-k="${k}" aria-pressed="${st.zk.basis === k}">${l}</button>`).join("")}</div></div>
    <div><p class="note" style="margin-bottom:6px">${t("zk_weights")}</p><div class="seg">${[["tola", t("zk_w_tola")], ["g85", t("zk_w_g85")]].map(([k, l]) => `<button type="button" data-act="zkw" data-k="${k}" aria-pressed="${st.zk.w === k}">${l}</button>`).join("")}</div></div>
    <label>${t("pricegram").replace("{m}", st.zk.basis === "gold" ? t("gold") : t("silver"))}<small class="zk-hint">${t("zh_price")}</small><input class="field tnum" id="zk-price" data-zkp="1" type="number" inputmode="decimal" min="0" step="any" placeholder="0" value="${esc(st.zk.price)}"></label>
  </section>
  <section class="card pad form"><h3 class="sec-title">${t("zk_s2")}</h3><p class="note">${t("zk_s2h")}</p>${f("cash", t("zcash"))}${f("gold", t("zgold"))}${f("silver", t("zsilver"))}${f("inv", t("zinv"))}${f("biz", t("zbiz"))}${f("recv", t("zrecv"))}</section>
  <section class="card pad form"><h3 class="sec-title">${t("zk_s3")}</h3><p class="note">${t("zk_s3h")}</p>${f("debt", t("zdebt"))}</section>
  <section class="card pad zk-learn" aria-labelledby="zk-learn-h"><h3 class="sec-title" id="zk-learn-h">${t("zk_learn")}</h3>
    ${learn.map(k => `<details class="zk-q"><summary>${t("zq_" + k)}</summary><p>${t("za_" + k)}</p></details>`).join("")}
    <h4 class="wd-sub">${t("zk_refs")}</h4>
    <ul class="wd-src">
      <li><p>${t("zr_b8")}</p><p class="ref"><a href="https://sunnah.com/bukhari:8" target="_blank" rel="noopener noreferrer">${t("zr_b8s")}</a></p></li>
      <li><p>${t("zr_ira")}</p><p class="ref"><a href="https://islamicrelief.org.au/our-work/islamic-giving/zakat/zakat-calculator/" target="_blank" rel="noopener noreferrer">${t("zr_iras")}</a></p></li>
    </ul>
    <p class="note">${t("zk_checked")}</p>
  </section>`;
}
/* Face 7 settings previews. Theme cards draw a miniature of the real tokens (ground, card, ink, accent, gold);
   the selected card is marked with a check and the word "Chosen", not colour alone. */
const TH_PREV = { classic: ["#EEF3F1", "#FFFFFF", "#0F2420", "#0E6B5C", "#996010"], emerald: ["#F6F1E4", "#FFFDF7", "#12261E", "#0A6247", "#835308"], sandstone: ["#F3EADB", "#FCF7EE", "#2A2118", "#0F5C66", "#874C12"],
  jade: ["#08120F", "#101C18", "#F1EADB", "#5DCAAE", "#E6BA62"], indigo: ["#0A0D1E", "#12172F", "#E9EAF3", "#AEB6FF", "#E3BF6E"], plum: ["#140D14", "#1E141E", "#F3E8E3", "#E7A3B4", "#E2AE78"] };
const CHECK = '<svg class="ck" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
function themeCards() {
  const now = themeNow();
  const card = (k, grp) => { const [g, sf, ink, ac, gd] = TH_PREV[k], on = (grp === "light" ? st.lightTheme : st.darkTheme) === k;
    return `<button type="button" class="th-card" data-act="setth" data-g="${grp}" data-k="${k}" aria-pressed="${on}">
      <span class="th-prev" aria-hidden="true" style="--p-g:${g};--p-s:${sf};--p-i:${ink};--p-a:${ac};--p-o:${gd}"><i class="p-bar"></i><span class="p-card"><b>${t("th_sample")}</b><i class="p-l"></i><i class="p-l s"></i><span class="p-row"><i class="p-btn"></i><i class="p-dot"></i></span></span></span>
      <span class="th-name">${t("pl_" + k)}</span>
      <span class="th-state">${on ? CHECK + t("th_chosen") : ""}${now === k ? `<em>${t("th_now")}</em>` : ""}</span></button>`; };
  return `<div class="th-groups">${[["light", LIGHT_TH], ["dark", DARK_TH]].map(([grp, ks]) => `<div class="th-group" role="group" aria-labelledby="thg-${grp}"><p class="th-h" id="thg-${grp}">${t("th_" + grp)}</p><div class="th-grid">${ks.map(k => card(k, grp)).join("")}</div></div>`).join("")}</div>`;
}
const SC_PREV = {
  landscape: '<path d="M0 46 L14 38 L26 42 L40 32 L54 40 L66 34 L80 41 V60 H0Z" class="f1"/><path d="M0 52 L18 46 L34 50 L50 44 L66 49 L80 46 V60 H0Z" class="f2"/><path d="M0 56 L30 53 L56 55 L80 52 V60 H0Z" class="f3"/>',
  sky: '<path d="M14 50 Q40 6 66 50" class="arcp"/><circle cx="52" cy="24" r="4" class="sun"/><path d="M0 50 H80" class="hzn"/><rect y="50" width="80" height="10" class="f3"/>',
  mosque: '<rect y="54" width="80" height="6" class="f3"/><path d="M42 54 V46 H66 V54Z M44 46 a10 10 0 0 1 20 0Z M53.5 36 h1 v-3 h-1Z M38 54 V30 h3 V54Z M37.5 30 h4 l-2 -4Z M68 54 V34 h3 V54Z M67.5 34 h4 l-2 -4Z" class="f3"/>'
};
function sceneCards() {
  return `<div class="sc-grid" role="group" aria-label="${esc(t("scene"))}">${SCENES.map(k => `<button type="button" class="sc-card" data-act="setscene" data-k="${k}" aria-pressed="${st.scene === k}">
    <svg class="sc-prev" viewBox="0 0 80 60" aria-hidden="true" focusable="false"><rect width="80" height="60" class="skyb"/>${SC_PREV[k]}</svg>
    <span class="th-name">${t("sc_" + k)}</span><span class="th-state">${st.scene === k ? CHECK + t("th_chosen") : ""}</span></button>`).join("")}</div>`;
}
function vSettings() {
  const segb = (act, cur, opts) => `<div class="seg">${opts.map(([k, l]) => `<button type="button" data-act="${act}" data-k="${k}" aria-pressed="${String(cur) === String(k)}">${l}</button>`).join("")}</div>`;
  return `<div class="page-head">${back()}<h2>${t("settings")}</h2></div>
  <ul class="card set">
    <li><span class="lb">${t("language")}<small>${t("lang_h")}</small></span><div style="width:100%">${segb("setlang", bn() ? "bn" : LOC.variant(st.loc), LOC.VARIANTS.map(x => [x.id, `<span lang="${x.lang === "bn" ? "bn" : x.id}">${esc(x.label)}</span>`]))}</div></li>
    <li><span class="lb">${t("appearance")}<small>${t("appearance_h")}</small></span><div style="width:100%">${segb("setmode", st.mode, MODES.map(k => [k, t("md_" + k)]))}</div></li>
    <li class="set-block"><span class="lb">${t("theme")}<small>${t("theme_h")}</small></span>${themeCards()}</li>
    <li class="set-block"><span class="lb">${t("scene")}<small>${t("scene_h")}</small></span>${sceneCards()}</li>
    <li><span class="lb">${t("glass")}<small>${t("glass_h")}</small></span><div style="width:100%">${segb("setglass", st.glass, GLASS.map(k => [k, t("gl_" + k)]))}</div></li>
    <li><span class="lb">${t("motion")}<small>${t("motion_h")}</small></span><div style="width:100%">${segb("setmotion", st.motion, MOTION.map(k => [k, t("mo_" + k)]))}</div></li>
    <li><span class="lb">${t("location")}<small>${esc(cname(city()))}</small></span><button type="button" class="btn ghost" data-act="loc">${t("change")}</button></li>
  </ul>
  <p class="eyebrow">${t("ptimes")}</p>
  <ul class="card set">
    <li><label for="method">${t("method")}<select id="method" class="field" style="margin-top:6px">${Object.entries(METHODS).map(([k, m]) => `<option value="${k}"${k === st.method ? " selected" : ""}>${esc(L(m).name)}</option>`).join("")}</select></label></li>
    <li><span class="lb">${t("asrm")}</span><div style="width:100%">${segb("setasr", st.asr, [["1", t("std")], ["2", t("hanafi")]])}</div></li>
    <li><span class="lb">${t("hadj")}<small>${t("hadjh")}</small></span><button type="button" class="icon-btn" data-act="hadj" data-d="-1" aria-label="−1">−</button><b class="tnum" style="min-width:2.5ch;text-align:center">${num((st.hadj > 0 ? "+" : "") + st.hadj)}</b><button type="button" class="icon-btn" data-act="hadj" data-d="1" aria-label="+1">+</button></li>
  </ul>
  <p class="eyebrow">${t("reading")}</p>
  <ul class="card set">
    <li><span class="lb">${t("arsize")}</span><input id="ar-size" type="range" min="0.8" max="1.6" step="0.1" value="${st.ar}" aria-label="${esc(t("arsize"))}"></li>
    <li><span class="lb">${t("showtl")}<small>${t("showtlh")}</small></span><button type="button" class="switch" role="switch" data-act="tl" aria-checked="${st.tl}" aria-label="${esc(t("showtl"))}"></button></li>
    <li><span class="lb">${t("gl_set")}<small>${t("gl_seth")}</small></span><button type="button" class="switch" role="switch" data-act="gloss" aria-checked="${st.gloss}" aria-label="${esc(t("gl_set"))}"></button></li>
  </ul>
  <ul class="card set"><li><span class="lb">${t("offline")}<small>${t(NATIVE ? "offlineapp" : "offlineh")}</small></span>${NATIVE ? `<span class="note">✓ ${t("inapp")}</span>` : (() => { let done = false; try { done = offlineSaved(); } catch (x) {} return `<button type="button" class="btn ghost" data-act="savequran">${done ? "✓ " + t("savedq") : t("saveq")}</button>`; })()}</li>${!NATIVE && offlineStale() ? `<li><p class="note" role="note">${t("q_resave")}</p></li>` : ""}</ul>
  <ul class="card set"><li><span class="lb">${t("resetall")}<small>${t("resetallh")}</small></span><button type="button" class="btn ghost warn" data-act="wipe" id="wipe">${t("reset")}</button></li></ul>`;
}
function vAbout() {
  const E = bn() ? [
    ["আরবি পাঠ", "উসমানি লিপি, নোবেল কুরআন এনসাইক্লোপিডিয়া (quranenc.com), quran-json প্যাকেজের মাধ্যমে (CC BY-SA 4.0)।"],
    ["বাংলা অনুবাদ", "ড. আবু বকর মুহাম্মাদ যাকারিয়া, সংস্করণ ১.১.১ (২২ মে ২০২১), প্রকাশক QuranEnc.com। অনুবাদ ও টীকা অপরিবর্তিতভাবে দেওয়া হয়েছে। QuranEnc-এর শর্ত: বিষয়বস্তুতে কোনো পরিবর্তন নয়; প্রকাশক ও উৎস উল্লেখ; সংস্করণ নম্বর উল্লেখ; সর্বশেষ সংস্করণে হালনাগাদ; অনুপযুক্ত বিজ্ঞাপন নয়।"],
    ["ইংরেজি অনুবাদ (আজকের আয়াত, আয়াতুল কুরসি)", "রুওয়াদ ট্রান্সলেশন সেন্টার (রাবওয়াহ দাওয়াহ অ্যাসোসিয়েশন, ইসলামিক কনটেন্ট সার্ভিস অ্যাসোসিয়েশন ইন ল্যাঙ্গুয়েজেস ও IslamHouse.com-এর সহযোগিতায়), ইংরেজি অনুবাদ, সংস্করণ ১.০.২০, প্রকাশক QuranEnc.com। সহজ আধুনিক ইংরেজি; আজকের আয়াত ও আয়াতুল কুরসিতে ব্যবহৃত, পাঠ ও অনুবাদকের টীকা QuranEnc-এর শর্ত অনুযায়ী অপরিবর্তিত। কুরআন পাঠকে পিকথল ব্যবহৃত হয়।"],
    ["কুরআন অধ্যয়ন ও কুরআনের কাহিনি", "এআই সহকারীর সাহায্যে এই অ্যাপের জন্য লেখা খসড়া টীকা ও পুনর্কথন, যে আয়াত থেকে এসেছে তার সঙ্গে যুক্ত; মাক্কি/মাদানি শ্রেণিবিন্যাস Tanzil Quran Metadata 1.0 (CC BY 3.0) থেকে; কাহিনির হাদিস সহীহ বুখারী ও সহীহ মুসলিম থেকে, sunnah.com-এ যাচাই করা। প্রতিটি কাহিনির শুরুর পূর্ণ পুনর্কথন শুধু উল্লিখিত অংশগুলো জুড়ে দেয়। এখনো কোনো যোগ্য আলেম পর্যালোচনা করেননি।"],
    ["৯৯ নাম — গল্প", "প্রতিটি নামের জন্য একটি দৈনন্দিন গল্প, এআই সহকারীর সাহায্যে এই অ্যাপের জন্য শেখানোর উদাহরণ হিসেবে লেখা। প্রতিটি গল্প নামটির সূত্রভিত্তিক ব্যাখ্যা অনুসরণ করে এবং উদাহরণ হিসেবে চিহ্নিত, কোনো সূত্র বা ফতোয়া নয়। এখনো কোনো যোগ্য আলেম পর্যালোচনা করেননি।"],
    ["আরও দোয়া (Face 7.2)", "বারোটি ছোট দোয়া যোগ করা হয়েছে; আরবি পাঠ ও রেফারেন্স sunnah.com-এ যাচাই করা (দুই সহিহের বাইরের সংকলনের মান দেখানো হয়েছে)। অর্থ ও উচ্চারণ এই অ্যাপের জন্য লেখা।"],
    ["ইংরেজি ব্যাখ্যা (আজকের আয়াত)", "আল-মুখতাসার ফি তাফসিরিল কুরআনিল কারিম, তাফসির সেন্টার ফর কুরআনিক স্টাডিজ, ইংরেজি সংস্করণ, প্রকাশক QuranEnc.com। এই সংস্করণের কোনো সংস্করণ নম্বর QuranEnc দেয়নি; আজকের আয়াতের ২৬৭টি আয়াতের ব্যাখ্যা ১৮ অক্টোবর ২০২৬ তারিখে সংগ্রহ করে অপরিবর্তিতভাবে দেখানো হয় (শুরুর আয়াত নম্বর লুকানো)। এটি প্রকাশিত তাফসির—এআই-লিখিত নয়, কুরআনের অনুবাদও নয়। সংবেদনশীল বিষয়ের কয়েকটি ব্যাখ্যার সঙ্গে এই অ্যাপের লেখা ছোট সম্পাদকীয় টীকা আছে। ইংরেজি ভাষা বেছে নিলে দেখা যায়। এই অ্যাপের জন্য কোনো যোগ্য আলেম স্বতন্ত্রভাবে পর্যালোচনা করেননি। একই QuranEnc শর্ত প্রযোজ্য।"],
    ["বাংলা সংক্ষিপ্ত তাফসির", "আল-মুখতাসার ফি তাফসিরিল কুরআনিল কারিম, তাফসির সেন্টার ফর কুরআনিক স্টাডিজ, বাংলা সংস্করণ ১.০.০ (১৫ অক্টোবর ২০২০), প্রকাশক QuranEnc.com। এটি ব্যাখ্যা, কুরআনের অনুবাদ নয়; প্রকাশিত রূপেই দেওয়া হয়েছে। পুরোনো বাংলা ফন্ট-এনকোডিংয়ের কিছু অক্ষর শুধু দেখানোর সময় ঠিক করা হয়। একই শর্ত প্রযোজ্য।"],
    ["ইংরেজি অনুবাদ", "মারমাডিউক পিকথল, The Meaning of the Glorious Koran, ১৯৩০ সালের প্রথম সংস্করণ, পাবলিক ডোমেইন। ডিজিটাল ভিত্তি-পাঠ Tanzil (tanzil.net) থেকে, fawazahmed0/quran-api-এর মাধ্যমে; ৩৯৩টি আয়াত প্রথম সংস্করণের তিনটি কপির সঙ্গে মিলিয়ে ১৯৩০ সালের শব্দে ফেরানো হয়েছে (data/quran/en-corrections.json, docs/translation-audit.md)। আধুনিক বানান ও ডিজিটাল পাঠের যতিচিহ্ন রাখা হয়েছে।"],
    ["আল্লাহর ৯৯ নাম", "তাফসিরে সাদি, তাফসিরে ইবনে কাসির (সংক্ষিপ্ত ইংরেজি), সহিহ বুখারি, সহিহ মুসলিম, তিরমিযি, আবু দাউদ, ইবনে মাজাহ এবং একটি গবেষণা প্রবন্ধ থেকে। প্রতিটি নামের ব্যাখ্যার শেষে ব্যবহৃত সূত্র ও পর্যালোচনার অবস্থা দেওয়া আছে। কোনো ব্যাখ্যাই এখনো কোনো যোগ্য আলেম স্বতন্ত্রভাবে পর্যালোচনা করেননি।"],
    ["হাদীস", "৪০টি হাদীস, সবগুলো সহীহ বুখারী বা সহীহ মুসলিম থেকে। আরবি পাঠ, ইংরেজি ও বাংলা অনুবাদ, মান ও সূত্রনির্দেশ HadeethEnc.com (Encyclopedia of Translated Prophetic Hadiths) থেকে অপরিবর্তিতভাবে নেওয়া; প্রতিটি সূত্র sunnah.com-এ মিলিয়ে দেখা হয়েছে। HadeethEnc-এর শর্ত: বিষয়বস্তুতে কোনো পরিবর্তন নয়; প্রকাশক ও উৎস উল্লেখ; সর্বশেষ সংস্করণে হালনাগাদ; অনুপযুক্ত বিজ্ঞাপন নয়। বিভাগগুলো এই অ্যাপের বাছাই।"],
    ["ইমাম নববীর চল্লিশ হাদীস", "ইমাম নববীর ৪২টি হাদীস, তাঁর নিজের ক্রমানুসারে, সাধারণ সংগ্রহ থেকে আলাদা। আরবি পাঠ, অনুবাদ, তাখরীজ ও মান HadeethEnc.com থেকে অপরিবর্তিত (১৮ অক্টোবর ২০২৬ সংগৃহীত); নম্বর ও আরবি পাঠ sunnah.com/nawawi40-এর সাথে মিলিয়ে দেখা হয়েছে। হাসান বা শুধু ইমাম নববীর দেওয়া মানের ৯টি হাদীস পর্যালোচনার জন্য চিহ্নিত। কোনো যোগ্য আলেম পর্যালোচনা করেননি।"],
    ["নিষিদ্ধ সময়ের সতর্কতা", "সহীহ মুসলিম ৮৩১, সহীহ বুখারী ৫৮৬ এবং শাইখ ইবনে বাযের ফতোয়া ১৮৪৯৫ (binbaz.org.sa) অনুযায়ী; সূর্যোদয়, মধ্যাহ্ন ও সূর্যাস্তের সময় এই অ্যাপ আপনার অবস্থান থেকে হিসাব করে। মিনিটের সীমাগুলো আনুমানিক।"],
    ["আজকের আয়াত", "১৮০ দিনের একটি নির্দিষ্ট তালিকা (১ জানুয়ারি ২০২৬ থেকে গণনা), প্রতিটি আয়াত আগের আয়াত ও আল-মুখতাসার তাফসিরের সঙ্গে মিলিয়ে বাছাই করা; প্রয়োজনে প্রেক্ষাপট টীকা দেওয়া আছে। কোনো যোগ্য আলেম এখনো পর্যালোচনা করেননি।"],
    ["নামাজ শিক্ষা", "sunnah.com-এ যাচাই করা হাদিস এবং হানাফি ও শাফিই ফতোয়া উত্তর (IslamQA.org), ইসলামওয়েব ও ইসলামকিউএ থেকে সংক্ষেপিত। এটি ফতোয়া নয়, এবং এখনো কোনো যোগ্য আলেম স্বতন্ত্রভাবে পর্যালোচনা করেননি।"],
    ["লোগো", "মিহরাব-আকৃতির খোলা দরজায় উদীয়মান সূর্য—এই অ্যাপের জন্য আঁকা মৌলিক ভেক্টর ছবি (brand/ ফোল্ডার)।"],
    ["ফন্ট", "হিন্দ শিলিগুড়ি, শেহেরাজাদ নিউ ও তিরো বাংলা, SIL Open Font License 1.1, এই অ্যাপের সঙ্গেই সংযুক্ত।"]
  ] : [
    ["Arabic text", "Uthmani script from the Noble Qur'an Encyclopedia (quranenc.com), via the quran-json package (CC BY-SA 4.0)."],
    ["Bangla translation", "Dr. Abu Bakr Muhammad Zakaria, version 1.1.1 (22 May 2021), published by QuranEnc.com. Translation and footnotes are included unchanged. QuranEnc's terms: no change to the content; credit the publisher and source; state the version; update to the latest version; no inappropriate advertising."],
    ["English translation", "Marmaduke Pickthall, The Meaning of the Glorious Koran, 1930 first edition, public domain. Digital base text from Tanzil (tanzil.net) via fawazahmed0/quran-api; 393 verses are restored to the 1930 wording, checked against three copies of the first edition (data/quran/en-corrections.json, docs/translation-audit.md). Modern spellings and the digital text's punctuation are kept. Older words can be explained with Settings → Explain older English words; the explanations are not part of the translation."],
    ["English translation (Verse for today, Ayat al-Kursi)", "Rowwad Translation Center (with the Rabwah Dawah Association, the Islamic Content Service Association in Languages and IslamHouse.com), English Translation, version 1.0.20, published by QuranEnc.com (quranenc.com/en/browse/english_rwwad). Plain modern English, used for the Verse for today and Ayat al-Kursi; text and translators' notes shown unchanged under QuranEnc's terms. The Qur'an reader uses Pickthall."],
    ["Qur'an study and Qur'an Stories", "Draft notes and retellings written for this app with an AI assistant, tied to the verses they come from; Meccan/Medinan from Tanzil Quran Metadata 1.0 (CC BY 3.0); story narrations from Sahih al-Bukhari and Sahih Muslim, checked on sunnah.com. The complete retelling at the top of each story only joins its referenced parts. Not yet reviewed by a qualified scholar."],
    ["99 Names — stories", "One everyday story for each name, written for this app with an AI assistant as a teaching example. Each follows the sourced explanation of its name and is labelled as an illustration, not a source or a ruling. Not yet reviewed by a qualified scholar."],
    ["More duas (Face 7.2)", "Twelve short duas added with their Arabic and references checked on sunnah.com (gradings shown for collections outside the two Sahihs). Meanings and transliterations were written for this app."],
    ["English explanation (Verse for today)", "Al-Mukhtasar in Interpreting the Noble Quran, Tafsir Center for Quranic Studies, English edition, published by QuranEnc.com. QuranEnc lists no version number for this edition; the texts for the 267 verses of the Verse for today were retrieved on 18 October 2026 and are shown unchanged (the leading verse number is hidden). It is published commentary, not AI-generated and not a translation of the Qur'an. A few explanations that touch on sensitive matters carry a short editorial note written for this app. Not independently reviewed by a qualified scholar for this app. The same QuranEnc terms apply."],
    ["Bangla short explanation", "Al-Mukhtasar in Interpreting the Noble Quran, Tafsir Center for Quranic Studies, Bengali version 1.0.0 (15 October 2020), published by QuranEnc.com. It is an explanation, not a translation of the Qur'an, and is shown as published; some characters left over from an old Bangla font encoding are repaired on display only. The same QuranEnc terms apply."],
    ["99 Names", "From Tafsir al-Sa'di, Tafsir Ibn Kathir (abridged English), Sahih al-Bukhari, Sahih Muslim, at-Tirmidhi, Abu Dawud, Ibn Majah and one journal article. Each explanation ends with the sources it used and its review status. None has yet been independently reviewed by a qualified scholar."],
    ["Hadith", "40 narrations, all from Sahih al-Bukhari or Sahih Muslim. Arabic text, English and Bangla translations, grading and attribution are reproduced unchanged from HadeethEnc.com (Encyclopedia of Translated Prophetic Hadiths); every reference was checked on sunnah.com. HadeethEnc's terms: no change to the content; credit the publisher and source; update to the latest version; no inappropriate advertising. The categories were chosen for this app."],
    ["An-Nawawi's Forty Hadith", "All 42 narrations of Imam an-Nawawi's collection, in his own numbering and kept apart from the general library. Arabic text, translations, takhrij and grades are reproduced unchanged from HadeethEnc.com (retrieved 18 October 2026); numbers and Arabic were checked against sunnah.com/nawawi40. Nine narrations with a Hasan grade or an-Nawawi's own grade are flagged for review. Not reviewed by a qualified scholar."],
    ["Prohibited-time notes", "Based on Sahih Muslim 831, Sahih al-Bukhari 586 and Shaykh Ibn Baz's fatwa 18495 (binbaz.org.sa); sunrise, solar noon and sunset are calculated by the app for your location. The minute margins are approximations."],
    ["Verse for today", "A fixed 180-day schedule (counted from 1 January 2026). Each passage was read with the verses before it and the Al-Mukhtasar tafsir, and a context note is shown where the passage needs one. Not yet reviewed by a qualified scholar."],
    ["Prayer guide", "Summarised from hadith checked on sunnah.com and from Hanafi and Shafi'i fatwa answers (IslamQA.org), IslamWeb and IslamQA.info. It is not a fatwa and has not yet been independently reviewed by a qualified scholar."],
    ["Logo", "A mihrab-shaped open doorway framing a rising sun: original vector artwork drawn for this app (brand/ folder)."],
    ["Fonts", "Hind Siliguri, Scheherazade New and Tiro Bangla, SIL Open Font License 1.1, bundled with the app."]
  ];
  return `<div class="page-head">${back()}<h2>${t("about")}</h2></div>
  <section class="card pad" style="display:grid;gap:10px">${t("aboutbody").split("\n").map(p => `<p>${esc(p)}</p>`).join("")}</section>
  <section class="card pad"><h3 class="sec-title">${t("qcredit")}</h3><dl class="credits">${E.map(([k, v]) => `<div><dt>${esc(sp(k))}</dt><dd>${esc(sp(v))}</dd></div>`).join("")}</dl>
  <p class="note" style="margin-top:8px"><a href="data/quran/editions.json" target="_blank" rel="noopener">editions.json</a> · <a href="https://quranenc.com/en/browse/bengali_zakaria" target="_blank" rel="noopener noreferrer">QuranEnc.com</a> · <a href="https://quranenc.com/en/browse/bengali_mokhtasar" target="_blank" rel="noopener noreferrer">Al-Mukhtasar</a> · <a href="https://tanzil.net/trans/" target="_blank" rel="noopener noreferrer">Tanzil</a></p></section>
  <p class="note">Islam Everyday · ${t("version")} ${num(APPV)}</p>`;
}
/* Terms of Use and Privacy Policy (assets/legal.js). Plain sections; the contact link is the public GitHub Issues page. */
/* Footer on every page: copyright and the legal links, so the policies are always one tap away. */
const siteFoot = () => `<footer class="site-foot"><span>© ${num(2026)} ${bn() ? "সামিউর রহমান" : "Samiur Rahman"}</span><button type="button" class="linkish" data-act="go" data-tab="more" data-sub="privacy">${t("privacy")}</button><button type="button" class="linkish" data-act="go" data-tab="more" data-sub="terms">${t("terms")}</button><button type="button" class="linkish" data-act="go" data-tab="more" data-sub="about">${t("about")}</button></footer>`;
/* Feedback (Oct 2026): by email, no server. Each link opens the user's email app with a message ready to send; nothing
   leaves the device until they press Send. The message carries only what is listed in fb_privacy: never location or records. */
const APPV = "1.0.0", FB_EMAIL = "samiiiur@yahoo.com";
const fbDevice = () => { const u = navigator.userAgent || "";
  const os = /iphone/i.test(u) ? "iPhone" : /ipad/i.test(u) || (/macintosh/i.test(u) && navigator.maxTouchPoints > 1) ? "iPad" : /android/i.test(u) ? "Android" : /windows/i.test(u) ? "Windows" : /mac os/i.test(u) ? "Mac" : /linux|cros/i.test(u) ? "Linux" : "";
  const br = /SamsungBrowser/.test(u) ? "Samsung Internet" : /Edg\//.test(u) ? "Edge" : /OPR\//.test(u) ? "Opera" : /Firefox|FxiOS/.test(u) ? "Firefox" : /Chrome|CriOS/.test(u) ? "Chrome" : /Safari/.test(u) ? "Safari" : "";
  return (phone() ? "Phone" : "Computer") + (os || br ? ` (${[os, br].filter(Boolean).join(", ")})` : "") + (standalone() ? ", installed app" : ""); };
function fbMail(type, item) {
  const L = { mistake: "Mistake", problem: "Problem", idea: "Idea", other: "Message" }[type];
  const lines = [];
  if (item) { lines.push("Item: " + item.what + " - " + item.title); if (item.ref) lines.push("Reference: " + item.ref); if (item.link) lines.push("Link: " + item.link); }
  lines.push("Language: " + (st.lang === "bn" ? "Bangla" : "English"), "App version: " + APPV, "Device: " + fbDevice(), "", "----", t("fb_ask_" + type), "", "");
  const subj = "[Islam Everyday] " + L + (item ? ": " + item.title : "");
  return `mailto:${FB_EMAIL}?subject=${encodeURIComponent(subj.slice(0, 140))}&body=${encodeURIComponent(lines.join("\r\n"))}`;
}
/* The item a share sheet is showing, for a "Report a mistake" email. */
function fbItem(kind, o) {
  const ref = Array.isArray(o.ref) ? o.ref.join("; ") : (o.ref || "");
  return { what: { dua: "Dua", name: "Name of Allah", hadith: "Hadith", nawawi: "An-Nawawi's Forty", story: "Story", verse: "Verse" }[kind] || kind,
    title: String(o.title || "").slice(0, 120), ref: String(ref).slice(0, 300), link: shUrl(o.hash) };
}
function vFeedback() {
  const row = (type, icn) => `<li><a href="${esc(fbMail(type))}" data-fb="${type}"><span class="ic">${ic(icn)}</span><span class="grow"><b>${t("fb_" + type)}</b><small>${esc(t("fb_" + type + "_s"))}</small></span>${ic("ext", "chev")}</a></li>`;
  return `<div class="page-head">${back()}<h2>${t("feedback")}</h2></div>
  <section class="card pad fb-intro"><p>${t("fb_intro")}</p></section>
  <ul class="card menu fb-menu">${row("mistake", "flag")}${row("problem", "bug")}${row("idea", "bulb")}${row("other", "mail")}</ul>
  <section class="card pad fb-notes">
    <p class="note">${ic("share", "fb-i")}${t("fb_tip")}</p>
    <p class="note">${ic("lock", "fb-i")}${t("fb_privacy")}</p>
    <p class="note">${esc(t("fb_noapp")).replace("{e}", `<b class="fb-mail">${FB_EMAIL}</b>`)}</p>
    <div class="row"><button type="button" class="btn ghost sm" data-act="fbcopy">${ic("copy")}<span>${t("fb_copy")}</span></button></div>
    <p class="note"><a href="https://github.com/srn-n/islam-everyday/issues" target="_blank" rel="noopener noreferrer">${t("fb_github")}</a></p>
  </section>`;
}
function vLegal(kind) {
  const l = st.lang === "bn" ? "bn" : "en", secs = LG ? (kind === "terms" ? LG.TERMS : LG.PRIVACY)[l] : [];
  return `<div class="page-head">${back()}<h2>${t(kind)}</h2></div>
  <section class="card pad legal"><p class="note">${esc(t("lg_updated").replace("{d}", LG ? LG.UPDATED[l] : ""))} · ${t("lg_by")}</p>
  ${secs.map(([h, ps]) => `<h3 class="sec-title">${esc(h)}</h3>${ps.map(p => `<p>${esc(p)}</p>`).join("")}`).join("")}
  <p><a href="${LG ? LG.CONTACT : "#"}" target="_blank" rel="noopener noreferrer">${t("lg_contact")}</a><br><small class="note">${t("lg_public")}</small></p></section>`;
}
/* Offline-saved flag: versioned with the service worker's DATA cache (sw.js), so a data update is never reported as saved.
   An older flag means the user had saved an earlier copy that the update replaced. */
const OFFLINE_FLAG = KEY + ".offline.v6", OLD_OFFLINE_FLAGS = [3, 4, 5].map(v => KEY + ".offline.v" + v);
const offlineSaved = () => { try { return localStorage.getItem(OFFLINE_FLAG) === "1"; } catch (x) { return false; } };
const offlineStale = () => { try { return !offlineSaved() && OLD_OFFLINE_FLAGS.some(k => localStorage.getItem(k) === "1"); } catch (x) { return false; } };
/* Ask the service worker to store every surah file so the whole Qur'an works offline. */
function saveQuranOffline(b) {
  const sw = navigator.serviceWorker && navigator.serviceWorker.controller;
  if (!sw) { toast(t("saveqfail")); return; }
  const urls = []; for (const l of ["ar", "en", "bn", "bnt"]) for (let i = 1; i <= 114; i++) urls.push(`data/quran/${l}/${qpad(i)}.json`);
  b.disabled = true; b.textContent = t("savingq").replace("{n}", num(0));
  const on = e => { const m = e.data || {}; if (m.type !== "cache-progress") return; const pct = Math.round(m.done / m.total * 100);
    const el = document.querySelector('[data-act="savequran"]');
    if (el) el.textContent = m.done >= m.total ? "✓ " + t("savedq") : t("savingq").replace("{n}", num(pct));
    if (m.done >= m.total) { navigator.serviceWorker.removeEventListener("message", on);
      if (m.failed) { if (el) { el.disabled = false; el.textContent = t("saveq"); } toast(t("q_savefail")); return; }
      try { localStorage.setItem(OFFLINE_FLAG, "1"); for (const k of OLD_OFFLINE_FLAGS) localStorage.removeItem(k); } catch (x) {} toast(t("savedq")); } };
  navigator.serviceWorker.addEventListener("message", on);
  sw.postMessage({ type: "cache-data", urls });
}

/* ---------------- location sheet ---------------- */
function locSheet(filter = "") {
  const q = filter.trim().toLowerCase();
  const groups = [["au", t("au")], ["bd", t("bd")], ["world", t("world")]];
  const opts = groups.map(([g, lab]) => {
    const cs = CITIES.filter(c => c.g === g && (!q || c.en.toLowerCase().includes(q) || c.bn.includes(filter.trim())));
    return cs.length ? `<p class="group">${lab}</p>` + cs.map(c => `<button type="button" class="opt" data-act="city" data-id="${c.id}" aria-pressed="${st.city === c.id}">${esc(L(c))}${st.city === c.id ? " ✓" : ""}</button>`).join("") : "";
  }).join("");
  return opts || `<p class="note" style="padding:12px 4px">${t("none")}</p>`;
}
function openLoc() {
  openSheet(`<h3>${t("chooseloc")}</h3>
  <div style="display:grid;gap:10px;margin-top:12px"><button type="button" class="btn soft" data-act="gps">${ic("locate")}${t("usegps")}</button>
  <div class="search">${ic("search")}<input id="c-search" class="field" type="search" autocomplete="off" placeholder="${esc(t("csearch"))}" aria-label="${esc(t("csearch"))}"></div></div>
  <div id="city-list">${locSheet()}</div>`);
}
function locate() {
  if (!navigator.geolocation) { toast(t("nogeo")); return; }
  toast(t("locating"));
  try {
    navigator.geolocation.getCurrentPosition(p => {
      const zone = (Intl.DateTimeFormat().resolvedOptions().timeZone) || city().zone;
      st.gps = { id: "gps", lat: +p.coords.latitude.toFixed(4), lng: +p.coords.longitude.toFixed(4), zone, en: "My location", bn: "আমার অবস্থান", g: "gps" };
      st.city = "gps"; save(); closeSheet(); render(true); toast(t("locset"));
    }, () => toast(t("nogeo")), { enableHighAccuracy: false, timeout: 12000, maximumAge: 6e5 });
  } catch (e) { toast(t("nogeo")); }
}

/* ---------------- desktop ---------------- */
let sideNext = null;
const SIDE = [["today", "today", "today"], ["study_nav", "quran", "quran"], ["stories_nav", "stories", "quran/stories"], ["duas", "duas", "duas"], null,
  ["guide", "guide", "more/guide"], ["hadith", "hadith", "more/hadith"], ["calendar", "calendar", "more/calendar"], ["names99", "names", "more/names"], null,
  ["settings", "gear", "more/settings"], ["about", "info", "more/about"], ["feedback", "mail", "more/feedback"]];
function side() {
  const el = $("side"); if (!el) return;
  el.setAttribute("aria-label", t("sidebar")); // a named landmark, distinct from the reader's surah list
  if (!desk()) { el.innerHTML = ""; sideNext = null; return; }
  const s = snapshot(); sideNext = Object.assign({ day: s.p.day }, s.next);
  el.innerHTML = `<button type="button" class="brand" data-act="home" aria-label="${esc(t("brand"))}">${LOGO}<b>${t("brand")}</b></button>
  <nav class="side-nav" aria-label="${esc(t("sections"))}">${SIDE.map(x => { if (!x) return "<hr>"; const [tab, sub] = x[2].split("/"); const on = R.tab === tab && (tab === "more" ? (R.sub || null) === (sub || null) : tab === "quran" ? (R.sub === "stories") === (sub === "stories") : true); return `<button type="button" data-act="go" data-tab="${tab}"${sub ? ` data-sub="${sub}"` : ""}${on ? ' aria-current="page"' : ""}>${ic(x[1])}<span>${t(x[0])}</span></button>`; }).join("")}</nav>
  <div class="side-next"><p class="eyebrow">${t("next")}</p><b>${pName(s.next.k, isFriD(s.next.tomorrow ? s.d1 : s.d0))}</b><span class="tnum" id="side-count">${clock((s.next.at - (s.next.tomorrow ? s.d1 : s.d0).base) / 36e5)} · ${s.next.tomorrow ? t("tomorrow") : t("todayl")}</span><small class="note">${esc(cname(s.c))}</small></div>
  <p class="side-legal"><button type="button" class="linkish" data-act="go" data-tab="more" data-sub="privacy">${t("privacy")}</button> · <button type="button" class="linkish" data-act="go" data-tab="more" data-sub="terms">${t("terms")}</button></p>`;
}
function dateLine() {
  const s = snapshot();
  const g = new Intl.DateTimeFormat(LT(), { timeZone: s.c.zone, weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date(s.now));
  return g + " · " + hText(hijri(new Date(s.now + (s.now >= s.d0.abs("maghrib") ? 864e5 : 0))));
}
function readerEmpty() {
  const last = st.last && st.last.s ? st.last : null;
  return `<div class="card empty-read"><p class="ar" lang="ar" style="text-align:center;width:100%">${QM.starter[1][0]}</p><h2>${t("pickSurah")}</h2><p class="note">${t("pickSurahH")}</p><button type="button" class="btn" data-act="surah" data-s="${last ? last.s : 1}" data-a="${last ? last.a : 0}">${last ? `${t("cont")}: ${esc(sname(last.s))} ${num(last.s)}:${num(last.a)}` : t("startfat")}</button></div>`;
}
function vQuranDesk() {
  return `<div class="split"><aside class="pane-list" id="pane-list" aria-label="${esc(t("allsurahs"))}">${vQuran()}</aside><section class="pane-read" id="read-pane">${R.surah ? vReader() : readerEmpty()}</section></div>`;
}
function openSurahDesk(s, a) {
  R = Object.assign({}, R, { surah: s, ayah: a });
  try { history.pushState(R, ""); depth++; } catch (e) {}
  post = [];
  const p = $("read-pane"); p.innerHTML = vReader();
  if (!reduce) { p.classList.remove("enter-pane"); void p.offsetWidth; p.classList.add("enter-pane"); }
  document.querySelectorAll("#surah-list .rowlink").forEach(b => { if (+b.dataset.s === s) b.setAttribute("aria-current", "true"); else b.removeAttribute("aria-current"); });
  post.forEach(fn => fn());
  if (!a) { const top = p.getBoundingClientRect().top + scrollY - 90; if (scrollY > top) scrollTo({ top: Math.max(0, top), behavior: reduce ? "auto" : "smooth" }); }
}

/* Switching language or English variant keeps the page, its filters and category, the selected date and the
   reading position: the first card or verse in view stays where it was on screen. */
const KEEP_SEL = () => R.sub === "hadith" ? ".hadith" : R.tab === "duas" ? ".dua" : R.tab === "quran" && R.surah ? ".ayah" : R.sub === "names" ? ".name" : null;
function switchLang(apply) {
  const sel = KEEP_SEL(), y = scrollY;
  // The item being read: the one across a line a quarter of the way down the screen (below the sticky header).
  const line = Math.max(($("top") ? $("top").getBoundingClientRect().bottom : 0) + 40, innerHeight * 0.25);
  const items = sel ? [...document.querySelectorAll(sel)] : [];
  const keep = items.find(c => { const r = c.getBoundingClientRect(); return r.top <= line && r.bottom > line; }) || items.find(c => c.getBoundingClientRect().top > line - 40) || null;
  const off = keep ? keep.getBoundingClientRect().top : 0;
  const find = () => keep && (keep.id ? $(keep.id) : keep.dataset.i != null ? document.querySelector(`${sel}[data-i="${keep.dataset.i}"]`) : null);
  apply(); save();
  // The Qur'an reader may need to load the other translation first; it returns to this verse once loaded.
  if (keep && sel === ".ayah") { R.ayah = +keep.dataset.a; R.keepOff = off; }
  render(false);
  if (keep && sel !== ".ayah") holdPos(find, off); else if (!keep) scrollTo(0, y);
}
/* Keeps an element at the same place on screen while the new language's fonts and text settle (a Bangla or
   English font can load after the first layout). Stops as soon as the user scrolls or presses a key. */
let holdT = 0;
function holdPos(get, off) {
  const tok = ++holdT;
  const put = () => { if (tok !== holdT) return; const el = get(); if (el) { const d = el.getBoundingClientRect().top - off; if (Math.abs(d) > 1) scrollTo(0, scrollY + d); } };
  const stop = () => { if (tok === holdT) holdT++; ["wheel", "touchstart", "keydown", "pointerdown"].forEach(ev => removeEventListener(ev, stop, true)); };
  ["wheel", "touchstart", "keydown", "pointerdown"].forEach(ev => addEventListener(ev, stop, true));
  put(); requestAnimationFrame(put);
  try { document.fonts && document.fonts.ready.then(put); } catch (e) {}
  [120, 300, 700, 1200].forEach(ms => setTimeout(put, ms)); setTimeout(stop, 1300);
}

/* ---------------- events ---------------- */
document.addEventListener("click", e => {
  if (NATIVE) { const a = e.target.closest('a[target="_blank"]'); if (a && /^https?:/.test(a.href) && new URL(a.href).origin !== location.origin) { e.preventDefault(); location.href = a.href; return; } } // opens in the phone's browser
  const b = e.target.closest("[data-act]"); if (!b) { return; }
  const a = b.dataset.act, d = b.dataset;
  switch (a) {
    case "tab": if (d.tab === R.tab && !R.sub && !R.surah && !R.study) { window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }); break; } go({ tab: d.tab }); break;
    case "go": go({ tab: d.tab, sub: d.sub || null }); break;
    case "install": if (installEvt) { const ev = installEvt; installEvt = null; ev.prompt(); (ev.userChoice || Promise.resolve()).then(() => render(false), () => render(false)); } break;
    case "home": go({ tab: "today" }); break;
    case "back": if (depth > 0) { try { history.back(); break; } catch (x) {} } go(R.story ? { tab: "quran", sub: "stories" } : { tab: R.tab }, false); break;
    case "lang": switchLang(() => { st.lang = bn() ? "en" : "bn"; }); break;
    case "setlang": switchLang(() => { if (d.k === "bn") st.lang = "bn"; else { st.lang = "en"; st.loc = LOC.variant(d.k); } }); break;
    case "setmode": if (MODES.includes(d.k)) { st.mode = d.k; save(); const y = scrollY; render(false); scrollTo(0, y); } break;
    case "setth": {
      const lightG = d.g === "light", ok = lightG ? LIGHT_TH.includes(d.k) : DARK_TH.includes(d.k);
      if (!ok) break;
      if (lightG) st.lightTheme = d.k; else st.darkTheme = d.k;
      // Picking from the other group switches the appearance so the choice is visible at once.
      if (schemeNow() !== (lightG ? "light" : "dark")) st.mode = lightG ? "light" : "dark";
      save(); const y = scrollY; render(false); scrollTo(0, y); break; }
    case "setglass": if (GLASS.includes(d.k)) { st.glass = d.k; save(); const y = scrollY; render(false); scrollTo(0, y); } break;
    case "setmotion": if (MOTION.includes(d.k)) { st.motion = d.k; save(); const y = scrollY; render(false); scrollTo(0, y); } break;
    case "setscene": if (SCENES.includes(d.k)) { st.scene = d.k; save(); const y = scrollY; render(false); scrollTo(0, y); } break;
    case "setasr": st.asr = +d.k; save(); render(false); break;
    case "hadj": st.hadj = Math.max(-2, Math.min(2, st.hadj + +d.d)); save(); render(false); break;
    case "gloss": st.gloss = !st.gloss; save(); b.setAttribute("aria-checked", st.gloss); if (R.tab === "quran" || R.tab === "today") { const y = scrollY; render(false); scrollTo(0, y); } break;
    case "tl": st.tl = !st.tl; save(); b.setAttribute("aria-checked", st.tl); if (R.tab === "quran" || R.tab === "duas") { const y = scrollY; render(false); scrollTo(0, y); } break;
    case "aa": aaSheet(); break;
    case "closesheet": closeSheet(); break;
    case "name": nameSheet(+d.i, b); break;
    case "savequran": saveQuranOffline(b); break;
    case "loc": openLoc(); break;
    case "gps": locate(); break;
    case "city": { st.city = d.id; const c = city(); if (c.g === "bd") { st.method = "KAR"; st.asr = 2; } else if (c.g === "au") { st.method = "MWL"; st.asr = 1; } save(); closeSheet(); render(true); break; }
    case "trk": {
      if (!snap) break;
      const k = trackKey(snap);
      if (k !== trackKey(snapshot()) && !tSel) { render(false); break; }   // the day changed under an open page: redraw first
      const r = XT.togglePrayer(st.log, k, d.k); st.log = r.log; pruneLog(snap); save();
      const rc = b.getBoundingClientRect(), y = scrollY; justTicked = r.done ? d.k : null; render(false); scrollTo(0, y); justTicked = null;
      if (r.done) { buzz(15); const o = st.log[k]; if (k === snap.key && PRAYERS.every(p => o[p])) { burst(rc.left + rc.width / 2, rc.top + rc.height / 2); toast(t("alldone")); buzz([30, 50, 30]); } else if (k !== snap.key) toast(t("t_saved").replace("{d}", longDay(k))); }
      break;
    }
    case "tday": { if (!snap) break; const cur = trackKey(snap); tSel = d.k === "today" ? null : XT.shift(cur, d.k === "prev" ? -1 : 1); if (tSel && XT.clamp(tSel, XT.shift(snap.key, -(KEEP_DAYS - 1)), snap.key) === snap.key) tSel = null; const y = scrollY; render(false); scrollTo(0, y); break; }
    case "tsel": { if (!snap) break; tSel = d.k === snap.key ? null : d.k; const y = scrollY; render(false); scrollTo(0, y); break; }
    case "xw": {
      if (!snap) break;
      // If the date has changed since the page was drawn, redraw for the new day instead of recording on the old one.
      if (snapshot().key !== snap.key) { render(false); break; }
      const k = d.k, r = XT.toggle(st.xlog, snap.key, k);
      st.xlog = XT.prune(r.log, new Set(lastDays(snap, 120))); save();
      // Update the row in place so keyboard focus stays on the button; the effect runs only after the state is saved.
      const li = b.closest("li"), c = li && li.querySelector(".xc"), xs = li && li.querySelector(".xs");
      b.setAttribute("aria-pressed", r.done); if (c) c.textContent = xCount(k, snap); if (xs) xs.outerHTML = xStrip(k, snap);
      b.classList.remove("just"); if (li) li.classList.remove("just");
      if (r.done) { void b.offsetWidth; b.classList.add("just"); if (li) li.classList.add("just"); buzz(15); toast(t("x_done")); }
      else toast(t("x_undone"));
      break;
    }
    case "surah": closeSheet(); if (desk() && R.tab === "quran" && R.sub === "all") { openSurahDesk(+d.s, +d.a || 0); break; } go({ tab: "quran", sub: "all", surah: +d.s, ayah: +d.a || 0 }); break;
    case "story": go({ tab: "quran", sub: "stories", story: d.k }); break;
    case "sgrp": sgGroup = d.k; refreshStories(); break;
    case "sgjump": { const h = $("sg-ref-h"); if (h) { h.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" }); h.focus({ preventScroll: true }); } break; }
    case "study": if (desk() && R.tab === "quran" && R.sub !== "all") { openStudyDesk(+d.s); break; } go({ tab: "quran", study: +d.s }); break;
    case "stg": stGroup = d.k; stTheme = "all"; refreshStudy(); break;
    case "stt": stTheme = d.k; refreshStudy(); break;
    case "qf": qFilter = d.k; document.querySelectorAll('[data-act="qf"]').forEach(x => x.setAttribute("aria-pressed", x.dataset.k === qFilter)); $("surah-list").innerHTML = listRows(); break;
    case "lazyretry": render(true); break;
    case "retry": { const i = R.surah || (votdPick && votdPick.s); if (i) { delete QERR["ar:" + i]; delete QERR[st.lang + ":" + i]; delete QERR["bnt:" + i]; } render(false); break; }
    case "markread": { const i = R.surah; const was = st.read.includes(i); st.read = was ? st.read.filter(x => x !== i) : st.read.concat(i); save(); if (!was) { const rc = b.getBoundingClientRect(); burst(rc.left + rc.width / 2, rc.top); buzz(20); } b.classList.toggle("soft", !was); b.textContent = !was ? "✓ " + t("readmark") : t("markread"); break; }
    case "bm": { const id = d.id, on = st.bm.includes(id); st.bm = on ? st.bm.filter(x => x !== id) : st.bm.concat(id); save(); b.setAttribute("aria-pressed", !on); toast(on ? t("bmremoved") : t("bmadded")); break; }
    case "copyayah": { const k = +d.k, i = R.surah, ar = QS["ar:" + i], tr = QS[st.lang + ":" + i]; if (!ar) break; copyText(`${ar[k]}\n${tr ? tr.t[k] + "\n" : ""}— ${sname(i)} ${i}:${k + 1}\n${trCredit()}`); break; }
    case "hcat": hCat = d.k; document.querySelectorAll('[data-act="hcat"]').forEach(x => x.setAttribute("aria-pressed", x.dataset.k === hCat)); $("hadith-list").innerHTML = hadithList(); fitClamps(); break;
    case "hcol": if (st.hcol !== d.k) { st.hcol = d.k; save(); render(false); scrollTo(0, 0); fitClamps(); } break;
    case "nwgo": nwGo(+d.n); break;
    case "nwread": { const n = +d.n, was = st.nwread.includes(n); st.nwread = was ? st.nwread.filter(x => x !== n) : st.nwread.concat(n); save();
      b.setAttribute("aria-pressed", !was); b.classList.toggle("soft", !was); b.textContent = !was ? "✓ " + t("nw_done") : t("nw_mark");
      const jb = document.querySelector(`.nw-jump [data-n="${n}"]`); if (jb) { jb.classList.toggle("done", !was); jb.setAttribute("aria-label", t("nw_no").replace("{n}", num(n)).replace("{t}", num(NW_N)) + (!was ? ", " + t("nw_done") : "")); }
      const pg = $("nw-prog"), bar = $("nw-bar"); if (pg) pg.textContent = nwProg(); if (bar) bar.style.width = (st.nwread.length / NW_N * 100).toFixed(1) + "%";
      if (!was) buzz(15); break; }
    case "hgo": { st.hcol = "general"; hCat = "all"; save(); render(false); fitClamps(); const el = $("hd-" + d.id); if (el) { scrollTo(0, Math.max(0, el.getBoundingClientRect().top + scrollY - 84)); const h = $("hd-h-" + d.id); if (h) { h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true }); } } break; }
    case "hdmore": { const open = !hOpen.has(d.id); if (open) hOpen.add(d.id); else hOpen.delete(d.id); toggleClamp(b, open); break; }
    case "dcat": dCat = d.k; document.querySelectorAll('[data-act="dcat"]').forEach(x => x.setAttribute("aria-pressed", x.dataset.k === dCat)); $("dua-list").innerHTML = duaList(); fitDuas(); break;
    case "duamore": { const i = +d.i, c = b.closest(".dua"), open = !dOpen.has(i); if (open) dOpen.add(i); else dOpen.delete(i);
      c.classList.toggle("open", open); b.setAttribute("aria-expanded", open); b.textContent = t(open ? "readless" : "readmore");
      if (!open) { fitDuas(); const r = c.getBoundingClientRect(); if (r.top < 0) c.scrollIntoView({ block: "start", behavior: reduce ? "auto" : "smooth" }); }
      break; }
    case "forbinfo": openSheet(`<h3>${t("fw_title")}</h3><div class="fw-sheet"><p>${t("fw_b1")}</p><p>${t("fw_b2")}</p><p class="note">${t("fw_b3")}</p>
      <ul class="fw-src"><li><a href="https://sunnah.com/muslim:831" target="_blank" rel="noopener noreferrer">${t("fw_s1")}</a></li><li><a href="https://sunnah.com/bukhari:586" target="_blank" rel="noopener noreferrer">${t("fw_s2")}</a></li><li><a href="https://binbaz.org.sa/fatwas/18495" target="_blank" rel="noopener noreferrer">${t("fw_s3")}</a></li></ul>
      <p class="note">${t("fw_checked")}</p></div>`, b); break;
    case "vxmore": { const open = vxOpen !== d.id; vxOpen = open ? d.id : null; toggleClamp(b, open); break; }
    case "fav": { const i = +d.i, on = st.fav.includes(i); st.fav = on ? st.fav.filter(x => x !== i) : st.fav.concat(i); save(); b.setAttribute("aria-pressed", !on); if (!on && !reduce) { b.animate && b.animate([{ transform: "scale(1)" }, { transform: "scale(1.3)" }, { transform: "scale(1)" }], { duration: 320, easing: "cubic-bezier(.34,1.56,.64,1)" }); } if (dCat === "fav") { $("dua-list").innerHTML = duaList(); fitDuas(); } break; }
    case "copydua": { const o = shItem("dua", +d.i); if (o) copyText(shText(o)); break; }
    case "shcopyitem": { const o = shItem(d.k, d.key); if (o) copyText(shText(o)); break; }
    case "share": shareSheet(d.k, d.key, b); break;
    case "fbcopy": try { navigator.clipboard.writeText(FB_EMAIL).then(() => toast(t("fb_copied")), () => toast(t("copyfail"))); } catch (x) { toast(t("copyfail")); } break;
    case "shcopy": { const o = shCur && shItem(shCur.kind, shCur.key); if (o) copyText(shText(o)); break; }
    case "shlink": shLink(); break;
    case "shnative": shNative(); break;
    case "shjpg": shJpg(false); break;
    case "shjpgshare": shJpg(true); break;
    case "shpdf": shPdf(); break;
    case "cal": { let [y, m] = calM; m += +d.d; if (m < 1) { m = 12; y--; } if (m > 12) { m = 1; y++; } calM = [y, m]; hidePop(); render(false); break; }
    case "calday": { calSel = d.k; document.querySelectorAll(".cal .c[data-k]").forEach(c => { const on = c.dataset.k === d.k; c.setAttribute("aria-pressed", on); c.tabIndex = on ? 0 : -1; });
      const [y, m, dd] = XT.parts(d.k), det = $("cal-detail"); if (det) det.innerHTML = calDetail(calInfo(y, m, dd, snap || snapshot()));
      if (popPointer === "touch") hidePop(); break; }
    case "caltoday": { const s = snapshot(); calGo(s.key, true); break; }
    case "calgo": calGo(d.k, true); break;
    case "school": st.school = d.k; save(); render(false); break;
    case "zkb": st.zk.basis = d.k === "gold" ? "gold" : "silver"; save(); { const y = scrollY; render(false); scrollTo(0, y); } break;
    case "zkw": st.zk.w = ZK.WEIGHTS[d.k] ? d.k : "tola"; save(); { const y = scrollY; render(false); scrollTo(0, y); } break;
    case "wipe": if (b.dataset.armed) { try { localStorage.removeItem(KEY); } catch (x) {} st = JSON.parse(JSON.stringify(DEF)); render(true); toast(t("resetdone")); } else { b.dataset.armed = "1"; b.textContent = t("tapagain"); } break;
  }
});
$("scrim").addEventListener("click", closeSheet);
document.addEventListener("keydown", e => {
  if (e.key === "Escape") { closeSheet(); return; }
  if (e.key === "Tab") { trapSheet(e); return; }
  const tg = e.target, typing = tg && (tg.tagName === "INPUT" || tg.tagName === "TEXTAREA" || tg.tagName === "SELECT" || tg.isContentEditable);
  if (typing || e.metaKey || e.ctrlKey || e.altKey) return;
  if (e.key === "/") { const s = document.querySelector('#view input[type="search"]'); if (s) { e.preventDefault(); s.focus(); } }
  else if (R.sub === "calendar" && calM && tg && tg.closest && tg.closest(".cal .c[data-k]")) {
    // Grid keys on a day: arrows move by day / week (crossing months), Page Up/Down by month, Home/End to the month's ends.
    const k = tg.dataset.k, [y, m, d] = XT.parts(k), dim = new Date(Date.UTC(y, m, 0)).getUTCDate();
    const step = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[e.key];
    let to = null;
    if (step) to = XT.shift(k, step);
    else if (e.key === "PageUp" || e.key === "PageDown") { let mm = m + (e.key === "PageUp" ? -1 : 1), yy = y; if (mm < 1) { mm = 12; yy--; } if (mm > 12) { mm = 1; yy++; } to = dkey(yy, mm, Math.min(d, new Date(Date.UTC(yy, mm, 0)).getUTCDate())); }
    else if (e.key === "Home") to = dkey(y, m, 1); else if (e.key === "End") to = dkey(y, m, dim);
    if (to) { e.preventDefault(); const [ty, tm] = XT.parts(to); if (ty === y && tm === m) { const el = document.querySelector(`.cal .c[data-k="${to}"]`); if (el) { tg.tabIndex = -1; el.tabIndex = 0; el.focus(); } } else calGo(to, true); }
  }
  else if (R.sub === "calendar" && calM && (e.key === "ArrowLeft" || e.key === "ArrowRight")) { let [y, m] = calM; m += e.key === "ArrowLeft" ? -1 : 1; if (m < 1) { m = 12; y--; } if (m > 12) { m = 1; y++; } calM = [y, m]; render(false); }
});
if (mq.addEventListener) mq.addEventListener("change", () => render(false));
/* Dua previews depend on the card width and on the fonts, so re-check them when either changes. */
let fitT = 0;
addEventListener("resize", () => { clearTimeout(fitT); fitT = setTimeout(() => { fitDuas(); fitClamps(); }, 150); });
try { document.fonts && document.fonts.ready.then(() => { fitDuas(); fitClamps(); }); } catch (e) {}
setInterval(() => {
  if (!desk() || document.hidden || !sideNext) return;
  const el = $("side-count"), now = Date.now(); if (!el) return;
  if (now >= sideNext.at || zoneParts(city().zone, new Date(now)).day !== sideNext.day) side();
}, 1000);
document.addEventListener("input", e => {
  const el = e.target;
  if (el.id === "q-search") { qQuery = el.value; $("surah-list").innerHTML = listRows(); }
  if (el.id === "st-search") { stQuery = el.value; refreshStudy(); }
  else if (el.id === "sg-search") { sgQuery = el.value; refreshStories(); }
  else if (el.id === "d-search") { dQuery = el.value; $("dua-list").innerHTML = duaList(); fitDuas(); }
  else if (el.id === "n-search") { nQuery = el.value; $("names-list").innerHTML = namesList(); }
  else if (el.id === "c-search") { $("city-list").innerHTML = locSheet(el.value); }
  else if (el.id === "ar-size") { st.ar = +el.value; save(); document.documentElement.style.setProperty("--ar-scale", st.ar); }
  else if (el.id === "fp-note") { const k = el.dataset.k, v = el.value.slice(0, 140), o = Object.assign({}, st.fplan[k]); if (v) o.n = v; else delete o.n; if (o.f || o.n) st.fplan[k] = o; else delete st.fplan[k]; save(); const cf = $("cp-fasts"); if (cf) cf.innerHTML = calFasts(snap || snapshot()); }
  else if (el.dataset.zk) { st.zk.v[el.dataset.zk] = el.value; save(); $("zk-result").innerHTML = zakatCalc(); }
  else if (el.dataset.zkp) { st.zk.price = el.value; save(); $("zk-result").innerHTML = zakatCalc(); }
});
document.addEventListener("change", e => {
  const el = e.target;
  if (el.id === "fp-check") { const k = el.dataset.k, o = Object.assign({}, st.fplan[k]); if (el.checked) o.f = true; else delete o.f; if (o.f || o.n) st.fplan[k] = o; else delete st.fplan[k]; save();
    const c = document.querySelector(`.cal .c[data-k="${k}"]`); if (c) c.classList.toggle("fp", !!o.f); const cf = $("cp-fasts"); if (cf) cf.innerHTML = calFasts(snap || snapshot()); toast(t(el.checked ? "fp_on" : "fp_off")); return; }
  if (el.id === "method") { st.method = el.value; save(); toast(t("saved2")); }
  else if (el.id === "zk-cur") { st.zk.cur = el.value; save(); $("zk-result").innerHTML = zakatCalc(); }
  else if (el.id === "t-date" && snap) { const k = XT.clamp(el.value, XT.shift(snap.key, -(KEEP_DAYS - 1)), snap.key); tSel = k === snap.key ? null : k; const y = scrollY; render(false); scrollTo(0, y); const f = $("t-date"); if (f) f.focus({ preventScroll: true }); }
});

/* ---------------- boot ---------------- */
const LOGO = `<svg viewBox="0 0 512 512" aria-hidden="true"><rect width="512" height="512" rx="104" fill="#0E6B5C"/><clipPath id="ie-door"><path d="M150 392V248A140 140 0 0 1 256 112.2A140 140 0 0 1 362 248V392Z"/></clipPath><g clip-path="url(#ie-door)"><rect width="512" height="512" fill="#167C68"/><circle cx="256" cy="392" r="84" fill="#F2BE5C"/></g><path d="M150 392V248A140 140 0 0 1 256 112.2A140 140 0 0 1 362 248V392Z" fill="none" stroke="#F6EEDC" stroke-width="40" stroke-linejoin="round"/><path d="M118 393H394" stroke="#F6EEDC" stroke-width="40" stroke-linecap="round"/></svg>`;
const g0 = !d0 && hashGroup(h0);
if (g0 && !lazyDone.has(g0)) { // opened from a shared link: show that page loading, then open the item
  R = Object.assign({ sub: null, surah: 0, ayah: 0, study: 0, story: null }, { stories: { tab: "quran", sub: "stories" }, names: { tab: "more", sub: "names" }, hadith: { tab: "more", sub: "hadith" } }[g0]);
  render(true); deepWait(h0);
} else {
  if (d0) deepPre(d0);
  render(true);
  if (d0) deepPost(d0);
}
if (!phone()) Object.keys(LAZY).forEach(g => need(g).catch(() => {})); // desktop: load all page data now
if (!NATIVE && "serviceWorker" in navigator && document.querySelector('link[rel="manifest"]') && window.top === window) {
  // Registered after the page has loaded, so its precache (about 1 MB, for offline use) never competes with the first screen.
  const reg = () => { try { navigator.serviceWorker.register("sw.js").catch(() => {}); } catch (e) {} };
  if (document.readyState === "complete") setTimeout(reg, 1500); else addEventListener("load", () => setTimeout(reg, 1500), { once: true });
}
})();
