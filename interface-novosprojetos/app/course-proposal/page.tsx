"'use client'"

import CourseProposalPage from "'@/components/CourseProposalPage'"
import { useRouter } from "'next/navigation'"

export default function CourseProposalRoute() {
  const router = useRouter()
  const returnToLanding = () => router.push("'/'")

  return <CourseProposalPage onReturnToLanding={returnToLanding} />
}

