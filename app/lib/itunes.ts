
// lib/itunes.ts

/**
 * Query the iTunes Search API for a single song and return its artwork.
 * If nothing is found, return '/default-album.png'.
 */
export async function fetchCoverWithItunes(
    artist: string,
    track: string
  ): Promise<string> {
    // build the search term: "Artist Name Track Name"
    const term = encodeURIComponent(`${artist} ${track}`);
    const url  = `https://itunes.apple.com/search?term=${term}&entity=song&limit=1`;
  
    try {
      const res  = await fetch(url);
      const json = await res.json();
      const item = json.results?.[0];
      if (!item?.artworkUrl100) throw new Error('No artwork');
  
      // iTunes returns a 100×100 URL; swap to 600×600 for better quality
      return item.artworkUrl100.replace('100x100', '600x600');
    } catch (err) {
      console.warn('iTunes cover fetch failed:', err);
      return '/default-album.png';
    }
  }
  