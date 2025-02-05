import React, { useState } from "react"
import { motion } from "framer-motion"
import styles from "@/styles/Home.module.css"
import type { Course } from "@/lib/types"
import VideoPlayer from "@/components/VideoPlayer/VideoPlayer"
import PerformanceImage from "@/components/PerformanceImage"
import { ZoomIn, ZoomOut } from "lucide-react"

interface CourseDetailsProps {
  course: Course
}

const CourseDetails: React.FC<CourseDetailsProps> = ({ course }) => {
  const [fontSize, setFontSize] = useState(16)

  const handleZoomIn = () => {
    setFontSize((prev) => Math.min(prev + 2, 32))
  }

  const handleZoomOut = () => {
    setFontSize((prev) => Math.max(prev - 2, 12))
  }

  if (!course || typeof course !== "object") {
    return <div>Erro: Dados do curso inválidos</div>
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Global Zoom Controls */}
      <div className="fixed top-20 right-4 flex gap-2 z-50 bg-white p-2 rounded-lg shadow-md">
        <button
          onClick={handleZoomOut}
          className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
          aria-label="Decrease font size"
        >
          <ZoomOut className="h-4 w-4" />
        </button>
        <button
          onClick={handleZoomIn}
          className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
          aria-label="Increase font size"
        >
          <ZoomIn className="h-4 w-4" />
        </button>
      </div>

      <motion.div
        className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-2 flex-grow overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ fontSize: `${fontSize}px` }}
      >
        <motion.div className={`${styles["info-box"]} overflow-auto`}>
          <div className={`${styles.sectionHeader} sticky top-0 z-10`}>Apresentação</div>
          <div className="bg-white p-2 rounded-lg shadow-sm mb-4">
            <p>{course.apresentacao}</p>
          </div>

          {course.videoUrl && (
            <div className="mb-4">
              <VideoPlayer videoUrl={course.videoUrl} />
            </div>
          )}

          <div className={`${styles.sectionHeader} sticky top-0 z-10 mt-4`}>Concorrentes</div>
          <div className="overflow-x-auto">
            <table className={`${styles.table} w-full`}>
              <thead>
                <tr>
                  <th>Instituição</th>
                  <th>Curso</th>
                  <th>Valor</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(course.concorrentesIA) && course.concorrentesIA.length > 0 ? (
                  course.concorrentesIA.map((concorrente, index) => (
                    <tr key={index}>
                      <td>
                        {concorrente.link ? (
                          <a href={concorrente.link} target="_blank" rel="noopener noreferrer" className={styles.link}>
                            {concorrente.instituicao}
                          </a>
                        ) : (
                          concorrente.instituicao
                        )}
                      </td>
                      <td>{concorrente.curso}</td>
                      <td>{concorrente.valor || "Não informado"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="text-center">
                      Nenhum dado de concorrente disponível
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        <motion.div className={`${styles["info-box"]} overflow-auto`}>
          <div className={`${styles.sectionHeader} sticky top-0 z-10`}>Minibios dos Coordenadores</div>
          <div className="bg-white p-2 rounded-lg shadow-sm mb-4">
            <div className="mb-4">
              <h4 className="font-bold">{course.coordenadorMEC} (Coordenador MEC)</h4>
              <p>{course.minibioMEC || "Minibio não disponível"}</p>
            </div>
            {course.outrosCoordenadores.map((coord) => (
              <div key={coord} className="mb-4">
                <h4 className="font-bold">{coord}</h4>
                <p>{course.minibiosCoordenadores[coord] || "Minibio não disponível"}</p>
              </div>
            ))}
          </div>

          <div className={`${styles.sectionHeader} sticky top-0 z-10 mt-4`}>Público-Alvo</div>
          <div className="bg-white p-2 rounded-lg shadow-sm">
            <p>{course.publico}</p>
          </div>
        </motion.div>

        <motion.div className={`${styles["info-box"]} overflow-auto`}>
          <div className={`${styles.sectionHeader} sticky top-0 z-10`}>Disciplinas</div>
          <div className="overflow-x-auto">
            <table className={`${styles.table} w-full`}>
              <thead>
                <tr>
                  <th className="w-1/2">Disciplina</th>
                  <th className="w-1/4">Carga Horária</th>
                  <th className="w-1/4">Tipo</th>
                </tr>
              </thead>
              <tbody>
                {course.disciplinasIA.map((disciplina, index) => {
                  const nome = typeof disciplina === "object" ? disciplina.nome : disciplina
                  const [disciplinaNome, cargaHoraria, tipo] = nome.split(";")
                  return (
                    <tr key={index}>
                      <td className="break-words">{disciplinaNome}</td>
                      <td>{cargaHoraria || "N/A"}</td>
                      <td>{tipo || "N/A"}</td>
                    </tr>
                  )
                })}
                <tr>
                  <td>
                    <strong>Total</strong>
                  </td>
                  <td>
                    <strong>
                      {course.disciplinasIA.reduce((total, disciplina) => {
                        const carga =
                          typeof disciplina === "object"
                            ? Number.parseInt(disciplina.nome.split(";")[1] || "0", 10)
                            : Number.parseInt(disciplina.split(";")[1] || "0", 10)
                        return total + (isNaN(carga) ? 0 : carga)
                      }, 0)}
                      H
                    </strong>
                  </td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>

          {course.performance && (
            <>
              <div className={`${styles.sectionHeader} sticky top-0 z-10 mt-4`}>Performance</div>
              <PerformanceImage imageUrl={course.performance} />
            </>
          )}
        </motion.div>
      </motion.div>
    </div>
  )
}

export default React.memo(CourseDetails)

