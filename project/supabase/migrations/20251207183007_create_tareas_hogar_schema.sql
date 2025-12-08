/*
  # Tareas Hogar - Schema Inicial

  1. Nuevas Tablas
    - `families`
      - `id` (uuid, PK)
      - `name` (text) - Nombre del hogar
      - `code` (text, unique) - Código de 6 caracteres para compartir
      - `created_at` (timestamptz)
      
    - `family_members`
      - `id` (uuid, PK)
      - `family_id` (uuid, FK)
      - `name` (text) - Nombre del miembro
      - `color_index` (int) - Índice de color asignado
      - `created_at` (timestamptz)
      
    - `tasks`
      - `id` (uuid, PK)
      - `family_id` (uuid, FK)
      - `title` (text) - Título de la tarea
      - `description` (text, nullable)
      - `category` (text) - Categoría visual (limpieza, cocina, etc)
      - `assigned_to` (text) - Nombre del responsable
      - `frequency` (text) - Una vez, Diario, Semanal, Mensual
      - `completed` (boolean) - Estado de completitud
      - `completed_at` (timestamptz, nullable)
      - `created_at` (timestamptz)
      
    - `shopping_items`
      - `id` (uuid, PK)
      - `family_id` (uuid, FK)
      - `name` (text) - Nombre del producto
      - `checked` (boolean) - Estado (comprado o no)
      - `created_at` (timestamptz)

  2. Seguridad (RLS)
    - Todas las tablas tienen RLS habilitado
    - Las políticas permiten acceso basado en family_id
    - Sin autenticación tradicional: acceso por código familiar
*/

-- Crear extensión para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla: families
CREATE TABLE IF NOT EXISTS families (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  code text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Tabla: family_members
CREATE TABLE IF NOT EXISTS family_members (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_id uuid REFERENCES families(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  color_index int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Tabla: tasks
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_id uuid REFERENCES families(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text DEFAULT '',
  category text DEFAULT 'otros',
  assigned_to text NOT NULL,
  frequency text DEFAULT 'Una vez',
  completed boolean DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Tabla: shopping_items
CREATE TABLE IF NOT EXISTS shopping_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_id uuid REFERENCES families(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  checked boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_family_members_family ON family_members(family_id);
CREATE INDEX IF NOT EXISTS idx_tasks_family ON tasks(family_id);
CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(completed);
CREATE INDEX IF NOT EXISTS idx_shopping_family ON shopping_items(family_id);
CREATE INDEX IF NOT EXISTS idx_families_code ON families(code);

-- Habilitar RLS en todas las tablas
ALTER TABLE families ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_items ENABLE ROW LEVEL SECURITY;

-- Políticas RLS: Acceso público (basado en conocimiento del código)
-- FAMILIES
CREATE POLICY "Cualquiera puede leer families"
  ON families FOR SELECT
  USING (true);

CREATE POLICY "Cualquiera puede crear families"
  ON families FOR INSERT
  WITH CHECK (true);

-- FAMILY_MEMBERS
CREATE POLICY "Cualquiera puede leer family_members"
  ON family_members FOR SELECT
  USING (true);

CREATE POLICY "Cualquiera puede crear family_members"
  ON family_members FOR INSERT
  WITH CHECK (true);

-- TASKS
CREATE POLICY "Cualquiera puede leer tasks"
  ON tasks FOR SELECT
  USING (true);

CREATE POLICY "Cualquiera puede crear tasks"
  ON tasks FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Cualquiera puede actualizar tasks"
  ON tasks FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Cualquiera puede eliminar tasks"
  ON tasks FOR DELETE
  USING (true);

-- SHOPPING_ITEMS
CREATE POLICY "Cualquiera puede leer shopping_items"
  ON shopping_items FOR SELECT
  USING (true);

CREATE POLICY "Cualquiera puede crear shopping_items"
  ON shopping_items FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Cualquiera puede actualizar shopping_items"
  ON shopping_items FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Cualquiera puede eliminar shopping_items"
  ON shopping_items FOR DELETE
  USING (true);
