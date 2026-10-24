/* Islam Everyday service worker.
 * App code (HTML, JS, CSS): network first, cache fallback, so a running server always serves the newest code
 * and the cached copy is only used offline.
 * Qur'an data and fonts: cache first, cached as they are used. They only change with a new DATA version, so any change
 * to data/quran/ must come with a new DATA name (npm test checks DATA_REV against the data).
 * Only this app's own caches (islam-everyday-*, and the earlier dinsathi-*) are ever deleted: other apps served from
 * the same origin (for example other GitHub Pages projects) keep theirs.
 * Nothing outside this site is fetched or cached. */
const DATA_REV = "d4ab4a46286f"; // fingerprint of data/quran/**/*.json (except coverage.json) for this DATA version
const APP = "islam-everyday-app-v6", DATA = "islam-everyday-data-v6";
const OWN = /^(islam-everyday|dinsathi)-/;
const CORE = ["./", "index.html", "assets/app.css", "assets/fonts.css", "assets/app.js", "assets/data.js", "assets/quran-meta.js",
  "assets/votd.js", "assets/votd-en.js", "assets/locale.js", "assets/dayviz.js", "assets/zakat.js", "assets/theme-boot.js", "assets/names.js", "assets/guide.js", "assets/bnfix.js", "assets/xtrack.js", "assets/hadith.js", "assets/nawawi.js", "assets/glossary.js", "manifest.webmanifest", "favicon.ico",
  "icons/icon-192.png", "icons/icon-512.png", "icons/maskable-192.png", "icons/maskable-512.png", "icons/apple-touch-icon.png", "icons/favicon.svg",
  "assets/fonts/hind-siliguri-bengali-400-normal.woff2", "assets/fonts/hind-siliguri-latin-400-normal.woff2",
  "assets/fonts/hind-siliguri-bengali-600-normal.woff2", "assets/fonts/hind-siliguri-latin-600-normal.woff2",
  "assets/fonts/scheherazade-new-arabic-400-normal.woff2", "data/quran/editions.json"];
// cache: "reload" bypasses the browser's HTTP cache, so an update never precaches a stale copy.
self.addEventListener("install", e => { e.waitUntil(caches.open(APP).then(c => c.addAll(CORE.map(u => new Request(u, { cache: "reload" })))).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => OWN.test(k) && k !== APP && k !== DATA).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("message", e => {
  // "Save the whole Qur'an for offline": the page sends the list of files to store.
  if (e.data && e.data.type === "cache-data" && Array.isArray(e.data.urls)) {
    const urls = e.data.urls.filter(u => /^data\/quran\/(ar|en|bn|bnt)\/\d{3}\.json$/.test(u));
    e.waitUntil(caches.open(DATA).then(async c => {
      let done = 0, failed = 0;
      for (const u of urls) { if (!(await c.match(u))) { try { const r = await fetch(u, { cache: "no-cache" }); if (r.ok) await c.put(u, r); else failed++; } catch (err) { failed++; /* offline */ } } done++; if (done % 10 === 0 || done === urls.length) e.source && e.source.postMessage({ type: "cache-progress", done, total: urls.length, failed }); }
    }));
  }
});
self.addEventListener("fetch", e => {
  const r = e.request; if (r.method !== "GET") return;
  const u = new URL(r.url);
  if (u.origin !== location.origin) return;
  const path = u.pathname;
  if (/\/data\/quran\/|\/assets\/fonts\//.test(path)) {
    e.respondWith(caches.open(DATA).then(c => c.match(r, { ignoreSearch: true }).then(m => m || caches.match(r).then(m2 => m2 || fetch(r, { cache: "no-cache" }).then(res => { if (res.ok) c.put(r, res.clone()); return res; })))));
    return;
  }
  const key = r.mode === "navigate" ? "index.html" : r;
  e.respondWith(fetch(r).then(res => { if (res.ok) { const cl = res.clone(); caches.open(APP).then(c => c.put(key, cl)); } return res; })
    .catch(() => caches.match(key).then(m => m || caches.match(r))));
});
