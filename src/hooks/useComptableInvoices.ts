
import { useState, useEffect } from 'react';
import { Invoice, invoiceService } from '@/services/invoiceService';
import { useToast } from '@/hooks/use-toast';

export function useComptableInvoices() {
  const [pendingInvoices, setPendingInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPendingInvoices();
  }, []);

  const fetchPendingInvoices = () => {
    setLoading(true);
    try {
      const invoices = invoiceService.getPendingInvoices();
      setPendingInvoices(invoices);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching pending invoices:', error);
      toast({
        title: "Error",
        description: "Failed to fetch pending invoices",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  const approveInvoice = (id: string) => {
    try {
      const updatedInvoice = invoiceService.approveInvoice(id);
      
      if (updatedInvoice) {
        // Update the local state to remove the approved invoice
        setPendingInvoices(prevInvoices => 
          prevInvoices.filter(invoice => invoice.id !== id)
        );
        
        toast({
          title: "Invoice Approved",
          description: `Invoice #${updatedInvoice.invoiceNumber} has been approved successfully.`,
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to approve invoice. Invoice not found.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error approving invoice:', error);
      toast({
        title: "Error",
        description: "An error occurred while approving the invoice",
        variant: "destructive"
      });
    }
  };

  const rejectInvoice = (id: string, reason: string) => {
    try {
      const updatedInvoice = invoiceService.rejectInvoice(id, reason);
      
      if (updatedInvoice) {
        // Update the local state to remove the rejected invoice
        setPendingInvoices(prevInvoices => 
          prevInvoices.filter(invoice => invoice.id !== id)
        );
        
        toast({
          title: "Invoice Rejected",
          description: `Invoice #${updatedInvoice.invoiceNumber} has been rejected.`,
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to reject invoice. Invoice not found.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error rejecting invoice:', error);
      toast({
        title: "Error",
        description: "An error occurred while rejecting the invoice",
        variant: "destructive"
      });
    }
  };

  return {
    pendingInvoices,
    loading,
    approveInvoice,
    rejectInvoice,
    refreshInvoices: fetchPendingInvoices,
  };
}
