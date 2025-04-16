
import { FileWithPreview, ProcessedInvoice, InvoiceData, InvoiceItem } from '@/types/invoice';

// Main function for processing invoice files
export async function processInvoiceFiles(
  files: FileWithPreview[], 
  onProgress: (progress: number) => void,
  abortSignal?: AbortSignal
): Promise<ProcessedInvoice[]> {
  const results: ProcessedInvoice[] = [];
  let processedCount = 0;

  // Process files in batches of 3 for better performance
  const batchSize = 3;
  const totalFiles = files.length;
  
  for (let i = 0; i < totalFiles; i += batchSize) {
    // Check if operation was aborted
    if (abortSignal?.aborted) {
      throw new Error('Operation was cancelled');
    }
    
    const batch = files.slice(i, i + batchSize);
    const batchPromises = batch.map(file => processInvoiceFile(file));
    
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
    
    processedCount += batch.length;
    onProgress((processedCount / totalFiles) * 100);
    
    // Small delay to avoid blocking the UI
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  
  return results;
}

// Process a single invoice file
async function processInvoiceFile(file: FileWithPreview): Promise<ProcessedInvoice> {
  try {
    // Check file type
    if (file.type === 'application/pdf') {
      return await processPdfInvoice(file);
    } else if (
      file.type === 'application/vnd.ms-excel' ||
      file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      return await processExcelInvoice(file);
    } else {
      throw new Error(`Unsupported file type: ${file.type}`);
    }
  } catch (error) {
    console.error(`Error processing ${file.name}:`, error);
    return {
      fileName: file.name,
      fileType: file.type,
      success: false,
      errorMessage: error instanceof Error ? error.message : 'Unknown error occurred',
      originalFile: file
    };
  }
}

// Placeholder function for PDF processing
// In a real implementation, this would use libraries like pdf-parse or pdf-lib
async function processPdfInvoice(file: File): Promise<ProcessedInvoice> {
  // Simulate processing delay
  await simulateProcessingDelay(500, 1500);
  
  // Normally this would extract text from PDF and parse it
  // For demo purposes, we'll return mock data
  if (Math.random() > 0.2) { // 80% success rate for demo
    const data = generateMockInvoiceData(file.name);
    
    return {
      fileName: file.name,
      fileType: file.type,
      success: true,
      data,
      originalFile: file
    };
  } else {
    // Simulate random processing errors
    throw new Error('Could not extract required fields from the PDF');
  }
}

// Placeholder function for Excel processing
// In a real implementation, this would use libraries like xlsx
async function processExcelInvoice(file: File): Promise<ProcessedInvoice> {
  // Simulate processing delay
  await simulateProcessingDelay(300, 1000);
  
  // Normally this would parse Excel data
  // For demo purposes, we'll return mock data
  if (Math.random() > 0.1) { // 90% success rate for demo
    const data = generateMockInvoiceData(file.name);
    
    return {
      fileName: file.name,
      fileType: file.type,
      success: true,
      data,
      originalFile: file
    };
  } else {
    // Simulate random processing errors
    throw new Error('Could not map columns in the Excel file to expected fields');
  }
}

// Helper function to generate mock invoice data for demonstration
function generateMockInvoiceData(filename: string): InvoiceData {
  const invoiceNumber = `INV-${Math.floor(10000 + Math.random() * 90000)}`;
  
  const suppliers = [
    'Tech Solutions Inc.',
    'Office Supplies Ltd.',
    'Global Logistics Co.',
    'Creative Design Agency',
    'Premium Software Services'
  ];
  
  const now = new Date();
  const invoiceDate = new Date(now.setDate(now.getDate() - Math.floor(Math.random() * 30)));
  const dueDate = new Date(invoiceDate);
  dueDate.setDate(dueDate.getDate() + 30);
  
  // Invoice types
  const invoiceTypes: Array<'sales' | 'purchase' | 'service' | 'other'> = [
    'sales', 'purchase', 'service', 'other'
  ];
  
  const items: InvoiceItem[] = [];
  const itemCount = Math.floor(Math.random() * 5) + 1;
  
  const possibleItems = [
    { name: 'Web Development', price: 95 },
    { name: 'Graphic Design', price: 85 },
    { name: 'Server Hosting', price: 120 },
    { name: 'Technical Support', price: 75 },
    { name: 'Software License', price: 299 },
    { name: 'Marketing Services', price: 150 },
    { name: 'Office Supplies', price: 45 },
    { name: 'IT Consulting', price: 125 }
  ];
  
  let subtotal = 0;
  
  for (let i = 0; i < itemCount; i++) {
    const randomItem = possibleItems[Math.floor(Math.random() * possibleItems.length)];
    const quantity = Math.floor(Math.random() * 5) + 1;
    const unitPrice = randomItem.price;
    const total = quantity * unitPrice;
    
    items.push({
      description: randomItem.name,
      quantity,
      unitPrice,
      total
    });
    
    subtotal += total;
  }
  
  const taxRate = Math.round(Math.random() * 10) + 5; // Random tax rate between 5-15%
  const taxAmount = subtotal * (taxRate / 100);
  const totalAmount = subtotal + taxAmount;
  
  return {
    invoiceNumber,
    supplierName: suppliers[Math.floor(Math.random() * suppliers.length)],
    invoiceDate: formatDate(invoiceDate),
    dueDate: formatDate(dueDate),
    invoiceType: invoiceTypes[Math.floor(Math.random() * invoiceTypes.length)],
    items,
    subtotal,
    taxRate,
    taxAmount,
    totalAmount,
    notes: `Generated from file: ${filename}`
  };
}

// Helper to format dates consistently
function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Helper to simulate variable processing delays
function simulateProcessingDelay(min: number, max: number): Promise<void> {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise(resolve => setTimeout(resolve, delay));
}
