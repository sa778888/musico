// components/SongContextMenu.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Heart, Plus} from 'lucide-react';
import { useLikedSongs } from '@/app/context/LikedSongsContext';
import AddToPlaylistMenu from './AddToPlaylist';
import { Song } from '../types/track';

interface SongContextMenuProps {
  song: Song;
  isOpen: boolean;
  onClose: () => void;
  position: { x: number; y: number };
}

export default function SongContextMenu({
  song,
  isOpen,
  onClose,
  position
}: SongContextMenuProps) {
  const { isLiked, toggleLike } = useLikedSongs();
  const menuRef = useRef<HTMLDivElement>(null);
  const [showPlaylistMenu, setShowPlaylistMenu] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Reset state when closed
  useEffect(() => {
    if (!isOpen) {
      setShowPlaylistMenu(false);
    }
  }, [isOpen]);

  if (!isOpen || !song) return null;

  const handlePlay = () => {
    const event = new CustomEvent('playTrack', {
      detail: {
        track: {
          title: song.title,
          artist: song.artist,
          thumbnail: song.thumbnail
        },
        videoId: song.videoId
      }
    });
    window.dispatchEvent(event);
    onClose();
  };

  const handleLike = async () => {
    await toggleLike(song);
    onClose();
  };

  const handleAddToPlaylist = (e: React.MouseEvent) => {
    setMenuAnchorEl(e.currentTarget as HTMLElement);
    setShowPlaylistMenu(true);
  };

  return (
    <>
      <div
        ref={menuRef}
        className="fixed z-50 bg-neutral-800 border border-neutral-700 rounded-md shadow-lg overflow-hidden w-40"
        style={{ top: position.y, left: position.x }}
      >
        <div className="py-1">
          <button
            onClick={handlePlay}
            className="w-full text-left px-4 py-2 text-sm hover:bg-neutral-700 flex items-center gap-2"
          >
            <Play size={16} />
            <span>Play</span>
          </button>
          
          <button
            onClick={handleLike}
            className="w-full text-left px-4 py-2 text-sm hover:bg-neutral-700 flex items-center gap-2"
          >
            <Heart 
              size={16} 
              fill={isLiked(song.videoId) ? "#22c55e" : "none"} 
              color={isLiked(song.videoId) ? "#22c55e" : "currentColor"} 
            />
            <span>{isLiked(song.videoId) ? 'Unlike' : 'Like'}</span>
          </button>
          
          <button
            onClick={handleAddToPlaylist}
            className="w-full text-left px-4 py-2 text-sm hover:bg-neutral-700 flex items-center gap-2"
          >
            <Plus size={16} />
            <span>Add to playlist</span>
          </button>
        </div>
      </div>

      <AddToPlaylistMenu
        song={song}
        isOpen={showPlaylistMenu}
        onClose={() => {
          setShowPlaylistMenu(false);
          onClose();
        }}
        anchorEl={menuAnchorEl}
      />
    </>
  );
}
