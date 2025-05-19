// app/page.tsx
'use client';

import MusicSearch from './components/MusicSearch';
import { useEffect, useState } from 'react';

export default function Home() {
  const [greeting, setGreeting] = useState('Good morning');
  
  useEffect(() => {
    const getTimeBasedGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) return 'Good morning';
      if (hour < 18) return 'Good afternoon';
      return 'Good evening';
    };
    
    setGreeting(getTimeBasedGreeting());
  }, []);

  return (
    <div className="pb-10">
      <h1 className="text-white text-3xl font-bold mt-10 mb-6">
        {greeting}
      </h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-r from-neutral-800 to-neutral-700 group flex items-center gap-x-4 rounded-md overflow-hidden hover:bg-neutral-700/50 transition cursor-pointer p-3">
          <div className="relative min-h-[64px] min-w-[64px]">
            <img 
              src="/liked-songs.png" 
              alt="Liked Songs" 
              className="object-cover h-full w-full"
            />
          </div>
          <p className="font-medium truncate text-white">Liked Songs</p>
        </div>
        <div className="bg-gradient-to-r from-neutral-800 to-neutral-700 group flex items-center gap-x-4 rounded-md overflow-hidden hover:bg-neutral-700/50 transition cursor-pointer p-3">
          <div className="relative min-h-[64px] min-w-[64px]">
            <img 
              src="/albums.png" 
              alt="Top Albums" 
              className="object-cover h-full w-full"
            />
          </div>
          <p className="font-medium truncate text-white">Top Albums</p>
        </div>
        <div className="bg-gradient-to-r from-neutral-800 to-neutral-700 group flex items-center gap-x-4 rounded-md overflow-hidden hover:bg-neutral-700/50 transition cursor-pointer p-3">
          <div className="relative min-h-[64px] min-w-[64px]">
            <img 
              src="/discover.png" 
              alt="Discover" 
              className="object-cover h-full w-full"
            />
          </div>
          <p className="font-medium truncate text-white">Discover Weekly</p>
        </div>
      </div>
      
      <h2 className="text-2xl font-bold text-white mb-6">
        Search for music
      </h2>
      
      <MusicSearch />
    </div>
  );
}
