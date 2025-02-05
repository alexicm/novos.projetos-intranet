import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ZoomIn, ZoomOut } from "lucide-react"

interface ExpandableSectionProps {
  children: React.ReactNode
  className?: string
  title: string
  showZoomControls?: boolean
}

const ExpandableSection: React.FC<ExpandableSectionProps> = ({
  children,
  className,
  title,
  showZoomControls = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [fontSize, setFontSize] = useState(16)

  const handleDoubleClick = () => {
    setIsExpanded(!isExpanded)
  }

  const handleClose = () => {
    setIsExpanded(false)
  }

  const handleZoomIn = () => {
    setFontSize((prevSize) => Math.min(prevSize + 2, 32))
  }

  const handleZoomOut = () => {
    setFontSize((prevSize) => Math.max(prevSize - 2, 12))
  }

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsExpanded(false)
      }
    }

    if (isExpanded) {
      document.addEventListener("keydown", handleEscKey)
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey)
    }
  }, [isExpanded])

  useEffect(() => {
    const updateTableFontSize = () => {
      const tables = document.querySelectorAll("table")
      tables.forEach((table) => {
        table.style.fontSize = `${fontSize}px`
      })
    }

    updateTableFontSize()
  }, [fontSize])

  return (
    <div className={`${className}`}>
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-bold text-orange-500">{title}</h2>
        {showZoomControls && (
          <div className="flex space-x-2">
            <button
              onClick={handleZoomOut}
              className="p-1 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
              aria-label="Decrease font size"
            >
              <ZoomOut className="h-4 w-4 text-gray-600" />
            </button>
            <button
              onClick={handleZoomIn}
              className="p-1 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
              aria-label="Increase font size"
            >
              <ZoomIn className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        )}
      </div>
      <AnimatePresence>
        {isExpanded ? (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              style={{ fontSize: `${fontSize}px` }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-orange-500">{title}</h2>
                <button
                  onClick={handleClose}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                  aria-label="Close"
                >
                  <X size={24} />
                </button>
              </div>
              <div>{children}</div>
            </motion.div>
          </motion.div>
        ) : (
          <div onDoubleClick={handleDoubleClick} style={{ fontSize: `${fontSize}px` }}>
            {children}
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ExpandableSection

