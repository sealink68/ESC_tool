/* sw.js – minimal service worker so ESC_tool can be installed as a desktop app (PWA).
   - Caches the app shell (same-origin GET only).
   - Network-first for HTML / JS / CSS / manifest (updates come through; cache = offline fallback),
     cache-first for images.
   - Never touches the File System Access API or IndexedDB: those are not fetches, and anything that is not a
     same-origin GET inside this scope (blob:, data:, POST, Range requests, other origins) is left to the browser.
   Bump CACHE_VERSION whenever the shell list changes. */
"use strict";
var CACHE_VERSION = "esc-shell-v1";
var SHELL = [
  "./", "index.html", "manifest.webmanifest", "favicon.ico", "css/style.css",
  "js/vendor/jspdf.umd.min.js", "js/config.js", "js/models.js", "js/i18n.js", "js/storage.js", "js/fsx.js",
  "js/pdf.js", "js/ui/common.js", "js/ui/screens.js", "js/app.js",
  "img/logo-full.svg", "img/logo-mark.svg", "img/help/example-plate.jpg", "img/help/example-protocol.jpg",
  "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-192.png", "icons/icon-maskable-512.png", "icons/apple-touch-icon.png"
];
self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE_VERSION).then(function (c) {
    // one by one: a single missing file must not block the install
    return Promise.all(SHELL.map(function (u) { return c.add(new Request(u, { cache: "reload" })).catch(function () {}); }));
  }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k.indexOf("esc-shell-") === 0 && k !== CACHE_VERSION; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
function put(req, res) {
  if (res && res.ok && res.type === "basic") { var copy = res.clone(); caches.open(CACHE_VERSION).then(function (c) { return c.put(req, copy); }).catch(function () {}); }
  return res;
}
self.addEventListener("fetch", function (e) {
  var req = e.request, url;
  if (req.method !== "GET" || req.headers.has("range")) return;
  try { url = new URL(req.url); } catch (x) { return; }
  if (url.origin !== self.location.origin || url.href.indexOf(self.registration.scope) !== 0) return;
  var path = url.pathname, img = /\.(png|jpe?g|svg|ico|webp|gif)$/i.test(path);
  if (img) {
    e.respondWith(caches.match(req).then(function (hit) { return hit || fetch(req).then(function (r) { return put(req, r); }); }));
    return;
  }
  // network-first (revalidate with the server, bypassing a stale HTTP cache); offline -> cached copy
  var key = req.mode === "navigate" ? new Request(url.origin + url.pathname) : req;
  e.respondWith(fetch(new Request(req.url, { cache: "no-cache", credentials: "same-origin" })).then(function (r) { return put(key, r); }, function () {
    return caches.match(key, { ignoreSearch: req.mode === "navigate" }).then(function (hit) {
      if (hit || req.mode !== "navigate") return hit || Response.error();
      return caches.match("./").then(function (h2) { return h2 || Response.error(); });
    });
  }));
});
