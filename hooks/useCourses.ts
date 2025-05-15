"use client"

import { useState, useCallback, useMemo } from "react"
import type { Course } from "@/lib/types"

export function useCourses() {
  const [courses, setCourses] = useState<Record<string, Course>>({})
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const memoizedCourses = useMemo(() => courses, [courses])

  const fetchCourses = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/courses")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      if (typeof data === "object" && data !== null) {
        setCourses(data)
      } else {
        throw new Error("Invalid data format received from the server")
      }
    } catch (error) {
      console.error("Error loading courses:", error)
      setError("Failed to load courses. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updateCourseStatus = useCallback(async (courseId: string, newStatus: string) => {
    try {
      const response = await fetch("/api/update-course-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ courseId, status: newStatus }),
      })

      if (!response.ok) {
        throw new Error("Failed to update course status")
      }

      setCourses((prevCourses) => ({
        ...prevCourses,
        [courseId]: {
          ...prevCourses[courseId],
          status: newStatus,
        },
      }))
    } catch (error) {
      console.error("Error updating course status:", error)
      setError("Failed to update course status")
    }
  }, [])

  return {
    courses: memoizedCourses,
    selectedCourse,
    isLoading,
    error,
    fetchCourses,
    updateCourseStatus,
    setSelectedCourse,
  }
}
