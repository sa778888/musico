// lib/lastfm.ts
import { fetchCoverWithItunes } from './itunes';

const API_KEY = "5a83ae6f76dfdad656780bc08eb71bbd";
const BASE_URL = 'https://ws.audioscrobbler.com/2.0/';

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

export async function searchTracks(
  query: string,
  limit = 20
): Promise<LastFMTrack[]> {
  if (!query) return [];

  // 1) Fetch LastFM search
  const res = await fetch(
    `${BASE_URL}?method=track.search&track=${encodeURIComponent(query)}` +
    `&api_key=${API_KEY}&format=json&limit=${limit}`
  );
  if (!res.ok) {
    console.error('LastFM error', res.status);
    return [];
  }
  const data = await res.json();

  // 2) Normalize matches array
  let matches = data.results?.trackmatches?.track;
  if (!matches) return [];
  if (!Array.isArray(matches)) matches = [matches];

  // 3) Map to your LastFMTrack type, enriching with iTunes art
  return Promise.all(
    matches.map(async (t: any) => {
      const title     = t.name;
      const artist    = t.artist;
      const listeners = parseInt(t.listeners, 10) || 0;
      const url       = t.url;
      const id        = t.mbid ||
                        `lastfm-${Date.now()}-${Math.random().toString(36).substr(2,9)}`;

      // 🎨 Fetch cover via iTunes
      const thumbnail = await fetchCoverWithItunes(artist, title);

      return {
        id,
        title,
        artist,
        thumbnail,
        listeners,
        url,
      };
    })
  );
}
