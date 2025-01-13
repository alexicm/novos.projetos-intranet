"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from '@/styles/Auth.module.css'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [step, setStep] = useState(1)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simular a verificação do e-mail (substitua por uma chamada real à API)
    if (email) {
      setStep(2)
      setError('')
    } else {
      setError('Por favor, insira um e-mail válido.')
    }
  }

  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem.')
      return
    }
    // Simular a atualização da senha (substitua por uma chamada real à API)
    console.log('Nova senha definida:', newPassword)
    router.push('/')
  }

  const stepVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 50 }
  }

  return (
    <section className={styles.section}>
      <motion.div 
        className={styles.loginBox}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Image
          src="https://cdn-static-mkt.unyleya.com.br/unyleyaNew/logo_uny_branca_min.webp"
          alt="Unyleya Logo"
          width={200}
          height={60}
          className={styles.logo}
        />
        <h2>Recuperação de Senha</h2>
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.form 
              key="email-form"
              variants={stepVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onSubmit={handleEmailSubmit}
            >
              <div className={styles.inputBox}>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <label>E-mail</label>
              </div>
              {error && <p className={styles.errorMessage}>{error}</p>}
              <button type="submit">Verificar E-mail</button>
            </motion.form>
          )}
          {step === 2 && (
            <motion.form 
              key="password-form"
              variants={stepVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onSubmit={handlePasswordReset}
            >
              <div className={styles.inputBox}>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <label>Nova Senha</label>
              </div>
              <div className={styles.inputBox}>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <label>Confirmar Nova Senha</label>
              </div>
              {error && <p className={styles.errorMessage}>{error}</p>}
              <button type="submit">Redefinir Senha</button>
            </motion.form>
          )}
        </AnimatePresence>
        <div className={styles.loginLink}>
          <p>Lembrou sua senha? <a href="#" onClick={() => router.push('/')}>Faça login</a></p>
        </div>
      </motion.div>
    </section>
  )
}

