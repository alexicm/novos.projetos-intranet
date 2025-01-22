"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import LoginPage from "@/components/LoginPage"

export default function LoginRoute() {
  const router = useRouter()

  const handleLogin = () => {
    router.push("/novos-projetos")
  }

  return <LoginPage onLogin={handleLogin} />
}

