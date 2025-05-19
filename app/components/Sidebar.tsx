// app/components/Sidebar.tsx
'use client';

import { useEffect, useState } from 'react';
import { Home, Search, Library, PlusSquare, Heart } from 'lucide-react';
import Link from 'next/link';

export default function Sidebar() {
  const [playlists, setPlaylists] = useState([
    { id: '1', name: 'Chill Vibes' },
    { id: '2', name: 'Workout Mix' },
    { id: '3', name: 'Study Focus' },
  ]);

  return (
    <div className="hidden md:flex flex-col bg-black w-[300px] p-2">
      <div className="flex flex-col gap-y-4 px-5 py-4">
        <Link href="/" className="flex items-center gap-x-4 text-white">
          <svg viewBox="0 0 1134 340" className="h-10 w-28">
            <title>Music Explorer</title>
            <path fill="currentColor" d="M8 171.4c0 7 5.7 12.7 12.7 12.7h109.7c7 0 12.7-5.7 12.7-12.7s-5.7-12.7-12.7-12.7H20.7c-7 0-12.7 5.7-12.7 12.7zM20.7 85.9h109.7c7 0 12.7-5.7 12.7-12.7s-5.7-12.7-12.7-12.7H20.7C13.7 60.5 8 66.2 8 73.2s5.7 12.7 12.7 12.7zM20.7 243.2h109.7c7 0 12.7-5.7 12.7-12.7s-5.7-12.7-12.7-12.7H20.7c-7 0-12.7 5.7-12.7 12.7s5.7 12.7 12.7 12.7z"></path>
          </svg>
        </Link>
        <div className="flex flex-col gap-y-4 mt-2">
          <Link href="/" className="flex items-center gap-x-4 text-white hover:text-white transition">
            <Home className="h-6 w-6" />
            <p className="font-bold">Home</p>
          </Link>
          <Link href="/search" className="flex items-center gap-x-4 text-neutral-400 hover:text-white transition">
            <Search className="h-6 w-6" />
            <p className="font-medium">Search</p>
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-y-2 px-5 py-4 border-t border-neutral-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-2 text-neutral-400 hover:text-white cursor-pointer transition">
            <Library className="h-6 w-6" />
            <p className="font-medium">Your Library</p>
          </div>
          <PlusSquare className="h-5 w-5 text-neutral-400 hover:text-white cursor-pointer transition" />
        </div>
        <div className="flex flex-col gap-y-2 mt-4">
          <div className="bg-neutral-900 rounded-md p-4">
            <h2 className="text-white font-bold mb-2">Create your first playlist</h2>
            <p className="text-neutral-400 text-sm mb-4">It's easy, we'll help you</p>
            <button className="bg-white text-black font-bold text-sm py-1 px-3 rounded-full hover:scale-105 transition">
              Create playlist
            </button>
          </div>
          <div className="bg-neutral-900 rounded-md p-4 mt-2">
            <h2 className="text-white font-bold mb-2">Let's find some songs</h2>
            <p className="text-neutral-400 text-sm mb-4">Start by searching for music you love</p>
            <button className="bg-white text-black font-bold text-sm py-1 px-3 rounded-full hover:scale-105 transition">
              Browse music
            </button>
          </div>
        </div>
        <div className="mt-6 space-y-2">
          {playlists.map((playlist) => (
            <div 
              key={playlist.id} 
              className="flex items-center gap-x-3 cursor-pointer hover:text-white text-neutral-400 transition"
            >
              <p className="truncate">{playlist.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
