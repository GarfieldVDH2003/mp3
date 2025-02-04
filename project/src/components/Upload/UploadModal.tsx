import React from 'react';
import FileUpload from './FileUpload';

interface UploadModalProps {
  onFileSelect: (files: FileList) => Promise<void>;
  onClose: () => void;
  onUploadComplete: () => void;
}

const UploadModal: React.FC<UploadModalProps> = ({ onFileSelect, onClose, onUploadComplete }) => {
  return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-gray-900 p-6 rounded-lg max-w-xl w-full">
          <FileUpload onFileSelect={onFileSelect} onComplete={onUploadComplete} />
          <button
              onClick={onClose}
              className="mt-4 text-gray-400 hover:text-white"
          >
            Cancel
          </button>
        </div>
      </div>
  );
};

export default UploadModal;