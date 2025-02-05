"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import LandingPage from "@/components/LandingPage"

export default function LoginRoute() {
  const router = useRouter()
  const [isDevMode, setIsDevMode] = useState(false)
  const [courses, setCourses] = useState({}) // Added state for courses

  useEffect(() => {
    setIsDevMode(localStorage.getItem("DEVMODE") === "true")
  }, [])

  const handleLogin = () => {
    router.push("/novos-projetos")
  }

  const handleStatusChange = async (courseId: string, newStatus: string) => {
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

      // Update the local state with the new status
      setCourses((prevCourses) => ({
        ...prevCourses,
        [courseId]: {
          ...prevCourses[courseId],
          status: newStatus,
        },
      }))
    } catch (error) {
      console.error("Error updating course status:", error)
      // You might want to show an error message to the user here
    }
  }

  return <LandingPage onLogin={handleLogin} isDevMode={isDevMode} />
}

