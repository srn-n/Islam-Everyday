/* Islam Everyday — appearance before first paint (Phase 5.3, Face 7 themes).
 * Runs in <head> before the stylesheet applies, so the page never flashes the wrong colours.
 * Mode (st.mode: system | light | dark) picks the appearance; each appearance remembers its own theme:
 * st.lightTheme (classic | emerald | sandstone) and st.darkTheme (jade | indigo | plum).
 * Older saved settings are read the same way app.js migrates them: Phase 5.2 st.theme and Phase 5.3 st.palette
 * (emerald/sandstone → that light theme, indigo → Indigo Moon, burgundy → Plum Dusk).
 * Also applies st.glass (subtle | balanced | high | solid) and st.motion (off | subtle | playful). */
(function () {
  var r = document.documentElement, st = {};
  try { st = JSON.parse(localStorage.getItem("dinsathi.web.v1") || "{}") || {}; } catch (e) {}
  var old = st.theme, mode = st.mode, pal = st.palette;
  if (mode !== "system" && mode !== "light" && mode !== "dark") mode = old === "light" || old === "dark" ? old : old === "emerald" ? "light" : old === "indigo" ? "dark" : "system";
  if (!pal) pal = old === "emerald" || old === "indigo" ? old : "classic";
  var lt = st.lightTheme, dt = st.darkTheme;
  if (lt !== "classic" && lt !== "emerald" && lt !== "sandstone") lt = pal === "emerald" || pal === "sandstone" ? pal : "classic";
  if (dt !== "jade" && dt !== "indigo" && dt !== "plum") dt = pal === "indigo" ? "indigo" : pal === "burgundy" ? "plum" : "jade";
  // A host app (the Android wrapper) may set data-theme before this runs; keep it as the "system" answer.
  var host = r.getAttribute("data-host-theme") || r.getAttribute("data-theme");
  if (host) r.setAttribute("data-host-theme", host);
  var dark = mode === "dark" || (mode === "system" && (host ? host === "dark" : !!(window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches)));
  var th = dark ? dt : lt;
  r.setAttribute("data-theme", dark ? "dark" : "light");
  if (th !== "classic" && th !== "jade") r.setAttribute("data-palette", th); else r.removeAttribute("data-palette");
  var gl = st.glass, mo = st.motion;
  r.setAttribute("data-glass", gl === "subtle" || gl === "high" || gl === "solid" ? gl : "balanced");
  r.setAttribute("data-motion", mo === "off" || mo === "playful" ? mo : "subtle");
  r.style.colorScheme = dark ? "dark" : "light";
})();
