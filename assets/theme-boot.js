/* Islam Everyday — appearance before first paint (Phase 5.3, Face 7 themes).
 * Runs in <head> before the stylesheet applies, so the page never flashes the wrong colours.
 * Mode (st.mode: system | light | dark) picks the appearance; each appearance remembers its own theme:
 * st.lightTheme (classic | sky | sandstone) and st.darkTheme (jade | indigo | teal); Nov 2026: emerald → sky, plum → teal.
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
  else if (lt !== "classic" && lt !== "sky" && lt !== "sandstone") lt = pal === "emerald" ? "sky" : pal === "sandstone" ? pal : (st.palette || old) ? "classic" : "sandstone";
  if (dt === "plum") dt = "teal";
  else if (dt !== "jade" && dt !== "indigo" && dt !== "teal") dt = pal === "indigo" ? "indigo" : pal === "burgundy" ? "teal" : "jade";
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
  // Android app (Nov 2026): app-only styles, and the splash holds its first frame until Android's launch screen fades (app.js).
  try { if (window.Capacitor && Capacitor.isNativePlatform && Capacitor.isNativePlatform()) r.className += " native sp-hold"; } catch (e) {}
  // Nov 2026 (13th): the first open in a session (a cold start in the app) plays the full five-second opening.
  try { if (!sessionStorage.getItem("ie.splash")) r.className += " sp-long"; } catch (e) {}
})();
