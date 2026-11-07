import { useState, useEffect, useCallback } from "react";
import { db } from "../lib/db";
import { api } from "../lib/api";
import { useNetworkStatus } from "./useNetworkStatus";

export function useSyncQueue() {
  const [pendingCount, setPendingCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const isOnline = useNetworkStatus();

  const updateCount = useCallback(async () => {
    const count = await db.pendingSales
      .where("status")
      .equals("PENDING")
      .count();
    setPendingCount(count);
  }, []);

  const syncPendingSales = useCallback(async () => {
    if (isSyncing || !isOnline) return;

    setIsSyncing(true);

    try {
      const pendingSales = await db.pendingSales
        .where("status")
        .equals("PENDING")
        .toArray();

      for (const sale of pendingSales) {
        try {
          await api.post("/api/sales", sale.saleData);
          await db.pendingSales.delete(sale.id!);
        } catch (_error) {
          console.error("❌ Error al sincronizar venta pendiente:", _error);
          const newAttempts = (sale.attempts || 0) + 1;
          const newStatus = newAttempts >= 3 ? "FAILED" : "PENDING";

          await db.pendingSales.update(sale.id!, {
            attempts: newAttempts,
            status: newStatus,
          });
        }
      }
    } catch (_error) {
      // Error crítico silencioso, la UI ya maneja el estado de "isSyncing"
      console.error(
        "❌ Error crítico al sincronizar ventas pendientes:",
        _error,
      );
    } finally {
      setIsSyncing(false);
      await updateCount();
    }
  }, [isSyncing, isOnline, updateCount]);

  useEffect(() => {
    if (isOnline) {
      const timer = setTimeout(() => {
        syncPendingSales();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isOnline, syncPendingSales]);

  useEffect(() => {
    const timer = setTimeout(() => {
      updateCount();
    }, 0);
    return () => clearTimeout(timer);
  }, [updateCount]);

  return { pendingCount, isSyncing };
}
