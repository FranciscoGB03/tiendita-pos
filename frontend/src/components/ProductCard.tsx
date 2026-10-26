import type { Product } from '../types/Product';

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
}

export const ProductCard = ({ product, onAdd }: ProductCardProps) => {
  // Imagen por defecto si el producto no tiene o falla la carga
  const fallbackImage = 'https://via.placeholder.com/300x200?text=Sin+Imagen';

  return (
    <div className="flex flex-col bg-white border-2 border-gray-300 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Área de Imagen */}
      <div className="h-40 w-full bg-gray-100 flex items-center justify-center overflow-hidden">
        <img 
          src={product.image_url || fallbackImage} 
          alt={product.name} 
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = fallbackImage;
          }}
        />
      </div>

      {/* Área de Contenido */}
      <div className="flex flex-col flex-grow p-4 gap-3">
        {/* Nombre del producto (máximo 2 líneas) */}
        <h3 className="text-xl font-bold text-gray-900 leading-tight line-clamp-2 min-h-[3.5rem]">
          {product.name}
        </h3>

        {/* Precio (destacado y grande) */}
        <p className="text-2xl font-extrabold text-green-700">
          ${product.sale_price.toFixed(2)}
        </p>

        {/* Botón de Agregar (Mínimo 60px de altura para cumplir la regla UX) */}
        <button
          type="button"
          onClick={() => onAdd(product)}
          className="mt-auto w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-lg py-5 px-4 rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-4 focus:ring-blue-300 min-h-[60px]"
        >
          AGREGAR
        </button>
      </div>
    </div>
  );
};