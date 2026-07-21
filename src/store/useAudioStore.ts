import { create } from 'zustand';

interface AudioStore {
  currentSegmentId: string | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isLoading: boolean;
  audioElement: HTMLAudioElement | null;
  analyzerNode: AnalyserNode | null;
  audioContext: AudioContext | null;

  // Actions
  setAudioElement: (el: HTMLAudioElement | null) => void;
  play: (segmentId: string, audioUrl: string) => void;
  pause: () => void;
  togglePlay: (segmentId: string, audioUrl: string) => void;
  seek: (time: number) => void;
  setVolume: (vol: number) => void;
  updateTime: (time: number) => void;
  setDuration: (dur: number) => void;
  setLoading: (loading: boolean) => void;
  stopAll: () => void;
  initAnalyzer: () => void;
}

export const useAudioStore = create<AudioStore>()((set, get) => ({
  currentSegmentId: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 0.8,
  isLoading: false,
  audioElement: null,
  analyzerNode: null,
  audioContext: null,

  setAudioElement: (el) => set({ audioElement: el }),

  play: (segmentId, audioUrl) => {
    const state = get();
    const audio = state.audioElement;
    if (!audio) return;

    // If different segment, change source
    if (state.currentSegmentId !== segmentId) {
      audio.src = audioUrl;
      audio.load();
      set({ currentSegmentId: segmentId, currentTime: 0, isLoading: true });
    }

    audio.volume = state.volume;
    audio.play().catch(console.error);
    set({ isPlaying: true });
  },

  pause: () => {
    const audio = get().audioElement;
    if (audio) audio.pause();
    set({ isPlaying: false });
  },

  togglePlay: (segmentId, audioUrl) => {
    const state = get();
    if (state.currentSegmentId === segmentId && state.isPlaying) {
      state.pause();
    } else {
      state.play(segmentId, audioUrl);
    }
  },

  seek: (time) => {
    const audio = get().audioElement;
    if (audio) {
      audio.currentTime = time;
      set({ currentTime: time });
    }
  },

  setVolume: (vol) => {
    const audio = get().audioElement;
    if (audio) audio.volume = vol;
    set({ volume: vol });
    // Persist volume preference
    if (typeof window !== 'undefined') {
      localStorage.setItem('worship-poll-volume', String(vol));
    }
  },

  updateTime: (time) => set({ currentTime: time }),

  setDuration: (dur) => set({ duration: dur }),

  setLoading: (loading) => set({ isLoading: loading }),

  stopAll: () => {
    const audio = get().audioElement;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    set({ isPlaying: false, currentSegmentId: null, currentTime: 0 });
  },

  initAnalyzer: () => {
    const state = get();
    if (state.analyzerNode || !state.audioElement) return;

    try {
      const ctx = new AudioContext();
      const source = ctx.createMediaElementSource(state.audioElement);
      const analyzer = ctx.createAnalyser();
      analyzer.fftSize = 64;
      source.connect(analyzer);
      analyzer.connect(ctx.destination);
      set({ audioContext: ctx, analyzerNode: analyzer });
    } catch {
      // AudioContext may fail in some environments
      console.warn('Could not initialize audio analyzer');
    }
  },
}));
