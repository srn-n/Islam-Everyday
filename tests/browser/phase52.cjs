// Phase 5.2 browser checks (not part of `npm test`, which has no dependencies).
// Needs Playwright and a running server:  npm start   then   node tests/browser/phase52.cjs [http://localhost:8080/]
// Set CHROMIUM=/path/to/chromium to use a specific browser. Uses a controlled clock in Australia/Sydney.
const { chromium, devices } = require("playwright");
const base = process.argv[2] || "http://localhost:8080/";
const KEY = "dinsathi.web.v1";
let pass = 0, fail = 0; const errs = [];
const ok = (name, cond, detail) => { cond ? pass++ : fail++; console.log(`${cond ? "PASS" : "FAIL"} ${name}${!cond && detail ? " :: " + detail : ""}`); };

async function open(b, { time, state = {}, hash = "#today", desk = false, zone = "Australia/Sydney", reduced = false, touch = false }) {
  const ctx = await b.newContext({ ...(desk ? { viewport: { width: 1280, height: 900 } } : devices["Pixel 7"]), timezoneId: zone, serviceWorkers: "block", reducedMotion: reduced ? "reduce" : "no-preference", ...(touch ? { hasTouch: true } : {}) });
  const p = await ctx.newPage();
  p.on("pageerror", e => errs.push(`${hash} ${e.message}`)); p.on("console", m => { if (m.type() === "error") errs.push(`${hash} ${m.text()}`); });
  if (time) await p.clock.install({ time: new Date(time) });
  await p.addInitScript(([k, s]) => { if (!sessionStorage.getItem("seeded")) { sessionStorage.setItem("seeded", "1"); localStorage.setItem(k, JSON.stringify(s)); } }, [KEY, state]);
  await p.goto(base + hash); if (time) await p.clock.runFor(1500); else await p.waitForTimeout(1200);
  return { p, ctx };
}
const hero = p => p.evaluate(() => ({
  cur: document.querySelector("#cur-name")?.textContent.trim(), start: document.querySelector("#cur-start")?.textContent.replace(/\s+/g, " ").trim(),
  next: document.querySelector("#next-pill .np-l b")?.textContent.trim(), nextAt: document.querySelector("#next-pill .np-r b")?.textContent.replace(/\s+/g, " ").trim(),
  nextDay: document.querySelector("#next-pill .np-day")?.textContent.trim(), dates: document.querySelector(".sky .dates")?.textContent.trim(),
  countCur: !!document.querySelector("#count-cur"), countNext: !!document.querySelector("#count-next"), note: document.querySelector(".adhan-note")?.textContent || "" }));
const times = p => p.evaluate(() => Object.fromEntries([...document.querySelectorAll(".times li")].map(li => [li.querySelector(".nm").firstChild.textContent.trim(), li.querySelector(".tm").firstChild.textContent.replace(/\s+/g, " ").trim()])));
const toMin = s => { const m = s.match(/(\d+):(\d+)\s*(am|pm|AM|PM)/); let h = +m[1] % 12; if (/pm/i.test(m[3])) h += 12; return h * 60 + +m[2]; };

(async () => {
  const b = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});

  /* 1. Today card: transitions, today/tomorrow, midnight, start times only */
  let { p, ctx } = await open(b, { time: "2026-10-18T16:10:00+11:00", state: { lang: "en", city: "syd" } });
  let h = await hero(p), tm = await times(p);
  ok("Dhuhr is current before Asr; started at Dhuhr's start time", h.cur === "Dhuhr" && h.start.includes(tm.Dhuhr), JSON.stringify({ h, tm }));
  ok("next is Asr, today, at Asr's start time", h.next === "Asr" && h.nextAt === tm.Asr && h.nextDay === "Today", JSON.stringify(h));
  // Phase 5.3: one countdown, to the next prayer's start; still no countdown or ending time for the current prayer.
  ok("only a countdown to the next prayer's start; no ending times on the card", !h.countCur && h.countNext && !/Ends/.test(JSON.stringify(h)));
  ok("start times distinguished from iqamah", /adhan/.test(h.note) && /iqamah/.test(h.note));
  await p.clock.fastForward("15:00"); await p.clock.runFor(1500); h = await hero(p);
  ok("after Asr begins the card switches to Asr without reload", h.cur === "Asr" && h.next === "Maghrib", JSON.stringify(h));
  const vizCur = await p.evaluate(() => document.querySelector(".dayviz .pr.cur text")?.textContent);
  ok("day chart highlights the new current prayer", vizCur === "Asr", vizCur);
  await ctx.close();

  ({ p, ctx } = await open(b, { time: "2026-10-18T23:50:00+11:00", state: { lang: "en", city: "syd" } }));
  h = await hero(p);
  ok("after Isha the next prayer is Fajr tomorrow", h.cur === "Isha" && h.next === "Fajr" && h.nextDay === "Tomorrow", JSON.stringify(h));
  await p.clock.fastForward("20:00"); await p.clock.runFor(1500); h = await hero(p);
  ok("after midnight: Isha began yesterday, Fajr is today, date moves on", h.cur === "Isha" && /Yesterday|yesterday/.test(h.start) && h.nextDay === "Today" && /19 October/.test(h.dates), JSON.stringify(h));
  await p.clock.fastForward("06:00:00"); await p.clock.runFor(1500); h = await hero(p);
  ok("between sunrise and Dhuhr no prayer is in progress; next Dhuhr today", /No prayer/.test(h.cur) && h.next === "Dhuhr" && h.nextDay === "Today", JSON.stringify(h));
  await ctx.close();

  // Location change updates times and labels.
  ({ p, ctx } = await open(b, { time: "2026-10-18T12:00:00+06:00", state: { lang: "en", city: "dac" }, zone: "Asia/Dhaka" }));
  h = await hero(p); tm = await times(p);
  ok("Dhaka: times and current prayer follow the city", /Dhaka/.test(await p.textContent(".top .chip-btn")) && tm.Dhuhr && h.cur && h.next, JSON.stringify({ h, tm }));
  await ctx.close();

  // DST (Sydney clocks go forward on 4 October 2026): times shift by about an hour, card stays consistent.
  const a = await open(b, { time: "2026-10-03T10:00:00+10:00", state: { lang: "en", city: "syd" } }); const t3 = await times(a.p); await a.ctx.close();
  const c = await open(b, { time: "2026-10-04T10:00:00+11:00", state: { lang: "en", city: "syd" } }); const t4 = await times(c.p); const h4 = await hero(c.p); await c.ctx.close();
  const shift = toMin(t4.Fajr) - toMin(t3.Fajr);
  ok("DST start: Fajr moves about one hour later on the clock", shift >= 55 && shift <= 62, `${t3.Fajr} -> ${t4.Fajr}`);
  ok("DST day: no prayer in progress at 10am, next Dhuhr today", /No prayer/.test(h4.cur) && h4.next === "Dhuhr" && h4.nextDay === "Today", JSON.stringify(h4));

  /* 2. Locales */
  ({ p, ctx } = await open(b, { time: "2026-10-18T10:00:00+11:00", state: { lang: "en" }, hash: "#more/settings" }));
  ok("default is English (India)", await p.evaluate(() => document.documentElement.lang) === "en-IN" && await p.getAttribute('[data-act="setlang"][data-k="en-IN"]', "aria-pressed") === "true");
  await p.click('[data-act="setlang"][data-k="en-US"]'); await p.clock.runFor(400);
  ok("English (US): html lang, still on Settings", await p.evaluate(() => document.documentElement.lang) === "en-US" && /Settings/.test(await p.textContent("h2")));
  await p.click('[data-act="home"]'); await p.clock.runFor(800);
  h = await hero(p);
  ok("English (US) dates and AM/PM", /October 18/.test(h.dates) && /AM|PM/.test(h.nextAt), JSON.stringify(h));
  await p.click('.top [data-sub="settings"]'); await p.clock.runFor(800); await p.click('[data-act="setlang"][data-k="en-IN"]'); await p.click('[data-act="home"]'); await p.clock.runFor(800); h = await hero(p);
  ok("English (India) dates and am/pm", /18 October/.test(h.dates) && /am|pm/.test(h.nextAt) && !/AM|PM/.test(h.nextAt), JSON.stringify(h));
  await ctx.close();

  // Hadith page: category, open card and position survive a language switch.
  ({ p, ctx } = await open(b, { state: { lang: "en" }, hash: "#more/hadith" }));
  const cat = await p.getAttribute('[data-act="hcat"]:nth-child(3)', "data-k");
  await p.click(`[data-act="hcat"][data-k="${cat}"]`); await p.waitForTimeout(200);
  const card = p.locator(".hadith").nth(1); const id = await card.getAttribute("id");
  await card.locator('[data-act="hdmore"]').click().catch(() => {}); await p.waitForTimeout(150);
  await card.scrollIntoViewIfNeeded(); await p.evaluate(i => { const el = document.getElementById(i); scrollTo(0, el.getBoundingClientRect().top + scrollY - 120); }, id); await p.waitForTimeout(150);
  const before = await p.evaluate(i => document.getElementById(i).getBoundingClientRect().top, id);
  await p.click('.top [data-act="lang"]'); await p.waitForTimeout(400);
  const after = await p.evaluate(i => ({ top: document.getElementById(i)?.getBoundingClientRect().top, lang: document.documentElement.lang, cat: document.querySelector('[data-act="hcat"][aria-pressed="true"]')?.dataset.k }), id);
  ok("language switch keeps Hadith category and card position", after.lang === "bn" && after.cat === cat && Math.abs(after.top - before) < 6, JSON.stringify({ before, after }));
  await ctx.close();

  // Qur'an reader keeps the verse in view across a language switch (the other translation loads first).
  ({ p, ctx } = await open(b, { state: { lang: "en" }, hash: "#quran" }));
  await p.click('[data-act="surah"][data-s="2"]'); await p.waitForSelector("#a-40"); await p.waitForTimeout(300);
  await p.evaluate(() => { const el = document.getElementById("a-40"); scrollTo(0, el.getBoundingClientRect().top + scrollY - 150); }); await p.waitForTimeout(300);
  await p.click('.top [data-act="lang"]'); await p.waitForSelector('#a-40 [lang="bn"], #a-40 .tr', { timeout: 8000 }).catch(() => {}); await p.waitForTimeout(800);
  const r40 = await p.evaluate(() => ({ top: document.getElementById("a-40")?.getBoundingClientRect().top, lang: document.documentElement.lang }));
  ok("language switch keeps the Qur'an reading position", r40.lang === "bn" && Math.abs(r40.top - 150) < 12, JSON.stringify(r40));
  await ctx.close();

  /* 3. Verse for today: English explanation and attribution */
  ({ p, ctx } = await open(b, { time: "2026-10-18T10:00:00+11:00", state: { lang: "en" } }));
  await p.waitForSelector(".en-ex", { timeout: 8000 }).catch(() => {});
  let ex = await p.evaluate(() => { const x = document.querySelector(".en-ex"); return x && { label: x.querySelector(".tf-h").textContent, src: x.querySelector(".ex-src").textContent, len: x.querySelector(".clamp-body").textContent.length, fits: x.classList.contains("fits"), btn: x.querySelector(".clamp-more")?.getAttribute("aria-expanded") }; });
  ok("English verse explanation shown with label and source", ex && /Explanation/.test(ex.label) && /not the Qur'an text/.test(ex.label) && /QuranEnc/.test(ex.src) && /Not independently reviewed/.test(ex.src) && ex.len > 40, JSON.stringify(ex));
  if (ex && !ex.fits) { await p.click('[data-act="vxmore"]'); await p.clock.runFor(200); ok("Read more opens the explanation in place", await p.getAttribute('[data-act="vxmore"]', "aria-expanded") === "true"); }
  for (const d of ["2026-01-01", "2026-03-15", "2026-06-29"]) {   // spot-check other days (Fatiha, grouped verses, long entries)
    await ctx.close(); ({ p, ctx } = await open(b, { time: d + "T10:00:00+11:00", state: { lang: "en" } }));
    await p.waitForSelector(".en-ex", { timeout: 8000 }).catch(() => {});
    ok(`explanation present on ${d}`, await p.locator(".en-ex .clamp-body p").count() >= 1);
  }
  await ctx.close();
  ({ p, ctx } = await open(b, { time: "2026-10-18T10:00:00+11:00", state: { lang: "bn" } }));
  await p.waitForSelector(".a-verse .verse-tr", { timeout: 8000 }).catch(() => {});
  ok("Bangla shows the Bangla tafsir layer, not the English explanation", await p.locator(".en-ex").count() === 0 && await p.locator(".a-verse .tafsir").count() >= 1);
  await ctx.close();

  /* 4. Hadith cards: expansion, layout, RTL (mobile and desktop) */
  for (const desk of [false, true]) {
    ({ p, ctx } = await open(b, { state: { lang: "en" }, hash: "#more/hadith", desk }));
    const info = await p.evaluate(() => [...document.querySelectorAll(".hadith")].map(c => ({ fits: c.querySelector(".hd-main").classList.contains("fits"), ar: c.querySelector(".hd-ar").getAttribute("dir"), h: c.getBoundingClientRect().height })));
    ok(`${desk ? "desktop" : "mobile"}: all 40 general cards in one shell, Arabic RTL`, info.length === 40 && info.every(x => x.ar === "rtl"));
    const long = p.locator(".hadith:not(:has(.hd-main.fits))").first();
    if (await long.count()) {
      const b0 = await long.boundingBox(); await long.locator('[data-act="hdmore"]').click(); await p.waitForTimeout(150);
      const st = await long.evaluate(c => ({ exp: c.querySelector(".clamp-more").getAttribute("aria-expanded"), full: c.querySelector(".clamp-body").scrollHeight <= c.querySelector(".clamp-body").clientHeight + 1 }));
      const b1 = await long.boundingBox();
      ok(`${desk ? "desktop" : "mobile"}: Read more expands the whole card in place`, st.exp === "true" && st.full && b1.height > b0.height, JSON.stringify(st));
      await p.click('[data-act="hcat"][data-k="all"]'); await p.waitForTimeout(100);
      ok(`${desk ? "desktop" : "mobile"}: open card stays open after filtering`, await long.evaluate(c => c.querySelector(".hd-main").classList.contains("open")).catch(() => false) || await p.locator(".hd-main.open").count() === 1);
    }
    if (desk) { const rows = await p.evaluate(() => { const c = [...document.querySelectorAll(".hadith")].slice(2, 6).map(x => Math.round(x.getBoundingClientRect().height)); return c; }); ok("desktop: closed cards in a row share a height", rows[0] === rows[1] && rows[2] === rows[3], rows.join(",")); }
    await ctx.close();
  }

  /* 5. Themes: persistence across reload and pages, all pages render.
     Phase 5.3: the Phase 5.2 themes are now palettes (data-palette) with a separate appearance mode (data-theme light|dark);
     Emerald is checked in light mode and Midnight Indigo in dark mode, as they were shown before. */
  ({ p, ctx } = await open(b, { state: { lang: "en" }, hash: "#more/settings" }));
  for (const [th, mode] of [["emerald", "light"], ["indigo", "dark"]]) {
    await p.click(`[data-act="setmode"][data-k="${mode}"]`); await p.waitForTimeout(100);
    await p.click(`[data-act="setpalette"][data-k="${th}"]`); await p.waitForTimeout(150);
    await p.reload(); await p.waitForTimeout(800);
    const saved = JSON.parse(await p.evaluate(k => localStorage.getItem(k), KEY));
    ok(`theme ${th} persists after reload`, await p.evaluate(() => document.documentElement.getAttribute("data-palette")) === th && await p.evaluate(() => document.documentElement.getAttribute("data-theme")) === mode && saved.palette === th && saved.mode === mode);
    for (const hh of ["#today", "#quran", "#duas", "#more/hadith", "#more/calendar", "#more/names", "#more/guide", "#more/zakat", "#more/about"]) {
      await p.goto(base + hh); await p.waitForTimeout(500);
      const bg = await p.evaluate(() => getComputedStyle(document.body).backgroundColor);
      if (hh === "#today") ok(`theme ${th}: page background follows the theme`, th === "emerald" ? bg === "rgb(246, 241, 228)" : bg === "rgb(10, 13, 30)", bg);
    }
    const glass = await p.evaluate(() => getComputedStyle(document.querySelector("nav.tabs")).backdropFilter);
    ok(`theme ${th}: tab bar uses glass`, /blur/.test(glass), glass);
    const card = await p.evaluate(() => getComputedStyle(document.querySelector(".card")).backdropFilter);
    ok(`theme ${th}: reading cards stay opaque`, card === "none", card);
    await p.goto(base + "#more/settings"); await p.waitForTimeout(400);
  }
  await p.click('[data-act="setmode"][data-k="system"]'); await p.click('[data-act="setpalette"][data-k="classic"]'); await ctx.close();

  /* 6. Calendar: popover, details, keyboard, touch, White Days, Hijri/Gregorian month change */
  ({ p, ctx } = await open(b, { time: "2026-10-18T10:00:00+11:00", state: { lang: "en" }, hash: "#more/calendar", desk: true }));
  const cell = p.locator('.cal .c[data-k="2026-10-24"]');
  await cell.hover(); await p.clock.runFor(100);
  let pop = await p.evaluate(() => { const x = document.getElementById("cal-pop"); return { hidden: x.hidden, text: x.textContent }; });
  ok("hover shows Gregorian, Hijri, White Day, calculated", !pop.hidden && /24 October/.test(pop.text) && /13 Jumada al-Ula 1448/.test(pop.text) && /White Day/.test(pop.text) && /Calculated/.test(pop.text), JSON.stringify(pop));
  await cell.click(); await p.clock.runFor(100);
  let det = await p.textContent("#cal-detail");
  ok("click shows details with White Day explanation and the evening rule", /White Day/.test(det) && /maghrib/.test(det), det.slice(0, 160));
  await p.check("#fp-check"); await p.fill("#fp-note", "Plan"); await p.clock.runFor(300);
  await p.reload(); await p.clock.runFor(1200); await p.click('.cal .c[data-k="2026-10-24"]'); await p.clock.runFor(100);
  ok("fasting plan and note persist", await p.isChecked("#fp-check") && await p.inputValue("#fp-note") === "Plan" && await cell.evaluate(e => e.classList.contains("fp")));
  await p.focus('.cal .c[data-k="2026-10-24"]'); await p.keyboard.press("ArrowDown"); await p.keyboard.press("ArrowDown"); await p.clock.runFor(100);
  ok("arrow keys cross into the next Gregorian month, Hijri months follow", await p.evaluate(() => document.activeElement.dataset.k) === "2026-11-07" && /November 2026/.test(await p.textContent("#cal-title")) && /Jumada al-Akhirah|Jumada al-Ula/.test(await p.textContent(".cal-head small")));
  await p.keyboard.press("PageUp"); await p.keyboard.press("Home"); await p.keyboard.press("Enter"); await p.clock.runFor(100);
  ok("Page Up, Home and Enter select 1 October", /1 October/.test(await p.textContent("#cal-detail")));
  const tash = await p.evaluate(() => { for (let i = 0; i < 400; i++) { const d = new Date(Date.UTC(2027, 0, 1 + i, 2)); const o = {}; new Intl.DateTimeFormat("en-u-ca-islamic-umalqura-nu-latn", { day: "numeric", month: "numeric", timeZone: "Australia/Sydney" }).formatToParts(d).forEach(x => o[x.type] = +x.value); if (o.month === 12 && o.day === 13) return d.toISOString().slice(0, 10); } });
  for (let i = 0; i < 14 && !(await p.locator(`.cal .c[data-k="${tash}"]`).count()); i++) { await p.click('[data-act="cal"][data-d="1"]'); await p.clock.runFor(60); }
  await p.click(`.cal .c[data-k="${tash}"]`); await p.clock.runFor(100); det = await p.textContent("#cal-detail");
  ok("13 Dhul-Hijjah: Tashriq note, fasting plan disabled", /Tashriq/.test(det) && await p.isDisabled("#fp-check"), tash);
  ok("method shown: Umm al-Qura, calculated not sighted", /Umm al-Qura/.test(await p.textContent("#cal-method")) && /not moon-sighting/.test(await p.textContent("#cal-method")));
  await ctx.close();
  ({ p, ctx } = await open(b, { time: "2026-10-18T10:00:00+11:00", state: { lang: "bn", hadj: 1 }, hash: "#more/calendar", touch: true }));
  await p.tap('.cal .c[data-k="2026-10-23"]'); await p.clock.runFor(150);
  ok("touch (Bangla): tap selects without popover; adjustment applied and stated", await p.evaluate(() => document.getElementById("cal-pop").hidden) && /আইয়ামে বিজ/.test(await p.textContent("#cal-detail")) && /সমন্বয়সহ/.test(await p.textContent("#cal-method")));
  await ctx.close();

  /* 7. Day chart: updates, reduced motion, polar fallback, small screen */
  ({ p, ctx } = await open(b, { time: "2026-10-18T09:00:00+11:00", state: { lang: "en" }, reduced: true }));
  const x0 = await p.getAttribute(".dayviz .now", "x1");
  await p.clock.fastForward("02:00:00"); await p.clock.runFor(61000);
  const x1 = await p.getAttribute(".dayviz .now", "x1");
  ok("chart's now-line moves as time passes", +x1 > +x0, `${x0} -> ${x1}`);
  ok("reduced motion: sun path is not animated", await p.evaluate(() => getComputedStyle(document.querySelector(".dayviz .sunpath")).animationName) === "none");
  const cap = await p.textContent("#viz-cap");
  ok("chart has a text equivalent naming sunrise, sunset and all five prayers", ["Sunrise", "Sunset", "Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"].every(w => cap.includes(w)), cap);
  const wide = await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth);
  ok("small screen: no horizontal overflow", wide);
  await ctx.close();
  ({ p, ctx } = await open(b, { time: "2026-12-15T12:00:00+01:00", zone: "Europe/Oslo", state: { lang: "en", city: "gps", gps: { id: "gps", lat: 69.65, lng: 18.96, zone: "Europe/Oslo", en: "My location", bn: "আমার অবস্থান", g: "gps" } } }));
  ok("polar night: chart replaced by a note, schedule still listed", await p.locator(".dayviz").count() === 0 && await p.locator(".viz-polar").count() === 1 && await p.locator(".times li").count() === 6);
  await ctx.close();

  await b.close();
  ok("no page errors", !errs.length, errs.join(" | "));
  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})();
