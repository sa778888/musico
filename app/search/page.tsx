// app/search/page.tsx
'use client';

import MusicSearch from '../components/MusicSearch';

export default function SearchPage() {
  return (
    <div className="bg-neutral-900 rounded-lg p-6 mt-6">
      <h1 className="text-white text-3xl font-bold mb-6">
        Search
      </h1>
      
      <MusicSearch />
    </div>
  );
}
