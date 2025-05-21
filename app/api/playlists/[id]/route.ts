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

// Get playlist details
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const userId = getUserId(req);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const playlist = await prisma.playlist.findFirst({
    where: { 
      id: params.id,
      userId // Ensure user owns this playlist
    },
    include: {
      songs: {
        include: {
          song: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  });

  if (!playlist) {
    return NextResponse.json({ error: 'Playlist not found' }, { status: 404 });
  }

  return NextResponse.json({
    ...playlist,
    songs: playlist.songs.map(ps => ps.song)
  });
}

// Add song to playlist
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const userId = getUserId(req);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

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

  // Upsert song to ensure it exists
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

  // Add song to playlist
  await prisma.playlistSong.create({
    data: {
      playlistId: params.id,
      songId: savedSong.id
    }
  });

  return NextResponse.json({ success: true });
}

// Remove song from playlist
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const userId = getUserId(req);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { songId: videoId } = await req.json();
  if (!videoId) {
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

  const song = await prisma.song.findUnique({
    where: { videoId }
  });

  if (!song) {
    return NextResponse.json({ error: 'Song not found' }, { status: 404 });
  }

  await prisma.playlistSong.delete({
    where: {
      playlistId_songId: {
        playlistId: params.id,
        songId: song.id
      }
    }
  });

  return NextResponse.json({ success: true });
}
