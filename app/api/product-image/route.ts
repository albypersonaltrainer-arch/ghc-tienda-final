import { NextRequest, NextResponse } from 'next/server'

const ALLOWED_HOST = 'beverly.es'
const REQUEST_HEADERS = {
  'User-Agent': 'GHC-Nutrition-Catalog/1.0',
  Accept: 'text/html,application/json',
}

/**
 * El catálogo GHC conserva nombres/referencias de la tarifa profesional.
 * Beverly usa en la web pública títulos distintos en varias familias.
 * Este mapa traduce las búsquedas internas al título real publicado por Beverly
 * para que el packshot salga siempre de su Shopify/CDN oficial.
 */
const BEVERLY_TITLE_ALIASES: Record<string, string> = {
  'whey pro concentrate choco cookies lacprodan 2kg': 'Whey Pro Concentrate - 2 Kg - Choco Cookies',
  'casein professional choco 1kg': 'Caseína Micelar - 1 Kg - Choco Cookies',
  'vegan delicatesse choco cookies 900g': 'Vegan Protein - 900 g - Choco Cookies',
  'creatine monohidrate 500': 'Creatina Monohidrato - 500 g - Unflavored',
  'bcaa 8 1 1 branched aminoacids blue lollipop 300gr': 'BCAA 8:1:1 + L-Glutamina - 300 g - Blue Lollipop',
  'm a p essential aminoacids blue lollipop 300 gr': 'MAP - Aminoácidos esenciales - 300 g - Blue Lollipop',
  'dynamite preworkout fruit punch 375 gr': 'Dynamite Pre Workout - 375 g - 25 Servings - Fruit Punch',
  'energy pro caffeine l taurine 90 caps': 'Energy Pro - Cafeína + Taurina - 90 Caps - 90 Servings',
  'vitamin complex 90 caps': 'Vitamin Complex multivitamínico y mineral - 90 Caps - 90 Servicios',
  'isolate cfm choco cookies 1kg lacprodan': 'Isolate CFM Professional - 1 Kg - Choco Cookies',
  'isolate cfm choco cookies 2kg lacprodan': 'Isolate CFM Professional - 2 Kg - Choco Cookies',
  'hydro protein choco cookies 1kg': 'Hydro Protein - 1 Kg - Choco Cookies',
  'hydrolyzed zero professional chocolate 2kg': 'Hydro Protein Professional - 2 Kg - Chocolate',
  'isolate clear profess caribbean cooler 500g lacprodan': 'Clear Isolate Protein - 500 g - Orange Mango',
  'pure whey unflavored lacprodan 1kg': 'Pure Whey - 1 Kg',
  'whey pro concentrate choco cookies 1kg lacprodan': 'Whey Pro Concentrate - 1 Kg - Choco Cookies',
  'creatine creapure 300g': 'Creatina Monohidrato Creapure® - 300 g - Unflavored',
  'creatine creapure q10 watermelon 300 gr': 'Creatina Monohidrato Creapure® + Coenzima Q10 - 300 g - Sandía',
  'nac n acetil l cysteine vit c zinc 90 caps': 'NAC + Vitamina C + Zinc - 60 Caps - 30 Servicios',
  'l glutamine kyowa neutra 300gr': 'L-Glutamina Kyowa® - 300 g - Unflavored',
  'magnesium bisglycinate 90 caps': 'Bisglicinato de Magnesio + Vitamin B6 - 90 Caps - 90 Servicios',
  'vitamin d3 k2 60 vegan caps': 'Vitamina D3 + K2 - 60 Caps - 60 Servicios',
  'ashwagandha ksm 66 magnesio l teanina rhodiola 60 vegan caps': 'Ashwagandha KSM-66 + Magnesio, L-Teanina & Rhodiola - 60 Caps',
  'b complex 100 60 tabs': 'B-Complex - 60 Caps - 60 Servicios',
  'women protein shake chocolate 1kg': 'Women Protein Shake - 1 Kg - Capuccino',
  'collagen beauty health biotina acido hialuronico vit c zinc 20 viales': 'Collagen For Her + Biotina, Vitamina C y Ácido hialurónico - Frutos del bosque - 20 Viales',
  'burner extreme sinetrol l carnitina naranja amarga 90 caps': 'Burner Extreme - Quemador de grasa - 90 Caps - 22 Servicios',
  'carni xtreme 4000 frutos rojos 20 shots': 'Carni Xtreme - Carnitina líquida Carnipure® - 20 viales - Frutos rojos',
  'energy go gel preworkout apple 12x73 2g': 'Energy Go Gel energético - 12 Sticks Gel - 73,2 g - Apple',
}

type PredictiveProduct = {
  title?: string
  url?: string
  image?: string
  featured_image?: string | { url?: string }
}

type ShopifyProduct = {
  title?: string
  handle?: string
  images?: Array<{ src?: string }>
}

function decodeHtml(value: string) {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
}

function normalize(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[®™©]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function canonicalSearchName(name: string) {
  return BEVERLY_TITLE_ALIASES[normalize(name)] || name
}

function safeImageResponse(image: string) {
  let candidate = decodeHtml(image)
  if (candidate.startsWith('//')) candidate = `https:${candidate}`

  const imageUrl = new URL(candidate)
  if (imageUrl.protocol !== 'https:') {
    return new NextResponse('Invalid official image', { status: 502 })
  }

  return NextResponse.redirect(imageUrl, {
    status: 307,
    headers: {
      'Cache-Control': 'public, s-maxage=21600, stale-while-revalidate=86400',
    },
  })
}

function imageFromPredictive(product?: PredictiveProduct) {
  if (!product) return null
  const featured = typeof product.featured_image === 'string'
    ? product.featured_image
    : product.featured_image?.url
  return featured || product.image || null
}

async function findImageByPredictiveSearch(rawName: string) {
  const name = canonicalSearchName(rawName)
  const searchUrl = new URL('https://beverly.es/search/suggest.json')
  searchUrl.searchParams.set('q', name)
  searchUrl.searchParams.set('resources[type]', 'product')
  searchUrl.searchParams.set('resources[limit]', '8')

  const response = await fetch(searchUrl, {
    next: { revalidate: 21600 },
    headers: REQUEST_HEADERS,
  })
  if (!response.ok) return null

  const payload = await response.json() as {
    resources?: {
      results?: { products?: PredictiveProduct[] }
      products?: PredictiveProduct[]
    }
  }
  const products = payload.resources?.results?.products || payload.resources?.products || []
  if (!products.length) return null

  const target = normalize(name)
  const best =
    products.find((product) => normalize(product.title || '') === target) ||
    products.find((product) => normalize(product.title || '').includes(target)) ||
    products[0]

  return imageFromPredictive(best)
}

async function findImageByCatalog(rawName: string) {
  const name = canonicalSearchName(rawName)
  const url = new URL('https://beverly.es/products.json')
  url.searchParams.set('limit', '250')

  const response = await fetch(url, {
    next: { revalidate: 21600 },
    headers: REQUEST_HEADERS,
  })
  if (!response.ok) return null

  const payload = await response.json() as { products?: ShopifyProduct[] }
  const products = payload.products || []
  const target = normalize(name)
  const targetWords = target.split(' ').filter((word) => word.length > 2)

  const exact = products.find((product) => normalize(product.title || '') === target)
  const contains = products.find((product) => {
    const title = normalize(product.title || '')
    return targetWords.length > 0 && targetWords.every((word) => title.includes(word))
  })
  const partial = products.find((product) => {
    const title = normalize(product.title || '')
    const matched = targetWords.filter((word) => title.includes(word)).length
    return targetWords.length > 0 && matched / targetWords.length >= 0.65
  })

  return exact?.images?.[0]?.src || contains?.images?.[0]?.src || partial?.images?.[0]?.src || null
}

async function imageFromProductUrl(source: string) {
  let productUrl: URL
  try {
    productUrl = new URL(source)
  } catch {
    return null
  }

  if (
    productUrl.protocol !== 'https:' ||
    productUrl.hostname !== ALLOWED_HOST ||
    !productUrl.pathname.startsWith('/products/')
  ) return null

  const response = await fetch(productUrl, {
    next: { revalidate: 21600 },
    headers: REQUEST_HEADERS,
  })
  if (!response.ok) return null

  const html = await response.text()
  const match =
    html.match(/<meta[^>]+property=["']og:image(?::secure_url)?["'][^>]+content=["']([^"']+)["']/i) ||
    html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image(?::secure_url)?["']/i)

  return match?.[1] || null
}

export async function GET(request: NextRequest) {
  try {
    const source = request.nextUrl.searchParams.get('url')
    const name = request.nextUrl.searchParams.get('name')?.trim()

    let image: string | null = null
    if (source) image = await imageFromProductUrl(source)
    if (!image && name && name.length <= 180) image = await findImageByPredictiveSearch(name)
    if (!image && name && name.length <= 180) image = await findImageByCatalog(name)

    if (!image) return new NextResponse('Official product image not found', { status: 404 })
    return safeImageResponse(image)
  } catch (error) {
    console.error('Unable to resolve Beverly official product image', error)
    return new NextResponse('Unable to resolve official product image', { status: 502 })
  }
}
