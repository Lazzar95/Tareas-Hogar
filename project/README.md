# 🏠 Tareas Hogar

**Tu casa organizada sin discusiones.**

PWA para gestión de tareas del hogar con sincronización en tiempo real entre dispositivos.

## ✨ Características

### 🎯 Core Features
- **Sincronización en tiempo real** entre todos los dispositivos (Supabase Realtime)
- **Sistema de código familiar** - Sin email/password, solo un código de 6 caracteres
- **Onboarding ultra-simple** - 2 pasos para empezar
- **Visual > Textual** - Iconos grandes, categorías visuales, colores por persona
- **Anti-reactancia** - Sin órdenes, sin culpabilización, solo coordinación

### 📱 Funcionalidades
- ✅ **Tareas del hogar** - Crear, asignar, completar
- 🛒 **Lista de compra compartida** - Añadir productos, marcar como comprados
- 📊 **Estadísticas** - Ver contribución de cada miembro
- 🔗 **Código familiar** - Compartir para que otros se unan
- 🎨 **Colores por persona** - Identificación visual instantánea
- 📋 **16 categorías de tareas** - Limpieza, cocina, compras, etc.

### 🎨 Diseño UX
- **Minimalista** pero potente
- **Glassmorphism** avanzado
- **Micro-interacciones** satisfactorias (checkboxes deliciosos)
- **Progreso circular** siempre visible
- **Modal optimizado** (diseño "AHORA" - sin scroll necesario)
- **Responsive mobile-first**

## 🚀 Stack Tecnológico

- **Frontend**: React + TypeScript + Vite
- **Base de datos**: Supabase (PostgreSQL)
- **Realtime**: Supabase Realtime Subscriptions
- **Estilos**: Tailwind CSS
- **PWA**: Manifest.json + Service Worker ready
- **Fuente**: Outfit (Google Fonts)

## 🗄️ Arquitectura de Datos

### Tablas Supabase

```sql
families
├── id (uuid, PK)
├── name (text) - Nombre del hogar
├── code (text, unique) - Código de 6 caracteres
└── created_at (timestamptz)

family_members
├── id (uuid, PK)
├── family_id (uuid, FK)
├── name (text)
├── color_index (int) - Índice para asignar color
└── created_at (timestamptz)

tasks
├── id (uuid, PK)
├── family_id (uuid, FK)
├── title (text)
├── category (text) - limpieza, cocina, etc.
├── assigned_to (text) - Nombre del responsable
├── frequency (text) - Una vez, Diario, Semanal, Mensual
├── completed (boolean)
├── completed_at (timestamptz, nullable)
└── created_at (timestamptz)

shopping_items
├── id (uuid, PK)
├── family_id (uuid, FK)
├── name (text)
├── checked (boolean)
└── created_at (timestamptz)
```

### RLS Policies
Todas las tablas tienen RLS habilitado con políticas públicas (acceso basado en conocimiento del código familiar).

## 🎯 Flujo de Usuario

### Primera vez (Crear hogar)
1. **Pantalla inicial** → Elegir "Crear mi hogar"
2. **Paso 1** → Nombrar hogar (ej: "Casa García")
3. **Paso 2** → Añadir miembros (cada uno con color)
4. **Completar** → Código generado automáticamente
5. **Dashboard** → Listo para usar

### Unirse a hogar existente
1. **Pantalla inicial** → Elegir "Unirme a un hogar"
2. **Introducir código** → 6 caracteres
3. **Dashboard** → Sincronizado con todos

### Uso diario
1. **Dashboard** → Ver progreso circular
2. **Tabs** → Cambiar entre Tareas / Compra / Stats
3. **Añadir tarea** → Modal optimizado sin scroll
4. **Completar** → Checkbox satisfactorio + notificación
5. **Sincronización automática** → Todos ven cambios al instante

## 🎨 Principios de Diseño

### Visual > Textual
- 16 categorías con emojis grandes (🛒✨👨‍🍳🗑️🍽️🧺...)
- Colores por persona (6 paletas predefinidas)
- Progreso circular en header
- Estados vacíos con personalidad

### Anti-Reactancia
- Sin "DEBES hacer X"
- Sin notificaciones agresivas
- Sin comparaciones competitivas
- Lenguaje de invitación, no de orden

### Micro-Interacciones
- Checkboxes custom con animación satisfactoria
- Notificaciones celebratorias al completar
- Transiciones suaves
- Feedback inmediato

## 🔧 Configuración

### Variables de Entorno

Las credenciales de Supabase ya están configuradas en `.env`:

```env
VITE_SUPABASE_URL=https://grqdyhvtswxvuklbrsfk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Instalación

```bash
npm install
```

### Desarrollo

```bash
npm run dev
```

### Producción

```bash
npm run build
```

## 📱 PWA

La aplicación está preparada para ser instalada como PWA:

1. **Manifest.json** ✅ Configurado
2. **Theme colors** ✅ Terracota (#E77447)
3. **Icons** ⚠️ Necesitas generar icon-192.png y icon-512.png
4. **Service Worker** 📝 Ready to implement

### Para convertir en PWA completa:
1. Genera iconos (512x512 y 192x192)
2. Añade service-worker.js para offline support
3. Registra service worker en main.tsx
4. Deploy con HTTPS (Netlify/Vercel)

## 🎯 Próximos Pasos

### Funcionalidades
- [ ] Notificaciones push cuando alguien completa tarea
- [ ] Calendario de tareas recurrentes
- [ ] Historial de tareas completadas
- [ ] Gamificación (puntos, rachas)
- [ ] Recordatorios automáticos

### PWA
- [ ] Generar iconos
- [ ] Implementar service worker
- [ ] Offline support con cache
- [ ] Auto-actualización

### UX
- [ ] Onboarding con tour visual
- [ ] Animaciones de celebración más elaboradas
- [ ] Temas de color personalizables
- [ ] Modo oscuro

## 🎨 Paleta de Colores

- **Terracota**: #E77447 (Primary - Botones principales)
- **Mar**: #2A7BA0 (Secondary - Lista de compra)
- **Oliva**: #6B8E5A (Success - Completado, Stats)
- **Rosa**: #fef6f3 (Background gradient start)
- **Azul**: #f0f7fb (Background gradient end)

## 📊 Métricas de Éxito

- ✅ Build exitoso sin errores
- ✅ Bundle size: 361KB JS + 63KB CSS
- ✅ Sincronización en tiempo real funcionando
- ✅ RLS configurado y seguro
- ✅ Responsive mobile-first
- ✅ Animaciones fluidas 60fps

## 🚀 Deploy Sugerido

**Netlify** (Gratis + HTTPS automático):
1. Conecta repo
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Deploy

**Vercel** (Alternativa):
1. Importa proyecto
2. Auto-detecta configuración
3. Deploy

## 🆘 Soporte

El sistema usa localStorage para guardar el código familiar actual y Supabase para sincronizar datos en tiempo real.

**Si un usuario pierde el código:**
- No hay recuperación automática (diseño intencionado)
- Debe pedirlo a otro miembro de la familia
- O crear nuevo hogar

## 📄 Licencia

MIT

---

**Hecho con ❤️ y psicología del consumidor**

*Filosofía: Mostrar > Explicar. Visual > Textual. Simple > Complejo.*
