const CACHE_NAME = 'gestionale-family-10.11.2026_10.53';
const ASSETS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/icona-app.jpg'
];

self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;
    // Ignoriamo le chiamate alle API di Firebase per lasciar gestire la sincronizzazione e cache locale a Firestore
    if (event.request.url.includes('firestore.googleapis.com')) return;
    if (event.request.url.includes('identitytoolkit.googleapis.com')) return;

    // Strategia Network-First per l'interfaccia: prova a scaricare la versione più aggiornata, se fallisce (offline) usa la cache
    event.respondWith(
        fetch(event.request).then((response) => {
            return caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, response.clone());
                return response;
            });
        }).catch(() => {
            return caches.match(event.request);
        })
    );
});
