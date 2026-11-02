import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const sessionToken = request.cookies.get('museo_session');

  const isLoginPage = pathname === '/login';
  const isProfilePage = pathname.startsWith('/profile');
  const isPublicAsset =
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico';

  if (isPublicAsset) {
    return NextResponse.next();
  }

  // 1. If user is NOT authenticated and trying to access protected personal curator profile
  if (!sessionToken && isProfilePage) {
    const targetUrl = pathname + search;
    const loginUrl = new URL('/login', request.url);
    if (targetUrl) {
      loginUrl.searchParams.set('redirectTo', targetUrl);
    }
    return NextResponse.redirect(loginUrl);
  }

  // 2. If user IS authenticated and visits /login, redirect to target or home
  if (sessionToken && isLoginPage) {
    const redirectTo = request.nextUrl.searchParams.get('redirectTo') || '/';
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
