// app/context/LikedSongsContext.tsx
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export interface Song {
  videoId: string;
  title: string;
  artist: string;
  thumbnail: string;
}

interface ContextValue {
  user: { id: string; email: string } | null;
  liked: Song[];
  isLiked: (videoId: string) => boolean;
  toggleLike: (song: Song) => Promise<void>;
}

const LikedSongsContext = createContext<ContextValue | null>(null);

export function LikedSongsProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [liked, setLiked] = useState<Song[]>([]);

  // fetch /api/auth/me
  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(({ user }) => {
        setUser(user);
        if (user) fetchLiked();
      });
  }, []);

  const fetchLiked = async () => {
    const res = await fetch('/api/liked-songs');
    if (res.ok) setLiked(await res.json());
  };

  const isLiked = (videoId: string) => liked.some(s => s.videoId === videoId);

  const toggleLike = async (song: Song) => {
    if (!user) throw new Error('Not authenticated');
    const method = isLiked(song.videoId) ? 'DELETE' : 'POST';
    const body = isLiked(song.videoId) ? { songId: song.videoId } : { song };
    await fetch('/api/liked-songs', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    fetchLiked();
  };

  return (
    <LikedSongsContext.Provider value={{ user, liked, isLiked, toggleLike }}>
      {children}
    </LikedSongsContext.Provider>
  );
}

export const useLikedSongs = () => {
  const ctx = useContext(LikedSongsContext);
  if (!ctx) throw new Error('useLikedSongs must be used within Provider');
  return ctx;
};
