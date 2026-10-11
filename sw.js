/* Islam Everyday service worker.
 * App code (HTML, JS, CSS): network first, cache fallback, so a running server always serves the newest code
 * and the cached copy is only used offline.
 * Qur'an data and fonts: cache first (they only change with a new DATA version), cached as they are used.
 * Nothing outside this site is fetched or cached. */
const APP = "islam-everyday-app-v4", DATA = "islam-everyday-data-v4";
const CORE = ["./", "index.html", "assets/app.css", "assets/fonts.css", "assets/app.js", "assets/data.js", "assets/quran-meta.js",
  "assets/votd.js", "assets/names.js", "assets/guide.js", "manifest.webmanifest", "favicon.ico",
  "icons/icon-192.png", "icons/icon-512.png", "icons/maskable-192.png", "icons/maskable-512.png", "icons/apple-touch-icon.png", "icons/favicon.svg",
  "assets/fonts/hind-siliguri-bengali-400-normal.woff2", "assets/fonts/hind-siliguri-latin-400-normal.woff2",
  "assets/fonts/hind-siliguri-bengali-600-normal.woff2", "assets/fonts/hind-siliguri-latin-600-normal.woff2",
  "assets/fonts/scheherazade-new-arabic-400-normal.woff2", "data/quran/editions.json"];
self.addEventListener("install", e => { e.waitUntil(caches.open(APP).then(c => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== APP && k !== DATA).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("message", e => {
  // "Save the whole Qur'an for offline": the page sends the list of files to store.
  if (e.data && e.data.type === "cache-data" && Array.isArray(e.data.urls)) {
    const urls = e.data.urls.filter(u => /^data\/quran\/(ar|en|bn)\/\d{3}\.json$/.test(u));
    e.waitUntil(caches.open(DATA).then(async c => {
      let done = 0;
      for (const u of urls) { if (!(await c.match(u))) { try { const r = await fetch(u); if (r.ok) await c.put(u, r); } catch (err) { /* offline: skip */ } } done++; if (done % 10 === 0 || done === urls.length) e.source && e.source.postMessage({ type: "cache-progress", done, total: urls.length }); }
    }));
  }
});
self.addEventListener("fetch", e => {
  const r = e.request; if (r.method !== "GET") return;
  const u = new URL(r.url);
  if (u.origin !== location.origin) return;
  const path = u.pathname;
  if (/\/data\/quran\/|\/assets\/fonts\//.test(path)) {
    e.respondWith(caches.open(DATA).then(c => c.match(r, { ignoreSearch: true }).then(m => m || caches.match(r).then(m2 => m2 || fetch(r).then(res => { if (res.ok) c.put(r, res.clone()); return res; })))));
    return;
  }
  const key = r.mode === "navigate" ? "index.html" : r;
  e.respondWith(fetch(r).then(res => { if (res.ok) { const cl = res.clone(); caches.open(APP).then(c => c.put(key, cl)); } return res; })
    .catch(() => caches.match(key).then(m => m || caches.match(r))));
});
