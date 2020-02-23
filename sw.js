/**
 * Some code from the following sources
 *https://developers.google.com/web/fundamentals/primers/service-workers/
 * https://developers.google.com/web/updates/2015/09/updates-to-cache-api
 **/

const version = 'v2';
const cacheName = `MWS_rest1-${version}`;

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(cacheName).then(cache => {
            return cache.addAll([
                '/',
                '/restaurant.html',
                '/css/styles.css',
                '/js/dbhelper.js',
                '/js/main.js',
                '/js/restaurant_info.js',
                '/js/register-sw.js', 
                '/js/dbhelper.js',
                '/data/restaurants.json',
                '/img/1.jpg',
                '/img/2.jpg',
                '/img/3.jpg',
                '/img/4.jpg',
                '/img/5.jpg',
                '/img/6.jpg',
                '/img/7.jpg',
                '/img/8.jpg',
                '/img/9.jpg',
                '/img/10.jpg',
                'sw.js'
                
            ]);
        })
    );
});

self.addEventListener('activate', event => {
    const cacheWhitelist = [cacheName];
    //  Delete previous caches
    event.waitUntil(
        caches.keys().then(keyList => {
            return Promise.all(keyList.map(key => {
                if (cacheWhitelist.indexOf(`${version}`) === -1) {
                    return caches.delete(key);
                }
            }));
        })
    );
});
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.open(cacheName)
        .then(cache => cache.match(event.request)) //, {ignoreSearch: true}))
        .then(response => {
            if (response) {
                return response;
            }

            const fetchRequest = event.request.clone();

            return fetch(fetchRequest).then(
                response => {
                    // Check if we received a valid response
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }
                    const responseToCache = response.clone();
                    caches.open(cacheName)
                        .then(cache => {
                            cache.put(event.request, responseToCache);
                        });

                    return response;
                }
            );
        })
    );
});

self.addEventListener('restaurant', event => {
    if (event.data.action === 'skipWaiting') {
        self.skipWaiting();
    }
});


// const appName = "restaurant-reviews"
// const staticCacheName = appName + "-v1.0";

// const contentImgsCache = appName + "-images";

// let  allCaches = [
//     staticCacheName,
//     contentImgsCache
// ];

// /** At Service Worker Install time, cache all static assets */
// self.addEventListener('install', function (event) {
//     event.waitUntil(
//         caches.open(staticCacheName).then(function (cache) {
//             return cache.addAll([
//                 '/', 
//                 '/restaurant.html',
//                 '/css/styles.css',
//                 '/js/dbhelper.js',
//                 '/js/main.js',
//                 '/js/restaurant_info.js',
//                 '/js/register-sw.js', 
//                 '/data/restaurants.json'
//             ]);
//         })
//     );
// });

// /** At Service Worker Activation, Delete previous caches, if any */
// self.addEventListener('activate', function (event) {
//     event.waitUntil(
//         caches.keys().then(function (cacheNames) {
//             return Promise.all(
//                 cacheNames.filter(function (cacheName) {
//                     return cacheName.startsWith(appName) &&
//                         !allCaches.includes(cacheName);
//                 }).map(function (cacheName) {
//                     return caches.delete(cacheName);
//                 })
//             );
//         })
//     );
// });