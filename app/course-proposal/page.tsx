"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import CourseProposalPage from "@/components/CourseProposalPage"
import LoadingAnimation from "@/components/LoadingAnimation"
import type { Course } from "@/lib/types"

export default function CourseProposalRoute() {
  const router = useRouter()
  const [courses, setCourses] = useState<Record<string, Course> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCourses = async () => {
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
      } catch (err) {
        console.error("Error loading courses:", err)
        setError("Failed to load courses. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchCourses()
  }, [])

  const handleReturnToLanding = () => {
    router.push("/novos-projetos")
  }

  const handleLogout = () => {
    router.push("/")
  }

  if (isLoading) {
    return <LoadingAnimation />
  }

  if (error) {
    return <div className="text-center text-red-500 mt-8">{error}</div>
  }

  return <CourseProposalPage courses={courses} onReturnToLanding={handleReturnToLanding} onLogout={handleLogout} />
}

