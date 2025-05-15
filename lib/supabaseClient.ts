import { createClient } from "@supabase/supabase-js"
import config from "./config"

// Criamos uma função para criar o cliente Supabase
const createSupabaseClient = () => {
  if (!config.supabaseUrl || !config.supabaseAnonKey) {
    console.warn("Supabase URL or Anon Key is missing")

    // Retornamos um cliente mock para evitar erros durante o build
    return {
      from: () => ({
        select: () => Promise.resolve({ data: [], error: null }),
        insert: () => Promise.resolve({ data: [], error: null }),
        update: () => Promise.resolve({ data: [], error: null }),
        delete: () => Promise.resolve({ data: [], error: null }),
        eq: () => ({ limit: () => Promise.resolve({ data: [], error: null }) }),
      }),
      auth: {
        signIn: () => Promise.resolve({ user: null, session: null, error: null }),
        signOut: () => Promise.resolve({ error: null }),
      },
    } as any
  }

  try {
    return createClient(config.supabaseUrl, config.supabaseAnonKey)
  } catch (error) {
    console.error("Error initializing Supabase client:", error)
    throw error
  }
}

// Exportamos o cliente Supabase
export const supabase = createSupabaseClient()
