export interface Product {
  id: string;
  name: string;
  barcode: string;
  cost_price: number;
  sale_price: number;
  stock_quantity: number;
  low_stock_threshold: number;
  image_url: string | null;
  is_active: boolean;
  created_at: string; // ISO string desde el backend
  updated_at: string; // ISO string desde el backend
}