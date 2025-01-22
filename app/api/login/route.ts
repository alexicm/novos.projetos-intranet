import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabaseClient"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    console.log("Login attempt for email:", email)

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const { data: users, error } = await supabase
      .from('users')
      .select('nome, email, password')
      .eq("email", email)
      .limit(1)

    if (!users) {
      console.error("Usuário inválido")
      return NextResponse.json({ error: "Invalid email or password"}, { status: 401})
    }

    const user = users[0];

    if (error) {
      console.error("Error:", error);
    } else {
      console.log("Users: ", user.nonme); // Pretty print the JSON
    }

    if (user.password !== password) {
      console.error("Credenciais inválidas");
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    if (user.email !== email) {
      console.error("Credenciais inválidas");
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    return NextResponse.json(
      {
        success: true,
        user: { id: user.id, email: user.email },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Erro inesperado" }, { status: 500 })
  }
}

