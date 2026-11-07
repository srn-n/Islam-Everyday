# Google Play: release checklist (Islam Everyday 1.0.0)

## Before the first upload
- [ ] Back up `keys/` to two places (README).
- [ ] Build: `build-release.cmd` → `IslamEveryday-1.0.0.aab`.
- [ ] Test on a real phone (Android Studio → Run): first open, Back from every section, Back on Today and reopen, light and dark mode, "My location", share an image, Feedback opens the mail app.

## Play Console: create the app
- App name: **Islam Everyday** · Default language: English (Australia or UK) · App, Free.
- Package: `com.simplymadestudio.islameveryday` (from the bundle).
- Play App Signing: keep it on.
- **New personal developer accounts** must run a closed test with at least 12 testers opted in for 14 days in a row before production access. Start the closed test as soon as the first bundle is uploaded. (Organisation accounts are exempt.)

## Store listing
- Short description (80 max):
  `Prayer times, Qur'an in English & Bangla, duas, Hijri calendar. Private, offline.`
- Full description: start from the website's About page; say plainly: no account, no ads, no tracking, works offline.
- App icon 512×512: `play/icon-512.png` · Feature graphic 1024×500: `play/feature-graphic-1024x500.png`.
- Phone screenshots: at least 2 (Today, Qur'an study, Duas, Calendar). Take them from the app on a phone.
- Category: Lifestyle (or Books & Reference). Contact email: required by Play for the listing only (it is shown on the store page, not in the app); use the studio address you want public.
- Privacy policy URL: `https://islam-everyday.vercel.app/#more/privacy`

## App content
- Ads: **No ads**.
- Data safety: **No data collected, no data shared.** The app makes no network requests; settings, tracker history and the
  optional location stay on the phone (location is used only to calculate prayer times, on the device). Feedback opens the
  person's own mail app. Encryption in transit: not applicable. Account deletion: not applicable (no accounts).
- Permissions declared: Location (coarse/fine, only when "My location" is tapped). No background location.
- Content rating questionnaire: Reference/Education-type content, no violence, no user interaction or sharing between users, no purchases → expect "Everyone"/PEGI 3.
- Target audience: 13+ is simplest (avoids the Families programme rules); choose under-13 only if you intend children as a main audience.
- Government app: No. Financial features: None. Health: None. News: No.

## Every update
- [ ] Raise `versionCode` (and `versionName`) in `android/app/build.gradle`.
- [ ] `build-release.cmd`, upload the new `.aab`.
- [ ] Keep target SDK at Play's yearly minimum (36 for 2026; Google announces the next one each spring).
