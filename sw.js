const CACHE_NAME = 'gestionale-family-10.11.2026_21.00';
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
    'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js',
    'https://unpkg.com/docx@7.8.2/build/index.js',
    'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.28/jspdf.plugin.autotable.min.js',
    'https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js',
    'https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js',
    'https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js'
];

self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then(async (cache) => {
            await cache.addAll(LOCAL_ASSETS);
            for (const url of EXTERNAL_ASSETS) {
                try {
                    const req = new Request(url, { mode: 'cors' });
                    const res = await fetch(req);
                    if (res.ok) await cache.put(req, res);
                } catch (e) {
                    try {
                        const reqNoCors = new Request(url, { mode: 'no-cors' });
                        const resNoCors = await fetch(reqNoCors);
                        await cache.put(reqNoCors, resNoCors);
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
    
    // Ignoriamo le chiamate API di Firebase (gestite dalla cache persistente di Firestore)
    if (event.request.url.includes('firestore.googleapis.com')) return;
    if (event.request.url.includes('identitytoolkit.googleapis.com')) return;
    if (event.request.url.includes('securetoken.googleapis.com')) return;

    // Strategia Network-First con fallback intelligente sulla cache per funzionamento Offline totale (Cold Start)
    event.respondWith(
        fetch(event.request).then((response) => {
            if (response && (response.status === 200 || response.type === 'opaque')) {
                const resClone = response.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, resClone);
                });
            }
            return response;
        }).catch(async () => {
            const cachedRes = await caches.match(event.request, { ignoreSearch: false });
            if (cachedRes) return cachedRes;
            if (event.request.mode === 'navigate') {
                return caches.match('./index.html') || caches.match('./');
            }
            return caches.match(event.request, { ignoreSearch: true });
        })
    );
});
