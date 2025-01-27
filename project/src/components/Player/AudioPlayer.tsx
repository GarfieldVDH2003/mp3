import React, { useState, useEffect } from 'react';
import { StoredTrack, getTrackData } from '../../utils/storage';
import { audioManager } from '../../utils/audio';
import PlayerControls from './PlayerControls';
import VolumeControl from './VolumeControl';
import ProgressBar from './ProgressBar';

interface AudioPlayerProps {
  currentTrack: StoredTrack | null;
  onPrevTrack: () => void;
  onNextTrack: () => void;
  isShuffleMode: boolean;
  onToggleShuffle: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  currentTrack,
  onPrevTrack,
  onNextTrack,
  isShuffleMode,
  onToggleShuffle
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleTimeUpdate = () => {
      setCurrentTime(audioManager.getCurrentTime());
      setDuration(audioManager.getDuration());
    };

    const handleEnded = () => {
      if (!isRepeat) {
        setIsPlaying(false);
        setCurrentTime(0);
        onNextTrack();
      }
    };

    audioManager.addEventListener('timeupdate', handleTimeUpdate);
    audioManager.addEventListener('ended', handleEnded);

    return () => {
      audioManager.removeEventListener('timeupdate', handleTimeUpdate);
      audioManager.removeEventListener('ended', handleEnded);
    };
  }, [isRepeat, onNextTrack]);

  useEffect(() => {
    const loadAndPlayTrack = async () => {
      if (!currentTrack?.id) {
        setIsPlaying(false);
        return;
      }

      try {
        setError(null);
        setIsLoading(true);
        setIsPlaying(false);
        
        const fullTrack = await getTrackData(currentTrack.id);
        if (!fullTrack || !fullTrack.fileData) {
          throw new Error('Track data not found');
        }
        
        await audioManager.loadTrack(fullTrack);
        await audioManager.play();
        setIsPlaying(true);
      } catch (error) {
        console.error('Error playing track:', error);
        setError('Failed to play track. Please try again.');
        setIsPlaying(false);
      } finally {
        setIsLoading(false);
      }
    };

    loadAndPlayTrack();

    return () => {
      audioManager.pause();
      audioManager.cleanup();
    };
  }, [currentTrack]);

  useEffect(() => {
    audioManager.setLoop(isRepeat);
  }, [isRepeat]);

  const togglePlay = async () => {
    if (!currentTrack?.id) return;

    try {
      setError(null);
      if (isPlaying) {
        audioManager.pause();
        setIsPlaying(false);
      } else {
        await audioManager.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error toggling playback:', error);
      setError('Failed to play track. Please try again.');
      setIsPlaying(false);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    audioManager.setVolume(newVolume);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    audioManager.setCurrentTime(time);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#181818] text-white p-4">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between">
        <div className="w-1/4">
          {currentTrack && (
            <div className="flex items-center">
              <div className="ml-4">
                <div className="text-sm font-medium">{currentTrack.title}</div>
                {isLoading && (
                  <div className="text-xs text-gray-400">Loading...</div>
                )}
                {error && (
                  <div className="text-xs text-red-400">{error}</div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center w-1/2">
          <PlayerControls
            isPlaying={isPlaying}
            isRepeat={isRepeat}
            isShuffle={isShuffleMode}
            onPlayPause={togglePlay}
            onPrevTrack={onPrevTrack}
            onNextTrack={onNextTrack}
            onToggleRepeat={() => setIsRepeat(!isRepeat)}
            onToggleShuffle={onToggleShuffle}
            disabled={!currentTrack || isLoading}
          />
          <ProgressBar
            currentTime={currentTime}
            duration={duration}
            onSeek={handleSeek}
          />
        </div>

        <VolumeControl
          volume={volume}
          onVolumeChange={handleVolumeChange}
        />
      </div>
    </div>
  );
};

export default AudioPlayer;