import 'server-only'

import { randomUUID } from 'crypto'
import {
  REFERRAL_REWARD_PERCENT,
  REFERRAL_REWARD_VALID_DAYS,
  normalizeCode,
} from '@/lib/commerce'
import { supabaseRest } from '@/lib/supabase-rest'

export type CustomerRecord = {
  id: string
  email: string
}

export type CouponRecord = {
  id: string
  code: string
  customer_id: string
  percent: number
  status: 'active' | 'reserved' | 'redeemed' | 'expired'
  expires_at: string
}

export type TrainerPartnerRecord = {
  id: string
  code: string
  name: string
  commission_percent: number
  active: boolean
}

export type OrderRecord = {
  id: string
  checkout_reference: string
  sumup_checkout_id: string | null
  customer_id: string
  status: 'PENDING' | 'PAID' | 'FAILED' | 'EXPIRED' | 'CANCELLED'
  subtotal_cents: number
  coupon_id: string | null
  referral_code: string | null
  trainer_partner_id: string | null
  trainer_code: string | null
  trainer_commission_percent: number | null
  trainer_commission_base_cents: number | null
  trainer_commission_cents: number | null
}

type CustomerInput = {
  firstName: string
  lastName: string
  email: string
  phone: string
}

const ORDER_SELECT = [
  'id',
  'checkout_reference',
  'sumup_checkout_id',
  'customer_id',
  'status',
  'subtotal_cents',
  'coupon_id',
  'referral_code',
  'trainer_partner_id',
  'trainer_code',
  'trainer_commission_percent',
  'trainer_commission_base_cents',
  'trainer_commission_cents',
].join(',')

export async function upsertCustomer(input: CustomerInput) {
  const rows = await supabaseRest<CustomerRecord[]>('customers?on_conflict=email', {
    method: 'POST',
    prefer: 'resolution=merge-duplicates,return=representation',
    body: JSON.stringify({
      email: input.email,
      first_name: input.firstName,
      last_name: input.lastName,
      phone: input.phone,
      updated_at: new Date().toISOString(),
    }),
  })

  if (!rows?.[0]) throw new Error('CUSTOMER_UPSERT_FAILED')
  return rows[0]
}

export async function getActiveCoupon(code: string, customerId: string) {
  const normalized = normalizeCode(code)
  if (!normalized) return null

  const now = encodeURIComponent(new Date().toISOString())
  const rows = await supabaseRest<CouponRecord[]>(
    `reward_coupons?code=eq.${encodeURIComponent(normalized)}&customer_id=eq.${encodeURIComponent(customerId)}&status=eq.active&expires_at=gt.${now}&select=id,code,customer_id,percent,status,expires_at&limit=1`,
  )

  return rows?.[0] || null
}

export async function getActiveTrainerPartner(code: string) {
  const normalized = normalizeCode(code)
  if (!normalized) return null

  const rows = await supabaseRest<TrainerPartnerRecord[]>(
    `trainer_partners?code=eq.${encodeURIComponent(normalized)}&active=eq.true&select=id,code,name,commission_percent,active&limit=1`,
  )

  return rows?.[0] || null
}

export async function createPendingOrder(input: {
  checkoutReference: string
  customerId: string
  subtotalCents: number
  shippingCents: number
  discountCents: number
  totalCents: number
  couponId: string | null
  couponCode: string | null
  referralCode: string | null
  trainerPartnerId: string | null
  trainerCode: string | null
  trainerCommissionPercent: number | null
  trainerCommissionBaseCents: number | null
  trainerCommissionCents: number | null
  addressLine: string
  city: string
  postalCode: string
  state: string
  country: string
  items: Array<{
    productId: string
    name: string
    flavor: string
    quantity: number
    unitPriceCents: number
  }>
}) {
  const orders = await supabaseRest<OrderRecord[]>('orders', {
    method: 'POST',
    prefer: 'return=representation',
    body: JSON.stringify({
      checkout_reference: input.checkoutReference,
      customer_id: input.customerId,
      status: 'PENDING',
      subtotal_cents: input.subtotalCents,
      shipping_cents: input.shippingCents,
      discount_cents: input.discountCents,
      total_cents: input.totalCents,
      coupon_id: input.couponId,
      coupon_code: input.couponCode,
      referral_code: input.referralCode,
      trainer_partner_id: input.trainerPartnerId,
      trainer_code: input.trainerCode,
      trainer_commission_percent: input.trainerCommissionPercent,
      trainer_commission_base_cents: input.trainerCommissionBaseCents,
      trainer_commission_cents: input.trainerCommissionCents,
      address_line: input.addressLine,
      city: input.city,
      postal_code: input.postalCode,
      state: input.state,
      country: input.country,
    }),
  })

  const order = orders?.[0]
  if (!order) throw new Error('ORDER_CREATE_FAILED')

  await supabaseRest('order_items', {
    method: 'POST',
    prefer: 'return=minimal',
    body: JSON.stringify(
      input.items.map((item) => ({
        order_id: order.id,
        product_id: item.productId,
        product_name: item.name,
        flavor: item.flavor,
        quantity: item.quantity,
        unit_price_cents: item.unitPriceCents,
      })),
    ),
  })

  return order
}

export async function reserveCoupon(couponId: string, orderId: string) {
  const rows = await supabaseRest<CouponRecord[]>(
    `reward_coupons?id=eq.${encodeURIComponent(couponId)}&status=eq.active`,
    {
      method: 'PATCH',
      prefer: 'return=representation',
      body: JSON.stringify({
        status: 'reserved',
        reserved_order_id: orderId,
        reserved_at: new Date().toISOString(),
      }),
    },
  )

  return Boolean(rows?.[0])
}

export async function updateOrder(
  orderId: string,
  patch: Record<string, string | number | boolean | null>,
) {
  await supabaseRest(`orders?id=eq.${encodeURIComponent(orderId)}`, {
    method: 'PATCH',
    prefer: 'return=minimal',
    body: JSON.stringify({ ...patch, updated_at: new Date().toISOString() }),
  })
}

export async function findOrderByCheckoutId(checkoutId: string) {
  const rows = await supabaseRest<OrderRecord[]>(
    `orders?sumup_checkout_id=eq.${encodeURIComponent(checkoutId)}&select=${ORDER_SELECT}&limit=1`,
  )
  return rows?.[0] || null
}

export async function findOrderByReference(reference: string) {
  const rows = await supabaseRest<OrderRecord[]>(
    `orders?checkout_reference=eq.${encodeURIComponent(reference)}&select=${ORDER_SELECT}&limit=1`,
  )
  return rows?.[0] || null
}

async function recordTrainerCommission(order: OrderRecord) {
  if (
    !order.trainer_partner_id ||
    !order.trainer_commission_percent ||
    !order.trainer_commission_base_cents ||
    !order.trainer_commission_cents
  ) return

  await supabaseRest('trainer_commissions?on_conflict=order_id', {
    method: 'POST',
    prefer: 'resolution=ignore-duplicates,return=minimal',
    body: JSON.stringify({
      order_id: order.id,
      trainer_partner_id: order.trainer_partner_id,
      commission_base_cents: order.trainer_commission_base_cents,
      commission_percent: order.trainer_commission_percent,
      amount_cents: order.trainer_commission_cents,
      status: 'earned',
      earned_at: new Date().toISOString(),
    }),
  })
}

export async function settleOrder(order: OrderRecord, status: string) {
  if (!['PAID', 'FAILED', 'EXPIRED'].includes(status)) return

  await updateOrder(order.id, {
    status,
    ...(status === 'PAID' ? { paid_at: new Date().toISOString() } : {}),
  })

  if (order.coupon_id) {
    if (status === 'PAID') {
      await supabaseRest(`reward_coupons?id=eq.${encodeURIComponent(order.coupon_id)}`, {
        method: 'PATCH',
        prefer: 'return=minimal',
        body: JSON.stringify({
          status: 'redeemed',
          redeemed_order_id: order.id,
          redeemed_at: new Date().toISOString(),
        }),
      })
    } else {
      await supabaseRest(
        `reward_coupons?id=eq.${encodeURIComponent(order.coupon_id)}&reserved_order_id=eq.${encodeURIComponent(order.id)}`,
        {
          method: 'PATCH',
          prefer: 'return=minimal',
          body: JSON.stringify({
            status: 'active',
            reserved_order_id: null,
            reserved_at: null,
          }),
        },
      )
    }
  }

  if (status !== 'PAID') return

  // Independiente del programa cliente->cliente: un entrenador cobra sobre PVP de producto,
  // nunca sobre portes, y el importe queda congelado al crear el checkout.
  await recordTrainerCommission(order)

  await ensureReferralCode(order.customer_id)

  if (!order.referral_code) return

  const referralRows = await supabaseRest<Array<{ owner_customer_id: string }>>(
    `referral_codes?code=eq.${encodeURIComponent(normalizeCode(order.referral_code))}&active=eq.true&select=owner_customer_id&limit=1`,
  )
  const ownerId = referralRows?.[0]?.owner_customer_id
  if (!ownerId || ownerId === order.customer_id) return

  const expiresAt = new Date(
    Date.now() + REFERRAL_REWARD_VALID_DAYS * 24 * 60 * 60 * 1000,
  ).toISOString()

  await supabaseRest('reward_coupons?on_conflict=referred_order_id', {
    method: 'POST',
    prefer: 'resolution=ignore-duplicates,return=minimal',
    body: JSON.stringify({
      code: makeCode('GHC10'),
      customer_id: ownerId,
      percent: REFERRAL_REWARD_PERCENT,
      status: 'active',
      source: 'referral',
      referred_order_id: order.id,
      expires_at: expiresAt,
    }),
  })
}

export async function ensureReferralCode(customerId: string) {
  const existing = await supabaseRest<Array<{ code: string }>>(
    `referral_codes?owner_customer_id=eq.${encodeURIComponent(customerId)}&active=eq.true&select=code&limit=1`,
  )
  if (existing?.[0]?.code) return existing[0].code

  const code = makeCode('GHC')
  const rows = await supabaseRest<Array<{ code: string }>>('referral_codes', {
    method: 'POST',
    prefer: 'return=representation',
    body: JSON.stringify({ code, owner_customer_id: customerId, active: true }),
  })
  return rows?.[0]?.code || code
}

function makeCode(prefix: string) {
  return `${prefix}-${randomUUID().replaceAll('-', '').slice(0, 8).toUpperCase()}`
}
