// frontend/src/hooks/useAuth.ts
import { useState } from "react";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  exp?: number;
  [key: string]: unknown;
}

export function useAuth() {
  // Inicialización perezosa: se ejecuta solo una vez al montar.
  const [isValid] = useState<boolean>(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      return false;
    }

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const isExpired = decoded.exp ? Date.now() >= decoded.exp * 1000 : true;

      if (isExpired) {
        console.warn(
          "🔒 Token expirado detectado. Limpiando solo la sesión...",
        );
        localStorage.removeItem("token");
        return false;
      }

      return true;
    } catch (error) {
      console.error("❌ Error al decodificar el token:", error);
      localStorage.removeItem("token");
      return false;
    }
  });

  return isValid;
}
