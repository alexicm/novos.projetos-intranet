"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import Image from "next/image"
import { Loader2, AlertCircle, ZoomIn, ZoomOut, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface PerformanceImageProps {
  imageUrl: string
  className?: string
}

export default function PerformanceImage({ imageUrl, className }: PerformanceImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [scale, setScale] = useState(1)
  const imageRef = useRef<HTMLDivElement>(null)

  const handleImageLoad = useCallback(() => {
    setIsLoading(false)
    setError(null)
  }, [])

  const handleError = useCallback(() => {
    setError("Erro ao carregar a imagem de performance")
    setIsLoading(false)
  }, [])

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev)
    setScale(1)
  }, [])

  const handleZoomIn = useCallback(() => {
    setScale((prev) => Math.min(prev + 0.25, 3))
  }, [])

  const handleZoomOut = useCallback(() => {
    setScale((prev) => Math.max(prev - 0.25, 0.5))
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isFullscreen) {
        if (e.key === "Escape") {
          toggleFullscreen()
        } else if (e.key === "+" || e.key === "=") {
          handleZoomIn()
        } else if (e.key === "-") {
          handleZoomOut()
        }
      }
    }

    if (isFullscreen) {
      document.addEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "auto"
    }
  }, [isFullscreen, toggleFullscreen, handleZoomIn, handleZoomOut])

  return (
    <div className={cn("relative", className)} ref={imageRef}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
          <span className="sr-only">Carregando imagem...</span>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-50 dark:bg-red-900/20 rounded-lg">
          <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
          <p className="text-red-600 dark:text-red-400 text-sm sm:text-base text-center px-4">{error}</p>
        </div>
      )}

      <div
        className={cn(
          "relative rounded-lg overflow-hidden",
          "cursor-zoom-in",
          isLoading || error ? "invisible" : "visible",
        )}
      >
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt="Performance do curso"
          width={1600}
          height={900}
          className="w-full h-auto object-contain"
          onClick={toggleFullscreen}
          onLoad={handleImageLoad}
          onError={handleError}
          priority
        />
      </div>

      {isFullscreen && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center"
          onClick={toggleFullscreen}
        >
          <div className="absolute top-4 right-4 flex items-center space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleZoomOut()
              }}
              className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
              aria-label="Diminuir zoom"
            >
              <ZoomOut className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleZoomIn()
              }}
              className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
              aria-label="Aumentar zoom"
            >
              <ZoomIn className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={toggleFullscreen}
              className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
              aria-label="Fechar visualização em tela cheia"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          <div className="relative w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt="Performance do curso (tela cheia)"
              width={1920}
              height={1080}
              className={cn("max-w-none", "transition-transform duration-200", "cursor-zoom-out")}
              style={{
                transform: `scale(${scale})`,
                maxHeight: "90vh",
                maxWidth: "90vw",
                objectFit: "contain",
              }}
              onClick={toggleFullscreen}
              priority
            />
          </div>
        </div>
      )}
    </div>
  )
}
