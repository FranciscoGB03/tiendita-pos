import { useProducts } from '../hooks/useProducts';
import { ProductCard } from './ProductCard';
import type { Product } from '../types/Product';

interface ProductGridProps {
  onAddProduct: (product: Product) => void;
}

export const ProductGrid = ({ onAddProduct }: ProductGridProps) => {
  const { products, isLoading, error } = useProducts();

  // Estado de Carga
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-2xl text-gray-600 font-medium">Cargando productos...</p>
      </div>
    );
  }

  // Estado de Error
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-2xl text-red-600 font-bold">Error: {error}</p>
      </div>
    );
  }

  // Estado Vacío
  if (products.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-2xl text-gray-600 font-medium">No hay productos disponibles.</p>
      </div>
    );
  }

  // Grid de Productos
  // 2 columnas por defecto (tablet), 3 columnas en monitores grandes (lg)
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAdd={onAddProduct}
        />
      ))}
    </div>
  );
};