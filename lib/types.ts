export interface Course {
  id: string;
  nome: string;
  coordenadorPrincipal: string;
  outrosCoordenadores: string[];
  apresentacao: string;
  publico: string;
  disciplinas: Array<{ nome: string; carga: number }>;
  concorrentes: Array<{ nome: string; link: string }>;
  performance: string;
  videoUrl: string;
  disciplinasIA: Array<{ nome: string; carga: number }>;
  areaConhecimento: string;
  tags: string[];
  resumo: string;
  dataVencimento: string;
  dataComite: string;
  minibiosCoordenadores: Record<string, string>;
}

export interface ApiResponse {
  data: {
    phase: {
      cards: {
        edges: Array<{
          node: {
            id: string;
            fields: Array<{
              name: string;
              value: string;
            }>;
          };
        }>;
      };
    };
  };
}

