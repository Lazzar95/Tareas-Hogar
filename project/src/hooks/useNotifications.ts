import { useEffect, useState } from 'react';

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result;
    }
    return permission;
  };

  const showNotification = (title: string, options?: NotificationOptions) => {
    // Verificar si el documento está oculto (app en segundo plano)
    const isBackground = document.hidden;
    
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        // Vibrar el dispositivo si está disponible
        if ('vibrate' in navigator) {
          navigator.vibrate([200, 100, 200]);
        }

        const notification = new Notification(title, {
          icon: '/icon-192x192.svg',
          badge: '/icon-192x192.svg',
          requireInteraction: isBackground, // Mantener notificación si está en background
          silent: false,
          ...options
        });

        // Al hacer clic, enfocar la ventana
        notification.onclick = () => {
          window.focus();
          notification.close();
        };

        // Auto-cerrar solo si está en primer plano
        if (!isBackground) {
          setTimeout(() => notification.close(), 5000);
        }

        return notification;
      } catch (error) {
        // Fallback para Service Worker notifications (PWA instalada)
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
          navigator.serviceWorker.ready.then(registration => {
            registration.showNotification(title, {
              icon: '/icon-192x192.svg',
              badge: '/icon-192x192.svg',
              vibrate: [200, 100, 200],
              requireInteraction: isBackground,
              ...options
            });
          });
        }
      }
    }
  };

  return { permission, requestPermission, showNotification };
}
