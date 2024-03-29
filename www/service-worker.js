console.log('Hello from service-worker.js');

// eslint-disable-next-line no-undef
importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

if (workbox) {
    console.log('Yay! Workbox is loaded 🎉');
} else {
    console.log('Boo! Workbox didn\'t load 😬');
}

// js caching
workbox.routing.registerRoute(
    /\.js$/,
    new workbox.strategies.NetworkFirst(),
);

// html caching
workbox.routing.registerRoute(
    /\.html$/,
    new workbox.strategies.NetworkFirst(),
);

// json caching
workbox.routing.registerRoute(
    /\.json$/,
    new workbox.strategies.NetworkFirst(),
);

workbox.routing.registerRoute(
    // Cache CSS files.
    /\.css$/,
    // Use cache but update in the background.
    new workbox.strategies.StaleWhileRevalidate({
        // Use a custom cache name.
        cacheName: 'css-cache',
    }),
);

workbox.routing.registerRoute(
    // Cache image files.
    /\.(?:png|jpg|jpeg|svg|gif)$/,
    // Use the cache if it's available.
    new workbox.strategies.CacheFirst({
        // Use a custom cache name.
        cacheName: 'image-cache',
        plugins: [
            new workbox.expiration.Plugin({
                // Cache only 20 images.
                maxEntries: 20,
                // Cache for a maximum of 90 days.
                maxAgeSeconds: 90 * 24 * 60 * 60,
            }),
        ],
    }),
);