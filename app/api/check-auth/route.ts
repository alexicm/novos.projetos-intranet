import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  const cookieStore = cookies()
  const authToken = cookieStore.get("supabase-auth-token")
  const devMode = cookieStore.get("DEVMODE")

  //if (devMode && devMode.value === "true") {
  //  return NextResponse.json({ status: "Authenticated", mode: "DEVMODE" })
  //}

  //if (!authToken) {
  //  return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  //}

  return NextResponse.json({ status: "Authenticated" })
}

