"use client"

import { useEffect } from "react"
import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-400 to-pink-600 p-4 text-center">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Algo deu errado!</h1>
      <p className="text-xl text-white mb-8">Desculpe, ocorreu um erro ao processar sua solicitação.</p>
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={reset}
          className="px-8 py-4 bg-white text-orange-500 rounded-full text-xl font-bold shadow-lg hover:bg-orange-100 transition duration-300"
        >
          Tentar novamente
        </button>
        <Link
          href="/"
          className="px-8 py-4 bg-white text-orange-500 rounded-full text-xl font-bold shadow-lg hover:bg-orange-100 transition duration-300"
        >
          Voltar para a página inicial
        </Link>
      </div>
    </div>
  )
}
