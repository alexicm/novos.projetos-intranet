import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabaseClient"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const { email, confirmationCode, newPassword } = await request.json()

    console.log("Received request for email:", email)

    const { data: users, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .eq("reset_code", confirmationCode)
      .limit(1)

    if (fetchError) {
      console.error("Error fetching user:", fetchError)
      return NextResponse.json({ error: "Erro ao buscar usuário no banco de dados." }, { status: 500 })
    }

    if (!users || users.length === 0) {
      return NextResponse.json({ error: "Código de confirmação inválido ou expirado." }, { status: 400 })
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(newPassword, salt)

    const { error: updateError } = await supabase
      .from("users")
      .update({
        password: hashedPassword,
        reset_code: null, // Clear the reset code after successful password change
      })
      .eq("email", email)

    if (updateError) {
      console.error("Error updating password:", updateError)
      return NextResponse.json({ error: "Erro ao atualizar a senha." }, { status: 500 })
    }

    return NextResponse.json({ message: "Senha atualizada com sucesso." })
  } catch (error) {
    console.error("Unexpected error in POST:", error)
    return NextResponse.json({ error: "Erro inesperado ao processar a solicitação." }, { status: 500 })
  }
}

