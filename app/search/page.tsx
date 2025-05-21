'use client';

import MusicSearch from '../components/MusicSearch';

export default function SearchPage() {
  return (
    <div className="px-6 py-4">
      <div className="bg-neutral-900 rounded-xl p-6">
        <h1 className="text-white text-4xl font-bold mb-8">Search</h1>

        <div className="mb-10">
          <MusicSearch />
        </div>

        {/* Example content grid placeholder */}
        {/* <div>
          <h2 className="text-white text-2xl font-semibold mb-4">Browse All</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-purple-600 to-pink-500 hover:scale-105 transition-all duration-200 rounded-lg p-4 cursor-pointer"
              >
                <h3 className="text-white font-semibold text-lg">Genre {idx + 1}</h3>
              </div>
            ))}
          </div>
        </div> */}
      </div>
    </div>
  );
}
