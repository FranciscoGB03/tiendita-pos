import { api } from '../lib/api';
import type { Product } from '../types/Product';

// Tipo para la respuesta estandarizada del backend
interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: { code: number; message: string } | null;
}

export const productService = {
  /**
   * Obtiene la lista de productos activos desde el backend.
   */
  getAll: async (): Promise<Product[]> => {
    const response = await api.get<ApiResponse<Product[]>>('/api/products');
    
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Error desconocido al obtener los productos');
    }
    
    return response.data;
  },
  
  // Aquí agregaremos métodos como getById, create, update, etc. en futuros sprints.
};