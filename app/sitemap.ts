import type { MetadataRoute } from 'next'

const BASE_URL = 'https://www.ghcnutrition.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const routes = [
    '',
    '/info/faq',
    '/info/envios',
    '/info/devoluciones',
    '/info/contacto',
    '/info/terminos',
    '/info/privacidad',
    '/info/cookies',
  ]

  return routes.map((route, index) => ({
    url: `${BASE_URL}${route}`,
    lastModified: now,
    changeFrequency: index === 0 ? 'weekly' : 'monthly',
    priority: index === 0 ? 1 : 0.5,
  }))
}
