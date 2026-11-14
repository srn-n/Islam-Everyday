# AGENTS.md: Islam Everyday

Project context for AI coding agents (Codex, Claude and others). Read this file in full before changing anything.
`README.md` is the long reference for content, sources and licences; `CHANGELOG.md` is the user-facing history.

**This file must be kept current.** Every change made by an agent ends by updating section 9 (Current state) and
adding an entry to section 10 (Agent log). See rule 1 below.

---

## 1. Ground rules (read first)

1. **Update this file with every change.** At the end of each task: update section 9 (Current state, next tasks) and
   add a dated entry at the top of section 10 (Agent log): what changed, which files, why, how it was tested, and
   anything left open. If the change is visible to users, also add an entry to `CHANGELOG.md`.
2. **The owner commits and pushes.** Agents edit the working tree only. Do not run `git commit`, `git push`, create
   branches, tags or releases. Finish by listing the changed files and giving the exact `git add` / `git commit` /
   `git push` commands for the owner to run.
3. **Tests must pass.** Run `npm test` before finishing. Add or update tests in `tests/` for every behaviour change
   (the existing tests are the spec: read the relevant one before editing a feature).
4. **Desktop design is final.** Further visual or performance changes are for phones (and the Android app) only,
   unless the owner asks otherwise. Scope phone-only CSS with `@media (pointer:coarse)` and phone-only JS with
   `phone()` / `NATIVE` (see section 4).
5. **Credit and contact.** The app is credited to **Simply Made Studio** only. Never add a personal name or any email
   address to the site, the app, the repo or this file. Feedback works through a `mailto:` link that is built at
   runtime; tests (`tests/feedback.test.mjs`, `tests/studio.test.mjs`) enforce that no address appears in shipped files.
6. **Privacy is a feature.** No accounts, no analytics, no ads, no trackers, no third-party requests: everything
   (fonts, Qur'an data, icons) ships with the site. The Content-Security-Policy in `vercel.json` allows only `'self'`.
   If a change would ever add data collection, a server or a network call, update `assets/legal.js` (and its date)
   and the Play Data safety answers first, and ask the owner.
7. **Religious text is never edited.** Do not change Qur'an text, Qur'an or hadith translations, dua meanings, or
   anything inside “ ” quotation marks (they are word-for-word quotes from published sources, including a known
   typo in Zakaria's Bangla 7:23 that must stay). Corrections to data go through the documented processes in
   `README.md` (for example `data/quran/en-corrections.json`). Any change to `data/quran/` needs a new `DATA_REV`
   in `sw.js` (`npm test` checks it).
8. **Two languages, always.** Every interface string exists in English and Bangla (`assets/data.js`, `I18N.en` and
   `I18N.bn`). Bangla is everyday, natural Bangla (not formal or literal translation), addressing the reader as
   "আপনি", with one spelling per word: নামাজ, হাদিস, সহিহ, বুখারি, যিকির, নাজিল, আজান (enforced by
   `tests/bangla.test.mjs`). Bangla times use spoken parts of the day (ভোর / সকাল / দুপুর / বিকাল / সন্ধ্যা / রাত).
9. **Scholarly honesty.** Content written for the app (stories, notes, reflections, the Prayer guide summary) is
   labelled as not reviewed by a qualified scholar. Never remove those labels or claim review that has not happened.
10. **Secrets never enter the repo.** The Android upload key lives outside the repo (see section 6). Do not print,
    copy or commit keys, passwords or GitHub secrets.

---

## 2. What the project is

Islam Everyday is a free daily Muslim companion in English and Bangla: prayer times and a prayer tracker, a Prayer
guide, the full Qur'an (Arabic, English, Bangla, Bangla short tafsir), Verse for today, Hadith, Duas, Hijri calendar,
99 Names, Qur'an stories and study notes, six colour themes. It works offline.

| | |
|---|---|
| Live website | https://islam-everyday.vercel.app/ (Vercel; deploys automatically on every push to `main`) |
| Repository | `srn-n/islam-everyday` (public). Local folder on the owner's PC: `C:\Working Projects\IslamEverydayWeb` |
| Android app | `com.simplymadestudio.islameveryday` (Capacitor 8.6), built on GitHub Actions; not yet on Google Play |
| Publisher | Simply Made Studio, New South Wales, Australia |
| Old names | DinSathi / DinSathi-Web (earlier working names; still in some docs and storage keys such as `dinsathi.web.v1`) |

---

## 3. Running and testing

No build step and no dependencies. Node.js 18 or newer.

```bash
npm start        # static server on http://localhost:8090 (scripts/serve.mjs, sends no-store)
npm test         # node:test suite, no browser, no network (184 tests as of 12 Nov 2026)
```

Browser suites (Playwright, run separately against a running server; install Playwright outside the repo):

```bash
CHROMIUM=/path/to/chrome node tests/browser/phase53.cjs http://localhost:8080/
# also: phase52.cjs, phase54.cjs, offline.cjs
```

Known failures that pre-date 10 Nov 2026 (not regressions): phase52 "Bangla touch calendar" and the Nawawi
"jump list moves to the hadith" check. The desktop calendar check is flaky.

Before finishing a phone/UI change, also check: no horizontal overflow at 320, 360 and 412 px wide in English and
Bangla, light and dark themes, and `prefers-reduced-motion`.

---

## 4. Architecture

A static single-page app: `index.html` loads plain scripts (no modules, no framework) in this order:
`theme-boot.js` (in `<head>`, applies theme before first paint), then `quran-meta.js`, `data.js`, `votd.js`,
`votd-en.js`, `votd-day.js`, `en-rwwad.js`, `locale.js`, `dayviz.js`, `zakat.js`, `bnfix.js`, `xtrack.js`,
`glossary.js`, `heroes.js`, `sound.js`, `app.js`. Large libraries (`hadith.js`, `nawawi.js`, `stories.js`, `study-notes.js`, `name-stories.js`,
`legal.js`, `names.js`, `guide.js`, `study.js`) are loaded on demand through `LAZY` / `need(group)` at the top of
`app.js`. Qur'an text is fetched per surah from
`data/quran/{ar,en,bn,bnt}/NNN.json`.

Key ideas in `assets/app.js`:

- **State and routing:** `R` (`{tab, sub, surah, ayah}`) and hash routes (`#today`, `#quran`, `#duas`, `#more/hadith`,
  `#more/privacy`, `#dua/25` …). `go(route)` changes route; `paint()` runs the change (with view-transition slides on
  phones); `render(anim)` rebuilds `#view` as an HTML string and then runs the `post` callbacks.
- **Settings and storage:** `st`, saved in `localStorage` under `dinsathi.web.v1`. Nothing leaves the device.
- **Platform switches:** `desk()` = desktop layout (wide screen); `phone()` = `(pointer: coarse)`;
  `NATIVE` = running inside the Android app (Capacitor). CSS mirrors these with media queries and `html.native`.
- **Opening splash** (`#splash`, rebuilt 14 Nov 2026): 4 s on the first open in a session (`MIN`), a tap skips it,
  later opens do not wait; reduced motion / Motion off: the still picture for 1.2 s. The doorway is a still SVG; the
  sky, sun, glow, ripples and words are HTML layers animated with opacity and transform only (compositor, smooth while
  the app starts underneath); a test enforces that. In the app it waits (class `sp-hold`) under Android's launch screen
  until the first screen is painted, then `release()` hides the native splash and starts it (`SplashScreen.hide`).
  Reminders and widget data wait until it is gone (`afterSplash`).
- **Prayer times** are computed on the device (MWL, Karachi, ISNA, Egypt, Umm al-Qura; Shafi'i/Hanafi Asr) in the
  chosen city's time zone. No prayer-time API.
- **Service worker** (`sw.js`, website only; the app has none): network-first for app code, cache-first for Qur'an
  data and fonts. `DATA_REV` must change with any `data/quran/` change. It only deletes its own caches.
- **Generated files:** `assets/stories.js`, `assets/study-notes.js`, `assets/name-stories.js`, `assets/en-rwwad.js` are
  built from `tools/` (Python/Node scripts). Edit the sources in `tools/` and rebuild; do not hand-edit the output.

`README.md` → "Project structure" has the full file map.

### Performance rules (learned 10 Nov 2026; keep them)

- Never redraw the whole page for an async update; update only the affected element (example: the Verse for today
  card when its surah file arrives).
- Create `Intl.DateTimeFormat` only through the cached `DTF(locale, options)` helper; building formatters is slow.
- Long lists on phones (Duas, Hadith) use `content-visibility:auto` for cards after the first 8, with
  `contain-intrinsic-height` (never the one-value `contain-intrinsic-size`, which also fixes the width). Measuring
  ("Read more" fits) goes through `fitCards()`: first 8 now, the rest via IntersectionObserver.
- Nothing heavy while the splash is showing (no minute redraw, no hidden animations).
- On phones only the header and tab bar use `backdrop-filter`; do not add blur to controls inside them.

---

## 5. Content and sources (summary)

Arabic Qur'an (Uthmani, QuranEnc via quran-json), English: Pickthall 1930 (with documented restorations), Bangla:
Dr. Abu Bakr Muhammad Zakaria v1.1.1 and Bangla Al-Mukhtasar v1.0.0 (QuranEnc terms: reproduce unchanged, credit,
no modification), hadith from HadeethEnc and sunnah.com, fonts under SIL OFL. Full table and terms: `README.md` →
"Credits and licences". Open review items for a scholar: `docs/scholar-review.md`, `docs/scholar-review-checklist.md`.

---

## 6. Android app

- Project: `android-app/` (Capacitor 8.6; target SDK 36, min SDK 24; web files bundled, works offline from the first
  open; kept off Vercel by `.vercelignore`). `android-app/scripts/copy-web.mjs` copies the site into the app;
  `make-icons.mjs` makes launcher icons and store graphics from `brand/`.
- Version: `versionCode` / `versionName` in `android-app/android/app/build.gradle` (currently 1 / 1.0.0). **Raise
  `versionCode` before every Play upload after the first.** The app ID is permanent once uploaded.
- Build: every push to `main` runs `.github/workflows/android.yml` ("Android bundle"): `npm test`, copy the site,
  build with SDK 36, sign with the upload key from GitHub secrets (`ANDROID_KEYSTORE_BASE64`,
  `ANDROID_STORE_PASSWORD`, `ANDROID_KEY_ALIAS`, `ANDROID_KEY_PASSWORD`), verify, delete the key. The artifact
  `islam-everyday-android` (kept 14 days) holds `IslamEveryday-<version>-signed.aab` (for Play),
  `…-signed.apk` (for test installs) and `SHA256SUMS.txt`. A file named `-unsigned` means the secrets were not read.
- Verify a build: `keytool -printcert -jarfile IslamEveryday-1.0.0-signed.aab`; the SHA-256 must be
  `24:92:23:50:06:1C:BF:E5:02:33:F6:C6:0D:58:48:45:86:FC:28:D0:92:8B:DB:C2:C6:D1:AF:11:23:D5:2C:F1`
  (the APK has a v2-only signature, so check it with `apksigner verify --print-certs`).
- Release files live **outside the repo** in `C:\Working Projects\IslamEverydayApp` (upload key in `keys\`, store
  graphics and screenshots in `store\`, the current `.aab`/`.apk`, `PLAY-CHECKLIST.md`, `HANDOVER.md`).
- App-only behaviour (Back button order, closing animation, share sheet, haptics, status bar) is in the website code
  behind `NATIVE`; see `android-app/README.md`.

---

## 7. Publishing workflow

1. Agent edits files and runs `npm test` (section 1, rules 2 and 3).
2. Owner commits and pushes to `main`.
3. Vercel deploys the website; GitHub Actions builds the signed Android bundle.
4. The build is downloaded from the Actions run, verified (section 6) and placed in `IslamEverydayApp`.
5. Play Console upload (closed test first; see section 9).

---

## 8. Known limitations

See `README.md` → "Known limitations" (no scholar review yet, high-latitude prayer times, translation notes, etc.).
Android behaviour has so far been tested only with a stubbed Capacitor in a browser; real-phone testing is pending.

---

## 9. Current state (update this with every change)

*Last updated: 14 November 2026.*

- Latest pushed commit: `5eb7899` (13 November: the 12 Notion tasks, the 7th picture, guide/Today layout fixes).
  Working tree: only this note (AGENTS.md) changed since.
- `npm test`: 202 pass.
- The Android build in `IslamEverydayApp` is build #12 for `5eb7899` (13 Nov): checksums OK, the `.aab` signed with the
  upload key, every bundled web file identical to the commit, the three WAVs identical, no Soft tap/Breeze files.
  Not yet tested on a phone; nothing uploaded to Play.
- New Android permissions come with the notifications plugin's own manifest: `POST_NOTIFICATIONS`,
  `RECEIVE_BOOT_COMPLETED`, `WAKE_LOCK`, `SCHEDULE_EXACT_ALARM`. Play Console: Data safety stays "no data collected";
  the exact-alarm permission may need a declaration (or remove it with `tools:node="remove"` in the app manifest;
  reminders then arrive within a few minutes instead of on the minute).
- Play Console: nothing uploaded yet.

**Next tasks, in order**

0. Owner: commit and push the 14 Nov batch; get the new build. On the phone check: the new four-second opening (cold
   start; smooth; a tap skips it; no dark first second), the home-screen widgets (both kinds, pictures, Change
   automatically), the avoided-times status on Today, the Prayer guide icon, Settings → Home-screen widgets.
0b. Developer message (More) is a blank page on purpose: the owner will send the text.
1. Test the `.apk` on a real Android phone: opening animation smoothness, Duas/Hadith opening speed, Back button and
   back gesture (Android 14–16), closing/reopening animation, rapid tab taps, light/dark theme and status bar,
   "My location" permission, share a dua as image, Copy link, Feedback opens the mail app, Bangla times, 360 px width.
2. Play Console: create the app (Islam Everyday, App, Free, Play App Signing ON); store listing in English and Bangla
   (icon, feature graphic, phone/7-inch/10-inch screenshots from `IslamEverydayApp\store\`); privacy policy URL
   `https://islam-everyday.vercel.app/#more/privacy`; Ads: no; Data safety: no data collected or shared; content
   rating (expect Everyone / PEGI 3); target audience 13+.
3. Closed test: personal developer accounts need 12+ testers opted in for 14 days before production access.
4. After 14 days: apply for production, then promote.

**Optional / later**

- Rewrite the long Bangla write-ups (Qur'an stories, 99 Names stories, study notes) in the same casual style as the
  interface, one section at a time, without touching quotes or translations (rule 7).
- Every spring: check Play's minimum target SDK (36 for 2026).

---

- **How to pray was removed (14 Nov, owner's decision):** the page, its menu entry, the link on Prayer guide, its
  files (`salah.js`, `salah-fig.js`, `salah-3d.js`, `assets/figure/`, `tools/prayer-figure/`), styles, text keys and
  tests. Do not bring it back without the owner asking. Older entries below describe it as history only.
- **Opening (14 Nov):** one 4 s style (see section 3); no `sp-long`. Background work waits for it (`afterSplash`).
- **Prayer guide icon:** a prayer mat (`P.guide`); the old arch read like a headstone.
- **Today** is the earlier page again: the row of five prayers and the shortcuts (13 Nov) were removed.
- **Startup colour:** `AppearancePlugin.java` makes Android's launch screen follow the app's own light/dark choice
  (Android 12+); `--sys-ground` follows `data-theme`. Not yet checked on a phone.

- **Android widgets (13 Nov, third batch, uncommitted):** "Prayer times" (next prayer + the five times of its day)
  and "Verse for today". The app sends seven days of data in its language and theme colours (`widgetSync` →
  `Widgets` plugin → `WidgetData.java`, SharedPreferences `ie_widgets`); `PrayerWidget`/`VerseWidget` only read it,
  wake at the next prayer or midnight with an ordinary alarm, and refresh every 30 minutes. Nothing leaves the phone.
- **Widget pictures (13 Nov; replaced 14 Nov):** 7 scenes other than the hero's (`WPICS`: lavender, bamboo, glacier,
  olive, aurora, valley, blossom; `assets/widgets-img/*.webp`, 960 px, generated with Picsart's AI Playground in the
  owner's account, `tools/widget-pictures.py`). Widget list previews: `res/drawable-nodpi/wg_prev_*.webp` from
  `tools/widget-previews.mjs` (`previewImage`; a `previewLayout` showed blank cards). Third widget: Verse for today
  large (4x4, `VerseWidgetLarge` extends `VerseWidget`, `widget_verse_large.xml`). Settings ▸ Home-screen widgets (Android app only): theme colour, a picture, or
  "Change automatically" (default: one step on at each prayer time, rule `dn × 5 + prayers begun`, same in
  `wgPicAt` and `WidgetData.picAt`). The phone crops each picture to the widget, rounds it and adds a dark wash;
  text turns white with a gold highlight.
- **Hero during avoided times:** while a window is on, `forbiddenLine` shows a status (`.forb-warn.on`) with a bold
  heading and the time left (ticks each second); the 10-minute advance note is unchanged.
- **Scene settings:** the marked card is `sceneToday()` (with Change every day on, labelled "Today").
- **Prayer widget (14 Nov, fourth):** under the place it shows the time left to the next prayer ("in 2 h 15 min",
  minutes rounded up, no seconds) instead of the clock time; during the three sun-based avoided windows (sunrise
  +15 min, 10 min before Dhuhr, 15 min before Maghrib, from `widgetData().days[].f`) it shows "Voluntary prayer
  avoided until …" in amber (and "… from …" in the `FORB_SOON` minutes before). It wakes each minute with a
  non-waking exact alarm when Android allows it (`WidgetData.scheduleNext(..., exact)`). After-Fajr and after-Asr
  windows are not on the widget (they depend on the tracker).
- **Launch colour (14 Nov, fifth):** the app opens on its theme's own ground with no colour shift. Android 13+:
  `AppearancePlugin.applySplash` sets the next start's launch theme to the light/dark pair's `Launch.<Light>.<Dark>`
  (9 styles in `res/values-v31/launch_themes.xml`, colours `lg_*`/`la_*` switching with night mode, doorways
  `splash_door_<l>_<d>.xml`, all generated from app.css by `node tools/launch-themes.mjs`; referenced as `R.style`
  constants so the build keeps them). Android 11 and older: the first frame is the window, painted in
  `AppearancePlugin.ground()`. Android 12 / 12L can only switch light/dark: default Sandstone / Jade
  (`values*/colors.xml`), and the opening eases from it (`--sys-ground`, set inline by theme-boot.js; elsewhere it is
  `var(--ground)` so nothing moves). JS sends `{mode, light, dark}` whenever one of them changes.
- **No blink when coming back (14 Nov, fifth):** quiet redraws of Today (`render(false)`: coming back to the app,
  the minute tick, a reminder ticked) go through `patchKids`, which compares the previous and new markup (templates)
  and changes only what differs; the hero picture, sky and arc stay. Other pages still redraw whole. Night mode is set
  again only when it changes (`getDefaultNightMode() != want`, prefs `nm`).
- **Simple English for verses outside the reader (14 Nov, owner's request):** the Today hero, the Qur'an page hero,
  prayer and Thursday reminders, the widgets, the Verse for today and Ayat al-Kursi all use the Rowwad Translation
  Center's plain modern English (QuranEnc), copied unchanged (`assets/en-rwwad.js`, now v1.0.21: 293 verses, from
  `tools/import-rwwad-subset.py <sqlite> 1.0.21`, then `node tools/heroes/build.mjs`). The hero and reminders hide
  only its footnote numbers (`heroTr`); the Verse for today shows them with the notes. The Qur'an reader keeps
  Pickthall (1930). No translation text was written or edited by us (rule 7).
- **Hero pictures (14 Nov, fourth):** 12 (`PHOTOS`): the seven Figma ones plus canyon, meadow, mangrove, village and
  falls made on Picsart (owner's account, AI Playground, GPT Image 2.5 Sunburst, 2K 16:9). `tools/hero-pictures.py`
  lowers WebP quality per file until it is under 105 KB. Adding pictures shifts which one shows on a given day.

## 10. Agent log (newest first)

Add a new entry at the top for every change: date, summary, files, tests, open items.

### 2026-11-15 (second): no blink on opening, opening starts at once, clean exit (uncommitted; owner to push)
- Owner: "after opening the app it blinks for a nanosecond, every time", and "the page is stuck at first, then the
  sun pops up; it feels laggy". Measured in Chromium at phone speed (4x CPU, a stand-in for Capacitor), screen
  recorded frame by frame:
  - Blink: 0.7 s after the door opened, `go()` removed the splash and the page's `door` class together; that swapped
    the page's running rise animation (rise-door → rise-b), which restarted it from invisible: the whole page vanished
    for a frame and faded in again (frame brightness 129 → 235 → 143). Fix: only the splash is removed; the class is
    cleared by the next render.
  - Stuck start: the splash is painted at about 0.1–0.2 s, but stayed frozen (sp-hold) until app.js had run and drawn
    Today (0.6–1.3 s here). Fix: `assets/splash-go.js`, loaded right after the splash markup, hides Android's launch
    screen and starts the opening two frames after it is painted; its opacity/transform animations play on while
    app.js runs. app.js falls back as before and counts the four seconds from `window.__spT0`.
  - "Sun pops up": the splash and the page cross-faded, so the doorway's sun and the name showed through over the
    hero picture and verse. Fix: the doorway and words fade first (0.2 s), the ground lifts from 0.16 s, the page
    rises from 0.14 s under it (app.css: `.splash.out .sp-in`, `.splash` transition, `rise-door` delay).
- Also: Bangla About credit for the Today pictures said seven (now twelve: seven Figma, five Picsart). The .md files
  stay in the repository after all (owner); the test guard `local()` in tests/helpers.mjs is harmless and kept.
- AI mentions checked (owner): no tool or company is named except the picture credits (Figma, Picsart); the app says
  plainly where text was drafted "with an AI assistant" (Qur'an study notes and stories, 99 Names stories) and that
  the pictures are AI-made, not real places. Left as they are (honest labels).
- Checked: 213 tests; browser phase53 63/63, phase54 14/14, offline 11/11; recordings: opening starts at 0.2 s, no
  bright frame on exit, no doorway over the hero.

### 2026-11-15: build #15 in IslamEverydayApp
- "Android bundle" #15 for `455dfa7` succeeded (2 min 47 s). Checked: SHA256SUMS match; AAB upload certificate Simply
  Made Studio `24:92:23:50:…:2C:F1`; all 549 bundled web files equal `git show HEAD:` (sw.js and Capacitor files
  skipped); the five new hero pictures, `patchKids` and Rowwad hero verses are in; manifest has PrayerWidget,
  VerseWidget, VerseWidgetLarge; the AAB has the 10 launch doorways, 9 `Launch.*` themes and the widget previews.
  APK, AAB and SHA256SUMS copied to IslamEverydayApp. Not yet tested on a phone.

### 2026-11-14 (fifth): launch colour matches the theme; no blink when coming back (uncommitted; owner to push)
- Owner: the app opened on a near-white screen, then shifted to the theme colour; and it blinked once or twice when
  coming back from recent apps. Causes: Android's launch screen and window were always Classic/Jade
  (`#EEF3F1`/`#08120F`) while a new install's theme is Sandstone (`#F3EADB`), and the page faded from one to the other;
  coming back redrew the whole Today page (`visibilitychange` → `render(false)`, often a second time on the minute
  tick), recreating the picture and the sky.
- Fix: per-theme launch screens (Android 13+), theme-coloured first frame (11 and older), Sandstone/Jade default
  (Android 12); in-place redraw of Today. Files: `AppearancePlugin.java`, `MainActivity.java`, `res/values*/colors.xml`,
  `res/values*/launch_colors.xml`, `res/values-v31/launch_themes.xml`, `res/drawable/splash_door*.xml`,
  `tools/launch-themes.mjs`, `assets/theme-boot.js`, `assets/app.js` (`patchKids`, `Appearance.set` payload, segThumbs),
  `assets/app.css` (`--sys-ground` fallbacks), tests `launch.test.mjs`, `nov13b.test.mjs`.
- Browser suites updated for earlier renames/text (Plum → Teal, Emerald → Sky, the avoided-times heading) and a slow
  scroll: phase53 63/63, phase54 14/14, offline 11/11, phase52 51/52 (the one left: a Bangla calendar wording check,
  not touched by this change; to look at).
- Checked: 212 tests pass; `assembleDebug` + `lintDebug` 0 errors; in a browser Today kept its nodes over three
  "come back" redraws (15 small text changes). Not seen on a phone: check cold start in each theme, Android 12 if one
  is at hand, and coming back from recents.

### 2026-11-14 (fourth): widget time left and avoided times, simple English verses, five hero pictures (uncommitted; owner to push)
- Prayer widget: time left instead of the clock time under the place; the three sun-based avoided windows shown in
  amber while on and in the minutes before (`PrayerWidget.java`, `WidgetData.java` `timeLeft`/`forbidden`/
  `nextForbiddenNotice`/exact `scheduleNext`, `widget_prayer.xml`; JS `widgetData()` sends `f`, `soon`, `inH`, `inM`;
  keys `wg_in_h`, `wg_in_m`, `fw_w_now`, `fw_w_soon`; preview image redrawn).
- "Use simple English for the verse in the hero, prayer notifications and the verse there": the Verse for today
  already used Rowwad; the heroes and reminders used Pickthall. Now all of them use Rowwad, copied unchanged.
  QuranEnc had issued v1.0.21 (footnotes renumbered across the whole translation; 2:45 reworded), so
  `en-rwwad.js` and the Ayat al-Kursi card were updated to it as its terms require. Files: `tools/import-rwwad-subset.py`,
  `tools/heroes/build.mjs`, `assets/en-rwwad.js`, `assets/heroes.js`, `assets/app.js` (`heroTr`, About credit),
  `assets/data.js` (`hq_b2` en+bn, Ayat al-Kursi), `tests/rework.test.mjs`.
- Five hero pictures from Picsart (`assets/heroes-img/{canyon,meadow,mangrove,village,falls}{,-s}.webp`, labels
  `ph_*` en+bn, About credit, `tools/hero-pictures.py`, tests `nov13`, `nov13c`).
- Checked: 209 tests pass; `assembleDebug` + `lintDebug` 0 errors; pictures and hero text looked at. Not seen on a phone.

### 2026-11-14 (third): widget previews, Picsart pictures, large Verse for today (uncommitted; owner to push)
- The phone's widget list showed blank white cards: `previewLayout` pointed at the real layouts, whose text the app
  fills in later. Now each widget has a `previewImage` drawn like the real widget (picture, wash, white text; the
  verses copied word for word from the app's widget data): `tools/widget-previews.mjs` → `drawable-nodpi/*.webp`.
- Widget pictures replaced with seven made on Picsart (owner's Pro account, AI Playground, GPT Image 2.5 Sunburst,
  2K 16:9) through the built-in browser; the Picsart connector itself cannot generate images. Names, settings
  labels (en+bn), About credits, default (`lavender`) updated; old stored choices fall back to `lavender`.
- New widget "Verse for today (large)", 4x4, bigger text (13–24 sp autosize), own alarm (code 3).
- Checked: `assembleDebug` + `lintDebug` 0 errors; previews looked at; 208 tests pass. Not seen on a phone.

### 2026-11-14: build #14 in IslamEverydayApp
- "Android bundle" #14 for `70b7eb4` succeeded. Checked: SHA256SUMS match; AAB upload certificate Simply Made Studio
  `24:92:23:50:…:2C:F1`; all 68 bundled web files equal `git show HEAD:`; no How to pray files in the app; the new
  opening is in; both widgets in the manifest. APK and AAB copied to IslamEverydayApp.

### 2026-11-14 (second): How to pray removed, new 4 s opening, Prayer guide icon (uncommitted; owner to push)
- **How to pray removed** at the owner's request ("the video is just a mess"): route, `vPray` and the player code,
  More menu entry, Prayer guide link, click/keyboard/Back handlers, lazy group, 50 text keys (en+bn), CSS, sw.js
  precache entries, README lines, files `assets/salah.js`, `salah-fig.js`, `salah-3d.js`, `assets/figure/`,
  `tools/prayer-figure/` (with the .blend). Tests for it removed; a test checks it stays gone. `#more/pray` lands on
  More. The Figma file "Islam Everyday – widget pictures" is unrelated and kept.
- **Opening rebuilt** (`index.html`, `app.css` "Opening (Nov 2026, 14th)", `app.js` boot, `theme-boot.js`): the old
  one animated SVG internals, letter-spacing and a moving background gradient (main-thread work on Android WebView,
  so it stuttered whenever the app was busy) across four CSS blocks with long/short/native variants. Now one block,
  4 s: sky fills the doorway, the sun rises, a glow and two ripples, the name word by word, studio, line, promises; a
  bar fills over 4 s. Only opacity/transform; `afterSplash` holds reminders and widget data until it has gone.
  Same first frame as Android's launch screen (doorway outline, centred 120 px).
- **Prayer guide icon:** prayer mat with a pointed arch and fringe.
- Checked: frames at 0.2–4.6 s in EN light and BN dark at 390 px (app showing by 4.6 s, no errors); More menu and
  Prayer guide page; `#more/pray`. Not checked on a phone (smoothness there is the real test).
- Tests: studio.test.mjs rewritten for the new opening (+ How to pray gone, guide icon); rework/nov12/nov13/nov13b
  How to pray and old-opening tests removed; 207 pass.

### 2026-11-14: build #13 in IslamEverydayApp
- "Android bundle" #13 for `9c0bfbd` succeeded. Checked: SHA256SUMS match; AAB upload certificate is Simply Made
  Studio `24:92:23:50:…:2C:F1`; all 73 bundled web files equal `git show HEAD:` (figures and widget pictures
  included; `sw.js` is skipped by design); PrayerWidget and VerseWidget are in the manifest. APK and AAB copied to
  IslamEverydayApp. The three Notion tasks (widgets, avoided-times status, today's scene) moved to Done.

### 2026-11-13 (fourth batch): widget pictures (owner's request; uncommitted)
- Seven new AI pictures for the widgets (see section 9), Settings section, About credits in both languages (the
  Bangla About list also gained the missing entry for the Today-card pictures). `.gitattributes`: `*.webp binary`.
- Checked: Settings section in EN light 390 px and BN dark 320 px; the marked picture matches the rule; widget data
  carries the choice; `assembleDebug` and `lintDebug` (0 errors) pass. Readability judged on a mock with the same
  crop and wash (white text stays clear on the brightest pictures). Not seen on a real home screen.
- Tests: `tests/nov13c.test.mjs` (+2); 214 pass.

### 2026-11-13 (third batch): Notion Up next: widgets, avoided-times status, today's scene (uncommitted)
- Three Notion tasks (Islam Everyday): Android widgets for prayer times and the Verse for today; the hero shows avoided
  times clearly (owner chose "make it stand out more": the note was already there); Settings marks today's scene.
- Widget verse = the card's translation word for word, footnote marks removed (notes are not shown there); a long
  verse is cut with "…" on the widget, tapping opens the app. Widget colours are the app theme at the last sync, so
  with "System" appearance they follow the phone only after the app is next opened.
- `votdFor(y, m, d)` now holds the Thursday/Friday rule used by Today and the widgets. Two older tests updated to the
  new rules (compact note → status while active; verse lookup through `votdFor`).
- **Android build checked here for the first time:** Android SDK 36 + Gradle 8.14.3 in the cloud copy, `npx cap sync`,
  `assembleDebug` succeeds and `lintDebug` has 0 errors (string resources not to be translated are now marked
  `translatable="false"`, needed once `values-bn/` exists). No emulator (no KVM), so nothing was run on Android.
- Tests: `tests/nov13c.test.mjs`; 212 pass.

### 2026-11-13 (second batch): 3D How to pray, earlier Today, first-frame colour (uncommitted; owner to push)
- 3D prayer figure (see section 9). Small amber dots replace the yellow rings; all player controls unchanged.
  No religious wording, timeline, school definition or source claim was changed.
- Today: `todayStrip()` and `qtrk` removed with their styles and strings.
- Startup: Appearance plugin + CSS + `theme-boot.js` (colour-scheme meta). Cause: the launch screen followed the
  phone's night mode while the app had its own setting. Android 11 and older cannot change the launch screen colour
  per app; there the first second still follows the phone.
- Android 14+ holds back exact alarms for new installs, so reminders could be late: Settings ▸ Notifications now
  shows a note and a button (`nfexact`, `checkExactNotificationSetting`) only when Android reports that. Found by
  reading the built manifest and platform rules; not reproduced on a phone.
- Ruku keeps the back level; open hands keep the fingers together. Every step of all five schools was rendered
  for men and women and looked over as contact sheets.
- Android 11 and older: the system launch picture is switched off (`windowDisablePreview` in `values/styles.xml`;
  `values-v31/styles.xml` keeps it for Android 12+), and `MainActivity` applies the app's choice in
  `attachBaseContext` and colours the window itself, so the first frame is the app's own. Not compiled or run here.
- Step text read against the 3D movement for every school: ruku fingers stay spread when gripping; takbir hands
  keep their natural spread; forearms rest on the ground only in `sujudW`; in tawarruk the left foot comes out to
  the right. Hair, cap and scarf edges are clean lines; on phones the figure sits right of the small picture.
- Tests: `tests/nov13b.test.mjs`; 208 pass. Checked in headless Chrome (software WebGL) at 320, 360 and 1280 px,
  EN and BN, light and dark, reduced motion, all five schools for men and women. No phone or emulator was available.
- To rebuild the figures: clone MPFB2, then `python tools/prayer-figure/build.py <mpfb2>/src/mpfb/data assets/figure`.

### 2026-11-13: 12 Notion tasks: opening, Today, pictures, sounds, How to pray, fixes (`5eb7899`, build #12)
- From the owner's Notion task list (the 12 Islam Everyday "Up next" items of 12–13 Nov). Owner's answers: pictures made
  with Figma AI; "new landing page" = refreshed Today; the 5 s opening on every cold start, tap to skip.
- **Opening** (`index.html`, `theme-boot.js`, `app.css` end, `app.js` boot): `html.sp-long` on the first open in a
  session (sessionStorage `ie.splash`): night with stars and a crescent moon in the doorway, dawn and the sun, the name,
  studio, a tagline and the promises; a 5 s bar and "Tap to skip". `MIN = first ? 5000 : 0` (web and app). Colours are
  the theme's tokens. New installs start on **Sandstone Teal** (`DEF.lightTheme`, theme-boot fallback); saved themes keep.
- **Today on phones** (`todayStrip()`; hidden ≥1024 px): the five prayers in a row (time, now/next, tick = today's
  record via `qtrk`, same log as the tracker) and four shortcuts (Duas, 99 Names, How to pray, Calendar).
- **Pictures** (`assets/heroes-img/*.webp`, 7 × 1200 px + 720 px; tea garden hills added later the same day): generated with Figma's AI image tool (file "Islam
  Everyday – hero pictures" in the owner's Figma drafts), not real places; labelled in Settings and About. Settings:
  Drawn scenes | Pictures (`st.heroKind`, `st.photo`); daily rotation shared (`sceneToday()`), mosque on Fridays; a
  multiply tint per time of day (`.sky-tint`).
- **Sounds**: Soft tap and Breeze replaced by Ripple and Soft bubble (`tools/notification-sounds.py`, low and soft:
  slow attack, low-pass, short echo); `NF_OLD` channels deleted on the phone; saved choices migrate. Touch sound Light
  air replaced by Soft bubble (`sound.js`).
- **Fixes**: An-Nawawi cards overflowed on phones because the calendar's phone-only `.nw{white-space:nowrap}` also
  matched `.hadith.nw` (now `.nowrap-m`). Theme cards: only the theme in use has the strong outline (`.in-use`). Sheet
  titles leave room for the ✕. Switches slide before a redraw (`flipSw`). With "Change every day" on, tapping a scene
  asks to turn it off (pop-up) instead of a faded grid. Tab slides: old page out (0.16 s) before the new one in, no
  plus-lighter blending. How to pray on wide screens: steps list beside the video, notes and sources full width.
- **How to pray** (`salah-fig.js`): camera turned closer to the side (PHI 66°, was 42°) so sitting and sujud read
  clearly while both arms and legs still show; sujud with palms beside the head and elbows raised, head drawn last;
  women: scarf falls over shoulders and chest like a cape and lies over the sleeves; A-line dress.
- Tests: `tests/nov13.test.mjs` (new); studio/phase53/rework updated (5 s opening, Sandstone default, slide timing).
  `npm test` 201 pass. Browser: 320/360/412/1366 px, EN/BN, light/dark, 9 pages: no errors, no sideways overflow.
- Binary files (WAV, WebP) are made on the PC by script (the file copy alters binaries; see the 12 Nov sound repair).
- Open: real-phone check; the figure still needs a scholar's review; the owner may want further character polish.

### 2026-11-12: sound files repaired (`7e9b31e`, build #11 in IslamEverydayApp)
- `040d7e0` shipped `ie_drop/tap/breeze.wav` 5–6 KB too large: copying them to the PC treated them as text. Regenerated
  on the PC with the same script (byte-identical to the originals), in `assets/sounds/` and `res/raw/`.
- `.gitattributes`: `*.wav binary`. `tests/nov12.test.mjs`: the RIFF and data sizes must match the file, and both
  copies must be identical. `npm test` 191 pass. All 15 Notion tasks moved to Done.

### 2026-11-12 (second batch): 15 Notion tasks: tabs, sounds, motion, themes, scenes, places, reminders, How to pray (`040d7e0`)
- From the owner's Notion task list (Projects → Islam Everyday → Tasks, the 15 "Up next" items of 12 Nov).
- **Tabs / More** (`app.js`): `TABS` = Today, Qur'an, Hadith, More; Duas is `more/duas`. `oldHash()` sends old `#duas`
  and `#more/hadith` links to the new places. More order: Duas, 99 Names, Prayer guide, Calendar, Developer message
  (`vDev`, blank on purpose), then How to pray, Settings, About, Feedback, Privacy, Terms. Desktop sidebar links updated.
- **Sounds** (`sound.js` rewritten): background sounds removed (and `st.amb`/`st.ambK`); three touch sounds (`st.sndK`:
  soft, drop, air), generated with Web Audio, still muted by the phone's sound profile. **Notification sounds**:
  `st.nfSnd` = default | drop | tap | breeze; WAVs generated by a script (no music, no instruments) in
  `android-app/android/app/src/main/res/raw/ie_*.wav` (previews: `assets/sounds/`). Android fixes a channel's sound at
  creation, so each sound has its own channels (`pray`, `pray_drop`, …; `nfChannels()` deletes the unused ones), and a
  channel with the app's sound plays only that sound.
- **Reminders**: Tahajjud (start of the last third of the night, Maghrib to the next Fajr) and Duha (halfway from
  sunrise to Dhuhr) toggles, channel `nafl`, ids n*16+11/12. Hero/reminder lines: 9 for most prayers (8 for Asr and
  Maghrib), each new hadith checked on sunnah.com on 12 Nov; the build's 7-per-prayer limit was lifted.
- **Motion and themes**: Playful removed (becomes Slide); new Fade (cross-fade pages, controls dim instead of moving);
  Settings suggests Slide on Android 12+ and Fade below (`andVer()`/`moRec()`). Slides no longer overshoot. Emerald
  Ivory → Sky Blue (light), Plum Dusk → Deep Teal (dark), with migration in `app.js` and `theme-boot.js`.
- **Hero scenes**: six more (dunes, mountains, sea, forest, fields, canyon) in the same layered style; "Change every
  day" (`st.sceneAuto`) rotates them by date, with the mosque on Fridays (`sceneToday()`).
- **Places** (`data.js`): `CITIES` (289) with `COUNTRIES` (107: every Asian country) and `REGIONS`; the picker groups by
  region and country and searches city or country; choosing a city sets that country's usual method and Asr school.
  Country keys are quoted in `data.js` (Brunei's code is "bn").
- **Prayer guide**: the How to pray link is a compact row across the page; details and terms open as a centred pop-up
  over the blurred page (`openSheet(…, "pop")`, `.sheet.pop`, `.scrim.blur`).
- **How to pray** (`salah-fig.js`, `salah.js`): `draw()` is now a three-quarter front view (the side-view skeleton is
  lifted into 3D with hip/shoulder width and per-pose sideways hints `ze/zw`, `zk/za`, projected and depth-sorted);
  the old side view is `drawSide()`. Men and women (`st.prWho`): the woman wears a headscarf and a long dress; Hanafi
  women's positions (`chest`, `rukuW`, `sujudW`, `sitW`, `sitWf`) and texts, and a gathered sujud (`sujudC`) for the
  other schools; a women's note per school. Still a draft, not reviewed by a scholar.
- Tests: `tests/nov12.test.mjs` (new); phase52/phase53/phase5/rework updated where they described the old themes,
  motion, sounds, sidebar and hero limit. `npm test` 191 pass. Browser checks: 360 px EN/BN, desktop guide pop-up,
  every How to pray step for Hanafi women and Shafi'i men, scenes at four times of day; no console errors.
- Open: real-phone check of the notification channels and sounds; scholar review of the women's positions.

### 2026-11-12: Notion tasks: faster app opening, moving tab bar, How to pray as a video (`1ae6b4a`)
- From the owner's Notion task list (Projects → Islam Everyday → Tasks, the three "Up next" items of 12 Nov).
- **Opening** (`app.js` boot, `render`, `underSplash`; `app.css` end): native splash hidden after two painted frames
  (no longer after fonts + verse); the door waits for those instead (`settled`, max 0.9 s); app opening 1.6 s
  (`MIN`), website unchanged (3.1 s). Under the splash the page is `.hold` (drawn, no animation) and gets `.door.enter`
  (transform-only `rise-door`) in the same frame as `splash.out`. Do not hide it with opacity: that forced a full
  repaint (a 134 ms frame) as the door opened. Phones: `.v-today>:nth-child(n+5)` use `content-visibility:auto`.
  Measured (Chrome, 6x CPU, stubbed Capacitor): hand-over 2.0 → 1.7 s, door 5.2 → 3.3 s, Today 5.9 → 4.0 s; no slow
  frames at the door.
- **Tab bar** (`nav()`): built once, updated in place (rebuilt only on language change); WAAPI squash on the pill and
  pop on the icon. **Segmented controls**: `segThumbs()` after every render and click (FLIP from `SEGP`, 1.5 s
  memory), `.seg.has-th`. **Chips**: `popChosen()`. The click handler now calls `act(a, d, b)` (was inline).
- **How to pray** (`assets/salah-fig.js` new, `assets/salah.js` rewritten, `vPray`/`prayFrame`/`prayLoop` in app.js,
  lazy group `pray: ["salah-fig", "salah"]`): figure = joint angles, two-bone IK for wrist targets (`at: joint|ground`),
  auto-grounded with the near foot's ball fixed; `mix()` blends resolved poses; `bbox()` drives the camera (`viewBox`).
  Shin angles: 0 = up, 90 = qibla, 180 = down, 270 = back, so a shin rising to a tucked heel is about 282°, not 258°.
  Player: one clock (`PR.t`), `SL.timeline()` per language, scrub `#pray-seek`, speed, CSS full screen (`.pv-full`;
  Back and Escape leave it). Close-ups are an HTML overlay (`#pray-inset`), not inside the zooming SVG.
- Tests: `tests/rework.test.mjs` rewritten for the new figure and player, new tests for tab bar and opening;
  `tests/studio.test.mjs` updated for the new timing. `npm test` 184 pass. Browser: no overflow at 320/360/412 in both
  languages, light and dark, no errors; desktop segmented controls pixel-identical to before.
- **Not tested:** on a real phone. Open: whether the opening now feels right on the device; whether the owner wants
  real video files instead of the drawn player (it plays like a video but is drawn live: sharper, tiny, two languages).

### 2026-11-11: interface rework (uncommitted; owner to push)
- **Slides and feel** (`assets/app.css`, end of file; `assets/app.js` click handler): view-transition slide with a
  spring (`--bounce`, `--bounce-2`), spring on the tab marker/switches/cards, a tick and (app) light buzz on every
  press except controls that give their own feedback (`SELF_FX`). Children are not animated during a slide on purpose
  (the new page is a live snapshot; animating inside it repaints every frame).
- **Splash** (`index.html`, `app.css`, `app.js`, `theme-boot.js`): arch drawn from frame 0, shorter timeline (door at
  3.1 s), simpler exit, promise line (`.sp-promise`, language from `html[data-lang]` set in theme-boot). App: the web
  doorway is absolutely centred at 120px to match `res/drawable/splash_door.xml` (launch screen icon).
- **Hero lines** (`tools/heroes/source.mjs` + `build.mjs` → `assets/heroes.js`, generated; `skyQuote`, `hadithHero`,
  `quranHero` in app.js). Qur'an text is copied from `data/quran` by the build (a test compares them); hadiths are the
  app's own plain-word renderings, labelled as such. To change the list, edit `source.mjs` and run
  `node tools/heroes/build.mjs`. Daily index = days since 1970 in the city's date; weeks start on Thursday.
- **Reminders** (`nfPlan`, `nfRun`, `nfSet` in app.js; `sw.js` notificationclick): Capacitor LocalNotifications in the
  app (10 days ahead, re-scheduled on open/resume and whenever city, method, Asr, Hijri adjustment or language
  changes); on the web only while the page is open. No push server (rule 6 holds).
- **Sound and vibration** (`assets/sound.js`; settings `st.vib`, `st.snd`, `st.vol`, `st.amb`, `st.ambK`): Web Audio
  noise synthesis only. `RingerPlugin.java` reports the phone's ringer mode; silent/vibrate mutes sound. `buzz()` now
  depends only on `st.vib` (it used to follow Interaction motion).
- **How to pray** (`assets/salah.js`, lazy group `pray`, route `#more/pray`, `vPray`/`prayGo` in app.js): poses are
  joint angles; `steps(school)` builds the sequence. Content is unreviewed (docs/scholar-review.md, 11 Nov items).
- **Fixes:** `.chips{scroll-padding-inline:16px}` ("All" chip alignment); scrim blur on phones; adhan note moved to
  the times card. **From Codex's security review (10 Nov):** `file_paths.xml` narrowed to `cache/share/`; privacy
  policy now names saved coordinates in Android backups, reminders and sounds (dated 11 November 2026). Backup itself
  was left ON (owner's decision still open: excluding WebView storage would also drop tracker history from backups).
- Tests: `tests/rework.test.mjs` added; `studio.test.mjs` and `feedback.test.mjs` updated for the new timings and
  date. `npm test` 180 pass. Browser (Chrome, touch emulation, 320/360/412 px, English and Bangla, light and dark):
  no overflow, no script errors, rapid tab taps end on the right page. **Not tested:** anything native (plugin
  wiring, launch icon alignment, notifications, ringer mode, haptic strengths) and how the sounds actually sound.

### 2026-11-10: agent context file
- Added `AGENTS.md` (this file) and `CLAUDE.md` (points to it); `.vercelignore` keeps both off the live site.
- Tests: `npm test` 169 pass (no code changed).

### 2026-11-10: smooth opening and faster sections on phones (`af5acab`)
- `assets/app.js`: splash released after the first painted frame and once fonts and the Verse for today are ready
  (max 0.9 s); the verse arriving updates only its card; the sun-arc animation and the minute redraw wait for the
  splash; the arc path is sampled once instead of every frame; `DTF()` caches date formatters; `fitCards()` measures
  "Read more" for the first 8 cards now and the rest lazily.
- `assets/app.css` (phones only): `content-visibility` for Duas and Hadith cards after the first 8; header chips and
  segmented controls no longer have their own `backdrop-filter`.
- `tests/android.test.mjs`: two new tests guarding these.
- Measured in Chrome at 6× CPU slowdown (not yet on a real phone): opening worst frame 367–500 ms → 17–33 ms;
  Hadith 680–780 → 330–420 ms; Duas 550–570 → 370–400 ms; Today 500–570 → 330–430 ms. "Read more" results identical
  to before in English and Bangla; no overflow at 320/360/412 px.

### 2026-11-10: privacy policy covers the Android app (`55c563f`)
- `assets/legal.js`: "The Android app" section in English and Bangla (location only on tap and kept on the phone, no
  network requests, Android device backup, sharing and Feedback through the person's own apps, Google Play);
  Bangla Location section uses the current button name; policy dated 10 November 2026.
- Tests: `tests/android.test.mjs` (section present in both languages), `tests/feedback.test.mjs` (date).

### 2026-11-06 to 2026-11-09: Android app and Bangla (`57af2ac` … `59c8f88`)
- Capacitor project, GitHub Actions signing build, native Back/close/share/haptics/status bar, section slides on
  phones, tab-history flooding fixed, Duas/About overflow on narrow phones fixed.
- About 300 interface strings and the Prayer guide rewritten in everyday Bangla; one spelling per word; spoken
  times of day. Details: `CHANGELOG.md`.
