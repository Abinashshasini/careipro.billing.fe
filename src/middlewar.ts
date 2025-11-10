import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('auth_token')?.value;
  const url = req.nextUrl.clone();

  let isAuthenticated = false;

  if (token) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/store/details`,
        {
          method: 'GET',
          headers: {
            Cookie: `auth_token=${token}`,
          },
        },
      );

      const data = await response.json();
      if (response.ok && data.success) {
        isAuthenticated = true;
      }
    } catch (err) {
      console.error('Error validating token in middleware:', err);
    }
  }

  if (!isAuthenticated) {
    if (url.pathname !== '/') {
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  } else {
    if (url.pathname === '/') {
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
  }

  const res = NextResponse.next();
  res.headers.set('x-debug', 'middleware-hit');
  return res;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)).*)',
  ],
};
