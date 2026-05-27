import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co', // imagens do Supabase Storage
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com', // thumbnails do YouTube
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com', // thumbnails do YouTube (formato alternativo)
      },
    ],
  },

  // Cabeçalhos de Segurança HTTP — Camada 2 da nossa arquitetura
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Previne Clickjacking (incorporar o site em iframes maliciosos)
          { key: 'X-Frame-Options', value: 'DENY' },
          // Previne ataques de MIME-type sniffing
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Força HTTPS por 1 ano
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
          // Controla informações de referência
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Permissões do navegador (câmera, microfone, localização)
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ]
  },
}

export default nextConfig
