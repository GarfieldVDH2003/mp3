import React from 'react';
import HomePage from '../Home/HomePage';
import LibraryView from '../Library/LibraryView';
import { StoredTrack } from '../../types/track';

interface MainContentProps {
  currentView: 'home' | 'library';
  tracks: StoredTrack[];
  onTrackSelect: (track: StoredTrack) => void;
  onFileSelect: (files: FileList, onProgress: (progress: number) => void) => void;
  onLibraryUpdate: () => void;
}

const MainContent: React.FC<MainContentProps> = ({
  currentView,
  tracks,
  onTrackSelect,
  onFileSelect,
  onLibraryUpdate
}) => {
  return (
    <main className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-900 to-black pb-32">
      {currentView === 'home' ? (
        <HomePage onTrackSelect={onTrackSelect} />
      ) : (
        <LibraryView
          tracks={tracks}
          onTrackSelect={onTrackSelect}
          onFileSelect={onFileSelect}
          onLibraryUpdate={onLibraryUpdate}
        />
      )}
    </main>
  );
};

export default MainContent;