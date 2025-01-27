import React, { useEffect, useRef } from 'react';
import { Trash2 } from 'lucide-react';

interface TrackMenuProps {
  position: { x: number; y: number };
  onClose: () => void;
  onRemove: () => void;
}

const TrackMenu: React.FC<TrackMenuProps> = ({ position, onClose, onRemove }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className="fixed bg-gray-800 rounded-lg shadow-lg py-1 z-50"
      style={{
        top: position.y,
        left: position.x,
      }}
    >
      <button
        onClick={onRemove}
        className="w-full px-4 py-2 text-left text-red-400 hover:bg-gray-700 flex items-center gap-2"
      >
        <Trash2 className="w-4 h-4" />
        Remove from Library
      </button>
    </div>
  );
};

export default TrackMenu;