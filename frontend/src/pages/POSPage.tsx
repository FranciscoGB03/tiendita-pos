import { ProductGrid } from '../components/ProductGrid';
import { CartTicket } from '../components/CartTicket';
import { useCart } from '../hooks/useCart';

export const POSPage = () => {
  const { items, total, addToCart, updateQuantity, removeFromCart } = useCart();

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      
      {/* Área Principal: Grid de Productos */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="bg-white shadow-sm p-4 border-b-2 border-gray-200">
          <h1 className="text-3xl font-bold text-gray-800">
            Punto de Venta
          </h1>
        </header>
        
        <div className="flex-1 overflow-y-auto">
          <ProductGrid onAddToCart={addToCart} />
        </div>
      </main>

      {/* Panel Lateral: Ticket de Venta */}
      <aside className="w-[400px] bg-white border-l-2 border-gray-200 flex flex-col shadow-lg hidden md:flex">
        <CartTicket 
          items={items} 
          total={total} 
          onUpdateQuantity={updateQuantity} 
          onRemove={removeFromCart} 
        />
      </aside>

    </div>
  );
};