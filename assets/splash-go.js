/* Islam Everyday — Android app: start the opening as soon as it is on screen (15 Nov 2026).
 * Loaded right after the splash markup, before the larger scripts. The splash is painted before app.js runs, but it
 * used to wait, frozen on the bare doorway, until app.js had run and drawn Today: on a phone that felt stuck, then the
 * sun "popped". Now, two frames after the splash is painted (so Android's launch screen hands over to a drawn page,
 * never an empty one), Android's launch screen is hidden and the opening starts. Its animations are opacity and
 * transform only, so they keep playing smoothly while app.js loads underneath. app.js times the four seconds from here
 * (window.__spT0). On the web (no sp-hold) this does nothing. */
(function () {
  var h = document.documentElement;
  if (!/(^|\s)sp-hold(\s|$)/.test(h.className)) return;
  var go = function () {
    if (window.__spT0) return; // app.js got there first
    window.__spT0 = performance.now();
    try { var q = window.Capacitor.nativePromise("SplashScreen", "hide", { fadeOutDuration: 150 }); if (q && q.catch) q.catch(function () {}); } catch (e) {}
    h.classList.remove("sp-hold");
  };
  try { requestAnimationFrame(function () { requestAnimationFrame(go); }); } catch (e) { go(); }
})();
