'use client'

import { useEffect } from 'react'

const DELIVERY_COPY = 'Entrega a partir de 72 h'
const DELIVERY_DETAIL = 'Plazo de entrega: a partir de 72 horas desde la confirmación del pedido. No se garantizan entregas antes de ese plazo. El tiempo final puede ampliarse por disponibilidad, recogida en proveedor, fines de semana, festivos, incidencias logísticas o transporte.'
const LEGAL_DELIVERY_DETAIL = 'El plazo de entrega comienza a partir de las 72 horas desde la confirmación del pedido. GHC Nutrition no garantiza entregas antes de ese plazo. La entrega efectiva puede demorarse por disponibilidad del producto, recogida en proveedor, fines de semana, festivos, incidencias logísticas, transportista o causas fuera del control razonable de GHC Nutrition. Si no se hubiera pactado un plazo máximo específico, el pedido se ejecutará sin demora indebida y, en todo caso, dentro del máximo legal de 30 días naturales desde la celebración del contrato, salvo acuerdo distinto con el cliente.'

function patchHome() {
  const topBar = document.querySelector('main > div') as HTMLElement | null
  if (topBar && topBar.textContent?.includes('Madrid') && !topBar.textContent.includes(DELIVERY_COPY)) {
    topBar.textContent = `${topBar.textContent.trim()} · ${DELIVERY_COPY}`
  }

  const paragraphs = Array.from(document.querySelectorAll('p, div')) as HTMLElement[]
  const localDelivery = paragraphs.find((node) => node.textContent?.trim() === 'Madrid y municipios cercanos')
  if (localDelivery && !localDelivery.parentElement?.textContent?.includes('72 h')) {
    const timing = document.createElement('p')
    timing.className = 'mt-1 text-xs text-white/38'
    timing.textContent = 'Entrega a partir de 72 h'
    localDelivery.parentElement?.appendChild(timing)
  }

  const checkoutNotice = paragraphs.find((node) => node.textContent?.trim().startsWith('Por ahora entregamos en Madrid y municipios cercanos.'))
  if (checkoutNotice && !checkoutNotice.textContent?.includes('72 horas')) {
    checkoutNotice.textContent = `${checkoutNotice.textContent?.trim()} ${DELIVERY_DETAIL}`
  }
}

function patchShippingPolicy() {
  if (window.location.pathname !== '/info/envios') return
  const headings = Array.from(document.querySelectorAll('h2')) as HTMLElement[]
  const heading = headings.find((node) => node.textContent?.trim() === 'Plazo de entrega')
  if (!heading) return
  const article = heading.closest('article')
  const paragraph = article?.querySelector('p') as HTMLElement | null
  if (paragraph && paragraph.textContent !== LEGAL_DELIVERY_DETAIL) {
    paragraph.textContent = LEGAL_DELIVERY_DETAIL
  }
}

export default function DeliveryTimingGuard() {
  useEffect(() => {
    const apply = () => {
      patchHome()
      patchShippingPolicy()
    }

    apply()
    const observer = new MutationObserver(apply)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => observer.disconnect()
  }, [])

  return null
}
