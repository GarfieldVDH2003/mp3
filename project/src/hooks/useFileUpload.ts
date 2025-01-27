import { useCallback, useState } from 'react';
import { processFiles } from '../utils/fileProcessor';

interface UseFileUploadOptions {
  onUploadComplete?: () => void;
}

export const useFileUpload = ({ onUploadComplete }: UseFileUploadOptions = {}) => {
  const [progress, setProgress] = useState({ processed: 0, total: 0, failed: 0 });

  const handleFileSelect = useCallback(async (files: FileList) => {
    try {
      await processFiles(Array.from(files), (progress) => {
        setProgress(progress);
      });
      onUploadComplete?.();
    } catch (error) {
      console.error('Error processing files:', error);
    } finally {
      setProgress({ processed: 0, total: 0, failed: 0 });
    }
  }, [onUploadComplete]);

  return { handleFileSelect, progress };
};