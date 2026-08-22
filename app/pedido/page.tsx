'use client'

import { useEffect, useState } from 'react'
import { ArrowLeft, Check, Clock3, ShieldCheck } from 'lucide-react'

const CHECKOUT_URL = 'https://oqlxvesnjdkxlxwxkikq.supabase.co/functions/v1/nutrition-checkout'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xbHh2ZXNuamRreGx4d3hraWtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3MTk5OTQsImV4cCI6MjA5MzI5NTk5NH0.zgpUgh2sGY_jlJOO6npn2BsbRWsRTe3SH7mDYS7H1tY'

type State = 'checking' | 'paid' | 'pending' | 'error'

export default function OrderReturnPage() {
  const [state, setState] = useState<State>('checking')
  const [reference, setReference] = useState('')

  useEffect(() => {
    const orderReference = new URLSearchParams(window.location.search).get('order') || ''
    setReference(orderReference)
    if (!orderReference) {
      setState('error')
      return
    }

    ;(async () => {
      try {
        const response = await fetch(CHECKOUT_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            apikey: SUPABASE_ANON_KEY,
          },
          body: JSON.stringify({ action: 'verify', orderReference }),
        })
        const data = await response.json()
        if (!response.ok || !data.ok) throw new Error('verify_failed')
        setState(data.paymentStatus === 'paid' ? 'paid' : 'pending')
        if (data.paymentStatus === 'paid') localStorage.removeItem('ghc-nutrition-cart-v1')
      } catch {
        setState('error')
      }
    })()
  }, [])

  return (
    <main className="min-h-screen bg-[#f5f3ef] text-[#171717] flex items-center justify-center p-5">
      <div className="ghc-grain fixed inset-0 pointer-events-none opacity-[0.12]" />
      <div className="relative w-full max-w-2xl rounded-[34px] bg-white border border-black/10 shadow-[0_30px_90px_rgba(0,0,0,.12)] p-8 sm:p-12 text-center">
        <img src="/logo-limpio.png" alt="GHC Nutrition" className="h-20 w-20 object-contain mx-auto" />

        {state === 'checking' && (
          <>
            <div className="mx-auto mt-7 h-14 w-14 rounded-full bg-[#eee8e0] text-[#8a5b3c] flex items-center justify-center"><Clock3 className="h-6 w-6 animate-pulse" /></div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-[-0.04em] mt-6">Comprobando el pago…</h1>
            <p className="text-black/50 mt-3">Estamos verificando el estado del pedido con el proveedor de pago.</p>
          </>
        )}

        {state === 'paid' && (
          <>
            <div className="mx-auto mt-7 h-14 w-14 rounded-full bg-[#e5eee6] text-[#2b6b38] flex items-center justify-center"><Check className="h-6 w-6" /></div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-[-0.04em] mt-6">Pago confirmado.</h1>
            <p className="text-black/50 mt-3">Tu pedido ya está registrado como pagado y pasa a preparación.</p>
          </>
        )}

        {state === 'pending' && (
          <>
            <div className="mx-auto mt-7 h-14 w-14 rounded-full bg-[#eee8e0] text-[#8a5b3c] flex items-center justify-center"><Clock3 className="h-6 w-6" /></div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-[-0.04em] mt-6">Pedido recibido.</h1>
            <p className="text-black/50 mt-3">El pago todavía figura como pendiente. Si acabas de completarlo, el estado puede tardar unos instantes en actualizarse.</p>
          </>
        )}

        {state === 'error' && (
          <>
            <div className="mx-auto mt-7 h-14 w-14 rounded-full bg-red-50 text-red-600 flex items-center justify-center"><ShieldCheck className="h-6 w-6" /></div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-[-0.04em] mt-6">No hemos podido verificarlo.</h1>
            <p className="text-black/50 mt-3">Conserva la referencia del pedido y vuelve a comprobarlo desde el enlace de confirmación.</p>
          </>
        )}

        {reference && <div className="mt-7 rounded-2xl bg-[#f2eee8] p-4"><div className="text-[10px] uppercase tracking-[0.16em] text-black/40 font-black">Referencia</div><div className="font-black tracking-[0.08em] mt-1">{reference}</div></div>}

        <a href="/" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#171717] text-white px-7 py-4 text-sm font-black hover:bg-[#8a5b3c] transition"><ArrowLeft className="h-4 w-4" /> Volver a GHC Nutrition</a>
      </div>
    </main>
  )
}
