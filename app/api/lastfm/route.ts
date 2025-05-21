import { NextResponse } from 'next/server';

const API_KEY = process.env.LAPI_KEY
const BASE_URL = 'https://ws.audioscrobbler.com/2.0/';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');
  const limit = searchParams.get('limit') || '20';
  const page = searchParams.get('page') || '1';
  console.log('API_KEY env:', process.env.API_KEY);
  if (!query) {
    return NextResponse.json({ error: 'Missing query param' }, { status: 400 });
  }

  try {
    const url = `${BASE_URL}?method=track.search&track=${encodeURIComponent(query)}` +
                `&api_key=${API_KEY}&format=json&limit=${limit}&page=${page}`;

    const response = await fetch(url);
    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch from Last.fm' }, { status: response.status });
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
