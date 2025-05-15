import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabaseClient"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  if (!supabase) {
    console.error("Supabase client is not initialized")
    return NextResponse.json({ error: "Database connection error" }, { status: 500 })
  }
  try {
    const { name, email, password, cpf, permission } = await request.json()

    if (!name || !email || !password || !cpf || permission === undefined) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Ensure CPF is exactly 11 digits
    const unformattedCpf = cpf.replace(/\D/g, "")
    if (unformattedCpf.length !== 11) {
      return NextResponse.json({ error: "CPF must be exactly 11 digits" }, { status: 400 })
    }

    // Check if user already exists
    const { data: existingUser } = await supabase.from("users").select("id").eq("email", email).limit(1)

    if (existingUser && existingUser.length > 0) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 })
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Insert the new user
    try {
      const { data, error } = await supabase
        .from("users")
        .insert([
          {
            nome: name,
            email,
            password: hashedPassword,
            cpf: unformattedCpf,
            permissao: permission,
          },
        ])
        .select()

      if (error) {
        console.error("Error creating user:", error)
        console.error("Full error object:", JSON.stringify(error, null, 2))
        return NextResponse.json(
          { error: "An error occurred while creating the user", details: error },
          { status: 500 },
        )
      }

      return NextResponse.json({ success: true, user: { id: data[0].id, email: data[0].email } }, { status: 201 })
    } catch (error) {
      console.error("Error creating user:", error)
      console.error("Full error object:", JSON.stringify(error, null, 2))
      return NextResponse.json({ error: "An error occurred while creating the user", details: error }, { status: 500 })
    }
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
