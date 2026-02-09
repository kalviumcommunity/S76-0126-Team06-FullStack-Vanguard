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
};
