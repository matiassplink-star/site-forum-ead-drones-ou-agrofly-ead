import type { Metadata } from 'next'
import { Outfit, Inter } from 'next/font/google'
import './globals.css'

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'ECR Drones — Cursos de Drones Agrícolas',
  description:
    'Plataforma completa de treinamento em drones agrícolas: mapeamento NDVI, pulverização autônoma e legislação ANAC. Junte-se à maior comunidade de operadores de drone do agronegócio.',
  keywords: ['drones agrícolas', 'curso drone', 'pulverização drone', 'mapeamento NDVI', 'ECR Drones'],
  openGraph: {
    title: 'ECR Drones — Cursos de Drones Agrícolas',
    description: 'Aprenda a operar drones agrícolas com os melhores especialistas do Brasil.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${outfit.variable} ${inter.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  )
}
