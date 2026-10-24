# Scholar review checklist (Phase 5.4)

For a qualified reviewer. **Nothing in Islam Everyday has been reviewed by a qualified scholar yet**, and the app says so where each item is shown. Passing the app's tests shows that texts match their published sources and that references open at the stated numbers; it does not establish authenticity or correct understanding. Full tables with every reference are in `docs/scholar-review.md` (sections A–J).

Mark each line: **OK**, **change** (say how) or **withhold**.

## 1. Hadith grades that need an independent judgement (An-Nawawi's Forty)

These nine are outside Sahih al-Bukhari and Sahih Muslim and carry a Hasan grade or an-Nawawi's own grade, as given by HadeethEnc. The app flags each one "Grade: needs review".

| No. | Takhrij (HadeethEnc) | Grade shown (HadeethEnc) | Decision |
|---|---|---|---|
| 12 | At-Tirmidhi and others | An-Nawawi: Hasan | |
| 18 | At-Tirmidhi | At-Tirmidhi: Hasan | |
| 30 | Ad-Daraqutni and others | An-Nawawi: Hasan | |
| 31 | Ibn Majah and others | An-Nawawi: Hasan | |
| 32 | Ibn Majah, Ad-Daraqutni and others | Hasan | |
| 33 | Al-Bayhaqi and others (part in the two Sahihs) | Hasan | |
| 39 | Ibn Majah, Al-Bayhaqi and others | An-Nawawi: Hasan | |
| 41 | "Al-Hujjah" | An-Nawawi: Sahih | |
| 42 | At-Tirmidhi | Hasan | |

Also confirm the grade of these four, which are outside al-Bukhari and Muslim but graded Authentic by HadeethEnc (not flagged in the app): **11** (at-Tirmidhi, an-Nasa'i; sunnah.com shows Nasa'i 5711 "Sahih, Darussalam"), **19** (at-Tirmidhi), **28** (Abu Dawud, at-Tirmidhi; sunnah.com shows Abu Dawud 4607 "Sahih, al-Albani"), **29** (at-Tirmidhi).

## 2. Notes written for the app (not from the sources)

These were **drafted with an AI assistant during development** and are labelled in the app as editorial or context notes, kept apart from the Qur'an and hadith texts. Each needs a reviewer's check for accuracy and tone.

- An-Nawawi no. 8 (fighting) and no. 14 (legal penalties): context notes.
- An-Nawawi no. 35: translation note on HadeethEnc's "our brothers".
- 57 Verse-for-today context notes and the editorial notes on seven English Al-Mukhtasar explanations (`docs/scholar-review.md` B and D).
- Bangla summaries of the White Days evidence (labelled as summaries).
- The prohibited-time explanation (scope, method) and the zakat **Learn** sections, in English and Bangla.
- The category placement of all 40 general-library narrations (editorial). Earlier questions: h15 (asking forgiveness 70 times a day, under Hope/Dhikr) and h23 ("patience at the first stroke", under Sad).

## 3. Qur'an translation (Pickthall, 1930 first edition)

- 24 1930 readings adopted under the one-edition policy but flagged: person/number differs from the Arabic (2:100, 3:23, 3:163, 7:137, 10:83, 33:63, 43:32, 69:17); interpretive (3:161, 43:81, 78:33); an element of the Arabic left untranslated (2:159, 3:144, 4:11, 5:19, 5:93, 6:12, 6:54, 7:89, 20:84, 36:65, 63:6, 66:5, 68:19).
- 2 readings held back from the 1930 text: 2:57 ("they wronged Us not") and 82:9 ("ye deny").
- 7 obvious 1930 misprints not reproduced (3:147, 4:94, 5:67, 7:53, 17:33, 20:109, 45:8) and a doubled "the" in 3 verses.
- Decision: keep the one-edition policy, or add the 13 missing elements in marked square brackets.

## 4. Prohibited prayer times (Today card)

- Sources: Sahih Muslim 831, Sahih al-Bukhari 586, Ibn Baz fatwa 18495. Are they the right evidence for what is shown?
- Margins used, labelled as approximate: sunrise to +15 min; 10 min before Dhuhr; 15 min before Maghrib; advance notice 10 min. The sources give no minutes. Acceptable, or follow a particular school's figures?
- Dhuhr in this app begins at the exact solar transit, so the zenith note ends at that moment. Should Dhuhr (and the end of the note) carry a few minutes' margin after transit?
- After-Fajr and after-Asr notes appear only if the user ticked that prayer. Is "generally avoided" plus the scope note (voluntary prayer only; schools differ on exceptions such as prayers with a reason and making up missed prayers) a fair summary?

## 5. Zakat (educational estimate)

- Disclaimer (owner-supplied, verbatim) and its Bangla translation.
- Default nisab weights 87.48 g / 612.36 g (7.5 / 52.5 tola), option 85 g / 595 g; silver as the default basis.
- Learn sections: what counts, hawl, debts due now, jewellery, shares, superannuation and other points of difference are named but not ruled on.

## 6. Added in Face 7 (October 2026) — all drafts, labelled in the app

- **Qur'an study notes** (`assets/study.js`): overview, learning themes and reflection prompt for 45 surahs, drafted with an AI assistant and marked "draft". Check each for accuracy, tone, and that nothing reads as tafsir, a ruling, an occasion of revelation or a virtue. Quoted phrases are from Pickthall (English) and Zakaria (Bangla). Meccan/Medinan labels follow Tanzil metadata; confirm or note differences of opinion.
- **Ayat al-Kursi** (Core remembrance): text from the app's Qur'an data; the note on Sahih Muslim 810; the English and Bangla transliterations written for the app.
- **Shahada:** Arabic as in Sahih Muslim 403a; the app's own English and Bangla translations and transliterations; the reference note (403a, 8a) and the note on the term "Kalima".
- **Friday label note:** "Jumu'ah is shown at the calculated Dhuhr start time; the khutbah and congregation time may be different…". Is the wording fair?
- **Thursday/Friday verse** (`assets/votd-day.js`): one draft, 62:9–10 for Friday, chosen because the verses themselves name the call to prayer on the day of congregation. It is not shown until marked reviewed. No Thursday entry exists. Approve, change or withhold; any further entry needs a reliable source for its link to the day.
- Zakat (section 5) is no longer shown in the app; its review is not needed unless it is restored.

## 6a. Added in Face 7.1 — drafts, labelled in the app

- **Qur'an study pages** (`tools/study-notes/notes_*.py`): for each of the 45 surahs — overview, how the surah unfolds (verse ranges), key ideas and terms (each tagged "From the verses" or "Al-Mukhtasar (tafsir)"), takeaways and an everyday example. Check accuracy, that each point follows from the verses cited, and that nothing reads as tafsir, a ruling, an occasion of revelation or a virtue.
- **Qur'an Stories** (`tools/stories/stories_*.py`), 28 entries. For each: does every "Qur'an account" part say only what the cited verses say; are the "What the sources do not tell us" notes correct; are "Why this matters" notes fair; is each modern example appropriate. Points to check in particular:
  - Ibrahim's son in 37:101–107 named as Isma'il (from Al-Mukhtasar; scholars have discussed this).
  - The speaker in 19:24 identified as 'Isa (from Al-Mukhtasar).
  - Musa and the servant: the hadith part (Sahih al-Bukhari 3401) naming al-Khidr; the note that 18:74–81 is not a rule for anyone else.
  - Hadith stories (Bukhari 2272/Muslim 2743a; Muslim 2766a/Bukhari 3470; Bukhari 2363/Muslim 2244; Bukhari 3464/Muslim 2964; Muslim 3005; Bukhari 3436/Muslim 2550a): summaries faithful? The boy-and-king story is presented as linked to 85:4–8 only as a commentators' view.
  - The note in "Musa: the river, the palace and Madyan" that Pharaoh's wife is named Asiyah through hadith (Sahih al-Bukhari 3411 names her).
- **Verse for today in English** now uses the Rowwad Translation Center translation (QuranEnc v1.0.20) with its own footnotes. Confirm the edition choice; QuranEnc's terms ask that newer versions be adopted when published.

## 7. Already listed earlier (unchanged)

White Days evidence (four references), Prayer guide, 99 Names explanations, duas and pronunciation guide: see `docs/scholar-review.md` and each section's own review note.

Reviewer name and qualification: ______________________   Date: __________
