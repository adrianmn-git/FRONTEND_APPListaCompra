import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
    const token = request.cookies.get('TOKEN')?.value;
    const isAuthRoute = request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register';
    const isPublicResource = request.nextUrl.pathname.startsWith('/_next') || request.nextUrl.pathname.startsWith('/api') || request.nextUrl.pathname.includes('.');

    if (isAuthRoute) {
        if (token) {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    if (!isAuthRoute && !isPublicResource) {
        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
