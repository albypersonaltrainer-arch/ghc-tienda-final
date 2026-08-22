import { NextRequest, NextResponse } from 'next/server'
import { findOrderByCheckoutId, findOrderByReference, settleOrder, updateOrder } from '@/lib/order-store'
import { isCommerceDatabaseConfigured } from '@/lib/supabase-rest'

export const runtime = 'nodejs'

type SumUpWebhook = {
  event_type?: string
  id?: string
}

type SumUpCheckout = {
  id?: string
  checkout_reference?: string
  status?: 'PENDING' | 'PAID' | 'FAILED' | 'EXPIRED'
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.SUMUP_API_KEY

  if (!apiKey || !isCommerceDatabaseConfigured()) {
    return new NextResponse(null, { status: 503 })
  }

  let payload: SumUpWebhook
  try {
    payload = await request.json()
  } catch {
    return new NextResponse(null, { status: 400 })
  }

  if (payload.event_type !== 'CHECKOUT_STATUS_CHANGED' || !payload.id) {
    // SumUp recomienda ignorar silenciosamente eventos desconocidos.
    return new NextResponse(null, { status: 204 })
  }

  try {
    // El webhook no se considera fuente de verdad por sí solo.
    // Verificamos siempre el checkout contra la API de SumUp.
    const response = await fetch(`https://api.sumup.com/v0.1/checkouts/${encodeURIComponent(payload.id)}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
      cache: 'no-store',
    })

    if (!response.ok) {
      console.error('Could not verify SumUp webhook checkout', response.status)
      return new NextResponse(null, { status: 502 })
    }

    const checkout = (await response.json()) as SumUpCheckout
    if (!checkout.id || !checkout.checkout_reference || !checkout.status) {
      return new NextResponse(null, { status: 204 })
    }

    let order = await findOrderByCheckoutId(checkout.id)
    if (!order) {
      order = await findOrderByReference(checkout.checkout_reference)
      if (order && !order.sumup_checkout_id) {
        await updateOrder(order.id, { sumup_checkout_id: checkout.id })
        order = { ...order, sumup_checkout_id: checkout.id }
      }
    }

    if (!order) {
      console.error('SumUp webhook has no matching GHC order', checkout.checkout_reference)
      return new NextResponse(null, { status: 204 })
    }

    await settleOrder(order, checkout.status)
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('SumUp webhook processing failed', error)
    return new NextResponse(null, { status: 500 })
  }
}
