import { NextResponse } from "next/server"
import type { Course, ApiResponse } from "@/lib/types"

const API_URL = "https://api.pipefy.com/graphql"

// Using the environment variable
const PIPEFY_API_KEY = process.env.PIPEFY_API_KEY

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

  apiResponse.data.phase.cards.edges.forEach((edge) => {
    if (!edge.node || !edge.node.id || !edge.node.fields) {
      console.error("Invalid edge structure:", JSON.stringify(edge))
      return
    }

    const fields = edge.node.fields
    const course: Course = {
      id: edge.node.id,
      nome: "",
      coordenadorPrincipal: "",
      outrosCoordenadores: [],
      apresentacao: "",
      publico: "",
      concorrentesIA: [],
      performance: "",
      videoUrl: "",
      disciplinasIA: [],
      minibiosCoordenadores: {},
      status: "", // Added status property
      observacoesComite: "",
    }

    fields.forEach((field) => {
      if (!field.name) {
        console.error("Invalid field structure: missing name", JSON.stringify(field))
        return
      }

      // Handle empty values
      const value = field.value || ""

      switch (field.name) {
        case "Nome do Curso":
          course.nome = value
          break
        case "Coordenador Principal/Solicitante (Não altere)":
          try {
            course.coordenadorPrincipal = JSON.parse(value)[0] || ""
          } catch (error) {
            console.error("Error parsing coordenadorPrincipal:", error)
            course.coordenadorPrincipal = ""
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
        case "Apresentação e Justificativa":
          course.apresentacao = value
          break
        case "Público Alvo":
          course.publico = value
          break
        case "Concorrentes IA":
          if (value) {
            course.concorrentesIA = value.split("\n").map((c) => {
              const [nome, curso, modalidade, link, valor] = c.split(" - ")
              return {
                nome,
                curso,
                modalidade: modalidade || "Modalidade desconhecida",
                link,
                valor: valor || "Valor desconhecido",
              }
            })
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
        case "Minibio do Coordenador 1":
        case "Minibio do Coordenador 2":
        case "Minibio do Coordenador 3":
        case "Minibio do Coordenador 4":
          const coordIndex = Number.parseInt(field.name.split(" ")[3]) - 1
          if (coordIndex >= 0 && coordIndex < course.outrosCoordenadores.length) {
            course.minibiosCoordenadores[course.outrosCoordenadores[coordIndex]] = value
          }
          break
        case "Minibio do Coordenador Solicitante/Principal":
          course.minibiosCoordenadores[course.coordenadorPrincipal] = value
          break
        case "Status Pós-Comitê":
          course.status = value
          break
        case "Observações do comitê":
          course.observacoesComite = value
          break
        default:
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
      console.error("API key not configured")
      return NextResponse.json({ error: "API key not configured" }, { status: 500 })
    }

    console.log("Fetching data from Pipefy...")
    const response = await fetch(API_URL, {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify({ query }),
    })

    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`)
      return NextResponse.json({ error: `HTTP error! status: ${response.status}` }, { status: response.status })
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

