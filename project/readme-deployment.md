# 🚀 HOGAR FLOW PWA - DEPLOYMENT RÁPIDO

## ⚡ QUICK START (5 minutos)

### 1. Descarga estos 3 archivos:
- ✅ `hogar-flow-v2-final.html` (renombrar a `index.html`)
- ✅ `manifest.json`
- ✅ `service-worker.js`

### 2. Modifica `index.html`:

Añade en el `<head>` (después de la línea con `<title>`):

```html
<link rel="manifest" href="./manifest.json">
```

Añade ANTES del cierre `</body>`:

```html
<script>
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js')
      .then(reg => console.log('[PWA] SW registrado'))
      .catch(err => console.error('[PWA] Error:', err));
  });
}
</script>
```

### 3. Deploy en Netlify (GRATIS):

1. Ve a https://netlify.com
2. Arrastra los 3 archivos
3. ¡Listo! → `https://tu-app.netlify.app`

---

## 📱 TESTING

### En iPhone:
1. Abre link en **Safari**
2. Toca **Compartir** → **"Añadir a pantalla de inicio"**
3. Abre desde home screen

### En Android:
1. Abre link en **Chrome**
2. Toca **"Instalar app"** (banner automático)
3. O menú ⋮ → **"Añadir a pantalla de inicio"**

---

## 🔔 NOTIFICACIONES (OPCIONAL)

Añade esta función en tu código React:

```javascript
// Después de completar tarea:
if ('serviceWorker' in navigator && Notification.permission === 'granted') {
  navigator.serviceWorker.ready.then(reg => {
    reg.showNotification('Hogar Flow', {
      body: `${userName} completó: ${taskName}`,
      icon: './icon.png',
      vibrate: [200, 100, 200]
    });
  });
}
```

Solicita permiso en onboarding:

```javascript
await Notification.requestPermission();
```

---

## 📚 DOCUMENTACIÓN COMPLETA

👉 **Lee `GUIA-PWA-COMPLETA.md`** para:
- Configuración avanzada
- Troubleshooting
- Notificaciones remotas (Firebase)
- Background sync
- Tips de optimización

---

## ✅ CHECKLIST MÍNIMO

- [ ] 3 archivos subidos
- [ ] Link al manifest en HTML
- [ ] Service worker registrado
- [ ] Deploy en Netlify con HTTPS
- [ ] Test instalación en móvil
- [ ] Test funciona offline

---

## 🆘 AYUDA RÁPIDA

**¿No se instala la app?**
→ Verifica HTTPS (Netlify lo da automático)

**¿No funciona offline?**
→ Check console: `navigator.serviceWorker.controller`

**¿No hay notificaciones?**
→ Solo funcionan si está instalada (iOS) o permiso dado (Android/Desktop)

---

## 🎯 RESULTADO

- ✅ App instalable en 1 toque
- ✅ Funciona sin internet
- ✅ Auto-actualización
- ✅ Notificaciones push
- ✅ Responsive mobile-first
- ✅ Gratis para siempre

**Tiempo total:** 10 minutos  
**Coste:** 0€

🚀 **¡A por ello!**