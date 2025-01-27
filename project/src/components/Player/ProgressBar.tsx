import React from 'react';
import { formatTime } from '../../utils/formatTime';

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  currentTime,
  duration,
  onSeek
}) => {
  return (
    <div className="w-full flex items-center gap-2">
      <span className="text-xs text-gray-400">{formatTime(currentTime)}</span>
      <input
        type="range"
        min="0"
        max={duration || 0}
        value={currentTime}
        onChange={onSeek}
        className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
      />
      <span className="text-xs text-gray-400">{formatTime(duration)}</span>
    </div>
  );
};

export default ProgressBar;