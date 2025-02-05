import type React from "react"
import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import styles from "@/styles/Home.module.css"
import type { Course } from "@/lib/types"

interface CourseSearchProps {
  courses: Record<string, Course>
  onSelectCourse: (courseId: string) => void
}

export default function CourseSearch({ courses, onSelectCourse }: CourseSearchProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
    setIsDropdownOpen(true)
  }

  const handleFocus = () => {
    setIsDropdownOpen(true)
  }

  const handleSelectCourse = (courseKey: string) => {
    onSelectCourse(courseKey)
    setSearchTerm("")
    setIsDropdownOpen(false)
  }

  const groupCoursesByCoordinator = (courses: [string, Course][]) => {
    const grouped: Record<string, { key: string; nome: string; status: string }[]> = {}
    courses.forEach(([key, course]) => {
      const coordinator = course.coordenadorMEC
      if (!grouped[coordinator]) {
        grouped[coordinator] = []
      }
      if (!grouped[coordinator].some((existingCourse) => existingCourse.key === key)) {
        grouped[coordinator].push({ key, nome: course.nome, status: course.status || "" })
      }
    })
    return grouped
  }

  const filteredCourses = Object.entries(courses).filter(
    ([_, course]) =>
      course.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.coordenadorMEC.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Aprovado":
        return "bg-green-200 text-green-800"
      case "Reprovado":
        return "bg-red-200 text-red-800"
      case "Stand By":
        return "bg-yellow-200 text-yellow-800"
      default:
        return "bg-gray-200 text-gray-800"
    }
  }

  return (
    <div className={`${styles.searchContainer} mt-16 mb-8 relative`} ref={searchInputRef}>
      <input
        type="text"
        placeholder="Pesquisar cursos..."
        value={searchTerm}
        onChange={handleSearch}
        onFocus={handleFocus}
        className={`${styles.searchInput} w-full p-2 border border-gray-300 rounded-md`}
      />
      <AnimatePresence>
        {isDropdownOpen && (
          <motion.ul
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className={`${styles.courseDropdown} absolute w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-y-auto`}
          >
            {Object.entries(groupCoursesByCoordinator(filteredCourses)).map(([coordinator, courses]) => (
              <li key={coordinator} className={`${styles.courseGroup}`}>
                <div className={`${styles.coordinatorName} font-bold p-2 bg-gray-100`}>{coordinator}</div>
                <ul>
                  {courses.map((course) => (
                    <li
                      key={course.key}
                      onClick={() => handleSelectCourse(course.key)}
                      className={`${styles.courseItem} cursor-pointer p-2 hover:bg-gray-100 pl-4 flex justify-between items-center`}
                    >
                      <span>{course.nome}</span>
                      {course.status && (
                        <span className={`text-sm px-2 py-1 rounded-full ${getStatusColor(course.status)}`}>
                          {course.status}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}

