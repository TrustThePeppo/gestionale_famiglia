// sv.js - Service Worker per GestioneFamiliare
// Manteniamo la struttura standard per il funzionamento offline
const CACHE_NAME = 'gestione-familiare-cache-v2';
const urlsToCache = [
  '/',
  '/index.html',
  // Inserisci qui le altre risorse necessarie per il funzionamento offline
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aperta');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
