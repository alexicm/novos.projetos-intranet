import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case "aprovado":
      return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
    case "reprovado":
      return "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
    case "stand by":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
  }
}
