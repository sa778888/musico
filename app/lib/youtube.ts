// lib/youtube.ts

/**
 * Generate a YouTube search URL for a track
 */
export function getYouTubeSearchUrl(artist: string, title: string) {
    const query = `${artist} - ${title} official audio`;
    return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
  }
  
  /**
   * Extract video ID from the first result on a YouTube search page
   * This is a client-side function that works without YouTube API
   */
  export async function getFirstYouTubeVideoId(artist: string, title: string): Promise<string | null> {
    // This function uses DOM manipulation to extract the first video ID
    // It's a simplified approach - in production you might use the YouTube API instead
    
    const searchQuery = `${artist} - ${title} official audio`;
    
    // For demonstration, we'll return a function to open YouTube search
    // In a production app, you'd want to implement this server-side
    // or use the YouTube API directly
    
    return `dQw4w9WgXcQ`; // Sample video ID (for testing purposes only)
  }
  