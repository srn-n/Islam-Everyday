# Islam Everyday — Phase 4

Phase 4 is the final web-app polish and release-preparation pass before the owner's first commit and GitHub upload. The public application name is **Islam Everyday**; `DinSathi-Web` is the current project folder name. This brief is for the implementation agent. The owner will make the first Git commit and publish the web project.

## Design research and proposed logo

I reviewed more than 30 Islamic app icon examples across prayer, Qur'an, daily companion, Hijri calendar, and Names of Allah apps. Common patterns included green/teal and gold palettes, crescents, mosque silhouettes, Qur'an imagery, Arabic calligraphy, Kaaba symbols, and prayer figures. These are recognizable, but many icons use the same few symbols. The proposed Islam Everyday mark uses a simpler, more distinctive idea tied to the existing app: a **mihrab-shaped open doorway framing a sunrise, with a restrained arc suggesting the daily prayer cycle**. Use deep teal, evergreen, soft gold, and cream. Avoid text inside the icon, ornate motifs, and copying any listed app's composition.

The generated visual concept is saved at `brand/islam-everyday-icon-concept.png`. Treat it as creative direction, not a final production asset: redraw a clean scalable master mark in SVG, then export the required PWA and app icon sizes. Keep the app name as a separate text wordmark.

Representative icon references reviewed:

- [MyAdhan app icon and product site](https://myadhanapp.com/)
- [Qur'an app listing on Apple's App Store](https://apps.apple.com/us/app/%D8%AA%D8%B7%D8%A8%D9%8A%D9%82-%D8%A7%D9%84%D9%82%D8%B1%D8%A2%D9%86-%D8%A7%D9%84%D9%83%D8%B1%D9%8A%D9%85/id385990290)
- [Salatuk app listing](https://apps.apple.com/iq/app/salatuk-%D8%B5%D9%84%D8%A7%D8%AA%D9%83/id686077611)
- [Step By Step Salat app listing](https://apps.apple.com/us/app/step-by-step-salat/id566539691)
- [99 Names of Allah app listing](https://apps.apple.com/mr/app/99-names-of-allah/id1317625776)
- [Salah Prayer Reminder Tracker listing](https://apps.apple.com/au/app/salah-prayer-reminder-tracker/id6762531410)
- [Hijri calendar app icon reference](https://app.smartassistants.org/index.php)

## Phase 4 scope

1. Rebrand every public-facing surface to **Islam Everyday**, including web title, visible wordmark, PWA manifest, install metadata, icons, README, and archive name. Keep the existing folder/repository name unless the owner separately asks to rename it.
2. Create and integrate an original app logo based on the attached concept. Provide a scalable SVG master and all required PWA/icon outputs, including standard and maskable variants. Keep the icon readable at small sizes and ensure the safe-area composition works when platforms apply their own rounded masks.
3. Add a simple Prayer Guide in the existing More/sections navigation. Clearly explain the rakah for Fajr, Dhuhr, Asr, Maghrib, and Isha, identifying fard, sunnah mu'akkadah, other sunnah/nafl, and Witr. Explain each label and show when rakah are prayed. Make school-specific differences clear and source the guidance; do not present disputed classifications as universal.
4. Refine motion so cards/interactive sections respond with a small lift or emphasis on hover and keyboard focus. Keep the interface calm, quick, and easy to use. Respect reduced-motion settings and do not rely on hover on touch screens.
5. Simplify the 99 Names verification/review wording. Remove repeated global warning banners from the sidebar/list/dialog header. Put accurate, entry-specific source and review information at the end of each name explanation. Never claim “globally verified”; explain when a particular explanation has not had independent qualified-scholar review, and cite the sources actually used.
6. Audit and finish any Phase 3 gaps found in the actual checkout, especially the nine Names reported as incomplete. Do not invent material or pad citations. Every entry must contain useful, nonblank content and transparent source/review status. Keep the app simple and avoid adding unrelated features.
7. Perform release-readiness checks, fix issues found, document the result, and create one complete, publish-ready ZIP of the web project. The owner will make the first commit and upload it to GitHub, so do not create a commit, push, or publish on the owner's behalf.

## Detailed implementation prompt for Claude

```text
Implement Phase 4 for the Islam Everyday web application in this project. Do the work in the existing project checkout; do not stop after making a plan. First inspect the actual current files, the root AGENTS.md, README, CHANGELOG, PHASE3.md, package scripts, app assets, service worker, and the Phase 3 report provided by the owner. The report is a handoff summary, not proof that its changes are present: verify every feature in the checkout before relying on it. The root instructions say synced files under `sources/` are read-only. Never edit, rename, move, or delete anything in `sources/`. Keep work within the existing `DinSathi-Web` project folder unless the owner explicitly requests otherwise.

GOAL
Prepare a finished, simple, coherent Islam Everyday web app for the owner's first Git commit and GitHub upload. This is the final web release-preparation pass. The owner may work on a native app in a later phase; do not start a native-app conversion now. Keep existing working app features and the local-only/offline privacy model. Do not add accounts, analytics, runtime data services, or unrelated features.

BRAND AND LOGO
- The public application name is exactly “Islam Everyday”. Update public-facing branding consistently: HTML document title, header/wordmark, PWA manifest name and short_name, install metadata, README user-facing references, and any visible about/help text. Check browser tabs, install prompts, and app shortcuts. Keep `DinSathi-Web` as the existing folder/repository name and preserve historical/source attribution where appropriate.
- Use `brand/islam-everyday-icon-concept.png` as design direction. The concept is a symmetrical mihrab-like open doorway framing a rising gold sun, with a restrained curved prayer-time arc; deep teal/evergreen, soft gold, and cream. It is an original direction inspired by the visual field, not an asset to copy pixel-for-pixel if a cleaner vector treatment is needed.
- The owner reviewed 30+ Islamic app icon examples. Common visual conventions included green/teal, gold, crescent moons, mosque silhouettes, Qur'an books/calligraphy, Kaaba symbols, and prayer figures. Make Islam Everyday recognizable without tracing, reusing, or closely imitating another app's icon. Avoid text and Arabic calligraphy in the icon so it remains clear at small sizes and avoids malformed generated lettering. Use the wordmark separately in the interface.
- Create a clean, editable SVG master logo with deliberate geometry, then generate the full required PNG/icon assets from it. Include at least 192px, 512px, Apple touch icon, favicon, and maskable 512px outputs as appropriate for the existing PWA. Confirm transparency/background choices, padding, contrast, crispness, and platform safe areas. Replace old brand icon references consistently and update service-worker asset precache/cache versioning so installed copies receive the new assets. Do not leave the concept image as the only icon implementation.
- Keep license/ownership notes for generated and hand-authored brand assets in the documentation if needed. Do not use an existing competitor logo or store artwork as a source asset.

PRAYER GUIDE
- Add “Prayer guide” to the existing More/sections navigation in both English and Bangla. Follow the current routing, responsive layout, and accessibility patterns.
- Provide a clear guide for the five daily prayers: Fajr, Dhuhr, Asr, Maghrib, and Isha. For each prayer, show the obligatory fard rakah count, commonly prayed sunnah rakah before/after, other voluntary/nafl units where well-established, and Witr where relevant. Make clear which units are obligatory and which are voluntary. Show their order around the fard prayer.
- Explain terms such as rakah, fard, sunnah mu'akkadah, other sunnah/nafl, and Witr in plain English and Bangla. Use short explanations and progressive disclosure so beginners can learn without overwhelming the page.
- Prayer details can vary by madhhab and scholarly view. Cite reliable recognized sources for each classification and distinguish broadly shared practice from school-specific differences. Be especially precise about Witr's status and counts; identify Hanafi-specific wajib wording and other recognized classifications instead of flattening differences. Do not state one school's view as universal.
- Clearly label the guide as educational, not a personal fatwa. Do not invent rewards, rulings, or hadith. Provide a sources/review note at the end of each relevant explanation. Mark any item not independently reviewed by a qualified scholar with a concise, accurate status.
- Keep the feature easy to scan: one summary table/list for the five prayers plus optional detail text. Work on mobile and desktop, with text that wraps cleanly in Bangla and English.

99 NAMES: ENTRY-LEVEL SOURCING AND REVIEW
- Remove repeated collection-wide “awaiting scholar review” banners from the sidebar/left navigation, names list, and every dialog header. Do not imply the collection is globally verified.
- Keep the name meanings and explanations readable. At the end of each individual name's explanation, show the actual citations used and a precise review-status sentence. Examples of acceptable status language: “This explanation has not yet been independently reviewed by a qualified scholar” or “No reliable scholarly explanation was located for this entry; review is needed.” Localize this in Bangla too. Only use an “unreviewed” status where accurate.
- There is no single global authority that verifies every explanation; do not write “not verified globally” as though such a registry exists. Describe the specific limitation and cite sources for factual claims. Separate Qur'an/hadith evidence, scholarly commentary, and reflection.
- Review all 99 entries for completeness, empty fields, source links, and consistency. The Phase 3 report says nine entries lacked a sourced scholarly explanation: al-Khafid, al-Jalil, al-Wajid, al-Majid (ماجد), al-Muqaddim, al-Mu'akhkhir, al-Mani', ar-Rashid, and as-Sabur. Check whether this is still true. Research and complete an entry only when reliable sources support it. If evidence is uncertain or unavailable, retain a useful nonblank entry with a clearly explained, entry-specific review status rather than inventing a story or claim.
- Do not fabricate narrations, stories, special virtues, or promised outcomes; do not pad source counts with duplicates. Preserve scholarly disagreements accurately. A source citation supports the claim it actually makes; it does not automatically mean a scholar endorsed the app's whole explanation.
- Preserve the structured data model, stable IDs, safe text rendering, bilingual content, keyboard-accessible dialogs, search, and previous/next navigation. Update tests to check every name has nonblank localized content, resolvable citations where claimed, and a review status.

ANIMATION AND INTERACTION POLISH
- Add restrained feedback when a pointer hovers over interactive cards/tiles and relevant Today sections: a small upward lift (about 2–3px), gentle shadow/color emphasis, and a short transition. Keep the existing visual style and do not make the UI feel like a game.
- Match keyboard focus-visible feedback to hover so keyboard users receive the same clear affordance. Keep press/tap feedback brief. Avoid animating large content blocks or causing layout shift.
- Apply hover-only effects inside a `(hover: hover) and (pointer: fine)` media query. Touch devices should use active/tap feedback and must not retain sticky hover states.
- Respect `prefers-reduced-motion: reduce`; remove transforms and shorten/disable transitions when requested. Check contrast, focus visibility, and motion at the supported breakpoints. Do not animate continuously or on every rerender.

FINAL AUDIT AND RELEASE FILES
- First establish whether the Phase 3 implementation described by the report is actually present. The report states that `npm test` passed 29 tests and that Playwright checked phone/desktop, themes, languages, full translation coverage, and offline behavior. Re-run the current checkout's available checks; never repeat these as verified unless you run them here. If core Phase 3 files/features are missing, report the mismatch and complete only work supported by the available source data.
- Check every navigation item, section, language string, detail/dialog, prayer guide source link, manifest icon path, service-worker cache entry, offline route, image, and install metadata. Search for visible old app-name strings and stale icon references. Remove dead/duplicate assets only after confirming they are unused.
- Check for unfinished placeholders, blank labels/cards, TODO/FIXME markers that should not ship, missing citation links, broken internal paths, console errors, failed network requests, and malformed/nonlocalized content. Do not remove legitimate historical attribution or leave blank sections. Every required user-facing route must either contain finished content or an intentional, clearly explained unavailable state.
- Keep external network use at build/research time only; runtime app data must remain local/offline. Verify the project's translation licenses and attribution text remain included. Do not bundle any source whose redistribution terms are unclear.
- Update README, CHANGELOG, and any in-app About/review notes with the Islam Everyday brand, Prayer Guide behavior, new logo assets, precise 99 Names review policy, checks actually run, and remaining release limitations. Keep the documentation complete and remove stale instructions. Do not claim scholar approval that did not occur.
- Prepare exactly one final ZIP archive of the complete web project, with a clear name such as `Islam-Everyday-Web-1.0.0.zip`. Include all source code, app/data assets, icons, licenses/attributions, documentation, package.json, package-lock.json, and scripts needed to run and maintain the web app. Exclude `.git`, `node_modules`, local secrets, caches, temporary screenshots, and test artifacts unless a specific artifact is required by the app. Confirm the archive extracts cleanly, contains no missing required files, and can be started using the documented npm command. Include a README at the archive root. Do not leave placeholder files or blank required sections.
- Do not make a Git commit, push, or publish/deploy. The owner will make the first commit and upload to GitHub.
- Finish by reporting: brand/logo files created; Prayer Guide content and sources; 99-name completion and entry-specific review gaps; exact checks run with results; archive path and contents; and anything that still blocks public release. Be honest about any item not independently verified.

Start now by inspecting the actual checkout, then implement, check, fix, document, and package the finished web project.
```
