'use client';

import { useState } from 'react';
import { Home, Search, Library, PlusSquare, Heart, LogOut } from 'lucide-react';
import Link from 'next/link';

export default function Sidebar() {
  const [playlists, setPlaylists] = useState([
    { id: '1', name: 'Chill Vibes' },
    { id: '2', name: 'Workout Mix' },
    { id: '3', name: 'Study Focus' },
    { id: '4', name: 'Jazz & Blues' },
    { id: '5', name: 'Coding Flow' },
    { id: '6', name: 'Evening Relax' },
    { id: '7', name: 'Party Hits' },
  ]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
    window.location.href = '/login';
  };

  return (
    <aside className="hidden md:flex flex-col h-screen w-[280px] bg-black text-neutral-400 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent">
      {/* Top Navigation */}
      <div className="flex flex-col gap-4">
        {/* Logo */}
        <Link href="/" className="text-white font-bold text-xl px-2">
          Spotify Clone
        </Link>

        {/* Home and Search */}
        <nav className="flex flex-col gap-2 mt-6">
          <Link
            href="/"
            className="flex items-center gap-4 px-2 py-2 rounded-md hover:bg-neutral-800 text-white"
          >
            <Home className="h-5 w-5" />
            <span className="text-sm font-semibold">Home</span>
          </Link>
          <Link
            href="/search"
            className="flex items-center gap-4 px-2 py-2 rounded-md hover:bg-neutral-800"
          >
            <Search className="h-5 w-5" />
            <span className="text-sm font-medium">Search</span>
          </Link>
        </nav>
      </div>

      {/* Library Section */}
      <div className="mt-8 border-t border-neutral-800 pt-4">
        <div className="flex items-center justify-between px-2 text-sm mb-4">
          <div className="flex items-center gap-2 hover:text-white cursor-pointer transition">
            <Library className="h-5 w-5" />
            <span className="font-medium">Your Library</span>
          </div>
          <PlusSquare className="h-5 w-5 cursor-pointer hover:text-white transition" />
        </div>

        {/* Liked Songs */}
        <Link
          href="/liked"
          className="flex items-center gap-4 px-2 py-2 mb-2 rounded-md hover:bg-neutral-800"
        >
          <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-2 rounded-sm">
            <Heart className="h-4 w-4 text-white fill-white" />
          </div>
          <span className="text-sm text-white font-medium">Liked Songs</span>
        </Link>

        {/* Playlist List */}
        <div className="mt-6 flex flex-col gap-2 text-sm">
          {playlists.map((playlist) => (
            <p
              key={playlist.id}
              className="px-2 py-1 cursor-pointer truncate hover:text-white transition"
            >
              {playlist.name}
            </p>
          ))}
        </div>
      </div>

      {/* Logout Button */}
      <div className="mt-auto border-t border-neutral-800 pt-4 px-2">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 text-red-500 hover:text-red-700 transition"
        >
          <LogOut className="h-5 w-5" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
