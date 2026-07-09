import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  if (pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname === "/favicon.ico") {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/tailor/dashboard/:path*", "/auth/:path*", "/login/:path*"],
};
