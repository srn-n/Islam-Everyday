You are working in the DinSathi-Web project. Implement Phase 3 fully and leave the project in a coherent, reviewable state. Start by reading the root AGENTS.md, DinSathi-Web/README.md, DinSathi-Web/CHANGELOG.md, and the relevant app, data, and style files. The root instructions say files under `sources/` are read-only reference material; never edit, rename, move, or delete them. Keep all Phase 3 work inside `DinSathi-Web`.

## Project context

- DinSathi is a static, browser-only, offline-capable Muslim companion app with English and Bangla UI.
- It has no build step or `package.json`. Its `package-lock.json` is empty, and the README currently recommends Python’s HTTP server.
- It includes prayer calculations, a prayer tracker, Arabic Qur’an data, a limited short-surah set for Verse for today, a 99 Names list, and a Hijri calendar.
- Preserve local-only storage, the no-account privacy model, and offline behavior. Do not add analytics, remote APIs, or accounts.
- Keep the app static. Do not add a framework or build pipeline without a concrete need.

## Work plan

1. Inspect the app structure, data shapes, routing/dialog patterns, service worker, and responsive layouts.
2. Add the local npm workflow and meaningful checks.
3. Implement the Today page and calendar improvements.
4. Implement full Qur’an translations and full-corpus Verse for today behavior, subject to licensing and source availability.
5. Implement the interactive 99 Names detail experience and sourced content.
6. Update documentation, audit completeness, run checks, and report blockers honestly.

## 1. Local development and checks

- Add a small `package.json` with one primary command to start the static app and one `npm test` command.
- Keep it lightweight. Prefer Node’s built-in capabilities or a single small development dependency. Do not add a bundler or framework just to serve files.
- Use one predictable default port and document the exact start command and URL. Explain how to change the port if needed, and how to avoid keeping multiple localhost versions running.
- Make `npm test` repeatable and useful. It should fail on missing or malformed data and check at least: all 114 surahs, ayah counts and alignment, English and Bangla translation coverage if claimed complete, all 99 names and their required localized details and sources, citation references, and relevant script/data parsing.
- Do not leave a long-running server behind after checks.
- Update `package-lock.json` consistently and replace the README’s Python-only instructions with the recommended npm workflow.

## 2. Today page and calendar

On both phone and desktop, use this visual order:

**Prayer hero/diagram → prayer times → Verse for today → prayer tracker → forbidden prayer times (with optional prayer times) → Hijri calendar tile → fasting times.**

Fasting times must be last. Update both markup and desktop grid placement so the visual order matches. Keep spacing and widths balanced across screen sizes.

Keep the “Forbidden times for prayer” heading bold, but render the three window labels and their time ranges in regular weight. Preserve the current-window indicator and its accessible meaning.

Make the Surah name and ayah reference in the Verse for today footer green with enough contrast in both themes. Replace the decorative Bangla display font with a simple, readable Bangla font. Check actual Bangla glyphs, conjuncts, and vowel marks at normal and small sizes; preserve Arabic typography and provide suitable fallbacks.

Review the full Hijri calendar page on phone and desktop. Improve sizing, spacing, hierarchy, and date legibility while preserving month navigation, event and white-day indicators, and localization.

Preserve keyboard access, focus styles, semantic headings, screen-reader labels, reduced-motion support, dark mode, and English/Bangla switching.

## 3. Qur’an translations and Verse for today

- Provide English and Bangla translations for every ayah in all 114 surahs, aligned to the existing Arabic text and numbering. The project identifies the Arabic corpus as 6,236 ayat; validate the actual data and count.
- Use established translations only when their redistribution license permits bundling. Verify the source, translator, edition, license, attribution requirements, and notices. Store this metadata with the translation data and document it.
- Do not scrape copyrighted translations, create a replacement translation, or present machine-generated paraphrases as authoritative translations.
- Keep translation data local so it works offline. Do not fetch translations from a runtime API.
- Extend the Qur’an reader to show the selected language’s translation for every ayah. Preserve Arabic, bookmarks, continue-reading, and existing controls.
- Verse for today must select from the complete Qur’an over time, not just the current short-surah starter set or a handpicked set of famous or short ayat. Use deterministic date-based selection so refreshing on the same app day does not change the verse. Define and document the day boundary. Ensure long verses are included and never silently truncated.
- If a redistributable translation cannot be obtained, do not claim full coverage or fill gaps with invented text. Complete unblocked work, provide a machine-checkable coverage report, and state the exact licensing or content blocker.

## 4. Interactive 99 Names of Allah

- Keep all 99 names searchable and localized. Make each card keyboard-operable and selectable. Open an accessible, responsive detail view using the app’s existing sheet/dialog pattern, with a clear close action and focus handling.
- Include the Arabic name, transliteration, concise English and Bangla meanings, a sourced explanation, and a careful reflection on how the name may inform dua, worship, or daily conduct.
- Consult several hundred distinct trustworthy sources across the collection, targeting at least 200. Prioritize the Qur’an, sound hadith, recognized tafsir, and reputable scholarly works.
- Cite sources for each entry and connect factual or theological claims to their sources. Provide enough detail to locate each source, such as title/author, passage or hadith identifier, and stable URL or publication details where available.
- Do not invent stories, hadith, historical anecdotes, virtues, or attributions. Do not pad the source count with duplicates or low-quality sites. Distinguish textual evidence, scholarly explanation, and personal reflection. Mark genuine scholarly disagreement.
- Store content and source metadata as structured local data with stable IDs and validation. Display references clearly.
- Mark the collection as awaiting qualified-scholar review before public release. Do not call it scholar-approved unless a documented review has occurred.
- If research cannot be completed reliably for all names, do not invent or pad. Finish the UI and supported entries, mark incomplete entries explicitly, and report exact coverage. Do not claim completion until all 99 entries have localized content and sources.

## 5. Documentation and completion

- Update `README.md` with the npm workflow, content behavior, translation credits/licenses, and remaining limitations.
- Add a Phase 3 entry to `CHANGELOG.md` describing only delivered changes, sources/licenses, checks run, and remaining work.
- Keep `PHASE3.md` as the record of scope.
- Run `npm test` and other available checks. Report exact results. Do not claim visual checks unless you actually inspect phone and desktop layouts in both themes and languages.
- Check for console errors, broken navigation, missing assets, translation/reference mismatches, and offline regressions where practical. Fix discovered issues before finishing.
- In your final report, summarize changes, list checks and results, state translation coverage and licensing, report how many names and distinct sources are complete, and identify any remaining scholar-review or source blockers. Never overstate completeness.

Begin implementation now. Do not stop after producing a plan; make the changes and report concrete progress or blockers.