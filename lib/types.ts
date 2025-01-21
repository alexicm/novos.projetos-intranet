export interface Course {
  id: string
  nome: string
  coordenadorPrincipal: string
  outrosCoordenadores: string[]
  apresentacao: string
  publico: string
  concorrentesIA: Array<{
    nome: string
    curso: string
    modalidade: string
    link: string
    valor: string
  }>
  performance: string
  videoUrl: string
  disciplinasIA: Array<{ nome: string; carga: number }>
  minibiosCoordenadores: Record<string, string>
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

