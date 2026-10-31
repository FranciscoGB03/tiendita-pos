import { useState, useEffect, useCallback } from "react";
import { api, ApiError } from "../lib/api";

// Tipo para la respuesta de validación
interface ValidateTerminalResponse {
  success: boolean;
  data: {
    valid: boolean;
  };
  error: {
    code: number;
    message: string;
  } | null;
}

export function useTerminalId() {
  const [terminalId, setTerminalId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [needsConfiguration, setNeedsConfiguration] = useState(false);

  useEffect(() => {
    const loadTerminalId = async () => {
      const cached = localStorage.getItem("terminal_id");

      if (!cached) {
        setNeedsConfiguration(true);
        setIsLoading(false);
        return;
      }

      try {
        const response = await api.get<ValidateTerminalResponse>(
          "/api/terminals/validate",
          {
            params: { terminal_id: cached },
          },
        );

        if (response.data.valid) {
          setTerminalId(cached);
          setNeedsConfiguration(false);
        } else {
          localStorage.removeItem("terminal_id");
          setNeedsConfiguration(true);
          setTerminalId(null);
        }
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) {
          console.warn(
            `❌ Terminal "${cached}" no encontrado en la base de datos`,
          );
          localStorage.removeItem("terminal_id");
          setNeedsConfiguration(true);
          setTerminalId(null);
        } else {
          console.warn("🔌 Sin conexión, usando caché local (modo offline)");
          setTerminalId(cached);
          setNeedsConfiguration(false);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadTerminalId();
  }, []);

  const setTerminal = useCallback(async (id: string) => {
    console.log(`🔧 Validando terminal: ${id}`);

    try {
      const response = await api.get<ValidateTerminalResponse>(
        "/api/terminals/validate",
        {
          params: { terminal_id: id },
        },
      );

      console.log(`✅ Respuesta del backend:`, response);

      if (!response.data.valid) {
        alert(
          "⚠️ El ID de la caja no es válido. Por favor, verifica el número.",
        );
        return;
      }
    } catch (error) {
      console.error(`❌ Error de validación:`, error);

      if (error instanceof ApiError && error.status === 404) {
        alert(
          "❌ La caja no existe en el sistema. Por favor, verifica el número.",
        );
        return;
      }

      console.warn(
        "🔌 Sin conexión, permitiendo configuración manual (modo offline)",
        error,
      );
    }

    console.log(` Guardando terminal_id: ${id}`);
    localStorage.setItem("terminal_id", id);
    setTerminalId(id);
    setNeedsConfiguration(false);

    console.log(`✅ Terminal configurado: ${id}`);
  }, []);

  return { terminalId, isLoading, needsConfiguration, setTerminal };
}
