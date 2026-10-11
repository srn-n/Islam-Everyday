# Google Play survey: Islamic apps


> Historical note: this survey was written during Phase 1–2, when the app's working name was DinSathi. The app is now published as **Islam Everyday**; the findings are unchanged.
Surveyed on 11 October 2026 from the Australian Google Play store (English listings).

## Method

- Ran 11 Google Play searches: "islamic app", "islamic", "muslim prayer quran", "prayer times athan", "quran bangla", "bangla islamic app", "namaz shikkha", "dua azkar", "hadith", "muslim ramadan" and "qibla tasbih". Together they returned about 200 distinct apps.
- Opened the full store listings of 62 of those apps and recorded rating, installs, monetisation and the full description.
- Tagged features by matching keywords in each description. The tagging is approximate: an app may have a feature it doesn't mention.
- The sample leans Bangla on purpose (2 of the 11 searches), because DinSathi targets Bangla speakers.

## What the 62 apps offer

| Feature (mentioned in listing) | Apps | Share |
|---|---:|---:|
| Quran audio / reciters | 44 | 71% |
| Dua & adhkar library | 43 | 69% |
| Adhan alerts / notifications | 39 | 63% |
| Qibla compass | 35 | 56% |
| Hadith | 28 | 45% |
| Tasbih counter | 26 | 42% |
| Bookmarks | 26 | 42% |
| Ramadan features | 26 | 42% |
| Dark mode / themes | 25 | 40% |
| Hijri calendar | 24 | 39% |
| Transliteration / pronunciation | 23 | 37% |
| "Ad-free" as a selling point | 22 | 35% |
| Sehri / iftar / fasting times | 22 | 35% |
| Prayer tracker or streaks | 19 | 31% |
| Home-screen widgets | 18 | 29% |
| Works offline | 18 | 29% |
| 99 Names of Allah | 18 | 29% |
| Mosque finder | 18 | 29% |
| Adjustable font size | 17 | 27% |
| Tafsir | 15 | 24% |
| Khatm / reading goals | 15 | 24% |
| Memorisation (hifz) | 14 | 23% |
| Zakat calculator | 13 | 21% |
| Privacy messaging | 13 | 21% |
| Word-by-word Quran | 11 | 18% |
| Learn-to-pray guide | 9 | 15% |
| Tajweed | 8 | 13% |
| AI assistant | 5 | 8% |
| Forbidden prayer times | 2 | 3% |

On monetisation, 18 of the 62 apps show ads and 33 sell in-app purchases or subscriptions.

## What we took from it

1. **No ads, no tracking.** The best-rated large apps make this their main promise: the Greentech apps at 4.9, Sajda ("ad-free since day one") and Pillars. Muslim Pro has the most installs (100M+) but rates 3.5, and its listing shows ads plus a subscription. DinSathi has no ads and keeps all data on the device.
2. **Bangla pronunciation (উচ্চারণ).** Bangla users expect the Arabic written phonetically in Bangla script. *Bangla Quran উচ্চারণসহ* has 5M+ installs on that alone. DinSathi now shows Bangla pronunciation for the duas, dhikr, the 13 translated surahs and the 99 Names. Latin transliteration appears in English mode, and a switch hides both.
3. **Bangladesh-style prayer details.** We added:
   - Sehri and iftar times.
   - Forbidden prayer times. Only 2 of the 62 apps list these, which makes them a differentiator.
   - Ishraq/Duha, Islamic midnight and Tahajjud times.
   - A Hijri date adjustment of ±2 days for local moon sighting.
   - Karachi method with Hanafi Asr as the default for Bangladeshi cities.
4. **Prayer tracker with streaks.** This is the habit loop in Pillars, Sajda, Muslim Pro and Deen. DinSathi has a 7-day grid and a streak count.
5. **Utility hub.** Muslim Bangla, Deen and Islamic Calendar all bundle a Hijri calendar, the 99 Names and a zakat calculator. DinSathi puts these under More.
6. **Reading comfort.** Font size, dark mode, last-read position, bookmarks, copying an ayah or dua, and khatm progress.
7. **Offline install.** Widgets need a native app, but the PWA installs to the home screen and works offline after the first load.

## What we deliberately left out

- **Feeds, quizzes with prizes, marketplaces, matrimony and live streams.** They add noise, and a prototype can't moderate them.
- **AI Q&A.** It needs a vetted source corpus, a backend and scholarly review before it's responsible to ship.
- **Adhan notifications.** The web can't reliably schedule them. They're the first item for a native wrapper (Capacitor).

## The 62 listings studied

Monetisation is what the listing shows: "Ads" means it contains ads, and "IAP" means it offers in-app purchases or subscriptions.

| # | App | Developer | Rating | Installs | Monetisation | Focus |
|---:|---|---|---:|---:|---|---|
| 1 | Muslim Pro | Bitsmedia | 3.5 | 100M+ | Ads, IAP | All-in-one |
| 2 | Athan: Prayer Times, Dua-Azkar | IslamicFinder.org | 4.9 | 10M+ | Ads, IAP | Prayer times |
| 3 | Sadiq: Excellence in Islam | Greentech Apps Foundation | 4.9 | 500K+ | None listed | All-in-one, forbidden times |
| 4 | Pillars: Prayer Times & Qibla | Pillars | 4.6 | 500K+ | None listed | Prayer, tracker, privacy |
| 5 | iPray: Prayer Times & Qibla | Beehive Innovation FZE | 4.6 | 1M+ | None listed | Prayer times |
| 6 | Sajda: Prayer Times, Quran | GOOD/APP | 4.7 | 10M+ | IAP | Prayer and Quran, ad-free |
| 7 | Salatuk (Prayer time) | Masarat App | 4.7 | 50M+ | None listed | Prayer times |
| 8 | Prayer Now | App Rocks | 4.6 | 10M+ | Ads, IAP | Prayer times |
| 9 | MAWAQIT | MAWAQIT | 4.8 | 5M+ | None listed | Mosque-linked times |
| 10 | Prayer Times - Qibla & Namaz | Dawat-e-Islami | 4.8 | 5M+ | None listed | Prayer times |
| 11 | Everyday Muslim | UMRA TECH LLC | 4.9 | 100K+ | IAP | All-in-one |
| 12 | My Islam: Quran, Prayer & Dua | My Islam Inc. | 4.9 | 100K+ | IAP | Quran study |
| 13 | Muslims Day | Kahf | 4.9 | 5M+ | Ads, IAP | All-in-one, Bangla |
| 14 | Deen - Quran, Hadith, Duas | Deen (non-profit) | 4.9 | 1M+ | None listed | All-in-one |
| 15 | Deen - Islamic App | Mahedi Hasan | 4.9 | 500K+ | None listed | All-in-one, Bangla, forbidden times |
| 16 | Islam360 | Islam360 Foundation Trust | 4.7 | 10M+ | Ads, IAP | Quran and hadith |
| 17 | Muslimeen | Fortune Future Apps | 4.8 | 100K+ | None listed | Prayer, tracker |
| 18 | Huda - Prayer Times, Al-Quran | MRM Digital | 4.6 | 100K+ | Ads, IAP | All-in-one |
| 19 | Simple Islam | ThrWorks | 4.4 | 10K+ | None listed | All-in-one |
| 20 | Prayer Times - Qibla & Salah | ZeeDev Islam | 4.9 | 1M+ | Ads, IAP | Prayer, widgets |
| 21 | Prayer Times and Qibla | zero_ | 4.9 | 1M+ | IAP | Prayer times |
| 22 | Athan Pro | Quanticapps | 4.5 | 1M+ | Ads, IAP | Prayer times |
| 23 | Azan Time Pro | Deen Studios | 4.7 | 10M+ | Ads, IAP | Prayer times |
| 24 | Prayer Times, Azan, Qibla | Kodelokus | 4.8 | 5M+ | Ads, IAP | Prayer times |
| 25 | Athan+ | Masjidal | 4.6 | 100K+ | None listed | Mosque-linked times |
| 26 | Niyat: Dua, Quran & Prayer | Aldric Studio | 4.8 | 5K+ | IAP | All-in-one, AI Q&A |
| 27 | Maarifa: AI Islam Prayer Quran | Relentless Studio | 5.0 | 50K+ | IAP | AI assistant |
| 28 | Muslim Tracker: Pray & Fasting | Deen IndieTech | 4.5 | 10K+ | IAP | Prayer and fasting tracker |
| 29 | Quran for Android | quran.com | 4.7 | 50M+ | None listed | Quran reader |
| 30 | Al Quran (Tafsir & by Word) | Greentech Apps Foundation | 4.9 | 10M+ | None listed | Quran study |
| 31 | Quran Majeed | Pakdata | 4.7 | 10M+ | Ads, IAP | Quran |
| 32 | Tarteel: AI Quran Memorization | Tarteel Inc. | 4.6 | 10M+ | IAP | Memorisation, AI |
| 33 | Quran by Quranly | Quranly | 4.6 | 1M+ | IAP | Reading habit |
| 34 | Quran Pro | Quanticapps | 4.6 | 1M+ | Ads, IAP | Quran |
| 35 | Quran Majeed (IRD) | IRD Foundation | 4.9 | 1M+ | None listed | Quran, Bangla |
| 36 | Al QURAN | 9D Muslim Apps | 4.8 | 50M+ | IAP | Quran |
| 37 | AL Siraat: Learn Quran & Qaida | Darwin Technology | 4.9 | 1M+ | IAP | Learning to read Quran |
| 38 | Dhikr & Dua | Life With Allah | 5.0 | 1M+ | None listed | Dhikr and duas |
| 39 | Dua & Azkar | Dua and Adhkar Team | 4.9 | 1M+ | None listed | Duas |
| 40 | Dua & Zikr (Hisnul Muslim) | Greentech Apps Foundation | 4.8 | 500K+ | None listed | Duas |
| 41 | Hisnul Muslim | admads.com | 4.9 | 1M+ | None listed | Duas |
| 42 | Dua & Ruqyah (Hisnul Muslim) | IRD Foundation | 4.9 | 500K+ | None listed | Duas, Bangla |
| 43 | Hadith Collection (All in one) | Greentech Apps Foundation | 4.9 | 1M+ | None listed | Hadith |
| 44 | Al Hadith: Hadith Collection | IRD Foundation | 4.9 | 1M+ | None listed | Hadith, Bangla |
| 45 | IslamOne - Quran & Hadith | UsmanPervez | 4.8 | 1M+ | None listed | Quran and hadith |
| 46 | Muslim Bangla Quran Hadith Dua | TopOfStack Software | 5.0 | 5M+ | Ads, IAP | Bangla all-in-one |
| 47 | Bangla Quran উচ্চারণসহ | kutblog | 4.8 | 5M+ | Ads, IAP | Bangla Quran with pronunciation |
| 48 | Deen - Quran, Hadith & Prayer | Maverick Enterprise | 4.4 | 500K+ | IAP | Bangla all-in-one |
| 49 | Deen Islamic Quran Hadith Dua | Nagorik | 4.4 | 100K+ | IAP | Bangla all-in-one |
| 50 | দোআ ও যিকির (হিসনুল মুসলিম) | Greentech Apps Foundation | 4.9 | 1M+ | None listed | Bangla duas |
| 51 | অর্থপূর্ণ নামায (সালাত) | Greentech Apps Foundation | 4.9 | 100K+ | None listed | Bangla salah meanings |
| 52 | তাফহীমুল কুরআন | Bismillah Androids | 4.9 | 1M+ | None listed | Bangla tafsir |
| 53 | Namaj Shikkha | iT Solution | 4.9 | 1M+ | Ads, IAP | Bangla prayer learning |
| 54 | Rushd - Bangla Quran Offline | ONEST TECH | – | 100+ | None listed | Bangla all-in-one (new) |
| 55 | Al-Quran আল কুরআন | Technobd Limited | 4.8 | 1M+ | None listed | Bangla Quran |
| 56 | বাংলা হাদিস | Bangla Hadith | 4.4 | 50K+ | None listed | Bangla hadith |
| 57 | Daily Islam | Daily Islam | 5.0 | 500K+ | None listed | Bangla daily content |
| 58 | Tasbih Counter | Fortune Future Apps | 4.9 | 1M+ | Ads, IAP | Tasbih |
| 59 | Tasbih | TopOfStack Software | 5.0 | 500K+ | Ads, IAP | Tasbih, Bangla |
| 60 | Athan Academy | IslamicFinder.org | 4.9 | 100K+ | IAP | Learning |
| 61 | Islamic Calendar & Prayer Time | ImranQureshi.com | 4.6 | 1M+ | Ads, IAP | Calendar |
| 62 | Miraj: Quran & Islamic Games | Sidra Media | 4.7 | 100K+ | IAP | Kids |
