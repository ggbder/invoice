
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useComptableInvoices } from '@/hooks/useComptableInvoices';
import { Invoice } from '@/services/invoiceService';
import { formatCurrency } from '@/utils/formatters';
import { CheckCircle, XCircle, Info } from 'lucide-react';

const ComptableDashboard = () => {
  const { user } = useAuth();
  const { pendingInvoices, loading, approveInvoice, rejectInvoice, refreshInvoices } = useComptableInvoices();
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const handleApprove = (invoice: Invoice) => {
    approveInvoice(invoice.id);
  };

  const handleReject = () => {
    if (selectedInvoice && rejectionReason.trim()) {
      rejectInvoice(selectedInvoice.id, rejectionReason);
      setIsRejectDialogOpen(false);
      setRejectionReason('');
    }
  };

  const openRejectDialog = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsRejectDialogOpen(true);
  };

  const viewDetails = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsDetailsOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Comptable Dashboard | RapproInvoice</title>
      </Helmet>
      <Navbar />
      <main className="container mx-auto px-4 py-20">
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold tracking-tight">Comptable Dashboard</h1>
            <Button variant="outline" onClick={refreshInvoices}>
              Refresh
            </Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Pending Invoices</CardTitle>
              <CardDescription>Review and process invoices waiting for your approval</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : pendingInvoices.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p>No pending invoices to review at this time.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Invoice #</TableHead>
                        <TableHead>Supplier</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Submission Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingInvoices.map((invoice) => (
                        <TableRow key={invoice.id}>
                          <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                          <TableCell>{invoice.supplierName}</TableCell>
                          <TableCell>{formatCurrency(invoice.totalAmount)}</TableCell>
                          <TableCell>{new Date(invoice.submissionDate).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">
                              Pending
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => viewDetails(invoice)}
                              >
                                <Info className="h-4 w-4 mr-1" />
                                Details
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                onClick={() => handleApprove(invoice)}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => openRejectDialog(invoice)}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Invoice Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Invoice Details</DialogTitle>
            <DialogDescription>
              Detailed information about the selected invoice.
            </DialogDescription>
          </DialogHeader>
          {selectedInvoice && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Invoice Number</Label>
                  <p className="font-medium">{selectedInvoice.invoiceNumber}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Supplier</Label>
                  <p className="font-medium">{selectedInvoice.supplierName}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Amount</Label>
                  <p className="font-medium">{formatCurrency(selectedInvoice.totalAmount)}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Submission Date</Label>
                  <p className="font-medium">{new Date(selectedInvoice.submissionDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>Close</Button>
            <Button 
              variant="outline"
              className="text-green-600 hover:text-green-700 hover:bg-green-50"
              onClick={() => {
                if (selectedInvoice) {
                  handleApprove(selectedInvoice);
                  setIsDetailsOpen(false);
                }
              }}
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Approve
            </Button>
            <Button 
              variant="outline"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => {
                setIsDetailsOpen(false);
                if (selectedInvoice) {
                  openRejectDialog(selectedInvoice);
                }
              }}
            >
              <XCircle className="h-4 w-4 mr-1" />
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Invoice Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Invoice</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this invoice.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="reason">Rejection Reason</Label>
              <Textarea
                id="reason"
                placeholder="Enter reason for rejection"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="min-h-32"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsRejectDialogOpen(false);
                setRejectionReason('');
              }}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleReject}
              disabled={!rejectionReason.trim()}
            >
              Reject Invoice
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ComptableDashboard;
