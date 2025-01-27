export const extractMetadata = async (file: File): Promise<{ artist: string }> => {
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
        
        if (audio.mediaMetadata?.artist) {
          resolve({ artist: audio.mediaMetadata.artist });
          return;
        }

        // Fallback to ID3v2 tag parsing
        if (buffer.byteLength > 10) {
          const view = new DataView(buffer);
          const header = String.fromCharCode(
            view.getUint8(0),
            view.getUint8(1),
            view.getUint8(2)
          );

          if (header === 'ID3') {
            // Parse ID3v2 tags
            let offset = 10; // Skip header
            const size = ((view.getUint8(6) & 0x7f) << 21) |
                        ((view.getUint8(7) & 0x7f) << 14) |
                        ((view.getUint8(8) & 0x7f) << 7) |
                        (view.getUint8(9) & 0x7f);

            while (offset < size) {
              const frameId = String.fromCharCode(
                view.getUint8(offset),
                view.getUint8(offset + 1),
                view.getUint8(offset + 2),
                view.getUint8(offset + 3)
              );

              const frameSize = view.getUint32(offset + 4);
              offset += 10; // Skip frame header

              if (frameId === 'TPE1' || frameId === 'TPE2') { // Artist frames
                // Skip text encoding byte
                const artistBuffer = buffer.slice(offset + 1, offset + frameSize);
                const artist = new TextDecoder().decode(artistBuffer).replace(/\0/g, '').trim();
                if (artist) {
                  resolve({ artist });
                  return;
                }
              }

              offset += frameSize;
            }
          }
        }

        // Fallback to ID3v1 as last resort
        if (buffer.byteLength > 128) {
          const tag = String.fromCharCode(
            view.getUint8(buffer.byteLength - 128),
            view.getUint8(buffer.byteLength - 127),
            view.getUint8(buffer.byteLength - 126)
          );
          
          if (tag === 'TAG') {
            const artist = new TextDecoder().decode(
              buffer.slice(buffer.byteLength - 125, buffer.byteLength - 95)
            ).trim().replace(/\0/g, '');
            
            if (artist) {
              resolve({ artist });
              return;
            }
          }
        }
      } catch (error) {
        console.error('Error extracting metadata:', error);
      }
      
      resolve({ artist: 'Unknown Artist' });
    };
    reader.readAsArrayBuffer(file);
  });
};