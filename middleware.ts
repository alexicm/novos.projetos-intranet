import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const isLoggedIn = request.cookies.get("auth_token")

  if (!isLoggedIn && request.nextUrl.pathname.startsWith("/course-proposal")) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/course-proposal/:path*"],
}

