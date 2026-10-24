# Islam Everyday

Islam Everyday is a daily Muslim companion for phone and desktop, in English and Bangla. It covers:

- prayer times, sehri and iftar, a prayer tracker you can fill in for today or any of the last 120 days, and a separate **Extra worship** record (Witr, voluntary prayers, voluntary fasts)
- a **Prayer guide** to the rak'ahs of the five prayers, by school
- the full Qur'an in Arabic, with English and Bangla translations, and a short Bangla explanation (Al-Mukhtasar) for every ayah
- a **Verse for today** from a reviewed 180-day schedule in six themes
- a **Hadith** library: 24 authentic narrations from Sahih al-Bukhari and Sahih Muslim, in 12 categories, in English and Bangla
- duas
- the Hijri calendar
- the 99 Names of Allah, with the sources for each explanation
- a zakat calculator

It has no ads, no accounts and no analytics. All content ships with the site: the Qur'an, its translations, the fonts and the icons. At runtime it only loads its own files. It installs to a phone's home screen as an offline-capable app (a PWA).

The project folder is `DinSathi-Web`, the app's earlier working name. The public name is **Islam Everyday**.

## Run it locally

You need [Node.js](https://nodejs.org) 18 or newer. There are no dependencies to install.

```bash
cd DinSathi-Web
npm start
```

Open **http://localhost:8090**. Stop the server with `Ctrl+C`.

`npm start` runs `scripts/serve.mjs`, a small static server. It sends `Cache-Control: no-store`, so a refresh always shows the files on disk.

### Changing the port

If port 8090 is busy, the server says so and exits. Either stop the other server, or pick another port:

```bash
PORT=9000 npm start            # macOS / Linux
$env:PORT=9000; npm start      # Windows PowerShell
set PORT=9000 && npm start     # Windows cmd
```

On Windows, you can find what holds the port with:

```powershell
Get-NetTCPConnection -LocalPort 8090 -State Listen | Select-Object OwningProcess
```

Then stop it with `Stop-Process -Id <number> -Force`, replacing `<number>` with the process number shown.

### Run one copy at a time

The service worker keeps an offline copy of the app for each address (`localhost:8080`, `localhost:8090` and so on). An old server left running on another port will keep showing an old version there.

- Keep one server running.
- If an old layout appears, reload once.
- To remove an old copy completely, open DevTools → Application → Storage → **Clear site data** for that address.

## Checks

```bash
npm test
```

`npm test` uses Node's built-in test runner, with no browser and no network. It starts its own server on a random free port and closes it afterwards. It fails on missing or malformed data.

| Area | What is checked |
|---|---|
| Qur'an data | All 114 surahs and 6,236 ayat in Arabic, English and Bangla: the files parse, the ayah counts match, nothing is empty, and spot checks confirm the languages are aligned. |
| English corrections | Every entry in `en-corrections.json` points at a real ayah, has a reason and is present in the data; no word-swap leftovers; parentheses balanced. Phase 5: 91 round-1 and 60 round-2 entries; each round-2 entry records three checks and is a small change; known non-words are gone. |
| Word help | Older words are explained outside the translation, labelled as help, and shown in the reader only when switched on. |
| Hadith | 40 records (24 + 16 in Phase 5.3), each stored once; Arabic, English and Bangla present; only Sahih al-Bukhari or Sahih Muslim references with sunnah.com links, at least one matching the wording shown; graded Authentic by HadeethEnc; review status stated; the 12 categories match the brief in both languages; every category has at least two narrations and filtering never duplicates; source terms recorded; no truncation. |
| Prayer tracker dates | Date arithmetic across month ends, leap days, year ends and DST change dates; future dates clamped; each prayer on each date toggles independently without touching other dates; the 120-day retention is unchanged; previous/next, date picker, Today/Yesterday/Earlier labels and empty state exist in both languages. |
| Bangla short tafsir | One entry per ayah for all 6,236, never a copy of the translation, labelled as not the Qur'an text; the display repair leaves no legacy-font characters and does not touch clean text. |
| Duas and Extra worship | The dua preview has an accessible Read more control and no nested scrolling. The extra worship record marks, undoes, cleans, prunes and counts by date, never touches the fard log, re-checks the date before recording, and runs its effect only after the state update. |
| Editions and coverage | `editions.json` holds the licence and attribution for each edition. `coverage.json` matches the data. Bangla markup is limited to `<b>`. There are no remote fetches. |
| 99 Names | There are 99 entries with stable ids. Each has nonblank content in both languages, a known review status, citations behind every explanation, and resolvable citations. Qur'an quotes appear in the bundled Arabic. No text claims scholar approval or global verification, and there is no collection-wide banner. |
| Prayer guide | The five prayers are in order, with the agreed fard counts for both schools and units in the right sequence. Witr is wajib only in the Hanafi column. All notes, terms and sources are localized and resolvable, and the review notice is present. The guide is in both navigation menus. |
| Brand | The name "Islam Everyday" appears in the manifest, HTML and UI strings, and no old name is left in anything users see. The manifest, Apple touch and favicon icons exist at their declared sizes. The SVG masters are pure vector. The service worker precaches the new assets. |
| Scripts and assets | Every script parses. Every UI string exists in both languages. All referenced files exist locally. There are no analytics, account code or unfinished-work markers. |
| Verse for today | 180 entries with unique ids and no overlapping verses; every surah and verse range exists in the bundled data; six 30-day theme blocks; context notes in both languages; day 1 = 1 January 2026, day 180 → 181 wraps, dates before the anchor, leap days, month and year ends and a DST change date all map correctly; the same date always gives the same verse; long verses are never truncated. |
| Server | The server returns the right file types and 404s, blocks path traversal and shuts down cleanly. |
| Phase 5.2 | Every one of the 180 Verse-for-today entries (267 verses) has an English explanation; the stored texts match the reviewed fingerprint, keep the publisher's verse numbers and are shown without them; source, retrieval date, "not AI", review status and editorial notes are recorded; the explanation is a separate layer shown in English only. English (India) is the default English; English (US) changes spelling of interface strings only, never religious texts; switching keeps the page and reading position. The Today card has start times only (no ending times; Phase 5.3 adds one countdown, to the next start) and an iqamah note. Hadith cards use the shared Read more shell with no truncation. The two new themes define every token; text contrast is checked in all four palettes; glass is limited to navigation and controls with solid fallbacks. Calendar days are buttons with labels, popover, details, roving focus and keys; White Days, references, the Tashriq exception and the calculated-date statement are present. The day chart uses the solar position, marks sunrise and sunset as events, has a text equivalent, honours reduced motion and has a high-latitude fallback. |

| Phase 5.3 | The countdown formats HH:MM:SS, never goes negative and targets the next prayer's start; times that are missing, out of order or polar are rejected. Prohibited-time windows are checked at every boundary (sunrise +15 min, Dhuhr −10 min, Maghrib −15 min, 10 min advance notice), the after-Fajr/after-Asr notes appear only when that prayer is ticked, and nothing is shown when the times are unreliable; sources and method are recorded in both languages. The chart label layout keeps order, never overlaps and stays inside the chart (400 random schedules plus edge cases). Theme boot applies mode and palette before first paint, follows the system, and migrates Phase 5.2 settings; all 10 palette/mode sets keep text, control and focus-ring contrast. Zakat: formula, nisab at or above, weights, no price, blank/negative/invalid/huge values, the verbatim disclaimer and both languages. Calendar layout order and notes. An-Nawawi's Forty: 42 numbered records, links, grades, flags, notes, separation from the general library, and every text, takhrij and grade hash-checked against the retrieved text (`tests/fixtures/hadith-hashes.json`); the 16 new general records likewise. Every `t()` key exists in both languages; interaction styles respect reduced motion and never move religious text. |

| Phase 5.4 | Sunrise, solar noon and sunset agree with an independent NOAA calculation to within 1 minute for 14 places and dates (both hemispheres, DST change days, high latitudes); day times use that day's own zone offset. Arabic, English, Bangla and the Bangla short tafsir have the same verse ids (6,236). All 393 English corrections are present, none reverted, the 24 flagged 1930 readings and the 2 held readings are as recorded, and the electronic text's mechanical rewordings have not come back. Bangla hadith notes use Bangla digits; references use sunnah.com's own numbers. Approximate margins are worded as approximate in both languages. No interface text claims scholarly approval. |

Browser checks (not part of `npm test`; they need Playwright): start the server with `npm start`, then run `node tests/browser/phase52.cjs http://localhost:8080/`, `node tests/browser/phase53.cjs http://localhost:8080/` and `node tests/browser/phase54.cjs http://localhost:8080/`. Phase 5.4's suite covers DST start and end (countdowns are real elapsed time), high latitudes (London midsummer, Tromsø polar night), Bangla digits, right-to-left Arabic, keyboard focus and reduced motion.

Service-worker and offline checks: `node tests/browser/offline.cjs --v4 <dir> --v5 <dir> --v52 <dir>` (no server needed; it starts its own on port 8097). Each `<dir>` is a full copy of an older build: the released version (v4), the Phase 4 build (v5) and the Phase 5.2 build. A scenario without its build is reported as skipped. It covers a fresh install, updates from each older build (saved Qur'an, user data, other apps' caches on the same origin, offline after the update), an interrupted save, and a returning user switching language offline. Both use a controlled clock in Australia/Sydney. Phase 5.3's suite covers the live countdown (ticking, prayer change, midnight, Bangla digits), prohibited-time boundaries through a day, the polar fallback, System/Light/Dark with OS changes and no flash, palette persistence across pages, zakat inputs and validation, the calendar layout on desktop and mobile in both English variants and Bangla, the Hadith collections (numbering, jump list, progress, persistence, language, shared entries) and hover, keyboard, press and reduced-motion behaviour. Phase 5.2's covers prayer transitions, today/tomorrow, midnight, DST, location and language switching, the verse explanation, Hadith expansion on mobile and desktop, theme persistence, calendar mouse/keyboard/touch use, White Days, the day chart, reduced motion and the high-latitude fallback.
| Final review (Phases 4–5) | Every English correction is applied exactly, one per verse, in three recorded rounds; the electronic text's artefacts are gone; 1930 misprints and held-back readings are not reproduced and review items are flagged. Arabic, Bangla and Al-Mukhtasar files are byte-identical to the reviewed versions, and every surah has the same verse count in all four. The service worker deletes only its own caches, precaches every script `index.html` loads (bypassing the HTTP cache), and its DATA version matches a fingerprint of the Qur'an data; the offline flag follows the DATA version. Extra worship is labelled as today's record. |

## Content behaviour

### Prayer guide (More → Prayer guide)

The guide shows how many rak'ahs each daily prayer has, which are obligatory, and in what order they are prayed.

- **Choosing a school:** a switch chooses between **Hanafi** and **Shafi'i**. The default follows your Asr setting (Hanafi Asr → Hanafi), and your choice is saved on this device.
- **The five prayers table:** shows the units before the fard, the fard itself, the units after it, and Witr. The units are colour-coded:
  - fard
  - wajib (the Hanafi Witr)
  - sunnah mu'akkadah
  - other sunnah / nafl
  - Witr
- **Each prayer** opens to show:
  - the full sequence of units;
  - a short note on where the schools agree and differ;
  - the sources used, ending with a review-status sentence.
- **What the words mean** explains rak'ah, fard, wajib, sunnah mu'akkadah, other sunnah/nafl and Witr in plain English and Bangla.
- **Witr** is presented without flattening the schools:
  - In the Hanafi school, Witr is wajib: three rak'ahs with one salam.
  - The majority view (Maliki, Shafi'i and Hanbali) is that Witr is a confirmed sunnah. It is at least one rak'ah, commonly prayed as two then one.
- **Other schools:**
  - The Maliki position (no fixed rawatib count) has its own note.
  - So does the Hanbali one: its emphasised counts match the Shafi'i ones, and the extra non-emphasised units are only sourced for the Shafi'i school.
- **Sources:**
  - Hadith checked on sunnah.com: al-Bukhari 46, 990, 1180, 1182, 1183; Muslim 754a; at-Tirmidhi 415; Abu Dawud 1271, 1416, 1422.
  - A Hanafi answer: Shaykh Yusuf Badat, Mathabah Institute, on IslamQA.org.
  - A Shafi'i answer: the Shafiifiqh.com Fatwa Department, citing *Mughni al-Muhtaj*, on IslamQA.org.
  - IslamWeb fatwa 84719.
  - Mufti Mohammed Tosir Miah, Darul Ifta Birmingham.
  - IslamQA.info 36793.
- **Limits:** Jumu'ah, travel shortening, make-up prayers and how to perform the movements are out of scope, and the page says so.
- The page is labelled as educational, not a fatwa, and not yet independently reviewed by a qualified scholar.

### 99 Names of Allah

- Each card is a button that opens a detail dialog.
  - Focus moves into the dialog and stays inside it. Esc, the close button or the backdrop closes it, and focus returns to the card.
  - Previous and Next buttons move between names.
  - Search matches the transliteration, meaning, number, or Arabic with or without vowel marks.
- Each entry shows, in order:
  1. the Arabic and transliteration, and the English and Bangla meanings;
  2. **textual evidence:** Qur'an verses, with Arabic and the selected translation from the bundled data, and hadith, with gradings;
  3. the **explanation**, ending with the citations it used and a review-status sentence specific to that entry;
  4. notes and differences of opinion;
  5. a **reflection**, labelled as written for this app and not a source-based claim or ruling;
  6. the full source list with links.
- There is no collection-wide "awaiting review" banner any more. The general review policy sits once, at the bottom of the list page, under "About this list".

Each entry's status says what its explanation rests on:

| Status | Entries | Review sentence shown |
|---|---|---|
| `commentary`: a named scholar's tafsir on a verse or hadith containing the name | 90 | "This explanation has not yet been independently reviewed by a qualified scholar." |
| `related`: tafsir on related wording, not on the name itself | 3: al-Jalil, al-Majid (ماجد), al-Mani' | "…draws on commentary about related wording, not on the name itself…" |
| `text`: the wording of a hadith only | 1: as-Sabur | "…taken from the wording of the hadith; no scholar's commentary on the name was located…" |
| `none`: no reliable scholarly explanation located | 5: al-Khafid, al-Wajid, al-Muqaddim, al-Mu'akhkhir, ar-Rashid | "No reliable scholarly explanation was located for this entry; review by a qualified scholar is needed." |

The `none` entries still give useful content:
- what the sources actually show;
- why there is no explanation (for example, "khafidah" in 56:3 describes the Hour, not Allah);
- a labelled reflection.

**Sources:**
- 190 distinct citations: 105 Qur'an verses, 72 tafsir passages, 12 hadith and 1 journal article.
- These come from 9 works:
  - the Qur'an
  - Tafsir al-Sa'di
  - Tafsir Ibn Kathir (abridged English)
  - al-Bukhari
  - Muslim
  - at-Tirmidhi
  - Abu Dawud
  - Ibn Majah
  - Wan Jamil et al. (2021) on Ibn Hajar's view of the list
- A citation supports the specific claim it is attached to. It does not mean that scholar endorsed the app's wording.

### Qur'an reader

- Every ayah shows the Arabic and the selected translation: English (Pickthall) or Bangla (Abu Bakr Zakaria).
- Bangla ayat have collapsible translator's footnotes.
- In Bangla, each ayah also shows a **short explanation** from Al-Mukhtasar (Bengali v1.0.0, QuranEnc.com) in a separate gold-edged box labelled "সংক্ষিপ্ত তাফসির · আল-মুখতাসার · কুরআনের পাঠ নয়" (not the Qur'an text). It is shown as published; characters left over from an old Bangla font encoding are repaired on display only (`assets/bnfix.js`). Where the publisher explains a group of verses together, each verse in the group shows the same explanation. No English summary is shown yet.
- The English text follows Pickthall's 1930 first edition. The digital base text (Tanzil) is an edited electronic text, so 393 verses are restored to the 1930 wording, each checked against three copies of the first edition; modern spellings and the digital text's punctuation are kept. See `docs/translation-audit.md`.
- **Settings → Explain older English words** adds a line under each English ayah, labelled "Word help (not part of the translation)", giving modern meanings for words such as *hath*, *unto*, *lo* and *-eth* endings (`assets/glossary.js`). The translation text itself is never changed.
- Bookmarks, continue-reading, copy (with credit), mark-as-read and text settings are available.
- Each surah is loaded from `data/quran/{ar,en,bn,bnt}/NNN.json` when opened (`bnt` only in Bangla), and cached for offline use.
- **Settings → Offline reading** saves all 456 files (about 20 MB) so the whole Qur'an opens without a connection.

### Verse for today

The verse comes from a fixed 180-day schedule (`assets/votd.js`). There is no randomness:

```
dayNumber = whole days from 2026-01-01 to the selected city's date   (2026-01-01 → 0)
index     = ((dayNumber mod 180) + 180) mod 180                       (0 = schedule day 1)
```

- The anchor is **1 January 2026 = day 1**. Day 180 is followed by day 1 again; dates before the anchor count backwards into the cycle.
- The date is the civil date in the selected city, computed from year/month/day (not from milliseconds), so DST changes, leap days and month or year ends do not shift it. The day changes at midnight in that city.
- Six themes of 30 days each: Hope and mercy (1–30), Patience, trust and gratitude (31–60), Prayer, remembrance and repentance (61–90), Character, kindness and justice (91–120), Knowledge, reflection and growth (121–150), Purpose, the Hereafter and renewal (151–180).
- 45 entries are short passages of 2–8 verses so the meaning is complete; 57 carry a short context note (labelled as an editorial note) where the verse needs its setting to be read correctly. Passages that are easily misread on their own were left out.
- Each entry refers to the bundled Qur'an data by surah and verse; no Qur'an text is duplicated. The card shows the theme and day, the Arabic, the translation, word help (English), the short tafsir (Bangla), the context note and footnotes.
- Every entry was read with its surrounding verses and the Al-Mukhtasar explanation (review status `checked`). No scholar has reviewed the selection.
- **English explanation (Phase 5.2):** in English, every entry shows the published English *Al-Mukhtasar* explanation for its verses (`assets/votd-en.js`), under its own heading ("Explanation · Al-Mukhtasar · published tafsir, not the Qur'an text") with its source line. It is published commentary, not AI-generated. The 267 texts are stored exactly as QuranEnc publishes them; only the publisher's leading verse number is hidden. Grouped explanations (59:22–23, 79:40–41) are shown once. Long explanations open in place with **Read more**. Seven explanations that touch on sensitive matters (for example 1:7, 5:32, 57:16) carry a short editorial note written for this app. In Bangla the card keeps the Bangla Al-Mukhtasar.

### Duas

- Each dua card shows an equal-height preview: Arabic, transliteration and meaning, with the reference always visible.
- A dua that does not fit has a **Read more** button (`aria-expanded`), which opens the whole card in place; **Show less** closes it. There is no inner scrolling. A dua only a couple of lines longer than the preview is shown in full.
- Side by side (desktop), closed cards in a row are the same height; while one is open, the others keep their own height.

### Hadith (More → Hadith)

- Two collections, chosen at the top of the page: the **General library** and **An-Nawawi's Forty (42)**. The choice is saved on the device.
- General library: 40 narrations from Sahih al-Bukhari and Sahih Muslim (`assets/hadith.js`), each graded Authentic by HadeethEnc.com. Phase 5.3 added 16 (h25–h40) for everyday themes the first 24 did not cover: mercy, making things easy, guarding the tongue and hand, a cheerful face, gentleness, the believers as one body, truthfulness, arrogance, spreading salam, guiding to good, this world for the believer, charity and humility, the five prayers as expiation, looking at those below you, the inconspicuous pious servant, and asking for guidance. Same rules as before: only Bukhari/Muslim, graded Authentic, wording checked on sunnah.com, categories editorial.
- 12 categories, from "When You Feel Sad" to "Daily Worship and Dhikr". A narration can belong to several categories but is stored once. The category links are an editorial choice for this app.
- Each card shows the Arabic (right-to-left), the translation in the app language, the narrator, the grade, and clickable references to sunnah.com and HadeethEnc.com. Where the collection's wording differs from the text shown, the reference says so ("close wording" or "similar meaning") and a note explains it.
- The Arabic, English and Bangla texts are HadeethEnc's, reproduced unchanged and retrieved on 17 October 2026.
- Cards share the Dua cards' shell (Phase 5.2): reference as the heading, its categories, then a preview of the Arabic and translation that opens in place with **Read more** (`aria-expanded`); the whole text is always in the page. Open cards stay open when the category or language changes. On desktop, closed cards in a row are the same height.
- Switching language keeps the selected category and the card you were reading.
- Review status: `source-checked` (reference, collection, wording and grade checked against sunnah.com and HadeethEnc.com). Not reviewed by a qualified scholar; the page says so.
- **An-Nawawi's Forty Hadith** (`assets/nawawi.js`, Phase 5.3): all 42 narrations of Imam an-Nawawi's collection in his own numbering, kept apart from the general library. Arabic, English and Bangla, the takhrij and the grade are HadeethEnc's dedicated entries, reproduced unchanged (retrieved 18 October 2026, each field hash-checked). Each number was opened on sunnah.com/nawawi40 and its Arabic compared with HadeethEnc's; the card links there and to the underlying collection numbers sunnah.com links. Sahih and Hasan grades are shown apart. Nine narrations (12, 18, 30, 31, 32, 33, 39, 41, 42) are outside al-Bukhari and Muslim with a Hasan grade or an-Nawawi's own grade, and are flagged "Grade: needs review" with an explanation. Nos. 8 and 14 carry an editorial context note; no. 35 a translation note. Nos. 15 and 36 are the same HadeethEnc entries as two general-library narrations and are stored once. The page has a numbered jump list, previous/next links, a per-hadith **Mark as read** with progress (saved on this device), Read more, right-to-left Arabic, and both languages. A private-use character in HadeethEnc's Arabic of no. 11 is removed on display only.

### Prayer tracker (Today page)

- The tracker opens on today. **Previous** and **Next** buttons, a date picker, and the week strip select another date; the date label shows **Today**, **Yesterday** or **Earlier date**, and a **Back to today** link appears on a past date.
- Each of the five prayers is recorded per date (`log["YYYY-MM-DD"].fajr`, and so on). Ticking a prayer on a past date changes only that date.
- Future dates cannot be selected: Next stops at today, and the picker's maximum is today. The earliest date is 119 days back, matching the existing 120-day retention.
- Dates are computed as calendar dates in the selected city, so midnight, DST changes, month and year ends and 29 February are handled without time arithmetic.
- The storage format and key (`dinsathi.web.v1`) are unchanged, so existing records are kept. The selected date is not saved: the page opens on today after a reload.

### Extra worship (Today page)

- Separate from the five fard prayers: Tahajjud, Duha, Sunnah rawatib, Witr, and a voluntary fast for the day.
- Witr is labelled as in the Prayer guide: wajib in the Hanafi school (below fard), a confirmed sunnah for the majority; the label follows the school chosen in the guide.
- Tap to record for today's date in the selected city; tap again to undo. Each row shows how many of the last 7 days (fasts: 30 days) are recorded.
- Stored on this device under `xlog` in the same saved state as the tracker (`dinsathi.web.v1`), kept for 120 days. The fard log (`log`) is never read or written by it.
- On the calculated Ramadan, Eid and Tashreeq dates a note explains that only voluntary fasts are recorded, or that fasting is not permitted that day.
- Recording shows a short check animation and row highlight and a quiet message; with reduced motion only the state change and message remain.

### Hijri calendar

- The page has month navigation, Gregorian and Hijri dates, white days, key dates, an upcoming list and a ±2-day adjustment.
- The Today page and menus switch to the next Hijri date at maghrib, as the Islamic day begins then.
- Phase 5.2: every day is a button with a full spoken label. With a mouse, hovering shows a popover (Gregorian and Hijri date, White Day, key dates, a planned fast, "Calculated"); keyboard focus shows the same popover. Selecting a day (click, tap, Enter or Space) shows its details below the month. Arrow keys move by day or week and cross into the next or previous month, Page Up/Page Down change month, Home/End go to the first/last day; only the selected day is in the Tab order. Touch selects without a popover. **Go to today** returns to today.
- White Days (Ayyām al-Bīḍ, 13–15 of each Hijri month) are marked and explained in English and Bangla with four sunnah.com references checked on 18 October 2026 (Abu Dawud 2449, graded sahih by al-Albani; Bukhari 1981; Muslim 1160; Muslim 1141). 13 Dhul-Hijjah is a day of Tashriq and is flagged as not fasted. The English quotations are sunnah.com's translations; the Bangla lines are labelled as summaries, not translations. The next White Days are listed as shortcuts.
- An optional fasting plan per day (a checkbox and a short note) is saved on this device under `fplan`; it is a reminder, not a record of fasts kept.
- The method is stated under the month: Umm al-Qura via the browser's Intl calendar plus the adjustment. All dates are calculated, never sighting reports.
- Layout (Phase 5.3): on wide screens the month sits on the left with a side column on the right holding the selected day (with the fasting plan and its note, unchanged) and a compact **Fasting planner and upcoming dates** panel: your next planned fasts (shortcuts to those days) and the next four Islamic dates. Both columns start and end level; the month's cells grow to fill the height. White Days and its four evidence cards span the full width below, in two aligned rows. On phones the order is month, selected day, planner, White Days. The old separate "Upcoming" card and its long note were folded into the planner; the note's content is already in the method line and the day details. No saved data changed.

### Zakat calculator (More → Zakat, Phase 5.3)

- The page opens with the disclaimer, shown verbatim in English and translated into Bangla: an educational estimate, not a ruling or financial advice.
- Inputs in three groups: **Nisab and prices** (currency, silver or gold basis, nisab weights, today's price per gram), **What you own** (cash and bank, gold, silver, investments, business stock, money owed to you, each with a hint), **What you owe now** (debts due now). Nothing is built in for prices: the app never shows a nisab until you enter one.
- The formula is shown: zakat = 2.5% × (assets − debts due now), when that is at least the nisab (weight × price). A breakdown lists each line once; net wealth below zero is shown as zero with a note. Blank fields count as zero; negative, non-numeric or absurdly large entries are not counted and are named in a warning.
- Nisab weights: 87.48 g gold / 612.36 g silver (7.5 and 52.5 tola, the app's earlier values and the default) or 85 g / 595 g (the weights Islamic Relief Australia uses). Silver is the default basis.
- **Learn** sections in English and Bangla: what zakat is, nisab, the lunar year (hawl), why this is an estimate, gold or silver, and where scholars differ. References: Sahih al-Bukhari 8 (hadith) and Islamic Relief Australia's zakat guide (charity guidance), labelled apart.

### Today card and day chart (Phase 5.2, 5.3)

- Phase 5.3: under the current prayer's start time a live countdown says "**Maghrib begins in 01:23:45**" — always to the next prayer's actual start, never to an invented end of the current prayer (Fajr really ends at sunrise, and the end of Isha differs between schools). It ticks every second, switches at each prayer, runs across midnight to Fajr, uses Bangla digits in Bangla, and is replaced by a plain note when the day's times cannot be calculated reliably (high latitudes).
- Phase 5.3: a compact, non-bold line under the times notes when voluntary (nafl) prayer is avoided: from sunrise until about 15 minutes after, from 10 minutes before Dhuhr (the sun at its zenith) until Dhuhr, and from 15 minutes before sunset until Maghrib, with a notice 10 minutes ahead; after the Fajr or Asr prayer once you have ticked it. Sunrise, solar noon and sunset are calculated for your location and date. **Why?** opens the sources (Sahih Muslim 831, Sahih al-Bukhari 586, Ibn Baz fatwa 18495), the scope (voluntary prayer only; schools differ on exceptions and durations) and the method; the minute margins are approximations, as the sources give none. No line is shown when the times are unreliable.
- Phase 5.3: the hero background follows the time of day (night, dawn, sunrise, morning, day, golden hour, dusk), with the moon's phase shown at night; the Verse card has its own quiet background (a faint eight-point star pattern and soft wash, removed with "more contrast").
- The card shows the current prayer period and the time it **started**, the next prayer and the time it **starts**, labelled Today or Tomorrow, and the local Gregorian and Hijri dates. There are no ending times. Isha that began before midnight is labelled "yesterday". Between sunrise and Dhuhr no prayer is in progress, and the card says when Fajr ended (sunrise). A note says the times are when each prayer begins (adhan time) and that a mosque's iqamah may be later.
- The card redraws itself at each prayer start, each minute and when the date or city changes.
- The Prayer times card has a day chart instead of the coloured ribbon: the sun's altitude through the local day (from the same solar formulas as the prayer times), the horizon, sunrise and sunset as diamond markers (events, not prayers), the five prayer starts as dots with names, and the sun's position now. The full text schedule stays directly below; the chart has a text equivalent. With reduced motion the path is not animated. Where the sun does not rise or set or twilight does not end, the chart is replaced by a note.
- Phase 5.3: all chart labels sit in one row above the chart in time order, each placed over its own event and joined to it by a short leader line. Labels that would collide are moved apart as a group as little as possible and kept inside the chart (`assets/dayviz.js`), so close times (for example Maghrib and Isha in summer) never overlap, at any width. The axis keeps 6:00, 12:00 and 18:00 ticks only.

### Language and themes (Phase 5.2, 5.3)

- Settings → Language: **English (India)** (default), **English (US)** and **বাংলা**. The English variants share the same content; they change date and number formats (Intl `en-IN` or `en-US`), "am/pm" or "AM/PM", and US spelling of interface strings. Religious texts are never respelled. Switching keeps the page, filters, the selected date and the card or verse being read. The header button still switches between English and Bangla, keeping the chosen English variant.
- Phase 5.3: **Appearance** (System, Light, Dark) and **Theme** (colour palette) are separate settings. Palettes: Classic (the app's own), Emerald & Ivory, **Sandstone & Deep Teal**, **Burgundy & Warm Parchment**, and Midnight Indigo & Gold; each has a light and a dark set built from the same tokens. System follows the device and changes live when the device switches. `assets/theme-boot.js` runs in `<head>` before the stylesheet, so the saved choice is applied before the first paint (no flash) on every page. A Phase 5.2 setting is migrated (Emerald → Emerald palette in Light, Midnight Indigo → Indigo palette in Dark). All 10 sets are contrast-checked: body text at least 7:1, muted text and accents at least 4.5:1, focus ring at least 3:1.
- A restrained glass effect (translucent blur) is used only for the header, its buttons, the tab bar, segmented controls, the tracker date control, the sidebar's next-prayer box and the calendar popover. Cards and all reading surfaces stay opaque. Without `backdrop-filter` support, or with "reduce transparency" or "more contrast", these fall back to solid surfaces.

## Interaction and motion

- Interactive cards lift 2px with a stronger shadow, on pointer hover and on keyboard focus. These are the name cards, the Hijri tile, the Prayer guide sections, the continue-reading card and the More tiles.
- Today cards get a shadow emphasis only, with no movement.
- A press settles back with a brief scale.
- Hover effects only apply under `(hover: hover) and (pointer: fine)`, so touch screens never keep a stuck hover state.
- With `prefers-reduced-motion: reduce`, transforms and transitions are removed.
- Focus outlines (gold) appear on every control.
- Phase 5.3: buttons, chips, segmented controls, the theme picker and the hadith number list get a small spring lift on hover (pointer devices) and on keyboard focus, and scale down briefly when pressed, which is the feedback on touch screens. Cards use the same spring. Only controls and card shells move: Qur'an, hadith and dua texts are never animated. All of it is off with reduced motion.

## Logo and brand assets

The logo is original vector artwork drawn for this app. It shows a mihrab-shaped open doorway framing a rising gold sun, with a restrained arc for the daily cycle of prayer, in deep teal, evergreen, soft gold and cream. It has no text or calligraphy, so it stays clear at small sizes, and it is not traced from any other app's icon.

| File | Use |
|---|---|
| `brand/islam-everyday-icon.svg` | Master icon (rounded square, transparent corners) |
| `brand/islam-everyday-icon-maskable.svg` | Maskable master: full-bleed background, artwork inside the central 80% safe zone |
| `brand/islam-everyday-icon-small.svg` | Simplified version for 16–32px (heavier strokes, no arc) |
| `brand/islam-everyday-mark.svg` | The mark without background, for use on teal or dark backgrounds |
| `icons/icon-192.png`, `icons/icon-512.png` | Manifest "any" icons |
| `icons/maskable-192.png`, `icons/maskable-512.png` | Manifest maskable icons |
| `icons/apple-touch-icon.png` (180px) | iOS home screen |
| `favicon.ico` (16/32), `icons/favicon.svg` | Browser tab |

The PNGs were rendered from the SVG masters with headless Chromium. The wordmark "Islam Everyday" is set in text in the interface, not inside the icon. The brand assets belong to the project owner.

The Phase 4 brief mentions a concept image, `brand/islam-everyday-icon-concept.png`. It was not present in the checkout or in Downloads, so the logo was drawn from the brief's written description.

## Credits and licences

| Content | Source | Licence / terms |
|---|---|---|
| Arabic Qur'an text | Uthmani script from the Noble Qur'an Encyclopedia (quranenc.com), via [`quran-json`](https://github.com/risan/quran-json) | Package CC BY-SA 4.0; keep this attribution |
| English translation | Marmaduke Pickthall, *The Meaning of the Glorious Koran* (first edition: New York, Knopf / London, Allen & Unwin, 1930). Digital base text: Tanzil `en.pickthall` via [fawazahmed0/quran-api](https://github.com/fawazahmed0/quran-api), commit `47ca096` | The 1930 text is public domain (Pickthall died in 1936; US publication 1930). Tanzil offers its translation files for non-commercial use with credit; this app is free and credits Tanzil. The repository is under The Unlicense. 393 verses restored to the 1930 wording (`data/quran/en-corrections.json`, `docs/translation-audit.md`). Yusuf Ali and Sahih International were used only to cross-check round-2 corrections; they are not bundled. |
| Hadith | [HadeethEnc.com](https://hadeethenc.com) (Encyclopedia of Translated Prophetic Hadiths): Arabic, English and Bangla texts, attribution and grade, retrieved 17 October 2026. Collection numbers checked on [sunnah.com](https://sunnah.com). | HadeethEnc terms (the same seven points as QuranEnc's, below). Reproduced unchanged. HadeethEnc's API does not expose a version number, so the retrieval date is recorded instead. |
| Verse for today schedule, context notes and word help | Written for this app | Editorial; not reviewed by a scholar |
| English explanation (Verse for today) | *Al-Mukhtasar in Interpreting the Noble Quran*, Tafsir Center for Quranic Studies, **English edition**, QuranEnc.com API (`english_mokhtasar`), retrieved 18 October 2026 for the 267 scheduled verses. QuranEnc lists no version number and has no browse page for this edition. | QuranEnc terms, summarised below. Reproduced unchanged; the leading verse number is hidden on display. |
| White Days references | [sunnah.com](https://sunnah.com) English translations (Abu Dawud 2449, Bukhari 1981, Muslim 1160 and 1141), checked 18 October 2026 | Short quotations with references; the Bangla lines are summaries written for this app |
| Bangla translation | Dr. Abu Bakr Muhammad Zakaria, **version 1.1.1 (22 May 2021)**, [QuranEnc.com](https://quranenc.com/en/browse/bengali_zakaria), with footnotes | QuranEnc terms, summarised below. |
| Bangla short tafsir | *Al-Mukhtasar in Interpreting the Noble Quran*, Tafsir Center for Quranic Studies, **Bengali version 1.0.0 (15 October 2020)**, [QuranEnc.com](https://quranenc.com/en/browse/bengali_mokhtasar) | QuranEnc terms, summarised below. Bundled as published; legacy-font characters repaired on display only. |
| 99 Names and Prayer guide | Short attributed paraphrases of the works listed above, with a link for every citation | All sources are cited in the app |
| Fonts | Hind Siliguri, Scheherazade New and Tiro Bangla (Latin display only), self-hosted from `@fontsource` | SIL Open Font License 1.1 (`assets/fonts/licenses/`) |
| Logo and icons | Original artwork for this project (see above) | Owned by the project owner |

QuranEnc's terms for the Bangla translation, the Bangla short tafsir and the English Al-Mukhtasar:
1. No modification, addition or deletion.
2. Credit the publisher and QuranEnc.com.
3. State the version.
4. Keep the transcript information.
5. Report notes to QuranEnc.
6. Update to the latest version.
7. No inappropriate ads.

Full Qur'an metadata, including SHA-256 hashes of the inputs, is in `data/quran/editions.json`. The coverage report is `data/quran/coverage.json`.

To update a translation, run:

```bash
npm run import:quran -- --en eng-mohammedmarmadu.json --bn bn-zakaria-quranenc-vX.json --bnt bn-mukhtasar-quranenc-vX.json
```

The importer re-applies `data/quran/en-corrections.json` and stops if a corrected verse's source text has changed upstream. Then run `npm test`.

The dua texts and meanings, and the 13-surah pronunciation guide, were prepared for this app and have not been reviewed by a scholar.

Choose a licence for your own code before publishing (for example MIT), and add a `LICENSE` file.

## Publishing on GitHub Pages

The owner will make the first commit. When ready:

```bash
cd DinSathi-Web
git init
git add .
git commit -m "Islam Everyday 1.0.0"
git branch -M main
git remote add origin https://github.com/<you>/<repository>.git
git push -u origin main
```

In the repository, go to **Settings → Pages**, choose "Deploy from a branch", then `main` and `/ (root)`.

- `.nojekyll` is included, so GitHub serves every file as-is.
- HTTPS is needed for GPS location and for installing to the home screen.

## Project structure

```
index.html                 App shell
manifest.webmanifest       Install metadata (name, icons, shortcuts: Qur'an, Prayer guide)
favicon.ico                Browser-tab icon (16/32)
sw.js                      Service worker: network-first app code; cache-first Qur'an data and fonts; "save for offline"
package.json               npm start / npm test / npm run import:quran (no dependencies)
brand/                     SVG master logo files
icons/                     PNG and SVG icons generated from brand/
scripts/serve.mjs          Local static server (default port 8090)
tests/*.test.mjs           node:test checks
tests/browser/phase52.cjs  Playwright browser checks for Phase 5.2 (run separately)
tests/browser/phase53.cjs  Playwright browser checks for Phase 5.3 (run separately)
tests/browser/phase54.cjs  Playwright release checks: DST, high latitudes, Bangla digits, RTL, keyboard, reduced motion
tests/browser/offline.cjs  Service-worker update and offline scenarios against older builds (run separately)
tests/fixtures/            Hash record of the retrieved HadeethEnc texts
tools/import-quran.mjs     Builds data/quran/* from the source files
tools/arabic-skeleton.cjs  Arabic normalisation used to verify Qur'an citations
assets/app.js              App logic (routing, prayer maths, views, events)
assets/app.css             Design tokens, layout, motion
assets/fonts.css, fonts/   Self-hosted fonts and licences
assets/data.js             UI strings (English/Bangla), duas, cities, methods, events, pronunciation guide
assets/quran-meta.js       Surah names and metadata
assets/votd.js             Verse for today: 180-day schedule, themes, context notes, date rule
assets/votd-en.js          English Al-Mukhtasar explanations for the 267 scheduled verses, source record, editorial notes
assets/locale.js           English (India) / English (US) variants: Intl locale, AM/PM, US spelling of interface strings
assets/names.js            99 Names: content, sources, per-entry status
assets/guide.js            Prayer guide: rak'ahs by school, terms, sources
assets/bnfix.js            Display-time repair of legacy Bangla font characters in the short tafsir
assets/xtrack.js           Extra worship record, plus per-date fard toggling and calendar-date arithmetic for the tracker
assets/hadith.js           Hadith general library: 40 narrations, 12 categories, references, grades, source terms
assets/nawawi.js           An-Nawawi's Forty Hadith (42): texts, takhrij, grades, review flags, sunnah.com links
assets/zakat.js            Zakat calculation (formula, nisab weights, validation)
assets/dayviz.js           Day-chart label layout
assets/theme-boot.js       Applies appearance mode and palette before first paint
assets/glossary.js         Word help for older English words (shown outside the translation)
data/quran/                Per-surah Arabic, English, Bangla and Bangla short tafsir (bnt), editions.json, coverage.json, en-corrections.json
docs/translation-audit.md  English translation audit: edition decision, evidence, corrections, review items
docs/scholar-review.md     Review pack for a qualified scholar: hadith, 180 passages, flagged verses, checklist
docs/scholar-review-checklist.md  One-page list of exactly what needs a scholar's decision
tools/build-scholar-review.cjs  Rebuilds docs/scholar-review.md from the app data
RESEARCH.md                Survey of Islamic apps on Google Play (written under the earlier name)
CHANGELOG.md               What changed in each phase
```

## How prayer times are calculated

Times are computed on the device with standard solar-position formulas. The methods are MWL, Karachi, ISNA, Egypt and Umm al-Qura, with Shafi'i or Hanafi Asr. All times use the selected city's time zone. **Check them against your local mosque timetable before relying on them.**

| Period | Starts | Ends |
|---|---|---|
| Fajr | Fajr | Sunrise |
| Dhuhr | Dhuhr | Asr |
| Asr | Asr | Maghrib |
| Maghrib | Maghrib | Isha |
| Isha | Isha | Next day's Fajr |

These periods decide which prayer is "current". The Today card shows only start times and a countdown to the next start; it does not show when a period ends, because the end of some periods (for example Isha) differs between schools.

Prohibited times (Phase 5.3) use the same solar formulas: sunrise and sunset at the sun's upper limb with refraction (−0.833°), and solar noon (the sun crossing the meridian), which is also when Dhuhr begins in this app. There is no outside prayer-time API; nothing is fetched.

## Known limitations

- **No scholar review:** no qualified scholar has independently reviewed any of the religious content. That covers the 99 Names explanations and reflections, the Prayer guide, the duas and the pronunciation guide. Each section says so in its own words.
- **99 Names:**
  - 5 entries have no scholarly explanation.
  - 4 rest on related wording or hadith text only.
  - The sources come from 9 works, below the 200-source target set in Phase 3.
  - A few English glosses follow common usage. For example, al-Muqit is glossed "the Sustainer", while the cited meanings are watcher, witness and able. The entry notes this.
- **Prayer guide:**
  - It covers Hanafi and Shafi'i columns, with notes for the Maliki and Hanbali positions.
  - The Hanbali non-emphasised units are not separately sourced.
  - The sources are hadith plus fatwa-service answers, not primary fiqh manuals.
- **Bangla translation:** 29 ayat carry a footnote marker with no matching note in the published source. They are kept as published, listed in `coverage.json`, and not yet reported to QuranEnc.
- **English translation:** Pickthall's 1930 English is archaic (word help explains the older words). The text follows the 1930 first edition; in 13 verses that edition leaves an element of the Arabic untranslated, and 11 more readings are interpretive or differ in person or number from the Arabic. These 24 verses, and two 1930 readings held back (2:57, 82:9), are listed for a qualified reviewer in `docs/scholar-review.md`. The comparison used OCR text of three scans, not a human proofread of page images; punctuation was not compared.
- **Hadith:** 40 general narrations and an-Nawawi's 42, checked against sunnah.com and HadeethEnc (re-checked 17 October 2026: texts identical, all links resolve) but not reviewed by a scholar. No HadeethEnc version number is available. Translation notes have not been sent to HadeethEnc (including the "our brothers" slip in an-Nawawi no. 35). The nine flagged an-Nawawi grades have not been verified independently.
- **Prohibited times:** the minute margins (15/10/15) are approximations chosen for this app; schools and scholars differ on the durations and the exceptions. At high latitudes no warning is shown.
- **Zakat:** an educational estimate. It does not handle mixed-basis portfolios, separate hawl dates per asset, agricultural produce, livestock or retirement funds; the user enters metal prices.
- **Verse for today:** the selection, themes and context notes are editorial and have not been reviewed by a scholar. The English explanation is published commentary (Al-Mukhtasar) reproduced unchanged, not reviewed by a scholar for this app; QuranEnc gives no version number for its English edition. A few publisher typing slips are shown as published (listed in `docs/scholar-review.md`). Only the 267 scheduled verses are bundled, so the Qur'an reader has no English explanation.
- **Day chart and high latitudes:** above about 48° in summer, or in polar day and night, the standard formulas give unreliable Fajr/Isha times; the chart is then hidden with a note, but the Today card and list still show the formula times (for example Fajr about 1:04 am and Isha about 1:02 am in London on 21 June). On those days the countdown and the prohibited-time notes are also switched off, even though sunrise, noon and sunset are still valid. A high-latitude rule (for example one-seventh of the night or the nearest latitude) is a method decision for the owner and a scholar.
- **English (India) dates** follow the Unicode CLDR data in the browser (for example "Sunday 18 October, 2026"), which can differ slightly between browsers.
- **Glass effect:** browsers without `backdrop-filter` show solid surfaces; this is intended.
- **Ayah summaries:** there is no English summary yet. The Bangla short tafsir is a published work, not written for this app; about 1,100 entries contain legacy-font characters that are repaired on display, and a few source typos are shown as published. These have not yet been reported to QuranEnc.
- **Extra worship dates:** records use the civil date in the selected city, so Tahajjud prayed after midnight is recorded on the new date, as with the fard tracker. Extra worship can only be recorded for today; date navigation applies to the five fard prayers. Ramadan, Eid and Tashreeq notes use the calculated Hijri date, which can differ by a day from local sighting.
- **Offline:** the whole Qur'an works offline only after "Save the Qur'an for offline", or for surahs already opened. The first visit needs a connection. Phase 5 moves the caches to v6 because the English data changed, so the Qur'an has to be saved for offline again; users who had saved it see a note on the Qur'an page and in Settings. A save that misses any file is not reported as complete. The service worker only ever deletes its own caches (`islam-everyday-*`, `dinsathi-*`), so other projects on the same GitHub Pages origin are not affected.
- **Hijri dates:** these use the Umm al-Qura calendar with a manual ±2-day adjustment.
- **No code licence yet:** no licence has been chosen for the code.

## Privacy

Your prayer log, bookmarks, school choice and settings stay in this browser's local storage on this device. There are no accounts and no analytics, and nothing is sent anywhere. Source links open external pages only when you click them.
