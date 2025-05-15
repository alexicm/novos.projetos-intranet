"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export function Redirect({ to }: { to: string }) {
  const router = useRouter()

  useEffect(() => {
    router.replace(to)
  }, [router, to])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-400 to-pink-600">
      <div className="text-white text-center">
        <h1 className="text-2xl font-bold mb-4">Redirecionando...</h1>
        <div className="w-16 h-16 border-t-4 border-b-4 border-white rounded-full animate-spin mx-auto"></div>
      </div>
    </div>
  )
}
