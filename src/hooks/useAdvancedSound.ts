"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SoundEffect =
  | 'bet'
  | 'win'
  | 'loss'
  | 'cashout'
  | 'crash'
  | 'slide'
  | 'error'
  | 'success';

export type MusicTrack = 'main' | 'lobby';

interface SoundState {
  // Volume controls (0-100)
  masterVolume: number;
  sfxVolume: number;
  musicVolume: number;
  ambientVolume: number;

  // Mute states
  isMasterMuted: boolean;
  isSfxMuted: boolean;
  isMusicMuted: boolean;
  isAmbientMuted: boolean;

  // Current playing music
  currentMusic: MusicTrack | null;
  isMusicPlaying: boolean;

  // Audio instances (not persisted)
  musicAudio: HTMLAudioElement | null;
  sfxAudio: Map<SoundEffect, HTMLAudioElement>;

  // Actions
  setMasterVolume: (volume: number) => void;
  setSfxVolume: (volume: number) => void;
  setMusicVolume: (volume: number) => void;
  setAmbientVolume: (volume: number) => void;

  toggleMasterMute: () => void;
  toggleSfxMute: () => void;
  toggleMusicMute: () => void;
  toggleAmbientMute: () => void;

  playSoundEffect: (effect: SoundEffect) => void;
  playMusic: (track: MusicTrack) => void;
  stopMusic: () => void;
  pauseMusic: () => void;
  resumeMusic: () => void;

  initializeAudio: () => void;
}

// Sound effect paths
const soundEffectPaths: Record<SoundEffect, string> = {
  bet: '/assets/audio/placebet.wav',
  win: '/assets/audio/success.wav',
  loss: '/assets/audio/error.wav',
  cashout: '/assets/audio/bet.mp3',
  crash: '/assets/audio/crash.wav',
  slide: '/assets/audio/sliding.mp3',
  error: '/assets/audio/error.wav',
  success: '/assets/audio/success.wav',
};

// Music paths
const musicPaths: Record<MusicTrack, string> = {
  main: '/assets/audio/main.mp3',
  lobby: '/assets/audio/main.mp3', // Can be changed to different track
};

export const useSoundStore = create<SoundState>()(
  persist(
    (set, get) => ({
      // Initial volumes
      masterVolume: 70,
      sfxVolume: 80,
      musicVolume: 40,
      ambientVolume: 30,

      // Initial mute states
      isMasterMuted: false,
      isSfxMuted: false,
      isMusicMuted: false,
      isAmbientMuted: false,

      // Music state
      currentMusic: null,
      isMusicPlaying: false,

      // Audio instances
      musicAudio: null,
      sfxAudio: new Map(),

      // Initialize audio instances
      initializeAudio: () => {
        if (typeof window === 'undefined') return;

        const state = get();

        // Initialize music audio
        const musicAudio = new Audio();
        musicAudio.loop = true;
        musicAudio.volume = state.isMusicMuted ? 0 : (state.musicVolume / 100) * (state.masterVolume / 100);

        // Preload sound effects
        const sfxMap = new Map<SoundEffect, HTMLAudioElement>();
        Object.entries(soundEffectPaths).forEach(([key, path]) => {
          const audio = new Audio(path);
          audio.preload = 'auto';
          sfxMap.set(key as SoundEffect, audio);
        });

        set({ musicAudio, sfxAudio: sfxMap });
      },

      // Volume setters
      setMasterVolume: (volume) => {
        set({ masterVolume: Math.max(0, Math.min(100, volume)) });
        const state = get();

        // Update all audio volumes
        if (state.musicAudio && !state.isMusicMuted && !state.isMasterMuted) {
          state.musicAudio.volume = (volume / 100) * (state.musicVolume / 100);
        }
      },

      setSfxVolume: (volume) => {
        set({ sfxVolume: Math.max(0, Math.min(100, volume)) });
      },

      setMusicVolume: (volume) => {
        set({ musicVolume: Math.max(0, Math.min(100, volume)) });
        const state = get();

        if (state.musicAudio && !state.isMusicMuted && !state.isMasterMuted) {
          state.musicAudio.volume = (volume / 100) * (state.masterVolume / 100);
        }
      },

      setAmbientVolume: (volume) => {
        set({ ambientVolume: Math.max(0, Math.min(100, volume)) });
      },

      // Mute toggles
      toggleMasterMute: () => {
        const state = get();
        const newMuted = !state.isMasterMuted;
        set({ isMasterMuted: newMuted });

        if (state.musicAudio) {
          state.musicAudio.volume = newMuted ? 0 : (state.masterVolume / 100) * (state.musicVolume / 100);
        }
      },

      toggleSfxMute: () => {
        set({ isSfxMuted: !get().isSfxMuted });
      },

      toggleMusicMute: () => {
        const state = get();
        const newMuted = !state.isMusicMuted;
        set({ isMusicMuted: newMuted });

        if (state.musicAudio) {
          state.musicAudio.volume = newMuted ? 0 : (state.masterVolume / 100) * (state.musicVolume / 100);
        }
      },

      toggleAmbientMute: () => {
        set({ isAmbientMuted: !get().isAmbientMuted });
      },

      // Play sound effect
      playSoundEffect: (effect) => {
        const state = get();

        if (state.isSfxMuted || state.isMasterMuted) return;

        const audio = state.sfxAudio.get(effect);
        if (!audio) return;

        // Clone the audio to allow multiple simultaneous plays
        const soundClone = audio.cloneNode() as HTMLAudioElement;
        soundClone.volume = (state.sfxVolume / 100) * (state.masterVolume / 100);

        soundClone.play().catch(err => {
          console.warn(`Failed to play sound effect ${effect}:`, err);
        });
      },

      // Play music
      playMusic: (track) => {
        const state = get();

        if (!state.musicAudio) {
          console.warn('Music audio not initialized');
          return;
        }

        // If same track is already playing, do nothing
        if (state.currentMusic === track && state.isMusicPlaying) {
          return;
        }

        state.musicAudio.src = musicPaths[track];
        state.musicAudio.volume = state.isMusicMuted || state.isMasterMuted
          ? 0
          : (state.musicVolume / 100) * (state.masterVolume / 100);

        state.musicAudio.play()
          .then(() => {
            set({ currentMusic: track, isMusicPlaying: true });
          })
          .catch(err => {
            console.warn('Failed to play music:', err);
          });
      },

      // Stop music
      stopMusic: () => {
        const state = get();
        if (state.musicAudio) {
          state.musicAudio.pause();
          state.musicAudio.currentTime = 0;
          set({ currentMusic: null, isMusicPlaying: false });
        }
      },

      // Pause music
      pauseMusic: () => {
        const state = get();
        if (state.musicAudio) {
          state.musicAudio.pause();
          set({ isMusicPlaying: false });
        }
      },

      // Resume music
      resumeMusic: () => {
        const state = get();
        if (state.musicAudio && state.currentMusic) {
          state.musicAudio.play()
            .then(() => {
              set({ isMusicPlaying: true });
            })
            .catch(err => {
              console.warn('Failed to resume music:', err);
            });
        }
      },
    }),
    {
      name: 'cozy-casino-sound-settings',
      partialize: (state) => ({
        masterVolume: state.masterVolume,
        sfxVolume: state.sfxVolume,
        musicVolume: state.musicVolume,
        ambientVolume: state.ambientVolume,
        isMasterMuted: state.isMasterMuted,
        isSfxMuted: state.isSfxMuted,
        isMusicMuted: state.isMusicMuted,
        isAmbientMuted: state.isAmbientMuted,
      }),
    }
  )
);

// Hook for easy access
export const useAdvancedSound = () => {
  const store = useSoundStore();

  return {
    // Volumes
    masterVolume: store.masterVolume,
    sfxVolume: store.sfxVolume,
    musicVolume: store.musicVolume,
    ambientVolume: store.ambientVolume,

    // Mute states
    isMasterMuted: store.isMasterMuted,
    isSfxMuted: store.isSfxMuted,
    isMusicMuted: store.isMusicMuted,
    isAmbientMuted: store.isAmbientMuted,

    // Music state
    currentMusic: store.currentMusic,
    isMusicPlaying: store.isMusicPlaying,

    // Actions
    setMasterVolume: store.setMasterVolume,
    setSfxVolume: store.setSfxVolume,
    setMusicVolume: store.setMusicVolume,
    setAmbientVolume: store.setAmbientVolume,

    toggleMasterMute: store.toggleMasterMute,
    toggleSfxMute: store.toggleSfxMute,
    toggleMusicMute: store.toggleMusicMute,
    toggleAmbientMute: store.toggleAmbientMute,

    playSoundEffect: store.playSoundEffect,
    playMusic: store.playMusic,
    stopMusic: store.stopMusic,
    pauseMusic: store.pauseMusic,
    resumeMusic: store.resumeMusic,

    initializeAudio: store.initializeAudio,
  };
};
