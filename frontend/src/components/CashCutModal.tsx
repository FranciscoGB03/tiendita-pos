import { useState, useEffect } from "react";
import { useCashiers, type Cashier } from "../hooks/useCashiers"; // 🆕 'type' agregado
import { useCashCut } from "../hooks/useCashCut";

interface CashCutModalProps {
  isOpen: boolean;
  onClose: () => void;
  terminalId: string | null;
  onSuccess: () => void;
}

export function CashCutModal({
  isOpen,
  onClose,
  terminalId,
  onSuccess,
}: CashCutModalProps) {
  const { cashiers, isLoading: cashiersLoading } = useCashiers();
  const { summary, isLoading, error, fetchSummary, createCut, reset } =
    useCashCut();

  const [selectedCashierId, setSelectedCashierId] = useState<string>("");
  const [actualCashStr, setActualCashStr] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (isOpen && selectedCashierId && terminalId) {
      reset();
      fetchSummary(selectedCashierId, terminalId);
    }
  }, [isOpen, selectedCashierId, terminalId, fetchSummary, reset]);

  if (!isOpen) return null;

  const actualCash = parseFloat(actualCashStr) || 0;
  const difference = summary ? actualCash - summary.expected_total : 0;

  const getDifferenceText = (diff: number) => {
    if (Math.abs(diff) < 0.01)
      return { text: "✅ Caja Cuadrada", color: "text-success" };
    if (diff < 0)
      return {
        text: `⚠️ Faltante: $${Math.abs(diff).toFixed(2)}`,
        color: "text-error",
      };
    return {
      text: `⚠️ Sobrante: $${diff.toFixed(2)}`,
      color: "text-secondary",
    };
  };

  const diffInfo = getDifferenceText(difference);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!selectedCashierId || !terminalId || !summary) return;

    try {
      await createCut(selectedCashierId, terminalId, actualCash, notes);
      onSuccess();
    } catch {
      // El error ya se guardó en el hook, no hacemos nada extra aquí
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border-2 border-neutral/20">
        {/* Header */}
        <div className="bg-primary text-white p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            🧾 Corte de Caja
          </h2>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white text-3xl font-bold"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Selector de Cajero */}
          <div>
            <label className="block text-sm font-bold text-text mb-2">
              Cajero a cortar:
            </label>
            <select
              value={selectedCashierId}
              onChange={(e) => setSelectedCashierId(e.target.value)}
              className="w-full p-3 border-2 border-neutral/30 rounded-lg text-text bg-background focus:outline-none focus:border-primary text-lg"
              disabled={isLoading || cashiersLoading}
              required
            >
              <option value="">-- Selecciona un cajero --</option>
              {cashiers.map((c: Cashier) => (
                <option key={c.id} value={c.id}>
                  {c.full_name} ({c.role})
                </option>
              ))}
            </select>
          </div>

          {/* Resumen del Sistema */}
          {summary && !isLoading && (
            <div className="bg-neutral/5 border-2 border-neutral/20 rounded-xl p-4 space-y-3">
              <h3 className="font-bold text-text border-b border-neutral/30 pb-2">
                Resumen del Turno
              </h3>
              <div className="flex justify-between text-sm">
                <span className="text-neutral">Fondo Fijo:</span>
                <span className="font-semibold">
                  ${summary.initial_fund.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral">Ventas en Efectivo:</span>
                <span className="font-semibold">
                  ${summary.total_cash_expected.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold text-primary border-t border-neutral/30 pt-2">
                <span>Total Esperado en Caja:</span>
                <span>${summary.expected_total.toFixed(2)}</span>
              </div>
            </div>
          )}

          {/* Input de Conteo Físico */}
          {summary && !isLoading && (
            <>
              <div>
                <label className="block text-sm font-bold text-text mb-2">
                  💵 Efectivo contado físicamente:
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={actualCashStr}
                  onChange={(e) => setActualCashStr(e.target.value)}
                  className="w-full p-4 text-2xl font-bold border-2 border-neutral/30 rounded-lg text-text bg-background focus:outline-none focus:border-primary text-right"
                  placeholder="0.00"
                  required
                  autoFocus
                />
              </div>

              {/* Diferencia en tiempo real */}
              <div
                className={`text-center p-3 rounded-lg bg-neutral/5 border-2 border-neutral/20 ${diffInfo.color} font-bold text-xl`}
              >
                {diffInfo.text}
              </div>

              {/* Observaciones */}
              <div>
                <label className="block text-sm font-bold text-text mb-2">
                  Observaciones (opcional):
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-3 border-2 border-neutral/30 rounded-lg text-text bg-background focus:outline-none focus:border-primary"
                  rows={2}
                  placeholder="Ej: Se entregó cambio a cliente sin ticket..."
                />
              </div>
            </>
          )}

          {/* Estados de Carga / Error */}
          {isLoading && !summary && (
            <div className="flex flex-col items-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-3"></div>
              <p className="text-neutral">Calculando ventas del turno...</p>
            </div>
          )}
          {error && (
            <div className="bg-error/10 border-2 border-error/30 text-error p-4 rounded-lg text-center font-semibold">
              {error}
            </div>
          )}

          {/* Botones de Acción */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 py-4 bg-neutral/10 hover:bg-neutral/20 text-text font-bold text-lg rounded-xl transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading || !summary || actualCashStr === ""}
              className="flex-1 py-4 bg-primary hover:bg-primary/90 text-white font-bold text-lg rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {isLoading ? "Procesando..." : "Confirmar y Cerrar Caja"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
