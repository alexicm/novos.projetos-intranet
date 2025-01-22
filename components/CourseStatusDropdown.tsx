import React, { useState, useEffect } from "react"
import { ChevronDown, Check } from "@heroicons/react/solid" // Adjust imports based on your setup

interface CourseStatusDropdownProps {
  courseId: string
  initialStatus: string
  onStatusChange: (newStatus: string) => Promise<void>
}

const statusOptions = [
  { value: "Aprovado", label: "Aprovado" },
  { value: "Reprovado", label: "Reprovado" },
  { value: "Stand By", label: "Stand By" },
]

export default function CourseStatusDropdown({ courseId, initialStatus, onStatusChange }: CourseStatusDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [status, setStatus] = useState(initialStatus || "")
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    setStatus(initialStatus)
  }, [initialStatus])

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === status) {
      setIsOpen(false) // Close the dropdown if the same status is selected
      return
    }

    setIsUpdating(true)
    try {
      await onStatusChange(newStatus)
      setStatus(newStatus) // Update status only if successful
    } catch (error) {
      console.error("Error updating status:", error)
      // Optionally, handle the error (e.g., show a toast or error message)
    } finally {
      setIsUpdating(false)
      setIsOpen(false)
    }
  }

  const getStatusColor = (statusValue: string) => {
    switch (statusValue) {
      case "Aprovado":
        return "bg-green-500"
      case "Reprovado":
        return "bg-red-500"
      case "Stand By":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusLabel = (statusValue: string) => {
    return statusOptions.find((option) => option.value === statusValue)?.label || "Analisar"
  }

  return (
    <div className="relative inline-block text-left w-full sm:w-auto">
      <div>
        <button
          type="button"
          className={`inline-flex justify-center w-full sm:w-auto rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
            isUpdating ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={() => setIsOpen(!isOpen)}
          disabled={isUpdating}
        >
          <span className="mr-2">{status ? getStatusLabel(status) : "Analisar"}</span>
          <ChevronDown className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      {isOpen && (
        <div className="origin-top-right absolute left-0 sm:right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                className={`${
                  status === option.value ? "bg-gray-100 text-gray-900" : "text-gray-700"
                } flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 hover:text-gray-900`}
                role="menuitem"
                onClick={() => handleStatusChange(option.value)}
              >
                <span className="flex-grow text-left">{option.label}</span>
                {status === option.value && <Check className="h-4 w-4 text-green-500 ml-2" />}
                <span
                  className={`h-3 w-3 rounded-full ${getStatusColor(option.value)}`}
                  style={{ marginLeft: "2px" }}
                ></span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

