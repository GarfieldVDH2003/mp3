import React, { useState } from 'react';
import SearchBar from '../Search/SearchBar';
import TrackList from '../MusicLibrary/TrackList';
import FileUpload from '../Upload/FileUpload';
import LibrarySettings from './LibrarySettings';
import { StoredTrack } from '../../types/track';

interface LibraryViewProps {
  tracks: StoredTrack[];
  onTrackSelect: (track: StoredTrack) => void;
  onFileSelect: (files: FileList, onProgress: (progress: number) => void) => void;
  onLibraryUpdate: () => void;
  onRemoveTrack?: (trackId: string) => void;
}

const LibraryView: React.FC<LibraryViewProps> = ({
  tracks,
  onTrackSelect,
  onFileSelect,
  onLibraryUpdate,
  onRemoveTrack
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const filteredTracks = tracks.filter(track =>
    track.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUploadComplete = () => {
    setShowUpload(false);
    onLibraryUpdate();
  };

  const handleFolderSelect = (files: FileList) => {
    setIsScanning(true);
    onFileSelect(files, () => setIsScanning(false));
  };

  return (
    <div className="p-8 pb-32">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold">Your Library</h1>
          <LibrarySettings
            onFolderSelect={handleFolderSelect}
            onShowUpload={() => setShowUpload(true)}
            onLibraryUpdate={onLibraryUpdate}
          />
        </div>
        <SearchBar searchTerm={searchTerm} onSearch={setSearchTerm} />
      </div>
      
      {isScanning && (
        <div className="text-center py-4 text-gray-400">
          Scanning folder for music files...
        </div>
      )}
      
      {showUpload && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-8 rounded-lg max-w-xl w-full">
            <FileUpload 
              onFileSelect={onFileSelect}
              onComplete={handleUploadComplete}
            />
            <button
              onClick={() => setShowUpload(false)}
              className="mt-4 text-gray-400 hover:text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      
      <TrackList
        tracks={filteredTracks}
        onTrackSelect={onTrackSelect}
        onRemoveTrack={onRemoveTrack}
      />
    </div>
  );
};

export default LibraryView;