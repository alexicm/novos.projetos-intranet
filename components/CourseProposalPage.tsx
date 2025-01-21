"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import VideoPlayer from "@/components/VideoPlayer/VideoPlayer"
import PerformanceImage from "@/components/PerformanceImage"
import styles from "@/styles/Home.module.css"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import type { Course } from "@/lib/types"
import { supabase } from "@/lib/supabaseClient"
import LoadingAnimation from "@/components/LoadingAnimation"

// Definição do tipo de propriedades esperadas pelo componente
interface CourseProposalPageProps {
  onLogout: () => void
}

// Componente principal da página de propostas de cursos
export default function CourseProposalPage({ onLogout }: CourseProposalPageProps) {
  const [courses, setCourses] = useState<Record<string, Course>>({}) // Estado para armazenar os cursos
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null) // Estado para armazenar o curso selecionado
  const [isLoading, setIsLoading] = useState(false) // Estado para controlar o carregamento dos dados
  const [error, setError] = useState<string | null>(null) // Estado para armazenar mensagens de erro
  const [searchTerm, setSearchTerm] = useState("") // Estado para armazenar o termo de pesquisa
  const [isDropdownOpen, setIsDropdownOpen] = useState(false) // Estado para controlar a abertura do dropdown de pesquisa
  const router = useRouter() // Hook do Next.js para navegação
  const searchInputRef = useRef<HTMLInputElement>(null) // Referência para o campo de pesquisa

  // Carrega os cursos assim que o componente é montado
  useEffect(() => {
    loadCourses()
  }, [])

  // Carrega os detalhes do curso sempre que um curso for selecionado
  useEffect(() => {
    if (selectedCourse) {
      loadCourseDetails(selectedCourse)
    }
  }, [selectedCourse])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Função para carregar os cursos da API
  const loadCourses = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/courses")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      if (!data || Object.keys(data).length === 0) {
        throw new Error("No courses data received")
      }
      setCourses(data)
      setIsLoading(false)
    } catch (err) {
      console.error("Error loading courses:", err)
      setError(`Error loading courses: ${err instanceof Error ? err.message : String(err)}`)
      setIsLoading(false)
    }
  }

  // Função para carregar os detalhes de um curso específico
  const loadCourseDetails = (courseKey: string) => {
    const course = courses[courseKey]
    if (!course) {
      console.error("Course not found:", courseKey)
      return
    }

    updateCourseElement("courseName", course.nome)
    updateCourseElement("courseApresentacao", course.apresentacao)
    updateCourseElement("coursePublico", course.publico)

    let totalHoras = 0
    const disciplinas = (course.disciplinasIA || [])
      .map((d) => {
        totalHoras += d.carga
        return `<tr><td class="responsive-text">${d.nome}</td><td class="responsive-text">${d.carga}H</td></tr>`
      })
      .join("")
    updateCourseElement(
      "courseDisciplinasIA",
      disciplinas +
        `<tr><td class="responsive-text"><strong>Total</strong></td><td class="responsive-text"><strong>${totalHoras}H</strong></td></tr>`,
    )

    const minibiosContainer = document.getElementById("coordenadorMinibios")
    if (minibiosContainer) {
      let minibiosContent = ""

      minibiosContent += ` 
        <div class="mb-4">
          <h4 class="font-bold">${course.coordenadorPrincipal} (Coordenador Principal/Solicitante)</h4>
          <p>${course.minibiosCoordenadores[course.coordenadorPrincipal] || "Minibio não disponível"}</p>
        </div>
      `

      course.outrosCoordenadores.forEach((coord) => {
        minibiosContent += `
          <div class="mb-4">
            <h4 class="font-bold">${coord}</h4>
            <p>${course.minibiosCoordenadores[coord] || "Minibio não disponível"}</p>
          </div>
        `
      })

      minibiosContainer.innerHTML = minibiosContent
    }

    if (course.videoUrl) {
      const videoPlayerContainer = document.getElementById("videoPlayerContainer")
      if (videoPlayerContainer) {
        videoPlayerContainer.style.display = "block"
      }
    }

    const concorrentesIATable = document.getElementById("concorrentesIATable")
    if (concorrentesIATable) {
      const tableBody = (course.concorrentesIA || [])
        .map(
          (concorrente) => `
        <tr>
          <td class="responsive-text">
            <a
              href="${concorrente.link}"
              target="_blank"
              rel="noopener noreferrer"
              className="${styles.link}"
            >
              ${concorrente.nome}
            </a>
          </td>
          <td class="responsive-text">${concorrente.curso}</td>
          <td class="responsive-text">${concorrente.modalidade}</td>
          <td class="responsive-text">${concorrente.valor}</td>
        </tr>
      `,
        )
        .join("")
      concorrentesIATable.innerHTML = tableBody
    }
  }

  // Função para atualizar elementos do DOM com o conteúdo do curso
  const updateCourseElement = (elementId: string, content: string) => {
    const element = document.getElementById(elementId)
    if (element) {
      element.innerHTML = content
    } else {
      console.error(`${elementId} element not found`)
    }
  }

  // Função para manipular o clique no logo e retornar à página inicial
  const handleLogoClick = () => {
    router.push("/login")
  }

  // Função para manipular a digitação na busca
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
    setIsDropdownOpen(true)
  }

  // Função para manipular o foco no campo de pesquisa
  const handleFocus = () => {
    setIsDropdownOpen(true)
  }

  // Função para selecionar um curso da lista de busca
  const handleSelectCourse = (courseKey: string) => {
    setSelectedCourse(courseKey)
    setSearchTerm("")
    setIsDropdownOpen(false)
  }

  // Função para agrupar os cursos por coordenador
  const groupCoursesByCoordinator = (courses: [string, Course][]) => {
    const grouped: Record<string, { key: string; nome: string }[]> = {}
    courses.forEach(([key, course]) => {
      const coordinator = course.coordenadorPrincipal
      if (!grouped[coordinator]) {
        grouped[coordinator] = []
      }
      if (!grouped[coordinator].some((existingCourse) => existingCourse.key === key)) {
        grouped[coordinator].push({ key, nome: course.nome })
      }
    })
    return grouped
  }

  // Filtra os cursos conforme o termo de pesquisa
  const filteredCourses = Object.entries(courses).filter(
    ([_, course]) =>
      course.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.coordenadorPrincipal.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleLogout = () => {
    router.push("/login")
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`${styles.container} responsive-container`}
    >
      <div className={`${styles.headerBar} w-full`}>
        <div className={`${styles.headerContent} responsive-container flex items-center justify-between gap-6`}>
          <span className={`${styles.headerTitle} responsive-text`}>Proposta de Cursos Comitê 2025</span>
          <div className={styles.logoContainer} onClick={handleLogoClick} style={{ cursor: "pointer" }}>
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/uny_logo-pEYx6pRnSznZKeclaZApEzV7ztgHVq.png"
              alt="Unyleya Logo"
              width={32}
              height={32}
              priority
              className={styles.logoImage}
            />
          </div>
          <button onClick={handleLogout} className={`${styles.logoutButton} px-6`}>
            Sair
          </button>
        </div>
      </div>

      {isLoading && <LoadingAnimation />}

      {error && (
        <div
          className={`${styles["error-message"]} responsive-text bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative`}
          role="alert"
        >
          <strong className="font-bold">Erro: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

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
                        className={`${styles.courseItem} cursor-pointer p-2 hover:bg-gray-100 pl-4`}
                      >
                        {course.nome}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      {selectedCourse && courses[selectedCourse] && (
        <motion.div
          className={`${styles["info-container"]} grid grid-cols-1 md:grid-cols-2 gap-6`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.div
            className={`${styles["info-box"]} ${styles["motion-box"]} p-6`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h3 className={`${styles.sectionHeader} ${styles.firstSectionHeader} responsive-subtitle`}>
              Nome do Curso
            </h3>
            <p className={`${styles["spaced-paragraph"]} responsive-text`} id="courseName"></p>
            <h3 className={`${styles.sectionHeader} responsive-subtitle`}>Apresentação</h3>
            <p className={`${styles["spaced-paragraph"]} responsive-text`} id="courseApresentacao"></p>
            {courses[selectedCourse]?.videoUrl && (
              <div className="mt-4">
                <VideoPlayer videoUrl={courses[selectedCourse].videoUrl} />
              </div>
            )}
            <h3 className={`${styles.sectionHeader} responsive-subtitle`}>Minibios dos Coordenadores</h3>
            <div id="coordenadorMinibios" className={`${styles["spaced-paragraph"]} responsive-text`}></div>
          </motion.div>

          <motion.div
            className={`${styles["info-box"]} ${styles["motion-box"]} p-6`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <h3 className={`${styles.sectionHeader} ${styles.firstSectionHeader} responsive-subtitle`}>Público-Alvo</h3>
            <p id="coursePublico" className={`${styles["spaced-paragraph"]} responsive-text`}></p>

            <h3 className={`${styles.sectionHeader} responsive-subtitle`}>Disciplinas</h3>
            <div className="overflow-x-auto">
              <table className={`${styles.table} w-full`}>
                <thead>
                  <tr>
                    <th className="responsive-text">Disciplina</th>
                    <th className="responsive-text">Carga Horária</th>
                  </tr>
                </thead>
                <tbody id="courseDisciplinasIA"></tbody>
              </table>
            </div>

            {courses[selectedCourse]?.performance && (
              <div>
                <h3 className={`${styles.sectionHeader} responsive-subtitle`}>Performance</h3>
                <PerformanceImage imageUrl={courses[selectedCourse].performance} />
              </div>
            )}

            <h3 className={`${styles.sectionHeader} responsive-subtitle`}>Concorrentes</h3>
            <div className="overflow-x-auto">
              <table className={`${styles.table} w-full`} id="concorrentesIATable">
                <thead>
                  <tr>
                    <th className="responsive-text">Concorrente</th>
                    <th className="responsive-text">Curso</th>
                    <th className="responsive-text">Modalidade</th>
                    <th className="responsive-text">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {courses[selectedCourse]?.concorrentesIA?.map((concorrente) => (
                    <tr key={concorrente.nome}>
                      <td className="responsive-text">
                        <a
                          href={concorrente.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${styles.link}`}
                        >
                          {concorrente.nome}
                        </a>
                      </td>
                      <td className="responsive-text">{concorrente.curso}</td>
                      <td className="responsive-text">{concorrente.modalidade}</td>
                      <td className="responsive-text">{concorrente.valor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  )
}

