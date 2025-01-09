"'use client'"

import { useState } from "'react'"
import Image from "'next/image'"
import styles from "'@/styles/Home.module.css'"

interface PerformanceImageProps {
  imageUrl: string
}

export default function PerformanceImage({ imageUrl }: PerformanceImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleImageLoad = () => {
    setIsLoading(false)
  }

  const handleError = () => {
    setError("'Erro ao carregar a imagem de performance'")
    setIsLoading(false)
  }

  const handleDoubleClick = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={styles.performanceImageContainer}>
      {isLoading && (
        <div className={styles.loading}>
          Carregando imagem de performance...
        </div>
      )}
      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}
      <Image
        src={imageUrl}
        alt="Performance do curso"
        width={1600}
        height={900}
        layout="responsive"
        objectFit="contain"
        style={{ maxHeight: "'70vh'", width: "'100%'" }}
        onLoad={handleImageLoad}
        onError={handleError}
        onClick={() => setIsFullscreen(true)}
      />

      {isFullscreen && (
        <div 
          className={styles.fullscreenOverlay}
          onClick={() => setIsFullscreen(false)}
        >
          <Image
            src={imageUrl}
            alt="Performance do curso (fullscreen)"
            layout="fill"
            objectFit="contain"
          />
        </div>
      )}
    </div>
  )
}

