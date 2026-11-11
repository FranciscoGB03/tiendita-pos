-- ==========================================
-- MIGRACIÓN 004: Tabla de Cortes de Caja (cash_cuts)
-- ==========================================

-- 1. Crear la nueva tabla de cortes (soporta múltiples cortes por día/caja/cajero)
CREATE TABLE IF NOT EXISTS cash_cuts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Identificación del turno
  cashier_id UUID NOT NULL REFERENCES users(id),
  terminal_id TEXT NOT NULL,
  cut_datetime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  -- Fondo fijo (monto base para cambio)
  initial_fund DECIMAL(10,2) NOT NULL DEFAULT 500.00,
  
  -- Totales esperados (calculados del sistema desde el último corte o inicio del día)
  total_cash_expected DECIMAL(10,2) NOT NULL, 
  total_card_neto DECIMAL(10,2) NOT NULL, 
  total_sales DECIMAL(10,2) NOT NULL, 
  
  -- Conteo físico (ingresado manualmente por el supervisor)
  actual_cash DECIMAL(10,2), 
  
  -- Diferencias (actual_cash - (initial_fund + total_cash_expected))
  cash_difference DECIMAL(10,2), 
  
  -- Estado del corte
  status TEXT NOT NULL DEFAULT 'COMPLETED' CHECK (status IN ('PENDING', 'COMPLETED', 'VOID')),
  notes TEXT,
  
  -- Auditoría
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by UUID REFERENCES users(id)
);

-- 2. Índices para consultas rápidas de reportes y validación de último corte
CREATE INDEX IF NOT EXISTS idx_cash_cuts_terminal_datetime ON cash_cuts(terminal_id, cut_datetime DESC);
CREATE INDEX IF NOT EXISTS idx_cash_cuts_cashier_datetime ON cash_cuts(cashier_id, cut_datetime DESC);

-- 3. Registrar el fondo fijo inicial en la tabla de configuración
INSERT INTO settings (key, value, description)
VALUES ('initial_cash_fund', '500.00', 'Fondo fijo inicial para cambio en cada caja (MXN)')
ON CONFLICT (key) DO UPDATE 
SET value = EXCLUDED.value, 
    description = EXCLUDED.description;