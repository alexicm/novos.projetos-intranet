"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import LandingPage from "@/components/LandingPage"
import CourseProposalPage from "@/components/CourseProposalPage"

export default function Home() {
  const [showLanding, setShowLanding] = useState(true)
  const router = useRouter()

  const handleExploreClick = () => {
    setShowLanding(false)
    router.push("/course-proposal")
  }

  const returnToLanding = () => {
    setShowLanding(true)
    router.push("/")
  }

  return (
    <>
      {showLanding ? (
        <LandingPage onExploreClick={handleExploreClick} />
      ) : (
        <CourseProposalPage onReturnToLanding={returnToLanding} />
      )}
    </>
  )
}

