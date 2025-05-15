"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from "lucide-react"

interface User {
  id: string
  nome: string
  email: string
  permissao: number
}

interface ManageUsersModalProps {
  onClose: () => void
}

export default function ManageUsersModal({ onClose }: ManageUsersModalProps) {
  const [users, setUsers] = useState<User[]>([])
  const [error, setError] = useState<string | null>(null)
  const [activeUser, setActiveUser] = useState<string | null>(null)
  const [editingUser, setEditingUser] = useState<User | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users")
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      } else {
        setError("Failed to fetch users")
      }
    } catch (error) {
      setError("An unexpected error occurred")
    }
  }

  const handleDeleteUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/users/${userId}`, { method: "DELETE" })
      if (response.ok) {
        setUsers(users.filter((user) => user.id !== userId))
      } else {
        setError("Failed to delete user")
      }
    } catch (error) {
      setError("An unexpected error occurred")
    }
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setActiveUser(null)
  }

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingUser) return

    try {
      const response = await fetch(`/api/users/${editingUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingUser),
      })
      if (response.ok) {
        setUsers(users.map((user) => (user.id === editingUser.id ? editingUser : user)))
        setEditingUser(null)
      } else {
        setError("Failed to update user")
      }
    } catch (error) {
      setError("An unexpected error occurred")
    }
  }

  const getPermissionText = (permissao: number) => {
    switch (permissao) {
      case 0:
        return "Coordenador"
      case 1:
        return "Membro"
      case 2:
        return "Admin"
      default:
        return "Desconhecido"
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-white p-8 rounded-lg max-w-4xl w-full h-3/4 overflow-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-2 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-4">Gerenciar Usuários</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {editingUser ? (
          <form onSubmit={handleUpdateUser} className="space-y-4">
            <div>
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                value={editingUser.nome}
                onChange={(e) => setEditingUser({ ...editingUser, nome: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={editingUser.email}
                onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="permissao">Permissão</Label>
              <Select
                value={editingUser.permissao.toString()}
                onValueChange={(value) => setEditingUser({ ...editingUser, permissao: Number.parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a permissão" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Coordenador</SelectItem>
                  <SelectItem value="1">Membro</SelectItem>
                  <SelectItem value="2">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" onClick={() => setEditingUser(null)}>
                Cancelar
              </Button>
              <Button type="submit">Salvar</Button>
            </div>
          </form>
        ) : (
          <div>
            {users.map((user) => (
              <div key={user.id} className="bg-white shadow-md rounded-lg p-4 mb-4 flex justify-between items-center">
                <div>
                  <h3 className="font-bold">{user.nome}</h3>
                  <p className="text-gray-600">{user.email}</p>
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {getPermissionText(user.permissao)}
                  </span>
                </div>
                <div className="relative">
                  <Button
                    onClick={() => setActiveUser(activeUser === user.id ? null : user.id)}
                    className="p-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </Button>
                  {activeUser === user.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                      <Button
                        onClick={() => {
                          if (window.confirm("Tem certeza que deseja deletar este usuário?")) {
                            handleDeleteUser(user.id)
                          }
                        }}
                        className="block px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 w-full text-left rounded-t-md transition-colors duration-200"
                      >
                        Deletar
                      </Button>
                      <Button
                        onClick={() => handleEditUser(user)}
                        className="block px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 w-full text-left rounded-b-md transition-colors duration-200"
                      >
                        Editar
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
