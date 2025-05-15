"use client"

import React, { useMemo } from "react"
import { motion } from "framer-motion"
import styles from "@/styles/Home.module.css"
import type { Course } from "@/lib/types"
import VideoPlayer from "@/components/VideoPlayer/VideoPlayer"
import PerformanceImage from "@/components/PerformanceImage"
import ExpandableSection from "@/components/ExpandableSection"
import { cn } from "@/lib/utils"

interface CourseDetailsProps {
  course: Course
}

const CourseDetails: React.FC<CourseDetailsProps> = ({ course }) => {
  const totalCargaHoraria = useMemo(() => {
    return course.disciplinasIA.reduce((total, disciplina) => {
      return total + (disciplina.carga || 0)
    }, 0)
  }, [course.disciplinasIA])

  const coordenadores = course.coordenadores || []

  if (!course || typeof course !== "object") {
    return (
      <div role="alert" className="p-4 bg-red-100 text-red-700 rounded-md">
        Erro: Dados do curso inválidos
      </div>
    )
  }

  return (
    <div className="relative min-h-screen w-full">
      <div className="container mx-auto py-4 px-2 sm:px-4 lg:px-6">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* First Column */}
          <motion.div
            className={cn(styles["info-box"], "h-full")}
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <ExpandableSection title="Apresentação" showZoomControls>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-4">
                <p className="text-base sm:text-lg leading-relaxed">{course.apresentacao}</p>
              </div>

              {course.videoUrl ? (
                <div className="mb-4">
                  <VideoPlayer videoUrl={course.videoUrl} />
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 mb-4 text-center italic">
                  Nenhum vídeo disponível para este curso.
                </p>
              )}
            </ExpandableSection>

            <ExpandableSection title="Concorrentes" showZoomControls>
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <table className={cn(styles.table, "w-full min-w-[600px] sm:min-w-full")}>
                  <thead>
                    <tr>
                      <th className="w-1/3">Instituição</th>
                      <th className="w-1/3">Curso</th>
                      <th className="w-1/3">Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(course.concorrentesIA) && course.concorrentesIA.length > 0 ? (
                      course.concorrentesIA.map((concorrente, index) => (
                        <tr key={index}>
                          <td>
                            {concorrente.link ? (
                              <a
                                href={concorrente.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={cn(
                                  styles.link,
                                  "hover:underline focus:outline-none focus:ring-2 focus:ring-orange-500",
                                )}
                              >
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
                        <td colSpan={3} className="text-center text-gray-500 dark:text-gray-400 py-4">
                          Nenhum dado de concorrente disponível
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </ExpandableSection>
          </motion.div>

          {/* Second Column */}
          <motion.div
            className={cn(styles["info-box"], "h-full")}
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <ExpandableSection title="Coordenadores" showZoomControls>
              <div className="space-y-6">
                {coordenadores.length > 0 ? (
                  coordenadores.map((coord, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                      <h4 className="font-bold text-lg mb-2">
                        {coord.nome} {coord.jaECoordenador ? "(Coordenador Unyleya)" : ""}
                      </h4>
                      <p className="text-base sm:text-lg leading-relaxed">
                        {coord.minibiografia || "Minibiografia não disponível"}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                    <p className="text-gray-500 dark:text-gray-400 text-center">
                      Nenhum coordenador cadastrado para este curso.
                    </p>
                  </div>
                )}
              </div>
            </ExpandableSection>

            <ExpandableSection title="Público-Alvo" showZoomControls>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                <p className="text-base sm:text-lg leading-relaxed">{course.publico}</p>
              </div>
            </ExpandableSection>
          </motion.div>

          {/* Third Column */}
          <motion.div
            className={cn(styles["info-box"], "h-full")}
            initial={{ x: 20 }}
            animate={{ x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <ExpandableSection title="Disciplinas" showZoomControls>
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <table className={cn(styles.table, "w-full min-w-[600px] sm:min-w-full")}>
                  <thead>
                    <tr>
                      <th className="w-3/4">Disciplina</th>
                      <th className="w-1/4">Carga Horária</th>
                    </tr>
                  </thead>
                  <tbody>
                    {course.disciplinasIA.map((disciplina, index) => (
                      <tr key={index}>
                        <td className="break-words">{disciplina.nome}</td>
                        <td>{disciplina.carga}h</td>
                      </tr>
                    ))}
                    <tr className="font-bold">
                      <td>Total</td>
                      <td>{totalCargaHoraria}h</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </ExpandableSection>

            {course.performance && (
              <ExpandableSection title="Performance" showZoomControls>
                <PerformanceImage imageUrl={course.performance} />
              </ExpandableSection>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default React.memo(CourseDetails)
