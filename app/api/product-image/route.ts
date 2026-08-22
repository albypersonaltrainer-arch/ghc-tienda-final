import { NextRequest, NextResponse } from 'next/server'

const ALLOWED_HOST = 'beverly.es'

function decodeHtml(value: string) {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
}

export async function GET(request: NextRequest) {
  const source = request.nextUrl.searchParams.get('url')

  if (!source) {
    return new NextResponse('Missing product URL', { status: 400 })
  }

  let productUrl: URL
  try {
    productUrl = new URL(source)
  } catch {
    return new NextResponse('Invalid product URL', { status: 400 })
  }

  if (
    productUrl.protocol !== 'https:' ||
    productUrl.hostname !== ALLOWED_HOST ||
    !productUrl.pathname.startsWith('/products/')
  ) {
    return new NextResponse('Product URL not allowed', { status: 403 })
  }

  try {
    const response = await fetch(productUrl, {
      next: { revalidate: 21600 },
      headers: {
        'User-Agent': 'GHC-Nutrition-Catalog/1.0',
        Accept: 'text/html',
      },
    })

    if (!response.ok) {
      return new NextResponse('Official product page unavailable', { status: 502 })
    }

    const html = await response.text()
    const match =
      html.match(/<meta[^>]+property=["']og:image(?::secure_url)?["'][^>]+content=["']([^"']+)["']/i) ||
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image(?::secure_url)?["']/i)

    if (!match?.[1]) {
      return new NextResponse('Official product image not found', { status: 404 })
    }

    let image = decodeHtml(match[1])
    if (image.startsWith('//')) image = `https:${image}`

    const imageUrl = new URL(image)
    if (imageUrl.protocol !== 'https:') {
      return new NextResponse('Invalid official image', { status: 502 })
    }

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
