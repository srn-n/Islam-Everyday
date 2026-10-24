# Islam Everyday change log

Phases 1–3 were built under the working name DinSathi; the project folder is still `DinSathi-Web`.

## Phase 5.4: release audit (19 October 2026)

Nothing was committed, pushed or deployed. An audit of the Phase 4–5.3 build; only demonstrable technical defects were fixed. See `docs/release-readiness.md`.

### Fixed
- Accessibility: the primary light theme's gold (#9C6210 → #996010) now meets 4.5:1 on its pale background (was 4.38:1, the one recorded exception; the "Next" label and the Witr legend failed WCAG AA). Two unnamed complementary landmarks on the Qur'an page now have names (sidebar, surah list).
- Hadith data: Bangla notes on the 16 Phase 5.3 narrations used Latin digits; now Bangla digits like the rest. Muslim 2318 and 1893 relabelled 2318a and 1893a, the numbers sunnah.com itself shows.
- Wording: the advance notices for the zenith and sunset periods now say "From about …" (the margins are approximations); the zakat warning names every reason a value is ignored (it omitted "unrealistically large").

### Verified (no change needed)
- All 720 hadith fields (40 general + 40 an-Nawawi entries) identical to HadeethEnc today; all 154 sunnah.com links open at the stated numbers with Arabic text.
- Solar times within 1 minute of an independent NOAA calculation; DST change days and high latitudes behave as documented.
- English translation records, verse ids across languages, attribution; service worker updates from v4, v5 and the Phase 5.2 build, interrupted saves and shared-origin caches.

### Added
- `tests/phase54.test.mjs` (8 checks), `tests/browser/phase54.cjs` (14), `tests/browser/offline.cjs` (36), `docs/scholar-review-checklist.md`, `docs/release-readiness.md`.

## Phase 5.3: countdown, prohibited times, chart labels, appearance, zakat, calendar layout, an-Nawawi's Forty, interactions (19 October 2026)

Nothing was committed, pushed or deployed.

### Today card
- Hero background follows the time of day, now including a short sunrise and a golden-hour period, with the moon's phase at night. The Verse card has its own quiet background (faint eight-point star pattern and soft wash; off with "more contrast").
- A live countdown under the current prayer's start time: "{next prayer} begins in HH:MM:SS", always to the next prayer's actual start, never to an invented end. Updates every second, switches at each prayer, runs across midnight, falls back to a plain note when the day's times are unreliable.
- Prohibited-time line (compact, not bold) with a "Why?" sheet: sunrise to +15 min, Dhuhr −10 min to Dhuhr, Maghrib −15 min to Maghrib, a 10-minute advance notice, and after-Fajr/after-Asr notes only once that prayer is ticked. Sources: Sahih Muslim 831, Sahih al-Bukhari 586, Ibn Baz fatwa 18495. Sunrise, solar noon and sunset are calculated locally (there is no prayer-time API). Nothing is shown when the times are unreliable.

### Day chart
- All labels in one chronological row above the chart, each over its own event with a leader line; collisions resolved by moving groups as little as possible inside the chart (`assets/dayviz.js`). The draw-in animation is kept.

### Appearance
- Separate **Appearance** (System/Light/Dark) and **Theme** (palette) settings. New palettes: Sandstone & Deep Teal, Burgundy & Warm Parchment; Classic, Emerald & Ivory and Midnight Indigo & Gold kept; every palette has light and dark sets. `assets/theme-boot.js` applies the choice before first paint; System follows device changes live; Phase 5.2 settings migrate.

### Zakat
- The verbatim disclaimer (and Bangla), grouped inputs with hints, a visible formula and breakdown, validation, a choice of nisab weights (87.48/612.36 g or 85/595 g), no built-in prices, Learn sections in both languages, references to Sahih al-Bukhari 8 and Islamic Relief Australia (labelled apart). Formula unchanged (`assets/zakat.js`).

### Hijri calendar
- Rebalanced: month on the left; selected day and a compact "Fasting planner and upcoming dates" panel (your planned fasts as shortcuts, the next four Islamic dates) on the right, level top and bottom; White Days and its evidence full width below in two aligned rows. Personal notes and saved plans unchanged.

### Hadith
- General library: 16 more narrations from al-Bukhari and Muslim (40 in all), same verification as before.
- New, separate collection: **Imam an-Nawawi's Forty Hadith**, all 42, in his numbering, from HadeethEnc's dedicated entries (texts, takhrij, grades unchanged; every field hash-checked), each linked to sunnah.com/nawawi40 and the underlying collection numbers. Sahih and Hasan shown apart; nine grades flagged for review; context notes on nos. 8 and 14; translation note on no. 35. Collection selector, numbered jump list, previous/next, Mark as read with progress, both languages.
- Scholar review pack extended with the an-Nawawi verification table, prohibited times and zakat (`docs/scholar-review.md`).

### Interaction
- Spring lift on hover and keyboard focus, brief press scale for touch, on controls and card shells only; never on religious texts; off with reduced motion.

### Tests
- `tests/phase53.test.mjs` (28 checks) and `tests/browser/phase53.cjs` (64 checks). Phase 5.2 tests updated where the brief changed the behaviour (one countdown to the next start; themes split into mode and palette; 40 general hadith), keeping their other assertions.

## Phase 5.2: Today card, English variants and explanations, Hadith cards, themes, calendar, day chart (18 October 2026)

Nothing was committed, pushed or deployed.

### Today card
- Countdowns and ending times removed. The card shows the current prayer period and when it started, the next prayer and when it starts (Today/Tomorrow), and the local Gregorian and Hijri dates. Isha that began before midnight is labelled "yesterday". A note distinguishes start (adhan) times from iqamah. The sidebar's next prayer shows its time instead of a countdown.

### Languages
- Settings → Language: English (India) (default), English (US), Bangla. The variants change Intl date/number formats, am/pm vs AM/PM and US spelling of interface strings; religious texts are never respelled. All hard-coded `en-AU` formats replaced. Switching language keeps the page, filters, date and the card or verse being read (Hadith, Duas, Qur'an reader, 99 Names), including while fonts load.

### Verse for today: English explanation
- All 180 entries (267 verses) show the published English *Al-Mukhtasar* (Tafsir Center for Quranic Studies, QuranEnc.com, `english_mokhtasar`, retrieved 18 October 2026) in English, as a separate labelled layer with its source line and Read more. Texts are stored unchanged and were checked one by one against SHA-256 hashes of the publisher's text; only the leading verse number is hidden. Not AI-generated. Seven sensitive explanations carry an editorial note. Pickthall and the Bangla layers are unchanged.

### Hadith cards
- Same shell as the Dua cards: reference heading and categories, a preview of the Arabic and translation, Read more/Show less in place (no truncation), open state kept across filtering and language; equal heights on desktop.

### Themes and glass
- Two optional themes, Emerald & Ivory and Midnight Indigo & Gold, beside the unchanged System/Light/Dark. Theme picker with swatches. System dark mode no longer overrides a chosen theme.
- Restrained glass on the header, tab bar, segmented controls, tracker date control, sidebar box and calendar popover; reading surfaces stay opaque; solid fallbacks without `backdrop-filter`, with reduced transparency or more contrast.

### Hijri calendar
- Days are buttons: mouse hover and keyboard focus show a popover; click/tap/Enter shows details (Gregorian and Hijri date, calculated label, White Day, key dates, the maghrib rule); arrows, Page Up/Down, Home/End move across days and months with roving focus; touch selects without a popover; Go to today.
- White Days card in English and Bangla with sunnah.com references checked on 18 October 2026 (Abu Dawud 2449 sahih per al-Albani; Bukhari 1981; Muslim 1160; Muslim 1141 for the Tashriq exception). 13 Dhul-Hijjah flagged as not fasted. Next White Days as shortcuts.
- Optional per-day fasting plan (checkbox and note), stored on the device.
- Method stated: Umm al-Qura plus the adjustment; calculated, not sighted.

### Day chart
- The ribbon in Prayer times is replaced by a chart of the sun's altitude through the local day, with the horizon, sunrise and sunset as events (not prayers), the five prayer starts and the sun now; text equivalent; reduced motion; fallback note at high latitudes when the formulas fail (for example London in June).

### Docs and tests
- `docs/scholar-review.md` (generator updated): sections D (English explanation notes and publisher slips) and E (White Days), new checklist items and open question 5.
- New `tests/phase52.test.mjs` (20 tests). `npm test`: 90 tests, 90 pass (baseline 70).
- New `tests/browser/phase52.cjs` (Playwright, run separately): 52 checks, all pass. The Phase 4–5 tracker (33) and service-worker (23) browser checks still pass.

## Phases 4 and 5: final review before release (18 October 2026)

Nothing was committed, pushed or deployed.

### Edition decision (English Qur'an)
- Provenance established: the Tanzil text names no printed source and matches the USC-MSA electronic text (Project Gutenberg #16955), an edited text of unidentified origin. Nine scanned printings were compared (three 1930 first-edition copies, the 1948 and 1957 impressions, three later typesettings); none has the electronic text's wording. The earlier "later revised edition" explanation is withdrawn.
- Decision: one edition, the 1930 first edition (public domain). 242 more verses restored to the 1930 wording (round 3), 10 earlier entries extended or revised; 393 in total. Nothing reverted. The Phase 4 "God", "Owner" and "Mecca" restorations are confirmed by all three 1930 copies.
- 4:135 (Phase 5) had mixed the two texts; now the 1930 "(than ye are)".
- Not reproduced: 10 misprints of the 1930 printing; 2:57 and 82:9 held back for review. 24 adopted readings flagged for a qualified reviewer (13 where 1930 leaves an element of the Arabic untranslated).
- Modern spellings and the digital text's punctuation kept as a separate, documented normalisation.
- `en-corrections.json` records the witnesses, policy, reasons, checks and review notes; `docs/translation-audit.md` rewritten with the evidence; importer notice, licence and attribution updated; About page credits updated.

### Religious content audit
- Hadith: all 216 stored fields re-checked against HadeethEnc (identical), all 24 HadeethEnc pages and 39 sunnah.com references open at the stated numbers. 24 pass source checks; none withheld; two flagged for reviewer attention (h15, h23).
- Verse for today: all 180 entries re-read with the updated English; 9 entries include verses changed by the edition decision, none became misleading. Day 132 (35:28 starts mid-sentence) and day 6 (6:54) flagged for the reviewer. Schedule and anchor unchanged.
- New `docs/scholar-review.md` (built by `tools/build-scholar-review.cjs`): the 24 hadith, 180 passages, context notes, flagged verses, open questions and a reviewer checklist. No reviewer or approval is claimed.

### Tracker and offline
- Extra worship is labelled "Today", and a note explains that earlier dates apply to the five fard prayers only.
- Service worker: activation now deletes only its own caches (it previously deleted every cache on the origin, including other GitHub Pages projects'); precaching and data fetches bypass the HTTP cache; a partial "save for offline" is no longer reported as saved; users who had saved an older copy are told to save again (Qur'an page and Settings). A data fingerprint in `sw.js` is test-guarded so changed data cannot hide behind an old cache.

### Tests
- New `tests/review.test.mjs` (10 tests). `npm test`: 70 tests, 70 pass (baseline 60).
- Browser checks (Playwright, controlled clock): 33 tracker and cross-feature checks; 23 service-worker checks covering first install, update from the released v4 and from Phase 4 (v5), returning users offline; Phase 4 dua and extra-worship checks. All pass.

## Phase 5: hadith library, 180-day Verse for today, English corrections round 2, tracker dates (17 October 2026)

Worked on top of the uncommitted Phase 4 changes (base `2cbe798`). Nothing was committed, pushed or deployed.

### Hadith library (Task 1)
- New `assets/hadith.js`: 24 narrations from Sahih al-Bukhari and Sahih Muslim, all graded Authentic by HadeethEnc.com. Arabic, English and Bangla texts, attribution and grade reproduced unchanged from HadeethEnc (retrieved 17 October 2026; no version number is exposed, so the date is recorded).
- Every collection number was opened on sunnah.com and the Arabic compared. Where the collection's wording differs from the HadeethEnc text, the reference is marked "close" or "similar" and a note explains it (10 narrations).
- 12 categories with the brief's English and Bangla labels; each narration is stored once and linked to one or more categories.
- New More → Hadith page (also in the desktop sidebar): category chips, cards with right-to-left Arabic, narrator, grade, clickable sunnah.com and HadeethEnc links, and a review notice. Switching language keeps the category and the card being read.
- Withheld: HadeethEnc 4810 (too long for a card), 6267 (hasan, not in Bukhari or Muslim), 10411 (duplicate of an included narration), 3762 and 5797 (left out to stay at 24).

### Verse for today (Task 2)
- `assets/votd.js` rewritten as a fixed 180-day schedule: anchor 1 January 2026 = day 1, `index = ((dayNumber mod 180) + 180) mod 180`, using the selected city's calendar date. No randomness.
- Six 30-day themes. 180 entries (45 short passages of 2–8 verses), each referring to the bundled Qur'an data by surah and verse. Each was read with the surrounding verses and the Al-Mukhtasar explanation; 57 have a context note in both languages. Passages easily misread on their own were left out.
- The card shows the day and theme, all verses of a passage, the translation, the short tafsir (Bangla), word help (English), the context note and footnotes.

### English translation (Task 3)
- All 6,236 verses aligned word by word with both 1930 OCR copies; 750 differences that both copies agree on (651 verses) were classified by hand.
- 60 more verses corrected (151 in total), each with three checks recorded in `en-corrections.json`: both 1930 witnesses, two independent translations used only for comparison (Yusuf Ali, Sahih International; not bundled), and the Arabic or the grammar.
- Spelling modernisations (judgment, steadfast, and others) left as they are.
- 185 verses with different but faithful wording escalated, not changed. They were thought to point to a later revised Pickthall edition (withdrawn in the final review above: no such printed edition was found). The Phase 4 "God", "Owner" and "Mecca" restorations may be affected in the same way; this is listed as an open decision in `docs/translation-audit.md`.
- New `assets/glossary.js`: word help for older English words, shown outside the translation in the Verse for today card, and in the reader when Settings → Explain older English words is on.
- `tools/import-quran.mjs` notice updated; `editions.json` and `coverage.json` regenerated. Only the 151 corrected English verses differ from the source; Arabic, Bangla and short tafsir unchanged.

### Prayer tracker dates (Task 4)
- Previous/next buttons, a date picker and a selectable week strip; Today / Yesterday / Earlier date label; Back to today link; count and empty state for the selected date.
- Each prayer is toggled per date (`IE_XTRACK.togglePrayer`); other dates are untouched. Future dates cannot be selected; the earliest is 119 days back, matching the 120-day retention.
- Calendar-date arithmetic (`shift`, `diff`, `clamp`, `valid`) instead of time arithmetic, so midnight, DST, month ends, year ends and 29 February are safe. Storage format unchanged; no records lost.

### Other
- `index.html` loads `hadith.js` and `glossary.js`; the service worker precaches them and moves to cache v6 (English data changed).
- About page credits for HadeethEnc and the Verse for today schedule; README updated.
- Tests: `tests/votd.test.mjs` rewritten (8 tests), new `tests/phase5.test.mjs` (10 tests); `npm test` 60/60 pass.

## Phase 4 implementation: translation audit, short tafsir, dua cards, extra worship (13 October 2026)

Worked from a clone of `srn-n/Islam-Everyday` at `2cbe798`. Nothing was committed, pushed or deployed.

### English translation (Task 1)
- Identified the text as Tanzil's `en.pickthall` (Pickthall, 1930), confirmed identical to the source file for all 6,236 verses.
- Compared every verse with two OCR copies of the 1930 first edition. 91 verses corrected where both copies agree on different wording: mostly Pickthall's word "God" that the digital text had replaced with "Allah", plus "Owner" (1:4), "Mecca", typos, a wrong word (31:14), missing or misplaced parentheses and quotation marks.
- New `data/quran/en-corrections.json` keeps each replaced text and reason; `tools/import-quran.mjs` re-applies it and refuses to run if the source changes.
- 632 flagged verses are unchanged and listed as unverified in `docs/translation-audit.md`. Arabic, Bangla and numbering untouched.

### Bangla short tafsir (Task 2)
- The Zakaria footnotes cannot be shortened under QuranEnc's terms, so the published short tafsir *Al-Mukhtasar* (Bengali v1.0.0) was added verbatim as `data/quran/bnt/` (6,236 entries).
- Shown under the translation in the reader and the Verse for today card, in a separate box labelled as an explanation and not the Qur'an text. Zakaria's footnotes stay collapsible.
- `assets/bnfix.js` repairs left-over legacy Bangla font characters (about 1,100 entries) on display only.
- No English summaries yet (deferred by the owner).

### Dua cards (Task 3)
- Equal-height previews with a Read more / Show less button; the reference stays visible; no inner scrolling; open state kept while filtering.

### Extra worship (Task 4)
- New Today section: Tahajjud, Duha, Sunnah rawatib, Witr (labelled by school as in the Prayer guide) and voluntary fast, stored per date in `xlog` (`assets/xtrack.js`), separate from the fard log. Undo by tapping again; 120-day retention; 7- and 30-day counts.
- Check animation, row highlight and a quiet message after the state update; reduced motion respected; focus stays on the button.

### Other
- `index.html` loads the two new scripts; the service worker precaches them, accepts `bnt` for offline saving and moves to cache v5 (the English data changed, so offline copies are refreshed).
- About page, README and offline-size text updated. Desktop Today grid gains an `extra` area.
- Tests: new `tests/phase4.test.mjs` (11 tests); the 2:255 spot check now expects Pickthall's "There is no God save Him".

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
