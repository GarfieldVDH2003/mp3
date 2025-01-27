class AudioManager {
  private static instance: AudioManager;
  private audio: HTMLAudioElement;
  private currentObjectUrl: string | null = null;
  private loadingPromise: Promise<void> | null = null;

  private constructor() {
    this.audio = new Audio();
    this.audio.preload = 'auto';
  }

  static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  async loadTrack(track: StoredTrack): Promise<void> {
    // If already loading, wait for current load to complete
    if (this.loadingPromise) {
      await this.loadingPromise;
    }

    this.loadingPromise = new Promise((resolve, reject) => {
      try {
        // Clean up previous object URL
        if (this.currentObjectUrl) {
          URL.revokeObjectURL(this.currentObjectUrl);
          this.currentObjectUrl = null;
        }

        // Pause current playback
        this.audio.pause();

        // Create new blob and object URL
        const blob = new Blob([track.fileData], { type: 'audio/mpeg' });
        this.currentObjectUrl = URL.createObjectURL(blob);

        const onCanPlay = () => {
          this.audio.removeEventListener('canplay', onCanPlay);
          this.loadingPromise = null;
          resolve();
        };

        const onError = (error: Event) => {
          this.audio.removeEventListener('error', onError);
          this.loadingPromise = null;
          reject(error);
        };

        this.audio.addEventListener('canplay', onCanPlay);
        this.audio.addEventListener('error', onError);

        // Set new source and load
        this.audio.src = this.currentObjectUrl;
        this.audio.load();
      } catch (error) {
        this.loadingPromise = null;
        reject(error);
      }
    });

    return this.loadingPromise;
  }

  async play(): Promise<void> {
    try {
      if (this.loadingPromise) {
        await this.loadingPromise;
      }
      return this.audio.play();
    } catch (error) {
      console.error('Error playing audio:', error);
      throw error;
    }
  }

  pause(): void {
    this.audio.pause();
  }

  setVolume(value: number): void {
    this.audio.volume = value;
  }

  setCurrentTime(value: number): void {
    if (!isNaN(value)) {
      this.audio.currentTime = value;
    }
  }

  getCurrentTime(): number {
    return this.audio.currentTime || 0;
  }

  getDuration(): number {
    return this.audio.duration || 0;
  }

  setLoop(value: boolean): void {
    this.audio.loop = value;
  }

  addEventListener(event: string, callback: EventListenerOrEventListenerObject): void {
    this.audio.addEventListener(event, callback);
  }

  removeEventListener(event: string, callback: EventListenerOrEventListenerObject): void {
    this.audio.removeEventListener(event, callback);
  }

  cleanup(): void {
    if (this.currentObjectUrl) {
      URL.revokeObjectURL(this.currentObjectUrl);
      this.currentObjectUrl = null;
    }
  }
}

export const audioManager = AudioManager.getInstance();