// lib/auth.ts
import jwt from 'jsonwebtoken'
const JWT_SECRET = process.env.JWT_SECRET!
if (!JWT_SECRET) throw new Error('Missing JWT_SECRET in .env')

export function signToken(userId: string) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): { userId: string } {
  return jwt.verify(token, JWT_SECRET) as { userId: string }
}