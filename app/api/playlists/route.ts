// app/api/playlists/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const playlists = [
    { id: '1', name: 'Chill Vibes' },
    { id: '2', name: 'Workout Mix' },
    { id: '3', name: 'Study Focus' },
  ];
  return NextResponse.json(playlists);
}
