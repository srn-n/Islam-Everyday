/* Islam Everyday — Hadith library (Phase 5).
 *
 * 40 narrations from Sahih al-Bukhari and Sahih Muslim (24 from Phase 5, 16 added in Phase 5.3), each stored once with the
 * categories it belongs to. An-Nawawi's Forty Hadith is a separate collection in assets/nawawi.js.
 * Arabic, English and Bangla texts, attribution and grade are reproduced unchanged from HadeethEnc.com; see SOURCE.
 * refs: the collection and number on sunnah.com. wording: "shown" (the text given here), "close" (a few words
 * differ), "similar" (same meaning, different wording). note: an editorial note on the references, kept apart
 * from the hadith text. review: "source-checked" means checked against the two sources, not reviewed by a scholar.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.IE_HADITH = api;
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";
  const SOURCE = {
  "publisher": "HadeethEnc.com (Encyclopedia of Translated Prophetic Hadiths)",
  "texts": "Arabic text, English translation, Bangla translation, attribution and grade are reproduced unchanged from HadeethEnc.com (API v1), retrieved 2026-10-17. Characters are stored in Unicode NFC form (canonically identical text).",
  "terms": "HadeethEnc republication terms: (1) no modification, addition or deletion of the content; (2) clearly refer to the publisher and the source (HadeethEnc.com); (3) mention the version number; (4) keep the transcript information; (5) notify HadeethEnc.com of any note on the translation; (6) update to the latest version; (7) no inappropriate advertisements.",
  "version": "HadeethEnc's API does not expose a version number for these entries; the retrieval date is recorded instead.",
  "verification": "Each collection reference was opened on sunnah.com and the Arabic wording compared with the HadeethEnc text (see each record's refs: 'shown' = the wording given, 'close' = small word differences, 'similar' = same meaning, different wording). Only narrations in Sahih al-Bukhari or Sahih Muslim, graded Authentic by HadeethEnc, are included.",
  "review": "source-checked: reference, collection, wording and grade checked against sunnah.com and HadeethEnc.com. Not reviewed by a qualified scholar.",
  "categories": "Category links are an editorial choice made for this app, not part of the sources."
};
  const CATEGORIES = [["sad", "When You Feel Sad", "মন খারাপ হলে"], ["alone", "When You Feel Alone", "একা লাগলে"], ["hope", "When You Need Hope", "আশার প্রয়োজন হলে"], ["reassure", "When You Need Reassurance", "দুশ্চিন্তা হলে"], ["motivation", "When You Need Motivation", "অনুপ্রেরণা প্রয়োজন হলে"], ["grateful", "When You Feel Grateful", "কৃতজ্ঞতা অনুভব করলে"], ["faith", "Strengthening Your Faith", "ঈমান মজবুত করতে"], ["guidance", "When You Need Guidance", "সঠিক পথের দিশা পেতে"], ["knowledge", "Seeking Knowledge", "ইসলাম সম্পর্কে জানতে"], ["patience", "When You Need Patience", "ধৈর্যের প্রয়োজন হলে"], ["better", "Becoming a Better Person", "উত্তম মানুষ হতে"], ["dhikr", "Daily Worship and Dhikr", "দৈনন্দিন ইবাদত ও যিকির"]];
  const COLLECTIONS = { bukhari: { en: "Sahih al-Bukhari", bn: "সহীহ বুখারী" }, muslim: { en: "Sahih Muslim", bn: "সহীহ মুসলিম" } };
  const HADITH = [
 {
  "id": "h01",
  "he": 3298,
  "cats": [
   "sad",
   "reassure",
   "grateful",
   "patience"
  ],
  "narrator": {
   "en": "Suhayb",
   "bn": "সুহাইব"
  },
  "refs": [
   {
    "c": "muslim",
    "n": "2999",
    "url": "https://sunnah.com/muslim:2999",
    "wording": "shown"
   }
  ],
  "grade": {
   "collection": {
    "en": "Sahih: in Sahih Muslim",
    "bn": "সহীহ: সহীহ মুসলিম-তে বর্ণিত"
   },
   "he": {
    "en": "Authentic",
    "bn": "সহীহ",
    "ar": "صحيح"
   }
  },
  "attribution": {
   "en": "Narrated by Muslim",
   "bn": "ইমাম মুসলিম এটি বর্ণনা করেছেন",
   "ar": "رواه مسلم"
  },
  "ar": "عَنْ صُهَيْبٍ رضي الله عنه قَالَ: قَالَ رَسُولُ اللهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ: «عَجَبًا لِأَمْرِ الْمُؤْمِنِ، إِنَّ أَمْرَهُ كُلَّهُ خَيْرٌ، وَلَيْسَ ذَاكَ لِأَحَدٍ إِلَّا لِلْمُؤْمِنِ، إِنْ أَصَابَتْهُ سَرَّاءُ شَكَرَ، فَكَانَ خَيْرًا لَهُ، وَإِنْ أَصَابَتْهُ ضَرَّاءُ صَبَرَ، فَكَانَ خَيْرًا لَهُ».",
  "en": "Sohaib (may Allah be pleased with him) reported: The Messenger of Allah (may Allah's peace and blessings be upon him) said: \"How astonishing the believer's affair is! Indeed, all of his affairs are good, and this is for none but the believer. If something good happens to him, he is grateful, which is good for him; and if something bad happens to him, he shows patience, which is good for him.\"",
  "bn": "সুহাইব রদিয়াল্লাহু আনহু থেকে বর্ণিত, তিনি বলেন: আল্লাহর রাসূল সাল্লাল্লাহু আলাইহি ওয়াসাল্লাম বলেছেন: عَجَبًا لِأَمْرِ الْمُؤْمِنِ، إِنَّ أَمْرَهُ كُلَّهُ خَيْرٌ، وَلَيْسَ ذَاكَ لِأَحَدٍ إِلَّا لِلْمُؤْمِنِ، إِنْ أَصَابَتْهُ سَرَّاءُ شَكَرَ، فَكَانَ خَيْرًا لَهُ، وَإِنْ أَصَابَتْهُ ضَرَّاءُ صَبَرَ، فَكَانَ خَيْرًا لَهُ : “মুমিনের ব্যাপার আশ্চর্যজনক। অবশ্যই তার সকল বিষয় তার জন্য কল্যাণময়। আর এটি মুমিন ছাড়া অন্য কারো জন্য হতে পারে না। যদি তার কোন আনন্দ আসে, তবে সে শুকরিয়া আদায় করে, যা তার জন্য কল্যাণময়। আর যদি তার উপরে কোন দুঃখজনক কিছু আপতিত হয়, তাহলে সে সবর করে, সেটাও তার জন্য কল্যাণকর হয়।”",
  "source": {
   "en": "https://hadeethenc.com/en/browse/hadith/3298",
   "bn": "https://hadeethenc.com/bn/browse/hadith/3298"
  },
  "note": null,
  "review": "source-checked"
 },
 {
  "id": "h02",
  "he": 3636,
  "cats": [
   "alone",
   "hope",
   "dhikr"
  ],
  "narrator": {
   "en": "Abu Hurayrah",
   "bn": "আবূ হুরায়রা"
  },
  "refs": [
   {
    "c": "bukhari",
    "n": "7405",
    "url": "https://sunnah.com/bukhari:7405",
    "wording": "close"
   },
   {
    "c": "muslim",
    "n": "2675a",
    "url": "https://sunnah.com/muslim:2675a",
    "wording": "close"
   }
  ],
  "grade": {
   "collection": {
    "en": "Sahih: in Sahih al-Bukhari and Sahih Muslim",
    "bn": "সহীহ: সহীহ বুখারী ও সহীহ মুসলিম-তে বর্ণিত"
   },
   "he": {
    "en": "Authentic",
    "bn": "সহীহ",
    "ar": "صحيح"
   }
  },
  "attribution": {
   "en": "Agreed upon",
   "bn": "সহীহ বুখারী ও মুসলিম",
   "ar": "متفق عليه"
  },
  "ar": "عَنْ أَبِي هُرَيْرَةَ رضي الله عنه قَالَ: قَالَ رَسُولُ اللهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ: «يَقُولُ اللهُ عَزَّ وَجَلَّ: أَنَا عِنْدَ ظَنِّ عَبْدِي، وَأَنَا مَعَهُ حِينَ يَذْكُرُنِي، فَإِنْ ذَكَرَنِي فِي نَفْسِهِ ذَكَرْتُهُ فِي نَفْسِي، وَإِنْ ذَكَرَنِي فِي مَلَإٍ ذَكَرْتُهُ فِي مَلَإٍ خَيْرٍ مِنْهُ، وَإِنِ اقْتَرَبَ إِلَيَّ شِبْرًا، تَقَرَّبْتُ إِلَيْهِ ذِرَاعًا، وَإِنِ اقْتَرَبَ إِلَيَّ ذِرَاعًا، اقْتَرَبْتُ إِلَيْهِ بَاعًا، وَإِنْ أَتَانِي يَمْشِي أَتَيْتُهُ هَرْوَلَةً».",
  "en": "Abu Hurayrah (may Allah be pleased with him) reported: The Messenger of Allah (may Allah's peace and blessings be upon him) said: \"Allah, the Exalted and Majestic, says: I am as My slave thinks of Me and I am with him when he remembers Me. If he remembers Me within himself, I remember him within Myself; and if he remembers me in an assembly, I remember him in a better assembly. If he draws near to Me by a handspan, I draw near to him by a cubit; and if he draws near to Me by a cubit, I draw near to him by a fathom, and if he comes to Me walking, I come to him jogging.\"",
  "bn": "আবূ হুরাইরাহ রদিয়াল্লাহু ‘আনহু হতে বর্ণিত, তিনি বলেন: রাসূলুল্লাহ সাল্লাল্লাহু আলাইহি ওয়াসাল্লাম বলেছেন: “আল্লাহ্ ঘোষণা করেন: আমি সে রকমই, যে রকম বান্দা আমার প্রতি ধারণা রাখে। আমি বান্দার সঙ্গে থাকি যখন সে আমাকে স্মরণ করে। যদি সে মনে মনে আমাকে স্মরণ করে; আমিও তাকে নিজে স্মরণ করি। আর যদি সে জন-সমাবেশে আমাকে স্মরণ করে, তবে আমিও তাদের চেয়ে উত্তম সমাবেশে তাকে স্মরণ করি। যদি সে আমার দিকে এক বিঘত এগিয়ে আসে, তবে আমি তার দিকে এক হাত এগিয়ে যাই, যদি সে আমার দিকে এক হাত অগ্রসর হয়; আমি তার দিকে দু’ হাত এগিয়ে যাই। আর সে যদি আমার দিকে হেঁটে আসে, আমি তার দিকে দৌড়ে যাই”।",
  "source": {
   "en": "https://hadeethenc.com/en/browse/hadith/3636",
   "bn": "https://hadeethenc.com/bn/browse/hadith/3636"
  },
  "note": {
   "en": "HadeethEnc gives this as agreed upon; its Arabic wording differs in a few words from each of Bukhari 7405 and Muslim 2675a (for example اقترب / تقرب).",
   "bn": "হাদীসএনসাইক্লোপিডিয়া এটিকে মুত্তাফাকুন আলাইহি বলেছে; এর আরবি শব্দে বুখারী ৭৪০৫ ও মুসলিম ২৬৭৫a-র সঙ্গে কয়েকটি শব্দের পার্থক্য আছে (যেমন اقترب / تقرب)।"
  },
  "review": "source-checked"
 },
 {
  "id": "h03",
  "he": 4801,
  "cats": [
   "better",
   "knowledge",
   "alone"
  ],
  "narrator": {
   "en": "Abu Hurayrah",
   "bn": "আবূ হুরায়রা"
  },
  "refs": [
   {
    "c": "muslim",
    "n": "2699a",
    "url": "https://sunnah.com/muslim:2699a",
    "wording": "shown"
   }
  ],
  "grade": {
   "collection": {
    "en": "Sahih: in Sahih Muslim",
    "bn": "সহীহ: সহীহ মুসলিম-তে বর্ণিত"
   },
   "he": {
    "en": "Authentic",
    "bn": "সহীহ",
    "ar": "صحيح"
   }
  },
  "attribution": {
   "en": "Narrated by Muslim",
   "bn": "ইমাম মুসলিম এটি বর্ণনা করেছেন",
   "ar": "رواه مسلم"
  },
  "ar": "عَنْ أَبِي هُرَيْرَةَ رضي الله عنه قَالَ: قَالَ رَسُولُ اللهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ: «مَنْ نَفَّسَ عَنْ مُؤْمِنٍ كُرْبَةً مِنْ كُرَبِ الدُّنْيَا نَفَّسَ اللهُ عَنْهُ كُرْبَةً مِنْ كُرَبِ يَوْمِ الْقِيَامَةِ، وَمَنْ يَسَّرَ عَلَى مُعْسِرٍ يَسَّرَ اللهُ عَلَيْهِ فِي الدُّنْيَا وَالْآخِرَةِ، وَمَنْ سَتَرَ مُسْلِمًا سَتَرَهُ اللهُ فِي الدُّنْيَا وَالْآخِرَةِ، وَاللهُ فِي عَوْنِ الْعَبْدِ مَا كَانَ الْعَبْدُ فِي عَوْنِ أَخِيهِ، وَمَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ، وَمَا اجْتَمَعَ قَوْمٌ فِي بَيْتٍ مِنْ بُيُوتِ اللهِ يَتْلُونَ كِتَابَ اللهِ وَيَتَدَارَسُونَهُ بَيْنَهُمْ إِلَّا نَزَلَتْ عَلَيْهِمِ السَّكِينَةُ، وَغَشِيَتْهُمُ الرَّحْمَةُ، وَحَفَّتْهُمُ الْمَلَائِكَةُ، وَذَكَرَهُمُ اللهُ فِيمَنْ عِنْدَهُ، وَمَنْ بَطَّأَ بِهِ عَمَلُهُ لَمْ يُسْرِعْ بِهِ نَسَبُهُ».",
  "en": "Abu Hurayrah (may Allah be pleased with him) reported: The Messenger of Allah (may Allah's peace and blessings be upon him) said: \"Whoever relieves a believer from one of the hardships of this world, Allah will relieve him from one of the hardships of the Day of Judgment. Whoever makes things easy for someone in difficulty, Allah will make things easy for him in this world and the Hereafter. Whoever covers a Muslim, Allah will cover him in this world and the Hereafter. Allah is in the aid of the slave as long as the slave is in the aid of his brother. Whoever treads a path seeking knowledge, Allah will make easy for him a path to Paradise. No group of people gather in one of the houses of Allah, reciting the Book of Allah and studying it among themselves, except that tranquility descends upon them, mercy envelops them, the angels surround them, and Allah mentions them to those near Him. And whoever is slowed down by his deeds will not be hastened forward by his lineage.\"",
  "bn": "আবূ হুরাইরা রদিয়াল্লাহু ‘আনহু থেকে বর্ণিত, তিনি বলেন: রাসূলুল্লাহ সাল্লাল্লাহু ‘আলাইহি ওয়াসাল্লাম বলেছেন: “যে ব্যক্তি কোনো মুসলিমের কোনো পার্থিব দুর্ভোগ দূরীভূত করবে, আল্লাহ তার থেকে কিয়ামতের দিনের দুর্ভোগসমূহের মধ্যে কোনো একটি দুর্ভোগ দূর করবেন। আর যে ব্যক্তি কোনো সংকটে পতিত ব্যক্তির  প্রতি সহজ করবে, আল্লাহ দুনিয়া ও আখেরাতে তার প্রতি সহজ করবেন। আর যে ব্যক্তি কোনো মুসলিমের দোষ-ত্রুটি গোপন রাখবে, আল্লাহ তা‘আলা দুনিয়া ও আখেরাতে তার দোষ-ত্রুটি গোপন রাখবেন। আর যতক্ষণ পর্যন্ত বান্দা তার মুসলিম ভাইয়ের সহযোগিতা করতে থাকে, আল্লাহও সে বান্দার সাহায্য করতে থাকেন। যে ব্যক্তি এমন পথে চলে- যাতে সে (দ্বীনের) বিদ্যা অর্জন করে, তার জন্য আল্লাহ জান্নাতের পথ সহজ করে দেন। আর যখনই কোনো সম্প্রদায় আল্লাহর কোনো এক ঘরে একত্রিত হয়ে আল্লাহর কিতাব পাঠ করে ও নিজেদের মধ্যে তা অধ্যয়ন করে, তখনই (আল্লাহর পক্ষ থেকে) তাদের ওপর প্রশান্তি অবতীর্ণ হয়, তাদেরকে (আল্লাহর) রহমত আচ্ছাদিত করে নেয়, ফিরিশতারা তাদেরকে ঘিরে নেয় এবং আল্লাহ তাঁর নিকটবর্তী (ফিরিশতা)দের মধ্যে তাদের কথা আলোচনা করেন। আর যাকে তার আমল পশ্চাদ্গামী করেছে (অর্থাৎ নেকীর কাজ করে নি) তার বংশ তাকে অগ্রগামী করতে পারবে না।”",
  "source": {
   "en": "https://hadeethenc.com/en/browse/hadith/4801",
   "bn": "https://hadeethenc.com/bn/browse/hadith/4801"
  },
  "note": null,
  "review": "source-checked"
 },
 {
  "id": "h04",
  "he": 5449,
  "cats": [
   "motivation",
   "grateful"
  ],
  "narrator": {
   "en": "Ibn 'Abbas",
   "bn": "ইবনু আব্বাস"
  },
  "refs": [
   {
    "c": "bukhari",
    "n": "6412",
    "url": "https://sunnah.com/bukhari:6412",
    "wording": "shown"
   }
  ],
  "grade": {
   "collection": {
    "en": "Sahih: in Sahih al-Bukhari",
    "bn": "সহীহ: সহীহ বুখারী-তে বর্ণিত"
   },
   "he": {
    "en": "Authentic",
    "bn": "সহীহ",
    "ar": "صحيح"
   }
  },
  "attribution": {
   "en": "Narrated by Al-Bukhāri",
   "bn": "এটি বুখারী বর্ণনা করেছেন।",
   "ar": "رواه البخاري"
  },
  "ar": "عَنِ ابْنِ عَبَّاسٍ رَضِيَ اللَّهُ عَنْهُمَا قَالَ: قَالَ النَّبِيُّ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ: «نِعْمَتَانِ مَغْبُونٌ فِيهِمَا كَثِيرٌ مِنَ النَّاسِ: الصِّحَّةُ وَالفَرَاغُ».",
  "en": "Ibn ‘Abbās (may Allah be pleased with him and his father) reported: The Prophet (may Allah's peace and blessings be upon him) said: \"There are two blessings in which many people incur loss: health and free time.\"",
  "bn": "ইবনু আব্বাস রাদিয়াল্লাহু ‘আনহু থেকে বর্ণিত, তিনি বলেন, রাসূলুল্লাহ সাল্লাল্লাহু ‘আলাইহি ওয়াসাল্লাম বলেছেন: “এমন দু’টি নিয়ামত আছে, যে দু’টোতে অধিকাংশ মানুষ ক্ষতিগ্রস্ত। তা হচ্ছে: সুস্থতা আর অবসর”।",
  "source": {
   "en": "https://hadeethenc.com/en/browse/hadith/5449",
   "bn": "https://hadeethenc.com/bn/browse/hadith/5449"
  },
  "note": null,
  "review": "source-checked"
 },
 {
  "id": "h05",
  "he": 5795,
  "cats": [
   "guidance",
   "reassure",
   "motivation"
  ],
  "narrator": {
   "en": "Abu Hurayrah",
   "bn": "আবূ হুরায়রা"
  },
  "refs": [
   {
    "c": "bukhari",
    "n": "39",
    "url": "https://sunnah.com/bukhari:39",
    "wording": "shown"
   }
  ],
  "grade": {
   "collection": {
    "en": "Sahih: in Sahih al-Bukhari",
    "bn": "সহীহ: সহীহ বুখারী-তে বর্ণিত"
   },
   "he": {
    "en": "Authentic",
    "bn": "সহীহ",
    "ar": "صحيح"
   }
  },
  "attribution": {
   "en": "Narrated by Al-Bukhāri",
   "bn": "এটি বুখারী বর্ণনা করেছেন।",
   "ar": "رواه البخاري"
  },
  "ar": "عَنْ أَبِي هُرَيْرَةَ رضي الله عنه عَنِ النَّبِيِّ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ قَالَ: «إِنَّ الدِّينَ يُسْرٌ، وَلَنْ يُشَادَّ الدِّينَ أَحَدٌ إِلَّا غَلَبَهُ، فَسَدِّدُوا وَقَارِبُوا، وَأَبْشِرُوا، وَاسْتَعِينُوا بِالْغَدْوَةِ وَالرَّوْحَةِ وَشَيْءٍ مِنَ الدُّلْجَةِ».",
  "en": "Abu Hurayrah (may Allah be pleased with him) reported: The Prophet (may Allah's peace and blessings be upon him) said: \"Indeed, the religion is easy. No one overburdens himself in the religion except that he will be overwhelmed by it. So, seek uprightness (be moderate) and try to be close to it and receive the glad tidings. Seek help by worship in the Ghadwah (early morning), Rawhah (afternoon), and part of the Duljah (night).\"",
  "bn": "আবূ হুরাইরা রদিয়াল্লাহু ‘আনহু থেকে বর্ণিত, নবী সাল্লাল্লাহু ‘আলাইহি  ওয়াসাল্লাম বলেছেন: “নিশ্চয়ই দ্বীন সহজ। দ্বীন নিয়ে যে বাড়াবাড়ি করে দ্বীন তার উপর জয়ী হয়। কাজেই তোমরা  আমলে সঠিক ও মধ্যপন্থা অবলম্বন কর এবং আমলে অবহেলা করো না ,(নেকীর) আশান্বিত থাক এবং সকাল-সন্ধ্যায় ও রাতের কিছু অংশে (’ইবাদাতের মাধ্যমে) সাহায্য চাও”।",
  "source": {
   "en": "https://hadeethenc.com/en/browse/hadith/5795",
   "bn": "https://hadeethenc.com/bn/browse/hadith/5795"
  },
  "note": null,
  "review": "source-checked"
 },
 {
  "id": "h06",
  "he": 3701,
  "cats": [
   "sad",
   "patience",
   "reassure"
  ],
  "narrator": {
   "en": "Abu Sa'id al-Khudri and Abu Hurayrah",
   "bn": "আবূ সা‘ঈদ আল-খুদরী ও আবূ হুরায়রা"
  },
  "refs": [
   {
    "c": "bukhari",
    "n": "5641",
    "url": "https://sunnah.com/bukhari:5641",
    "wording": "shown",
    "label": "5641–5642"
   },
   {
    "c": "muslim",
    "n": "2573",
    "url": "https://sunnah.com/muslim:2573",
    "wording": "similar"
   }
  ],
  "grade": {
   "collection": {
    "en": "Sahih: in Sahih al-Bukhari",
    "bn": "সহীহ: সহীহ বুখারী-তে বর্ণিত"
   },
   "he": {
    "en": "Authentic",
    "bn": "সহীহ",
    "ar": "صحيح"
   }
  },
  "attribution": {
   "en": "Agreed upon",
   "bn": "সহীহ বুখারী ও মুসলিম",
   "ar": "متفق عليه"
  },
  "ar": "عَنْ أَبِي سَعِيدٍ الْخُدْرِيِّ وَعَنْ أَبِي هُرَيْرَةَ رضي الله عنهما عَنِ النَّبِيِّ صلى الله عليه وسلم قَالَ: «مَا يُصِيبُ الْمُسْلِمَ مِنْ نَصَبٍ وَلَا وَصَبٍ وَلَا هَمٍّ وَلَا حُزْنٍ وَلَا أَذًى وَلَا غَمٍّ حَتَّى الشَّوْكَةِ يُشَاكُهَا إِلَّا كَفَّرَ اللهُ بِهَا مِنْ خَطَايَاهُ».",
  "en": "Abu Sa‘īd al-Khudri and Abu Hurayah (may Allah be pleased with both of them) reported that the Prophet (may Allah's peace and blessings be upon him) said: \"No fatigue, disease, sorrow, sadness, harm, or distress befalls a Muslim, even if it were a prick of a thorn, but Allah will expiate some of his sins thereby.\"",
  "bn": "আবূ সা‘ঈদ আল-খুদুরী ও আবূ হুরায়রা রদিয়াল্লাহু ‘আনহুমা থেকে বর্ণিত, নবী সাল্লাল্লাহু ‘আলাইহি ওয়াসাল্লাম বলেছেন: “মুসলিম ব্যক্তির ওপর যে সকল কষ্ট, রোগ-ব্যাধি, উদ্বেগ-উৎকন্ঠা, দুশ্চিন্তা, অনিষ্ট ও পেরেশানী আপতিত হয়, এমনকি যে কাঁটা তার দেহে বিদ্ধ হয়, এ সবের দ্বারা আল্লাহ তার গুনাহসমূহ থেকে ক্ষমা করেন।",
  "source": {
   "en": "https://hadeethenc.com/en/browse/hadith/3701",
   "bn": "https://hadeethenc.com/bn/browse/hadith/3701"
  },
  "note": {
   "en": "Wording shown is Bukhari 5641–5642; Muslim 2573 has the same meaning in slightly different words.",
   "bn": "এখানে বুখারী ৫৬৪১–৫৬৪২-এর শব্দ দেওয়া হয়েছে; মুসলিম ২৫৭৩-এ একই অর্থ সামান্য ভিন্ন শব্দে এসেছে।"
  },
  "review": "source-checked"
 },
 {
  "id": "h07",
  "he": 5845,
  "cats": [
   "dhikr",
   "motivation",
   "guidance"
  ],
  "narrator": {
   "en": "'A'ishah",
   "bn": "আয়েশা"
  },
  "refs": [
   {
    "c": "bukhari",
    "n": "43",
    "url": "https://sunnah.com/bukhari:43",
    "wording": "shown"
   },
   {
    "c": "muslim",
    "n": "785a",
    "url": "https://sunnah.com/muslim:785a",
    "wording": "similar"
   }
  ],
  "grade": {
   "collection": {
    "en": "Sahih: in Sahih al-Bukhari",
    "bn": "সহীহ: সহীহ বুখারী-তে বর্ণিত"
   },
   "he": {
    "en": "Authentic hadith",
    "bn": "সহীহ",
    "ar": "صحيح"
   }
  },
  "attribution": {
   "en": "Narrated by Bukhari & Muslim",
   "bn": "মুত্তাফাকুন ‘আলাইহি (বুখারী ও মুসলিম)।",
   "ar": "متفق عليه"
  },
  "ar": "عن عائشة رضي الله عنها : أن النبي صلى الله عليه وسلم دخل عليها وعندها امرأة، قال: «من هذه؟» قالت: هذه فلانة تذكر من صلاتها. قال: «مَهْ، عليكم بما تطيقون، فوالله لا يَمَلُّ الله حتى تَمَلُّوا» وكان أحب الدين إليه ما داوم صاحبه عليه.",
  "en": "‘Ā'ishah (may Allah be pleased with her) reported that the Prophet (may Allah's peace and blessings be upon him) came in while a woman was sitting with her. He said: \"Who is she?\" ‘Ā'ishah replied: \"She is so-and-so,\" and told him about her (excessive) praying. He said disapprovingly: \"Do (good) deeds according to your capacity, for by Allah, Allah never grows weary (of giving rewards) unless you grow weary (of doing good deeds), and the best deed in His sight is that which is done regularly.”",
  "bn": "আয়েশা রাদিয়াল্লাহু আনহা থেকে বর্ণিত, একদা নবী সাল্লাল্লাহ আলাইহি ওয়াসাল্লাম তাঁর নিকট গেলেন, তখন এক মহিলা তাঁর কাছে (বসে) ছিল। তিনি বললেন, “এটি কে?” আয়েশা (রাদিয়াল্লাহু আনহা) বললেন, ‘অমুক মহিলা, যে প্রচুর সালাত আদায় করে।’ তিনি বললেন, “থামো! তোমরা সাধ্যমত আমল কর। আল্লাহর কসম! আল্লাহ ক্লান্ত হন না, যতক্ষণ না তোমরা ক্লান্ত হয়ে পড়।” আর সেই আমল তাঁর নিকট প্রিয়তম, যেটা তার আমলকারী লাগাতার করে।",
  "source": {
   "en": "https://hadeethenc.com/en/browse/hadith/5845",
   "bn": "https://hadeethenc.com/bn/browse/hadith/5845"
  },
  "note": {
   "en": "Wording shown is Bukhari 43; Muslim 785a reports the same instruction in a related narration.",
   "bn": "এখানে বুখারী ৪৩-এর শব্দ দেওয়া হয়েছে; মুসলিম ৭৮৫a-তে সম্পর্কিত বর্ণনায় একই নির্দেশ এসেছে।"
  },
  "review": "source-checked"
 },
 {
  "id": "h08",
  "he": 5493,
  "cats": [
   "motivation",
   "reassure",
   "patience"
  ],
  "narrator": {
   "en": "Abu Hurayrah",
   "bn": "আবূ হুরায়রা"
  },
  "refs": [
   {
    "c": "muslim",
    "n": "2664",
    "url": "https://sunnah.com/muslim:2664",
    "wording": "shown"
   }
  ],
  "grade": {
   "collection": {
    "en": "Sahih: in Sahih Muslim",
    "bn": "সহীহ: সহীহ মুসলিম-তে বর্ণিত"
   },
   "he": {
    "en": "Authentic",
    "bn": "সহীহ",
    "ar": "صحيح"
   }
  },
  "attribution": {
   "en": "Narrated by Muslim",
   "bn": "ইমাম মুসলিম এটি বর্ণনা করেছেন",
   "ar": "رواه مسلم"
  },
  "ar": "عَنْ أَبِي هُرَيْرَةَ رضي الله عنه قَالَ: قَالَ رَسُولُ اللهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ: «الْمُؤْمِنُ الْقَوِيُّ، خَيْرٌ وَأَحَبُّ إِلَى اللهِ مِنَ الْمُؤْمِنِ الضَّعِيفِ، وَفِي كُلٍّ خَيْرٌ، احْرِصْ عَلَى مَا يَنْفَعُكَ، وَاسْتَعِنْ بِاللهِ وَلَا تَعْجَزْ، وَإِنْ أَصَابَكَ شَيْءٌ، فَلَا تَقُلْ لَوْ أَنِّي فَعَلْتُ كَانَ كَذَا وَكَذَا، وَلَكِنْ قُلْ قَدَرُ اللهِ وَمَا شَاءَ فَعَلَ، فَإِنَّ (لَوْ) تَفْتَحُ عَمَلَ الشَّيْطَانِ».",
  "en": "Abu Hurayrah (may Allah be pleased with him) reported that the Messenger of Allah (may Allah's peace and blessings be upon him) said: \"The strong believer is better and dearer to Allah than the weak believer, and there is good in both. Adhere to whatever brings you benefit, seek the help of Allah, and do not feel helpless. If something befalls you, do not say: 'Had I done such-and-such, it would have been such-and-such;' rather, say: 'Allah has decreed, and whatever He wills, He does.' Indeed, 'if' opens the way before the devil to act.\"",
  "bn": "আবূ হুরাইরা রদিয়াল্লাহু ‘আনহু থেকে বর্ণিত, তিনি বলেন: রাসূলুল্লাহ সাল্লাল্লাহু ‘আলাইহি ওয়াসাল্লাম বলেছেন: “শক্তিশালী মুমিন দুর্বল মুমিন অপেক্ষা আল্লাহর কাছে অধিকতর উত্তম ও পছন্দনীয়। তবে তাদের প্রত্যেকের মধ্যেই কল্যাণ রয়েছে। সুতরাং যা তোমাকে উপকৃত করবে, তার প্রতি তুমি আগ্রহী হও। এবং আল্লাহর কাছেই সাহায্য প্রার্থনা কর। তুমি কখনো অক্ষম হয়ো না। যদি তোমার কাছে কোন বিপদ আপতিত হয়। তাহলে এ কথা বলবে না: যদি আমি এমন এমন করতাম, তাহলে এমনটি হত না। বরং এ কথা বলবে:قَدَرُ اللهِ وَمَا شَاءَ فَعَلَ، ‘আল্লাহ তা’আলা যা নির্দিষ্ট করেছেন এবং যা চেয়েছেন তাই করেছেন।” কেননা لَوْ (যদি) বলা শয়তানের কাজকে খুলে দেয়।”",
  "source": {
   "en": "https://hadeethenc.com/en/browse/hadith/5493",
   "bn": "https://hadeethenc.com/bn/browse/hadith/5493"
  },
  "note": null,
  "review": "source-checked"
 },
 {
  "id": "h09",
  "he": 4717,
  "cats": [
   "faith",
   "better"
  ],
  "narrator": {
   "en": "Anas ibn Malik",
   "bn": "আনাস ইবন মালিক"
  },
  "refs": [
   {
    "c": "bukhari",
    "n": "13",
    "url": "https://sunnah.com/bukhari:13",
    "wording": "shown"
   },
   {
    "c": "muslim",
    "n": "45a",
    "url": "https://sunnah.com/muslim:45a",
    "wording": "shown"
   }
  ],
  "grade": {
   "collection": {
    "en": "Sahih: in Sahih al-Bukhari and Sahih Muslim",
    "bn": "সহীহ: সহীহ বুখারী ও সহীহ মুসলিম-তে বর্ণিত"
   },
   "he": {
    "en": "Authentic",
    "bn": "সহীহ",
    "ar": "صحيح"
   }
  },
  "attribution": {
   "en": "Agreed upon",
   "bn": "সহীহ বুখারী ও মুসলিম",
   "ar": "متفق عليه"
  },
  "ar": "عَنْ أَنَسٍ رَضِيَ اللَّهُ عَنْهُ عَنِ النَّبِيِّ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ قالَ: «لاَ يُؤْمِنُ أَحَدُكُمْ، حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ».",
  "en": "Anas (may Allah be pleased with him) reported: The Prophet (may Allah's peace and blessings be upon him) said: \"None of you believes until he loves for his brother what he loves for himself.\"",
  "bn": "আনাস রাযিয়াল্লাহু ‘আনহু থেকে বর্ণিত, নবী সাল্লাল্লাহু ‘আলাইহি ওয়াসাল্লাম বলেছেন: “তোমাদের কেউ প্রকৃত মুমিন হতে পারবে না, যতক্ষণ না সে তার ভাইয়ের জন্য সেটাই পছন্দ করবে, যা তার নিজের জন্য পছন্দ করে”।",
  "source": {
   "en": "https://hadeethenc.com/en/browse/hadith/4717",
   "bn": "https://hadeethenc.com/bn/browse/hadith/4717"
  },
  "note": null,
  "review": "source-checked"
 },
 {
  "id": "h10",
  "he": 5437,
  "cats": [
   "better",
   "faith"
  ],
  "narrator": {
   "en": "Abu Hurayrah",
   "bn": "আবূ হুরায়রা"
  },
  "refs": [
   {
    "c": "muslim",
    "n": "47a",
    "url": "https://sunnah.com/muslim:47a",
    "wording": "shown"
   },
   {
    "c": "bukhari",
    "n": "6018",
    "url": "https://sunnah.com/bukhari:6018",
    "wording": "similar"
   }
  ],
  "grade": {
   "collection": {
    "en": "Sahih: in Sahih Muslim",
    "bn": "সহীহ: সহীহ মুসলিম-তে বর্ণিত"
   },
   "he": {
    "en": "Authentic",
    "bn": "সহীহ",
    "ar": "صحيح"
   }
  },
  "attribution": {
   "en": "Agreed upon",
   "bn": "সহীহ বুখারী ও মুসলিম",
   "ar": "متفق عليه"
  },
  "ar": "عن أبي هريرة رضي الله عنه عن رسول الله صلى الله عليه وسلم قال: «مَنْ كَانَ يُؤْمِنُ بِاللهِ وَالْيَوْمِ الْآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ، وَمَنْ كَانَ يُؤْمِنُ بِاللهِ وَالْيَوْمِ الْآخِرِ فَلْيُكْرِمْ جَارَهُ، وَمَنْ كَانَ يُؤْمِنُ بِاللهِ وَالْيَوْمِ الْآخِرِ فَلْيُكْرِمْ ضَيْفَهُ».",
  "en": "Abu Hurayrah (may Allah be pleased with him) reported: The Messenger of Allah (may Allah's peace and blessings be upon him) said: \"Whoever believes in Allah and the Last Day should say what is good or keep silent. Whoever believes in Allah and the Last Day should honor his neighbor. Whoever believes in Allah and the Last Day should honor his guest.\"",
  "bn": "আবূ হুরায়রা রাদিয়াল্লাহু ‘আনহু থেকে বর্ণিত, তিনি বলেন, রাসুলুল্লাহ সাল্লাল্লাহু আলাইহি ওয়াসাল্লাম বলেছেন: “যে ব্যক্তি আল্লাহ ও শেষ দিনের উপর ঈমান রাখে সে যেন উত্তম কথা বলে, অথবা সে যেন চুপ থাকে।  যে আল্লাহ ও শেষ দিনের উপর ঈমান রাখে, সে যেন তার প্রতিবেশীকে সম্মান করে । যে লোক আল্লাহ ও শেষ দিনের উপর ঈমান রাখে, সে যেন তার মেহমানকে সম্মান করে।”",
  "source": {
   "en": "https://hadeethenc.com/en/browse/hadith/5437",
   "bn": "https://hadeethenc.com/bn/browse/hadith/5437"
  },
  "note": {
   "en": "Wording shown ('honour his neighbour') is Muslim 47a; Bukhari 6018 has 'let him not harm his neighbour'.",
   "bn": "‘প্রতিবেশীকে সম্মান করে’ শব্দটি মুসলিম ৪৭a-এর; বুখারী ৬০১৮-এ আছে ‘প্রতিবেশীকে কষ্ট না দেয়’।"
  },
  "review": "source-checked"
 },
 {
  "id": "h11",
  "he": 5507,
  "cats": [
   "dhikr"
  ],
  "narrator": {
   "en": "Abu Hurayrah",
   "bn": "আবূ হুরায়রা"
  },
  "refs": [
   {
    "c": "bukhari",
    "n": "6406",
    "url": "https://sunnah.com/bukhari:6406",
    "wording": "shown"
   },
   {
    "c": "muslim",
    "n": "2694",
    "url": "https://sunnah.com/muslim:2694",
    "wording": "similar"
   }
  ],
  "grade": {
   "collection": {
    "en": "Sahih: in Sahih al-Bukhari",
    "bn": "সহীহ: সহীহ বুখারী-তে বর্ণিত"
   },
   "he": {
    "en": "Authentic",
    "bn": "সহীহ",
    "ar": "صحيح"
   }
  },
  "attribution": {
   "en": "Agreed upon",
   "bn": "সহীহ বুখারী ও মুসলিম",
   "ar": "متفق عليه"
  },
  "ar": "عن أبي هريرة رضي الله عنه عن النبي صلى الله عليه وسلم قال: «كَلِمَتَانِ خَفِيفَتَانِ عَلَى اللِّسَانِ، ثَقِيلَتَانِ فِي الْمِيزَانِ، حَبِيبَتَانِ إِلَى الرَّحْمَنِ: سُبْحَانَ اللهِ الْعَظِيمِ، سُبْحَانَ اللهِ وَبِحَمْدِهِ».",
  "en": "Abu Hurayrah (may Allah be pleased with him) reported: The Prophet (may Allah's peace and blessings be upon him) said: \"There are two words that are light on the tongue, heavy on the scale, and dear to the Most Merciful: subhān Allah al-‘azhīm (glory be to Allah, the Majestic), subhān Allah wa bihamdih (glory and praise be to Allah).\"",
  "bn": "আবূ হুরায়রা রাদিয়াল্লাহু ‘আনহু থেকে বর্ণিত, নবী সাল্লাল্লাহু ‘আলাইহি ওয়াসাল্লাম বলেছেন: “দুটি কালেমা জিহ্বার উপর (উচ্চারণে) খুবই হালকা, মীযানের পাল্লায় অত্যন্ত ভারী, রাহমান (পরম দয়ালু আল্লাহ) এর কাছে খুবই প্রিয়। তা হলো: سُبْحَانَ اللَّهِ وَبِحَمْدِهِ سُبْحَانَ اللَّهِ الْعَظِيمِ (আমি আল্লাহ তা‘আলার জন্য প্রশংসা সহ তাঁর(সকল ত্রুটি থেকে) পবিত্রতা ঘোষণা করছি, আমি ঘোষণা করছি মহান আল্লাহ(সকল দোষ থেকে) পূত-পবিত্র।”",
  "source": {
   "en": "https://hadeethenc.com/en/browse/hadith/5507",
   "bn": "https://hadeethenc.com/bn/browse/hadith/5507"
  },
  "note": {
   "en": "Wording shown is Bukhari 6406; Muslim 2694 has the two phrases in the opposite order.",
   "bn": "এখানে বুখারী ৬৪০৬-এর শব্দ দেওয়া হয়েছে; মুসলিম ২৬৯৪-এ বাক্য দুটি উল্টো ক্রমে এসেছে।"
  },
  "review": "source-checked"
 },
 {
  "id": "h12",
  "he": 65004,
  "cats": [
   "dhikr",
   "faith",
   "grateful"
  ],
  "narrator": {
   "en": "Abu Malik al-Ash'ari",
   "bn": "আবূ মালিক আল-আশ‘আরী"
  },
  "refs": [
   {
    "c": "muslim",
    "n": "223",
    "url": "https://sunnah.com/muslim:223",
    "wording": "shown"
   }
  ],
  "grade": {
   "collection": {
    "en": "Sahih: in Sahih Muslim",
    "bn": "সহীহ: সহীহ মুসলিম-তে বর্ণিত"
   },
   "he": {
    "en": "Authentic",
    "bn": "সহীহ",
    "ar": "صحيح"
   }
  },
  "attribution": {
   "en": "Narrated by Muslim",
   "bn": "ইমাম মুসলিম এটি বর্ণনা করেছেন",
   "ar": "رواه مسلم"
  },
  "ar": "عن أبي مالكٍ الأشعريِّ رضي الله عنه قال: قال رسول الله صلى الله عليه وسلم: «الطُّهُورُ شَطْرُ الْإِيمَانِ، وَالْحَمْدُ لِلهِ تَمْلَأُ الْمِيزَانَ، وَسُبْحَانَ اللهِ وَالْحَمْدُ لِلهِ تَمْلَآنِ -أَوْ تَمْلَأُ- مَا بَيْنَ السَّمَاوَاتِ وَالْأَرْضِ، وَالصَّلَاةُ نُورٌ، وَالصَّدَقَةُ بُرْهَانٌ، وَالصَّبْرُ ضِيَاءٌ، وَالْقُرْآنُ حُجَّةٌ لَكَ أَوْ عَلَيْكَ، كُلُّ النَّاسِ يَغْدُو، فَبَايِعٌ نَفْسَهُ فَمُعْتِقُهَا أَوْ مُوبِقُهَا».",
  "en": "Abu Mālik al-Ash‘ari (may Allah be pleased with him) reported: The Messenger of Allah (may Allah's peace and blessings be upon him) said: \"Purity is half of faith, al-hamdulillāh (praise be to Allah) fills the Scale, and subhān Allah wa al-hamdulillāh (glory and praise be to Allah) fills what is between the heavens and the earth. Prayer is light, charity is proof, patience is radiance, and the Qur’an is an argument either for you or against you. Every person goes out in the morning and sells his soul; he either saves it from doom or throws it into destruction.\"",
  "bn": "আবূ মালিক আল-আশ‘আরী রাদিয়াল্লাহু ‘আনহু হতে বর্ণিত, তিনি বলেছেন: রাসূলুল্লাহ সাল্লাল্লাহু ‘আলাইহি ওয়া সাল্লাম বলেছেন: “পবিত্রতা ঈমানের অর্ধেক। “الحمد لله” ‘আলহামদু লিল্লা ‘ মিযান-দাঁড়িপাল্লা পরিপূর্ণ করে দেয় এবং “سبحان الله والحمد لله” ‘সুবহানাল্লাহি ওয়ালহামদু লিল্লাহ’ কালেমা আসমান ও জমিনের মধ্যবর্তী স্থানকে পরিপূর্ণ করে দেয়। আর সালাত হচ্ছে নূর, সদাকাহ হচ্ছে দলিল এবং সবর হচ্ছে আলো। আর আল-কুরআন তোমার পক্ষে অথবা বিপক্ষে প্রমাণ স্বরূপ। সকল মানুষই ভোর করে নিজেকে বিক্রি করে দেয়। অতঃপর সে তাকে মুক্ত করে অথবা তাকে ধ্বংস করে।\"",
  "source": {
   "en": "https://hadeethenc.com/en/browse/hadith/65004",
   "bn": "https://hadeethenc.com/bn/browse/hadith/65004"
  },
  "note": null,
  "review": "source-checked"
 },
 {
  "id": "h13",
  "he": 4560,
  "cats": [
   "guidance",
   "faith"
  ],
  "narrator": {
   "en": "'Umar ibn al-Khattab",
   "bn": "‘উমার ইবনুল খাত্তাব"
  },
  "refs": [
   {
    "c": "muslim",
    "n": "1907a",
    "url": "https://sunnah.com/muslim:1907a",
    "wording": "shown"
   },
   {
    "c": "bukhari",
    "n": "1",
    "url": "https://sunnah.com/bukhari:1",
    "wording": "shown"
   }
  ],
  "grade": {
   "collection": {
    "en": "Sahih: in Sahih al-Bukhari and Sahih Muslim",
    "bn": "সহীহ: সহীহ বুখারী ও সহীহ মুসলিম-তে বর্ণিত"
   },
   "he": {
    "en": "Authentic",
    "bn": "সহীহ",
    "ar": "صحيح"
   }
  },
  "attribution": {
   "en": "Agreed upon",
   "bn": "সহীহ বুখারী ও মুসলিম",
   "ar": "متفق عليه"
  },
  "ar": "عن عمر بن الخطاب رضي الله عنه قال: قال رسول الله صلى الله عليه وسلم: «إِنَّمَا الْأَعْمَالُ بِالنِّيَّةِ، وَإِنَّمَا لِامْرِئٍ مَا نَوَى، فَمَنْ كَانَتْ هِجْرَتُهُ إِلَى اللهِ وَرَسُولِهِ، فَهِجْرَتُهُ إِلَى اللهِ وَرَسُولِهِ، وَمَنْ كَانَتْ هِجْرَتُهُ لِدُنْيَا يُصِيبُهَا أَوِ امْرَأَةٍ يَتَزَوَّجُهَا، فَهِجْرَتُهُ إِلَى مَا هَاجَرَ إِلَيْهِ».\nوفي لفظ للبخاري: «إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى».",
  "en": "‘Umar ibn al-Khattāb (may Allah be pleased with him) reported: The Messenger of Allah (may Allah’s peace and blessings be upon him) said: \"Verily, the reward of deeds depends on the intention, and a person will be rewarded according to what he intended. So, he whose migration is for the sake of Allah and His Messenger, then his migration is for the sake of Allah and His Messenger, and he whose migration is to achieve some worldly gain or take some woman in marriage, then his migration is for what he migrated for.\" In a version by Al-Bukhāri: \"Verily, the reward of deeds depends on the intentions, and each person will be rewarded according to what he intended.\"",
  "bn": "‘উমার ইবনুল খাত্তাব রদিয়াল্লাহু ‘আনহু থেকে বর্ণিত, তিনি বলেন, রাসূলুল্লাহ সাল্লাল্লাহু ‘আলাইহি ওয়াসাল্লাম বলেছেন: “প্রত্যেক কাজ নিয়তের উপর নির্ভরশীল। আর মানুষ তার নিয়ত অনুযায়ী ফল পাবে। কাজেই যার হিজরত হবে আল্লাহ ও তাঁর রাসূলের উদ্দেশ্যে, তার হিজরত আল্লাহ ও তাঁর রাসূলের উদ্দেশ্যে হয়েছে বলেই ধরা হবে। আর যার হিজরত হবে দুনিয়া লাভ অথবা কোন নারীকে বিয়ে করার উদ্দেশ্যে, তবে তার হিজরত সেই উদ্দেশ্যই ধরা হবে।” বুখারীর শব্দাবলী এমন: “প্রত্যেক কাজ নিয়তের উপর নির্ভরশীল। আর নিশ্চয় প্রতিটি মানুষ তার নিয়ত অনুযায়ী ফল পাবে।”",
  "source": {
   "en": "https://hadeethenc.com/en/browse/hadith/4560",
   "bn": "https://hadeethenc.com/bn/browse/hadith/4560"
  },
  "note": {
   "en": "The main text is Muslim 1907a (bi-n-niyyah); the second sentence is Bukhari 1's wording, as HadeethEnc notes.",
   "bn": "মূল পাঠ মুসলিম ১৯০৭a-এর (বিন-নিয়্যাহ); শেষ বাক্যটি বুখারী ১-এর শব্দ, যেমন হাদীসএনসাইক্লোপিডিয়া উল্লেখ করেছে।"
  },
  "review": "source-checked"
 },
 {
  "id": "h14",
  "he": 4322,
  "cats": [
   "hope",
   "motivation"
  ],
  "narrator": {
   "en": "Ibn 'Abbas",
   "bn": "ইবনু আব্বাস"
  },
  "refs": [
   {
    "c": "bukhari",
    "n": "6491",
    "url": "https://sunnah.com/bukhari:6491",
    "wording": "shown"
   },
   {
    "c": "muslim",
    "n": "131a",
    "url": "https://sunnah.com/muslim:131a",
    "wording": "shown"
   }
  ],
  "grade": {
   "collection": {
    "en": "Sahih: in Sahih al-Bukhari and Sahih Muslim",
    "bn": "সহীহ: সহীহ বুখারী ও সহীহ মুসলিম-তে বর্ণিত"
   },
   "he": {
    "en": "Authentic",
    "bn": "সহীহ",
    "ar": "صحيح"
   }
  },
  "attribution": {
   "en": "Agreed upon",
   "bn": "সহীহ বুখারী ও মুসলিম",
   "ar": "متفق عليه"
  },
  "ar": "عن ابن عباس رضي الله عنهما عَنِ النَّبِيِّ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ فِيمَا يَرْوِي عَنْ رَبِّهِ عَزَّ وَجَلَّ قَالَ: قَالَ: «إِنَّ اللهَ كَتَبَ الْحَسَنَاتِ وَالسَّيِّئَاتِ، ثُمَّ بَيَّنَ ذَلِكَ، فَمَنْ هَمَّ بِحَسَنَةٍ فَلَمْ يَعْمَلْهَا كَتَبَهَا اللهُ لَهُ عِنْدَهُ حَسَنَةً كَامِلَةً، فَإِنْ هُوَ هَمَّ بِهَا فَعَمِلَهَا كَتَبَهَا اللهُ لَهُ عِنْدَهُ عَشْرَ حَسَنَاتٍ إِلَى سَبْعِمِائَةِ ضِعْفٍ، إِلَى أَضْعَافٍ كَثِيرَةٍ، وَمَنْ هَمَّ بِسَيِّئَةٍ فَلَمْ يَعْمَلْهَا كَتَبَهَا اللهُ لَهُ عِنْدَهُ حَسَنَةً كَامِلَةً، فَإِنْ هُوَ هَمَّ بِهَا فَعَمِلَهَا كَتَبَهَا اللهُ لَهُ سَيِّئَةً وَاحِدَةً».",
  "en": "Ibn ‘Abbās (may Allah be pleased with him) reported: The Prophet (may Allah's peace and blessings be upon him), as part of what he narrated from his Lord, said: \"Allah has written down the good deeds and the bad ones. Then, He explained that: He who intends a good deed and does not do it, Allah writes it down with Himself as a full good deed; and if he intends it and does it, Allah writes it down with Himself as ten good deeds to seven hundred times, or many times over. Yet, if he intends a bad deed and does not do it, Allah writes it down with Himself as a full good deed. But, if he intends it and does it, Allah writes it down as one bad deed.\"",
  "bn": "ইবনু ’আব্বাস রদিয়াল্লাহু ‘আনহুমা থেকে বর্ণিত, নবী সাল্লাল্লাহু আলাইহি ওয়াসাল্লাম তাঁর মহান রব হতে (হাদীসে কুদসী ) বর্ণনা করে বলেন যে: “আল্লাহ ভাল-মন্দ লিখে দিয়েছেন। এরপর সেগুলোকে বর্ণনা করেছেন। সুতরাং যে ব্যক্তি কোন সৎ কাজের ইচ্ছা করল; কিন্তু তা বাস্তবে করল না, আল্লাহ তাঁর কাছে এর জন্য পূর্ণ একটি সাওয়াব লিখবেন। আর সে ভাল কাজের ইচ্ছা করল এবং তা বাস্তবেও সম্পাদন করল, আল্লাহ তাঁর কাছে ঐ ব্যক্তির জন্য দশ গুণ থেকে সাতশ’ গুণ পর্যন্ত, এমন কি এর চেয়ে বহুগুণ সাওযাব লিখে দেন। আর যে কোন মন্দ কাজের ইচ্ছা করল; কিন্তু তা বাস্তবায়ন করল না, আল্লাহ তাঁর কাছে তার জন্য পূর্ণ সাওয়াব লিখবেন। আর যদি সে মন্দ কাজের ইচ্ছা করার পর বাস্তবেও তা করে, তবে তার জন্য আল্লাহ মাত্র একটা গুনাহ লিখবেন।”",
  "source": {
   "en": "https://hadeethenc.com/en/browse/hadith/4322",
   "bn": "https://hadeethenc.com/bn/browse/hadith/4322"
  },
  "note": null,
  "review": "source-checked"
 },
 {
  "id": "h15",
  "he": 4808,
  "cats": [
   "dhikr",
   "hope"
  ],
  "narrator": {
   "en": "Abu Hurayrah",
   "bn": "আবূ হুরায়রা"
  },
  "refs": [
   {
    "c": "bukhari",
    "n": "6307",
    "url": "https://sunnah.com/bukhari:6307",
    "wording": "shown"
   }
  ],
  "grade": {
   "collection": {
    "en": "Sahih: in Sahih al-Bukhari",
    "bn": "সহীহ: সহীহ বুখারী-তে বর্ণিত"
   },
   "he": {
    "en": "Authentic hadith",
    "bn": "সহীহ",
    "ar": "صحيح"
   }
  },
  "attribution": {
   "en": "Narrated by Bukhari",
   "bn": "এটি বুখারী বর্ণনা করেছেন।",
   "ar": "رواه البخاري"
  },
  "ar": "عن أبي هريرة رضي الله عنه قال: سمعت رسول الله صلى الله عليه وسلم يقول: «وَاللهِ إني لأَسْتَغْفِرُ اللهَ وأَتُوبُ إليهِ في اليومِ أَكْثَرَ من سَبْعِينَ مَرَّةً».",
  "en": "Abu Hurayrah (may Allah be pleased with him) reported that he heard the Prophet (may Allah's peace and blessings be upon him) say: \"By Allah! I ask Allah for forgiveness and repent to Him more than seventy times a day.\"",
  "bn": "আবূ হুরায়রা রাদিয়াল্লাহু আনহু থেকে মরফূ‘ হিসেবে বর্ণিত, “আল্লাহর শপথ! আমি প্রত্যহ আল্লাহর কাছে সত্তর বারেরও বেশি ইস্তিগফার [ক্ষমাপ্রার্থনা] ও তাওবা করে থাকি।”",
  "source": {
   "en": "https://hadeethenc.com/en/browse/hadith/4808",
   "bn": "https://hadeethenc.com/bn/browse/hadith/4808"
  },
  "note": null,
  "review": "source-checked"
 },
 {
  "id": "h16",
  "he": 4555,
  "cats": [
   "better",
   "faith"
  ],
  "narrator": {
   "en": "Abu Hurayrah",
   "bn": "আবূ হুরায়রা"
  },
  "refs": [
   {
    "c": "muslim",
    "n": "2564c",
    "url": "https://sunnah.com/muslim:2564c",
    "wording": "shown"
   }
  ],
  "grade": {
   "collection": {
    "en": "Sahih: in Sahih Muslim",
    "bn": "সহীহ: সহীহ মুসলিম-তে বর্ণিত"
   },
   "he": {
    "en": "Authentic",
    "bn": "সহীহ",
    "ar": "صحيح"
   }
  },
  "attribution": {
   "en": "Narrated by Muslim",
   "bn": "ইমাম মুসলিম এটি বর্ণনা করেছেন",
   "ar": "رواه مسلم"
  },
  "ar": "عن أبي هريرة رضي الله عنه قال: قال رسول الله صلى الله عليه وسلم: «إِنَّ اللهَ لَا يَنْظُرُ إِلَى صُوَرِكُمْ وَأَمْوَالِكُمْ، وَلَكِنْ يَنْظُرُ إِلَى قُلُوبِكُمْ وَأَعْمَالِكُمْ».",
  "en": "Abu Hurayrah (may Allah be pleased with him) reported: The Messenger of Allah (may Allah's peace and blessings be upon him) said: \"Indeed, Allah does not look at your appearance and wealth, but He looks at your hearts and deeds.”",
  "bn": "আবূ হুরাইরা রদিয়াল্লাহু ‘আনহু থেকে বর্ণিত, তিনি বলেন, রাসূলুল্লাহ সাল্লাল্লাহু ‘আলাইহি ওয়াসাল্লাম বলেছেন: “নিশ্চয়ই আল্লাহ তোমাদের চেহারা ও ধন-সম্পদের প্রতি দৃষ্টিপাত করেন না; বরং তিনি দৃষ্টি দিয়ে থাকেন তোমাদের অন্তর ও আমলের প্রতি।”",
  "source": {
   "en": "https://hadeethenc.com/en/browse/hadith/4555",
   "bn": "https://hadeethenc.com/bn/browse/hadith/4555"
  },
  "note": null,
  "review": "source-checked"
 },
 {
  "id": "h17",
  "he": 5913,
  "cats": [
   "knowledge"
  ],
  "narrator": {
   "en": "'Uthman ibn 'Affan",
   "bn": "‘উসমান ইবন ‘আফফান"
  },
  "refs": [
   {
    "c": "bukhari",
    "n": "5027",
    "url": "https://sunnah.com/bukhari:5027",
    "wording": "shown"
   }
  ],
  "grade": {
   "collection": {
    "en": "Sahih: in Sahih al-Bukhari",
    "bn": "সহীহ: সহীহ বুখারী-তে বর্ণিত"
   },
   "he": {
    "en": "Authentic",
    "bn": "সহীহ",
    "ar": "صحيح"
   }
  },
  "attribution": {
   "en": "Narrated by Al-Bukhāri",
   "bn": "এটি বুখারী বর্ণনা করেছেন।",
   "ar": "رواه البخاري"
  },
  "ar": "عن عثمان رضي الله عنه عن النبي صلى الله عليه وسلم قال: «خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ».",
  "en": "‘Uthmān ibn ‘Affān (may Allah be pleased with him) reported: The Prophet (may Allah’s peace and blessings be upon him) said: \"The best of you are those who learn the Qur’an and teach it.\"",
  "bn": "‘উসমান রাদিয়াল্লাহু ‘আনহু থেকে বর্ণিত, নবী সাল্লাল্লাহু ‘আলাইহি ওয়াসাল্লাম বলেছেন: “তোমাদের মধ্যে ঐ ব্যক্তি সর্বোত্তম যে নিজে কুরআন শিখে এবং অন্যকে শিখায়।”",
  "source": {
   "en": "https://hadeethenc.com/en/browse/hadith/5913",
   "bn": "https://hadeethenc.com/bn/browse/hadith/5913"
  },
  "note": null,
  "review": "source-checked"
 },
 {
  "id": "h18",
  "he": 5351,
  "cats": [
   "patience",
   "better"
  ],
  "narrator": {
   "en": "Abu Hurayrah",
   "bn": "আবূ হুরায়রা"
  },
  "refs": [
   {
    "c": "bukhari",
    "n": "6114",
    "url": "https://sunnah.com/bukhari:6114",
    "wording": "shown"
   },
   {
    "c": "muslim",
    "n": "2609a",
    "url": "https://sunnah.com/muslim:2609a",
    "wording": "shown"
   }
  ],
  "grade": {
   "collection": {
    "en": "Sahih: in Sahih al-Bukhari and Sahih Muslim",
    "bn": "সহীহ: সহীহ বুখারী ও সহীহ মুসলিম-তে বর্ণিত"
   },
   "he": {
    "en": "Authentic",
    "bn": "সহীহ",
    "ar": "صحيح"
   }
  },
  "attribution": {
   "en": "Agreed upon",
   "bn": "সহীহ বুখারী ও মুসলিম",
   "ar": "متفق عليه"
  },
  "ar": "عن أبي هريرة رضي الله عنه أن رسول الله صلى الله عليه وسلم قال: «لَيْسَ الشَّدِيدُ بِالصُّرَعَةِ، إِنَّمَا الشَّدِيدُ الَّذِي يَمْلِكُ نَفْسَهُ عِنْدَ الْغَضَبِ».",
  "en": "Abu Hurayrah (may Allah be pleased with him) reported: The Messenger of Allah (may Allah's peace and blessings be upon him) said: \"The strong man is not the one who can overpower others; rather, the strong man is the one who controls himself when he is angry.\"",
  "bn": "আবূ হুরায়রা রাদিয়াল্লাহু ‘আনহু থেকে বর্ণিত, রাসূলুল্লাহ সাল্লাল্লাহু ‘আলাইহি ওয়াসাল্লাম বলেছেন: “প্রকৃত বীর সে নয়, যে কাউকে কুস্তিতে হারিয়ে দেয়; বরং সেই প্রকৃত বাহাদুর, যে ক্রোধের সময় নিজেকে নিয়ন্ত্রণ করতে সক্ষম “",
  "source": {
   "en": "https://hadeethenc.com/en/browse/hadith/5351",
   "bn": "https://hadeethenc.com/bn/browse/hadith/5351"
  },
  "note": null,
  "review": "source-checked"
 },
 {
  "id": "h19",
  "he": 3852,
  "cats": [
   "grateful"
  ],
  "narrator": {
   "en": "Abu Hurayrah",
   "bn": "আবূ হুরায়রা"
  },
  "refs": [
   {
    "c": "bukhari",
    "n": "6446",
    "url": "https://sunnah.com/bukhari:6446",
    "wording": "shown"
   },
   {
    "c": "muslim",
    "n": "1051",
    "url": "https://sunnah.com/muslim:1051",
    "wording": "shown"
   }
  ],
  "grade": {
   "collection": {
    "en": "Sahih: in Sahih al-Bukhari and Sahih Muslim",
    "bn": "সহীহ: সহীহ বুখারী ও সহীহ মুসলিম-তে বর্ণিত"
   },
   "he": {
    "en": "Authentic hadith",
    "bn": "সহীহ",
    "ar": "صحيح"
   }
  },
  "attribution": {
   "en": "Narrated by Bukhari & Muslim",
   "bn": "মুত্তাফাকুন ‘আলাইহি (বুখারী ও মুসলিম)।",
   "ar": "متفق عليه"
  },
  "ar": "عن أبي هريرة رضي الله عنه عن النبي صلى الله عليه وسلم قال: «ليس الغِنَى عن كَثرَة العَرَض، ولكن الغِنَى غنى النفس».",
  "en": "Abu Hurayrah (may Allah be pleased with him) reported that the Prophet (may Allah's peace and blessings be upon him) said: \"Richness is not the abundance of wealth. Rather, true richness is self-sufficiency.\"",
  "bn": "আবূ হুরায়রা রাদিয়াল্লাহু ‘আনহু থেকে মারফু‘ সূত্রে বর্ণিত, “সম্পদের আধিক্য ধনাঢ্যতা নয়, প্রকৃত ধনাঢ্যতা হল অন্তরের ধনাঢ্যতা।”",
  "source": {
   "en": "https://hadeethenc.com/en/browse/hadith/3852",
   "bn": "https://hadeethenc.com/bn/browse/hadith/3852"
  },
  "note": null,
  "review": "source-checked"
 },
 {
  "id": "h20",
  "he": 4961,
  "cats": [
   "hope",
   "faith"
  ],
  "narrator": {
   "en": "Abu Hurayrah",
   "bn": "আবূ হুরায়রা"
  },
  "refs": [
   {
    "c": "bukhari",
    "n": "7404",
    "url": "https://sunnah.com/bukhari:7404",
    "wording": "shown"
   },
   {
    "c": "muslim",
    "n": "2751a",
    "url": "https://sunnah.com/muslim:2751a",
    "wording": "shown"
   }
  ],
  "grade": {
   "collection": {
    "en": "Sahih: in Sahih al-Bukhari and Sahih Muslim",
    "bn": "সহীহ: সহীহ বুখারী ও সহীহ মুসলিম-তে বর্ণিত"
   },
   "he": {
    "en": "Authentic hadith",
    "bn": "সহীহ",
    "ar": "صحيح"
   }
  },
  "attribution": {
   "en": "Narrated by Bukhari & Muslim",
   "bn": "মুত্তাফাকুন ‘আলাইহি (বুখারী ও মুসলিম)।",
   "ar": "متفق عليه"
  },
  "ar": "عن أبي هريرة رضي الله عنه مرفوعاً: «لما خلق اللهُ الخَلْقَ كتب في كتاب، فهو عنده فوق العرش: إن رحمتي تَغْلِبُ غضبي».\nوفي رواية: «غَلَبَتْ غضبي» \nوفي رواية: «سَبَقَتْ غضبي».",
  "en": "Abu Hurayrah (may Allah be pleased with him) reported: The Prophet (may Allah's peace and blessings be upon him) said: \"When Allah created the creation, He wrote in a book, which is with Him over the Throne: Verily, My mercy predominates over My anger.\"\nAnother narration: \"My mercy predominated My anger.''\nAnother narration: \"My mercy preceded My anger.''",
  "bn": "আবূ হুরায়রা রাদিয়াল্লাহু ‘আনহু থেকে মারফূ হিসেবে বর্ণিত, ‘আল্লাহ যখন সৃষ্টিজগত তৈরি সম্পন্ন করলেন, তখন একটি কিতাবে লিখে রাখলেন, যা তাঁরই কাছে ‘আরশের উপর রয়েছে, “অবশ্যই আমার রহমত আমার গযবের জয়ী হবে।” এক বর্ণনায় এসেছে: “আমার রহমত আমার ক্রোধের ওপর জয়ী হয়েছে।” আরেক বর্ণনায় এসেছে: “আমার রহমত আমার গযবকে এগিয়ে গেছে।”",
  "source": {
   "en": "https://hadeethenc.com/en/browse/hadith/4961",
   "bn": "https://hadeethenc.com/bn/browse/hadith/4961"
  },
  "note": {
   "en": "Main wording: Bukhari 7404 and Muslim 2751a (taghlibu). HadeethEnc adds two further wordings from other narrations.",
   "bn": "মূল শব্দ বুখারী ৭৪০৪ ও মুসলিম ২৭৫১a-এর (তাগলিবু)। হাদীসএনসাইক্লোপিডিয়া অন্য বর্ণনা থেকে আরও দুটি শব্দরূপ যোগ করেছে।"
  },
  "review": "source-checked"
 },
 {
  "id": "h21",
  "he": 5026,
  "cats": [
   "sad",
   "patience"
  ],
  "narrator": {
   "en": "Anas ibn Malik",
   "bn": "আনাস ইবন মালিক"
  },
  "refs": [
   {
    "c": "bukhari",
    "n": "1303",
    "url": "https://sunnah.com/bukhari:1303",
    "wording": "shown"
   },
   {
    "c": "muslim",
    "n": "2315",
    "url": "https://sunnah.com/muslim:2315",
    "wording": "similar"
   }
  ],
  "grade": {
   "collection": {
    "en": "Sahih: in Sahih al-Bukhari",
    "bn": "সহীহ: সহীহ বুখারী-তে বর্ণিত"
   },
   "he": {
    "en": "Authentic hadith",
    "bn": "সহীহ",
    "ar": "صحيح"
   }
  },
  "attribution": {
   "en": "Narrated by Bukhari & Muslim",
   "bn": "মুত্তাফাকুন ‘আলাইহি (বুখারী ও মুসলিম)।",
   "ar": "رواه البخاري وروى مسلم بعضه"
  },
  "ar": "عن أنس رضي الله عنه : أن رسول الله صلى الله عليه وسلم دخل على ابنه إبراهيم رضي الله عنه وهو يجود بنفسه، فجعلت عينا رسول الله صلى الله عليه وسلم تذرفان. فقال له عبد الرحمن بن عوف: وأنت يا رسول الله؟! فقال: «يا ابن عوف إنها رحمة» ثم أتبعها بأخرى، فقال: «إن العين تدمع والقلب يحزن، ولا نقول إلا ما يرضي ربنا، وإنا لفراقك يا إبراهيم لمحزونون».",
  "en": "Anas ibn Mālik (may Allah be pleased with him) reported: The Messenger of Allah (may Allah’s peace and blessings be upon him) called upon his son Ibrahīm while he was breathing his last. The eyes of the Messenger of Allah (may Allah’s peace and blessings be upon him) began to shed tears. ‘Abdur-Rahmān ibn ‘Awf said to him: \"And you too, O Messenger of Allah?\" He said: \"O Ibn ‘Awf, this is a mercy.\" Then he followed it by saying: \"Indeed, the eyes shed tears and the heart is grieved, and we do not say except what pleases our Lord. And indeed, over your departure, O Ibrahīm, we are grieved.\"",
  "bn": "আনাস রাদিয়াল্লাহু ‘আনহু থেকে বর্ণিত, রাসূলুল্লাহ সাল্লাল্লাহ আলাইহি ওয়াসাল্লাম তাঁর পুত্র ইবরাহীমের নিকট গেলেন, যখন সে মারা যাচ্ছিল। তার দু’চোখ দিয়ে অশ্রু ঝরতে লাগল। আব্দুর রহমান ইবন আউফ তাঁকে বললেন, ‘হে আল্লাহর রাসূল?! আপনিও (কাঁদছেন)? তিনি বললেন, “হে ইবন আউফ! এটা রহমত।” অতঃপর তিনি আরো কাঁদলেন। তারপর বললেন, “চোখ অশ্রুপাত করছে এবং অন্তর দুঃখিত হচ্ছে,তবে আমরা সে কথাই বলব, যা আল্লাহকে সন্তুষ্ট করবে। আর হে ইবরাহীম! আমরা তোমার বিরহে দুঃখিত।”",
  "source": {
   "en": "https://hadeethenc.com/en/browse/hadith/5026",
   "bn": "https://hadeethenc.com/bn/browse/hadith/5026"
  },
  "note": {
   "en": "Bukhari 1303 has the full account; Muslim 2315 reports part of it, as HadeethEnc notes.",
   "bn": "পূর্ণ ঘটনা বুখারী ১৩০৩-এ আছে; মুসলিম ২৩১৫-এ এর অংশবিশেষ এসেছে, যেমন হাদীসএনসাইক্লোপিডিয়া উল্লেখ করেছে।"
  },
  "review": "source-checked"
 },
 {
  "id": "h22",
  "he": 3232,
  "cats": [
   "hope",
   "alone",
   "patience"
  ],
  "narrator": {
   "en": "Abu Hurayrah",
   "bn": "আবূ হুরায়রা"
  },
  "refs": [
   {
    "c": "bukhari",
    "n": "6340",
    "url": "https://sunnah.com/bukhari:6340",
    "wording": "shown"
   },
   {
    "c": "muslim",
    "n": "2735a",
    "url": "https://sunnah.com/muslim:2735a",
    "wording": "shown"
   },
   {
    "c": "muslim",
    "n": "2735c",
    "url": "https://sunnah.com/muslim:2735c",
    "wording": "shown"
   }
  ],
  "grade": {
   "collection": {
    "en": "Sahih: in Sahih al-Bukhari and Sahih Muslim",
    "bn": "সহীহ: সহীহ বুখারী ও সহীহ মুসলিম-তে বর্ণিত"
   },
   "he": {
    "en": "Authentic hadith",
    "bn": "সহীহ",
    "ar": "صحيح"
   }
  },
  "attribution": {
   "en": "Narrated by Bukhari & Muslim",
   "bn": "মুত্তাফাকুন ‘আলাইহি (বুখারী ও মুসলিম)।",
   "ar": "متفق عليه"
  },
  "ar": "عن أبي هريرة رضي الله عنه مرفوعاً: يُستجاب لأحدكم ما لم يَعْجَلْ: يقول: قد دعوت ربي، فلم يستجب لي».\nوفي رواية لمسلم: «لا يزال يُستجاب للعبد ما لم يَدْعُ بإثم، أو قطيعة رحم، ما لم يَسْتَعْجِلْ» قيل: يا رسول الله ما الاستعجال؟ قال: «يقول: قد دعوت، وقد دعوت، فلم أر يستجب لي، فَيَسْتَحْسِرُ عند ذلك ويَدَعُ الدعاء».",
  "en": "Abu Hurayrah (may Allah be pleased with him) reported that the Prophet (may Allah's peace and blessings be upon him) said: “The supplication of one of you is answered, as long as he is not in haste, saying: ‘I have supplicated to my Lord, but He did not answer me.'\" In another narration by Muslim: “The supplication of a slave will continue to be answered, as long as he does not ask for a sin or sever a tie of kinship, and is not hasty.” It was said: “O Messenger of Allah, what is hastiness?” He said: “It is to say: 'I have supplicated and supplicated, but I have not seen it has been answered.' He would then lose hope and stop supplicating.”",
  "bn": "আবূ হুরায়রা রাদিয়াল্লাহু ‘আনহু থেকে মারফু হিসেবে বর্ণিত, রাসূলুল্লাহ সাল্লাল্লাহ আলাইহি ওয়াসাল্লাম বলেছেন, “তোমাদের প্রত্যেকের দো‘আ গৃহীত হয়; যাবৎ না সে তাড়াহুড়ো করে। যেমন, সে বলে, ‘আমি আমার রবের নিকট দো‘আ করেছি, কিন্তু তিনি আমার দো‘আ কবুল করেন নি।” মুসলিমের এক বর্ণনায় আছে, “বান্দার দো‘আ ততক্ষণ পর্যন্ত কবূল করা হয়, যতক্ষণ সে গুনাহের জন্য বা আত্মীয়তার সম্পর্ক ছিন্ন করার জন্য দো‘আ না করে, আর যতক্ষণ না সে তাড়াহুড়ো করে।” জিজ্ঞাসা করা হলো, ‘হে আল্লাহর রাসূল! তাড়াহুড়ো মানে কী?’ তিনি বললেন, “দো‘আকারী বলে, ‘দো‘আ করলাম, আবার দো‘আ করলাম, অথচ দেখলাম না যে, তিনি আমার দো‘আ কবুল করছেন।’ কাজেই সে তখন আফসোস করে এবং দো‘আ করা ত্যাগ করে।”",
  "source": {
   "en": "https://hadeethenc.com/en/browse/hadith/3232",
   "bn": "https://hadeethenc.com/bn/browse/hadith/3232"
  },
  "note": {
   "en": "First narration: Bukhari 6340 and Muslim 2735a. The longer wording is Muslim 2735c.",
   "bn": "প্রথম বর্ণনা বুখারী ৬৩৪০ ও মুসলিম ২৭৩৫a-এর। দীর্ঘ বর্ণনাটি মুসলিম ২৭৩৫c-এর।"
  },
  "review": "source-checked"
 },
 {
  "id": "h23",
  "he": 3295,
  "cats": [
   "patience",
   "sad"
  ],
  "narrator": {
   "en": "Anas ibn Malik",
   "bn": "আনাস ইবন মালিক"
  },
  "refs": [
   {
    "c": "bukhari",
    "n": "1283",
    "url": "https://sunnah.com/bukhari:1283",
    "wording": "shown"
   },
   {
    "c": "muslim",
    "n": "926a",
    "url": "https://sunnah.com/muslim:926a",
    "wording": "shown"
   }
  ],
  "grade": {
   "collection": {
    "en": "Sahih: in Sahih al-Bukhari and Sahih Muslim",
    "bn": "সহীহ: সহীহ বুখারী ও সহীহ মুসলিম-তে বর্ণিত"
   },
   "he": {
    "en": "Authentic hadith",
    "bn": "সহীহ",
    "ar": "صحيح"
   }
  },
  "attribution": {
   "en": "Narrated by Bukhari & Muslim",
   "bn": "মুত্তাফাকুন ‘আলাইহি (বুখারী ও মুসলিম)।",
   "ar": "متفق عليه"
  },
  "ar": "عن أنس بن مالك رضي الله عنه قال: مرَّ النَّبي - صلى الله عليه وسلم - بامرَأَة تَبكِي عِند قَبرٍ، فقال: «اتَّقِي الله واصْبِري» فقالت: إليك عَنِّي؛ فَإِنَّك لم تُصَب بِمُصِيبَتِي ولم تَعرِفه، فقِيل لها: إِنَّه النَّبِي - صلى الله عليه وسلم - فأتت باب النبي - صلى الله عليه وسلم - فلم تجد عنده بوَّابِين، فقالت: لم أَعرِفكَ، فقال: «إِنَّما الصَّبرُ عِند الصَّدمَةِ الأُولَى». \nوفي رواية: «تَبكِي على صبِّي لها».",
  "en": "Anas ibn Mālik (may Allah be pleased with him) reported: The Prophet (may Allah's peace and blessings be upon him) passed by a woman who was weeping beside a grave. He said to her: \"Fear Allah and be patient.\" She said to him: \"Leave me alone, for you have not been afflicted with a calamity like mine.\" She did not recognize him. She was later informed that he was the Prophet (may Allah's peace and blessings be upon him). So, she went to his house and there she did not find any doormen. Then she said to him: \"I did not recognize you.\" He said: \"Indeed, patience is at the first shock.\"\nAccording to another narration: \"She was crying over a son of hers.”",
  "bn": "আনাস রাদিয়াল্লাহু ‘আনহু হতে বর্ণিত, নবী সাল্লাল্লাহ আলাইহি ওয়াসাল্লাম এক মহিলার পাশ দিয়ে অতিক্রম করলেন। সে একটি কবরের পাশে বসে কাঁদছিল। তিনি বললেন, “তুমি আল্লাহকে ভয় কর এবং ধৈর্য ধারণ কর।” সে বলল, ‘আপনি আমার নিকট হতে দূরে সরে যান। কারণ, আমি যে বিপদে পড়েছি আপনি তাতে পড়েননি।’ সে তাঁকে চিনতে পারেনি (তাই সে চরম শোকে তাঁকে অসঙ্গত কথা বলে ফেলল)। অতঃপর তাকে বলা হল যে, ‘তিনি নাবী সাল্লাল্লাহ আলাইহি ওয়াসাল্লাম ছিলেন।’ সুতরাং (এ কথা শুনে) সে নাবী সাল্লাল্লাহ আলাইহি ওয়াসাল্লাম-এর দুয়ারের কাছে এল। সেখানে সে দারোয়ানদেরকে পেল না। অতঃপর সে (সরাসরি প্রবেশ করে) বলল, ‘আমি আপনাকে চিনতে পারিনি।’ তিনি সাল্লাল্লাহ আলাইহি ওয়াসাল্লাম বললেন, “আঘাতের শুরুতে সবর করাটাই হল প্রকৃত সবর।” মুসলিমের একটি বর্ণনায় আছে, সে (মহিলাটি) তার মৃত শিশুর জন্য কাঁদছিল।",
  "source": {
   "en": "https://hadeethenc.com/en/browse/hadith/3295",
   "bn": "https://hadeethenc.com/bn/browse/hadith/3295"
  },
  "note": {
   "en": "Bukhari 1283 has this account; Muslim 926a is the same report. The final line is from another narration, as HadeethEnc notes.",
   "bn": "বুখারী ১২৮৩-এ এই ঘটনা আছে; মুসলিম ৯২৬a একই বর্ণনা। শেষ লাইনটি অন্য একটি বর্ণনা থেকে, যেমন হাদীসএনসাইক্লোপিডিয়া উল্লেখ করেছে।"
  },
  "review": "source-checked"
 },
 {
  "id": "h24",
  "he": 3553,
  "cats": [
   "reassure",
   "dhikr"
  ],
  "narrator": {
   "en": "Abu Musa al-Ash'ari",
   "bn": "আবূ মূসা আল-আশ‘আরী"
  },
  "refs": [
   {
    "c": "bukhari",
    "n": "2996",
    "url": "https://sunnah.com/bukhari:2996",
    "wording": "shown"
   }
  ],
  "grade": {
   "collection": {
    "en": "Sahih: in Sahih al-Bukhari",
    "bn": "সহীহ: সহীহ বুখারী-তে বর্ণিত"
   },
   "he": {
    "en": "Authentic",
    "bn": "সহীহ",
    "ar": "صحيح"
   }
  },
  "attribution": {
   "en": "Narrated by Al-Bukhāri",
   "bn": "এটি বুখারী বর্ণনা করেছেন।",
   "ar": "رواه البخاري"
  },
  "ar": "عن أبي موسى الأشعري رضي الله عنه قال: قال رسول الله صلى الله عليه وسلم: «إِذَا مَرِضَ الْعَبْدُ أَوْ سَافَرَ كُتِبَ لَهُ مِثْلُ مَا كَانَ يَعْمَلُ مُقِيمًا صَحِيحًا».",
  "en": "Abu Mūsa al-Ash‘ari (may Allah be pleased with him) reported: The Messenger of Allah (may Allah’s peace and blessings be upon him) said: \"If a person falls ill or travels, he shall be credited with whatever good deeds he used to perform while being at home and in good health.\"",
  "bn": "আবূ মূসা আল-আশ‘আরী রদিয়াল্লাহু ‘আনহু থেকে বর্ণিত, তিনি বলেছেন: রাসূলুল্লাহ সাল্লাল্লাহু ‘আলাইহি ওয়াসাল্লাম বলেন: “যখন বান্দা অসুস্থ হয় কিংবা সফরে থাকে, তখন তার জন্য তা-ই লেখা হয়, যা সে স্বগৃহে অবস্থানকালে সুস্থ অবস্থায় আমল করত।”",
  "source": {
   "en": "https://hadeethenc.com/en/browse/hadith/3553",
   "bn": "https://hadeethenc.com/bn/browse/hadith/3553"
  },
  "note": null,
  "review": "source-checked"
 },
 {
  "id": "h25",
  "he": 5440,
  "cats": [
   "better",
   "hope"
  ],
  "narrator": {
   "en": "Abu Hurayrah",
   "bn": "আবূ হুরায়রা"
  },
  "refs": [
   {
    "c": "bukhari",
    "n": "5997",
    "url": "https://sunnah.com/bukhari:5997",
    "wording": "close"
   },
   {
    "c": "muslim",
    "n": "2318a",
    "url": "https://sunnah.com/muslim:2318a",
    "wording": "similar"
   }
  ],
  "grade": {
   "collection": {
    "en": "Sahih: in Sahih al-Bukhari",
    "bn": "সহীহ: সহীহ বুখারী-তে বর্ণিত"
   },
   "he": {
    "en": "Authentic hadith",
    "bn": "সহীহ",
    "ar": "صحيح"
   }
  },
  "attribution": {
   "en": "Narrated by Bukhari & Muslim",
   "bn": "মুত্তাফাকুন ‘আলাইহি (বুখারী ও মুসলিম)।",
   "ar": "متفق عليه"
  },
  "ar": "عن أبي هريرة رضي الله عنه قال: قَبَّلَ النبيُّ صلى الله عليه وسلم الحسنَ بنَ عليٍّ رضي الله عنهما ، وعنده الأَقْرَعُ بنُ حَابِسٍ، فقال الأَقْرَعُ: إنَّ لي عَشَرَةً من الوَلَدِ ما قَبَّلْتُ مِنْهُمْ أَحَدًا، فَنَظَرَ إليهِ رسولُ اللهِ صلى الله عليه وسلم فقال: «مَنْ لَا يَرْحَم لَا يُرْحَمُ!».",
  "en": "Abu Hurayrah (may Allah be pleased with him) reported: The Messenger of Allah (may Allah’s peace and blessings be upon him) kissed Al-Hasan ibn ‘Ali while Al-Aqra‘ ibn Hābis was present. Al-Aqra‘ observed: \"I have ten children, and I have never kissed any of them.\" Thereupon, the Messenger of Allah (may Allah’s peace and blessings be upon him) looked at him and said: \"Whoever does not show mercy will not be shown mercy!\"",
  "bn": "আবূ হুরায়রা রাদিয়াল্লাহু আনহু থেকে মরফূ হিসেবে বর্ণিত, নবী সাল্লাল্লাহু আলাইহি ওয়া সাল্লাম হাসান বিন আলী রাদিয়াল্লাহু আনহুমাকে চুম্বন করেছেন। এ সময় আকরা বিন হাবিস তাঁর কাছে বসা ছিলেন। অতঃপর আকরা বললেন, আমার দশজন সন্তান আছে অথচ আমি তাদের কাউকেই চুম্বন করিনি। তখন রাসূলুল্লাহ সাল্লাল্লাহু আলাইহি ওয়া সাল্লাম তার দিকে তাকিয়ে বললেন, “যে দয়া করে না, তাকে দয়া করা হয় না।”",
  "source": {
   "en": "https://hadeethenc.com/en/browse/hadith/5440",
   "bn": "https://hadeethenc.com/bn/browse/hadith/5440"
  },
  "note": {
   "en": "Wording shown is closest to Sahih al-Bukhari 5997; Sahih Muslim 2318a has the same meaning in different wording.",
   "bn": "প্রদর্শিত শব্দ সহীহ বুখারী ৫৯৯৭-এর সবচেয়ে কাছাকাছি; সহীহ মুসলিম ২৩১৮a-এ একই অর্থ ভিন্ন শব্দে বর্ণিত।"
  },
  "review": "source-checked"
 },
 {
  "id": "h26",
  "he": 5866,
  "cats": [
   "guidance",
   "motivation"
  ],
  "narrator": {
   "en": "Anas ibn Malik",
   "bn": "আনাস ইবন মালিক"
  },
  "refs": [
   {
    "c": "bukhari",
    "n": "69",
    "url": "https://sunnah.com/bukhari:69",
    "wording": "close"
   },
   {
    "c": "muslim",
    "n": "1734",
    "url": "https://sunnah.com/muslim:1734",
    "wording": "similar"
   }
  ],
  "grade": {
   "collection": {
    "en": "Sahih: in Sahih al-Bukhari",
    "bn": "সহীহ: সহীহ বুখারী-তে বর্ণিত"
   },
   "he": {
    "en": "Authentic",
    "bn": "সহীহ",
    "ar": "صحيح"
   }
  },
  "attribution": {
   "en": "Agreed upon",
   "bn": "সহীহ বুখারী ও মুসলিম",
   "ar": "متفق عليه"
  },
  "ar": "عن أنس بن مالك رضي الله عنه عن النبي صلى الله عليه وسلم قال: «يَسِّرُوا وَلَا تُعَسِّرُوا، وَبَشِّرُوا وَلَا تُنَفِّرُوا».",
  "en": "Anas ibn Mālik (may Allah be pleased with him) reported: The Prophet (may Allah's peace and blessings be upon him) said: \"Make matters easy and do not make them difficult, and give people glad tidings and do not drive them away.\"",
  "bn": "আনাস রাযিয়াল্লাহু ‘আনহু থেকে বর্ণিত, নবী সাল্লাল্লাহু ‘আলাইহি ওয়াসাল্লাম বলেছেন: “তোমরা সহজ করো, কঠিন করো না, লোকদেরকে সুসংবাদ দাও, দূরে ঠেলে দিও না।”",
  "source": {
   "en": "https://hadeethenc.com/en/browse/hadith/5866",
   "bn": "https://hadeethenc.com/bn/browse/hadith/5866"
  },
  "note": {
   "en": "Wording shown is closest to Sahih al-Bukhari 69; Sahih Muslim 1734 has the same meaning in different wording.",
   "bn": "প্রদর্শিত শব্দ সহীহ বুখারী ৬৯-এর সবচেয়ে কাছাকাছি; সহীহ মুসলিম ১৭৩৪-এ একই অর্থ ভিন্ন শব্দে বর্ণিত।"
  },
  "review": "source-checked"
 },
 {
  "id": "h27",
  "he": 10101,
  "cats": [
   "better",
   "faith"
  ],
  "narrator": {
   "en": "'Abdullah ibn 'Amr",
   "bn": "আব্দুল্লাহ ইবনু ‘আমর"
  },
  "refs": [
   {
    "c": "bukhari",
    "n": "10",
    "url": "https://sunnah.com/bukhari:10",
    "wording": "shown"
   },
   {
    "c": "muslim",
    "n": "40",
    "url": "https://sunnah.com/muslim:40",
    "wording": "similar"
   }
  ],
  "grade": {
   "collection": {
    "en": "Sahih: in Sahih al-Bukhari",
    "bn": "সহীহ: সহীহ বুখারী-তে বর্ণিত"
   },
   "he": {
    "en": "Authentic",
    "bn": "সহীহ",
    "ar": "صحيح"
   }
  },
  "attribution": {
   "en": "Agreed upon",
   "bn": "সহীহ বুখারী ও মুসলিম",
   "ar": "متفق عليه"
  },
  "ar": "عَنْ عَبْدِ اللَّهِ بْنِ عَمْرٍو رَضِيَ اللَّهُ عَنْهُمَا عَنِ النَّبِيِّ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ قَالَ: «المُسْلِمُ مَنْ سَلِمَ المُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ، وَالمُهَاجِرُ مَنْ هَجَرَ مَا نَهَى اللَّهُ عَنْهُ».",
  "en": "‘Abdullah ibn ‘Amr (may Allah be pleased with him and his father) reported that the Prophet (may Allah's peace and blessings be upon him) said: \"A Muslim is the one from whose tongue and hand Muslims are safe, and a Muhājir (emigrant) is the one who abandons what Allah has forbidden.\"",
  "bn": "আব্দুল্লাহ ইবনু ’আমর রাদিয়াল্লাহু ‘আনহুমা নবী সাল্লাল্লাহু ‘আলাইহি ওয়াসাল্লাম থেকে বর্ণনা করেন, তিনি বলেছেন: “প্রকৃত মুসলিম সে, যার মুখ ও হাত থেকে সকল মুসলিম নিরাপদ থাকে। আর প্রকৃত মুহাজির সে, যে আল্লাহ যা থেকে নিষেধ করেছেন তা ত্যাগ করে।”",
  "source": {
   "en": "https://hadeethenc.com/en/browse/hadith/10101",
   "bn": "https://hadeethenc.com/bn/browse/hadith/10101"
  },
  "note": {
   "en": "Wording shown is closest to Sahih al-Bukhari 10; Sahih Muslim 40 has the same meaning in different wording.",
   "bn": "প্রদর্শিত শব্দ সহীহ বুখারী ১০-এর সবচেয়ে কাছাকাছি; সহীহ মুসলিম ৪০-এ একই অর্থ ভিন্ন শব্দে বর্ণিত।"
  },
  "review": "source-checked"
 },
 {
  "id": "h28",
  "he": 5348,
  "cats": [
   "motivation",
   "better"
  ],
  "narrator": {
   "en": "Abu Dharr",
   "bn": "আবূ যার"
  },
  "refs": [
   {
    "c": "muslim",
    "n": "2626",
    "url": "https://sunnah.com/muslim:2626",
    "wording": "shown"
   }
  ],
  "grade": {
   "collection": {
    "en": "Sahih: in Sahih Muslim",
    "bn": "সহীহ: সহীহ মুসলিম-এ বর্ণিত"
   },
   "he": {
    "en": "Authentic",
    "bn": "সহীহ",
    "ar": "صحيح"
   }
  },
  "attribution": {
   "en": "Narrated by Muslim",
   "bn": "ইমাম মুসলিম এটি বর্ণনা করেছেন",
   "ar": "رواه مسلم"
  },
  "ar": "عن أبي ذر رضي الله عنه قال: قال لي النبي صلى الله عليه وسلم: «لَا تَحْقِرَنَّ مِنَ الْمَعْرُوفِ شَيْئًا، وَلَوْ أَنْ تَلْقَى أَخَاكَ بِوَجْهٍ طَلْقٍ».",
  "en": "Abu Dharr (may Allah be pleased with him) reported: The Prophet (may Allah's peace and blessings be upon him) said to me: \"Do not belittle any good deed, even if it be meeting your brother with a cheerful face.\"",
  "bn": "আবূ যার রাদিয়াল্লাহু ‘আনহু থেকে বর্ণিত, তিনি বলেন, নবী সাল্লাল্লাহু ‘আলাইহি ওয়াসাল্লাম আমাকে বলেছেন: “সাধারণ কোনো ভালো কাজকে তুচ্ছ  করে দেখো না। তোমার ভাইয়ের সাথে হাসিমুখে সাক্ষাতের মতো (দেখতে সাধারণ কোনো) বিষয়ই হোক না কেনো।”",
  "source": {
   "en": "https://hadeethenc.com/en/browse/hadith/5348",
   "bn": "https://hadeethenc.com/bn/browse/hadith/5348"
  },
  "note": null,
  "review": "source-checked"
 },
 {
  "id": "h29",
  "he": 5797,
  "cats": [
   "better",
   "guidance"
  ],
  "narrator": {
   "en": "'A'ishah",
   "bn": "আয়েশা"
  },
  "refs": [
   {
    "c": "muslim",
    "n": "2593",
    "url": "https://sunnah.com/muslim:2593",
    "wording": "shown"
   }
  ],
  "grade": {
   "collection": {
    "en": "Sahih: in Sahih Muslim",
    "bn": "সহীহ: সহীহ মুসলিম-এ বর্ণিত"
   },
   "he": {
    "en": "Authentic",
    "bn": "সহীহ",
    "ar": "صحيح"
   }
  },
  "attribution": {
   "en": "Narrated by Muslim",
   "bn": "ইমাম মুসলিম এটি বর্ণনা করেছেন",
   "ar": "رواه مسلم"
  },
  "ar": "عَنْ عَائِشَةَ أُمِّ المُؤْمِنين رضي الله عنها زَوْجِ النَّبِيِّ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ أَنَّ رَسُولَ اللهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ قَالَ: «يَا عَائِشَةُ إِنَّ اللهَ رَفِيقٌ يُحِبُّ الرِّفْقَ، وَيُعْطِي عَلَى الرِّفْقِ مَا لَا يُعْطِي عَلَى الْعُنْفِ، وَمَا لَا يُعْطِي عَلَى مَا سِوَاهُ».",
  "en": "‘Ā’ishah, the Mother of the believers (may Allah be pleased with her) and wife of the Prophet (may Allah's peace and blessings be upon him), reported that the Messenger of Allah (may Allah's peace and blessings be upon him) said: \"O ‘Ā’ishah, indeed, Allah is gentle and He loves gentleness, and He gives for gentleness what He does not give for violence and what He does not give for anything else.\"",
  "bn": "নবী সাল্লাল্লাহু ‘আলাইহি ওয়াসাল্লামের স্ত্রী মুমিনদের মা আয়েশা রাদিয়াল্লাহু আনহা থেকে বর্ণিত, তিনি বলেন, আল্লাহর রাসূল সাল্লাল্লাহু ‘আলাইহি ওয়াসাল্লাম বলেছেন: “হে আয়িশাহ্! আল্লাহ তা’আলা নম্র ব্যবহারকারী। তিনি নম্রতাকে পছন্দ করেন। তিনি নম্রতার ওপর যা দান করেন তা কঠোরতা ও অন্য কোনো কিছুর ওপর দান করেন না।”",
  "source": {
   "en": "https://hadeethenc.com/en/browse/hadith/5797",
   "bn": "https://hadeethenc.com/bn/browse/hadith/5797"
  },
  "note": null,
  "review": "source-checked"
 },
 {
  "id": "h30",
  "he": 4969,
  "cats": [
   "alone",
   "faith"
  ],
  "narrator": {
   "en": "An-Nu'man ibn Bashir",
   "bn": "নু‘মান ইবনু বাশীর"
  },
  "refs": [
   {
    "c": "muslim",
    "n": "2586a",
    "url": "https://sunnah.com/muslim:2586a",
    "wording": "shown"
   },
   {
    "c": "bukhari",
    "n": "6011",
    "url": "https://sunnah.com/bukhari:6011",
    "wording": "similar"
   }
  ],
  "grade": {
   "collection": {
    "en": "Sahih: in Sahih Muslim",
    "bn": "সহীহ: সহীহ মুসলিম-এ বর্ণিত"
   },
   "he": {
    "en": "Authentic",
    "bn": "সহীহ",
    "ar": "صحيح"
   }
  },
  "attribution": {
   "en": "Agreed upon",
   "bn": "সহীহ বুখারী ও মুসলিম",
   "ar": "متفق عليه"
  },
  "ar": "عَنِ النُّعْمَانِ بْنِ بَشِيرٍ رضي الله عنه قَالَ: قَالَ رَسُولُ اللهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ: «مَثَلُ الْمُؤْمِنِينَ فِي تَوَادِّهِمْ وَتَرَاحُمِهِمْ وَتَعَاطُفِهِمْ مَثَلُ الْجَسَدِ، إِذَا اشْتَكَى مِنْهُ عُضْوٌ تَدَاعَى لَهُ سَائِرُ الْجَسَدِ بِالسَّهَرِ وَالْحُمَّى».",
  "en": "An-Nu‘mān ibn Bashīr (may Allah be pleased with him) reported that the Messenger of Allah (may Allah's peace and blessings be upon him) said: \"The believers, in their mutual love, compassion, and sympathy, are like a single body; if one of its organs suffers, the whole body will respond with sleeplessness and fever.\"",
  "bn": "নু‘মান ইবনু বাশীর রাদিয়াল্লাহু ‘আনহু থেকে বর্ণিত, তিনি বলেন, রাসূলুল্লাহ সাল্লাল্লাহু ‘আলাইহি ওয়াসাল্লাম বলেছেন: “পারস্পরিক দয়া, ভালোবাসা ও সহানুভূতি প্রদর্শনের ক্ষেত্রে মুমিনদের উদাহরণ একটি দেহের মতো। যখন শরীরের একটি অঙ্গ রোগাক্রান্ত হয়, তখন শরীরের সকল অঙ্গ-প্রত্যঙ্গ অনিদ্রা এবং জ্বরে অংশ নেয়।”",
  "source": {
   "en": "https://hadeethenc.com/en/browse/hadith/4969",
   "bn": "https://hadeethenc.com/bn/browse/hadith/4969"
  },
  "note": {
   "en": "Wording shown is closest to Sahih Muslim 2586a; Sahih al-Bukhari 6011 has the same meaning in different wording.",
   "bn": "প্রদর্শিত শব্দ সহীহ মুসলিম ২৫৮৬a-এর সবচেয়ে কাছাকাছি; সহীহ বুখারী ৬০১১-এ একই অর্থ ভিন্ন শব্দে বর্ণিত।"
  },
  "review": "source-checked"
 },
 {
  "id": "h31",
  "he": 5504,
  "cats": [
   "better",
   "guidance"
  ],
  "narrator": {
   "en": "'Abdullah ibn Mas'ud",
   "bn": "আব্দুল্লাহ ইবনু মাসঊদ"
  },
  "refs": [
   {
    "c": "muslim",
    "n": "2607c",
    "url": "https://sunnah.com/muslim:2607c",
    "wording": "shown"
   },
   {
    "c": "bukhari",
    "n": "6094",
    "url": "https://sunnah.com/bukhari:6094",
    "wording": "similar"
   }
  ],
  "grade": {
   "collection": {
    "en": "Sahih: in Sahih Muslim",
    "bn": "সহীহ: সহীহ মুসলিম-এ বর্ণিত"
   },
   "he": {
    "en": "Authentic",
    "bn": "সহীহ",
    "ar": "صحيح"
   }
  },
  "attribution": {
   "en": "Agreed upon",
   "bn": "সহীহ বুখারী ও মুসলিম",
   "ar": "متفق عليه"
  },
  "ar": "عَنْ عَبْدِ اللهِ بنِ مَسعُودٍ رضي الله عنه قَالَ: قَالَ رَسُولُ اللهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ: «عَلَيْكُمْ بِالصِّدْقِ، فَإِنَّ الصِّدْقَ يَهْدِي إِلَى الْبِرِّ، وَإِنَّ الْبِرَّ يَهْدِي إِلَى الْجَنَّةِ، وَمَا يَزَالُ الرَّجُلُ يَصْدُقُ وَيَتَحَرَّى الصِّدْقَ حَتَّى يُكْتَبَ عِنْدَ اللهِ صِدِّيقًا، وَإِيَّاكُمْ وَالْكَذِبَ، فَإِنَّ الْكَذِبَ يَهْدِي إِلَى الْفُجُورِ، وَإِنَّ الْفُجُورَ يَهْدِي إِلَى النَّارِ، وَمَا يَزَالُ الرَّجُلُ يَكْذِبُ وَيَتَحَرَّى الْكَذِبَ حَتَّى يُكْتَبَ عِنْدَ اللهِ كَذَّابًا».",
  "en": "‘Abdullah ibn Mas‘ūd (may Allah be pleased with him) reported: The Messenger of Allah (may Allah's peace and blessings be upon him) said: \"Adhere to truthfulness, for truthfulness leads to righteousness, and righteousness leads to Paradise. A man will keep telling the truth and strive to tell the truth until he is recorded with Allah as the most truthful. Beware of lying, for lying leads to wickedness and wickedness leads to Hellfire. A man will keep telling lies and strive to tell lies until he is recorded with Allah as a persistent liar.\"",
  "bn": "’আবদুল্লাহ ইবন মাসউদ রাদিয়াল্লাহু হতে বর্ণিত, তিনি বলেন, নবী সাল্লাল্লাহু আলাইহি ওয়াসাল্লাম বলেছেনঃ “তোমরা সত্যকে ধারণ কর। কেননা সততা নেক কর্মের দিকে পথপ্রদর্শন করে, আর নেককর্ম জান্নাতের পথপ্রদর্শন করে। কোন ব্যক্তি সর্বদা সত্য কথা বললে ও সত্য বলার চেষ্টায় রত থাকলে, অবশেষে আল্লাহর নিকটে সে সত্যবাদী হিসেবে লিপিবদ্ধ হয়। আর তোমরা মিথ্যা বলা থেকে বিরত থাকো! কেননা মিথ্যা পাপের দিকে পথপ্রদর্শন করে। আর পাপ নিশ্চিত জাহান্নামের দিকে পরিচালিত করে। কোন ব্যক্তি সর্বদা মিথ্যা কথা বললে এবং মিথ্যার উপর অবিচল থাকার চেষ্টা করলে, অবশেষে সে আল্লাহর নিকট মিথ্যাবাদীরূপে লিপিবদ্ধ হয়”।",
  "source": {
   "en": "https://hadeethenc.com/en/browse/hadith/5504",
   "bn": "https://hadeethenc.com/bn/browse/hadith/5504"
  },
  "note": {
   "en": "Wording shown is closest to Sahih Muslim 2607c; Sahih al-Bukhari 6094 has the same meaning in different wording.",
   "bn": "প্রদর্শিত শব্দ সহীহ মুসলিম ২৬০৭c-এর সবচেয়ে কাছাকাছি; সহীহ বুখারী ৬০৯৪-এ একই অর্থ ভিন্ন শব্দে বর্ণিত।"
  },
  "review": "source-checked"
 },
 {
  "id": "h32",
  "he": 6209,
  "cats": [
   "better",
   "faith"
  ],
  "narrator": {
   "en": "'Abdullah ibn Mas'ud",
   "bn": "আব্দুল্লাহ ইবনু মাসঊদ"
  },
  "refs": [
   {
    "c": "muslim",
    "n": "91a",
    "url": "https://sunnah.com/muslim:91a",
    "wording": "shown"
   }
  ],
  "grade": {
   "collection": {
    "en": "Sahih: in Sahih Muslim",
    "bn": "সহীহ: সহীহ মুসলিম-এ বর্ণিত"
   },
   "he": {
    "en": "Authentic hadith",
    "bn": "সহীহ",
    "ar": "صحيح"
   }
  },
  "attribution": {
   "en": "Narrated by Muslim",
   "bn": "এটি মুসলিম বর্ণনা করেছেন।",
   "ar": "رواه مسلم"
  },
  "ar": "عن عبد الله بن مسعود رضي الله عنه عن النبيِّ صلى الله عليه وسلم ، قَالَ: «لا يدخلُ الجنةَ مَن كان في قلبه مِثقال ذرةٍ من كِبر» فقال رجل: إنّ الرجلَ يحب أن يكون ثوبه حسنا، ونَعله حسنة؟ قال: «إنّ الله جميلٌ يحب الجمالَ، الكِبر: بَطَرُ الحق وغَمْطُ الناس».",
  "en": "‘Abdullāh ibn Mas‘ūd (may Allah be pleased with him) reported that the Prophet (may Allah's peace and blessings be upon him) said: \"Anyone has an atom's weight of arrogance in his heart will not enter Paradise.\" A man said:\" What if one likes his clothes and shoes to look good?\" He said: \"Verily, Allah is beautiful and He loves beauty. Arrogance is to reject the truth and look down on people.\"",
  "bn": "আব্দুল্লাহ ইবন মাসঊদ রাদিয়াল্লাহু ‘আনহু হতে বর্ণিত, নবী সাল্লাল্লাহু আলাইহি ওয়াসাল্লাম বলেছেন, “যার অন্তরে অণু পরিমাণও অহংকার থাকবে, সে জান্নাতে প্রবেশ করবে না।” (এ কথা শুনে) এক ব্যক্তি জিজ্ঞেস করল, ‘মানুষ তো পছন্দ করে যে, তার কাপড়-চোপড় সুন্দর হোক, তার জুতা সুন্দর হোক, (তাহলে সেটাও কি অহংকারের মধ্যে গণ্য হবে?)’ তিনি বললেন, “নিশ্চয় আল্লাহ সুন্দর, তিনি সৌন্দর্য ভালোবাসেন। অহংকার হচ্ছে সত্যকে প্রত্যাখ্যান করা ও মানুষকে তুচ্ছজ্ঞান করা।”",
  "source": {
   "en": "https://hadeethenc.com/en/browse/hadith/6209",
   "bn": "https://hadeethenc.com/bn/browse/hadith/6209"
  },
  "note": null,
  "review": "source-checked"
 },
 {
  "id": "h33",
  "he": 3361,
  "cats": [
   "alone",
   "faith"
  ],
  "narrator": {
   "en": "Abu Hurayrah",
   "bn": "আবূ হুরায়রা"
  },
  "refs": [
   {
    "c": "muslim",
    "n": "54a",
    "url": "https://sunnah.com/muslim:54a",
    "wording": "shown"
   }
  ],
  "grade": {
   "collection": {
    "en": "Sahih: in Sahih Muslim",
    "bn": "সহীহ: সহীহ মুসলিম-এ বর্ণিত"
   },
   "he": {
    "en": "Authentic",
    "bn": "সহীহ",
    "ar": "صحيح"
   }
  },
  "attribution": {
   "en": "Narrated by Muslim",
   "bn": "ইমাম মুসলিম এটি বর্ণনা করেছেন",
   "ar": "رواه مسلم"
  },
  "ar": "عَنْ أَبِي هُرَيْرَةَ رضي الله عنه قَالَ: قَالَ رَسُولُ اللهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ: «لَا تَدْخُلُونَ الْجَنَّةَ حَتَّى تُؤْمِنُوا، وَلَا تُؤْمِنُوا حَتَّى تَحَابُّوا، أَوَلَا أَدُلُّكُمْ عَلَى شَيْءٍ إِذَا فَعَلْتُمُوهُ تَحَابَبْتُمْ؟ أَفْشُوا السَّلَامَ بَيْنَكُمْ».",
  "en": "Abu Hurayrah (may Allah be pleased with him) reported that the Messenger of Allah (may Allah's peace and blessings be upon him) said: \"You will not enter Paradise until you believe and you will not believe until you love one another. Shall I guide you to something which, if you do, you will love one another? Spread the greeting of peace among yourselves.\"",
  "bn": "আবূ হুরাইরা রদিয়াল্লাহু ‘আনহু থেকে বর্ণিত, তিনি বলেন: রাসূলুল্লাহ সাল্লাল্লাহু ‘আলাইহি ওয়াসাল্লাম বলেছেন: لَا تَدْخُلُونَ الْجَنَّةَ حَتَّى تُؤْمِنُوا، وَلَا تُؤْمِنُوا حَتَّى تَحَابُّوا، أَوَلَا أَدُلُّكُمْ عَلَى شَيْءٍ إِذَا فَعَلْتُمُوهُ تَحَابَبْتُمْ؟ أَفْشُوا السَّلَامَ بَيْنَكُمْ\n“তোমরা ঈমান না আনা পর্যন্ত জান্নাতে প্রবেশ করবে না। আর তোমাদের ঈমান পরিপূর্ণ হবে না যতক্ষণ না তোমরা একে অপরকে ভালোবাসবে। আমি কি তোমাদেরকে এমন কোন জিনিস বলে দিব না, যার মাধ্যমে তোমরা  পরস্পরকে ভালোবাসবে? (তা হলো) তোমরা পরস্পরের মাঝে সালামের ব্যাপক প্রসার করো।”",
  "source": {
   "en": "https://hadeethenc.com/en/browse/hadith/3361",
   "bn": "https://hadeethenc.com/bn/browse/hadith/3361"
  },
  "note": null,
  "review": "source-checked"
 },
 {
  "id": "h34",
  "he": 5354,
  "cats": [
   "motivation",
   "knowledge"
  ],
  "narrator": {
   "en": "Abu Mas'ud al-Ansari",
   "bn": "আবূ মাস‘ঊদ আল-আনসারী"
  },
  "refs": [
   {
    "c": "muslim",
    "n": "1893a",
    "url": "https://sunnah.com/muslim:1893a",
    "wording": "shown"
   }
  ],
  "grade": {
   "collection": {
    "en": "Sahih: in Sahih Muslim",
    "bn": "সহীহ: সহীহ মুসলিম-এ বর্ণিত"
   },
   "he": {
    "en": "Authentic",
    "bn": "সহীহ",
    "ar": "صحيح"
   }
  },
  "attribution": {
   "en": "Narrated by Muslim",
   "bn": "ইমাম মুসলিম এটি বর্ণনা করেছেন",
   "ar": "رواه مسلم"
  },
  "ar": "عن أبي مسعود الأنصاري رضي الله عنه قال: جَاءَ رَجُلٌ إِلَى النَّبِيِّ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ فَقَالَ: إِنِّي أُبْدِعَ بِي فَاحْمِلْنِي، فَقَالَ: «مَا عِنْدِي»، فَقَالَ رَجُلٌ: يَا رَسُولَ اللهِ، أَنَا أَدُلُّهُ عَلَى مَنْ يَحْمِلُهُ، فَقَالَ رَسُولُ اللهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ: «مَنْ دَلَّ عَلَى خَيْرٍ فَلَهُ مِثْلُ أَجْرِ فَاعِلِهِ».",
  "en": "Abu Mas‘ūd al-Ansāri (may Allah be pleased with him) reported: A man came to the Prophet (may Allah's peace and blessings be upon him) and said: \"My camel has become exhausted, so give me a mount.\" He replied: \"I do not have any.\" Someone said: \"O Messenger of Allah, I can guide him to one who will give him a mount.\" Thereupon, the Messenger of Allah (may Allah's peace and blessings be upon him) said: \"Whoever guides to a good deed will get the same reward as the doer of that deed.\"",
  "bn": "আবূ মাস‘ঊদ আল-আনসারী রাদিয়াল্লাহু ‘আনহু থেকে বর্ণিত, তিনি বলেন: এক ব্যক্তি নবী সাল্লাল্লাহু ‘আলাইহি ওয়াসাল্লামের কাছে উপস্থিত হয়ে বলল, আমার বাহন ধ্বংস হয়ে গেছে, আপনি আমাকে একটি বাহন প্রদান করুন। তিনি বললেন: “আমার কাছে তো তা নেই।” সে সময় এক ব্যক্তি বললো, আমি এমন এক ব্যক্তির সন্ধান তাকে দিবো যে তাকে বাহন দিতে পারে। রাসূলুল্লাহ সাল্লাল্লাহু ‘আলাইহি ওয়াসাল্লাম বললেন: “যে ব্যক্তি কোন উত্তম বিষয়ে পথ প্রদর্শন করে, তার জন্য আমলকারীর সমান সাওয়াব রয়েছে।”",
  "source": {
   "en": "https://hadeethenc.com/en/browse/hadith/5354",
   "bn": "https://hadeethenc.com/bn/browse/hadith/5354"
  },
  "note": null,
  "review": "source-checked"
 },
 {
  "id": "h35",
  "he": 3584,
  "cats": [
   "sad",
   "patience"
  ],
  "narrator": {
   "en": "Abu Hurayrah",
   "bn": "আবূ হুরায়রা"
  },
  "refs": [
   {
    "c": "muslim",
    "n": "2956",
    "url": "https://sunnah.com/muslim:2956",
    "wording": "close"
   }
  ],
  "grade": {
   "collection": {
    "en": "Sahih: in Sahih Muslim",
    "bn": "সহীহ: সহীহ মুসলিম-এ বর্ণিত"
   },
   "he": {
    "en": "Authentic",
    "bn": "সহীহ",
    "ar": "صحيح"
   }
  },
  "attribution": {
   "en": "Narrated by Muslim",
   "bn": "ইমাম মুসলিম এটি বর্ণনা করেছেন",
   "ar": "رواه مسلم"
  },
  "ar": "عَنْ أَبِي هُرَيْرَةَ رَضيَ اللهُ عنه قَالَ: قَالَ رَسُولُ اللهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ: «الدُّنْيَا سِجْنُ الْمُؤْمِنِ وَجَنَّةُ الْكَافِرِ».",
  "en": "Abu Hurayrah (may Allah be pleased with him) reported that the Messenger of Allah (may Allah's peace and blessings be upon him) said: \"This world is a prison for the believer and a paradise for the disbeliever.\"",
  "bn": "আবূ হুরাইরা রদিয়াল্লাহু আনহু থেকে বর্ণিত, তিনি বলেন: রাসূলুল্লাহ সাল্লাল্লাহু আলাইহি ওয়াসাল্লাম বলেছেন: “দুনিয়া হলো মু’মিনের জেলখানা আর কাফিরের জান্নাত”।",
  "source": {
   "en": "https://hadeethenc.com/en/browse/hadith/3584",
   "bn": "https://hadeethenc.com/bn/browse/hadith/3584"
  },
  "note": null,
  "review": "source-checked"
 },
 {
  "id": "h36",
  "he": 5512,
  "cats": [
   "motivation",
   "better"
  ],
  "narrator": {
   "en": "Abu Hurayrah",
   "bn": "আবূ হুরায়রা"
  },
  "refs": [
   {
    "c": "muslim",
    "n": "2588",
    "url": "https://sunnah.com/muslim:2588",
    "wording": "shown"
   }
  ],
  "grade": {
   "collection": {
    "en": "Sahih: in Sahih Muslim",
    "bn": "সহীহ: সহীহ মুসলিম-এ বর্ণিত"
   },
   "he": {
    "en": "Authentic",
    "bn": "সহীহ",
    "ar": "صحيح"
   }
  },
  "attribution": {
   "en": "Narrated by Muslim",
   "bn": "ইমাম মুসলিম এটি বর্ণনা করেছেন",
   "ar": "رواه مسلم"
  },
  "ar": "عن أبي هريرة رضي الله عنه عن رسول الله صلى الله عليه وسلم قال: «مَا نَقَصَتْ صَدَقَةٌ مِنْ مَالٍ، وَمَا زَادَ اللهُ عَبْدًا بِعَفْوٍ إِلَّا عِزًّا، وَمَا تَوَاضَعَ أَحَدٌ لِلهِ إِلَّا رَفَعَهُ اللهُ».",
  "en": "Abu Hurayrah (may Allah be pleased with him) reported: The Messenger of Allah (may Allah's peace and blessings be upon him) said: \"Charity does not diminish wealth, and Allah does not increase a servant, on account of his forgiveness, except in honor, and no one humbles himself seeking the pleasure of Allah except that Allah will elevate him.\"",
  "bn": "আবূ হুরায়রা রাদিয়াল্লাহু ‘আনহু থেকে বর্ণিত, রাসূলুল্লাহ সাল্লাল্লাহু ‘আলাইহি ওয়াসাল্লাম বলেছেন: “সাদাকা করলে সম্পদ কমে যায় না। যে ব্যক্তি ক্ষমা করে আল্লাহ তার মর্যাদা বৃদ্ধি করে দেন। আর কেউ আল্লাহর সন্তুষ্টির জন্য বিনীত হলে তিনি তার মর্যাদা উঁচুতে তুলে দেন।”",
  "source": {
   "en": "https://hadeethenc.com/en/browse/hadith/5512",
   "bn": "https://hadeethenc.com/bn/browse/hadith/5512"
  },
  "note": null,
  "review": "source-checked"
 },
 {
  "id": "h37",
  "he": 3591,
  "cats": [
   "hope",
   "faith"
  ],
  "narrator": {
   "en": "Abu Hurayrah",
   "bn": "আবূ হুরায়রা"
  },
  "refs": [
   {
    "c": "muslim",
    "n": "233c",
    "url": "https://sunnah.com/muslim:233c",
    "wording": "shown"
   }
  ],
  "grade": {
   "collection": {
    "en": "Sahih: in Sahih Muslim",
    "bn": "সহীহ: সহীহ মুসলিম-এ বর্ণিত"
   },
   "he": {
    "en": "Authentic",
    "bn": "সহীহ",
    "ar": "صحيح"
   }
  },
  "attribution": {
   "en": "Narrated by Muslim",
   "bn": "ইমাম মুসলিম এটি বর্ণনা করেছেন",
   "ar": "رواه مسلم"
  },
  "ar": "عن أبي هريرة رضي الله عنه أن رسول الله صلى الله عليه وسلم كان يقول: «الصَّلَوَاتُ الْخَمْسُ، وَالْجُمُعَةُ إِلَى الْجُمُعَةِ، وَرَمَضَانُ إِلَى رَمَضَانَ، مُكَفِّرَاتٌ مَا بَيْنَهُنَّ إِذَا اجْتَنَبَ الْكَبَائِرَ».",
  "en": "Abu Hurayrah (may Allah be pleased with him) reported: The Messenger of Allah (may Allah’s peace and blessings be upon him) said: \"The five (daily) prayers, Friday prayer to the next Friday prayer, and Ramadan to the next Ramadan are expiation of the sins committed between them, so long as major sins are avoided.\"",
  "bn": "আবূ হুরায়রা রাদিয়াল্লাহু ‘আনহু থেকে বর্ণিত, রাসূলুল্লাহ সাল্লাল্লাহু ‘আলাইহি ওয়াসাল্লাম বলতেন: “পাঁচ ওয়াক্ত সালাত, এক জুমু‘আ থেকে আরেক জুমু‘আ আদায় করা এবং এক রমযান থেকে অপর রমযান পালন করা, এগুলোর মধ্যবর্তী সময়ের গুনাহের কাফফারা হয়ে যাবে; যদি সে কবীরা গুনাহ থেকে বিরত থাকে।”",
  "source": {
   "en": "https://hadeethenc.com/en/browse/hadith/3591",
   "bn": "https://hadeethenc.com/bn/browse/hadith/3591"
  },
  "note": null,
  "review": "source-checked"
 },
 {
  "id": "h38",
  "he": 5341,
  "cats": [
   "grateful",
   "sad"
  ],
  "narrator": {
   "en": "Abu Hurayrah",
   "bn": "আবূ হুরায়রা"
  },
  "refs": [
   {
    "c": "muslim",
    "n": "2963c",
    "url": "https://sunnah.com/muslim:2963c",
    "wording": "close"
   },
   {
    "c": "bukhari",
    "n": "6490",
    "url": "https://sunnah.com/bukhari:6490",
    "wording": "similar"
   }
  ],
  "grade": {
   "collection": {
    "en": "Sahih: in Sahih Muslim",
    "bn": "সহীহ: সহীহ মুসলিম-এ বর্ণিত"
   },
   "he": {
    "en": "Authentic",
    "bn": "সহীহ",
    "ar": "صحيح"
   }
  },
  "attribution": {
   "en": "Agreed upon",
   "bn": "সহীহ বুখারী ও মুসলিম",
   "ar": "متفق عليه"
  },
  "ar": "عَنْ أَبِي هُرَيْرَةَ رَضيَ اللهُ عنهُ قَالَ: قَالَ رَسُولُ اللهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ: «انْظُرُوا إِلَى مَنْ أَسْفَلَ مِنْكُمْ، وَلَا تَنْظُرُوا إِلَى مَنْ هُوَ فَوْقَكُمْ، فَهُوَ أَجْدَرُ أَلَّا تَزْدَرُوا نِعْمَةَ اللهِ عَلَيْكُمْ».",
  "en": "Abu Hurayrah (may Allah be pleased with him) reported: The Messenger of Allah (may Allah's peace and blessings be upon him) said: \"Look at those who are below you, and do not look at those who are above you, for that is more likely to hold you back from belittling the blessing of Allah upon you.\"",
  "bn": "আবূ হুরায়রা রদিয়াল্লাহু ‘আনহু থেকে বর্ণিত, তিনি বলেন, রাসূলুল্লাহ সাল্লাল্লাহু ‘আলাইহি ওয়া সাল্লাম বলেছেন: “তোমরা তোমাদের তুলনায় নিম্নস্তরের লোকদের প্রতি তাকাও। তবে তোমাদের তুলনায় উপরের স্তরের লোকদের প্রতি তাকাবে না। কেননা, তোমাদের ওপর  আল্লাহর নিয়ামতকে তুচ্ছ না ভাবার এটাই উত্তম পন্থা।”",
  "source": {
   "en": "https://hadeethenc.com/en/browse/hadith/5341",
   "bn": "https://hadeethenc.com/bn/browse/hadith/5341"
  },
  "note": {
   "en": "Wording shown is closest to Sahih Muslim 2963c; Sahih al-Bukhari 6490 has the same meaning in different wording.",
   "bn": "প্রদর্শিত শব্দ সহীহ মুসলিম ২৯৬৩c-এর সবচেয়ে কাছাকাছি; সহীহ বুখারী ৬৪৯০-এ একই অর্থ ভিন্ন শব্দে বর্ণিত।"
  },
  "review": "source-checked"
 },
 {
  "id": "h39",
  "he": 5545,
  "cats": [
   "reassure",
   "better"
  ],
  "narrator": {
   "en": "Sa'd ibn Abi Waqqas",
   "bn": "সা‘দ ইবনু আবী ওয়াক্কাস"
  },
  "refs": [
   {
    "c": "muslim",
    "n": "2965",
    "url": "https://sunnah.com/muslim:2965",
    "wording": "close"
   }
  ],
  "grade": {
   "collection": {
    "en": "Sahih: in Sahih Muslim",
    "bn": "সহীহ: সহীহ মুসলিম-এ বর্ণিত"
   },
   "he": {
    "en": "Authentic",
    "bn": "সহীহ",
    "ar": "صحيح"
   }
  },
  "attribution": {
   "en": "Narrated by Muslim",
   "bn": "ইমাম মুসলিম এটি বর্ণনা করেছেন",
   "ar": "رواه مسلم"
  },
  "ar": "عن سعد بن أبي وقاص رضي الله عنه قال: سمعت رسول الله صلى الله عليه وسلم يقول: «إِنَّ اللهَ يُحِبُّ الْعَبْدَ التَّقِيَّ الْغَنِيَّ الْخَفِيَّ».",
  "en": "Sa‘d ibn Abi Waqqās (may Allah be pleased with him) reported: I heard the Messenger of Allah (may Allah’s peace and blessings be upon him) say: \"Verily, Allah loves the servant who is pious, free of wants, and inconspicuous.\"",
  "bn": "সা‘দ ইবনু আবী ওয়াক্কাস রদিয়াল্লাহু ‘আনহু থেকে বর্ণিত, তিনি বলেন, আমি রাসূলুল্লাহ সাল্লাল্লাহু ‘আলাইহি ওয়াসাল্লামকে বলতে শুনেছি, তিনি বলেছেন: “নিশ্চয় আল্লাহ তা‘আলা মুত্তাকী, আত্মনির্ভরশীল ও আত্মগোপনকারী (নিজের গুণ প্রকাশে অনিচ্ছুক) বান্দাকে ভালোবাসেন।”",
  "source": {
   "en": "https://hadeethenc.com/en/browse/hadith/5545",
   "bn": "https://hadeethenc.com/bn/browse/hadith/5545"
  },
  "note": null,
  "review": "source-checked"
 },
 {
  "id": "h40",
  "he": 5915,
  "cats": [
   "guidance",
   "dhikr"
  ],
  "narrator": {
   "en": "'Ali ibn Abi Talib",
   "bn": "আলী ইবনু আবী তালিব"
  },
  "refs": [
   {
    "c": "muslim",
    "n": "2725a",
    "url": "https://sunnah.com/muslim:2725a",
    "wording": "shown"
   }
  ],
  "grade": {
   "collection": {
    "en": "Sahih: in Sahih Muslim",
    "bn": "সহীহ: সহীহ মুসলিম-এ বর্ণিত"
   },
   "he": {
    "en": "Authentic",
    "bn": "সহীহ",
    "ar": "صحيح"
   }
  },
  "attribution": {
   "en": "Narrated by Muslim",
   "bn": "ইমাম মুসলিম এটি বর্ণনা করেছেন",
   "ar": "رواه مسلم"
  },
  "ar": "عَنْ عَلِيٍّ رضي الله عنه قَالَ: قَالَ لِي رَسُولُ اللهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ: «قُلِ اللهُمَّ اهْدِنِي وَسَدِّدْنِي، وَاذْكُرْ بِالْهُدَى هِدَايَتَكَ الطَّرِيقَ، وَالسَّدَادِ سَدَادَ السَّهْمِ».",
  "en": "‘Ali (may Allah be pleased with him) reported: The Messenger of Allah (may Allah's peace and blessings be upon him) said to me: \"Say: O Allah, guide me and make me adhere to the straight path, and when asking for Huda (guidance), think of your being guided to the right path, and Sadād (adherence to the straight path) is the straightness of the arrow.\"",
  "bn": "আলী রাদিয়াল্লাহু আনহু থেকে বর্ণিত, তিনি বলেন: আমাকে রাসূলুল্লাহ সাল্লাল্লাহু আলাইহি ওয়াসাল্লাম বলেছেন: “বল اللَّهُمَّ اهْدِنِي وَسَدِّدْنِي (হে আল্লাহ! আপনি আমাকে সঠিক পথপ্রদর্শন করুন, আমাকে সোজা পথে পরিচালিত করুন)।” তিনি আমাকে আরও বলেছেন, “আপনার হিদায়াতকে সঠিক পথের মাধ্যমে এবং তীর সোজা করাকে সরলতার মাধ্যমে স্মরণ করুন।\"",
  "source": {
   "en": "https://hadeethenc.com/en/browse/hadith/5915",
   "bn": "https://hadeethenc.com/bn/browse/hadith/5915"
  },
  "note": null,
  "review": "source-checked"
 }
];
  return { SOURCE, CATEGORIES, COLLECTIONS, HADITH };
});
