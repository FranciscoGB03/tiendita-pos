// frontend/src/hooks/useDailyReport.ts
import { useState, useEffect } from "react";
import { api, ApiError } from "../lib/api";

export interface DailySummary {
  date: string;
  total_ventas: number;
  total_bruto: number;
  total_neto: number;
  costo_total: number;
  ganancia_neta: number;
  total_efectivo: number;
  total_tarjeta: number;
  comisiones_terminal: number;
}

interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: { code: number; message: string } | null;
}

interface UseDailyReportResult {
  summary: DailySummary | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useDailyReport(
  terminalId?: string | null,
  cashierId?: string | null, // 🆕 Nuevo parámetro opcional
): UseDailyReportResult {
  const [summary, setSummary] = useState<DailySummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let ignore = false;

    async function startFetching() {
      setIsLoading(true);
      setError(null);

      try {
        // 🆕 Construir query params dinámicamente
        const params: Record<string, string> = {};
        if (terminalId) params.terminal_id = terminalId;
        if (cashierId) params.cashier_id = cashierId;

        const response = await api.get<ApiResponse<DailySummary>>(
          "/api/reports/daily-summary",
          { params },
        );

        if (!ignore) {
          if (!response.success || !response.data) {
            throw new Error(
              response.error?.message || "Error al obtener el reporte diario",
            );
          }
          setSummary(response.data);
        }
      } catch (err) {
        if (!ignore) {
          const message =
            err instanceof ApiError
              ? `Error del servidor (${err.status})`
              : err instanceof Error
                ? err.message
                : "Error desconocido al cargar el reporte";
          console.error("❌ [useDailyReport]", message);
          setError(message);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    startFetching();

    return () => {
      ignore = true;
    };
  }, [terminalId, cashierId, refreshKey]); // 🆕 Agregado cashierId a dependencias

  const refetch = () => setRefreshKey((key) => key + 1);

  return { summary, isLoading, error, refetch };
}
