/* Islam Everyday — loads the app's scripts (18 Nov 2026, Notion: "make the opening smoother").
 * They used to be plain <script> tags after the splash. Their first run (reading about 250 KB of script and drawing
 * Today) is one long piece of work, and when it came right after the first painted frame the opening's animations had
 * not yet been handed to the phone's graphics chip: the opening stood still for about a third of a second at its start,
 * then jumped. In the Android app they are now added two frames after the opening is first painted, so its animations
 * are already playing on their own (they keep playing while the scripts run). On the website they are added at once.
 * Same files, same order (async = false keeps the order). */
(function () {
  var L = ["assets/quran-meta.js", "assets/data.js", "assets/votd.js", "assets/votd-en.js", "assets/votd-day.js", "assets/en-rwwad.js", "assets/locale.js", "assets/dayviz.js", "assets/bnfix.js", "assets/xtrack.js", "assets/glossary.js", "assets/heroes.js", "assets/sound.js", "assets/app.js"];
  var add = function () {
    for (var i = 0; i < L.length; i++) { var s = document.createElement("script"); s.src = L[i]; s.async = false; document.body.appendChild(s); }
  };
  if (!/(^|\s)native(\s|$)/.test(document.documentElement.className)) { add(); return; }
  try { requestAnimationFrame(function () { requestAnimationFrame(function () { setTimeout(add, 0); }); }); } catch (e) { add(); }
})();
