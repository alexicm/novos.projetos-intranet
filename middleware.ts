import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const authSession = request.cookies.get("supabase-auth-token")

  if (!authSession || (authSession && authSession.expired)) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/course-proposal/:path*"],
}

