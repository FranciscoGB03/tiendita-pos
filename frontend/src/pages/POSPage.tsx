import { useState } from "react";
import { ProductGrid } from "../components/ProductGrid";
import { CartTicket } from "../components/CartTicket";
import { useCart } from "../hooks/useCart";
import { useTerminalId } from "../hooks/useTerminalId";
import { TerminalConfigModal } from "../components/TerminalConfigModal";

export const POSPage = () => {
  const { items, total, addToCart, updateQuantity, removeFromCart, clearCart } =
    useCart();
  const [showSuccess, setShowSuccess] = useState(false);

  // 🔑 Hook de identificación de caja
  const { terminalId, isLoading, needsConfiguration, setTerminal } =
    useTerminalId();

  // Estado de carga
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-text text-2xl font-bold">
        Cargando configuración de caja...
      </div>
    );
  }

  // Modal de configuración (solo si no hay terminal_id válido)
  if (needsConfiguration) {
    return <TerminalConfigModal onConfigure={setTerminal} />;
  }

  const handleCheckout = (method: "EFECTIVO" | "TARJETA") => {
    console.log(
      `[Checkout] Venta procesada: ${method} | Total: $${total.toFixed(2)} | Terminal: ${terminalId}`,
    );
    setShowSuccess(true);
    clearCart();
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden relative">
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
          onCheckout={handleCheckout}
          onClear={clearCart}
        />
      </aside>
    </div>
  );
};
