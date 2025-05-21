// app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';

export async function POST() {
  const res = NextResponse.json({ message: 'Logged out' });
  res.cookies.delete('token', { path: '/' });
  res.cookies.delete('redirect_bypass', { path: '/' });
  return res;
}
