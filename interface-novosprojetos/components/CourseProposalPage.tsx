"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import VideoPlayer from "@/components/VideoPlayer"
import PerformanceImage from "@/components/PerformanceImage"
import Sidebar from "@/components/Sidebar"
import styles from "@/styles/Home.module.css"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Course } from "@/lib/types"

interface CourseProposalPageProps {
  onReturnToLanding: () => void;
}

export default function CourseProposalPage({ onReturnToLanding }: CourseProposalPageProps) {
  const [courses, setCourses] = useState<Record<string, Course>>({})
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const router = useRouter()
  const searchInputRef = useRef<HTMLInputElement>(null)

  const getCurrentMonth = () => {
    const months = [
      "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];
    return months[new Date().getMonth()];
  };

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      loadCourseDetails(selectedCourse);
    }
  }, [selectedCourse]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const loadCourses = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/courses")
      if (!response.ok) {
        throw new Error("Failed to fetch courses")
      }
      const data = await response.json()
      setCourses(data)
      setIsLoading(false)
    } catch (err) {
      console.error("Error loading courses:", err)
      setError("Error loading courses. Please try again.")
      setIsLoading(false)
    }
  }

  const loadCourseDetails = (courseKey: string) => {
    const course = courses[courseKey];
    if (!course) {
      console.error("Course not found:", courseKey);
      return;
    }

    updateCourseElement("courseName", course.nome);
    updateCourseElement("courseApresentacao", course.apresentacao);
    updateCourseElement("coursePublico", course.publico);

    let totalHoras = 0;
    const disciplinas = course.disciplinasIA.map(d => {
      totalHoras += d.carga;
      return `<tr><td class="responsive-text">${d.nome}</td><td class="responsive-text">${d.carga}H</td></tr>`;
    }).join("");
    updateCourseElement("courseDisciplinasIA", disciplinas +
      `<tr><td class="responsive-text"><strong>Total</strong></td><td class="responsive-text"><strong>${totalHoras}H</strong></td></tr>`);

    updateCourseElement("courseConcorrentes", course.concorrentes.map(c => 
      `<li class="responsive-text"><a href="${c.link}" target="_blank" rel="noopener noreferrer" class="${styles.link}">${c.nome}</a></li>`
    ).join(""));

    // Update minibios
    const minibiosContainer = document.getElementById("coordenadorMinibios");
    if (minibiosContainer) {
      let minibiosContent = "";
      
      // Add main coordinator first
      minibiosContent += `
        <div class="mb-4">
          <h4 class="font-bold">${course.coordenadorPrincipal} (Coordenador Principal/Solicitante)</h4>
          <p>${course.minibiosCoordenadores[course.coordenadorPrincipal] || "Minibio não disponível"}</p>
        </div>
      `;

      // Add other coordinators
      course.outrosCoordenadores.forEach(coord => {
        minibiosContent += `
          <div class="mb-4">
            <h4 class="font-bold">${coord}</h4>
            <p>${course.minibiosCoordenadores[coord] || "Minibio não disponível"}</p>
          </div>
        `;
      });

      minibiosContainer.innerHTML = minibiosContent;
    }

    // Ensure video player is updated
    if (course.videoUrl) {
      const videoPlayerContainer = document.getElementById("videoPlayerContainer");
      if (videoPlayerContainer) {
        videoPlayerContainer.style.display = "block";
      }
    }
  }

  const updateCourseElement = (elementId: string, content: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.innerHTML = content;
    } else {
      console.error(`${elementId} element not found`);
    }
  }

  const handleLogoClick = () => {
    setSelectedCourse(null)
    setIsSidebarOpen(false)
    router.push("/")
  }

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
    setIsDropdownOpen(true)
  }

  const handleFocus = () => {
    setIsDropdownOpen(true)
  }

  const handleSelectCourse = (courseKey: string) => {
    setSelectedCourse(courseKey)
    setSearchTerm("")
    setIsDropdownOpen(false)
  }

  const groupCoursesByCoordinator = (courses: [string, Course][]) => {
    const grouped: Record<string, { key: string; nome: string }[]> = {};
    courses.forEach(([key, course]) => {
      const coordinator = course.coordenadorPrincipal;
      if (!grouped[coordinator]) {
        grouped[coordinator] = [];
      }
      // Only add the course once under its main coordinator
      if (!grouped[coordinator].some(existingCourse => existingCourse.key === key)) {
        grouped[coordinator].push({ key, nome: course.nome });
      }
    });
    return grouped;
  };

  const filteredCourses = Object.entries(courses).filter(([_, course]) =>
    course.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.coordenadorPrincipal.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`${styles.container} responsive-container`}
    >
      <div className={`${styles.headerBar} w-full`}>
        <div className={`${styles.headerContent} responsive-container`}>
          <button
            onClick={handleSidebarToggle}
            className={`${styles.sidebarButton} ${isLoading ? styles.loading : ""}`}
            disabled={isLoading}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className={`${styles.headerTitle} responsive-text`}>
            Proposta de Cursos Comitê {getCurrentMonth()} / 2025
          </span>
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
        </div>
      </div>

      {error && <p className={`${styles["error-message"]} responsive-text`}>{error}</p>}

      <Sidebar 
        courses={courses} 
        isOpen={isSidebarOpen} 
        onSelectCourse={(courseKey) => {
          setSelectedCourse(courseKey);
          setIsSidebarOpen(false);
        }} 
      />

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
                    {courses.map(course => (
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

      {selectedCourse && (
        <motion.div 
          className={`${styles["info-container"]} grid-responsive`}
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
            <h3 className={`${styles.sectionHeader} ${styles.firstSectionHeader} responsive-subtitle`}>Nome do Curso</h3>
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
            <h3 className={`${styles.sectionHeader} responsive-subtitle`}>Concorrentes</h3>
            <ul className={`${styles["spaced-paragraph"]} responsive-text`} id="courseConcorrentes"></ul>
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
                  <tr><th className="responsive-text">Disciplina</th><th className="responsive-text">Carga Horária</th></tr>
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
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  )
}

