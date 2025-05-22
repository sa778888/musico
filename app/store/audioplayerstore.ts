import { create } from 'zustand';

export type Track = {
  id: string;
  title: string;
  artist: string;
  url: string;
  imageUrl: string;
};

interface AudioPlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentPlaylist: Track[] | null;
  playFromLikedSongs: Track[] | null;
  playFromPlaylist: Track[] | null;
  setCurrentTrack: (track: Track) => void;
  play: () => void;
  pause: () => void;
  setPlaylist: (tracks: Track[], source: 'liked' | 'playlist') => void;
  clearPlaylist: () => void;
}

export const useAudioPlayerStore = create<AudioPlayerState>((set) => ({
  currentTrack: null,
  isPlaying: false,
  currentPlaylist: null,
  playFromLikedSongs: null,
  playFromPlaylist: null,

  setCurrentTrack: (track) =>
    set(() => ({
      currentTrack: track,
      isPlaying: true,
    })),

  play: () => set(() => ({ isPlaying: true })),
  pause: () => set(() => ({ isPlaying: false })),

  setPlaylist: (tracks, source) =>
    set((state) => ({
      currentPlaylist: tracks,
      playFromLikedSongs: source === 'liked' ? tracks : state.playFromLikedSongs,
      playFromPlaylist: source === 'playlist' ? tracks : state.playFromPlaylist,
    })),

  clearPlaylist: () =>
    set(() => ({
      currentPlaylist: null,
      playFromLikedSongs: null,
      playFromPlaylist: null,
    })),
}));
