import type { Metadata } from 'next'
import { Exo_2, Inter } from 'next/font/google'
import './globals.css'

const exo2 = Exo_2({
  subsets: ['latin'],
  variable: '--font-exo-2',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'ECR Drones — Escola de Capacitação Rural em Drones',
  description:
    'Domine a tecnologia de drones agrícolas com a ECR Drones: mapeamento NDVI, pulverização autônoma e legislação ANAC. Terra + Tecnologia + Elevação.',
  keywords: ['drones agrícolas', 'curso drone', 'pulverização drone', 'mapeamento NDVI', 'ECR Drones', 'capacitação rural'],
  openGraph: {
    title: 'ECR Drones — Capacitação Tecnológica para o Agronegócio',
    description: 'Capacitação prática em drones de pulverização e mapeamento aéreo com foco no campo.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${exo2.variable} ${inter.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  )
}
