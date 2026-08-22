import { NextResponse } from 'next/server'
import { isCommerceDatabaseConfigured } from '@/lib/supabase-rest'

export const dynamic = 'force-dynamic'

export async function GET() {
  const sumupConfigured = Boolean(process.env.SUMUP_API_KEY && process.env.SUMUP_MERCHANT_CODE)
  const databaseConfigured = isCommerceDatabaseConfigured()

  return NextResponse.json({
    status: sumupConfigured && databaseConfigured ? 'ready' : 'degraded',
    storefront: true,
    commerce: {
      sumupConfigured,
      databaseConfigured,
    },
  })
}
