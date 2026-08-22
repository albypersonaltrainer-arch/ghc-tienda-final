import { randomUUID } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { getProduct } from '@/lib/catalog'

export const runtime = 'nodejs'

type CheckoutItem = {
  productId?: string
  flavor?: string
  quantity?: number
}

type CustomerInput = {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  addressLine?: string
  city?: string
  postalCode?: string
  state?: string
  country?: string
}

function clean(value: unknown, maxLength = 120) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

function buildOrderDescription(
  items: Array<{ name: string; flavor: string; quantity: number }>,
  referral: string,
) {
  const products = items
    .map((item) => `${item.quantity}x ${item.name} (${item.flavor})`)
    .join('; ')

  return `${products}${referral ? ` | Ref: ${referral}` : ''}`.slice(0, 255)
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.SUMUP_API_KEY
  const merchantCode = process.env.SUMUP_MERCHANT_CODE

  if (!apiKey || !merchantCode) {
    return NextResponse.json(
      {
        error: 'La integración de SumUp todavía no está configurada.',
        code: 'SUMUP_NOT_CONFIGURED',
      },
      { status: 503 },
    )
  }

  let body: {
    items?: CheckoutItem[]
    customer?: CustomerInput
    referral?: string | null
  }

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Petición no válida.' }, { status: 400 })
  }

  if (!Array.isArray(body.items) || body.items.length === 0 || body.items.length > 40) {
    return NextResponse.json({ error: 'El carrito no es válido.' }, { status: 400 })
  }

  const normalizedItems: Array<{
    productId: string
    name: string
    flavor: string
    quantity: number
    unitPrice: number
  }> = []

  for (const rawItem of body.items) {
    const productId = clean(rawItem.productId, 80)
    const flavor = clean(rawItem.flavor, 80)
    const quantity = Number(rawItem.quantity)
    const product = getProduct(productId)

    if (!product) {
      return NextResponse.json({ error: 'Uno de los productos ya no está disponible.' }, { status: 400 })
    }

    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10) {
      return NextResponse.json({ error: 'La cantidad de un producto no es válida.' }, { status: 400 })
    }

    if (!product.flavors.includes(flavor)) {
      return NextResponse.json({ error: 'El formato o sabor seleccionado no es válido.' }, { status: 400 })
    }

    normalizedItems.push({
      productId,
      name: product.name,
      flavor,
      quantity,
      unitPrice: product.price,
    })
  }

  const customer = body.customer || {}
  const firstName = clean(customer.firstName, 80)
  const lastName = clean(customer.lastName, 100)
  const email = clean(customer.email, 160).toLowerCase()
  const phone = clean(customer.phone, 40)
  const addressLine = clean(customer.addressLine, 160)
  const city = clean(customer.city, 100)
  const postalCode = clean(customer.postalCode, 24)
  const state = clean(customer.state, 100)
  const country = clean(customer.country, 2).toUpperCase()

  if (
    !firstName ||
    !lastName ||
    !email ||
    !email.includes('@') ||
    !phone ||
    !addressLine ||
    !city ||
    !postalCode ||
    !state ||
    !/^[A-Z]{2}$/.test(country)
  ) {
    return NextResponse.json(
      { error: 'Revisa los datos de contacto y entrega.' },
      { status: 400 },
    )
  }

  const totalCents = normalizedItems.reduce(
    (sum, item) => sum + Math.round(item.unitPrice * 100) * item.quantity,
    0,
  )

  if (totalCents <= 0 || totalCents > 500_000) {
    return NextResponse.json({ error: 'El importe del pedido no es válido.' }, { status: 400 })
  }

  const referral = clean(body.referral, 80)
  const checkoutReference = `GHC-${Date.now()}-${randomUUID().slice(0, 8)}`
  const customerId = `ghc_${randomUUID().replaceAll('-', '')}`
  const description = buildOrderDescription(normalizedItems, referral)

  const authorization = {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  }

  try {
    const customerResponse = await fetch('https://api.sumup.com/v0.1/customers', {
      method: 'POST',
      headers: authorization,
      cache: 'no-store',
      body: JSON.stringify({
        customer_id: customerId,
        personal_details: {
          first_name: firstName,
          last_name: lastName,
          email,
          phone,
          address: {
            city,
            country,
            line_1: addressLine,
            postal_code: postalCode,
            state,
          },
        },
      }),
    })

    if (!customerResponse.ok) {
      const detail = await customerResponse.text()
      console.error('SumUp customer creation failed', customerResponse.status, detail)
      return NextResponse.json(
        { error: 'No se pudieron registrar los datos del pedido en SumUp.' },
        { status: 502 },
      )
    }

    const redirectUrl = new URL('/checkout/resultado', request.nextUrl.origin)
    redirectUrl.searchParams.set('ref', checkoutReference)

    const checkoutResponse = await fetch('https://api.sumup.com/v0.1/checkouts', {
      method: 'POST',
      headers: authorization,
      cache: 'no-store',
      body: JSON.stringify({
        checkout_reference: checkoutReference,
        amount: totalCents / 100,
        currency: 'EUR',
        merchant_code: merchantCode,
        description,
        customer_id: customerId,
        redirect_url: redirectUrl.toString(),
        hosted_checkout: {
          enabled: true,
        },
      }),
    })

    const checkout = (await checkoutResponse.json()) as {
      id?: string
      hosted_checkout_url?: string
      status?: string
      message?: string
    }

    if (!checkoutResponse.ok || !checkout.hosted_checkout_url) {
      console.error('SumUp checkout creation failed', checkoutResponse.status, checkout)
      return NextResponse.json(
        { error: 'SumUp no ha podido crear el pago.' },
        { status: 502 },
      )
    }

    return NextResponse.json({
      checkoutUrl: checkout.hosted_checkout_url,
      checkoutId: checkout.id,
      checkoutReference,
      amount: totalCents / 100,
    })
  } catch (error) {
    console.error('Checkout error', error)
    return NextResponse.json(
      { error: 'No se ha podido conectar con SumUp.' },
      { status: 502 },
    )
  }
}
