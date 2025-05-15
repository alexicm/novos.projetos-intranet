"use client"

import React, { useState, useEffect, useCallback, useMemo, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import ZoomControls from "./ZoomControls"

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
  const expandedContentRef = useRef<HTMLDivElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  const handleExpand = useCallback(() => {
    setIsExpanded(true)
  }, [])

  const handleClose = useCallback(() => {
    setIsExpanded(false)
  }, [])

  const handleZoomIn = useCallback(() => {
    setFontSize((prevSize) => Math.min(prevSize + 2, 32))
  }, [])

  const handleZoomOut = useCallback(() => {
    setFontSize((prevSize) => Math.max(prevSize - 2, 12))
  }, [])

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        handleClose()
      }
    },
    [handleClose],
  )

  const tableFontSizeStyle = useMemo(() => ({ fontSize: `${fontSize}px` }), [fontSize])

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose()
      }
    }

    if (isExpanded) {
      document.addEventListener("keydown", handleEscKey)
      document.addEventListener("mousedown", handleClickOutside)
      document.body.style.overflow = "hidden"
      if (expandedContentRef.current) {
        expandedContentRef.current.focus()
      }
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey)
      document.removeEventListener("mousedown", handleClickOutside)
      document.body.style.overflow = "auto"
    }
  }, [isExpanded, handleClose, handleClickOutside])

  useEffect(() => {
    const sectionTables = document.querySelectorAll(".expandable-section table")
    sectionTables.forEach((table) => {
      ;(table as HTMLElement).style.fontSize = `${fontSize}px`
    })
  }, [fontSize])

  return (
    <div className={cn("expandable-section", className)} aria-expanded={isExpanded}>
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl sm:text-2xl font-bold text-orange-500">{title}</h2>
        <div className="flex items-center space-x-2">
          {showZoomControls && <ZoomControls onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} />}
          <button
            onClick={handleExpand}
            className="text-gray-500 hover:text-gray-700 transition-colors flex items-center focus:outline-none focus:ring-2 focus:ring-orange-500 rounded-md px-2 py-1"
            aria-label={isExpanded ? `Recolher a seção ${title}` : `Expandir a seção ${title}`}
          >
            <span className="hidden sm:inline">{isExpanded ? "Recolher" : "Expandir"}</span>
            <ChevronDown className={cn("ml-1 transform transition-transform", isExpanded ? "rotate-180" : "")} />
          </button>
        </div>
      </div>
      <AnimatePresence>
        {isExpanded ? (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="min-h-screen px-4 py-8 flex items-center justify-center">
              <motion.div
                ref={modalRef}
                className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-3xl mx-auto"
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                style={tableFontSizeStyle}
              >
                <div
                  ref={expandedContentRef}
                  tabIndex={-1}
                  className="focus:outline-none"
                  role="dialog"
                  aria-labelledby={`${title}-dialog-title`}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h2 id={`${title}-dialog-title`} className="text-xl sm:text-2xl font-bold text-orange-500">
                      {title}
                    </h2>
                    <button
                      onClick={handleClose}
                      className="text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      aria-label={`Fechar a seção ${title}`}
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                  <div className="overflow-y-auto max-h-[calc(100vh-12rem)]">{children}</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <div style={tableFontSizeStyle}>{children}</div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default React.memo(ExpandableSection)
