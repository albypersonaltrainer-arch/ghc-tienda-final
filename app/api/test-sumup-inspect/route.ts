import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

const CHECKOUT_ID = '5b88e3aa-6826-452e-b960-e3836f91e141'

export async function GET() {
  const apiKey = process.env.SUMUP_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'not_configured' }, { status: 503 })

  const response = await fetch(`https://api.sumup.com/v0.1/checkouts/${CHECKOUT_ID}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
    cache: 'no-store',
  })

  const payload = await response.json().catch(() => ({})) as Record<string, unknown>
  const transactions = Array.isArray(payload.transactions)
    ? payload.transactions.map((raw) => {
        const tx = raw as Record<string, unknown>
        return {
          status: tx.status ?? null,
          transaction_code: tx.transaction_code ?? null,
          payment_type: tx.payment_type ?? null,
          entry_mode: tx.entry_mode ?? null,
          result: tx.result ?? null,
          failure_reason: tx.failure_reason ?? null,
          decline_reason: tx.decline_reason ?? null,
        }
      })
    : []

  return NextResponse.json({
    httpStatus: response.status,
    id: payload.id ?? null,
    status: payload.status ?? null,
    amount: payload.amount ?? null,
    currency: payload.currency ?? null,
    transactions,
    topLevelKeys: Object.keys(payload).sort(),
  })
}
