/* Islam Everyday — appearance before first paint (Phase 5.3).
 * Runs in <head> before the stylesheet applies, so the page never flashes the wrong colours.
 * Appearance mode (st.mode: system | light | dark) and colour palette (st.palette) are separate settings.
 * Older saved settings (st.theme from Phase 5.2) are read the same way app.js migrates them. */
(function () {
  var r = document.documentElement, st = {};
  try { st = JSON.parse(localStorage.getItem("dinsathi.web.v1") || "{}") || {}; } catch (e) {}
  var old = st.theme, mode = st.mode, pal = st.palette;
  if (!mode) mode = old === "light" || old === "dark" ? old : old === "emerald" ? "light" : old === "indigo" ? "dark" : "system";
  if (!pal) pal = old === "emerald" || old === "indigo" ? old : "classic";
  // A host app (the Android wrapper) may set data-theme before this runs; keep it as the "system" answer.
  var host = r.getAttribute("data-host-theme") || r.getAttribute("data-theme");
  if (host) r.setAttribute("data-host-theme", host);
  var dark = mode === "dark" || (mode === "system" && (host ? host === "dark" : !!(window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches)));
  r.setAttribute("data-theme", dark ? "dark" : "light");
  if (pal && pal !== "classic") r.setAttribute("data-palette", pal); else r.removeAttribute("data-palette");
  r.style.colorScheme = dark ? "dark" : "light";
})();
