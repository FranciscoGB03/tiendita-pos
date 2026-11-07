// frontend/src/hooks/useNetworkStatus.ts
import { useState, useEffect } from "react";

export function useNetworkStatus() {
  // Inicialización con el estado actual del navegador
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  useEffect(() => {
    // Suscripción a eventos de red (caso de uso legítimo de useEffect)
    const handleOnline = () => {
      console.log("🟢 [Network] Conexión restaurada");
      setIsOnline(true);
    };

    const handleOffline = () => {
      console.warn("🔴 [Network] Conexión perdida");
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Cleanup al desmontar
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return isOnline;
}
