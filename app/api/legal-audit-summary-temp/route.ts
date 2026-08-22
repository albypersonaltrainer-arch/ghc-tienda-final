import { NextRequest, NextResponse } from 'next/server'
import { catalog } from '@/lib/catalog'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin
  const results = await Promise.all(
    catalog.map(async (product) => {
      const flavor = product.flavors[0] || ''
      try {
        const url = new URL('/api/product-legal-info', origin)
        url.searchParams.set('name', product.name)
        url.searchParams.set('flavor', flavor)
        const response = await fetch(url, { cache: 'no-store' })
        const info = await response.json() as {
          legalReady?: boolean
          reason?: string
          missing?: string[]
          officialTitle?: string
        }
        return {
          id: product.id,
          name: product.name,
          flavor,
          legalReady: info.legalReady === true,
          reason: info.reason || null,
          missing: info.missing || [],
          officialTitle: info.officialTitle || null,
        }
      } catch {
        return {
          id: product.id,
          name: product.name,
          flavor,
          legalReady: false,
          reason: 'AUDIT_REQUEST_FAILED',
          missing: [],
          officialTitle: null,
        }
      }
    }),
  )

  return NextResponse.json({
    total: results.length,
    ready: results.filter((item) => item.legalReady).length,
    blocked: results.filter((item) => !item.legalReady).length,
    results,
  })
}
