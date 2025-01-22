import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  const cookieStore = cookies()
  const authToken = cookieStore.get("auth_token")

  if (!authToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  // Here you would typically verify the token with your authentication service
  // For now, we'll just check if it exists

  return NextResponse.json({ status: "Authenticated" })
}

