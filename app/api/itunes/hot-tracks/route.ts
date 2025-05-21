import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Hot tracks is another label for popular songs
    const response = await fetch('https://itunes.apple.com/us/rss/topsongs/limit=50/json');
    if (!response.ok) throw new Error(`iTunes API error: ${response.status}`);
    
    const data = await response.json();
    
    if (!data.feed || !data.feed.entry || !data.feed.entry.length) {
      throw new Error('Invalid iTunes feed structure');
    }

    const songs = data.feed.entry.map((entry: any) => ({
      id: entry.id.attributes['im:id'],
      title: entry['im:name'].label,
      artist: entry['im:artist'].label,
      artwork: entry['im:image']?.slice(-1)[0]?.label || '',
    }));

    return NextResponse.json(songs);
  } catch (error) {
    console.error('Failed to fetch hot tracks:', error);
    return NextResponse.json([], { status: 500 });
  }
}
