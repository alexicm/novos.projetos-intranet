import Link from "next/link"
import Image from "next/image"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-400 to-pink-600 p-4">
      <div className="bg-white p-4 rounded-full shadow-md mb-8">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/uny_logo-pEYx6pRnSznZKeclaZApEzV7ztgHVq.png"
          alt="Unyleya Logo"
          width={120}
          height={120}
          className="rounded-full"
        />
      </div>
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 text-center">Gestão de Projetos Unyleya</h1>
      <p className="text-xl text-white mb-8 text-center max-w-2xl">
        Bem-vindo à plataforma de gestão de projetos da Unyleya. Acesse nossos recursos para gerenciar propostas de
        cursos e mais.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/novos-projetos"
          className="px-8 py-4 bg-white text-orange-500 rounded-full text-xl font-bold shadow-lg hover:bg-orange-100 transition duration-300"
        >
          Novos Projetos
        </Link>
        <Link
          href="/course-proposal"
          className="px-8 py-4 bg-white text-orange-500 rounded-full text-xl font-bold shadow-lg hover:bg-orange-100 transition duration-300"
        >
          Propostas de Cursos
        </Link>
      </div>
    </div>
  )
}
