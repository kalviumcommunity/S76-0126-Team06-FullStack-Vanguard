<<<<<<< HEAD
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const isAuth = !!token;
        const isDashboardPage = req.nextUrl.pathname.startsWith("/dashboard");

        if (isDashboardPage && !isAuth) {
            return NextResponse.redirect(new URL("/auth/login", req.url));
        }

        // Role-based redirection for the root dashboard path
        if (req.nextUrl.pathname === "/dashboard") {
            if (token?.role === "MENTOR") {
                return NextResponse.redirect(new URL("/dashboard/mentor", req.url));
            }
            if (token?.role === "STUDENT") {
                return NextResponse.redirect(new URL("/dashboard/student", req.url));
            }
            // If no role, fallback to login
            return NextResponse.redirect(new URL("/auth/login", req.url));
        }

        // Protect role-specific routes
        if (req.nextUrl.pathname.startsWith("/dashboard/mentor")) {
            if (token?.role === "STUDENT") {
                return NextResponse.redirect(new URL("/dashboard/student", req.url));
            }
            if (!token?.role) {
                return NextResponse.redirect(new URL("/auth/login", req.url));
            }
        }

        if (req.nextUrl.pathname.startsWith("/dashboard/student")) {
            if (token?.role === "MENTOR") {
                return NextResponse.redirect(new URL("/dashboard/mentor", req.url));
            }
            if (!token?.role) {
                return NextResponse.redirect(new URL("/auth/login", req.url));
            }
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
    }
);

export const config = {
    matcher: ["/dashboard/:path*"],
=======
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Configuration
const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_SECRET = new TextEncoder().encode(SECRET_KEY);

// Routes that require authentication
const PROTECTED_ROUTES = [
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
>>>>>>> 4de8c1147d8a9ffd4acd0b5780d80706e8c116da
};
