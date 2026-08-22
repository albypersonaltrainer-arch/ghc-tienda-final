import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const checks = {
    vercel: {
      sumupApiConfigured: Boolean(process.env.SUMUP_API_KEY),
      sumupMerchantConfigured: Boolean(process.env.SUMUP_MERCHANT_CODE),
      supabaseConfigured: Boolean(process.env.SUPABASE_URL && (process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY)),
    },
    supabaseEdge: null as null | Record<string, unknown>,
  }

  try {
    const response = await fetch('https://oqlxvesnjdkxlxwxkikq.supabase.co/functions/v1/nutrition-health', { cache: 'no-store' })
    checks.supabaseEdge = response.ok ? await response.json() : { status: 'unreachable', httpStatus: response.status }
  } catch {
    checks.supabaseEdge = { status: 'unreachable' }
  }

  return NextResponse.json(checks, { headers: { 'cache-control': 'no-store' } })
}
