-- ==========================================
-- MIGRACIÓN: Rol SUPERVISOR y Permisos Granulares
-- Fecha: 08-Nov-2026
-- ==========================================

-- 1. Crear rol SUPERVISOR (si no existe)
INSERT INTO roles (name, description) VALUES
('SUPERVISOR', 'Supervisión de cajas: puede cobrar, ver reportes diarios y realizar cortes de caja')
ON CONFLICT (name) DO NOTHING;

-- 2. Crear nuevos permisos granulares (si no existen)
INSERT INTO permissions (name, description) VALUES
('cashier.daily_report', 'Ver resumen diario de ventas en el punto de venta'),
('cashier.cut', 'Ejecutar corte de caja'),
('reports.export', 'Exportar reportes a CSV/Excel')
ON CONFLICT (name) DO NOTHING;

-- 3. Asignar permisos base + nuevos al rol SUPERVISOR
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id 
FROM roles r, permissions p 
WHERE r.name = 'SUPERVISOR' 
  AND p.name IN ('sales.create', 'sales.view', 'cashier.daily_report', 'cashier.cut', 'reports.export')
ON CONFLICT DO NOTHING;

-- 4. Asegurar que el rol ADMIN también tenga estos nuevos permisos
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id 
FROM roles r, permissions p 
WHERE r.name = 'ADMIN' 
  AND p.name IN ('cashier.daily_report', 'cashier.cut', 'reports.export')
ON CONFLICT DO NOTHING;

-- 5. Migrar a mamá y papá del rol CAJERO al rol SUPERVISOR
UPDATE users 
SET role_id = (SELECT id FROM roles WHERE name = 'SUPERVISOR')
WHERE username IN ('mama', 'papa');

-- ==========================================
-- VERIFICACIÓN (Opcional, para que revises que quedó bien)

-- ==========================================
SELECT u.username, r.name as role_name 
FROM users u JOIN roles r ON u.role_id = r.id 
WHERE u.username IN ('mama', 'papa', 'dev');

-- ==========================================
-- MIGRACIÓN: Agregar cashier_id a tabla sales
-- Propósito: Registrar qué usuario (cajero) realizó cada venta
-- para poder filtrar reportes por persona
-- ==========================================

-- 1. Agregar columna cashier_id (nullable para no romper ventas existentes)
ALTER TABLE sales
ADD COLUMN IF NOT EXISTS cashier_id UUID REFERENCES users(id) ON DELETE SET NULL;

-- 2. Agregar índice para performance en filtros de reportes
-- (los reportes filtrarán frecuentemente por cashier_id + fecha)
CREATE INDEX IF NOT EXISTS idx_sales_cashier_id 
ON sales(cashier_id) 
WHERE cashier_id IS NOT NULL;

-- 3. Agregar índice compuesto para el caso más común: reporte por cajero + fecha
CREATE INDEX IF NOT EXISTS idx_sales_cashier_created 
ON sales(cashier_id, created_at) 
WHERE cashier_id IS NOT NULL;

-- Nota: No hacemos UPDATE de ventas existentes porque:
-- - En Beta probablemente no hay datos reales
-- - Si los hubiera, no podemos adivinar quién las hizo
-- - La columna queda NULL para ventas históricas (no rompe nada)

INSERT INTO permissions (name, description) 
VALUES ('users.view', 'Ver lista de usuarios activos')
ON CONFLICT (name) DO NOTHING;

-- Asignarlo a SUPERVISOR y ADMIN
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id 
FROM roles r, permissions p
WHERE r.name IN ('SUPERVISOR', 'ADMIN') 
AND p.name = 'users.view'
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id 
FROM roles r, permissions p
WHERE r.name = 'CAJERO' 
AND p.name = 'cashier.daily_report'
ON CONFLICT DO NOTHING;

INSERT INTO settings (key, value, description) VALUES
('initial_cash_fund', '500.00', 'Fondo fijo inicial para cambio en cada caja');