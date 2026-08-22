'use client'

import Image from 'next/image'
import { FormEvent, useEffect, useMemo, useState } from 'react'
import {
  ArrowRight,
  Check,
  ChevronDown,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react'
import { collagenPromo, formatPrice, products, type Product } from '@/lib/catalog'

type CartItem = {
  productId: string
  flavor: string
  quantity: number
}

type CustomerForm = {
  firstName: string
  lastName: string
  email: string
  phone: string
  addressLine: string
  city: string
  postalCode: string
  state: string
  country: string
}

const EMPTY_CUSTOMER: CustomerForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  addressLine: '',
  city: '',
  postalCode: '',
  state: '',
  country: 'ES',
}

const categoryCopy = {
  Todos: 'Todo el catálogo',
  Proteína: 'Proteína y recuperación',
  Rendimiento: 'Rendimiento',
  Salud: 'Salud activa',
} as const

type Category = keyof typeof categoryCopy

function cartKey(item: Pick<CartItem, 'productId' | 'flavor'>) {
  return `${item.productId}::${item.flavor}`
}

function ProductCard({
  product,
  onAdd,
}: {
  product: Product
  onAdd: (product: Product, flavor: string) => void
}) {
  const [flavor, setFlavor] = useState(product.flavors[0])

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-zinc-200 bg-white shadow-[0_18px_50px_rgba(0,0,0,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(0,0,0,0.10)]">
      <div className="relative flex h-64 items-center justify-center overflow-hidden bg-gradient-to-b from-zinc-50 to-zinc-100 p-6">
        {product.badge && (
          <span className="absolute left-5 top-5 z-10 rounded-full bg-zinc-950 px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-white">
            {product.badge}
          </span>
        )}
        <Image
          src={product.image}
          alt={product.name}
          width={420}
          height={420}
          sizes="(max-width: 768px) 80vw, (max-width: 1200px) 40vw, 25vw"
          className="h-52 w-auto object-contain drop-shadow-xl transition duration-500 group-hover:scale-[1.05]"
        />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-5">
          <p className="mb-2 text-[11px] font-black uppercase tracking-[0.2em] text-orange-600">
            {product.category}
          </p>
          <h3 className="text-xl font-black leading-tight text-zinc-950">{product.name}</h3>
          <p className="mt-2 min-h-10 text-sm leading-5 text-zinc-500">{product.description}</p>
        </div>

        <label className="mb-5 block">
          <span className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-zinc-500">
            Formato / sabor
          </span>
          <div className="relative">
            <select
              value={flavor}
              onChange={(event) => setFlavor(event.target.value)}
              className="h-12 w-full appearance-none rounded-xl border border-zinc-200 bg-zinc-50 px-4 pr-10 text-sm font-semibold text-zinc-800 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10"
            >
              {product.flavors.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          </div>
        </label>

        <div className="mt-auto flex items-center justify-between gap-4 border-t border-zinc-100 pt-5">
          <span className="text-2xl font-black tracking-tight text-zinc-950">
            {formatPrice(product.price)}
          </span>
          <button
            type="button"
            onClick={() => onAdd(product, flavor)}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 text-sm font-black text-white transition hover:bg-orange-600 active:scale-[0.98]"
          >
            <ShoppingBag className="h-4 w-4" />
            Añadir
          </button>
        </div>
      </div>
    </article>
  )
}

export default function LandingPage() {
  const [activeCategory, setActiveCategory] = useState<Category>('Todos')
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'details'>('cart')
  const [customer, setCustomer] = useState<CustomerForm>(EMPTY_CUSTOMER)
  const [referral, setReferral] = useState<string | null>(null)
  const [checkoutError, setCheckoutError] = useState('')
  const [checkingOut, setCheckingOut] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const saved = window.localStorage.getItem('ghc_cart')
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as CartItem[]
        if (Array.isArray(parsed)) setCart(parsed)
      } catch {
        window.localStorage.removeItem('ghc_cart')
      }
    }

    const params = new URLSearchParams(window.location.search)
    const refFromUrl = params.get('ref')
    const savedRef = window.sessionStorage.getItem('ghc_ref')
    const activeRef = refFromUrl || savedRef

    if (activeRef) {
      setReferral(activeRef)
      window.sessionStorage.setItem('ghc_ref', activeRef)
    }

    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    window.localStorage.setItem('ghc_cart', JSON.stringify(cart))
  }, [cart, hydrated])

  useEffect(() => {
    document.body.style.overflow = cartOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [cartOpen])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setCartOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'Todos') return products
    return products.filter((product) => product.category === activeCategory)
  }, [activeCategory])

  const detailedCart = useMemo(() => {
    return cart
      .map((item) => {
        const product =
          item.productId === collagenPromo.id
            ? collagenPromo
            : products.find((candidate) => candidate.id === item.productId)
        return product ? { ...item, product } : null
      })
      .filter(Boolean) as Array<CartItem & { product: Product }>
  }, [cart])

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const total = detailedCart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  )

  const addToCart = (product: Product, flavor: string) => {
    setCart((current) => {
      const key = cartKey({ productId: product.id, flavor })
      const existing = current.find((item) => cartKey(item) === key)

      if (existing) {
        return current.map((item) =>
          cartKey(item) === key
            ? { ...item, quantity: Math.min(item.quantity + 1, 10) }
            : item,
        )
      }

      return [...current, { productId: product.id, flavor, quantity: 1 }]
    })
    setCheckoutStep('cart')
    setCartOpen(true)
  }

  const changeQuantity = (item: CartItem, delta: number) => {
    const key = cartKey(item)
    setCart((current) =>
      current
        .map((candidate) =>
          cartKey(candidate) === key
            ? { ...candidate, quantity: Math.max(0, Math.min(10, candidate.quantity + delta)) }
            : candidate,
        )
        .filter((candidate) => candidate.quantity > 0),
    )
  }

  const removeItem = (item: CartItem) => {
    const key = cartKey(item)
    setCart((current) => current.filter((candidate) => cartKey(candidate) !== key))
  }

  const startCheckout = () => {
    setCheckoutError('')
    setCheckoutStep('details')
  }

  const submitCheckout = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setCheckoutError('')
    setCheckingOut(true)

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          customer,
          referral,
        }),
      })

      const data = (await response.json()) as {
        checkoutUrl?: string
        error?: string
        code?: string
      }

      if (!response.ok || !data.checkoutUrl) {
        if (data.code === 'SUMUP_NOT_CONFIGURED') {
          throw new Error(
            'El carrito ya está listo, pero falta conectar la clave API y el código de comercio de SumUp.',
          )
        }
        throw new Error(data.error || 'No se pudo iniciar el pago.')
      }

      window.location.assign(data.checkoutUrl)
    } catch (error) {
      setCheckoutError(error instanceof Error ? error.message : 'No se pudo iniciar el pago.')
    } finally {
      setCheckingOut(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#f4f3f0] text-zinc-950">
      <div className="bg-zinc-950 px-4 py-2.5 text-center text-[11px] font-bold uppercase tracking-[0.14em] text-zinc-200">
        Distribuidor oficial Beverly Nutrition · Pago seguro con SumUp
      </div>

      <header className="sticky top-0 z-40 border-b border-black/5 bg-[#f4f3f0]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <a href="#" className="flex items-center gap-3" aria-label="GHC Nutrition, inicio">
            <Image
              src="/logo-limpio.png"
              alt="GHC Nutrition"
              width={90}
              height={90}
              priority
              className="h-14 w-14 object-contain"
            />
            <div className="hidden sm:block">
              <p className="text-sm font-black uppercase tracking-[0.12em]">GHC Nutrition</p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
                Health Through Strength
              </p>
            </div>
          </a>

          <nav className="hidden items-center gap-8 text-sm font-bold text-zinc-700 md:flex">
            <a href="#catalogo" className="transition hover:text-orange-600">
              Productos
            </a>
            <a href="#criterio" className="transition hover:text-orange-600">
              Nuestro criterio
            </a>
            <a href="#oferta" className="transition hover:text-orange-600">
              Oferta
            </a>
          </nav>

          <button
            type="button"
            onClick={() => {
              setCheckoutStep('cart')
              setCartOpen(true)
            }}
            className="relative inline-flex h-11 items-center gap-2 rounded-full bg-zinc-950 px-4 text-sm font-black text-white transition hover:bg-orange-500"
            aria-label={`Abrir carrito, ${itemCount} productos`}
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">Carrito</span>
            <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-orange-500 px-1.5 py-0.5 text-[11px] text-white">
              {itemCount}
            </span>
          </button>
        </div>
      </header>

      <section className="relative overflow-hidden bg-zinc-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(249,115,22,0.24),transparent_34%),radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.08),transparent_32%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 md:py-28 lg:grid-cols-[1.15fr_0.85fr] lg:px-8">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-zinc-200">
              <Sparkles className="h-4 w-4 text-orange-400" />
              Suplementación con criterio
            </div>
            <h1 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
              No vendemos botes.
              <span className="block text-orange-500">Recomendamos herramientas.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-zinc-300">
              Una selección directa para rendimiento, recuperación y salud activa. Sin catálogo
              infinito, sin ruido y con una compra mucho más sencilla.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href="#catalogo"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-orange-500 px-6 text-sm font-black text-white transition hover:bg-orange-600"
              >
                Ver productos
                <ArrowRight className="h-4 w-4" />
              </a>
              <button
                type="button"
                onClick={() => {
                  setCheckoutStep('cart')
                  setCartOpen(true)
                }}
                className="inline-flex h-12 items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 text-sm font-black text-white transition hover:bg-white/10"
              >
                <ShoppingBag className="h-4 w-4" />
                Mi carrito
              </button>
            </div>
          </div>

          <div id="criterio" className="grid content-center gap-3">
            {[
              ['01', 'Rendimiento', 'Productos seleccionados para apoyar entrenamientos exigentes.'],
              ['02', 'Recuperación', 'Proteína y aminoácidos sin hacerte perderte entre cien opciones.'],
              ['03', 'Salud activa', 'Complementos para una estrategia diaria simple y coherente.'],
            ].map(([number, title, text]) => (
              <div
                key={number}
                className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur"
              >
                <div className="flex gap-4">
                  <span className="text-sm font-black text-orange-400">{number}</span>
                  <div>
                    <h2 className="font-black">{title}</h2>
                    <p className="mt-1 text-sm leading-6 text-zinc-400">{text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="oferta" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[34px] bg-orange-500 text-white shadow-[0_30px_90px_rgba(249,115,22,0.24)]">
          <div className="grid items-center gap-6 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="flex min-h-[380px] items-center justify-center bg-white/95 p-8">
              <Image
                src={collagenPromo.image}
                alt={collagenPromo.name}
                width={560}
                height={560}
                sizes="(max-width: 1024px) 90vw, 40vw"
                className="h-[320px] w-auto object-contain drop-shadow-2xl"
              />
            </div>
            <div className="p-8 sm:p-10 lg:p-12">
              <span className="inline-flex rounded-full bg-zinc-950 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-white">
                Oferta especial
              </span>
              <h2 className="mt-5 text-4xl font-black tracking-[-0.035em] sm:text-5xl">
                2 cajas de colágeno
              </h2>
              <p className="mt-4 max-w-xl text-base leading-7 text-orange-50">
                40 viales con Colágeno Peptan, vitamina C y ácido hialurónico.
              </p>
              <div className="mt-7 flex items-end gap-4">
                <span className="text-5xl font-black">{formatPrice(collagenPromo.price)}</span>
                <span className="pb-1 text-xl font-bold text-orange-100 line-through">
                  {formatPrice(collagenPromo.regularPrice || collagenPromo.price)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => addToCart(collagenPromo, collagenPromo.flavors[0])}
                className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-zinc-950 px-6 text-sm font-black text-white transition hover:bg-zinc-800"
              >
                <ShoppingBag className="h-4 w-4" />
                Añadir pack al carrito
              </button>
            </div>
          </div>
        </div>
      </section>

      <section id="catalogo" className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mb-9 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-600">Catálogo</p>
            <h2 className="mt-2 text-4xl font-black tracking-[-0.035em] sm:text-5xl">
              Compra por objetivo
            </h2>
            <p className="mt-3 max-w-2xl text-zinc-600">
              Elige el producto, el sabor y añádelo al carrito. Puedes combinar varios productos y
              hacer un único pago.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {(Object.keys(categoryCopy) as Category[]).map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`rounded-full px-4 py-2 text-sm font-black transition ${
                  activeCategory === category
                    ? 'bg-zinc-950 text-white'
                    : 'border border-zinc-200 bg-white text-zinc-600 hover:border-zinc-400'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onAdd={addToCart} />
          ))}
        </div>
      </section>

      <section className="border-y border-zinc-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
          {[
            [ShieldCheck, 'Pago protegido', 'El pago final se procesa en el entorno seguro de SumUp.'],
            [ShoppingBag, 'Un solo carrito', 'Combina productos, sabores y cantidades antes de pagar.'],
            [Check, 'Selección directa', 'Un catálogo corto y fácil de entender, sin ruido innecesario.'],
          ].map(([Icon, title, text]) => {
            const ItemIcon = Icon as typeof ShieldCheck
            return (
              <div key={String(title)} className="flex gap-4 rounded-2xl bg-zinc-50 p-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                  <ItemIcon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-black">{String(title)}</h3>
                  <p className="mt-1 text-sm leading-6 text-zinc-500">{String(text)}</p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <footer className="bg-zinc-950 text-zinc-300">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div className="flex items-center gap-3">
            <Image
              src="/logo-limpio.png"
              alt="GHC Nutrition"
              width={72}
              height={72}
              className="h-12 w-12 object-contain"
            />
            <div>
              <p className="font-black text-white">GHC Nutrition</p>
              <p className="text-xs text-zinc-500">Distribuidor oficial Beverly Nutrition</p>
            </div>
          </div>
          <p className="max-w-lg text-sm leading-6 text-zinc-500 md:text-right">
            Suplementación deportiva seleccionada con un enfoque simple: producto, objetivo y
            criterio.
          </p>
        </div>
      </footer>

      {cartOpen && (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Cerrar carrito"
            onClick={() => setCartOpen(false)}
            className="absolute inset-0 bg-black/55 backdrop-blur-sm"
          />

          <aside
            className="absolute right-0 top-0 flex h-full w-full max-w-xl flex-col bg-white shadow-2xl"
            aria-label="Carrito de compra"
          >
            <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4 sm:px-6">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-orange-600">
                  {checkoutStep === 'cart' ? 'Tu selección' : 'Datos de entrega'}
                </p>
                <h2 className="text-2xl font-black">
                  {checkoutStep === 'cart' ? 'Carrito' : 'Finalizar compra'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setCartOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-700 transition hover:bg-zinc-200"
                aria-label="Cerrar carrito"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {checkoutStep === 'cart' ? (
              <>
                <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
                  {detailedCart.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center text-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                        <ShoppingBag className="h-7 w-7" />
                      </div>
                      <h3 className="mt-5 text-xl font-black">Tu carrito está vacío</h3>
                      <p className="mt-2 max-w-xs text-sm leading-6 text-zinc-500">
                        Añade los productos que quieras y los pagarás todos juntos.
                      </p>
                      <button
                        type="button"
                        onClick={() => setCartOpen(false)}
                        className="mt-6 rounded-full bg-zinc-950 px-5 py-2.5 text-sm font-black text-white"
                      >
                        Seguir comprando
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {detailedCart.map((item) => (
                        <div
                          key={cartKey(item)}
                          className="grid grid-cols-[82px_1fr] gap-4 rounded-2xl border border-zinc-200 p-3"
                        >
                          <div className="flex h-20 items-center justify-center rounded-xl bg-zinc-50 p-2">
                            <Image
                              src={item.product.image}
                              alt={item.product.name}
                              width={100}
                              height={100}
                              className="h-16 w-16 object-contain"
                            />
                          </div>
                          <div className="min-w-0">
                            <div className="flex justify-between gap-3">
                              <div>
                                <h3 className="text-sm font-black leading-5">{item.product.name}</h3>
                                <p className="mt-1 text-xs text-zinc-500">{item.flavor}</p>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeItem(item)}
                                className="h-8 w-8 shrink-0 rounded-full text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-900"
                                aria-label={`Eliminar ${item.product.name}`}
                              >
                                <Trash2 className="mx-auto h-4 w-4" />
                              </button>
                            </div>

                            <div className="mt-3 flex items-center justify-between">
                              <div className="inline-flex items-center rounded-full border border-zinc-200">
                                <button
                                  type="button"
                                  onClick={() => changeQuantity(item, -1)}
                                  className="flex h-8 w-8 items-center justify-center"
                                  aria-label="Restar una unidad"
                                >
                                  <Minus className="h-3.5 w-3.5" />
                                </button>
                                <span className="min-w-8 text-center text-sm font-black">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => changeQuantity(item, 1)}
                                  className="flex h-8 w-8 items-center justify-center"
                                  aria-label="Añadir una unidad"
                                >
                                  <Plus className="h-3.5 w-3.5" />
                                </button>
                              </div>
                              <span className="font-black">
                                {formatPrice(item.product.price * item.quantity)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {detailedCart.length > 0 && (
                  <div className="border-t border-zinc-200 bg-zinc-50 px-5 py-5 sm:px-6">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-sm font-bold text-zinc-500">Total productos</span>
                      <span className="text-3xl font-black tracking-tight">{formatPrice(total)}</span>
                    </div>
                    <button
                      type="button"
                      onClick={startCheckout}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3.5 text-sm font-black text-white transition hover:bg-orange-600"
                    >
                      Continuar al pago
                      <ArrowRight className="h-4 w-4" />
                    </button>
                    <p className="mt-3 text-center text-xs leading-5 text-zinc-500">
                      El importe final se vuelve a calcular en el servidor para evitar manipulaciones.
                    </p>
                  </div>
                )}
              </>
            ) : (
              <form onSubmit={submitCheckout} className="flex min-h-0 flex-1 flex-col">
                <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
                  <button
                    type="button"
                    onClick={() => setCheckoutStep('cart')}
                    className="mb-5 text-sm font-black text-zinc-500 transition hover:text-zinc-950"
                  >
                    ← Volver al carrito
                  </button>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-1.5 block text-xs font-black uppercase tracking-[0.1em] text-zinc-500">
                        Nombre
                      </span>
                      <input
                        required
                        value={customer.firstName}
                        onChange={(event) =>
                          setCustomer((current) => ({ ...current, firstName: event.target.value }))
                        }
                        className="h-11 w-full rounded-xl border border-zinc-200 px-3 text-sm outline-none focus:border-orange-500"
                        autoComplete="given-name"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1.5 block text-xs font-black uppercase tracking-[0.1em] text-zinc-500">
                        Apellidos
                      </span>
                      <input
                        required
                        value={customer.lastName}
                        onChange={(event) =>
                          setCustomer((current) => ({ ...current, lastName: event.target.value }))
                        }
                        className="h-11 w-full rounded-xl border border-zinc-200 px-3 text-sm outline-none focus:border-orange-500"
                        autoComplete="family-name"
                      />
                    </label>
                    <label className="block sm:col-span-2">
                      <span className="mb-1.5 block text-xs font-black uppercase tracking-[0.1em] text-zinc-500">
                        Email
                      </span>
                      <input
                        required
                        type="email"
                        value={customer.email}
                        onChange={(event) =>
                          setCustomer((current) => ({ ...current, email: event.target.value }))
                        }
                        className="h-11 w-full rounded-xl border border-zinc-200 px-3 text-sm outline-none focus:border-orange-500"
                        autoComplete="email"
                      />
                    </label>
                    <label className="block sm:col-span-2">
                      <span className="mb-1.5 block text-xs font-black uppercase tracking-[0.1em] text-zinc-500">
                        Teléfono
                      </span>
                      <input
                        required
                        value={customer.phone}
                        onChange={(event) =>
                          setCustomer((current) => ({ ...current, phone: event.target.value }))
                        }
                        className="h-11 w-full rounded-xl border border-zinc-200 px-3 text-sm outline-none focus:border-orange-500"
                        autoComplete="tel"
                      />
                    </label>
                    <label className="block sm:col-span-2">
                      <span className="mb-1.5 block text-xs font-black uppercase tracking-[0.1em] text-zinc-500">
                        Dirección
                      </span>
                      <input
                        required
                        value={customer.addressLine}
                        onChange={(event) =>
                          setCustomer((current) => ({ ...current, addressLine: event.target.value }))
                        }
                        className="h-11 w-full rounded-xl border border-zinc-200 px-3 text-sm outline-none focus:border-orange-500"
                        autoComplete="street-address"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1.5 block text-xs font-black uppercase tracking-[0.1em] text-zinc-500">
                        Ciudad
                      </span>
                      <input
                        required
                        value={customer.city}
                        onChange={(event) =>
                          setCustomer((current) => ({ ...current, city: event.target.value }))
                        }
                        className="h-11 w-full rounded-xl border border-zinc-200 px-3 text-sm outline-none focus:border-orange-500"
                        autoComplete="address-level2"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1.5 block text-xs font-black uppercase tracking-[0.1em] text-zinc-500">
                        Código postal
                      </span>
                      <input
                        required
                        value={customer.postalCode}
                        onChange={(event) =>
                          setCustomer((current) => ({ ...current, postalCode: event.target.value }))
                        }
                        className="h-11 w-full rounded-xl border border-zinc-200 px-3 text-sm outline-none focus:border-orange-500"
                        autoComplete="postal-code"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1.5 block text-xs font-black uppercase tracking-[0.1em] text-zinc-500">
                        Provincia / región
                      </span>
                      <input
                        required
                        value={customer.state}
                        onChange={(event) =>
                          setCustomer((current) => ({ ...current, state: event.target.value }))
                        }
                        className="h-11 w-full rounded-xl border border-zinc-200 px-3 text-sm outline-none focus:border-orange-500"
                        autoComplete="address-level1"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1.5 block text-xs font-black uppercase tracking-[0.1em] text-zinc-500">
                        País
                      </span>
                      <input
                        required
                        maxLength={2}
                        value={customer.country}
                        onChange={(event) =>
                          setCustomer((current) => ({
                            ...current,
                            country: event.target.value.toUpperCase(),
                          }))
                        }
                        className="h-11 w-full rounded-xl border border-zinc-200 px-3 text-sm uppercase outline-none focus:border-orange-500"
                        autoComplete="country"
                        aria-describedby="country-help"
                      />
                      <span id="country-help" className="mt-1 block text-[11px] text-zinc-400">
                        Código de 2 letras, por ejemplo ES.
                      </span>
                    </label>
                  </div>

                  {referral && (
                    <div className="mt-5 rounded-xl bg-zinc-100 px-4 py-3 text-xs text-zinc-600">
                      Referencia asociada: <strong>{referral}</strong>
                    </div>
                  )}

                  {checkoutError && (
                    <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
                      {checkoutError}
                    </div>
                  )}
                </div>

                <div className="border-t border-zinc-200 bg-zinc-50 px-5 py-5 sm:px-6">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-sm font-bold text-zinc-500">Total</span>
                    <span className="text-3xl font-black">{formatPrice(total)}</span>
                  </div>
                  <button
                    type="submit"
                    disabled={checkingOut}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3.5 text-sm font-black text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {checkingOut ? 'Preparando pago…' : 'Pagar todo con SumUp'}
                    {!checkingOut && <ShieldCheck className="h-4 w-4" />}
                  </button>
                  <p className="mt-3 text-center text-[11px] leading-5 text-zinc-500">
                    Tus datos de tarjeta no pasan por GHC Nutrition. El pago se completa en SumUp.
                  </p>
                </div>
              </form>
            )}
          </aside>
        </div>
      )}
    </main>
  )
}
