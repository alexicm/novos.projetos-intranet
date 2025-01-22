"use client"

import { useRouter } from "next/navigation"
import CourseProposalPage from "@/components/CourseProposalPage"

export default function CourseProposalRoute() {
  const router = useRouter()

  const handleReturnToLanding = () => {
    router.push("/novos-projetos")
  }

  const handleLogout = () => {
    router.push("/")
  }

  return <CourseProposalPage onReturnToLanding={handleReturnToLanding} onLogout={handleLogout} />
}

