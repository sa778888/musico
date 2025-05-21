// components/CreatePlaylistModal.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';

interface CreatePlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePlaylist: (name: string) => Promise<void>;
}

export default function CreatePlaylistModal({ isOpen, onClose, onCreatePlaylist }: CreatePlaylistModalProps) {
  const [playlistName, setPlaylistName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playlistName.trim()) {
      setError('Please enter a name for your playlist');
      return;
    }

    setError('');
    setIsLoading(true);
    try {
      await onCreatePlaylist(playlistName);
      setPlaylistName('');
      onClose();
    } catch (err) {
      setError('Failed to create playlist. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div ref={modalRef} className="bg-neutral-800 rounded-md p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Create Playlist</h2>
          <button onClick={onClose} className="text-neutral-400 hover:text-white">
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="playlistName" className="block text-sm font-medium mb-2">
              Playlist Name
            </label>
            <input
              ref={inputRef}
              id="playlistName"
              type="text"
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
              placeholder="My Awesome Playlist"
              className="w-full p-3 bg-neutral-700 border border-neutral-600 rounded-md text-white"
              maxLength={50}
            />
          </div>
          
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-white hover:underline"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-green-500 text-black font-semibold rounded-full hover:bg-green-400 disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
