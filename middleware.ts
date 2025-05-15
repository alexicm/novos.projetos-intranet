import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Authentication checks removed
  return NextResponse.next()
}

export const config = {
  matcher: ["/course-proposal/:path*"],
}
