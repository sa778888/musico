// app/api/itunes/top-artists/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // iTunes doesn't have a dedicated top artists endpoint, so we'll extract from top songs
    const response = await fetch('https://itunes.apple.com/us/rss/topsongs/limit=50/json');
    const data = await response.json();

    // Extract unique artists
    const artistMap = new Map();
    
    data.feed.entry.forEach((entry: any) => {
      const artistName = entry['im:artist'].label;
      const artistId = entry['im:artist'].attributes?.href || entry.id.attributes['im:id'];
      
      if (!artistMap.has(artistName)) {
        artistMap.set(artistName, {
          id: artistId,
          name: artistName,
          // Use the song's artwork initially
          image: entry['im:image'][2]?.label || entry['im:image'][0]?.label,
          genre: entry.category?.attributes?.label || 'Music'
        });
      }
    });

    // Convert to array and take top 20
    const artists = Array.from(artistMap.values()).slice(0, 20);
    
    return NextResponse.json(artists);
  } catch (error) {
    console.error('Error fetching artists:', error);
    return NextResponse.json({ error: 'Failed to fetch top artists' }, { status: 500 });
  }
}
