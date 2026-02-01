import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const isAuth = !!token;
        const isSuperAdmin = token?.role === "SUPER_ADMIN";
        const isAdmin = token?.role === "ADMIN";

        if (req.nextUrl.pathname.startsWith("/admin")) {
            if (!isAuth) {
                console.log('🔒 Middleware - No token found, redirecting to login');
                return NextResponse.redirect(new URL("/login", req.url));
            }

            if (!isSuperAdmin && !isAdmin) {
                console.log('⛔ Middleware - Insufficient permissions:', token.role);
                return NextResponse.redirect(new URL("/login", req.url));
            }
        }
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
    }
);

export const config = {
    matcher: ["/admin/:path*"],
};
