'use client';

import './globals.css';
import MusicSearch from './components/MusicSearch';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import TopSongs from './components/TopSongs';

export default function Home() {
  const [greeting, setGreeting] = useState('Good morning');
  const router = useRouter();

  useEffect(() => {
    const hour = new Date().getHours();
    setGreeting(
      hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
    );
  }, []);

  return (
    <div className="px-6 py-8">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">{greeting}</h1>

      {/* Shortcut Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 mb-10">
        <Card
          title="Liked Songs"
          image="/liked-songs.png"
          onClick={() => router.push('/liked')}
          gradient="from-purple-600 via-pink-500 to-red-400"
        />
        <Card
          title="Top Albums"
          image="/albums.png"
          onClick={() => router.push('/albums')}
          gradient="from-indigo-500 to-blue-600"
        />
        <Card
          title="Top Artists"
          image="/discover.png"
          onClick={() => router.push('/artists')}
          gradient="from-green-400 to-teal-500"
        />
      </div>

      {/* Search Section */}
      <h2 className="text-2xl font-bold text-white mb-6">Search for music</h2>
      <div className="bg-neutral-800 p-4 rounded-lg mb-10">
        <MusicSearch />
      </div>

      {/* Top Songs Section */}
      <TopSongs />
    </div>
  );
}

function Card({
  title,
  image,
  onClick,
  gradient,
}: {
  title: string;
  image: string;
  onClick: () => void;
  gradient: string;
}) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer group transition transform hover:scale-[1.03] hover:shadow-lg rounded-xl overflow-hidden bg-gradient-to-br ${gradient}`}
    >
      <div className="flex items-center gap-4 p-4">
        <img src={image} alt={title} className="h-16 w-16 object-cover rounded-md" />
        <p className="text-white font-semibold truncate">{title}</p>
      </div>
    </div>
  );
}
