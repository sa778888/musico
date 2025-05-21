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
  const [limit, setLimit] = useState(30);
  const [hasMore, setHasMore] = useState(false);
  const [noMoreData, setNoMoreData] = useState(false);

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    setNoMoreData(false);
    setLimit(30);
    setResults([]);

    try {
      const tracks = await searchTracks(query, 30);
      setResults(tracks);
      setHasMore(tracks.length >= 30);
      setNoMoreData(tracks.length < 30);
    } catch (err) {
      console.error('Error searching tracks:', err);
      setError('Failed to search for music. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadMore = async () => {
    const newLimit = limit + 5;
    setIsLoading(true);
    setError(null);

    try {
      const tracks = await searchTracks(query, newLimit);
      if (tracks.length <= results.length) {
        setHasMore(false);
        setNoMoreData(true);
      } else {
        setResults(tracks);
        setLimit(newLimit);
        setHasMore(true);
      }
    } catch (err) {
      console.error('Error loading more tracks:', err);
      setError('Failed to load more tracks.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full mb-20">
      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-8 flex items-center max-w-md">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5 text-neutral-400" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="What do you want to listen to?"
            className="bg-neutral-800 text-white py-3 pl-10 pr-4 rounded-full w-full focus:ring-2 focus:ring-yellow-300"
            suppressHydrationWarning={true}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="bg-green-500 hover:bg-green-400 text-black font-bold rounded-full ml-2 px-6 py-3 transition-colors"
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {/* Error Message */}
      {error && (
        <div className="bg-red-900/30 border border-red-500 text-red-200 p-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Songs</h2>

          {/* Header Row */}
          <div className="grid grid-cols-[16px_4fr_2fr] md:grid-cols-[16px_4fr_2fr_1fr] gap-4 px-4 py-3 border-b border-neutral-800 text-neutral-400 text-sm font-medium mb-2">
            <div className="text-center">#</div>
            <div>TITLE</div>
            <div>LISTENERS</div>
            <div className="hidden md:flex justify-end">
              <Clock className="h-5 w-5" />
            </div>
          </div>

          {/* Track Items */}
          <div className="flex flex-col mb-6">
            {results.map((track, i) => (
              <TrackItem
                key={track.id + i}
                id={track.id}
                title={track.title}
                artist={track.artist}
                thumbnail={track.thumbnail}
                listeners={track.listeners}
                index={i + 1}
              />
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && !noMoreData && (
            <div className="flex justify-center mt-4">
              <button
                onClick={loadMore}
                className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold py-2 px-6 rounded-full transition-colors"
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}

          {/* No More Results Message */}
          {noMoreData && (
            <p className="text-center text-neutral-400 mt-4">
              No more tracks available.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
