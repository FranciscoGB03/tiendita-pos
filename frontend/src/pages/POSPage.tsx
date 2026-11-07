import { useState } from "react";
import { ProductGrid } from "../components/ProductGrid";
import { CartTicket } from "../components/CartTicket";
import { PaymentModal } from "../components/PaymentModal";
import { useCart } from "../hooks/useCart";
import { useTerminalId } from "../hooks/useTerminalId";
import { TerminalConfigModal } from "../components/TerminalConfigModal";
import { saleService } from "../services/saleService";
import { useNetworkStatus } from "../hooks/useNetworkStatus";
import { useSyncQueue } from "../hooks/useSyncQueue";

export const POSPage = () => {
  const { items, total, addToCart, updateQuantity, removeFromCart, clearCart } =
    useCart();
  const [showSuccess, setShowSuccess] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { terminalId, isLoading, needsConfiguration, setTerminal } =
    useTerminalId();

  // 🟢🔴 Nuevo hook de estado de red
  const isOnline = useNetworkStatus();
  const { pendingCount, isSyncing } = useSyncQueue();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-text text-2xl font-bold">
        Cargando configuración de caja...
      </div>
    );
  }

  if (needsConfiguration) {
    return <TerminalConfigModal onConfigure={setTerminal} />;
  }

  //  CAMBIO: Ya no recibe 'method', solo abre el modal que vive aquí en POSPage
  const handleCheckout = () => {
    console.log("🛒 [POSPage] Abriendo modal de pago");
    setIsPaymentModalOpen(true);
    setErrorMessage(null);
    setIsProcessing(false);
  };

  // 1. Actualiza la función handlePaymentComplete
  const handlePaymentComplete = async (method: "EFECTIVO" | "TARJETA") => {
    if (isProcessing) {
      console.warn(
        "⚠️ [POSPage] Ya se está procesando, ignorando clic adicional",
      );
      return;
    }

    console.log(
      "🚀 [POSPage] handlePaymentComplete INICIADO - Método:",
      method,
    );
    setIsProcessing(true);

    if (!terminalId) {
      console.error("❌ [POSPage] ERROR: terminalId es nulo");
      setErrorMessage("Error: No se identificó la caja.");
      setIsPaymentModalOpen(false);
      setIsProcessing(false);
      return;
    }

    try {
      const saleRequest = {
        terminal_id: terminalId,
        items: items.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
          unit_price_at_sale: item.sale_price,
        })),
        payments: [
          {
            payment_method: method,
            amount: total,
          },
        ],
      };

      console.log(
        "📤 [POSPage] Enviando petición al backend (o guardando local)...",
      );

      // CAMBIO CLAVE: Usamos el nuevo método con fallback
      const result = await saleService.createSaleWithFallback(saleRequest);

      if (result.success) {
        console.log(
          "✅ [POSPage] Venta procesada correctamente. Offline:",
          result.offline,
        );
        setIsPaymentModalOpen(false);
        setShowSuccess(true);
        clearCart();

        // Ocultar pantalla de éxito después de 3 segundos
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        // Error real del backend (ej. datos inválidos)
        console.error("❌ [POSPage] ERROR en venta:", result.error);
        setErrorMessage(result.error);
      }
    } catch (error: unknown) {
      // Fallback por si ocurre algo inesperado fuera del servicio
      console.error("❌ [POSPage] ERROR inesperado en venta:", error);
      setErrorMessage("Error inesperado al procesar la venta");
    } finally {
      setIsProcessing(false);
      console.log("🏁 [POSPage] handlePaymentComplete FINALIZADO");
    }
  };

  const handlePaymentCancel = () => {
    console.log("🚫 [POSPage] Cancelando cobro");
    setIsPaymentModalOpen(false);
    setErrorMessage(null);
    setIsProcessing(false);
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden relative">
      {/*  EL MODAL VIVE AQUÍ, CONTROLADO POR POSPage */}
      {isPaymentModalOpen && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          total={total}
          onClose={handlePaymentCancel}
          onSelectMethod={handlePaymentComplete}
          isProcessing={isProcessing}
        />
      )}

      {showSuccess && (
        <div className="absolute inset-0 bg-success/95 z-50 flex flex-col items-center justify-center text-white animate-fade-in">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-24 w-24 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <h2 className="text-4xl font-bold">¡Venta Registrada!</h2>
          <p className="text-2xl mt-2">Listo para la siguiente venta</p>

          {/* Indicador sutil de modo offline (opcional, pero útil para los padres) */}
          <div className="mt-4 flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg">
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
                d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
              />
            </svg>
            <span className="text-lg font-semibold">
              Se sincronizará al reconectar
            </span>
          </div>
        </div>
      )}
      {errorMessage && (
        <div className="absolute inset-0 bg-error/95 z-50 flex flex-col items-center justify-center text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-24 w-24 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          <h2 className="text-4xl font-bold">Error en la Venta</h2>
          <p className="text-2xl mt-2 text-center px-8">{errorMessage}</p>
          <button
            onClick={() => setErrorMessage(null)}
            className="mt-8 px-8 py-3 bg-white text-error font-bold text-xl rounded-xl hover:bg-gray-100"
          >
            Cerrar y Reintentar
          </button>
        </div>
      )}

      <main className="flex-1 flex flex-col min-w-0">
        <header className="bg-white shadow-sm p-4 border-b-2 border-neutral/20 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-text">Punto de Venta</h1>
          {/* Indicadores de estado (Caja + Red + Sync) */}
          <div className="flex items-center gap-3">
            {/* Contador de sincronización (solo si hay pendientes) */}
            {pendingCount > 0 && (
              <div className="flex items-center gap-2 bg-warning/10 text-warning px-3 py-1 rounded-md animate-pulse">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
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
                <span className="text-xs font-bold">
                  {isSyncing
                    ? `Sincronizando...`
                    : `${pendingCount} por sincronizar`}
                </span>
              </div>
            )}

            {/* Semáforo de red */}
            <div className="flex items-center gap-2">
              <span
                className={`flex h-3 w-3 rounded-full ${isOnline ? "bg-success" : "bg-error"} animate-pulse`}
              ></span>
              <span
                className={`text-xs font-bold px-2 py-1 rounded-md ${isOnline ? "bg-success/10 text-success" : "bg-error/10 text-error"}`}
              >
                {isOnline ? "EN LÍNEA" : "OFFLINE"}
              </span>
            </div>

            {/* Badge de la caja */}
            <span className="text-sm font-semibold text-neutral bg-neutral/10 px-3 py-1 rounded-full">
              Caja: {terminalId}
            </span>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto">
          <ProductGrid onAddToCart={addToCart} />
        </div>
      </main>
      <aside className="w-[400px] bg-white border-l-2 border-neutral/20 flex flex-col shadow-lg hidden md:flex">
        <CartTicket
          items={items}
          total={total}
          onUpdateQuantity={updateQuantity}
          onRemove={removeFromCart}
          onCheckout={handleCheckout} //  Ahora coincide con la firma () => void
          onClear={clearCart}
        />
      </aside>
    </div>
  );
};
