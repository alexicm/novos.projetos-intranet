"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

type LandingPageProps = {}

const LandingPage: React.FC<LandingPageProps> = ({}) => {
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const response = await fetch("/api/check-auth")
      if (!response.ok) {
        router.push("/login")
      }
    }
    checkAuth()
  }, [router])

  const handleExploreClick = () => {
    router.push("/course-proposal")
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" })
      router.push("/login")
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  useEffect(() => {
    // Monitor page visibility changes
    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleLogout()
      }
    }

    // Monitor tab/window close
    const handleBeforeUnload = () => {
      handleLogout()
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 to-pink-600 flex flex-col justify-center items-center p-4">
      <div className="absolute top-4 right-8">
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-white text-orange-500 rounded-full text-sm font-semibold hover:bg-orange-100 transition duration-300"
        >
          Sair
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <div className="bg-white p-2 rounded-full shadow-md inline-block mb-8">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/uny_logo-pEYx6pRnSznZKeclaZApEzV7ztgHVq.png"
            alt="Unyleya Logo"
            width={100}
            height={100}
            className="rounded-full"
          />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Gestão de Projetos Unyleya</h1>
        <h2 className="text-2xl md:text-4xl font-semibold text-white mb-8">Novos Projetos</h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="bg-white rounded-lg shadow-2xl p-8 max-w-2xl w-full"
      >
        <h3 className="text-3xl font-bold text-gray-800 mb-6 text-center">Bem-vindo à Interface de Apresentação</h3>
        <p className="text-xl text-gray-600 mb-8 text-center">
          Explore o futuro da educação com nossas propostas inovadoras de cursos.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FeatureCard
            icon="📚"
            title="Comitê Unyleya"
            description="Veja as propostas de cursos para o próximo comitê"
            onClick={handleExploreClick}
          />
          <FeatureCard
            icon="🌟"
            title="Excelência Acadêmica"
            description="Aprenda com os melhores especialistas e pesquisadores em suas áreas."
          />
          <FeatureCard
            icon="🚀"
            title="Desenvolvimento de Carreira"
            description="Impulsione sua carreira com cursos alinhados às demandas da indústria."
          />
          <FeatureCard
            icon="🌐"
            title="Aprendizado Flexível"
            description="Estude no seu ritmo com nossa plataforma de ensino adaptativa."
          />
        </div>
      </motion.div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="mt-12 px-8 py-4 bg-white text-orange-500 rounded-full text-xl font-bold shadow-lg hover:bg-orange-100 transition duration-300"
        onClick={handleExploreClick}
      >
        Explorar Propostas
      </motion.button>
    </div>
  )
}

const FeatureCard = ({
  icon,
  title,
  description,
  onClick,
}: {
  icon: string
  title: string
  description: string
  onClick?: () => void
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-orange-50 rounded-lg p-6 shadow-md cursor-pointer"
      onClick={onClick}
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h4 className="text-xl font-semibold text-gray-800 mb-2">{title}</h4>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  )
}

export default LandingPage

