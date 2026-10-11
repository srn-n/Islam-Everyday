# Islam Everyday

Islam Everyday is a daily Muslim companion for phone and desktop, in English and Bangla. It covers:

- prayer times, sehri and iftar, and a prayer tracker
- a **Prayer guide** to the rak'ahs of the five prayers, by school
- the full Qur'an in Arabic, with English and Bangla translations
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
| Editions and coverage | `editions.json` holds the licence and attribution for each edition. `coverage.json` matches the data. Bangla markup is limited to `<b>`. There are no remote fetches. |
| 99 Names | There are 99 entries with stable ids. Each has nonblank content in both languages, a known review status, citations behind every explanation, and resolvable citations. Qur'an quotes appear in the bundled Arabic. No text claims scholar approval or global verification, and there is no collection-wide banner. |
| Prayer guide | The five prayers are in order, with the agreed fard counts for both schools and units in the right sequence. Witr is wajib only in the Hanafi column. All notes, terms and sources are localized and resolvable, and the review notice is present. The guide is in both navigation menus. |
| Brand | The name "Islam Everyday" appears in the manifest, HTML and UI strings, and no old name is left in anything users see. The manifest, Apple touch and favicon icons exist at their declared sizes. The SVG masters are pure vector. The service worker precaches the new assets. |
| Scripts and assets | Every script parses. Every UI string exists in both languages. All referenced files exist locally. There are no analytics, account code or unfinished-work markers. |
| Verse for today | Selection is deterministic, a full cycle covers every ayah once, and long verses are never truncated. |
| Server | The server returns the right file types and 404s, blocks path traversal and shuts down cleanly. |

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
- Bookmarks, continue-reading, copy (with credit), mark-as-read and text settings are available.
- Each surah is loaded from `data/quran/{ar,en,bn}/NNN.json` when opened, and cached for offline use.
- **Settings → Offline reading** saves all 342 files (about 17 MB) so the whole Qur'an opens without a connection.

### Verse for today

The verse is a deterministic pick from all 6,236 ayat:

```
index = (days since 1970-01-01 for the selected city's date × 1009) mod 6236
```

- The day changes at midnight in the selected city.
- Every ayah appears once in each 6,236-day cycle.
- Long verses are shown in full.

### Hijri calendar

- The page has month navigation, Gregorian and Hijri dates, white days, key dates, an upcoming list and a ±2-day adjustment.
- The Today page and menus switch to the next Hijri date at maghrib, as the Islamic day begins then.

## Interaction and motion

- Interactive cards lift 2px with a stronger shadow, on pointer hover and on keyboard focus. These are the name cards, the Hijri tile, the Prayer guide sections, the continue-reading card and the More tiles.
- Today cards get a shadow emphasis only, with no movement.
- A press settles back with a brief scale.
- Hover effects only apply under `(hover: hover) and (pointer: fine)`, so touch screens never keep a stuck hover state.
- With `prefers-reduced-motion: reduce`, transforms and transitions are removed.
- Focus outlines (gold) appear on every control.

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
| English translation | Marmaduke Pickthall, *The Meaning of the Glorious Koran* (1930). Tanzil `en.pickthall` text via [fawazahmed0/quran-api](https://github.com/fawazahmed0/quran-api), commit `47ca096` | Public domain. The repository is under The Unlicense. Bundled unmodified, as Tanzil asks. |
| Bangla translation | Dr. Abu Bakr Muhammad Zakaria, **version 1.1.1 (22 May 2021)**, [QuranEnc.com](https://quranenc.com/en/browse/bengali_zakaria), with footnotes | QuranEnc terms, summarised below. |
| 99 Names and Prayer guide | Short attributed paraphrases of the works listed above, with a link for every citation | All sources are cited in the app |
| Fonts | Hind Siliguri, Scheherazade New and Tiro Bangla (Latin display only), self-hosted from `@fontsource` | SIL Open Font License 1.1 (`assets/fonts/licenses/`) |
| Logo and icons | Original artwork for this project (see above) | Owned by the project owner |

QuranEnc's terms for the Bangla translation:
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
npm run import:quran -- --en eng-mohammedmarmadu.json --bn bn-zakaria-quranenc-vX.json
```

Then run `npm test`.

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
tools/import-quran.mjs     Builds data/quran/* from the source files
tools/arabic-skeleton.cjs  Arabic normalisation used to verify Qur'an citations
assets/app.js              App logic (routing, prayer maths, views, events)
assets/app.css             Design tokens, layout, motion
assets/fonts.css, fonts/   Self-hosted fonts and licences
assets/data.js             UI strings (English/Bangla), duas, cities, methods, events, pronunciation guide
assets/quran-meta.js       Surah names and metadata
assets/votd.js             Verse for today selection
assets/names.js            99 Names: content, sources, per-entry status
assets/guide.js            Prayer guide: rak'ahs by school, terms, sources
data/quran/                Per-surah Arabic, English and Bangla, editions.json, coverage.json
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
- **English translation:** Pickthall's 1930 English is archaic.
- **Offline:** the whole Qur'an works offline only after "Save the Qur'an for offline", or for surahs already opened. The first visit needs a connection.
- **Hijri dates:** these use the Umm al-Qura calendar with a manual ±2-day adjustment.
- **No code licence yet:** no licence has been chosen for the code.

## Privacy

Your prayer log, bookmarks, school choice and settings stay in this browser's local storage on this device. There are no accounts and no analytics, and nothing is sent anywhere. Source links open external pages only when you click them.
