// components/AddToPlaylistMenu.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { Plus, Check, Loader2, X } from 'lucide-react';

interface Playlist {
  id: string;
  name: string;
}

interface AddToPlaylistMenuProps {
  song: any;
  isOpen: boolean;
  onClose: () => void;
  anchorEl: HTMLElement | null;
}

export default function AddToPlaylistMenu({
  song,
  isOpen,
  onClose,
  anchorEl
}: AddToPlaylistMenuProps) {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingTo, setAddingTo] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Position menu near the anchor element
  const getMenuPosition = () => {
    if (!anchorEl) return {};

    const rect = anchorEl.getBoundingClientRect();
    return {
      top: `${rect.bottom + window.scrollY + 5}px`,
      left: `${rect.left + window.scrollX}px`
    };
  };

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

  // Fetch user's playlists
  useEffect(() => {
    const fetchPlaylists = async () => {
      if (!isOpen) return;
      
      try {
        setLoading(true);
        const response = await fetch('/api/playlists', {
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          setPlaylists(data);
        }
      } catch (error) {
        console.error('Failed to load playlists:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchPlaylists();
    }
  }, [isOpen]);

  // Reset states when menu closes
  useEffect(() => {
    if (!isOpen) {
      setSuccess(null);
      setAddingTo(null);
    }
  }, [isOpen]);

  // Add song to playlist
 
  const addToPlaylist = async (playlistId: string) => {
    if (!song) return;
    
    setAddingTo(playlistId);
    
    try {
      // Make sure we have the required properties
      if (!song.videoId) {
        console.error('Song is missing videoId property:', song);
        throw new Error('Song is missing videoId');
      }
      
      // Ensure song object has the required fields
      const songData = {
        videoId: song.videoId,
        title: song.title || 'Unknown Title',
        artist: song.artist || 'Unknown Artist',
        thumbnail: song.thumbnail || '',
      };
      
      console.log('Adding song to playlist:', songData);
      
      const response = await fetch(`/api/playlists/${playlistId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ song: songData })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error('Server error:', data);
        throw new Error(data.error || 'Failed to add to playlist');
      }
      
      // Show success message
      setSuccess(playlistId);
      
      // Close after a delay
      setTimeout(() => {
        setSuccess(null);
        setAddingTo(null);
        onClose();
      }, 1500);
      
    } catch (error) {
      console.error('Error adding to playlist:', error);
      setAddingTo(null);
    }
  };
  if (!isOpen) return null;

  const position = getMenuPosition();

  return (
    <div 
      ref={menuRef}
      className="absolute z-50 w-56 bg-neutral-800 shadow-lg rounded-md py-1 overflow-hidden"
      style={position}
    >
      <div className="flex items-center justify-between py-2 px-3 text-sm font-medium text-neutral-300 border-b border-neutral-700">
        <span>Add to playlist</span>
        <button onClick={onClose} className="text-neutral-400 hover:text-white">
          <X size={16} />
        </button>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-5 w-5 animate-spin text-neutral-400" />
        </div>
      ) : playlists.length === 0 ? (
        <div className="py-3 px-4 text-sm text-neutral-400">
          No playlists found
        </div>
      ) : (
        <div className="max-h-60 overflow-y-auto">
          {playlists.map(playlist => (
            <button
              key={playlist.id}
              onClick={() => addToPlaylist(playlist.id)}
              disabled={addingTo === playlist.id || success === playlist.id}
              className="w-full text-left px-4 py-2 text-sm hover:bg-neutral-700 flex items-center justify-between"
            >
              <span className="truncate">{playlist.name}</span>
              {addingTo === playlist.id ? (
                <Loader2 className="h-4 w-4 animate-spin text-green-500" />
              ) : success === playlist.id ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Plus className="h-4 w-4 text-neutral-400" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
