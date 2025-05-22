'use client';

import { useState, useEffect } from 'react';
import { Play, Loader2, User, ArrowLeft } from 'lucide-react';
import { getYoutubeVideoId } from '@/app/lib/youtubeSearch';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Artist {
  id: string;
  name: string;
  image: string;
  genre?: string;
}

export default function TopArtists() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchArtists() {
      try {
        const res = await fetch('/api/itunes/top-artists');
        if (!res.ok) throw new Error('Failed to fetch artists');
        const data: Artist[] = await res.json();
        setArtists(data);
      } catch (err) {
        console.error('Error loading artists:', err);
        setError('Failed to load artists');
      } finally {
        setLoading(false);
      }
    }

    fetchArtists();
  }, []);

  // Filter out duplicates by artist.id
  const uniqueArtists = artists.filter(
    (artist, index, self) =>
      index === self.findIndex((a) => a.id === artist.id)
  );

  const handlePlayArtist = async (artist: Artist) => {
    try {
      setPlayingId(artist.id);

      const videoId = await getYoutubeVideoId(artist.name, 'popular song');

      if (!videoId) {
        throw new Error('No matching video found');
      }

      const songData = {
        title: `Popular track by ${artist.name}`,
        artist: artist.name,
        thumbnail: artist.image,
        videoId: videoId,
      };

      const event = new CustomEvent('playTrack', {
        detail: {
          track: songData,
          videoId: videoId,
        },
      });
      window.dispatchEvent(event);
    } catch (err) {
      console.error('Error playing artist track:', err);
    } finally {
      setPlayingId(null);
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (loading)
    return (
      <div className="p-8 flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-white h-8 w-8" />
      </div>
    );

  if (error)
    return (
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
        <h2 className="text-2xl font-bold text-white">Top Artists</h2>
      </div>
      
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-mono text-yellow-300">Tune in to the station</h3>
      </div>

      {/* Artists Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {uniqueArtists.map((artist, index) => (
          <div
            key={`${artist.id}-${index}`}
            className="bg-neutral-800 rounded-lg p-4 transition-all duration-300 hover:bg-neutral-700 group"
          >
            <div className="relative aspect-square mb-4 shadow-lg">
              {artist.image ? (
                <Image 
                  src={artist.image}
                  alt={artist.name}
                  width={200}
                  height={200}
                  className="object-cover w-full h-full rounded-full"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-neutral-700 flex items-center justify-center">
                  <User size={40} className="text-neutral-400" />
                </div>
              )}
              <button
                onClick={() => handlePlayArtist(artist)}
                disabled={playingId === artist.id}
                aria-label={`Play music by ${artist.name}`}
                className="absolute inset-0 w-full h-full flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity rounded-full"
              >
                <div className="bg-green-500 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
                  {playingId === artist.id ? (
                    <Loader2 className="animate-spin text-white" size={24} />
                  ) : (
                    <Play className="text-white ml-1" size={24} fill="white" />
                  )}
                </div>
              </button>
            </div>

            <div className="text-center">
              <p className="font-semibold text-white truncate">{artist.name}</p>
              {artist.genre && (
                <p className="text-neutral-400 text-sm mt-1">Artist • {artist.genre}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
