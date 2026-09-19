// Service worker for 臺灣好好玩
const CACHE_NAME = 'taiwan-fun-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Let browser handle requests, fallback safely
  if (event.request.method === 'GET' && event.request.url.startsWith('http')) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
  }
});
