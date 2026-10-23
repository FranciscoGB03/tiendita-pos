-- Configuración inicial
INSERT INTO settings (key, value, description) VALUES 
('card_commission_rate', '0.041', 'Comisión terminal bancaria en decimal (incluye IVA)');

-- Seed de 20 productos con código de barras, precios y stock
INSERT INTO products (name, barcode, cost_price, sale_price, stock_quantity, low_stock_threshold, image_url) VALUES
('Leche Entera 1L', '7501000100104', 22.50, 28.00, 40, 10, 'https://placehold.co/150x150/white/333?text=Leche+1L'),
('Pan Bimbo Grande', '7501000112345', 45.00, 58.00, 15, 5, 'https://placehold.co/150x150/white/333?text=Pan+Bimbo'),
('Huevos (1kg)', '7501000234567', 38.00, 48.00, 20, 8, 'https://placehold.co/150x150/white/333?text=Huevos+1kg'),
('Coca Cola 600ml', '7501032100019', 14.00, 18.00, 60, 20, 'https://placehold.co/150x150/white/333?text=Coca+600ml'),
('Sabritas Original', '7501000567890', 16.00, 21.00, 30, 10, 'https://placehold.co/150x150/white/333?text=Sabritas'),
('Galletas Marías', '7501000345678', 12.50, 16.00, 25, 10, 'https://placehold.co/150x150/white/333?text=Galletas'),
('Atún en Agua', '7501000456789', 18.00, 24.00, 20, 8, 'https://placehold.co/150x150/white/333?text=Atun'),
('Frijoles Bayos 1kg', '7501000678901', 32.00, 42.00, 15, 5, 'https://placehold.co/150x150/white/333?text=Frijoles'),
('Arroz 1kg', '7501000789012', 24.00, 32.00, 15, 5, 'https://placehold.co/150x150/white/333?text=Arroz'),
('Aceite 1L', '7501000890123', 42.00, 55.00, 12, 4, 'https://placehold.co/150x150/white/333?text=Aceite'),
('Jabón de Baño', '7501000901234', 14.00, 19.00, 20, 8, 'https://placehold.co/150x150/white/333?text=Jabon'),
('Shampoo Chico', '7501001012345', 28.00, 38.00, 10, 4, 'https://placehold.co/150x150/white/333?text=Shampoo'),
('Papel Higiénico (4 rollos)', '7501001123456', 26.00, 35.00, 15, 5, 'https://placehold.co/150x150/white/333?text=Papel+HP'),
('Detergente 1kg', '7501001234567', 35.00, 46.00, 10, 4, 'https://placehold.co/150x150/white/333?text=Detergente'),
('Cerveza Nacional 355ml', '7501001345678', 18.00, 24.00, 48, 15, 'https://placehold.co/150x150/white/333?text=Cerveza'),
('Agua Natural 1L', '7501001456789', 8.00, 12.00, 50, 20, 'https://placehold.co/150x150/white/333?text=Agua+1L'),
('Cigarros (Cajetilla)', '7501001567890', 65.00, 80.00, 10, 3, 'https://placehold.co/150x150/white/333?text=Cigarros'),
('Chicles (Bolsa)', '7501001678901', 10.00, 14.00, 30, 10, 'https://placehold.co/150x150/white/333?text=Chicles'),
('Dulces Surtidos (pieza)', '7501001789012', 2.00, 5.00, 100, 30, 'https://placehold.co/150x150/white/333?text=Dulces'),
('Tortillas 1kg', '7501001890123', 22.00, 28.00, 20, 10, 'https://placehold.co/150x150/white/333?text=Tortillas');

-- Seed de movimientos de inventario inicial
INSERT INTO inventory_movements (product_id, movement_type, quantity, notes)
SELECT id, 'INITIAL_STOCK', stock_quantity, 'Stock inicial Beta' FROM products;