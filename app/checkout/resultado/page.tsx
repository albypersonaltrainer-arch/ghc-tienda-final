import Link from 'next/link'
import { CheckCircle2, Clock3, XCircle } from 'lucide-react'

type CheckoutStatus = 'PAID' | 'PENDING' | 'FAILED' | 'EXPIRED' | 'UNKNOWN'

async function getCheckoutStatus(reference: string): Promise<CheckoutStatus> {
  const apiKey = process.env.SUMUP_API_KEY

  if (!apiKey) return 'UNKNOWN'

  try {
    const url = new URL('https://api.sumup.com/v0.1/checkouts')
    url.searchParams.set('checkout_reference', reference)

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      cache: 'no-store',
    })

    if (!response.ok) return 'UNKNOWN'

    const checkouts = (await response.json()) as Array<{ status?: CheckoutStatus }>
    return checkouts[0]?.status || 'UNKNOWN'
  } catch {
    return 'UNKNOWN'
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

  const content = {
    PAID: {
      icon: CheckCircle2,
      title: 'Pago confirmado',
      text: 'SumUp confirma que el pago se ha completado correctamente.',
      tone: 'text-emerald-600 bg-emerald-50',
    },
    PENDING: {
      icon: Clock3,
      title: 'Pago en comprobación',
      text: 'El pago todavía aparece pendiente. Puedes volver a esta página dentro de unos minutos.',
      tone: 'text-amber-600 bg-amber-50',
    },
    FAILED: {
      icon: XCircle,
      title: 'Pago no completado',
      text: 'SumUp indica que el intento de pago no se ha completado.',
      tone: 'text-red-600 bg-red-50',
    },
    EXPIRED: {
      icon: XCircle,
      title: 'Sesión de pago caducada',
      text: 'La sesión de SumUp ha caducado. Vuelve a la tienda y crea un nuevo checkout.',
      tone: 'text-zinc-600 bg-zinc-100',
    },
    UNKNOWN: {
      icon: Clock3,
      title: 'Estamos comprobando el pago',
      text: 'No podemos confirmar el estado todavía. El registro de SumUp es la referencia definitiva.',
      tone: 'text-zinc-600 bg-zinc-100',
    },
  }[status]

  const Icon = content.icon

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f4f3f0] px-4 py-16">
      <div className="w-full max-w-xl rounded-[32px] border border-zinc-200 bg-white p-8 text-center shadow-[0_30px_100px_rgba(0,0,0,0.08)] sm:p-10">
        <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${content.tone}`}>
          <Icon className="h-8 w-8" />
        </div>
        <p className="mt-6 text-xs font-black uppercase tracking-[0.18em] text-orange-600">
          GHC Nutrition
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-[-0.03em] text-zinc-950">
          {content.title}
        </h1>
        <p className="mt-4 text-sm leading-7 text-zinc-600">{content.text}</p>

        {reference && (
          <div className="mt-6 rounded-xl bg-zinc-50 px-4 py-3 text-xs text-zinc-500">
            Referencia del pedido: <strong className="text-zinc-800">{reference}</strong>
          </div>
        )}

        <Link
          href="/"
          className="mt-7 inline-flex h-12 items-center justify-center rounded-full bg-zinc-950 px-6 text-sm font-black text-white transition hover:bg-orange-500"
        >
          Volver a GHC Nutrition
        </Link>
      </div>
    </main>
  )
}
