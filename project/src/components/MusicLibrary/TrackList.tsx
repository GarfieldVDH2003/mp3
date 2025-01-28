import React from 'react';
import { Play, Clock3, MoreVertical } from 'lucide-react';
import TrackMenu from './TrackMenu';

interface Track {
  id: string;
  title: string;
  duration: string;
}

interface TrackListProps {
  tracks: Track[];
  onTrackSelect: (track: Track) => void;
  onRemoveTrack: (trackId: string) => void;
}

const TrackList: React.FC<TrackListProps> = ({ tracks, onTrackSelect, onRemoveTrack }) => {
  const [menuTrackId, setMenuTrackId] = React.useState<string | null>(null);
  const [menuPosition, setMenuPosition] = React.useState({ x: 0, y: 0 });

  const handleMoreClick = (e: React.MouseEvent, trackId: string) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setMenuPosition({ x: rect.left, y: rect.bottom });
    setMenuTrackId(trackId);
  };

  const handleCloseMenu = () => {
    setMenuTrackId(null);
  };

  return (
    <div className="w-full">
      <table className="w-full text-left text-gray-300">
        <thead>
          <tr className="border-b border-gray-700 text-sm">
            <th className="px-4 py-2">#</th>
            <th className="px-4 py-2">Title</th>
            <th className="w-12"></th>
          </tr>
        </thead>
        <tbody>
          {tracks.map((track, index) => (
            <tr
              key={track.id}
              className="hover:bg-gray-800/50 group cursor-pointer"
              onClick={() => onTrackSelect(track)}
            >
              <td className="px-4 py-2 w-12">
                <div className="relative">
                  <span className="group-hover:hidden">{index + 1}</span>
                  <Play className="w-4 h-4 hidden group-hover:block" />
                </div>
              </td>
              <td className="px-4 py-2">{track.title}</td>
              <td className="px-4 py-2 text-right">
                <button
                  onClick={(e) => handleMoreClick(e, track.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-700 rounded-full transition-all"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {menuTrackId && (
        <TrackMenu
          position={menuPosition}
          onClose={handleCloseMenu}
          onRemove={() => {
            onRemoveTrack(menuTrackId);
            handleCloseMenu();
          }}
        />
      )}
    </div>
  );
};

export default TrackList;