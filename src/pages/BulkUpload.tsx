
import React, { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '@/components/Footer';
import { FileUploader } from '@/components/FileUploader';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { UploadSummary } from '@/components/UploadSummary';
import { InvoicePreview } from '@/components/InvoicePreview';
import { ArrowLeft } from 'lucide-react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { FileWithPreview, ProcessedInvoice } from '@/types/invoice';
import { useToast } from '@/hooks/use-toast';
import { processInvoiceFiles } from '@/utils/invoiceProcessing';

const BulkUpload = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processedInvoices, setProcessedInvoices] = useState<ProcessedInvoice[]>([]);
  const [selectedInvoiceIndex, setSelectedInvoiceIndex] = useState<number | null>(null);
  const [currentTab, setCurrentTab] = useState('upload');
  const { toast } = useToast();
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleFilesAccepted = useCallback((acceptedFiles: File[]) => {
    const filesWithPreview = acceptedFiles.map(file => 
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );
    
    setFiles(prevFiles => [...prevFiles, ...filesWithPreview]);
    toast({
      title: `${acceptedFiles.length} file(s) added`,
      description: 'Files have been added to the queue.'
    });
  }, [toast]);
  
  const handleRemoveFile = (index: number) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };
  
  const handleClearFiles = () => {
    files.forEach(file => URL.revokeObjectURL(file.preview));
    setFiles([]);
  };

  const handleProcessFiles = async () => {
    if (files.length === 0) {
      toast({
        title: 'No files to process',
        description: 'Please upload at least one file.',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);
    setProcessingProgress(0);
    setProcessedInvoices([]);
    
    // Create a new AbortController for this operation
    abortControllerRef.current = new AbortController();
    
    try {
      const results = await processInvoiceFiles(
        files, 
        (progress) => setProcessingProgress(progress),
        abortControllerRef.current.signal
      );
      
      setProcessedInvoices(results);
      setCurrentTab('review');
      
      const successCount = results.filter(r => r.success).length;
      toast({
        title: 'Processing complete',
        description: `Successfully processed ${successCount} of ${files.length} files.`
      });
    } catch (error) {
      console.error('Error processing files:', error);
      toast({
        title: 'Processing failed',
        description: error instanceof Error ? error.message : 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleCancelProcessing = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsProcessing(false);
      toast({
        title: 'Processing cancelled',
        description: 'File processing has been cancelled.'
      });
    }
  };

  const handlePreviewInvoice = (index: number) => {
    setSelectedInvoiceIndex(index);
    setCurrentTab('preview');
  };
  
  const handleSaveToDatabase = async () => {
    // This would actually send data to your API
    // Just showing a toast for now
    toast({
      title: 'Invoices saved',
      description: `${processedInvoices.filter(i => i.success).length} invoices saved to database.`
    });
    
    // Reset state
    handleClearFiles();
    setProcessedInvoices([]);
    setCurrentTab('upload');
  };

  return (
    <div className="min-h-screen flex flex-col bg-secondary/30">
      {/* Navbar has been removed */}
      <main className="flex-grow pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-8">
            <Button 
              variant="ghost"
              className="mr-4 p-2"
              onClick={() => navigate('/dashboard')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-medium tracking-tight">Bulk Invoice Upload</h1>
              <p className="text-muted-foreground mt-1">
                Upload multiple invoice files to automatically extract and process data.
              </p>
            </div>
          </div>

          <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
            <TabsList className="grid w-full md:w-auto grid-cols-3 mb-4">
              <TabsTrigger value="upload">Upload</TabsTrigger>
              <TabsTrigger value="review">Review</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload" className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <FileUploader 
                  onFilesAccepted={handleFilesAccepted} 
                  onRemoveFile={handleRemoveFile}
                  onClearFiles={handleClearFiles}
                  files={files}
                  isProcessing={isProcessing}
                />
                
                {isProcessing && (
                  <div className="mt-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Processing files...</span>
                      <span className="text-sm">{Math.round(processingProgress)}%</span>
                    </div>
                    <Progress value={processingProgress} />
                    <div className="flex justify-end">
                      <Button variant="destructive" onClick={handleCancelProcessing}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
                
                <div className="mt-6 flex justify-end space-x-3">
                  <Button 
                    variant="outline" 
                    onClick={handleClearFiles}
                    disabled={files.length === 0 || isProcessing}
                  >
                    Clear All
                  </Button>
                  <Button 
                    onClick={handleProcessFiles}
                    disabled={files.length === 0 || isProcessing}
                  >
                    Process Files
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="review">
              {processedInvoices.length > 0 ? (
                <div className="space-y-6">
                  <UploadSummary 
                    processedInvoices={processedInvoices} 
                    onPreviewInvoice={handlePreviewInvoice}
                  />
                  
                  <div className="flex justify-end space-x-3">
                    <Button variant="outline" onClick={() => setCurrentTab('upload')}>
                      Back to Upload
                    </Button>
                    <Button 
                      onClick={handleSaveToDatabase}
                      disabled={!processedInvoices.some(i => i.success)}
                    >
                      Save to Database
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl p-8 shadow-sm text-center">
                  <p className="text-muted-foreground">
                    No processed invoices to review. Please upload and process files first.
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-4" 
                    onClick={() => setCurrentTab('upload')}
                  >
                    Back to Upload
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="preview">
              {selectedInvoiceIndex !== null && processedInvoices[selectedInvoiceIndex] ? (
                <InvoicePreview 
                  invoice={processedInvoices[selectedInvoiceIndex]}
                  onBack={() => setCurrentTab('review')}
                />
              ) : (
                <div className="bg-white rounded-xl p-8 shadow-sm text-center">
                  <p className="text-muted-foreground">
                    No invoice selected for preview.
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-4" 
                    onClick={() => setCurrentTab('review')}
                  >
                    Back to Review
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BulkUpload;
