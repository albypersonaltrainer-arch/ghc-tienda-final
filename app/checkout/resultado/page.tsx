import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle2, Clock3, Gift, XCircle } from 'lucide-react'
import { ensureReferralCode, findOrderByReference, settleOrder } from '@/lib/order-store'
import { isCommerceDatabaseConfigured } from '@/lib/supabase-rest'

type CheckoutStatus = 'PAID' | 'PENDING' | 'FAILED' | 'EXPIRED' | 'UNKNOWN'

async function getCheckoutStatus(reference: string): Promise<CheckoutStatus> {
  const apiKey = process.env.SUMUP_API_KEY
  if (!apiKey) return 'UNKNOWN'

  try {
    const url = new URL('https://api.sumup.com/v0.1/checkouts')
    url.searchParams.set('checkout_reference', reference)
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${apiKey}` },
      cache: 'no-store',
    })
    if (!response.ok) return 'UNKNOWN'
    const checkouts = (await response.json()) as Array<{ status?: CheckoutStatus }>
    return checkouts[0]?.status || 'UNKNOWN'
  } catch {
    return 'UNKNOWN'
  }
}

async function syncOrderAndReferral(reference: string, status: CheckoutStatus) {
  if (!isCommerceDatabaseConfigured() || status === 'UNKNOWN' || status === 'PENDING') {
    return null
  }

  try {
    const order = await findOrderByReference(reference)
    if (!order) return null
    await settleOrder(order, status)
    if (status !== 'PAID') return null
    return await ensureReferralCode(order.customer_id)
  } catch (error) {
    console.error('Could not sync checkout result with order store', error)
    return null
  }
}

export default async function CheckoutResultPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>
}) {
  const params = await searchParams
  const reference = params.ref?.slice(0, 90) || ''
  const status = reference ? await getCheckoutStatus(reference) : 'UNKNOWN'
  const referralCode = reference ? await syncOrderAndReferral(reference, status) : null

  const content = {
    PAID: {
      icon: CheckCircle2,
      title: 'Pedido confirmado',
      text: 'SumUp confirma el pago. Hemos registrado tu pedido para preparar la entrega.',
      tone: 'text-[#0d7d34] bg-[#22D65B]/15',
    },
    PENDING: {
      icon: Clock3,
      title: 'Pago en comprobación',
      text: 'El pago todavía aparece pendiente. Cuando SumUp lo confirme, el pedido quedará marcado como pagado.',
      tone: 'text-amber-700 bg-amber-50',
    },
    FAILED: {
      icon: XCircle,
      title: 'Pago no completado',
      text: 'SumUp indica que el intento de pago no se ha completado. No prepararemos el pedido.',
      tone: 'text-red-700 bg-red-50',
    },
    EXPIRED: {
      icon: XCircle,
      title: 'Sesión de pago caducada',
      text: 'La sesión de pago ha caducado. Vuelve a la tienda para crear un nuevo checkout.',
      tone: 'text-black/60 bg-black/5',
    },
    UNKNOWN: {
      icon: Clock3,
      title: 'Estamos comprobando el pago',
      text: 'Todavía no podemos confirmar el estado. SumUp seguirá siendo la referencia definitiva del cobro.',
      tone: 'text-black/60 bg-black/5',
    },
  }[status]

  const Icon = content.icon

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F2F4F1] px-4 py-16 text-[#050706]">
      <div className="w-full max-w-xl rounded-[34px] border border-black/[0.07] bg-white p-8 text-center shadow-[0_30px_100px_rgba(5,7,6,0.08)] sm:p-10">
        <Image src="/logo-limpio.png" alt="GHC" width={130} height={52} className="mx-auto h-10 w-auto object-contain" />
        <div className={`mx-auto mt-8 flex h-16 w-16 items-center justify-center rounded-full ${content.tone}`}>
          <Icon className="h-8 w-8" />
        </div>
        <p className="mt-6 text-[10px] font-black uppercase tracking-[0.2em] text-[#159943]">GHC Nutrition</p>
        <h1 className="mt-2 text-3xl font-black tracking-[-0.04em]">{content.title}</h1>
        <p className="mt-4 text-sm leading-7 text-black/55">{content.text}</p>

        {reference && (
          <div className="mt-6 rounded-xl bg-[#F2F4F1] px-4 py-3 text-xs text-black/50">
            Referencia: <strong className="text-black">{reference}</strong>
          </div>
        )}

        {status === 'PAID' && referralCode && (
          <div className="mt-5 rounded-2xl bg-[#050706] p-5 text-left text-white">
            <div className="flex items-center gap-2 text-[#22D65B]"><Gift className="h-5 w-5" /><span className="text-[10px] font-black uppercase tracking-[0.18em]">Recomienda GHC</span></div>
            <p className="mt-3 text-lg font-black">Comparte tu código: {referralCode}</p>
            <p className="mt-2 text-xs leading-5 text-white/55">Cuando un amigo haga una compra pagada usando este código, generaremos para ti un cupón del 10% para tu siguiente pedido.</p>
          </div>
        )}

        <Link href="/" className="mt-7 inline-flex h-12 items-center justify-center rounded-full bg-[#050706] px-6 text-sm font-black text-white transition hover:bg-[#159943]">
          Volver a GHC Nutrition
        </Link>
      </div>
    </main>
  )
}
