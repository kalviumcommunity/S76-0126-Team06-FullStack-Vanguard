import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Configuration
const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_SECRET = new TextEncoder().encode(SECRET_KEY);

// Routes that require authentication
const PROTECTED_ROUTES = [
    '/dashboard',
    '/projects',
    '/tasks',
    '/feedback',
    '/profile',
    '/settings',
];

// Routes that should redirect authenticated users away (login/signup)
const AUTH_ROUTES = [
    '/auth/login',
    '/auth/signup',
];

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
    '/',
    '/about',
    '/contact',
    '/api/health',
];

// API routes that are always public
const PUBLIC_API_ROUTES = [
    '/api/auth/login',
    '/api/auth/signup',
    '/api/auth/session',
    '/api/health',
];

/**
 * Middleware to protect routes and handle authentication
 * 
 * This middleware:
 * 1. Protects /dashboard/* and other protected routes
 * 2. Redirects authenticated users away from login/signup
 * 3. Allows public API routes
 * 4. Validates session tokens for protected routes
 */
export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // ============================================================
    // 1. ALLOW PUBLIC API ROUTES
    // ============================================================

    // Always allow public API routes
    if (PUBLIC_API_ROUTES.some(route => pathname.startsWith(route))) {
        return NextResponse.next();
    }

    // Allow all /api/auth/* routes (they handle their own auth)
    if (pathname.startsWith('/api/auth/')) {
        return NextResponse.next();
    }

    // ============================================================
    // 2. GET SESSION TOKEN FROM COOKIE
    // ============================================================

    const token = request.cookies.get('session')?.value;
    let isAuthenticated = false;

    // ============================================================
    // 3. VERIFY SESSION TOKEN
    // ============================================================

    if (token) {
        try {
            await jwtVerify(token, JWT_SECRET);
            isAuthenticated = true;
        } catch (error) {
            // Token is invalid or expired
            console.error('[MIDDLEWARE] Invalid session token:', error);
            isAuthenticated = false;
        }
    }

    // ============================================================
    // 4. HANDLE PROTECTED ROUTES
    // ============================================================

    // Check if the current path is a protected route
    const isProtectedRoute = PROTECTED_ROUTES.some(route =>
        pathname.startsWith(route)
    );

    if (isProtectedRoute && !isAuthenticated) {
        // User is not authenticated, redirect to login
        const loginUrl = new URL('/auth/login', request.url);
        loginUrl.searchParams.set('redirect', pathname); // Save intended destination
        return NextResponse.redirect(loginUrl);
    }

    // ============================================================
    // 5. HANDLE AUTH ROUTES (Login/Signup)
    // ============================================================

    // Redirect authenticated users away from login/signup pages
    const isAuthRoute = AUTH_ROUTES.some(route => pathname.startsWith(route));

    if (isAuthRoute && isAuthenticated) {
        // User is already logged in, redirect to dashboard
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // ============================================================
    // 6. HANDLE PUBLIC ROUTES
    // ============================================================

    // Allow public routes
    const isPublicRoute = PUBLIC_ROUTES.some(route => pathname === route);

    if (isPublicRoute) {
        return NextResponse.next();
    }

    // ============================================================
    // 7. PROTECT API ROUTES (Non-auth API routes)
    // ============================================================

    // For other API routes, require authentication
    if (pathname.startsWith('/api/') && !isAuthenticated) {
        return NextResponse.json(
            { error: 'Unauthorized - Authentication required' },
            { status: 401 }
        );
    }

    // ============================================================
    // 8. ALLOW ALL OTHER REQUESTS
    // ============================================================

    return NextResponse.next();
}

/**
 * Configure which routes this middleware should run on
 * 
 * Using matcher for better performance - middleware only runs on specified paths
 */
export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\..*|public).*)',
    ],
};
