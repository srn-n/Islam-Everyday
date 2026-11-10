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
npm test         # node:test suite, no browser, no network (169 tests as of 10 Nov 2026)
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
`glossary.js`, `app.js`. Large libraries (`hadith.js`, `nawawi.js`, `stories.js`, `study-notes.js`, `name-stories.js`,
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
- **Opening splash:** the doorway animation (`#splash`). In the app it waits (class `sp-hold`) under Android's launch
  screen until the first screen is painted and fonts plus the Verse for today are ready, then `release()` hides the
  native splash and starts the animation (Capacitor `SplashScreen.hide`, 3 s failsafe in `capacitor.config.json`).
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

*Last updated: 10 November 2026.*

- Latest commit: `af5acab` "Smooth app opening and faster section switching on phones" (pushed). Working tree clean.
- Website live and current. `npm test`: 169 pass.
- Android build for `af5acab` downloaded, verified (signed with the upload key) and stored in `IslamEverydayApp`.
  This is the build to upload to Play. `versionCode` stays 1 until the first upload.
- Play Console: nothing uploaded yet.

**Next tasks, in order**

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

## 10. Agent log (newest first)

Add a new entry at the top for every change: date, summary, files, tests, open items.

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
