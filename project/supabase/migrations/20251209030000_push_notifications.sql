-- ============================================================
-- SISTEMA DE NOTIFICACIONES PUSH
-- ============================================================

-- Tabla para almacenar suscripciones push de cada dispositivo
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_id uuid REFERENCES families(id) ON DELETE CASCADE NOT NULL,
  member_name text NOT NULL,
  endpoint text NOT NULL UNIQUE,
  p256dh text NOT NULL,
  auth text NOT NULL,
  created_at timestamptz DEFAULT now(),
  last_used_at timestamptz DEFAULT now()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_push_family ON push_subscriptions(family_id);
CREATE INDEX IF NOT EXISTS idx_push_member ON push_subscriptions(member_name);
CREATE INDEX IF NOT EXISTS idx_push_endpoint ON push_subscriptions(endpoint);

-- RLS
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cualquiera puede leer push_subscriptions"
  ON push_subscriptions FOR SELECT USING (true);

CREATE POLICY "Cualquiera puede crear push_subscriptions"
  ON push_subscriptions FOR INSERT WITH CHECK (true);

CREATE POLICY "Cualquiera puede actualizar push_subscriptions"
  ON push_subscriptions FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Cualquiera puede eliminar push_subscriptions"
  ON push_subscriptions FOR DELETE USING (true);

-- Habilitar Realtime para todas las tablas necesarias
ALTER PUBLICATION supabase_realtime ADD TABLE tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE shopping_items;
ALTER PUBLICATION supabase_realtime ADD TABLE family_members;

-- Asegurar REPLICA IDENTITY para Realtime
ALTER TABLE tasks REPLICA IDENTITY FULL;
ALTER TABLE shopping_items REPLICA IDENTITY FULL;
ALTER TABLE family_members REPLICA IDENTITY FULL;
