/* Islam Everyday — "How to pray", an animated walk through a two-rak'ah prayer (Nov 2026).
 *
 * A faceless figure, seen from the side and facing the qibla, moves through each position. Five versions: the four
 * Sunni schools (Hanafi, Maliki, Shafi'i, Hanbali) and the Ja'fari (Twelver Shia) school. Everything is drawn on the
 * device (SVG); there are no video files.
 *
 * STATUS: a summary written for this app of how each school commonly teaches the prayer, with the standard teaching
 * texts named in SOURCES. It has NOT been checked line by line against those books and has NOT been reviewed by a
 * qualified scholar. The page says so. Corrections go through docs/scholar-review.md.
 *
 * Figure: joint angles in degrees (0 = up, 90 = towards the qibla, 180 = down, 270 = back), turned into points by
 * forward kinematics from the hip, so limbs keep their length while a pose blends into the next.
 */
(function (root, factory) { const api = factory(); if (typeof module === "object" && module.exports) module.exports = api; else root.IE_SALAH = api; })(typeof self !== "undefined" ? self : this, function () {
  "use strict";
  const SCHOOLS = ["hanafi", "maliki", "shafii", "hanbali", "jafari"];
  const NAMES = { hanafi: { en: "Hanafi", bn: "হানাফি" }, maliki: { en: "Maliki", bn: "মালিকি" }, shafii: { en: "Shafi'i", bn: "শাফিই" }, hanbali: { en: "Hanbali", bn: "হাম্বলি" }, jafari: { en: "Ja'fari (Shia)", bn: "জাফরি (শিয়া)" } };
  const G = 180, LEN = { th: 40, sh: 40, ft: 15, to: 50, nk: 19, ua: 33, fa: 31 };
  /* hx, hy: hip. th, sh, ft: thigh, shin, foot. to: torso. hd: head. ua, fa: upper arm, forearm. */
  const POSE = {
    stand:   { hx: 150, hy: 96, th: 180, sh: 180, ft: 90, to: 0, hd: 0, ua: 177, fa: 174 },
    ear:     { hx: 150, hy: 96, th: 180, sh: 180, ft: 90, to: 0, hd: 0, ua: 110, fa: 5 },
    shoulder:{ hx: 150, hy: 96, th: 180, sh: 180, ft: 90, to: 0, hd: 0, ua: 135, fa: 25 },
    low:     { hx: 150, hy: 96, th: 180, sh: 180, ft: 90, to: 0, hd: 4, ua: 190, fa: 118 },
    mid:     { hx: 150, hy: 96, th: 180, sh: 180, ft: 90, to: 0, hd: 4, ua: 196, fa: 80 },
    sides:   { hx: 150, hy: 96, th: 180, sh: 180, ft: 90, to: 0, hd: 4, ua: 177, fa: 174 },
    qunut:   { hx: 150, hy: 96, th: 180, sh: 180, ft: 90, to: 0, hd: 2, ua: 122, fa: 38 },
    ruku:    { hx: 142, hy: 96, th: 174, sh: 174, ft: 90, to: 86, hd: 84, ua: 227, fa: 227 },
    kneel:   { hx: 152, hy: 137, th: 168, sh: 273, ft: 150, to: 6, hd: 6, ua: 172, fa: 150 },
    reach:   { hx: 147, hy: 116, th: 152, sh: 208, ft: 100, to: 104, hd: 100, ua: 150, fa: 140 },
    sujud:   { hx: 148, hy: 132, th: 165, sh: 273, ft: 150, to: 118, hd: 125, ua: 80, fa: 170 },
    sit:     { hx: 127, hy: 155, th: 121, sh: 273, ft: 250, to: 3, hd: 5, ua: 168, fa: 108 },
    tawarruk:{ hx: 127, hy: 163, th: 108, sh: 268, ft: 262, to: 4, hd: 5, ua: 166, fa: 102 }
  };
  const rad = d => d * Math.PI / 180, pt = (o, L, a) => [o[0] + L * Math.sin(rad(a)), o[1] - L * Math.cos(rad(a))];
  const lerpA = (a, b, t) => { let d = ((b - a + 540) % 360) - 180; return a + d * t; };
  /* Blend two poses (t from 0 to 1). Angles take the shorter way round. */
  function mix(a, b, t) { const o = {}; for (const k in a) o[k] = k === "hx" || k === "hy" ? a[k] + (b[k] - a[k]) * t : lerpA(a[k], b[k], t); return o; }
  function joints(p) {
    const hip = [p.hx, p.hy], knee = pt(hip, LEN.th, p.th), ankle = pt(knee, LEN.sh, p.sh), toe = pt(ankle, LEN.ft, p.ft);
    const sh = pt(hip, LEN.to, p.to), head = pt(sh, LEN.nk, p.hd), elbow = pt(sh, LEN.ua, p.ua), hand = pt(elbow, LEN.fa, p.fa);
    return { hip, knee, ankle, toe, sh, head, elbow, hand };
  }
  const f1 = n => (Math.round(n * 10) / 10).toString(), xy = a => f1(a[0]) + " " + f1(a[1]);
  /* The figure as SVG markup. o.finger: raised index finger; o.turn: -1 | 0 | 1 (salam, shown by a small arc);
     o.turbah: the clay tablet used for prostration in the Ja'fari school. Colours come from the page's theme. */
  function draw(p, o) {
    o = o || {}; const j = joints(p);
    const line = (a, b, c) => `<path class="${c}" d="M${xy(a)}L${xy(b)}"/>`;
    const fin = o.finger ? `<path class="sl-fin" d="M${xy(j.hand)}L${xy(pt(j.hand, 9, 62))}"/>` : "";
    const hx = j.head[0], hy = j.head[1];
    const turn = o.turn ? `<path class="sl-turn" d="M${f1(hx - 15)} ${f1(hy - 17)}Q${f1(hx)} ${f1(hy - 27)} ${f1(hx + 15)} ${f1(hy - 17)}"/><path class="sl-turn" d="${o.turn > 0 ? `M${f1(hx + 15)} ${f1(hy - 17)}l-7 -1.5M${f1(hx + 15)} ${f1(hy - 17)}l-2.5 -6.5` : `M${f1(hx - 15)} ${f1(hy - 17)}l7 -1.5M${f1(hx - 15)} ${f1(hy - 17)}l2.5 -6.5`}"/>` : "";
    return `<rect class="sl-mat" x="92" y="${G}" width="160" height="7" rx="3.5"/>${o.turbah ? `<rect class="sl-turbah" x="206" y="${G - 4}" width="16" height="5" rx="2"/>` : ""}`
      + line(j.knee, j.ankle, "sl-leg") + line(j.ankle, j.toe, "sl-foot") + line(j.hip, j.knee, "sl-leg")
      + `<path class="sl-body" d="M${xy(j.hip)}L${xy(j.sh)}"/><circle class="sl-head" cx="${f1(hx)}" cy="${f1(hy)}" r="11"/>`
      + `<path class="sl-arm" d="M${xy(j.sh)}L${xy(j.elbow)}L${xy(j.hand)}"/>` + fin + turn;
  }

  /* ---- what each school does (kept to what the figure can show, plus the notes below) ---- */
  const CFG = {
    hanafi:  { takbir: "ear", fold: "low", raf: false, down: "kneel", sit: "sit", last: "sit", salams: 2 },
    maliki:  { takbir: "shoulder", fold: "sides", raf: false, down: "reach", sit: "tawarruk", last: "tawarruk", salams: 1 },
    shafii:  { takbir: "shoulder", fold: "mid", raf: true, down: "kneel", sit: "sit", last: "tawarruk", salams: 2, qunut: "after" },
    hanbali: { takbir: "shoulder", fold: "low", raf: true, down: "kneel", sit: "sit", last: "sit", salams: 2 },
    jafari:  { takbir: "ear", fold: "sides", raf: false, down: "reach", sit: "sit", last: "sit", salams: 0, qunut: "before", turbah: true }
  };
  const T = {
    stand: [{ en: "Stand facing the qibla", bn: "কিবলার দিকে মুখ করে দাঁড়ান" }, { en: "Stand upright and still, and make the intention in your heart for the prayer you are about to pray.", bn: "সোজা আর স্থির হয়ে দাঁড়ান, আর যে নামাজ পড়তে যাচ্ছেন মনে মনে তার নিয়ত করুন।" }],
    takbir: [{ en: "Opening takbir", bn: "তাকবিরে তাহরিমা" }, { ear: { en: "Raise both hands to the level of the ears and say the takbir. The prayer has begun.", bn: "দুই হাত কান বরাবর তুলে তাকবির বলুন। নামাজ শুরু হয়ে গেল।" }, shoulder: { en: "Raise both hands to the level of the shoulders and say the takbir. The prayer has begun.", bn: "দুই হাত কাঁধ বরাবর তুলে তাকবির বলুন। নামাজ শুরু হয়ে গেল।" } }, "Allahu Akbar"],
    qiyam: [{ en: "Standing: recitation", bn: "কিয়াম: কিরাত" }, {
      low: { en: "Place the right hand over the left, below the navel. Recite Surah al-Fatihah, then another surah or some verses.", bn: "ডান হাত বাম হাতের ওপর রেখে নাভির নিচে বাঁধুন। সূরা আল-ফাতিহা পড়ুন, তারপর আরেকটা সূরা বা কিছু আয়াত।" },
      mid: { en: "Place the right hand over the left, above the navel and below the chest. Recite Surah al-Fatihah, then another surah or some verses.", bn: "ডান হাত বাম হাতের ওপর রেখে নাভির ওপরে, বুকের নিচে বাঁধুন। সূরা আল-ফাতিহা পড়ুন, তারপর আরেকটা সূরা বা কিছু আয়াত।" },
      sides: { en: "Let the arms rest at your sides. Recite Surah al-Fatihah, then another surah.", bn: "দুই হাত দুই পাশে ছেড়ে রাখুন। সূরা আল-ফাতিহা পড়ুন, তারপর আরেকটা সূরা।" } }],
    qiyam2: [{ en: "Second rak'ah: recitation", bn: "দ্বিতীয় রাকাত: কিরাত" }, { en: "Standing again, recite Surah al-Fatihah, then another surah or some verses.", bn: "আবার দাঁড়িয়ে সূরা আল-ফাতিহা পড়ুন, তারপর আরেকটা সূরা বা কিছু আয়াত।" }],
    raf: [{ en: "Raise the hands before bowing", bn: "রুকুর আগে হাত তোলা" }, { en: "Say the takbir and raise both hands to the shoulders, as at the start, then go down to bow.", bn: "তাকবির বলে শুরুর মতো দুই হাত কাঁধ বরাবর তুলুন, তারপর রুকুতে যান।" }, "Allahu Akbar"],
    ruku: [{ en: "Bowing (ruku')", bn: "রুকু" }, { en: "Bow with the back level, hands on the knees, and stay still while you glorify Allah three times.", bn: "পিঠ সমান রেখে ঝুঁকুন, দুই হাত হাঁটুতে রাখুন, আর স্থির হয়ে তিনবার তাসবিহ পড়ুন।" }, "Subhana Rabbiyal-'Azim"],
    rise: [{ en: "Rising from bowing", bn: "রুকু থেকে ওঠা" }, { plain: { en: "Stand up straight again and pause until the body is still.", bn: "আবার সোজা হয়ে দাঁড়ান, শরীর স্থির না হওয়া পর্যন্ত থামুন।" }, raf: { en: "Stand up straight, raising both hands to the shoulders as you rise, then lower them and pause until the body is still.", bn: "সোজা হয়ে দাঁড়ান, ওঠার সময় দুই হাত কাঁধ বরাবর তুলুন, তারপর নামিয়ে শরীর স্থির না হওয়া পর্যন্ত থামুন।" } }, "Sami'a Allahu liman hamidah. Rabbana wa lakal-hamd"],
    sujud: [{ en: "Prostration (sujud)", bn: "সিজদা" }, {
      kneel: { en: "Go down with the knees first, then the hands. Rest the forehead and nose, both palms, both knees and the toes on the ground, and glorify Allah three times.", bn: "আগে হাঁটু, তারপর হাত মাটিতে রাখুন। কপাল ও নাক, দুই হাতের তালু, দুই হাঁটু আর পায়ের আঙুল মাটিতে রেখে তিনবার তাসবিহ পড়ুন।" },
      reach: { en: "Go down with the hands first, then the knees. Rest the forehead and nose, both palms, both knees and the toes on the ground, and glorify Allah three times.", bn: "আগে হাত, তারপর হাঁটু মাটিতে রাখুন। কপাল ও নাক, দুই হাতের তালু, দুই হাঁটু আর পায়ের আঙুল মাটিতে রেখে তিনবার তাসবিহ পড়ুন।" },
      turbah: { en: "Go down with the hands first, then the knees. Rest the forehead on earth or a clay tablet (turbah), with both palms, both knees and the big toes on the ground, and glorify Allah.", bn: "আগে হাত, তারপর হাঁটু মাটিতে রাখুন। কপাল রাখুন মাটি বা মাটির চাকতির (তুরবা) ওপর; দুই হাতের তালু, দুই হাঁটু আর পায়ের বুড়ো আঙুল মাটিতে রেখে তাসবিহ পড়ুন।" } }, "Subhana Rabbiyal-A'la"],
    sit: [{ en: "Sitting between the two prostrations", bn: "দুই সিজদার মাঝে বসা" }, { en: "Sit up, hands resting on the thighs, and pause until the body is still.", bn: "উঠে বসুন, দুই হাত ঊরুর ওপর রাখুন, শরীর স্থির না হওয়া পর্যন্ত থামুন।" }, "Rabbighfir li"],
    sujud2: [{ en: "Second prostration", bn: "দ্বিতীয় সিজদা" }, { en: "Prostrate once more in the same way. That completes one rak'ah.", bn: "একইভাবে আরেকবার সিজদা করুন। এতে এক রাকাত পূর্ণ হলো।" }, "Subhana Rabbiyal-A'la"],
    up: [{ en: "Stand for the second rak'ah", bn: "দ্বিতীয় রাকাতের জন্য দাঁড়ানো" }, { plain: { en: "Say the takbir and stand up for the second rak'ah.", bn: "তাকবির বলে দ্বিতীয় রাকাতের জন্য দাঁড়িয়ে যান।" }, rest: { en: "Say the takbir, sit for a brief moment of rest, then stand up for the second rak'ah.", bn: "তাকবির বলে এক মুহূর্ত বসে নিন, তারপর দ্বিতীয় রাকাতের জন্য দাঁড়িয়ে যান।" } }, "Allahu Akbar"],
    qunutB: [{ en: "Qunut", bn: "কুনুত" }, { en: "Before bowing in the second rak'ah, raise the hands in front of the face, palms up, and make dua. This is recommended.", bn: "দ্বিতীয় রাকাতে রুকুর আগে দুই হাত মুখের সামনে তুলে, তালু ওপরের দিকে রেখে দোয়া করুন। এটা মুস্তাহাব।" }],
    qunutA: [{ en: "Qunut (in Fajr)", bn: "কুনুত (ফজরে)" }, { en: "In the second rak'ah of Fajr, after rising from bowing, raise the hands and recite the qunut dua. This is a recommended sunnah.", bn: "ফজরের দ্বিতীয় রাকাতে রুকু থেকে উঠে দুই হাত তুলে কুনুতের দোয়া পড়ুন। এটা একটা গুরুত্বপূর্ণ সুন্নাত।" }],
    last: [{ en: "Final sitting: tashahhud", bn: "শেষ বৈঠক: তাশাহহুদ" }, {
      sit: { en: "Sit on the left foot with the right foot upright. Recite the tashahhud, pointing with the right index finger at the testimony, then send blessings on the Prophet ﷺ and make dua.", bn: "বাম পায়ের ওপর বসুন, ডান পা খাড়া রাখুন। তাশাহহুদ পড়ুন, শাহাদাতের সময় ডান হাতের শাহাদাত আঙুল দিয়ে ইশারা করুন; তারপর নবী ﷺ-এর ওপর দরুদ পড়ে দোয়া করুন।" },
      tawarruk: { en: "Sit with the left hip on the ground, the left foot out to the right and the right foot upright (tawarruk). Recite the tashahhud, pointing with the right index finger, then send blessings on the Prophet ﷺ and make dua.", bn: "বাম নিতম্ব মাটিতে রেখে বসুন, বাম পা ডান দিকে বের করে দিন আর ডান পা খাড়া রাখুন (তাওয়াররুক)। তাশাহহুদ পড়ুন, ডান হাতের শাহাদাত আঙুল দিয়ে ইশারা করুন; তারপর নবী ﷺ-এর ওপর দরুদ পড়ে দোয়া করুন।" },
      jafari: { en: "Sit with the hands on the thighs and recite the tashahhud and the blessings on the Prophet ﷺ and his family.", bn: "দুই হাত ঊরুর ওপর রেখে বসুন, তাশাহহুদ পড়ুন আর নবী ﷺ ও তাঁর পরিবারের ওপর দরুদ পড়ুন।" } }, "Ash-hadu an la ilaha illa Allah…"],
    salamR: [{ en: "Salam to the right", bn: "ডান দিকে সালাম" }, { en: "Turn the face to the right and say the salam.", bn: "ডান দিকে মুখ ফিরিয়ে সালাম বলুন।" }, "As-salamu 'alaykum wa rahmatullah"],
    salamL: [{ en: "Salam to the left", bn: "বাম দিকে সালাম" }, { en: "Turn the face to the left and say the salam again. The prayer is complete.", bn: "বাম দিকে মুখ ফিরিয়ে আবার সালাম বলুন। নামাজ শেষ হলো।" }, "As-salamu 'alaykum wa rahmatullah"],
    salam1: [{ en: "Salam", bn: "সালাম" }, { en: "Say the salam once, beginning to the front and turning a little to the right. The prayer is complete.", bn: "একবার সালাম বলুন, সামনের দিক থেকে শুরু করে একটু ডানে মুখ ফিরিয়ে। নামাজ শেষ হলো।" }, "As-salamu 'alaykum"],
    salamJ: [{ en: "Salam", bn: "সালাম" }, { en: "Still facing the qibla, say the salam. The prayer is complete; saying the takbir three times afterwards, raising the hands each time, is recommended.", bn: "কিবলার দিকে মুখ রেখেই সালাম বলুন। নামাজ শেষ হলো; এরপর প্রতিবার হাত তুলে তিনবার তাকবির বলা মুস্তাহাব।" }, "As-salamu 'alaykum wa rahmatullahi wa barakatuh"]
  };
  const SAY_J = { ruku: "Subhana Rabbiyal-'Azimi wa bihamdih", sujud: "Subhana Rabbiyal-A'la wa bihamdih", sit: "Astaghfirullaha Rabbi wa atubu ilayh", rise: "Sami'a Allahu liman hamidah" };
  /* The steps of a two-rak'ah prayer for one school: [{ id, pose, via?, t:{en,bn}, d:{en,bn}, say?, finger?, turn?, turbah?, rk }] */
  function steps(school) {
    const c = CFG[school] || CFG.hanafi, J = school === "jafari", out = [];
    const add = (id, pose, d, x) => out.push(Object.assign({ id, pose, t: T[id][0], d, say: (J && SAY_J[id.replace(/2$/, "")]) || T[id][2] || "" }, x || {}));
    const sj = c.turbah ? T.sujud[1].turbah : T.sujud[1][c.down], sjx = { via: c.down, turbah: !!c.turbah };
    const rakah = n => {
      if (n === 1) add("qiyam", c.fold, T.qiyam[1][c.fold], { rk: 1 }); else add("qiyam2", c.fold, T.qiyam2[1], { rk: 2 });
      if (n === 2 && c.qunut === "before") add("qunutB", "qunut", T.qunutB[1], { rk: 2 });
      if (c.raf) add("raf", "shoulder", T.raf[1], { rk: n });
      add("ruku", "ruku", T.ruku[1], { rk: n });
      add("rise", c.raf ? "shoulder" : "stand", T.rise[1][c.raf ? "raf" : "plain"], { rk: n });
      if (n === 2 && c.qunut === "after") add("qunutA", "qunut", T.qunutA[1], { rk: 2 });
      add("sujud", "sujud", sj, Object.assign({ rk: n }, sjx));
      add("sit", c.sit, T.sit[1], { rk: n, turbah: !!c.turbah });
      add("sujud2", "sujud", T.sujud2[1], { rk: n, turbah: !!c.turbah });
    };
    add("stand", "stand", T.stand[1], { rk: 1 });
    add("takbir", c.takbir, T.takbir[1][c.takbir], { rk: 1 });
    rakah(1);
    add("up", "stand", T.up[1][school === "shafii" ? "rest" : "plain"], { rk: 2, via: "kneel" });
    rakah(2);
    add("last", c.last, T.last[1][J ? "jafari" : c.last], { rk: 2, finger: !J, turbah: !!c.turbah });
    if (c.salams === 2) { add("salamR", c.last, T.salamR[1], { rk: 2, turn: 1 }); add("salamL", c.last, T.salamL[1], { rk: 2, turn: -1 }); }
    else if (c.salams === 1) add("salam1", c.last, T.salam1[1], { rk: 2, turn: 1 });
    else add("salamJ", c.last, T.salamJ[1], { rk: 2, turbah: true });
    return out;
  }
  /* What is particular to each school, beyond what the figure shows. */
  const NOTES = {
    hanafi: [
      { en: "The hands are raised at the opening takbir only, to the level of the ears.", bn: "হাত তোলা হয় শুধু প্রথম তাকবিরে, কান বরাবর।" },
      { en: "Men place the right hand over the left below the navel; women are taught some positions differently, so ask a teacher.", bn: "পুরুষরা ডান হাত বাম হাতের ওপর রেখে নাভির নিচে বাঁধেন; নারীদের কিছু ভঙ্গি আলাদাভাবে শেখানো হয়, তাই একজন শিক্ষকের কাছে জেনে নিন।" },
      { en: "Behind an imam the follower listens and does not recite; “Ameen” is said quietly.", bn: "ইমামের পেছনে মুক্তাদি কিরাত পড়েন না, চুপ করে শোনেন; “আমিন” আস্তে বলা হয়।" },
      { en: "In the tashahhud the index finger is raised at the denial (“la ilaha”) and lowered at the affirmation (“illa Allah”).", bn: "তাশাহহুদে “লা ইলাহা” বলার সময় শাহাদাত আঙুল ওঠানো হয়, আর “ইল্লাল্লাহ” বলার সময় নামানো হয়।" },
      { en: "Two salams end the prayer.", bn: "দুই সালাম দিয়ে নামাজ শেষ হয়।" }],
    maliki: [
      { en: "The hands are raised at the opening takbir only, to the level of the shoulders.", bn: "হাত তোলা হয় শুধু প্রথম তাকবিরে, কাঁধ বরাবর।" },
      { en: "In the school's well-known position the arms hang at the sides (sadl) in obligatory prayers; folding the hands is also reported in the school.", bn: "মাযহাবের প্রসিদ্ধ মত অনুযায়ী ফরজ নামাজে দুই হাত দুই পাশে ছেড়ে রাখা হয় (সাদল); হাত বাঁধার কথাও মাযহাবে বর্ণিত আছে।" },
      { en: "The basmalah is not recited aloud before al-Fatihah in obligatory prayers.", bn: "ফরজ নামাজে আল-ফাতিহার আগে বিসমিল্লাহ জোরে পড়া হয় না।" },
      { en: "Going down, the hands reach the ground before the knees.", bn: "সিজদায় যাওয়ার সময় হাঁটুর আগে হাত মাটিতে রাখা হয়।" },
      { en: "Every sitting is tawarruk, and the index finger is moved gently from side to side during the tashahhud.", bn: "সব বৈঠকেই তাওয়াররুক করে বসা হয়, আর তাশাহহুদের সময় শাহাদাত আঙুল আস্তে আস্তে ডানে-বামে নাড়ানো হয়।" },
      { en: "In Fajr, qunut is recited quietly in the second rak'ah before bowing (recommended).", bn: "ফজরে দ্বিতীয় রাকাতে রুকুর আগে আস্তে কুনুত পড়া হয় (মুস্তাহাব)।" },
      { en: "One salam ends the prayer for the imam and for someone praying alone.", bn: "ইমাম আর একা নামাজ পড়া ব্যক্তির জন্য এক সালামেই নামাজ শেষ হয়।" }],
    shafii: [
      { en: "The hands are raised to the shoulders at the opening takbir, before bowing, on rising from bowing, and on standing up from the first tashahhud.", bn: "প্রথম তাকবিরে, রুকুতে যাওয়ার আগে, রুকু থেকে ওঠার সময় আর প্রথম তাশাহহুদ থেকে দাঁড়ানোর সময় দুই হাত কাঁধ বরাবর তোলা হয়।" },
      { en: "Al-Fatihah is recited in every rak'ah, also behind an imam; the basmalah is one of its verses.", bn: "প্রতি রাকাতে আল-ফাতিহা পড়া হয়, ইমামের পেছনেও; বিসমিল্লাহ এর একটা আয়াত।" },
      { en: "“Ameen” is said aloud in the prayers recited aloud.", bn: "যে নামাজে কিরাত জোরে পড়া হয়, সেখানে “আমিন” জোরে বলা হয়।" },
      { en: "A brief sitting of rest before standing for the next rak'ah is recommended.", bn: "পরের রাকাতের জন্য দাঁড়ানোর আগে অল্প একটু বসে নেওয়া মুস্তাহাব।" },
      { en: "Qunut is recited in the second rak'ah of Fajr, after rising from bowing.", bn: "ফজরের দ্বিতীয় রাকাতে রুকু থেকে ওঠার পর কুনুত পড়া হয়।" },
      { en: "The final sitting is tawarruk; the index finger is raised at “illa Allah” and kept raised without moving it.", bn: "শেষ বৈঠকে তাওয়াররুক করে বসা হয়; “ইল্লাল্লাহ” বলার সময় শাহাদাত আঙুল ওঠানো হয় আর না নাড়িয়ে উঠিয়ে রাখা হয়।" },
      { en: "The first salam is obligatory and the second is recommended.", bn: "প্রথম সালাম ফরজ, দ্বিতীয়টা সুন্নাত।" }],
    hanbali: [
      { en: "The hands are raised at the opening takbir, before bowing and on rising from bowing.", bn: "প্রথম তাকবিরে, রুকুতে যাওয়ার আগে আর রুকু থেকে ওঠার সময় হাত তোলা হয়।" },
      { en: "The right hand is placed over the left; below the navel is the school's relied-upon position, and other placements are accepted.", bn: "ডান হাত বাম হাতের ওপর রাখা হয়; মাযহাবের নির্ভরযোগ্য মত হলো নাভির নিচে, অন্য জায়গায় রাখাও গ্রহণযোগ্য।" },
      { en: "The basmalah is recited quietly; “Ameen” is said aloud in the prayers recited aloud.", bn: "বিসমিল্লাহ আস্তে পড়া হয়; যে নামাজে কিরাত জোরে পড়া হয়, সেখানে “আমিন” জোরে বলা হয়।" },
      { en: "Going down, the knees reach the ground before the hands.", bn: "সিজদায় যাওয়ার সময় হাতের আগে হাঁটু মাটিতে রাখা হয়।" },
      { en: "Tawarruk is for the last sitting of a prayer that has two tashahhuds; in a two-rak'ah prayer the sitting is on the left foot.", bn: "তাওয়াররুক শুধু সেই নামাজের শেষ বৈঠকে, যে নামাজে দুটো তাশাহহুদ আছে; দুই রাকাতের নামাজে বাম পায়ের ওপর বসা হয়।" },
      { en: "Both salams are required.", bn: "দুই সালামই জরুরি।" }],
    jafari: [
      { en: "The arms rest at the sides; the hands are not folded.", bn: "দুই হাত দুই পাশে ছেড়ে রাখা হয়; হাত বাঁধা হয় না।" },
      { en: "After al-Fatihah a complete surah is recited, and “Ameen” is not said after al-Fatihah.", bn: "আল-ফাতিহার পর একটা পূর্ণ সূরা পড়া হয়, আর আল-ফাতিহার পর “আমিন” বলা হয় না।" },
      { en: "The forehead is placed on earth, or on something that grows from it and is not eaten or worn; many people use a small clay tablet (turbah).", bn: "কপাল রাখা হয় মাটির ওপর, বা মাটি থেকে জন্মানো এমন কিছুর ওপর যা খাওয়া বা পরা হয় না; অনেকে মাটির ছোট একটা চাকতি (তুরবা) ব্যবহার করেন।" },
      { en: "Qunut in the second rak'ah, before bowing, is recommended in every prayer.", bn: "প্রতি নামাজে দ্বিতীয় রাকাতে রুকুর আগে কুনুত পড়া মুস্তাহাব।" },
      { en: "Saying the takbir with the hands raised before each change of position is recommended.", bn: "প্রতিবার অবস্থা বদলানোর আগে হাত তুলে তাকবির বলা মুস্তাহাব।" },
      { en: "The salam is said facing the qibla; three takbirs afterwards are recommended.", bn: "সালাম বলা হয় কিবলার দিকে মুখ রেখেই; এরপর তিনবার তাকবির বলা মুস্তাহাব।" }]
  };
  const SOURCES = {
    hanafi: ["al-Marghinani, Al-Hidayah", "ash-Shurunbulali, Nur al-Idah"],
    maliki: ["Ibn Abi Zayd al-Qayrawani, Ar-Risalah", "Khalil ibn Ishaq, Al-Mukhtasar"],
    shafii: ["an-Nawawi, Minhaj at-Talibin", "Ibn an-Naqib al-Misri, 'Umdat as-Salik"],
    hanbali: ["Ibn Qudamah, 'Umdat al-Fiqh", "al-Hajjawi, Zad al-Mustaqni'"],
    jafari: ["as-Sayyid 'Ali as-Sistani, Islamic Laws (Tawdih al-Masa'il)", "as-Sayyid Abu al-Qasim al-Khoei, Minhaj as-Salihin"]
  };
  return { SCHOOLS, NAMES, POSE, CFG, steps, mix, draw, joints, NOTES, SOURCES, G };
});
