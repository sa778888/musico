'use client'

import { useLikedSongs } from '../context/LikedSongsContext';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function LikedPage() {
  const { liked } = useLikedSongs();
  const router = useRouter();

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-indigo-900 via-black to-black text-white overflow-y-auto">
      {/* Header */}
      <div className="flex items-end px-8 py-10 gap-6 bg-indigo-800/60 backdrop-blur-sm relative">
        <button
          onClick={() => router.push('/')}
          className="absolute top-6 left-6 text-white hover:text-neutral-300 transition"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <div className="w-48 h-48 shadow-lg rounded-md overflow-hidden">
          <Image
            src="/liked-songs.png"
            alt="Liked Songs"
            width={192}
            height={192}
            className="object-cover w-full h-full"
          />
        </div>
        <div>
          <p className="uppercase text-sm font-semibold">Playlist</p>
          <h1 className="text-5xl font-bold mt-1 mb-2">Liked Songs</h1>
          <p className="text-sm text-neutral-300">{liked.length} {liked.length === 1 ? 'song' : 'songs'}</p>
        </div>
      </div>

      {/* Song List */}
      <div className="flex-1 px-8 py-6 bg-black/60 backdrop-blur-sm">
        {liked.length === 0 ? (
          <p className="text-neutral-400 mt-6">No liked songs yet.</p>
        ) : (
          <ul className="divide-y divide-neutral-800">
            {liked.map((song, index) => (
              <li
                key={song.videoId}
                className="flex items-center py-4 gap-4 hover:bg-neutral-800/50 px-2 rounded transition"
              >
                <p className="text-neutral-400 w-6 text-sm">{index + 1}</p>
                <img
                  src={song.thumbnail}
                  alt={song.title}
                  className="h-14 w-14 rounded shadow-md"
                />
                <div className="flex flex-col truncate">
                  <p className="truncate font-medium text-white">{song.title}</p>
                  <p className="text-sm text-neutral-400 truncate">{song.artist}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
