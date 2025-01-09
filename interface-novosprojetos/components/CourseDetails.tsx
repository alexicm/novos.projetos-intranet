"use client"

import { useState, useEffect } from "react"
import { Course } from "@/lib/types"
import { courses } from "@/lib/courseData"

export default function CourseDetails() {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)

  useEffect(() => {
    const handleCourseChange = (event: Event) => {
      const courseKey = (event.target as HTMLSelectElement).value
      setSelectedCourse(courses[courseKey] || null)
    }

    const selector = document.getElementById("courseSelector")
    selector?.addEventListener("change", handleCourseChange)

    return () => {
      selector?.removeEventListener("change", handleCourseChange)
    }
  }, [])

  if (!selectedCourse) return null

  return (
    <div className="py-8 space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{selectedCourse.nome}</h2>
      </div>
      <div>
        <h3 className="text-lg font-medium text-gray-900">Coordenadores</h3>
        <ul className="mt-2 space-y-1">
          {selectedCourse.coordenadores.map((coordenador, index) => (
            <li key={index}>
              {coordenador.nome} -{""}
              <a href={coordenador.lattes} target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:text-orange-800">
                Currículo Lattes
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="text-lg font-medium text-gray-900">Apresentação</h3>
        <p className="mt-2 text-gray-600">{selectedCourse.apresentacao}</p>
        <a href="https://www.youtube.com/watch?v=kK94JcxX_0w&t=4s" target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-orange-600 hover:text-orange-800">
          Assista ao vídeo de apresentação
        </a>
      </div>
      <div>
        <h3 className="text-lg font-medium text-gray-900">Público-Alvo</h3>
        <p className="mt-2 text-gray-600">{selectedCourse.publico}</p>
      </div>
      <div>
        <h3 className="text-lg font-medium text-gray-900">Disciplinas</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Disciplina</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Carga Horária</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {selectedCourse.disciplinas.map((disciplina, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{disciplina.nome}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{disciplina.carga}H</td>
                </tr>
              ))}
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Total</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {selectedCourse.disciplinas.reduce((total, disciplina) => total + disciplina.carga, 0)}H
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-medium text-gray-900">Concorrentes</h3>
        <ul className="mt-2 space-y-1">
          {selectedCourse.concorrentes.map((concorrente, index) => (
            <li key={index}>
              <a href={concorrente.link} target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:text-orange-800">
                {concorrente.nome}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="text-lg font-medium text-gray-900">Performance</h3>
        <a href={selectedCourse.performance} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-orange-600 hover:text-orange-800">
          Visualizar Performance
        </a>
      </div>
    </div>
  )
}

