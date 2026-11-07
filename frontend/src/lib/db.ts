// frontend/src/lib/db.ts
import Dexie, { type Table } from "dexie";
import type { SaleRequest } from "../services/saleService";
// Interfaz para lo que guardaremos en la cola de sincronización
export interface PendingSale {
  id?: number; // ++id lo hace autoincremental en Dexie
  saleData: SaleRequest; // Guardamos el payload exacto para reintentar
  createdAt: Date;
  status: "PENDING" | "SYNCING" | "FAILED";
  attempts: number;
}

class PosDatabase extends Dexie {
  // 'pendingSales' es el nombre de la tabla (object store)
  // '++id': clave primaria autoincremental
  // 'createdAt, status': índices para poder buscar/filtrar después si es necesario
  pendingSales!: Table<PendingSale, number>;

  constructor() {
    super("MashukaPOS_DB");

    // Definición del esquema (Versión 1)
    this.version(1).stores({
      pendingSales: "++id, createdAt, status",
    });
  }
}

export const db = new PosDatabase();
