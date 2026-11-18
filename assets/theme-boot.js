/* Islam Everyday — appearance before first paint (Phase 5.3, Face 7 themes).
 * Runs in <head> before the stylesheet applies, so the page never flashes the wrong colours.
 * Mode (st.mode: system | light | dark) picks the appearance; each appearance remembers its own theme:
 * st.lightTheme (classic | sky | sandstone | sage | rose) and st.darkTheme (jade | indigo | teal | ember | violet; the
 * last two of each added 17 Nov 2026); Nov 2026: emerald → sky, plum → teal.
 * Older saved settings are read the same way app.js migrates them: Phase 5.2 st.theme and Phase 5.3 st.palette
 * (emerald/sandstone → that light theme, indigo → Indigo Moon, burgundy → Plum Dusk).
 * Also applies st.glass (subtle | balanced | high | solid) and st.motion (off | subtle = Slide | fade). */
(function () {
  var r = document.documentElement, st = {};
  try { st = JSON.parse(localStorage.getItem("dinsathi.web.v1") || "{}") || {}; } catch (e) {}
  var old = st.theme, mode = st.mode, pal = st.palette;
  if (mode !== "system" && mode !== "light" && mode !== "dark") mode = old === "light" || old === "dark" ? old : old === "emerald" ? "light" : old === "indigo" ? "dark" : "system";
  if (!pal) pal = old === "emerald" || old === "indigo" ? old : "classic";
  var lt = st.lightTheme, dt = st.darkTheme;
  // Nov 2026: Emerald Ivory → Sky Blue, Plum Dusk (and the older Burgundy) → Deep Teal.
  if (lt === "emerald") lt = "sky";
  // Nov 2026 (13th): a new install starts on Sandstone Teal; settings saved before keep their light theme.
  else if (["classic", "sky", "sandstone", "sage", "rose"].indexOf(lt) < 0) lt = pal === "emerald" ? "sky" : pal === "sandstone" ? pal : (st.palette || old) ? "classic" : "sandstone";
  if (dt === "plum") dt = "teal";
  else if (["jade", "indigo", "teal", "ember", "violet"].indexOf(dt) < 0) dt = pal === "indigo" ? "indigo" : pal === "burgundy" ? "teal" : "jade";
  // A host app (the Android wrapper) may set data-theme before this runs; keep it as the "system" answer.
  var host = r.getAttribute("data-host-theme") || r.getAttribute("data-theme");
  if (host) r.setAttribute("data-host-theme", host);
  var dark = mode === "dark" || (mode === "system" && (host ? host === "dark" : !!(window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches)));
  var th = dark ? dt : lt;
  r.setAttribute("data-theme", dark ? "dark" : "light");
  if (th !== "classic" && th !== "jade") r.setAttribute("data-palette", th); else r.removeAttribute("data-palette");
  var gl = st.glass, mo = st.motion;
  r.setAttribute("data-glass", gl === "subtle" || gl === "high" || gl === "solid" ? gl : "balanced");
  r.setAttribute("data-motion", mo === "off" || mo === "fade" ? mo : "subtle"); // "playful" was removed (Nov 2026): Slide
  r.style.colorScheme = dark ? "dark" : "light";
  // the page's blank canvas (before any style applies) follows the chosen appearance too, not the device's
  try { var cs = document.querySelector('meta[name="color-scheme"]'); if (cs) cs.setAttribute("content", dark ? "dark" : "light"); } catch (e) {}
  // Nov 2026: the splash shows its one line of text in the chosen language before app.js runs.
  r.setAttribute("data-lang", st.lang === "bn" ? "bn" : "en");
  // Android app: app-only styles. 18 Nov 2026 (Notion: "start the animation right away on tap, no picture first;
  // the start must always match the theme"): Android's launch screen is now the theme's ground with no icon and ends as
  // soon as the app draws, so the opening plays from its first frame (no more waiting under the launch screen, and no
  // easing in from Android's default colour, which showed the wrong theme for a moment on Android 12).
  try { if (window.Capacitor && Capacitor.isNativePlatform && Capacitor.isNativePlatform()) {
    r.className += " native";
    // 19 Nov 2026 (Notion): the phone's status bar icons in the theme's own light or dark from the very first frame
    // (before, they followed the phone until app.js ran). MainActivity sets them natively too.
    try { var q = Capacitor.nativePromise("SystemBars", "setStyle", { style: dark ? "DARK" : "LIGHT" }); if (q && q.catch) q.catch(function () {}); } catch (e) {}
    // 19 Nov 2026 (Notion: "when the phone reloads the app shortly after it was last used, a sandal-coloured page comes
    // up for a second; give that a very quick opening in the theme"): if the app was in use in the last 30 minutes
    // (Android closed it in the background, or the page reloaded), the opening is a short one (html.sp-quick, app.css):
    // the finished doorway fades in and opens at once, instead of the four-second opening. "ie.seen" is only a time.
    var seen = 0; try { seen = +localStorage.getItem("ie.seen") || 0; } catch (e) {}
    if (seen && Date.now() - seen < 18e5) r.className += " sp-quick";
  } } catch (e) {}
})();
