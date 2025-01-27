import { StoredTrack, saveBatch } from './storage';
import { formatTime } from './formatTime';

interface ProcessingResult {
  processed: number;
  total: number;
  failed: number;
}

export const processFiles = async (
  files: File[],
  onProgress?: (result: ProcessingResult) => void
): Promise<void> => {
  const audioFiles = files.filter(file => file.type.startsWith('audio/'));
  const total = audioFiles.length;
  let processed = 0;
  let failed = 0;

  // Process in smaller chunks for better UI responsiveness
  const chunkSize = 10;
  const chunks = [];
  
  for (let i = 0; i < audioFiles.length; i += chunkSize) {
    chunks.push(audioFiles.slice(i, i + chunkSize));
  }

  for (const chunk of chunks) {
    const tracks = await Promise.all(
      chunk.map(async (file) => {
        try {
          // Fast track processing - skip full audio loading
          const track: StoredTrack = {
            id: crypto.randomUUID(),
            title: file.name.replace(/\.[^/.]+$/, ''),
            duration: '0:00', // Will be updated when played
            lastPlayed: Date.now(),
            fileData: await file.arrayBuffer()
          };
          processed++;
          onProgress?.({ processed, total, failed });
          return track;
        } catch (error) {
          console.error(`Failed to process file: ${file.name}`, error);
          failed++;
          processed++;
          onProgress?.({ processed, total, failed });
          return null;
        }
      })
    );

    const validTracks = tracks.filter((t): t is StoredTrack => t !== null);
    if (validTracks.length > 0) {
      await saveBatch(validTracks);
    }

    // Small delay to keep UI responsive
    await new Promise(resolve => setTimeout(resolve, 0));
  }
};