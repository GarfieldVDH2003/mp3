import React, { useState } from 'react';
import Sidebar from './components/Layout/Sidebar';
import AudioPlayer from './components/Player/AudioPlayer';
import MainContent from './components/Layout/MainContent';
import { useTrackManager } from './hooks/useTrackManager';
import { useFileUpload } from './hooks/useFileUpload';

function App() {
  const [currentView, setCurrentView] = useState<'home' | 'library'>('home');
  const { 
    tracks,
    currentTrack,
    isShuffleMode,
    handleTrackSelect,
    handlePrevTrack,
    handleNextTrack,
    toggleShuffle,
    refreshTracks
  } = useTrackManager();
  
  const { handleFileSelect } = useFileUpload({
    onUploadComplete: refreshTracks
  });

  return (
    <div className="flex h-screen bg-black text-white">
      <Sidebar onNavigate={setCurrentView} />
      
      <MainContent
        currentView={currentView}
        tracks={tracks}
        onTrackSelect={handleTrackSelect}
        onFileSelect={handleFileSelect}
        onLibraryUpdate={refreshTracks}
      />

      <AudioPlayer
        currentTrack={currentTrack}
        onPrevTrack={handlePrevTrack}
        onNextTrack={handleNextTrack}
        isShuffleMode={isShuffleMode}
        onToggleShuffle={toggleShuffle}
      />
    </div>
  );
}

export default App;