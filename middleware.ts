import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  // For now, we'll handle auth protection at the component level
  // This middleware can be enhanced later with proper Supabase SSR integration

  // Check if user is trying to access dashboard without being authenticated
  // This is a basic check - the main protection happens in ProtectedRoute component
  const isDashboardRoute = req.nextUrl.pathname.startsWith('/dashboard');
  const isLoginRoute = req.nextUrl.pathname === '/login';

  // If accessing dashboard, let it through (ProtectedRoute will handle auth check)
  if (isDashboardRoute) {
    return NextResponse.next();
  }

  // If accessing login, let it through
  if (isLoginRoute) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};
