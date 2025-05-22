// app/api/auth/me/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/app/lib/prisma'
import { verifyToken } from '@/app/lib/auth'

export async function GET(req: NextRequest) {
  const token = req.cookies.get('token')?.value
  if (!token) return NextResponse.json({ user: null })

  try {
    const { userId } = verifyToken(token)
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true },
    })
    if (!user) {
      return NextResponse.json({ user: null }, { status: 404 })
    }
    console.log('user', user)
    return NextResponse.json({ user })
  } catch {
    return NextResponse.json({ user: null })
  }
}
