export interface User {
  id: string
  nome: string
  email: string
  permissao: number
}

export interface Coordinator {
  nome: string
  minibiografia: string
  jaECoordenador: boolean
}

export interface Course {
  id: string
  nome: string
  coordenadorSolicitante: string
  coordenadores: Coordinator[]
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
  status?: string
  observacoesComite: string
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
              native_value?: string
              value?: string
              field?: {
                label: string
                id: string
              }
            }>
            child_relations: Array<{
              __typename: string
              cards: Array<{
                fields: Array<{
                  name: string
                  value: string
                }>
              }>
            }>
          }
        }>
      }
    }
  }
}

export interface AuthResponse {
  success: boolean
  user?: User
  error?: string
}
