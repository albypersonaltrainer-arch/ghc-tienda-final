import { randomUUID } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import {
  FREE_SHIPPING_THRESHOLD,
  getShippingCost,
  isSupportedPostalCode,
  normalizeCode,
} from '@/lib/commerce'
import { getProduct } from '@/lib/catalog'
import {
  createPendingOrder,
  getActiveCoupon,
  getActiveTrainerPartner,
  reserveCoupon,
  settleOrder,
  updateOrder,
  upsertCustomer,
} from '@/lib/order-store'
import { isCommerceDatabaseConfigured } from '@/lib/supabase-rest'

export const runtime = 'nodejs'

const TERMS_VERSION = 'GHC_NUTRITION_ES_2026_08_22'
const PRIVACY_VERSION = 'GHC_NUTRITION_PRIVACY_ES_2026_08_22'
const RETURNS_VERSION = 'GHC_NUTRITION_RETURNS_ES_2026_08_22'
const ALLOWED_ECOSYSTEM_SOURCES = new Set(['ghctraining', 'ghcacademy'])

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

type LegalInput = {
  termsAccepted?: boolean
  privacyAcknowledged?: boolean
  returnsAcknowledged?: boolean
  termsVersion?: string
  privacyVersion?: string
  returnsVersion?: string
}

type EcosystemAttribution = {
  sourceChannel: 'ghc-ecosystem'
  sourceDetail: 'ghctraining' | 'ghcacademy'
  campaignCode: 'GHC_ECOSYSTEM'
}

function clean(value: unknown, maxLength = 120) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

function trainerCodeFromReferer(request: NextRequest) {
  const referer = request.headers.get('referer')
  if (!referer) return ''

  try {
    const url = new URL(referer)
    if (url.origin !== request.nextUrl.origin) return ''
    return normalizeCode(url.searchParams.get('coach') || '')
  } catch {
    return ''
  }
}

function ecosystemAttributionFromReferer(request: NextRequest): EcosystemAttribution | null {
  const referer = request.headers.get('referer')
  if (!referer) return null

  try {
    const url = new URL(referer)
    if (url.origin !== request.nextUrl.origin) return null

    const source = url.searchParams.get('utm_source') || ''
    const medium = url.searchParams.get('utm_medium') || ''
    const campaign = url.searchParams.get('utm_campaign') || ''

    if (!ALLOWED_ECOSYSTEM_SOURCES.has(source)) return null
    if (medium !== 'ecosystem' || campaign !== 'ghc_ecosystem') return null

    return {
      sourceChannel: 'ghc-ecosystem',
      sourceDetail: source as EcosystemAttribution['sourceDetail'],
      campaignCode: 'GHC_ECOSYSTEM',
    }
  } catch {
    return null
  }
}

function buildOrderDescription(
  items: Array<{ name: string; flavor: string; quantity: number }>,
  referral: string,
  couponCode: string,
  trainerCode: string,
) {
  const products = items
    .map((item) => `${item.quantity}x ${item.name} (${item.flavor})`)
    .join('; ')

  return [
    products,
    referral ? `Ref: ${referral}` : '',
    trainerCode ? `Coach: ${trainerCode}` : '',
    couponCode ? `Cupón: ${couponCode}` : '',
  ]
    .filter(Boolean)
    .join(' | ')
    .slice(0, 255)
}

async function verifyFoodInformation(
  request: NextRequest,
  items: Array<{ name: string; flavor: string }>,
) {
  const unique = [...new Map(items.map((item) => [`${item.name}::${item.flavor}`, item])).values()]

  const checks = await Promise.all(
    unique.map(async (item) => {
      try {
        const url = new URL('/api/product-legal-info', request.nextUrl.origin)
        url.searchParams.set('name', item.name)
        url.searchParams.set('flavor', item.flavor)
        const response = await fetch(url, { cache: 'no-store' })
        const payload = await response.json().catch(() => ({})) as {
          legalReady?: boolean
          missing?: string[]
          reason?: string
        }
        return {
          ...item,
          legalReady: response.ok && payload.legalReady === true,
          missing: payload.missing || [],
          reason: payload.reason || null,
        }
      } catch {
        return {
          ...item,
          legalReady: false,
          missing: [],
          reason: 'OFFICIAL_SOURCE_UNAVAILABLE',
        }
      }
    }),
  )

  return checks.filter((item) => !item.legalReady)
}

export async function POST(request: NextRequest) {
  let body: {
    items?: CheckoutItem[]
    customer?: CustomerInput
    referral?: string | null
    couponCode?: string | null
    trainerCode?: string | null
    legal?: LegalInput
  }

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Petición no válida.' }, { status: 400 })
  }

  const legal = body.legal || {}
  const currentLegalAcceptance =
    legal.termsAccepted === true &&
    legal.privacyAcknowledged === true &&
    legal.returnsAcknowledged === true &&
    legal.termsVersion === TERMS_VERSION &&
    legal.privacyVersion === PRIVACY_VERSION &&
    legal.returnsVersion === RETURNS_VERSION

  if (!currentLegalAcceptance) {
    return NextResponse.json(
      {
        error: 'Debes aceptar las condiciones legales vigentes antes de realizar un pedido con obligación de pago.',
        code: 'LEGAL_ACCEPTANCE_REQUIRED',
      },
      { status: 400 },
    )
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
    pvpPrice: number
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
      pvpPrice: product.regularPrice ?? product.price,
    })
  }

  const blockedFoodItems = await verifyFoodInformation(request, normalizedItems)
  if (blockedFoodItems.length) {
    return NextResponse.json(
      {
        error: 'Una o más referencias no disponen todavía de toda la información alimentaria precontractual verificada. Se ha bloqueado el pago para proteger al comprador y a GHC Nutrition.',
        code: 'FOOD_INFO_NOT_VERIFIED',
        products: blockedFoodItems.map((item) => ({
          name: item.name,
          flavor: item.flavor,
          missing: item.missing,
          reason: item.reason,
        })),
      },
      { status: 409 },
    )
  }

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

  if (!isCommerceDatabaseConfigured()) {
    return NextResponse.json(
      {
        error: 'La base de datos de pedidos todavía no está conectada.',
        code: 'SUPABASE_NOT_CONFIGURED',
      },
      { status: 503 },
    )
  }

  const customer = body.customer || {}
  const firstName = clean(customer.firstName, 80)
  const lastName = clean(customer.lastName, 100)
  const email = clean(customer.email, 160).toLowerCase()
  const phone = clean(customer.phone, 40)
  const addressLine = clean(customer.addressLine, 160)
  const city = clean(customer.city, 100)
  const postalCode = clean(customer.postalCode, 5)
  const state = clean(customer.state, 100) || 'Madrid'
  const country = (clean(customer.country, 2) || 'ES').toUpperCase()

  if (
    !firstName ||
    !lastName ||
    !email ||
    !email.includes('@') ||
    !phone ||
    !addressLine ||
    !city ||
    !postalCode
  ) {
    return NextResponse.json(
      { error: 'Revisa los datos básicos de contacto y entrega.' },
      { status: 400 },
    )
  }

  if (country !== 'ES' || !isSupportedPostalCode(postalCode)) {
    return NextResponse.json(
      {
        error: 'Por ahora GHC Nutrition entrega únicamente en Madrid y municipios cercanos.',
        code: 'OUTSIDE_SERVICE_AREA',
      },
      { status: 400 },
    )
  }

  const subtotalCents = normalizedItems.reduce(
    (sum, item) => sum + Math.round(item.unitPrice * 100) * item.quantity,
    0,
  )

  const pvpSubtotalCents = normalizedItems.reduce(
    (sum, item) => sum + Math.round(item.pvpPrice * 100) * item.quantity,
    0,
  )

  if (subtotalCents <= 0 || subtotalCents > 500_000 || pvpSubtotalCents <= 0) {
    return NextResponse.json({ error: 'El importe del pedido no es válido.' }, { status: 400 })
  }

  const shippingCents = Math.round(getShippingCost(subtotalCents / 100) * 100)
  const referral = normalizeCode(clean(body.referral, 40))
  const couponCode = normalizeCode(clean(body.couponCode, 40))
  const requestedTrainerCode =
    normalizeCode(clean(body.trainerCode, 40)) || trainerCodeFromReferer(request)
  const ecosystemAttribution = ecosystemAttributionFromReferer(request)
  const checkoutReference = `GHC-${Date.now()}-${randomUUID().slice(0, 8)}`
  const sumupCustomerId = `ghc_${randomUUID().replaceAll('-', '')}`
  const acceptedAt = new Date().toISOString()

  let order: Awaited<ReturnType<typeof createPendingOrder>> | null = null

  try {
    const customerRecord = await upsertCustomer({ firstName, lastName, email, phone })

    const coupon = couponCode ? await getActiveCoupon(couponCode, customerRecord.id) : null
    if (couponCode && !coupon) {
      return NextResponse.json(
        { error: 'El cupón no es válido, no pertenece a este email o ya ha sido utilizado.' },
        { status: 400 },
      )
    }

    const trainer = requestedTrainerCode
      ? await getActiveTrainerPartner(requestedTrainerCode)
      : null

    const discountCents = coupon
      ? Math.floor((subtotalCents * coupon.percent) / 100)
      : 0
    const totalCents = subtotalCents + shippingCents - discountCents

    if (totalCents <= 0) {
      return NextResponse.json({ error: 'El total del pedido no es válido.' }, { status: 400 })
    }

    const trainerCommissionPercent = trainer?.commission_percent ?? null
    const trainerCommissionBaseCents = trainer ? pvpSubtotalCents : null
    const trainerCommissionCents = trainer
      ? Math.floor((pvpSubtotalCents * trainer.commission_percent) / 100)
      : null

    order = await createPendingOrder({
      checkoutReference,
      customerId: customerRecord.id,
      subtotalCents,
      shippingCents,
      discountCents,
      totalCents,
      couponId: coupon?.id || null,
      couponCode: coupon?.code || null,
      referralCode: referral || null,
      trainerPartnerId: trainer?.id || null,
      trainerCode: trainer?.code || null,
      trainerCommissionPercent,
      trainerCommissionBaseCents,
      trainerCommissionCents,
      addressLine,
      city,
      postalCode,
      state,
      country,
      legalAcceptances: [
        { acceptanceType: 'terms', documentVersion: TERMS_VERSION, acceptedAt },
        { acceptanceType: 'privacy_notice', documentVersion: PRIVACY_VERSION, acceptedAt },
        { acceptanceType: 'returns_notice', documentVersion: RETURNS_VERSION, acceptedAt },
      ],
      items: normalizedItems.map((item) => ({
        productId: item.productId,
        name: item.name,
        flavor: item.flavor,
        quantity: item.quantity,
        unitPriceCents: Math.round(item.unitPrice * 100),
        unitPvpCents: Math.round(item.pvpPrice * 100),
      })),
    })

    if (ecosystemAttribution) {
      try {
        await updateOrder(order.id, {
          source_channel: ecosystemAttribution.sourceChannel,
          source_detail: ecosystemAttribution.sourceDetail,
          campaign_code: ecosystemAttribution.campaignCode,
        })
      } catch (attributionError) {
        console.error('Could not persist GHC ecosystem attribution', attributionError)
      }
    }

    if (coupon && !(await reserveCoupon(coupon.id, order.id))) {
      await updateOrder(order.id, { status: 'CANCELLED' })
      return NextResponse.json(
        { error: 'Ese cupón acaba de ser utilizado en otro pedido.' },
        { status: 409 },
      )
    }

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
      await settleOrder(order, 'FAILED')
      return NextResponse.json(
        { error: 'No se pudieron registrar los datos del pedido en SumUp.' },
        { status: 502 },
      )
    }

    const redirectUrl = new URL('/checkout/resultado', request.nextUrl.origin)
    redirectUrl.searchParams.set('ref', checkoutReference)

    const webhookUrl = new URL('/api/sumup/webhook', request.nextUrl.origin)
    const description = buildOrderDescription(
      normalizedItems,
      referral,
      coupon?.code || '',
      trainer?.code || '',
    )

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
        customer_id: sumupCustomerId,
        redirect_url: redirectUrl.toString(),
        return_url: webhookUrl.toString(),
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

    if (!checkoutResponse.ok || !checkout.hosted_checkout_url || !checkout.id) {
      console.error('SumUp checkout creation failed', checkoutResponse.status, checkout)
      await settleOrder(order, 'FAILED')
      return NextResponse.json(
        { error: 'SumUp no ha podido crear el pago.' },
        { status: 502 },
      )
    }

    await updateOrder(order.id, { sumup_checkout_id: checkout.id })

    return NextResponse.json({
      checkoutUrl: checkout.hosted_checkout_url,
      checkoutId: checkout.id,
      checkoutReference,
      subtotal: subtotalCents / 100,
      shipping: shippingCents / 100,
      discount: discountCents / 100,
      amount: totalCents / 100,
      freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
      trainerAttributed: Boolean(trainer),
      trainerCode: trainer?.code || null,
      ecosystemSource: ecosystemAttribution?.sourceDetail || null,
    })
  } catch (error) {
    console.error('Checkout error', error)
    if (order) {
      try {
        await settleOrder(order, 'FAILED')
      } catch (settleError) {
        console.error('Could not mark failed order', settleError)
      }
    }
    return NextResponse.json(
      { error: 'No se ha podido iniciar el pedido.' },
      { status: 502 },
    )
  }
}
