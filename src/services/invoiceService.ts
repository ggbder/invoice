import api from './apiService';

// Frontend-friendly interface (matches Dashboard component)
export interface Invoice {
  id: string;
  invoiceNumber: string; // Maps to backend's numeroFacture
  supplierName: string; // Maps to backend's fournisseur
  totalAmount: number; // Maps to backend's montantTotal
  submissionDate: string; // Maps to backend's dateFacture
  status: 'EnAttente' | 'Validee' | 'Annulee';
  validationDate?: string; // Maps to backend's dateValidation
  rejectionReason?: string; // Maps to backend's motifRejet
  createdBy: string; // Maps to backend's creePar
}

export const invoiceService = {
  // Fetch all invoices (for admins)
  getAllInvoices: async (): Promise<Invoice[]> => {
    try {
      const response = await api.get('/api/factures'); // Backend endpoint for invoices
      return response.data.map((invoice: any) => ({
        id: invoice.id,
        invoiceNumber: invoice.numeroFacture,
        supplierName: invoice.fournisseur,
        totalAmount: invoice.montantTotal,
        submissionDate: invoice.dateFacture,
        status: invoice.status,
        validationDate: invoice.dateValidation,
        rejectionReason: invoice.motifRejet,
        createdBy: invoice.creePar,
      }));
    } catch (error) {
      throw new Error('Failed to fetch invoices');
    }
  },

  // Fetch invoices for a specific user (non-admins)
  getUserInvoices: async (userId: string): Promise<Invoice[]> => {
    try {
      const response = await api.get(`/api/utilisateurs/${userId}/factures`); // Adjust endpoint
      return response.data.map((invoice: any) => ({
        id: invoice.id,
        invoiceNumber: invoice.numeroFacture,
        supplierName: invoice.fournisseur,
        totalAmount: invoice.montantTotal,
        submissionDate: invoice.dateFacture,
        status: invoice.status,
        validationDate: invoice.dateValidation,
        rejectionReason: invoice.motifRejet,
        createdBy: invoice.creePar,
      }));
    } catch (error) {
      throw new Error('Failed to fetch user invoices');
    }
  },

  // Create invoice (maps frontend fields to backend's French names)
  createInvoice: async (invoiceData: Omit<Invoice, 'id' | 'status' | 'validationDate' | 'rejectionReason'>): Promise<Invoice> => {
    try {
      const response = await api.post('/api/factures', {
        numeroFacture: invoiceData.invoiceNumber,
        fournisseur: invoiceData.supplierName,
        montantTotal: invoiceData.totalAmount,
        dateFacture: invoiceData.submissionDate,
        creePar: invoiceData.createdBy,
      });
      return {
        ...response.data,
        invoiceNumber: response.data.numeroFacture,
        supplierName: response.data.fournisseur,
        totalAmount: response.data.montantTotal,
        submissionDate: response.data.dateFacture,
        validationDate: response.data.dateValidation,
        rejectionReason: response.data.motifRejet,
        createdBy: response.data.creePar,
      };
    } catch (error) {
      throw new Error('Failed to create invoice');
    }
  },

  // Approve invoice (backend expects French status names)
  approveInvoice: async (id: string): Promise<Invoice> => {
    try {
      const response = await api.put(`/api/factures/${id}/approuver`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to approve invoice');
    }
  },

  // Reject invoice (backend expects French status names)
  rejectInvoice: async (id: string, rejectionReason: string): Promise<Invoice> => {
    try {
      const response = await api.put(`/api/factures/${id}/rejeter`, { motifRejet: rejectionReason });
      return response.data;
    } catch (error) {
      throw new Error('Failed to reject invoice');
    }
  },
};