import { fetchCoverWithItunes } from './itunes';

export interface LastFMTrack {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration?: number;
  thumbnail: string;
  listeners?: number;
  url: string;
}
interface LastFMApiTrack {
  name: string;
  artist: string;
  listeners: string;   // it's a string in the API
  url: string;
  mbid?: string;
}

export async function searchTracks(
  query: string,
  limit = 20,
  page = 1
): Promise<LastFMTrack[]> {
  if (!query) return [];

  const res = await fetch(`/api/lastfm?query=${encodeURIComponent(query)}&limit=${limit}&page=${page}`);
  if (!res.ok) {
    console.error('LastFM proxy error', res.status);
    return [];
  }
  const data = await res.json();

  let matches = data.results?.trackmatches?.track;
  if (!matches) return [];
  if (!Array.isArray(matches)) matches = [matches];

  return Promise.all(
    (matches as LastFMApiTrack[]).map(async (t) => {
      const title = t.name;
      const artist = t.artist;
      const listeners = parseInt(t.listeners, 10) || 0;
      const url = t.url;
      const id = t.mbid || `lastfm-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      const thumbnail = await fetchCoverWithItunes(artist, title);

      return { id, title, artist, thumbnail, listeners, url };
    })
  );
}
