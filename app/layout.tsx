import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'GHC Nutrition | Suplementación con criterio',
  description: 'Suplementación deportiva seleccionada por GHC: rendimiento, recuperación y salud activa. Envío gratis desde 70 €.',
  applicationName: 'GHC Nutrition',
  metadataBase: new URL('https://ghcnutrition.com'),
  openGraph: {
    title: 'GHC Nutrition | Suplementación con criterio',
    description: 'No vendemos botes. Recomendamos herramientas.',
    type: 'website',
    locale: 'es_ES',
    siteName: 'GHC Nutrition',
  },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className={`${geist.className} antialiased`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
