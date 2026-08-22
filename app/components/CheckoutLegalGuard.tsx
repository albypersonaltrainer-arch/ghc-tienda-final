'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

const TERMS_VERSION = 'GHC_NUTRITION_ES_2026_08_22'
const PRIVACY_VERSION = 'GHC_NUTRITION_PRIVACY_ES_2026_08_22'
const RETURNS_VERSION = 'GHC_NUTRITION_RETURNS_ES_2026_08_22'

export default function CheckoutLegalGuard() {
  const [slot, setSlot] = useState<HTMLElement | null>(null)
  const [accepted, setAccepted] = useState(false)
  const [error, setError] = useState(false)
  const acceptedRef = useRef(false)

  useEffect(() => {
    let currentForm: HTMLFormElement | null = null

    const ensure = () => {
      const form = document.querySelector('aside form') as HTMLFormElement | null
      if (!form) {
        currentForm = null
        setSlot(null)
        acceptedRef.current = false
        setAccepted(false)
        return
      }

      currentForm = form
      let mount = form.querySelector('#ghc-checkout-legal-slot') as HTMLElement | null
      if (!mount) {
        mount = document.createElement('div')
        mount.id = 'ghc-checkout-legal-slot'
        const footer = form.lastElementChild
        if (footer) form.insertBefore(mount, footer)
        else form.appendChild(mount)
      }
      setSlot(mount)

      const submit = form.querySelector('button[type="submit"]') as HTMLButtonElement | null
      if (submit) {
        submit.classList.add('ghc-payment-submit-legal')
        submit.setAttribute('aria-label', 'Pedido con obligación de pago')
        submit.setAttribute('title', 'Pedido con obligación de pago')
      }
    }

    const observer = new MutationObserver(ensure)
    observer.observe(document.body, { childList: true, subtree: true })
    ensure()

    const onSubmit = (event: Event) => {
      const target = event.target as HTMLFormElement | null
      if (!target || target !== currentForm) return
      const checkbox = target.querySelector('#ghc-legal-acceptance') as HTMLInputElement | null
      if (!checkbox?.checked) {
        event.preventDefault()
        event.stopImmediatePropagation()
        setError(true)
      }
    }

    document.addEventListener('submit', onSubmit, true)

    const nativeFetch = window.fetch.bind(window)
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === 'string'
        ? input
        : input instanceof URL
          ? input.toString()
          : input.url

      const isCheckout = url === '/api/checkout' || url.endsWith('/api/checkout')
      if (!isCheckout || !init?.body || typeof init.body !== 'string') {
        return nativeFetch(input, init)
      }

      let payload: Record<string, unknown>
      try {
        payload = JSON.parse(init.body) as Record<string, unknown>
      } catch {
        return nativeFetch(input, init)
      }

      payload.legal = {
        termsAccepted: acceptedRef.current,
        privacyAcknowledged: acceptedRef.current,
        returnsAcknowledged: acceptedRef.current,
        termsVersion: TERMS_VERSION,
        privacyVersion: PRIVACY_VERSION,
        returnsVersion: RETURNS_VERSION,
      }

      return nativeFetch(input, {
        ...init,
        body: JSON.stringify(payload),
      })
    }

    return () => {
      observer.disconnect()
      document.removeEventListener('submit', onSubmit, true)
      window.fetch = nativeFetch
    }
  }, [])

  if (!slot) return null

  return createPortal(
    <div className="border-t border-black/10 bg-white px-6 py-5">
      <label className="flex cursor-pointer items-start gap-3 text-xs leading-5 text-black/65">
        <input
          id="ghc-legal-acceptance"
          type="checkbox"
          required
          checked={accepted}
          onChange={(event) => {
            const checked = event.target.checked
            acceptedRef.current = checked
            setAccepted(checked)
            if (checked) setError(false)
          }}
          className="mt-0.5 h-4 w-4 shrink-0 accent-[#169646]"
        />
        <span>
          He leído y acepto las{' '}
          <Link href="/info/terminos" target="_blank" className="font-black underline underline-offset-2">Condiciones de contratación</Link>
          {' '}y confirmo haber leído la{' '}
          <Link href="/info/privacidad" target="_blank" className="font-black underline underline-offset-2">Política de privacidad</Link>
          {' '}y la{' '}
          <Link href="/info/devoluciones" target="_blank" className="font-black underline underline-offset-2">Política de devoluciones</Link>.
        </span>
      </label>
      <p className="mt-3 text-[10px] leading-4 text-black/42">
        Al confirmar el pedido aceptas una obligación de pago. Los productos precintados sujetos a protección de salud o higiene pueden quedar excluidos del desistimiento si se desprecintan tras la entrega.
      </p>
      {error && <p className="mt-3 text-xs font-bold text-red-700">Debes aceptar las condiciones antes de continuar al pago.</p>}
    </div>,
    slot,
  )
}
