// app/api/musicbrainz/search/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');
  
  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }
  
  try {
    const url = `https://musicbrainz.org/ws/2/recording/?query=${encodeURIComponent(query)}&fmt=json&limit=20`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'YourAppName/1.0.0 (your@email.com)',
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`MusicBrainz API error: ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching from MusicBrainz:', error);
    return NextResponse.json({ error: 'Failed to fetch data from MusicBrainz' }, { status: 500 });
  }
}
