
import React from 'react';
import { ProcessedInvoice } from '@/types/invoice';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  FileCheck,
  FileX,
  Eye,
  Download,
  FileSpreadsheet
} from 'lucide-react';

interface UploadSummaryProps {
  processedInvoices: ProcessedInvoice[];
  onPreviewInvoice: (index: number) => void;
}

export function UploadSummary({ processedInvoices, onPreviewInvoice }: UploadSummaryProps) {
  const successCount = processedInvoices.filter(inv => inv.success).length;
  const failedCount = processedInvoices.length - successCount;
  
  const handleDownloadErrorLog = () => {
    // Create error log content
    const errorLog = processedInvoices
      .filter(inv => !inv.success)
      .map(inv => {
        return `File: ${inv.fileName}\nError: ${inv.errorMessage}\n\n`;
      })
      .join('');
      
    // Create blob and trigger download
    const blob = new Blob([errorLog], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'invoice-processing-errors.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Files</CardTitle>
            <CardDescription>All files processed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{processedInvoices.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-green-600">Successful</CardTitle>
            <CardDescription>Files processed successfully</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center">
            <FileCheck className="h-8 w-8 text-green-500 mr-2" />
            <div className="text-3xl font-bold text-green-600">{successCount}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-destructive">Failed</CardTitle>
            <CardDescription>Files with processing errors</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center">
            <FileX className="h-8 w-8 text-destructive mr-2" />
            <div className="text-3xl font-bold text-destructive">{failedCount}</div>
          </CardContent>
          {failedCount > 0 && (
            <CardFooter>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={handleDownloadErrorLog}
              >
                <Download className="h-4 w-4 mr-1" /> Download Error Log
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
      
      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <CardTitle>Processed Invoices</CardTitle>
          <CardDescription>
            Review the processed invoice data or view detailed previews
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>File Name</TableHead>
                <TableHead>Invoice Number</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {processedInvoices.map((invoice, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Badge variant={invoice.success ? "default" : "destructive"}>
                      {invoice.success ? "Success" : "Failed"}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{invoice.fileName}</TableCell>
                  <TableCell>
                    {invoice.success && invoice.data?.invoiceNumber 
                      ? invoice.data.invoiceNumber 
                      : "—"}
                  </TableCell>
                  <TableCell>
                    {invoice.success && invoice.data?.supplierName
                      ? invoice.data.supplierName
                      : "—"}
                  </TableCell>
                  <TableCell>
                    {invoice.success && invoice.data?.invoiceDate
                      ? invoice.data.invoiceDate
                      : "—"}
                  </TableCell>
                  <TableCell>
                    {invoice.success && invoice.data?.totalAmount
                      ? `$${invoice.data.totalAmount.toFixed(2)}`
                      : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onPreviewInvoice(index)}
                      disabled={!invoice.success}
                      title={invoice.success ? "Preview Invoice" : "Preview not available"}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {processedInvoices.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No processed invoices to display
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Export options */}
      {successCount > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Export Options</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="mr-2">
              <FileSpreadsheet className="h-4 w-4 mr-2" /> Export to Excel
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
