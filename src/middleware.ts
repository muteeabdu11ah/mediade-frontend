import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('accessToken')?.value;
    const userRole = request.cookies.get('userRole')?.value;
    const { pathname } = request.nextUrl;

    // Public routes that should not be accessible to authenticated users
    const publicRoutes = ['/login', '/register', '/'];
    const isPublicRoute = publicRoutes.includes(pathname);

    // Protected routes that require authentication
    const isProtectedRoute = pathname.startsWith('/dashboard');

    // 1. If authenticated and trying to access a public route, redirect to dashboard
    if (token && isPublicRoute) {
        const response = NextResponse.redirect(new URL('/dashboard', request.url));
        response.headers.set('Cache-Control', 'no-store, max-age=0');
        return response;
    }

    // 2. If NOT authenticated and trying to access a protected route, redirect to login
    if (!token && isProtectedRoute) {
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.headers.set('Cache-Control', 'no-store, max-age=0');
        return response;
    }

    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: ['/', '/login', '/register', '/dashboard/:path*'],
};
