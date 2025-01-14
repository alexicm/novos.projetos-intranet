"use client"

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [confirmationCode, setConfirmationCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)
  const router = useRouter()

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!email) {
      setError('Por favor, insira seu endereço de e-mail.')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/request-reset-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `Erro do servidor: ${response.status}`)
      }

      setSuccess('Código de confirmação enviado para o seu e-mail.')
      setStep(2)
    } catch (error) {
      console.error('Erro detalhado ao solicitar código de confirmação:', error)
      setError(error instanceof Error ? error.message : 'Ocorreu um erro ao enviar o código de confirmação. Por favor, tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!confirmationCode || !newPassword || !confirmPassword) {
      setError('Por favor, preencha todos os campos.')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem.')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, confirmationCode, newPassword }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Ocorreu um erro ao redefinir a senha.')
      }

      setSuccess('Senha redefinida com sucesso. Você será redirecionado para a página de login.')
      setTimeout(() => router.push('/'), 3000) // Redirect to login page after 3 seconds
    } catch (error) {
      console.error('Erro ao redefinir a senha:', error)
      setError(error instanceof Error ? error.message : 'Ocorreu um erro ao redefinir a senha. Por favor, tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-400 to-pink-600 p-4">
      <Card className="w-full max-w-md bg-[#181818] text-white">
        <CardHeader className="space-y-2">
          <div className="flex justify-center mb-4">
            <Image
              src="https://cdn-static-mkt.unyleya.com.br/unyleyaNew/logo_uny_branca_min.webp"
              alt="Unyleya Logo"
              width={200}
              height={60}
              priority
              className="h-12 w-auto"
            />
          </div>
          <CardTitle className="text-2xl text-center">Redefinir Senha</CardTitle>
          <CardDescription className="text-center text-gray-300">
            {step === 1 ? 'Insira seu e-mail para receber o código de confirmação' : 'Insira o código de confirmação e sua nova senha'}
          </CardDescription>
        </CardHeader>
        <form onSubmit={step === 1 ? handleRequestCode : handleResetPassword}>
          <CardContent className="space-y-4">
            {error && (
              <div className="text-sm text-red-500 text-center bg-transparent">
                {error}
              </div>
            )}
            {success && (
              <div className="text-sm text-green-500 text-center bg-transparent">
                {success}
              </div>
            )}
            {step === 1 ? (
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-[#181818] text-white border-gray-600"
                />
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="confirmationCode" className="text-white">Código de Confirmação</Label>
                  <Input
                    id="confirmationCode"
                    type="text"
                    value={confirmationCode}
                    onChange={(e) => setConfirmationCode(e.target.value)}
                    required
                    className="bg-[#181818] text-white border-gray-600"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-white">Nova Senha</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="bg-[#181818] text-white border-gray-600"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-white">Confirmar Nova Senha</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="bg-[#181818] text-white border-gray-600"
                  />
                </div>
              </>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full bg-orange-500 hover:bg-orange-600"
              disabled={isLoading}
            >
              {isLoading ? 'Processando...' : (step === 1 ? 'Enviar Código' : 'Redefinir Senha')}
            </Button>
            <Button 
              type="button" 
              variant="link" 
              className="text-orange-300 hover:text-orange-400"
              onClick={() => router.push('/')}
            >
              Voltar para o login
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

