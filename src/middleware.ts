import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const ADMIN_PATH = /^\/admin(?!\/login)(\/.*)?$/;

export const runtime = 'nodejs';

async function verifyAdminToken(token: string) {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (e) {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes (not /admin-login)
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('admin_token')?.value;
    if (!token) {
      return NextResponse.redirect(new URL('/admin-login', request.url));
    }
    const decoded = await verifyAdminToken(token);
    if (!decoded || !decoded.isAdmin) {
      return NextResponse.redirect(new URL('/admin-login', request.url));
    }
  }
  // Allow all other requests
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
}; 