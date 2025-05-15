"use client"

import React, { useState, useCallback } from "react"
import { ZoomIn, ZoomOut } from "lucide-react"

interface ZoomableTextProps {
  children: React.ReactNode
  className?: string
}

const ZoomableText: React.FC<ZoomableTextProps> = ({ children, className }) => {
  const [fontSize, setFontSize] = useState(16)

  const handleZoomIn = useCallback(() => {
    setFontSize((prevSize) => Math.min(prevSize + 2, 32))
  }, [])

  const handleZoomOut = useCallback(() => {
    setFontSize((prevSize) => Math.max(prevSize - 2, 12))
  }, [])

  return (
    <div
      className={`${className} focus:outline-none focus:ring-2 focus:ring-blue-500`}
      tabIndex={0}
      role="region"
      aria-label="Texto com opção de zoom"
      style={{ fontSize: `${fontSize}px` }}
    >
      <div className="flex space-x-2 mb-2">
        <button
          onClick={handleZoomOut}
          aria-label="Diminuir tamanho do texto"
          className="p-1 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
        >
          <ZoomOut className="h-4 w-4" />
        </button>
        <button
          onClick={handleZoomIn}
          aria-label="Aumentar tamanho do texto"
          className="p-1 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
        >
          <ZoomIn className="h-4 w-4" />
        </button>
      </div>
      {children}
    </div>
  )
}

export default React.memo(ZoomableText)
