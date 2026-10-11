# Islam Everyday change log

Phases 1–3 were built under the working name DinSathi; the project folder is still `DinSathi-Web`.

## Phase 4: Islam Everyday 1.0.0, release preparation (11 October 2026)

Scope: as set out in `PHASE4.md`. All work is in `DinSathi-Web`. There was no `sources/` folder or root `AGENTS.md` in the workspace.

Before starting, I compared the owner's checkout (`Phase Three\DinSathi-Web`) with my Phase 3 copy. Only `assets/app.js` and `assets/data.js` differed: they carry the later small Android-detection update. All other Phase 3 files matched.

Nothing was committed, pushed or published.

### Brand
- The public name is now **Islam Everyday** in:
  - the HTML title and description, and the Apple and app-name meta tags;
  - the manifest name, short name and description, plus new `id` and `categories` fields;
  - the header and sidebar wordmark, in both languages;
  - the About text, the README and this change log's title.
- Internal identifiers were kept so existing users keep their data: the folder name, the `dinsathi.web.v1` storage key and the `window.DINSATHI*` globals.
- `RESEARCH.md` now has a historical note about the earlier name.
- `package.json` is now `islam-everyday-web` 1.0.0, and `package-lock.json` was regenerated.

### Logo
- New original vector logo: a mihrab-shaped open doorway framing a rising gold sun, with a restrained arc for the daily prayer cycle.
  - The SVG masters are in `brand/`: the icon, a maskable version (artwork inside the 80% safe zone), a 16–32px version and the mark alone.
- Rendered outputs:
  - `icons/icon-192.png` and `icon-512.png` (transparent corners)
  - `icons/maskable-192.png` and `maskable-512.png`
  - `icons/apple-touch-icon.png` (180px)
  - `favicon.ico` (16/32) and `icons/favicon.svg`
- The old star icons were replaced.
- The manifest now declares "any" and "maskable" icons and adds a Prayer guide shortcut.
- The in-app logo is inline SVG with the same geometry.
- The concept image named in the brief (`brand/islam-everyday-icon-concept.png`) was not present. The logo follows the brief's written description.

### Prayer guide (new)
- Added "Prayer guide" (নামাজ শিক্ষা) to the More menu, the desktop sidebar, the hash routes (`#guide`, `#more/guide`) and the manifest shortcuts.
- The page has:
  - a Hanafi / Shafi'i switch, saved locally, with the default following the Asr setting;
  - a summary table of the five prayers, with colour-coded units and screen-reader labels;
  - expandable sections for each prayer, showing the sequence, notes on where schools agree and differ, the sources used and a review-status sentence;
  - a glossary: rak'ah, fard, wajib, sunnah mu'akkadah, other sunnah/nafl, Witr;
  - notes on the Maliki and Hanbali positions, and on what is out of scope;
  - a numbered source list.
- Witr is shown as wajib (3 rak'ahs, one salam) in the Hanafi column, and as the majority view's confirmed sunnah (at least one, often 2+1) otherwise.
- Sources:
  - 10 hadith checked on sunnah.com;
  - 5 fatwa-service answers: Badat/Mathabah (Hanafi), the Shafiifiqh Fatwa Department (Shafi'i, citing *Mughni al-Muhtaj*), IslamWeb 84719, Darul Ifta Birmingham, and IslamQA.info 36793.
- The page is labelled as educational, not a fatwa, and not independently reviewed.
- Data lives in `assets/guide.js`.

### 99 Names
- Removed the collection-wide "awaiting scholar review" banners from the list page and every dialog. The review policy now appears once, under "About this list".
- Every explanation now ends with the citations it used (linked) and a review sentence specific to that entry. There are four statuses: commentary, related, text and none.
- Re-checked the nine names Phase 3 reported as incomplete:
  - **Now sourced as related commentary (3):**
    - al-Jalil: al-Sa'di on *jalal*, 55:27.
    - al-Majid (ماجد): al-Sa'di on *majd*, 11:73.
    - al-Mani': al-Bukhari 844, plus al-Sa'di on 35:2 about giving and withholding.
  - **Now explained from the hadith text (1):** as-Sabur, from the full wording of al-Bukhari 6099.
  - **Still without a scholarly explanation (5):** al-Khafid, al-Wajid, al-Muqaddim, al-Mu'akhkhir and ar-Rashid.
    - These now give nonblank, sourced content saying what the evidence shows, plus a clear "review needed" status.
    - The new evidence citations are 56:3, 93:6, 18:10 and al-Bukhari 1120.
- The final totals are 90 commentary, 3 related, 1 text and 5 none. That is 190 distinct citations from 9 works, with no padding.
- The names list shows a small "No explanation located" tag on the 5 `none` cards.

### Motion and interaction
- Interactive cards now lift 2px with a stronger shadow, on hover and on keyboard focus. The same feedback applies to both.
- Today cards get a shadow emphasis only.
- Press feedback is short.
- All hover rules moved under `(hover: hover) and (pointer: fine)`, so touch screens never keep a stuck hover.
- Reduced motion removes the transforms and transitions.

### Release checks
- The service worker caches are now `islam-everyday-app-v4` and `islam-everyday-data-v4`. They precache the new icons, the favicon and `guide.js`.
- The offline-saved flag is versioned to match, so old v3 caches are not reported as saved.
- New tests in `tests/brand.test.mjs` and `tests/guide.test.mjs`. The names tests were rewritten for per-entry status and content. `npm test` passes 36 of 36.
- The local server's messages and the advertising notice in `data/quran/editions.json` now use the new name.
- Visual checks with Playwright (Chromium):
  - 10 routes on a Pixel 7 and at 1440×960, in light and dark, in English and Bangla (80 screens): no console errors, failed requests or blank pages;
  - keyboard and hover lift on name cards, with no transform under reduced motion and no fine-hover on touch;
  - 99 Names status lines for each status type, and the Prayer guide table and details in both schools.
- Offline: after "Save the Qur'an for offline", with the browser offline, Today, the Prayer guide, 99 Names, the calendar and surah 2 (286 ayat) all load. Name dialogs load their verse translations.
- The release ZIP was extracted into a clean folder, where `npm test` passed 36/36 and `npm start` served the app with the new title.
- Searched for old-name strings and unfinished-work markers (and test-guarded both). Checked the manifest icon sizes, the service-worker precache list, the hash routes and the Bangla strings.

### Remaining limitations
- No qualified scholar has reviewed any of the religious content.
- 5 names still have no scholarly explanation, and sources come from 9 works.
- The Prayer guide's Hanbali extras are not separately sourced.
- 29 Bangla footnote gaps have not yet been reported to QuranEnc.
- No code licence has been chosen.


## Phase 3: npm workflow, full translations, Today and calendar, sourced 99 Names (11 October 2026)

Scope: `DinSathi-Web` only, as set out in `PHASE3.md`. No `sources/` folder or root `AGENTS.md` was present in the workspace, so nothing outside `DinSathi-Web` was touched. The app is still static: no framework, no build step and no runtime dependencies.

### 1. npm workflow and checks
- Added `package.json` with no dependencies, and updated `package-lock.json` to match (root package only).
  - `npm start` runs `scripts/serve.mjs`, a small Node static server on **port 8090**. Set `PORT` to change the port. If the port is busy, the server prints a clear message.
  - The server sends `Cache-Control: no-store`.
- `npm test` runs `node --test` across 6 test files (29 tests). It covers:
  - Qur'an counts and alignment, editions metadata and the coverage report;
  - 99 Names structure, citations and Qur'an quote matching;
  - Verse-for-today determinism and full-cycle coverage;
  - script parsing, i18n completeness and local-only assets;
  - a server smoke test on a random port, closed afterwards.
- A negative check (removing an ayah, corrupting a surah file and breaking a citation) made 6 tests fail, as intended.
- The README's Python instructions are replaced by the npm workflow, with port and "one copy at a time" guidance.

### 2. Today page and calendar
- New order on phone and desktop:
  1. hero
  2. prayer times
  3. Verse for today
  4. prayer tracker
  5. forbidden and optional times
  6. Hijri tile
  7. fasting times (last)
- Markup order and the desktop grid (`"hero hero times" / "verse verse track" / "forb tiles fast"`) were changed together.
  - Verified by measured element positions on phone and desktop.
- Forbidden-times window labels and ranges are now regular weight. The heading stays bold.
  - The current window keeps its red "Now" badge and danger colour.
  - It gains a left bar, `aria-current="time"` and a screen-reader "(current window)" label.
- The Verse for today footer (surah name and reference) is now green and semi-bold: `--accent`, #0E6B5C in light and #58C8AD in dark.
- Fonts are now self-hosted. The Google Fonts links were removed.
  - Bangla uses Hind Siliguri everywhere, including headings, at weight 500 for Bangla headings.
  - Tiro Bangla is limited to Latin display headings.
  - Arabic stays on Scheherazade New.
  - Conjuncts and vowel signs were checked in screenshots (for example দ্দ, ক্ষ, ত্র, য়, ্য).
- The Hijri calendar page was redesigned:
  - larger month header with Hijri months;
  - Gregorian and Hijri numbers in tinted day cells, with the Hijri month name on its first day;
  - Friday highlighted;
  - a legend for today, white days and key dates;
  - per-cell screen-reader labels;
  - an upcoming list with date badges;
  - a note on the maghrib rollover.
- The More menu now uses the same after-maghrib Hijri date as the Today page.

### 3. Qur'an translations and Verse for today
- **English:** Pickthall (1930), public domain. Tanzil text via fawazahmed0/quran-api commit `47ca096`.
- **Bangla:** Dr. Abu Bakr Muhammad Zakaria **v1.1.1 (2021-05-22)**, QuranEnc.com, with footnotes, unmodified.
- Licence, attribution, version and input SHA-256 are stored in `data/quran/editions.json`.
- `tools/import-quran.mjs` (`npm run import:quran`) builds per-surah files for Arabic, English and Bangla, plus `coverage.json`.
- **Coverage:**
  - Arabic, English and Bangla each have 6,236 of 6,236 ayat across 114 surahs, with nothing missing or empty.
  - Bangla footnotes appear on 3,608 ayat.
  - 29 Bangla ayat have a footnote marker with no published note. They are listed in the report.
- The reader shows the selected translation for every ayah, with collapsible, sanitised translator's footnotes and a credit line.
  - Bookmarks, continue-reading, copy (now with credit), mark-read and text settings are unchanged.
  - The self-written 13-surah draft translations and the "Translated" filter were removed.
- `data/quran-ar.json` was replaced by per-surah files, loaded on demand from the site itself. There is no runtime API.
- Verse for today (`assets/votd.js`) selects deterministically from all 6,236 ayat by the selected city's calendar date (midnight boundary) using a 1009-step permutation. It shows the full ayah, never truncated.
- Service worker:
  - App code is now network-first (fixes the "old version keeps showing" problem).
  - Qur'an data and fonts are cache-first.
  - A new **Settings → Save the Qur'an for offline** option stores all 342 surah files (about 17 MB).
  - The cache is now `dinsathi-app-v3` / `dinsathi-data-v3`, and the Google Fonts caching was removed.

### 4. 99 Names
- `assets/names.js` holds structured, sourced data for all 99 names:
  - stable ids;
  - Arabic, transliteration, English and Bangla meanings;
  - Qur'an evidence, with each quoted phrase verified by the tests against the bundled Arabic;
  - hadith, with gradings;
  - attributed scholarly explanations in English and Bangla;
  - notes on differences of opinion;
  - labelled reflections;
  - a works registry with URLs.
- **Status:** 90 names are "sourced". 9 are marked **Incomplete** because no scholarly explanation has been sourced yet: al-Khafid, al-Jalil, al-Wajid, al-Majid (ماجد), al-Muqaddim, al-Mu'akhkhir, al-Mani', ar-Rashid and as-Sabur.
- **Sources:**
  - 185 distinct citations (101 Qur'an verses, 71 tafsir passages, 12 hadith, 1 journal article) from 9 works.
  - The works are the Qur'an, Tafsir al-Sa'di, Tafsir Ibn Kathir (abridged English), al-Bukhari, Muslim, at-Tirmidhi, Abu Dawud, Ibn Majah, and Wan Jamil et al. 2021 (Journal of Hadith Studies) on Ibn Hajar's view of the list.
  - The 200-distinct-source target was **not met**, and no sources were added just to raise the count.
- **Scholarly disagreements marked:**
  - the da'if grading of the Tirmidhi list and Ibn Hajar's view that it was added by a narrator;
  - names known only from that list;
  - differing early explanations: ar-Rahman/ar-Rahim, al-Quddus, al-Mu'min, al-Muqit, as-Samad, az-Zahir, an-Nur, al-Wadud.
- The whole collection is flagged **awaiting qualified-scholar review** in the data, the list page and every dialog.
- **UI:**
  - Cards are now buttons and the search also matches Arabic.
  - A detail dialog uses the existing sheet pattern, with a sticky close button, focus moved in and trapped, Esc and backdrop closing, and focus returned to the card.
  - Previous and Next buttons move between names.
  - Verse evidence shows the full Arabic and the selected translation from the bundled data.

### Checks run
- `npm test`: 29 of 29 pass.
- Playwright (Chromium) visual checks of Today and the Hijri calendar on a Pixel 7 and at 1440×960, in light and dark, in English and Bangla (16 screens):
  - no console errors, failed requests or 4xx responses;
  - Today order confirmed by measured positions.
- 99 Names: list, keyboard-opened dialog, an incomplete entry, focus-in and focus-return, and search, on phone and desktop in both themes and languages.
- Reader: surah 2 shows 286 ayat with 286 translations in both languages, and 211 Bangla footnote blocks.
- Offline:
  - after "Save the Qur'an for offline", with the browser offline, the app reloads;
  - surah 57 opens with its translation;
  - a 99 Names dialog loads verse translations.

### Remaining work
- Qualified-scholar review of the 99 Names, the duas and the pronunciation guide.
- Sourced explanations for the 9 incomplete names, plus more independent sources per name.
- Report the 29 Bangla footnote-marker gaps to QuranEnc, and check periodically for newer versions.
- Consider a modern English translation whose licence permits bundling.

## Phase 2: Website visual polish (11 October 2026)

Scope: the website only (`DinSathi-Web`). The app and the bot are untouched.

### Implemented

**1. Prayer hero background**
- Replaced the flat gradient with a layered landscape: sky, soft procedural clouds, three hazy ridgelines, a small mosque silhouette on the near ridge, and light film grain.
- The palette follows the existing six times of day (night, dawn, morning, noon, afternoon, dusk). A glow now follows the sun or moon along the existing arc, and the sun sets behind the hills.
- A dark scrim sits behind the text: a left-to-right gradient on desktop, and a stronger, more even one on phones.
  - Measured text contrast against the brightest 5% of background pixels behind each line is at least 5.6:1 at every time of day, on both phone and desktop (WCAG AA is 4.5:1).
- The hero content and layout are kept: label, prayer name, countdown, dates and arc.

**2. Current prayer and next prayer**
- New `prayerState()` derives both from the configured schedule (the existing `prayerTimes()` output for yesterday, today and tomorrow). Nothing is hard-coded.
- The hero now shows:
  - the **current prayer**, a live countdown to when its period ends, and the end time;
  - a **Next prayer** panel with the prayer's name, start time and its own countdown.
- Day boundaries:
  - Isha runs to the next day's Fajr.
  - After midnight the current period is still the previous evening's Isha, labelled "yesterday" in the list.
  - After Isha, the next prayer is tomorrow's Fajr, labelled "tomorrow".
- The page re-renders when either countdown reaches zero.

**3. Prayer-times chart**
- The current row gets a teal left bar, a tinted background and a solid **Current** badge. The next row gets a gold left bar and an outlined **Next** badge.
- The status is carried by text labels as well as colour. The current row also has `aria-current`.
- When the relevant instance is not today's, the row shows that instance's time with "yesterday" or "tomorrow", so it always matches the hero exactly.

**4. Section headings**
- These headings are now bold, ink-coloured `h3.sec-title` elements, replacing the muted uppercase labels:
  - Prayer tracker
  - Fasting times
  - Forbidden times for prayer
  - Optional prayers
  - Verse for today
- In Forbidden times, both the window labels and their time ranges are bold. The "now" marker is a red badge.

**5. Verse for today**
- The Arabic has `dir="rtl"`, `direction: rtl`, right alignment and bidi isolation.
- Card padding is 20px / 22px. This fixes an old rule that set the right padding to 0.
- The reference and the Read button sit in a wrapping footer row above a divider, and the button is a rounded pill. Measured gap between the Arabic and the card's right edge: 25px.

**6. Hijri calendar**
- The Today calendar tile is now a night-teal card with a faint eight-point star pattern, a large Hijri day, the month, the year and the Gregorian date, and a gold pill for the next key date.
- The card draws a moon matching the Hijri day's phase, mirrored for the southern hemisphere, so Sydney sees a waxing crescent lit on the left.
- It still opens the Hijri calendar page, and the Hijri date logic, including the after-Maghrib rollover and the ±2-day adjustment, is unchanged.

**Housekeeping**
- The service-worker cache moved from `dinsathi-web-v1` to `dinsathi-web-v2`, so installed copies pick up the new assets.
- New UI strings were added in English and Bangla.
- The README now describes the new Today screen and the prayer-period rules.

### Files changed
- `assets/app.js`: `prayerState()`, `hOf()`, hero landscape (`SCENE`, `heroScene()`), `moonSvg()`, the Today markup, and the countdown ticker.
- `assets/app.css`: hero layers, palettes and scrim; Current/Next badges; `.sec-title`; Forbidden-times weights; verse layout; Hijri card; desktop hero overrides.
- `assets/data.js`: new strings (`curp`, `curb`, `endsin`, `endsat`, `startsin`, `nocur`, `fajrended`, `yday`) in English and Bangla.
- `sw.js`: cache version.
- `README.md`: Today row, plus a new "Prayer periods" section.
- `CHANGELOG.md`: this file (new).

### Verified
- Fixed-clock browser tests in Sydney, with the browser itself set to Dhaka time to confirm the app uses the city's time zone:

  | Local time | Current | Next |
  |---|---|---|
  | 03:00 | Isha (since 8:25 pm yesterday), ends 4:54 am | Fajr |
  | 05:30 | Fajr, ends at sunrise, 6:19 am | Dhuhr, with a separate countdown |
  | 09:00 | No prayer in progress | Dhuhr |
  | 17:00 | Asr | Maghrib |
  | 21:00 | Isha | Fajr tomorrow |

  - Crossing midnight while the page is open, the "tomorrow" label correctly became "yesterday".
  - At 12:41:58 the hero switched to Dhuhr within the tick.
- No script errors and no horizontal overflow on any page, at phone width and at 1440px. Light, dark, English and Bangla were all checked.

### Assumptions
- **Prayer-period boundaries:**
  - Fajr ends at sunrise.
  - Isha ends at the next Fajr. The app also lists Islamic midnight separately as an optional-prayer time, but that is not used as Isha's end.
  - Sunrise to Dhuhr is a gap with no current prayer.
  - The calculation methods and angles are unchanged.
- **Time zone:** "the user's local time" is the selected city's IANA time zone, as before. With GPS it is the device's zone.
- **"Prayer Crossing Times":** no section has that name. The bold heading treatment was applied to every Today section heading, including "Optional prayers" and "Fasting times", which are the closest matches. Confirm which section was meant.
- **Source and log files:** the uploaded project had no `sources/` folder and no existing Phase 2 change log, so this file was created.

### Remaining
- Confirm the "Prayer Crossing Times" section name, and rename the heading if a specific label is wanted.
- The full Hijri calendar page (month grid) keeps its previous styling. Only the Today card was redesigned.
- The 24-hour ribbon still shows a single "now" marker. Current and Next are marked on the list rows, not on the ribbon.
- Out of scope for this pass:
  - the app and the bot;
  - the larger future website section, whose requirements are not provided yet;
  - the scholar review of the translations and duas, carried over from Phase 1.
