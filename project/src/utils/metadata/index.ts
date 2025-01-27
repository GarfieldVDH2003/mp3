import { ID3Tags } from './types';
import { parseID3v2Tags } from './id3Parser';
import { parseID3v1Tags } from './id3v1Parser';

export const extractMetadata = async (file: File): Promise<ID3Tags> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      const buffer = e.target?.result as ArrayBuffer;
      
      try {
        // Try to get metadata using MediaMetadata API first
        const url = URL.createObjectURL(file);
        const audio = new Audio(url);
        
        await new Promise((resolve) => {
          audio.addEventListener('loadedmetadata', resolve, { once: true });
          audio.load();
        });

        URL.revokeObjectURL(url);
        
        // Check for media metadata
        if (audio.mediaMetadata?.artist) {
          resolve({ artist: audio.mediaMetadata.artist });
          return;
        }

        // Try ID3v2 tags
        if (buffer.byteLength > 10) {
          const id3v2Tags = parseID3v2Tags(buffer);
          if (id3v2Tags) {
            resolve(id3v2Tags);
            return;
          }
        }

        // Try ID3v1 tags as last resort
        if (buffer.byteLength > 128) {
          const id3v1Tags = parseID3v1Tags(buffer);
          if (id3v1Tags) {
            resolve(id3v1Tags);
            return;
          }
        }

        // If no metadata found, return unknown artist
        resolve({ artist: 'Unknown Artist' });
      } catch (error) {
        console.error('Error extracting metadata:', error);
        resolve({ artist: 'Unknown Artist' });
      }
    };

    reader.onerror = () => {
      console.error('Error reading file:', reader.error);
      resolve({ artist: 'Unknown Artist' });
    };

    reader.readAsArrayBuffer(file);
  });
};