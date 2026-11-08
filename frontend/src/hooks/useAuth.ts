import { useState } from "react";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  exp?: number;
  permissions?: string[];
  [key: string]: unknown;
}

export interface AuthState {
  isValid: boolean;
  permissions: string[];
}

export interface AuthContext extends AuthState {
  logout: () => void;
}

export function useAuth(): AuthContext {
  const [authState] = useState<AuthState>(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      return { isValid: false, permissions: [] };
    }

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const isExpired = decoded.exp ? Date.now() >= decoded.exp * 1000 : true;

      if (isExpired) {
        console.warn(
          "🔒 Token expirado detectado. Limpiando solo la sesión...",
        );
        localStorage.removeItem("token");
        return { isValid: false, permissions: [] };
      }

      return {
        isValid: true,
        permissions: Array.isArray(decoded.permissions)
          ? decoded.permissions
          : [],
      };
    } catch (error) {
      console.error("❌ Error al decodificar el token:", error);
      localStorage.removeItem("token");
      return { isValid: false, permissions: [] };
    }
  });

  const logout = () => {
    console.log("🔒 Cerrando sesión...");
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  // Siempre retornamos un objeto válido, NUNCA null
  return {
    ...authState,
    logout,
  };
}
