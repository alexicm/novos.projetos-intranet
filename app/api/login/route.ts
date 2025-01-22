import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabaseClient"
import { cookies } from "next/headers"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    console.log("Login attempt for email:", email)

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const { data: users, error } = await supabase
      .from("users")
      .select("id, nome, email, password")
      .eq("email", email)
      .limit(1)

    if (!users || users.length === 0) {
      console.error("Usuário inválido")
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    const user = users[0]

    if (error) {
      console.error("Error:", error)
      return NextResponse.json({ error: "An error occurred during login" }, { status: 500 })
    }

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      console.error("Credenciais inválidas")
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Create a session token (simple hash of user data + timestamp)
    const sessionToken = Buffer.from(`${user.id}:${user.email}:${Date.now()}`).toString("base64")

    // Set the cookie
    cookies().set("supabase-auth-token", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 30, // 30 minutos
    })

    return NextResponse.json(
      {
        success: true,
        user: { id: user.id, email: user.email },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Erro inesperado" }, { status: 500 })
  }
}

