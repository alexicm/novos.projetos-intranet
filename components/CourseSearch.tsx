"use client"

import { useEffect } from "react"
import type React from "react"
import { useState, useRef, useMemo, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Course } from "@/lib/types"

interface CourseSearchProps {
  courses: Record<string, Course>
  onSelectCourse: (courseId: string) => void
}

export default function CourseSearch({ courses, onSelectCourse }: CourseSearchProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleSearch = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setSearchTerm(value)
    setIsDropdownOpen(true)
  }, [])

  const handleSelectCourse = useCallback(
    (courseKey: string) => {
      onSelectCourse(courseKey)
      setSearchTerm("")
      setIsDropdownOpen(false)
    },
    [onSelectCourse],
  )

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node) &&
      searchInputRef.current &&
      !searchInputRef.current.contains(event.target as Node)
    ) {
      setIsDropdownOpen(false)
    }
  }, [])

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [handleClickOutside])

  const filteredCourses = useMemo(() => {
    const searchTermLower = searchTerm.toLowerCase()
    return Object.entries(courses).filter(
      ([_, course]) =>
        course.nome.toLowerCase().includes(searchTermLower) ||
        course.coordenadorSolicitante.toLowerCase().includes(searchTermLower) ||
        course.status?.toLowerCase().includes(searchTermLower) ||
        course.disciplinasIA.some((disciplina) =>
          (typeof disciplina === "object" ? disciplina.nome : disciplina).toLowerCase().includes(searchTermLower),
        ),
    )
  }, [courses, searchTerm])

  const groupCoursesBySolicitante = useMemo(() => {
    const grouped: Record<string, { key: string; nome: string; status: string }[]> = {}

    filteredCourses.forEach(([key, course]) => {
      const solicitante = course.coordenadorSolicitante || "Sem coordenador"

      if (!grouped[solicitante]) {
        grouped[solicitante] = []
      }

      if (!grouped[solicitante].some((existingCourse) => existingCourse.key === key)) {
        grouped[solicitante].push({
          key,
          nome: course.nome,
          status: course.status || "",
        })
      }
    })

    return grouped
  }, [filteredCourses])

  const getStatusColor = useCallback((status: string) => {
    switch (status.toLowerCase()) {
      case "aprovado":
        return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
      case "reprovado":
        return "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
      case "stand by":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
    }
  }, [])

  return (
    <div className="relative w-full max-w-2xl mx-auto mt-4 sm:mt-6 lg:mt-8 px-4 sm:px-6 lg:px-8">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Pesquisar cursos por nome, coordenador, status ou disciplina..."
          value={searchTerm}
          onChange={handleSearch}
          onFocus={() => setIsDropdownOpen(true)}
          className={cn(
            "w-full pl-10 pr-4 py-2 text-sm sm:text-base",
            "border border-gray-300 dark:border-gray-700",
            "rounded-lg shadow-sm",
            "bg-white dark:bg-gray-800",
            "text-gray-900 dark:text-gray-100",
            "placeholder-gray-500 dark:placeholder-gray-400",
            "focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent",
            "transition-colors duration-200",
          )}
          aria-label="Pesquisar cursos"
          role="searchbox"
        />
      </div>

      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "absolute left-0 right-0 mt-2",
              "bg-white dark:bg-gray-800",
              "border border-gray-200 dark:border-gray-700",
              "rounded-lg shadow-lg",
              "max-h-[60vh] overflow-y-auto",
              "z-50",
            )}
          >
            {Object.entries(groupCoursesBySolicitante).length > 0 ? (
              Object.entries(groupCoursesBySolicitante).map(([solicitante, courses]) => (
                <div key={solicitante} className="border-b last:border-b-0 border-gray-200 dark:border-gray-700">
                  <div
                    className={cn(
                      "px-4 py-2",
                      "bg-gray-50 dark:bg-gray-900",
                      "font-semibold text-sm sm:text-base",
                      "text-gray-700 dark:text-gray-300",
                    )}
                  >
                    {solicitante}
                  </div>
                  <ul>
                    {courses.map((course) => (
                      <li key={course.key}>
                        <button
                          onClick={() => handleSelectCourse(course.key)}
                          className={cn(
                            "w-full px-4 py-2",
                            "flex items-center justify-between",
                            "text-sm sm:text-base",
                            "text-gray-700 dark:text-gray-300",
                            "hover:bg-gray-50 dark:hover:bg-gray-700",
                            "focus:outline-none focus:bg-gray-50 dark:focus:bg-gray-700",
                            "transition-colors duration-200",
                          )}
                        >
                          <span className="flex-1 text-left">{course.nome}</span>
                          {course.status && (
                            <span
                              className={cn(
                                "ml-2 px-2 py-1",
                                "text-xs font-medium",
                                "rounded-full",
                                getStatusColor(course.status),
                              )}
                            >
                              {course.status}
                            </span>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
                Nenhum curso encontrado
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
