// context/PlayerContext.tsx
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface Track {
  id: string;
  title: string;
  artist: string;
}

interface PlayerContextType {
  currentTrack: Track | null;
  playTrack: (track: Track) => void;
  stopPlayback: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);

  const playTrack = (track: Track) => {
    setCurrentTrack(track);
  };

  const stopPlayback = () => {
    setCurrentTrack(null);
  };

  return (
    <PlayerContext.Provider value={{ currentTrack, playTrack, stopPlayback }}>
      {children}
      {currentTrack && (
        <div className="fixed bottom-0 left-0 right-0 bg-black p-4 border-t border-gray-800">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div>
              <h3 className="text-white font-bold">{currentTrack.title}</h3>
              <p className="text-gray-400">{currentTrack.artist}</p>
            </div>
            <div>
              <a
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                  `${currentTrack.artist} - ${currentTrack.title}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-red-600 text-white px-4 py-2 rounded mr-2"
              >
                Open on YouTube
              </a>
              <button
                onClick={stopPlayback}
                className="bg-gray-700 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}
