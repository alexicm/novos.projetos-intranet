import { NextResponse } from "next/server"
import type { Course, ApiResponse } from "@/lib/types"
import config from "@/lib/config"

const API_URL = config.pipefy.apiUrl
const PIPEFY_API_KEY = config.pipefy.apiKey

if (!PIPEFY_API_KEY) {
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
            native_value
            field {
              label
              id
            }
          }
          child_relations {
            __typename
            cards {
              fields {
                name
                value
              }
            }
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
    throw new Error("Invalid API response structure")
  }

  apiResponse.data.phase.cards.edges.forEach((edge) => {
    if (!edge.node.id || !edge.node.fields) {
      console.error("Invalid edge structure:", JSON.stringify(edge))
      return
    }

    const fields = edge.node.fields
    const childRelations = edge.node.child_relations || []

    // Inicializa o objeto do curso
    const course: Course = {
      id: edge.node.id,
      nome: "",
      coordenadorSolicitante: "Sem coordenador",
      coordenadores: [],
      apresentacao: "",
      publico: "",
      concorrentesIA: [],
      performance: "",
      videoUrl: "",
      disciplinasIA: [],
      status: "",
      observacoesComite: "",
    }

    // Processa os campos principais
    fields.forEach((field) => {
      if (!field.name) {
        console.error("Invalid field structure: missing name", JSON.stringify(field))
        return
      }

      const value = field.native_value || ""

      // Verifica se é um dos campos de coordenador solicitante
      if (
        field.name === "Pesquise seu nome aqui" ||
        (field.field && field.field.id === "nome_completo") ||
        field.name === "Nome Completo do Solicitante"
      ) {
        if (value && value.trim() !== "") {
          course.coordenadorSolicitante = value
        }
      }

      switch (field.name) {
        case "Nome do Curso":
          course.nome = value
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
                  const [instituicao, nomeCurso, modalidade, link, valor] = item.split(";")
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
          }
          break
        case "Performance de Cursos / Área correlatas":
          course.performance = value
          break
        case "Vídeo de Defesa da Proposta de Curso":
          course.videoUrl = value
          break
        case "Disciplinas IA":
          if (value) {
            course.disciplinasIA = value.split("\n").map((d) => {
              const [nome, carga] = d.split(";")
              return { nome, carga: Number.parseInt(carga) || 0 }
            })
          }
          break
        case "Status Pós-Comitê":
          course.status = value
          break
        case "Observações do comitê":
          course.observacoesComite = value
          break
      }
    })

    // Primeiro, coletamos os nomes dos coordenadores dos campos principais
    const coordenadorNomes: string[] = []
    fields.forEach((field) => {
      if (field.name.startsWith("Coordenador ") && field.native_value) {
        coordenadorNomes.push(field.native_value)
      }
    })

    // Agora, buscamos as informações detalhadas nos child_relations
    const coordenadoresInfo: Record<string, { minibiografia: string; jaECoordenador: boolean }> = {}

    childRelations.forEach((relation) => {
      if (relation.cards && relation.cards.length > 0) {
        const coordCard = relation.cards[0]
        const coordFields = coordCard.fields

        // Verifica se este é um card de coordenador
        const nomeField = coordFields.find((f) => f.name === "Nome Completo")
        if (!nomeField || !nomeField.value) return

        const nome = nomeField.value
        const minibiografia = coordFields.find((f) => f.name === "Minibiografia")?.value || ""
        const jaECoordenador = coordFields.find((f) => f.name === "Já é coordenador da Unyleya?")?.value === "Sim"

        // Armazena as informações do coordenador
        coordenadoresInfo[nome] = {
          minibiografia,
          jaECoordenador,
        }
      }
    })

    // Finalmente, criamos a lista de coordenadores com as informações completas
    coordenadorNomes.forEach((nome) => {
      if (coordenadoresInfo[nome]) {
        course.coordenadores.push({
          nome,
          minibiografia: coordenadoresInfo[nome].minibiografia,
          jaECoordenador: coordenadoresInfo[nome].jaECoordenador,
        })
      } else {
        // Se não encontrarmos informações detalhadas, adicionamos apenas o nome
        course.coordenadores.push({
          nome,
          minibiografia: "",
          jaECoordenador: false,
        })
      }
    })

    courses[course.id] = course
  })

  return courses
}

export async function GET() {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify({ query }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: ApiResponse = await response.json()
    const parsedCourses = parseApiResponse(data)
    return NextResponse.json(parsedCourses)
  } catch (error) {
    console.error("Error fetching data from Pipefy:", error)
    return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 })
  }
}
