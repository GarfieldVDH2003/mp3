import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Repeat, Shuffle } from 'lucide-react';

interface PlayerControlsProps {
  isPlaying: boolean;
  isRepeat: boolean;
  isShuffle: boolean;
  onPlayPause: () => void;
  onPrevTrack: () => void;
  onNextTrack: () => void;
  onToggleRepeat: () => void;
  onToggleShuffle: () => void;
  disabled: boolean;
}

const PlayerControls: React.FC<PlayerControlsProps> = ({
  isPlaying,
  isRepeat,
  isShuffle,
  onPlayPause,
  onPrevTrack,
  onNextTrack,
  onToggleRepeat,
  onToggleShuffle,
  disabled
}) => {
  return (
    <div className="flex items-center gap-4 mb-2">
      <button
        onClick={onToggleShuffle}
        className={`text-gray-400 hover:text-white ${isShuffle ? 'text-green-500' : ''}`}
      >
        <Shuffle className="w-5 h-5" />
      </button>
      <button 
        className="text-gray-400 hover:text-white"
        onClick={onPrevTrack}
      >
        <SkipBack className="w-5 h-5" />
      </button>
      <button
        onClick={onPlayPause}
        className="bg-white rounded-full p-2 hover:scale-105 transition"
        disabled={disabled}
      >
        {isPlaying ? (
          <Pause className="w-6 h-6 text-black" />
        ) : (
          <Play className="w-6 h-6 text-black" />
        )}
      </button>
      <button 
        className="text-gray-400 hover:text-white"
        onClick={onNextTrack}
      >
        <SkipForward className="w-5 h-5" />
      </button>
      <button
        onClick={onToggleRepeat}
        className={`text-gray-400 hover:text-white ${isRepeat ? 'text-green-500' : ''}`}
      >
        <Repeat className="w-5 h-5" />
      </button>
    </div>
  );
};

export default PlayerControls;