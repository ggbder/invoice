
// Extended File type with preview URL
export interface FileWithPreview extends File {
  preview: string;
}

// Invoice item structure
export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

// Invoice data structure
export interface InvoiceData {
  invoiceNumber: string;
  supplierName: string;
  supplierAddress?: string;
  invoiceDate: string;
  dueDate: string;
  invoiceType: 'sales' | 'purchase' | 'service' | 'other'; // New field
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
  notes?: string;
}

// Result of processing an invoice file
export interface ProcessedInvoice {
  fileName: string;
  fileType: string;
  success: boolean;
  data?: InvoiceData;
  errorMessage?: string;
  originalFile: File;
}
