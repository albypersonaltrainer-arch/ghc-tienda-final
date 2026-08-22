import { NextRequest, NextResponse } from 'next/server'

const ALLOWED_HOST = 'beverly.es'
const REQUEST_HEADERS = {
  'User-Agent': 'GHC-Nutrition-Catalog/1.0',
  Accept: 'text/html,application/json',
}

type PredictiveProduct = {
  url?: string
  image?: string
  featured_image?: string | { url?: string }
}

function decodeHtml(value: string) {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
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

async function findImageByName(name: string) {
  const searchUrl = new URL('https://beverly.es/search/suggest.json')
  searchUrl.searchParams.set('q', name)
  searchUrl.searchParams.set('resources[type]', 'product')
  searchUrl.searchParams.set('resources[limit]', '5')

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
  const product = products[0]
  if (!product) return null

  const featured = typeof product.featured_image === 'string'
    ? product.featured_image
    : product.featured_image?.url

  return featured || product.image || null
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
    if (!image && name && name.length <= 140) image = await findImageByName(name)

    if (!image) return new NextResponse('Official product image not found', { status: 404 })
    return safeImageResponse(image)
  } catch {
    return new NextResponse('Unable to resolve official product image', { status: 502 })
  }
}
