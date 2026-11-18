/* Islam Everyday — Android app: the opening's clock (18 Nov 2026).
 * Loaded right after the splash markup, before the larger scripts. The opening plays from its first painted frame
 * (Android's launch screen is the plain ground colour and ends as soon as the app draws), so this only notes when that
 * frame was (window.__spT0, which app.js times the four seconds from) and makes sure Android's launch screen is gone.
 * On the web it does nothing. */
(function () {
  var h = document.documentElement;
  if (!/(^|\s)native(\s|$)/.test(h.className)) return;
  var go = function () {
    if (window.__spT0) return; // app.js got there first
    window.__spT0 = performance.now();
    try { var q = window.Capacitor.nativePromise("SplashScreen", "hide", { fadeOutDuration: 0 }); if (q && q.catch) q.catch(function () {}); } catch (e) {}
  };
  try { requestAnimationFrame(go); } catch (e) { go(); }
})();
