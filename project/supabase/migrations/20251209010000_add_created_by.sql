-- Añadir columna created_by para rastrear quién creó/modificó los registros
ALTER TABLE tasks 
ADD COLUMN IF NOT EXISTS created_by text,
ADD COLUMN IF NOT EXISTS updated_by text;

ALTER TABLE shopping_items 
ADD COLUMN IF NOT EXISTS created_by text,
ADD COLUMN IF NOT EXISTS updated_by text;

-- Índices para consultas rápidas
CREATE INDEX IF NOT EXISTS idx_tasks_created_by ON tasks(created_by);
CREATE INDEX IF NOT EXISTS idx_shopping_created_by ON shopping_items(created_by);
