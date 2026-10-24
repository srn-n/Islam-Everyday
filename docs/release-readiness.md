# Islam Everyday — release-readiness report (Phase 5.4, 19 October 2026)

Scope: the combined Phase 4–5.3 build, audited in place. Nothing was committed, pushed or deployed. **Technical readiness and religious-content approval are reported separately: passing tests shows that texts match their sources and that the app behaves as designed; it does not establish religious authenticity or correct understanding.**

## Recommendation

- **Technical: ready for owner approval.** Every suite passes. The audit found no data loss, no cache or update defect, and no WCAG A/AA failure left. Fixes were small; see section 1.
- **Religious content: conditionally ready.** No qualified scholar has reviewed anything. The app states that clearly and never implies approval. Release is reasonable only if the owner accepts publishing with the open items listed in `docs/scholar-review-checklist.md` clearly labelled as they are now. Otherwise, wait for that review.

## 1. Technical issues found and corrected

| Issue | Evidence | Fix |
|---|---|---|
| Light-theme gold text on its pale background was 4.38:1. The "Next" label on the Today card and the Witr legend failed WCAG AA (4.5:1). | axe-core: `color-contrast`, serious | `--gold` changed from #9C6210 to #996010 (visually the same, now 4.53:1). The recorded test exception was removed and the threshold raised. |
| Two unnamed complementary landmarks on the Qur'an page (sidebar and surah list). | axe-core: `landmark-unique` | Both landmarks now have names in English and Bangla. |
| Bangla notes on the 16 narrations added in Phase 5.3 used Latin digits (e.g. "বুখারী 5997"). The rest of the app uses Bangla digits. | data scan | Regenerated with Bangla digits; a test now guards all notes. |
| Muslim 2318 and 1893 resolve on sunnah.com as 2318a and 1893a. | sunnah.com reference block | Labels and links now use 2318a and 1893a. |
| The zenith and sunset advance notices showed an exact start time for an approximate margin. | review of wording | Now "From about {t} …" (English and Bangla). |
| The zakat warning said "not valid numbers or negative" but also drops unrealistically large values. | `zakat.js` vs string | The message now names all three reasons, in both languages. |

Bugs I introduced during this phase that the tests caught before saving: the surah-list label used a key that does not exist (caught by the string-key test), and a sidebar change temporarily caused an axe `region` warning (replaced with a named landmark).

## 2. Qur'an translation: remaining items

- The edition is consistent. All 393 corrections are present in the data, none is reverted, and there is one entry per verse. Signatures of the electronic text ("Your Allah is One Allah", "Makka", "Master of the Day", dropped words) do not occur. Arabic, English, Bangla and the Bangla short tafsir all have 6,236 verses with matching ids. The Bangla tafsir groups 14:49–50 under one explanation, as published.
- Open for a reviewer:
  - 24 adopted 1930 readings: 8 where person or number differs from the Arabic, 3 interpretive, and 13 where an element of the Arabic is left untranslated.
  - 2 held readings: 2:57 and 82:9.
  - The owner's one-edition policy decision.
- No AI-generated explanation is part of the Qur'an text. The English explanation under the Verse for today is published tafsir (Al-Mukhtasar), labelled "not the Qur'an text". The 57 context notes and 7 editorial notes on explanations were written for the app with an AI assistant. They are labelled "editorial note" and kept outside the translation. **Owner decision:** whether the app should also say that these notes were AI-drafted.
- Attribution and licences are recorded in `data/quran/editions.json` and the About page. QuranEnc's "update to the latest version" term could not be checked this session: QuranEnc's pages showed no version number.

## 3. Hadith entries needing scholar review

- **Integrity:** all 720 stored fields (Arabic, English, Bangla, takhrij and grade for 40 general + 40 an-Nawawi HadeethEnc entries; nos. 15 and 36 are shared with the general library) were compared today with the live HadeethEnc API. All match exactly. All 154 sunnah.com links in the app (hadith, an-Nawawi, White Days, prohibited times, Prayer guide) open at the stated number and show the Arabic.
- **Flags and notes:** the nine flagged grades are unchanged and still flagged. No grade was altered, and no endorsement was added. Shared narrations link to the general library and are stored once.
- **For independent review:**
  - Flagged An-Nawawi grades: 12, 18, 30, 31, 32, 33, 39, 41, 42.
  - Confirm grades: 11, 19, 28, 29 (outside Bukhari and Muslim, graded Authentic).
  - Editorial notes: An-Nawawi 8 and 14 (context), 35 (translation).
  - Category placement of the general library.
  - The full table is in `docs/scholar-review-checklist.md` §1–2.
- The interface never claims scholarly approval; a test checks every string.

## 4. Prohibited prayer times: decisions required

- **Calculation:** sunrise, solar noon and sunset agree with an independent NOAA calculation to within 1 minute across 14 places and dates (largest difference 0.27 min, at Tromsø).
  - Countdowns use absolute times. On the Sydney DST start and end nights the countdown to Fajr is the real elapsed time; browser checks confirm this.
- **Sources:** Sahih Muslim 831 and Sahih al-Bukhari 586 (both re-opened today), plus Ibn Baz fatwa 18495. Scope shown: voluntary prayer only; schools differ on exceptions and durations. The method is explained in the "Why?" sheet.
- **Behaviour kept unchanged; decisions for the owner and a scholar:**
  1. Are the margins acceptable? They are 15 minutes after sunrise, 10 minutes before Dhuhr and 15 minutes before Maghrib, plus 10 minutes' notice. All are labelled approximate.
  2. Dhuhr is the exact solar transit, so the zenith note ends at that moment. Should Dhuhr carry a safety margin?
  3. On high-latitude days where Fajr/Isha cannot be calculated (e.g. London about May to July), the countdown and all prohibited-time notes are switched off. This happens even though sunrise, noon and sunset remain valid, and the times list still shows the formula's Fajr ≈ 1:04 and Isha ≈ 1:02.
     - A high-latitude rule is a method decision.
     - Showing the sun-based notes on those days would be a small technical change, once approved.
- The after-Fajr and after-Asr notices appear only when that prayer is ticked, and disappear at sunrise and at the start of the sunset period. Verified in the browser.

## 5. Zakat: assumptions and open questions

- The formula shown matches the code: 2.5% × (assets − debts due now), applied when the net is at least nisab, which is weight × the user's price per gram. Each field is counted once and only the debts field is subtracted. A negative net is shown as 0, and "exactly at nisab" counts.
- Nisab weights: 87.48/612.36 g (7.5/52.5 tola, default) and 85/595 g. Islamic Relief Australia's page was re-read today. It uses 85/595 g, lists 87.48/612.36 g among "other teachings", recommends silver, and describes hawl, debts payable within 12 months, and superannuation as not zakatable until paid out. The app describes all of this accurately.
- No price is built in. IRA publishes current values (dated 13 March 2026), and the app does not copy them.
- The disclaimer is the owner's text, verbatim, with a Bangla translation. The page is labelled an educational estimate, not a ruling.
- **Open:**
  - Jewellery worn regularly, shares (whole value or zakatable part), long-term debts and mortgages, receivables, and retirement funds are named as points of difference, not ruled on.
  - Hawl is explained, not tracked.
  - A mixed gold/silver basis is not modelled.

## 6. Offline and service-worker results

`tests/browser/offline.cjs`, run with copies of the released v4 build, the Phase 4 (v5) build and the Phase 5.2 build: **36 passed, 0 failed, 0 skipped** (stable on repeat runs).

- **Fresh install:** every script `index.html` loads is precached. Offline, the Hadith, An-Nawawi and Zakat pages open and theme boot works. An unsaved surah shows a message.
- **Update from v4 and from v5:**
  - The new caches activate and this app's old caches are removed.
  - Other apps' caches on the same origin are kept (including one whose name contains "islam-everyday" but does not start with it).
  - The log, bookmarks and fasting plans are kept.
  - The user is asked to save the Qur'an again, because the data changed. Offline after the update the new app opens; re-saving stores all 456 files, and surah 33 then opens offline with the current English.
- **Update from the Phase 5.2 build** (same cache names):
  - New files are precached into the existing app cache, and the cached shell is the new one.
  - The saved Qur'an stays saved: 456 files, flag kept, no re-save note.
  - Offline, the new An-Nawawi collection and surah 33 open.
  - Network-first alone was not relied on; the precache was checked directly.
- **Interrupted save:**
  - When the connection drops part-way, the save is not reported as complete, and the button comes back.
  - After a reload, settings still says "not saved"; a surah whose files were stored still opens.
  - Saving again completes all 456 files.
- **Returning user, offline:** the reader switches to Bangla from the saved copy.
- The worker only deletes caches whose names start with `islam-everyday-` or `dinsathi-`, excluding the two current ones.
- **Limitation:** if the browser evicts the data cache under storage pressure, the "saved" flag cannot know. Missing surahs then show the offline message.

## 7. Full test and build results (actual, this session)

| Suite | Baseline | Now |
|---|---|---|
| `npm test` (node:test; there is no build step) | 118 | **126 passed, 0 failed** (+8 Phase 5.4 checks) |
| `tests/browser/phase53.cjs` | 64 | **64 passed** |
| `tests/browser/phase52.cjs` | 52 | **52 passed** |
| Service-worker checks (earlier script, extended in 5.3) | 23 | **23 passed** |
| `tests/browser/offline.cjs` (new) | — | **36 passed** |
| `tests/browser/phase54.cjs` (new) | — | **14 passed** |
| Cross-feature regression script | 33 | **33 passed**, no console errors |

The one assertion changed in an existing test was tightened, not weakened: the gold contrast exception was removed.

On the owner's machine after copying the 13 changed files (hash-verified; the whole project then matches the audited build, apart from the owner's `docs/PHASE3.md`): `node --test` **126 passed, 0 failed**.

## 8. Remaining accessibility and responsive issues

- **axe-core 4.10** was run on 11 pages across light, dark, all four extra palettes in both modes, English (India), English (US), Bangla, mobile and desktop, and the Qur'an reader.
  - No WCAG A or AA violations remain.
  - These best-practice findings (moderate) remain:
    - **Headings:** pages title with `<h2>` and have no `<h1>`; Today's section headings jump from `<h1>` to `<h3>`.
    - **Tafsir boxes:** these are `<aside>` landmarks inside `main`.
  - Changing them means restructuring headings across pages, so I have left them for a deliberate pass.
- **Browser checks:**
  - Keyboard focus is visible on the first 25 tab stops of each main page.
  - Arabic is right-to-left and marked `lang="ar"` in the hadith cards and the reader.
  - No looping animation runs with reduced motion.
  - Bangla pages show Bangla digits, apart from source codes such as fatwa numbers.
  - There is no horizontal scroll on mobile.
- **Screenshot artefact:** the faint full-page screenshot artefact (the closed desktop sheet) does not occur in normal rendering or in any automated check, so it was not changed.

## 9. Files changed in Phase 5.4

`assets/app.css`, `assets/app.js`, `assets/data.js`, `assets/hadith.js`, `docs/scholar-review.md` (regenerated), `README.md`, `CHANGELOG.md`, `tests/phase52.test.mjs`; new `tests/phase54.test.mjs`, `tests/browser/phase54.cjs`, `tests/browser/offline.cjs`, `docs/scholar-review-checklist.md`, `docs/release-readiness.md`.

## 10. Before release (owner)

1. Decide the items in section 4 and in the checklist, or accept them as clearly labelled limitations.
2. Decide whether AI-drafted editorial notes should say so.
3. Arrange the scholar review, or knowingly publish with the review notices as they stand.
4. Then commit and push. Not done; waiting for your approval.
