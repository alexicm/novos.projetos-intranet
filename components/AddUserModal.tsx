import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from "lucide-react"

interface AddUserModalProps {
  onClose: () => void
}

export default function AddUserModal({ onClose }: AddUserModalProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [cpf, setCpf] = useState("")
  const [permission, setPermission] = useState<number | undefined>(undefined)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (!name || !email || !password || !cpf || permission === undefined) {
      setError("Por favor, preencha todos os campos.")
      return
    }

    const unformattedCpf = cpf.replace(/\D/g, "")

    try {
      const response = await fetch("/api/add-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, cpf: unformattedCpf, permission }),
      })

      const data = await response.json()

      if (response.ok || (data && data.success)) {
        setSuccess(true)
        setName("")
        setEmail("")
        setPassword("")
        setCpf("")
        setPermission(undefined)
      } else {
        setError(data.error || "Ocorreu um erro ao adicionar o usuário.")
      }
    } catch (error) {
      console.error("Erro ao adicionar usuário:", error)
      setError("Ocorreu um erro inesperado. Por favor, tente novamente.")
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white p-8 rounded-lg max-w-md w-full relative" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-2 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center">Adicionar Novo Usuário</h2>
        {success ? (
          <div className="text-green-600 mb-4 text-center">Usuário adicionado com sucesso!</div>
        ) : error ? (
          <div>
            <div className="text-red-600 mb-2 text-center">{error}</div>
            <div className="text-yellow-600 mb-4 text-center">
              Nota: O usuário pode ter sido criado mesmo com este erro. Por favor, verifique no sistema.
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nome</Label>
              <Input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                type="text"
                value={cpf}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "")
                  if (value.length <= 11) {
                    const formattedValue = value
                      .replace(/(\d{3})(\d)/, "$1.$2")
                      .replace(/(\d{3})(\d)/, "$1.$2")
                      .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
                    setCpf(formattedValue)
                  }
                }}
                maxLength={14}
                placeholder="xxx.xxx.xxx-xx"
                required
              />
            </div>
            <div>
              <Label htmlFor="permission">Nível de Permissão</Label>
              <Select onValueChange={(value) => setPermission(Number(value))} required>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o nível de permissão" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Coordenador</SelectItem>
                  <SelectItem value="1">Membro</SelectItem>
                  <SelectItem value="2">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">Adicionar Usuário</Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

