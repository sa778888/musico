// components/YouTubePlayer.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import ReactPlayer from 'react-player/youtube';

interface YouTubePlayerProps {
  artist: string;
  title: string;
}

export default function YouTubePlayer({ artist, title }: YouTubePlayerProps) {
  const [videoUrl, setVideoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const findYouTubeVideoUrl = useCallback(async () => {
    setIsLoading(true);
    
    try {
      const searchQuery = `${artist} - ${title} official audio`;
      
      // Create a direct YouTube search URL
      // Note: This is client-side only, no API calls
      const youtubeUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`;
      
      // For direct playback without user interaction, we'd need to extract video IDs
      // This is a simplified approach - won't work in production without backend scraping
      setVideoUrl(youtubeUrl);
    } catch (error) {
      console.error('Error finding YouTube video:', error);
    } finally {
      setIsLoading(false);
    }
  }, [artist, title]);

  useEffect(() => {
    if (artist && title) {
      findYouTubeVideoUrl();
    }
  }, [artist, title, findYouTubeVideoUrl]);

  if (isLoading) {
    return <div className="h-20 flex items-center justify-center">Loading...</div>;
  }

  if (!videoUrl) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black p-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-2">
          <div>
            <h3 className="text-white font-bold">{title}</h3>
            <p className="text-gray-400">{artist}</p>
          </div>
          <button 
            className="text-white bg-red-600 px-3 py-1 rounded"
            onClick={() => setVideoUrl('')}
          >
            Close
          </button>
        </div>

        {/* YouTube search will open in new tab */}
        <a 
          href={videoUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="block w-full bg-red-600 text-white text-center py-3 rounded"
        >
          Open YouTube Search
        </a>
      </div>
    </div>
  );
}
