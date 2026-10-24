/* Islam Everyday — Daily Ayah: a reviewed 180-day schedule (Phase 5).
 *
 * Replaces the earlier whole-Qur'an rotation. Each entry names a passage by surah and verse range; the Arabic text,
 * the English (Pickthall) and Bangla (Zakaria) translations and the Bangla short tafsir are read from the app's own
 * data/quran files for those verses, so there is one copy of every text.
 *
 * Day rule (documented and tested):
 *   day number  = whole days from the ANCHOR date (2026-01-01) to the selected city's local calendar date
 *   cycle index = ((day number mod 180) + 180) mod 180          (dates before the anchor wrap the same way)
 *   entry       = SCHEDULE[cycle index]                          (index 0 = Day 1, index 179 = Day 180)
 * The calculation uses calendar dates only (Y-M-D, via Date.UTC), never the device clock's time zone, so the same
 * local date always gives the same entry, and day 181 is Day 1 again. There is no random choice.
 *
 * Review: every entry is "checked": the verse range was read in full with the verses before it and the
 * Al-Mukhtasar Bangla tafsir (QuranEnc, v1.0.0); where the passage addresses a particular person or depends on
 * its setting, a short context note (ctx) is shown, labelled as an editorial note. "checked" does not mean
 * reviewed by a scholar. why: the editorial reason for choosing it (not shown in the app).
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.DINSATHI_VOTD = api;
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";
  const ANCHOR = [2026, 1, 1], CYCLE = 180;
  const THEMES = [{"id": "hope", "en": "Hope and mercy", "bn": "আশা ও রহমত", "from": 1, "to": 30}, {"id": "patience", "en": "Patience, trust and gratitude", "bn": "ধৈর্য, ভরসা ও কৃতজ্ঞতা", "from": 31, "to": 60}, {"id": "prayer", "en": "Prayer, remembrance and repentance", "bn": "নামাজ, যিকির ও তাওবা", "from": 61, "to": 90}, {"id": "character", "en": "Character, kindness and justice", "bn": "চরিত্র, সদাচরণ ও ন্যায়", "from": 91, "to": 120}, {"id": "knowledge", "en": "Knowledge, reflection and growth", "bn": "জ্ঞান, চিন্তা ও আত্মোন্নয়ন", "from": 121, "to": 150}, {"id": "purpose", "en": "Purpose, the Hereafter and renewal", "bn": "জীবনের উদ্দেশ্য, আখিরাত ও নবায়ন", "from": 151, "to": 180}];
  const SCHEDULE = [
 {
  "seq": 1,
  "id": "d001",
  "s": 39,
  "surah": "Az-Zumar",
  "a": 53,
  "b": 53,
  "theme": "hope",
  "why": "Allah's mercy is greater than any sin; a call not to despair.",
  "ctx": {
   "en": "“Say” is addressed to the Prophet ﷺ, and the call is to those who have wronged themselves by sin. Al-Mukhtasar: Allah forgives all sins of whoever turns to Him in repentance; the next verse says “turn to your Lord”.",
   "bn": "“বলুন” রাসূল ﷺ-কে বলা হয়েছে; আহ্বানটি পাপের মাধ্যমে নিজের ওপর জুলুমকারীদের প্রতি। আল-মুখতাসার: যে তাওবা করে আল্লাহ তার সব পাপ ক্ষমা করেন; পরের আয়াতে বলা হয়েছে “তোমাদের প্রতিপালকের দিকে ফিরে এসো”।"
  },
  "review": "checked",
  "src": [
   "https://quran.com/39/53",
   "https://quranenc.com/en/browse/bengali_mokhtasar/39#53"
  ]
 },
 {
  "seq": 2,
  "id": "d002",
  "s": 2,
  "surah": "Al-Baqarah",
  "a": 186,
  "b": 186,
  "theme": "hope",
  "why": "Allah is near and answers whoever calls on Him.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/2/186",
   "https://quranenc.com/en/browse/bengali_mokhtasar/2#186"
  ]
 },
 {
  "seq": 3,
  "id": "d003",
  "s": 94,
  "surah": "Ash-Sharh",
  "a": 5,
  "b": 6,
  "theme": "hope",
  "why": "Hardship is accompanied by ease, stated twice.",
  "ctx": {
   "en": "The surah addresses the Prophet ﷺ; the statement itself is general in wording, and Al-Mukhtasar explains it as ease accompanying hardship.",
   "bn": "সূরাটি রাসূল ﷺ-কে সম্বোধন করে; বক্তব্যটি শব্দের দিক থেকে সাধারণ, আর আল-মুখতাসার একে কাঠিন্যের সঙ্গে সহজতা থাকার কথা হিসেবে ব্যাখ্যা করেছে।"
  },
  "review": "checked",
  "src": [
   "https://quran.com/94/5-6",
   "https://quranenc.com/en/browse/bengali_mokhtasar/94#5"
  ]
 },
 {
  "seq": 4,
  "id": "d004",
  "s": 13,
  "surah": "Ar-Ra'd",
  "a": 28,
  "b": 28,
  "theme": "hope",
  "why": "Hearts find rest in the remembrance of Allah.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/13/28",
   "https://quranenc.com/en/browse/bengali_mokhtasar/13#28"
  ]
 },
 {
  "seq": 5,
  "id": "d005",
  "s": 12,
  "surah": "Yusuf",
  "a": 86,
  "b": 86,
  "theme": "hope",
  "why": "Taking one's grief to Allah alone.",
  "ctx": {
   "en": "Spoken by Prophet Ya'qub (Jacob) to his sons, after losing Yusuf and then Yusuf's brother.",
   "bn": "নবী ইয়াকুব (আ.) তাঁর ছেলেদের বলেছিলেন, ইউসুফকে এবং পরে তাঁর ভাইকে হারানোর পর।"
  },
  "review": "checked",
  "src": [
   "https://quran.com/12/86",
   "https://quranenc.com/en/browse/bengali_mokhtasar/12#86"
  ]
 },
 {
  "seq": 6,
  "id": "d006",
  "s": 6,
  "surah": "Al-An'am",
  "a": 54,
  "b": 54,
  "theme": "hope",
  "why": "Allah has written mercy upon Himself for those who repent and reform.",
  "ctx": {
   "en": "“Thee” is the Prophet ﷺ: he is told to greet the believers with peace and give them this news.",
   "bn": "এখানে সম্বোধন রাসূল ﷺ-কে: মুমিনদের সালাম দিতে ও এই সুসংবাদ জানাতে বলা হয়েছে।"
  },
  "review": "checked",
  "src": [
   "https://quran.com/6/54",
   "https://quranenc.com/en/browse/bengali_mokhtasar/6#54"
  ]
 },
 {
  "seq": 7,
  "id": "d007",
  "s": 93,
  "surah": "Ad-Duhaa",
  "a": 3,
  "b": 5,
  "theme": "hope",
  "why": "Allah's care for His Messenger in a time of distress.",
  "ctx": {
   "en": "Addressed to the Prophet ﷺ after a pause in revelation (Al-Mukhtasar). It describes Allah's care for His Messenger and is not a direct promise to every reader.",
   "bn": "ওহী কিছুদিন বন্ধ থাকার পর রাসূল ﷺ-কে উদ্দেশ্য করে নাযিল হয়েছে (আল-মুখতাসার)। এতে রাসূলের প্রতি আল্লাহর যত্নের কথা আছে; এটি প্রত্যেক পাঠকের জন্য সরাসরি প্রতিশ্রুতি নয়।"
  },
  "review": "checked",
  "src": [
   "https://quran.com/93/3-5",
   "https://quranenc.com/en/browse/bengali_mokhtasar/93#3"
  ]
 },
 {
  "seq": 8,
  "id": "d008",
  "s": 50,
  "surah": "Qaf",
  "a": 16,
  "b": 16,
  "theme": "hope",
  "why": "Allah knows every inner thought and is nearer than the jugular vein.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/50/16",
   "https://quranenc.com/en/browse/bengali_mokhtasar/50#16"
  ]
 },
 {
  "seq": 9,
  "id": "d009",
  "s": 15,
  "surah": "Al-Hijr",
  "a": 56,
  "b": 56,
  "theme": "hope",
  "why": "Only those astray despair of their Lord's mercy.",
  "ctx": {
   "en": "Spoken by Prophet Ibrahim (Abraham) when angels brought him news of a son in his old age.",
   "bn": "বৃদ্ধ বয়সে ফেরেশতারা যখন নবী ইব্রাহীম (আ.)-কে পুত্রের সুসংবাদ দেন, তখন তিনি এ কথা বলেন।"
  },
  "review": "checked",
  "src": [
   "https://quran.com/15/56",
   "https://quranenc.com/en/browse/bengali_mokhtasar/15#56"
  ]
 },
 {
  "seq": 10,
  "id": "d010",
  "s": 42,
  "surah": "Ash-Shuraa",
  "a": 25,
  "b": 25,
  "theme": "hope",
  "why": "Allah accepts repentance and pardons evil deeds.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/42/25",
   "https://quranenc.com/en/browse/bengali_mokhtasar/42#25"
  ]
 },
 {
  "seq": 11,
  "id": "d011",
  "s": 40,
  "surah": "Ghafir",
  "a": 60,
  "b": 60,
  "theme": "hope",
  "why": "A direct command to call on Allah, with the promise of an answer.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/40/60",
   "https://quranenc.com/en/browse/bengali_mokhtasar/40#60"
  ]
 },
 {
  "seq": 12,
  "id": "d012",
  "s": 3,
  "surah": "Ali 'Imran",
  "a": 139,
  "b": 139,
  "theme": "hope",
  "why": "Do not lose heart or grieve.",
  "ctx": {
   "en": "Addressed to the believers after the setback at Uhud (Al-Mukhtasar).",
   "bn": "উহুদের বিপর্যয়ের পর মুমিনদের উদ্দেশ্যে বলা হয়েছে (আল-মুখতাসার)।"
  },
  "review": "checked",
  "src": [
   "https://quran.com/3/139",
   "https://quranenc.com/en/browse/bengali_mokhtasar/3#139"
  ]
 },
 {
  "seq": 13,
  "id": "d013",
  "s": 27,
  "surah": "An-Naml",
  "a": 62,
  "b": 62,
  "theme": "hope",
  "why": "Allah answers the one in distress and removes hardship.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/27/62",
   "https://quranenc.com/en/browse/bengali_mokhtasar/27#62"
  ]
 },
 {
  "seq": 14,
  "id": "d014",
  "s": 4,
  "surah": "An-Nisa",
  "a": 110,
  "b": 110,
  "theme": "hope",
  "why": "Whoever seeks forgiveness will find Allah Forgiving.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/4/110",
   "https://quranenc.com/en/browse/bengali_mokhtasar/4#110"
  ]
 },
 {
  "seq": 15,
  "id": "d015",
  "s": 20,
  "surah": "Taha",
  "a": 46,
  "b": 46,
  "theme": "hope",
  "why": "Allah's reassurance to Musa and Harun: He hears and sees.",
  "ctx": {
   "en": "Allah's words to Musa and Harun (Moses and Aaron) as they set out to Pharaoh.",
   "bn": "ফেরাউনের কাছে যাওয়ার সময় মূসা ও হারূন (আ.)-কে আল্লাহর বাণী।"
  },
  "review": "checked",
  "src": [
   "https://quran.com/20/46",
   "https://quranenc.com/en/browse/bengali_mokhtasar/20#46"
  ]
 },
 {
  "seq": 16,
  "id": "d016",
  "s": 85,
  "surah": "Al-Buruj",
  "a": 14,
  "b": 14,
  "theme": "hope",
  "why": "Allah is the Forgiving, the Loving.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/85/14",
   "https://quranenc.com/en/browse/bengali_mokhtasar/85#14"
  ]
 },
 {
  "seq": 17,
  "id": "d017",
  "s": 21,
  "surah": "Al-Anbya",
  "a": 83,
  "b": 84,
  "theme": "hope",
  "why": "Ayyub's patient prayer in illness and Allah's answer.",
  "ctx": {
   "en": "The story of Prophet Ayyub (Job). It records how Allah answered him; it is not a promise that every hardship ends in the same way.",
   "bn": "নবী আইয়ূব (আ.)-এর ঘটনা। আল্লাহ কীভাবে তাঁর দু‘আ কবুল করেছেন তার বর্ণনা; প্রতিটি কষ্ট একইভাবে শেষ হবে—এমন প্রতিশ্রুতি নয়।"
  },
  "review": "checked",
  "src": [
   "https://quran.com/21/83-84",
   "https://quranenc.com/en/browse/bengali_mokhtasar/21#83"
  ]
 },
 {
  "seq": 18,
  "id": "d018",
  "s": 3,
  "surah": "Ali 'Imran",
  "a": 173,
  "b": 173,
  "theme": "hope",
  "why": "'Allah is sufficient for us' in the face of fear.",
  "ctx": {
   "en": "Describes the believers after Uhud, when they were warned that an army had gathered against them (Al-Mukhtasar).",
   "bn": "উহুদের পর মুমিনদের বর্ণনা, যখন তাদের বিরুদ্ধে সৈন্য জমায়েতের ভয় দেখানো হয়েছিল (আল-মুখতাসার)।"
  },
  "review": "checked",
  "src": [
   "https://quran.com/3/173",
   "https://quranenc.com/en/browse/bengali_mokhtasar/3#173"
  ]
 },
 {
  "seq": 19,
  "id": "d019",
  "s": 2,
  "surah": "Al-Baqarah",
  "a": 286,
  "b": 286,
  "theme": "hope",
  "why": "No soul is burdened beyond its capacity; the closing prayer of al-Baqarah.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/2/286",
   "https://quranenc.com/en/browse/bengali_mokhtasar/2#286"
  ]
 },
 {
  "seq": 20,
  "id": "d020",
  "s": 9,
  "surah": "At-Tawbah",
  "a": 51,
  "b": 51,
  "theme": "hope",
  "why": "Nothing befalls us except what Allah has decreed; trust in Him.",
  "ctx": {
   "en": "“Say” is addressed to the Prophet ﷺ, as a reply to the hypocrites (Al-Mukhtasar).",
   "bn": "“বলুন” রাসূল ﷺ-কে বলা হয়েছে, মুনাফিকদের জবাব হিসেবে (আল-মুখতাসার)।"
  },
  "review": "checked",
  "src": [
   "https://quran.com/9/51",
   "https://quranenc.com/en/browse/bengali_mokhtasar/9#51"
  ]
 },
 {
  "seq": 21,
  "id": "d021",
  "s": 21,
  "surah": "Al-Anbya",
  "a": 87,
  "b": 88,
  "theme": "hope",
  "why": "Yunus's prayer in the darkness and Allah's rescue.",
  "ctx": {
   "en": "Prophet Yunus (Jonah) in the darkness inside the fish. The passage ends: “Thus We save believers.”",
   "bn": "মাছের পেটের অন্ধকারে নবী ইউনুস (আ.)। অংশটি শেষ হয়েছে: “এভাবেই আমি মুমিনদের উদ্ধার করি।”"
  },
  "review": "checked",
  "src": [
   "https://quran.com/21/87-88",
   "https://quranenc.com/en/browse/bengali_mokhtasar/21#87"
  ]
 },
 {
  "seq": 22,
  "id": "d022",
  "s": 10,
  "surah": "Yunus",
  "a": 62,
  "b": 62,
  "theme": "hope",
  "why": "The friends of Allah need not fear or grieve.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/10/62",
   "https://quranenc.com/en/browse/bengali_mokhtasar/10#62"
  ]
 },
 {
  "seq": 23,
  "id": "d023",
  "s": 6,
  "surah": "Al-An'am",
  "a": 160,
  "b": 160,
  "theme": "hope",
  "why": "A good deed is multiplied tenfold; a bad one counts once.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/6/160",
   "https://quranenc.com/en/browse/bengali_mokhtasar/6#160"
  ]
 },
 {
  "seq": 24,
  "id": "d024",
  "s": 41,
  "surah": "Fussilat",
  "a": 30,
  "b": 30,
  "theme": "hope",
  "why": "Angels reassure those who stay upright on faith.",
  "ctx": {
   "en": "Al-Mukhtasar: the angels bring these words to the upright believers at the time of death.",
   "bn": "আল-মুখতাসার: ফেরেশতারা মৃত্যুর সময় অবিচল মুমিনদের কাছে এ বার্তা নিয়ে আসেন।"
  },
  "review": "checked",
  "src": [
   "https://quran.com/41/30",
   "https://quranenc.com/en/browse/bengali_mokhtasar/41#30"
  ]
 },
 {
  "seq": 25,
  "id": "d025",
  "s": 4,
  "surah": "An-Nisa",
  "a": 40,
  "b": 40,
  "theme": "hope",
  "why": "Allah wrongs no one even by an atom's weight and multiplies good.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/4/40",
   "https://quranenc.com/en/browse/bengali_mokhtasar/4#40"
  ]
 },
 {
  "seq": 26,
  "id": "d026",
  "s": 7,
  "surah": "Al-A'raf",
  "a": 55,
  "b": 56,
  "theme": "hope",
  "why": "Call on Allah humbly, in fear and hope; His mercy is near the good.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/7/55-56",
   "https://quranenc.com/en/browse/bengali_mokhtasar/7#55"
  ]
 },
 {
  "seq": 27,
  "id": "d027",
  "s": 12,
  "surah": "Yusuf",
  "a": 87,
  "b": 87,
  "theme": "hope",
  "why": "Never despair of Allah's relief.",
  "ctx": {
   "en": "Spoken by Prophet Ya'qub (Jacob) to his sons, after losing Yusuf and then Yusuf's brother.",
   "bn": "নবী ইয়াকুব (আ.) তাঁর ছেলেদের বলেছিলেন, ইউসুফকে এবং পরে তাঁর ভাইকে হারানোর পর।"
  },
  "review": "checked",
  "src": [
   "https://quran.com/12/87",
   "https://quranenc.com/en/browse/bengali_mokhtasar/12#87"
  ]
 },
 {
  "seq": 28,
  "id": "d028",
  "s": 16,
  "surah": "An-Nahl",
  "a": 97,
  "b": 97,
  "theme": "hope",
  "why": "A good life for every believer who does good, man or woman.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/16/97",
   "https://quranenc.com/en/browse/bengali_mokhtasar/16#97"
  ]
 },
 {
  "seq": 29,
  "id": "d029",
  "s": 2,
  "surah": "Al-Baqarah",
  "a": 268,
  "b": 268,
  "theme": "hope",
  "why": "Allah promises forgiveness and bounty where Satan threatens poverty.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/2/268",
   "https://quranenc.com/en/browse/bengali_mokhtasar/2#268"
  ]
 },
 {
  "seq": 30,
  "id": "d030",
  "s": 15,
  "surah": "Al-Hijr",
  "a": 49,
  "b": 50,
  "theme": "hope",
  "why": "Forgiveness and justice stated together.",
  "ctx": {
   "en": "“Announce” is addressed to the Prophet ﷺ. The two verses belong together: Allah's forgiveness and His punishment.",
   "bn": "“জানিয়ে দিন” রাসূল ﷺ-কে বলা হয়েছে। দুটি আয়াত একসঙ্গে: আল্লাহর ক্ষমা ও তাঁর শাস্তি।"
  },
  "review": "checked",
  "src": [
   "https://quran.com/15/49-50",
   "https://quranenc.com/en/browse/bengali_mokhtasar/15#49"
  ]
 },
 {
  "seq": 31,
  "id": "d031",
  "s": 2,
  "surah": "Al-Baqarah",
  "a": 153,
  "b": 153,
  "theme": "patience",
  "why": "Seek help through patience and prayer.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/2/153",
   "https://quranenc.com/en/browse/bengali_mokhtasar/2#153"
  ]
 },
 {
  "seq": 32,
  "id": "d032",
  "s": 2,
  "surah": "Al-Baqarah",
  "a": 155,
  "b": 157,
  "theme": "patience",
  "why": "Trials are expected; the response 'to Allah we belong and to Him we return'.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/2/155-157",
   "https://quranenc.com/en/browse/bengali_mokhtasar/2#155"
  ]
 },
 {
  "seq": 33,
  "id": "d033",
  "s": 14,
  "surah": "Ibrahim",
  "a": 7,
  "b": 7,
  "theme": "patience",
  "why": "Gratitude brings increase.",
  "ctx": {
   "en": "Musa (Moses) reminding his people of Allah's declaration (14:6–7).",
   "bn": "মূসা (আ.) তাঁর জাতিকে আল্লাহর ঘোষণার কথা স্মরণ করিয়ে দিচ্ছেন (১৪:৬–৭)।"
  },
  "review": "checked",
  "src": [
   "https://quran.com/14/7",
   "https://quranenc.com/en/browse/bengali_mokhtasar/14#7"
  ]
 },
 {
  "seq": 34,
  "id": "d034",
  "s": 64,
  "surah": "At-Taghabun",
  "a": 11,
  "b": 11,
  "theme": "patience",
  "why": "No calamity happens except by Allah's leave; He guides the believer's heart.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/64/11",
   "https://quranenc.com/en/browse/bengali_mokhtasar/64#11"
  ]
 },
 {
  "seq": 35,
  "id": "d035",
  "s": 3,
  "surah": "Ali 'Imran",
  "a": 200,
  "b": 200,
  "theme": "patience",
  "why": "Endure, persevere and remain steadfast.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/3/200",
   "https://quranenc.com/en/browse/bengali_mokhtasar/3#200"
  ]
 },
 {
  "seq": 36,
  "id": "d036",
  "s": 2,
  "surah": "Al-Baqarah",
  "a": 152,
  "b": 152,
  "theme": "patience",
  "why": "Remember Allah and He remembers you; be grateful.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/2/152",
   "https://quranenc.com/en/browse/bengali_mokhtasar/2#152"
  ]
 },
 {
  "seq": 37,
  "id": "d037",
  "s": 57,
  "surah": "Al-Hadid",
  "a": 22,
  "b": 23,
  "theme": "patience",
  "why": "Accepting decree so that loss does not crush and gain does not inflate.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/57/22-23",
   "https://quranenc.com/en/browse/bengali_mokhtasar/57#22"
  ]
 },
 {
  "seq": 38,
  "id": "d038",
  "s": 39,
  "surah": "Az-Zumar",
  "a": 10,
  "b": 10,
  "theme": "patience",
  "why": "The patient are rewarded without measure.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/39/10",
   "https://quranenc.com/en/browse/bengali_mokhtasar/39#10"
  ]
 },
 {
  "seq": 39,
  "id": "d039",
  "s": 16,
  "surah": "An-Nahl",
  "a": 18,
  "b": 18,
  "theme": "patience",
  "why": "Allah's favours cannot be counted.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/16/18",
   "https://quranenc.com/en/browse/bengali_mokhtasar/16#18"
  ]
 },
 {
  "seq": 40,
  "id": "d040",
  "s": 29,
  "surah": "Al-'Ankabut",
  "a": 2,
  "b": 3,
  "theme": "patience",
  "why": "Faith is tested, as it was for those before.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/29/2-3",
   "https://quranenc.com/en/browse/bengali_mokhtasar/29#2"
  ]
 },
 {
  "seq": 41,
  "id": "d041",
  "s": 3,
  "surah": "Ali 'Imran",
  "a": 160,
  "b": 160,
  "theme": "patience",
  "why": "If Allah helps you, none can overcome you; trust in Him.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/3/160",
   "https://quranenc.com/en/browse/bengali_mokhtasar/3#160"
  ]
 },
 {
  "seq": 42,
  "id": "d042",
  "s": 31,
  "surah": "Luqman",
  "a": 12,
  "b": 12,
  "theme": "patience",
  "why": "Gratitude benefits the one who is grateful.",
  "ctx": {
   "en": "About Luqman, a man of wisdom whom the Qur'an honours.",
   "bn": "লুকমান সম্পর্কে, যাঁকে কুরআন প্রজ্ঞাবান হিসেবে সম্মানিত করেছে।"
  },
  "review": "checked",
  "src": [
   "https://quran.com/31/12",
   "https://quranenc.com/en/browse/bengali_mokhtasar/31#12"
  ]
 },
 {
  "seq": 43,
  "id": "d043",
  "s": 2,
  "surah": "Al-Baqarah",
  "a": 214,
  "b": 214,
  "theme": "patience",
  "why": "Allah's help is near after trial.",
  "ctx": {
   "en": "Addressed to the believers, reminding them of the trials faced by earlier communities (Al-Mukhtasar).",
   "bn": "পূর্ববর্তী উম্মতদের পরীক্ষার কথা স্মরণ করিয়ে মুমিনদের উদ্দেশ্যে বলা হয়েছে (আল-মুখতাসার)।"
  },
  "review": "checked",
  "src": [
   "https://quran.com/2/214",
   "https://quranenc.com/en/browse/bengali_mokhtasar/2#214"
  ]
 },
 {
  "seq": 44,
  "id": "d044",
  "s": 25,
  "surah": "Al-Furqan",
  "a": 58,
  "b": 58,
  "theme": "patience",
  "why": "Trust in the Ever-Living who never dies.",
  "ctx": {
   "en": "Addressed to the Prophet ﷺ.",
   "bn": "রাসূল ﷺ-কে সম্বোধন করে বলা হয়েছে।"
  },
  "review": "checked",
  "src": [
   "https://quran.com/25/58",
   "https://quranenc.com/en/browse/bengali_mokhtasar/25#58"
  ]
 },
 {
  "seq": 45,
  "id": "d045",
  "s": 14,
  "surah": "Ibrahim",
  "a": 34,
  "b": 34,
  "theme": "patience",
  "why": "Allah gives from all we ask; His blessings cannot be counted.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/14/34",
   "https://quranenc.com/en/browse/bengali_mokhtasar/14#34"
  ]
 },
 {
  "seq": 46,
  "id": "d046",
  "s": 42,
  "surah": "Ash-Shuraa",
  "a": 43,
  "b": 43,
  "theme": "patience",
  "why": "Patience and forgiveness are among the matters of resolve.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/42/43",
   "https://quranenc.com/en/browse/bengali_mokhtasar/42#43"
  ]
 },
 {
  "seq": 47,
  "id": "d047",
  "s": 12,
  "surah": "Yusuf",
  "a": 83,
  "b": 83,
  "theme": "patience",
  "why": "Ya'qub's 'beautiful patience' and hope in Allah.",
  "ctx": {
   "en": "Spoken by Prophet Ya'qub (Jacob) to his sons, after losing Yusuf and then Yusuf's brother.",
   "bn": "নবী ইয়াকুব (আ.) তাঁর ছেলেদের বলেছিলেন, ইউসুফকে এবং পরে তাঁর ভাইকে হারানোর পর।"
  },
  "review": "checked",
  "src": [
   "https://quran.com/12/83",
   "https://quranenc.com/en/browse/bengali_mokhtasar/12#83"
  ]
 },
 {
  "seq": 48,
  "id": "d048",
  "s": 16,
  "surah": "An-Nahl",
  "a": 53,
  "b": 53,
  "theme": "patience",
  "why": "Every blessing is from Allah, and we turn to Him in hardship.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/16/53",
   "https://quranenc.com/en/browse/bengali_mokhtasar/16#53"
  ]
 },
 {
  "seq": 49,
  "id": "d049",
  "s": 9,
  "surah": "At-Tawbah",
  "a": 129,
  "b": 129,
  "theme": "patience",
  "why": "'Allah is sufficient for me; in Him I trust.'",
  "ctx": {
   "en": "Addressed to the Prophet ﷺ, for when people turn away.",
   "bn": "লোকেরা মুখ ফিরিয়ে নিলে কী বলবেন—রাসূল ﷺ-কে বলা হয়েছে।"
  },
  "review": "checked",
  "src": [
   "https://quran.com/9/129",
   "https://quranenc.com/en/browse/bengali_mokhtasar/9#129"
  ]
 },
 {
  "seq": 50,
  "id": "d050",
  "s": 2,
  "surah": "Al-Baqarah",
  "a": 45,
  "b": 45,
  "theme": "patience",
  "why": "Seek help in patience and prayer; humility makes it easier.",
  "ctx": {
   "en": "In its setting this is addressed to the Children of Israel (2:40–46); Al-Mukhtasar explains it as guidance for all believers.",
   "bn": "প্রসঙ্গ অনুযায়ী এটি বনী ইসরাঈলকে বলা হয়েছে (২:৪০–৪৬); আল-মুখতাসার একে সব মুমিনের জন্য নির্দেশনা হিসেবে ব্যাখ্যা করেছে।"
  },
  "review": "checked",
  "src": [
   "https://quran.com/2/45",
   "https://quranenc.com/en/browse/bengali_mokhtasar/2#45"
  ]
 },
 {
  "seq": 51,
  "id": "d051",
  "s": 93,
  "surah": "Ad-Duhaa",
  "a": 11,
  "b": 11,
  "theme": "patience",
  "why": "Speak of your Lord's favours.",
  "ctx": {
   "en": "Addressed to the Prophet ﷺ. Al-Mukhtasar: thank Allah for His blessings and speak of them.",
   "bn": "রাসূল ﷺ-কে বলা হয়েছে। আল-মুখতাসার: আল্লাহর নিয়ামতের শুকরিয়া আদায় করুন এবং তা প্রকাশ করুন।"
  },
  "review": "checked",
  "src": [
   "https://quran.com/93/11",
   "https://quranenc.com/en/browse/bengali_mokhtasar/93#11"
  ]
 },
 {
  "seq": 52,
  "id": "d052",
  "s": 3,
  "surah": "Ali 'Imran",
  "a": 159,
  "b": 159,
  "theme": "patience",
  "why": "Gentleness, consultation, then trust in Allah.",
  "ctx": {
   "en": "Addressed to the Prophet ﷺ about his companions after Uhud.",
   "bn": "উহুদের পর সাহাবীদের ব্যাপারে রাসূল ﷺ-কে বলা হয়েছে।"
  },
  "review": "checked",
  "src": [
   "https://quran.com/3/159",
   "https://quranenc.com/en/browse/bengali_mokhtasar/3#159"
  ]
 },
 {
  "seq": 53,
  "id": "d053",
  "s": 11,
  "surah": "Hud",
  "a": 115,
  "b": 115,
  "theme": "patience",
  "why": "Allah does not let the reward of the good be lost.",
  "ctx": {
   "en": "Addressed to the Prophet ﷺ.",
   "bn": "রাসূল ﷺ-কে সম্বোধন করে বলা হয়েছে।"
  },
  "review": "checked",
  "src": [
   "https://quran.com/11/115",
   "https://quranenc.com/en/browse/bengali_mokhtasar/11#115"
  ]
 },
 {
  "seq": 54,
  "id": "d054",
  "s": 2,
  "surah": "Al-Baqarah",
  "a": 172,
  "b": 172,
  "theme": "patience",
  "why": "Eat of good things and be grateful to Allah.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/2/172",
   "https://quranenc.com/en/browse/bengali_mokhtasar/2#172"
  ]
 },
 {
  "seq": 55,
  "id": "d055",
  "s": 14,
  "surah": "Ibrahim",
  "a": 12,
  "b": 12,
  "theme": "patience",
  "why": "The messengers' resolve to trust Allah and endure harm.",
  "ctx": {
   "en": "Words of earlier messengers to the people who rejected them.",
   "bn": "পূর্ববর্তী রাসূলগণ তাঁদের প্রত্যাখ্যানকারী জাতিকে এ কথা বলেছিলেন।"
  },
  "review": "checked",
  "src": [
   "https://quran.com/14/12",
   "https://quranenc.com/en/browse/bengali_mokhtasar/14#12"
  ]
 },
 {
  "seq": 56,
  "id": "d056",
  "s": 94,
  "surah": "Ash-Sharh",
  "a": 7,
  "b": 8,
  "theme": "patience",
  "why": "After finishing one task, turn to worship and to your Lord.",
  "ctx": {
   "en": "Addressed to the Prophet ﷺ. Al-Mukhtasar: when you have finished your work, devote yourself to worship.",
   "bn": "রাসূল ﷺ-কে বলা হয়েছে। আল-মুখতাসার: কাজ শেষ হলে প্রতিপালকের ইবাদতে মনোনিবেশ করুন।"
  },
  "review": "checked",
  "src": [
   "https://quran.com/94/7-8",
   "https://quranenc.com/en/browse/bengali_mokhtasar/94#7"
  ]
 },
 {
  "seq": 57,
  "id": "d057",
  "s": 3,
  "surah": "Ali 'Imran",
  "a": 186,
  "b": 186,
  "theme": "patience",
  "why": "Trials in wealth and self; patience and piety are resolve.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/3/186",
   "https://quranenc.com/en/browse/bengali_mokhtasar/3#186"
  ]
 },
 {
  "seq": 58,
  "id": "d058",
  "s": 13,
  "surah": "Ar-Ra'd",
  "a": 22,
  "b": 22,
  "theme": "patience",
  "why": "Patience seeking Allah's face, prayer, charity, repelling evil with good.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/13/22",
   "https://quranenc.com/en/browse/bengali_mokhtasar/13#22"
  ]
 },
 {
  "seq": 59,
  "id": "d059",
  "s": 16,
  "surah": "An-Nahl",
  "a": 96,
  "b": 96,
  "theme": "patience",
  "why": "What we have passes; what is with Allah remains.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/16/96",
   "https://quranenc.com/en/browse/bengali_mokhtasar/16#96"
  ]
 },
 {
  "seq": 60,
  "id": "d060",
  "s": 90,
  "surah": "Al-Balad",
  "a": 17,
  "b": 17,
  "theme": "patience",
  "why": "Believers urge one another to patience and compassion.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/90/17",
   "https://quranenc.com/en/browse/bengali_mokhtasar/90#17"
  ]
 },
 {
  "seq": 61,
  "id": "d061",
  "s": 1,
  "surah": "Al-Fatihah",
  "a": 1,
  "b": 7,
  "theme": "prayer",
  "why": "Al-Fatihah: praise, worship and the prayer for guidance.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/1/1-7",
   "https://quranenc.com/en/browse/bengali_mokhtasar/1#1"
  ]
 },
 {
  "seq": 62,
  "id": "d062",
  "s": 33,
  "surah": "Al-Ahzab",
  "a": 41,
  "b": 42,
  "theme": "prayer",
  "why": "Remember Allah often, morning and evening.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/33/41-42",
   "https://quranenc.com/en/browse/bengali_mokhtasar/33#41"
  ]
 },
 {
  "seq": 63,
  "id": "d063",
  "s": 2,
  "surah": "Al-Baqarah",
  "a": 238,
  "b": 238,
  "theme": "prayer",
  "why": "Guard the prayers and stand before Allah devoutly.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/2/238",
   "https://quranenc.com/en/browse/bengali_mokhtasar/2#238"
  ]
 },
 {
  "seq": 64,
  "id": "d064",
  "s": 3,
  "surah": "Ali 'Imran",
  "a": 135,
  "b": 136,
  "theme": "prayer",
  "why": "Those who sin then remember Allah and seek forgiveness.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/3/135-136",
   "https://quranenc.com/en/browse/bengali_mokhtasar/3#135"
  ]
 },
 {
  "seq": 65,
  "id": "d065",
  "s": 23,
  "surah": "Al-Mu'minun",
  "a": 1,
  "b": 2,
  "theme": "prayer",
  "why": "Success belongs to believers who pray with humility.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/23/1-2",
   "https://quranenc.com/en/browse/bengali_mokhtasar/23#1"
  ]
 },
 {
  "seq": 66,
  "id": "d066",
  "s": 7,
  "surah": "Al-A'raf",
  "a": 205,
  "b": 205,
  "theme": "prayer",
  "why": "Remember your Lord within yourself, morning and evening.",
  "ctx": {
   "en": "Addressed to the Prophet ﷺ.",
   "bn": "রাসূল ﷺ-কে সম্বোধন করে বলা হয়েছে।"
  },
  "review": "checked",
  "src": [
   "https://quran.com/7/205",
   "https://quranenc.com/en/browse/bengali_mokhtasar/7#205"
  ]
 },
 {
  "seq": 67,
  "id": "d067",
  "s": 39,
  "surah": "Az-Zumar",
  "a": 54,
  "b": 54,
  "theme": "prayer",
  "why": "Turn to your Lord in repentance before it is too late.",
  "ctx": {
   "en": "Continues 39:53: the door of repentance is open until death or the punishment comes.",
   "bn": "৩৯:৫৩-এর ধারাবাহিকতা: মৃত্যু বা শাস্তি আসার আগ পর্যন্ত তাওবার দরজা খোলা।"
  },
  "review": "checked",
  "src": [
   "https://quran.com/39/54",
   "https://quranenc.com/en/browse/bengali_mokhtasar/39#54"
  ]
 },
 {
  "seq": 68,
  "id": "d068",
  "s": 29,
  "surah": "Al-'Ankabut",
  "a": 45,
  "b": 45,
  "theme": "prayer",
  "why": "Prayer restrains from wrongdoing; remembrance of Allah is greater.",
  "ctx": {
   "en": "The first part addresses the Prophet ﷺ; Al-Mukhtasar explains that prayer performed properly keeps one from sin.",
   "bn": "প্রথম অংশ রাসূল ﷺ-কে সম্বোধন করে; আল-মুখতাসার বলেছে, যথাযথভাবে আদায় করা নামাজ পাপ থেকে বিরত রাখে।"
  },
  "review": "checked",
  "src": [
   "https://quran.com/29/45",
   "https://quranenc.com/en/browse/bengali_mokhtasar/29#45"
  ]
 },
 {
  "seq": 69,
  "id": "d069",
  "s": 51,
  "surah": "Adh-Dhariyat",
  "a": 17,
  "b": 18,
  "theme": "prayer",
  "why": "The righteous pray at night and seek forgiveness before dawn.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/51/17-18",
   "https://quranenc.com/en/browse/bengali_mokhtasar/51#17"
  ]
 },
 {
  "seq": 70,
  "id": "d070",
  "s": 2,
  "surah": "Al-Baqarah",
  "a": 255,
  "b": 255,
  "theme": "prayer",
  "why": "Ayat al-Kursi: Allah's life, knowledge and sovereignty.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/2/255",
   "https://quranenc.com/en/browse/bengali_mokhtasar/2#255"
  ]
 },
 {
  "seq": 71,
  "id": "d071",
  "s": 66,
  "surah": "At-Tahrim",
  "a": 8,
  "b": 8,
  "theme": "prayer",
  "why": "Sincere repentance and the prayer for perfected light.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/66/8",
   "https://quranenc.com/en/browse/bengali_mokhtasar/66#8"
  ]
 },
 {
  "seq": 72,
  "id": "d072",
  "s": 20,
  "surah": "Taha",
  "a": 14,
  "b": 14,
  "theme": "prayer",
  "why": "Establish prayer for Allah's remembrance.",
  "ctx": {
   "en": "Allah's words to Musa (Moses) at the beginning of his prophethood.",
   "bn": "নবুয়তের শুরুতে মূসা (আ.)-কে আল্লাহর বাণী।"
  },
  "review": "checked",
  "src": [
   "https://quran.com/20/14",
   "https://quranenc.com/en/browse/bengali_mokhtasar/20#14"
  ]
 },
 {
  "seq": 73,
  "id": "d073",
  "s": 32,
  "surah": "As-Sajdah",
  "a": 16,
  "b": 16,
  "theme": "prayer",
  "why": "Rising from bed to call on Allah in fear and hope.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/32/16",
   "https://quranenc.com/en/browse/bengali_mokhtasar/32#16"
  ]
 },
 {
  "seq": 74,
  "id": "d074",
  "s": 7,
  "surah": "Al-A'raf",
  "a": 23,
  "b": 23,
  "theme": "prayer",
  "why": "The prayer of Adam and Hawwa after their mistake.",
  "ctx": {
   "en": "The prayer of Adam and Hawwa (Eve) after eating from the forbidden tree.",
   "bn": "নিষিদ্ধ গাছের ফল খাওয়ার পর আদম ও হাওয়া (আ.)-এর দু‘আ।"
  },
  "review": "checked",
  "src": [
   "https://quran.com/7/23",
   "https://quranenc.com/en/browse/bengali_mokhtasar/7#23"
  ]
 },
 {
  "seq": 75,
  "id": "d075",
  "s": 2,
  "surah": "Al-Baqarah",
  "a": 115,
  "b": 115,
  "theme": "prayer",
  "why": "Wherever you turn, there is the Face of Allah.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/2/115",
   "https://quranenc.com/en/browse/bengali_mokhtasar/2#115"
  ]
 },
 {
  "seq": 76,
  "id": "d076",
  "s": 11,
  "surah": "Hud",
  "a": 114,
  "b": 114,
  "theme": "prayer",
  "why": "Prayer at both ends of the day; good deeds remove bad ones.",
  "ctx": {
   "en": "Al-Mukhtasar: good deeds wipe out minor sins.",
   "bn": "আল-মুখতাসার: নেক আমল ছোট ছোট পাপ মুছে দেয়।"
  },
  "review": "checked",
  "src": [
   "https://quran.com/11/114",
   "https://quranenc.com/en/browse/bengali_mokhtasar/11#114"
  ]
 },
 {
  "seq": 77,
  "id": "d077",
  "s": 3,
  "surah": "Ali 'Imran",
  "a": 31,
  "b": 31,
  "theme": "prayer",
  "why": "Love of Allah shown by following the Prophet, and forgiveness.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/3/31",
   "https://quranenc.com/en/browse/bengali_mokhtasar/3#31"
  ]
 },
 {
  "seq": 78,
  "id": "d078",
  "s": 28,
  "surah": "Al-Qasas",
  "a": 16,
  "b": 16,
  "theme": "prayer",
  "why": "Musa's prayer: 'I have wronged myself, so forgive me.'",
  "ctx": {
   "en": "The prayer of Musa (Moses) after a man died from his blow (28:15).",
   "bn": "মূসা (আ.)-এর আঘাতে একজন মারা যাওয়ার পর তাঁর দু‘আ (২৮:১৫)।"
  },
  "review": "checked",
  "src": [
   "https://quran.com/28/16",
   "https://quranenc.com/en/browse/bengali_mokhtasar/28#16"
  ]
 },
 {
  "seq": 79,
  "id": "d079",
  "s": 59,
  "surah": "Al-Hashr",
  "a": 22,
  "b": 23,
  "theme": "prayer",
  "why": "Allah's names: the Merciful, the Holy, Peace.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/59/22-23",
   "https://quranenc.com/en/browse/bengali_mokhtasar/59#22"
  ]
 },
 {
  "seq": 80,
  "id": "d080",
  "s": 25,
  "surah": "Al-Furqan",
  "a": 70,
  "b": 70,
  "theme": "prayer",
  "why": "Repentance with faith and good deeds turns bad deeds into good.",
  "ctx": {
   "en": "Follows verses on grave sins (25:68–69); the exception is for whoever repents, believes and does righteous deeds.",
   "bn": "গুরুতর পাপের আয়াতের (২৫:৬৮–৬৯) পর এসেছে; ব্যতিক্রম তাদের জন্য যারা তাওবা করে, ঈমান আনে ও নেক আমল করে।"
  },
  "review": "checked",
  "src": [
   "https://quran.com/25/70",
   "https://quranenc.com/en/browse/bengali_mokhtasar/25#70"
  ]
 },
 {
  "seq": 81,
  "id": "d081",
  "s": 3,
  "surah": "Ali 'Imran",
  "a": 8,
  "b": 8,
  "theme": "prayer",
  "why": "A prayer for steadfast hearts after guidance.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/3/8",
   "https://quranenc.com/en/browse/bengali_mokhtasar/3#8"
  ]
 },
 {
  "seq": 82,
  "id": "d082",
  "s": 62,
  "surah": "Al-Jumu'ah",
  "a": 9,
  "b": 10,
  "theme": "prayer",
  "why": "Leave trade for the Friday prayer, then seek Allah's bounty and remember Him.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/62/9-10",
   "https://quranenc.com/en/browse/bengali_mokhtasar/62#9"
  ]
 },
 {
  "seq": 83,
  "id": "d083",
  "s": 18,
  "surah": "Al-Kahf",
  "a": 10,
  "b": 10,
  "theme": "prayer",
  "why": "The prayer of the young believers in the cave for mercy and right guidance.",
  "ctx": {
   "en": "The prayer of the young believers who took refuge in the cave.",
   "bn": "গুহায় আশ্রয় নেওয়া মুমিন যুবকদের দু‘আ।"
  },
  "review": "checked",
  "src": [
   "https://quran.com/18/10",
   "https://quranenc.com/en/browse/bengali_mokhtasar/18#10"
  ]
 },
 {
  "seq": 84,
  "id": "d084",
  "s": 17,
  "surah": "Al-Isra",
  "a": 44,
  "b": 44,
  "theme": "prayer",
  "why": "All creation glorifies Allah.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/17/44",
   "https://quranenc.com/en/browse/bengali_mokhtasar/17#44"
  ]
 },
 {
  "seq": 85,
  "id": "d085",
  "s": 20,
  "surah": "Taha",
  "a": 82,
  "b": 82,
  "theme": "prayer",
  "why": "Allah forgives whoever repents, believes, does good and stays guided.",
  "ctx": {
   "en": "Said to the Children of Israel (20:80–82); the promise is stated for whoever repents and believes.",
   "bn": "বনী ইসরাঈলকে বলা হয়েছে (২০:৮০–৮২); প্রতিশ্রুতিটি যে তাওবা করে ও ঈমান আনে তার জন্য।"
  },
  "review": "checked",
  "src": [
   "https://quran.com/20/82",
   "https://quranenc.com/en/browse/bengali_mokhtasar/20#82"
  ]
 },
 {
  "seq": 86,
  "id": "d086",
  "s": 2,
  "surah": "Al-Baqarah",
  "a": 201,
  "b": 201,
  "theme": "prayer",
  "why": "A prayer for good in this world and the next.",
  "ctx": {
   "en": "From the passage on Hajj (2:200–201): the prayer of those who ask for good in this world and the Hereafter.",
   "bn": "হজের আলোচনা থেকে (২:২০০–২০১): যারা দুনিয়া ও আখিরাতের কল্যাণ চায় তাদের দু‘আ।"
  },
  "review": "checked",
  "src": [
   "https://quran.com/2/201",
   "https://quranenc.com/en/browse/bengali_mokhtasar/2#201"
  ]
 },
 {
  "seq": 87,
  "id": "d087",
  "s": 26,
  "surah": "Ash-Shu'ara",
  "a": 78,
  "b": 82,
  "theme": "prayer",
  "why": "Ibrahim's description of his Lord who guides, feeds, heals and forgives.",
  "ctx": {
   "en": "Words of Prophet Ibrahim (Abraham) describing his Lord to his people.",
   "bn": "নবী ইব্রাহীম (আ.) তাঁর জাতির কাছে নিজের প্রতিপালকের পরিচয় দিচ্ছেন।"
  },
  "review": "checked",
  "src": [
   "https://quran.com/26/78-82",
   "https://quranenc.com/en/browse/bengali_mokhtasar/26#78"
  ]
 },
 {
  "seq": 88,
  "id": "d088",
  "s": 7,
  "surah": "Al-A'raf",
  "a": 180,
  "b": 180,
  "theme": "prayer",
  "why": "Call on Allah by His beautiful names.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/7/180",
   "https://quranenc.com/en/browse/bengali_mokhtasar/7#180"
  ]
 },
 {
  "seq": 89,
  "id": "d089",
  "s": 28,
  "surah": "Al-Qasas",
  "a": 24,
  "b": 24,
  "theme": "prayer",
  "why": "Musa's prayer when alone and in need.",
  "ctx": {
   "en": "The prayer of Musa (Moses) in Madyan, alone and in need, after helping two women water their flock.",
   "bn": "মাদইয়ানে দুই নারীর পশুকে পানি পান করানোর পর একা ও অভাবগ্রস্ত অবস্থায় মূসা (আ.)-এর দু‘আ।"
  },
  "review": "checked",
  "src": [
   "https://quran.com/28/24",
   "https://quranenc.com/en/browse/bengali_mokhtasar/28#24"
  ]
 },
 {
  "seq": 90,
  "id": "d090",
  "s": 14,
  "surah": "Ibrahim",
  "a": 40,
  "b": 41,
  "theme": "prayer",
  "why": "Ibrahim's prayer for prayerfulness and forgiveness for parents and believers.",
  "ctx": {
   "en": "A prayer of Prophet Ibrahim (Abraham).",
   "bn": "নবী ইব্রাহীম (আ.)-এর দু‘আ।"
  },
  "review": "checked",
  "src": [
   "https://quran.com/14/40-41",
   "https://quranenc.com/en/browse/bengali_mokhtasar/14#40"
  ]
 },
 {
  "seq": 91,
  "id": "d091",
  "s": 17,
  "surah": "Al-Isra",
  "a": 23,
  "b": 24,
  "theme": "character",
  "why": "Kindness and gentle speech to parents, with a prayer for them.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/17/23-24",
   "https://quranenc.com/en/browse/bengali_mokhtasar/17#23"
  ]
 },
 {
  "seq": 92,
  "id": "d092",
  "s": 49,
  "surah": "Al-Hujurat",
  "a": 13,
  "b": 13,
  "theme": "character",
  "why": "Created to know one another; honour is by righteousness.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/49/13",
   "https://quranenc.com/en/browse/bengali_mokhtasar/49#13"
  ]
 },
 {
  "seq": 93,
  "id": "d093",
  "s": 41,
  "surah": "Fussilat",
  "a": 34,
  "b": 34,
  "theme": "character",
  "why": "Repel evil with what is better.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/41/34",
   "https://quranenc.com/en/browse/bengali_mokhtasar/41#34"
  ]
 },
 {
  "seq": 94,
  "id": "d094",
  "s": 30,
  "surah": "Ar-Rum",
  "a": 21,
  "b": 21,
  "theme": "character",
  "why": "Spouses as a source of tranquillity, love and mercy.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/30/21",
   "https://quranenc.com/en/browse/bengali_mokhtasar/30#21"
  ]
 },
 {
  "seq": 95,
  "id": "d095",
  "s": 5,
  "surah": "Al-Ma'idah",
  "a": 8,
  "b": 8,
  "theme": "character",
  "why": "Justice even towards those one dislikes.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/5/8",
   "https://quranenc.com/en/browse/bengali_mokhtasar/5#8"
  ]
 },
 {
  "seq": 96,
  "id": "d096",
  "s": 25,
  "surah": "Al-Furqan",
  "a": 63,
  "b": 63,
  "theme": "character",
  "why": "The servants of the Most Merciful walk humbly and answer ignorance with peace.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/25/63",
   "https://quranenc.com/en/browse/bengali_mokhtasar/25#63"
  ]
 },
 {
  "seq": 97,
  "id": "d097",
  "s": 49,
  "surah": "Al-Hujurat",
  "a": 12,
  "b": 12,
  "theme": "character",
  "why": "Avoid suspicion, spying and backbiting.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/49/12",
   "https://quranenc.com/en/browse/bengali_mokhtasar/49#12"
  ]
 },
 {
  "seq": 98,
  "id": "d098",
  "s": 16,
  "surah": "An-Nahl",
  "a": 90,
  "b": 90,
  "theme": "character",
  "why": "Justice, excellence, giving to relatives; avoiding indecency and oppression.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/16/90",
   "https://quranenc.com/en/browse/bengali_mokhtasar/16#90"
  ]
 },
 {
  "seq": 99,
  "id": "d099",
  "s": 3,
  "surah": "Ali 'Imran",
  "a": 134,
  "b": 134,
  "theme": "character",
  "why": "Spending in ease and hardship, restraining anger, pardoning people.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/3/134",
   "https://quranenc.com/en/browse/bengali_mokhtasar/3#134"
  ]
 },
 {
  "seq": 100,
  "id": "d100",
  "s": 31,
  "surah": "Luqman",
  "a": 14,
  "b": 14,
  "theme": "character",
  "why": "Gratitude to Allah and to parents; the mother's hardship.",
  "ctx": {
   "en": "Allah's own instruction, placed within Luqman's advice to his son (31:13–19).",
   "bn": "লুকমানের পুত্রের প্রতি উপদেশের (৩১:১৩–১৯) মাঝে আল্লাহর নিজের নির্দেশ।"
  },
  "review": "checked",
  "src": [
   "https://quran.com/31/14",
   "https://quranenc.com/en/browse/bengali_mokhtasar/31#14"
  ]
 },
 {
  "seq": 101,
  "id": "d101",
  "s": 2,
  "surah": "Al-Baqarah",
  "a": 263,
  "b": 263,
  "theme": "character",
  "why": "A kind word and forgiveness are better than charity followed by hurt.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/2/263",
   "https://quranenc.com/en/browse/bengali_mokhtasar/2#263"
  ]
 },
 {
  "seq": 102,
  "id": "d102",
  "s": 49,
  "surah": "Al-Hujurat",
  "a": 10,
  "b": 10,
  "theme": "character",
  "why": "Believers are brothers; make peace between them.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/49/10",
   "https://quranenc.com/en/browse/bengali_mokhtasar/49#10"
  ]
 },
 {
  "seq": 103,
  "id": "d103",
  "s": 4,
  "surah": "An-Nisa",
  "a": 36,
  "b": 36,
  "theme": "character",
  "why": "Worship Allah and be good to parents, relatives, neighbours and travellers.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/4/36",
   "https://quranenc.com/en/browse/bengali_mokhtasar/4#36"
  ]
 },
 {
  "seq": 104,
  "id": "d104",
  "s": 24,
  "surah": "An-Nur",
  "a": 22,
  "b": 22,
  "theme": "character",
  "why": "Forgive and overlook, as you would love Allah to forgive you.",
  "ctx": {
   "en": "Revealed about Abu Bakr, who swore to stop supporting a needy relative who had taken part in the slander (Al-Mukhtasar).",
   "bn": "আবু বকর (রা.) সম্পর্কে নাযিল হয়েছে, যিনি অপবাদে অংশ নেওয়া এক অভাবী আত্মীয়ের খরচ বন্ধের কসম করেছিলেন (আল-মুখতাসার)।"
  },
  "review": "checked",
  "src": [
   "https://quran.com/24/22",
   "https://quranenc.com/en/browse/bengali_mokhtasar/24#22"
  ]
 },
 {
  "seq": 105,
  "id": "d105",
  "s": 17,
  "surah": "Al-Isra",
  "a": 53,
  "b": 53,
  "theme": "character",
  "why": "Say what is best; Satan sows discord.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/17/53",
   "https://quranenc.com/en/browse/bengali_mokhtasar/17#53"
  ]
 },
 {
  "seq": 106,
  "id": "d106",
  "s": 49,
  "surah": "Al-Hujurat",
  "a": 11,
  "b": 11,
  "theme": "character",
  "why": "Do not mock, insult or use offensive nicknames.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/49/11",
   "https://quranenc.com/en/browse/bengali_mokhtasar/49#11"
  ]
 },
 {
  "seq": 107,
  "id": "d107",
  "s": 4,
  "surah": "An-Nisa",
  "a": 58,
  "b": 58,
  "theme": "character",
  "why": "Return trusts and judge with justice.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/4/58",
   "https://quranenc.com/en/browse/bengali_mokhtasar/4#58"
  ]
 },
 {
  "seq": 108,
  "id": "d108",
  "s": 31,
  "surah": "Luqman",
  "a": 17,
  "b": 19,
  "theme": "character",
  "why": "Luqman's advice: prayer, patience, humility and a gentle voice.",
  "ctx": {
   "en": "Luqman's advice to his son.",
   "bn": "পুত্রের প্রতি লুকমানের উপদেশ।"
  },
  "review": "checked",
  "src": [
   "https://quran.com/31/17-19",
   "https://quranenc.com/en/browse/bengali_mokhtasar/31#17"
  ]
 },
 {
  "seq": 109,
  "id": "d109",
  "s": 4,
  "surah": "An-Nisa",
  "a": 86,
  "b": 86,
  "theme": "character",
  "why": "Return a greeting with a better one or its like.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/4/86",
   "https://quranenc.com/en/browse/bengali_mokhtasar/4#86"
  ]
 },
 {
  "seq": 110,
  "id": "d110",
  "s": 60,
  "surah": "Al-Mumtahanah",
  "a": 8,
  "b": 8,
  "theme": "character",
  "why": "Kindness and justice towards those who do not fight you.",
  "ctx": {
   "en": "About non-Muslims who did not fight the believers over religion or drive them from their homes.",
   "bn": "সেই অমুসলিমদের ব্যাপারে, যারা ধর্মের কারণে মুমিনদের সঙ্গে যুদ্ধ করেনি এবং তাদের ঘর থেকে বের করে দেয়নি।"
  },
  "review": "checked",
  "src": [
   "https://quran.com/60/8",
   "https://quranenc.com/en/browse/bengali_mokhtasar/60#8"
  ]
 },
 {
  "seq": 111,
  "id": "d111",
  "s": 9,
  "surah": "At-Tawbah",
  "a": 128,
  "b": 128,
  "theme": "character",
  "why": "The Prophet's deep concern and mercy for the believers.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/9/128",
   "https://quranenc.com/en/browse/bengali_mokhtasar/9#128"
  ]
 },
 {
  "seq": 112,
  "id": "d112",
  "s": 17,
  "surah": "Al-Isra",
  "a": 37,
  "b": 37,
  "theme": "character",
  "why": "Do not walk on the earth arrogantly.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/17/37",
   "https://quranenc.com/en/browse/bengali_mokhtasar/17#37"
  ]
 },
 {
  "seq": 113,
  "id": "d113",
  "s": 2,
  "surah": "Al-Baqarah",
  "a": 177,
  "b": 177,
  "theme": "character",
  "why": "True righteousness: faith, generosity, prayer, keeping promises, patience.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/2/177",
   "https://quranenc.com/en/browse/bengali_mokhtasar/2#177"
  ]
 },
 {
  "seq": 114,
  "id": "d114",
  "s": 25,
  "surah": "Al-Furqan",
  "a": 74,
  "b": 74,
  "theme": "character",
  "why": "A prayer for family who bring comfort to the eyes.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/25/74",
   "https://quranenc.com/en/browse/bengali_mokhtasar/25#74"
  ]
 },
 {
  "seq": 115,
  "id": "d115",
  "s": 7,
  "surah": "Al-A'raf",
  "a": 199,
  "b": 199,
  "theme": "character",
  "why": "Forgiveness, enjoining good, turning away from the ignorant.",
  "ctx": {
   "en": "Addressed to the Prophet ﷺ.",
   "bn": "রাসূল ﷺ-কে সম্বোধন করে বলা হয়েছে।"
  },
  "review": "checked",
  "src": [
   "https://quran.com/7/199",
   "https://quranenc.com/en/browse/bengali_mokhtasar/7#199"
  ]
 },
 {
  "seq": 116,
  "id": "d116",
  "s": 4,
  "surah": "An-Nisa",
  "a": 1,
  "b": 1,
  "theme": "character",
  "why": "Mindfulness of Allah and of family ties; one origin of humankind.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/4/1",
   "https://quranenc.com/en/browse/bengali_mokhtasar/4#1"
  ]
 },
 {
  "seq": 117,
  "id": "d117",
  "s": 33,
  "surah": "Al-Ahzab",
  "a": 21,
  "b": 21,
  "theme": "character",
  "why": "The Messenger as the best example.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/33/21",
   "https://quranenc.com/en/browse/bengali_mokhtasar/33#21"
  ]
 },
 {
  "seq": 118,
  "id": "d118",
  "s": 76,
  "surah": "Al-Insan",
  "a": 8,
  "b": 9,
  "theme": "character",
  "why": "Feeding the needy for Allah's sake, expecting no thanks.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/76/8-9",
   "https://quranenc.com/en/browse/bengali_mokhtasar/76#8"
  ]
 },
 {
  "seq": 119,
  "id": "d119",
  "s": 9,
  "surah": "At-Tawbah",
  "a": 71,
  "b": 71,
  "theme": "character",
  "why": "Believing men and women as allies in good.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/9/71",
   "https://quranenc.com/en/browse/bengali_mokhtasar/9#71"
  ]
 },
 {
  "seq": 120,
  "id": "d120",
  "s": 5,
  "surah": "Al-Ma'idah",
  "a": 32,
  "b": 32,
  "theme": "character",
  "why": "The value of a single human life.",
  "ctx": {
   "en": "A ruling given to the Children of Israel after the story of Adam's two sons (5:27–31); it states the worth of one human life.",
   "bn": "আদমের দুই পুত্রের ঘটনার (৫:২৭–৩১) পর বনী ইসরাঈলকে দেওয়া বিধান; এতে একটি মানবজীবনের মূল্য বলা হয়েছে।"
  },
  "review": "checked",
  "src": [
   "https://quran.com/5/32",
   "https://quranenc.com/en/browse/bengali_mokhtasar/5#32"
  ]
 },
 {
  "seq": 121,
  "id": "d121",
  "s": 96,
  "surah": "Al-'Alaq",
  "a": 1,
  "b": 5,
  "theme": "knowledge",
  "why": "The first revelation: read, and Allah teaches by the pen.",
  "ctx": {
   "en": "The first verses revealed to the Prophet ﷺ.",
   "bn": "রাসূল ﷺ-এর ওপর সর্বপ্রথম নাযিল হওয়া আয়াত।"
  },
  "review": "checked",
  "src": [
   "https://quran.com/96/1-5",
   "https://quranenc.com/en/browse/bengali_mokhtasar/96#1"
  ]
 },
 {
  "seq": 122,
  "id": "d122",
  "s": 39,
  "surah": "Az-Zumar",
  "a": 9,
  "b": 9,
  "theme": "knowledge",
  "why": "Are those who know equal to those who do not?",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/39/9",
   "https://quranenc.com/en/browse/bengali_mokhtasar/39#9"
  ]
 },
 {
  "seq": 123,
  "id": "d123",
  "s": 3,
  "surah": "Ali 'Imran",
  "a": 190,
  "b": 191,
  "theme": "knowledge",
  "why": "Reflection on creation leads to remembrance and prayer.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/3/190-191",
   "https://quranenc.com/en/browse/bengali_mokhtasar/3#190"
  ]
 },
 {
  "seq": 124,
  "id": "d124",
  "s": 20,
  "surah": "Taha",
  "a": 114,
  "b": 114,
  "theme": "knowledge",
  "why": "'My Lord, increase me in knowledge.'",
  "ctx": {
   "en": "Addressed to the Prophet ﷺ about receiving the Qur'an; he is taught the prayer “increase me in knowledge”.",
   "bn": "কুরআন গ্রহণের ব্যাপারে রাসূল ﷺ-কে বলা হয়েছে; তাঁকে “আমার জ্ঞান বাড়িয়ে দিন” দু‘আটি শেখানো হয়েছে।"
  },
  "review": "checked",
  "src": [
   "https://quran.com/20/114",
   "https://quranenc.com/en/browse/bengali_mokhtasar/20#114"
  ]
 },
 {
  "seq": 125,
  "id": "d125",
  "s": 58,
  "surah": "Al-Mujadila",
  "a": 11,
  "b": 11,
  "theme": "knowledge",
  "why": "Allah raises in rank those who believe and those given knowledge.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/58/11",
   "https://quranenc.com/en/browse/bengali_mokhtasar/58#11"
  ]
 },
 {
  "seq": 126,
  "id": "d126",
  "s": 17,
  "surah": "Al-Isra",
  "a": 36,
  "b": 36,
  "theme": "knowledge",
  "why": "Do not follow what you have no knowledge of; hearing, sight and heart are accountable.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/17/36",
   "https://quranenc.com/en/browse/bengali_mokhtasar/17#36"
  ]
 },
 {
  "seq": 127,
  "id": "d127",
  "s": 67,
  "surah": "Al-Mulk",
  "a": 1,
  "b": 2,
  "theme": "knowledge",
  "why": "Life and death as a test of who does best.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/67/1-2",
   "https://quranenc.com/en/browse/bengali_mokhtasar/67#1"
  ]
 },
 {
  "seq": 128,
  "id": "d128",
  "s": 13,
  "surah": "Ar-Ra'd",
  "a": 11,
  "b": 11,
  "theme": "knowledge",
  "why": "Allah does not change a people's condition until they change themselves.",
  "ctx": {
   "en": "Al-Mukhtasar: Allah does not change a people's good condition into one they dislike until they change their own deeds.",
   "bn": "আল-মুখতাসার: কোনো জাতি নিজেদের কাজ পরিবর্তন না করা পর্যন্ত আল্লাহ তাদের ভালো অবস্থাকে অপছন্দনীয় অবস্থায় বদলান না।"
  },
  "review": "checked",
  "src": [
   "https://quran.com/13/11",
   "https://quranenc.com/en/browse/bengali_mokhtasar/13#11"
  ]
 },
 {
  "seq": 129,
  "id": "d129",
  "s": 49,
  "surah": "Al-Hujurat",
  "a": 6,
  "b": 6,
  "theme": "knowledge",
  "why": "Verify news before acting on it.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/49/6",
   "https://quranenc.com/en/browse/bengali_mokhtasar/49#6"
  ]
 },
 {
  "seq": 130,
  "id": "d130",
  "s": 2,
  "surah": "Al-Baqarah",
  "a": 269,
  "b": 269,
  "theme": "knowledge",
  "why": "Wisdom is abundant good.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/2/269",
   "https://quranenc.com/en/browse/bengali_mokhtasar/2#269"
  ]
 },
 {
  "seq": 131,
  "id": "d131",
  "s": 10,
  "surah": "Yunus",
  "a": 57,
  "b": 57,
  "theme": "knowledge",
  "why": "The Qur'an as a healing for what is in the hearts.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/10/57",
   "https://quranenc.com/en/browse/bengali_mokhtasar/10#57"
  ]
 },
 {
  "seq": 132,
  "id": "d132",
  "s": 35,
  "surah": "Fatir",
  "a": 28,
  "b": 28,
  "theme": "knowledge",
  "why": "Those with knowledge truly fear Allah.",
  "ctx": {
   "en": "Follows verses on the variety of colours in creation. Al-Mukhtasar: those who know Allah are the ones who truly revere Him.",
   "bn": "সৃষ্টির নানা রঙের আলোচনার পর এসেছে। আল-মুখতাসার: যারা আল্লাহকে জানে, তারাই প্রকৃতভাবে তাঁকে ভয় ও সম্মান করে।"
  },
  "review": "checked",
  "src": [
   "https://quran.com/35/28",
   "https://quranenc.com/en/browse/bengali_mokhtasar/35#28"
  ]
 },
 {
  "seq": 133,
  "id": "d133",
  "s": 53,
  "surah": "An-Najm",
  "a": 39,
  "b": 41,
  "theme": "knowledge",
  "why": "Each person has what they strive for, and their striving will be seen.",
  "ctx": {
   "en": "Part of what was in the scriptures of Musa and Ibrahim (53:36–37).",
   "bn": "মূসা ও ইব্রাহীম (আ.)-এর সহীফায় যা ছিল তার অংশ (৫৩:৩৬–৩৭)।"
  },
  "review": "checked",
  "src": [
   "https://quran.com/53/39-41",
   "https://quranenc.com/en/browse/bengali_mokhtasar/53#39"
  ]
 },
 {
  "seq": 134,
  "id": "d134",
  "s": 38,
  "surah": "Sad",
  "a": 29,
  "b": 29,
  "theme": "knowledge",
  "why": "The Qur'an is blessed so that people reflect on it.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/38/29",
   "https://quranenc.com/en/browse/bengali_mokhtasar/38#29"
  ]
 },
 {
  "seq": 135,
  "id": "d135",
  "s": 61,
  "surah": "As-Saf",
  "a": 2,
  "b": 3,
  "theme": "knowledge",
  "why": "Do not say what you do not do.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/61/2-3",
   "https://quranenc.com/en/browse/bengali_mokhtasar/61#2"
  ]
 },
 {
  "seq": 136,
  "id": "d136",
  "s": 45,
  "surah": "Al-Jathiyah",
  "a": 13,
  "b": 13,
  "theme": "knowledge",
  "why": "Everything in the heavens and earth is made of service to us.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/45/13",
   "https://quranenc.com/en/browse/bengali_mokhtasar/45#13"
  ]
 },
 {
  "seq": 137,
  "id": "d137",
  "s": 54,
  "surah": "Al-Qamar",
  "a": 17,
  "b": 17,
  "theme": "knowledge",
  "why": "The Qur'an is made easy to remember.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/54/17",
   "https://quranenc.com/en/browse/bengali_mokhtasar/54#17"
  ]
 },
 {
  "seq": 138,
  "id": "d138",
  "s": 91,
  "surah": "Ash-Shams",
  "a": 7,
  "b": 10,
  "theme": "knowledge",
  "why": "Success for whoever purifies the soul.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/91/7-10",
   "https://quranenc.com/en/browse/bengali_mokhtasar/91#7"
  ]
 },
 {
  "seq": 139,
  "id": "d139",
  "s": 30,
  "surah": "Ar-Rum",
  "a": 22,
  "b": 22,
  "theme": "knowledge",
  "why": "Diversity of languages and colours as signs.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/30/22",
   "https://quranenc.com/en/browse/bengali_mokhtasar/30#22"
  ]
 },
 {
  "seq": 140,
  "id": "d140",
  "s": 14,
  "surah": "Ibrahim",
  "a": 24,
  "b": 25,
  "theme": "knowledge",
  "why": "A good word is like a good tree.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/14/24-25",
   "https://quranenc.com/en/browse/bengali_mokhtasar/14#24"
  ]
 },
 {
  "seq": 141,
  "id": "d141",
  "s": 64,
  "surah": "At-Taghabun",
  "a": 16,
  "b": 16,
  "theme": "knowledge",
  "why": "Fear Allah as much as you are able; overcome greed.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/64/16",
   "https://quranenc.com/en/browse/bengali_mokhtasar/64#16"
  ]
 },
 {
  "seq": 142,
  "id": "d142",
  "s": 6,
  "surah": "Al-An'am",
  "a": 59,
  "b": 59,
  "theme": "knowledge",
  "why": "The keys of the unseen are with Allah; not a leaf falls without His knowledge.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/6/59",
   "https://quranenc.com/en/browse/bengali_mokhtasar/6#59"
  ]
 },
 {
  "seq": 143,
  "id": "d143",
  "s": 17,
  "surah": "Al-Isra",
  "a": 82,
  "b": 82,
  "theme": "knowledge",
  "why": "The Qur'an as healing and mercy for believers.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/17/82",
   "https://quranenc.com/en/browse/bengali_mokhtasar/17#82"
  ]
 },
 {
  "seq": 144,
  "id": "d144",
  "s": 20,
  "surah": "Taha",
  "a": 25,
  "b": 28,
  "theme": "knowledge",
  "why": "Musa's prayer for an open heart and clear speech.",
  "ctx": {
   "en": "The prayer of Musa (Moses) when he was sent to Pharaoh.",
   "bn": "ফেরাউনের কাছে পাঠানোর সময় মূসা (আ.)-এর দু‘আ।"
  },
  "review": "checked",
  "src": [
   "https://quran.com/20/25-28",
   "https://quranenc.com/en/browse/bengali_mokhtasar/20#25"
  ]
 },
 {
  "seq": 145,
  "id": "d145",
  "s": 3,
  "surah": "Ali 'Imran",
  "a": 92,
  "b": 92,
  "theme": "knowledge",
  "why": "Righteousness through giving what one loves.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/3/92",
   "https://quranenc.com/en/browse/bengali_mokhtasar/3#92"
  ]
 },
 {
  "seq": 146,
  "id": "d146",
  "s": 24,
  "surah": "An-Nur",
  "a": 35,
  "b": 35,
  "theme": "knowledge",
  "why": "The parable of Allah's light.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/24/35",
   "https://quranenc.com/en/browse/bengali_mokhtasar/24#35"
  ]
 },
 {
  "seq": 147,
  "id": "d147",
  "s": 95,
  "surah": "At-Tin",
  "a": 4,
  "b": 6,
  "theme": "knowledge",
  "why": "Created in the best form; faith and good deeds bring unfailing reward.",
  "ctx": {
   "en": "Al-Mukhtasar explains verse 5 both as the frailty of old age and as the Fire for those who corrupt their nature.",
   "bn": "আল-মুখতাসার ৫ নং আয়াতকে বার্ধক্যের দুর্বলতা এবং স্বভাব বিকৃতকারীদের জাহান্নাম—উভয় অর্থে ব্যাখ্যা করেছে।"
  },
  "review": "checked",
  "src": [
   "https://quran.com/95/4-6",
   "https://quranenc.com/en/browse/bengali_mokhtasar/95#4"
  ]
 },
 {
  "seq": 148,
  "id": "d148",
  "s": 2,
  "surah": "Al-Baqarah",
  "a": 261,
  "b": 261,
  "theme": "knowledge",
  "why": "Charity grows like a grain producing seven ears.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/2/261",
   "https://quranenc.com/en/browse/bengali_mokhtasar/2#261"
  ]
 },
 {
  "seq": 149,
  "id": "d149",
  "s": 12,
  "surah": "Yusuf",
  "a": 111,
  "b": 111,
  "theme": "knowledge",
  "why": "The stories of the prophets are lessons for people of understanding.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/12/111",
   "https://quranenc.com/en/browse/bengali_mokhtasar/12#111"
  ]
 },
 {
  "seq": 150,
  "id": "d150",
  "s": 3,
  "surah": "Ali 'Imran",
  "a": 104,
  "b": 104,
  "theme": "knowledge",
  "why": "A community that invites to good.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/3/104",
   "https://quranenc.com/en/browse/bengali_mokhtasar/3#104"
  ]
 },
 {
  "seq": 151,
  "id": "d151",
  "s": 51,
  "surah": "Adh-Dhariyat",
  "a": 56,
  "b": 56,
  "theme": "purpose",
  "why": "The purpose of creation is worship.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/51/56",
   "https://quranenc.com/en/browse/bengali_mokhtasar/51#56"
  ]
 },
 {
  "seq": 152,
  "id": "d152",
  "s": 103,
  "surah": "Al-'Asr",
  "a": 1,
  "b": 3,
  "theme": "purpose",
  "why": "Al-'Asr: success through faith, good deeds, truth and patience.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/103/1-3",
   "https://quranenc.com/en/browse/bengali_mokhtasar/103#1"
  ]
 },
 {
  "seq": 153,
  "id": "d153",
  "s": 59,
  "surah": "Al-Hashr",
  "a": 18,
  "b": 19,
  "theme": "purpose",
  "why": "Look to what you have sent ahead for tomorrow.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/59/18-19",
   "https://quranenc.com/en/browse/bengali_mokhtasar/59#18"
  ]
 },
 {
  "seq": 154,
  "id": "d154",
  "s": 3,
  "surah": "Ali 'Imran",
  "a": 185,
  "b": 185,
  "theme": "purpose",
  "why": "Every soul will taste death; true success is in the Hereafter.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/3/185",
   "https://quranenc.com/en/browse/bengali_mokhtasar/3#185"
  ]
 },
 {
  "seq": 155,
  "id": "d155",
  "s": 57,
  "surah": "Al-Hadid",
  "a": 16,
  "b": 16,
  "theme": "purpose",
  "why": "Is it not time for hearts to soften to Allah's remembrance?",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/57/16",
   "https://quranenc.com/en/browse/bengali_mokhtasar/57#16"
  ]
 },
 {
  "seq": 156,
  "id": "d156",
  "s": 89,
  "surah": "Al-Fajr",
  "a": 27,
  "b": 30,
  "theme": "purpose",
  "why": "The soul at peace returns to its Lord.",
  "ctx": {
   "en": "Al-Mukhtasar: said to the believer's soul at death and on the Day of Resurrection.",
   "bn": "আল-মুখতাসার: মৃত্যু ও কিয়ামতের দিন মুমিনের আত্মাকে এ কথা বলা হবে।"
  },
  "review": "checked",
  "src": [
   "https://quran.com/89/27-30",
   "https://quranenc.com/en/browse/bengali_mokhtasar/89#27"
  ]
 },
 {
  "seq": 157,
  "id": "d157",
  "s": 99,
  "surah": "Az-Zalzalah",
  "a": 6,
  "b": 8,
  "theme": "purpose",
  "why": "Every atom's weight of good or evil will be seen.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/99/6-8",
   "https://quranenc.com/en/browse/bengali_mokhtasar/99#6"
  ]
 },
 {
  "seq": 158,
  "id": "d158",
  "s": 23,
  "surah": "Al-Mu'minun",
  "a": 115,
  "b": 115,
  "theme": "purpose",
  "why": "We were not created without purpose.",
  "ctx": {
   "en": "In context, a question put to those who denied the Hereafter (23:112–115).",
   "bn": "প্রসঙ্গ অনুযায়ী, আখিরাত অস্বীকারকারীদের প্রতি একটি প্রশ্ন (২৩:১১২–১১৫)।"
  },
  "review": "checked",
  "src": [
   "https://quran.com/23/115",
   "https://quranenc.com/en/browse/bengali_mokhtasar/23#115"
  ]
 },
 {
  "seq": 159,
  "id": "d159",
  "s": 18,
  "surah": "Al-Kahf",
  "a": 46,
  "b": 46,
  "theme": "purpose",
  "why": "Wealth and children adorn this life; lasting good deeds are better.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/18/46",
   "https://quranenc.com/en/browse/bengali_mokhtasar/18#46"
  ]
 },
 {
  "seq": 160,
  "id": "d160",
  "s": 87,
  "surah": "Al-A'la",
  "a": 14,
  "b": 17,
  "theme": "purpose",
  "why": "Success for whoever purifies himself and prays; the Hereafter is better and lasting.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/87/14-17",
   "https://quranenc.com/en/browse/bengali_mokhtasar/87#14"
  ]
 },
 {
  "seq": 161,
  "id": "d161",
  "s": 2,
  "surah": "Al-Baqarah",
  "a": 281,
  "b": 281,
  "theme": "purpose",
  "why": "Fear a day when every soul is repaid in full.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/2/281",
   "https://quranenc.com/en/browse/bengali_mokhtasar/2#281"
  ]
 },
 {
  "seq": 162,
  "id": "d162",
  "s": 112,
  "surah": "Al-Ikhlas",
  "a": 1,
  "b": 4,
  "theme": "purpose",
  "why": "Al-Ikhlas: the oneness of Allah.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/112/1-4",
   "https://quranenc.com/en/browse/bengali_mokhtasar/112#1"
  ]
 },
 {
  "seq": 163,
  "id": "d163",
  "s": 29,
  "surah": "Al-'Ankabut",
  "a": 64,
  "b": 64,
  "theme": "purpose",
  "why": "This worldly life is play; the Hereafter is true life.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/29/64",
   "https://quranenc.com/en/browse/bengali_mokhtasar/29#64"
  ]
 },
 {
  "seq": 164,
  "id": "d164",
  "s": 82,
  "surah": "Al-Infitar",
  "a": 6,
  "b": 8,
  "theme": "purpose",
  "why": "What has deceived you about your generous Lord?",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/82/6-8",
   "https://quranenc.com/en/browse/bengali_mokhtasar/82#6"
  ]
 },
 {
  "seq": 165,
  "id": "d165",
  "s": 3,
  "surah": "Ali 'Imran",
  "a": 133,
  "b": 133,
  "theme": "purpose",
  "why": "Hasten to forgiveness and a Garden as wide as the heavens and earth.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/3/133",
   "https://quranenc.com/en/browse/bengali_mokhtasar/3#133"
  ]
 },
 {
  "seq": 166,
  "id": "d166",
  "s": 55,
  "surah": "Ar-Rahman",
  "a": 26,
  "b": 27,
  "theme": "purpose",
  "why": "All will perish except the Face of your Lord.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/55/26-27",
   "https://quranenc.com/en/browse/bengali_mokhtasar/55#26"
  ]
 },
 {
  "seq": 167,
  "id": "d167",
  "s": 63,
  "surah": "Al-Munafiqun",
  "a": 10,
  "b": 10,
  "theme": "purpose",
  "why": "Give before death comes, while there is still time.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/63/10",
   "https://quranenc.com/en/browse/bengali_mokhtasar/63#10"
  ]
 },
 {
  "seq": 168,
  "id": "d168",
  "s": 18,
  "surah": "Al-Kahf",
  "a": 110,
  "b": 110,
  "theme": "purpose",
  "why": "Whoever hopes to meet his Lord, let him do good and worship Him alone.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/18/110",
   "https://quranenc.com/en/browse/bengali_mokhtasar/18#110"
  ]
 },
 {
  "seq": 169,
  "id": "d169",
  "s": 102,
  "surah": "At-Takathur",
  "a": 1,
  "b": 8,
  "theme": "purpose",
  "why": "At-Takathur: rivalry for more distracts until the grave.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/102/1-8",
   "https://quranenc.com/en/browse/bengali_mokhtasar/102#1"
  ]
 },
 {
  "seq": 170,
  "id": "d170",
  "s": 42,
  "surah": "Ash-Shuraa",
  "a": 36,
  "b": 36,
  "theme": "purpose",
  "why": "What we are given is passing comfort; what is with Allah is better.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/42/36",
   "https://quranenc.com/en/browse/bengali_mokhtasar/42#36"
  ]
 },
 {
  "seq": 171,
  "id": "d171",
  "s": 3,
  "surah": "Ali 'Imran",
  "a": 102,
  "b": 102,
  "theme": "purpose",
  "why": "Fear Allah as He should be feared and die only as Muslims.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/3/102",
   "https://quranenc.com/en/browse/bengali_mokhtasar/3#102"
  ]
 },
 {
  "seq": 172,
  "id": "d172",
  "s": 84,
  "surah": "Al-Inshiqaq",
  "a": 6,
  "b": 6,
  "theme": "purpose",
  "why": "Every person is toiling towards meeting their Lord.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/84/6",
   "https://quranenc.com/en/browse/bengali_mokhtasar/84#6"
  ]
 },
 {
  "seq": 173,
  "id": "d173",
  "s": 79,
  "surah": "An-Nazi'at",
  "a": 40,
  "b": 41,
  "theme": "purpose",
  "why": "Restraining the self from desire for fear of standing before one's Lord.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/79/40-41",
   "https://quranenc.com/en/browse/bengali_mokhtasar/79#40"
  ]
 },
 {
  "seq": 174,
  "id": "d174",
  "s": 6,
  "surah": "Al-An'am",
  "a": 162,
  "b": 163,
  "theme": "purpose",
  "why": "My prayer, sacrifice, living and dying are for Allah.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/6/162-163",
   "https://quranenc.com/en/browse/bengali_mokhtasar/6#162"
  ]
 },
 {
  "seq": 175,
  "id": "d175",
  "s": 74,
  "surah": "Al-Muddaththir",
  "a": 38,
  "b": 38,
  "theme": "purpose",
  "why": "Every soul is held in pledge for what it has earned.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/74/38",
   "https://quranenc.com/en/browse/bengali_mokhtasar/74#38"
  ]
 },
 {
  "seq": 176,
  "id": "d176",
  "s": 28,
  "surah": "Al-Qasas",
  "a": 77,
  "b": 77,
  "theme": "purpose",
  "why": "Seek the Hereafter with what you are given without neglecting this world.",
  "ctx": {
   "en": "Advice given to Qarun (Korah) by the believers among his people.",
   "bn": "কারূনকে তার জাতির মুমিনরা এই উপদেশ দিয়েছিল।"
  },
  "review": "checked",
  "src": [
   "https://quran.com/28/77",
   "https://quranenc.com/en/browse/bengali_mokhtasar/28#77"
  ]
 },
 {
  "seq": 177,
  "id": "d177",
  "s": 17,
  "surah": "Al-Isra",
  "a": 13,
  "b": 14,
  "theme": "purpose",
  "why": "Each person's record will be read on the Day of Resurrection.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/17/13-14",
   "https://quranenc.com/en/browse/bengali_mokhtasar/17#13"
  ]
 },
 {
  "seq": 178,
  "id": "d178",
  "s": 2,
  "surah": "Al-Baqarah",
  "a": 110,
  "b": 110,
  "theme": "purpose",
  "why": "Prayer and zakat; good sent ahead is found with Allah.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/2/110",
   "https://quranenc.com/en/browse/bengali_mokhtasar/2#110"
  ]
 },
 {
  "seq": 179,
  "id": "d179",
  "s": 113,
  "surah": "Al-Falaq",
  "a": 1,
  "b": 5,
  "theme": "purpose",
  "why": "Al-Falaq: seeking refuge with the Lord of daybreak.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/113/1-5",
   "https://quranenc.com/en/browse/bengali_mokhtasar/113#1"
  ]
 },
 {
  "seq": 180,
  "id": "d180",
  "s": 114,
  "surah": "An-Nas",
  "a": 1,
  "b": 6,
  "theme": "purpose",
  "why": "An-Nas: seeking refuge with the Lord of mankind.",
  "ctx": null,
  "review": "checked",
  "src": [
   "https://quran.com/114/1-6",
   "https://quranenc.com/en/browse/bengali_mokhtasar/114#1"
  ]
 }
];
  const dayNumber = (y, m, d) => Math.round((Date.UTC(y, m - 1, d) - Date.UTC(ANCHOR[0], ANCHOR[1] - 1, ANCHOR[2])) / 864e5);
  function indexFor(y, m, d) { return ((dayNumber(y, m, d) % CYCLE) + CYCLE) % CYCLE; }
  function entryFor(y, m, d) { return SCHEDULE[indexFor(y, m, d)]; }
  const themeOf = e => THEMES.find(t => t.id === e.theme);
  return { ANCHOR, CYCLE, THEMES, SCHEDULE, dayNumber, indexFor, entryFor, themeOf };
});
