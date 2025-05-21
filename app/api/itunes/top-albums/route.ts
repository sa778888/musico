// app/api/itunes/top-albums/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://itunes.apple.com/us/rss/topalbums/limit=40/json');
    const data = await response.json();

    const albums = data.feed.entry.map((entry: any) => ({
      id: entry.id.attributes['im:id'],
      title: entry['im:name'].label,
      artist: entry['im:artist'].label,
      // Get highest resolution image
      artwork: entry['im:image'][2]?.label || entry['im:image'][0]?.label,
      releaseDate: entry['im:releaseDate']?.label,
      genre: entry.category?.attributes?.label || 'Music'
    }));

    return NextResponse.json(albums);
  } catch (error) {
    console.error('Error fetching albums:', error);
    return NextResponse.json({ error: 'Failed to fetch top albums' }, { status: 500 });
  }
}
