-- Eliminar la vista admin_metrics si existe (tiene SECURITY DEFINER por defecto)
DROP VIEW IF EXISTS admin_metrics;

-- Crear función de métricas con SECURITY INVOKER (más seguro)
-- Solo usuarios con permisos adecuados podrán ejecutarla
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
