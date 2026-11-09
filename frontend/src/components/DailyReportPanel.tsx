// frontend/src/components/DailyReportPanel.tsx
import { useState } from "react";
import { useDailyReport } from "../hooks/useDailyReport";
import { useCashiers } from "../hooks/useCashiers";
import { useAuth } from "../hooks/useAuth";
import { exportDailyReportToCSV } from "../lib/exportToCSV";

interface DailyReportPanelProps {
  isOpen: boolean;
  onClose: () => void;
  terminalId?: string | null;
}

export function DailyReportPanel({
  isOpen,
  onClose,
  terminalId,
}: DailyReportPanelProps) {
  const { permissions } = useAuth(); // 🆕 Para determinar si mostrar selector
  const { cashiers, isLoading: cashiersLoading } = useCashiers(); // 🆕 Lista de cajeros
  const [selectedCashierId, setSelectedCashierId] = useState<string | null>(
    null,
  ); // 🆕 null = "Todos"

  // 🆕 Determinar si el usuario puede ver el selector de cajeros
  // Solo SUPERVISOR y ADMIN tienen el permiso 'users.view'
  const canViewAllCashiers = permissions.includes("users.view");

  // 🆕 Hook de reporte ahora recibe el cashierId seleccionado
  const { summary, isLoading, error, refetch } = useDailyReport(
    terminalId,
    canViewAllCashiers ? selectedCashierId : undefined, // Si es cajero, no pasa nada (backend fuerza su user_id)
  );

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 2,
    }).format(amount);

  const handleExport = () => {
    if (summary) {
      exportDailyReportToCSV(summary, terminalId);
    }
  };

  // 🆕 Handler para seleccionar cajero desde el dropdown
  const handleCashierChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedCashierId(value === "all" ? null : value);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Panel slide-in */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-background shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="bg-white border-b-2 border-neutral/20 p-6 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-text">Reporte del Día</h2>
              <p className="text-sm text-neutral mt-1">
                {summary?.date || new Date().toLocaleDateString("es-MX")}
              </p>
            </div>
            <button
              onClick={onClose}
              className="min-w-[48px] min-h-[48px] flex items-center justify-center bg-neutral/10 hover:bg-neutral/20 text-neutral rounded-lg transition-colors"
              aria-label="Cerrar panel"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          {/* 🆕 Selector de Cajero (solo para SUPERVISOR/ADMIN)*/}
          {canViewAllCashiers && (
            <div className="bg-white border-b-2 border-neutral/20 p-4">
              <label className="block text-sm font-semibold text-text mb-2">
                Filtrar por cajero:
              </label>

              {/* Pills fijos: Todos + Supervisores */}
              <div className="flex flex-wrap gap-2 mb-3">
                <button
                  onClick={() => setSelectedCashierId(null)}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                    selectedCashierId === null
                      ? "bg-primary text-white"
                      : "bg-neutral/10 text-text hover:bg-neutral/20"
                  }`}
                >
                  Todos
                </button>

                {/* Mostrar como pills los SUPERVISORES (papá y mamá) */}
                {cashiers
                  .filter((c) => c.role === "SUPERVISOR")
                  .map((cashier) => (
                    <button
                      key={cashier.id}
                      onClick={() => setSelectedCashierId(cashier.id)}
                      className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                        selectedCashierId === cashier.id
                          ? "bg-primary text-white"
                          : "bg-neutral/10 text-text hover:bg-neutral/20"
                      }`}
                    >
                      {cashier.full_name}
                    </button>
                  ))}
              </div>

              {/* Dropdown "Otros" para cajeros regulares */}
              {cashiers.some((c) => c.role === "CAJERO") && (
                <select
                  value={selectedCashierId || "all"}
                  onChange={handleCashierChange}
                  className="w-full p-2 border-2 border-neutral/30 rounded-lg text-text bg-background focus:outline-none focus:border-primary"
                >
                  <option value="all">Otros cajeros...</option>
                  {cashiers
                    .filter((c) => c.role === "CAJERO")
                    .map((cashier) => (
                      <option key={cashier.id} value={cashier.id}>
                        {cashier.full_name}
                      </option>
                    ))}
                </select>
              )}

              {/* Loading state para cajeros */}
              {cashiersLoading && (
                <p className="text-xs text-neutral mt-2">Cargando cajeros...</p>
              )}
            </div>
          )}
          {/* Contenido del reporte */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Loading */}
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                <p className="text-lg text-neutral font-medium">
                  Cargando reporte...
                </p>
              </div>
            )}

            {/* Error */}
            {error && !isLoading && (
              <div className="bg-error/10 border-2 border-error/30 rounded-xl p-6 text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-error mx-auto mb-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-error font-semibold text-lg mb-2">
                  Error al cargar el reporte
                </p>
                <p className="text-neutral text-sm mb-4">{error}</p>
                <button
                  onClick={refetch}
                  className="px-6 py-2 bg-error text-white font-semibold rounded-lg hover:bg-error/90 transition-colors"
                >
                  Reintentar
                </button>
              </div>
            )}

            {/* Datos del reporte */}
            {summary && !isLoading && !error && (
              <>
                {/* Métricas principales */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-text border-b-2 border-primary/30 pb-2">
                    Resumen General
                  </h3>
                  <MetricCard
                    label="Total de Ventas"
                    value={`${summary.total_ventas} transacciones`}
                    icon="🛒"
                    color="primary"
                  />
                  <MetricCard
                    label="Total Bruto"
                    value={formatCurrency(summary.total_bruto)}
                    icon="💰"
                    color="secondary"
                  />
                  <MetricCard
                    label="Total Neto"
                    value={formatCurrency(summary.total_neto)}
                    icon="💵"
                    color="success"
                  />
                  <MetricCard
                    label="Ganancia Neta"
                    value={formatCurrency(summary.ganancia_neta)}
                    icon="📈"
                    color="success"
                    highlight
                  />
                </div>

                {/* Métricas secundarias */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-text border-b-2 border-neutral/30 pb-2">
                    Desglose por Método de Pago
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <MetricCard
                      label="Efectivo"
                      value={formatCurrency(summary.total_efectivo)}
                      icon="💵"
                      color="neutral"
                      compact
                    />
                    <MetricCard
                      label="Tarjeta"
                      value={formatCurrency(summary.total_tarjeta)}
                      icon="💳"
                      color="neutral"
                      compact
                    />
                  </div>
                  <MetricCard
                    label="Comisiones Terminal"
                    value={formatCurrency(summary.comisiones_terminal)}
                    icon="🏦"
                    color="error"
                    subtitle="Gasto operativo"
                  />
                </div>

                {/* Costo total */}
                <div className="bg-neutral/5 border border-neutral/20 rounded-xl p-4">
                  <p className="text-sm text-neutral mb-1">
                    Costo total de productos
                  </p>
                  <p className="text-2xl font-bold text-text">
                    {formatCurrency(summary.costo_total)}
                  </p>
                </div>
              </>
            )}
          </div>
          {/* Footer con botones */}
          <div className="bg-white border-t-2 border-neutral/20 p-6 space-y-3">
            <button
              onClick={refetch}
              disabled={isLoading}
              className="w-full min-h-[56px] bg-neutral/10 hover:bg-neutral/20 text-text font-semibold text-lg rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Actualizar Datos
            </button>
            <button
              onClick={handleExport}
              disabled={!summary || isLoading}
              className="w-full min-h-[56px] bg-primary hover:bg-primary/90 text-white font-bold text-lg rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Exportar a CSV
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// Componente auxiliar MetricCard (sin cambios)
interface MetricCardProps {
  label: string;
  value: string;
  icon: string;
  color: "primary" | "secondary" | "success" | "error" | "neutral";
  highlight?: boolean;
  compact?: boolean;
  subtitle?: string;
}

function MetricCard({
  label,
  value,
  icon,
  color,
  highlight = false,
  compact = false,
  subtitle,
}: MetricCardProps) {
  const colorClasses = {
    primary: "bg-primary/10 border-primary/30 text-primary",
    secondary: "bg-secondary/10 border-secondary/30 text-secondary",
    success: "bg-success/10 border-success/30 text-success",
    error: "bg-error/10 border-error/30 text-error",
    neutral: "bg-neutral/5 border-neutral/20 text-text",
  };

  return (
    <div
      className={`rounded-xl border-2 p-4 ${colorClasses[color]} ${
        highlight ? "ring-2 ring-success/50 shadow-lg" : ""
      } ${compact ? "p-3" : ""}`}
    >
      <div className="flex items-start justify-between mb-2">
        <span className={compact ? "text-2xl" : "text-3xl"}>{icon}</span>
      </div>
      <p
        className={`text-neutral font-medium mb-1 ${compact ? "text-xs" : "text-sm"}`}
      >
        {label}
      </p>
      <p
        className={`font-bold ${compact ? "text-lg" : "text-2xl"} ${colorClasses[color].split(" ").pop()}`}
      >
        {value}
      </p>
      {subtitle && (
        <p className="text-xs text-neutral mt-1 italic">{subtitle}</p>
      )}
    </div>
  );
}
