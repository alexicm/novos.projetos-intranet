import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-400 to-pink-600 p-4 text-center">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">404 - Página não encontrada</h1>
      <p className="text-xl text-white mb-8">Desculpe, a página que você está procurando não existe ou foi movida.</p>
      <Link
        href="/"
        className="px-8 py-4 bg-white text-orange-500 rounded-full text-xl font-bold shadow-lg hover:bg-orange-100 transition duration-300"
      >
        Voltar para a página inicial
      </Link>
    </div>
  )
}
