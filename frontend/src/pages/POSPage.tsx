import { useState } from "react";
import { ProductGrid } from "../components/ProductGrid";
import { CartTicket } from "../components/CartTicket";
import { useCart } from "../hooks/useCart";

export const POSPage = () => {
  const { items, total, addToCart, updateQuantity, removeFromCart, clearCart } =
    useCart();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleCheckout = (method: "EFECTIVO" | "TARJETA") => {
    console.log(
      `[Checkout] Venta procesada: ${method} | Total: $${total.toFixed(2)}`,
    );
    setShowSuccess(true);
    clearCart();
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden relative">
      {showSuccess && (
        <div className="absolute inset-0 bg-green-600/95 z-50 flex flex-col items-center justify-center text-white animate-fade-in">
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
        <header className="bg-white shadow-sm p-4 border-b-2 border-gray-200">
          <h1 className="text-3xl font-bold text-gray-800">Punto de Venta</h1>
        </header>

        <div className="flex-1 overflow-y-auto">
          <ProductGrid onAddToCart={addToCart} />
        </div>
      </main>

      <aside className="w-[400px] bg-white border-l-2 border-gray-200 flex flex-col shadow-lg hidden md:flex">
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
