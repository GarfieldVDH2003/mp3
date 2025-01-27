import React, { useEffect, useState } from 'react';
import { Clock3, Play } from 'lucide-react';
import { StoredTrack, getRecentTracks, getRandomTracks } from '../../utils/storage';

interface HomePageProps {
  onTrackSelect: (track: StoredTrack) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onTrackSelect }) => {
  const [recentTracks, setRecentTracks] = useState<StoredTrack[]>([]);
  const [recommendedTracks, setRecommendedTracks] = useState<StoredTrack[]>([]);

  useEffect(() => {
    const loadTracks = async () => {
      const recent = await getRecentTracks(5);
      const recommended = await getRandomTracks(5);
      setRecentTracks(recent);
      setRecommendedTracks(recommended);
    };
    loadTracks();
  }, []);

  const TrackList = ({ tracks, title }: { tracks: StoredTrack[], title: string }) => (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tracks.map((track) => (
          <div
            key={track.id}
            className="bg-gray-800/50 hover:bg-gray-800 p-4 rounded-lg cursor-pointer group"
            onClick={() => onTrackSelect(track)}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{track.title}</h3>
              </div>
              <button className="opacity-0 group-hover:opacity-100 bg-green-500 rounded-full p-3 transition-opacity">
                <Play className="w-4 h-4 text-black" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Home</h1>
      {recentTracks.length > 0 && (
        <TrackList tracks={recentTracks} title="Recently Played" />
      )}
      {recommendedTracks.length > 0 && (
        <TrackList tracks={recommendedTracks} title="Recommended for You" />
      )}
    </div>
  );
};

export default HomePage;