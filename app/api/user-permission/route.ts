import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { supabase } from "@/lib/supabaseClient"

export async function GET(request: Request) {
  const cookieStore = cookies()
  const authToken = cookieStore.get("supabase-auth-token")
  const devMode = cookieStore.get("DEVMODE")

  if (devMode && devMode.value === "true") {
    return NextResponse.json({ permission: 2 })
  }

  if (!authToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  try {
    const [userId] = authToken.value.split(":")
    const { data: user, error } = await supabase.from("users").select("permissao").eq("id", userId).single()

    if (error) {
      throw error
    }

    return NextResponse.json({ permission: user.permissao })
  } catch (error) {
    console.error("Error fetching user permission:", error)
    return NextResponse.json({ error: "Error fetching user permission" }, { status: 500 })
  }
}

