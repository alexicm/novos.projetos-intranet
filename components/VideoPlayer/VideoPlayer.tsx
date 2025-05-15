"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Loader2, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface VideoPlayerProps {
  videoUrl: string
  className?: string
}

export default function VideoPlayer({ videoUrl, className }: VideoPlayerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleLoadedData = useCallback(() => {
    setIsLoading(false)
    setError(null)
  }, [])

  const handleError = useCallback(() => {
    setError("Erro ao carregar o vídeo")
    setIsLoading(false)
  }, [])

  useEffect(() => {
    setIsLoading(true)
    setError(null)

    return () => {
      if (videoRef.current) {
        videoRef.current.pause()
        videoRef.current.src = ""
        videoRef.current.load()
      }
    }
  }, [videoUrl])

  return (
    <div
      className={cn(
        "relative w-full max-w-3xl mx-auto",
        "bg-gray-100 dark:bg-gray-800",
        "rounded-lg overflow-hidden",
        "shadow-md",
        className,
      )}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
          <span className="sr-only">Carregando vídeo...</span>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-50 dark:bg-red-900/20">
          <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
          <p className="text-red-600 dark:text-red-400 text-sm sm:text-base text-center px-4">{error}</p>
        </div>
      )}

      <video
        ref={videoRef}
        controls
        className={cn("w-full h-auto", "max-h-[70vh]", "bg-black", isLoading || error ? "invisible" : "visible")}
        onLoadedData={handleLoadedData}
        onError={handleError}
        playsInline
      >
        <source src={videoUrl} type="video/mp4" />
        <track kind="captions" />
        <p className="text-center p-4 bg-gray-100 dark:bg-gray-800">
          Seu navegador não suporta a reprodução de vídeos.
        </p>
      </video>
    </div>
  )
}
