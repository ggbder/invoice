
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/apiService';
import { toast } from 'sonner';

export interface Invoice {
  id?: number;
  invoiceNumber: string;
  orderDate: string;
  totalAmount: number;
  status: 'EnAttente' | 'Validee' | 'Annulee';
  supplierId?: number;
  supplierName?: string;
}

// Fetch all invoices
export function useInvoices() {
  return useQuery({
    queryKey: ['invoices'],
    queryFn: async () => {
      const response = await api.get('/api/invoices');
      return response.data;
    },
  });
}

// Create a new invoice
export function useCreateInvoice() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (invoice: Invoice) => {
      const response = await api.post('/api/invoices', invoice);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast.success('Invoice created successfully');
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || 'Failed to create invoice'
      );
    }
  });
}

// Get invoice by ID
export function useInvoice(id?: string | number) {
  return useQuery({
    queryKey: ['invoices', id],
    queryFn: async () => {
      if (!id) return null;
      const response = await api.get(`/api/invoices/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}
