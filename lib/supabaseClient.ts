import { createClient } from "@supabase/supabase-js"
import config from "./config"

if (!config.supabaseUrl || !config.supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables")
}

let supabase

try {
  supabase = createClient(config.supabaseUrl, config.supabaseAnonKey)
  console.log("Supabase client initialized successfully")
} catch (error) {
  console.error("Error initializing Supabase client:", error)
  throw error
}

export { supabase }

