import { randomUUID } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { createPendingOrder, settleOrder, updateOrder, upsertCustomer } from '@/lib/order-store'
import { isCommerceDatabaseConfigured } from '@/lib/supabase-rest'

export const runtime = 'nodejs'

const TERMS_VERSION = 'GHC_NUTRITION_ES_2026_08_22'
const PRIVACY_VERSION = 'GHC_NUTRITION_PRIVACY_ES_2026_08_22'
const RETURNS_VERSION = 'GHC_NUTRITION_RETURNS_ES_2026_08_22'

export async function POST(request: NextRequest) {
  const apiKey = process.env.SUMUP_API_KEY
  const merchantCode = process.env.SUMUP_MERCHANT_CODE

  if (!apiKey || !merchantCode || !isCommerceDatabaseConfigured()) {
    return NextResponse.json({ error: 'Test checkout not configured.' }, { status: 503 })
  }

  const checkoutReference = `GHC-TEST-100-${Date.now()}-${randomUUID().slice(0, 8)}`
  const sumupCustomerId = `ghc_test_${randomUUID().replaceAll('-', '')}`
  const acceptedAt = new Date().toISOString()

  let order: Awaited<ReturnType<typeof createPendingOrder>> | null = null

  try {
    const customer = await upsertCustomer({
      firstName: 'GHC',
      lastName: 'Test',
      email: 'sumup-test@ghcacademy.net',
      phone: '600000000',
    })

    order = await createPendingOrder({
      checkoutReference,
      customerId: customer.id,
      subtotalCents: 100,
      shippingCents: 0,
      discountCents: 0,
      totalCents: 100,
      couponId: null,
      couponCode: null,
      referralCode: null,
      trainerPartnerId: null,
      trainerCode: null,
      trainerCommissionPercent: null,
      trainerCommissionBaseCents: null,
      trainerCommissionCents: null,
      addressLine: 'Pedido interno de prueba',
      city: 'Madrid',
      postalCode: '28001',
      state: 'Madrid',
      country: 'ES',
      legalAcceptances: [
        { acceptanceType: 'terms', documentVersion: TERMS_VERSION, acceptedAt },
        { acceptanceType: 'privacy_notice', documentVersion: PRIVACY_VERSION, acceptedAt },
        { acceptanceType: 'returns_notice', documentVersion: RETURNS_VERSION, acceptedAt },
      ],
      items: [
        {
          productId: 'sumup-test-100',
          name: 'Producto de prueba SumUp',
          flavor: 'Prueba interna',
          quantity: 1,
          unitPriceCents: 100,
          unitPvpCents: 100,
        },
      ],
    })

    const authorization = {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    }

    const customerResponse = await fetch('https://api.sumup.com/v0.1/customers', {
      method: 'POST',
      headers: authorization,
      cache: 'no-store',
      body: JSON.stringify({
        customer_id: sumupCustomerId,
        personal_details: {
          first_name: 'GHC',
          last_name: 'Test',
          email: 'sumup-test@ghcacademy.net',
          phone: '600000000',
          address: {
            city: 'Madrid',
            country: 'ES',
            line_1: 'Pedido interno de prueba',
            postal_code: '28001',
            state: 'Madrid',
          },
        },
      }),
    })

    if (!customerResponse.ok) {
      const detail = await customerResponse.text()
      console.error('SumUp test customer creation failed', customerResponse.status, detail)
      await settleOrder(order, 'FAILED')
      return NextResponse.json({ error: 'SumUp no pudo crear el cliente de prueba.' }, { status: 502 })
    }

    const redirectUrl = new URL('/checkout/resultado', request.nextUrl.origin)
    redirectUrl.searchParams.set('ref', checkoutReference)
    const webhookUrl = new URL('/api/sumup/webhook', request.nextUrl.origin)

    const checkoutResponse = await fetch('https://api.sumup.com/v0.1/checkouts', {
      method: 'POST',
      headers: authorization,
      cache: 'no-store',
      body: JSON.stringify({
        checkout_reference: checkoutReference,
        amount: 1,
        currency: 'EUR',
        merchant_code: merchantCode,
        description: 'GHC Nutrition · producto de prueba SumUp · 1,00 EUR',
        customer_id: sumupCustomerId,
        redirect_url: redirectUrl.toString(),
        return_url: webhookUrl.toString(),
        hosted_checkout: { enabled: true },
      }),
    })

    const checkout = (await checkoutResponse.json()) as {
      id?: string
      hosted_checkout_url?: string
      message?: string
    }

    if (!checkoutResponse.ok || !checkout.id || !checkout.hosted_checkout_url) {
      console.error('SumUp test checkout creation failed', checkoutResponse.status, checkout)
      await settleOrder(order, 'FAILED')
      return NextResponse.json({ error: checkout.message || 'SumUp no pudo crear el pago de prueba.' }, { status: 502 })
    }

    await updateOrder(order.id, { sumup_checkout_id: checkout.id })
    return NextResponse.redirect(checkout.hosted_checkout_url, 303)
  } catch (error) {
    console.error('SumUp 1.00 test checkout error', error)
    if (order) {
      try {
        await settleOrder(order, 'FAILED')
      } catch (settleError) {
        console.error('Could not mark test order failed', settleError)
      }
    }
    return NextResponse.json({ error: 'No se pudo iniciar la prueba de 1,00 €.' }, { status: 502 })
  }
}
