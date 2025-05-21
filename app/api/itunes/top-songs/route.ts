// app/api/itunes/top-songs/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch(
      'https://itunes.apple.com/us/rss/topsongs/limit=20/json'
    );
    const data = await response.json();

    const songs = data.feed.entry.map((entry: any) => ({
      id: entry.id.attributes['im:id'],
      title: entry['im:name'].label,
      artist: entry['im:artist'].label,
      artwork: entry['im:image'].slice(-1)[0].label,
      previewUrl: entry.link[1].attributes.href,
    }));

    return NextResponse.json({ songs });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch top songs' },
      { status: 500 }
    );
  }
}
