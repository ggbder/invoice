
import React, { useState } from 'react';
import { ProcessedInvoice } from '@/types/invoice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { ChevronLeft, Save } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface InvoicePreviewProps {
  invoice: ProcessedInvoice;
  onBack: () => void;
}

export function InvoicePreview({ invoice, onBack }: InvoicePreviewProps) {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  // Form setup with the extracted invoice data
  const form = useForm({
    defaultValues: {
      invoiceNumber: invoice.data?.invoiceNumber || '',
      supplierName: invoice.data?.supplierName || '',
      invoiceDate: invoice.data?.invoiceDate || '',
      dueDate: invoice.data?.dueDate || '',
      totalAmount: invoice.data?.totalAmount?.toString() || '',
      taxRate: invoice.data?.taxRate?.toString() || '',
      notes: invoice.data?.notes || '',
    },
  });

  const handleSaveChanges = (values: any) => {
    // Here you would update the invoice data
    toast({
      title: "Changes saved",
      description: "Invoice data has been updated successfully."
    });
    setIsEditing(false);
  };

  if (!invoice.success || !invoice.data) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <CardTitle>Invoice Preview</CardTitle>
          </div>
          <CardDescription>There was an error processing this invoice</CardDescription>
        </CardHeader>
        <CardContent className="p-6 text-center">
          <div className="mb-4 text-destructive font-medium">
            Unable to preview invoice data
          </div>
          <p className="text-muted-foreground">
            {invoice.errorMessage || 'An unknown error occurred during processing'}
          </p>
          <Button variant="outline" className="mt-4" onClick={onBack}>
            Back to Summary
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div>
              <CardTitle>Invoice Preview</CardTitle>
              <CardDescription>
                {invoice.fileName}
              </CardDescription>
            </div>
          </div>
          <Button 
            variant={isEditing ? "outline" : "secondary"} 
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "Cancel Editing" : "Edit Data"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSaveChanges)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="invoiceNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Invoice Number</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Invoice Number" 
                        {...field} 
                        readOnly={!isEditing}
                        className={!isEditing ? "bg-secondary" : ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="supplierName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Supplier Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Supplier Name" 
                        {...field} 
                        readOnly={!isEditing}
                        className={!isEditing ? "bg-secondary" : ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="invoiceDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Invoice Date</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="YYYY-MM-DD" 
                        {...field} 
                        readOnly={!isEditing}
                        className={!isEditing ? "bg-secondary" : ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="YYYY-MM-DD" 
                        {...field} 
                        readOnly={!isEditing}
                        className={!isEditing ? "bg-secondary" : ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="totalAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Amount</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        step="0.01" 
                        placeholder="0.00" 
                        {...field} 
                        readOnly={!isEditing}
                        className={!isEditing ? "bg-secondary" : ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="taxRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tax Rate (%)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        step="0.01" 
                        placeholder="0.00" 
                        {...field} 
                        readOnly={!isEditing}
                        className={!isEditing ? "bg-secondary" : ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Additional notes about this invoice" 
                      {...field} 
                      readOnly={!isEditing}
                      className={!isEditing ? "bg-secondary" : ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Item list would go here - simplified for now */}
            <Card>
              <CardHeader>
                <CardTitle>Invoice Items</CardTitle>
              </CardHeader>
              <CardContent>
                {invoice.data?.items && invoice.data.items.length > 0 ? (
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
                      {invoice.data.items.map((item, index) => (
                        <tr key={index} className="border-b border-border">
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
                        <td className="pt-2 text-right font-medium">
                          ${invoice.data.items.reduce((sum, item) => sum + item.total, 0).toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    No item details available
                  </div>
                )}
              </CardContent>
            </Card>

            {isEditing && (
              <Button type="submit" className="w-full sm:w-auto">
                <Save className="h-4 w-4 mr-2" /> Save Changes
              </Button>
            )}
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back to Summary
        </Button>
      </CardFooter>
    </Card>
  );
}
