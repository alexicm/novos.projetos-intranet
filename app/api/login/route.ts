import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabaseClient"
import { cookies } from "next/headers"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const { email, password } = body

    if (!email || !password) {
      console.log("Missing email or password")
      return NextResponse.json(
        { success: false, error: "LOGIN_ERROR: Email and password are required" },
        { status: 400 },
      )
    }

    console.log("Login attempt for email:", email)

    const { data: users, error: fetchError } = await supabase
      .from("users")
      .select("id, nome, email, password, permissao")
      .eq("email", email)
      .limit(1)

    if (fetchError) {
      console.error("Error fetching user:", fetchError)
      return NextResponse.json(
        { success: false, error: `LOGIN_ERROR: Database error - ${fetchError.message}` },
        { status: 500 },
      )
    }

    if (!users || users.length === 0) {
      console.log("User not found")
      return NextResponse.json({ success: false, error: "LOGIN_ERROR: User not found" }, { status: 401 })
    }

    const user = users[0]

    if (typeof user.password !== "string") {
      console.error("Invalid password format in database")
      return NextResponse.json({ success: false, error: "LOGIN_ERROR: Invalid password format" }, { status: 500 })
    }

    // Simple password check (replace with proper hashing in production)
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      console.log("Invalid credentials")
      return NextResponse.json({ success: false, error: "LOGIN_ERROR: Invalid credentials" }, { status: 401 })
    }

    const sessionToken = Buffer.from(`${user.id}:${user.email}:${Date.now()}`).toString("base64")

    cookies().set("supabase-auth-token", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 60, // 30 minutes
    })

    console.log("Login response:", {
      success: true,
      user: { id: user.id, email: user.email, permissao: user.permissao },
    })
    console.log("Login successful for user:", user.email)
    return NextResponse.json(
      {
        success: true,
        user: { id: user.id, email: user.email, permissao: user.permissao },
        error: null,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Unexpected error in login route:", error)
    return NextResponse.json(
      {
        success: false,
        error: `LOGIN_ERROR: Unexpected error - ${error instanceof Error ? error.message : JSON.stringify(error)}`,
      },
      { status: 500 },
    )
  }
}

