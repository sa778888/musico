// app/components/TrackItem.tsx
'use client';

import { useState } from 'react';
import { getYoutubeVideoId } from '../lib/youtubeSearch';
import { Play, Clock } from 'lucide-react';
import Image from 'next/image';

interface TrackItemProps {
  id: string;
  title: string;
  artist: string;
  thumbnail?: string;
  listeners?: number;
  index?: number;
}

export default function TrackItem({ id, title, artist, thumbnail, listeners, index }: TrackItemProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const handlePlay = async () => {
    setIsLoading(true);
    try {
      const videoId = await getYoutubeVideoId(artist, title);
      if (videoId) {
        // Dispatch event to global player
        window.dispatchEvent(
          new CustomEvent('playTrack', {
            detail: {
              track: { id, title, artist, thumbnail },
              videoId
            }
          })
        );
      }
    } catch (error) {
      console.error('Error playing track:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="grid grid-cols-[16px_4fr_2fr] md:grid-cols-[16px_4fr_2fr_1fr] gap-4 px-4 py-2 rounded-md group hover:bg-neutral-800/50 transition-colors"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="flex items-center justify-center w-full">
        {isHovering ? (
          <button 
            onClick={handlePlay}
            disabled={isLoading}
            className="text-white"
          >
            {isLoading ? (
              <div className="h-4 w-4 border-t-2 border-white rounded-full animate-spin" />
            ) : (
              <Play className="h-4 w-4" fill="white" />
            )}
          </button>
        ) : (
          <span className="text-neutral-400">{index}</span>
        )}
      </div>
      
      <div className="flex items-center gap-x-3">
        <div className="relative min-h-[40px] min-w-[40px] h-10 w-10">
         <Image
  src={thumbnail || '/default-cover.png'}
   width={40}
    height={40}
  alt={title}
  className="object-cover rounded"
  sizes="40px"
/>
        </div>
        <div className="flex flex-col overflow-hidden">
          <p className="text-white truncate">{title}</p>
          <p className="text-neutral-400 text-sm truncate">{artist}</p>
        </div>
      </div>
      
      <div className="flex items-center text-neutral-400 text-sm">
        {listeners && <p>{listeners.toLocaleString()} listeners</p>}
      </div>
      
      <div className="hidden md:flex items-center justify-end text-neutral-400 text-sm">
        <Clock className="h-4 w-4" />
      </div>
    </div>
  );
}
