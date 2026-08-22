import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET() {
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

  const products = (payload.products || []).map((product) => ({
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
