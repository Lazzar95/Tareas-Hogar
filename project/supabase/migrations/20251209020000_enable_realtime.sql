-- ============================================================
-- HABILITAR REALTIME PARA SINCRONIZACIÓN BIDIRECCIONAL
-- ============================================================
-- Este script habilita las publicaciones Realtime en Supabase
-- para que todos los miembros reciban actualizaciones en tiempo real

-- Primero, verificar si la publicación existe y eliminarla si es necesario
DROP PUBLICATION IF EXISTS supabase_realtime;

-- Crear nueva publicación con todas las tablas necesarias
CREATE PUBLICATION supabase_realtime FOR TABLE tasks, shopping_items, family_members;

-- Alternativa: Si la publicación ya existe, agregar las tablas
-- ALTER PUBLICATION supabase_realtime ADD TABLE tasks;
-- ALTER PUBLICATION supabase_realtime ADD TABLE shopping_items;
-- ALTER PUBLICATION supabase_realtime ADD TABLE family_members;

-- Verificar que Replica Identity está configurado (necesario para UPDATE/DELETE)
ALTER TABLE tasks REPLICA IDENTITY FULL;
ALTER TABLE shopping_items REPLICA IDENTITY FULL;
ALTER TABLE family_members REPLICA IDENTITY FULL;
