import type { CartItem } from '../types/CartItem';

interface CartTicketProps {
  items: CartItem[];
  total: number;
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemove: (productId: string) => void;
}

export const CartTicket = ({ items, total, onUpdateQuantity, onRemove }: CartTicketProps) => {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 p-6 text-center">
        <p className="text-[22px] font-semibold">El carrito está vacío</p>
        <p className="text-lg mt-2">Agrega productos para comenzar</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-4 border-b-2 border-gray-200">
        <h2 className="text-[24px] font-bold text-gray-800">Ticket de Venta</h2>
      </div>

      {/* Lista de Productos */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between border-b border-gray-100 pb-4">
            {/* Info Producto */}
            <div className="flex-1 pr-2">
              <h3 className="text-[20px] font-semibold text-gray-800 leading-tight">{item.name}</h3>
              <p className="text-[18px] text-gray-600 mt-1">${item.sale_price.toFixed(2)} c/u</p>
            </div>

            {/* Controles de Cantidad (Botones ≥60px) */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onUpdateQuantity(item.id, -1)}
                className="min-w-[60px] min-h-[60px] flex items-center justify-center bg-red-50 text-red-600 border-2 border-red-200 rounded-xl font-bold text-[24px] active:bg-red-100 transition-colors"
                aria-label="Disminuir cantidad"
              >
                -
              </button>
              
              <span className="w-10 text-center text-[22px] font-bold text-gray-800">
                {item.quantity}
              </span>
              
              <button
                onClick={() => onUpdateQuantity(item.id, 1)}
                className="min-w-[60px] min-h-[60px] flex items-center justify-center bg-blue-50 text-blue-600 border-2 border-blue-200 rounded-xl font-bold text-[24px] active:bg-blue-100 transition-colors"
                aria-label="Aumentar cantidad"
              >
                +
              </button>
            </div>

            {/* Botón Eliminar */}
            <button
              onClick={() => onRemove(item.id)}
              className="ml-2 min-w-[60px] min-h-[60px] flex items-center justify-center text-gray-400 hover:text-red-500 active:text-red-600 transition-colors"
              aria-label="Eliminar producto"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* Footer / Total */}
      <div className="p-6 border-t-2 border-gray-200 bg-gray-50">
        <div className="flex justify-between items-center">
          <span className="text-[24px] font-bold text-gray-800">Total:</span>
          <span className="text-[32px] font-bold text-green-600">${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};