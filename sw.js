const CACHE_NAME = 'gestionale-family-13.11.2026_10.48';
const LOCAL_ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './icona-app.jpg'
];

const EXTERNAL_ASSETS = [
    'https://cdn.tailwindcss.com',
    'https://unpkg.com/lucide@latest',
    'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
    'https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js',
    'https://unpkg.com/html5-qrcode',
    'https://unpkg.com/docx@7.8.2/build/index.js',
    'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.28/jspdf.plugin.autotable.min.js',
    'https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js',
    'https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js',
    'https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js'
];

// Helper fetch con timeout rapido per evitare blocchi con segnale assente o "finto" (es. dentro i supermercati)
const fetchWithTimeout = (request, timeoutMs = 2500) => {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error('Network timeout')), timeoutMs);
        fetch(request).then(
            (response) => {
                clearTimeout(timer);
                resolve(response);
            },
            (err) => {
                clearTimeout(timer);
                reject(err);
            }
        );
    });
};

self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then(async (cache) => {
            await cache.addAll(LOCAL_ASSETS);
            for (const url of EXTERNAL_ASSETS) {
                try {
                    const req = new Request(url, { mode: 'cors' });
                    const res = await fetch(req);
                    if (res.ok) {
                        await cache.put(url, res.clone());
                        if (res.url && res.url !== url) {
                            await cache.put(res.url, res.clone());
                        }
                    }
                } catch (e) {
                    try {
                        const reqNoCors = new Request(url, { mode: 'no-cors' });
                        const resNoCors = await fetch(reqNoCors);
                        await cache.put(url, resNoCors);
                    } catch (err) {}
                }
            }
        })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;
    
    const url = event.request.url;

    // Ignoriamo le chiamate API di Firebase (gestite dalla cache persistente IndexedDB di Firestore)
    if (url.includes('firestore.googleapis.com')) return;
    if (url.includes('identitytoolkit.googleapis.com')) return;
    if (url.includes('securetoken.googleapis.com')) return;

    const isSameOrigin = url.startsWith(self.location.origin);
    const isNavigate = event.request.mode === 'navigate';

    // 1. Per l'app principale (index.html e file locali): Network-First con timeout rapido (2.5s) e fallback sicuro su Cache
    if (isNavigate || isSameOrigin) {
        event.respondWith(
            (async () => {
                try {
                    const networkResponse = await fetchWithTimeout(event.request, 2500);
                    if (networkResponse && networkResponse.status === 200) {
                        const cache = await caches.open(CACHE_NAME);
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    }
                } catch (err) {
                    // Timeout o assenza di rete: procediamo subito con la cache
                }

                const cachedRes = (await caches.match(event.request, { ignoreSearch: false }))
                               || (await caches.match(event.request, { ignoreSearch: true }));
                if (cachedRes) return cachedRes;

                if (isNavigate) {
                    return (await caches.match('./index.html'))
                        || (await caches.match('index.html'))
                        || (await caches.match('./'));
                }
                return Response.error();
            })()
        );
        return;
    }

    // 2. Per le librerie esterne (CDN Tailwind, Lucide, Firebase SDK, Font): Cache-First istantaneo (0ms offline) + aggiornamento in background
    event.respondWith(
        (async () => {
            const cachedRes = (await caches.match(event.request, { ignoreSearch: false }))
                           || (await caches.match(event.request, { ignoreSearch: true }));
            if (cachedRes) {
                // Aggiorna in background senza bloccare l'apertura dell'app
                fetchWithTimeout(event.request, 4000).then(async (netRes) => {
                    if (netRes && (netRes.status === 200 || netRes.type === 'opaque')) {
                        const cache = await caches.open(CACHE_NAME);
                        cache.put(event.request, netRes.clone());
                    }
                }).catch(() => {});
                return cachedRes;
            }

            try {
                const netRes = await fetchWithTimeout(event.request, 4000);
                if (netRes && (netRes.status === 200 || netRes.type === 'opaque')) {
                    const cache = await caches.open(CACHE_NAME);
                    cache.put(event.request, netRes.clone());
                }
                return netRes;
            } catch (err) {
                return Response.error();
            }
        })()
    );
});
