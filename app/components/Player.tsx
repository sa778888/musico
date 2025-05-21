// app/components/Player.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player/youtube';
import {
  Shuffle, SkipBack, Play, Pause, SkipForward,
  Repeat, Heart, Volume2, VolumeX
} from 'lucide-react';
import { useLikedSongs } from '../context/LikedSongsContext';
import { Song } from '../context/LikedSongsContext';

export default function Player() {
  // Added playlist state to track all songs that have been played
  const [playlist, setPlaylist] = useState<Song[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [current, setCurrent] = useState<Song | null>(null);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const playerRef = useRef<ReactPlayer>(null);
  const { toggleLike, isLiked } = useLikedSongs();
  const [anim, setAnim] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      const { track, videoId: vid } = e.detail;
      const newSong = { ...track, videoId: vid };
      
      // Add the song to the playlist and set it as current
      setPlaylist(prevPlaylist => {
        const newPlaylist = [...prevPlaylist, newSong];
        setCurrentIndex(newPlaylist.length - 1);
        return newPlaylist;
      });
      
      setCurrent(newSong);
      setVideoId(vid);
      setIsPlaying(true);
      setPlayed(0);
    };
    window.addEventListener('playTrack', handler);
    return () => window.removeEventListener('playTrack', handler);
  }, []);

  const handleProgress = (state: { played: number }) => {
    if (!seeking) setPlayed(state.played);
  };
  
  const handleDuration = (dur: number) => setDuration(dur);
  
  const togglePlay = () => setIsPlaying(p => !p);
  
  const onSeekDown = () => setSeeking(true);
  
  const onSeekChange = (e: any) => setPlayed(parseFloat(e.target.value));
  
  const onSeekUp = () => { 
    setSeeking(false); 
    playerRef.current?.seekTo(played); 
  };

  // New function to play the next song
  const playNext = () => {
    if (playlist.length === 0) return;
    const nextIndex = (currentIndex + 1) % playlist.length;
    setCurrentIndex(nextIndex);
    setCurrent(playlist[nextIndex]);
    setVideoId(playlist[nextIndex].videoId);
    setPlayed(0);
    setIsPlaying(true);
  };

  // New function to play the previous song
  const playPrev = () => {
    if (playlist.length === 0) return;
    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    setCurrentIndex(prevIndex);
    setCurrent(playlist[prevIndex]);
    setVideoId(playlist[prevIndex].videoId);
    setPlayed(0);
    setIsPlaying(true);
  };

  // New function to handle when a song ends
  const handleEnded = () => {
    playNext();
  };

  const handleLike = async () => {
    if (!current) return;
    setAnim(true);
    await toggleLike(current);
    setTimeout(() => setAnim(false), 500);
  };

  const formatTime = (t: number) => {
    if (!t) return '0:00';
    const m = Math.floor(t/60), s = Math.floor(t%60);
    return `${m}:${s<10?'0':''}${s}`;
  };

  if (!current || !videoId) return null;
  const liked = isLiked(current.videoId);

  return (
    <div className="fixed bottom-0 left-0 w-full bg-[#181818] border-t border-[#282828] z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3 w-1/4">
          <img src={current.thumbnail} className="h-14 w-14 rounded object-cover" alt="" />
          <div className="truncate">
            <p className="text-white">{current.title}</p>
            <p className="text-neutral-400 text-xs">{current.artist}</p>
          </div>
          <button
            onClick={handleLike}
            className={`
              transition-colors
              ${liked?'text-amber-400 hover:text-amber-300':'text-neutral-400 hover:text-white'}
              ${anim?'animate-heart-pop':''}
            `}
          >
            <Heart className="h-5 w-5" fill={liked?'currentColor':'none'} />
          </button>
        </div>

        <div className="flex flex-col items-center w-2/4">
          <div className="flex items-center gap-6">
            <Shuffle className="h-5 w-5 text-neutral-400 hover:text-white" />
            <button 
              onClick={playPrev} 
              className="text-neutral-400 hover:text-white"
              disabled={playlist.length <= 1}
            >
              <SkipBack className="h-6 w-6" />
            </button>
            <button onClick={togglePlay} className="bg-white text-black p-2 rounded-full">
              {isPlaying? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </button>
            <button 
              onClick={playNext} 
              className="text-neutral-400 hover:text-white"
              disabled={playlist.length <= 1}
            >
              <SkipForward className="h-6 w-6" />
            </button>
            <Repeat className="h-5 w-5 text-neutral-400 hover:text-white" />
          </div>

          <div className="flex items-center gap-2 w-full mt-2">
            <span className="text-xs text-neutral-400 w-10">{formatTime(played*duration)}</span>
            <div className="relative flex-grow h-1 group">
              <input
                type="range" min={0} max={1} step="any" value={played}
                onMouseDown={onSeekDown} onChange={onSeekChange} onMouseUp={onSeekUp}
                onTouchStart={onSeekDown} onTouchEnd={onSeekUp}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="absolute inset-0 bg-neutral-600 rounded-full">
                <div className="h-full bg-white rounded-full" style={{ width:`${played*100}%` }} />
              </div>
              <div className="absolute h-3 w-3 bg-white rounded-full opacity-0 group-hover:opacity-100 -translate-y-1 shadow"
                   style={{ left:`${played*100}%`, transform:'translateX(-50%) translateY(-25%)' }} />
            </div>
            <span className="text-xs text-neutral-400 w-10">{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 w-1/4 justify-end">
          <button onClick={() => setVolume(v=>v===0?0.7:0)} className="text-neutral-400 hover:text-white">
            {volume===0? <VolumeX className="h-5 w-5"/> : <Volume2 className="h-5 w-5"/>}
          </button>
          <input
            type="range" min={0} max={1} step={0.01} value={volume}
            onChange={e=>setVolume(parseFloat(e.target.value))}
            className="w-24 h-1 bg-neutral-600 rounded-lg accent-white"
            style={{ background:`linear-gradient(to right, white ${volume*100}%, #5e5e5e ${volume*100}%)` }}
          />
        </div>
      </div>

      <ReactPlayer
        ref={playerRef}
        url={`https://www.youtube.com/watch?v=${videoId}`}
        playing={isPlaying}
        volume={volume}
        width="0" height="0"
        onProgress={handleProgress}
        onDuration={handleDuration}
        onEnded={handleEnded} // Add onEnded handler
        config={{ youtube: { playerVars: { controls:0, disablekb:1 } } }}
      />
    </div>
  );
}
