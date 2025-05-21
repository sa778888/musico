'use client';

import { useState, FormEvent } from 'react';
import { searchTracks, LastFMTrack } from '../lib/lastfm';
import TrackItem from './TrackItem';
import { Clock, Search } from 'lucide-react';

export default function MusicSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<LastFMTrack[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const tracks = await searchTracks(query);
      setResults(tracks);

      if (tracks.length === 0) {
        setError('No tracks found. Try another search term.');
      }
    } catch (err) {
      console.error('Error searching tracks:', err);
      setError('Failed to search for music. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full mb-20">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="relative w-full max-w-lg">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="What do you want to listen to?"
            className="bg-neutral-900 text-white w-full rounded-full py-3 pl-12 pr-36 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-md transition"
            suppressHydrationWarning={true}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-green-500 hover:bg-green-400 text-black font-semibold rounded-full px-5 py-2 transition disabled:opacity-60 disabled:cursor-not-allowed"
            suppressHydrationWarning={true}
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {/* Error */}
      {error && (
        <div className="bg-red-900/30 border border-red-500 text-red-200 p-3 rounded mb-4 max-w-lg">
          {error}
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Songs</h2>

          {/* Table Header */}
          <div className="grid grid-cols-[16px_4fr_2fr] md:grid-cols-[16px_4fr_2fr_1fr] gap-4 px-4 py-3 border-b border-neutral-800 text-neutral-400 text-sm font-medium mb-2">
            <div className="text-center">#</div>
            <div>Title</div>
            <div>Listeners</div>
            <div className="hidden md:flex justify-end">
              <Clock className="h-5 w-5" />
            </div>
          </div>

          {/* Track List */}
          <div className="flex flex-col divide-y divide-neutral-800 rounded-lg overflow-hidden">
            {results.map((track, i) => (
              <TrackItem
                key={track.id}
                id={track.id}
                title={track.title}
                artist={track.artist}
                thumbnail={track.thumbnail}
                listeners={track.listeners}
                index={i + 1}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
