import React, { useRef } from 'react';
import { Settings, FolderOpen, Plus, Trash2 } from 'lucide-react';
import { clearLibrary } from '../../utils/storage';

interface LibrarySettingsProps {
  onFolderSelect: (files: FileList) => void;
  onShowUpload: () => void;
  onLibraryUpdate: () => void;
}

const LibrarySettings: React.FC<LibrarySettingsProps> = ({ 
  onFolderSelect, 
  onShowUpload,
  onLibraryUpdate 
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFolderSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFolderSelect(e.target.files);
      setIsOpen(false);
    }
  };

  const handleClearLibrary = async () => {
    if (window.confirm('Are you sure you want to clear your entire library? This cannot be undone.')) {
      await clearLibrary();
      onLibraryUpdate();
      setIsOpen(false);
    }
  };

  const handleUploadClick = () => {
    onShowUpload();
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFolderSelect}
        webkitdirectory=""
        directory=""
        style={{ display: 'none' }}
      />
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-gray-800 transition-colors"
        title="Settings"
      >
        <Settings className="w-5 h-5" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 z-50">
            <div className="py-1">
              <button
                onClick={handleUploadClick}
                className="w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Upload More Songs
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-2"
              >
                <FolderOpen className="w-4 h-4" />
                Select Music Folder
              </button>
              <button
                onClick={handleClearLibrary}
                className="w-full px-4 py-2 text-sm text-red-400 hover:bg-gray-700 flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Clear Library
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LibrarySettings;