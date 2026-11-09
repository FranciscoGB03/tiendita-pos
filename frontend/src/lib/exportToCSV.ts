// frontend/src/lib/exportToCSV.ts
import type { DailySummary } from "../hooks/useDailyReport";

/**
 * Convierte un resumen diario en un archivo CSV y dispara su descarga.
 * Usa BOM (Byte Order Mark) para que Excel reconozca correctamente UTF-8 (acentos, ñ, etc.)
 */
export function exportDailyReportToCSV(
  summary: DailySummary,
  terminalId?: string | null,
) {
  if (!summary) return;

  // 1. Definir las filas del CSV (Concepto, Valor)
  const rows = [
    ["Concepto", "Valor"],
    ["Fecha del Reporte", summary.date],
    ["Terminal", terminalId || "TODAS LAS CAJAS"],
    ["", ""], // Separador visual
    ["Total de Ventas (transacciones)", summary.total_ventas.toString()],
    ["Total Bruto", summary.total_bruto.toFixed(2)],
    ["Total Neto (después de comisiones)", summary.total_neto.toFixed(2)],
    ["Costo Total de Productos", summary.costo_total.toFixed(2)],
    ["Ganancia Neta Estimada", summary.ganancia_neta.toFixed(2)],
    ["", ""], // Separador visual
    ["Recaudado en Efectivo", summary.total_efectivo.toFixed(2)],
    ["Recaudado en Tarjeta", summary.total_tarjeta.toFixed(2)],
    ["Comisiones de Terminal (Gasto)", summary.comisiones_terminal.toFixed(2)],
  ];

  // 2. Convertir a formato CSV
  // \uFEFF es el BOM (Byte Order Mark) que le dice a Excel "esto es UTF-8"
  // Sin esto, los acentos y caracteres especiales se ven como "GanancÃ­a"
  const csvContent =
    "\uFEFF" +
    rows.map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");

  // 3. Crear Blob y URL de descarga
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  // 4. Crear enlace temporal, hacer clic y limpiar
  const link = document.createElement("a");
  link.href = url;
  const fileName = `Reporte_Diario_${summary.date}_${terminalId || "Global"}.csv`;
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // 5. Liberar memoria del navegador
  URL.revokeObjectURL(url);
}
