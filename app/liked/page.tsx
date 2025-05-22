"use client";

import { useState } from "react";
import { useLikedSongs } from "../context/LikedSongsContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, Heart, Play, Clock, Loader2, Shuffle } from "lucide-react";

export default function LikedPage() {
  const { liked, toggleLike, isLiked } = useLikedSongs();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  interface Song {
    videoId: string;
    title: string;
    artist: string;
    thumbnail: string;
  }

  // Play a song
  const playSong = (song: Song) => {
    setCurrentlyPlaying(song.videoId);
    const event = new CustomEvent("playTrack", {
      detail: {
        track: {
          title: song.title,
          artist: song.artist,
          thumbnail: song.thumbnail,
        },
        videoId: song.videoId,
      },
    });
    window.dispatchEvent(event);
  };

  // Dispatch event to player to play random songs from liked list only
  const playRandomSong = () => {
    if (liked.length === 0) return;

    // Instead of playing directly, tell the player to use liked songs mode
    const event = new CustomEvent("playFromLikedSongs", {
      detail: {
        likedSongs: liked,
      },
    });
    window.dispatchEvent(event);
  };

  // Handle like/unlike
  const handleToggleLike = async (song: Song, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering playSong
    setLoading(true);
    await toggleLike(song);
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-indigo-900 via-black to-black text-white overflow-y-auto">
      {/* Header */}
      <div className="flex items-end px-8 py-10 gap-6 bg-indigo-800/60 backdrop-blur-sm relative">
        <button
          onClick={() => router.push("/")}
          className="absolute top-6 left-6 text-white hover:text-neutral-300 transition"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <div className="w-48 h-48 shadow-lg rounded-md overflow-hidden flex-shrink-0">
          <Image
            src="/liked-songs.png"
            alt="Liked Songs"
            width={192}
            height={192}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="flex flex-col">
          <p className="uppercase text-sm font-semibold">Playlist</p>
          <h1 className="text-5xl font-bold mt-1 mb-2">Liked Songs</h1>
          <p className="text-sm text-neutral-300">
            {liked.length} {liked.length === 1 ? "song" : "songs"}
          </p>

          {/* Shuffle Play Button */}
          {liked.length > 0 && (
            <button
              onClick={playRandomSong}
              className="mt-6 flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black font-semibold py-3 px-7 rounded-full transition transform hover:scale-105"
            >
              <Shuffle className="h-5 w-5" />
              <span>Shuffle Play</span>
            </button>
          )}
        </div>
      </div>

      {/* Song List */}
      <div className="flex-1 px-8 py-6 bg-black/60 backdrop-blur-sm">
        {loading && liked.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
          </div>
        ) : liked.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-neutral-400 mb-2">No liked songs yet.</p>
            <p className="text-neutral-500">Songs you like will appear here</p>
          </div>
        ) : (
          <>
            {/* Table Header */}
            <div className="grid grid-cols-[auto_1fr_auto] md:grid-cols-[auto_4fr_3fr_auto] gap-4 px-4 py-2 border-b border-neutral-800 mb-2 text-neutral-400 text-sm">
              <span>#</span>
              <span>TITLE</span>
              <span className="hidden md:block">ARTIST</span>
              <span className="pr-8">
                <Clock className="h-4 w-4" />
              </span>
            </div>

            {/* Song List */}
            <ul className="divide-y divide-neutral-800/30">
              {liked.map((song, index) => (
                <li
                  key={song.videoId}
                  onClick={() => playSong(song)}
                  className="grid grid-cols-[auto_1fr_auto] md:grid-cols-[auto_4fr_3fr_auto] gap-4 py-3 px-4 hover:bg-white/5 rounded-md group transition cursor-pointer"
                >
                  <div className="flex items-center w-6 text-neutral-400">
                    {currentlyPlaying === song.videoId ? (
                      <Play
                        className="h-4 w-4 text-green-500"
                        fill="currentColor"
                      />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative h-10 w-10 flex-shrink-0">
                      <Image
                        src={song.thumbnail}
                        alt={song.title}
                        width={40}
                        height={40}
                        className="object-cover rounded"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center">
                        <Play className="h-4 w-4 text-white" fill="white" />
                      </div>
                    </div>
                    <div className="truncate">
                      <p className="truncate font-medium text-white">
                        {song.title}
                      </p>
                      <p className="text-sm text-neutral-400 truncate md:hidden">
                        {song.artist}
                      </p>
                    </div>
                  </div>

                  <div className="hidden md:block text-neutral-400 truncate self-center">
                    {song.artist}
                  </div>

                  <div className="flex items-center justify-end">
                    <button
                      onClick={(e) => handleToggleLike(song, e)}
                      className="opacity-0 group-hover:opacity-100 hover:text-white transition"
                    >
                      <Heart
                        className="h-5 w-5 text-green-500"
                        fill={isLiked(song.videoId) ? "currentColor" : "none"}
                      />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
