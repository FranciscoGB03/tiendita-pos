import { useState, useCallback } from "react";
import { api, ApiError } from "../lib/api";

export interface TurnSummary {
  cashier_id: string;
  terminal_id: string;
  initial_fund: number;
  total_cash_expected: number;
  total_card_neto: number;
  total_sales: number;
  expected_total: number;
  last_cut_datetime: string | null;
}

export interface CashCutResponse {
  id: string;
  cashier_id: string;
  terminal_id: string;
  cut_datetime: string;
  initial_fund: number;
  total_cash_expected: number;
  total_card_neto: number;
  total_sales: number;
  actual_cash: number;
  cash_difference: number;
  status: string;
  created_at: string;
  created_by: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: { code: number; message: string } | null;
}

export function useCashCut() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<TurnSummary | null>(null);

  // ✅ Memoizado con useCallback para que la referencia sea estable
  const fetchSummary = useCallback(
    async (cashierId: string, terminalId: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get<ApiResponse<TurnSummary>>(
          `/api/cash-cuts/summary?cashier_id=${cashierId}&terminal_id=${terminalId}`,
        );
        if (response.success && response.data) {
          setSummary(response.data);
        } else {
          throw new Error(
            response.error?.message || "Error al obtener resumen del turno",
          );
        }
      } catch (err) {
        const msg =
          err instanceof ApiError
            ? (err.data as { message?: string })?.message || err.message
            : "Error de red al obtener resumen";
        setError(msg);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  ); // No tiene dependencias externas, array vacío seguro

  // ✅ Memoizado con useCallback
  const createCut = useCallback(
    async (
      cashierId: string,
      terminalId: string,
      actualCash: number,
      notes: string,
    ) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.post<ApiResponse<CashCutResponse>>(
          "/api/cash-cuts",
          {
            cashier_id: cashierId,
            terminal_id: terminalId,
            actual_cash: actualCash,
            notes,
          },
        );
        if (response.success && response.data) {
          return response.data;
        } else {
          throw new Error(
            response.error?.message || "Error al registrar el corte",
          );
        }
      } catch (err) {
        const msg =
          err instanceof ApiError
            ? (err.data as { message?: string })?.message || err.message
            : "Error de red al crear corte";

        setError(msg);
        throw new Error(msg, { cause: err });
      } finally {
        setIsLoading(false);
      }
    },
    [],
  ); // No tiene dependencias externas, array vacío seguro

  // ✅ Memoizado con useCallback
  const reset = useCallback(() => {
    setSummary(null);
    setError(null);
  }, []);

  return { summary, isLoading, error, fetchSummary, createCut, reset };
}
