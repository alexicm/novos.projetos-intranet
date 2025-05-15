"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  onLogout?: () => void
  showAdminControls?: boolean
  onAddUser?: () => void
  onManageUsers?: () => void
}

export default function Header({ onLogout, showAdminControls, onAddUser, onManageUsers }: HeaderProps) {
  const router = useRouter()

  return (
    <header className="fixed top-0 left-0 right-0 bg-gradient-to-r from-orange-500 to-pink-600 shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            {showAdminControls && (
              <>
                <Button
                  onClick={onAddUser}
                  className="bg-white text-orange-500 hover:bg-orange-100 transition duration-300"
                  size="sm"
                >
                  Adicionar usuário
                </Button>
                <Button
                  onClick={onManageUsers}
                  className="bg-white text-pink-600 hover:bg-pink-100 transition duration-300"
                  size="sm"
                >
                  Gerenciar usuários
                </Button>
              </>
            )}
          </div>

          <div className="flex-shrink-0 cursor-pointer" onClick={() => router.push("/novos-projetos")}>
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/uny_logo-pEYx6pRnSznZKeclaZApEzV7ztgHVq.png"
              alt="Unyleya Logo"
              width={40}
              height={40}
              className="rounded-full bg-white p-1"
              priority
            />
          </div>

          <Button
            onClick={onLogout}
            variant="outline"
            size="sm"
            className="text-white border-white hover:bg-white hover:text-orange-500"
          >
            Sair
          </Button>
        </div>
      </div>
    </header>
  )
}
