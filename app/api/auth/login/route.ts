// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '../../../lib/prisma'
import bcrypt from 'bcryptjs'
import { signToken } from '../../../lib/auth'

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()
  
  // Validate input
  if (!email || !password) {
    return NextResponse.json(
      { error: 'Missing email or password' }, 
      { status: 400 }
    )
  }

  // Find user
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, hashedPassword: true },
  })
  
  // Verify credentials
  if (!user || !(await bcrypt.compare(password, user.hashedPassword))) {
    return NextResponse.json(
      { error: 'Invalid credentials' }, 
      { status: 401 }
    )
  }

  // Generate tokens
  const token = signToken(user.id)
  const res = NextResponse.redirect(new URL('/', req.url))

  // Set bypass cookie (non-httpOnly)
  res.cookies.set('redirect_bypass', 'true', {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 5, // 5 seconds
  })

  // Set auth cookie (httpOnly)
  res.cookies.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  return res
}
