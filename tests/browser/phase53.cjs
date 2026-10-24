// Phase 5.3 browser checks (not part of `npm test`, which has no dependencies).
// Needs Playwright and a running server:  npm start   then   node tests/browser/phase53.cjs [http://localhost:8080/]
// Set CHROMIUM=/path/to/chromium to use a specific browser. Uses a controlled clock in Australia/Sydney (UTC+11 in October).
const { chromium, devices } = require("playwright");
const base = process.argv[2] || "http://localhost:8080/";
const KEY = "dinsathi.web.v1";
let pass = 0, fail = 0; const errs = [];
const ok = (name, cond, detail) => { cond ? pass++ : fail++; console.log(`${cond ? "PASS" : "FAIL"} ${name}${!cond && detail ? " :: " + detail : ""}`); };

async function open(b, { time, state = {}, hash = "#today", desk = false, zone = "Australia/Sydney", reduced = false, scheme = "light", firstPaint = false }) {
  const ctx = await b.newContext({ ...(desk ? { viewport: { width: 1280, height: 900 } } : devices["Pixel 7"]), timezoneId: zone, serviceWorkers: "block", reducedMotion: reduced ? "reduce" : "no-preference", colorScheme: scheme });
  const p = await ctx.newPage();
  p.on("pageerror", e => errs.push(`${hash} ${e.message}`)); p.on("console", m => { if (m.type() === "error") errs.push(`${hash} ${m.text()}`); });
  if (time) await p.clock.install({ time: new Date(time) });
  await p.addInitScript(([k, s]) => { if (!sessionStorage.getItem("seeded")) { sessionStorage.setItem("seeded", "1"); localStorage.setItem(k, JSON.stringify(s)); } }, [KEY, state]);
  if (firstPaint) await p.addInitScript(() => { new MutationObserver((m, o) => { if (document.body) { window.__firstTheme = document.documentElement.getAttribute("data-theme"); window.__firstPal = document.documentElement.getAttribute("data-palette"); o.disconnect(); } }).observe(document, { childList: true, subtree: true }); });
  await p.goto(base + hash); if (time) await p.clock.runFor(1500); else await p.waitForTimeout(1200);
  return { p, ctx };
}
const toMin = s => { const m = s.match(/(\d+):(\d+)\s*(am|pm|AM|PM)/); let h = +m[1] % 12; if (/pm/i.test(m[3])) h += 12; return h * 60 + +m[2]; };
const times = p => p.evaluate(() => Object.fromEntries([...document.querySelectorAll(".times li")].map(li => [li.querySelector(".nm").firstChild.textContent.trim(), li.querySelector(".tm").firstChild.textContent.replace(/\s+/g, " ").trim()])));
const syd = (date, min) => `${date}T${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}:00+11:00`;
const secs = s => { const m = /(\d+):(\d\d):(\d\d)/.exec(s || ""); return m ? +m[1] * 3600 + +m[2] * 60 + +m[3] : NaN; };
const card = p => p.evaluate(() => ({ cur: document.querySelector("#cur-name")?.textContent.trim(), lbl: document.querySelector(".cd .lbl")?.textContent.trim(), cd: document.querySelector("#count-next")?.textContent.trim(), off: !!document.querySelector(".cd-off"), forb: document.querySelector("#forb-warn")?.textContent.trim() || "", dates: document.querySelector(".sky .dates")?.textContent || "", curCount: !!document.querySelector("#count-cur") }));

(async () => {
  const b = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
  const D = "2026-10-19";

  /* Today's times for Sydney, read from the page's own schedule */
  let { p, ctx } = await open(b, { time: syd(D, 9 * 60), state: { lang: "en", city: "syd" } });
  const T = Object.fromEntries(Object.entries(await times(p)).map(([k, v]) => [k, toMin(v)]));
  ok("schedule read for Sydney", ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"].every(k => Number.isFinite(T[k])), JSON.stringify(T));
  await ctx.close();

  /* 1. Countdown: ticks, names the next prayer, switches at a prayer, crosses midnight */
  ({ p, ctx } = await open(b, { time: syd(D, T.Asr + 30), state: { lang: "en", city: "syd" } }));
  let c0 = await card(p); await p.clock.runFor(3000); let c1 = await card(p);
  ok("countdown names the next prayer's start", c0.cur === "Asr" && c0.lbl === "Maghrib begins in", JSON.stringify(c0));
  ok("countdown ticks every second", secs(c0.cd) - secs(c1.cd) >= 2 && secs(c0.cd) - secs(c1.cd) <= 4, `${c0.cd} -> ${c1.cd}`);
  ok("countdown matches the next start time (within a minute)", Math.abs(secs(c0.cd) - (T.Maghrib - T.Asr - 30) * 60) <= 60, `${c0.cd} vs ${T.Maghrib - T.Asr - 30} min`);
  ok("no countdown to an end of the current prayer", !c0.curCount && !/end/i.test(c0.lbl));
  await ctx.close();
  ({ p, ctx } = await open(b, { time: syd(D, T.Maghrib - 1), state: { lang: "en", city: "syd" } }));
  await p.clock.runFor(75000); c1 = await card(p);
  ok("at Maghrib the card and countdown move on to Isha without reload", c1.cur === "Maghrib" && c1.lbl === "Isha begins in" && secs(c1.cd) > 0, JSON.stringify(c1));
  await ctx.close();
  ({ p, ctx } = await open(b, { time: `${D}T23:59:50+11:00`, state: { lang: "en", city: "syd" } }));
  c0 = await card(p); await p.clock.runFor(15000); c1 = await card(p);
  ok("before midnight after Isha: counting down to Fajr", c0.cur === "Isha" && c0.lbl === "Fajr begins in", JSON.stringify(c0));
  ok("across midnight: same target, keeps counting, date moves on", c1.lbl === "Fajr begins in" && Math.abs(secs(c0.cd) - secs(c1.cd) - 15) <= 2 && /20 October/.test(c1.dates), `${c0.cd} -> ${c1.cd} ${c1.dates}`);
  await ctx.close();
  ({ p, ctx } = await open(b, { time: syd(D, T.Isha + 60), state: { lang: "bn", city: "syd" } }));
  c0 = await card(p);
  ok("Bangla countdown uses Bangla digits and label", /[০-৯]/.test(c0.cd) && /শুরু হতে বাকি/.test(c0.lbl), JSON.stringify(c0));
  await ctx.close();

  /* 2. Prohibited-time warnings at the boundaries (one page, the clock moves forward) */
  ({ p, ctx } = await open(b, { time: syd(D, T.Sunrise - 12), state: { lang: "en", city: "syd" } }));
  const step = async min => { const now = await p.evaluate(() => Date.now()); const target = new Date(syd(D, min)).getTime(); await p.clock.fastForward(target - now); await p.clock.runFor(1500); return (await card(p)).forb; };
  ok("12 min before sunrise: no warning", (await card(p)).forb === "");
  ok("8 min before sunrise: advance notice", /From sunrise at/.test(await step(T.Sunrise - 8)));
  ok("just after sunrise: avoid until the sun has risen", /^Sunrise: voluntary prayer is avoided/.test(await step(T.Sunrise + 2)));
  ok("17 min after sunrise: cleared", (await step(T.Sunrise + 17)) === "");
  ok("15 min before Dhuhr: advance notice", /until Dhuhr at/.test(await step(T.Dhuhr - 15)));
  ok("6 min before Dhuhr: sun at its zenith", /^Sun at its zenith/.test(await step(T.Dhuhr - 6)));
  ok("Dhuhr has begun: cleared", (await step(T.Dhuhr + 2)) === "");
  ok("after Asr, Asr not ticked: no note", (await step(T.Asr + 10)) === "");
  ok("22 min before Maghrib: advance notice", /until sunset at/.test(await step(T.Maghrib - 22)));
  ok("10 min before Maghrib: sun setting", /^Sun setting/.test(await step(T.Maghrib - 10)));
  ok("after sunset: cleared", (await step(T.Maghrib + 2)) === "");
  const wcss = await p.evaluate(() => { const e = document.querySelector(".cd"); return e ? getComputedStyle(e).fontWeight : ""; });
  ok("countdown line is present in the evening", !!wcss);
  await ctx.close();
  ({ p, ctx } = await open(b, { time: syd(D, T.Asr + 10), state: { lang: "en", city: "syd", log: { [D]: { asr: true } } } }));
  let f = await card(p);
  ok("Asr ticked: after-Asr note, compact and not bold", /You have marked Asr as prayed/.test(f.forb) && await p.evaluate(() => +getComputedStyle(document.querySelector("#forb-warn")).fontWeight < 600), f.forb);
  await p.click('#forb-warn [data-act="forbinfo"]'); await p.waitForTimeout(400);
  const sheet = await p.textContent("#sheet");
  ok("Why? opens sources, scope and method", /Sahih Muslim 831/.test(sheet) && /voluntary \(nafl\)/.test(sheet) && /approximations/.test(sheet), sheet.slice(0, 120));
  await ctx.close();
  ({ p, ctx } = await open(b, { time: syd(D, T.Fajr + 20), state: { lang: "en", city: "syd", log: { [D]: { fajr: true } } } }));
  ok("Fajr ticked: after-Fajr note until the sun has risen", /You have marked Fajr as prayed/.test((await card(p)).forb));
  await ctx.close();

  /* 3. Unreliable times (polar day): no countdown digits, no prohibited-time warning */
  ({ p, ctx } = await open(b, { time: "2026-06-21T12:30:00+02:00", zone: "Europe/Oslo", state: { lang: "en", city: "gps", gps: { id: "gps", lat: 69.65, lng: 18.96, zone: "Europe/Oslo", en: "My location", bn: "আমার অবস্থান", g: "gps" } } }));
  f = await card(p);
  ok("polar day: countdown replaced by a plain note, no warning invented", f.off && !f.cd && f.forb === "", JSON.stringify(f));
  await ctx.close();

  /* 4. Appearance: system preference, live change, persistence, no flash */
  ({ p, ctx } = await open(b, { state: { lang: "en" }, hash: "#more/settings", scheme: "dark", firstPaint: true }));
  ok("System mode follows a dark OS setting from the first paint", await p.evaluate(() => window.__firstTheme) === "dark" && await p.evaluate(() => document.documentElement.dataset.theme) === "dark");
  await p.emulateMedia({ colorScheme: "light" }); await p.waitForTimeout(200);
  ok("System mode follows an OS change without reload", await p.evaluate(() => document.documentElement.dataset.theme) === "light");
  // Face 7 (intentional): Burgundy became the dark-only Plum Dusk; themes are chosen per appearance with setth.
  await p.click('[data-act="setmode"][data-k="dark"]'); await p.click('[data-act="setth"][data-k="plum"]'); await p.waitForTimeout(300);
  await p.reload({ waitUntil: "domcontentloaded" });
  ok("chosen mode and palette are applied before first paint after reload", await p.evaluate(() => [window.__firstTheme, window.__firstPal].join()) === "dark,plum");
  await p.waitForTimeout(600);
  await p.emulateMedia({ colorScheme: "light" }); await p.waitForTimeout(200);
  ok("an explicit Dark mode ignores the OS setting", await p.evaluate(() => document.documentElement.dataset.theme) === "dark");
  for (const hh of ["#today", "#more/hadith", "#more/calendar"]) { await p.goto(base + hh); await p.waitForTimeout(300); }
  ok("palette kept on every page", await p.evaluate(() => document.documentElement.dataset.palette) === "plum");
  await p.goto(base + "#more/settings"); await p.waitForTimeout(300);
  ok("settings show the separate Appearance and Theme controls, pressed state correct", await p.getAttribute('[data-act="setmode"][data-k="dark"]', "aria-pressed") === "true" && await p.getAttribute('[data-act="setth"][data-k="plum"]', "aria-pressed") === "true");
  await ctx.close();
  ({ p, ctx } = await open(b, { state: { lang: "en", theme: "indigo" }, hash: "#today", firstPaint: true }));
  ok("Phase 5.2 setting 'indigo' migrates to Indigo palette in dark mode", await p.evaluate(() => [window.__firstTheme, window.__firstPal].join()) === "dark,indigo");
  await ctx.close();

  /* 5. Zakat. Face 7 (intentional): zakat was removed from the UI. The old link falls back to More, nothing links to it,
     and saved zakat values (st.zk) are kept untouched. */
  ({ p, ctx } = await open(b, { state: { lang: "en", zk: { cur: "GBP", basis: "gold", w: "g85", price: "70", v: { cash: "1234" } } }, hash: "#more/zakat", desk: true }));
  ok("zakat: old #more/zakat link opens More, not a calculator", await p.locator(".v-more").count() === 1 && await p.locator("#zk-result").count() === 0);
  ok("zakat: no menu or sidebar link remains", await p.locator('[data-sub="zakat"], a[href*="zakat"]').count() === 0);
  await p.goto(base + "#more/settings"); await p.waitForTimeout(400);
  const zs = JSON.parse(await p.evaluate(k => localStorage.getItem(k), KEY) || "{}").zk || {};
  ok("zakat: saved values are kept", zs.cur === "GBP" && zs.v && zs.v.cash === "1234", JSON.stringify(zs));
  await ctx.close();

  /* 6. Calendar layout */
  ({ p, ctx } = await open(b, { time: syd(D, 600), state: { lang: "en", fplan: { "2026-10-24": { f: true } } }, hash: "#more/calendar", desk: true }));
  const L = await p.evaluate(() => { const r = s => document.querySelector(s).getBoundingClientRect(); const a = r(".cal-card"), s = r(".cal-side"), w = r(".wd-card"); return { at: a.top, st: s.top, ab: a.bottom, sb: s.bottom, wl: w.left, al: a.left, wr: w.right, sr: s.right, wt: w.top }; });
  ok("desktop: calendar and side column start and end level", Math.abs(L.at - L.st) < 1 && Math.abs(L.ab - L.sb) < 2, JSON.stringify(L));
  ok("desktop: White Days spans the full width below", Math.abs(L.wl - L.al) < 1 && Math.abs(L.wr - L.sr) < 1 && L.wt > L.ab, JSON.stringify(L));
  const ev = await p.evaluate(() => { const h = [...document.querySelectorAll(".wd-src li")].map(x => Math.round(x.getBoundingClientRect().height)); return h; });
  ok("evidence cards aligned in pairs", ev.length === 4 && ev[0] === ev[1] && ev[2] === ev[3], ev.join(","));
  ok("planner lists the planned fast", /Sat, 24 Oct/.test(await p.textContent("#cp-fasts")));
  await p.click('.cal .c[data-k="2026-10-28"]'); await p.waitForTimeout(150); await p.check("#fp-check"); await p.waitForTimeout(150);
  ok("ticking a day updates the planner at once", /Wed, 28 Oct/.test(await p.textContent("#cp-fasts")));
  await p.click('#cp-fasts [data-k="2026-10-24"]'); await p.waitForTimeout(150);
  ok("a planned-fast chip selects that day", /24 October/.test(await p.textContent("#cal-detail")));
  await ctx.close();
  for (const [lang, loc] of [["en", "en-US"], ["bn", "en-IN"]]) {
    ({ p, ctx } = await open(b, { time: syd(D, 600), state: { lang, loc }, hash: "#more/calendar" }));
    ok(`mobile ${lang}/${loc}: calendar fits, no horizontal scroll, order calendar → day → planner → White Days`, await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth) && await p.evaluate(() => { const y = s => document.querySelector(s).getBoundingClientRect().top; return y(".cal-card") < y("#cal-detail") && y("#cal-detail") < y(".cal-plan") && y(".cal-plan") < y(".wd-card"); }));
    await ctx.close();
  }

  /* 7. Hadith collections */
  ({ p, ctx } = await open(b, { state: { lang: "en" }, hash: "#more/hadith", desk: true }));
  ok("general library: 40 cards by default", await p.locator(".hadith").count() === 40);
  await p.click('[data-act="hcol"][data-k="nawawi"]'); await p.waitForTimeout(300);
  ok("An-Nawawi's Forty: 42 numbered cards, kept apart from the general list", await p.locator(".hadith.nw").count() === 42 && await p.locator(".hadith:not(.nw)").count() === 0 && await p.locator(".hd-cats").count() === 0);
  const firstNos = await p.evaluate(() => [...document.querySelectorAll(".hadith.nw .nw-no")].map(x => +x.textContent));
  ok("numbered 1 to 42 in order", firstNos.length === 42 && firstNos.every((n, i) => n === i + 1));
  await p.click('.nw-jump [data-n="20"]'); await p.waitForTimeout(900);
  const j = await p.evaluate(() => ({ top: document.getElementById("nw-20").getBoundingClientRect().top, focus: document.activeElement.id }));
  ok("jump list moves to the hadith and focuses its heading", j.top > 40 && j.top < 140 && j.focus === "nw-h-20", JSON.stringify(j));
  await p.click('#nw-20 [data-act="nwread"]'); await p.click('#nw-21 [data-act="nwread"]'); await p.waitForTimeout(200);
  ok("marking read updates progress and the jump list", /2 of 42 read/.test(await p.textContent("#nw-prog")) && await p.locator(".nw-jump .done").count() === 2);
  const flagged = await p.evaluate(() => [...document.querySelectorAll(".hadith.nw")].filter(c => c.querySelector(".nw-flag")).map(c => c.id.slice(3)).join());
  ok("grades for review are flagged on the card", flagged === "12,18,30,31,32,33,39,41,42", flagged);
  ok("Hasan and Sahih shown apart", await p.locator("#nw-12 .nw-gr.hasan").count() === 1 && await p.locator("#nw-1 .nw-gr.sahih").count() === 1);
  ok("no.11 Arabic has no private-use glyph on screen", await p.evaluate(() => !/[-]/.test(document.querySelector("#nw-11 .hd-ar").textContent)));
  ok("shared no.15 shows the general library's text", (await p.textContent("#nw-15 .hd-tr")).includes("Whoever believes in Allah and the Last Day"));
  await p.reload(); await p.waitForTimeout(900);
  ok("collection choice and progress persist after reload", await p.locator(".hadith.nw").count() === 42 && /2 of 42 read/.test(await p.textContent("#nw-prog")));
  await p.click('.top [data-act="lang"], [data-act="lang"]'); await p.waitForTimeout(900);
  ok("language switch keeps the collection; Bangla numbering and text", await p.locator(".hadith.nw").count() === 42 && /[০-৯]/.test(await p.textContent("#nw-1 .nw-no")) && /[ঀ-৿]/.test(await p.textContent("#nw-1 .hd-tr")));
  const hh = await p.evaluate(() => [...document.querySelectorAll(".hadith.nw")].slice(2, 6).map(x => Math.round(x.getBoundingClientRect().height)));
  ok("desktop: closed cards in a row share a height", hh[0] === hh[1] && hh[2] === hh[3], hh.join(","));
  await p.click("#nw-1 summary"); await p.click('#nw-1 [data-act="hgo"]'); await p.waitForTimeout(500);
  ok("'Also in the general library' opens that card in the general list", await p.locator(".hadith:not(.nw)").count() === 40 && await p.evaluate(() => document.activeElement.id) === "hd-h-h13");
  await ctx.close();

  /* 8. Interactions */
  ({ p, ctx } = await open(b, { state: { lang: "en" }, hash: "#more/calendar", desk: true }));
  await p.hover('[data-act="caltoday"]'); await p.waitForTimeout(450);
  ok("hover lifts a button", await p.evaluate(() => getComputedStyle(document.querySelector('[data-act="caltoday"]')).transform) !== "none");
  const box = await p.locator('[data-act="caltoday"]').boundingBox(); await p.mouse.move(box.x + 5, box.y + 5); await p.mouse.down(); await p.waitForTimeout(150);
  const tr = await p.evaluate(() => getComputedStyle(document.querySelector('[data-act="caltoday"]')).transform); await p.mouse.up();
  ok("press scales down (touch and mouse)", /matrix\(0\.9[0-9]*, 0, 0, 0\.9/.test(tr), tr);
  await p.keyboard.press("Tab"); await p.waitForTimeout(400);
  ok("keyboard focus is visible", await p.evaluate(() => { const e = document.activeElement; const s = getComputedStyle(e); return e !== document.body && s.outlineStyle !== "none"; }));
  await ctx.close();
  ({ p, ctx } = await open(b, { state: { lang: "en" }, hash: "#more/calendar", desk: true, reduced: true }));
  await p.hover('[data-act="caltoday"]'); await p.waitForTimeout(300);
  ok("reduced motion: no lift on hover", await p.evaluate(() => getComputedStyle(document.querySelector('[data-act="caltoday"]')).transform) === "none");
  await ctx.close();
  ({ p, ctx } = await open(b, { state: { lang: "en", hcol: "nawawi" }, hash: "#more/hadith", desk: true }));
  await p.hover("#nw-1 .hd-ar"); await p.waitForTimeout(400);
  ok("hadith text never moves on hover", await p.evaluate(() => getComputedStyle(document.querySelector("#nw-1 .hd-ar")).transform === "none" && getComputedStyle(document.querySelector("#nw-1")).transform === "none"));
  await ctx.close();

  /* 9. About page renders the new credits */
  ({ p, ctx } = await open(b, { state: { lang: "en" }, hash: "#more/about" }));
  const cr = await p.textContent(".credits");
  ok("credits name an-Nawawi's Forty and the prohibited-time sources; no zakat row (Face 7)", /An-Nawawi's Forty Hadith/.test(cr) && /Ibn Baz/.test(cr) && !/Islamic Relief Australia/.test(cr));
  await ctx.close();

  ok("no page errors", !errs.length, errs.join(" | "));
  console.log(`\n${pass} passed, ${fail} failed`);
  await b.close(); process.exit(fail ? 1 : 0);
})();
