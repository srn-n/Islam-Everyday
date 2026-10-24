/* Islam Everyday — An-Nawawi's Forty Hadith (Phase 5.3).
 *
 * All 42 narrations of Imam an-Nawawi's al-Arba'in an-Nawawiyyah, numbered as he numbered them, kept apart from the
 * general Hadith library (assets/hadith.js). Arabic, English and Bangla texts, the takhrij (attribution) and the grade
 * are reproduced unchanged from HadeethEnc.com, which publishes a dedicated entry for each of the 42; see SOURCE.
 * Numbers 15 and 36 are the very same HadeethEnc entries already in the general library (h10, h03), so they are stored
 * once and shown from there ("shared").
 * link: the hadith on sunnah.com (nawawi40:N), opened to confirm the number and the Arabic. refs: the underlying
 * collection numbers that sunnah.com links from that page (grade given where sunnah.com shows one). cls: "sahih" or
 * "hasan" from the grade text. flag "grade": outside al-Bukhari and Muslim with a Hasan grade or an-Nawawi's own grade,
 * marked for scholar review. note: an editorial or translation note, kept apart from the hadith text. also: general
 * library records that cite the same collection number.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.IE_NAWAWI = api;
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";
  const SOURCE = {
   "title": {
    "en": "Imam an-Nawawi's Forty Hadith",
    "bn": "ইমাম নববীর চল্লিশ হাদীস"
   },
   "count": 42,
   "publisher": "HadeethEnc.com (Encyclopedia of Translated Prophetic Hadiths)",
   "texts": "Arabic text, English translation, Bangla translation, takhrij and grade are reproduced unchanged from HadeethEnc.com (API v1), retrieved 2026-10-18. Characters are stored in Unicode NFC form. One private-use character in HadeethEnc's Arabic of no. 11 is kept in the data and removed only when displayed.",
   "numbering": "Numbers follow an-Nawawi's own order (1–42), confirmed against sunnah.com/nawawi40, whose Arabic for each number was compared with the HadeethEnc text.",
   "terms": "HadeethEnc republication terms: (1) no modification, addition or deletion of the content; (2) clearly refer to the publisher and the source (HadeethEnc.com); (3) mention the version number; (4) keep the transcript information; (5) notify HadeethEnc.com of any note on the translation; (6) update to the latest version; (7) no inappropriate advertisements.",
   "version": "HadeethEnc's API does not expose a version number for these entries; the retrieval date is recorded instead.",
   "grades": "Grades are HadeethEnc's. 'Authentic' (sahih) and 'Hasan' are shown apart. Narrations outside al-Bukhari and Muslim with a Hasan grade, or graded only by an-Nawawi, are flagged for review; their grading is not independently verified here.",
   "review": "source-checked: number, Arabic, takhrij and grade checked against sunnah.com and HadeethEnc.com. Not reviewed by a qualified scholar."
  };
  const COLLECTIONS = {"bukhari":{"en":"Sahih al-Bukhari","bn":"সহীহ বুখারী"},"muslim":{"en":"Sahih Muslim","bn":"সহীহ মুসলিম"},"nasai":{"en":"Sunan an-Nasa'i","bn":"সুনান আন-নাসায়ী"},"abudawud":{"en":"Sunan Abi Dawud","bn":"সুনান আবু দাউদ"},"nawawi40":{"en":"An-Nawawi's Forty","bn":"নববীর চল্লিশ হাদীস"}};
  const FLAGS = {"grade":{"en":"Grade marked for review: this narration is not in Sahih al-Bukhari or Sahih Muslim, and the grade shown is the one HadeethEnc gives (an-Nawawi's or at-Tirmidhi's judgement where it says so). Hadith scholars have not always graded such chains the same way, and this app has not checked them independently. Ask a qualified scholar before relying on the grade.","bn":"মান পর্যালোচনার জন্য চিহ্নিত: এই বর্ণনাটি সহীহ বুখারী বা সহীহ মুসলিমে নেই; এখানে দেখানো মান হাদীসএনসি যা দিয়েছে তা-ই (যেখানে উল্লেখ আছে, সেখানে ইমাম নববী বা ইমাম তিরমিযীর মত)। এ ধরনের সনদের মান নির্ণয়ে মুহাদ্দিসগণ সবসময় একমত হননি, এবং এই অ্যাপ তা স্বাধীনভাবে যাচাই করেনি। মানের উপর নির্ভর করার আগে একজন যোগ্য আলেমের পরামর্শ নিন।"}};
  const HADITH = [
 {
  "n": 1,
  "he": 66511,
  "link": "https://sunnah.com/nawawi40:1",
  "refs": [
   {
    "c": "bukhari",
    "n": "6689",
    "url": "https://sunnah.com/bukhari:6689"
   },
   {
    "c": "muslim",
    "n": "1907a",
    "url": "https://sunnah.com/muslim:1907a"
   }
  ],
  "ar": "عَنْ أَمِيرِ المُؤْمِنِينَ أَبِي حَفْصٍ عُمَرَ بْنِ الخَطَّابِ رضي الله عنه قَالَ: سَمِعْتُ رَسُولَ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ يَقُولُ: «إنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى، فَمَنْ كَانَتْ هِجْرَتُهُ إلَى اللَّهِ وَرَسُولِهِ فَهِجْرَتُهُ إلَى اللَّهِ وَرَسُولِهِ، وَمَنْ كَانَتْ هِجْرَتُهُ لِدُنْيَا يُصِيبُهَا أَوْ امْرَأَةٍ يَنْكِحُهَا فَهِجْرَتُهُ إلَى مَا هَاجَرَ إلَيْهِ».",
  "en": "The Commander of the Believers, Abu Hafs ‘Umar ibn al-Khattāb (may Allah be pleased with him) reported: I heard the Messenger of Allah (ﷺ) say: \"Verily, the reward of deeds depends on intentions, and each person will be rewarded according to what he intended. So, he whose emigration is for the sake of Allah and His Messenger, his emigration will be for the sake of Allah and His Messenger, and he whose emigration is to achieve some worldly gain or take some woman in marriage, his migration will be for what he has migrated for.\"",
  "bn": "আমীরুল মুমিনীন আবু হাফস উমার ইবনুল খাত্তাব রদিয়াল্লাহু আনহু বলেন: আমি রাসূলুল্লাহ সাল্লাল্লাহু আলাইহি ওয়াসাল্লামকে বলতে শুনেছি: “সব কাজ (এর প্রাপ্য) হবে নিয়ত অনুযায়ী। আর মানুষ তার নিয়ত অনুযায়ী প্রতিফল পাবে। কাজেই যার হিজরত হবে আল্লাহ ও তাঁর রাসূলের উদ্দেশ্যে, তার হিজরত আল্লাহ ও তাঁর রাসূলের উদ্দেশ্যে হয়েছে বলেই ধরা হবে। আর যার হিজরত হয় দুনিয়া অর্জনের জন্য বা কোন নারীকে বিবাহ করার উদ্দেশ্যে, তার হিজরত সে উদ্দেশ্যেই হবে যে উদ্দেশ্যে সে হিজরত করেছে।”",
  "attribution": {
   "en": "It was narrated by the two Imāms of the scholars of Hadīth - Abu ‘Abdullāh Muhammad ibn Ismā‘īl ibn Ibrāhīm ibn al-Mughīrah ibn Bardizbah al-Bukhāri and Abu al-Husayn Muslim ibn al-Hajjāj ibn Muslim a",
   "bn": "মুহাদ্দিসগণের ইমামদ্বয় আবু আব্দুল্লাহ মুহাম্মাদ ইবন ইসমাইল ইবন ইবরাহীম ইবনুল মুগীরাহ ইবন বারদিযবাহ আল-বুখারী এবং আবুল হুসাইন মুসলিম ইবনুল হাজ্জাজ ইবন মুসলিম আল-কুশাইরী আন-নাইসাপূরী তাদের উভয়ের সহীহ গ্",
   "ar": "رواه إماما المحدثين أبو عبد الله محمد بن إسماعيل بن إبراهيم بن المغيرة بن بردزبه البخاري،  وأبو الحسين مسلم بن الحجاج بن مسلم القشيري النيسابوري في صحيحيهما اللذين هما أصح الكتب المصنفة"
  },
  "grade": {
   "en": "Authentic",
   "bn": "সহীহ",
   "ar": "صحيح"
  },
  "cls": "sahih",
  "source": {
   "en": "https://hadeethenc.com/en/browse/hadith/66511",
   "bn": "https://hadeethenc.com/bn/browse/hadith/66511"
  },
  "also": [
   "h13"
  ],
  "flag": null,
  "note": null,
  "review": "source-checked"
 },
 {
  "n": 2,
  "he": 4563,
  "link": "https://sunnah.com/nawawi40:2",
  "refs": [
   {
    "c": "muslim",
    "n": "8a",
    "url": "https://sunnah.com/muslim:8a"
   }
  ],
  "ar": "عن عمر بن الخطاب رضي الله عنه قال: بَيْنَمَا نَحْنُ عِنْدَ رَسُولِ اللهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ ذَاتَ يَوْمٍ إِذْ طَلَعَ عَلَيْنَا رَجُلٌ شَدِيدُ بَيَاضِ الثِّيَابِ، شَدِيدُ سَوَادِ الشَّعَرِ، لَا يُرَى عَلَيْهِ أَثَرُ السَّفَرِ، وَلَا يَعْرِفُهُ مِنَّا أَحَدٌ، حَتَّى جَلَسَ إِلَى النَّبِيِّ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ، فَأَسْنَدَ رُكْبَتَيْهِ إِلَى رُكْبَتَيْهِ، وَوَضَعَ كَفَّيْهِ عَلَى فَخِذَيْهِ، وَقَالَ: يَا مُحَمَّدُ، أَخْبِرْنِي عَنِ الْإِسْلَامِ، فَقَالَ رَسُولُ اللهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ: «الْإِسْلَامُ أَنْ تَشْهَدَ أَنْ لَا إِلَهَ إِلَّا اللهُ، وَأَنَّ مُحَمَّدًا رَسُولُ اللهِ، وَتُقِيمَ الصَّلَاةَ، وَتُؤْتِيَ الزَّكَاةَ، وَتَصُومَ رَمَضَانَ، وَتَحُجَّ الْبَيْتَ إِنِ اسْتَطَعْتَ إِلَيْهِ سَبِيلًا» قَالَ: صَدَقْتَ، قَالَ: فَعَجِبْنَا لَهُ، يَسْأَلُهُ وَيُصَدِّقُهُ، قَالَ: فَأَخْبِرْنِي عَنِ الْإِيمَانِ، قَالَ: «أَنْ تُؤْمِنَ بِاللهِ، وَمَلَائِكَتِهِ، وَكُتُبِهِ، وَرُسُلِهِ، وَالْيَوْمِ الْآخِرِ، وَتُؤْمِنَ بِالْقَدَرِ خَيْرِهِ وَشَرِّهِ» قَالَ: صَدَقْتَ، قَالَ: فَأَخْبِرْنِي عَنِ الْإِحْسَانِ، قَالَ: «أَنْ تَعْبُدَ اللهَ كَأَنَّكَ تَرَاهُ، فَإِنْ لَمْ تَكُنْ تَرَاهُ فَإِنَّهُ يَرَاكَ» قَالَ: فَأَخْبِرْنِي عَنِ السَّاعَةِ، قَالَ: «مَا الْمَسْؤُولُ عَنْهَا بِأَعْلَمَ مِنَ السَّائِلِ» قَالَ: فَأَخْبِرْنِي عَنْ أَمَارَتِهَا، قَالَ: «أَنْ تَلِدَ الْأَمَةُ رَبَّتَهَا، وَأَنْ تَرَى الْحُفَاةَ الْعُرَاةَ الْعَالَةَ رِعَاءَ الشَّاءِ يَتَطَاوَلُونَ فِي الْبُنْيَانِ» قَالَ: ثُمَّ انْطَلَقَ، فَلَبِثْتُ مَلِيًّا ثُمَّ قَالَ لِي: «يَا عُمَرُ، أَتَدْرِي مَنِ السَّائِلُ؟» قُلْتُ: اللهُ وَرَسُولُهُ أَعْلَمُ، قَالَ: «فَإِنَّهُ جِبْرِيلُ، أَتَاكُمْ يُعَلِّمُكُمْ دِينَكُمْ».",
  "en": "‘Umar ibn al-Khattāb (may Allah be pleased with him) reported: One day, we were sitting with the Messenger of Allah (may Allah's peace and blessings be upon him) when there appeared before us a man dressed in extremely white clothes and had very black hair. No traces of travel were visible on him, and none of us knew him. He came in and sat down opposite the Prophet (may Allah's peace and blessings be upon him), rested his knees against his, and placed the palms of his hands on his (the Prophet's) thighs. He said: \"O Muhammad, tell me about Islam.\" The Messenger of Allah (may Allah's peace and blessings be upon him) said: \"Islam is to testify that there is no god but Allah and that Muhammad is the Messenger of Allah, to establish prayer, to pay Zakah, to fast Ramadan, and to perform Hajj to the House if you are able to find a way thereto.\" He said: \"You have spoken the truth.\" We wondered how he asked him and affirmed his truthfulness. Then, he said: \"Tell me about Imān (faith).\" He said: \"It is to believe in Allah, His angels, His books, His messengers, and the Last Day, and believe in the divine decree, the pleasant and unpleasant aspects thereof.\" Then, he said: \"You have spoken the truth.\" Then, he said: \"Tell me about ihsān.\" He said: \"It is to worship Allah as if you see Him, for if you do not see Him, He sees you.\" He said: \"Tell me about the Hour.\" He said: \"The one questioned about it knows no more than the questioner.\" He said: \"Then, tell me about its signs.\" He said: \"The slave girl will give birth to her mistress, and you will see the barefoot, naked, and destitute herdsmen competing in constructing lofty buildings.\" Then, he departed. I stayed for a while, and then he said to me: \"O 'Umar, do you know who the questioner was?\" I said: \"Allah and His Messenger know best.\" He said: \"He was Jibrīl (Gabriel). He came to teach you your religion.\"",
  "bn": "‘উমার ইবনুল খত্তাব রাদিয়াল্লাহু ‘আনহু থেকে বর্ণিত, তিনি বলেন: “একবার আমরা রাসূলুল্লাহ সাল্লাল্লাহু ‘আলাইহি ওয়াসাল্লামের নিকটে ছিলাম। এমন সময় একজন লোক আমাদের কাছে উপস্থিত হলেন। তার পরিধানের কাপড় ছিল সাদা ধবধবে, মাথার কেশ ছিল কালো কুচকুচে। তার মধ্যে সফরের কোন চিহ্ন ছিল না আবার আমরা কেউ তাকে চিনতে পারলাম না। তিনি নিজের দুই হাঁটু নবী সাল্লাল্লাহু ‘আলাইহি ওয়াসাল্লামের দুই হাঁটুর সাথে লাগিয়ে বসে পড়লেন আর তার দুই হাত নবী সাল্লাল্লাহু ‘আলাইহি ওয়া সাল্লামের দুই উরুর উপর রাখলেন। তারপর তিনি বললেন: হে মুহাম্মাদ! আমাকে ইসলাম সস্পর্কে অবহিত করুন। রাসূলুল্লাহ সাল্লাল্লাহু ‘আলাইহি ওয়া সাল্লাম বললেন: “ইসলাম হলো, তুমি এ কথার সাক্ষ্য প্রদান করবে যে, আল্লাহ ব্যতীত কোনো (প্রকৃত) মাবূদ নেই এবং নিশ্চয়ই মুহাম্মাদ সাল্লাল্লাহু আলাইহি ওয়া সাল্লাম আল্লাহর রাসূল, সালাত কায়েম করবে, যাকাত আদায় করবে, রমাযানের সাওম পালন করবে এবং বাইতুল্লাহতে পৌঁছার সামর্থ্য থাকলে হজ পালন করবে।” আগন্তুক বললেন, আপনি ঠিকই বলেছেন। তার কথা শুনে আমরা বিস্মিত হলাম যে, তিনিই প্রশ্ন করেছেন আবার তিনিই-তা সত্যায়ন করছেন। আগন্তুক বললেন: আমাকে ঈমান সম্পর্কে অবহিত করুন। রাসূলুল্লাহ সাল্লাল্লাহু ‘আলাইহি ওয়া সাল্লাম বললেন: “ঈমান হলো তুমি আল্লাহর প্রতি, তাঁর ফিরিশতাদের প্রতি, তাঁর কিতাবসমূহের প্রতি, তাঁর রাসূলগণের প্রতি এবং আখিরাতের প্রতি ঈমান আনায়ন করবে, আর তাকদীরের ভাল-মন্দের প্রতি ঈমান রাখবে।” আগন্তুক বললেন: আপনি ঠিকই বলেছেন। তারপর বললেন: আমাকে ইহসান সম্পর্কে অবহিত করুন। রাসূলুল্লাহ সাল্লাল্লাহু ‘আলাইহি ওয়া সাল্লাম বললেন: “ইহসান হলো, তুমি এমনভাবে ইবাদত-বন্দেগী করবে, যেন তুমি আল্লাহকে দেখছ, যদি তুমি তাকে নাও দেখ, তাহলে এ বিশ্বাস রাখবে যে, তিনি তোমাকে দেখছেন।” আগন্তুক বললেন: আমাকে কিয়ামত সম্পর্কে অবহিত করুন। রাসূলুল্লাহ সাল্লাল্লাহু ‘আলাইহি ওয়া সাল্লাম বললেন: “এ বিষয়ে প্রশ্নকারীর চেয়ে যাকে জিজ্ঞেস করা হয়েছে তিনি অধিক অবগত নন।” আগন্তুক বললেন: আমাকে এর আলামত সম্পর্কে অবহিত করুন। রাসূলুল্লাহ সাল্লাল্লাহু ‘আলাইহি ওয়া সাল্লাম বললেন: “তা হলো এই যে, দাসী তার প্রভুর জননী হবে এবং নগ্নপদ, বিবস্ত্রদেহ, দরিদ্র মেষপালকদের বিরাট বিরাট অট্টালিকার প্রতিযোগিতায় গর্বিত দেখতে পাবে।” উমার ইবনুল খত্তাব রদিয়াল্লাহু ‘আনহু বললেন: পরে আগন্তুক প্রস্থান করলেন। আমি বেশ সময় অপেক্ষা করলাম। তারপর রাসূলুল্লাহ সাল্লাল্লাহু ‘আলাইহি ওয়া সাল্লাম আমাকে বললেন: “হে উমার ! তুমি জানো, এই প্রশ্নকারী কে?” আমি বললাম, আল্লাহ ও তাঁর রাসূলই সম্যক জ্ঞাত আছেন। রাসূলুল্লাহ সাল্লাল্লাহু ‘আলাইহি ওয়া সাল্লাম বললেন: “তিনি হচ্ছেন জিবরীল। তিনি তোমাদের কে তোমাদের দীন শিক্ষা দিতে এসেছিলেন।”",
  "attribution": {
   "en": "Narrated by Muslim",
   "bn": "ইমাম মুসলিম এটি বর্ণনা করেছেন",
   "ar": "رواه مسلم"
  },
  "grade": {
   "en": "Authentic",
   "bn": "সহীহ",
   "ar": "صحيح"
  },
  "cls": "sahih",
  "source": {
   "en": "https://hadeethenc.com/en/browse/hadith/4563",
   "bn": "https://hadeethenc.com/bn/browse/hadith/4563"
  },
  "also": [],
  "flag": null,
  "note": null,
  "review": "source-checked"
 },
 {
  "n": 3,
  "he": 66512,
  "link": "https://sunnah.com/nawawi40:3",
  "refs": [
   {
    "c": "bukhari",
    "n": "8",
    "url": "https://sunnah.com/bukhari:8"
   },
   {
    "c": "muslim",
    "n": "16c",
    "url": "https://sunnah.com/muslim:16c"
   }
  ],
  "ar": "عَنْ أَبِي عَبْدِ الرَّحْمَنِ عَبْدِ اللَّهِ بْنِ عُمَرَ بْنِ الخَطَّابِ رَضِيَ اللَّهُ عَنْهُ قَالَ: سَمِعْتُ رَسُولَ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ يَقُولُ: «بُنِيَ الإِسْلَامُ عَلَى خَمْسٍ: شَهَادَةِ أَنْ لَا إلَهَ إلَّا اللَّهُ وَأَنَّ مُحَمَّدًا ‌عَبْدُهُ ‌وَرَسُولُهُ، وَإِقَامِ الصَّلَاةِ، وَإِيتَاءِ الزَّكَاةِ، وَحَجِّ الْبَيْتِ، وَصَوْمِ رَمَضَانَ».",
  "en": "Abu ‘Abdur-Rahmān ‘Abdullah ibn ‘Umar ibn al-Khattāb (may Allah be pleased with him) reported: I heard the Messenger of Allah (ﷺ) say: \"Islam is built on five: testifying that there is no god but Allah and that Muhammad is His slave and Messenger, establishing prayer, giving Zakah, performing Hajj to the (Sacred) House, and fasting Ramadān.\"",
  "bn": "আবূ আব্দুর রহমান আব্দুল্লাহ ইবনু ’উমার ইবনুল খাত্তাব রাদিয়াল্লাহু আনহু হতে বর্ণিত। তিনি বলেন, আমি আল্লাহর রাসূল সাল্লাল্লাহু আলাইহি ওয়াসাল্লামকে বলতে শুনেছি: «بُنِيَ الإِسْلاَمُ عَلَى خَمْسٍ: شَهَادَةِ أَنْ لاَ إِلَهَ إِلَّا اللَّهُ وَأَنَّ مُحَمَّدًا رَسُولُ اللَّهِ، وَإِقَامِ الصَّلاَةِ، وَإِيتَاءِ الزَّكَاةِ، وَالحَجِّ، وَصَوْمِ رَمَضَانَ»\n“ইসলামের ভিত্তি পাঁচটি। -এ কথার সাক্ষ্য দেয়া যে, আল্লাহ ছাড়া সত্য কোনো মাবূদ নেই এবং নিশ্চয় মুহাম্মাদ সাল্লাল্লাহু ‘আলাইহি ওয়াসাল্লাম আল্লাহর রাসূল। সালাত কায়েম করা, যাকাত দেয়া, হজ করা এবং রমযানের সাওম পালন করা।”",
  "attribution": {
   "en": "Narrated by Al-Bukhāri and Muslim",
   "bn": "ইমাম বুখারী ও মুসলিম এটি বর্ণনা করেছেন",
   "ar": "رواه البخاري ومسلم"
  },
  "grade": {
   "en": "Authentic",
   "bn": "সহীহ",
   "ar": "صحيح"
  },
  "cls": "sahih",
  "source": {
   "en": "https://hadeethenc.com/en/browse/hadith/66512",
   "bn": "https://hadeethenc.com/bn/browse/hadith/66512"
  },
  "also": [],
  "flag": null,
  "note": null,
  "review": "source-checked"
 },
 {
  "n": 4,
  "he": 66513,
  "link": "https://sunnah.com/nawawi40:4",
  "refs": [
   {
    "c": "bukhari",
    "n": "3208",
    "url": "https://sunnah.com/bukhari:3208"
   },
   {
    "c": "muslim",
    "n": "2643a",
    "url": "https://sunnah.com/muslim:2643a"
   }
  ],
  "ar": "عَنْ أَبِي عَبْدِ الرَّحْمَنِ عَبْدِ اللَّهِ بْنِ مَسْعُودٍ رَضِيَ اللَّهُ عَنْهُ قَالَ: حَدَّثَنَا رَسُولُ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ وَهُوَ الصَّادِقُ المَصْدُوقُ: «إِنَّ أَحَدَكُمْ يُجْمَعُ خَلْقُهُ فِي بَطْنِ أُمِّهِ أَرْبَعِينَ يَوْمًا، ثُمَّ يَكُونُ عَلَقَةً مِثْلَ ذَلِكَ، ثُمَّ يَكُونُ مُضْغَةً مِثْلَ ذَلِكَ، ثُمَّ يُرْسَلُ إلَيْهِ المَلَكُ فَيَنْفُخُ فِيهِ الرُّوحَ، وَيُؤْمَرُ بِأَرْبَعِ كَلِمَاتٍ: بِكَتْبِ رِزْقِهِ، وَأَجَلِهِ، وَعَمَلِهِ، وَشَقِيٍّ أَوْ سَعِيدٍ؛ فَوَالَّذِي لَا إلَهَ غَيْرُهُ إنَّ أَحَدَكُمْ لَيَعْمَلُ بِعَمَلِ أَهْلِ الجَنَّةِ حَتَّى مَا يَكُونُ بَيْنَهُ وَبَيْنَهَا إلَّا ذِرَاعٌ فَيَسْبِقُ عَلَيْهِ الكِتَابُ فَيَعْمَلُ بِعَمَلِ أَهْلِ النَّارِ فَيَدْخُلُهَا، وَإِنَّ أَحَدَكُمْ لَيَعْمَلُ بِعَمَلِ أَهْلِ النَّارِ حَتَّى مَا يَكُونُ بَيْنَهُ وَبَيْنَهَا إلَّا ذِرَاعٌ، فَيَسْبِقُ عَلَيْهِ الكِتَابُ فَيَعْمَلُ بِعَمَلِ أَهْلِ الجَنَّةِ فَيَدْخُلُهَا».",
  "en": "Abu ‘Abdur-Rahmān ‘Abdullah ibn Mas‘ūd (may Allah be pleased with him) reported: The Messenger of Allah (ﷺ) related to us, and he is the truthful and the trusted one; he said: \"The creation of each one of you is brought together in his mother's womb for forty days. Then, he becomes a clinging clot for a similar period, then a lump (of flesh) for a similar period. Then, the angel is sent to him, who breathes life into him and is commanded to write down four things: his provision, lifespan, deeds, and whether miserable or happy. By the One other than Whom there is no god, one of you would do the deeds of the people of Paradise until he is only an arm's length away from it, but the predestination overtakes him, causing him to do the deed of the people of Hellfire, and he enters it; and one of you would do the deeds of the people of Hellfire until he is only an arm's length away from it, but the predestination overtakes him, causing him to do the deed of the people of Paradise, and he enters it.\"",
  "bn": "আবূ আব্দুর রহমান আব্দুল্লাহ ইবনু মাস‘ঊদ রাদিয়াল্লাহু ‘আনহু হতে বর্ণিত, তিনি বলেন: রাসূলুল্লাহ্ সাল্লাল্লাহু আলাইহি ওয়াসাল্লাম যিনি ’সত্যবাদী’ এবং ’সত্যবাদী বলে স্বীকৃত’ আমাদের কাছে বর্ণনা করেছেন যে, “তোমাদের প্রত্যেকের সৃষ্টি হলো এমন বীর্য থেকে যাকে মায়ের পেটে চল্লিশ দিন একত্রিত রাখা হয়। তারপর তেমনি সময়ে আলাক-রক্তপিন্ড হয়, তারপর তেমনি সময়ে মাংসপিন্ডে পরিণত হয়। তারপর আল্লাহ্ তার কাছে ফেরেশতা প্রেরণ করেন। এই ফেরেশতাকে চারটি বিষয় সম্পর্কে লেখার হুকুম দেয়া হয়। যার ফলে ফেরেশেতা তার রিযক, ’আমল, আয়ু এবং দুর্ভাগা কিংবা ভাগ্যবান হওয়া সম্পর্কে লিখে দেয়। তারপর তার মধ্যে প্রাণ ফুঁকে দেয়া হয়। এজন্যই তোমাদের কেউ জান্নাতীদের ’আমল করে এতটুকু এগিয়ে যায় যে, তার ও জান্নাতের মাঝে কেবল এক গজের দূরত্ব থাকতেই তার ওপর লিখিত তাক্দীর প্রবল হয়ে যায়। তখন সে জাহান্নামীদের ’আমল করে। শেষে সে জাহান্নামে প্রবেশ করে। আবার তোমাদের কেউ জাহান্নামীদের মত ’আমল করে এমন পর্যায়ে পৌঁছে যে, তার ও জাহান্নামের মাঝে মাত্র এক গজের দূরত্ব থাকতে তার উপর তাকদীরের লেখা প্রবল হয়, ফলে সে জান্নাতীদের মত ’আমল করে, শেষে জান্নাতেই প্রবেশ করে”।",
  "attribution": {
   "en": "Narrated by Al-Bukhāri and Muslim",
   "bn": "ইমাম বুখারী ও মুসলিম এটি বর্ণনা করেছেন",
   "ar": "رواه البخاري ومسلم"
  },
  "grade": {
   "en": "Authentic",
   "bn": "সহীহ",
   "ar": "صحيح"
  },
  "cls": "sahih",
  "source": {
   "en": "https://hadeethenc.com/en/browse/hadith/66513",
   "bn": "https://hadeethenc.com/bn/browse/hadith/66513"
  },
  "also": [],
  "flag": null,
  "note": null,
  "review": "source-checked"
 },
 {
  "n": 5,
  "he": 66514,
  "link": "https://sunnah.com/nawawi40:5",
  "refs": [
   {
    "c": "bukhari",
    "n": "2697",
    "url": "https://sunnah.com/bukhari:2697"
   },
   {
    "c": "muslim",
    "n": "1718a",
    "url": "https://sunnah.com/muslim:1718a"
   },
   {
    "c": "muslim",
    "n": "1718b",
    "url": "https://sunnah.com/muslim:1718b"
   }
  ],
  "ar": "عَنْ أُمِّ المُؤْمِنِينَ أُمِّ عَبْدِ اللَّهِ عَائِشَةَ رَضِيَ اللَّهُ عَنْهَا، قَالَتْ: قَالَ: رَسُولُ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّم: «مَنْ أَحْدَثَ فِي أَمْرِنَا هَذَا مَا لَيْسَ مِنْهُ فَهُوَ رَدٌّ».\nوَفِي رِوَايَةٍ لِمُسْلِمٍ: «مَنْ عَمِلَ عَمَلًا لَيْسَ عَلَيْهِ أَمْرُنَا فَهُوَ رَدٌّ».",
  "en": "The Mother of the Believers, ’Umm ‘Abdullah ‘Ā’ishah (may Allah be pleased with her) reported: The Messenger of Allah (ﷺ) said: \"Whoever introduces something into this matter of ours that is not part of it will have it rejected.\" A version by Muslim reads: \"Whoever does an action that is not part of this matter of ours will have it rejected.\"",
  "bn": "উম্মুল মুমেনীন ‘আয়িশাহ রাদিয়াল্লাহু আনহা হতে বর্ণিত। তিনি বলেন, নবী (সাল্লাল্লাহু আলাইহি ওয়াসাল্লাম) বলেছেন, “কেউ আমাদের এ শরী‘আতে নাই এমন কিছুর অনুপ্রবেশ ঘটালে তা প্রত্যাখ্যাত।” মুসলিমের অপর বর্ণনায় রয়েছে: “যে এমন আমল করল যার উপর আমাদের হুকুম নেই তা প্রত্যাখ্যাত”।",
  "attribution": {
   "en": "Narrated by Al-Bukhāri and Muslim",
   "bn": "ইমাম বুখারী ও মুসলিম এটি বর্ণনা করেছেন",
   "ar": "رواه البخاري ومسلم"
  },
  "grade": {
   "en": "Authentic",
   "bn": "সহীহ",
   "ar": "صحيح"
  },
  "cls": "sahih",
  "source": {
   "en": "https://hadeethenc.com/en/browse/hadith/66514",
   "bn": "https://hadeethenc.com/bn/browse/hadith/66514"
  },
  "also": [],
  "flag": null,
  "note": null,
  "review": "source-checked"
 },
 {
  "n": 6,
  "he": 66515,
  "link": "https://sunnah.com/nawawi40:6",
  "refs": [
   {
    "c": "bukhari",
    "n": "52",
    "url": "https://sunnah.com/bukhari:52"
   },
   {
    "c": "muslim",
    "n": "1599a",
    "url": "https://sunnah.com/muslim:1599a"
   }
  ],
  "ar": "عَنْ أَبِي عَبْدِ اللَّهِ النُّعْمَانِ بْنِ بَشِيرٍ رَضِيَ اللَّهُ عَنْهُ، قَالَ: سَمِعْتُ رَسُولَ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّم يَقُولُ: «إنَّ الحَلَالَ بَيِّنٌ، وَإِنَّ الحَرَامَ بَيِّنٌ، وَبَيْنَهُمَا مُشْتَبِهَاتٌ لَا يَعْلَمُهُنَّ كَثِيرٌ مِنَ النَّاسِ، فَمَنْ اتَّقَى الشُّبُهَاتِ اسْتَبْرَأَ لِدِينِهِ وَعِرْضِهِ، وَمَنْ وَقَعَ فِي الشُّبُهَاتِ وَقَعَ فِي الحَرَامِ، كَالرَّاعِي يَرْعَى حَوْلَ الحِمَى يُوشِكُ أَنْ يَرْتَعَ فِيهِ، أَلَا وَإِنَّ لِكُلِّ مَلِكٍ حِمًى، أَلَّا وَإِنَّ حِمَى اللَّهِ مَحَارِمُهُ، أَلَّا وَإِنَّ فِي الجَسَدِ مُضْغَةً إذَا صَلَحَتْ صَلَحَ الجَسَدُ كُلُّهُ، وَإذَا فَسَدَتْ فَسَدَ الجَسَدُ كُلُّهُ، أَلَا وَهِيَ القَلْبُ».",
  "en": "Abu ‘Abdullah an-Nu‘mān ibn Bashīr (may Allah be pleased with him) reported: I heard the Messenger of Allah (ﷺ) say: \"Verily, the lawful is clear, and the unlawful is clear, and between them are doubtful matters many people do not know. Whoever avoids doubtful matters clears his liability regarding his religion and his honor, and whoever falls into doubtful matters will fall into the unlawful, just like the shepherd who grazes his animals in the vicinity of a prohibited pasture and is thus likely to graze therein. Verily, every king has a protected area, and the protected area of Allah is His prohibitions. Verily, in the body, there is a piece of flesh; if it is sound, the entire body will be sound, and if it is corrupt, the entire body will be corrupt; verily, that is the heart.\"",
  "bn": "আবূ আব্দুল্লাহ নু’মান ইবনু বাশীর রাদিয়াল্লাহু আনহু হতে বর্ণিত। তিনি বলেন, আমি শুনেছি: আমি রাসূলুল্লাহ সাল্লাল্লাহু আলাইহি ওয়াসাল্লামকে বলতে শুনেছি, “নিশ্চই হালাল সুস্পষ্ট এবং হারামও সুস্পষ্ট, আর এ উভয়ের মাঝে রয়েছে বহু অস্পষ্ট বিষয়, অধিকাংশ লোকই সেগুলো জানে না। যে ব্যক্তি এ সব অস্পষ্ট বিষয় থেকে দূরে থাকে, সে তার দীন ও মর্যাদাকে নিরাপদে রাখে। আর যে লোক অস্পষ্ট বিষয়ে পতিত হবে, সে হারামের মধ্যে লিপ্ত হয়ে পড়বে। যেমন কোন রাখাল সংরক্ষিত (সরকারী) চারণভূমির আশ-পাশে পশু চরায়, আশংকা রয়েছে যে, পশু তার অভ্যন্তরে যেয়ে ঘাস খাবে। সাবধান! প্রত্যেক বাদশাহরই সংরক্ষিত এলাকা থাকে। সাবধান! আল্লাহর সংরক্ষিত এলাকা হল তার হারামকৃত বিষয়সমূহ। জেনে রাখো, দেহের মধ্যে এক টুকরা মাংস আছে। যখন তা সুস্থ থাকে, তখন সমস্ত শরীরই সুস্থ থাকে। আর যখন তা নষ্ট হয়ে যায় তখন সমস্ত শরীরই নষ্ট হয়ে যায়। মনে রেখো, তা হল ’ক্বলব’ (হৃদয়)।”",
  "attribution": {
   "en": "Narrated by Al-Bukhāri and Muslim",
   "bn": "ইমাম বুখারী ও মুসলিম এটি বর্ণনা করেছেন",
   "ar": "رواه البخاري ومسلم"
  },
  "grade": {
   "en": "Authentic",
   "bn": "সহীহ",
   "ar": "صحيح"
  },
  "cls": "sahih",
  "source": {
   "en": "https://hadeethenc.com/en/browse/hadith/66515",
   "bn": "https://hadeethenc.com/bn/browse/hadith/66515"
  },
  "also": [],
  "flag": null,
  "note": null,
  "review": "source-checked"
 },
 {
  "n": 7,
  "he": 66516,
  "link": "https://sunnah.com/nawawi40:7",
  "refs": [
   {
    "c": "muslim",
    "n": "55a",
    "url": "https://sunnah.com/muslim:55a"
   }
  ],
  "ar": "عَنْ أَبِي رُقَيَّةَ تَمِيمِ بْنِ أَوْسٍ الدَّارِيِّ رَضِيَ اللَّهُ عَنْهُ أَنَّ النَّبِيَّ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ قَالَ: «الدِّينُ النَّصِيحَةُ» قُلْنَا: لِمَنْ؟ قَالَ: «لِلهِ وَلِكِتَابِهِ وَلِرَسُولِهِ وَلِأَئِمَّةِ الْمُسْلِمِينَ وَعَامَّتِهِمْ».",
  "en": "Abu Ruqayyah Tamīm ibn Aws ad-Dāri (may Allah be pleased with him) reported that the Prophet (ﷺ) said: \"Religion is sincerity.\" We said: \"To whom?\" He said: \"To Allah, to His Book, to His Messenger, to the Muslim leaders and their common folk.\"",
  "bn": "আবু রুকাইয়া তামীম ইবন আওস আদ-দারী রাদিয়াল্লাহু আনহু বর্ণনা করেন, নবী সাল্লাল্লাহু ‘আলাইহি ওয়াসাল্লাম বলেছেন, “নসীহত প্রতিষ্ঠাই দীন।” আমরা জিজ্ঞাসা করলাম, কার জন্য? তিনি বললেন: “আল্লাহর, তাঁর কিতাবের, তাঁর রাসূলের, মুসলিম শাসক এবং মুসলিম সাধারণ জনগণের।”",
  "attribution": {
   "en": "Narrated by Muslim",
   "bn": "ইমাম মুসলিম এটি বর্ণনা করেছেন",
   "ar": "رواه مسلم"
  },
  "grade": {
   "en": "Authentic",
   "bn": "সহীহ",
   "ar": "صحيح"
  },
  "cls": "sahih",
  "source": {
   "en": "https://hadeethenc.com/en/browse/hadith/66516",
   "bn": "https://hadeethenc.com/bn/browse/hadith/66516"
  },
  "also": [],
  "flag": null,
  "note": null,
  "review": "source-checked"
 },
 {
  "n": 8,
  "he": 4211,
  "link": "https://sunnah.com/nawawi40:8",
  "refs": [
   {
    "c": "bukhari",
    "n": "25",
    "url": "https://sunnah.com/bukhari:25"
   },
   {
    "c": "muslim",
    "n": "22",
    "url": "https://sunnah.com/muslim:22"
   }
  ],
  "ar": "عَنِ ابْنِ عُمَرَ رضي الله عنهما أَنَّ رَسُولَ اللَّهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ قَالَ: «أُمِرْتُ أَنْ أُقَاتِلَ النَّاسَ حَتَّى يَشْهَدُوا أَنْ لاَ إِلَهَ إِلَّا اللَّهُ، وَأَنَّ مُحَمَّدًا رَسُولُ اللَّهِ، وَيُقِيمُوا الصَّلاَةَ، وَيُؤْتُوا الزَّكَاةَ، فَإِذَا فَعَلُوا ذَلِكَ عَصَمُوا مِنِّي دِمَاءَهُمْ وَأَمْوَالَهُمْ إِلَّا بِحَقِّ الإِسْلاَمِ، وَحِسَابُهُمْ عَلَى اللَّهِ».",
  "en": "Ibn ‘Umar (may Allah be pleased with him and his father) reported that the Messenger of Allah (may Allah's peace and blessings be upon him) said: \"I have been commanded to fight people until they testify that there is no god but Allah and that Muhammad is the Messenger of Allah, establish prayer, and pay Zakah; if they do so, they protect their blood and properties from me, except through the right of Islam; and their reckoning is with Allah.\"",
  "bn": "ইবনু ‘উমর রাদিয়াল্লাহু ‘আনহুমা হতে বর্ণিত, রাসূলুল্লাহ সাল্লাল্লাহু ‘আলাইহি ওয়াসাল্লাম বলেছেন: “আমাকে লোকেদের বিরুদ্ধে জিহাদ করার আদেশ দেওয়া হয়েছে; যতক্ষণ না তারা সাক্ষ্য দিবে যে, আল্লাহ ছাড়া (সত্য) কোনো মাবূদ নেই এবং মুহাম্মাদ আল্লাহর রাসূল। আর তাঁরা সালাত প্রতিষ্ঠা করবে ও যাকাত প্রদান করবে। যখন তারা এ কাজগুলো সম্পাদন করবে, তখন আমার পক্ষ থেকে তাদের রক্ত (জান) ও মালের ব্যাপারে নিরাপত্তা লাভ করবে; কিন্তু ইসলামের হক ব্যতীত। আর তাদের হিসাব আল্লাহর ওপর ন্যস্ত হবে।”",
  "attribution": {
   "en": "Agreed upon",
   "bn": "সহীহ বুখারী ও মুসলিম",
   "ar": "متفق عليه"
  },
  "grade": {
   "en": "Authentic",
   "bn": "সহীহ",
   "ar": "صحيح"
  },
  "cls": "sahih",
  "source": {
   "en": "https://hadeethenc.com/en/browse/hadith/4211",
   "bn": "https://hadeethenc.com/bn/browse/hadith/4211"
  },
  "also": [],
  "flag": null,
  "note": {
   "en": "Context note (editorial): scholars explain this hadith within the rulings of war under a legitimate Islamic authority. It is not a licence for any individual to harm anyone. Read the linked explanation, and ask a qualified scholar.",
   "bn": "প্রসঙ্গ টীকা (সম্পাদকীয়): আলেমগণ এই হাদীসকে বৈধ ইসলামি কর্তৃপক্ষের অধীনে যুদ্ধের বিধানের প্রেক্ষিতে ব্যাখ্যা করেন। এটি কোনো ব্যক্তির জন্য কারও ক্ষতি করার অনুমতি নয়। সংযুক্ত ব্যাখ্যা পড়ুন এবং একজন যোগ্য আলেমকে জিজ্ঞেস করুন।"
  },
  "review": "source-checked"
 },
 {
  "n": 9,
  "he": 66517,
  "link": "https://sunnah.com/nawawi40:9",
  "refs": [
   {
    "c": "bukhari",
    "n": "7288",
    "url": "https://sunnah.com/bukhari:7288"
   },
   {
    "c": "muslim",
    "n": "1337b",
    "url": "https://sunnah.com/muslim:1337b"
   }
  ],
  "ar": "عَنْ أَبِي هُرَيْرَةَ عَبْدِ الرَّحْمَنِ بْنِ صَخْرٍ رَضِيَ اللَّهُ عَنْهُ قَالَ: سَمِعْت رَسُولَ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّم يَقُولُ: «مَا نَهَيْتُكُمْ عَنْهُ فَاجْتَنِبُوهُ، وَمَا أَمَرْتُكُمْ بِهِ فَافْعَلُوا مِنْهُ مَا اسْتَطَعْتُمْ، فَإِنَّمَا أَهْلَكَ الَّذِينَ مِنْ قَبْلِكُمْ كَثْرَةُ مَسَائِلِهِمْ، وَاخْتِلَافُهُمْ عَلَى أَنْبِيَائِهِمْ».",
  "en": "Abu Hurayrah ‘Abdur-Rahmān ibn Sakhr (may Allah be pleased with him) reported: I heard the Messenger of Allah (ﷺ) say: \"Avoid what I have forbidden you from, and do as much as you can of what I have ordered you. Indeed, those before you were ruined because of their excessive questioning and disagreeing with their prophets.\"",
  "bn": "আবূ হুরায়রা আব্দুর রহমান ইবনু সাখর রাদিয়াল্লাহু আনহু থেকে বর্ণিত, তিনি বলেন, আমি রাসূলুল্লাহ সাল্লাল্লাহু আলাইহি ওয়াসাল্লামকে বলতে শুনেছি: আমি যা থেকে তোমাদেরকে নিষেধ করেছি, তোমরা তা থেকে বেঁচে থাক। আর যা করতে আদেশ করেছি তা তোমরা সাধ্যানুসারে বাস্তবায়ন কর। কেননা, তোমাদের আগে যারা ছিল, তাদের অধিক প্রশ্ন এবং তাদের নবীদের সঙ্গে মতবিরোধ তাদেরকে ধ্বংস করেছে।",
  "attribution": {
   "en": "Narrated by Al-Bukhāri and Muslim",
   "bn": "ইমাম বুখারী ও মুসলিম এটি বর্ণনা করেছেন",
   "ar": "رواه البخاري ومسلم"
  },
  "grade": {
   "en": "Authentic",
   "bn": "সহীহ",
   "ar": "صحيح"
  },
  "cls": "sahih",
  "source": {
   "en": "https://hadeethenc.com/en/browse/hadith/66517",
   "bn": "https://hadeethenc.com/bn/browse/hadith/66517"
  },
  "also": [],
  "flag": null,
  "note": null,
  "review": "source-checked"
 },
 {
  "n": 10,
  "he": 66518,
  "link": "https://sunnah.com/nawawi40:10",
  "refs": [
   {
    "c": "muslim",
    "n": "1015",
    "url": "https://sunnah.com/muslim:1015"
   }
  ],
  "ar": "عَنْ أَبِي هُرَيْرَةَ رَضِيَ اللَّهُ عَنْهُ قَالَ: قَالَ رَسُولُ اللهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ: «إنَّ اللَّهَ طَيِّبٌ لَا يَقْبَلُ إلَّا طَيِّبًا، وَإِنَّ اللَّهَ أَمَرَ المُؤْمِنِينَ بِمَا أَمَرَ بِهِ المُرْسَلِينَ، فَقَالَ تَعَالَى: {يَا أَيُّهَا الرُّسُلُ كُلُوا مِنْ الطَّيِّبَاتِ وَاعْمَلُوا صَالِحًا}، وَقَالَ تَعَالَى: {يَا أَيُّهَا الَّذِينَ آمَنُوا كُلُوا مِنْ طَيِّبَاتِ مَا رَزَقْنَاكُمْ} ثُمَّ ذَكَرَ الرَّجُلَ، يُطِيلُ السَّفَرَ، أَشْعَثَ، أَغْبَرَ، يَمُدُّ يَدَيْهِ إلَى السَّمَاءِ: يَا رَبِّ! يَا رَبِّ! وَمَطْعَمُهُ حَرَامٌ، وَمَشْرَبُهُ حَرَامٌ، وَمَلْبَسُهُ حَرَامٌ، وَغُذِيَ بِالحَرَامِ، فَأَنَّى يُسْتَجَابُ لَذلك».",
  "en": "Abu Hurayrah (may Allah be pleased with him) reported: The Messenger of Allah (may Allah's peace and blessings be upon him) said: \"Indeed, Allah is Good and accepts only what is good, and indeed Allah has ordered the believers with what He ordered the messengers; He Almighty says: {O messengers, eat from the lawful things and act righteously.} He Almighty also says: {O you who believe, eat of the good things We have provided for you.} Then, he mentioned a man who travels far away, with disheveled hair, covered with dust, and stretches his hands toward the sky (saying): 'O Lord, O Lord,' while his food is unlawful, his drink is unlawful, his clothing is unlawful, and he has been nourished by the unlawful. So, how could that be answered?\"",
  "bn": "আবূ হুরায়রাহ রাদিয়াল্লাহু আনহু থেকে বর্ণিত। তিনি বলেন, রসূলুল্লাহ সাল্লাল্লাহু আলাইহি ওয়াসাল্লাম বলেছেন: “নিশ্চয় আল্লাহ তা’আলা পবিত্র, তিনি পবিত্রতা ছাড়া অন্য কিছু গ্রহণ করেন না। আর আল্লাহ তা’আলা তার প্রেরিত রাসূলদের যে হুকুম দিয়েছেন মুমিনদেরকেও সেই একই হুকুম দিয়েছেন। তিনি বলেন, يَا أَيُّهَا الرُّسُلُ كُلُوا مِنَ الطَّيِّبَاتِ وَاعْمَلُوا صَالِحًا، إِنِّي بِمَا تَعْمَلُونَ عَلِيمٌ} “হে রাসূলগণ! তোমরা পবিত্র ও হালাল জিনিস আহার কর এবং ভাল কাজ কর। আমি তোমাদের কৃতকর্ম সম্বন্ধে জ্ঞাত।\" (আল মু’মিনূন, আয়াত:৫১)\nতিনি আরো বলেন, {يَا أَيُّهَا الَّذِينَ آمَنُوا كُلُوا مِنْ طَيِّبَاتِ مَا رَزَقْنَاكُمْ} “তোমরা যারা ঈমান এনেছো শোনা আমি তোমাদের যে সব পবিত্র জিনিস রিযিক হিসেবে দিয়েছি তা খাও”— (আল বাকারাহ, আয়াত:১৭২)। অতঃপর তিনি এক ব্যক্তির কথা উল্লেখ করলেন, যে দূর-দূরান্ত পর্যন্ত দীর্ঘ সফর করে। ফলে সে ধুলি ধূসরিত রুক্ষ কেশধারী হয়ে পড়ে। অতঃপর সে আকাশের দিকে দুই হাত তুলে বলে, “হে আমার প্রতিপালক! “হে আমার প্রতিপালক! অথচ তার খাদ্য হারাম, পানীয় হারাম, পরিধেয় বস্ত্র হারাম এবং আহার্যও হারাম। কাজেই এমন ব্যক্তির ডাকে কী করে সাড়া দেয়া হবে?”",
  "attribution": {
   "en": "Narrated by Muslim",
   "bn": "ইমাম মুসলিম এটি বর্ণনা করেছেন",
   "ar": "رواه مسلم"
  },
  "grade": {
   "en": "Authentic",
   "bn": "সহীহ",
   "ar": "صحيح"
  },
  "cls": "sahih",
  "source": {
   "en": "https://hadeethenc.com/en/browse/hadith/66518",
   "bn": "https://hadeethenc.com/bn/browse/hadith/66518"
  },
  "also": [],
  "flag": null,
  "note": null,
  "review": "source-checked"
 },
 {
  "n": 11,
  "he": 66519,
  "link": "https://sunnah.com/nawawi40:11",
  "refs": [
   {
    "c": "nasai",
    "n": "5711",
    "url": "https://sunnah.com/nasai:5711",
    "grade": "Sahih (Darussalam)"
   }
  ],
  "ar": "عَنْ أَبِي مُـحَمَّدٍ الحَسَنِ بْنِ عَلِيِّ بْنِ أَبِي طَالِبٍ - سِبْطِ رَسُولِ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ وَرَيْحَانَتِهِ-، قَالَ: حَفِظْتُ مِنْ رَسُولِ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ: «دَعْ مَا يَرِيبُك إلَى مَا لَا يَرِيبُكَ».",
  "en": "Abu Muhammad al-Hasan ibn ‘Ali ibn Abi Tālib—the grandson of the Messenger of Allah (ﷺ) and his beloved— reported: I memorized from the words of the Messenger of Allah (ﷺ): \"Leave what you doubt for what you do not doubt.\"",
  "bn": "আল্লাহর রাসূল সাল্লাল্লাহু আলাইহি ওয়াসাল্লামের নাতি এবং তাঁর প্রিয়জন আবু মুহাম্মদ আল-হাসান ইবনে আলী ইবনে আবি তালিব - এর সূত্রে বর্ণিত, তিনি বলেন: আমি আল্লাহর রাসূলের কাছ থেকে মুখস্থ করেছি: “যে বিষয়ে তোমার সন্দেহ হয়, তা ছেড়ে দাও আর যাতে কোন সন্দেহ নেই তা গ্রহণ কর।”",
  "attribution": {
   "en": "Narrated by At-Tirmidhi and An-Nasā’i",
   "bn": "এটি তিরমিযী ও নাসায়ী বর্ণনা করেছেন।",
   "ar": "رواه الترمذي والنسائي"
  },
  "grade": {
   "en": "Authentic",
   "bn": "সহীহ",
   "ar": "صحيح"
  },
  "cls": "sahih",
  "source": {
   "en": "https://hadeethenc.com/en/browse/hadith/66519",
   "bn": "https://hadeethenc.com/bn/browse/hadith/66519"
  },
  "also": [],
  "flag": null,
  "note": null,
  "review": "source-checked"
 },
 {
  "n": 12,
  "he": 65255,
  "link": "https://sunnah.com/nawawi40:12",
  "refs": [],
  "ar": "عَنْ أَبِي هُرَيْرَةَ رَضِيَ اللَّهُ عَنْهُ قَالَ: قَالَ رَسُولُ اللهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ: «مِنْ حُسْنِ إِسْلَامِ المَرْءِ تَرْكُهُ مَا لَا يَعْنِيهِ».",
  "en": "Abu Hurayrah (may Allah be pleased with him) reported: The Messenger of Allah (ﷺ) said: \"Part of a person's excellence in Islam is his leaving what does not concern him.\"",
  "bn": "আবূ হুরাইরা রাদিয়াল্লাহু ‘আনহু থেকে বর্ণিত, তিনি বলেন: রাসূলুল্লাহ সাল্লাল্লাহু ‘আলাইহি ওয়াসাল্লাম বলেছেন: “ব্যক্তির ইসলামের সৌন্দর্য হল: অনর্থক কথা-কাজ ত্যাগ করা।”",
  "attribution": {
   "en": "Narrated by At-Tirmidhi and others",
   "bn": "তিরিমিযীসহ অন্যান্যরা হাদীসটি বর্ণনা করেছেন।",
   "ar": "رواه الترمذي وغيره"
  },
  "grade": {
   "en": "An-Nawawi said: It is a Hasan (sound) Hadīth",
   "bn": "ইমাম নববী বলেছেন: হাদীসটি হাসান।",
   "ar": "قال النووي: حديث حسن"
  },
  "cls": "hasan",
  "source": {
   "en": "https://hadeethenc.com/en/browse/hadith/65255",
   "bn": "https://hadeethenc.com/bn/browse/hadith/65255"
  },
  "also": [],
  "flag": "grade",
  "note": null,
  "review": "source-checked"
 },
 {
  "n": 13,
  "he": 66520,
  "link": "https://sunnah.com/nawawi40:13",
  "refs": [
   {
    "c": "bukhari",
    "n": "13",
    "url": "https://sunnah.com/bukhari:13"
   },
   {
    "c": "muslim",
    "n": "45a",
    "url": "https://sunnah.com/muslim:45a"
   }
  ],
  "ar": "عَنْ أَبِي حَمْزَةَ أَنَسِ بْنِ مَالِكٍ رَضِيَ اللَّهُ عَنْهُ -خَادِمِ رَسُولِ اللَّهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ- عَنْ النَّبِيِّ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ قَالَ: «لاَ يُؤْمِنُ أَحَدُكُمْ، حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ»",
  "en": "Abu Hamzah Anas ibn Mālik (may Allah be pleased with him)—the servant of the Messenger of Allah (ﷺ)—reported that the Prophet (ﷺ) said: \"None of you believes until he loves for his brother what he loves for himself.\"",
  "bn": "আল্লাহর রাসূল সাল্লাল্লাহু আলাইহি ওয়াসাল্লামের খাদিম আবূ হামযাহ আনাস ইবনু মালিক রাদিয়াল্লাহু আনহু নবী সাল্লাল্লাহু আলাইহি ওয়াসাল্লাম হতে বর্ণনা করেন, “তোমাদের কেউ প্রকৃত মুমিন হতে পারবে না, যতক্ষণ না সে তার ভাইয়ের জন্য সেটাই পছন্দ করবে, যা তার নিজের জন্য পছন্দ করে”।",
  "attribution": {
   "en": "Agreed upon",
   "bn": "সহীহ বুখারী ও মুসলিম",
   "ar": "متفق عليه"
  },
  "grade": {
   "en": "Authentic",
   "bn": "সহীহ",
   "ar": "صحيح"
  },
  "cls": "sahih",
  "source": {
   "en": "https://hadeethenc.com/en/browse/hadith/66520",
   "bn": "https://hadeethenc.com/bn/browse/hadith/66520"
  },
  "also": [
   "h09"
  ],
  "flag": null,
  "note": null,
  "review": "source-checked"
 },
 {
  "n": 14,
  "he": 4714,
  "link": "https://sunnah.com/nawawi40:14",
  "refs": [
   {
    "c": "bukhari",
    "n": "6878",
    "url": "https://sunnah.com/bukhari:6878"
   },
   {
    "c": "muslim",
    "n": "1676a",
    "url": "https://sunnah.com/muslim:1676a"
   }
  ],
  "ar": "عَنِ ابنِ مَسعُودٍ رَضِيَ اللَّهُ عَنْهُ قَالَ: قَالَ رَسُولُ اللهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ: «لَا يَحِلُّ دَمُ امْرِئٍ مُسْلِمٍ إِلَّا بِإِحْدَى ثَلَاثٍ: الثَّيِّبُ الزَّانِي، وَالنَّفْسُ بِالنَّفْسِ، وَالتَّارِكُ لِدِينِهِ المُفَارِقُ لِلْجَمَاعَةِ».",
  "en": "Ibn Mas‘ūd (may Allah be pleased with him) reported: The Messenger of Allah (ﷺ) said: \"The blood of a Muslim is inviolable except by one of three: adultery of a married person, a life for a life (homicide), and abandoning Islam and separating from the Islamic body.''",
  "bn": "ইবনু মাসউদ রাদিয়াল্লাহু আনহু থেকে বর্ণিত, তিনি বলেন: রাসূলুল্লাহ সাল্লাল্লাহু আলাইহি ওয়া সাল্লাম বলেছেন: “কোনো মুসলিম ব্যক্তির রক্ত তিনটি কারণ ছাড়া বৈধ নয়: বিবাহিত ব্যভিচারী, জানের বদলে জান, আর নিজের দীন ত্যাগকারী মুসলিম জামা‘আত থেকে পৃথক হয়ে যাওয়া ব্যক্তি”।",
  "attribution": {
   "en": "Agreed upon",
   "bn": "সহীহ বুখারী ও মুসলিম",
   "ar": "متفق عليه"
  },
  "grade": {
   "en": "Authentic",
   "bn": "সহীহ",
   "ar": "صحيح"
  },
  "cls": "sahih",
  "source": {
   "en": "https://hadeethenc.com/en/browse/hadith/4714",
   "bn": "https://hadeethenc.com/bn/browse/hadith/4714"
  },
  "also": [],
  "flag": null,
  "note": {
   "en": "Context note (editorial): the legal penalties mentioned here are, as scholars explain, matters for a lawful Islamic court and authority with full due process. They are never for individuals to carry out. Read the linked explanation, and ask a qualified scholar.",
   "bn": "প্রসঙ্গ টীকা (সম্পাদকীয়): আলেমগণের ব্যাখ্যা অনুযায়ী এখানে উল্লিখিত শাস্তিগুলো যথাযথ বিচারপ্রক্রিয়াসহ বৈধ ইসলামি আদালত ও কর্তৃপক্ষের বিষয়। কোনো ব্যক্তি কখনো নিজে তা প্রয়োগ করতে পারে না। সংযুক্ত ব্যাখ্যা পড়ুন এবং একজন যোগ্য আলেমকে জিজ্ঞেস করুন।"
  },
  "review": "source-checked"
 },
 {
  "n": 15,
  "he": 5437,
  "link": "https://sunnah.com/nawawi40:15",
  "refs": [
   {
    "c": "bukhari",
    "n": "6018",
    "url": "https://sunnah.com/bukhari:6018"
   },
   {
    "c": "muslim",
    "n": "47a",
    "url": "https://sunnah.com/muslim:47a"
   }
  ],
  "shared": "h10",
  "cls": "sahih",
  "also": [],
  "flag": null,
  "note": null,
  "review": "source-checked"
 },
 {
  "n": 16,
  "he": 4709,
  "link": "https://sunnah.com/nawawi40:16",
  "refs": [
   {
    "c": "bukhari",
    "n": "6116",
    "url": "https://sunnah.com/bukhari:6116"
   }
  ],
  "ar": "عن أبي هريرة رضي الله عنه: أَنَّ رَجُلًا قَالَ لِلنَّبِيِّ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ: أَوْصِنِي، قَالَ: «لَا تَغْضَبْ» فَرَدَّدَ مِرَارًا قَالَ: «لَا تَغْضَبْ».",
  "en": "Abu Hurayrah (may Allah be pleased with him) reported: A man came to the Prophet (may Allah's peace and blessings be upon him) and said: \"Advise me.\" He said: \"Do not get angry.\" He repeated that several times, and every time, he would say: \"Do not get angry.\"",
  "bn": "আবূ হুরাইরা রদিয়াল্লাহু ‘আনহু থেকে বর্ণিত, তিনি বলেন: এক ব্যক্তি নবী সাল্লাল্লাহু আলাইহি ওয়াসাল্লামকে বললেন: আপনি আমাকে উপদেশ দিন। তিনি বললেন: “তুমি রাগ করো না।\" লোকটি কয়েকবার তা বলতে থাকলেন, নবী সাল্লাল্লাহু আলাইহি ওয়া সাল্লাম প্রত্যেক বারেই বললেন: “রাগ করো না।”",
  "attribution": {
   "en": "Narrated by Al-Bukhāri",
   "bn": "এটি বুখারী বর্ণনা করেছেন।",
   "ar": "رواه البخاري"
  },
  "grade": {
   "en": "Authentic",
   "bn": "সহীহ",
   "ar": "صحيح"
  },
  "cls": "sahih",
  "source": {
   "en": "https://hadeethenc.com/en/browse/hadith/4709",
   "bn": "https://hadeethenc.com/bn/browse/hadith/4709"
  },
  "also": [],
  "flag": null,
  "note": null,
  "review": "source-checked"
 },
 {
  "n": 17,
  "he": 66521,
  "link": "https://sunnah.com/nawawi40:17",
  "refs": [
   {
    "c": "muslim",
    "n": "1955a",
    "url": "https://sunnah.com/muslim:1955a"
   }
  ],
  "ar": "عَنْ أَبِي يَعْلَى شَدَّادِ بْنِ أَوْسٍ رَضِيَ اللَّهُ عَنْهُ عَنْ رَسُولِ اللَّهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ قَالَ: «إِنَّ اللهَ كَتَبَ الْإِحْسَانَ عَلَى كُلِّ شَيْءٍ، فَإِذَا قَتَلْتُمْ فَأَحْسِنُوا القِتْلَةَ، وَإِذَا ذَبَحْتُمْ فَأَحْسِنُوا الذِّبْحَةَ، وَلْيُحِدَّ أَحَدُكُمْ شَفْرَتَهُ، وَلْيُرِحْ ذَبِيحَتَهُ».",
  "en": "Abu Ya‘la Shaddād ibn Aws (may Allah be pleased with him) reported that the Messenger of Allah (ﷺ) said: \"Indeed, Allah has enjoined Ihsān (kindness/excellence) in all things. So, when you kill, kill with kindness; and when you slaughter, slaughter with kindness. Let one of you sharpen his blade and spare the animal he slaughters suffering.\"",
  "bn": "আবূ ইয়ালা শাদ্দাদ ইবনু আওস রদিয়াল্লাহু ‘আনহু রাসূলুল্লাহ সাল্লাল্লাহু ‘আলাইহি ওয়াসাল্লাম থেকে বর্ণনা করেন, তিনি বলেছেন: “নিশ্চয়ই আল্লাহ প্রতিটি বস্তুর প্রতি দয়া করাকে ফরয করে দিয়েছেন। সুতরাং তোমরা যখন হত্যা করবে,তখন সুন্দরভাবে হত্যা করো এবং যখন জবাই করবে, তখন ভালোভাবে জবাই করো। তোমাদের প্রত্যেকে যেন নিজ ছুরি ধারাল করে নেয় এবং যবেহকৃত পশুকে আরাম দেয়।”",
  "attribution": {
   "en": "Narrated by Muslim",
   "bn": "ইমাম মুসলিম এটি বর্ণনা করেছেন",
   "ar": "رواه مسلم"
  },
  "grade": {
   "en": "Authentic",
   "bn": "সহীহ",
   "ar": "صحيح"
  },
  "cls": "sahih",
  "source": {
   "en": "https://hadeethenc.com/en/browse/hadith/66521",
   "bn": "https://hadeethenc.com/bn/browse/hadith/66521"
  },
  "also": [],
  "flag": null,
  "note": null,
  "review": "source-checked"
 },
 {
  "n": 18,
  "he": 4302,
  "link": "https://sunnah.com/nawawi40:18",
  "refs": [],
  "ar": "‌عَنْ ‌أَبِي ‌ذَرٍّ، ‌جُنْدُبِ ‌بْنِ ‌جُنَادَةَ، ‌وَأَبِي ‌عَبْدِ ‌الرَّحْمَنِ، ‌مُعَاذِ بْنِ جَبَلٍ رَضِيَ اللَّهُ عَنْهُمَا عَنْ رَسُولِ اللَّهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ قَالَ: «اتَّقِ اللَّهَ حَيْثُمَا كُنْت، وَأَتْبِعْ السَّيِّئَةَ الْحَسَنَةَ تَمْحُهَا، وَخَالِقْ النَّاسَ بِخُلُقٍ حَسَنٍ».",
  "en": "Abu Dharr, Jundub ibn Junādah, and Abu ‘Abdur-Rahmān, Mu‘ādh ibn Jabal (may Allah be pleased with both of them) reported that the Messenger of Allah (ﷺ) said: \"Fear Allah wherever you are; follow a bad deed with a good deed and it will erase it; and treat people with good morals.\"",
  "bn": "আবূ যার জুনদুব ইবনু জুনাদাহ ও আবূ আব্দুর রহমান মুআয ইবনু জাবাল রাদিয়াল্লাহু আনহুমা হতে বর্ণিত, তারা বলেন, রাসূলুল্লাহ সাল্লাল্লাহু আলাইহি ওয়াসাল্লাম বলেছেন: “তুমি যেখানে থাক আল্লাহকে ভয় কর, মন্দ কাজের পশ্চাতে ভাল কাজ কর, যা মন্দকে মুছে ফেলবে এবং মানুষের সাথে উত্তম আচরণ কর”।",
  "attribution": {
   "en": "Narrated by At-Tirmidhi",
   "bn": "এটি তিরমিযী বর্ণনা করেছেন।",
   "ar": "رواه الترمذي"
  },
  "grade": {
   "en": "At-Tirmidhi said: It is a Hasan (sound) Hadīth",
   "bn": "তিরমিযী বলেছেন: হাদীসটি হাসান।",
   "ar": "قال الترمذي: حديث حسن"
  },
  "cls": "hasan",
  "source": {
   "en": "https://hadeethenc.com/en/browse/hadith/4302",
   "bn": "https://hadeethenc.com/bn/browse/hadith/4302"
  },
  "also": [],
  "flag": "grade",
  "note": null,
  "review": "source-checked"
 },
 {
  "n": 19,
  "he": 66522,
  "link": "https://sunnah.com/nawawi40:19",
  "refs": [],
  "ar": "عَنْ أَبِي العَبَّاسِ، عَبْدِ الله بْنِ عَبَّاسٍ رَضِيَ اللَّهُ عَنْهُمَا قَالَ: كُنْت خَلْفَ رَسُولِ اللَّهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ يَوْمًا، فَقَالَ: «يَا غُلَامِ! إنِّي أُعَلِّمُك كَلِمَاتٍ: احْفَظِ اللَّهَ يَحْفَظْكَ، احْفَظِ الله تَجِدْهُ تُجَاهَكَ، إذَا سَأَلْتَ فَاسْأَلِ اللهَ، وَإِذَا اسْتَعَنْتَ فَاسْتَعِنْ بِاَللهِ، وَاعْلَمْ أَنَّ الأُمَّةَ لَوْ اجْتَمَعَتْ عَلَى أَنْ يَنْفَعُوكَ بِشَيْءٍ لَمْ يَنْفَعُوكَ إلَّا بِشَيْءٍ قَدْ كَتَبَهُ اللَّهُ لَكَ، وَإِنِ اجْتَمَعُوا عَلَى أَنْ يَضُرُّوكَ بِشَيْءٍ لَمْ يَضُرُّوكَ إلَّا بِشَيْءٍ قَدْ كَتَبَهُ اللَّهُ عَلَيْكَ؛ رُفِعَتِ الأَقْلَامُ، وَجَفَّتِ الصُّحُفُ».\nوَفِي رِوَايَةِ غَيْرِ التِّرْمِذِيِّ: «احْفَظِ اللهَ تَجِدْهُ أَمَامَكَ، تَعَرَّفْ إلَى اللهِ فِي الرَّخَاءِ يَعْرِفْكَ فِي الشِّدَّةِ، وَاعْلَمْ أَنَّ مَا أَخْطَأَكَ لَمْ يَكُنْ لِيُصِيبَكَ، وَمَا أَصَابَك لَمْ يَكُنْ لِيُخْطِئَكَ، وَاعْلَمْ أَنَّ النَّصْرَ مَعَ الصَّبْرِ، وَأَنْ الفَرَجَ مَعَ الكَرْبِ، وَأَنَّ مَعَ العُسْرِ يُسْرًا».",
  "en": "Abu al-‘Abbās, ‘Abdullah ibn ‘Abbās (may Allah be pleased with him and his father) reported: I was riding behind the Messenger of Allah (ﷺ) one day and he said: \"Hey boy, I shall teach you some words: Be mindful of Allah, and Allah will protect you. Be mindful of Allah, and you will find Him at your side. If you ask, ask Allah; if you seek help, seek help from Allah. And know that if the whole people gathered to benefit you with something, they would not benefit you except with what Allah has decreed for you, and if they gathered to harm you with something, they would not harm you except with what Allah has decreed against you. The pens have been lifted, and the scrolls have dried.\" In another version by other than At-Tirmidhi, it reads: \"Be mindful of Allah, you will find Him before you. Recognize Allah at the time of prosperity, and He will recognize you at the time of adversity. And know that what had missed you was not going to befall you, and what had befallen you was not going to miss you. And know that victory comes with patience, relief comes with distress, and ease comes with hardship.\"",
  "bn": "আবূল আব্বাস, আব্দুল্লাহ ইবনু আব্বাস রাদিয়াল্লাহু আনহুমা হতে বর্ণিত, তিনি বলেন, একদিন আমি রাসূলুল্লাহ সাল্লাল্লাহু আলাইহি ওয়াসাল্লামের পেছনে ছিলাম, তিনি বললেন: “হে বালক! আমি তোমাকে কয়েকটি কালিমা (বাক্য) শিক্ষা দিচ্ছি, তা হচ্ছে: তুমি আল্লাহর (বিধানসমূহের) রক্ষণাবেক্ষণ কর (তাহলে) আল্লাহও তোমার রক্ষণাবেক্ষণ করবেন। তুমি আল্লাহর (অধিকারসমূহ) স্মরণ রাখো, তাহলে তুমি তাঁকে তোমার সম্মুখে পাবে। যখন তুমি চাইবে, তখন আল্লাহর কাছেই চাও। আর যখন তুমি প্রার্থনা করবে, তখন একমাত্র আল্লাহর কাছেই সাহায্য প্রার্থনা কর। আর এ কথা জেনে রাখ যে, যদি সমগ্র উম্মত তোমার উপকার করার জন্য একত্রিত হয়ে যায়, তবে ততটুকুই উপকার করতে পারবে, যতটুকু আল্লাহ তোমার (তাকদীরে) লিখে রেখেছেন। আর তারা যদি তোমার ক্ষতি করার জন্য একত্রিত হয়ে যায়, তবে ততটুকুই ক্ষতি করতে পারবে যতটুকু আল্লাহ তোমার (তাকদীরে) লিখে রেখেছেন। কলমসমূহ উঠিয়ে নেওয়া হয়েছে এবং খাতাসমূহ (তাকদীরের লিপি) শুকিয়ে গেছে।’’ তিরমিযীর বর্ণনা ছাড়া অন্য একটি বর্ণনায় আছে: “তুমি আল্লাহর হেফাজত কর, তাহলে তাঁকে তোমার সামনে পাবে। সুখের সময়ে আল্লাহকে স্মরণ কর, কষ্টের সময়ে তিনি তোমাকে স্মরণ করবেন। জেনে রাখো, যা তোমাকে মিস করেছে তা তোমার উপর আসার কথা ছিল না, আর যা তোমার উপর এসেছে তা তোমাকে মিস করার কথা ছিল না। জেনে রাখো, ধৈর্যের সাথেই আসে সাহায্য, কষ্টের সাথেই আসে স্বস্তি এবং কষ্টের সাথে আসে স্বস্তি।”",
  "attribution": {
   "en": "Narrated by At-Tirmidhi and others",
   "bn": "তিরিমিযীসহ অন্যান্যরা হাদীসটি বর্ণনা করেছেন।",
   "ar": "رواه الترمذي وغيره"
  },
  "grade": {
   "en": "Authentic",
   "bn": "সহীহ",
   "ar": "صحيح"
  },
  "cls": "sahih",
  "source": {
   "en": "https://hadeethenc.com/en/browse/hadith/66522",
   "bn": "https://hadeethenc.com/bn/browse/hadith/66522"
  },
  "also": [],
  "flag": null,
  "note": null,
  "review": "source-checked"
 },
 {
  "n": 20,
  "he": 66523,
  "link": "https://sunnah.com/nawawi40:20",
  "refs": [
   {
    "c": "bukhari",
    "n": "3483",
    "url": "https://sunnah.com/bukhari:3483"
   }
  ],
  "ar": "عَنْ أَبِي مَسْعُودٍ عُقْبَةَ بْنِ عَمْرٍو الأَنْصَارِيِّ البَدْرِيِّ رَضِيَ اللَّهُ عَنْهُ قَالَ: قَالَ رَسُولُ اللَّهِ: «إِنَّ مِمَّا أَدْرَكَ النَّاسُ مِنْ كَلاَمِ النُّبُوَّةِ الأُولَى: إِذَا لَمْ تَسْتَحْيِ فَاصْنَعْ مَا شِئْتَ».",
  "en": "Abu Mas‘ūd ‘Uqbah ibn ‘Amr al-Ansāri al-Badri (may Allah be pleased with him) reported: \"Verily, some of what reached people from the speech of the early prophets: If you feel no shame, then do whatever you wish.\"",
  "bn": "আবূ মাসউদ উকবাহ ইবনু আমর আল-আনসারী আল-বাদরী রাদিয়াল্লাহু আনহু হতে বর্ণিত, তিনি বলেন: রাসূলুল্লাহ বলেছেন: “পূর্বেকার নবুওয়াতের বাণীসমূহ থেকে লোকেরা যা লাভ করেছে তন্মধ্যে একটি হচ্ছে: যখন তুমি লজ্জা করবে না তখন যা ইচ্ছা তাই কর।”",
  "attribution": {
   "en": "Narrated by Al-Bukhāri",
   "bn": "এটি বুখারী বর্ণনা করেছেন।",
   "ar": "رواه البخاري"
  },
  "grade": {
   "en": "Authentic",
   "bn": "সহীহ",
   "ar": "صحيح"
  },
  "cls": "sahih",
  "source": {
   "en": "https://hadeethenc.com/en/browse/hadith/66523",
   "bn": "https://hadeethenc.com/bn/browse/hadith/66523"
  },
  "also": [],
  "flag": null,
  "note": null,
  "review": "source-checked"
 },
 {
  "n": 21,
  "he": 66524,
  "link": "https://sunnah.com/nawawi40:21",
  "refs": [
   {
    "c": "muslim",
    "n": "38",
    "url": "https://sunnah.com/muslim:38"
   }
  ],
  "ar": "عَنْ أَبِي عَمْرٍو- وَقِيلَ: أَبِي عَمْرَةَ-، سُفْيَانَ بْنِ عَبْدِ اللَّهِ رَضِيَ اللَّهُ عَنْهُ قَالَ: قُلْتُ: يَا رَسُولَ اللهِ، قُلْ لِي فِي الْإِسْلَامِ قَوْلًا لَا أَسْأَلُ عَنْهُ أَحَدًا غَيْرَكَ، قَالَ: «قُلْ: آمَنْتُ بِاللهِ، ثُمَّ اسْتَقِمْ».",
  "en": "Abu ‘Amr—and it was said: Abu ‘Amrah—Sufyān ibn ‘Abdullah (may Allah be pleased with him) reported: I said: O Messenger of Allah, tell me something about Islam regarding which I can ask none but you. He (may Allah's peace and blessings be upon him) said: \"Say: I believe in Allah, then remain steadfast.\"",
  "bn": "আবূ আমর- কেউ বলেছেন: আবূ আমরাহ- সুফিয়ান ইবনু আব্দুল্লাহ রাদিয়াল্লাহু আনহু হতে বর্ণিত, তিনি বলেন, আমি বললাম, ইয়া রাসূলুল্লাহ্! আপনি আমাকে ইসলাম সমন্ধে এমন কথা বলে দিন, আপনার পরে যেনো তা আমাকে আর কারো কাছে জিজ্ঞেস করতে না হয়। রাসূলুল্লাহ্ সাল্লাল্লাহু আলাইহি ওয়াসাল্লাম বললেন:\n«قُلْ: آمَنْتُ بِاللهِ، ثُمَّ اسْتَقِمْ».\n“তুমি বলো, আমি আল্লাহর প্রতি ঈমান এনেছি। তারপর এর ওপরই প্রতিষ্ঠিত থাকো।”",
  "attribution": {
   "en": "Narrated by Muslim",
   "bn": "ইমাম মুসলিম এটি বর্ণনা করেছেন",
   "ar": "رواه مسلم"
  },
  "grade": {
   "en": "Authentic",
   "bn": "সহীহ",
   "ar": "صحيح"
  },
  "cls": "sahih",
  "source": {
   "en": "https://hadeethenc.com/en/browse/hadith/66524",
   "bn": "https://hadeethenc.com/bn/browse/hadith/66524"
  },
  "also": [],
  "flag": null,
  "note": null,
  "review": "source-checked"
 },
 {
  "n": 22,
  "he": 66525,
  "link": "https://sunnah.com/nawawi40:22",
  "refs": [
   {
    "c": "muslim",
    "n": "15a",
    "url": "https://sunnah.com/muslim:15a"
   }
  ],
  "ar": "عَنْ أَبِي عَبْدِ اللَّهِ جَابِرِ بْنِ عَبْدِ اللَّهِ الْأَنْصَارِيِّ رَضِيَ اللَّهُ عَنْهُمَا: أَنَّ رَجُلًا سَأَلَ رَسُولَ اللهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ، فَقَالَ: أَرَأَيْتَ إِذَا صَلَّيْتُ المَكْتُوبَاتِ، وَصُمْتُ رَمَضَانَ، وَأَحْلَلْتُ الحَلَالَ، وَحَرَّمْتُ الحَرَامَ، وَلَمْ أَزِدْ عَلَى ذَلِكَ شَيْئًا، أَأَدْخُلُ الجَنَّةَ؟ قَالَ: «نَعَمْ».",
  "en": "Abu ‘Abdullah Jābir ibn ‘Abdullah al-Ansāri (may Allah be pleased with him and his father) reported: A man asked the Messenger of Allah (ﷺ) and said: If I were to pray the obligatory prayers, fast Ramadan, adopt the lawful, as lawful and adopt the unlawful as unlawful, and do not do anything else beyond that, will I enter Paradise? He said: \"Yes.\"",
  "bn": "আবূ আব্দুল্লাহ জাবির ইবনু আব্দুল্লাহ আল-আনসারী রাদিয়াল্লাহু আনহুমা হতে বর্ণিত, এক ব্যক্তি রাসূলুল্লাহ সাল্লাল্লাহু আলাইহি ওয়া সাল্লাম-কে জিজ্ঞেস করলেন: আপনি কী বলেন, যদি আমি শুধু ফরয সালাতগুলো আদায় করি, রমজানের সিয়াম রাখি, যা হালাল তা হালাল মনে করে গ্রহণ করি এবং যা হারাম তা হারাম জেনে তা থেকে বিরত থাকি এবং এর চেয়ে বেশি কিছু না করি — তাহলেও কি আমি জান্নাতে যাব? তিনি বললেন: “হ্যাঁ।”",
  "attribution": {
   "en": "Narrated by Muslim",
   "bn": "ইমাম মুসলিম এটি বর্ণনা করেছেন",
   "ar": "رواه مسلم"
  },
  "grade": {
   "en": "Authentic",
   "bn": "সহীহ",
   "ar": "صحيح"
  },
  "cls": "sahih",
  "source": {
   "en": "https://hadeethenc.com/en/browse/hadith/66525",
   "bn": "https://hadeethenc.com/bn/browse/hadith/66525"
  },
  "also": [],
  "flag": null,
  "note": null,
  "review": "source-checked"
 },
 {
  "n": 23,
  "he": 66526,
  "link": "https://sunnah.com/nawawi40:23",
  "refs": [
   {
    "c": "muslim",
    "n": "223",
    "url": "https://sunnah.com/muslim:223"
   }
  ],
  "ar": "عَنْ أَبِي مَالِكٍ الحَارِثِ بْنِ عَاصِمٍ الأَشْعَرِيِّ رَضِيَ اللَّهُ عَنْهُ قَالَ: قَالَ رَسُولُ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ: «الطُّهُورُ شَطْرُ الْإِيمَانِ، وَالْحَمْدُ لِلهِ تَمْلَأُ الْمِيزَانَ، وَسُبْحَانَ اللهِ وَالْحَمْدُ لِلهِ تَمْلَآنِ -أَوْ تَمْلَأُ- مَا بَيْنَ السَّمَاءِ وَالأَرْضِ، وَالصَّلَاةُ نُورٌ، وَالصَّدَقَةُ بُرْهَانٌ، وَالصَّبْرُ ضِيَاءٌ، وَالْقُرْآنُ حُجَّةٌ لَكَ أَوْ عَلَيْكَ، كُلُّ النَّاسِ يَغْدُو، فَبَايِعٌ نَفْسَهُ فَمُعْتِقُهَا أَوْ مُوبِقُهَا»",
  "en": "Abu Mālik al-Hārith ibn ‘Āsim al-Ash‘ari (may Allah be pleased with him) reported: The Messenger of Allah (ﷺ) said: \"Purity is half of faith, al-hamdulillāh (praise be to Allah) fills the Scale, and subhānallāh wa al-hamdulillāh (glory and praise be to Allah) fills what is between the heavens and the earth. Prayer is light, charity is proof, patience is radiance, and the Qur’an is an argument either for you or against you. Every person goes out in the morning and sells his soul; he either saves it from doom or throws it into destruction.\"",
  "bn": "আবূ মালিক হারিস ইবনু আসিম আল-আশ‘আরী রাদিয়াল্লাহু ‘আনহু হতে বর্ণিত, তিনি বলেন: রাসূলুল্লাহ সাল্লাল্লাহু ‘আলাইহি ওয়া সাল্লাম বলেছেন: “পবিত্রতা ঈমানের অর্ধেক। “الحمد لله” ‘আলহামদু লিল্লা ‘ দাঁড়িপাল্লা পরিপূর্ণ করে দেয় এবং “سبحان الله والحمد لله” ‘সুবহানাল্লাহি ওয়ালহামদু লিল্লাহ’ কালেমা আসমান ও জমিনের মধ্যবর্তী স্থানকে পরিপূর্ণ করে দেয়। আর সালাত হচ্ছে নূর, সদাকাহ হচ্ছে দলীল এবং সবর হচ্ছে আলো। আর আল-কুরআন তোমার পক্ষে অথবা বিপক্ষে প্রমাণ স্বরূপ। সকল মানুষই ভোর করে নিজেকে বিক্রি করে দেয়। অতঃপর সে তাকে মুক্ত করে অথবা তাকে ধ্বংস করে।\"",
  "attribution": {
   "en": "Narrated by Muslim",
   "bn": "ইমাম মুসলিম এটি বর্ণনা করেছেন",
   "ar": "رواه مسلم"
  },
  "grade": {
   "en": "Authentic",
   "bn": "সহীহ",
   "ar": "صحيح"
  },
  "cls": "sahih",
  "source": {
   "en": "https://hadeethenc.com/en/browse/hadith/66526",
   "bn": "https://hadeethenc.com/bn/browse/hadith/66526"
  },
  "also": [
   "h12"
  ],
  "flag": null,
  "note": null,
  "review": "source-checked"
 },
 {
  "n": 24,
  "he": 4810,
  "link": "https://sunnah.com/nawawi40:24",
  "refs": [
   {
    "c": "muslim",
    "n": "2577a",
    "url": "https://sunnah.com/muslim:2577a"
   }
  ],
  "ar": "عن أبي ذر رضي الله عنه: عَنِ النَّبِيِّ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ فِيمَا رَوَى عَنِ اللهِ تَبَارَكَ وَتَعَالَى أَنَّهُ قَالَ: «يَا عِبَادِي إِنِّي حَرَّمْتُ الظُّلْمَ عَلَى نَفْسِي، وَجَعَلْتُهُ بَيْنَكُمْ مُحَرَّمًا، فَلَا تَظَالَمُوا، يَا عِبَادِي كُلُّكُمْ ضَالٌّ إِلَّا مَنْ هَدَيْتُهُ، فَاسْتَهْدُونِي أَهْدِكُمْ، يَا عِبَادِي كُلُّكُمْ جَائِعٌ إِلَّا مَنْ أَطْعَمْتُهُ، فَاسْتَطْعِمُونِي أُطْعِمْكُمْ، يَا عِبَادِي كُلُّكُمْ عَارٍ إِلَّا مَنْ كَسَوْتُهُ، فَاسْتَكْسُونِي أَكْسُكُمْ، يَا عِبَادِي إِنَّكُمْ تُخْطِئُونَ بِاللَّيْلِ وَالنَّهَارِ وَأَنَا أَغْفِرُ الذُّنُوبَ جَمِيعًا فَاسْتَغْفِرُونِي أَغْفِرْ لَكُمْ، يَا عِبَادِي إِنَّكُمْ لَنْ تَبْلُغُوا ضَرِّي فَتَضُرُّونِي، وَلَنْ تَبْلُغُوا نَفْعِي فَتَنْفَعُونِي، يَا عِبَادِي لَوْ أَنَّ أَوَّلَكُمْ وَآخِرَكُمْ وَإِنْسَكُمْ وَجِنَّكُمْ كَانُوا عَلَى أَتْقَى قَلْبِ رَجُلٍ وَاحِدٍ مِنْكُمْ مَا زَادَ ذَلِكَ فِي مُلْكِي شَيْئًا، يَا عِبَادِي لَوْ أَنَّ أَوَّلَكُمْ وَآخِرَكُمْ وَإِنْسَكُمْ وَجِنَّكُمْ كَانُوا عَلَى أَفْجَرِ قَلْبِ رَجُلٍ وَاحِدٍ مَا نَقَصَ ذَلِكَ مِنْ مُلْكِي شَيْئًا، يَا عِبَادِي لَوْ أَنَّ أَوَّلَكُمْ وَآخِرَكُمْ وَإِنْسَكُمْ وَجِنَّكُمْ قَامُوا فِي صَعِيدٍ وَاحِدٍ فَسَأَلُونِي فَأَعْطَيْتُ كُلَّ إِنْسَانٍ مَسْأَلَتَهُ مَا نَقَصَ ذَلِكَ مِمَّا عِنْدِي إِلَّا كَمَا يَنْقُصُ الْمِخْيَطُ إِذَا أُدْخِلَ الْبَحْرَ، يَا عِبَادِي إِنَّمَا هِيَ أَعْمَالُكُمْ أُحْصِيهَا لَكُمْ ثُمَّ أُوَفِّيكُمْ إِيَّاهَا، فَمَنْ وَجَدَ خَيْرًا فَلْيَحْمَدِ اللهَ، وَمَنْ وَجَدَ غَيْرَ ذَلِكَ فَلَا يَلُومَنَّ إِلَّا نَفْسَهُ».",
  "en": "Abu Dharr (may Allah be pleased with him) reported: The Prophet (may Allah's peace and blessings be upon him), as part of what he narrated from his Lord, said that Allah Almighty said: \"O My slaves, I have made oppression forbidden for Myself, and I have made it forbidden amongst you, so do not oppress one another. O My slaves, all of you are misguided except those whom I guide, so seek guidance from Me, and I shall guide you. O My slaves, all of you are hungry except those whom I feed, so ask Me for food, and I shall feed you. O My slaves, all of you are naked except those whom I clothe, so ask Me for clothes, and I shall clothe you. O My slaves, you commit sins by night and day, and I forgive all sins, so ask Me for forgiveness, and I shall forgive you. O, My slaves, you can neither do Me harm nor do Me any good. O My slaves, if the first and the last amongst you and all humans and jinn were all as pious as the most pious heart of any man amongst you, that would add nothing to My dominion. O My slaves, if the first and the last amongst you and all humans and jinn were all as wicked as the most wicked heart of any man amongst you, this would cause no loss to My dominion. O My slaves, if the first and the last amongst you and all humans and jinn were all to stand together in one place and ask of Me, and I were to give everyone what he asked for, that would not decrease what I possess, except what is decreased of the sea when a needle is dipped into it. O, My slaves, it is only your deeds that I record for, and I shall recompense you for them. So, whoever finds good should praise Allah, and whoever finds other than that should blame no one but himself.\"",
  "bn": "আবু যার রাদিয়াল্লাহু ‘আনহু থেকে বর্ণিত: নবী সাল্লাল্লাহু আলাইহি ওয়াসাল্লাম আল্লাহ তাবারাকা ওয়াতা‘আলা থেকে বর্ণনা করেন, তিনি বলেছেন: “হে আমার বান্দারা! আমি আমার নিজ সত্তার উপর জুলুম করা কে হারাম করে নিয়েছি এবং তোমাদের মধ্যেও তা হারাম বলে ঘোষণা করছি। অতএব তোমরা একে অপরের উপর জুলুম-অত্যাচার করো না। হে আমার বান্দারা! তোমরা সবাই ছিলে দিশেহারা, তবে আমি যাকে সুপথ দেখিয়েছি সে ব্যতীত। তোমরা আমার কাছে হিদায়াত প্রার্থনা কর, আমি তোমাদের হিদায়াত দান করব। হে আমার বান্দারা! তোমরা সবাই ক্ষুধার্ত, তবে আমি যাকে খাদ্য দান করি সে ব্যতীত। তোমরা আমার কাছে আহার চাও, আমি তোমাদের আহার করাব। হে আমার বান্দারা! তোমরা সবাই বস্ত্রহীন; কিন্তু আমি যাকে পরিধান করাই সে ব্যতীত। তোমরা আমার কাছে পরিধেয় চাও, আমি তোমাদের পরিধান করাব। হে আমার বান্দারা! তোমরা রাতদিন ভুল করে থাকো। আর আমিই সব ভুল ক্ষমা করি। সুতরাং তোমরা আমার কাছে ক্ষমা প্রার্থনা করো, আমি তোমাদেরকে ক্ষমা করে দিব।হে আমার বান্দারা তোমরা কখনো আমার অনিষ্ট করতে পারবে না, যাতে আমি ক্ষতিগ্রস্ত হই এবং তোমরা কখনো আমার উপকার করতে পারবে না, যাতে আমি উপকৃত হই। হে আমার বান্দারা! তোমাদের আদি, তোমাদের অন্ত, তোমাদের মানুষ ও জিন জাতির মধ্যে যার অন্তর আমাকে সবচাইতে বেশি ভয় পায়, তোমরা সবাই যদি তার অন্তরের মতো হয়ে যাও তাতে আমার রাজত্ব একটুও বৃদ্ধি পাবে না। হে আমার বান্দাগণ! তোমাদের আদি, তোমাদের অন্ত, তোমাদের সকল মানুষ ও সকল জিন জাতির মধ্যে যার অন্তর সবচাইতে পাপিষ্ঠ তোমরা সবাই যদি তার অন্তরের মতো হয়ে যাও তাহলে আমার রাজত্ব কিছুমাত্র হ্রাস পাবে না। হে আমার বান্দা! তোমাদের আদি থেকে অন্ত পর্যন্ত সকল মানুষ ও জিন যদি কোন বিশাল মাঠে দাঁড়িয়ে সবাই আমার কাছে আবদার করে আর আমি প্রত্যেক ব্যক্তির চাহিদা পূরণ করি তাহলে আমার কাছে যা আছে তাতে এর চাইতে বেশী কিছু হ্রাস পাবে না, যেমন কেউ সমুদ্রে একটি সূচ ডুবিয়ে দিলে যতটুকু তাথেকে হ্রাস পায়। হে আমার বান্দারা। আমি তোমাদের ’আমলই তোমাদের জন্য সংরক্ষিত রাখি। এরপর পুরোপুরিভাবে তার বিনিময় প্রদান করে থাকি। সুতরাং যে ব্যক্তি কোন কল্যাণ অর্জন করে সে যেন আল্লাহর প্রশংসা করে। আর যে তা ব্যতীত অন্য কিছু পায়, তবে সে যেন নিজেকেই দোষারোপ করে।”",
  "attribution": {
   "en": "Narrated by Muslim",
   "bn": "ইমাম মুসলিম এটি বর্ণনা করেছেন",
   "ar": "رواه مسلم"
  },
  "grade": {
   "en": "Authentic",
   "bn": "সহীহ",
   "ar": "صحيح"
  },
  "cls": "sahih",
  "source": {
   "en": "https://hadeethenc.com/en/browse/hadith/4810",
   "bn": "https://hadeethenc.com/bn/browse/hadith/4810"
  },
  "also": [],
  "flag": null,
  "note": null,
  "review": "source-checked"
 },
 {
  "n": 25,
  "he": 4558,
  "link": "https://sunnah.com/nawawi40:25",
  "refs": [
   {
    "c": "muslim",
    "n": "1006",
    "url": "https://sunnah.com/muslim:1006"
   }
  ],
  "ar": "عَنْ أَبِي ذَرٍّ رضي الله عنه: أَنَّ نَاسًا مِنْ أَصْحَابِ النَّبِيِّ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ قَالُوا لِلنَّبِيِّ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ: يَا رَسُولَ اللهِ، ذَهَبَ أَهْلُ الدُّثُورِ بِالْأُجُورِ، يُصَلُّونَ كَمَا نُصَلِّي، وَيَصُومُونَ كَمَا نَصُومُ، وَيَتَصَدَّقُونَ بِفُضُولِ أَمْوَالِهِمْ، قَالَ: «أَوَلَيْسَ قَدْ جَعَلَ اللهُ لَكُمْ مَا تَصَّدَّقُونَ؟ إِنَّ بِكُلِّ تَسْبِيحَةٍ صَدَقَةً، وَكُلِّ تَكْبِيرَةٍ صَدَقَةً، وَكُلِّ تَحْمِيدَةٍ صَدَقَةً، وَكُلِّ تَهْلِيلَةٍ صَدَقَةً، وَأَمْرٌ بِالْمَعْرُوفِ صَدَقَةٌ، وَنَهْيٌ عَنْ مُنْكَرٍ صَدَقَةٌ، وَفِي بُضْعِ أَحَدِكُمْ صَدَقَةٌ»، قَالُوا: يَا رَسُولَ اللهِ، أَيَأتِي أَحَدُنَا شَهْوَتَهُ وَيَكُونُ لَهُ فِيهَا أَجْرٌ؟ قَالَ: «أَرَأَيْتُمْ لَوْ وَضَعَهَا فِي حَرَامٍ أَكَانَ عَلَيْهِ فِيهَا وِزْرٌ؟ فَكَذَلِكَ إِذَا وَضَعَهَا فِي الْحَلَالِ كَانَ لَهُ أَجْرٌ».",
  "en": "Abu Dharr (may Allah be pleased with him) reported: Some of the Companions of the Prophet (may Allah's peace and blessings be upon him) said to the Prophet (may Allah's peace and blessings be upon him): O Messenger of Allah, the wealthy have taken all the rewards. They pray as we pray, fast as we fast, and give charity from their surplus wealth. He said: \"Has Allah not provided for you that which you can give as charity? Every Tasbīh (saying: Glory be to Allah) is charity; every Takbīr (saying: Allah is the Greatest) is charity; every Tahmīd (saying: Praise be to Allah) is charity; and every Tahlīl (saying: There is no God but Allah) is charity. Enjoining good is charity, forbidding evil is charity, and even in fulfilling the sexual desire of one of you there is charity.\" They said: O Messenger of Allah, does one of us fulfill his desire and get rewarded for it? He said: \"Do you not see that if he were to fulfill it in a forbidden way, would he incur a sin? Similarly, if he fulfills it lawfully, he will have a reward.\"",
  "bn": "আবু যার রাদিয়াল্লাহু ‘আনহু থেকে বর্ণিত: রাসূল্লাহু সাল্লাল্লাহু আলাইহি ওয়াসাল্লামের কতিপয় সাহাবী নবী সাল্লাল্লাহু আলাইহি ওয়াসাল্লামকে বললেন, ‘হে আল্লাহর রসূল! ধনীরাই তো বেশী নেকীর অধিকারী হয়ে গেল। তারা সালাত পড়ছে যেমন আমরা সালাত পড়ছি, তারা সিয়াম রাখছে যেমন আমরা রাখছি এবং (আমাদের চেয়ে তারা অতিরিক্ত কাজ এই করছে যে,) নিজেদের প্রয়োজন-অতিরিক্ত মাল থেকে তারা সাদকাহ করছে।’ তিনি বললেন, “আল্লাহ কি তোমাদের জন্য সাদকাহ করার মত জিনিস দান করেননি? নিঃসন্দেহে প্রত্যেক তাসবীহ সাদকাহ, প্রত্যেক তাকবীর সাদকাহ, প্রত্যেক তাহলীল সাদকাহ, ভাল কাজের নির্দেশ দেওয়া সাদকাহ ও মন্দ কাজ থেকে নিষেধ করা সাদকাহ এবং তোমাদের স্ত্রী-মিলন করাও সাদকাহ।” সাহাবাগণ বললেন, ‘হে আল্লাহর রসূল! আমাদের কেউ স্ত্রী-মিলন ক’রে নিজের যৌন ক্ষুধা নিবারণ করে, তবে এতেও কি তার পুণ্য হবে?’ তিনি বললেন, “কি রায় তোমাদের, যদি কেউ অবৈধভাবে যৌন-মিলন করে, তাহলে কি তার পাপ হবে? অনুরূপ সে যদি বৈধভাবে (স্ত্রী-মিলন করে) নিজের কাম-ক্ষুধা নিবারণ করে, তাহলে তাতে তার পুণ্য হবে”।",
  "attribution": {
   "en": "Narrated by Muslim",
   "bn": "ইমাম মুসলিম এটি বর্ণনা করেছেন",
   "ar": "رواه مسلم"
  },
  "grade": {
   "en": "Authentic",
   "bn": "সহীহ",
   "ar": "صحيح"
  },
  "cls": "sahih",
  "source": {
   "en": "https://hadeethenc.com/en/browse/hadith/4558",
   "bn": "https://hadeethenc.com/bn/browse/hadith/4558"
  },
  "also": [],
  "flag": null,
  "note": null,
  "review": "source-checked"
 },
 {
  "n": 26,
  "he": 66527,
  "link": "https://sunnah.com/nawawi40:26",
  "refs": [
   {
    "c": "bukhari",
    "n": "2989",
    "url": "https://sunnah.com/bukhari:2989"
   },
   {
    "c": "muslim",
    "n": "1009",
    "url": "https://sunnah.com/muslim:1009"
   }
  ],
  "ar": "عَنْ أَبِي هُرَيْرَةَ رَضِيَ اللَّهُ عَنْهُ قَالَ: قَالَ رَسُولُ اللَّهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ: «كُلُّ سُلَامَى مِنَ النَّاسِ عَلَيْهِ صَدَقَةٌ، كُلَّ يَوْمٍ تَطْلُعُ فِيهِ الشَّمْسُ تَعْدِلُ بَيْنَ الِاثْنَيْنِ صَدَقَةٌ، وَتُعِينُ الرَّجُلَ فِي دَابَّتِهِ فَتَحْمِلُهُ عَلَيْهَا أَوْ تَرْفَعُ لَهُ عَلَيْهَا مَتَاعَهُ صَدَقَةٌ، وَالكَلِمَةُ الطَّيِّبَةُ صَدَقَةٌ، وَكُلُّ خُطْوَةٍ تَمْشِيهَا إِلَى الصَّلَاةِ صَدَقَةٌ، وَتُمِيطُ الأَذَى عَنِ الطَّرِيقِ صَدَقَةٌ».",
  "en": "Abu Hurayrah (may Allah be pleased with him) reported: The Messenger of Allah (may Allah's peace and blessings be upon him) said: \"Charity is due upon every joint in a person's body each day the sun rises: to judge justly between two people is a charity. To help a man with his mount, lifting him onto it or hoisting up his belongings onto it, is a charity. Saying a good word is a charity. Every step that you take towards the prayer is a charity, and removing a harmful object from the road is a charity.\"",
  "bn": "আবূ হুরাইরা রদিয়াল্লাহু ‘আনহু থেকে বর্ণিত, তিনি বলেন: রাসূলুল্লাহ সাল্লাল্লাহু ‘আলাইহি ওয়াসাল্লাম বলেছেন: “মানুষের প্রতিটি অস্থির সন্ধিস্থানে (হাড়ের জোড়ায়) একটি সদকা (দান) আবশ্যক। প্রতিদিন সকালে যখন সূর্য ওঠে, তখন তুমি যদি দুই ব্যক্তির মধ্যে ন্যায়বিচার করো — সেটিও সদকা। কোনো ব্যক্তিকে তার বাহনে উঠতে সাহায্য করো, কিংবা তার মালপত্র বাহনে তুলে দাও — সেটাও সদকা। একটি ভালো কথা বলা সদকা। সালাতের উদ্দেশ্যে প্রতিটি কদম ফেলা সদকা। আর রাস্তা থেকে কোনো কষ্টদায়ক জিনিস সরিয়ে দেওয়া — সেটাও সদকা”।",
  "attribution": {
   "en": "Narrated by Al-Bukhāri and Muslim",
   "bn": "ইমাম বুখারী ও মুসলিম এটি বর্ণনা করেছেন",
   "ar": "رواه البخاري ومسلم"
  },
  "grade": {
   "en": "Authentic",
   "bn": "সহীহ",
   "ar": "صحيح"
  },
  "cls": "sahih",
  "source": {
   "en": "https://hadeethenc.com/en/browse/hadith/66527",
   "bn": "https://hadeethenc.com/bn/browse/hadith/66527"
  },
  "also": [],
  "flag": null,
  "note": null,
  "review": "source-checked"
 },
 {
  "n": 27,
  "he": 66540,
  "link": "https://sunnah.com/nawawi40:27",
  "refs": [
   {
    "c": "muslim",
    "n": "2553a",
    "url": "https://sunnah.com/muslim:2553a"
   }
  ],
  "ar": "عَنِ النَّوَّاسِ بْنِ سِمْعَانَ رَضِيَ اللهُ عَنْهُ عَنِ النَّبِيِّ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ قَالَ: «البِرُّ: حُسْنُ الخُلُقِ، وَالإِثْمُ مَا حَاكَ فِي صَدْرِكَ، وَكَرِهْتَ أَنْ يَطَّلِعَ عَلَيْهِ النَّاسُ».   \nوَعَنْ وَابِصَةَ بْنِ مَعْبَدٍ رَضِيَ اللَّهُ عَنْهُ قَالَ: أَتَيْتُ رَسُولَ اللَّهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ فَقَالَ: «جِئْتَ تَسْأَلُ عَنِ البِرِّ وَالإِثْمِ»، قُلْتُ: نَعَمْ، قَالَ: «اسْتَفْتِ قَلْبَكَ، البِرُّ: مَا اطْمَأَنَّتْ إلَيْهِ النَّفْسُ، وَاطْمَأَنَّ إلَيْهِ القَلْبُ، وَالإِثْمُ: مَا حَاكَ فِي نَفْسِكَ وَتَرَدَّدَ فِي الصَّدْرِ، وَإِنْ أَفْتَاكَ النَّاسُ وَأَفْتَوْكَ».",
  "en": "An-Nawwās ibn Sim‘ān (may Allah be pleased with him) reported that the Prophet (ﷺ) said: \"Righteousness is good character, and sin is what wavers in your heart, and you dislike that people know about it.\" Wābisah ibn Ma‘bad (may Allah be pleased with him) reported: I went to the Messenger of Allah (ﷺ) and he said: \"You have come to inquire about righteousness and sin.\" I said: Yes. He said: \"Ask your heart. Righteousness is that which the soul feels at ease with and the heart feels tranquil about. And sin is that which wavers in your soul and causes uneasiness in your chest, even if people give you legal opinions and give you more opinions (in its favor).\"",
  "bn": "নাওয়াস ইবনু সাম‘আন আল-আনসারী রদিয়াল্লাহু ‘আনহু আল্লাহর রাসূল সাল্লাল্লাহু ‘আলাইহি ওয়াসাল্লাম থেকে বর্ণনা করেন যে, তিনি বলেছেন: “পুণ্য হলো সৎ স্বভাবের নাম। আর পাপ হলো তাই, যা তোমার অন্তরে সন্দেহ সৃষ্টি করে এবং তা লোকে জেনে ফেলুক এ কথা তুমি পছন্দ কর না”। ওয়াবিসা ইবনু মা'বাদ রাদিয়াল্লাহু আনহু থেকে বর্ণিত, তিনি বলেন: আমি রাসূলুল্লাহ সাল্লাল্লাহু আলাইহি ওয়া সাল্লামের কাছে আসলাম। তখন তিনি বললেন: “তুমি পুণ্য ও পাপ সম্পর্কে জানতে এসেছো, তাই তো?” আমি বললাম: জি হ্যাঁ। তখন তিনি বললেন: “তোমার হৃদয় থেকে ফতোয়া নাও। পুণ্য (البِرّ) হলো— যা তোমার আত্মা স্বস্তিতে গ্রহণ করে, আর তোমার অন্তর যাতে প্রশান্ত হয়। আর পাপ (الإثم) হলো— যা তোমার অন্তরে সন্দেহ তৈরি করে এবং তোমার বুকের ভেতরে দ্বিধা-দ্বন্দ্ব সৃষ্টি করে, যদিও লোকেরা তোমাকে তা করার ফতোয়া দিক বা উৎসাহ দিক।”",
  "attribution": {
   "en": "The first Hadīth: Narrated by Muslim, and the second Hadīth: Narrated by Ahmad and Ad-Dārimi",
   "bn": "প্রথম হাদীসটি মুসলিম বর্ণনা করেছেন, আর দ্বিতীয় হাদীসটি আহমাদ ও দারিমী বর্ণনা করেছেন।",
   "ar": "الحديث الأول: رواه مسلم، والحديث الثاني: رواه أحمد والدارمي."
  },
  "grade": {
   "en": "Authentic",
   "bn": "সহীহ",
   "ar": "صحيح"
  },
  "cls": "sahih",
  "source": {
   "en": "https://hadeethenc.com/en/browse/hadith/66540",
   "bn": "https://hadeethenc.com/bn/browse/hadith/66540"
  },
  "also": [],
  "flag": null,
  "note": null,
  "review": "source-checked"
 },
 {
  "n": 28,
  "he": 66529,
  "link": "https://sunnah.com/nawawi40:28",
  "refs": [
   {
    "c": "abudawud",
    "n": "4607",
    "url": "https://sunnah.com/abudawud:4607",
    "grade": "Sahih (Al-Albani)"
   }
  ],
  "ar": "عَنْ أَبِي نَجِيحٍ العِرْبَاضِ بْنِ سَارِيَةَ رضي الله عنه قَالَ: وَعَظَنَا رَسُولُ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ مَوْعِظَةً وَجِلَتْ مِنْهَا القُلُوبُ، وَذَرَفَتْ مِنْهَا العُيُونُ، فَقُلْنَا: يَا رَسُولَ اللهِ! كَأَنَّهَا مَوْعِظَةُ مُوَدِّعٍ؛ فَأَوْصِنَا، قَالَ: «أُوصِيكُمْ بِتَقْوَى اللَّهِ، وَالسَّمْعِ وَالطَّاعَةِ، وَإِنْ تَأَمَّرَ عَلَيْكُمْ عَبْدٌ، فَإِنَّهُ مَنْ يَعِشْ مِنْكُمْ بَعْدِي فَسَيَرَى اخْتِلَافًا كَثِيرًا، فَعَلَيْكُمْ بِسُنَّتِي وَسُنَّةِ الخُلَفَاءِ الرَّاشِدِينَ المَهْدِيينَ، عَضُّوا عَلَيْهَا بِالنَّوَاجِذِ، وَإِيَّاكُمْ وَمُحْدَثَاتِ الأُمُورِ؛ فَإِنَّ كُلَّ بِدْعَةٍ ضَلَالَةٌ».",
  "en": "Abu Najīh al-‘Irbād ibn Sāriyah (may Allah be pleased with him) reported: The Messenger of Allah (ﷺ) gave us an exhortation at which hearts trembled and eyes shed tears. So we said: O Messenger of Allah, it is as though this is the exhortation of one bidding farewell; so advise us. He said: \"I advise you to fear Allah, and to listen and obey even if a slave is appointed as your leader. Whosoever among you shall live after me will see much discord. So hold fast to my Sunnah and the Sunnah of the Rightly-Guided Caliphs, and cling to them firmly. Beware of new things (in religion) because every religious innovation is a misguidance.\"",
  "bn": "আবূ নাজীহ ইরবায ইবনু সারিয়াহ রাদিয়াল্লাহু আনহু থেকে বর্ণিত, তিনি বলেন, রাসূলুল্লাহ সাল্লাল্লাহু আলাইহি ওয়াসাল্লাম আমাদেরকে এমন মর্মস্পর্শী ভাষণ দিলেন, তাতে অন্তর ভীত হলো এবং চোখ দিয়ে অশ্রু ঝরল। আমরা বললাম: হে আল্লাহর রাসূল! মনে হচ্ছে এটি বিদায়ী ভাষণ। সুতরাং আমাদেরকে উপদেশ দিন। তিনি বললেন: “আমি তোমাদেরকে আল্লাহর তাকওয়ার উপদেশ দিচ্ছি এবং (নেতার) কথা শ্রবণ ও আনুগত্য করার নির্দেশ দিচ্ছি — যদি তোমাদের ওপর কোনো দাসকেও আমীর বানানো হয়।\nতোমাদের মধ্যে কেউ যদি আমার পরে জীবিত থাকে, সে অনেক মতভেদ দেখতে পাবে। সুতরাং তখন তোমরা আমার সুন্নাহ এবং সঠিক পথপ্রাপ্ত, হিদায়াতপ্রাপ্ত খোলাফায়ে রাশেদীনের সুন্নাহকে আঁকড়ে ধরো — যেন তোমরা তা দাঁত দিয়ে কামড়ে ধরে রাখো (অর্থাৎ শক্তভাবে ধারণ করো)। আর নতুনভাবে তৈরি করা ধর্মীয় বিষয় থেকে নিজেকে দূরে রাখো, কারণ প্রত্যেক বিদআত (নব উদ্ভাবিত কাজ) হলো গোমরাহি (পথভ্রষ্টতা)”।",
  "attribution": {
   "en": "Narrated by Abu Dāwūd and At-Tirmidhi",
   "bn": "এটি আবূ দাঊদ ও তিরমিযী বর্ণনা করেছেন।",
   "ar": "رواه أبو داود والترمذي"
  },
  "grade": {
   "en": "Authentic",
   "bn": "সহীহ",
   "ar": "صحيح"
  },
  "cls": "sahih",
  "source": {
   "en": "https://hadeethenc.com/en/browse/hadith/66529",
   "bn": "https://hadeethenc.com/bn/browse/hadith/66529"
  },
  "also": [],
  "flag": null,
  "note": null,
  "review": "source-checked"
 },
 {
  "n": 29,
  "he": 66530,
  "link": "https://sunnah.com/nawawi40:29",
  "refs": [],
  "ar": "عَنْ مُعَاذِ بْنِ جَبَلٍ رَضِيَ اللهُ عَنْهُ قَالَ: قُلْت يَا رَسُولَ اللَّهِ! أَخْبِرْنِي بِعَمَلٍ يُدْخِلُنِي الجَنَّةَ وَيُبَاعِدْنِي مِنْ النَّارِ، قَالَ: «لَقَدْ سَأَلْتَ عَنْ عَظِيمٍ، وَإِنَّهُ لَيَسِيرٌ عَلَى مَنْ يَسَّرَهُ اللَّهُ عَلَيْهِ: تَعْبُدُ اللَّهَ لَا تُشْرِكُ بِهِ شَيْئًا، وَتُقِيمُ الصَّلَاةَ، وَتُؤْتِي الزَّكَاةَ، وَتَصُومُ رَمَضَانَ، وَتَحُجُّ البَيْتَ، ثُمَّ قَالَ: أَلَا أَدُلُّكَ عَلَى أَبْوَابِ الخَيْرِ، الصَّوْمُ جُنَّةٌ، وَالصَّدَقَةُ تُطْفِئُ الْخَطِيئَةَ كَمَا يُطْفِئُ المَاءُ النَّارَ، وَصَلَاةُ الرَّجُلِ مِنْ جَوْفِ اللَّيْلِ، ثُمَّ تَلَا: {تَتَجَافَى جُنُوبُهُمْ عَنِ الْمَضَاجِعِ} حَتَّى {بَلَغَ يَعْمَلُونَ}، ثُمَّ قَالَ: أَلَا أُخْبِرُك بِرَأْسِ الأَمْرِ وَعَمُودِهِ وَذِرْوَةِ سَنَامِهِ، فَقُلْتُ: بَلَى يَا رَسُولَ اللَّهِ، قَالَ: رَأْسُ الأَمْرِ الإِسْلَامُ، وَعَمُودُهُ الصَّلَاةُ، وَذِرْوَةُ سَنَامِهِ الجِهَادُ، ثُمَّ قَالَ: أَلَا أُخْبِرُك بِمِلَاكِ ذَلِكَ كُلِّهِ، فقُلْت: بَلَى يَا رَسُولَ اللَّه! فَأَخَذَ بِلِسَانِهِ وَقَالَ: كُفَّ عَلَيْك هَذَا، قُلْت: يَا نَبِيَّ اللَّهِ! وَإِنَّا لَمُؤَاخَذُونَ بِمَا نَتَكَلَّمُ بِهِ، فَقَالَ: ثَكِلَتْكَ أُمُّكَ وَهَلْ يَكُبُّ النَّاسَ عَلَى وُجُوهِهِمْ أَوْ قَالَ عَلَى مَنَاخِرِهِمْ إلَّا حَصَائِدُ أَلسِنَتِهِمْ»!",
  "en": "Mu‘ādh ibn Jabal (may Allah be pleased with him) reported: I said: O Messenger of Allah, tell me of an action that lets me enter Paradise and keep me away from Hellfire. He said: \"You have asked about something grave, but it is easy for whomever Allah makes it easy for. Worship Allah, without associating anything with Him, offer the prayer, pay Zakah, fast Ramadan, and perform Hajj. Then, he said: Shall I not guide you to the gates of goodness? Fasting is a shield, charity extinguishes sins as water extinguishes fire, and a man's prayer in the middle of night. Then, he recited: {Their sides forsake their beds} until he reached {what they used to do.} Then he added: Shall I tell you of the essence of the matter, its pillar, and its peak? I replied: Yes, O Messenger of Allah. He said: The essence of this matter is Islam, its pillar is the prayer, and its peak is Jihad. Then he said: Shall I tell you of what holds all these things? I said: Yes, O Messenger of Allah. He took hold of his tongue and said: Keep this under control. I asked: O Prophet of Allah, shall we be held accountable for what we say? He replied: May your mother lose you! What else can cast people on their faces—or on their noses—except the harvest of their tongues?!\"",
  "bn": "মু’আয ইবনু জাবাল রাদিয়াল্লাহু আনহু থেকে বর্ণিত, তিনি বলেন:\nআমি বললাম, “হে আল্লাহর রাসূল! আমাকে এমন একটি আমলের কথা বলুন, যা আমাকে জান্নাতে নিয়ে যাবে এবং জাহান্নাম থেকে দূরে রাখবে।” তিনি বললেন: \"তুমি একটি মহান বিষয় সম্পর্কে জিজ্ঞেস করেছো, তবে এটি সেই ব্যক্তির জন্য সহজ আল্লাহ যার উপর তা সহজ করে দেন: এটি হলো: তুমি একমাত্র আল্লাহর ইবাদত করবে, তাঁর সঙ্গে কাউকে শরীক করবে না, সালাত কায়েম করবে, যাকাত প্রদান করবে, রমজানের সিয়াম রাখবে এবং বায়তুল্লাহর (কাবা) হজ করবে।\nতারপর তিনি বললেন: আমি কি তোমাকে কল্যাণের দরজাগুলোর কথা বলব? রোজা হলো ঢাল। সদকা (দান) পাপ মোচন করে যেমন পানি আগুন নিভিয়ে দেয়। এবং একজন ব্যক্তির রাতের গভীরের সালাত আদায় করার লাভ বলতে গিয়ে তিনি এই আয়াত তিলাওয়াত করলেন: تَتَجَافَى جُنُوبُهُمْ عَنِ الْمَضَاجِعِ} حَتَّى {بَلَغَ يَعْمَلُونَ} “তাদের পার্শ্বদেশ শয্যা থেকে দূরে থাকে (অর্থাৎ তারা রাতে ঘুম ছেড়ে উঠে সালাত পড়ে)...” [আস-সাজদাহ, আয়াত:১৬] তারপর তিনি বললেন:\nআমি কি তোমাকে দীনের মূল বিষয়, তার স্তম্ভ ও সর্বোচ্চ শিখরের কথা বলব? আমি বললাম: “জ্বী, হে আল্লাহর রাসূল!” তিনি বললেন: মূল বিষয় হলো ইসলাম, তার স্তম্ভ হলো সালাত এবং সর্বোচ্চ শিখর হলো জিহাদ। এরপর তিনি বললেন: আমি কি তোমাকে এমন জিনিসের কথা বলব যা এই সব কিছুর রাশ টেনে ধরে?\nআমি বললাম: “অবশ্যই, হে আল্লাহর রাসূল!” তখন তিনি তার জিহ্বা ধরে বললেন: “এটা সংযত রাখো।” আমি বললাম: “হে আল্লাহর নবী! আমরা কি বলার কারণে পাকড়াও হবো?”\nতিনি বললেন: “তোমার মা তোমাকে হারিয়ে ফেলুক(এটি আরবের একটি প্রবাদ), মানুষকে মুখ থুবড়ে জাহান্নামে নিক্ষেপ করা হবে কিসে? তাদের জিহ্বার অর্জনের (অর্থাৎ কথা বলার) ফলেই তো!”",
  "attribution": {
   "en": "Narrated by At-Tirmidhi",
   "bn": "এটি তিরমিযী বর্ণনা করেছেন।",
   "ar": "رواه الترمذي"
  },
  "grade": {
   "en": "Authentic",
   "bn": "সহীহ",
   "ar": "صحيح"
  },
  "cls": "sahih",
  "source": {
   "en": "https://hadeethenc.com/en/browse/hadith/66530",
   "bn": "https://hadeethenc.com/bn/browse/hadith/66530"
  },
  "also": [],
  "flag": null,
  "note": null,
  "review": "source-checked"
 },
 {
  "n": 30,
  "he": 66510,
  "link": "https://sunnah.com/nawawi40:30",
  "refs": [],
  "ar": "عَنْ أَبِي ثَعْلَبَةَ الخُشَنِيِّ جُرْثُومِ بن نَاشِرٍ رَضِيَ اللَّهُ عَنْهُ عَنْ رَسُولِ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ قَال: «إِنَّ اللَّهَ فَرَضَ فَرَائِضَ فَلَا تُضَيِّعُوهَا، وَحَدَّ حُدُودًا فَلَا تَعْتَدُوهَا، وَحَرَّمَ أَشْيَاءَ فَلَا تَنْتَهِكُوهَا، وَسَكَتَ عَنْ أَشْيَاءَ رَحْمَةً لَكُمْ غَيْرَ نِسْيَانٍ فَلَا تَبْحَثُوا عَنْهَا».",
  "en": "Abu Tha‘labah al-Khushani Jurthūm ibn Nāshir (may Allah be pleased with him) reported that the Messenger of Allah (ﷺ) said: \"Indeed, Allah Almighty has enjoined obligations, so do not violate them; He has set limits, so do not transgress them; He has forbidden things, so do not commit them; and He has kept silent about things out of mercy for you, not out of forgetfulness, so do not search for them.\"",
  "bn": "আবু সা‘লাবাহ আল-খুশানী জুরসুম ইবনু নাশির রাদিয়াল্লাহু আনহু রাসূল সাল্লাল্লাহু আলাইহি ওয়াসাল্লাম হতে বর্ণনা করেন, তিনি বলেছেন: “নিশ্চয়ই আল্লাহ তাআলা কতিপয় বিষয় ফরয করেছেন। তোমরা সেটাকে বিনষ্ট কর না, এবং কতক সীমা নির্ধারণ করে দিয়েছেন, তোমরা সেটা লঙ্ঘন কর না এবং কতক বস্তু হারাম করেছেন তোমরা তাতে লিপ্ত হয়ো না, এবং তোমাদের প্রতি অনুগ্রহ করে কিছু বস্তু হতে ইচ্ছাকৃত চুপ থেকেছেন, তোমরা তা অনুসন্ধান কর না”।",
  "attribution": {
   "en": "Narrated by: Ad-Daaraqutni in his Sunan and others",
   "bn": "এটি দারাকুতনী তার সুনানে এবং অন্যরা বর্ণনা করেছেন।",
   "ar": "رواه الدارقطني في سننه، وغيره"
  },
  "grade": {
   "en": "An-Nawawi said: It is a Hasan (sound) Hadīth",
   "bn": "ইমাম নববী বলেছেন: হাদীসটি হাসান।",
   "ar": "قال النووي: حديث حسن"
  },
  "cls": "hasan",
  "source": {
   "en": "https://hadeethenc.com/en/browse/hadith/66510",
   "bn": "https://hadeethenc.com/bn/browse/hadith/66510"
  },
  "also": [],
  "flag": "grade",
  "note": null,
  "review": "source-checked"
 },
 {
  "n": 31,
  "he": 4307,
  "link": "https://sunnah.com/nawawi40:31",
  "refs": [],
  "ar": "عَنْ أَبِي العَبَّاسِ سَهْلِ بْنِ سَعِدٍ السَّاعِدِيِّ رَضِيَ اللَّهُ عَنْهُ قَالَ: جَاءَ رَجُلٌ إِلَى النَّبِيِّ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ، فَقَالَ: يَا رَسُولَ اللَّهِ، دُلَّنِي عَلَى عَمَلٍ إِذَا عَمِلْتُهُ أَحَبَّنِي اللَّهُ وَأَحَبَّنِي النَّاسُ، فَقَالَ: «ازْهَدْ فِي الدُّنْيَا يُحِبُّكَ اللَّهُ، وَازْهَدْ فِيمَا عِنْدَ النَّاسِ يُحِبُّكَ النَّاسُ».",
  "en": "Abu al-‘Abbās Sahl ibn Sa‘d as-Sā‘idi (may Allah be pleased with him) reported: A man came to the Prophet (ﷺ) and said: O Messenger of Allah, guide me to a deed which, if I do it, Allah will love me and people will love me. He said: \"Be indifferent to worldly life; Allah will love you, and be indifferent to what people have; people will love you.\"",
  "bn": "সাহল ইবন সাদ আস-সাইদী রাদিয়াল্লাহু আনহু থেকে বর্ণিত। তিনি বলেন, এক ব্যক্তি নবী সাল্লাল্লাহু আলাইহি ওয়াসাল্লাম -এর নিকট উপস্থিত হয়ে বলল, হে আল্লাহর রাসূল! আমাকে এমন একটি কাজের কথা বলে দিন যা আমি করলে আল্লাহ আমাকে ভালোবাসবেন এবং লোকেরাও আমাকে ভালোবাসবেন। তিনি বললেন: “তুমি দুনিয়ার প্রতি অনাসক্তি অবলন্বন করো। তাহলে আল্লাহ তোমাকে ভালোবাসবেন। মানুষের নিকট যা আছে, তুমি তার প্রতি অনাসক্ত হয়ে যাও, তাহলে তারাও তোমাকে ভালোবাসবে”।",
  "attribution": {
   "en": "Narrated by Ibn Mājah and others, with sound chains of narrations",
   "bn": "এটি ইবন মাজাহ ও অন্যান্যরা একাধিক হাসান সনদে বর্ণনা করেছেন।",
   "ar": "رواه ابن ماجه وغيره بأسانيد حسنة"
  },
  "grade": {
   "en": "An-Nawawi said: It is a Hasan (sound) Hadīth",
   "bn": "ইমাম নববী বলেছেন: হাদীসটি হাসান।",
   "ar": "قال النووي: حديث حسن"
  },
  "cls": "hasan",
  "source": {
   "en": "https://hadeethenc.com/en/browse/hadith/4307",
   "bn": "https://hadeethenc.com/bn/browse/hadith/4307"
  },
  "also": [],
  "flag": "grade",
  "note": null,
  "review": "source-checked"
 },
 {
  "n": 32,
  "he": 66531,
  "link": "https://sunnah.com/nawawi40:32",
  "refs": [],
  "ar": "عَنْ أَبِي سَعِيدٍ سَعْدِ بْنِ مَالِكِ بْنِ سِنَانٍ الخُدْرِيّ رَضِيَ اللَّهُ عَنْهُ أَنَّ رَسُولَ اللَّهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ قَالَ: «لَا ضَرَرَ وَلَا ضِرَارَ».",
  "en": "Abu Sa‘īd Sa‘d ibn Mālik ibn Sinān al-Khudri (may Allah be pleased with him) reported that the Messenger of Allah (ﷺ) said: \"There should be no harm or reciprocal harm.\"",
  "bn": "আবূ সায়ীদ সা‘দ ইবনু মালিক ইবনু সিনান আল-খুদরী রাদিয়াল্লাহু আনহু হতে বর্ণিত, রাসূলুল্লাহ সাল্লাল্লাহ সাল্লাল্লাহু আলাইহি ওয়াসাল্লাম বলেন, “নিজের ও অন্যের ক্ষতি করা যাবে না।”",
  "attribution": {
   "en": "Narrated by Ibn Mājah, Ad-Dāraquṭnī, and others with a connected chain",
   "bn": "এটি ইবন মাজাহ, দারাকুতনী ও অন্যান্যরা মুসনাদরূপে বর্ণনা করেছেন।",
   "ar": "رواه ابن ماجه، والدارقطني، وغيرهما مسندًا"
  },
  "grade": {
   "en": "Hasan",
   "bn": "হাসান",
   "ar": "حسن"
  },
  "cls": "hasan",
  "source": {
   "en": "https://hadeethenc.com/en/browse/hadith/66531",
   "bn": "https://hadeethenc.com/bn/browse/hadith/66531"
  },
  "also": [],
  "flag": "grade",
  "note": null,
  "review": "source-checked"
 },
 {
  "n": 33,
  "he": 66532,
  "link": "https://sunnah.com/nawawi40:33",
  "refs": [],
  "ar": "عَن ابنِ عباسٍ رضي الله عنهما أنَّ رسولَ اللهِ صلي الله عليه وسلم قال: «لَو يُعطَى النّاسُ بدَعواهُم لادَّعَى رِجالٌ أموالَ قَومٍ ودِماءَهُم، لَكِنَّ البَيِّنَةَ على المُدَّعِى، واليَمينَ على مَن أنكَرَ».",
  "en": "Ibn ‘Abbās (may Allah be pleased with him) reported: The Messenger of Allah (may Allah's peace and blessings be upon him) said: \"Were people to be given everything they claimed, some men would claim the properties and blood of other people. However, the onus of proof is on the plaintiff, and the oath is upon the one who denies the claim (defendant).\"",
  "bn": "ইবনু আব্বাস রাদিয়াল্লাহু আনহুমা থেকে বর্ণিত, রাসূল সাল্লাল্লাহু আলাইহি ওয়া সাল্লাম বলেছেন: “যদি মানুষকে কেবল তাদের দাবী অনুযায়ী দিয়ে দেওয়া হয়, তাহলে অবশ্যই কতক লোক অন্যের সম্পদ এবং তাদের জীবনও দাবী করবে। তবে দাবীদারের দায়িত্ব প্রমাণ পেশ করা আর যে অস্বীকারীর করবে তার দায়িত্ব শপথ করা”।",
  "attribution": {
   "en": "Narrated by Al-Bayhaqi and others, and part of it is in the two Sahihs",
   "bn": "এটি বাইহাকী ও অন্যান্যরা এভাবে বর্ণনা করেছেন এবং এর অংশবিশেষ সহীহ বুখারী ও মুসলিমে রয়েছে।",
   "ar": "رواه البيهقي، وغيره هكذا، وبعضه في الصحيحين"
  },
  "grade": {
   "en": "Hasan",
   "bn": "হাসান",
   "ar": "حسن"
  },
  "cls": "hasan",
  "source": {
   "en": "https://hadeethenc.com/en/browse/hadith/66532",
   "bn": "https://hadeethenc.com/bn/browse/hadith/66532"
  },
  "also": [],
  "flag": "grade",
  "note": null,
  "review": "source-checked"
 },
 {
  "n": 34,
  "he": 65001,
  "link": "https://sunnah.com/nawawi40:34",
  "refs": [
   {
    "c": "muslim",
    "n": "49a",
    "url": "https://sunnah.com/muslim:49a"
   }
  ],
  "ar": "عن أبي سعيد الخُدْريِّ رضي الله عنه قال: سمعت رسول الله صلى الله عليه وسلم يقول: «‌مَنْ ‌رَأَى ‌مِنْكُمْ ‌مُنْكَرًا فَلْيُغَيِّرْهُ بِيَدِهِ، فَإِنْ لَمْ يَسْتَطِعْ فَبِلِسَانِهِ، فَإِنْ لَمْ يَسْتَطِعْ فَبِقَلْبِهِ، وَذَلِكَ أَضْعَفُ الْإِيمَانِ».",
  "en": "Abu Sa‘īd al-Khudri (may Allah be pleased with him) reported: I heard the Messenger of Allah (may Allah's peace and blessings be upon him) say: \"Whoever of you sees something evil, let him change it with his hand; and if he is not able, then with his tongue; and if he is not able, then with his heart, and that is the weakest of faith.\"",
  "bn": "আবু সাঈদ আল-খুদরী রাদিয়াল্লাহু ‘আনহু হতে বর্ণিত, তিনি বলেছেন: আমি রাসূলুল্লাহ সাল্লাল্লাহু ‘আলাইহি ওয়া সাল্লামকে বলতে শুনেছি, তিনি বলেছেন: “তোমাদের মধ্যে যে ব্যক্তি কোন অন্যায় কাজ দেখতে পাবে, সে যেন উক্ত অন্যায়কে তার হাত দিয়ে পরিবর্তন করে। যদি সে তা করতে সক্ষম না হয়, তবে সে যেন তার জিহ্বা (ভাষা) দ্বারা তা পরিবর্তন করে। যদি সে তাতেও সক্ষম না হয়, তবে সে যেন তার অন্তর দিয়ে [চেষ্টা করে এবং ঘৃণা করে]। আর এটিই হচ্ছে ঈমানের সর্বনিম্ন স্তর।”",
  "attribution": {
   "en": "Narrated by Muslim",
   "bn": "ইমাম মুসলিম এটি বর্ণনা করেছেন",
   "ar": "رواه مسلم"
  },
  "grade": {
   "en": "Authentic",
   "bn": "সহীহ",
   "ar": "صحيح"
  },
  "cls": "sahih",
  "source": {
   "en": "https://hadeethenc.com/en/browse/hadith/65001",
   "bn": "https://hadeethenc.com/bn/browse/hadith/65001"
  },
  "also": [],
  "flag": null,
  "note": null,
  "review": "source-checked"
 },
 {
  "n": 35,
  "he": 4706,
  "link": "https://sunnah.com/nawawi40:35",
  "refs": [
   {
    "c": "muslim",
    "n": "2564a",
    "url": "https://sunnah.com/muslim:2564a"
   }
  ],
  "ar": "عَنْ أَبِي هُرَيْرَةَ رضي الله عنه قَالَ: قَالَ رَسُولُ اللهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ: «لَا تَحَاسَدُوا، وَلَا تَنَاجَشُوا، وَلَا تَبَاغَضُوا، وَلَا تَدَابَرُوا، وَلَا يَبِعْ بَعْضُكُمْ عَلَى بَيْعِ بَعْضٍ، وَكُونُوا عِبَادَ اللهِ إِخْوَانًا الْمُسْلِمُ أَخُو الْمُسْلِمِ، لَا يَظْلِمُهُ وَلَا يَخْذُلُهُ، وَلَا يَحْقِرُهُ التَّقْوَى هَاهُنَا» وَيُشِيرُ إِلَى صَدْرِهِ ثَلَاثَ مَرَّاتٍ «بِحَسْبِ امْرِئٍ مِنَ الشَّرِّ أَنْ يَحْقِرَ أَخَاهُ الْمُسْلِمَ، كُلُّ الْمُسْلِمِ عَلَى الْمُسْلِمِ حَرَامٌ، دَمُهُ، وَمَالُهُ، وَعِرْضُهُ».",
  "en": "Abu Hurayrah (may Allah be pleased with him) reported: The Messenger of Allah (may Allah's peace and blessings be upon him) said: \"Do not envy one another, do not raise prices by overbidding against one another, do not hate one another, do not turn your backs on one another, and do not undercut one another in trade; and be, O slaves of Allah, our brothers. A Muslim is the brother of a Muslim; he does not wrong him, he does not fail him, and he does not despise him. Piety lies here,\" and he pointed to his chest three times. \"It is enough evil for a person to look down upon his Muslim brother. All of a Muslim is inviolable to another Muslim: his blood, his property, and his honor.\"",
  "bn": "আবূ হুরাইরাহ রাদিয়াল্লাহু ‘আনহু হতে বর্ণিত, তিনি বলেন, রাসূলুল্লাহ সাল্লাল্লাহু আলাইহি ওয়া সাল্লাম বলেছেন: “তোমরা এক অপরের প্রতি হিংসা করো না, কেনাবেচাতে জিনিসের মূল্য বাড়িয়ে এক অপরকে ধোঁকা দিয়ো না, একে অপরের প্রতি শত্রুতা রেখো না, একে অপর থেকে (ঘৃণাভরে) মুখ ফিরায়ো না এবং একে অপরের কেনাবেচার উপর কেনাবেচা করো না। আর আল্লাহর বান্দাগণ! তোমরা পরস্পর ভাই হয়ে যাও। মুসলিম মুসলিমের ভাই। সে তার প্রতি যুলুম করবে না, তাকে লাঞ্ছিত করবে না, তাকে মিথ্যারোপ করবে না এবং তাকে তুচ্ছ ভাববে না। আর তাকওয়া হচ্ছে এখানে। তিনি নিজ বুকের দিকে ইঙ্গিত করে এ কথা তিনবার বললেন। কোনো মুসলিম ভাইকে তুচ্ছ ভাবা একটি মানুষের মন্দ হওয়ার জন্য যথেষ্ট। প্রত্যেক মুসলিমের রক্ত, মাল এবং তার মর্যাদা অপর মুসলিমের ওপর হারাম।”",
  "attribution": {
   "en": "Narrated by Muslim",
   "bn": "ইমাম মুসলিম এটি বর্ণনা করেছেন",
   "ar": "رواه مسلم"
  },
  "grade": {
   "en": "Authentic",
   "bn": "সহীহ",
   "ar": "صحيح"
  },
  "cls": "sahih",
  "source": {
   "en": "https://hadeethenc.com/en/browse/hadith/4706",
   "bn": "https://hadeethenc.com/bn/browse/hadith/4706"
  },
  "also": [
   "h16"
  ],
  "flag": null,
  "note": {
   "en": "Translation note: HadeethEnc's English reads \"our brothers\" where the Arabic (ikhwanan) means \"brothers\". The translation is kept unchanged under HadeethEnc's terms.",
   "bn": "অনুবাদ টীকা: হাদীসএনসির ইংরেজি অনুবাদে \"our brothers\" লেখা আছে, যেখানে আরবি (ইখওয়ানান) শব্দের অর্থ \"ভাই\"। হাদীসএনসির শর্ত অনুযায়ী অনুবাদ অপরিবর্তিত রাখা হয়েছে।"
  },
  "review": "source-checked"
 },
 {
  "n": 36,
  "he": 4801,
  "link": "https://sunnah.com/nawawi40:36",
  "refs": [
   {
    "c": "muslim",
    "n": "2699a",
    "url": "https://sunnah.com/muslim:2699a"
   }
  ],
  "shared": "h03",
  "cls": "sahih",
  "also": [],
  "flag": null,
  "note": null,
  "review": "source-checked"
 },
 {
  "n": 37,
  "he": 66533,
  "link": "https://sunnah.com/nawawi40:37",
  "refs": [
   {
    "c": "bukhari",
    "n": "6491",
    "url": "https://sunnah.com/bukhari:6491"
   },
   {
    "c": "muslim",
    "n": "131a",
    "url": "https://sunnah.com/muslim:131a"
   }
  ],
  "ar": "عَنْ ابْنِ عَبَّاسٍ رَضِيَ اللَّهُ عَنْهُمَا عَنْ رَسُولِ اللَّهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ فِيمَا يَرْوِي عَنْ رَبِّهِ تَبَارَكَ وَتَعَالَى، قَالَ: «إنَّ اللهَ كَتَبَ الحَسَنَاتِ وَالسَّيِّئَاتِ، ثُمَّ بَيَّنَ ذَلِكَ، فَمَنْ هَمَّ بِحَسَنَةٍ فَلَمْ يَعْمَلْهَا؛ كَتَبَهَا اللهُ عِنْدَهُ حَسَنَةً كَامِلَةً، وَإِنْ هَمَّ بِهَا فَعَمِلَهَا؛ كَتَبَهَا اللهُ عِنْدَهُ عَشْرَ حَسَنَاتٍ إلَى سَبْعِمِائَةِ ضِعْفٍ إلَى أَضْعَافٍ كَثِيرَةٍ، وَإِنْ هَمَّ بِسَيِّئَةٍ فَلَمْ يَعْمَلْهَا؛ كَتَبَهَا اللهُ عِنْدَهُ حَسَنَةً كَامِلَةً، وَإِنْ هَمَّ بِهَا فَعَمِلَهَا؛ كَتَبَهَا اللهُ سَيِّئَةً وَاحِدَةً».",
  "en": "Ibn ‘Abbās (may Allah be pleased with him and his father) reported that the Messenger of Allah (ﷺ) said, reporting from his Almighty Lord: \"Allah has written the good deeds and bad deeds, then clarified that. If someone intends to do a good deed but does not do it, Allah writes it as a complete good deed for him, and if he does it, Allah writes it as ten good deeds, multiplied up to seven-hundred times and plenty more times. If someone intends to do a sin but does not do it, Allah writes it as a complete good deed. If he intends to do a sin and does it, Allah writes it as one sin.\"",
  "bn": "ইবনু আব্বাস রাদিয়াল্লাহু আনহুমা হতে বর্ণিত, তিনি বলেন, রাসূলুল্লাহ সাল্লাল্লাহু ‘আলাইহি ওয়া সাল্লাম তাঁর মহান ও বরকতময় রব আল্লাহ্‌র পক্ষ থেকে বর্ণনা করেন, তিনি বলেন: “নিশ্চয় আল্লাহ্ ভাল-মন্দ লিখে দিয়েছেন। এরপর সেগুলোর বর্ণনা দিয়েছেন। সুতরাং যে ব্যক্তি কোন সৎ কাজের ইচ্ছা করল, কিন্তু তা বাস্তবায়ন করল না, আল্লাহ্ তাঁর নিকট পরিপূর্ণ সাওয়াব লিখবেন। আর যদি সে ভাল কাজের ইচ্ছা করল এবং তা বাস্তবায়নও করল তবে আল্লাহ্ তাঁর নিকট তার জন্য দশ গুণ থেকে সাতশ’ গুণ পর্যন্ত এমন কি এর চেয়েও অধিক সাওযাব লিখে রাখবেন। আর যে কোন মন্দ কাজের ইচ্ছা করল, কিন্তু তা বাস্তবে পরিণত করল না, আল্লাহ্ তাঁর কাছে তার জন্য পূর্ণ সাওয়াব লিখবেন। আর যদি সে মন্দ কাজের ইচ্ছা করার পর বাস্তবেও তা করে, তবে তার জন্য আল্লাহ্ মাত্র একটা গুনাহ লিখেন”।",
  "attribution": {
   "en": "Narrated by Al-Bukhāri and Muslim in their Sahihs with this wording",
   "bn": "ইমাম বুখারী ও মুসলিম তাদের সহীহ গ্রন্থদ্বয়ে এটি এই শব্দে বর্ণনা করেছেন।",
   "ar": "رواه البخاري ومسلم في صحيحيهما بهذه الحروف"
  },
  "grade": {
   "en": "Authentic",
   "bn": "সহীহ",
   "ar": "صحيح"
  },
  "cls": "sahih",
  "source": {
   "en": "https://hadeethenc.com/en/browse/hadith/66533",
   "bn": "https://hadeethenc.com/bn/browse/hadith/66533"
  },
  "also": [
   "h14"
  ],
  "flag": null,
  "note": null,
  "review": "source-checked"
 },
 {
  "n": 38,
  "he": 66534,
  "link": "https://sunnah.com/nawawi40:38",
  "refs": [
   {
    "c": "bukhari",
    "n": "6502",
    "url": "https://sunnah.com/bukhari:6502"
   }
  ],
  "ar": "عَنْ أَبِي هُرَيْرَة رَضِيَ اللَّهُ عَنْهُ قَالَ: قَالَ رَسُول اللَّهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ: «إنَّ اللَّهَ تَعَالَى قَالَ: مَنْ عَادَى لِي وَلِيًّا فَقْد آذَنْتُهُ بِالحَرْبِ، وَمَا تَقَرَّبَ إلَيَّ عَبْدِي بِشَيْءٍ أَحَبَّ إلَيَّ مِمَّا افْتَرَضْتُ عَلَيْهِ، وما يَزَالُ عَبْدِي يَتَقَرَّبُ إلَيَّ بِالنَّوَافِلِ حَتَّى أُحِبَّهُ، فَإِذَا أَحْبَبْتُهُ كُنْتُ سَمْعَهُ الَّذِي يَسْمَعُ بِهِ، وَبَصَرَهُ الَّذِي يُبْصِرُ بِهِ، وَيَدَهُ الَّتِي يَبْطِشُ بِهَا، وَرِجْلَهُ الَّتِي يَمْشِي بِهَا، وَإِنْ سَأَلَنِي لَأُعْطِيَنَّهُ، وَلَئِنْ اسْتَعَاذَنِي لَأُعِيذَنَّهُ».",
  "en": "Abu Hurayrah (may Allah be pleased with him) reported: The Messenger of Allah (ﷺ) said: \"Allah Almighty says: I will declare war against one who shows hostility to a close ally of Mine. And the most beloved thing with which My slave comes nearer to Me is what I have enjoined upon him; and My slave keeps on coming closer to Me through performing supererogatory acts of worship till I love him. When I love him, I become his hearing with which he hears, his sight with which he sees, his hand with which he seizes, and his leg with which he walks; and if he asks (something) from Me, I will surely give it to him, and if he asks My Protection (refuge), I will surely protect him.\"",
  "bn": "আবূ হুরাইরা রাদিয়াল্লাহু ‘আনহু থেকে বর্ণিত, তিনি বলেন: রাসূলুল্লাহ সাল্লাল্লাহু ‘আলাইহি ওয়াসাল্লাম বলেছেন: “আল্লাহ্ বলেন, যে ব্যক্তি আমার কোন ওলীর সঙ্গে দুশমনি রাখবে, আমি তার সঙ্গে যুদ্ধ ঘোষণা করব। আমার বান্দা যে সমস্ত ইবাদতের মাধ্যমে আমার নৈকট্য হাসিল করে থাকে, তার মধ্যে ঐ ইবাদতের চেয়ে আমার কাছে অধিক প্রিয় আর কোন ইবাদত নেই যা আমি তার উপর ফরয করেছি। আর বান্দা নফল ইবাদতের মাধ্যমে আমার নৈকট্য অর্জন করতে থাকে। এমন কি অবশেষে আমি তাকে আমার এমন প্রিয় পাত্র বানিয়ে নেই যে, আমিই তার কান হয়ে যাই, যা দিয়ে সে শুনে। আমিই তার চোখ হয়ে যাই, যা দিয়ে সে দেখে। আর আমিই তার হাত হয়ে যাই, যা দিয়ে সে ধরে। আমিই তার পা হয়ে যাই, যা দ্বারা সে চলে। সে যদি আমার কাছে কোন কিছু চায়, তবে আমি নিশ্চয়ই তাকে তা দান করি। আর যদি সে আমার কাছে আশ্রয় প্রার্থনা করে, তবে অবশ্যই আমি তাকে আশ্রয় দেই”।",
  "attribution": {
   "en": "Narrated by Al-Bukhāri",
   "bn": "এটি বুখারী বর্ণনা করেছেন।",
   "ar": "رواه البخاري"
  },
  "grade": {
   "en": "Authentic",
   "bn": "সহীহ",
   "ar": "صحيح"
  },
  "cls": "sahih",
  "source": {
   "en": "https://hadeethenc.com/en/browse/hadith/66534",
   "bn": "https://hadeethenc.com/bn/browse/hadith/66534"
  },
  "also": [],
  "flag": null,
  "note": null,
  "review": "source-checked"
 },
 {
  "n": 39,
  "he": 4216,
  "link": "https://sunnah.com/nawawi40:39",
  "refs": [],
  "ar": "عَنْ ابْنِ عَبَّاسٍ رَضِيَ اللَّهُ عَنْهُمَا أَنَّ رَسُولَ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ قَالَ: «إنَّ اللَّهَ تَجَاوَزَ لِي عَنْ أُمَّتِي الخَطَأَ وَالنِّسْيَانَ وَمَا اسْتُكْرِهُوا عَلَيْهِ».",
  "en": "Ibn ‘Abbās (may Allah be pleased with him and his father) reported that the Messenger of Allah (ﷺ) said: \"Allah has pardoned for me the mistakes and forgetfulness of my Ummah, and what they were coerced into doing.\"",
  "bn": "ইবনু আব্বাস রাদিয়াল্লাহু আনহুমা থেকে বর্ণিত, রাসূলুল্লাহ সাল্লাল্লাহু আলাইহি ওয়া সাল্লাম: “নিশ্চয় আল্লাহ আমার উম্মাতের ভুল, বিস্মৃতি ও জোরপূর্বক যা করানো হয় তা ক্ষমা করে দিয়েছেন।”",
  "attribution": {
   "en": "Narrated by Ibn Mājah, Al-Bayhaqī, and others",
   "bn": "এটি ইবনে মাজাহ, বায়হাকী ও অন্যান্যরা বর্ণনা করেছেন।",
   "ar": "رواه ابن ماجه والبيهقي وغيرهما"
  },
  "grade": {
   "en": "An-Nawawi said: It is a Hasan (sound) Hadīth",
   "bn": "ইমাম নববী বলেছেন: হাদীসটি হাসান।",
   "ar": "قال النووي: حديث حسن"
  },
  "cls": "hasan",
  "source": {
   "en": "https://hadeethenc.com/en/browse/hadith/4216",
   "bn": "https://hadeethenc.com/bn/browse/hadith/4216"
  },
  "also": [],
  "flag": "grade",
  "note": null,
  "review": "source-checked"
 },
 {
  "n": 40,
  "he": 4704,
  "link": "https://sunnah.com/nawawi40:40",
  "refs": [
   {
    "c": "bukhari",
    "n": "6416",
    "url": "https://sunnah.com/bukhari:6416"
   }
  ],
  "ar": "عَنْ عَبْدِ اللَّهِ بْنِ عُمَرَ رَضِيَ اللَّهُ عَنْهُمَا قَالَ: أَخَذَ رَسُولُ اللَّهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ بِمَنْكِبِي، فَقَالَ: «كُنْ فِي الدُّنْيَا كَأَنَّكَ غَرِيبٌ أَوْ عَابِرُ سَبِيلٍ»، وَكَانَ ابْنُ عُمَرَ، يَقُولُ: إِذَا أَمْسَيْتَ فَلاَ تَنْتَظِرِ الصَّبَاحَ، وَإِذَا أَصْبَحْتَ فَلاَ تَنْتَظِرِ المَسَاءَ، وَخُذْ مِنْ صِحَّتِكَ لِمَرَضِكَ، وَمِنْ حَيَاتِكَ لِمَوْتِكَ.",
  "en": "‘Abdullah ibn ‘Umar (may Allah be pleased with him and his father) reported: The Messenger of Allah (may Allah's peace and blessings be upon him) took me by the shoulder and said: \"Be in this world as if you are a stranger or a wayfarer.\" Ibn ‘Umar used to say: If you reach the evening, do not wait for the morning, and if you reach the morning, do not wait for the evening. Take from your health for your sickness and from your life for your death.",
  "bn": "’আবদুল্লাহ্ ইবনু ’উমার রাদিয়াল্লাহু আনহুমা হতে বর্ণিত। তিনি বলেন, রাসূলুল্লাহ্ সাল্লাল্লাহু আলাইহি ওয়াসাল্লাম একবার আমার দু’ কাঁধ ধরে বললেন: “তুমি দুনিয়াতে থাক যেন তুমি একজন প্রবাসী অথবা পথচারী”। আর ইবনু ’উমার বলতেন, তুমি সন্ধ্যায় উপনীত হলে সকালের আর অপেক্ষা করো না এবং সকালে উপনীত হলে সন্ধ্যার আর অপেক্ষা করো না। তোমার সুস্থতার সময় তোমার পীড়িত অবস্থার জন্য প্রস্তুতি লও। আর তোমার জীবিত অবস্থায় তোমার মৃত্যুর জন্য প্রস্তুতি লও।",
  "attribution": {
   "en": "Narrated by Al-Bukhāri",
   "bn": "এটি বুখারী বর্ণনা করেছেন।",
   "ar": "رواه البخاري"
  },
  "grade": {
   "en": "Authentic",
   "bn": "সহীহ",
   "ar": "صحيح"
  },
  "cls": "sahih",
  "source": {
   "en": "https://hadeethenc.com/en/browse/hadith/4704",
   "bn": "https://hadeethenc.com/bn/browse/hadith/4704"
  },
  "also": [],
  "flag": null,
  "note": null,
  "review": "source-checked"
 },
 {
  "n": 41,
  "he": 66535,
  "link": "https://sunnah.com/nawawi40:41",
  "refs": [],
  "ar": "عَنْ أَبِي مُحَمَّدٍ عَبْدِ اللَّهِ بْنِ عَمْرِو بْنِ العَاصِ رَضِيَ اللَّهُ عَنْهُمَا، قَالَ: قَالَ رَسُولُ اللَّهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ: «لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يَكُونَ هَوَاهُ تَبَعًا لِمَا جِئْتُ بِهِ».",
  "en": "Abu Muhammad ‘Abdullah ibn ‘Amr ibn al-‘Ās (may Allah be pleased with him and his father) reported: The Messenger of Allah (ﷺ) said: \"None of you (truly) believes until his personal desire complies with what I have come with.\"",
  "bn": "আব্দুল্লাহ ইবনু ‘আমর ইবনুল ‘আস রাদিয়াল্লাহু ‘আনহুমা হতে বর্ণিত, তিনি বলেন: রাসূলুল্লাহ সাল্লাল্লাহু ‘আলাইহি ওয়াসাল্লাম বলেছেন: “তোমাদের কেউ ঈমানাদর হতে পারবে না, যতক্ষণ না তার প্রবৃত্তি আমার আনীত আদর্শের অধীন হয়।”",
  "attribution": {
   "en": "We narrated it in the book 'Al-Hujjah' with an authentic chain of narrators",
   "bn": "(এটি কিতাবুল হুজ্জাহ তে বর্ণনা করেছি, এর সনদ সহীহ)",
   "ar": "رويناه في كتاب الحجة بإسناد صحيح"
  },
  "grade": {
   "en": "An-Nawawi said: This is an authentic Hadīth",
   "bn": "ইমাম নববী বলেছেন: হাদীসটি সহীহ।",
   "ar": "قال النووي: حديث صحيح"
  },
  "cls": "sahih",
  "source": {
   "en": "https://hadeethenc.com/en/browse/hadith/66535",
   "bn": "https://hadeethenc.com/bn/browse/hadith/66535"
  },
  "also": [],
  "flag": "grade",
  "note": null,
  "review": "source-checked"
 },
 {
  "n": 42,
  "he": 5456,
  "link": "https://sunnah.com/nawawi40:42",
  "refs": [],
  "ar": "عَنْ أَنَسِ بْنِ مَالِكٍ رضي الله عنه قَالَ: سَمِعْتُ رَسُولَ اللهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ يَقُولُ: «قَالَ اللَّهُ تَبَارَكَ وَتَعَالَى: يَا ابْنَ آدَمَ إِنَّكَ مَا دَعَوْتَنِي وَرَجَوْتَنِي غَفَرْتُ لَكَ عَلَى مَا كَانَ فِيكَ وَلاَ أُبَالِي، يَا ابْنَ آدَمَ لَوْ بَلَغَتْ ذُنُوبُكَ عَنَانَ السَّمَاءِ ثُمَّ اسْتَغْفَرْتَنِي غَفَرْتُ لَكَ، وَلاَ أُبَالِي، يَا ابْنَ آدَمَ إِنَّكَ لَوْ أَتَيْتَنِي بِقُرَابِ الأَرْضِ خَطَايَا ثُمَّ لَقِيتَنِي لاَ تُشْرِكُ بِي شَيْئًا لأَتَيْتُكَ بِقُرَابِهَا مَغْفِرَةً».",
  "en": "Anas ibn Mālik (may Allah be pleased with him) reported: I heard the Messenger of Allah (may Allah's peace and blessings be upon him) say: \"Allah Almighty said: 'O son of Adam, so long as you call upon Me and ask of Me, I shall forgive you for what you have done, and I shall not mind. O son of Adam, were your sins to reach the clouds of the sky and were you then to ask forgiveness of Me, I shall forgive you. O son of Adam, were you to come to Me with sins nearly as great as the earth and were you then to meet Me, ascribing no partner to Me, I shall bring you forgiveness nearly as great as it is.'\"",
  "bn": "আনাস ইবনু মালিক রাদিয়াল্লাহু আনহু থেকে বর্ণিত, তিনি বলেন, রাসূলুল্লাহ সাল্লাল্লাহু আলাইহি ওয়াসাল্লাম-কে আমি বলতে শুনেছিঃ “বারকতময় আল্লাহ তা’আলা বলেনঃ হে আদম সন্তান! যতক্ষণ আমাকে তুমি ডাকতে থাকবে এবং আমার কাছে (ক্ষমা পাওয়ার) আশায় থাকবে, তোমার গুনাহ যত অধিক হোক, তোমাকে আমি ক্ষমা করব, এতে কোন পরওয়া করব না। হে আদম সন্তান! তোমার গুনাহর পরিমাণ যদি আসমানের কিনারা বা মেঘমালা পর্যন্তও পৌছে যায়, তারপর তুমি আমার নিকট ক্ষমা প্রার্থনা কর, আমি তোমাকে ক্ষমা করে দেব, এতে আমি পরওয়া করব না। হে আদম সন্তান! তুমি যদি সম্পূর্ণ পৃথিবী পরিমাণ গুনাহ নিয়েও আমার নিকট আস এবং আমার সঙ্গে কাউকে অংশীদার না করে থাক, তাহলে তোমার কাছে আমিও পৃথিবী পূর্ণ ক্ষমা নিয়ে হাযির হব।",
  "attribution": {
   "en": "Narrated by At-Tirmidhi",
   "bn": "এটি তিরমিযী বর্ণনা করেছেন।",
   "ar": "رواه الترمذي"
  },
  "grade": {
   "en": "Hasan",
   "bn": "হাসান",
   "ar": "حسن"
  },
  "cls": "hasan",
  "source": {
   "en": "https://hadeethenc.com/en/browse/hadith/5456",
   "bn": "https://hadeethenc.com/bn/browse/hadith/5456"
  },
  "also": [],
  "flag": "grade",
  "note": null,
  "review": "source-checked"
 }
];
  return { SOURCE, COLLECTIONS, FLAGS, HADITH };
});
