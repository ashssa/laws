// 將 CACHE_NAME 設為一個佔位符，讓自動化腳本替換
const CACHE_NAME = 'my-pwa-cache-v-162574b'; // 注意這裡的 162574b
const urlsToCache = [
'../laws/',
'../laws/index.html',
'../laws/css/styles.css',
'../laws/js/script.js',
'../laws/act/act01.html',
'../laws/act/act02.html',
'../laws/act/act03.html',
'../laws/act/act04.html',
'../laws/act/act05.html',
'../laws/act/act06.html',
'../laws/act/act07.html',
'../laws/act/act08.html',
'../laws/direction/direction01.html',
'../laws/direction/direction02.html',
];

// 安裝 Service Worker
self.addEventListener('install', (event) => {
event.waitUntil(
    caches.open(CACHE_NAME)
    .then((cache) => {
        console.log('Opened cache:', CACHE_NAME);
        return cache.addAll(urlsToCache);
    })
);
});

// 攔截網路請求並返回緩存的資源
self.addEventListener('fetch', (event) => {
event.respondWith(
    caches.match(event.request)
    .then((response) => {
        if (response) {
        return response;
        }
        return fetch(event.request);
    })
);
});

// 清理舊的緩存
self.addEventListener('act/activate', (event) => {
const cacheWhitelist = [CACHE_NAME];
event.waitUntil(
    caches.keys().then((cacheNames) => {
    return Promise.all(
        cacheNames.map((cacheName) => {
        if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
        }
        })
    );
    })
);
});
