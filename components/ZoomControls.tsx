"use client"

import React from "react"
import { ZoomIn, ZoomOut } from "lucide-react"
import { cn } from "@/lib/utils"

interface ZoomControlsProps {
  onZoomIn: () => void
  onZoomOut: () => void
  className?: string
}

const ZoomControls: React.FC<ZoomControlsProps> = ({ onZoomIn, onZoomOut, className }) => (
  <div className={cn("flex space-x-2", className)}>
    <button
      onClick={onZoomOut}
      className="p-1 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500"
      aria-label="Diminuir fonte"
    >
      <ZoomOut className="h-4 w-4 text-gray-600" />
    </button>
    <button
      onClick={onZoomIn}
      className="p-1 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500"
      aria-label="Aumentar fonte"
    >
      <ZoomIn className="h-4 w-4 text-gray-600" />
    </button>
  </div>
)

export default React.memo(ZoomControls)
