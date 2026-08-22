import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

function normalize(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

export async function GET(request: NextRequest) {
  const response = await fetch('https://beverly.es/products.json?limit=250', {
    cache: 'no-store',
    headers: {
      'User-Agent': 'GHC-Nutrition-Legal-Audit/1.0',
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    return NextResponse.json({ error: 'Beverly catalog unavailable', status: response.status }, { status: 502 })
  }

  const payload = await response.json() as {
    products?: Array<{
      id?: number
      title?: string
      handle?: string
      body_html?: string
      vendor?: string
      product_type?: string
      tags?: string[]
      variants?: Array<{ title?: string; sku?: string }>
    }>
  }

  const query = normalize(request.nextUrl.searchParams.get('q') || '')
  const terms = query.split(' ').filter(Boolean)

  const source = (payload.products || []).filter((product) => {
    if (!terms.length) return true
    const haystack = normalize(`${product.title || ''} ${product.handle || ''}`)
    return terms.every((term) => haystack.includes(term))
  })

  const products = source.slice(0, 20).map((product) => ({
    id: product.id,
    title: product.title,
    handle: product.handle,
    body_html: product.body_html,
    vendor: product.vendor,
    product_type: product.product_type,
    tags: product.tags,
    variants: product.variants?.map((variant) => ({ title: variant.title, sku: variant.sku })),
  }))

  return NextResponse.json({ count: products.length, products })
}
