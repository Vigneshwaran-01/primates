import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Add this line

export async function POST() {
  const response = NextResponse.json({ success: true });
  
  response.cookies.set('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: new Date(0),
    path: '/',
  });

  return response;
}