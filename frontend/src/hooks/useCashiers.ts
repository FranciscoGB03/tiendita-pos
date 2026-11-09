// frontend/src/hooks/useCashiers.ts
import { useState, useEffect } from "react";
import { api, ApiError } from "../lib/api";

export interface Cashier {
  id: string;
  full_name: string;
  role: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: { code: number; message: string } | null;
}

interface UseCashiersResult {
  cashiers: Cashier[];
  isLoading: boolean;
  error: string | null;
}

export function useCashiers(): UseCashiersResult {
  const [cashiers, setCashiers] = useState<Cashier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function fetchCashiers() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await api.get<ApiResponse<Cashier[]>>(
          "/api/users/cashiers",
        );

        if (!ignore) {
          if (!response.success || !response.data) {
            throw new Error(
              response.error?.message || "Error al obtener cajeros",
            );
          }
          setCashiers(response.data);
        }
      } catch (err) {
        if (!ignore) {
          const message =
            err instanceof ApiError
              ? `Error del servidor (${err.status})`
              : err instanceof Error
                ? err.message
                : "Error desconocido al cargar cajeros";
          console.error("❌ [useCashiers]", message);
          setError(message);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    fetchCashiers();

    return () => {
      ignore = true;
    };
  }, []);

  return { cashiers, isLoading, error };
}
