import { NextRequest, NextResponse } from 'next/server'
import { catalog } from '@/lib/catalog'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin
  const variants = catalog.flatMap((product) =>
    product.flavors.map((flavor) => ({
      id: product.id,
      name: product.name,
      flavor,
    })),
  )

  const results = await Promise.all(
    variants.map(async (variant) => {
      try {
        const url = new URL('/api/product-legal-info', origin)
        url.searchParams.set('name', variant.name)
        url.searchParams.set('flavor', variant.flavor)
        const response = await fetch(url, { cache: 'no-store' })
        const info = await response.json() as {
          legalReady?: boolean
          reason?: string
          missing?: string[]
          officialTitle?: string
          ingredientSourceType?: string | null
        }
        return {
          ...variant,
          legalReady: info.legalReady === true,
          reason: info.reason || null,
          missing: info.missing || [],
          officialTitle: info.officialTitle || null,
          ingredientSourceType: info.ingredientSourceType || null,
        }
      } catch {
        return {
          ...variant,
          legalReady: false,
          reason: 'AUDIT_REQUEST_FAILED',
          missing: [],
          officialTitle: null,
          ingredientSourceType: null,
        }
      }
    }),
  )

  const blocked = results.filter((item) => !item.legalReady)
  return NextResponse.json({
    products: catalog.length,
    variants: results.length,
    ready: results.filter((item) => item.legalReady).length,
    blocked: blocked.length,
    blockedResults: blocked,
    results,
  })
}
