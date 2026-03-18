import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('auth_token')?.value;
    const isAuthRoute = request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register';
    const isProtectedRoute = request.nextUrl.pathname === '/profile' || request.nextUrl.pathname === '/' || request.nextUrl.pathname === '/products'; 
    // Wait, the user might want the root path `/` to be protected if it's the shopping list. 
    // Yes, generally a shopping list app is protected at `/`.

    if (isAuthRoute) {
        if (token) {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    if (isProtectedRoute) {
        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/', '/login', '/register', '/profile', '/products'],
};
