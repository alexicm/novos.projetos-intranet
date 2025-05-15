"use client"

import { useDebug } from "@/contexts/DebugContext"
import { Bug } from "lucide-react"

export default function DebugToggle() {
  const { isDebugMode, toggleDebugMode } = useDebug()

  return (
    <button
      onClick={toggleDebugMode}
      className={`fixed bottom-4 left-4 z-50 p-2 rounded-full shadow-lg transition-colors ${
        isDebugMode ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700"
      }`}
      title={isDebugMode ? "Disable Debug Mode" : "Enable Debug Mode"}
    >
      <Bug size={20} />
    </button>
  )
}
