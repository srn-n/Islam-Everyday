// Service worker and offline scenarios (Phase 5.4). Not part of `npm test`: needs Playwright and copies of older builds.
//
//   node tests/browser/offline.cjs [--v4 <dir>] [--v5 <dir>] [--v52 <dir>]
//
// <dir> is a full copy of an older build (with scripts/serve.mjs): v4 = the released GitHub Pages version (cache v4),
// v5 = the Phase 4 build (cache v5), v52 = the Phase 5.2 local build (cache v6, the same names as this build).
// A scenario whose build is not given is reported as SKIPPED, never as passed. The current build is this folder.
// Set CHROMIUM=/path/to/chromium to use a specific browser.
const { chromium } = require("playwright");
const { spawn } = require("child_process");
const path = require("path");
const NEW = path.resolve(__dirname, "..", "..");
const arg = k => { const i = process.argv.indexOf(k); return i > 0 ? path.resolve(process.argv[i + 1]) : null; };
const OLD = { 4: arg("--v4"), 5: arg("--v5"), 52: arg("--v52") };
const PORT = 8097, BASE = `http://localhost:${PORT}/`, KEY = "dinsathi.web.v1";
let pass = 0, fail = 0, skip = 0; const errs = [];
const ok = (n, c, d) => { c ? pass++ : fail++; console.log(`${c ? "PASS" : "FAIL"} ${n}${!c && d ? " :: " + d : ""}`); };
const skipped = n => { skip++; console.log(`SKIPPED ${n}`); };
const sleep = ms => new Promise(r => setTimeout(r, ms));
let srv = null;
async function down() { if (srv) { srv.kill(); srv = null; await sleep(400); } }
async function serve(root) {
  await down();
  srv = spawn("node", [path.join(root, "scripts/serve.mjs")], { env: { ...process.env, PORT: String(PORT) }, stdio: "ignore" });
  for (let i = 0; i < 60; i++) { try { const r = await fetch(BASE); if (r.ok) return; } catch (e) {} await sleep(100); }
  throw new Error("server did not start: " + root);
}
const qurls = langs => { const u = []; for (const l of langs) for (let i = 1; i <= 114; i++) u.push(`data/quran/${l}/${String(i).padStart(3, "0")}.json`); return u; };
const keys = p => p.evaluate(() => caches.keys());
const dataCount = (p, name) => p.evaluate(async n => (await (await caches.open(n)).keys()).filter(r => /\/data\/quran\/(ar|en|bn|bnt)\/\d{3}\.json$/.test(r.url)).length, name);
async function controlled(p) {
  await p.evaluate(() => navigator.serviceWorker.ready);
  for (let i = 0; i < 20 && !(await p.evaluate(() => !!navigator.serviceWorker.controller)); i++) { await p.reload(); await sleep(300); }
}
async function newPage(b, tag) {
  const ctx = await b.newContext({ timezoneId: "Australia/Sydney" }); const p = await ctx.newPage();
  p.on("pageerror", e => errs.push(`${tag} ${e.message}`));
  return { ctx, p };
}
async function saveWithOldWorker(p, v, langs) {
  await p.evaluate(u => navigator.serviceWorker.controller.postMessage({ type: "cache-data", urls: u }), qurls(langs));
  const name = `islam-everyday-data-v${v}`, want = langs.length * 114;
  for (let i = 0; i < 150; i++) { if (await dataCount(p, name) >= want) break; await sleep(200); }
  return dataCount(p, name);
}
async function deployNew(p, wantApp) {
  await serve(NEW); await p.reload(); await sleep(500);
  // wait until the new worker has installed AND activated (activation is when old caches are deleted)
  for (let i = 0; i < 80; i++) {
    const st = await p.evaluate(async () => { const r = await navigator.serviceWorker.getRegistration(); return !!r && !r.installing && !r.waiting && !!r.active && r.active.state === "activated"; });
    if (st && (await keys(p)).includes(wantApp)) break; await sleep(250);
  }
  await p.reload(); await sleep(800);
}
const seedUser = (p, flagV) => p.evaluate(([KEY, flagV]) => {
  const s = JSON.parse(localStorage.getItem(KEY) || "{}");
  s.log = { ...(s.log || {}), "2026-10-01": { fajr: true, dhuhr: true } }; s.bm = ["33:5"]; s.fplan = { "2026-10-24": { f: true, n: "keep" } };
  localStorage.setItem(KEY, JSON.stringify(s)); localStorage.setItem(KEY + ".offline.v" + flagV, "1");
}, [KEY, flagV]);
const userKept = p => p.evaluate(KEY => { const s = JSON.parse(localStorage.getItem(KEY)); return !!(s.log && s.log["2026-10-01"] && s.log["2026-10-01"].fajr && (s.bm || []).includes("33:5") && s.fplan && s.fplan["2026-10-24"] && s.fplan["2026-10-24"].n === "keep"); }, KEY);
async function foreignCaches(p) {
  await p.evaluate(async () => { const c = await caches.open("other-app-cache"); await c.put("/other/thing", new Response("keep me")); const d = await caches.open("my-islam-everyday-notes"); await d.put("/x", new Response("keep")); });
}
const foreignKept = async p => { const k = await keys(p); return k.includes("other-app-cache") && k.includes("my-islam-everyday-notes") && await p.evaluate(async () => (await (await caches.match("/other/thing")).text()) === "keep me"); };
const openSurahOffline = async (p, s, a) => { await p.goto(BASE + "#quran"); await sleep(500); await p.click(`[data-act="surah"][data-s="${s}"] >> nth=0`); await sleep(1200); return p.evaluate(a => document.querySelector(`#a-${a} .tr`)?.textContent || "", a); };

/* Update from an older release with its own cache names (v4, v5): the Qur'an data changed, so the user must save again. */
async function updateFromOld(b, v, langs) {
  const tag = `v${v}->current`;
  if (!OLD[v]) return skipped(`${tag}: update scenario (no --v${v} build given)`);
  await serve(OLD[v]);
  const { ctx, p } = await newPage(b, tag);
  await p.goto(BASE + "#today"); await controlled(p);
  await seedUser(p, v); await foreignCaches(p);
  const n = await saveWithOldWorker(p, v, langs);
  ok(`${tag}: the old worker saved the Qur'an (${langs.length * 114} files)`, n >= langs.length * 114, String(n));
  await deployNew(p, "islam-everyday-app-v6");
  const k = await keys(p);
  ok(`${tag}: current caches active; this app's old caches removed`, k.includes("islam-everyday-app-v6") && !k.some(x => new RegExp(`^islam-everyday-(app|data)-v${v}$`).test(x)), JSON.stringify(k));
  ok(`${tag}: caches of other apps on the same origin are kept`, await foreignKept(p), JSON.stringify(k));
  ok(`${tag}: prayer log, bookmarks and fasting plans kept`, await userKept(p));
  await p.goto(BASE + "#more/settings"); await sleep(500);
  ok(`${tag}: settings asks to save the Qur'an again (data changed)`, !/Saved/.test(await p.textContent('[data-act="savequran"]')) && await p.locator('[role="note"]').count() >= 1);
  await down(); await p.goto(BASE + "#more/hadith"); await sleep(800);
  ok(`${tag}: offline after the update, the new app opens (Hadith page, 40 cards)`, await p.locator(".hadith").count() === 40);
  await serve(NEW); await p.goto(BASE + "#more/settings"); await sleep(500); await p.click('[data-act="savequran"]');
  for (let i = 0; i < 200; i++) { if (await p.evaluate(KEY => localStorage.getItem(KEY + ".offline.v6") === "1", KEY)) break; await sleep(200); }
  ok(`${tag}: saving again stores all 456 files`, await dataCount(p, "islam-everyday-data-v6") === 456 && await p.evaluate(([KEY, v]) => localStorage.getItem(KEY + ".offline.v" + v) === null, [KEY, v]));
  await down();
  ok(`${tag}: offline, surah 33 opens with the current English`, /Allah is Forgiving, Merciful$/.test(await openSurahOffline(p, 33, 5)));
  await ctx.close();
}

(async () => {
  const b = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});

  /* 1. Fresh installation */
  await serve(NEW);
  let { ctx, p } = await newPage(b, "fresh");
  await p.goto(BASE + "#today"); await controlled(p);
  const core = await p.evaluate(async () => (await (await caches.open("islam-everyday-app-v6")).keys()).map(r => new URL(r.url).pathname));
  const html = await (await fetch(BASE + "index.html")).text();
  const scripts = [...html.matchAll(/src="([^"]+)"/g)].map(m => "/" + m[1]);
  ok("fresh: the worker controls the page and precaches every script index.html loads", scripts.every(s => core.includes(s)) && core.includes("/index.html"), scripts.filter(s => !core.includes(s)).join(","));
  await down();
  await p.goto(BASE + "#more/hadith"); await sleep(800);
  ok("fresh, offline: Hadith opens", await p.locator(".hadith").count() === 40);
  await p.click('[data-act="hcol"][data-k="nawawi"]'); await sleep(300);
  ok("fresh, offline: An-Nawawi's Forty opens", await p.locator(".hadith.nw").count() === 42);
  await p.goto(BASE + "#more/zakat"); await sleep(400);
  ok("fresh, offline: Zakat and theme boot work", await p.locator("#zk-result").count() === 1 && !!(await p.evaluate(() => document.documentElement.dataset.theme)));
  await p.goto(BASE + "#quran"); await sleep(300); await p.click('[data-act="surah"][data-s="50"] >> nth=0'); await sleep(1500);
  ok("fresh, offline: an unsaved surah shows a message, not a crash", await p.locator(".ayah").count() === 0 && /offline|connection|load/i.test(await p.textContent("#view")));
  await ctx.close();

  /* 2. Interrupted save: the connection drops part-way */
  await serve(NEW);
  ({ ctx, p } = await newPage(b, "interrupted"));
  await p.goto(BASE + "#more/settings"); await controlled(p); await sleep(300);
  await p.click('[data-act="savequran"]');
  for (let i = 0; i < 100; i++) { if (await dataCount(p, "islam-everyday-data-v6") >= 130) break; await sleep(50); }
  await down();
  for (let i = 0; i < 100; i++) { if (await p.evaluate(() => !document.querySelector('[data-act="savequran"]').disabled)) break; await sleep(200); }
  const part = await dataCount(p, "islam-everyday-data-v6");
  const flag = await p.evaluate(KEY => localStorage.getItem(KEY + ".offline.v6"), KEY);
  ok("interrupted: the save is not reported as complete; the button is available again", flag === null && part < 456 && !/Saved/.test(await p.textContent('[data-act="savequran"]')), `${part} files, flag ${flag}`);
  await p.reload(); await sleep(600);
  ok("interrupted: after a reload, settings still says not saved", !/Saved/.test(await p.textContent('[data-act="savequran"]')));
  ok("interrupted: a surah whose Arabic and English were stored still opens offline", /Praise be to Allah, Lord of the Worlds/.test(await openSurahOffline(p, 1, 2)));
  await serve(NEW); await p.goto(BASE + "#more/settings"); await sleep(500); await p.click('[data-act="savequran"]');
  for (let i = 0; i < 200; i++) { if (await p.evaluate(KEY => localStorage.getItem(KEY + ".offline.v6") === "1", KEY)) break; await sleep(200); }
  ok("interrupted: saving again completes all 456 files", await dataCount(p, "islam-everyday-data-v6") === 456 && /Saved/.test(await p.textContent('[data-act="savequran"]')));
  await ctx.close();

  /* 3–4. Updates from the released version and from Phase 4 (different cache names, changed data) */
  await updateFromOld(b, 4, ["ar", "en", "bn"]);
  await updateFromOld(b, 5, ["ar", "en", "bn", "bnt"]);

  /* 5. Update from the Phase 5.2 local build: same cache names, unchanged data; a saved Qur'an must stay saved */
  if (!OLD[52]) skipped("v5.2->current: update scenario (no --v52 build given)");
  else {
    await serve(OLD[52]);
    ({ ctx, p } = await newPage(b, "v5.2->current"));
    await p.goto(BASE + "#today"); await controlled(p);
    ok("v5.2: the old build has no An-Nawawi collection (baseline)", await p.evaluate(() => !document.querySelector('script[src="assets/nawawi.js"]')));
    await seedUser(p, 6); await foreignCaches(p);
    const n = await saveWithOldWorker(p, 6, ["ar", "en", "bn", "bnt"]);
    ok("v5.2: the old worker saved all 456 files", n === 456, String(n));
    await deployNew(p, "islam-everyday-app-v6");
    for (let i = 0; i < 40 && !(await p.evaluate(async () => !!(await caches.match("assets/nawawi.js")))); i++) await sleep(250);
    ok("v5.2->current: the new worker precached the new files into the app cache", await p.evaluate(async () => !!(await caches.match("assets/nawawi.js")) && !!(await caches.match("assets/theme-boot.js"))));
    ok("v5.2->current: the saved Qur'an stays saved (456 files, flag kept, no re-save note)", await dataCount(p, "islam-everyday-data-v6") === 456 && await p.evaluate(KEY => localStorage.getItem(KEY + ".offline.v6") === "1", KEY));
    ok("v5.2->current: user data and other apps' caches kept", await userKept(p) && await foreignKept(p));
    const cachedIndex = await p.evaluate(async () => (await (await caches.match("index.html")).text()).includes("assets/nawawi.js"));
    ok("v5.2->current: the cached app shell is the new one", cachedIndex);
    await down();
    await p.goto(BASE + "#more/hadith"); await sleep(800); await p.click('[data-act="hcol"][data-k="nawawi"]'); await sleep(300);
    ok("v5.2->current, offline: the new An-Nawawi collection opens", await p.locator(".hadith.nw").count() === 42);
    ok("v5.2->current, offline: surah 33 opens", /Allah is Forgiving, Merciful$/.test(await openSurahOffline(p, 33, 5)));
    await p.goto(BASE + "#more/settings"); await sleep(400);
    ok("v5.2->current, offline: settings still reports the Qur'an as saved", /Saved/.test(await p.textContent('[data-act="savequran"]')));
    await ctx.close();
  }

  /* 6. Returning user, offline, language switch in the reader */
  await serve(NEW);
  ({ ctx, p } = await newPage(b, "returning"));
  await p.goto(BASE + "#more/settings"); await controlled(p); await sleep(300); await p.click('[data-act="savequran"]');
  for (let i = 0; i < 200; i++) { if (await p.evaluate(KEY => localStorage.getItem(KEY + ".offline.v6") === "1", KEY)) break; await sleep(200); }
  await down();
  await p.goto(BASE + "#quran"); await sleep(400); await p.click('[data-act="surah"][data-s="2"] >> nth=0'); await sleep(1200);
  await p.click('[data-act="lang"]'); await sleep(1500);
  ok("returning, offline: the reader switches to Bangla from the saved copy", /[ঀ-৿]/.test(await p.evaluate(() => document.querySelector("#a-255 .tr")?.textContent || "")));
  await ctx.close();

  await down(); await b.close();
  ok("no page errors", !errs.length, errs.join(" | "));
  console.log(`\n${pass} passed, ${fail} failed, ${skip} skipped`);
  process.exit(fail ? 1 : 0);
})().catch(async e => { console.error(e); await down(); process.exit(1); });
