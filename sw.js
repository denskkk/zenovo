const CACHE_NAME = 'zenovo-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/catalog.html',
  '/about.html',
  '/contact.html',
  '/logo.png',
  '/manifest.json',
  'https://cdn.tailwindcss.com/3.3.0',
  'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Montserrat:wght@300;400;500;600;700&display=swap'
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Cache opened:', CACHE_NAME);
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests and chrome-extension requests
  if (event.request.method !== 'GET' || event.request.url.startsWith('chrome-extension://')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        return fetch(event.request).catch(() => {
          // If fetch fails and we don't have cache, return offline page
          if (event.request.destination === 'document') {
            return caches.match('/index.html');
          }
        });
      })
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Background sync for form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'newsletter-sync') {
    event.waitUntil(
      // Handle offline newsletter subscriptions
      console.log('📧 Syncing newsletter subscription')
    );
  }
});

// Push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Neue Angebote von ZENOVO verfügbar!',
    icon: '/logo.png',
    badge: '/logo.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Jetzt ansehen',
        icon: '/logo.png'
      },
      {
        action: 'close',
        title: 'Schließen'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('🌿 ZENOVO', options)
  );
});
