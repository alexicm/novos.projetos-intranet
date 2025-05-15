"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

export default function CoordinatorCoursePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background"
    >
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-500 to-pink-600 shadow-lg p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Button
            onClick={() => router.push("/novos-projetos")}
            className="bg-white text-orange-500 hover:bg-orange-100"
          >
            Voltar
          </Button>
          <div className="flex items-center">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/uny_logo-pEYx6pRnSznZKeclaZApEzV7ztgHVq.png"
              alt="Unyleya Logo"
              width={40}
              height={40}
              className="rounded-full bg-white p-1"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-center text-orange-500 mb-8">Meus Cursos</h1>
        <div className="grid gap-6">
          <p className="text-center text-gray-500">Em desenvolvimento...</p>
        </div>
      </main>
    </motion.div>
  )
}
