import React, { useCallback, useRef, useState } from 'react';
import { Upload, Folder, Loader2 } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (files: FileList, onProgress?: (progress: number) => void) => void;
  onComplete?: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, onComplete }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFiles = async (files: FileList) => {
    if (files.length === 0) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      await onFileSelect(files, (progress) => {
        setUploadProgress(progress);
      });
      onComplete?.();
    } catch (error) {
      console.error('Error uploading files:', error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
        className="hidden"
        multiple
        accept="audio/*"
      />
      
      <div
        className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-gray-400 transition-colors"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {isUploading ? (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-green-500" />
            <p className="text-gray-400">
              Uploading... {Math.round(uploadProgress * 100)}%
            </p>
          </div>
        ) : (
          <div
            className="flex flex-col items-center gap-4 cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-8 h-8 text-gray-400" />
            <div>
              <p className="text-lg font-medium">Drop your music files here</p>
              <p className="text-sm text-gray-400 mt-1">
                or click to select files
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;