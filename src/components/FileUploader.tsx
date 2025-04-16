
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileWithPreview } from '@/types/invoice';
import { Button } from '@/components/ui/button';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Upload,
  FileText,
  FileSpreadsheet,
  AlertCircle,
  Trash2,
  Check,
  X
} from 'lucide-react';
import { formatBytes } from '@/utils/formatters';

interface FileUploaderProps {
  files: FileWithPreview[];
  isProcessing: boolean;
  onFilesAccepted: (files: File[]) => void;
  onRemoveFile: (index: number) => void;
  onClearFiles: () => void;
}

export function FileUploader({ 
  files, 
  isProcessing, 
  onFilesAccepted, 
  onRemoveFile,
  onClearFiles
}: FileUploaderProps) {
  // Max file size: 10MB
  const MAX_FILE_SIZE = 10 * 1024 * 1024;
  const ACCEPTED_FILE_TYPES = {
    'application/pdf': ['.pdf'],
    'application/vnd.ms-excel': ['.xls'],
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  };

  const onDrop = useCallback((acceptedFiles: File[], fileRejections) => {
    if (fileRejections.length > 0) {
      // Handle rejected files if needed
      console.log('Rejected files:', fileRejections);
    }
    
    onFilesAccepted(acceptedFiles);
  }, [onFilesAccepted]);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
  } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILE_TYPES,
    maxSize: MAX_FILE_SIZE,
    disabled: isProcessing,
  });

  const getFileIcon = (file: File) => {
    if (file.type === 'application/pdf') {
      return <FileText className="text-red-500" />;
    } else if (
      file.type === 'application/vnd.ms-excel' ||
      file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      return <FileSpreadsheet className="text-green-500" />;
    } else {
      return <AlertCircle className="text-amber-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-border'}
          ${isDragReject ? 'border-destructive bg-destructive/5' : ''}
          ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-2">
          <Upload 
            className={`h-12 w-12 ${isDragActive ? 'text-primary' : 'text-muted-foreground'}`}
          />
          <div className="text-base font-medium">
            {isDragActive
              ? 'Drop the files here...'
              : 'Drag & drop invoice files, or click to select'}
          </div>
          <p className="text-sm text-muted-foreground">
            Support for PDF, Excel (.xls, .xlsx) files. Max size: 10MB per file.
          </p>
          {!isDragActive && (
            <Button
              type="button"
              variant="outline"
              className="mt-2"
              disabled={isProcessing}
            >
              Select Files
            </Button>
          )}
        </div>
      </div>

      {files.length > 0 && (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>File Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Size</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {files.map((file, index) => (
                <TableRow key={`${file.name}-${index}`}>
                  <TableCell className="flex items-center space-x-2">
                    {getFileIcon(file)}
                    <span className="truncate max-w-[300px]">{file.name}</span>
                  </TableCell>
                  <TableCell>
                    {file.type === 'application/pdf'
                      ? 'PDF'
                      : file.type.includes('spreadsheet') || file.type.includes('excel') 
                        ? 'Excel'
                        : file.type}
                  </TableCell>
                  <TableCell className="text-right">{formatBytes(file.size)}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemoveFile(index)}
                      disabled={isProcessing}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
