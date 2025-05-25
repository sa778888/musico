'use client';

import { useState, useEffect } from 'react';
import { Play, Heart, Loader2, ArrowLeft } from 'lucide-react';
import { useLikedSongs } from '@/app/context/LikedSongsContext';
import { getYoutubeVideoId } from '@/app/lib/youtubeSearch';
import { useRouter } from 'next/navigation';

interface Album {
  id: string;
  title: string;
  artist: string;
  artwork: string;
  releaseDate?: string;
  genre?: string;
}

export default function TopAlbums() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const { toggleLike, isLiked } = useLikedSongs();
  const router = useRouter();

  useEffect(() => {
    async function fetchAlbums() {
      try {
        const res = await fetch('/api/itunes/top-albums');
        if (!res.ok) throw new Error('Failed to fetch albums');
        const data = await res.json();
        setAlbums(data);
      } catch (err) {
        console.error('Error loading albums:', err);
        setError('Failed to load albums');
      } finally {
        setLoading(false);
      }
    }

    fetchAlbums();
  }, []);

  const handlePlay = async (album: Album) => {
    try {
      setPlayingId(album.id);
      
      // Search for YouTube equivalent
      const searchQuery = `${album.artist} - ${album.title}`;
      const videoId = await getYoutubeVideoId(album.artist, album.title);
      
      if (!videoId) {
        throw new Error('No matching video found');
      }
      
      // Format the song data for your player
      const songData = {
        title: album.title,
        artist: album.artist,
        thumbnail: album.artwork,
        videoId: videoId
      };
      
      // Dispatch the playTrack event
      const event = new CustomEvent('playTrack', {
        detail: {
          track: songData,
          videoId: videoId
        }
      });
      window.dispatchEvent(event);
    } catch (err) {
      console.error('Error playing album:', err);
    } finally {
      setPlayingId(null);
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-96 text-white animate-pulse space-y-4">
      <Loader2 className="animate-spin w-8 h-8 text-green-500" />
      <p className="text-lg">Fetching the top albums...</p>
    </div>
  );
  
  if (error) return (
    <div className="p-8 text-red-500 text-center">
      <p>{error}</p>
      <button 
        onClick={() => window.location.reload()}
        className="mt-4 px-4 py-2 bg-white text-black rounded-full hover:bg-opacity-80"
      >
        Try Again
      </button>
    </div>
  );

  return (
    <div className="p-6">
      {/* Back Button */}
      <div className="mb-6">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors group"
        >
          <ArrowLeft 
            size={20} 
            className="transition-transform group-hover:-translate-x-1" 
          />
          <span className="text-sm font-medium">Back</span>
        </button>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Top Albums</h2>
      </div>
      
      {/* Albums Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {albums.map((album) => (
          <div
            key={album.id}
            className="bg-neutral-800 rounded-lg p-4 transition-all duration-300 hover:bg-neutral-700 group"
          >
            <div className="relative aspect-square mb-4 shadow-lg">
              <img
                src={album.artwork}
                alt={`${album.title} by ${album.artist}`}
                
                className="object-cover w-full h-full rounded-md"
                loading="lazy"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.src = '/default-album-cover.jpg'; // Fallback image
                }}
              />
              <button
                onClick={() => handlePlay(album)}
                disabled={playingId === album.id}
                aria-label={`Play ${album.title}`}
                className="absolute inset-0 w-full h-full flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity"
              >
                <div className="bg-green-500 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
                  {playingId === album.id ? (
                    <Loader2 className="animate-spin text-white" size={24} />
                  ) : (
                    <Play className="text-white ml-1" size={24} fill="white" />
                  )}
                </div>
              </button>
            </div>
            
            <div className="flex justify-between items-start">
              <div className="truncate pr-2">
                <p className="font-semibold text-white truncate">{album.title}</p>
                <p className="text-neutral-400 text-sm truncate">{album.artist}</p>
                {album.genre && (
                  <p className="text-neutral-500 text-xs mt-1">{album.genre}</p>
                )}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // Cast to match your Song interface
                  toggleLike({
                    videoId: album.id,
                    title: album.title,
                    artist: album.artist,
                    thumbnail: album.artwork
                  });
                }}
                className={`flex-shrink-0 transition mt-1 ${isLiked(album.id) ? 'text-green-500' : 'text-white'}`}
                aria-label={`Like ${album.title}`}
              >
                <Heart 
                  size={20} 
                  className={`hover:scale-110 transition-transform ${isLiked(album.id) ? 'fill-green-500' : ''}`}
                />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
