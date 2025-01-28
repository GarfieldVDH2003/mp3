import React, { useState } from 'react';
import SearchBar from '../Search/SearchBar';
import TrackList from '../MusicLibrary/TrackList';
import UploadModal from '../Upload/UploadModal';
import LibrarySettings from './LibrarySettings';
import { StoredTrack } from '../../types/track';

interface LibraryViewProps {
  tracks: StoredTrack[];
  onTrackSelect: (track: StoredTrack) => void;
  onFileSelect: (files: FileList, onProgress: (progress: number) => void) => Promise<void>;
  onLibraryUpdate: () => void;
  onRemoveTrack?: (trackId: string) => void;
}

const LibraryView: React.FC<LibraryViewProps> = ({
                                                   tracks,
                                                   onTrackSelect,
                                                   onFileSelect,
                                                   onLibraryUpdate,
                                                   onRemoveTrack,
                                                 }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const filteredTracks = tracks.filter((track) =>
      track.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUploadComplete = () => {
    setShowUpload(false); // Close the upload modal
    onLibraryUpdate(); // Refresh the library
  };

  const handleFolderSelect = async (files: FileList) => {
    setIsScanning(true);
    await onFileSelect(files, (progress) => {
      if (progress === 1) setIsScanning(false); // Stop scanning when upload is complete
    });
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
            <UploadModal
                onFileSelect={onFileSelect}
                onClose={() => setShowUpload(false)}
                onUploadComplete={handleUploadComplete}
            />
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