const CACHE = "tps-notes-v28";
const FILES = ["./", "./index.html", "./duck.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png"];

// Always pull fresh copies (skip the browser's HTTP cache) when installing
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(FILES.map(f =>
    c.add(new Request(f, { cache: "reload" })).catch(() => {})       // a missing file never blocks the update
  ))));
  self.skipWaiting();
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;     // map tiles, Google, Supabase: let the browser handle them normally

  // Shared text arrives in the address (?text=...). Long shares make the address too long for
  // GitHub's server ("URI Too Long"), so answer these from the copy saved on the phone instead.
  if (e.request.mode === "navigate" && (url.searchParams.has("text") || url.searchParams.has("title"))) {
    e.respondWith(caches.match("./").then(r => r || fetch("./", { cache: "no-store" })));
    return;
  }
  // Each page is saved under its own name (the main app under "./")
  const isMain = /\/(index\.html)?$/.test(url.pathname);
  const key = e.request.mode === "navigate" ? (isMain ? "./" : "." + url.pathname.slice(url.pathname.lastIndexOf("/"))) : e.request;

  // Network first (so updates show up right away), saved copy when offline
  e.respondWith(
    fetch(e.request, { cache: "no-store" })
      .then(res => {
        if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(key, copy)); }
        return res;
      })
      .catch(() => caches.match(key, { ignoreSearch: true })
        .then(r => r || (e.request.mode === "navigate" ? caches.match("./") : undefined)))
  );
});
