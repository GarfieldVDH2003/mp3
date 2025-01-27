import { ID3Tags } from './types';

export const parseID3v2Tags = (buffer: ArrayBuffer): ID3Tags | null => {
  const view = new DataView(buffer);
  
  try {
    const header = String.fromCharCode(
      view.getUint8(0),
      view.getUint8(1),
      view.getUint8(2)
    );

    if (header !== 'ID3') return null;

    const size = ((view.getUint8(6) & 0x7f) << 21) |
                ((view.getUint8(7) & 0x7f) << 14) |
                ((view.getUint8(8) & 0x7f) << 7) |
                (view.getUint8(9) & 0x7f);

    let offset = 10; // Skip header

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
          return { artist };
        }
      }

      offset += frameSize;
    }
  } catch (error) {
    console.error('Error parsing ID3v2:', error);
  }

  return null;
}