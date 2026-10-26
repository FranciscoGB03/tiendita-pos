import { ProductGrid } from '../components/ProductGrid';
import type { Product } from '../types/Product';

export const POSPage = () => {
  // Placeholder para la lógica del carrito (se implementará en el siguiente tema)
  const handleAddProduct = (product: Product) => {
    console.log('Producto agregado al carrito:', product.name);
  };

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
          <ProductGrid onAddProduct={handleAddProduct} />
        </div>
      </main>

      {/* Área Lateral: Carrito (Placeholder) */}
      {/* Oculto en tablets en vertical, visible en monitores/tablets horizontales */}
      <aside className="w-[400px] bg-white border-l-2 border-gray-200 flex flex-col shadow-lg hidden md:flex">
        <div className="p-5 border-b-2 border-gray-200 bg-gray-50">
          <h2 className="text-2xl font-bold text-gray-800">
            Ticket de Venta
          </h2>
        </div>
        
        <div className="flex-1 flex items-center justify-center p-6">
          <p className="text-xl text-gray-500 text-center font-medium">
            El carrito de compras se integrará en el siguiente paso.
          </p>
        </div>
      </aside>

    </div>
  );
};