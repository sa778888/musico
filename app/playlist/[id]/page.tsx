// app/api/playlists/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { verifyToken } from '@/app/lib/auth';

function getUserId(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  if (!token) return null;
  try {
    return verifyToken(token).userId;
  } catch {
    return null;
  }
}

// Add song to playlist
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const userId = getUserId(req);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { song } = await req.json();
    if (!song?.videoId) {
      return NextResponse.json({ error: 'VideoId is required' }, { status: 400 });
    }

    // Verify playlist belongs to user
    const playlist = await prisma.playlist.findFirst({
      where: {
        id: params.id,
        userId
      }
    });

    if (!playlist) {
      return NextResponse.json({ error: 'Playlist not found' }, { status: 404 });
    }

    // Find or create song
    const savedSong = await prisma.song.upsert({
      where: { videoId: song.videoId },
      update: {},
      create: {
        videoId: song.videoId,
        title: song.title,
        artist: song.artist,
        thumbnail: song.thumbnail,
      },
    });

    // Check if song is already in playlist to avoid duplicates
    const existing = await prisma.playlistSong.findUnique({
      where: {
        playlistId_songId: {
          playlistId: params.id,
          songId: savedSong.id
        }
      }
    });

    // Only add if not already in playlist
    if (!existing) {
      await prisma.playlistSong.create({
        data: {
          playlistId: params.id,
          songId: savedSong.id
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error adding song to playlist:', error);
    return NextResponse.json({ error: 'Failed to add song' }, { status: 500 });
  }
}
