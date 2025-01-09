const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["'hebbkx1anhila5yf.public.blob.vercel-storage.com'"],
    remotePatterns: [
      {
        protocol: "'https'",
        hostname: "'**.public.blob.vercel-storage.com'",
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig

