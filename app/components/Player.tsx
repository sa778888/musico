// app/components/Player.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player/youtube';
import {
  Shuffle, SkipBack, Play, Pause, SkipForward,
  Repeat, Heart, Volume2, VolumeX, Loader2
} from 'lucide-react';
import { useLikedSongs } from '../context/LikedSongsContext';
import { Song } from '../context/LikedSongsContext';
import { getYoutubeVideoId } from '../lib/youtubeSearch';

export default function Player() {
  // Renamed variable to avoid the naming conflict
  const { liked: likedSongs, toggleLike, isLiked } = useLikedSongs();
  
  // Playlist and song state
  const [playlist, setPlaylist] = useState<Song[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [current, setCurrent] = useState<Song | null>(null);
  const [videoId, setVideoId] = useState<string | null>(null);
  
  // History queue for last 10 songs
  const [songHistory, setSongHistory] = useState<Song[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const maxHistorySize = 10;
  
  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seeking, setSeeking] = useState(false);
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [anim, setAnim] = useState(false);

  // Shuffle and playlist state
  const [shuffleMode, setShuffleMode] = useState(false);
  const [playingFromLiked, setPlayingFromLiked] = useState(false);
  const [likedSongsList, setLikedSongsList] = useState<Song[]>([]);
  const [repeatMode, setRepeatMode] = useState(0); // 0: off, 1: repeat all, 2: repeat one
  
  // References and hooks
  const playerRef = useRef<ReactPlayer>(null);

  // Get default cover art for missing thumbnails
  const getDefaultThumbnail = (artist: string) => {
    const hash = artist.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const hue = hash % 360;
    return `https://via.placeholder.com/300/${hue.toString(16)}0066/FFFFFF?text=${encodeURIComponent(artist)}`;
  };

  // Initialize with a queued song but don't autoplay
  useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true);
      queueRandomSong();
    }
  }, [isInitialized]);

  // Listen for playFromLikedSongs events - FIXED with timeout
  useEffect(() => {
    const handlePlayFromLiked = (e: any) => {
      const songs = e.detail?.likedSongs || likedSongs;
      
      if (songs.length === 0) return;
      
      // Store the liked songs list
      setLikedSongsList(songs);
      
      // Set flag to indicate we're in liked songs mode
      setPlayingFromLiked(true);
      setShuffleMode(true);
      
      // Set loading state to provide feedback
      setLoading(true);
      
      // Play a random song from liked songs
      const randomIndex = Math.floor(Math.random() * songs.length);
      const randomSong = songs[randomIndex];
      
      // Play the selected song
      setCurrent(randomSong);
      setVideoId(randomSong.videoId);
      addToHistory(randomSong);
      setPlayed(0);
      
      // IMPORTANT: Short timeout to ensure ReactPlayer has time to update
      // before we try to play - fixes the issue with shuffle not playing automatically
      setTimeout(() => {
        setIsPlaying(true);
        setLoading(false);
      }, 300);
    };
    
    window.addEventListener('playFromLikedSongs', handlePlayFromLiked);
    return () => window.removeEventListener('playFromLikedSongs', handlePlayFromLiked);
  }, [likedSongs]);

  // Listen for playFromPlaylist events
  useEffect(() => {
    const handlePlayFromPlaylist = (e: any) => {
      const songs = e.detail?.songs || [];
      
      if (songs.length === 0) return;
      
      // Store the playlist songs for next/previous navigation
      setLikedSongsList(songs);
      
      // Set flags to indicate we're in playlist mode
      setPlayingFromLiked(true);
      setShuffleMode(true);
      
      // Set loading state for feedback
      setLoading(true);
      
      // Play a random song from the playlist
      const randomIndex = Math.floor(Math.random() * songs.length);
      const randomSong = songs[randomIndex];
      
      // Play the song
      setCurrent(randomSong);
      setVideoId(randomSong.videoId);
      addToHistory(randomSong);
      setPlayed(0);
      
      // Ensure playback starts after a short delay
      setTimeout(() => {
        setIsPlaying(true);
        setLoading(false);
      }, 300);
    };
    
    window.addEventListener('playFromPlaylist', handlePlayFromPlaylist);
    return () => window.removeEventListener('playFromPlaylist', handlePlayFromPlaylist);
  }, []);

  // Add song to history queue
  const addToHistory = (song: Song) => {
    setSongHistory(prev => {
      // Don't add if it's the same as the last song
      if (prev.length > 0 && prev[prev.length - 1].videoId === song.videoId) {
        return prev;
      }
      
      // Create new history with the song added
      const newHistory = [...prev, song];
      
      // Trim history to max size
      if (newHistory.length > maxHistorySize) {
        newHistory.shift(); // Remove oldest song
      }
      
      // Update history index to point to the current song
      setHistoryIndex(newHistory.length - 1);
      
      return newHistory;
    });
  };

  // Listen for playTrack events from other components
  useEffect(() => {
    const handler = (e: any) => {
      const { track, videoId: vid } = e.detail;
      const newSong = { ...track, videoId: vid };

      // Add the song to the playlist
      setPlaylist(prevPlaylist => {
        const newPlaylist = [...prevPlaylist, newSong];
        setCurrentIndex(newPlaylist.length - 1);
        return newPlaylist;
      });

      // Also add to history
      addToHistory(newSong);

      setCurrent(newSong);
      setVideoId(vid);
      setIsPlaying(true);
      setPlayed(0);
      
      // Reset the liked songs mode when playing a specific track
      setPlayingFromLiked(false);
    };
    window.addEventListener('playTrack', handler);
    return () => window.removeEventListener('playTrack', handler);
  }, []);

  // Queue a random song without playing it
  const queueRandomSong = async () => {
    setLoading(true);
    try {
      // Use only top-songs for reliability
      const response = await fetch('/api/itunes/top-songs');
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const songs = await response.json();
      
      if (!songs || !Array.isArray(songs) || songs.length === 0) {
        console.error('No songs returned or invalid format:', songs);
        throw new Error('No songs returned');
      }
      
      // Pick a random song
      const randomSong = songs[Math.floor(Math.random() * songs.length)];
      
      // Find YouTube equivalent
      try {
        const foundVideoId = await getYoutubeVideoId(
          randomSong.artist, 
          randomSong.title
        );
        
        if (foundVideoId) {
          const songData = {
            videoId: foundVideoId,
            title: randomSong.title,
            artist: randomSong.artist,
            thumbnail: randomSong.artwork || getDefaultThumbnail(randomSong.artist),
          };
          
          setCurrent(songData);
          setVideoId(foundVideoId);
          setPlayed(0);
          // Don't set isPlaying to true
        } else {
          throw new Error('No video found for song');
        }
      } catch (videoError) {
        console.error('Video lookup error:', videoError);
        setTimeout(queueRandomSong, 500);
      }
    } catch (error) {
      console.error('Error fetching random song:', error);
      setTimeout(queueRandomSong, 2000);
    } finally {
      setLoading(false);
    }
  };

  // Play random song from liked songs
  const playRandomFromLiked = () => {
    if (!likedSongsList || likedSongsList.length === 0) {
      // If likedSongsList is empty, try using the context liked songs
      if (likedSongs.length === 0) return;
      setLikedSongsList(likedSongs);
    }
    
    setLoading(true);
    
    try {
      // Use the liked songs list we're storing
      const randomIndex = Math.floor(Math.random() * likedSongsList.length);
      const randomSong = likedSongsList[randomIndex];
      
      
      // Set current song
      setCurrent(randomSong);
      setVideoId(randomSong.videoId);
      
      // Add to history
      addToHistory(randomSong);
      
      setPlayed(0);
      
      // Use timeout to ensure player loads before trying to play
      setTimeout(() => {
        setIsPlaying(true);
        setLoading(false);
      }, 300);
    } catch (error) {
      console.error('Error playing random liked song:', error);
      setLoading(false);
    }
  };

  // Toggle shuffle mode
  const toggleShuffle = () => {
    setShuffleMode(!shuffleMode);
    
    // If turning on shuffle mode and we have liked songs loaded, use them
    if (!shuffleMode && playingFromLiked && likedSongsList.length > 0) {
      playRandomFromLiked();
    }
  };

  // Toggle repeat mode
  const toggleRepeat = () => {
    setRepeatMode((current) => (current + 1) % 3);
  };

  // Playback control handlers
  const handleProgress = (state: { played: number }) => {
    if (!seeking) setPlayed(state.played);
  };

  const handleDuration = (dur: number) => setDuration(dur);

  const togglePlay = () => {
    if (!isPlaying && current) {
      // Add to history when starting to play a queued song
      if (historyIndex === -1) {
        addToHistory(current);
      }
    }
    setIsPlaying(p => !p);
  };

  const onSeekDown = () => setSeeking(true);

  const onSeekChange = (e: any) => setPlayed(parseFloat(e.target.value));

  const onSeekUp = () => {
    setSeeking(false);
    playerRef.current?.seekTo(played);
  };

  // Play next song
  const playNext = async () => {
    if (loading) return;
    
    setLoading(true);
    
    try {
      if (historyIndex < songHistory.length - 1) {
        // Navigate forward in history if possible
        const nextIndex = historyIndex + 1;
        const nextSong = songHistory[nextIndex];
        
        setCurrent(nextSong);
        setVideoId(nextSong.videoId);
        setHistoryIndex(nextIndex);
        setPlayed(0);
        setIsPlaying(true);
        return;
      }
      
      // If in shuffle mode and playing from liked songs
      if (shuffleMode && playingFromLiked) {
        playRandomFromLiked();
        return;
      }
      
      // Otherwise, get a new random song from API
      const response = await fetch('/api/itunes/top-songs');
      if (!response.ok) throw new Error('Failed to fetch songs');
      
      const songs = await response.json();
      if (!songs || !songs.length) throw new Error('No songs returned');
      
      const randomSong = songs[Math.floor(Math.random() * songs.length)];
      
      const foundVideoId = await getYoutubeVideoId(
        randomSong.artist, 
        randomSong.title
      );
      
      if (foundVideoId) {
        const songData = {
          videoId: foundVideoId,
          title: randomSong.title,
          artist: randomSong.artist,
          thumbnail: randomSong.artwork || getDefaultThumbnail(randomSong.artist),
        };
        
        setCurrent(songData);
        setVideoId(foundVideoId);
        
        // Add to history
        addToHistory(songData);
        
        setPlayed(0);
        setIsPlaying(true);
      } else {
        setTimeout(playNext, 500);
      }
    } catch (error) {
      console.error('Error playing next song:', error);
      setTimeout(playNext, 2000);
    } finally {
      setLoading(false);
    }
  };

  // Play previous song
  const playPrev = () => {
    if (loading) return;
    if (historyIndex <= 0) return; // No previous songs
    
    setLoading(true);
    
    try {
      const prevIndex = historyIndex - 1;
      const prevSong = songHistory[prevIndex];
      
      setCurrent(prevSong);
      setVideoId(prevSong.videoId);
      setHistoryIndex(prevIndex);
      setPlayed(0);
      setIsPlaying(true);
    } catch (error) {
      console.error('Error playing previous song:', error);
    } finally {
      setLoading(false);
    }
  };

  // When song ends, play next or repeat based on mode
  const handleEnded = () => {
    if (repeatMode === 2) {
      // Repeat one
      playerRef.current?.seekTo(0);
      setPlayed(0);
      setIsPlaying(true);
    } else {
      // Repeat all or off - play next
      playNext();
    }
  };

  // Handle like/unlike
  const handleLike = async () => {
    if (!current) return;
    setAnim(true);
    await toggleLike(current);
    setTimeout(() => setAnim(false), 500);
  };

  // Format time for display (e.g. 3:45)
  const formatTime = (t: number) => {
    if (!t) return '0:00';
    const m = Math.floor(t/60), s = Math.floor(t%60);
    return `${m}:${s<10?'0':''}${s}`;
  };

  // Loading state
  if (!current || !videoId) {
    return (
      <div className="fixed bottom-0 left-0 w-full bg-[#181818] border-t border-[#282828] z-50 p-4 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-white" />
        <span className="ml-2 text-white">Loading music...</span>
      </div>
    );
  }

  // This is a different variable - it's a boolean for the current song
  const liked = isLiked(current.videoId);
  const hasPreviousSong = historyIndex > 0;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-[#181818] border-t border-[#282828] z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Song info section */}
        <div className="flex items-center gap-3 w-1/4">
          <img 
            src={current.thumbnail} 
            className="h-14 w-14 rounded object-cover" 
            alt={current.title}
            onError={(e) => {
              e.currentTarget.src = getDefaultThumbnail(current.artist);
            }}
          />
          <div className="truncate">
            <p className="text-white">{current.title}</p>
            <p className="text-neutral-400 text-xs">{current.artist}</p>
          </div>
          <button
            onClick={handleLike}
            className={`
              transition-colors
              ${liked?'text-green-500 hover:text-green-400':'text-neutral-400 hover:text-white'}
              ${anim?'animate-heart-pop':''}
            `}
          >
            <Heart className="h-5 w-5" fill={liked?'currentColor':'none'} />
          </button>
        </div>

        {/* Playback controls section */}
        <div className="flex flex-col items-center w-2/4">
          <div className="flex items-center gap-6">
            <button 
              onClick={toggleShuffle} 
              className={`text-neutral-400 hover:text-white ${shuffleMode ? 'text-green-500' : ''}`}
              title={shuffleMode ? 'Shuffle on' : 'Shuffle off'}
            >
              <Shuffle className="h-5 w-5" />
            </button>
            <button 
              onClick={playPrev} 
              disabled={loading || !hasPreviousSong}
              className={`
                text-neutral-400 
                ${hasPreviousSong ? 'hover:text-white cursor-pointer' : 'opacity-50 cursor-default'}
                ${loading ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <SkipBack className="h-6 w-6" />
            </button>
            <button 
              onClick={togglePlay} 
              disabled={loading}
              className={`bg-white text-black p-2 rounded-full ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )}
            </button>
            <button 
              onClick={playNext} 
              disabled={loading}
              className={`text-neutral-400 hover:text-white ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <SkipForward className="h-6 w-6" />
            </button>
            <button
              onClick={toggleRepeat}
              className={`
                text-neutral-400 hover:text-white transition
                ${repeatMode === 1 ? 'text-green-500' : ''}
                ${repeatMode === 2 ? 'text-green-500 after:content-["1"] after:absolute after:text-[10px] after:top-0 after:right-0' : ''}
              `}
              title={
                repeatMode === 0 ? 'Enable repeat' : 
                repeatMode === 1 ? 'Enable repeat one' : 'Disable repeat'
              }
            >
              <div className="relative">
                <Repeat className="h-5 w-5" />
                {repeatMode === 2 && (
                  <span className="absolute -top-1 -right-1 text-[10px] bg-green-500 text-black rounded-full w-3 h-3 flex items-center justify-center">
                    1
                  </span>
                )}
              </div>
            </button>
          </div>

          {/* Progress bar */}
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

        {/* Volume control section */}
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

      {/* Hidden video player */}
      <ReactPlayer
        ref={playerRef}
        url={`https://www.youtube.com/watch?v=${videoId}`}
        playing={isPlaying}
        volume={volume}
        width="0" height="0"
        onProgress={handleProgress}
        onDuration={handleDuration}
        onEnded={handleEnded}
        onReady={() => {
          // When ReactPlayer is ready with a new video, ensure it's playing if it should be
          if (isPlaying) {
            playerRef.current?.getInternalPlayer()?.playVideo();
          }
        }}
        config={{ youtube: { playerVars: { controls:0, disablekb:1 } } }}
      />
    </div>
  );
}
