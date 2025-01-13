"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import CourseProposalPage from "@/components/CourseProposalPage"

export default function CourseProposalRoute() {
  const router = useRouter()

  const handleReturnToLanding = () => {
    router.push("/")
  }

  const handleLogout = () => {
    router.push("/")
  }

  return (
    <CourseProposalPage 
      onReturnToLanding={handleReturnToLanding}
      onLogout={handleLogout}
    />
  )
}

