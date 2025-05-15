import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabaseClient"

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  try {
    const { error } = await supabase.from("users").delete().eq("id", id)

    if (error) throw error

    return NextResponse.json({ message: "User deleted successfully" })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const id = params.id
  const updatedData = await request.json()

  try {
    const { error } = await supabase.from("users").update(updatedData).eq("id", id)

    if (error) throw error

    return NextResponse.json({ message: "User updated successfully" })
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}
