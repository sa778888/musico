// app/components/PlayerController.tsx
'use client';

import { useState, useEffect } from 'react';
import ReactPlayer from 'react-player/youtube';
import { getYouTubeSearchUrl } from '../lib/youtube';

interface PlayerControllerProps {
  track: {
    title: string;
    artist: string;
    thumbnail?: string;
  } | null;
}

export default function PlayerController({ track }: PlayerControllerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [videoUrl, setVideoUrl] = useState('');

  useEffect(() => {
    if (track) {
      const url = getYouTubeSearchUrl(track.artist, track.title);
      setVideoUrl(url);
      setIsPlaying(true);
    } else {
      setVideoUrl('');
      setIsPlaying(false);
    }
  }, [track]);

  if (!track) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black bg-opacity-90 border-t border-gray-800 p-4">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        {/* Track info */}
        <div className="flex items-center">
          {track.thumbnail && (
            <img 
              src={track.thumbnail} 
              alt={track.title}
              className="w-12 h-12 mr-4 object-cover rounded"
            />
          )}
          <div>
            <h3 className="text-white font-medium">{track.title}</h3>
            <p className="text-gray-400 text-sm">{track.artist}</p>
          </div>
        </div>
        
        {/* Controls */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="bg-white text-black rounded-full p-2 hover:bg-gray-200"
          >
            {isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            )}
          </button>
          
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
            </svg>
            <input
              type="range"
              min={0}
              max={100}
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-20 accent-white"
            />
          </div>
          
          <a
            href={getYouTubeSearchUrl(track.artist, track.title)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
              <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
            </svg>
          </a>
        </div>
      </div>

      {/* Hidden player */}
      <div className="hidden">
        <ReactPlayer
          url={videoUrl}
          playing={isPlaying}
          volume={volume / 100}
          width="0"
          height="0"
        />
      </div>
    </div>
  );
}
