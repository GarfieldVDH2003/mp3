export interface StoredTrack {
  id: string;
  title: string;
  artist: string;
  duration: string;
  lastPlayed: number;
  fileData: ArrayBuffer;
}