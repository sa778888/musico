// app/artists/page.tsx
import TopArtists from '@/app/components/TopArtists';

export const metadata = {
  title: 'Top Artists | Musico',
  description: 'Browse the top artists on iTunes'
};

export default function ArtistsPage() {
  return (
    <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <TopArtists />
    </div>
  );
}
