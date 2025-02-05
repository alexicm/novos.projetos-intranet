import type React from "react"
import { motion } from "framer-motion"

interface CenteredCourseNameProps {
  name: string
}

const CenteredCourseName: React.FC<CenteredCourseNameProps> = ({ name }) => {
  return (
    <motion.div
      className="text-center text-2xl font-bold my-6 p-4 bg-gray-100 rounded-lg shadow-sm"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {name}
    </motion.div>
  )
}

export default CenteredCourseName

