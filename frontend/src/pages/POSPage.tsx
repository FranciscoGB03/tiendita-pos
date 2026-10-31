import { useState } from "react";
import { ProductGrid } from "../components/ProductGrid";
import { CartTicket } from "../components/CartTicket";
import { PaymentModal } from "../components/PaymentModal";
import { useCart } from "../hooks/useCart";
import { useTerminalId } from "../hooks/useTerminalId";
import { TerminalConfigModal } from "../components/TerminalConfigModal";
import { saleService } from "../services/saleService";

export const POSPage = () => {
  const { items, total, addToCart, updateQuantity, removeFromCart, clearCart } =
    useCart();
  const [showSuccess, setShowSuccess] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { terminalId, isLoading, needsConfiguration, setTerminal } =
    useTerminalId();

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

      console.log("📤 [POSPage] Enviando petición al backend...");
      await saleService.createSale(saleRequest);
      console.log("✅ [POSPage] Venta exitosa");

      setIsPaymentModalOpen(false);
      setShowSuccess(true);
      clearCart();
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error: unknown) {
      console.error("❌ [POSPage] ERROR en venta:", error);
      const errorMsg =
        error instanceof Error ? error.message : "Error al procesar la venta";
      setErrorMessage(errorMsg);
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
          <span className="text-sm font-semibold text-neutral bg-neutral/10 px-3 py-1 rounded-full">
            Caja: {terminalId}
          </span>
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
