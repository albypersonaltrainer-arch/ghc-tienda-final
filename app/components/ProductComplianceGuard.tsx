'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AlertTriangle, Check, ExternalLink, ShieldCheck, X } from 'lucide-react'

type LegalInfo = {
  legalReady: boolean
  reason?: string | null
  missing?: string[]
  productName?: string
  selectedFlavor?: string
  legalDenomination?: string
  officialTitle?: string
  officialUrl?: string | null
  quantity?: string
  description?: string
  ingredients?: string
  allergens?: string[]
  nutritionRows?: Array<{ label: string; value: string }>
  usage?: string
  warnings?: string[]
  storage?: string
  caffeinePerRecommendedPortion?: string | null
  supplement?: boolean
  operator?: { name: string; cif: string; address: string; email: string }
  source?: string
}

const WHEY_NAME = 'Whey Pro Concentrate 2kg'

function text(button: Element) {
  return (button.textContent || '').replace(/\s+/g, ' ').trim().toLowerCase()
}

function createInfoButton() {
  const button = document.createElement('button')
  button.type = 'button'
  button.className = 'ghc-food-info-button'
  button.innerHTML = '<span class="ghc-food-info-dot"></span><span>Información alimentaria</span>'
  return button
}

function createStatus() {
  const status = document.createElement('p')
  status.className = 'ghc-food-info-status'
  return status
}

export default function ProductComplianceGuard() {
  const [modal, setModal] = useState<LegalInfo | null>(null)
  const cacheRef = useRef(new Map<string, Promise<LegalInfo>>())

  useEffect(() => {
    const cache = cacheRef.current
    let disposed = false

    const fetchInfo = (name: string, flavor: string) => {
      const key = `${name}::${flavor}`
      const existing = cache.get(key)
      if (existing) return existing

      const request = fetch(`/api/product-legal-info?name=${encodeURIComponent(name)}&flavor=${encodeURIComponent(flavor)}`, {
        cache: 'no-store',
      })
        .then(async (response) => {
          const payload = await response.json().catch(() => ({})) as LegalInfo
          return payload
        })
        .catch(() => ({ legalReady: false, reason: 'OFFICIAL_SOURCE_UNAVAILABLE' } as LegalInfo))

      cache.set(key, request)
      return request
    }

    const protect = (
      host: HTMLElement,
      addButton: HTMLButtonElement,
      name: string,
      flavor: string,
    ) => {
      const key = `${name}::${flavor}`
      if (addButton.dataset.ghcLegalKey === key) return
      addButton.dataset.ghcLegalKey = key
      addButton.dataset.ghcLegalState = 'loading'
      addButton.disabled = true
      addButton.setAttribute('aria-disabled', 'true')
      addButton.title = 'Comprobando información alimentaria obligatoria'

      let infoButton = host.querySelector(':scope > .ghc-food-info-button') as HTMLButtonElement | null
      if (!infoButton) {
        infoButton = createInfoButton()
        host.insertBefore(infoButton, addButton)
      }

      let status = host.querySelector(':scope > .ghc-food-info-status') as HTMLParagraphElement | null
      if (!status) {
        status = createStatus()
        host.insertBefore(status, addButton)
      }

      infoButton.dataset.state = 'loading'
      status.textContent = 'Verificando información oficial…'
      status.dataset.state = 'loading'

      fetchInfo(name, flavor).then((info) => {
        if (disposed || addButton.dataset.ghcLegalKey !== key) return

        infoButton!.onclick = () => setModal(info)
        infoButton!.dataset.state = info.legalReady ? 'ready' : 'blocked'

        if (info.legalReady) {
          addButton.disabled = false
          addButton.removeAttribute('aria-disabled')
          addButton.dataset.ghcLegalState = 'ready'
          addButton.title = 'Añadir al carrito'
          status!.textContent = 'Información alimentaria verificada antes de la compra'
          status!.dataset.state = 'ready'
        } else {
          addButton.disabled = true
          addButton.setAttribute('aria-disabled', 'true')
          addButton.dataset.ghcLegalState = 'blocked'
          addButton.title = 'Venta temporalmente bloqueada: falta información alimentaria obligatoria verificable'
          const missing = info.missing?.length ? `: ${info.missing.join(', ')}` : ''
          status!.textContent = `Venta bloqueada hasta completar la información obligatoria${missing}`
          status!.dataset.state = 'blocked'
        }
      })
    }

    const scanCatalog = () => {
      const catalog = document.getElementById('catalogo')
      if (!catalog) return

      catalog.querySelectorAll('article').forEach((node) => {
        const article = node as HTMLElement
        const name = article.querySelector('h3')?.textContent?.trim()
        if (!name) return
        const select = article.querySelector('select') as HTMLSelectElement | null
        const flavor = select?.value || ''
        const addButton = [...article.querySelectorAll('button')]
          .find((button) => text(button).startsWith('añadir')) as HTMLButtonElement | undefined
        if (!addButton) return

        protect(addButton.parentElement as HTMLElement, addButton, name, flavor)

        if (select && select.dataset.ghcLegalListener !== '1') {
          select.dataset.ghcLegalListener = '1'
          select.addEventListener('change', () => {
            window.setTimeout(() => {
              const currentName = article.querySelector('h3')?.textContent?.trim() || name
              protect(addButton.parentElement as HTMLElement, addButton, currentName, select.value)
            }, 0)
          })
        }
      })
    }

    const scanEditorialWhey = () => {
      const buttons = [...document.querySelectorAll('main button')]
        .filter((button) => text(button).startsWith('añadir al carrito')) as HTMLButtonElement[]

      buttons.forEach((addButton) => {
        const section = addButton.closest('section') as HTMLElement | null
        if (!section || !section.textContent?.includes('Whey Pro')) return
        const flavorLabel = section.querySelector('div.absolute.bottom-8.left-8')?.textContent?.trim() || 'Choco Cookies'
        protect(addButton.parentElement as HTMLElement, addButton, WHEY_NAME, flavorLabel)
      })
    }

    const scan = () => {
      scanCatalog()
      scanEditorialWhey()
    }

    const observer = new MutationObserver(scan)
    observer.observe(document.body, { childList: true, subtree: true, characterData: true })
    scan()

    return () => {
      disposed = true
      observer.disconnect()
    }
  }, [])

  if (!modal) return null

  const blockedMessage = modal.reason === 'OFFICIAL_SOURCE_UNAVAILABLE'
    ? 'La fuente oficial no está disponible en este momento. Por seguridad jurídica, la referencia no puede añadirse al carrito hasta recuperar su información.'
    : modal.reason === 'OFFICIAL_VARIANT_NOT_FOUND'
      ? 'No hemos podido vincular de forma inequívoca esta variante con la referencia oficial. La venta queda bloqueada hasta verificarla.'
      : 'La fuente oficial no publica todavía toda la información obligatoria necesaria para vender esta referencia a distancia.'

  return createPortal(
    <div className="fixed inset-0 z-[180] bg-black/55 p-4 backdrop-blur-sm md:p-8" onMouseDown={() => setModal(null)}>
      <div className="mx-auto flex max-h-[calc(100vh-2rem)] w-full max-w-5xl flex-col overflow-hidden bg-[#F4F4F0] shadow-2xl md:max-h-[calc(100vh-4rem)]" onMouseDown={(event) => event.stopPropagation()}>
        <div className="flex items-start justify-between gap-5 border-b border-black/10 px-5 py-5 md:px-8">
          <div>
            <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.16em] text-[#169646]">
              <ShieldCheck className="h-4 w-4" /> Información alimentaria precontractual
            </div>
            <h2 className="mt-2 text-2xl font-black tracking-[-0.035em] md:text-3xl">{modal.officialTitle || modal.productName || 'Producto'}</h2>
            {!!modal.selectedFlavor && <p className="mt-1 text-xs font-semibold text-black/45">Variante seleccionada: {modal.selectedFlavor}</p>}
          </div>
          <button type="button" onClick={() => setModal(null)} className="grid h-10 w-10 shrink-0 place-items-center border border-black/12 bg-white" aria-label="Cerrar"><X className="h-4 w-4" /></button>
        </div>

        <div className="overflow-y-auto px-5 py-6 md:px-8 md:py-8">
          {modal.legalReady ? (
            <div className="mb-7 flex items-start gap-3 border-l-4 border-[#169646] bg-white px-5 py-4 text-sm leading-6 text-black/70">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#169646]" />
              <span>Información esencial comprobada para esta referencia antes de permitir su incorporación al carrito.</span>
            </div>
          ) : (
            <div className="mb-7 flex items-start gap-3 border-l-4 border-amber-500 bg-amber-50 px-5 py-4 text-sm leading-6 text-amber-950">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <span><strong>Referencia temporalmente bloqueada.</strong> {blockedMessage}{modal.missing?.length ? ` Falta: ${modal.missing.join(', ')}.` : ''}</span>
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-2">
            <section className="border border-black/10 bg-white p-5 md:p-6">
              <p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#169646]">Identificación del alimento</p>
              <dl className="mt-4 grid gap-3 text-sm">
                <div><dt className="text-black/38">Denominación</dt><dd className="mt-1 font-bold">{modal.legalDenomination || modal.description || modal.officialTitle}</dd></div>
                {!!modal.quantity && <div><dt className="text-black/38">Cantidad neta / formato</dt><dd className="mt-1 font-bold">{modal.quantity}</dd></div>}
                <div><dt className="text-black/38">Operador alimentario</dt><dd className="mt-1 font-bold">{modal.operator?.name || 'Suplements Beverly S.L.'}</dd><dd className="mt-1 text-xs leading-5 text-black/48">{modal.operator?.address}</dd></div>
              </dl>
            </section>

            <section className="border border-black/10 bg-white p-5 md:p-6">
              <p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#169646]">Ingredientes y alérgenos</p>
              <p className="mt-4 text-sm leading-6 text-black/62">{modal.ingredients || 'No publicados de forma completa por la fuente oficial.'}</p>
              {!!modal.allergens?.length && <div className="mt-5"><p className="text-[9px] font-black uppercase tracking-[0.14em] text-black/35">Alérgenos destacados por la fuente</p><p className="mt-2 text-sm font-black">{modal.allergens.join(' · ')}</p></div>}
            </section>

            <section className="border border-black/10 bg-white p-5 md:p-6 lg:col-span-2">
              <p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#169646]">Composición / información nutricional por porción</p>
              {modal.nutritionRows?.length ? (
                <div className="mt-4 grid md:grid-cols-2">
                  {modal.nutritionRows.map((row, index) => (
                    <div key={`${row.label}-${index}`} className="flex items-start justify-between gap-5 border-b border-black/8 py-2.5 text-sm md:odd:pr-6 md:even:border-l md:even:border-l-black/8 md:even:pl-6">
                      <span className="text-black/45">{row.label}</span><strong className="text-right">{row.value}</strong>
                    </div>
                  ))}
                </div>
              ) : <p className="mt-4 text-sm text-black/55">Información no disponible de forma completa en la fuente oficial.</p>}
            </section>

            <section className="border border-black/10 bg-white p-5 md:p-6">
              <p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#169646]">Modo de empleo y conservación</p>
              <p className="mt-4 text-sm leading-6 text-black/62">{modal.usage || 'Pendiente de verificación.'}</p>
              {!!modal.storage && <p className="mt-4 text-xs leading-5 text-black/45">{modal.storage}</p>}
            </section>

            <section className="border border-black/10 bg-white p-5 md:p-6">
              <p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#169646]">Advertencias</p>
              {modal.warnings?.length ? <ul className="mt-4 grid gap-2 text-sm leading-6 text-black/62">{modal.warnings.map((warning) => <li key={warning}>• {warning}</li>)}</ul> : <p className="mt-4 text-sm text-black/55">Seguir siempre las advertencias del etiquetado físico recibido.</p>}
              {!!modal.caffeinePerRecommendedPortion && <p className="mt-4 border-l-2 border-amber-500 pl-3 text-sm font-black">Cafeína por porción recomendada: {modal.caffeinePerRecommendedPortion}</p>}
            </section>
          </div>

          <div className="mt-7 flex flex-col gap-3 border-t border-black/10 pt-5 text-[10px] leading-5 text-black/42 sm:flex-row sm:items-center sm:justify-between">
            <p>{modal.source || 'Fuente oficial del fabricante/distribuidor'}. El etiquetado de la unidad entregada prevalece para lote, fecha de duración y posibles actualizaciones posteriores.</p>
            {modal.officialUrl && <a href={modal.officialUrl} target="_blank" rel="noreferrer" className="inline-flex shrink-0 items-center gap-2 font-black uppercase tracking-[0.1em] text-[#169646]">Fuente oficial <ExternalLink className="h-3.5 w-3.5" /></a>}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
