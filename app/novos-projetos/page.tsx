"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import LandingPage from "@/components/LandingPage"
import CourseStatusDropdown from "@/components/CourseStatusDropdown"

export default function LoginRoute() {
  const router = useRouter()

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

  return <LandingPage onLogin={handleLogin} />
}

