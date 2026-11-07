const scope = self.registration.scope;
const cacheName = 'ideco-template-pwa:' + scope;
const offlineUrl = new URL('ideco-offline.html', scope).href;
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(cacheName);
    try { await cache.add(offlineUrl); } catch {}
    await self.skipWaiting();
  })());
});
self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || request.mode !== 'navigate' || !request.url.startsWith(scope)) return;
  event.respondWith(fetch(request).catch(async () =>
    (await caches.open(cacheName)).match(offlineUrl).then(response =>
      response || new Response('Vui lòng kết nối Internet rồi mở lại.', {
        status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      })
    )
  ));
});
