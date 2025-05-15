import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Permitir acesso a todas as rotas
  return NextResponse.next()
}

export const config = {
  matcher: ["/course-proposal/:path*"],
}
