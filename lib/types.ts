export interface Course {
  id: string
  nome: string
  coordenadorMEC: string
  outrosCoordenadores: string[]
  apresentacao: string
  publico: string
  concorrentesIA: Array<{
    instituicao: string
    curso: string
    link: string
    valor: string
  }>
  performance: string
  videoUrl: string
  disciplinasIA: Array<{ nome: string; carga: number }>
  minibioMEC: string
  minibiosCoordenadores: Record<string, string>
  status?: string
  observacoesComite: string
  data = {}
}

export interface ApiResponse {
  data: {
    phase: {
      cards: {
        edges: Array<{
          node: {
            id: string
            fields: Array<{
              name: string
              value: string
            }>
          }
        }>
      }
    }
  }
}

