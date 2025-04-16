
import { useQuery } from '@tanstack/react-query';
import api from '@/services/apiService';

export interface Supplier {
  id: number;
  name: string;
}

export function useSuppliers() {
  return useQuery({
    queryKey: ['suppliers'],
    queryFn: async () => {
      try {
        const response = await api.get('/api/fournisseurs');
        return response.data;
      } catch (error) {
        console.error('Failed to fetch suppliers:', error);
        // Return empty array instead of throwing to make the dropdown more resilient
        return [];
      }
    },
  });
}
