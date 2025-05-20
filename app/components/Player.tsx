'use client';

import { useState, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player/youtube';
import {
  Shuffle,
  SkipBack,
  Play,
  Pause,
  SkipForward,
  Repeat,
  Heart,
  Volume2,
  VolumeX,
} from 'lucide-react';

export default function Player() {
  const [currentTrack, setCurrentTrack] = useState<any>(null);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const playerRef = useRef<ReactPlayer>(null);

  // listen for global playTrack event
  useEffect(() => {
    const handler = (e: any) => {
      setCurrentTrack(e.detail.track);
      setVideoId(e.detail.videoId);
      setIsPlaying(true);
    };
    window.addEventListener('playTrack', handler as any);
    return () => window.removeEventListener('playTrack', handler as any);
  }, []);

  // Format seconds to MM:SS
  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Handle player progress updates
  const handleProgress = (state: { played: number; playedSeconds: number }) => {
    if (!seeking) {
      setPlayed(state.played);
    }
  };

  // Handle duration update
  const handleDuration = (duration: number) => {
    setDuration(duration);
  };

  // Seek bar handlers
  const handleSeekMouseDown = () => {
    setSeeking(true);
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlayed(parseFloat(e.target.value));
  };

  const handleSeekMouseUp = () => {
    setSeeking(false);
    if (playerRef.current) {
      playerRef.current.seekTo(played);
    }
  };

  if (!currentTrack || !videoId) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-[#181818] border-t border-[#282828] z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Track Info */}
        <div className="flex items-center gap-3 w-1/4">
          <img
            src={currentTrack.thumbnail}
            alt={currentTrack.title}
            className="h-14 w-14 object-cover rounded"
          />
          <div className="truncate">
            <p className="text-white text-sm truncate">{currentTrack.title}</p>
            <p className="text-neutral-400 text-xs truncate">
              {currentTrack.artist}
            </p>
          </div>
          <button className="text-neutral-400 hover:text-white">
            <Heart className="h-5 w-5" />
          </button>
        </div>

        {/* Player Controls */}
        <div className="flex flex-col items-center w-2/4">
          <div className="flex items-center gap-6">
            <Shuffle className="h-5 w-5 text-neutral-400 hover:text-white" />
            <SkipBack className="h-6 w-6 text-neutral-400 hover:text-white" />
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="bg-white text-black rounded-full p-2 flex items-center justify-center"
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )}
            </button>
            <SkipForward className="h-6 w-6 text-neutral-400 hover:text-white" />
            <Repeat className="h-5 w-5 text-neutral-400 hover:text-white" />
          </div>

          {/* Seek Bar */}
          <div className="flex items-center gap-2 w-full mt-2">
            <span className="text-xs text-neutral-400 w-10">
              {formatTime(played * duration)}
            </span>
            <div className="relative flex-grow h-1 group">
              <input
                type="range"
                min={0}
                max={0.999999}
                step="any"
                value={played}
                onMouseDown={handleSeekMouseDown}
                onChange={handleSeekChange}
                onMouseUp={handleSeekMouseUp}
                onTouchStart={handleSeekMouseDown}
                onTouchEnd={handleSeekMouseUp}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="absolute inset-0 rounded-lg bg-neutral-600">
                <div
                  className="h-full bg-white rounded-lg"
                  style={{ width: `${played * 100}%` }}
                />
              </div>
              <div
                className="absolute h-3 w-3 bg-white rounded-full opacity-0 group-hover:opacity-100 -translate-y-1 shadow-md"
                style={{
                  left: `${played * 100}%`,
                  transform: `translateX(-50%) translateY(-25%)`,
                }}
              />
            </div>
            <span className="text-xs text-neutral-400 w-10">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-2 w-1/4 justify-end">
          <button
            onClick={() => setVolume(v => (v === 0 ? 0.7 : 0))}
            className="text-neutral-400 hover:text-white"
          >
            {volume === 0 ? (
              <VolumeX className="h-5 w-5" />
            ) : (
              <Volume2 className="h-5 w-5" />
            )}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={e => setVolume(parseFloat(e.target.value))}
            className="w-24 h-1 bg-neutral-600 rounded-lg accent-white"
            style={{
              background: `linear-gradient(to right, white ${
                volume * 100
              }%, #5e5e5e ${volume * 100}%)`,
            }}
          />
        </div>
      </div>

      {/* Hidden YouTube Player */}
      <ReactPlayer
        ref={playerRef}
        url={`https://www.youtube.com/watch?v=${videoId}`}
        playing={isPlaying}
        volume={volume}
        width="0"
        height="0"
        onProgress={handleProgress}
        onDuration={handleDuration}
        config={{
          youtube: { playerVars: { controls: 0, disablekb: 1 } },
        }}
      />
    </div>
  );
}
