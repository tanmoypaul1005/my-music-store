// Service Worker: offline shell, static asset caching, audio caching with Range support
const VERSION = 'v2';
const SHELL_CACHE = `shell-${VERSION}`;
const STATIC_CACHE = `static-${VERSION}`;
const DATA_CACHE = `data-${VERSION}`;
const AUDIO_CACHE = 'audio-cache-v1'; // kept across versions: audio is large
const KNOWN = [SHELL_CACHE, STATIC_CACHE, DATA_CACHE, AUDIO_CACHE];
const OFFLINE_URL = '/offline.html';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((c) => c.addAll([OFFLINE_URL, '/favicon/icon-192.png', '/favicon/icon-512.png']))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => !KNOWN.includes(k)).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

const staleWhileRevalidate = async (request, cacheName) => {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const network = fetch(request)
    .then((res) => {
      if (res && (res.ok || res.type === 'opaque')) cache.put(request, res.clone());
      return res;
    })
    .catch(() => cached);
  return cached || network;
};

const cacheFirst = async (request, cacheName) => {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;
  const res = await fetch(request);
  if (res.ok) cache.put(request, res.clone());
  return res;
};

// Serve a (possibly partial) slice of a cached full response so seeking works offline
const rangeFromCache = async (request, cached) => {
  const range = request.headers.get('range');
  if (!range) return cached;
  const buf = await cached.arrayBuffer();
  const m = /bytes=(\d*)-(\d*)/.exec(range);
  const start = m && m[1] ? parseInt(m[1], 10) : 0;
  const end = m && m[2] ? Math.min(parseInt(m[2], 10), buf.byteLength - 1) : buf.byteLength - 1;
  return new Response(buf.slice(start, end + 1), {
    status: 206,
    statusText: 'Partial Content',
    headers: {
      'Content-Type': cached.headers.get('Content-Type') || 'audio/mpeg',
      'Content-Range': `bytes ${start}-${end}/${buf.byteLength}`,
      'Content-Length': String(end - start + 1),
      'Accept-Ranges': 'bytes',
    },
  });
};

const handleAudio = async (event) => {
  const { request } = event;
  const cache = await caches.open(AUDIO_CACHE);
  const key = new Request(request.url); // ignore Range header when matching
  const cached = await cache.match(key);
  if (cached) return rangeFromCache(request, cached);

  // Not cached yet: stream from network, and store the full file in the background
  event.waitUntil(
    fetch(key).then((res) => (res.ok ? cache.put(key, res) : null)).catch(() => {})
  );
  return fetch(request);
};

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);

  // Audio
  if (url.origin === self.location.origin && url.pathname.startsWith('/musics/')) {
    event.respondWith(handleAudio(event).catch(() => new Response('', { status: 503 })));
    return;
  }

  // Page navigations: network first, offline fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((res) => {
          if (res.ok) caches.open(SHELL_CACHE).then((c) => c.put(request, res.clone()));
          return res;
        })
        .catch(async () => (await caches.match(request)) || (await caches.match(OFFLINE_URL)))
    );
    return;
  }

  // Immutable build assets
  if (url.origin === self.location.origin && url.pathname.startsWith('/_next/static/')) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // Same-origin static files (images, fonts, icons)
  if (url.origin === self.location.origin && /\.(?:png|jpg|jpeg|webp|svg|ico|woff2?)$/.test(url.pathname)) {
    event.respondWith(staleWhileRevalidate(request, STATIC_CACHE));
    return;
  }

  // Remote API data and cover images
  if (url.origin !== self.location.origin) {
    event.respondWith(staleWhileRevalidate(request, DATA_CACHE));
  }
});
