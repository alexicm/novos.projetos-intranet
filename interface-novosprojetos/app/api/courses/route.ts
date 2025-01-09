import { NextResponse } from "'next/server'"
import { Course, ApiResponse } from "'@/lib/types'"

const API_URL = "https://api.pipefy.com/graphql"

// Using the environment variable
const PIPEFY_API_KEY = process.env.PIPEFY_API_KEY

if (!PIPEFY_API_KEY) {
  throw new Error("'PIPEFY_API_KEY environment variable is not set'")
}

const HEADERS = {
  "Authorization": `Bearer ${PIPEFY_API_KEY}`,
  "Content-Type": "application/json"
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
  const courses: Record<string, Course> = {};

  apiResponse.data.phase.cards.edges.forEach(edge => {
    const fields = edge.node.fields;
    const course: Course = {
      id: edge.node.id,
      nome: "''",
      coordenadorPrincipal: "''",
      outrosCoordenadores: [],
      apresentacao: "''",
      publico: "''",
      disciplinas: [],
      concorrentes: [],
      performance: "''",
      videoUrl: "''",
      disciplinasIA: [],
      areaConhecimento: "''",
      tags: [],
      resumo: "''",
      dataVencimento: "''",
      dataComite: "''",
      minibiosCoordenadores: {},
    };

    fields.forEach(field => {
      switch (field.name) {
        case "'Nome do Curso'":
          course.nome = field.value;
          break;
        case "'Coordenador Principal/Solicitante (Não altere)'":
          course.coordenadorPrincipal = JSON.parse(field.value)[0];
          break;
        case "'Coordenador 1'":
        case "'Coordenador 2'":
        case "'Coordenador 3'":
        case "'Coordenador 4'":
          if (field.value) {
            course.outrosCoordenadores.push(...JSON.parse(field.value));
          }
          break;
        case "'Apresentação e Justificativa'":
          course.apresentacao = field.value;
          break;
        case "'Público Alvo'":
          course.publico = field.value;
          break;
        case "'Disciplinas'":
          if (field.value) {
            course.disciplinas = field.value.split("'\n'").map(d => {
              const [nome, carga] = d.split("' -");
              return { nome, carga: parseInt(carga) };
            });
          }
          break;
        case "'Instituições que oferecem cursos similares (concorrentes)'":
          if (field.value) {
            course.concorrentes = field.value.split("'\n'").map(c => {
              const [nome, link] = c.split("' -");
              return { nome, link };
            });
          }
          break;
        case "'Performance de Cursos / Área correlatas'":
          if (field.value) {
            course.performance = JSON.parse(field.value)[0] || "''";
          }
          break;
        case "'Vídeo Apresentação'":
          if (field.value) {
            course.videoUrl = JSON.parse(field.value)[0] || "''";
          }
          break;
        case "'Disciplinas IA'":
          if (field.value) {
            course.disciplinasIA = field.value.split("'\n'").map(d => {
              const [nome, carga] = d.split("' -");
              return { nome, carga: parseInt(carga) };
            });
          }
          break;
        case "'Área de Conhecimento'":
          course.areaConhecimento = field.value;
          break;
        case "'Tags'":
          course.tags = field.value ? field.value.split("', '") : [];
          break;
        case "'Resumo do Curso'":
          course.resumo = field.value;
          break;
        case "'Data de Vencimento'":
          course.dataVencimento = field.value;
          break;
        case "'Data do Comitê'":
          course.dataComite = field.value;
          break;
        case "'Minibio do Coordenador 1'":
        case "'Minibio do Coordenador 2'":
        case "'Minibio do Coordenador 3'":
        case "'Minibio do Coordenador 4'":
          const coordIndex = parseInt(field.name.split("'")[3]) - 1;
          if (coordIndex < course.outrosCoordenadores.length) {
            course.minibiosCoordenadores[course.outrosCoordenadores[coordIndex]] = field.value;
          }
          break;
        case "'Minibio do Coordenador Solicitante/Principal'":
          course.minibiosCoordenadores[course.coordenadorPrincipal] = field.value;
          break;
      }
    });

    courses[course.id] = course;
  });

  return courses;
}

export async function GET() {
  try {
    if (!PIPEFY_API_KEY) {
      return NextResponse.json(
        { error: "'API key not configured'" }, 
        { status: 500 }
      )
    }

    const response = await fetch(API_URL, {
      method: "'POST'",
      headers: HEADERS,
      body: JSON.stringify({ query })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: ApiResponse = await response.json()
    const parsedCourses = parseApiResponse(data)
    return NextResponse.json(parsedCourses)
  } catch (error) {
    console.error("'Error fetching data from Pipefy:'", error)
    return NextResponse.json(
      { error: "'Failed to fetch courses'" }, 
      { status: 500 }
    )
  }
}

