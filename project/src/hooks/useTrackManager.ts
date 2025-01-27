import { useState, useEffect, useCallback, useRef } from 'react';
import { StoredTrack, getAllTracks, updateLastPlayed, removeTrack } from '../utils/storage';

export const useTrackManager = () => {
  const [tracks, setTracks] = useState<Array<Omit<StoredTrack, 'fileData'>>>([]);
  const [currentTrack, setCurrentTrack] = useState<StoredTrack | null>(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(-1);
  const [shuffledTracks, setShuffledTracks] = useState<Array<Omit<StoredTrack, 'fileData'>>>([]);
  const [isShuffleMode, setIsShuffleMode] = useState(false);
  const loadingRef = useRef(false);

  const loadStoredTracks = async () => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    
    try {
      const storedTracks = await getAllTracks();
      setTracks(storedTracks);
      // Reset shuffled tracks when library changes
      if (isShuffleMode) {
        setShuffledTracks(shuffleArray([...storedTracks]));
      }
    } catch (error) {
      console.error('Error loading tracks:', error);
    } finally {
      loadingRef.current = false;
    }
  };

  useEffect(() => {
    loadStoredTracks();
  }, []);

  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const toggleShuffle = useCallback(() => {
    setIsShuffleMode(prev => {
      const newShuffleMode = !prev;
      if (newShuffleMode) {
        // When enabling shuffle, create new shuffled playlist starting from current track
        const currentTrackId = currentTrack?.id;
        let remainingTracks = [...tracks];
        
        if (currentTrackId) {
          // Remove current track from the shuffle pool
          remainingTracks = tracks.filter(t => t.id !== currentTrackId);
        }
        
        // Shuffle remaining tracks
        const shuffled = shuffleArray(remainingTracks);
        
        // If there's a current track, put it at the beginning
        const newShuffledTracks = currentTrackId 
          ? [tracks.find(t => t.id === currentTrackId)!, ...shuffled]
          : shuffled;
        
        setShuffledTracks(newShuffledTracks);
        // Update current track index in shuffled playlist
        setCurrentTrackIndex(currentTrackId ? 0 : -1);
      }
      return newShuffleMode;
    });
  }, [currentTrack, tracks]);

  const handleTrackSelect = useCallback(async (track: Omit<StoredTrack, 'fileData'>) => {
    try {
      const index = (isShuffleMode ? shuffledTracks : tracks).findIndex(t => t.id === track.id);
      setCurrentTrackIndex(index);
      
      await updateLastPlayed(track.id);
      
      const fullTrack = await import('../utils/storage').then(m => m.getTrackData(track.id));
      if (fullTrack) {
        setCurrentTrack(fullTrack);
      }
    } catch (error) {
      console.error('Error selecting track:', error);
    }
  }, [tracks, shuffledTracks, isShuffleMode]);

  const handleRemoveTrack = useCallback(async (trackId: string) => {
    try {
      await removeTrack(trackId);
      await loadStoredTracks();
      
      if (currentTrack?.id === trackId) {
        setCurrentTrack(null);
        setCurrentTrackIndex(-1);
      }
    } catch (error) {
      console.error('Error removing track:', error);
    }
  }, [currentTrack]);

  const handlePrevTrack = useCallback(() => {
    const playlist = isShuffleMode ? shuffledTracks : tracks;
    if (currentTrackIndex > 0) {
      const prevTrack = playlist[currentTrackIndex - 1];
      handleTrackSelect(prevTrack);
    }
  }, [currentTrackIndex, tracks, shuffledTracks, isShuffleMode, handleTrackSelect]);

  const handleNextTrack = useCallback(() => {
    const playlist = isShuffleMode ? shuffledTracks : tracks;
    if (currentTrackIndex < playlist.length - 1) {
      const nextTrack = playlist[currentTrackIndex + 1];
      handleTrackSelect(nextTrack);
    }
  }, [currentTrackIndex, tracks, shuffledTracks, isShuffleMode, handleTrackSelect]);

  return {
    tracks,
    currentTrack,
    isShuffleMode,
    handleTrackSelect,
    handleRemoveTrack,
    handlePrevTrack,
    handleNextTrack,
    toggleShuffle,
    refreshTracks: loadStoredTracks
  };
};