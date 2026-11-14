// UI rework, November 2026: hero lines, reminders, sound and vibration, section slides, splash.
// (How to pray was removed on 14 Nov 2026 at the owner's request; its tests went with it.)
import { test } from "node:test";
import assert from "node:assert/strict";
import { read, loadBrowser, exists, json } from "./helpers.mjs";

const app = read("assets/app.js"), css = read("assets/app.css"), html = read("index.html"), sw = read("sw.js");
const { I18N } = loadBrowser("assets/data.js").DINSATHI;
const HR = loadBrowser("assets/heroes.js").IE_HEROES;
const verses = (l, s) => { const j = json(`data/quran/${l}/${String(s).padStart(3, "0")}.json`); return Array.isArray(j) ? j : j.t; };

test("hero lines: at least 8 for each prayer and for Jumu'ah, at least 15 for the Qur'an page", () => {
  // Nov 2026 (intentional): the earlier limit of 7 per prayer was lifted and more lines added.
  for (const k of ["fajr", "dhuhr", "asr", "maghrib", "isha", "jumuah"]) assert.ok(HR.PRAYER[k].length >= 8, k + " " + HR.PRAYER[k].length);
  assert.ok(HR.QURAN.length >= 15);
  assert.equal(HR.HADITH_HERO.k, "h");
});

test("hero Qur'an text is published text, unchanged: Arabic and Bangla from the app's data, English from Rowwad", () => {
  // 14 Nov 2026 (owner's request: simple English): the English is the Rowwad Translation Center's plain modern
  // English (assets/en-rwwad.js, QuranEnc), copied unchanged; Pickthall stays in the Qur'an reader.
  const RW = loadBrowser("assets/en-rwwad.js").IE_RWWAD;
  for (const x of [...Object.values(HR.PRAYER).flat(), ...HR.QURAN]) {
    if (x.k !== "q") continue;
    for (const l of ["ar", "bn"]) { const v = verses(l, x.s); x[l].forEach((t, i) => assert.equal(t, v[x.a - 1 + i], `${l} ${x.s}:${x.a + i}`)); }
    assert.equal(x.enSrc, "rw");
    x.en.forEach((t, i) => assert.equal(t, RW.get(x.s, x.a + i)[0], `en ${x.s}:${x.a + i}`));
    assert.equal(x.en.length, x.b - x.a + 1);
  }
  // the hero and reminders leave out only Rowwad's footnote numbers (no notes are shown there), never words
  assert.match(app, /const heroTr = x => st\.lang === "en" && x\.enSrc === "rw" \? x\.en\.map\(v => v\.replace\(\/\\s\*\\\[\\d\+\\\]\/g, ""\)\)/);
  assert.match(app, /const heroPlain = x => x\.k === "q" \? "“" \+ heroTr\(x\)/);
  assert.equal(RW.META.version, "1.0.21");
});

test("hero hadiths carry a reference in both languages, a sunnah.com link and both texts; the weak forty-hadith narration is not used", () => {
  const all = [...Object.values(HR.PRAYER).flat(), ...HR.QURAN, HR.HADITH_HERO].filter(x => x.k === "h");
  assert.ok(all.length >= 15);
  for (const x of all) { assert.match(x.url, /^https:\/\/sunnah\.com\/[a-z]+:\d+[a-z]?$/); assert.ok(x.ref.en && /[ঀ-৿]/.test(x.ref.bn)); assert.ok(x.en.length > 20 && /[ঀ-৿]/.test(x.bn)); }
  assert.doesNotMatch(JSON.stringify(HR.HADITH_HERO), /forty|চল্লিশ/i);
  for (const w of ["নামায", "হাদীস", "সহীহ", "বুখারী"]) assert.ok(!all.some(x => (x.bn + x.ref.bn).includes(w)), w);
});

test("hero lines change each day in order; Jumu'ah and the Qur'an line change each week, on Thursday", () => {
  const d = HR.dayNo(2026, 11, 10), L = HR.PRAYER.fajr;
  const i = L.indexOf(HR.forPrayer("fajr", d)); assert.equal(HR.forPrayer("fajr", d + 1), L[(i + 1) % L.length]);
  assert.equal(new Date(Date.UTC(2026, 10, 12)).getUTCDay(), 4, "12 Nov 2026 is a Thursday");
  const th = HR.dayNo(2026, 11, 12);
  assert.notEqual(HR.forWeek(th - 1), HR.forWeek(th)); assert.equal(HR.forWeek(th), HR.forWeek(th + 6)); assert.notEqual(HR.forWeek(th + 6), HR.forWeek(th + 7));
  assert.equal(HR.forPrayer("jumuah", th + 1), HR.forPrayer("jumuah", th + 1));
});

test("the Today hero shows the line for the current prayer; the adhan note moved to the times card", () => {
  assert.match(app, /\$\{skyQuote\(cur, nx\)\}/);
  assert.match(app, /k === "dhuhr" && isFriD\(D\) \? "jumuah" : k/);
  assert.ok(app.indexOf('<p class="adhan-note">') > app.indexOf('<section class="card a-times">'));
  assert.match(app, /\$\{hadithHero\(\)\}/); assert.match(app, /\$\{quranHero\(\)\}/);
});

test("reminders: five prayers, three times to avoid with their end, Thursday's Qur'an line; scheduled on the device", () => {
  assert.match(app, /nat\("LocalNotifications", "schedule", \{ notifications: list \}\)/);
  assert.match(app, /nat\("LocalNotifications", "requestPermissions"\)/);
  assert.match(app, /getUTCDay\(\) === 4\) out\.push\(\{ id: n \* 16 \+ 10, at: D\.base \+ 20 \* 36e5/);
  assert.match(app, /\["fsun", D\.abs\("sunrise"\), tm\.sunrise \+ 0\.25\], \["fzaw", D\.abs\("dhuhr"\) - 6e5, tm\.dhuhr\], \["fset", D\.abs\("maghrib"\) - 9e5, tm\.maghrib\]/);
  assert.match(I18N.en.nf_forb_b, /\{w\}.*until \{e\}/);
  assert.match(sw, /addEventListener\("notificationclick"/);
  assert.doesNotMatch(app + sw, /pushManager|PushSubscription/, "no push server");
  const pkg = json("android-app/package.json"); assert.ok(pkg.dependencies["@capacitor/local-notifications"]);
  assert.match(read("android-app/android/app/capacitor.build.gradle"), /capacitor-local-notifications/);
  assert.ok(exists("android-app/android/app/src/main/res/drawable/ic_stat_door.xml"));
});

test("sound: generated on the device, three soft touch sounds, no background sound, follows the phone's sound profile; vibration is separate", () => {
  // Nov 2026 (intentional): background sounds were removed; the touch sound has three soft kinds.
  const snd = read("assets/sound.js"), S = loadBrowser("assets/sound.js").IE_SOUND;
  assert.deepEqual([...S.TOUCH], ["soft", "drop", "bubble"]);
  assert.equal(S.KINDS, undefined); assert.equal(S.setAmbient, undefined);
  assert.doesNotMatch(snd, /new Audio\(|\.mp3|\.ogg|\.wav|fetch\(/, "no audio files");
  assert.doesNotThrow(() => { S.setVolume(50); S.setKind("drop"); S.setMuted(true); S.tap(); S.preview("bubble"); S.pause(); S.resume(); }, "safe where Web Audio is missing");
  assert.match(app, /SND\.setMuted\(ringer !== "normal"\)/);
  assert.match(read("android-app/android/app/src/main/java/com/simplymadestudio/islameveryday/RingerPlugin.java"), /getRingerMode\(\)/);
  assert.match(read("android-app/android/app/src/main/java/com/simplymadestudio/islameveryday/MainActivity.java"), /registerPlugin\(RingerPlugin\.class\)/);
  const buzz = app.slice(app.indexOf("const buzz = p =>"), app.indexOf("const SND ="));
  assert.doesNotMatch(buzz, /ringer|SND|st\.motion/, "vibration depends only on its own setting");
  assert.doesNotMatch(app, /st\.amb\b|setAmbient/, "no background sound left");
  for (const k of ["vb_off", "vb_light", "vb_medium", "vb_strong", "tk_soft", "tk_drop", "tk_bubble", "snd_k", "vol"]) assert.ok(I18N.en[k] && I18N.bn[k], k);
});

test("section slides ease out (Fade cross-fades); filter rows keep the page margin; sheets blur the page on phones", () => {
  // Nov 2026 (intentional): one long ease-out instead of the spring; Motion: Fade cross-fades the pages.
  // Nov 2026 (13th, intentional): the new page waits for the old to leave, and the pair is not blended.
  assert.match(css, /html\[data-vt\]::view-transition-new\(root\)\{animation:vt-in \.4s cubic-bezier\(\.16,1,\.3,1\) \.09s both\}/);
  assert.match(css, /::view-transition-new\(root\)\{mix-blend-mode:normal\}/);
  assert.match(css, /html\[data-vt\]\[data-motion="fade"\]::view-transition-new\(root\)\{animation:vt-fi /);
  assert.match(css, /--bounce:linear\(/);
  assert.match(css, /\.chips\{scroll-padding-inline:16px\}/);
  assert.match(css, /@media \(pointer:coarse\)\{@supports[^{]*\{\s*\.scrim\{[^}]*backdrop-filter:blur\(14px\)/);
});

test("splash: the doorway is there from the first frame, and the three promises are shown in both languages", () => {
  assert.doesNotMatch(css, /\.sp-arch\{[^}]*stroke-dashoffset/, "the doorway is drawn, not drawn in");
  assert.match(html, /<p class="sp-promise"><span lang="en"><b>No account<\/b><i><\/i><b>No ads<\/b><i><\/i><b>No data collected<\/b><\/span><span lang="bn">/);
  assert.match(read("assets/theme-boot.js"), /r\.setAttribute\("data-lang", st\.lang === "bn" \? "bn" : "en"\)/);
  assert.match(read("android-app/android/app/src/main/res/values/styles.xml"), /windowSplashScreenAnimatedIcon">@drawable\/splash_door</);
  assert.match(css, /\.sp-logo\{position:absolute;left:50%;top:50%;width:120px;height:130\.5px;margin:-65\.25px 0 0 -60px\}/, "where Android's launch screen draws it");
});

test("tab bar is kept and updated, so its pill slides; segmented controls have a sliding pill", () => {
  const navSrc = app.slice(app.indexOf("function nav()"), app.indexOf("const SEGP"));
  assert.match(navSrc, /if \(navLang !== st\.lang \|\| !box\.querySelector\("\.ind"\)\)/, "rebuilt only when the language changes");
  assert.match(navSrc, /ind\.style\.transform = `translateX/);
  assert.match(navSrc, /pill\.animate\(/); assert.match(navSrc, /ico\.animate\(/);
  assert.match(app, /function segThumbs\(\)/); assert.match(app, /segThumbs\(\);\n  fitClamps\(\);/);
  assert.match(css, /\.seg\.has-th>button\[aria-pressed="true"\]\{background:transparent;box-shadow:none\}/);
});

test("opening: the app hands over at the first painted frame; the page waits drawn and settles as the door opens", () => {
  assert.match(app, /requestAnimationFrame\(\(\) => requestAnimationFrame\(release\)\);\n  setTimeout\(release, 1200\);/);
  assert.match(app, /const held = anim && !viaVT && underSplash\(\);/);
  assert.match(css, /\.view\.door\.enter>\*\{animation:rise-door/);
  assert.doesNotMatch(css, /\.view\.hold>\*\{opacity:0\}/, "the page is never hidden behind the splash (that forced a full repaint as the door opened)");
  assert.match(css, /\.v-today>:nth-child\(n\+5\)\{content-visibility:auto/);
});

test("Android: only the share folder can be handed to other apps; the policy names saved coordinates in backups", () => {
  const fp = read("android-app/android/app/src/main/res/xml/file_paths.xml");
  assert.match(fp, /<cache-path name="share" path="share\/" \/>/); assert.doesNotMatch(fp, /external-path/);
  const LG = loadBrowser("assets/legal.js").IE_LEGAL, en = JSON.stringify(LG.PRIVACY.en), bn = JSON.stringify(LG.PRIVACY.bn);
  assert.match(en, /latitude and longitude/); assert.match(en, /notification permission/); assert.match(bn, /অক্ষাংশ ও দ্রাঘিমাংশ/); assert.match(bn, /নোটিফিকেশনের অনুমতি/);
});
