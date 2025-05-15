const config = {
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
  pipefy: {
    apiUrl: "https://api.pipefy.com/graphql",
    apiKey: process.env.PIPEFY_API_KEY,
  },
  emailjs: {
    userId: process.env.NEXT_PUBLIC_EMAILJS_USER_ID,
    serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
    templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
    privateId: process.env.NEXT_PUBLIC_EMAILJS_PRIVATE_ID,
  },
}

console.log("Supabase URL:", config.supabaseUrl)
console.log("Supabase Anon Key:", config.supabaseAnonKey ? "Set" : "Not set")

export default config
