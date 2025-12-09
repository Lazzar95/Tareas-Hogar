// Custom Service Worker for Push Notifications
// Este archivo se copia a public/ y se registra junto con el SW de Workbox

self.addEventListener('push', (event) => {
  if (!event.data) return;

  try {
    const data = event.data.json();
    
    const options = {
      body: data.body || 'Nueva actualización',
      icon: data.icon || '/icon-192x192.svg',
      badge: data.badge || '/icon-192x192.svg',
      vibrate: data.vibrate || [200, 100, 200],
      tag: data.tag || 'default',
      requireInteraction: true,
      data: data.data || {},
      actions: [
        { action: 'open', title: 'Ver' },
        { action: 'close', title: 'Cerrar' }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(data.title || 'Tareas Hogar', options)
    );
  } catch (error) {
    console.error('Error processing push:', error);
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'close') return;

  // Abrir o enfocar la app
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Si ya hay una ventana abierta, enfocarla
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      // Si no hay ventana, abrir una nueva
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});

// Escuchar mensajes del main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
