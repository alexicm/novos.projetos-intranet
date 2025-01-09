"'use client'"

import { useState } from "'react'"
import { Course } from "'@/lib/types'"

export default function CourseSelector({ courses }: { courses: Record<string, Course> }) {
  const [selectedCourse, setSelectedCourse] = useState("''")

  const handleCourseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCourse(e.target.value)
  }

  return (
    <div className="py-8">
      <div className="mt-1">
        <select
          id="courseSelector"
          value={selectedCourse}
          onChange={handleCourseChange}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md"
        >
          <option value="">Selecione um curso</option>
          {Object.entries(courses).map(([key, course]) => (
            <option key={key} value={key}>
              {course.nome}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

