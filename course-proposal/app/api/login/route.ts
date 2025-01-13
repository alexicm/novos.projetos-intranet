import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function POST(request: Request) {
  const { email, password } = await request.json()

  try {
    // Fetch all users
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
    console.log(users)

    if (error) throw error

    // Find the user with the matching email
    const user = users.find(u => u.email === email)

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // In a real application, you should use bcrypt to compare hashed passwords
    if (user.password !== password) {
      return NextResponse.json({ error: 'Incorrect password' }, { status: 401 })
    }

    return NextResponse.json({ success: true, user: { id: user.id, email: user.email } })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'An error occurred during login' }, { status: 500 })
  }
}

