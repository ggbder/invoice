import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Plus, Trash2, Save, FileText, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { InvoiceData, InvoiceItem } from '@/types/invoice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const CreateInvoice = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [reviewMode, setReviewMode] = useState(false);
  
  // Default empty invoice item
  const emptyItem: InvoiceItem = {
    description: '',
    quantity: 1,
    unitPrice: 0,
    total: 0
  };

  // State for invoice data
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    invoiceNumber: '',
    supplierName: '',
    supplierAddress: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    invoiceType: 'other',
    items: [{ ...emptyItem }],
    subtotal: 0,
    taxRate: 10,
    taxAmount: 0,
    totalAmount: 0,
    notes: ''
  });

  // Update invoice item
  const updateItem = (index: number, field: keyof InvoiceItem, value: any) => {
    const updatedItems = [...invoiceData.items];
    
    let parsedValue = value;
    if (field === 'quantity' || field === 'unitPrice') {
      parsedValue = parseFloat(value) || 0;
    }
    
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: parsedValue
    };
    
    updatedItems[index].total = 
      updatedItems[index].quantity * updatedItems[index].unitPrice;
    
    setInvoiceData(prev => ({ ...prev, items: updatedItems }));
    recalculateTotals(updatedItems);
  };

  // Add new item
  const addItem = () => {
    setInvoiceData(prev => ({
      ...prev,
      items: [...prev.items, { ...emptyItem }]
    }));
  };

  // Remove item
  const removeItem = (index: number) => {
    if (invoiceData.items.length <= 1) {
      toast({
        title: "Cannot remove item",
        description: "Invoice must have at least one item",
        variant: "destructive"
      });
      return;
    }
    
    const updatedItems = invoiceData.items.filter((_, i) => i !== index);
    setInvoiceData(prev => ({ ...prev, items: updatedItems }));
    recalculateTotals(updatedItems);
  };

  // Recalculate subtotal, tax, and total
  const recalculateTotals = (items: InvoiceItem[]) => {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const taxAmount = subtotal * (invoiceData.taxRate / 100);
    const totalAmount = subtotal + taxAmount;
    
    setInvoiceData(prev => ({
      ...prev,
      subtotal,
      taxAmount,
      totalAmount
    }));
  };

  // Update tax rate
  const updateTaxRate = (value: string) => {
    const taxRate = parseFloat(value) || 0;
    const taxAmount = invoiceData.subtotal * (taxRate / 100);
    const totalAmount = invoiceData.subtotal + taxAmount;
    
    setInvoiceData(prev => ({
      ...prev,
      taxRate,
      taxAmount,
      totalAmount
    }));
  };

  // Handle form field changes
  const handleInputChange = (field: keyof InvoiceData, value: any) => {
    setInvoiceData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Go to review page
  const reviewInvoice = () => {
    if (!invoiceData.invoiceNumber || !invoiceData.supplierName) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    setReviewMode(true);
    window.scrollTo(0, 0);
  };

  // Save invoice
  const saveInvoice = () => {
    console.log('Saving invoice:', invoiceData);
    
    toast({
      title: "Invoice saved",
      description: `Invoice ${invoiceData.invoiceNumber} has been created successfully.`
    });
    
    navigate('/dashboard');
  };

  // Back to edit mode
  const backToEdit = () => {
    setReviewMode(false);
  };

  // Render the review page
  const renderReviewPage = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost"
            className="mr-4 p-2"
            onClick={backToEdit}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-medium tracking-tight">Review & Submit Invoice</h1>
            <p className="text-muted-foreground mt-1">
              Review invoice details before submitting.
            </p>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Invoice Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium">Invoice Number</h3>
                <p>{invoiceData.invoiceNumber}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium">Supplier Name</h3>
                <p>{invoiceData.supplierName}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium">Supplier Address</h3>
                <p>{invoiceData.supplierAddress || 'Not provided'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium">Invoice Date</h3>
                <p>{invoiceData.invoiceDate}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium">Due Date</h3>
                <p>{invoiceData.dueDate}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium">Invoice Type</h3>
                <p>{invoiceData.invoiceType === 'sales' ? 'Sales Invoice' :
                    invoiceData.invoiceType === 'purchase' ? 'Purchase Invoice' :
                    invoiceData.invoiceType === 'service' ? 'Service Invoice' : 
                    'Other'}</p>
              </div>
            </div>
            
            {invoiceData.notes && (
              <div>
                <h3 className="text-sm font-medium">Notes</h3>
                <p className="text-sm">{invoiceData.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Invoice Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left pb-2">Description</th>
                    <th className="text-center pb-2">Quantity</th>
                    <th className="text-right pb-2">Unit Price</th>
                    <th className="text-right pb-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceData.items.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2">{item.description}</td>
                      <td className="py-2 text-center">{item.quantity}</td>
                      <td className="py-2 text-right">${item.unitPrice.toFixed(2)}</td>
                      <td className="py-2 text-right">${item.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3} className="pt-2 text-right font-medium">Subtotal:</td>
                    <td className="pt-2 text-right font-medium">${invoiceData.subtotal.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="pt-2 text-right font-medium">Tax ({invoiceData.taxRate}%):</td>
                    <td className="pt-2 text-right font-medium">${invoiceData.taxAmount.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="pt-2 text-right font-medium text-lg">Total:</td>
                    <td className="pt-2 text-right font-medium text-lg">${invoiceData.totalAmount.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-between mt-8">
          <Button 
            variant="outline" 
            onClick={backToEdit}
            className="flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Edit Invoice
          </Button>
          
          <Button 
            onClick={saveInvoice}
            className="flex items-center"
          >
            <Save className="h-4 w-4 mr-2" />
            Submit Invoice
          </Button>
        </div>
      </div>
    );
  };

  // Render the creation form
  const renderCreateForm = () => {
    return (
      <>
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost"
            className="mr-4 p-2"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-medium tracking-tight">Create Invoice</h1>
            <p className="text-muted-foreground mt-1">
              Create and manage your invoices.
            </p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <Label htmlFor="invoiceNumber">Invoice Number*</Label>
              <Input 
                id="invoiceNumber" 
                value={invoiceData.invoiceNumber}
                onChange={(e) => handleInputChange('invoiceNumber', e.target.value)}
                placeholder="INV-12345"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="supplierName">Supplier Name*</Label>
              <Input 
                id="supplierName" 
                value={invoiceData.supplierName}
                onChange={(e) => handleInputChange('supplierName', e.target.value)}
                placeholder="Acme Inc."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="supplierAddress">Supplier Address</Label>
              <Textarea 
                id="supplierAddress" 
                value={invoiceData.supplierAddress || ''}
                onChange={(e) => handleInputChange('supplierAddress', e.target.value)}
                placeholder="123 Business St, City, Country"
                className="min-h-[80px]"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="invoiceDate">Invoice Date</Label>
                <Input 
                  id="invoiceDate" 
                  type="date"
                  value={invoiceData.invoiceDate}
                  onChange={(e) => handleInputChange('invoiceDate', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input 
                  id="dueDate" 
                  type="date"
                  value={invoiceData.dueDate}
                  onChange={(e) => handleInputChange('dueDate', e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="invoiceType">Invoice Type*</Label>
              <Select 
                value={invoiceData.invoiceType}
                onValueChange={(value) => handleInputChange('invoiceType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select invoice type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales">Sales Invoice</SelectItem>
                  <SelectItem value="purchase">Purchase Invoice</SelectItem>
                  <SelectItem value="service">Service Invoice</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <h3 className="text-lg font-medium mb-3">Invoice Items</h3>
          
          <div className="space-y-4 mb-6">
            {invoiceData.items.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-2 items-end border-b pb-4">
                <div className="col-span-12 md:col-span-6 space-y-1">
                  <Label htmlFor={`description-${index}`}>Description</Label>
                  <Input 
                    id={`description-${index}`} 
                    value={item.description}
                    onChange={(e) => updateItem(index, 'description', e.target.value)}
                  />
                </div>
                
                <div className="col-span-4 md:col-span-2 space-y-1">
                  <Label htmlFor={`quantity-${index}`}>Qty</Label>
                  <Input 
                    id={`quantity-${index}`} 
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                  />
                </div>
                
                <div className="col-span-4 md:col-span-2 space-y-1">
                  <Label htmlFor={`unitPrice-${index}`}>Unit Price</Label>
                  <Input 
                    id={`unitPrice-${index}`} 
                    type="number"
                    value={item.unitPrice}
                    onChange={(e) => updateItem(index, 'unitPrice', e.target.value)}
                  />
                </div>
                
                <div className="col-span-3 md:col-span-1 space-y-1">
                  <Label>Total</Label>
                  <div className="h-10 px-3 py-2 rounded-md border bg-muted/50">
                    ${item.total.toFixed(2)}
                  </div>
                </div>
                
                <div className="col-span-1">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    type="button"
                    onClick={() => removeItem(index)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
            
            <Button 
              type="button" 
              variant="outline" 
              onClick={addItem}
              className="flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea 
                  id="notes" 
                  value={invoiceData.notes || ''}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Additional notes or payment instructions..."
                  className="min-h-[100px]"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span>${invoiceData.subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span>Tax Rate (%)</span>
                  <Input 
                    className="w-16"
                    type="number"
                    value={invoiceData.taxRate}
                    onChange={(e) => updateTaxRate(e.target.value)}
                  />
                </div>
                <span>${invoiceData.taxAmount.toFixed(2)}</span>
              </div>
              
              <div className="flex items-center justify-between font-medium text-lg border-t pt-2">
                <span>Total</span>
                <span>${invoiceData.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 mt-8">
            <Button 
              variant="outline" 
              onClick={() => navigate('/dashboard')}
            >
              Cancel
            </Button>
            <Button 
              onClick={reviewInvoice}
              className="flex items-center"
            >
              <FileText className="h-4 w-4 mr-2" />
              Review Invoice
            </Button>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-secondary/30">
      <main className="flex-grow pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {reviewMode ? renderReviewPage() : renderCreateForm()}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CreateInvoice;
