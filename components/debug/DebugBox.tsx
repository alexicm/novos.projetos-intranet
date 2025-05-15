"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useDebug } from "@/contexts/DebugContext"
import { X, Minimize2, Maximize2, Copy, Download } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function DebugBox() {
  const { isDebugMode, debugData, clearDebugData } = useDebug()
  const [isMinimized, setIsMinimized] = useState(false)
  const [position, setPosition] = useState({ x: 20, y: 20 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [activeTab, setActiveTab] = useState("all")

  // Handle keyboard shortcut to toggle debug box
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Shift+D to toggle debug mode
      if (e.ctrlKey && e.shiftKey && e.key === "D") {
        e.preventDefault()
        setIsMinimized((prev) => !prev)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  if (!isDebugMode) return null

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(debugData, null, 2))
  }

  const downloadDebugData = () => {
    const dataStr = JSON.stringify(debugData, null, 2)
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`
    const exportFileDefaultName = `debug-data-${new Date().toISOString()}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  // Get all unique categories from debug data
  const categories = Object.keys(debugData).reduce((acc: string[], key) => {
    const category = key.split(".")[0]
    if (!acc.includes(category)) {
      acc.push(category)
    }
    return acc
  }, [])

  // Filter data based on active tab
  const filteredData =
    activeTab === "all"
      ? debugData
      : Object.entries(debugData)
          .filter(([key]) => key.startsWith(activeTab))
          .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="fixed z-50"
        style={{ left: position.x, top: position.y }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          className="bg-gray-800 text-white rounded-lg shadow-lg overflow-hidden"
          style={{ width: isMinimized ? "auto" : "400px", maxHeight: "80vh" }}
        >
          {/* Header */}
          <div className="bg-gray-700 p-2 flex justify-between items-center cursor-move" onMouseDown={handleMouseDown}>
            <div className="font-semibold text-sm">Debug Console</div>
            <div className="flex items-center space-x-1">
              <button onClick={() => setIsMinimized(!isMinimized)} className="p-1 hover:bg-gray-600 rounded">
                {isMinimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
              </button>
              <button onClick={clearDebugData} className="p-1 hover:bg-gray-600 rounded" title="Clear debug data">
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Content */}
          {!isMinimized && (
            <>
              {/* Tabs */}
              <div className="flex overflow-x-auto bg-gray-700 border-t border-gray-600">
                <button
                  className={`px-3 py-1 text-xs ${activeTab === "all" ? "bg-gray-600" : "hover:bg-gray-600"}`}
                  onClick={() => setActiveTab("all")}
                >
                  All
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`px-3 py-1 text-xs ${activeTab === category ? "bg-gray-600" : "hover:bg-gray-600"}`}
                    onClick={() => setActiveTab(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Debug Data */}
              <div className="overflow-auto p-2" style={{ maxHeight: "60vh" }}>
                <pre className="text-xs whitespace-pre-wrap">
                  {Object.keys(filteredData).length > 0
                    ? JSON.stringify(filteredData, null, 2)
                    : "No debug data available"}
                </pre>
              </div>

              {/* Footer */}
              <div className="bg-gray-700 p-2 flex justify-between border-t border-gray-600">
                <div className="text-xs text-gray-400">{Object.keys(debugData).length} items</div>
                <div className="flex space-x-2">
                  <button onClick={copyToClipboard} className="p-1 hover:bg-gray-600 rounded" title="Copy to clipboard">
                    <Copy size={14} />
                  </button>
                  <button onClick={downloadDebugData} className="p-1 hover:bg-gray-600 rounded" title="Download JSON">
                    <Download size={14} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
