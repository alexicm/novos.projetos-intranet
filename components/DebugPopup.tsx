import type React from "react"
import { motion } from "framer-motion"
import type { Course } from "@/lib/types"
import { X } from "lucide-react"

interface DebugPopupProps {
  courses: Record<string, Course>
  onClose: () => void
}

const DebugPopup: React.FC<DebugPopupProps> = ({ courses, onClose }) => {
  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-auto"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Debug Information</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors" aria-label="Close">
            <X size={24} />
          </button>
        </div>
        <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(courses, null, 2)}</pre>
      </motion.div>
    </motion.div>
  )
}

export default DebugPopup
