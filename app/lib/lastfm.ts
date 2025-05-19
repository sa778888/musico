// lib/lastfm.ts
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

/**
 * Search for tracks on LastFM
 */
export async function searchTracks(query: string, limit = 20): Promise<LastFMTrack[]> {
  if (!query) return [];

  try {
    const response = await fetch(
      `${BASE_URL}?method=track.search&track=${encodeURIComponent(query)}&api_key=${API_KEY}&format=json&limit=${limit}`
    );

    if (!response.ok) {
      throw new Error(`LastFM API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Check if we have track results
    if (!data.results || !data.results.trackmatches || !data.results.trackmatches.track) {
      console.log('No tracks found on LastFM');
      return [];
    }

    // Normalize to array (LastFM returns object for single result)
    const tracks = Array.isArray(data.results.trackmatches.track) 
      ? data.results.trackmatches.track 
      : [data.results.trackmatches.track];
    
    // Map to our app's track format
    return tracks.map(track => ({
      id: track.mbid || `lastfm-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: track.name,
      artist: track.artist,
      thumbnail: track.image?.find(img => img.size === 'large')?.['#text'] || 
                 track.image?.[2]?.['#text'] || 
                 '/default-album.png',
      url: track.url,
      listeners: parseInt(track.listeners) || 0
    }));
  } catch (error) {
    console.error('Error searching LastFM tracks:', error);
    return [];
  }
}

/**
 * Get additional track info by artist and track name
 */
export async function getTrackInfo(artist: string, track: string): Promise<any> {
  try {
    const response = await fetch(
      `${BASE_URL}?method=track.getInfo&artist=${encodeURIComponent(artist)}&track=${encodeURIComponent(track)}&api_key=${API_KEY}&format=json`
    );

    if (!response.ok) {
      throw new Error(`LastFM API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting track info:', error);
    return null;
  }
}

/**
 * Search for artists on LastFM
 */
export async function searchArtists(query: string, limit = 20): Promise<any[]> {
  if (!query) return [];

  try {
    const response = await fetch(
      `${BASE_URL}?method=artist.search&artist=${encodeURIComponent(query)}&api_key=${API_KEY}&format=json&limit=${limit}`
    );

    if (!response.ok) {
      throw new Error(`LastFM API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.results || !data.results.artistmatches || !data.results.artistmatches.artist) {
      return [];
    }

    // Return the artist data
    return Array.isArray(data.results.artistmatches.artist) 
      ? data.results.artistmatches.artist 
      : [data.results.artistmatches.artist];
  } catch (error) {
    console.error('Error searching LastFM artists:', error);
    return [];
  }
}
