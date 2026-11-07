// frontend/src/services/saleService.ts
import { api, ApiError } from "../lib/api";
import { db } from "../lib/db";
import type { PendingSale } from "../lib/db";

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

// Nuevo tipo para manejar los 3 escenarios posibles de forma tipada
export type SaleResult =
  | { success: true; offline: false; data: SaleResponse }
  | { success: true; offline: true; message: string }
  | { success: false; error: string };

export const saleService = {
  // Mantenemos el original por si lo necesitas puro en otro lado
  createSale: (data: SaleRequest) => api.post<SaleResponse>("/api/sales", data),

  // Nuevo método con resiliencia offline (Opción A: Simple para Beta)
  createSaleWithFallback: async (data: SaleRequest): Promise<SaleResult> => {
    try {
      // Intento 1: Red normal
      const responseData = await api.post<SaleResponse>("/api/sales", data);
      return { success: true, offline: false, data: responseData };
    } catch (error) {
      // ⚠️ CLAVE: Fetch lanza `TypeError` cuando no hay red.
      // `ApiError` es solo para respuestas HTTP reales (4xx, 5xx).
      const isNetworkError =
        error instanceof TypeError ||
        (error instanceof ApiError && error.status === 0);

      if (isNetworkError) {
        console.warn(
          "🔌 Sin conexión. Guardando venta en cola local (Dexie)...",
        );
        try {
          const pendingSale: Omit<PendingSale, "id"> = {
            saleData: data,
            createdAt: new Date(),
            status: "PENDING",
            attempts: 0,
          };
          await db.pendingSales.add(pendingSale);

          // Retornamos éxito, pero marcamos que fue offline
          return {
            success: true,
            offline: true,
            message: "Venta guardada localmente",
          };
        } catch (dbError) {
          console.error("❌ Error crítico al guardar en Dexie:", dbError);
          return { success: false, error: "Error al guardar localmente" };
        }
      }

      // Si es un error real del backend (ej. 400 Bad Request, 500 Internal), lo propagamos
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Error desconocido al procesar la venta",
      };
    }
  },
};
