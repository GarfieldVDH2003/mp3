import React from 'react';
import { Volume2, Volume1, VolumeX } from 'lucide-react';

interface VolumeControlProps {
  volume: number;
  onVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const VolumeControl: React.FC<VolumeControlProps> = ({ volume, onVolumeChange }) => {
  return (
    <div className="w-1/4 flex justify-end items-center gap-2">
      {volume === 0 ? (
        <VolumeX className="w-5 h-5" />
      ) : volume < 0.5 ? (
        <Volume1 className="w-5 h-5" />
      ) : (
        <Volume2 className="w-5 h-5" />
      )}
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={onVolumeChange}
        className="w-24 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
      />
    </div>
  );
};

export default VolumeControl;