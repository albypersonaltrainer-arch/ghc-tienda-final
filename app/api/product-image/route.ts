import { NextRequest, NextResponse } from 'next/server'

const ALLOWED_HOST = 'beverly.es'
const REQUEST_HEADERS = {
  'User-Agent': 'GHC-Nutrition-Catalog/1.0',
  Accept: 'text/html',
}

function decodeHtml(value: string) {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
}

async function findProductUrl(name: string) {
  const searchUrl = new URL('https://beverly.es/search')
  searchUrl.searchParams.set('q', name)
  searchUrl.searchParams.set('type', 'product')

  const response = await fetch(searchUrl, {
    next: { revalidate: 21600 },
    headers: REQUEST_HEADERS,
  })
  if (!response.ok) return null

  const html = await response.text()
  const links = [...html.matchAll(/href=["'](\/products\/[^"'?#]+)["']/gi)]
  const path = links[0]?.[1]
  return path ? new URL(path, 'https://beverly.es') : null
}

async function resolveProductUrl(request: NextRequest) {
  const source = request.nextUrl.searchParams.get('url')
  const name = request.nextUrl.searchParams.get('name')?.trim()

  if (source) {
    try {
      const url = new URL(source)
      if (
        url.protocol === 'https:' &&
        url.hostname === ALLOWED_HOST &&
        url.pathname.startsWith('/products/')
      ) return url
    } catch {
      return null
    }
  }

  if (name && name.length <= 140) return findProductUrl(name)
  return null
}

export async function GET(request: NextRequest) {
  try {
    const productUrl = await resolveProductUrl(request)
    if (!productUrl) return new NextResponse('Official product not found', { status: 404 })

    const response = await fetch(productUrl, {
      next: { revalidate: 21600 },
      headers: REQUEST_HEADERS,
    })
    if (!response.ok) return new NextResponse('Official product page unavailable', { status: 502 })

    const html = await response.text()
    const match =
      html.match(/<meta[^>]+property=["']og:image(?::secure_url)?["'][^>]+content=["']([^"']+)["']/i) ||
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image(?::secure_url)?["']/i)

    if (!match?.[1]) return new NextResponse('Official product image not found', { status: 404 })

    let image = decodeHtml(match[1])
    if (image.startsWith('//')) image = `https:${image}`
    const imageUrl = new URL(image)
    if (imageUrl.protocol !== 'https:') return new NextResponse('Invalid official image', { status: 502 })

    return NextResponse.redirect(imageUrl, {
      status: 307,
      headers: {
        'Cache-Control': 'public, s-maxage=21600, stale-while-revalidate=86400',
      },
    })
  } catch {
    return new NextResponse('Unable to resolve official product image', { status: 502 })
  }
}
