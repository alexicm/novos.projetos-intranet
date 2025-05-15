import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Permitir todas as requisições
  return NextResponse.next()
}

// Limitar o middleware apenas às rotas específicas
export const config = {
  matcher: ["/course-proposal/:path*"],
}
