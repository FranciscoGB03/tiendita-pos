import { api } from "../lib/api";

export interface SaleItem {
  product_id: string;
  quantity: number;
  unit_price_at_sale: number;
}

export interface SalePayment {
  payment_method: "EFECTIVO" | "TARJETA";
  amount: number;
}

export interface SaleRequest {
  terminal_id: string;
  items: SaleItem[];
  payments: SalePayment[];
}

export interface SaleResponse {
  id: string;
  total_bruto: number;
  total_neto: number;
  status: string;
  created_at: string;
}

export const saleService = {
  createSale: (data: SaleRequest) => api.post<SaleResponse>("/api/sales", data),
};
