import { get, set, del } from 'idb-keyval';

export interface StoredTrack {
  id: string;
  title: string;
  duration: string;
  lastPlayed: number;
  fileData: ArrayBuffer;
}

const TRACKS_KEY = 'tracks';
const TRACK_PREFIX = 'track:';

// Optimized batch save with better memory management
export const saveBatch = async (tracks: StoredTrack[]): Promise<void> => {
  try {
    const trackList = await get<Array<Omit<StoredTrack, 'fileData'>>>(TRACKS_KEY) || [];
    const existingTitles = new Set(trackList.map(t => t.title));
    
    const newTracks: Array<Omit<StoredTrack, 'fileData'>> = [];
    
    // Process tracks in smaller chunks for better memory usage
    const chunkSize = 5;
    for (let i = 0; i < tracks.length; i += chunkSize) {
      const chunk = tracks.slice(i, i + chunkSize);
      
      await Promise.all(chunk.map(async track => {
        if (!existingTitles.has(track.title)) {
          const trackKey = `${TRACK_PREFIX}${track.id}`;
          await set(trackKey, track);
          newTracks.push({
            id: track.id,
            title: track.title,
            duration: track.duration,
            lastPlayed: track.lastPlayed
          });
        }
      }));
    }
    
    if (newTracks.length > 0) {
      await set(TRACKS_KEY, [...trackList, ...newTracks]);
    }
  } catch (error) {
    console.error('Error saving batch:', error);
    throw error;
  }
};

// Cache track list in memory for faster access
let cachedTracks: Array<Omit<StoredTrack, 'fileData'>> | null = null;

export const getAllTracks = async (): Promise<Array<Omit<StoredTrack, 'fileData'>>> => {
  if (cachedTracks) return cachedTracks;
  cachedTracks = await get<Array<Omit<StoredTrack, 'fileData'>>>(TRACKS_KEY) || [];
  return cachedTracks;
};

export const getTrackData = async (trackId: string): Promise<StoredTrack | null> => {
  try {
    return await get(`${TRACK_PREFIX}${trackId}`);
  } catch (error) {
    console.error('Error loading track data:', error);
    return null;
  }
};

export const removeTrack = async (trackId: string): Promise<void> => {
  try {
    const tracks = await getAllTracks();
    const updatedTracks = tracks.filter(track => track.id !== trackId);
    await Promise.all([
      set(TRACKS_KEY, updatedTracks),
      del(`${TRACK_PREFIX}${trackId}`)
    ]);
    cachedTracks = updatedTracks;
  } catch (error) {
    console.error('Error removing track:', error);
  }
};

export const updateLastPlayed = async (trackId: string): Promise<void> => {
  try {
    const tracks = await getAllTracks();
    const updatedTracks = tracks.map(track => 
      track.id === trackId 
        ? { ...track, lastPlayed: Date.now() }
        : track
    );
    await set(TRACKS_KEY, updatedTracks);
    cachedTracks = updatedTracks;
  } catch (error) {
    console.error('Error updating last played:', error);
  }
};

export const getRecentTracks = async (limit: number = 5): Promise<Array<Omit<StoredTrack, 'fileData'>>> => {
  const tracks = await getAllTracks();
  return tracks
    .sort((a, b) => (b.lastPlayed || 0) - (a.lastPlayed || 0))
    .slice(0, limit);
};

export const getRandomTracks = async (limit: number = 5): Promise<Array<Omit<StoredTrack, 'fileData'>>> => {
  const tracks = await getAllTracks();
  return [...tracks]
    .sort(() => Math.random() - 0.5)
    .slice(0, limit);
};

export const clearLibrary = async (): Promise<void> => {
  try {
    const tracks = await getAllTracks();
    await Promise.all([
      ...tracks.map(track => del(`${TRACK_PREFIX}${track.id}`)),
      set(TRACKS_KEY, [])
    ]);
    cachedTracks = [];
  } catch (error) {
    console.error('Error clearing library:', error);
  }
};