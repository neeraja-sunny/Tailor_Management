import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // allow public assets and API
  if (pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname === "/favicon.ico") {
    return NextResponse.next();
  }

  // If requesting dashboard and no refresh cookie -> redirect to auth

  // if (pathname.startsWith("/tailor/dashboard")) {
  //   const refresh = req.cookies.get("refreshToken")?.value;
  //   if (!refresh) {
  //     return NextResponse.redirect(new URL("/auth", req.url));
  //   }
  // }

  // if user has refresh cookie and goes to /auth or /login, redirect to dashboard
  
  // if (pathname.startsWith("/auth") || pathname.startsWith("/login")) {
  //   const refresh = req.cookies.get("refreshToken")?.value;
  //   if (refresh) {
  //     return NextResponse.redirect(new URL("/tailor/dashboard", req.url));
  //   }
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ["/tailor/dashboard/:path*", "/auth/:path*", "/login/:path*"],
};
