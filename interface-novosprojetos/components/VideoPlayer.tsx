"'use client'"

import { useState, useEffect } from "'react'"
import styles from "'./VideoPlayer.module.css'"

interface VideoPlayerProps {
  videoUrl: string
}

export default function VideoPlayer({ videoUrl }: VideoPlayerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setIsLoading(true);
    setError(null);
  }, [videoUrl]);

  const handleVideoLoad = () => {
    setIsLoading(false)
  }

  const handleError = () => {
    setError("'Erro ao carregar o vídeo'")
    setIsLoading(false)
  }

  return (
    <div className={styles.videoContainer}>
      {isLoading && (
        <div className={styles.loading}>
          Carregando vídeo...
        </div>
      )}
      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}
      <video
        key={videoUrl}
        controls
        className={styles.videoPlayer}
        onLoadedData={handleVideoLoad}
        onError={handleError}
      >
        <source src={videoUrl} type="video/mp4" />
        Seu navegador não suporta a reprodução de vídeos.
      </video>
    </div>
  )
}

