// app/lib/youtubeSearch.ts
export async function getYoutubeVideoId(artist: string, title: string): Promise<string | null> {
    const searchQuery = `${artist} - ${title} official audio`;
    
    try {
      // Use server API route to avoid CORS
      const response = await fetch(`/api/youtube/extract?query=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) {
        throw new Error(`Failed to search: ${response.status}`);
      }
      
      const data = await response.json();
      return data.videoId || null;
    } catch (error) {
      console.error('Error searching YouTube:', error);
      return null;
    }
  }
  