import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabaseClient"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const { nome, email, password } = await request.json()

    if (!nome || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Check if user already exists
    const { data: existingUser } = await supabase.from("users").select("id").eq("email", email).limit(1)

    if (existingUser && existingUser.length > 0) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 })
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Insert the new user with permissao set to 2
    const { data, error } = await supabase
      .from("users")
      .insert([{ nome, email, password: hashedPassword, permissao: 2 }])
      .select()

    if (error) {
      console.error("Error creating user:", error)
      return NextResponse.json({ error: "An error occurred while creating the user" }, { status: 500 })
    }

    return NextResponse.json({ success: true, user: { id: data[0].id, email: data[0].email } }, { status: 201 })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Erro inesperado" }, { status: 500 })
  }
}

