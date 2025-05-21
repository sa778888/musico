// app/components/TopSongs.tsx
'use client';

import { useState, useEffect } from 'react';
import { Play, Heart, Loader2 } from 'lucide-react';
import { fetchCoverWithItunes } from '../lib/itunes';
import { getYoutubeVideoId } from '@/app/lib/youtubeSearch';
import { useLikedSongs } from '@/app/context/LikedSongsContext';

interface Song {
  videoId?: string;
  title: string;
  artist: string;
  thumbnail: string;
  itunesId: string;
}

export default function TopSongs() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const { toggleLike, isLiked } = useLikedSongs();

  // Fetch top songs from iTunes
  useEffect(() => {
    async function fetchTopSongs() {
      try {
        const response = await fetch('https://itunes.apple.com/us/rss/topsongs/limit=20/json');
        const data = await response.json();
        
        // Process and enhance each song
        const songsPromises = data.feed.entry.map(async (entry: any, index: number) => {
          const artist = entry['im:artist'].label;
          const title = entry['im:name'].label;
          const itunesId = entry.id.attributes['im:id'];
          
          // Get high-quality artwork
          const artwork = await fetchCoverWithItunes(artist, title);
          
          return {
            itunesId,
            title,
            artist,
            thumbnail: artwork,
          };
        });
        
        const enhancedSongs = await Promise.all(songsPromises);
        setSongs(enhancedSongs);
      } catch (err) {
        console.error('Failed to fetch top songs:', err);
        setError('Could not load top songs');
      } finally {
        setLoading(false);
      }
    }
    
    fetchTopSongs();
  }, []);

  // Handle play button click
  const handlePlay = async (song: Song, index: number) => {
    setPlayingIndex(index);
    
    try {
      // Find YouTube equivalent
      const videoId = await getYoutubeVideoId(song.artist, song.title);
      
      if (!videoId) {
        throw new Error('No video found');
      }
      
      // Prepare song data for player
      const trackToPlay = {
        title: song.title,
        artist: song.artist,
        thumbnail: song.thumbnail,
        videoId: videoId
      };
      
      // Dispatch event to play the track
      const event = new CustomEvent('playTrack', {
        detail: {
          track: trackToPlay,
          videoId: videoId
        }
      });
      window.dispatchEvent(event);
      
    } catch (err) {
      console.error('Error playing track:', err);
      alert('Could not play this track. Please try another.');
    } finally {
      setPlayingIndex(null);
    }
  };

  // Handle like button click
  const handleLike = (song: Song) => {
    const songWithVideoId = {
      ...song,
      videoId: song.videoId || song.itunesId // Use videoId if available, otherwise itunesId
    };
    toggleLike(songWithVideoId);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-96 text-white animate-pulse space-y-4">
      <Loader2 className="animate-spin w-8 h-8 text-green-500" />
      <p className="text-lg">Fetching the top songs...</p>
    </div>
  );
  
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-white">Top Songs</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {songs.map((song, index) => (
          <div 
            key={song.itunesId}
            className="bg-neutral-800 p-4 rounded-md hover:bg-neutral-700 transition group"
          >
            <div className="relative aspect-square mb-4">
              <img 
                src={song.thumbnail} 
                alt={`${song.title} by ${song.artist}`}
                className="object-cover w-full h-full rounded-md"
              />
              <button
                onClick={() => handlePlay(song, index)}
                disabled={playingIndex === index}
                className="absolute bottom-2 right-2 p-3 rounded-full bg-green-500 opacity-0 group-hover:opacity-100 transition"
              >
                {playingIndex === index ? (
                  <Loader2 className="animate-spin text-white" size={18} />
                ) : (
                  <Play className="text-white" size={18} fill="white" />
                )}
              </button>
            </div>
            <div className="flex justify-between items-start">
              <div className="truncate pr-2">
                <p className="font-semibold text-white truncate">{song.title}</p>
                <p className="text-neutral-400 text-sm truncate">{song.artist}</p>
              </div>
              <button
                onClick={() => handleLike(song)}
                className="transition mt-1"
                aria-label={`Like ${song.title}`}
              >
                <Heart 
                  size={18}
                  className={`hover:scale-110 transition ${
                    isLiked(song.videoId || song.itunesId) 
                      ? 'text-green-500 fill-green-500' 
                      : 'text-white'
                  }`}
                />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
