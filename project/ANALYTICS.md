# 📊 Sistema de Analytics - Tareas Hogar

## 🎯 Configuración completa para tracking de usuarios

### 1️⃣ **Supabase Analytics** (Ya incluido)

Ejecuta el nuevo script SQL en Supabase:
- Ve a **SQL Editor**
- Ejecuta: `supabase/migrations/20251209000000_add_analytics.sql`

**Métricas disponibles:**
```sql
-- Ver todas las métricas
SELECT * FROM admin_metrics;

-- Familias activas última semana
SELECT COUNT(*) FROM families 
WHERE last_activity_at > now() - interval '7 days';

-- Eventos por tipo
SELECT event_type, COUNT(*) 
FROM family_analytics 
GROUP BY event_type;
```

**Auto-tracking incluido:**
- Última actividad se actualiza automáticamente
- Triggers en tareas y lista de compras
- Vista `admin_metrics` para dashboard rápido

---

### 2️⃣ **Google Analytics 4** (Configurar)

1. Ve a [analytics.google.com](https://analytics.google.com)
2. Crea una propiedad GA4
3. Copia tu **Measurement ID** (formato: `G-XXXXXXXXXX`)
4. En `index.html`, reemplaza `G-XXXXXXXXXX` con tu ID real

**Métricas automáticas:**
- Usuarios activos diarios/mensuales
- Páginas vistas
- Tiempo en la app
- Dispositivos y ubicaciones

---

### 3️⃣ **Dashboard de métricas en Supabase**

Query SQL para tu dashboard:

```sql
-- 📈 Crecimiento
SELECT 
  DATE(created_at) as fecha,
  COUNT(*) as nuevas_familias
FROM families
WHERE created_at > now() - interval '30 days'
GROUP BY DATE(created_at)
ORDER BY fecha DESC;

-- 🔥 Familias activas por día
SELECT 
  DATE(last_activity_at) as fecha,
  COUNT(*) as familias_activas
FROM families
WHERE last_activity_at > now() - interval '30 days'
GROUP BY DATE(last_activity_at)
ORDER BY fecha DESC;

-- 🎯 Eventos más frecuentes
SELECT 
  event_type,
  COUNT(*) as total,
  COUNT(DISTINCT family_id) as familias_unicas
FROM family_analytics
WHERE created_at > now() - interval '7 days'
GROUP BY event_type
ORDER BY total DESC;
```

---

### 4️⃣ **Modelo Freemium**

**Hasta 5000 familias:** ✅ Gratis
**Después de 5000:** 💰 5€/año

Query para verificar el límite:
```sql
SELECT COUNT(*) as total_familias FROM families;
-- Cuando llegue a 5000, mostrar paywall
```

**Próximos pasos:**
1. Integrar Stripe para pagos
2. Añadir campo `subscription_status` en tabla `families`
3. Crear lógica de validación de suscripción

---

### 📊 Resumen del sistema

| Métrica | Fuente | Actualización |
|---------|--------|---------------|
| Total familias | Supabase | Tiempo real |
| Usuarios activos | Supabase + GA4 | Automático |
| Eventos de uso | Supabase | Triggers |
| Demografía | GA4 | Cada 24h |
| Conversión | GA4 | Tiempo real |

**Todo configurado y listo para producción** ✨
