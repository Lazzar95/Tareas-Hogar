-- Añadir columna de última actividad a families
ALTER TABLE families 
ADD COLUMN IF NOT EXISTS last_activity_at timestamptz DEFAULT now();

-- Tabla de métricas básicas
CREATE TABLE IF NOT EXISTS family_analytics (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_id uuid REFERENCES families(id) ON DELETE CASCADE NOT NULL,
  event_type text NOT NULL, -- 'task_completed', 'shopping_added', 'member_joined', etc
  created_at timestamptz DEFAULT now()
);

-- Índice para consultas rápidas
CREATE INDEX IF NOT EXISTS idx_analytics_family ON family_analytics(family_id);
CREATE INDEX IF NOT EXISTS idx_analytics_created ON family_analytics(created_at DESC);

-- Políticas RLS
ALTER TABLE family_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cualquiera puede insertar analytics"
  ON family_analytics FOR INSERT
  WITH CHECK (true);

-- Función para actualizar last_activity
CREATE OR REPLACE FUNCTION update_family_activity()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE families 
  SET last_activity_at = now() 
  WHERE id = NEW.family_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para actualizar actividad automáticamente
CREATE TRIGGER update_activity_on_task
  AFTER INSERT OR UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_family_activity();

CREATE TRIGGER update_activity_on_shopping
  AFTER INSERT OR UPDATE ON shopping_items
  FOR EACH ROW
  EXECUTE FUNCTION update_family_activity();

-- Función para obtener métricas (solo para service_role)
-- Esta función se ejecuta con permisos del usuario que la llama (SECURITY INVOKER)
CREATE OR REPLACE FUNCTION get_admin_metrics()
RETURNS TABLE (
  total_families bigint,
  families_last_7_days bigint,
  families_last_30_days bigint,
  active_families_7_days bigint,
  active_families_30_days bigint,
  total_members bigint,
  total_completed_tasks bigint
)
SECURITY INVOKER
LANGUAGE sql
AS $$
  SELECT 
    (SELECT COUNT(*) FROM families) as total_families,
    (SELECT COUNT(*) FROM families WHERE created_at > now() - interval '7 days') as families_last_7_days,
    (SELECT COUNT(*) FROM families WHERE created_at > now() - interval '30 days') as families_last_30_days,
    (SELECT COUNT(*) FROM families WHERE last_activity_at > now() - interval '7 days') as active_families_7_days,
    (SELECT COUNT(*) FROM families WHERE last_activity_at > now() - interval '30 days') as active_families_30_days,
    (SELECT COUNT(*) FROM family_members) as total_members,
    (SELECT COUNT(*) FROM tasks WHERE completed = true) as total_completed_tasks;
$$;
