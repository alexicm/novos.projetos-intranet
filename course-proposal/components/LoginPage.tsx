"use client"

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import styles from '@/styles/Auth.module.css'

interface LoginPageProps {
  onLogin: () => void
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email || !password) {
      setError('Por favor, preencha todos os campos.')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'An error occurred during login')
      }

      console.log('Login bem-sucedido:', data.user)

      onLogin()
      router.push('https://novos-projetos-intranet.vercel.app/')
    } catch (error) {
      console.error('Erro detalhado durante o login:', error)
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('Ocorreu um erro desconhecido durante o login. Por favor, tente novamente.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className={styles.section}>
      <div className={styles.loginBox}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.logoContainer}>
            <Image
              src="https://cdn-static-mkt.unyleya.com.br/unyleyaNew/logo_uny_branca_min.webp"
              alt="Unyleya Logo"
              width={200}
              height={60}
              className={styles.logo}
              priority
            />
          </div>
          <h2>Login</h2>
          {error && <p className={styles.errorMessage}>{error}</p>}
          <div className={styles.inputBox}>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label>Email</label>
          </div>
          <div className={styles.inputBox}>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label>Senha</label>
          </div>
          <div className={styles.rememberMe}>
            <label>
              <input type="checkbox" />
              <span>Lembrar-me</span>
            </label>
          </div>
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Carregando...' : 'ENTRAR'}
          </button>
        </form>
      </div>
    </section>
  )
}

