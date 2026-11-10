// UI rework, November 2026: hero lines, reminders, sound and vibration, section slides, splash, How to pray.
import { test } from "node:test";
import assert from "node:assert/strict";
import { read, loadBrowser, exists, json } from "./helpers.mjs";

const app = read("assets/app.js"), css = read("assets/app.css"), html = read("index.html"), sw = read("sw.js");
const { I18N } = loadBrowser("assets/data.js").DINSATHI;
const HR = loadBrowser("assets/heroes.js").IE_HEROES;
const SL = loadBrowser("assets/salah.js").IE_SALAH;
const verses = (l, s) => { const j = json(`data/quran/${l}/${String(s).padStart(3, "0")}.json`); return Array.isArray(j) ? j : j.t; };

test("hero lines: 3 to 7 for each prayer and for Jumu'ah, at least 15 for the Qur'an page", () => {
  for (const k of ["fajr", "dhuhr", "asr", "maghrib", "isha", "jumuah"]) assert.ok(HR.PRAYER[k].length >= 3 && HR.PRAYER[k].length <= 7, k);
  assert.ok(HR.QURAN.length >= 15);
  assert.equal(HR.HADITH_HERO.k, "h");
});

test("hero Qur'an text is the app's own data, unchanged, in Arabic, English and Bangla", () => {
  for (const x of [...Object.values(HR.PRAYER).flat(), ...HR.QURAN]) {
    if (x.k !== "q") continue;
    for (const l of ["ar", "en", "bn"]) { const v = verses(l, x.s); x[l].forEach((t, i) => assert.equal(t, v[x.a - 1 + i], `${l} ${x.s}:${x.a + i}`)); }
    assert.equal(x.en.length, x.b - x.a + 1);
  }
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

test("sound: generated on the device, five background sounds, follows the phone's sound profile; vibration is separate", () => {
  const snd = read("assets/sound.js"), S = loadBrowser("assets/sound.js").IE_SOUND;
  assert.deepEqual([...S.KINDS], ["wind", "rain", "drops", "river", "ocean"]);
  assert.doesNotMatch(snd, /new Audio\(|\.mp3|\.ogg|\.wav|fetch\(/, "no audio files");
  assert.doesNotThrow(() => { S.setVolume(50); S.setAmbient("rain"); S.setMuted(true); S.tap(); S.pause(); S.resume(); }, "safe where Web Audio is missing");
  assert.match(app, /SND\.setMuted\(ringer !== "normal"\)/);
  assert.match(read("android-app/android/app/src/main/java/com/simplymadestudio/islameveryday/RingerPlugin.java"), /getRingerMode\(\)/);
  assert.match(read("android-app/android/app/src/main/java/com/simplymadestudio/islameveryday/MainActivity.java"), /registerPlugin\(RingerPlugin\.class\)/);
  const buzz = app.slice(app.indexOf("const buzz = p =>"), app.indexOf("const SND ="));
  assert.doesNotMatch(buzz, /ringer|SND|st\.motion/, "vibration depends only on its own setting");
  for (const k of ["vb_off", "vb_light", "vb_medium", "vb_strong", "ab_wind", "ab_rain", "ab_drops", "ab_river", "ab_ocean", "vol"]) assert.ok(I18N.en[k] && I18N.bn[k], k);
});

test("section slides use a spring; filter rows keep the page margin; sheets blur the page on phones", () => {
  assert.match(css, /html\[data-vt\]::view-transition-new\(root\)\{animation:vt-in \.5s var\(--bounce\) both\}/);
  assert.match(css, /--bounce:linear\(/);
  assert.match(css, /\.chips\{scroll-padding-inline:16px\}/);
  assert.match(css, /@media \(pointer:coarse\)\{@supports[^{]*\{\s*\.scrim\{[^}]*backdrop-filter:blur\(14px\)/);
});

test("splash: the doorway is there from the first frame, and the three promises are shown in both languages", () => {
  assert.doesNotMatch(css, /\.sp-arch,\.sp-hz\{[^}]*stroke-dashoffset:1/);
  assert.match(html, /<p class="sp-promise"><span lang="en"><b>No account<\/b><i><\/i><b>No ads<\/b><i><\/i><b>No data collected<\/b><\/span><span lang="bn">/);
  assert.match(read("assets/theme-boot.js"), /r\.setAttribute\("data-lang", st\.lang === "bn" \? "bn" : "en"\)/);
  assert.match(read("android-app/android/app/src/main/res/values/styles.xml"), /windowSplashScreenAnimatedIcon">@drawable\/splash_door</);
  assert.match(css, /html\.native \.sp-door\{position:absolute;left:50%;top:50%;width:120px/);
});

test("How to pray: five schools, complete two-rak'ah sequences in both languages, labelled as not reviewed", () => {
  assert.deepEqual([...SL.SCHOOLS], ["hanafi", "maliki", "shafii", "hanbali", "jafari"]);
  for (const k of SL.SCHOOLS) {
    const st = SL.steps(k); assert.ok(st.length >= 17, k);
    for (const s of st) { assert.ok(SL.POSE[s.pose], `${k} ${s.id} pose`); assert.ok(s.t.en && /[ঀ-৿]/.test(s.t.bn) && s.d.en && /[ঀ-৿]/.test(s.d.bn), `${k} ${s.id} text`); if (s.via) assert.ok(SL.POSE[s.via]); }
    assert.equal(st.filter(s => s.pose === "ruku").length, 2, k + " bows twice"); assert.equal(st.filter(s => s.pose === "sujud").length, 4, k + " prostrates four times");
    assert.ok(SL.NOTES[k].length >= 5 && SL.SOURCES[k].length >= 2, k);
    assert.match(SL.draw(SL.POSE.sujud, { turbah: true }), /sl-turbah/);
  }
  assert.ok(!SL.steps("maliki").some(s => s.id === "salamL"), "Maliki: one salam");
  assert.ok(SL.steps("jafari").some(s => s.id === "qunutB") && SL.steps("shafii").some(s => s.id === "qunutA"));
  assert.ok(SL.steps("shafii").some(s => s.id === "raf") && !SL.steps("hanafi").some(s => s.id === "raf"));
  const m = SL.mix(SL.POSE.stand, SL.POSE.ruku, 0.5), j = SL.joints(m), d = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
  assert.ok(Math.abs(d(j.hip, j.knee) - 40) < 0.01 && Math.abs(d(j.hip, j.sh) - 50) < 0.01, "limbs keep their length while blending");
  assert.match(I18N.en.pr_review, /not yet been reviewed by a qualified scholar/); assert.match(app, /\$\{t\("pr_review"\)\}/);
  assert.match(app, /pray: \["salah"\]/); assert.ok(sw.includes('"assets/salah.js"'));
});

test("Android: only the share folder can be handed to other apps; the policy names saved coordinates in backups", () => {
  const fp = read("android-app/android/app/src/main/res/xml/file_paths.xml");
  assert.match(fp, /<cache-path name="share" path="share\/" \/>/); assert.doesNotMatch(fp, /external-path/);
  const LG = loadBrowser("assets/legal.js").IE_LEGAL, en = JSON.stringify(LG.PRIVACY.en), bn = JSON.stringify(LG.PRIVACY.bn);
  assert.match(en, /latitude and longitude/); assert.match(en, /notification permission/); assert.match(bn, /অক্ষাংশ ও দ্রাঘিমাংশ/); assert.match(bn, /নোটিফিকেশনের অনুমতি/);
});
