import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import styles from "@/styles/Home.module.css"
import Image from "next/image"
import { motion } from "framer-motion"
import type { Course } from "@/lib/types"
import LoadingAnimation from "@/components/LoadingAnimation"
import CourseSearch from "@/components/CourseSearch"
import CourseDetails from "@/components/CourseDetails"
import CourseStatusDropdown from "@/components/CourseStatusDropdown"
import { setupInactivityListeners, resetInactivityTimer } from "@/utils/inactivityTimer"
import DebugPopup from "@/components/DebugPopup"

interface CourseProposalPageProps {
  courses: Record<string, Course>
  onReturnToLanding: () => void
  onLogout: () => void
}

export default function CourseProposalPage({
  courses: initialCourses,
  onReturnToLanding,
  onLogout,
}: CourseProposalPageProps) {
  const [courses, setCourses] = useState<Record<string, Course>>(initialCourses)
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isButtonLoading, setIsButtonLoading] = useState(false)
  const [showDebugPopup, setShowDebugPopup] = useState(false)
  const router = useRouter()

  const handleUpdateCourses = useCallback(async () => {
    setIsButtonLoading(true)
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/fetch-courses")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      console.log("Fetched courses data:", data)
      if (typeof data === "object" && data !== null) {
        setCourses(data)
      } else {
        throw new Error("Invalid data format received from the server")
      }
    } catch (error) {
      console.error("Error updating courses:", error)
      setError(error instanceof Error ? error.message : "An unexpected error occurred while updating courses")
    } finally {
      setIsLoading(false)
      setIsButtonLoading(false)
    }
  }, [])

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
  }

  useEffect(() => {
    const checkAuth = async () => {
      const response = await fetch("/api/check-auth")
      if (!response.ok) {
        router.push("/login")
      }
    }
    checkAuth()
  }, [router])

  useEffect(() => {
    const cleanup = setupInactivityListeners(onLogout)
    resetInactivityTimer(onLogout)

    return () => {
      cleanup()
    }
  }, [onLogout])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 max-w-[1920px] mx-auto"
    >
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-orange-500 bg-opacity-50 z-50">
          <LoadingAnimation />
        </div>
      )}
      {/* Header */}
      <div className="lg:col-span-12 mb-4">
        <div className={`${styles.headerBar} w-full`}>
          <div className={`${styles.headerContent} responsive-container flex items-center justify-between gap-6`}>
            <button
              onClick={handleUpdateCourses}
              className="px-4 py-2 bg-white text-orange-500 rounded-full text-sm font-semibold hover:bg-orange-100 transition duration-300 mr-4 flex items-center justify-center"
              disabled={isButtonLoading}
            >
              {isButtonLoading ? (
                <div className="w-5 h-5 border-t-2 border-orange-500 border-solid rounded-full animate-spin mr-2"></div>
              ) : null}
              {isButtonLoading ? "Atualizando..." : "Atualizar cursos"}
            </button>
            {error && <div className="text-red-500 text-sm ml-4 max-w-md truncate">Erro: {error}</div>}
            <span className={`${styles.headerTitle} responsive-text`}>Proposta de Cursos Comitê 2025</span>
            <div className={styles.logoContainer} onClick={onReturnToLanding} style={{ cursor: "pointer" }}>
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/uny_logo-pEYx6pRnSznZKeclaZApEzV7ztgHVq.png"
                alt="Unyleya Logo"
                width={32}
                height={32}
                priority
                className={styles.logoImage}
              />
            </div>
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-white text-orange-500 rounded-full text-sm font-semibold hover:bg-orange-100 transition duration-300"
            >
              Sair
            </button>
          </div>
        </div>
      </div>

      {/* Course Search */}
      <div className="lg:col-span-12 mb-4">
        <CourseSearch courses={courses} onSelectCourse={setSelectedCourse} />
      </div>

      {/* Course Name and Status Dropdown */}
      {selectedCourse && courses[selectedCourse] && (
        <div className="lg:col-span-12 mb-4 flex justify-between items-center">
          <h1 className="text-4xl font-bold p-4 bg-gray-100 rounded-lg shadow-sm text-orange-500 flex-grow">
            {courses[selectedCourse].nome}
          </h1>
          <div className="ml-4">
            <CourseStatusDropdown
              courseId={selectedCourse}
              initialStatus={courses[selectedCourse].status || ""}
              onStatusChange={(newStatus) => handleStatusChange(selectedCourse, newStatus)}
            />
          </div>
        </div>
      )}

      {/* Course Details */}
      {selectedCourse && courses[selectedCourse] && (
        <div className="lg:col-span-12">
          <CourseDetails
            course={courses[selectedCourse]}
            onStatusChange={(newStatus) => handleStatusChange(selectedCourse, newStatus)}
          />
        </div>
      )}
      {process.env.NODE_ENV === "development" && (
        <>
          <button
            onClick={() => setShowDebugPopup(true)}
            className="fixed bottom-4 right-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-full text-xs font-semibold hover:bg-gray-300 transition duration-300 z-50"
          >
            Show Debug Info
          </button>
          {showDebugPopup && <DebugPopup courses={courses} onClose={() => setShowDebugPopup(false)} />}
        </>
      )}
    </motion.div>
  )
}

