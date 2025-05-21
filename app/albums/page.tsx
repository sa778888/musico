// app/albums/page.tsx
import TopAlbums from '@/app/components/TopAlbums';

export const metadata = {
  title: 'Top Albums | Musico',
  description: 'Browse the top albums on iTunes'
};

export default function AlbumsPage() {
  return (
    <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <TopAlbums />
    </div>
  );
}
