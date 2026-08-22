import { NextRequest, NextResponse } from 'next/server'
import {
  INGREDIENT_FALLBACKS,
  VARIANT_INGREDIENT_FALLBACKS,
  type IngredientFallback,
} from '@/lib/product-ingredient-fallbacks'

export const runtime = 'nodejs'

const BEVERLY_OPERATOR = {
  name: 'Suplements Beverly S.L.',
  cif: 'B78925955',
  address: 'C/ Miguel Servet 5 (Pol. Industrial Valdearenal), 28939 Arroyomolinos (Madrid), España',
  email: 'beverly@beverly.es',
} as const

const FAMILY_ALIASES: Record<string, string> = {
  'whey pro concentrate 2kg': 'whey pro concentrate 2 kg',
  'caseina micelar 1kg': 'caseina micelar 1 kg',
  'vegan protein 900g': 'vegan protein 900 g',
  'creatina monohidrato 500g': 'creatina monohidrato 500 g',
  'bcaa 8 1 1 l glutamina 300g': 'bcaa 8 1 1 l glutamina 300 g',
  'm a p essential amino acids 300g': 'map aminoacidos esenciales 300 g',
  'dynamite pre workout 375g': 'dynamite pre workout 375 g',
  'energy pro 90 caps': 'energy pro cafeina taurina 90 caps',
  'vitamin complex 90 caps': 'vitamin complex 90 caps',
  'isolate cfm professional 1kg': 'isolate cfm professional 1 kg',
  'isolate cfm professional 2kg': 'isolate cfm professional 2 kg',
  'hydro protein 1kg': 'hydro protein 1 kg',
  'hydro protein professional 2kg': 'hydro protein professional 2 kg',
  'clear isolate protein 500g': 'clear isolate protein 500 g',
  'pure whey 1kg': 'pure whey 1 kg',
  'whey pro concentrate 1kg': 'whey pro concentrate 1 kg',
  'creatina monohidrato creapure 300g': 'creatina monohidrato creapure 300 g',
  'creatina creapure q10 300g': 'creatina monohidrato creapure coenzima q10 300 g',
  'nac vitamina c zinc': 'nac vitamina c zinc 60 caps',
  'l glutamina kyowa 300g': 'l glutamina kyowa 300 g',
  'bisglicinato de magnesio b6 90 caps': 'bisglicinato de magnesio vitamin b6 90 caps',
  'vitamina d3 k2 60 caps': 'vitamina d3 k2 60 caps',
  'ashwagandha ksm 66 60 caps': 'ashwagandha ksm 66 magnesio l teanina rhodiola 60 caps',
  'b complex 60 caps': 'b complex 60 caps',
  'women protein shake 1kg': 'women protein shake 1 kg',
  'collagen for her 20 viales': 'collagen for her biotina vitamina c acido hialuronico 20 viales',
  'pack collagen for her 2 cajas': 'collagen for her biotina vitamina c acido hialuronico 20 viales',
  'burner extreme 90 caps': 'burner extreme 90 caps',
  'carni xtreme 20 viales': 'carni xtreme carnitina liquida 20 viales',
  'energy go gel 12 sticks': 'energy go gel energetico 12 sticks apple',
}

const CAFFEINE_PRODUCTS = new Set([
  'dynamite pre workout 375g',
  'energy pro 90 caps',
  'burner extreme 90 caps',
  'energy go gel 12 sticks',
])

const SUPPLEMENT_HINTS = new Set([
  'bcaa 8 1 1 l glutamina 300g',
  'm a p essential amino acids 300g',
  'dynamite pre workout 375g',
  'energy pro 90 caps',
  'vitamin complex 90 caps',
  'creatina monohidrato 500g',
  'creatina monohidrato creapure 300g',
  'creatina creapure q10 300g',
  'nac vitamina c zinc',
  'l glutamina kyowa 300g',
  'bisglicinato de magnesio b6 90 caps',
  'vitamina d3 k2 60 caps',
  'ashwagandha ksm 66 60 caps',
  'b complex 60 caps',
  'collagen for her 20 viales',
  'pack collagen for her 2 cajas',
  'burner extreme 90 caps',
  'carni xtreme 20 viales',
])

type BeverlyProduct = {
  title?: string
  handle?: string
  body_html?: string
  vendor?: string
  tags?: string[]
}

function normalize(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[®™©]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function decodeHtml(value: string) {
  return value
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#([0-9]+);/g, (_, dec: string) => String.fromCodePoint(Number.parseInt(dec, 10)))
}

function stripTags(value: string) {
  return decodeHtml(
    value
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n')
      .replace(/<\/li>/gi, '\n')
      .replace(/<[^>]+>/g, ' '),
  )
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s+/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function splitSections(html: string) {
  const heading = /<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi
  const matches = [...html.matchAll(heading)]
  const sections: Array<{ heading: string; raw: string; text: string }> = []

  matches.forEach((match, index) => {
    const start = (match.index || 0) + match[0].length
    const end = index + 1 < matches.length ? matches[index + 1].index || html.length : html.length
    const raw = html.slice(start, end)
    sections.push({ heading: stripTags(match[2]), raw, text: stripTags(raw) })
  })

  return sections
}

function findSection(
  sections: Array<{ heading: string; raw: string; text: string }>,
  terms: string[],
) {
  return sections.find((section) => {
    const key = normalize(section.heading)
    return terms.some((term) => key.includes(normalize(term)))
  })
}

function parseTableRows(raw: string) {
  return [...raw.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)]
    .map((row) => {
      const cells = [...row[1].matchAll(/<(?:td|th)[^>]*>([\s\S]*?)<\/(?:td|th)>/gi)]
        .map((cell) => stripTags(cell[1]))
        .filter(Boolean)
      if (cells.length < 2) return null
      return { label: cells[0], value: cells.slice(1).join(' · ') }
    })
    .filter((row): row is { label: string; value: string } => Boolean(row))
    .slice(0, 40)
}

function extractAllergens(rawIngredients: string) {
  const bold = [...rawIngredients.matchAll(/<(?:strong|b)[^>]*>([\s\S]*?)<\/(?:strong|b)>/gi)]
    .map((match) => stripTags(match[1]))
    .map((value) => value.replace(/[.:;,]$/g, '').trim())
    .filter(Boolean)
  return [...new Set(bold)].slice(0, 12)
}

function meaningfulFlavor(flavor: string) {
  const normalized = normalize(flavor)
  if (!normalized || normalized === 'capsulas') return ''
  if (normalized.includes('viales') || normalized.includes('sticks')) return ''
  return normalized
}

function scoreProduct(product: BeverlyProduct, family: string, flavor: string) {
  const title = normalize(`${product.title || ''} ${product.handle || ''}`)
  const normalizedFamily = normalize(family)
  const familyWords = normalizedFamily.split(' ').filter((word) => word.length > 1)
  const familyMatches = familyWords.filter((word) => title.includes(word)).length
  let score = familyWords.length ? (familyMatches / familyWords.length) * 100 : 0

  const wantedFlavor = meaningfulFlavor(flavor)
  if (wantedFlavor) {
    const flavorWords = wantedFlavor.split(' ').filter((word) => word.length > 1)
    const flavorMatches = flavorWords.filter((word) => title.includes(word)).length
    score += flavorWords.length ? (flavorMatches / flavorWords.length) * 45 : 0
    if (title.includes(wantedFlavor)) score += 20
  }

  if (title.includes(normalizedFamily)) score += 40
  if (!normalizedFamily.includes('for her') && title.includes('for her')) score -= 60
  return score
}

async function getBeverlyProducts() {
  const response = await fetch('https://beverly.es/products.json?limit=250', {
    next: { revalidate: 21600 },
    headers: {
      'User-Agent': 'GHC-Nutrition-Compliance/1.0',
      Accept: 'application/json',
    },
  })

  if (!response.ok) throw new Error(`BEVERLY_CATALOG_${response.status}`)
  const payload = await response.json() as { products?: BeverlyProduct[] }
  return payload.products || []
}

function quantityFromTitle(title: string) {
  const matches = title.match(/\b(?:\d+(?:[.,]\d+)?\s*(?:kg|g|ml)|\d+\s*(?:caps|cápsulas|viales|sticks|servicios|uds))\b/gi)
  return matches?.[0] || ''
}

function ingredientFallback(normalizedName: string, flavor: string): IngredientFallback | null {
  const normalizedFlavor = normalize(flavor)
  const exact = VARIANT_INGREDIENT_FALLBACKS[`${normalizedName}::${normalizedFlavor}`]
  if (exact) return exact

  const general = INGREDIENT_FALLBACKS[normalizedName]
  if (!general) return null
  if (general.flavors?.length && !general.flavors.map(normalize).includes(normalizedFlavor)) return null
  return general
}

export async function GET(request: NextRequest) {
  const productName = (request.nextUrl.searchParams.get('name') || '').trim().slice(0, 120)
  const flavor = (request.nextUrl.searchParams.get('flavor') || '').trim().slice(0, 100)
  const normalizedName = normalize(productName)

  if (!productName) return NextResponse.json({ error: 'Producto no indicado.' }, { status: 400 })

  const family = FAMILY_ALIASES[normalizedName]
  if (!family) {
    return NextResponse.json({ legalReady: false, reason: 'PRODUCT_NOT_MAPPED', productName, flavor })
  }

  try {
    const products = await getBeverlyProducts()
    const ranked = products
      .map((product) => ({ product, score: scoreProduct(product, family, flavor) }))
      .sort((a, b) => b.score - a.score)

    const match = ranked[0]
    if (!match || match.score < 75 || !match.product.body_html) {
      return NextResponse.json({ legalReady: false, reason: 'OFFICIAL_VARIANT_NOT_FOUND', productName, flavor })
    }

    const html = match.product.body_html
    const sections = splitSections(html)
    const ingredientsSection = findSection(sections, ['ingredientes'])
    const nutritionSection = findSection(sections, ['informacion nutricional', 'valores nutricionales', 'composicion'])
    const usageSection = findSection(sections, ['como consumirlo', 'modo de empleo', 'modo de uso'])
    const warningSection = findSection(sections, ['advertencias', 'precauciones'])
    const storageSection = findSection(sections, ['conservacion', 'conservar'])
    const descriptionSection = findSection(sections, ['descripcion del producto', 'descripcion'])
    const officialTitle = match.product.title || productName
    const officialUrl = match.product.handle ? `https://beverly.es/products/${match.product.handle}` : null
    const fallback = ingredientFallback(normalizedName, flavor)

    const officialIngredients = ingredientsSection?.text || ''
    const ingredients = officialIngredients || fallback?.ingredients || ''
    const nutritionRows = nutritionSection ? parseTableRows(nutritionSection.raw) : []
    const usage = usageSection?.text || ''
    const allergens = ingredientsSection ? extractAllergens(ingredientsSection.raw) : []
    const supplement = SUPPLEMENT_HINTS.has(normalizedName) ||
      normalize(descriptionSection?.text || '').includes('complemento alimenticio') ||
      normalize(descriptionSection?.text || '').startsWith('complemento a base')
    const caffeine = CAFFEINE_PRODUCTS.has(normalizedName)

    const statutoryWarnings = supplement
      ? [
          'No superar la dosis diaria expresamente recomendada.',
          'Los complementos alimenticios no deben utilizarse como sustitutos de una dieta equilibrada y variada y un modo de vida sano.',
          'Mantener fuera del alcance de los niños más pequeños.',
        ]
      : []

    if (caffeine) statutoryWarnings.push('Contiene cafeína. No recomendado para niños ni mujeres embarazadas.')

    const caffeineRow = nutritionRows.find((row) => normalize(row.label).includes('cafeina'))
    const hasCoreComposition = nutritionRows.length > 0
    const hasIngredients = ingredients.length > 0
    const hasUsage = usage.length > 0
    const hasCaffeineAmountWhenRequired = !caffeine || Boolean(caffeineRow?.value)

    const legalReady = hasIngredients && hasCoreComposition && hasUsage && hasCaffeineAmountWhenRequired
    const missing: string[] = []
    if (!hasIngredients) missing.push('ingredientes')
    if (!hasCoreComposition) missing.push('composición/información nutricional')
    if (!hasUsage) missing.push('modo de empleo')
    if (!hasCaffeineAmountWhenRequired) missing.push('cantidad de cafeína por porción recomendada')

    const sourceWarnings = [
      warningSection?.text || '',
      ...(fallback?.warnings || []),
      fallback?.traces || '',
      ...statutoryWarnings,
    ].filter(Boolean)

    return NextResponse.json({
      legalReady,
      reason: legalReady ? null : 'MANDATORY_INFO_INCOMPLETE',
      missing,
      productName,
      selectedFlavor: flavor,
      legalDenomination: supplement ? 'Complemento alimenticio' : (descriptionSection?.text || officialTitle),
      officialTitle,
      officialUrl,
      quantity: normalizedName === 'pack collagen for her 2 cajas' ? '2 cajas · 40 viales' : quantityFromTitle(officialTitle),
      description: descriptionSection?.text || '',
      ingredients,
      allergens,
      nutritionRows,
      usage,
      warnings: [...new Set(sourceWarnings)],
      storage: storageSection?.text || 'Conservar según las indicaciones del envase original.',
      caffeinePerRecommendedPortion: caffeineRow?.value || null,
      supplement,
      operator: BEVERLY_OPERATOR,
      source: officialIngredients
        ? 'Beverly Nutrition · información oficial publicada por el fabricante/distribuidor'
        : fallback
          ? `Beverly Nutrition (composición y uso) + ${fallback.sourceName} (declaración de ingredientes)`
          : 'Beverly Nutrition · información oficial publicada por el fabricante/distribuidor',
      ingredientSourceName: officialIngredients ? 'Beverly Nutrition' : fallback?.sourceName || null,
      ingredientSourceUrl: officialIngredients ? officialUrl : fallback?.sourceUrl || null,
      ingredientSourceType: officialIngredients ? 'official' : fallback ? 'verified_secondary' : null,
      checkedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Product legal information resolution failed', error)
    return NextResponse.json(
      { legalReady: false, reason: 'OFFICIAL_SOURCE_UNAVAILABLE', productName, flavor },
      { status: 503 },
    )
  }
}
