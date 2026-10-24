# Face 7.1 study notes, surahs 95–114. Draft editorial notes written for the app (pending qualified review).
# Each entry: short, ov, flow [(a, b, en, bn)], concepts [(term_en, term_bn, text_en, text_bn, ref, src)],
# take (en list, bn list), example (en, bn). src: "q" = from the Qur'an's own wording; "t" = Al-Mukhtasar tafsir
# (the Bangla edition bundled in the app's reader), named as such in the app.
N = {}

N[95] = dict(
 short=("Human beings were made in the finest form; faith and good deeds keep them from falling low.",
        "মানুষকে সর্বোত্তম গঠনে সৃষ্টি করা হয়েছে; ঈমান ও সৎকাজ তাকে নিচে নেমে যাওয়া থেকে রক্ষা করে।"),
 ov=("At-Tin opens with four oaths — by the fig, the olive, Mount Sinai and “this land made safe” — and then makes one clear point: Allah created the human being in the best form, yet a person can sink to the lowest of the low. The way out is named plainly: believing and doing good. The surah closes by asking who could deny the Judgement when Allah is the most just of all judges.",
     "সূরা আত-তীন শুরু হয় চারটি শপথ দিয়ে — ডুমুর, জয়তুন, সিনাই পর্বত এবং “এই নিরাপদ নগরী”-র শপথ। তারপর একটি স্পষ্ট কথা বলা হয়: আল্লাহ মানুষকে সর্বোত্তম গঠনে সৃষ্টি করেছেন, তবু মানুষ সবচেয়ে নিচে নেমে যেতে পারে। মুক্তির পথও স্পষ্ট: ঈমান আনা ও সৎকাজ করা। শেষে প্রশ্ন রাখা হয়েছে — আল্লাহ যখন সবচেয়ে ন্যায়পরায়ণ বিচারক, তখন বিচার দিবসকে অস্বীকার করার কী কারণ থাকতে পারে?"),
 flow=[(1,3,"Four oaths: the fig, the olive, Mount Sinai and the land made safe","চারটি শপথ: ডুমুর, জয়তুন, সিনাই পর্বত ও নিরাপদ নগরী"),
       (4,6,"Created in the best form, able to fall low — except those who believe and do good","সর্বোত্তম গঠনে সৃষ্টি, নিচে নামার সম্ভাবনাও আছে — তবে ঈমানদার ও সৎকর্মশীলরা ছাড়া"),
       (7,8,"So why deny the Judgement? Allah is the most just of judges","তাহলে বিচার দিবস অস্বীকার কেন? আল্লাহই শ্রেষ্ঠ বিচারক")],
 concepts=[("Best stature","সর্বোত্তম গঠন","Human beings were given a fine form and real abilities. The surah treats this as a starting point, not a guarantee.","মানুষকে সুন্দর গঠন ও সক্ষমতা দেওয়া হয়েছে। সূরাটি একে শুরু হিসেবে দেখায়, নিশ্চয়তা হিসেবে নয়।","95:4","q"),
           ("The land made safe","নিরাপদ নগরী","Al-Mukhtasar explains this as Makkah.","আল-মুখতাসার একে মক্কা বলে ব্যাখ্যা করেছে।","95:3","t")],
 take=(["Our worth is a gift; what we do with it decides where we end up.","Faith and good deeds go together in the Qur'an's description of the people who are saved (95:6).","Trust that judgement rests with the One who is perfectly fair (95:8)."],
       ["আমাদের মর্যাদা একটি দান; এ দিয়ে কী করি, তা-ই ঠিক করে আমরা কোথায় পৌঁছাব।","যারা রক্ষা পায়, কুরআন তাদের বর্ণনায় ঈমান ও সৎকাজ একসঙ্গে উল্লেখ করেছে (৯৫:৬)।","বিচার সেই সত্তার হাতে, যিনি পূর্ণ ন্যায়পরায়ণ — এই আস্থা রাখা (৯৫:৮)।"]),
 example=("Someone is hired for a job they are well suited to. Talent gets them in the door, but whether they grow or drift depends on daily choices. The surah frames human life in a similar way: a fine beginning, and a direction we choose.",
          "কেউ এমন চাকরি পেল, যার জন্য সে খুবই উপযুক্ত। যোগ্যতা তাকে সুযোগ এনে দিয়েছে, কিন্তু সে উন্নতি করবে না পিছিয়ে পড়বে, তা নির্ভর করে প্রতিদিনের সিদ্ধান্তের ওপর। সূরাটি মানুষের জীবনকে অনেকটা এভাবেই তুলে ধরে: সুন্দর সূচনা, আর দিক বেছে নেওয়া আমাদের কাজ।"))

N[96] = dict(
 short=("“Read, in the name of your Lord”: knowledge as a gift, and the danger of feeling self-sufficient.",
        "“পড়ুন আপনার রবের নামে”: জ্ঞান একটি দান, আর নিজেকে স্বয়ংসম্পূর্ণ ভাবার বিপদ।"),
 ov=("Al-'Alaq begins with the command ‘Read’, in the name of the Lord who created the human being from a clinging clot and taught by the pen what people did not know. It then turns to a person who grows arrogant because he thinks he needs no one, and who tries to stop a servant of Allah from praying. It ends with a simple instruction: do not obey him; bow down and draw near.",
     "সূরা আল-আলাক শুরু হয় “পড়ুন” নির্দেশ দিয়ে — সেই রবের নামে, যিনি মানুষকে জমাট রক্তপিণ্ড থেকে সৃষ্টি করেছেন এবং কলমের মাধ্যমে মানুষকে এমন জ্ঞান দিয়েছেন যা সে জানত না। তারপর আলোচনা আসে এমন মানুষের দিকে, যে নিজেকে কারও মুখাপেক্ষী নয় ভেবে উদ্ধত হয় এবং আল্লাহর এক বান্দাকে নামাজ থেকে বাধা দেয়। শেষে সহজ নির্দেশ: তার আনুগত্য কোরো না; সিজদা করো এবং নিকটবর্তী হও।"),
 flow=[(1,5,"‘Read’: creation from a clot and teaching by the pen","“পড়ুন”: রক্তপিণ্ড থেকে সৃষ্টি ও কলমের মাধ্যমে শিক্ষা"),
       (6,8,"Arrogance from feeling self-sufficient; everyone returns to Allah","নিজেকে অমুখাপেক্ষী ভেবে ঔদ্ধত্য; সবাই আল্লাহর কাছেই ফিরবে"),
       (9,18,"The man who tries to stop a servant from praying, and a warning to him","যে লোক এক বান্দাকে নামাজে বাধা দেয়, এবং তার প্রতি সতর্কবার্তা"),
       (19,19,"Do not obey him: prostrate and draw near","তার আনুগত্য কোরো না: সিজদা করো ও নিকটবর্তী হও")],
 concepts=[("'Alaq","আলাক","Usually translated ‘clot’ or ‘clinging substance’: an early stage of the human being's creation, mentioned to show where we began.","সাধারণত ‘রক্তপিণ্ড’ বা ‘লেগে থাকা বস্তু’ অনুবাদ করা হয়: মানুষের সৃষ্টির একটি প্রাথমিক পর্যায়, যা আমাদের শুরুর কথা মনে করিয়ে দেয়।","96:2","q"),
           ("Taught by the pen","কলমের মাধ্যমে শিক্ষা","Writing and learning are named among Allah's gifts in the very first lines.","শুরুর আয়াতেই লেখা ও শেখাকে আল্লাহর দানের মধ্যে উল্লেখ করা হয়েছে।","96:4–5","q"),
           ("Drawing near through prostration","সিজদার মাধ্যমে নৈকট্য","The surah ends by pairing prostration with drawing near to Allah.","সূরাটি শেষ হয় সিজদাকে আল্লাহর নৈকট্যের সঙ্গে যুক্ত করে।","96:19","q")],
 take=(["Learning is part of worship when it begins “in the name of your Lord”.","Feeling that we need no one is described as a root of arrogance (96:6–7).","When others pressure us to drop prayer, the answer is to hold on and come closer (96:19)."],
       ["“আপনার রবের নামে” শুরু হলে শেখাও ইবাদতের অংশ।","নিজেকে কারও মুখাপেক্ষী নয় মনে করাকে ঔদ্ধত্যের মূল হিসেবে বর্ণনা করা হয়েছে (৯৬:৬–৭)।","কেউ নামাজ ছাড়তে চাপ দিলে উত্তর হলো আরও দৃঢ় হওয়া ও নিকটবর্তী হওয়া (৯৬:১৯)।"]),
 example=("A student who starts each study session with a short bismillah and a moment of intention is treating learning the way this surah opens: as something received, not just earned.",
          "যে শিক্ষার্থী প্রতিবার পড়তে বসার আগে বিসমিল্লাহ বলে এবং একটু নিয়ত ঠিক করে নেয়, সে শেখাকে এই সূরার শুরুর মতোই দেখে: শুধু অর্জন নয়, একটি পাওয়া দান।"))

N[97] = dict(
 short=("The Night of Power: the Qur'an's revelation and a night better than a thousand months.",
        "লাইলাতুল কদর: কুরআন নাজিলের রাত, যা হাজার মাসের চেয়েও উত্তম।"),
 ov=("Al-Qadr is a short surah about one night. Allah says He sent the Qur'an down on the Night of Power (Laylat al-Qadr), that this night is better than a thousand months, that the angels and the Spirit come down in it by their Lord's permission, and that it is peace until dawn.",
     "সূরা আল-কদর একটি রাত নিয়ে ছোট্ট সূরা। আল্লাহ বলেন, তিনি কুরআন নাজিল করেছেন কদরের রাতে (লাইলাতুল কদর); এই রাত হাজার মাসের চেয়ে উত্তম; এ রাতে ফেরেশতারা ও রূহ তাদের রবের অনুমতিক্রমে অবতরণ করে; আর ফজর পর্যন্ত তা শান্তিময়।"),
 flow=[(1,3,"The Qur'an sent down on the Night of Power, better than a thousand months","কদরের রাতে কুরআন নাজিল; রাতটি হাজার মাসের চেয়ে উত্তম"),
       (4,5,"Angels and the Spirit descend; peace until dawn","ফেরেশতা ও রূহের অবতরণ; ফজর পর্যন্ত শান্তি")],
 concepts=[("Laylat al-Qadr","লাইলাতুল কদর","“The Night of Power” (or “of Decree”). The surah itself names its worth; Al-Mukhtasar adds that it is in Ramadan, which agrees with 2:185 (the Qur'an was sent down in Ramadan).","‘মহিমান্বিত রাত’ বা ‘তাকদিরের রাত’। এর মর্যাদা সূরাটিই বলে দিয়েছে; আল-মুখতাসার যোগ করেছে যে এটি রমজানে, যা ২:১৮৫-এর সঙ্গে মিলে যায় (কুরআন রমজানে নাজিল হয়েছে)।","97:1–3","t"),
           ("The Spirit","রূহ","Mentioned beside the angels. Many commentators understand it as the angel Jibril; the surah itself does not explain further.","ফেরেশতাদের পাশে উল্লেখ করা হয়েছে। অনেক মুফাসসির একে জিবরাইল (আ.) বলে বুঝেছেন; সূরাটি নিজে এর বেশি ব্যাখ্যা দেয়নি।","97:4","t")],
 take=(["The Qur'an is introduced as so great that even the night it came down on is honoured.","A single night of worship can outweigh a lifetime of ordinary months (97:3).","Peace is part of how the Qur'an describes that night (97:5)."],
       ["কুরআন এতই মহান যে, যে রাতে তা নাজিল হয়েছে, সে রাতও সম্মানিত।","এক রাতের ইবাদত সারা জীবনের সাধারণ মাসের চেয়েও বেশি হতে পারে (৯৭:৩)।","কুরআন সেই রাতের বর্ণনায় শান্তির কথা বলেছে (৯৭:৫)।"]),
 example=("People plan carefully for a once-a-year opportunity — a big sale or an exam date. The surah invites the same seriousness for a night whose value is far greater.",
          "বছরে একবার আসা সুযোগের জন্য মানুষ কত পরিকল্পনা করে — বড় কোনো ছাড় বা পরীক্ষার দিন। সূরাটি এর চেয়েও অনেক মূল্যবান একটি রাতের জন্য একই রকম মনোযোগের আহ্বান জানায়।"))

N[98] = dict(
 short=("The clear proof: what true religion asks for, and the best and worst of creation.",
        "সুস্পষ্ট প্রমাণ: প্রকৃত দীন কী চায়, আর সৃষ্টির মধ্যে শ্রেষ্ঠ ও নিকৃষ্ট কারা।"),
 ov=("Al-Bayyinah speaks of “the clear proof”: a messenger from Allah reciting purified pages. It says people divided only after that proof came, and then sums up what they were asked to do: worship Allah sincerely, keep up prayer and give zakat — “that is true religion”. It ends by contrasting those who reject the truth with those who believe and do good, whose reward is gardens and Allah's pleasure.",
     "সূরা আল-বাইয়্যিনাহ “সুস্পষ্ট প্রমাণ”-এর কথা বলে: আল্লাহর পক্ষ থেকে এক রাসূল, যিনি পবিত্র সহিফা পাঠ করেন। প্রমাণ আসার পরই মানুষ বিভক্ত হয়েছে, আর তাদের প্রতি নির্দেশ ছিল সংক্ষিপ্ত: একনিষ্ঠভাবে আল্লাহর ইবাদত, নামাজ কায়েম ও জাকাত আদায় — “এটাই সঠিক দীন”। শেষে সত্য প্রত্যাখ্যানকারী এবং ঈমান এনে সৎকাজকারীদের তুলনা করা হয়েছে; পরের দলের প্রতিদান জান্নাত ও আল্লাহর সন্তুষ্টি।"),
 flow=[(1,3,"The clear proof: a messenger reciting purified pages","সুস্পষ্ট প্রমাণ: পবিত্র সহিফা পাঠকারী রাসূল"),
       (4,5,"Division came after the proof; the simple core of religion","প্রমাণের পরই বিভক্তি; দীনের সহজ মূল কথা"),
       (6,8,"The worst and the best of creation, and the reward of the believers","সৃষ্টির নিকৃষ্ট ও শ্রেষ্ঠ, এবং মুমিনদের প্রতিদান")],
 concepts=[("Hunafa' (upright)","হানিফ (একনিষ্ঠ)","People who turn sincerely to Allah alone, away from everything else.","যারা অন্য সব কিছু থেকে মুখ ফিরিয়ে একনিষ্ঠভাবে শুধু আল্লাহর দিকে ফেরে।","98:5","q"),
           ("Allah pleased with them, and they with Him","আল্লাহ তাদের প্রতি সন্তুষ্ট, তারাও তাঁর প্রতি","The surah describes the final reward as mutual contentment, not only a place.","সূরাটি চূড়ান্ত প্রতিদানকে শুধু একটি স্থান নয়, পারস্পরিক সন্তুষ্টি হিসেবে বর্ণনা করেছে।","98:8","q")],
 take=(["Religion at its core is short enough to remember: sincere worship, prayer, zakat (98:5).","Clear knowledge brings responsibility; division after knowledge is criticised (98:4).","Being “the best of creatures” is tied to faith and good deeds, not to lineage or status (98:7)."],
       ["দীনের মূল কথা মনে রাখার মতো সংক্ষিপ্ত: একনিষ্ঠ ইবাদত, নামাজ, জাকাত (৯৮:৫)।","স্পষ্ট জ্ঞান দায়িত্ব আনে; জ্ঞান আসার পর বিভক্ত হওয়াকে নিন্দা করা হয়েছে (৯৮:৪)।","“সৃষ্টির শ্ৰেষ্ঠ” হওয়া ঈমান ও সৎকাজের সঙ্গে যুক্ত, বংশ বা মর্যাদার সঙ্গে নয় (৯৮:৭)।"]),
 example=("When a team argues over side details and forgets the main goal, a good leader brings them back to the brief. Verse 5 does something similar for faith: it names the essentials.",
          "কোনো দল যখন খুঁটিনাটি নিয়ে তর্ক করে মূল লক্ষ্য ভুলে যায়, ভালো নেতা তাদের মূল নির্দেশনায় ফিরিয়ে আনেন। ৫ নম্বর আয়াত ঈমানের ক্ষেত্রে অনেকটা তা-ই করে: মৌলিক বিষয়গুলো স্পষ্ট করে।"))

N[99] = dict(
 short=("The earth will tell its news; even an atom's weight of good or evil will be seen.",
        "পৃথিবী তার খবর বলে দেবে; অণু পরিমাণ ভালো বা মন্দও দেখা যাবে।"),
 ov=("Az-Zalzalah describes the final earthquake. The earth throws out what it carries, people ask what is happening to it, and on that day the earth reports what happened on it, because Allah has inspired it to. People then come out in scattered groups to be shown their deeds, and the surah ends with two short verses: whoever does an atom's weight of good will see it, and whoever does an atom's weight of evil will see it.",
     "সূরা আজ-জিলজাল শেষ ভূমিকম্পের বর্ণনা দেয়। পৃথিবী তার ভেতরের বোঝা বের করে দেবে, মানুষ জিজ্ঞেস করবে এর কী হলো, আর সেদিন পৃথিবী তার ওপর ঘটে যাওয়া সব কিছুর খবর বলবে, কারণ আল্লাহ তাকে সেই নির্দেশ দেবেন। তারপর মানুষ দলে দলে বের হবে তাদের আমল দেখানোর জন্য। শেষ দুই আয়াত: কেউ অণু পরিমাণ ভালো করলে তা দেখবে, আর অণু পরিমাণ মন্দ করলে তা-ও দেখবে।"),
 flow=[(1,5,"The great earthquake; the earth tells its news","মহাভূমিকম্প; পৃথিবী তার খবর বলবে"),
       (6,8,"People shown their deeds; nothing is too small","মানুষকে তাদের আমল দেখানো হবে; কোনো কিছুই ছোট নয়")],
 concepts=[("An atom's weight","অণু পরিমাণ","The smallest imaginable amount. The point is that no good deed is wasted and no wrong is overlooked.","কল্পনাযোগ্য সবচেয়ে ক্ষুদ্র পরিমাণ। মূল কথা: কোনো ভালো কাজ বৃথা যায় না, কোনো অন্যায়ও উপেক্ষিত হয় না।","99:7–8","q"),
           ("The earth as a witness","সাক্ষী হিসেবে পৃথিবী","The ground we live on will “recount all its news” — what was done on it.","যে মাটিতে আমরা বাস করি, সে-ও তার ওপর ঘটে যাওয়া কাজের খবর দেবে।","99:4–5","q")],
 take=(["Small acts matter: a smile, a kind word, a coin given quietly.","Small wrongs matter too, so they are worth correcting now.","Everything we do happens somewhere, and that place will bear witness (99:4)."],
       ["ছোট কাজও গুরুত্বপূর্ণ: একটি হাসি, একটি ভালো কথা, চুপিসারে দেওয়া একটি পয়সা।","ছোট অন্যায়ও গুরুত্বপূর্ণ, তাই এখনই শুধরে নেওয়া উচিত।","আমরা যা করি, তা কোথাও না কোথাও ঘটে, আর সেই স্থান সাক্ষ্য দেবে (৯৯:৪)।"]),
 example=("A fitness tracker counts every step, not just long walks, and the total surprises people. The surah's final verses describe a far more complete record of good and bad.",
          "ফিটনেস ট্র্যাকার শুধু লম্বা হাঁটা নয়, প্রতিটি পদক্ষেপ গোনে, আর মোট সংখ্যা দেখে মানুষ অবাক হয়। সূরাটির শেষ আয়াত ভালো-মন্দের এর চেয়ে অনেক পূর্ণাঙ্গ হিসাবের কথা বলে।"))

N[100] = dict(
 short=("Charging horses, and a human being who is ungrateful and loves wealth intensely.",
        "ছুটন্ত ঘোড়া, আর অকৃতজ্ঞ ও সম্পদের প্রতি তীব্র আসক্ত মানুষ।"),
 ov=("Al-'Adiyat opens with a vivid picture of horses charging at dawn, panting, striking sparks and raising dust. Then it turns the camera on us: the human being is ungrateful to his Lord, is himself a witness to that, and loves wealth fiercely. It closes by reminding us that when graves are emptied and what is in hearts is brought out, our Lord will know us completely.",
     "সূরা আল-আদিয়াত শুরু হয় ভোরে ছুটে চলা ঘোড়ার জীবন্ত দৃশ্য দিয়ে — হাঁপাতে হাঁপাতে, ক্ষুরে স্ফুলিঙ্গ ছড়িয়ে, ধুলো উড়িয়ে। তারপর দৃষ্টি ফেরে আমাদের দিকে: মানুষ তার রবের প্রতি অকৃতজ্ঞ, সে নিজেই এর সাক্ষী, আর সম্পদের প্রতি তার ভালোবাসা তীব্র। শেষে মনে করানো হয়: কবর থেকে সব বের করা হবে, অন্তরের গোপন কথা প্রকাশ পাবে, আর সেদিন আমাদের রব আমাদের সম্পর্কে পূর্ণ অবগত।"),
 flow=[(1,5,"Oaths by charging horses at dawn","ভোরে ছুটন্ত ঘোড়ার শপথ"),
       (6,8,"Ingratitude, self-witness and love of wealth","অকৃতজ্ঞতা, নিজের সাক্ষ্য ও সম্পদপ্রীতি"),
       (9,11,"Graves opened, hearts revealed; Allah fully aware","কবর উন্মোচিত, অন্তর প্রকাশিত; আল্লাহ পূর্ণ অবগত")],
 concepts=[("Kanud (ungrateful)","কানূদ (অকৃতজ্ঞ)","Someone who counts problems and forgets blessings.","যে বিপদ গোনে কিন্তু নিয়ামত ভুলে যায়।","100:6","q"),
           ("What is in the breasts","অন্তরের গোপন কথা","Intentions and hidden motives, which will be made known.","নিয়ত ও লুকানো উদ্দেশ্য, যা প্রকাশ করা হবে।","100:10","q")],
 take=(["Gratitude is a choice we can practise, not just a feeling.","Love of wealth can quietly become intense; noticing it is the first step (100:8).","Our inner intentions are part of what will be weighed (100:10)."],
       ["কৃতজ্ঞতা শুধু অনুভূতি নয়, চর্চা করার মতো একটি অভ্যাস।","সম্পদের ভালোবাসা নীরবে তীব্র হয়ে উঠতে পারে; তা খেয়াল করাই প্রথম পদক্ষেপ (১০০:৮)।","অন্তরের নিয়তও হিসাবের অংশ (১০০:১০)।"]),
 example=("A loyal horse runs flat out for its owner who feeds it. The surah sets that loyalty beside a person who receives far more from Allah and still complains. Keeping a short list of blessings at the end of the day is one practical answer.",
          "অনুগত ঘোড়া তার খাবার দেওয়া মালিকের জন্য প্রাণপণে ছোটে। সূরাটি এই আনুগত্যের পাশে এমন মানুষকে রাখে, যে আল্লাহর কাছ থেকে অনেক বেশি পেয়েও অভিযোগ করে। দিনের শেষে নিয়ামতের ছোট একটি তালিকা লেখা এর একটি বাস্তব উত্তর।"))

N[101] = dict(
 short=("The Striking Hour: people like scattered moths, and the weighing of deeds.",
        "মহাপ্রলয়: বিক্ষিপ্ত পতঙ্গের মতো মানুষ, আর আমলের পরিমাপ।"),
 ov=("Al-Qari'ah names the Day of Judgement “the Calamity” (the Striking Hour) and asks three times what it is, to make us pause. People will be like scattered moths and mountains like fluffed-up wool. Then the scales: whoever's good deeds are heavy will have a pleasing life; whoever's are light will have the blazing Fire as their home.",
     "সূরা আল-কারিআহ কিয়ামতকে “ভীতিপ্ৰদ মহা বিপদ” (আঘাতকারী মুহূর্ত) নামে ডাকে এবং তিনবার প্রশ্ন করে এটি কী, যাতে আমরা থেমে ভাবি। মানুষ হবে বিক্ষিপ্ত পতঙ্গের মতো, আর পাহাড় হবে ধুনা পশমের মতো। তারপর পাল্লা: যার নেক আমল ভারী হবে, সে সুখের জীবন পাবে; যার হালকা হবে, তার ঠিকানা জ্বলন্ত আগুন।"),
 flow=[(1,3,"“The Striking Calamity! What is the Striking Calamity?”","“ভীতিপ্ৰদ মহা বিপদ, ভীতিপ্ৰদ মহা বিপদ কী?”"),
       (4,5,"People like moths, mountains like wool","মানুষ পতঙ্গের মতো, পাহাড় পশমের মতো"),
       (6,11,"Heavy scales and light scales","ভারী পাল্লা ও হালকা পাল্লা")],
 concepts=[("Al-Qari'ah","আল-কারিআহ","From a root meaning ‘to strike or knock’: a name for the Day of Judgement that conveys its suddenness.","‘আঘাত করা’ অর্থের মূল থেকে: কিয়ামতের একটি নাম, যা এর আকস্মিকতা বোঝায়।","101:1","q"),
           ("The scales","পাল্লা","Deeds are weighed; the image is of real, fair measurement.","আমল ওজন করা হবে; ছবিটি প্রকৃত ও ন্যায্য পরিমাপের।","101:6–9","q")],
 take=(["The Qur'an uses questions to wake us up, not only to inform us.","On that day all the things that once seemed solid — even mountains — will not hold (101:5).","What will count is the weight of our deeds."],
       ["কুরআন প্রশ্নের মাধ্যমে শুধু জানায় না, জাগিয়েও তোলে।","সেদিন যা একসময় দৃঢ় মনে হতো — এমনকি পাহাড়ও — টিকবে না (১০১:৫)।","শেষ পর্যন্ত গুরুত্বপূর্ণ হবে আমলের ওজন।"]),
 example=("At the airport, bags are weighed before boarding; what you packed matters more than how the case looks. The surah's image of the scales asks what we are packing now.",
          "বিমানবন্দরে ওঠার আগে ব্যাগ ওজন করা হয়; ব্যাগ দেখতে কেমন, তার চেয়ে ভেতরে কী আছে, সেটাই আসল। সূরার পাল্লার ছবি জিজ্ঞেস করে, আমরা এখন কী গুছিয়ে নিচ্ছি।"))

N[102] = dict(
 short=("Competing for more distracts us until the grave; we will be asked about every pleasure.",
        "বেশি পাওয়ার প্রতিযোগিতা কবর পর্যন্ত ভুলিয়ে রাখে; প্রতিটি নিয়ামত সম্পর্কে প্রশ্ন করা হবে।"),
 ov=("At-Takathur warns that rivalry in piling up more — money, followers, status — keeps people busy until they reach their graves. Twice it says “you will come to know”, then says that if people knew with certainty they would see the Fire, and it ends: on that day you will be asked about the pleasures you enjoyed.",
     "সূরা আত-তাকাসুর সতর্ক করে: বেশি জমানোর প্রতিযোগিতা — অর্থ, অনুসারী, মর্যাদা — মানুষকে কবরে পৌঁছানো পর্যন্ত ব্যস্ত রাখে। দুবার বলা হয়েছে “তোমরা শীঘ্রই জানতে পারবে”; তারপর বলা হয়েছে, নিশ্চিত জ্ঞান থাকলে তারা জাহান্নাম দেখত; আর শেষে: সেদিন তোমাদের ভোগ করা নিয়ামত সম্পর্কে জিজ্ঞাসা করা হবে।"),
 flow=[(1,2,"Rivalry in increase, until the graves","বাড়ানোর প্রতিযোগিতা, কবর পর্যন্ত"),
       (3,7,"“You will come to know” — certainty and sight","“তোমরা শীঘ্রই জানতে পারবে” — নিশ্চিত জ্ঞান ও দৃষ্টি"),
       (8,8,"Asked about the pleasures","নিয়ামত সম্পর্কে জিজ্ঞাসা")],
 concepts=[("Takathur","তাকাসুর","Competing to have more than others. The surah does not condemn having things; it criticises the distraction.","অন্যদের চেয়ে বেশি পাওয়ার প্রতিযোগিতা। সূরাটি কিছু থাকাকে নিন্দা করে না; নিন্দা করে এর ফলে আসা গাফিলতিকে।","102:1","q"),
           ("Na'im (pleasures)","নাঈম (নিয়ামত)","Every comfort we enjoy is something we will be asked about.","আমরা যে আরাম ভোগ করি, তার প্রতিটি সম্পর্কে প্রশ্ন করা হবে।","102:8","q")],
 take=(["Comparing ourselves with others can quietly take over a lifetime.","Certainty about the Hereafter changes priorities (102:5).","Comforts are blessings to be used well, not just enjoyed (102:8)."],
       ["অন্যের সঙ্গে নিজেকে তুলনা নীরবে পুরো জীবন দখল করে নিতে পারে।","আখিরাত সম্পর্কে নিশ্চিত জ্ঞান অগ্রাধিকার বদলে দেয় (১০২:৫)।","আরাম-আয়েশ নিয়ামত; শুধু উপভোগ নয়, ভালোভাবে ব্যবহারের জন্য (১০২:৮)।"]),
 example=("Scrolling through other people's holidays, cars and promotions can leave us wanting more, hour after hour. The surah names that pull and asks us to look up from it.",
          "অন্যদের ছুটি, গাড়ি আর পদোন্নতির ছবি দেখতে দেখতে ঘণ্টার পর ঘণ্টা আরও কিছু পাওয়ার ইচ্ছা জাগে। সূরাটি সেই টানকে চিহ্নিত করে এবং তা থেকে চোখ তুলে তাকাতে বলে।"))

N[103] = dict(
 short=("By time: people are in loss, except four qualities that save them.",
        "সময়ের শপথ: মানুষ ক্ষতিতে আছে, চারটি গুণ ছাড়া।"),
 ov=("Al-'Asr is only three verses long. It swears by time, says that human beings are in loss, and names the exception: those who believe, do good deeds, urge one another to the truth, and urge one another to patience. Two of these are personal and two are shared, so the surah describes a person and a community at the same time.",
     "সূরা আল-আসর মাত্র তিন আয়াতের। এতে সময়ের শপথ করে বলা হয়েছে, মানুষ ক্ষতির মধ্যে আছে; ব্যতিক্রম তারা, যারা ঈমান আনে, সৎকাজ করে, পরস্পরকে সত্যের উপদেশ দেয় এবং পরস্পরকে ধৈর্যের উপদেশ দেয়। এর দুটি ব্যক্তিগত আর দুটি সম্মিলিত — তাই সূরাটি একসঙ্গে একজন মানুষ ও একটি সমাজের ছবি আঁকে।"),
 flow=[(1,2,"By time, people are in loss","সময়ের শপথ, মানুষ ক্ষতিতে"),
       (3,3,"Except: faith, good deeds, urging truth, urging patience","ব্যতিক্রম: ঈমান, সৎকাজ, সত্যের উপদেশ, ধৈর্যের উপদেশ")],
 concepts=[("Al-'Asr","আল-আসর","Time, or the declining part of the day. Time passing is the setting for the whole message.","সময়, বা দিনের শেষভাগ। সময়ের বয়ে চলা পুরো বার্তার পটভূমি।","103:1","q"),
           ("Tawasi (urging one another)","তাওয়াসি (পরস্পরকে উপদেশ)","Mutual encouragement: both giving and receiving reminders.","পারস্পরিক উৎসাহ: উপদেশ দেওয়া ও গ্রহণ করা দুটোই।","103:3","q")],
 take=(["Time is always passing; the question is what we fill it with.","Faith is meant to show in action.","We are not meant to stay on track alone: truth and patience are shared work."],
       ["সময় সবসময় বয়ে যাচ্ছে; প্রশ্ন হলো তা দিয়ে কী পূরণ করছি।","ঈমান কাজের মধ্যে প্রকাশ পাওয়ার কথা।","একা ঠিক পথে থাকার কথা নয়: সত্য ও ধৈর্য সম্মিলিত দায়িত্ব।"]),
 example=("A study group where friends keep each other honest and calm before exams fits the last verse well: each person works, and they also hold each other up.",
          "যে পড়ার দলে বন্ধুরা পরীক্ষার আগে একে অপরকে সৎ ও শান্ত রাখে, তা শেষ আয়াতের সঙ্গে ভালো মেলে: প্রত্যেকে নিজে কাজ করে, আবার একে অপরকে সামলেও রাখে।"))

N[104] = dict(
 short=("Woe to the backbiter who hoards wealth and thinks it will make him last forever.",
        "দুর্ভোগ সেই নিন্দুকের, যে সম্পদ জমায় আর ভাবে সম্পদ তাকে চিরস্থায়ী করবে।"),
 ov=("Al-Humazah warns the person who mocks and finds fault with others, who collects wealth and counts it, thinking it will make him live forever. The surah answers that he will be thrown into al-Hutamah, ‘the Crusher’, the kindled fire of Allah that reaches the hearts.",
     "সূরা আল-হুমাজাহ সেই ব্যক্তিকে সতর্ক করে, যে অন্যকে উপহাস করে ও দোষ খোঁজে, সম্পদ জমায় ও গুনে রাখে, আর ভাবে এই সম্পদ তাকে চিরকাল বাঁচিয়ে রাখবে। সূরাটি উত্তর দেয়: তাকে নিক্ষেপ করা হবে আল-হুতামায়, ‘চূর্ণকারী’ — আল্লাহর প্রজ্বলিত আগুন, যা অন্তর পর্যন্ত পৌঁছায়।"),
 flow=[(1,3,"The fault-finder who hoards wealth","দোষ অন্বেষণকারী সম্পদ সঞ্চয়কারী"),
       (4,9,"Al-Hutamah: the fire that reaches the hearts","আল-হুতামাহ: অন্তর পর্যন্ত পৌঁছানো আগুন")],
 concepts=[("Humazah, lumazah","হুমাজাহ, লুমাজাহ","Two words for hurting people with words and looks: mocking, backbiting, putting others down.","কথা ও চাহনিতে মানুষকে কষ্ট দেওয়ার দুটি শব্দ: উপহাস, পরনিন্দা, অন্যকে ছোট করা।","104:1","q"),
           ("Al-Hutamah","আল-হুতামাহ","A name of the Fire meaning ‘that which crushes’.","জাহান্নামের একটি নাম, যার অর্থ ‘যা চূর্ণ করে’।","104:4–6","q")],
 take=(["Mocking people is not a small thing in the Qur'an.","Wealth cannot buy permanence (104:3).","Contempt for others and attachment to money often go together."],
       ["কুরআনে মানুষকে উপহাস করা কোনো ছোট বিষয় নয়।","সম্পদ দিয়ে চিরস্থায়িত্ব কেনা যায় না (১০৪:৩)।","অন্যকে তুচ্ছ করা আর অর্থের প্রতি আসক্তি প্রায়ই একসঙ্গে থাকে।"]),
 example=("A group chat that turns into a place for making fun of a classmate is the kind of habit this surah warns about. Leaving or changing the conversation is a small, real response.",
          "যে গ্রুপ চ্যাট কোনো সহপাঠীকে নিয়ে হাসাহাসির জায়গা হয়ে যায়, সেটি এমন অভ্যাস, যার বিরুদ্ধে সূরাটি সতর্ক করে। আলোচনা থেকে বেরিয়ে আসা বা প্রসঙ্গ বদলে দেওয়া একটি ছোট কিন্তু বাস্তব প্রতিক্রিয়া।"))

N[105] = dict(
 short=("The people of the Elephant: a powerful army whose plan Allah brought to nothing.",
        "হস্তী বাহিনী: এক শক্তিশালী বাহিনী, যাদের পরিকল্পনা আল্লাহ ব্যর্থ করে দেন।"),
 ov=("Al-Fil asks, “Have you not seen how your Lord dealt with the people of the Elephant?” It says Allah brought their plot to nothing, sent flocks of birds against them that pelted them with stones of baked clay, and left them like chewed-up straw. The surah itself does not name the army; Al-Mukhtasar explains that it was Abraha and his army, who wanted to destroy the Ka'bah.",
     "সূরা আল-ফীল প্রশ্ন করে, “আপনি কি দেখেন নি আপনার রব হাতির অধিপতিদের প্রতি কী করেছিলেন?” আল্লাহ তাদের ষড়যন্ত্র ব্যর্থ করেছেন, তাদের বিরুদ্ধে ঝাঁকে ঝাঁকে পাখি পাঠিয়েছেন, যারা পোড়া মাটির পাথর ছুড়েছে, আর তাদের চিবানো খড়ের মতো করে দিয়েছেন। সূরাটি নিজে বাহিনীর নাম বলেনি; আল-মুখতাসার ব্যাখ্যা করে যে এটি ছিল আবরাহা ও তার বাহিনী, যারা কাবাঘর ধ্বংস করতে চেয়েছিল।"),
 flow=[(1,2,"“Have you not seen…?” — their plot brought to nothing","“আপনি কি দেখেন নি…?” — তাদের ষড়যন্ত্র ব্যর্থ"),
       (3,5,"Birds, stones of baked clay, and the end of the army","পাখি, পোড়া মাটির পাথর, আর বাহিনীর পরিণতি")],
 concepts=[("Ashab al-Fil","আসহাবুল ফীল","“The people of the Elephant”. Identified in Al-Mukhtasar as Abraha's army, which set out to destroy the Ka'bah.","‘হাতির অধিপতিরা’। আল-মুখতাসার একে আবরাহার বাহিনী বলে চিহ্নিত করেছে, যারা কাবা ধ্বংস করতে বেরিয়েছিল।","105:1","t"),
           ("Sijjil","সিজ্জীল","Usually translated “baked clay”: the stones the birds threw.","সাধারণত “পোড়া মাটি” অনুবাদ করা হয়: পাখিরা যে পাথর ছুড়েছিল।","105:4","q")],
 take=(["Power and numbers do not decide outcomes; Allah does.","Allah protects what He wills, in ways no one expects.","Remembering past help builds trust for the future."],
       ["শক্তি ও সংখ্যা ফলাফল নির্ধারণ করে না; আল্লাহ করেন।","আল্লাহ যা চান, তা এমনভাবে রক্ষা করেন, যা কেউ কল্পনাও করে না।","অতীতের সাহায্য মনে রাখলে ভবিষ্যতের প্রতি আস্থা বাড়ে।"]),
 example=("A small family business faces a much bigger competitor and fears the worst. The story is not a promise that the small side always wins, but it does remind believers that size is not the final word.",
          "একটি ছোট পারিবারিক ব্যবসা অনেক বড় প্রতিদ্বন্দ্বীর মুখে পড়ে খারাপের আশঙ্কা করছে। ঘটনাটি এমন প্রতিশ্রুতি নয় যে ছোটরা সবসময় জেতে, কিন্তু মনে করিয়ে দেয় যে আকারই শেষ কথা নয়।"))

N[106] = dict(
 short=("Quraysh were given safe journeys, food and security, so let them worship the Lord of this House.",
        "কুরাইশকে নিরাপদ যাত্রা, খাদ্য ও নিরাপত্তা দেওয়া হয়েছে, তাই তারা এই ঘরের রবের ইবাদত করুক।"),
 ov=("Quraysh reminds the tribe of Quraysh of two blessings they were used to: their regular winter and summer trading journeys, and the safety and food they enjoyed. The conclusion follows naturally: worship the Lord of this House, who fed them against hunger and made them safe from fear.",
     "সূরা কুরাইশ কুরাইশ গোত্রকে দুটি অভ্যস্ত নিয়ামতের কথা মনে করায়: শীত ও গ্রীষ্মের নিয়মিত বাণিজ্য যাত্রা, এবং তাদের নিরাপত্তা ও খাদ্য। উপসংহার স্বাভাবিক: এই ঘরের রবের ইবাদত করো, যিনি ক্ষুধায় তাদের খাবার দিয়েছেন এবং ভয় থেকে নিরাপদ রেখেছেন।"),
 flow=[(1,2,"The familiar winter and summer journeys","শীত ও গ্রীষ্মের পরিচিত যাত্রা"),
       (3,4,"So worship the Lord of this House, who gave food and safety","তাই এই ঘরের রবের ইবাদত করো, যিনি খাদ্য ও নিরাপত্তা দিয়েছেন")],
 concepts=[("This House","এই ঘর","The Ka'bah in Makkah.","মক্কার কাবাঘর।","106:3","t"),
           ("Food and safety","খাদ্য ও নিরাপত্তা","Two basic needs that the surah presents as gifts from Allah, not things to take for granted.","দুটি মৌলিক প্রয়োজন, যা সূরাটি আল্লাহর দান হিসেবে তুলে ধরে, স্বাভাবিক পাওনা হিসেবে নয়।","106:4","q")],
 take=(["Routine blessings are still blessings.","Gratitude is meant to lead to worship (106:3).","Food and safety are named as reasons to turn to Allah."],
       ["নিয়মিত নিয়ামতও নিয়ামত।","কৃতজ্ঞতা ইবাদতের দিকে নিয়ে যাওয়ার কথা (১০৬:৩)।","খাদ্য ও নিরাপত্তাকে আল্লাহর দিকে ফেরার কারণ হিসেবে উল্লেখ করা হয়েছে।"]),
 example=("A full fridge and a safe walk home can feel ordinary until a power cut or a frightening news story. The surah asks us to notice them before we lose them.",
          "ভরা ফ্রিজ আর নিরাপদে ঘরে ফেরা স্বাভাবিক মনে হয় — যতক্ষণ না বিদ্যুৎ চলে যায় বা ভয়ের কোনো খবর আসে। সূরাটি হারানোর আগেই এগুলো খেয়াল করতে বলে।"))

N[107] = dict(
 short=("Faith shows in small kindness: caring for orphans, feeding the poor, praying sincerely.",
        "ঈমান প্রকাশ পায় ছোট দয়ায়: এতিমের যত্ন, দরিদ্রকে খাওয়ানো, আন্তরিক নামাজ।"),
 ov=("Al-Ma'un asks who it is that denies the Judgement, and answers with behaviour: the one who pushes the orphan away and does not encourage feeding the poor. It then warns those who pray but are heedless of their prayer, who pray to be seen, and who hold back even small help (al-ma'un).",
     "সূরা আল-মাউন প্রশ্ন করে, বিচার দিবস অস্বীকারকারী কে, আর উত্তর দেয় আচরণ দিয়ে: যে এতিমকে তাড়িয়ে দেয় এবং দরিদ্রকে খাওয়াতে উৎসাহ দেয় না। তারপর সতর্ক করে সেই নামাজিদের, যারা নামাজে উদাসীন, যারা লোক দেখাতে নামাজ পড়ে, আর যারা ছোটখাটো সাহায্যও (আল-মাউন) আটকে রাখে।"),
 flow=[(1,3,"Denial seen in pushing away orphans and ignoring the poor","এতিমকে তাড়ানো ও দরিদ্রকে উপেক্ষার মধ্যে অস্বীকার"),
       (4,7,"Heedless prayer, showing off, and refusing small help","উদাসীন নামাজ, লোক দেখানো, আর ছোট সাহায্যে অস্বীকৃতি")],
 concepts=[("Al-Ma'un","আল-মাউন","Small everyday help — the kind of thing neighbours lend each other.","ছোট দৈনন্দিন সাহায্য — প্রতিবেশীরা একে অপরকে যা ধার দেয়।","107:7","q"),
           ("Heedless of prayer","নামাজে উদাসীন","Praying without care for it; the surah does not condemn praying, it condemns carelessness and showing off.","যত্ন ছাড়া নামাজ পড়া; সূরাটি নামাজকে নয়, উদাসীনতা ও লোক দেখানোকে নিন্দা করে।","107:5–6","q")],
 take=(["Belief in the Hereafter should show in how we treat vulnerable people.","Prayer and kindness belong together.","Even small help matters: refusing it is criticised (107:7)."],
       ["আখিরাতে বিশ্বাস অসহায় মানুষের সঙ্গে আচরণে প্রকাশ পাওয়া উচিত।","নামাজ ও দয়া একসঙ্গে চলে।","ছোট সাহায্যও গুরুত্বপূর্ণ: তা থেকে বিরত থাকাকে নিন্দা করা হয়েছে (১০৭:৭)।"]),
 example=("Lending a neighbour a ladder, sharing a phone charger, or dropping off a meal when someone is ill are exactly the kind of small help the last verse has in view.",
          "প্রতিবেশীকে মই ধার দেওয়া, ফোনের চার্জার ভাগ করা, বা কেউ অসুস্থ হলে খাবার পৌঁছে দেওয়া — শেষ আয়াত ঠিক এ ধরনের ছোট সাহায্যের কথা বলে।"))

N[108] = dict(
 short=("Allah gave the Prophet abundance (al-Kawthar), so pray and sacrifice; his enemy is the one cut off.",
        "আল্লাহ নবীকে প্রাচুর্য (আল-কাওসার) দিয়েছেন, তাই নামাজ পড়ো ও কুরবানি করো; তাঁর শত্রুই নির্বংশ।"),
 ov=("Al-Kawthar is the shortest surah in the Qur'an. Allah tells the Prophet ﷺ that He has given him al-Kawthar, abundant good, so he should pray to his Lord and sacrifice. The last verse turns an insult around: it is the one who hates him who is cut off. Al-Mukhtasar explains that the abundant good includes the river or pond of al-Kawthar in Paradise.",
     "সূরা আল-কাওসার কুরআনের সবচেয়ে ছোট সূরা। আল্লাহ নবী ﷺ-কে বলেন, তিনি তাঁকে আল-কাওসার — প্রচুর কল্যাণ — দিয়েছেন; তাই তিনি তাঁর রবের জন্য নামাজ পড়ুন ও কুরবানি করুন। শেষ আয়াত অপমানকে উল্টে দেয়: তাঁর প্রতি বিদ্বেষ পোষণকারীই নির্বংশ। আল-মুখতাসার ব্যাখ্যা করে, এই প্রচুর কল্যাণের মধ্যে জান্নাতের হাউজে কাউসারও রয়েছে।"),
 flow=[(1,1,"Allah gave abundant good","আল্লাহ প্রচুর কল্যাণ দিয়েছেন"),
       (2,2,"So pray and sacrifice","তাই নামাজ পড়ো ও কুরবানি করো"),
       (3,3,"The one who hates you is the one cut off","তোমার বিদ্বেষী-ই নির্বংশ")],
 concepts=[("Al-Kawthar","আল-কাওসার","Abundant good. Al-Mukhtasar explains that it includes the pond of al-Kawthar in Paradise.","প্রচুর কল্যাণ। আল-মুখতাসার বলে, এর মধ্যে জান্নাতের হাউজে কাউসারও রয়েছে।","108:1","t"),
           ("Al-abtar","আল-আবতার","“Cut off” — without lasting good or remembrance.","“বিচ্ছিন্ন” — যার কোনো স্থায়ী কল্যাণ বা সুনাম নেই।","108:3","q")],
 take=(["Blessings call for a response: prayer and sacrifice (108:2).","Allah comforts those who are mocked.","Lasting value is measured by Allah, not by people's insults."],
       ["নিয়ামতের জবাবে কিছু করার আছে: নামাজ ও কুরবানি (১০৮:২)।","যাদের উপহাস করা হয়, আল্লাহ তাদের সান্ত্বনা দেন।","স্থায়ী মূল্য আল্লাহ নির্ধারণ করেন, মানুষের কটূক্তি নয়।"]),
 example=("Someone hears a hurtful comment about their family or future. This short surah models a calm answer: turn to prayer and generosity, and leave the final judgement of who ‘wins’ to Allah.",
          "কেউ তার পরিবার বা ভবিষ্যৎ নিয়ে আঘাতমূলক কথা শুনল। এই ছোট সূরা একটি শান্ত উত্তরের নমুনা দেয়: নামাজ ও উদারতার দিকে ফিরে যাওয়া, আর কে ‘জিতল’ সেই চূড়ান্ত বিচার আল্লাহর ওপর ছেড়ে দেওয়া।"))

N[109] = dict(
 short=("A clear line in worship: “You have your religion and I have my religion.”",
        "ইবাদতে স্পষ্ট সীমারেখা: “তোমাদের দীন তোমাদের, আর আমার দ্বীন আমার”"),
 ov=("Al-Kafirun is a declaration the Prophet ﷺ is told to make: he does not worship what they worship, and they do not worship what he worships. The repetition makes the point unmistakable, and the surah ends: “You have your religion and I have my religion.” It draws a firm line in worship without needing insults or force.",
     "সূরা আল-কাফিরুন একটি ঘোষণা, যা নবী ﷺ-কে করতে বলা হয়েছে: তারা যার ইবাদত করে, তিনি তার ইবাদত করেন না; আর তিনি যাঁর ইবাদত করেন, তারা তাঁর ইবাদত করে না। পুনরাবৃত্তি বিষয়টিকে স্পষ্ট করে, আর শেষে: “তোমাদের দীন তোমাদের, আর আমার দ্বীন আমার” এটি অপমান বা জোর ছাড়াই ইবাদতে দৃঢ় সীমারেখা টানে।"),
 flow=[(1,5,"I do not worship what you worship, nor do you worship what I worship","তোমরা যার ইবাদত করো আমি তার ইবাদত করি না, আমি যাঁর ইবাদত করি তোমরাও তাঁর করো না"),
       (6,6,"To you your religion, and to me mine","তোমাদের দীন তোমাদের, আমার দীন আমার")],
 concepts=[("Clarity in worship","ইবাদতে স্পষ্টতা","Worship is not something to blend or trade; the surah keeps it for Allah alone.","ইবাদত মিশিয়ে ফেলা বা আপস করার বিষয় নয়; সূরাটি তা শুধু আল্লাহর জন্য রাখে।","109:2–5","q")],
 take=(["Being clear about one's faith does not require being harsh.","Some things are not open to compromise, and worship is one of them.","Living alongside people of other beliefs starts with honesty about differences (109:6)."],
       ["নিজের বিশ্বাস সম্পর্কে স্পষ্ট হতে কঠোর হওয়ার দরকার নেই।","কিছু বিষয়ে আপস চলে না, ইবাদত তার একটি।","ভিন্ন বিশ্বাসের মানুষের সঙ্গে বসবাস শুরু হয় পার্থক্য সম্পর্কে সততা দিয়ে (১০৯:৬)।"]),
 example=("A colleague invites everyone to a ritual of another faith. A polite, clear ‘thank you, but that's not part of my worship’ — while staying friendly at work — reflects the spirit of this surah.",
          "এক সহকর্মী সবাইকে অন্য ধর্মের একটি আচারে আমন্ত্রণ জানাল। কর্মক্ষেত্রে বন্ধুত্বপূর্ণ থেকেও ভদ্রভাবে স্পষ্ট বলা — ‘ধন্যবাদ, তবে এটি আমার ইবাদতের অংশ নয়’ — এই সূরার মর্মের সঙ্গে মেলে।"))

N[110] = dict(
 short=("When help and victory come: praise Allah and ask His forgiveness.",
        "যখন সাহায্য ও বিজয় আসে: আল্লাহর প্রশংসা করো ও ক্ষমা চাও।"),
 ov=("An-Nasr says that when Allah's help and the victory come, and people are seen entering Allah's religion in crowds, the response should be to glorify and praise Allah and to ask His forgiveness, for He accepts repentance. Success is met with humility, not pride. Al-Mukhtasar explains the victory as the conquest of Makkah.",
     "সূরা আন-নাসর বলে: যখন আল্লাহর সাহায্য ও বিজয় আসবে এবং দেখা যাবে মানুষ দলে দলে আল্লাহর দীনে প্রবেশ করছে, তখন করণীয় হলো আল্লাহর পবিত্রতা ও প্রশংসা ঘোষণা করা এবং তাঁর কাছে ক্ষমা চাওয়া; নিশ্চয়ই তিনি তাওবা কবুলকারী। সাফল্যের জবাব অহংকার নয়, বিনয়। আল-মুখতাসার এই বিজয়কে মক্কা বিজয় বলে ব্যাখ্যা করেছে।"),
 flow=[(1,2,"Help, victory, and people entering the religion in crowds","সাহায্য, বিজয়, আর দলে দলে দীনে প্রবেশ"),
       (3,3,"Glorify, praise, and seek forgiveness","পবিত্রতা ঘোষণা, প্রশংসা ও ক্ষমা প্রার্থনা")],
 concepts=[("The victory","বিজয়","Al-Mukhtasar explains it as the conquest of Makkah.","আল-মুখতাসার একে মক্কা বিজয় বলে ব্যাখ্যা করেছে।","110:1","t"),
           ("Istighfar at a high point","সাফল্যের মুহূর্তে ইস্তিগফার","Asking forgiveness is taught even at a moment of success.","সাফল্যের মুহূর্তেও ক্ষমা চাওয়ার শিক্ষা দেওয়া হয়েছে।","110:3","q")],
 take=(["Success is a gift from Allah, so it is answered with praise.","Asking forgiveness belongs to good times as well as bad.","Humility keeps achievement from turning into arrogance."],
       ["সাফল্য আল্লাহর দান, তাই এর জবাব প্রশংসা।","ক্ষমা চাওয়া শুধু খারাপ সময়ের জন্য নয়, ভালো সময়েরও।","বিনয় অর্জনকে অহংকারে পরিণত হতে দেয় না।"]),
 example=("After a promotion or a graduation, many people celebrate loudly. Pausing to thank Allah and ask forgiveness for one's shortcomings along the way follows the order this surah teaches.",
          "পদোন্নতি বা স্নাতক হওয়ার পর অনেকে জোরেশোরে উদযাপন করে। থেমে আল্লাহকে ধন্যবাদ দেওয়া এবং পথে হওয়া ভুলের জন্য ক্ষমা চাওয়া — এই সূরা এই ক্রমই শেখায়।"))

N[111] = dict(
 short=("Abu Lahab's opposition fails: wealth and status do not save a person.",
        "আবু লাহাবের বিরোধিতা ব্যর্থ: সম্পদ ও মর্যাদা মানুষকে রক্ষা করে না।"),
 ov=("Al-Masad (also called al-Lahab) names one opponent of the Prophet ﷺ, Abu Lahab, and says his efforts will come to ruin, that his wealth and what he earned will not help him, and that he will enter a blazing fire. His wife, “the carrier of firewood”, is mentioned with a rope of palm fibre around her neck. Al-Mukhtasar explains that Abu Lahab was the Prophet's uncle who harmed him.",
     "সূরা আল-মাসাদ (একে আল-লাহাবও বলা হয়) নবী ﷺ-এর এক বিরোধী আবু লাহাবের নাম উল্লেখ করে বলে: তার প্রচেষ্টা ধ্বংস হবে, তার সম্পদ ও উপার্জন তার কাজে আসবে না, আর সে জ্বলন্ত আগুনে প্রবেশ করবে। তার স্ত্রী, “যে ইন্ধন বহন করে”-র কথাও এসেছে, যার গলায় খেজুর আঁশের রশি। আল-মুখতাসার বলে, আবু লাহাব ছিল নবীর চাচা, যে তাঁকে কষ্ট দিত।"),
 flow=[(1,3,"Abu Lahab's efforts and wealth come to nothing","আবু লাহাবের প্রচেষ্টা ও সম্পদ নিষ্ফল"),
       (4,5,"His wife, the carrier of firewood","তার স্ত্রী, কাঠ বহনকারিণী")],
 concepts=[("Abu Lahab","আবু লাহাব","Named in the surah. Al-Mukhtasar identifies him as the Prophet's uncle.","সূরায় নাম উল্লেখ আছে। আল-মুখতাসার তাকে নবীর চাচা বলে চিহ্নিত করেছে।","111:1","t"),
           ("Masad","মাসাদ","Palm fibre, twisted into rope.","খেজুর গাছের আঁশ, যা পাকিয়ে রশি বানানো হয়।","111:5","q")],
 take=(["Family ties to a prophet did not save someone who opposed the truth.","Wealth and earnings cannot protect against Allah's judgement (111:2).","Opposing good brings harm to the one who does it."],
       ["নবীর আত্মীয় হওয়াও সত্যের বিরোধীকে রক্ষা করেনি।","সম্পদ ও উপার্জন আল্লাহর বিচার থেকে রক্ষা করতে পারে না (১১১:২)।","ভালোর বিরোধিতা শেষ পর্যন্ত বিরোধীরই ক্ষতি করে।"]),
 example=("Being well connected — the right surname, the right friends — can open doors in this life. This surah is a reminder that before Allah each person stands on their own choices.",
          "ভালো যোগাযোগ — নামী পরিবার, প্রভাবশালী বন্ধু — এই দুনিয়ায় অনেক দরজা খুলে দেয়। এই সূরা মনে করায়, আল্লাহর সামনে প্রত্যেকে নিজের সিদ্ধান্তের ওপর দাঁড়াবে।"))

N[112] = dict(
 short=("Who Allah is, in four lines: One, the Self-Sufficient, neither begetting nor begotten, beyond comparison.",
        "চার লাইনে আল্লাহর পরিচয়: এক, অমুখাপেক্ষী, জন্ম দেন না ও জন্ম নেননি, তুলনাহীন।"),
 ov=("Al-Ikhlas is a short, complete statement about Allah. He is One. He is as-Samad, the one everyone turns to in need while He needs no one. He has no children and no parent. And nothing is comparable to Him. Its name, ‘sincerity’ or ‘purity’, reflects what it does: it clears belief in Allah of every confusion.",
     "সূরা আল-ইখলাস আল্লাহ সম্পর্কে একটি ছোট কিন্তু পূর্ণাঙ্গ বক্তব্য। তিনি এক। তিনি আস-সামাদ — সবাই প্রয়োজনে যাঁর কাছে যায়, অথচ তিনি কারও মুখাপেক্ষী নন। তাঁর কোনো সন্তান নেই, তিনি কারও সন্তানও নন। আর কোনো কিছুই তাঁর সমতুল্য নয়। এর নাম ‘ইখলাস’ (নিষ্ঠা বা বিশুদ্ধতা) এর কাজকেই প্রকাশ করে: আল্লাহর প্রতি বিশ্বাসকে সব বিভ্রান্তি থেকে মুক্ত করা।"),
 flow=[(1,2,"Allah is One; as-Samad","আল্লাহ এক; আস-সামাদ"),
       (3,4,"No offspring, no parent; none comparable","সন্তান নেই, জনক নেই; কেউ সমতুল্য নয়")],
 concepts=[("Ahad","আহাদ","One, unique — not one of a kind among others.","এক, অনন্য — অনেকের মধ্যে একজন নয়।","112:1","q"),
           ("As-Samad","আস-সামাদ","Pickthall: “the eternally Besought of all” — the one all creation turns to, who depends on nothing.","পিকথলের অনুবাদে “the eternally Besought of all” — সমগ্র সৃষ্টি যাঁর মুখাপেক্ষী, অথচ তিনি কিছুরই মুখাপেক্ষী নন।","112:2","q")],
 take=(["Knowing who Allah is comes before everything else in faith.","Turning to Allah in need is turning to the One who never runs out (112:2).","No image or comparison can capture Him (112:4)."],
       ["ঈমানে সবকিছুর আগে আসে আল্লাহকে চেনা।","প্রয়োজনে আল্লাহর দিকে ফেরা মানে এমন সত্তার দিকে ফেরা, যাঁর কিছুই ফুরায় না (১১২:২)।","কোনো ছবি বা তুলনা তাঁকে ধারণ করতে পারে না (১১২:৪)।"]),
 example=("When a child asks ‘Who made Allah?’, this surah gives a short, honest answer that parents can explain in simple words: Allah was not made, has no parents, and is not like anything we know.",
          "শিশু যখন জিজ্ঞেস করে ‘আল্লাহকে কে বানিয়েছে?’, এই সূরা একটি ছোট ও সৎ উত্তর দেয়, যা বাবা-মা সহজ ভাষায় বোঝাতে পারেন: আল্লাহকে কেউ বানায়নি, তাঁর বাবা-মা নেই, আর তিনি আমাদের চেনা কোনো কিছুর মতো নন।"))

N[113] = dict(
 short=("Seeking refuge with the Lord of daybreak from harms outside us.",
        "বাইরের ক্ষতি থেকে ভোরের রবের আশ্রয় চাওয়া।"),
 ov=("Al-Falaq teaches a prayer for protection. We seek refuge in the Lord of the daybreak from the harm of what He created, from the darkness when it settles, from those who practise magic by blowing on knots, and from the envier when he envies. It names real dangers and points to the One who controls them all.",
     "সূরা আল-ফালাক সুরক্ষার একটি দোয়া শেখায়। আমরা ভোরের রবের আশ্রয় চাই — তাঁর সৃষ্টির অনিষ্ট থেকে, রাতের অন্ধকার যখন ঘনিয়ে আসে, গিঁটে ফুঁ দিয়ে যাদুকারীদের অনিষ্ট থেকে, আর হিংসুক যখন হিংসা করে তার অনিষ্ট থেকে। এটি বাস্তব বিপদগুলোর নাম বলে এবং সেই সত্তার দিকে দেখায়, যিনি সব কিছুর নিয়ন্ত্রক।"),
 flow=[(1,1,"Refuge in the Lord of the daybreak","ভোরের রবের আশ্রয়"),
       (2,5,"From created harm, darkness, magic and envy","সৃষ্টির অনিষ্ট, অন্ধকার, যাদু ও হিংসা থেকে")],
 concepts=[("Al-Falaq","আল-ফালাক","Daybreak: the light splitting the night — a fitting name for the Lord we ask for safety.","ভোর: রাতকে চিরে বেরিয়ে আসা আলো — যাঁর কাছে নিরাপত্তা চাই, সেই রবের জন্য উপযুক্ত নাম।","113:1","q"),
           ("Envy","হিংসা","The surah names envy as a source of harm when it is acted on.","সূরাটি হিংসাকে ক্ষতির উৎস হিসেবে উল্লেখ করে, যখন তা কার্যকর হয়।","113:5","q")],
 take=(["Fear is answered by turning to Allah, not by superstition.","Naming dangers honestly is part of seeking protection.","We can also guard our own hearts against envying others."],
       ["ভয়ের জবাব কুসংস্কার নয়, আল্লাহর দিকে ফেরা।","বিপদের নাম সৎভাবে বলাও আশ্রয় চাওয়ার অংশ।","অন্যকে হিংসা করা থেকে নিজের অন্তরকেও রক্ষা করা যায়।"]),
 example=("Before a late-night drive home or a hard meeting, many Muslims recite this surah. It is a way of handing worry to Allah while still taking sensible care.",
          "রাতে গাড়ি চালিয়ে বাড়ি ফেরা বা কঠিন কোনো মিটিংয়ের আগে অনেক মুসলিম এই সূরা পড়েন। এটি সতর্কতা বজায় রেখেই দুশ্চিন্তা আল্লাহর হাতে সঁপে দেওয়ার একটি উপায়।"))

N[114] = dict(
 short=("Seeking refuge with the Lord, King and God of mankind from the whisperer inside.",
        "মানুষের রব, বাদশাহ ও ইলাহর কাছে ভেতরের কুমন্ত্রণাদাতা থেকে আশ্রয় চাওয়া।"),
 ov=("An-Nas, the last surah of the Qur'an, is also a prayer for protection. This time the danger is inside: the whisperer who slinks away and whispers in people's hearts, whether from jinn or from people. Against it we turn to Allah by three titles — Lord of mankind, King of mankind, God of mankind.",
     "সূরা আন-নাস, কুরআনের শেষ সূরা, এটিও সুরক্ষার দোয়া। এবারের বিপদ ভেতরের: সেই কুমন্ত্রণাদাতা, যে আত্মগোপন করে এবং মানুষের অন্তরে কুমন্ত্রণা দেয় — জিন হোক বা মানুষ। এর বিরুদ্ধে আমরা আল্লাহর তিনটি গুণবাচক পরিচয়ে আশ্রয় চাই — মানুষের রব, মানুষের বাদশাহ, মানুষের ইলাহ।"),
 flow=[(1,3,"Lord, King and God of mankind","মানুষের রব, বাদশাহ ও ইলাহ"),
       (4,6,"From the whisperer who slinks away, of jinn and people","আত্মগোপনকারী কুমন্ত্রণাদাতা থেকে, জিন ও মানুষের মধ্য থেকে")],
 concepts=[("Waswas","ওয়াসওয়াস","Whispering: thoughts that pull towards wrong, then retreat.","কুমন্ত্রণা: এমন চিন্তা, যা ভুলের দিকে টানে, তারপর সরে যায়।","114:4–5","q"),
           ("Three titles","তিনটি পরিচয়","Lord (who cares for us), King (who rules) and God (who alone is worshipped).","রব (যিনি প্রতিপালন করেন), বাদশাহ (যিনি শাসন করেন) ও ইলাহ (যিনি একমাত্র উপাস্য)।","114:1–3","q")],
 take=(["Not every thought in our mind is worth following.","Whispering can come through people as well as unseen sources (114:6).","Allah's care, rule and right to worship are together our protection."],
       ["মনের প্রতিটি চিন্তা অনুসরণযোগ্য নয়।","কুমন্ত্রণা অদৃশ্য উৎস থেকে যেমন আসে, মানুষের মাধ্যমেও আসে (১১৪:৬)।","আল্লাহর প্রতিপালন, শাসন ও ইবাদতের অধিকার — এই তিনটিই আমাদের সুরক্ষা।"]),
 example=("A thought keeps nagging, ‘Just this once, no one will know.’ Recognising it as a whisper, pausing, and seeking refuge in Allah is the practical habit this surah builds.",
          "মাথায় বারবার একটি চিন্তা ঘোরে, ‘শুধু একবার, কেউ জানবে না।’ একে কুমন্ত্রণা হিসেবে চেনা, থামা এবং আল্লাহর আশ্রয় চাওয়া — এই সূরা এই বাস্তব অভ্যাসটিই গড়ে তোলে।"))
