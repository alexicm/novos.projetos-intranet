import { NextResponse } from "next/server"
import type { Course, ApiResponse } from "@/lib/types"
import config from "@/lib/config"

const API_URL = config.pipefy.apiUrl
const PIPEFY_API_KEY = config.pipefy.apiKey

if (!PIPEFY_API_KEY) {
  console.error("PIPEFY_API_KEY environment variable is not set")
  throw new Error("PIPEFY_API_KEY environment variable is not set")
}

const HEADERS = {
  Authorization: `Bearer ${PIPEFY_API_KEY}`,
  "Content-Type": "application/json",
}

const query = `
{
  phase(id:"333225221") {
    cards {
      edges {
        node {
          id
          fields {
            name
            value
          }
        }
      }
    }
  }
}
`

const selectedFields = [
  "Nome do Curso",
  "Coordenador MEC",
  "Coordenador 1",
  "Coordenador 2",
  "Coordenador 3",
  "Coordenador 4",
  "Apresentação IA",
  "Público Alvo IA",
  "Concorrentes IA",
  "Performance de Cursos / Área correlatas",
  "Vídeo de Defesa da Proposta de Curso",
  "Disciplinas IA",
  "Minibio 1 IA",
  "Minibio 2 IA",
  "Minibio 3 IA",
  "Minibio 4 IA",
  "Minibio MEC IA",
  "Status Pós-Comitê",
  "Observações do comitê",
]

function parseApiResponse(apiResponse: ApiResponse): Record<string, Course> {
  const courses: Record<string, Course> = {}

  if (
    !apiResponse.data ||
    !apiResponse.data.phase ||
    !apiResponse.data.phase.cards ||
    !apiResponse.data.phase.cards.edges
  ) {
    console.error("Invalid API response structure:", JSON.stringify(apiResponse))
    throw new Error("Invalid API response structure")
  }

  const filteredFields = apiResponse.data.phase.cards.edges.map((edge) => ({
    id: edge.node.id,
    fields: edge.node.fields.filter((field) => selectedFields.includes(field.name)),
  }))

  filteredFields.forEach((edge) => {
    if (!edge.id || !edge.fields) {
      console.error("Invalid edge structure:", JSON.stringify(edge))
      return
    }

    const fields = edge.fields
    const course: Course = {
      id: edge.id,
      nome: "",
      coordenadorMEC: "",
      outrosCoordenadores: [],
      apresentacao: "",
      publico: "",
      concorrentesIA: [],
      performance: "",
      videoUrl: "",
      disciplinasIA: [],
      minibioMEC: "",
      minibiosCoordenadores: {},
      status: "",
      observacoesComite: "",
      data: {},
    }
    course.data = edge

    fields.forEach((field) => {
      if (!field.name) {
        console.error("Invalid field structure: missing name", JSON.stringify(field))
        return
      }

      const value = field.value || ""

      switch (field.name) {
        case "Nome do Curso":
          course.nome = value
          break
        case "Coordenador MEC":
          try {
            course.coordenadorMEC = JSON.parse(value)[0] || ""
          } catch (error) {
            console.error("Error parsing coordenadorMEC:", error)
            course.coordenadorMEC = ""
          }
          break
        case "Coordenador 1":
        case "Coordenador 2":
        case "Coordenador 3":
        case "Coordenador 4":
          if (value) {
            try {
              course.outrosCoordenadores.push(...JSON.parse(value))
            } catch (error) {
              console.error(`Error parsing ${field.name}:`, error)
            }
          }
          break
        case "Apresentação IA":
          course.apresentacao = value
          break
        case "Público Alvo IA":
          course.publico = value
          break
        case "Concorrentes IA":
          if (value) {
            try {
              let formattedValue = value.trim()
              if (!formattedValue.startsWith("[") || !formattedValue.endsWith("]")) {
                throw new Error("Invalid JSON format for Concorrentes IA")
              }
              formattedValue = formattedValue.replace(/,\s*\n\s*]/, "]")
              let parsedValue = JSON.parse(formattedValue)
              if (typeof parsedValue === "string") {
                parsedValue = JSON.parse(parsedValue)
              }
              if (Array.isArray(parsedValue)) {
                course.concorrentesIA = parsedValue.map((item: string) => {
                  const parts = item.split(";")
                  if (parts.length < 4) {
                    throw new Error(`Invalid item format: ${item}`)
                  }
                  const [instituicao, nomeCurso, modalidade, link, valor] = parts
                  return {
                    instituicao: instituicao.trim(),
                    curso: `${nomeCurso.trim()} - ${modalidade.trim()}`,
                    link: link.trim(),
                    valor: valor ? valor.trim() : "Valor desconhecido",
                  }
                })
              } else {
                throw new Error("Parsed value is not an array")
              }
            } catch (error) {
              console.error("Error parsing Concorrentes IA:", error)
              course.concorrentesIA = [
                {
                  instituicao: "Erro ao processar",
                  curso: "Erro ao processar",
                  link: "#",
                  valor: "Erro ao processar",
                },
              ]
            }
          } else {
            course.concorrentesIA = []
          }
          break
        case "Performance de Cursos / Área correlatas":
          if (value) {
            try {
              course.performance = JSON.parse(value)[0] || ""
            } catch (error) {
              console.error("Error parsing performance:", error)
              course.performance = ""
            }
          }
          break
        case "Vídeo de Defesa da Proposta de Curso":
          if (value) {
            try {
              course.videoUrl = JSON.parse(value)[0] || ""
            } catch (error) {
              console.error("Error parsing videoUrl:", error)
              course.videoUrl = ""
            }
          }
          break
        case "Disciplinas IA":
          if (value) {
            course.disciplinasIA = value.split("\n").map((d) => {
              const [nome, carga] = d.split(" - ")
              return { nome, carga: Number.parseInt(carga) || 0 }
            })
          }
          break
        case "Minibio 1 IA":
        case "Minibio 2 IA":
        case "Minibio 3 IA":
        case "Minibio 4 IA":
          const coordIndex = Number.parseInt(field.name.split(" ")[1]) - 1
          if (coordIndex >= 0 && coordIndex < course.outrosCoordenadores.length) {
            course.minibiosCoordenadores[course.outrosCoordenadores[coordIndex]] = value
          }
          break
        case "Minibio MEC IA":
          course.minibioMEC = value
          break
        case "Status Pós-Comitê":
          course.status = value
          break
        case "Observações do comitê":
          course.observacoesComite = value
          break
      }
    })

    courses[course.id] = course
  })

  return courses
}

export async function GET() {
  try {
    if (!PIPEFY_API_KEY) {
      throw new Error("API key not configured")
    }

    console.log("Fetching data from Pipefy...")
    const response = await fetch(API_URL, {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify({ query }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: ApiResponse = await response.json()
    console.log("Received data from Pipefy, parsing response...")
    const parsedCourses = parseApiResponse(data)
    console.log(`Parsed ${Object.keys(parsedCourses).length} courses`)
    return NextResponse.json(parsedCourses)
  } catch (error) {
    console.error("Error fetching data from Pipefy:", error)
    return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 })
  }
}

