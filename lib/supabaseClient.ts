import { createClient } from "@supabase/supabase-js"
import config from "./config"

// Criamos uma versão simplificada do cliente Supabase para evitar erros
// durante o build quando as variáveis de ambiente não estão disponíveis
const createSupabaseClient = () => {
  // Verificamos se estamos no lado do cliente
  if (typeof window !== "undefined") {
    // No lado do cliente, verificamos se as variáveis de ambiente estão disponíveis
    if (config.supabaseUrl && config.supabaseAnonKey) {
      try {
        return createClient(config.supabaseUrl, config.supabaseAnonKey)
      } catch (error) {
        console.error("Error initializing Supabase client:", error)
        return null
      }
    }
  }

  // Se estamos no lado do servidor durante o build ou se as variáveis
  // não estão disponíveis, retornamos um cliente mock
  return {
    from: () => ({
      select: () => Promise.resolve({ data: [], error: null }),
      insert: () => Promise.resolve({ data: [], error: null }),
      update: () => Promise.resolve({ data: [], error: null }),
      delete: () => Promise.resolve({ data: [], error: null }),
    }),
    auth: {
      signIn: () => Promise.resolve({ user: null, session: null, error: null }),
      signOut: () => Promise.resolve({ error: null }),
    },
  }
}

export const supabase = createSupabaseClient()
