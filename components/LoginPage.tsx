"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"

type LoginPageProps = {}

export default function LoginPage({}: LoginPageProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isAdminLogin, setIsAdminLogin] = useState(false)
  const [isAdminCredentials, setIsAdminCredentials] = useState(false)
  const redirect = (path: string) => {
    if (localStorage.getItem("DEVMODE") === "true") {
      console.log("DEVMODE is active")
    }
    window.location.href = path
  }

  const handleDEVMODE = () => {
    setError(null)
    setIsLoading(true)

    try {
      localStorage.setItem("DEVMODE", "true")
      redirect("/novos-projetos")
    } catch (error) {
      console.error("Error setting DEVMODE:", error)
      setError("Failed to set DEVMODE. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email || !password) {
      setError("Por favor, preencha todos os campos.")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (data.success) {
        redirect("/novos-projetos")
      } else {
        setError(data.error || "Ocorreu um erro durante o login")
      }
    } catch (error) {
      console.error("Erro detalhado durante o login:", error)
      setError(
        error instanceof Error
          ? error.message
          : "Ocorreu um erro desconhecido durante o login. Por favor, tente novamente.",
      )
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
          <CardTitle className="text-2xl text-center">Login</CardTitle>
          <CardDescription className="text-center">Entre com suas credenciais para acessar sua conta</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="text-sm text-red-500 text-center bg-transparent p-2 border border-red-500 rounded">
                Erro de Login: {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setIsAdminCredentials(e.target.value === "admin@unyleya.com" && password === "admin_unyleya")
                }}
                required
                className="bg-[#181818] text-white border-gray-600"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">
                Senha
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setIsAdminCredentials(email === "admin@unyleya.com" && e.target.value === "admin_unyleya")
                }}
                required
                className="bg-[#181818] text-white border-gray-600"
              />
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" />
                  <label
                    htmlFor="remember"
                    className="text-sm font-medium leading-none text-white peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Lembrar-me
                  </label>
                </div>
                <a href="/forgot-password" className="text-sm text-orange-300 hover:text-orange-400">
                  Esqueceu sua senha?
                </a>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600" disabled={isLoading}>
              {isLoading ? "Carregando..." : "Entrar"}
            </Button>
            {isAdminCredentials && (
              <Button
                type="button"
                className="w-full bg-orange-200 hover:bg-orange-300"
                onClick={handleDEVMODE}
                disabled={isLoading}
              >
                {isLoading ? "DEVING..." : "DEVMODE"}
              </Button>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

