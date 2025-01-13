"use client"

import { useState } from "react"
import LoginPage from "@/components/LoginPage"
import LandingPage from "@/components/LandingPage"

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleLogin = () => {
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
  }

  return (
    <>
      {!isLoggedIn ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
        <LandingPage onLogout={handleLogout} />
      )}
    </>
  )
}

