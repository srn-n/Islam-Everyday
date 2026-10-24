// Phase 5.4 release checks in a browser (not part of `npm test`): daylight-saving changes, high latitudes, Bangla
// numerals, right-to-left Arabic, keyboard reach and focus visibility, reduced motion across pages.
// Needs Playwright and a running server:  npm start   then   node tests/browser/phase54.cjs [http://localhost:8080/]
const { chromium, devices } = require("playwright");
const base = process.argv[2] || "http://localhost:8080/";
const KEY = "dinsathi.web.v1";
let pass = 0, fail = 0; const errs = [];
const ok = (name, cond, detail) => { cond ? pass++ : fail++; console.log(`${cond ? "PASS" : "FAIL"} ${name}${!cond && detail ? " :: " + detail : ""}`); };

async function open(b, { time, state = {}, hash = "#today", desk = false, zone = "Australia/Sydney", reduced = false }) {
  const ctx = await b.newContext({ ...(desk ? { viewport: { width: 1280, height: 900 } } : devices["Pixel 7"]), timezoneId: zone, serviceWorkers: "block", reducedMotion: reduced ? "reduce" : "no-preference" });
  const p = await ctx.newPage();
  p.on("pageerror", e => errs.push(`${hash} ${e.message}`)); p.on("console", m => { if (m.type() === "error") errs.push(`${hash} ${m.text()}`); });
  if (time) await p.clock.install({ time: new Date(time) });
  await p.addInitScript(([k, s]) => { if (!sessionStorage.getItem("seeded")) { sessionStorage.setItem("seeded", "1"); localStorage.setItem(k, JSON.stringify(s)); } }, [KEY, state]);
  await p.goto(base + hash); if (time) await p.clock.runFor(1500); else await p.waitForTimeout(1200);
  return { p, ctx };
}
const times = p => p.evaluate(() => Object.fromEntries([...document.querySelectorAll(".times li")].map(li => [li.querySelector(".nm").firstChild.textContent.trim(), li.querySelector(".tm").firstChild.textContent.replace(/\s+/g, " ").trim()])));
const hm = s => { const m = s.match(/(\d+):(\d+)\s*(am|pm)/i); let h = +m[1] % 12; if (/pm/i.test(m[3])) h += 12; return String(h).padStart(2, "0") + ":" + m[2]; };
const secs = s => { const m = /(\d+):(\d\d):(\d\d)/.exec(s || ""); return m ? +m[1] * 3600 + +m[2] * 60 + +m[3] : NaN; };
const card = p => p.evaluate(() => ({ cur: document.querySelector("#cur-name")?.textContent.trim(), lbl: document.querySelector(".cd .lbl")?.textContent.trim(), cd: document.querySelector("#count-next")?.textContent.trim(), off: !!document.querySelector(".cd-off"), forb: document.querySelector("#forb-warn")?.textContent.trim() || "" }));

(async () => {
  const b = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
  const S = { lang: "en", city: "syd" };

  /* 1. Daylight saving: Sydney clocks go forward on 4 October 2026 (02:00 → 03:00) and back on 5 April 2026 (03:00 → 02:00) */
  let { p, ctx } = await open(b, { time: "2026-10-04T12:00:00+11:00", state: S });
  const fajrOct4 = hm((await times(p)).Fajr), srOct4 = hm((await times(p)).Sunrise); await ctx.close();
  ({ p, ctx } = await open(b, { time: "2026-10-03T22:00:00+10:00", state: S }));
  let c = await card(p), want = (new Date(`2026-10-04T${fajrOct4}:00+11:00`) - new Date("2026-10-03T22:00:00+10:00")) / 1000;
  ok("DST start: the countdown to Fajr is real elapsed time (one hour shorter than the wall clock)", c.lbl === "Fajr begins in" && Math.abs(secs(c.cd) - want) <= 60, `${c.cd} vs ${want}s, Fajr ${fajrOct4}`);
  const before = secs(c.cd); await p.clock.fastForward("03:59:00"); await p.clock.runFor(61000); c = await card(p);
  ok("DST start: across 02:00 → 03:00 the countdown falls by the time that passed", Math.abs(before - secs(c.cd) - 4 * 3600) <= 5, `${before} -> ${secs(c.cd)}`);
  await ctx.close();
  ({ p, ctx } = await open(b, { time: `2026-10-04T${srOct4}:00+11:00`, state: S }));
  await p.clock.runFor(120000);
  ok("DST start day: the sunrise note appears at that day's sunrise", /^Sunrise: voluntary prayer is avoided/.test((await card(p)).forb), (await card(p)).forb);
  await ctx.close();
  ({ p, ctx } = await open(b, { time: "2026-04-05T12:00:00+10:00", state: S }));
  const fajrApr5 = hm((await times(p)).Fajr); await ctx.close();
  ({ p, ctx } = await open(b, { time: "2026-04-04T22:00:00+11:00", state: S }));
  c = await card(p); want = (new Date(`2026-04-05T${fajrApr5}:00+10:00`) - new Date("2026-04-04T22:00:00+11:00")) / 1000;
  ok("DST end: the countdown to Fajr includes the repeated hour", c.lbl === "Fajr begins in" && Math.abs(secs(c.cd) - want) <= 60, `${c.cd} vs ${want}s, Fajr ${fajrApr5}`);
  await ctx.close();

  /* 2. High latitudes */
  ({ p, ctx } = await open(b, { time: "2026-06-21T12:30:00+01:00", zone: "Europe/London", state: { lang: "en", city: "lon" } }));
  c = await card(p);
  ok("London, midsummer (twilight never ends): no countdown digits and no prohibited-time note", c.off && !c.cd && c.forb === "", JSON.stringify(c));
  ok("London, midsummer: the chart is replaced by the high-latitude note", await p.locator(".viz-polar").count() === 1);
  await ctx.close();
  ({ p, ctx } = await open(b, { time: "2026-04-20T12:30:00+01:00", zone: "Europe/London", state: { lang: "en", city: "lon" } }));
  const lt = await times(p), dh = hm(lt.Dhuhr); await ctx.close();
  const [H, M] = dh.split(":").map(Number), z = new Date(Date.UTC(2026, 3, 20, H - 1, M - 6));
  ({ p, ctx } = await open(b, { time: z.toISOString(), zone: "Europe/London", state: { lang: "en", city: "lon" } }));
  c = await card(p);
  ok("London, April (times reliable): countdown and zenith note work", !c.off && /begins in/.test(c.lbl) && /^Sun at its zenith/.test(c.forb), JSON.stringify(c));
  await ctx.close();
  ({ p, ctx } = await open(b, { time: "2026-12-15T12:00:00+01:00", zone: "Europe/Oslo", state: { lang: "en", city: "gps", gps: { id: "gps", lat: 69.65, lng: 18.96, zone: "Europe/Oslo", en: "My location", bn: "আমার অবস্থান", g: "gps" } } }));
  c = await card(p);
  ok("Polar night (Tromsø): no countdown, no warning, page intact", c.off && c.forb === "" && await p.locator(".times li").count() === 6, JSON.stringify(c));
  await ctx.close();

  /* 3. Bangla: numbers in Bangla digits on the main pages (source codes and URLs excepted) */
  ({ p, ctx } = await open(b, { time: "2026-10-19T16:40:00+11:00", state: { lang: "bn", city: "syd", fplan: { "2026-10-24": { f: true } } }, desk: true }));
  const latin = [];
  for (const h of ["#today", "#more/hadith", "#more/calendar", "#more/zakat", "#more/settings"]) {
    await p.goto(base + h); await p.clock.runFor(1200);
    if (h === "#more/zakat") { await p.fill("#zk-price", "1.5"); await p.fill("#zk-cash", "5000"); await p.clock.runFor(300); }
    const hits = await p.evaluate(() => { const out = []; const w = document.createTreeWalker(document.querySelector("#view"), NodeFilter.SHOW_TEXT); let n; while ((n = w.nextNode())) { const el = n.parentElement; if (!el || el.closest('[lang="ar"],[dir="rtl"],a[href^="http"],input,select') || !el.offsetParent) continue; const t = n.textContent.replace(/https?:\S+|[a-z0-9.-]+\.(com|org|sa|au|net)\S*/gi, ""); if (/[0-9]/.test(t)) out.push(t.trim().slice(0, 50)); } return out; });
    if (hits.length) latin.push(h + ": " + hits.slice(0, 3).join(" | "));
  }
  ok("Bangla pages show Bangla digits", !latin.length, latin.join(" ; "));
  await ctx.close();

  /* 4. Right-to-left Arabic everywhere it is shown */
  ({ p, ctx } = await open(b, { state: { lang: "en", hcol: "nawawi" }, hash: "#more/hadith", desk: true }));
  let rtl = await p.evaluate(() => [...document.querySelectorAll(".hd-ar")].every(e => getComputedStyle(e).direction === "rtl" && e.lang === "ar"));
  ok("An-Nawawi cards: Arabic is right-to-left and marked lang=ar", rtl);
  await p.goto(base + "#quran"); await p.waitForTimeout(600); await p.click('[data-act="surah"][data-s="1"] >> nth=0'); await p.waitForTimeout(1500);
  rtl = await p.evaluate(() => { const a = [...document.querySelectorAll(".ayah [lang=ar], .ayah .ar")]; return a.length > 0 && a.every(e => getComputedStyle(e).direction === "rtl"); });
  ok("Qur'an reader: Arabic is right-to-left", rtl);
  await ctx.close();

  /* 5. Keyboard: every page's controls are reachable, and focus is always visible */
  ({ p, ctx } = await open(b, { state: { lang: "en" }, desk: true }));
  const nofocus = [];
  for (const h of ["#today", "#more/hadith", "#more/calendar", "#more/zakat", "#more/settings"]) {
    await p.goto(base + h); await p.waitForTimeout(700); await p.evaluate(() => document.activeElement && document.activeElement.blur());
    for (let i = 0; i < 25; i++) {
      await p.keyboard.press("Tab");
      const f = await p.evaluate(() => { const e = document.activeElement; if (!e || e === document.body) return null; const s = getComputedStyle(e); return { tag: e.tagName + (e.className ? "." + String(e.className).split(" ")[0] : ""), vis: s.outlineStyle !== "none" && parseFloat(s.outlineWidth) > 0 || s.boxShadow !== "none" }; });
      if (f && !f.vis) nofocus.push(`${h} ${f.tag}`);
    }
  }
  ok("keyboard focus is visible on the first 25 stops of each main page", !nofocus.length, [...new Set(nofocus)].join(", "));
  await ctx.close();

  /* 6. Reduced motion: nothing transitions or animates on the main pages */
  ({ p, ctx } = await open(b, { state: { lang: "en" }, desk: true, reduced: true }));
  const moving = [];
  for (const h of ["#today", "#more/hadith", "#more/calendar", "#more/settings"]) {
    await p.goto(base + h); await p.waitForTimeout(700);
    const m = await p.evaluate(() => [...document.querySelectorAll("#view *, .side *")].filter(e => { const s = getComputedStyle(e); return (s.animationName !== "none" && parseFloat(s.animationDuration) > 0.01 && s.animationIterationCount === "infinite"); }).map(e => e.tagName + "." + String(e.className).split(" ")[0]).slice(0, 5));
    if (m.length) moving.push(h + ": " + m.join(","));
  }
  ok("reduced motion: no looping animations", !moving.length, moving.join(" ; "));
  await ctx.close();

  ok("no page errors", !errs.length, errs.join(" | "));
  console.log(`\n${pass} passed, ${fail} failed`);
  await b.close(); process.exit(fail ? 1 : 0);
})();
