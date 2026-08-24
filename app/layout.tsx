import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import HeroCarouselV4 from '@/app/components/HeroCarouselV4'
import CheckoutLegalGuard from '@/app/components/CheckoutLegalGuard'
import ProductComplianceGuard from '@/app/components/ProductComplianceGuard'
import DeliveryTimingGuard from '@/app/components/DeliveryTimingGuard'
import GHCEcosystemLinks from '@/app/components/GHCEcosystemLinks'
import './globals.css'
import './mobile-fixes.css'

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://www.ghcnutrition.com'),
  title: {
    default: 'GHC Nutrition | Suplementación deportiva con criterio',
    template: '%s | GHC Nutrition',
  },
  description:
    'Suplementación deportiva seleccionada para rendimiento, recuperación y salud activa. Distribuidor oficial Beverly Nutrition.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'GHC Nutrition',
    description: 'Suplementación deportiva con criterio.',
    url: 'https://www.ghcnutrition.com',
    siteName: 'GHC Nutrition',
    locale: 'es_ES',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${geist.variable} font-sans antialiased`}>
        {children}
        <GHCEcosystemLinks />
        <HeroCarouselV4 />
        <CheckoutLegalGuard />
        <ProductComplianceGuard />
        <DeliveryTimingGuard />
      </body>
    </html>
  )
}
