/* Islam Everyday — "How to pray": the steps of a two-rak'ah prayer for five schools (Nov 2026, second version).
 *
 * Played like a short video (app.js vPray): the figure (assets/salah-fig.js) moves into each position, holds while the
 * subtitle is read, and moves on. Close-ups show where the hands go, seen from the front; in sujud the seven parts that
 * touch the ground light up. Five versions: Hanafi, Maliki, Shafi'i, Hanbali and Ja'fari (Twelver Shia).
 *
 * STATUS: a summary written for this app of how each school commonly teaches the prayer, with the standard teaching
 * texts named in SOURCES. It has NOT been checked line by line against those books and has NOT been reviewed by a
 * qualified scholar. The page says so. Corrections go through docs/scholar-review.md.
 */
(function (root, factory) { const api = factory(); if (typeof module === "object" && module.exports) module.exports = api; else root.IE_SALAH = api; })(typeof self !== "undefined" ? self : this, function () {
  "use strict";
  const SCHOOLS = ["hanafi", "maliki", "shafii", "hanbali", "jafari"];
  const NAMES = { hanafi: { en: "Hanafi", bn: "হানাফি" }, maliki: { en: "Maliki", bn: "মালিকি" }, shafii: { en: "Shafi'i", bn: "শাফিই" }, hanbali: { en: "Hanbali", bn: "হাম্বলি" }, jafari: { en: "Ja'fari (Shia)", bn: "জাফরি (শিয়া)" } };
  /* What each school does, kept to what the figure and close-ups can show; NOTES below has the rest. */
  const CFG = {
    hanafi:  { takbir: "ear", fold: "low", raf: false, down: "kneel", sit: "sit", last: "tashahhud", salams: 2, finger: "finger" },
    maliki:  { takbir: "shoulder", fold: "sides", raf: false, down: "reach", sit: "tawsit", last: "tawarruk", salams: 1, finger: "finger-move" },
    shafii:  { takbir: "shoulder", fold: "mid", raf: true, down: "kneel", sit: "sit", last: "tawarruk", salams: 2, qunut: "after", rest: true, finger: "finger-keep" },
    hanbali: { takbir: "shoulder", fold: "low", raf: true, down: "kneel", sit: "sit", last: "tashahhud", salams: 2, finger: "finger-pulse" },
    jafari:  { takbir: "ear", fold: "sides", raf: false, down: "reach", sit: "jsit", last: "jsit", salams: 0, qunut: "before", turbah: true }
  };
  const L2 = (en, bn) => ({ en, bn });
  const T = {
    stand: [L2("Stand facing the qibla", "কিবলার দিকে মুখ করে দাঁড়ান"),
      L2("Stand upright and still, feet a little apart with the toes pointing to the qibla. Look at the place where your forehead will rest, and make the intention in your heart for the prayer you are about to pray.",
        "সোজা আর স্থির হয়ে দাঁড়ান; দুই পা একটু ফাঁক রাখুন, পায়ের আঙুল কিবলার দিকে। যেখানে সিজদায় কপাল রাখবেন সেদিকে তাকান, আর যে নামাজ পড়তে যাচ্ছেন মনে মনে তার নিয়ত করুন।")],
    takbir: [L2("Opening takbir", "তাকবিরে তাহরিমা"), {
      ear: L2("Raise both hands, palms facing the qibla and fingers a little apart, until the thumbs are level with the earlobes. Say the takbir: the prayer has begun.",
        "দুই হাত তুলুন, তালু কিবলার দিকে আর আঙুল একটু ফাঁক, যতক্ষণ না বুড়ো আঙুল কানের লতি বরাবর আসে। তাকবির বলুন: নামাজ শুরু হয়ে গেল।"),
      shoulder: L2("Raise both hands, palms facing the qibla, until they are level with the shoulders. Say the takbir: the prayer has begun.",
        "দুই হাত তুলুন, তালু কিবলার দিকে, যতক্ষণ না হাত কাঁধ বরাবর আসে। তাকবির বলুন: নামাজ শুরু হয়ে গেল।"),
      jafari: L2("Raise both hands, palms facing the qibla, to the level of the ears, and say the takbir: the prayer has begun.",
        "দুই হাত কান বরাবর তুলুন, তালু কিবলার দিকে, আর তাকবির বলুন: নামাজ শুরু হয়ে গেল।") }, "Allahu Akbar"],
    qiyam: [L2("Standing: recitation", "কিয়াম: কিরাত"), {
      low: L2("Place the right hand over the left: the right palm on the back of the left hand, holding the left wrist, below the navel. Recite Surah al-Fatihah, then another surah or some verses.",
        "ডান হাত বাম হাতের ওপর রাখুন: ডান হাতের তালু বাম হাতের পিঠে, বাম কবজি ধরে, নাভির নিচে। সূরা আল-ফাতিহা পড়ুন, তারপর আরেকটা সূরা বা কিছু আয়াত।"),
      mid: L2("Place the right hand over the left wrist, above the navel and below the chest. Recite Surah al-Fatihah, then another surah or some verses.",
        "ডান হাত বাম কবজির ওপর রাখুন, নাভির ওপরে আর বুকের নিচে। সূরা আল-ফাতিহা পড়ুন, তারপর আরেকটা সূরা বা কিছু আয়াত।"),
      sides: L2("Let the arms hang loosely at your sides. Recite Surah al-Fatihah, then another surah.",
        "দুই হাত দুই পাশে আলগা করে ছেড়ে দিন। সূরা আল-ফাতিহা পড়ুন, তারপর আরেকটা সূরা।") }],
    qiyam2: [L2("Second rak'ah: recitation", "দ্বিতীয় রাকাত: কিরাত"), L2("Standing again, with the hands as before, recite Surah al-Fatihah, then another surah or some verses.", "আবার দাঁড়িয়ে, হাত আগের মতো রেখে, সূরা আল-ফাতিহা পড়ুন, তারপর আরেকটা সূরা বা কিছু আয়াত।")],
    raf: [L2("Raise the hands before bowing", "রুকুর আগে হাত তোলা"), L2("Say the takbir and raise both hands to the shoulders, as at the start, then bow.", "তাকবির বলে শুরুর মতো দুই হাত কাঁধ বরাবর তুলুন, তারপর রুকুতে যান।"), "Allahu Akbar"],
    ruku: [L2("Bowing (ruku')", "রুকু"), L2("Bow until the back is level, with the head in line with it, neither raised nor lowered. Keep the knees straight and grip them with both hands, fingers spread, elbows away from the sides. Stay still and glorify Allah three times.",
      "পিঠ সমান না হওয়া পর্যন্ত ঝুঁকুন; মাথা পিঠের সাথে এক সারিতে, উঁচুও না, নিচুও না। হাঁটু সোজা রাখুন, দুই হাতে আঙুল ছড়িয়ে হাঁটু ধরুন, কনুই শরীর থেকে একটু দূরে। স্থির হয়ে তিনবার তাসবিহ পড়ুন।"), "Subhana Rabbiyal-'Azim"],
    rise: [L2("Rising from bowing", "রুকু থেকে ওঠা"), {
      plain: L2("Stand up straight again and pause until every part of the body is still.", "আবার সোজা হয়ে দাঁড়ান, শরীর পুরোপুরি স্থির না হওয়া পর্যন্ত থামুন।"),
      raf: L2("Stand up straight, raising both hands to the shoulders as you rise; then lower them and pause until the body is still.", "সোজা হয়ে দাঁড়ান, ওঠার সময় দুই হাত কাঁধ বরাবর তুলুন; তারপর হাত নামিয়ে শরীর স্থির না হওয়া পর্যন্ত থামুন।") }, "Sami'a Allahu liman hamidah. Rabbana wa lakal-hamd"],
    down: [L2("Going down to prostrate", "সিজদায় যাওয়া"), {
      kneel: L2("Say the takbir and go down: the knees reach the ground first, then the hands, then the forehead and nose.", "তাকবির বলে নিচে যান: আগে হাঁটু মাটিতে, তারপর হাত, তারপর কপাল ও নাক।"),
      reach: L2("Say the takbir and go down: the hands reach the ground first, then the knees.", "তাকবির বলে নিচে যান: আগে হাত মাটিতে, তারপর হাঁটু।") }, "Allahu Akbar"],
    sujud: [L2("Prostration (sujud)", "সিজদা"), {
      seven: L2("Prostrate on seven parts: the forehead with the nose, both palms, both knees and the toes of both feet, bent towards the qibla. The palms rest flat beside the head, fingers together and pointing to the qibla; the elbows are raised off the ground and away from the sides, and the belly away from the thighs. Glorify Allah three times.",
        "সাতটি অঙ্গের ওপর সিজদা করুন: নাকসহ কপাল, দুই হাতের তালু, দুই হাঁটু আর দুই পায়ের আঙুল, কিবলার দিকে বাঁকানো। তালু মাথার দুই পাশে মাটিতে সমান করে রাখুন, আঙুল একসাথে কিবলার দিকে; কনুই মাটি থেকে তোলা আর শরীর থেকে দূরে, পেট ঊরু থেকে দূরে। তিনবার তাসবিহ পড়ুন।"),
      turbah: L2("Prostrate on seven parts: the forehead, both palms, both knees and both big toes. The forehead rests on earth, or on something that grows from it and is not eaten or worn; many people use a small clay tablet (turbah). Glorify Allah.",
        "সাতটি অঙ্গের ওপর সিজদা করুন: কপাল, দুই হাতের তালু, দুই হাঁটু আর দুই পায়ের বুড়ো আঙুল। কপাল রাখুন মাটির ওপর, বা মাটি থেকে জন্মানো এমন কিছুর ওপর যা খাওয়া বা পরা হয় না; অনেকে মাটির ছোট একটা চাকতি (তুরবা) ব্যবহার করেন। তাসবিহ পড়ুন।") }, "Subhana Rabbiyal-A'la"],
    sit: [L2("Sitting between the two prostrations", "দুই সিজদার মাঝে বসা"), {
      sit: L2("Sit on the left foot laid flat, with the right foot upright and its toes bent towards the qibla. Rest the hands on the thighs near the knees, fingers towards the qibla, and pause until still.",
        "বাম পা বিছিয়ে তার ওপর বসুন, ডান পা খাড়া রাখুন, আঙুল কিবলার দিকে বাঁকানো। দুই হাত হাঁটুর কাছে ঊরুর ওপর রাখুন, আঙুল কিবলার দিকে, আর স্থির না হওয়া পর্যন্ত থামুন।"),
      tawsit: L2("Sit with the left hip on the ground, the left foot out from under the right shin, and the right foot upright (tawarruk). Rest the hands on the thighs and pause until still.",
        "বাম নিতম্ব মাটিতে রেখে বসুন, বাম পা ডান পায়ের নলার নিচ দিয়ে বের করে দিন, ডান পা খাড়া রাখুন (তাওয়াররুক)। দুই হাত ঊরুর ওপর রেখে স্থির না হওয়া পর্যন্ত থামুন।"),
      jsit: L2("Sit on the left thigh with the top of the right foot over the sole of the left (recommended). Rest the hands on the thighs and pause until still.",
        "বাম ঊরুর ওপর বসুন, ডান পায়ের পাতার ওপরের দিক বাম পায়ের তলার ওপর রাখুন (মুস্তাহাব)। দুই হাত ঊরুর ওপর রেখে স্থির না হওয়া পর্যন্ত থামুন।") }, "Rabbighfir li"],
    sujud2: [L2("Second prostration", "দ্বিতীয় সিজদা"), L2("Prostrate once more in the same way. That completes one rak'ah.", "একইভাবে আরেকবার সিজদা করুন। এতে এক রাকাত পূর্ণ হলো।"), "Subhana Rabbiyal-A'la"],
    up: [L2("Stand for the second rak'ah", "দ্বিতীয় রাকাতের জন্য দাঁড়ানো"), {
      plain: L2("Say the takbir and stand up for the second rak'ah, pushing up from the knees.", "তাকবির বলে দ্বিতীয় রাকাতের জন্য দাঁড়িয়ে যান।"),
      rest: L2("Say the takbir, sit for a brief moment of rest, then stand up for the second rak'ah, pressing on the hands.", "তাকবির বলে এক মুহূর্ত বসে নিন, তারপর হাতে ভর দিয়ে দ্বিতীয় রাকাতের জন্য দাঁড়িয়ে যান।") }, "Allahu Akbar"],
    qunutB: [L2("Qunut", "কুনুত"), L2("Before bowing in the second rak'ah, raise the hands in front of the face, palms up, and make dua. This is recommended.", "দ্বিতীয় রাকাতে রুকুর আগে দুই হাত মুখের সামনে তুলুন, তালু ওপরের দিকে, আর দোয়া করুন। এটা মুস্তাহাব।")],
    qunutA: [L2("Qunut (in Fajr)", "কুনুত (ফজরে)"), L2("In the second rak'ah of Fajr, after rising from bowing, raise the hands, palms up, and recite the qunut dua. This is a sunnah.", "ফজরের দ্বিতীয় রাকাতে রুকু থেকে উঠে দুই হাত তুলুন, তালু ওপরের দিকে, আর কুনুতের দোয়া পড়ুন। এটা সুন্নাত।")],
    last: [L2("Final sitting: tashahhud", "শেষ বৈঠক: তাশাহহুদ"), {
      tashahhud: L2("Sit as between the prostrations. Recite the tashahhud; at the testimony point with the right index finger (raised at “la ilaha”, lowered at “illa Allah”). Then send blessings on the Prophet ﷺ and make dua.",
        "দুই সিজদার মাঝের মতো বসুন। তাশাহহুদ পড়ুন; শাহাদাতের সময় ডান হাতের শাহাদাত আঙুল দিয়ে ইশারা করুন (“লা ইলাহা”-তে ওঠান, “ইল্লাল্লাহ”-তে নামান)। তারপর নবী ﷺ-এর ওপর দরুদ পড়ে দোয়া করুন।"),
      hanbali: L2("Sit on the left foot with the right foot upright. Recite the tashahhud, pointing with the right index finger whenever Allah is mentioned. Then send blessings on the Prophet ﷺ and make dua.",
        "বাম পায়ের ওপর বসুন, ডান পা খাড়া রাখুন। তাশাহহুদ পড়ুন, আল্লাহর নাম আসলেই ডান হাতের শাহাদাত আঙুল দিয়ে ইশারা করুন। তারপর নবী ﷺ-এর ওপর দরুদ পড়ে দোয়া করুন।"),
      shafii: L2("Sit in tawarruk: left hip on the ground, the left foot out from under the right shin, the right foot upright. Recite the tashahhud; raise the right index finger at “illa Allah” and keep it raised without moving it. Then send blessings on the Prophet ﷺ and make dua.",
        "তাওয়াররুক করে বসুন: বাম নিতম্ব মাটিতে, বাম পা ডান নলার নিচ দিয়ে বের করা, ডান পা খাড়া। তাশাহহুদ পড়ুন; “ইল্লাল্লাহ”-তে ডান হাতের শাহাদাত আঙুল তুলুন আর না নাড়িয়ে তুলে রাখুন। তারপর নবী ﷺ-এর ওপর দরুদ পড়ে দোয়া করুন।"),
      maliki: L2("Sit in tawarruk. Recite the tashahhud, with the right index finger extended and moved gently from side to side. Then send blessings on the Prophet ﷺ and make dua.",
        "তাওয়াররুক করে বসুন। তাশাহহুদ পড়ুন, ডান হাতের শাহাদাত আঙুল সোজা রেখে আস্তে আস্তে ডানে-বামে নাড়ান। তারপর নবী ﷺ-এর ওপর দরুদ পড়ে দোয়া করুন।"),
      jafari: L2("Sit with the hands on the thighs and recite the tashahhud and the blessings on the Prophet ﷺ and his family.",
        "দুই হাত ঊরুর ওপর রেখে বসুন, তাশাহহুদ পড়ুন আর নবী ﷺ ও তাঁর পরিবারের ওপর দরুদ পড়ুন।") }, "Ash-hadu an la ilaha illa Allah…"],
    salamR: [L2("Salam to the right", "ডান দিকে সালাম"), L2("Turn the face to the right, until the cheek can be seen from behind, and say the salam.", "ডান দিকে মুখ ফেরান, যাতে পেছন থেকে গাল দেখা যায়, আর সালাম বলুন।"), "As-salamu 'alaykum wa rahmatullah"],
    salamL: [L2("Salam to the left", "বাম দিকে সালাম"), L2("Turn the face to the left and say the salam again. The prayer is complete.", "বাম দিকে মুখ ফিরিয়ে আবার সালাম বলুন। নামাজ শেষ হলো।"), "As-salamu 'alaykum wa rahmatullah"],
    salam1: [L2("Salam", "সালাম"), L2("Say the salam once, beginning to the front and turning a little to the right. The prayer is complete.", "একবার সালাম বলুন, সামনের দিক থেকে শুরু করে একটু ডানে মুখ ফিরিয়ে। নামাজ শেষ হলো।"), "As-salamu 'alaykum"],
    salamJ: [L2("Salam", "সালাম"), L2("Still facing the qibla, say the salam. The prayer is complete; saying the takbir three times afterwards, raising the hands each time, is recommended.", "কিবলার দিকে মুখ রেখেই সালাম বলুন। নামাজ শেষ হলো; এরপর প্রতিবার হাত তুলে তিনবার তাকবির বলা মুস্তাহাব।"), "As-salamu 'alaykum wa rahmatullahi wa barakatuh"]
  };
  const SAY_J = { ruku: "Subhana Rabbiyal-'Azimi wa bihamdih", sujud: "Subhana Rabbiyal-A'la wa bihamdih", sujud2: "Subhana Rabbiyal-A'la wa bihamdih", sit: "Astaghfirullaha Rabbi wa atubu ilayh", rise: "Sami'a Allahu liman hamidah" };
  /* Close-up captions (what the small front view shows). */
  const INSET = {
    low: L2("Right over left, below the navel", "ডান হাত বাম হাতের ওপর, নাভির নিচে"),
    mid: L2("Right over left, above the navel", "ডান হাত বাম হাতের ওপর, নাভির ওপরে"),
    sides: L2("Arms at the sides", "হাত দুই পাশে"),
    ear: L2("Thumbs by the earlobes", "বুড়ো আঙুল কানের লতি বরাবর"),
    shoulder: L2("Hands level with the shoulders", "হাত কাঁধ বরাবর"),
    qunut: L2("Palms up, in front of the face", "তালু ওপরে, মুখের সামনে"),
    finger: L2("Raised at “la ilaha”, lowered at “illa Allah”", "“লা ইলাহা”-তে ওঠানো, “ইল্লাল্লাহ”-তে নামানো"),
    "finger-keep": L2("Raised at “illa Allah”, kept still", "“ইল্লাল্লাহ”-তে ওঠানো, স্থির রাখা"),
    "finger-pulse": L2("Pointed at each mention of Allah", "আল্লাহর নাম আসলেই ইশারা"),
    "finger-move": L2("Finger moved side to side", "আঙুল ডানে-বামে নাড়ানো"),
    feet: L2("Seen from behind: left foot flat, right foot upright", "পেছন থেকে: বাম পা বিছানো, ডান পা খাড়া"),
    seven: L2("Seven parts touch the ground", "সাতটি অঙ্গ মাটিতে")
  };
  /* The steps of a two-rak'ah prayer for one school:
     [{ id, pose, via?, t, d, say, inset?, points?, turbah?, turn?, rk }] */
  function steps(school) {
    const c = CFG[school] || CFG.hanafi, J = school === "jafari", out = [];
    const add = (id, pose, d, x) => out.push(Object.assign({ id, pose, t: T[id][0], d, say: (J && SAY_J[id]) || T[id][2] || "" }, x || {}));
    const sx = { turbah: !!c.turbah };
    const rakah = n => {
      if (n === 1) add("qiyam", c.fold, T.qiyam[1][c.fold], { rk: 1, inset: c.fold });
      else add("qiyam2", c.fold, T.qiyam2[1], { rk: 2, inset: c.fold });
      if (n === 2 && c.qunut === "before") add("qunutB", "qunut", T.qunutB[1], { rk: 2, inset: "qunut" });
      if (c.raf) add("raf", "shoulder", T.raf[1], { rk: n, inset: "shoulder" });
      add("ruku", "ruku", T.ruku[1], { rk: n });
      add("rise", c.raf ? "shoulder" : "stand", T.rise[1][c.raf ? "raf" : "plain"], { rk: n });
      if (n === 2 && c.qunut === "after") add("qunutA", "qunut", T.qunutA[1], { rk: 2, inset: "qunut" });
      add("down", c.down, T.down[1][c.down], Object.assign({ rk: n }, sx));
      add("sujud", "sujud", T.sujud[1][c.turbah ? "turbah" : "seven"], Object.assign({ rk: n, points: true, inset: "seven" }, sx));
      add("sit", c.sit, T.sit[1][c.sit === "sit" ? "sit" : c.sit], Object.assign({ rk: n, inset: c.sit === "sit" ? "feet" : null }, sx));
      add("sujud2", "sujud", T.sujud2[1], Object.assign({ rk: n, points: true }, sx));
    };
    add("stand", "stand", T.stand[1], { rk: 1 });
    add("takbir", c.takbir, T.takbir[1][J ? "jafari" : c.takbir], { rk: 1, inset: c.takbir });
    rakah(1);
    add("up", c.rest ? "sit" : "stand", T.up[1][c.rest ? "rest" : "plain"], Object.assign({ rk: 2, via: c.rest ? null : "kneel" }, sx));
    rakah(2);
    const lastKey = J ? "jafari" : school === "hanbali" ? "hanbali" : school === "shafii" ? "shafii" : school === "maliki" ? "maliki" : "tashahhud";
    add("last", c.last, T.last[1][lastKey], Object.assign({ rk: 2, inset: c.finger || null }, sx));
    if (c.salams === 2) { add("salamR", c.last, T.salamR[1], { rk: 2, turn: 1 }); add("salamL", c.last, T.salamL[1], { rk: 2, turn: -1 }); }
    else if (c.salams === 1) add("salam1", c.last, T.salam1[1], { rk: 2, turn: 0.6 });
    else add("salamJ", c.last, T.salamJ[1], Object.assign({ rk: 2 }, sx));
    return out;
  }
  /* Timing for playback, like a short video: each step moves (about a second; longer when it passes through another
     position) and then holds long enough to read its subtitle at a calm pace. Milliseconds, at normal speed. */
  function timeline(list, lang) {
    let t = 0;
    return list.map((s, i) => { const move = i === 0 ? 0 : s.via ? 1700 : 1050, text = (s.d[lang] || s.d.en).length, hold = Math.max(3400, Math.min(9000, 1600 + text * (lang === "bn" ? 34 : 30)));
      const r = { start: t, moved: t + move, end: t + move + hold }; t = r.end; return r; });
  }
  const NOTES = {
    hanafi: [
      L2("The hands are raised at the opening takbir only, to the level of the ears.", "হাত তোলা হয় শুধু প্রথম তাকবিরে, কান বরাবর।"),
      L2("Men place the right hand over the left below the navel; women are taught some positions differently, so ask a teacher.", "পুরুষরা ডান হাত বাম হাতের ওপর রেখে নাভির নিচে বাঁধেন; নারীদের কিছু ভঙ্গি আলাদাভাবে শেখানো হয়, তাই একজন শিক্ষকের কাছে জেনে নিন।"),
      L2("Behind an imam the follower listens and does not recite; “Ameen” is said quietly.", "ইমামের পেছনে মুক্তাদি কিরাত পড়েন না, চুপ করে শোনেন; “আমিন” আস্তে বলা হয়।"),
      L2("Going down, the knees reach the ground before the hands.", "সিজদায় যাওয়ার সময় হাতের আগে হাঁটু মাটিতে রাখা হয়।"),
      L2("In the tashahhud the index finger is raised at the denial (“la ilaha”) and lowered at the affirmation (“illa Allah”).", "তাশাহহুদে “লা ইলাহা” বলার সময় শাহাদাত আঙুল ওঠানো হয়, আর “ইল্লাল্লাহ” বলার সময় নামানো হয়।"),
      L2("Two salams end the prayer.", "দুই সালাম দিয়ে নামাজ শেষ হয়।")],
    maliki: [
      L2("The hands are raised at the opening takbir only, to the level of the shoulders.", "হাত তোলা হয় শুধু প্রথম তাকবিরে, কাঁধ বরাবর।"),
      L2("In the school's well-known position the arms hang at the sides (sadl) in obligatory prayers; folding the hands is also reported in the school.", "মাযহাবের প্রসিদ্ধ মত অনুযায়ী ফরজ নামাজে দুই হাত দুই পাশে ছেড়ে রাখা হয় (সাদল); হাত বাঁধার কথাও মাযহাবে বর্ণিত আছে।"),
      L2("The basmalah is not recited aloud before al-Fatihah in obligatory prayers.", "ফরজ নামাজে আল-ফাতিহার আগে বিসমিল্লাহ জোরে পড়া হয় না।"),
      L2("Going down, the hands reach the ground before the knees.", "সিজদায় যাওয়ার সময় হাঁটুর আগে হাত মাটিতে রাখা হয়।"),
      L2("Every sitting is tawarruk, and the index finger is moved gently from side to side during the tashahhud.", "সব বৈঠকেই তাওয়াররুক করে বসা হয়, আর তাশাহহুদের সময় শাহাদাত আঙুল আস্তে আস্তে ডানে-বামে নাড়ানো হয়।"),
      L2("In Fajr, qunut is recited quietly in the second rak'ah before bowing (recommended).", "ফজরে দ্বিতীয় রাকাতে রুকুর আগে আস্তে কুনুত পড়া হয় (মুস্তাহাব)।"),
      L2("One salam ends the prayer for the imam and for someone praying alone.", "ইমাম আর একা নামাজ পড়া ব্যক্তির জন্য এক সালামেই নামাজ শেষ হয়।")],
    shafii: [
      L2("The hands are raised to the shoulders at the opening takbir, before bowing, on rising from bowing, and on standing up from the first tashahhud.", "প্রথম তাকবিরে, রুকুতে যাওয়ার আগে, রুকু থেকে ওঠার সময় আর প্রথম তাশাহহুদ থেকে দাঁড়ানোর সময় দুই হাত কাঁধ বরাবর তোলা হয়।"),
      L2("Al-Fatihah is recited in every rak'ah, also behind an imam; the basmalah is one of its verses.", "প্রতি রাকাতে আল-ফাতিহা পড়া হয়, ইমামের পেছনেও; বিসমিল্লাহ এর একটা আয়াত।"),
      L2("“Ameen” is said aloud in the prayers recited aloud.", "যে নামাজে কিরাত জোরে পড়া হয়, সেখানে “আমিন” জোরে বলা হয়।"),
      L2("A brief sitting of rest before standing for the next rak'ah is recommended.", "পরের রাকাতের জন্য দাঁড়ানোর আগে অল্প একটু বসে নেওয়া মুস্তাহাব।"),
      L2("Qunut is recited in the second rak'ah of Fajr, after rising from bowing.", "ফজরের দ্বিতীয় রাকাতে রুকু থেকে ওঠার পর কুনুত পড়া হয়।"),
      L2("The final sitting is tawarruk; the index finger is raised at “illa Allah” and kept raised without moving it.", "শেষ বৈঠকে তাওয়াররুক করে বসা হয়; “ইল্লাল্লাহ” বলার সময় শাহাদাত আঙুল ওঠানো হয় আর না নাড়িয়ে উঠিয়ে রাখা হয়।"),
      L2("The first salam is obligatory and the second is recommended.", "প্রথম সালাম ফরজ, দ্বিতীয়টা সুন্নাত।")],
    hanbali: [
      L2("The hands are raised at the opening takbir, before bowing and on rising from bowing.", "প্রথম তাকবিরে, রুকুতে যাওয়ার আগে আর রুকু থেকে ওঠার সময় হাত তোলা হয়।"),
      L2("The right hand is placed over the left; below the navel is the school's relied-upon position, and other placements are accepted.", "ডান হাত বাম হাতের ওপর রাখা হয়; মাযহাবের নির্ভরযোগ্য মত হলো নাভির নিচে, অন্য জায়গায় রাখাও গ্রহণযোগ্য।"),
      L2("The basmalah is recited quietly; “Ameen” is said aloud in the prayers recited aloud.", "বিসমিল্লাহ আস্তে পড়া হয়; যে নামাজে কিরাত জোরে পড়া হয়, সেখানে “আমিন” জোরে বলা হয়।"),
      L2("Going down, the knees reach the ground before the hands.", "সিজদায় যাওয়ার সময় হাতের আগে হাঁটু মাটিতে রাখা হয়।"),
      L2("Tawarruk is for the last sitting of a prayer that has two tashahhuds; in a two-rak'ah prayer the sitting is on the left foot.", "তাওয়াররুক শুধু সেই নামাজের শেষ বৈঠকে, যে নামাজে দুটো তাশাহহুদ আছে; দুই রাকাতের নামাজে বাম পায়ের ওপর বসা হয়।"),
      L2("Both salams are required.", "দুই সালামই জরুরি।")],
    jafari: [
      L2("The arms rest at the sides; the hands are not folded.", "দুই হাত দুই পাশে ছেড়ে রাখা হয়; হাত বাঁধা হয় না।"),
      L2("After al-Fatihah a complete surah is recited, and “Ameen” is not said after al-Fatihah.", "আল-ফাতিহার পর একটা পূর্ণ সূরা পড়া হয়, আর আল-ফাতিহার পর “আমিন” বলা হয় না।"),
      L2("The forehead is placed on earth, or on something that grows from it and is not eaten or worn; many people use a small clay tablet (turbah).", "কপাল রাখা হয় মাটির ওপর, বা মাটি থেকে জন্মানো এমন কিছুর ওপর যা খাওয়া বা পরা হয় না; অনেকে মাটির ছোট একটা চাকতি (তুরবা) ব্যবহার করেন।"),
      L2("Qunut in the second rak'ah, before bowing, is recommended in every prayer.", "প্রতি নামাজে দ্বিতীয় রাকাতে রুকুর আগে কুনুত পড়া মুস্তাহাব।"),
      L2("The recommended way of sitting is on the left thigh, with the top of the right foot over the sole of the left.", "মুস্তাহাব হলো বাম ঊরুর ওপর বসা, ডান পায়ের পাতার ওপরের দিক বাম পায়ের তলার ওপর রেখে।"),
      L2("Saying the takbir with the hands raised before each change of position is recommended.", "প্রতিবার অবস্থা বদলানোর আগে হাত তুলে তাকবির বলা মুস্তাহাব।"),
      L2("The salam is said facing the qibla; three takbirs afterwards are recommended.", "সালাম বলা হয় কিবলার দিকে মুখ রেখেই; এরপর তিনবার তাকবির বলা মুস্তাহাব।")]
  };
  const SOURCES = {
    hanafi: ["al-Marghinani, Al-Hidayah", "ash-Shurunbulali, Nur al-Idah"],
    maliki: ["Ibn Abi Zayd al-Qayrawani, Ar-Risalah", "Khalil ibn Ishaq, Al-Mukhtasar"],
    shafii: ["an-Nawawi, Minhaj at-Talibin", "Ibn an-Naqib al-Misri, 'Umdat as-Salik"],
    hanbali: ["Ibn Qudamah, 'Umdat al-Fiqh", "al-Hajjawi, Zad al-Mustaqni'"],
    jafari: ["as-Sayyid 'Ali as-Sistani, Islamic Laws (Tawdih al-Masa'il)", "as-Sayyid Abu al-Qasim al-Khoei, Minhaj as-Salihin"]
  };
  return { SCHOOLS, NAMES, CFG, steps, timeline, NOTES, SOURCES, INSET };
});
