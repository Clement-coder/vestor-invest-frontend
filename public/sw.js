const CACHE = 'vestor-v1'
const STATIC = ['/manifest.json', '/icon-192x192.png', '/icon-512x512.png']

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(STATIC)))
  self.skipWaiting()
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (e) => {
  // Only cache GET requests; skip API, Supabase, Firebase, CoinGecko
  const url = new URL(e.request.url)
  if (
    e.request.method !== 'GET' ||
    url.pathname.startsWith('/api/') ||
    url.hostname.includes('supabase') ||
    url.hostname.includes('firebase') ||
    url.hostname.includes('coingecko')
  ) return

  e.respondWith(
    fetch(e.request)
      .then(res => {
        // Cache successful static asset responses
        if (res.ok && (url.pathname.match(/\.(png|ico|svg|webp|woff2?)$/) || url.pathname === '/manifest.json')) {
          const clone = res.clone()
          caches.open(CACHE).then(c => c.put(e.request, clone))
        }
        return res
      })
      .catch(() => caches.match(e.request))
  )
})
