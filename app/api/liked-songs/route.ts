// app/api/liked-songs/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from "../../lib/prisma"
import { verifyToken } from '../../lib/auth'

function getUserId(req: NextRequest) {
  const token = req.cookies.get('token')?.value
  if (!token) return null
  try {
    return verifyToken(token).userId
  } catch {
    return null
  }
}

export async function GET(req: NextRequest) {
  const userId = getUserId(req)
  if (!userId) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 })

  const liked = await prisma.likedSong.findMany({
    where: { userId },
    include: { song: true },
    orderBy: { likedAt: 'desc' },
  })
  return NextResponse.json(liked.map(l => l.song))
}

export async function POST(req: NextRequest) {
  const userId = getUserId(req)
  if (!userId) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 })

  const { song } = await req.json()
  if (!song?.videoId) return NextResponse.json({ error: 'Missing song.videoId' }, { status: 400 })

  const savedSong = await prisma.song.upsert({
    where: { videoId: song.videoId },
    update: {},
    create: {
      videoId: song.videoId,
      title: song.title,
      artist: song.artist,
      thumbnail: song.thumbnail,
    },
  })

  await prisma.likedSong.create({
    data: { userId, songId: savedSong.id },
  })

  return NextResponse.json({ success: true })
}

export async function DELETE(req: NextRequest) {
  const userId = getUserId(req)
  if (!userId) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 })

  const { songId: videoId } = await req.json()
  if (!videoId) return NextResponse.json({ error: 'Missing songId' }, { status: 400 })

  const song = await prisma.song.findUnique({ where: { videoId } })
  if (!song) return NextResponse.json({ error: 'Song not found' }, { status: 404 })

  await prisma.likedSong.delete({
    where: { userId_songId: { userId, songId: song.id } },
  })

  return NextResponse.json({ success: true })
}
