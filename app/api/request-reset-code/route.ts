import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import { sendConfirmationEmail } from '@/lib/emailUtils'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    console.log('Received request for email:', email)

    // Check if user exists with the given email
    const { data: users, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .limit(1)

    if (fetchError) {
      console.error('Error fetching user:', fetchError)
      return NextResponse.json({ error: `Error fetching user: ${fetchError.message}` }, { status: 500 })
    }

    if (!users || users.length === 0) {
      console.log('User not found for email:', email)
      return NextResponse.json({ error: 'Usuário não encontrado com o e-mail fornecido.' }, { status: 404 })
    }

    console.log('User found:', users[0].id)

    // Generate a random 6-digit confirmation code
    const confirmationCode = Math.floor(100000 + Math.random() * 900000).toString()

    console.log('Generated confirmation code:', confirmationCode)

    // Store the confirmation code in the database
    const { error: updateError } = await supabase
      .from('users')
      .update({ reset_code: confirmationCode })
      .eq('email', email)

    if (updateError) {
      console.error('Error updating user with reset code:', updateError)
      return NextResponse.json({ error: `Error updating user: ${updateError.message}` }, { status: 500 })
    }

    console.log('User updated with reset code')

    // Send the confirmation code via email
    try {
      await sendConfirmationEmail(email, confirmationCode)
      console.log('Confirmation email sent successfully')
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError)
      return NextResponse.json({ error: `Error sending confirmation email: ${emailError instanceof Error ? emailError.message : 'Unknown error'}` }, { status: 500 })
    }

    return NextResponse.json({ message: 'Código de confirmação enviado com sucesso.' })
  } catch (error) {
    console.error('Detailed error in request-reset-code:', error)
    
    let errorMessage = 'Ocorreu um erro ao enviar o código de confirmação.'
    if (error instanceof Error) {
      errorMessage += ` Detalhes: ${error.message}`
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

