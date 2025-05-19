// app/components/Player.tsx
'use client';

import { useState, useEffect } from 'react';
import ReactPlayer from 'react-player/youtube';
import { 
  Play, Pause, SkipBack, SkipForward, Volume2, 
  VolumeX, Repeat, Shuffle, Maximize2, 
  Heart
} from 'lucide-react';
import Image from 'next/image';

export default function Player() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [duration, setDuration] = useState(0);
  const [played, setPlayed] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [currentTrack, setCurrentTrack] = useState<any>(null);
  
  // Listen to global events for track playing
  useEffect(() => {
    const handlePlayTrack = (event: CustomEvent) => {
      if (event.detail) {
        setCurrentTrack(event.detail.track);
        setVideoId(event.detail.videoId);
        setIsPlaying(true);
      }
    };

    // Add event listener
    window.addEventListener('playTrack' as any, handlePlayTrack as any);

    // Cleanup
    return () => {
      window.removeEventListener('playTrack' as any, handlePlayTrack as any);
    };
  }, []);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };

  const handleProgress = (state: any) => {
    if (!seeking) {
      setPlayed(state.played);
    }
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlayed(parseFloat(e.target.value));
  };

  const handleSeekMouseDown = () => {
    setSeeking(true);
  };

  const handleSeekMouseUp = (e: React.MouseEvent<HTMLInputElement>) => {
    setSeeking(false);
    if (e.target instanceof HTMLInputElement) {
      setPlayed(parseFloat(e.target.value));
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#181818] border-t border-[#282828] p-4">
      <div className="flex items-center justify-between h-full">
        {/* Currently playing */}
        <div className="flex items-center gap-x-4 w-1/4">
          <div className="relative h-14 w-14 rounded overflow-hidden">
            <Image 
              fill 
              src={currentTrack.thumbnail || '/public/default-cover.png'} 
              alt="Cover Art" 
              className="object-cover"
              sizes="56px"
            />
          </div>
          <div className="flex flex-col overflow-hidden">
            <p className="text-white text-sm truncate">{currentTrack.title}</p>
            <p className="text-xs text-neutral-400 truncate">{currentTrack.artist}</p>
          </div>
          <button className="text-neutral-400 hover:text-white">
            <Heart className="h-4 w-4" />
          </button>
        </div>
        
        {/* Player controls */}
        <div className="flex flex-col items-center max-w-[45%] w-2/5">
          <div className="flex items-center gap-x-6">
            <button className="text-neutral-400 hover:text-white">
              <Shuffle className="h-4 w-4" />
            </button>
            <button className="text-neutral-400 hover:text-white">
              <SkipBack className="h-5 w-5" />
            </button>
            <button 
              onClick={handlePlayPause} 
              className="bg-white rounded-full p-2 hover:scale-105 transition"
            >
              {isPlaying ? (
                <Pause className="h-5 w-5 text-black" />
              ) : (
                <Play className="h-5 w-5 text-black" />
              )}
            </button>
            <button className="text-neutral-400 hover:text-white">
              <SkipForward className="h-5 w-5" />
            </button>
            <button className="text-neutral-400 hover:text-white">
              <Repeat className="h-4 w-4" />
            </button>
          </div>
          
          {/* Progress bar */}
          <div className="flex items-center gap-x-2 w-full pt-2">
            <span className="text-xs text-neutral-400 w-10 text-right">
              {formatTime(duration * played)}
            </span>
            <input 
              type="range"
              min={0}
              max={1}
              step="any"
              value={played}
              onChange={handleSeekChange}
              onMouseDown={handleSeekMouseDown}
              onMouseUp={handleSeekMouseUp as any}
              className="w-full h-1 bg-neutral-600 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full"
              style={{
                background: `linear-gradient(to right, white ${played * 100}%, #5e5e5e ${played * 100}%)`
              }}
            />
            <span className="text-xs text-neutral-400 w-10">
              {formatTime(duration)}
            </span>
          </div>
        </div>
        
        {/* Volume controls */}
        <div className="flex items-center gap-x-3 w-1/4 justify-end">
          <button className="text-neutral-400 hover:text-white" onClick={() => setVolume(volume === 0 ? 0.5 : 0)}>
            {volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </button>
          <input 
            type="range"
            min={0}
            max={1}
            step="any"
            value={volume}
            onChange={handleVolumeChange}
            className="w-24 h-1 bg-neutral-600 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full"
            style={{
              background: `linear-gradient(to right, white ${volume * 100}%, #5e5e5e ${volume * 100}%)`
            }}
          />
          <button className="text-neutral-400 hover:text-white ml-2">
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {/* Hidden ReactPlayer */}
      <div className="hidden">
        {videoId && (
          <ReactPlayer
            url={`https://www.youtube.com/watch?v=${videoId}`}
            playing={isPlaying}
            volume={volume}
            onDuration={setDuration}
            onProgress={handleProgress}
            width="0"
            height="0"
            config={{
              youtube: {
                playerVars: {
                  disablekb: 1,
                  controls: 0
                }
              }
            }}
          />
        )}
      </div>
    </div>
  );
}
