# English Qur'an translation audit (Phases 4 and 5)

This records what was checked in the English translation, what was changed, the evidence, and what is still open. It is a comparison against scanned printed copies, not a human proofread of the printed pages, and it is not a scholarly review.

## Edition decision (Phase 5 final review)

**Decision: the English text follows one identifiable edition, the first edition of Marmaduke Pickthall, *The Meaning of the Glorious Koran: An Explanatory Translation* (New York: Alfred A. Knopf, 1930; London: George Allen & Unwin, 1930).** Both issues come from the same typesetting (printed in England by Richard Clay & Sons, Bungay).

### Provenance of the digital text

- The app's base text is Tanzil `en.pickthall` (via fawazahmed0/quran-api). Tanzil names no printed source: its file header says only "Source: Tanzil.net"; its change log shows the text was added on 4 June 2010 with one later fix (14 September 2010); its resources page lists the sites it collected translations from.
- The Tanzil wording matches the USC-MSA electronic Pickthall text (Project Gutenberg #16955, "Three Translations of The Koran side by side") almost word for word. That electronic text is an edited version of unidentified origin. It contains:
  - a mechanical replacement of Pickthall's word "God" by "Allah" that produced non-Islamic sense ("Your Allah is One Allah; there is no Allah save Him", 2:163; "Is there any Allah beside Allah?", 27:60–64);
  - "Owner" changed to "Master" (1:4), "Mecca" to "Makka", "God" to "deity" (2:255);
  - systematic rewordings: "ever" added to "Allah is ever Forgiving" and similar, "guardian/ally" for Pickthall's "friend", "prostrate" for "adore", tense and person brought closer to the Arabic, and longer rewrites (for example 3:161, 43:81, 76:19, 78:33);
  - transcription errors and dropped words (for example 5:44 "And My revelations for a little gain", 17:59 a clause missing, 42:47 "nor have a ye").
- **No printed edition with the digital text's wording was found.** Nine scanned printings were compared (below); all of them, including the 1948 and 1957 impressions and three later independent typesettings, read the 1930 wording. The earlier Phase 5 suggestion that the digital text follows "a later revised edition" is therefore withdrawn: the rewordings belong to the electronic text, not to an identifiable printed edition. A modern revision of Pickthall by Arafat El-Ashi (Amana, 1996) exists; it was not available to compare and its text is not used.

### Rights and attribution

- The 1930 translation is in the public domain: Pickthall died in 1936, so the term has ended in life+70 countries (Australia, the UK, the EU) and in Bangladesh (life+60); the 1930 US publication entered the US public domain on 1 January 2026.
- The rewordings in the electronic text are by an unidentified editor, so their status cannot be verified. Following the 1930 wording removes them from the app's text; what remains from the digital text is punctuation, capitals and modern spellings, which are not creative wording.
- Tanzil offers its translation files "for non-commercial purposes only" and asks for a link back when more than three translations are used. The app is free and non-commercial, uses one Tanzil translation and credits Tanzil. fawazahmed0/quran-api is under The Unlicense.
- Attribution used in the app: "English translation: Marmaduke Pickthall, The Meaning of the Glorious Koran (1930 first edition). Digital base text from Tanzil (tanzil.net) via fawazahmed0/quran-api, corrected to the 1930 wording."

### Witnesses (archive.org)

| Role | Identifier | Edition |
|---|---|---|
| 1930 copy | MN40248ucmf_9 | First edition, New York issue (Knopf), University of Chicago Library, microfilm |
| 1930 copy | dli.ministry.16944 | First edition, London issue (Allen & Unwin) |
| 1930 copy | dli.csl.3756 | First edition, London issue (Allen & Unwin) |
| comparison | dli.ministry.16945 | Second impression, 1948 (same typesetting) |
| comparison | in.ernet.dli.2015.125196 | Fourth impression, 1957 (same typesetting) |
| comparison | gloriousquran0000moha | IQRA International Educational Foundation, Chicago (later typesetting) |
| comparison | isbn_9798171511050 | Kitab Bhavan, New Delhi (later typesetting) |
| comparison | bwb_T4-AKE-381 | Later typesetting, publisher not identified in the scan |
| lineage | threetranslation16955gut | Project Gutenberg #16955 (USC-MSA electronic text) |

### Method

1. Every one of the 6,236 verses (current text) was aligned word by word with the OCR text of each of the three 1930 copies, with each verse placed between its neighbours so that similar verses elsewhere cannot be matched by mistake.
2. A difference was taken forward when at least two of the three 1930 copies show it at the same place. Running heads, footnotes, verse numbers and OCR misreadings were set aside after reading the copy's text.
3. Each difference was checked against the 1948 and 1957 impressions (same type) and the three later typesettings (independent type), and against the Gutenberg text (to see whether the digital wording comes from that lineage).
4. Passages interrupted by page breaks or footnotes, and every verse with more than a one-word change, were read in the copies directly and written out by hand. The results were aligned again against all three 1930 copies: no wording difference remains except the normalisation and the exceptions below.
5. Agreement between copies is not taken as proof on its own: two copies of one printing share that printing's misprints. Readings that are ungrammatical, duplicated or contradicted by Pickthall's own rendering elsewhere were treated as misprints of the 1930 printing and not reproduced (listed below).

### Results

| | Verses |
|---|---|
| Corrections from Phase 4 (round 1) | 91 — all retained; 7 extended with further 1930 wording in the same verse (2:125, 2:177, 2:196, 3:62, 6:19, 33:55, 59:22) |
| Corrections from Phase 5 (round 2) | 60 — all retained; 4:135 revised (it had kept the digital "(them" and added the 1930 "than", mixing the two texts; it now reads the 1930 "(than ye are)"); 5:55 and 41:25 extended |
| New corrections to the 1930 wording (round 3) | 242 |
| **Total verses corrected** | **393** (91 + 60 + 242); nothing reverted |
| The 185 differences escalated earlier in Phase 5 | 169 resolved to the 1930 wording; 7 kept as in the digital text because the 1930 reading is a misprint (3:147, 4:94, 5:67, 7:53, 17:33, 20:109, 45:8); 1 held for review (2:57); 8 were not real differences (OCR noise, footnotes or a verse matched to its neighbour: 2:19, 2:85, 16:14, 17:5, 17:77, 24:12, 28:72, 31:10); none left unresolved |
| Further differences found by the three-copy comparison | 83 verses beyond the escalated list (included in round 3) |

The Phase 4 restorations of "God" (70 verses), "Owner" (1:4) and "Mecca" (3 verses) are confirmed by all three 1930 copies, including the independent New York copy, and they restore the translator's wording. They also remove the electronic text's mechanical errors noted above. They are kept.

Round 3 by kind: "ever" not in 1930 (11 verses), "friend"/"helper" for "guardian"/"ally"/"supporter" (13), "adore" for "prostrate" (4), "Lo!"/"verily" placement (12), transcription errors or dropped words in the digital text (7: 2:102, 5:44, 17:59, 30:47, 42:47, 52:31, 103:2), other wording (205). Every entry in `en-corrections.json` gives the exact words changed.

### Normalisation kept separate from correction

- Spelling: the digital text's modern spellings are kept (judgment for judgement, steadfast for stedfast, mayst for mayest, no-one, any one/anyone, ill-deeds, therefore/therefor, hell-fire and similar). These are not wording changes.
- Punctuation and capitals follow the digital text, except inside changed wording, where the 1930 text was followed. Punctuation was not compared systematically, because OCR punctuation is unreliable.
- Pickthall's 1930 verse numbering differs from the Cairo numbering in a few surahs; the app keeps the standard numbering.

### Exceptions (the 1930 reading is not used)

| Verse | 1930 printing | Kept | Why |
|---|---|---|---|
| 2:129, 7:161, 71:17 | "the the" | single "the" | word printed twice |
| 3:147 | "make out foothold sure" | our | misprint |
| 4:94 | "Thou are not" | art | misprint |
| 5:67 | "thou will not" | wilt | misprint |
| 7:53 | "otherwise then" | than | misprint |
| 17:33 | "he will he helped" | be | misprint |
| 20:109 | "and whose He accepteth" | whose word | word missing |
| 45:8 | "revelations of Allah receive unto him" | recited | misprint |
| 2:57 | "We wronged them not" | they wronged Us not | reverses the Arabic; Pickthall renders the same words "They wronged Us not" in 7:160. **Held for review.** |
| 82:9 | "Nay, but they deny" | ye deny | the Arabic is second person. **Held for review.** |

### 1930 readings adopted but listed for review

These follow the 1930 wording (the edition policy), but a qualified reviewer should confirm them. Each has a `review` note in `en-corrections.json`.

- **Person or number differs from the Arabic** (8): 2:100, 3:163, 7:137, 10:83, 33:63, 43:32, 69:17; and 3:23, where 1930 omits "a portion of".
- **Interpretive renderings** (3): 3:161 (deceive / embezzle), 43:81 (negative / conditional reading), 78:33.
- **An element of the Arabic left untranslated in 1930** (13): 2:159, 3:144, 4:11, 5:19, 5:93, 6:12, 6:54, 7:89, 20:84, 36:65, 63:6, 66:5, 68:19. The electronic text had supplied these words. Following the 1930 edition consistently means these verses are, on these points, less complete than the digital text was. This is the main cost of the one-edition policy and should be weighed by the owner and a reviewer: the alternative is to add the missing words in square brackets as a marked editorial supplement, which would no longer be the 1930 text.

### Round 3 verses

2:39, 2:90, 2:100, 2:102, 2:106, 2:107, 2:116, 2:120, 2:159, 2:160, 2:180, 2:221, 2:249, 2:257, 2:283, 2:285, 3:15, 3:23, 3:68, 3:101, 3:107, 3:117, 3:121, 3:122, 3:144, 3:160, 3:161, 3:163, 4:11, 4:14, 4:16, 4:45, 4:55, 4:70, 4:80, 4:83, 4:84, 4:103, 4:127, 4:142, 4:149, 4:155, 4:157, 5:1, 5:2, 5:7, 5:15, 5:19, 5:22, 5:23, 5:44, 5:46, 5:56, 5:57, 5:60, 5:61, 5:93, 5:101, 5:108, 6:9, 6:12, 6:21, 6:39, 6:51, 6:54, 6:70, 6:72, 6:80, 6:93, 6:145, 6:157, 6:165, 7:7, 7:9, 7:10, 7:30, 7:35, 7:36, 7:50, 7:51, 7:52, 7:58, 7:84, 7:89, 7:130, 7:133, 7:137, 7:142, 7:148, 7:164, 7:174, 7:193, 7:197, 7:206, 8:2, 8:50, 8:61, 8:74, 9:24, 9:49, 9:63, 9:81, 9:102, 10:15, 10:59, 10:76, 10:83, 11:114, 12:23, 12:29, 12:39, 12:69, 12:70, 12:78, 12:90, 12:101, 13:41, 13:43, 14:22, 14:40, 15:33, 15:34, 15:38, 15:80, 15:97, 16:34, 16:102, 17:21, 17:59, 17:60, 17:85, 17:89, 18:7, 18:8, 18:37, 19:40, 20:10, 20:58, 20:72, 20:78, 20:84, 20:123, 20:130, 21:14, 21:44, 22:6, 22:71, 22:73, 23:34, 23:53, 23:73, 23:111, 24:18, 24:55, 25:8, 25:20, 25:60, 27:10, 28:79, 29:22, 29:25, 30:26, 30:27, 30:47, 31:7, 31:8, 33:5, 33:25, 33:27, 33:37, 33:40, 33:43, 33:50, 33:51, 33:52, 33:59, 33:63, 33:73, 34:2, 34:22, 34:33, 34:34, 34:41, 35:40, 36:7, 36:65, 38:8, 38:86, 39:12, 39:22, 39:39, 39:54, 39:68, 39:71, 40:15, 41:32, 41:33, 41:37, 41:42, 42:5, 42:47, 43:14, 43:32, 43:81, 43:88, 44:6, 44:51, 46:32, 49:17, 51:48, 52:31, 55:6, 55:31, 58:5, 58:11, 59:3, 60:1, 60:10, 61:4, 63:1, 63:6, 63:8, 63:11, 64:4, 64:8, 64:9, 66:5, 67:22, 68:19, 69:17, 70:40, 72:1, 73:20, 75:4, 76:5, 76:19, 78:33, 97:1, 97:5, 100:1, 101:9, 103:2.

Revised earlier entries: 2:125, 2:177, 2:196, 3:62, 4:135, 5:55, 6:19, 33:55, 41:25, 59:22.

## Policy

Corrections live in `data/quran/en-corrections.json`. Each entry keeps the exact Tanzil text it replaces, the corrected text, the reason (the words changed) and, for rounds 2 and 3, three checks. `tools/import-quran.mjs` applies them on every run and stops with an error if a source text no longer matches, so a future upstream change cannot be silently overwritten, and every change can be reverted by removing its entry and re-running the importer. The Arabic text, the Bangla translation, the Bangla short tafsir and all numbering are not touched.

## Phase 4 corrections (91 verses)

| Reason | Verses |
|---|---|
| translator's word God replaced by Allah | 70 |
| translator's spelling Mecca replaced by Makka | 3 |
| misplaced parenthesis | 3 |
| typo | 2 |
| closing quotation mark missing | 2 |
| duplicated word | 2 |
| translator's word Owner replaced by Master | 1 |
| translator's word God replaced by deity | 1 |
| question mark and closing quotation mark missing | 1 |
| words not in the translator's text | 1 |
| wrong word (changes meaning) | 1 |
| missing parenthesis | 1 |
| translator's parentheses missing | 1 |
| exclamation and closing quotation mark missing | 1 |
| capitalisation (translator writes God) | 1 |

Most corrections restore Pickthall's own word "God" where the digital text had replaced it with "Allah" (for example "there is no God save Him" in 2:255, "the God-fearing" in 2:66). Pickthall uses "Allah" for the divine name and "God"/"god" when translating *ilah*; the replacement changed the translator's wording, so it is treated as a transcription error, not an interpretive choice.

Corrected verses: 1:4, 2:66, 2:96, 2:125, 2:133, 2:158, 2:163, 2:177, 2:196, 2:201, 2:255, 3:6, 3:18, 3:62, 4:51, 4:87, 4:153, 4:171, 5:73, 5:107, 5:111, 6:19, 6:46, 6:102, 6:106, 7:59, 7:65, 7:73, 7:85, 7:158, 9:31, 9:129, 10:90, 11:14, 11:50, 11:61, 11:84, 12:22, 13:30, 14:52, 16:2, 16:22, 16:51, 17:40, 18:14, 18:110, 19:18, 20:8, 20:14, 20:98, 21:5, 21:25, 21:87, 21:108, 23:23, 23:32, 23:116, 24:12, 27:26, 27:45, 27:60, 27:61, 27:62, 27:63, 27:64, 28:70, 28:88, 29:46, 31:14, 33:55, 35:3, 36:12, 37:35, 38:5, 38:65, 39:6, 40:3, 40:62, 40:65, 41:6, 43:84, 44:8, 47:19, 59:22, 59:23, 64:13, 72:6, 73:9, 78:40, 79:24, 114:3.

The original Phase 4 method (trigram coverage against two copies, structural checks and an independent re-check of every change) is superseded by the three-copy word alignment above, which re-checked all 91 Phase 4 corrections.

## Phase 5 round 2 (60 verses)

**Method.** Every one of the 6,236 verses was aligned word by word with both 1930 OCR copies (dli.ministry.16944 and dli.csl.3756). A difference was taken forward only where **both** copies show the same 1930 wording at the same place (750 such differences in 651 verses, counted before excluding the Phase 4 changes). Each was then classified by hand:

1. **Corrected (60 verses)** - demonstrable transcription errors in the digital text: non-words (wiled, wordly, cam, poordue, fairseeming, hotfire), wrong letters or words (bode/bade, bought/brought, bear/beat, less/lest, ward/word, Ye/Yea, whoso/whose, their/there, food/blood in 22:37), transposed words (7:40, 12:31), a missing word (4:135 "than"), and wrong tense or number where the Arabic agrees with the 1930 wording (for example 2:23 witnesses, 18:31 thrones, 20:132 provide, 36:31 return, 54:29 called). Each correction records three checks in `data/quran/en-corrections.json`: (1) both 1930 witnesses read the corrected wording; (2) two independent translations (Yusuf Ali and Sahih International, used only for comparison, not copied) give the same meaning; (3) the Arabic word or the sentence's grammar. For the hyphenation fixes (poor-due, fair-seeming, hot fire) the checks are the 1930 spelling, the non-word in the digital text, and the spelling used elsewhere in the translation.

## What this audit does not cover

- A human proofread of the printed pages. The comparison is with OCR text from three scans; passages were read in the scan text where needed, not on page images.
- Review by a qualified scholar of the translation's meaning, including the verses listed for review above.
- Punctuation (see above).
- Surah names and headings, which are app metadata (`assets/quran-meta.js`), not Pickthall's text.

### Word help (separate from the translation)

`assets/glossary.js` explains older English words (hath, unto, lo, verily, ye, thee, -eth endings, bondmen, portents and others) with their modern meanings. It is shown under the English translation in the Verse for today card, and in the Qur'an reader when "Explain older English words" is switched on in Settings. It is labelled "Word help (not part of the translation)" and never changes the translation text.
