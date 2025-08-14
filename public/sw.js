const CACHE_NAME = 'file-fab-forge-v2';

// Resolve URLs relative to the SW registration scope so it works under subpaths
const scopePathname = new URL('./', self.registration.scope).pathname;
const withBase = (path) => `${scopePathname.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`;

// Only include files that actually exist in dist by default
const urlsToCache = [
  withBase(''), // scope root (e.g. / or /subpath/)
  withBase('manifest.json'),
  withBase('robots.txt'),
  withBase('sitemap.xml'),
  withBase('uploads/logo2.jpg'),
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    // Add each resource independently so one failure does not fail the entire install
    await Promise.all(
      urlsToCache.map(async (url) => {
        try {
          await cache.add(url);
        } catch (err) {
          // Silently skip missing/blocked resources to avoid noisy logs
        }
      })
    );
    self.skipWaiting();
  })());
});

// Fetch event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

