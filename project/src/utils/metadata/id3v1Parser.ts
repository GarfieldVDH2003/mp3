import { ID3Tags } from './types';

export const parseID3v1Tags = (buffer: ArrayBuffer): ID3Tags | null => {
  const view = new DataView(buffer);
  
  try {
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
        return { artist };
      }
    }
  } catch (error) {
    console.error('Error parsing ID3v1:', error);
  }

  return null;
}