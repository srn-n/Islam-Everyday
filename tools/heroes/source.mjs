// Source list for assets/heroes.js (built by tools/heroes/build.mjs). Nov 2026.
// q: Qur'an verses by reference only; the build copies the text, unchanged, from data/quran (English: Pickthall,
//    Bangla: Dr. Abu Bakr Muhammad Zakaria, including the translator's footnote markers).
// h: a hadith, given as its meaning in plain English and everyday Bangla, written for this app from the Arabic at
//    the reference (checked on sunnah.com, 10 Nov 2026). These are NOT word-for-word quotations of a published
//    translation and have not been reviewed by a scholar; the app says so beside them. g: grade as given at the source.
const q = (s, a, b) => ({ q: [s, a, b || a] });
const h = (ref, refBn, url, en, bn, g) => ({ h: { ref, refBn, url, en, bn, g: g || "" } });
const SM = "Sahih Muslim", SB = "Sahih al-Bukhari", SMb = "সহিহ মুসলিম", SBb = "সহিহ বুখারি";

export const PRAYER = {
  fajr: [
    q(17, 78),
    h(`${SM} 725`, `${SMb} ৭২৫`, "https://sunnah.com/muslim:725a", "The two rak'ahs of Fajr are better than this world and everything in it.", "ফজরের দুই রাকাত (সুন্নাত) দুনিয়া আর দুনিয়ার সবকিছুর চেয়ে উত্তম।"),
    h(`${SM} 657`, `${SMb} ৬৫৭`, "https://sunnah.com/muslim:657a", "Whoever prays the dawn prayer is under the protection of Allah.", "যে ফজরের নামাজ পড়ল, সে আল্লাহর জিম্মায় চলে গেল।"),
    h(`${SB} 574`, `${SBb} ৫৭৪`, "https://sunnah.com/bukhari:574", "Whoever prays the two cool prayers (Fajr and Asr) will enter Paradise.", "যে দুই ঠান্ডা সময়ের নামাজ (ফজর ও আসর) পড়বে, সে জান্নাতে যাবে।"),
    h(`${SM} 634`, `${SMb} ৬৩৪`, "https://sunnah.com/muslim:634a", "No one who prays before the sun rises and before it sets will enter the Fire.", "যে সূর্য ওঠার আগে আর সূর্য ডোবার আগে নামাজ পড়ে, সে জাহান্নামে যাবে না।"),
    q(20, 130),
    h(`${SB} 1142`, `${SBb} ১১৪২`, "https://sunnah.com/bukhari:1142", "When you sleep, Satan ties three knots at the back of your head. If you wake and remember Allah, one knot comes undone; if you make wudu, another; and if you pray, the last one does, and you start the morning lively and in good spirits.", "ঘুমালে শয়তান মাথার পেছনে তিনটা গিঁট দেয়। জেগে উঠে আল্লাহকে স্মরণ করলে একটা গিঁট খুলে যায়, অজু করলে আরেকটা, আর নামাজ পড়লে শেষটাও খুলে যায়; তখন সকালটা শুরু হয় প্রাণবন্ত আর ভালো মনে।"),
    h(`${SB} 554`, `${SBb} ৫৫৪`, "https://sunnah.com/bukhari:554", "Looking at the full moon, the Prophet ﷺ said: “You will see your Lord as you see this moon. So if you can, do not let anything keep you from a prayer before sunrise and a prayer before sunset.”", "পূর্ণিমার চাঁদের দিকে তাকিয়ে নবী ﷺ বললেন: “এই চাঁদকে যেমন দেখছ, তেমনি তোমরা তোমাদের রবকে দেখবে। তাই পারলে সূর্য ওঠার আগের নামাজ আর সূর্য ডোবার আগের নামাজ কোনো কিছুর কারণে ছুটতে দিয়ো না।”"),
    q(52, 49)
  ],
  dhuhr: [
    q(4, 103),
    h("Jami` at-Tirmidhi 478", "জামে তিরমিজি ৪৭৮", "https://sunnah.com/tirmidhi:478", "Of the time just after the sun passes its height, before Dhuhr: “It is an hour in which the gates of heaven are opened, and I love that a good deed of mine should rise in it.”", "সূর্য ঢলে পড়ার পর, যোহরের আগের সময়টা নিয়ে: “এটা এমন এক সময়, যখন আসমানের দরজাগুলো খুলে দেওয়া হয়; আর আমি চাই এ সময়ে আমার একটা নেক আমল ওপরে উঠুক।”", "Sahih"),
    q(30, 17, 18),
    h("Jami` at-Tirmidhi 428", "জামে তিরমিজি ৪২৮", "https://sunnah.com/tirmidhi:428", "Whoever keeps up four rak'ahs before Dhuhr and four after it, Allah forbids him to the Fire.", "যে যোহরের আগে চার রাকাত আর পরে চার রাকাত নিয়মিত পড়ে, আল্লাহ তাকে জাহান্নামের জন্য হারাম করে দেন।", "Sahih"),
    h(`${SB} 527`, `${SBb} ৫২৭`, "https://sunnah.com/bukhari:527", "The Prophet ﷺ was asked which deed Allah loves most. He said: “Prayer at its proper time.”", "নবী ﷺ-কে জিজ্ঞেস করা হলো, কোন আমল আল্লাহর সবচেয়ে প্রিয়? তিনি বললেন: “সময়মতো নামাজ পড়া।”"),
    h(`${SB} 528`, `${SBb} ৫২৮`, "https://sunnah.com/bukhari:528", "If a river ran past your door and you bathed in it five times a day, would any dirt be left on you? That is how the five prayers are: Allah wipes away wrongdoing with them.", "তোমার দরজার সামনে দিয়ে যদি একটা নদী বয়ে যায় আর তুমি দিনে পাঁচবার তাতে গোসল করো, তোমার গায়ে কি কোনো ময়লা থাকবে? পাঁচ ওয়াক্ত নামাজও তেমন: এ দিয়ে আল্লাহ গুনাহ মুছে দেন।"),
    h(`${SB} 536`, `${SBb} ৫৩৬`, "https://sunnah.com/bukhari:536", "When the heat is intense, wait to pray Dhuhr until it is a little cooler, for the fierceness of the heat is from the breath of Hell.", "খুব গরম পড়লে একটু ঠান্ডা হওয়া পর্যন্ত যোহর দেরি করে পড়ো, কারণ প্রচণ্ড গরম জাহান্নামের নিঃশ্বাস থেকে।"),
    q(29, 45),
    q(20, 14)
  ],
  asr: [
    q(2, 238),
    h(`${SB} 553`, `${SBb} ৫৫৩`, "https://sunnah.com/bukhari:553", "Whoever leaves the Asr prayer, his deeds are lost.", "যে আসরের নামাজ ছেড়ে দেয়, তার আমল নষ্ট হয়ে যায়।"),
    q(103, 1, 3),
    h(`${SB} 552`, `${SBb} ৫৫২`, "https://sunnah.com/bukhari:552", "Whoever misses the Asr prayer, it is as if he has lost his family and his wealth.", "যার আসরের নামাজ ছুটে গেল, সে যেন তার পরিবার আর সম্পদ সব হারিয়ে ফেলল।"),
    h(`${SB} 555`, `${SBb} ৫৫৫`, "https://sunnah.com/bukhari:555", "Angels of the night and angels of the day come to you in turns, and they meet at the Fajr prayer and the Asr prayer.", "রাতের ফেরেশতা আর দিনের ফেরেশতারা পালা করে তোমাদের কাছে আসেন, আর ফজর ও আসরের নামাজে তাঁরা একসাথে হন।"),
    q(50, 39),
    q(2, 153),
    h(`${SM} 251`, `${SMb} ২৫১`, "https://sunnah.com/muslim:251a", "Shall I tell you what Allah wipes out sins with and raises ranks by? Making wudu well when it is hard, taking many steps to the mosque, and waiting for the next prayer after a prayer. That is standing guard.", "আমি কি বলব না, কী দিয়ে আল্লাহ গুনাহ মুছে দেন আর মর্যাদা বাড়িয়ে দেন? কষ্টের সময়েও ভালো করে অজু করা, মসজিদের দিকে বেশি কদম ফেলা, আর এক নামাজের পর পরের নামাজের অপেক্ষা করা। এটাই হলো পাহারায় থাকা।")
  ],
  maghrib: [
    q(11, 114),
    h("Sunan Abi Dawud 418", "সুনান আবু দাউদ ৪১৮", "https://sunnah.com/abudawud:418", "My community will stay upon good as long as they do not delay Maghrib until the stars come out thickly.", "আমার উম্মত ততদিন কল্যাণের ওপর থাকবে, যতদিন তারা মাগরিবকে আকাশ তারায় ভরে যাওয়া পর্যন্ত দেরি না করবে।", "Hasan Sahih"),
    q(33, 41, 42),
    q(76, 25),
    q(30, 17, 18),
    h(`${SB} 1183`, `${SBb} ১১৮৩`, "https://sunnah.com/bukhari:1183", "Pray before Maghrib. He said it three times, and the third time added: “for whoever wishes”, so that people would not take it as a fixed duty.", "মাগরিবের আগে নামাজ পড়ো। তিনি এ কথা তিনবার বললেন, আর তৃতীয়বার যোগ করলেন: “যে চায়”, যাতে মানুষ একে বাধ্যতামূলক নিয়ম মনে না করে।"),
    h("Sunan Abi Dawud 521", "সুনান আবু দাউদ ৫২১", "https://sunnah.com/abudawud:521", "A dua made between the adhan and the iqamah is not turned away.", "আজান আর ইকামতের মাঝে করা দোয়া ফিরিয়ে দেওয়া হয় না।", "Sahih"),
    q(40, 55)
  ],
  isha: [
    h(`${SM} 656`, `${SMb} ৬৫৬`, "https://sunnah.com/muslim:656a", "Whoever prays Isha in congregation, it is as if he stood in prayer for half the night; and whoever prays Fajr in congregation, it is as if he prayed the whole night.", "যে জামাতে এশার নামাজ পড়ল, সে যেন অর্ধেক রাত নামাজে দাঁড়িয়ে থাকল; আর যে জামাতে ফজর পড়ল, সে যেন সারা রাত নামাজ পড়ল।"),
    q(76, 26),
    h(`${SB} 657`, `${SBb} ৬৫৭`, "https://sunnah.com/bukhari:657", "No prayer is heavier on the hypocrites than Fajr and Isha. If they knew what is in them, they would come even if they had to crawl.", "মুনাফিকদের কাছে ফজর আর এশার চেয়ে ভারী কোনো নামাজ নেই। এ দুটোতে কী আছে তা যদি তারা জানত, তাহলে হামাগুড়ি দিয়ে হলেও আসত।"),
    q(17, 79),
    q(50, 40),
    h(`${SM} 1163`, `${SMb} ১১৬৩`, "https://sunnah.com/muslim:1163a", "After the obligatory prayers, the best prayer is the prayer in the night.", "ফরজ নামাজের পর সবচেয়ে উত্তম নামাজ হলো রাতের নামাজ।"),
    h(`${SB} 568`, `${SBb} ৫৬৮`, "https://sunnah.com/bukhari:568", "The Prophet ﷺ disliked sleeping before Isha and talking after it.", "নবী ﷺ এশার আগে ঘুমানো আর এশার পরে গল্পগুজব করা অপছন্দ করতেন।"),
    q(32, 16),
    q(73, 6)
  ],
  jumuah: [
    q(62, 9),
    h(`${SM} 854`, `${SMb} ৮৫৪`, "https://sunnah.com/muslim:854b", "The best day on which the sun rises is Friday. On it Adam was created, on it he was admitted to Paradise, and on it he was sent out of it.", "যত দিনে সূর্য ওঠে, তার মধ্যে সেরা দিন জুমআর দিন। এ দিনেই আদমকে সৃষ্টি করা হয়েছে, এ দিনেই তাঁকে জান্নাতে নেওয়া হয়েছে, আর এ দিনেই তাঁকে সেখান থেকে বের করা হয়েছে।"),
    h(`${SM} 233`, `${SMb} ২৩৩`, "https://sunnah.com/muslim:233c", "The five daily prayers, Friday to Friday and Ramadan to Ramadan wipe out what comes between them, as long as the major sins are avoided.", "পাঁচ ওয়াক্ত নামাজ, এক জুমআ থেকে আরেক জুমআ, এক রমজান থেকে আরেক রমজান — মাঝের সময়ের গুনাহ মুছে দেয়, যদি কবিরা গুনাহ থেকে বেঁচে থাকা হয়।"),
    q(62, 10),
    h(`${SB} 935`, `${SBb} ৯৩৫`, "https://sunnah.com/bukhari:935", "On Friday there is an hour in which, if a Muslim stands in prayer and asks Allah for something, Allah gives it to him.", "জুমআর দিনে এমন একটা সময় আছে, তখন কোনো মুসলিম নামাজে দাঁড়িয়ে আল্লাহর কাছে কিছু চাইলে আল্লাহ তাকে তা দিয়ে দেন।"),
    h(`${SM} 857`, `${SMb} ৮৫৭`, "https://sunnah.com/muslim:857b", "Whoever makes wudu well, then comes to the Friday prayer and listens in silence, is forgiven what lies between that Friday and the next, and three days more.", "যে সুন্দর করে অজু করে, তারপর জুমআয় এসে চুপ করে মন দিয়ে শোনে, তার এই জুমআ থেকে পরের জুমআ পর্যন্ত, আর বাড়তি তিন দিনের গুনাহ মাফ করে দেওয়া হয়।"),
    h(`${SB} 883`, `${SBb} ৮৮৩`, "https://sunnah.com/bukhari:883", "Whoever bathes on Friday, cleans himself as well as he can, puts on oil or perfume, comes to the mosque without pushing between two people, prays what is written for him and listens quietly while the imam speaks, is forgiven what lies between that Friday and the one before.", "যে জুমআর দিন গোসল করে, যতটা পারে পরিচ্ছন্ন হয়, তেল বা সুগন্ধি লাগায়, তারপর দুজনের মাঝে ঠেলাঠেলি না করে মসজিদে আসে, তার জন্য যা নির্ধারিত তা পড়ে, আর ইমাম কথা বললে চুপ করে শোনে, তার এই জুমআ আর আগের জুমআর মাঝের গুনাহ মাফ করে দেওয়া হয়।"),
    h(`${SB} 881`, `${SBb} ৮৮১`, "https://sunnah.com/bukhari:881", "Whoever bathes on Friday and goes in the first hour is like one who offers a camel; in the second hour, a cow; in the third, a horned ram; in the fourth, a hen; in the fifth, an egg. When the imam comes out, the angels come in to listen to the reminder.", "যে জুমআর দিন গোসল করে প্রথম প্রহরে যায়, সে যেন একটা উট কুরবানি করল; দ্বিতীয় প্রহরে গেলে গরু; তৃতীয় প্রহরে শিংওয়ালা দুম্বা; চতুর্থ প্রহরে মুরগি; পঞ্চম প্রহরে একটা ডিম। ইমাম বের হলে ফেরেশতারা খুতবা শুনতে ভেতরে চলে আসেন।"),
    h("Sunan Abi Dawud 1047", "সুনান আবু দাউদ ১০৪৭", "https://sunnah.com/abudawud:1047", "Friday is among the best of your days, so send many blessings on me on that day, for your blessings are shown to me.", "জুমআর দিন তোমাদের সেরা দিনগুলোর একটা, তাই এ দিনে আমার ওপর বেশি বেশি দরুদ পড়ো, কারণ তোমাদের দরুদ আমার কাছে পেশ করা হয়।", "Sahih")
  ]
};

// Hadith page hero: learning hadith and passing it on (the "forty hadith" narration is graded weak, so it is not used).
export const HADITH_HERO = h("Sunan Abi Dawud 3660", "সুনান আবু দাউদ ৩৬৬০", "https://sunnah.com/abudawud:3660",
  "May Allah brighten the face of a person who hears a hadith from us, memorises it and passes it on to others. Many a carrier of knowledge takes it to someone who understands it better than he does.",
  "আল্লাহ সেই মানুষের চেহারা উজ্জ্বল করুন, যে আমাদের কাছ থেকে একটা হাদিস শুনল, তা মুখস্থ রাখল, তারপর অন্যের কাছে পৌঁছে দিল। অনেক সময় জ্ঞান বহনকারী তা এমন কারও কাছে পৌঁছে দেয়, যে তার চেয়ে ভালো বোঝে।", "Sahih").h;

// Qur'an page hero: understanding and reflecting, not only reading or listening. One per week, in this order.
export const QURAN = [
  q(38, 29), q(47, 24), q(4, 82), q(54, 17), q(12, 2),
  h(`${SB} 5027`, `${SBb} ৫০২৭`, "https://sunnah.com/bukhari:5027", "The best of you are those who learn the Qur'an and teach it.", "তোমাদের মধ্যে সেরা সে, যে কুরআন শেখে আর অন্যকে শেখায়।"),
  q(16, 44), q(2, 121), q(25, 30), q(59, 21), q(8, 2),
  h(`${SM} 2699`, `${SMb} ২৬৯৯`, "https://sunnah.com/muslim:2699a", "Whenever people gather in one of the houses of Allah, reciting the Book of Allah and studying it together, calm comes down on them, mercy covers them, the angels surround them, and Allah mentions them to those who are with Him.", "যখনই কিছু মানুষ আল্লাহর কোনো ঘরে একসাথে হয়ে আল্লাহর কিতাব পড়ে আর নিজেদের মধ্যে তা নিয়ে চর্চা করে, তখন তাদের ওপর প্রশান্তি নেমে আসে, রহমত তাদের ঢেকে নেয়, ফেরেশতারা তাদের ঘিরে রাখেন, আর আল্লাহ তাঁর কাছের ফেরেশতাদের সামনে তাদের কথা বলেন।"),
  q(39, 23), q(17, 9), q(7, 204), q(73, 4), q(10, 57), q(14, 1)
];
