export const FREE_SHIPPING_THRESHOLD = 70
export const LOCAL_SHIPPING_FEE = 5.9
export const REFERRAL_REWARD_PERCENT = 10
export const REFERRAL_REWARD_VALID_DAYS = 90
export const TRAINER_COMMISSION_PERCENT = 10

export function getShippingCost(subtotal: number) {
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : LOCAL_SHIPPING_FEE
}

/**
 * Primera zona operativa de GHC Nutrition.
 * De momento limitamos técnicamente el checkout a códigos postales 28xxx
 * y mostramos al cliente "Madrid y municipios cercanos". Si la operativa
 * real necesita una lista más corta, se sustituye por una allowlist de CPs.
 */
export function isSupportedPostalCode(postalCode: string) {
  return /^28\d{3}$/.test(postalCode.trim())
}

export function normalizeCode(value: string) {
  return value.trim().toUpperCase().replace(/[^A-Z0-9-]/g, '').slice(0, 32)
}
