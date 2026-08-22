'use client'

import Image from 'next/image'
import Link from 'next/link'
import { FormEvent, useEffect, useMemo, useState } from 'react'
import {
  ArrowDownRight,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Minus,
  PackageCheck,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  Truck,
  X,
} from 'lucide-react'
import GHCNutritionLogo from '@/app/components/GHCNutritionLogo'
import {
  formatPrice,
  productCategories,
  products,
  type Product,
  type ProductCategory,
} from '@/lib/catalog'
import { FREE_SHIPPING_THRESHOLD, getShippingCost } from '@/lib/commerce'

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
}

type CategoryFilter = 'Todos' | ProductCategory

const filters: CategoryFilter[] = ['Todos', ...productCategories]

const EMPTY_CUSTOMER: CustomerForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  addressLine: '',
  city: '',
  postalCode: '',
}

const heroScenes = [
  {
    eyebrow: 'FUERZA · CONTROL · CRITERIO',
    title: 'El esfuerzo ya lo pones tú.',
    accent: 'Nosotros afinamos lo demás.',
    text: 'Suplementación deportiva seleccionada con criterio profesional. Sin ruido, sin promesas vacías, sin catálogo infinito.',
    image: 'https://images.unsplash.com/photo-1643320193964-2bac93c38493?auto=format&fit=crop&fm=jpg&q=88&w=2200',
    productId: 'whey-pro-concentrate-2kg',
    credit: 'With Mahdy · Unsplash',
  },
  {
    eyebrow: 'ENTRENAR BIEN ES DECIDIR MEJOR',
    title: 'No necesitas más productos.',
    accent: 'Necesitas mejores elecciones.',
    text: 'GHC Nutrition no nace para llenar una estantería. Nace para filtrar, seleccionar y recomendar lo que sí tiene sentido.',
    image: 'https://images.unsplash.com/photo-1697019921955-51a39f0fc354?auto=format&fit=crop&fm=jpg&q=88&w=2200',
    productId: 'creapure-300g',
    credit: 'David Beneš · Unsplash',
  },
  {
    eyebrow: 'RENDIMIENTO · RECUPERACIÓN · SALUD',
    title: 'El contexto importa.',
    accent: 'También lo que tomas.',
    text: 'Producto real, ficha clara y una selección pensada desde la experiencia de campo, no desde una tendencia de redes.',
    image: 'https://images.unsplash.com/photo-1781379947451-c2afb28607d7?auto=format&fit=crop&fm=jpg&q=88&w=2200',
    productId: 'magnesium-bisglycinate-b6',
    credit: 'Eirik Skarstein · Unsplash',
  },
] as const

const wheyEditorialFlavors = [
  { name: 'Belgian Choco', tint: '#E7DDD2' },
  { name: 'Banana', tint: '#EEE7C9' },
  { name: 'Choco Cookies', tint: '#DED8D0' },
  { name: 'Strawberry', tint: '#EBD8D8' },
  { name: 'Vainilla Ice Cream', tint: '#EEE9DA' },
]

const philosophyRows = [
  ['01', 'Selección antes que volumen', 'No necesitamos venderte cien referencias. Necesitamos que las que entren tengan una razón para estar.'],
  ['02', 'Ficha antes que promesa', 'Ingredientes, formato, uso y contexto visibles antes de comprar. Menos titulares. Más información.'],
  ['03', 'Entrenamiento antes que moda', 'Un suplemento acompaña una estrategia. Nunca sustituye entrenamiento, alimentación y descanso.'],
]

function productImage(product: Product, className: string, priority = false, src?: string) {
  return (
    <Image
      src={src || product.image}
      alt={product.name}
      width={760}
      height={760}
      priority={priority}
      unoptimized
      className={className}
    />
  )
}

function cartKey(item: Pick<CartItem, 'productId' | 'flavor'>) {
  return `${item.productId}::${item.flavor}`
}

export default function LandingPage() {
  const [heroIndex, setHeroIndex] = useState(0)
  const [wheyFlavor, setWheyFlavor] = useState(wheyEditorialFlavors[0].name)
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('Todos')
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'details'>('cart')
  const [customer, setCustomer] = useState<CustomerForm>(EMPTY_CUSTOMER)
  const [couponCode, setCouponCode] = useState('')
  const [referral, setReferral] = useState<string | null>(null)
  const [trainerCode, setTrainerCode] = useState<string | null>(null)
  const [checkoutError, setCheckoutError] = useState('')
  const [checkingOut, setCheckingOut] = useState(false)
  const [hydrated, setHydrated] = useState(false)
  const [openProductId, setOpenProductId] = useState<string | null>(null)
  const [rowFlavors, setRowFlavors] = useState<Record<string, string>>({})

  useEffect(() => {
    const timer = window.setInterval(() => {
      setHeroIndex((current) => (current + 1) % heroScenes.length)
    }, 9000)
    return () => window.clearInterval(timer)
  }, [])

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
    const coachFromUrl = params.get('coach')
    const savedRef = window.sessionStorage.getItem('ghc_ref')
    const savedCoach = window.sessionStorage.getItem('ghc_coach')
    const activeRef = refFromUrl || savedRef
    const activeCoach = coachFromUrl || savedCoach

    if (activeRef) {
      setReferral(activeRef)
      window.sessionStorage.setItem('ghc_ref', activeRef)
    }
    if (activeCoach) {
      setTrainerCode(activeCoach)
      window.sessionStorage.setItem('ghc_coach', activeCoach)
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (hydrated) window.localStorage.setItem('ghc_cart', JSON.stringify(cart))
  }, [cart, hydrated])

  useEffect(() => {
    document.body.style.overflow = cartOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [cartOpen])

  const currentHero = heroScenes[heroIndex]
  const heroProduct = products.find((product) => product.id === currentHero.productId) || products[0]
  const whey = products.find((product) => product.id === 'whey-pro-concentrate-2kg') || products[0]
  const wheyTint = wheyEditorialFlavors.find((item) => item.name === wheyFlavor)?.tint || '#E7DDD2'
  const wheyImage = `/api/product-image?name=${encodeURIComponent(`Whey Pro Concentrate - 2 Kg - ${wheyFlavor}`)}`

  const visibleProducts = useMemo(() => {
    if (activeCategory === 'Todos') return products
    return products.filter((product) => product.categories.includes(activeCategory))
  }, [activeCategory])

  const cartDetailed = useMemo(() => {
    return cart
      .map((item) => {
        const product = products.find((candidate) => candidate.id === item.productId)
        return product ? { ...item, product } : null
      })
      .filter(Boolean) as Array<CartItem & { product: Product }>
  }, [cart])

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = cartDetailed.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const shipping = getShippingCost(subtotal)
  const displayTotal = subtotal + shipping
  const freeShippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)
  const shippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)

  function selectedFlavor(product: Product) {
    return rowFlavors[product.id] || product.flavors[0]
  }

  function addToCart(product: Product, flavor = selectedFlavor(product)) {
    setCart((current) => {
      const key = `${product.id}::${flavor}`
      const existing = current.find((item) => cartKey(item) === key)
      if (existing) {
        return current.map((item) => cartKey(item) === key ? { ...item, quantity: Math.min(10, item.quantity + 1) } : item)
      }
      return [...current, { productId: product.id, flavor, quantity: 1 }]
    })
    setCartOpen(true)
    setCheckoutStep('cart')
  }

  function changeQuantity(item: CartItem, delta: number) {
    const key = cartKey(item)
    setCart((current) => current
      .map((entry) => cartKey(entry) === key ? { ...entry, quantity: entry.quantity + delta } : entry)
      .filter((entry) => entry.quantity > 0))
  }

  function removeItem(item: CartItem) {
    const key = cartKey(item)
    setCart((current) => current.filter((entry) => cartKey(entry) !== key))
  }

  async function checkout(event: FormEvent) {
    event.preventDefault()
    setCheckoutError('')
    if (!cart.length) return
    setCheckingOut(true)

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          customer: { ...customer, state: 'Madrid', country: 'ES' },
          referral,
          trainerCode,
          couponCode: couponCode || null,
        }),
      })
      const data = await response.json() as { checkoutUrl?: string; error?: string }
      if (!response.ok || !data.checkoutUrl) {
        setCheckoutError(data.error || 'No se ha podido iniciar el pedido.')
        return
      }
      window.location.assign(data.checkoutUrl)
    } catch {
      setCheckoutError('No se ha podido conectar con el pago. Inténtalo de nuevo.')
    } finally {
      setCheckingOut(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#F4F4F0] text-[#0A0D0B] selection:bg-[#27D65F] selection:text-black">
      <div className="bg-[#0A0D0B] px-4 py-2.5 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-white/80">
        Madrid · envío gratis desde {formatPrice(FREE_SHIPPING_THRESHOLD)}
      </div>

      <header className="sticky top-0 z-50 border-b border-black/8 bg-[#F4F4F0]/92 backdrop-blur-xl">
        <div className="mx-auto flex h-[74px] max-w-[1500px] items-center justify-between px-5 lg:px-9">
          <Link href="#inicio" aria-label="GHC Nutrition - Inicio">
            <GHCNutritionLogo size="sm" />
          </Link>
          <nav className="hidden items-center gap-8 text-xs font-bold uppercase tracking-[0.14em] lg:flex">
            <a href="#seleccion" className="transition hover:text-[#169646]">Selección GHC</a>
            <a href="#catalogo" className="transition hover:text-[#169646]">Catálogo</a>
            <a href="#criterio" className="transition hover:text-[#169646]">Criterio</a>
          </nav>
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="group inline-flex items-center gap-3 text-xs font-black uppercase tracking-[0.14em]"
          >
            <span className="hidden sm:inline">Carrito</span>
            <span className="relative grid h-10 w-10 place-items-center rounded-full bg-[#0A0D0B] text-white transition group-hover:bg-[#169646]">
              <ShoppingBag className="h-4 w-4" />
              {cartCount > 0 && <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#27D65F] px-1 text-[9px] font-black text-black">{cartCount}</span>}
            </span>
          </button>
        </div>
      </header>

      <section id="inicio" className="relative min-h-[760px] overflow-hidden border-b border-black/10 lg:min-h-[820px]">
        <div className="absolute inset-0 grid lg:grid-cols-[0.46fr_0.54fr]">
          <div className="bg-[#F4F4F0]" />
          <div
            key={currentHero.image}
            className="hero-photo relative bg-cover bg-center"
            style={{ backgroundImage: `url(${currentHero.image})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#F4F4F0] via-[#F4F4F0]/10 to-transparent lg:from-[#F4F4F0]/45" />
            <div className="absolute inset-0 bg-black/10" />
            <span className="absolute bottom-5 right-5 text-[9px] font-semibold uppercase tracking-[0.14em] text-white/65">{currentHero.credit}</span>
          </div>
        </div>

        <div className="relative mx-auto grid min-h-[760px] max-w-[1500px] items-center px-5 py-16 lg:min-h-[820px] lg:grid-cols-[0.58fr_0.42fr] lg:px-9">
          <div className="relative z-10 max-w-[760px] pb-64 pt-10 lg:pb-0 lg:pt-0">
            <p className="mb-8 text-[10px] font-black uppercase tracking-[0.28em] text-[#169646]">{currentHero.eyebrow}</p>
            <h1 className="max-w-[760px] text-[clamp(3.4rem,6.6vw,7.9rem)] font-black leading-[0.84] tracking-[-0.075em]">
              {currentHero.title}
              <span className="mt-2 block font-medium italic text-[#169646]">{currentHero.accent}</span>
            </h1>
            <p className="mt-9 max-w-[560px] text-base leading-7 text-black/58 md:text-lg md:leading-8">{currentHero.text}</p>
            <div className="mt-10 flex flex-wrap items-center gap-5">
              <a href="#seleccion" className="inline-flex items-center gap-3 border-b-2 border-[#0A0D0B] pb-2 text-xs font-black uppercase tracking-[0.15em] transition hover:border-[#169646] hover:text-[#169646]">
                Descubrir la selección <ArrowDownRight className="h-4 w-4" />
              </a>
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-black/35">29 referencias seleccionadas</span>
            </div>
          </div>

          <div className="pointer-events-none absolute bottom-8 right-3 z-20 lg:relative lg:bottom-auto lg:right-auto lg:flex lg:h-[620px] lg:items-end lg:justify-center">
            <div key={`${heroIndex}-${heroProduct.id}`} className="hero-product relative w-[250px] sm:w-[330px] lg:w-[430px]">
              {productImage(heroProduct, 'h-auto w-full object-contain drop-shadow-[0_35px_32px_rgba(0,0,0,0.35)]', true)}
              <div className="absolute -bottom-2 left-1/2 w-max -translate-x-1/2 bg-[#F4F4F0]/92 px-4 py-2 backdrop-blur">
                <p className="text-center text-[9px] font-black uppercase tracking-[0.18em] text-black/45">Selección GHC</p>
                <p className="mt-1 text-center text-sm font-black">{heroProduct.name} · {formatPrice(heroProduct.price)}</p>
              </div>
            </div>
          </div>

          <div className="absolute bottom-5 left-5 z-30 flex items-center gap-2 lg:bottom-8 lg:left-9">
            <button type="button" onClick={() => setHeroIndex((heroIndex + heroScenes.length - 1) % heroScenes.length)} className="grid h-9 w-9 place-items-center border border-black/15 bg-[#F4F4F0]/80 backdrop-blur transition hover:bg-white" aria-label="Anterior"><ChevronLeft className="h-4 w-4" /></button>
            <span className="min-w-14 text-center text-[10px] font-black tracking-[0.18em]">0{heroIndex + 1} / 0{heroScenes.length}</span>
            <button type="button" onClick={() => setHeroIndex((heroIndex + 1) % heroScenes.length)} className="grid h-9 w-9 place-items-center border border-black/15 bg-[#F4F4F0]/80 backdrop-blur transition hover:bg-white" aria-label="Siguiente"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
      </section>

      <section id="seleccion" className="border-b border-black/10 bg-[#ECEDE8]">
        <div className="mx-auto max-w-[1500px] px-5 py-24 lg:px-9 lg:py-36">
          <div className="grid gap-14 lg:grid-cols-[0.36fr_0.64fr]">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#169646]">La selección GHC</p>
              <h2 className="mt-5 text-4xl font-black leading-[0.95] tracking-[-0.055em] md:text-6xl">No vendemos botes.<br /><span className="font-medium italic">Recomendamos herramientas.</span></h2>
              <p className="mt-7 max-w-md text-sm leading-7 text-black/55">Hemos trabajado durante décadas alrededor del entrenamiento. La tienda empieza justo donde termina el marketing: en decidir qué producto merece ocupar un lugar.</p>
            </div>
            <div className="divide-y divide-black/12 border-y border-black/12">
              {philosophyRows.map(([number, title, text]) => (
                <div key={number} className="grid gap-5 py-8 md:grid-cols-[70px_0.45fr_0.55fr] md:items-start md:py-10">
                  <span className="text-xs font-black text-[#169646]">{number}</span>
                  <h3 className="text-2xl font-black tracking-[-0.035em]">{title}</h3>
                  <p className="max-w-xl text-sm leading-7 text-black/52">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden border-b border-black/10 bg-[#0A0D0B] text-white">
        <div className="mx-auto grid max-w-[1500px] lg:grid-cols-[0.55fr_0.45fr]">
          <div className="relative min-h-[610px] overflow-hidden px-5 py-20 lg:min-h-[760px] lg:px-9 lg:py-28" style={{ background: wheyTint }}>
            <div className="absolute left-8 top-8 text-[9px] font-black uppercase tracking-[0.2em] text-black/45">GHC Product Study / 001</div>
            <div className="absolute inset-0 flex items-center justify-center pt-16">
              {productImage(whey, 'product-study-image h-[390px] w-auto object-contain drop-shadow-[0_40px_35px_rgba(0,0,0,0.28)] md:h-[540px]', false, wheyImage)}
            </div>
            <div className="absolute bottom-8 left-8 text-[10px] font-bold uppercase tracking-[0.18em] text-black/45">{wheyFlavor}</div>
          </div>

          <div className="flex flex-col justify-center px-5 py-16 lg:px-14 lg:py-20 xl:px-20">
            <p className="text-[10px] font-black uppercase tracking-[0.26em] text-[#27D65F]">Producto editorial</p>
            <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-white/40">Proteína · 2 kg</p>
            <h2 className="mt-3 text-4xl font-black tracking-[-0.055em] md:text-6xl">Whey Pro<br />Concentrate</h2>
            <p className="mt-6 max-w-xl text-sm leading-7 text-white/52">Proteína de suero concentrada Lacprodan® con enzimas digestivas. Una referencia que usamos como ejemplo de cómo queremos presentar el catálogo: producto grande, información clara y elección visible.</p>

            <div className="mt-10">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/45">Elige sabor</p>
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-3">
                {wheyEditorialFlavors.map((flavor) => (
                  <button key={flavor.name} type="button" onClick={() => setWheyFlavor(flavor.name)} className={`group inline-flex items-center gap-2 text-sm font-bold transition ${wheyFlavor === flavor.name ? 'text-white' : 'text-white/42 hover:text-white/75'}`}>
                    <span className={`h-3 w-3 rounded-full border ${wheyFlavor === flavor.name ? 'border-white ring-2 ring-white/25 ring-offset-2 ring-offset-[#0A0D0B]' : 'border-white/20'}`} style={{ background: flavor.tint }} />
                    {flavor.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-12 flex items-end justify-between border-t border-white/12 pt-7">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/35">PVP</p>
                <p className="mt-1 text-4xl font-black tracking-[-0.04em]">{formatPrice(whey.price)}</p>
              </div>
              <button type="button" onClick={() => addToCart(whey, wheyFlavor)} className="inline-flex items-center gap-3 border-b border-[#27D65F] pb-2 text-xs font-black uppercase tracking-[0.14em] text-[#27D65F] transition hover:text-white">
                Añadir al carrito <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section id="criterio" className="border-b border-black/10 bg-[#F4F4F0]">
        <div className="mx-auto max-w-[1500px] px-5 py-24 lg:px-9 lg:py-36">
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#169646]">No todos los suplementos son iguales</p>
          <div className="mt-8 grid gap-12 lg:grid-cols-2 lg:gap-0">
            <div className="border-black/12 lg:border-r lg:pr-16">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-black/30">Comprar por moda</p>
              <div className="mt-10 space-y-8 text-3xl font-black leading-tight tracking-[-0.04em] text-black/25 md:text-5xl">
                <p>Más ingredientes ≠ mejor.</p>
                <p>Más estímulo ≠ más rendimiento.</p>
                <p>Más productos ≠ mejor estrategia.</p>
              </div>
            </div>
            <div className="lg:pl-16">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#169646]">Comprar con criterio</p>
              <div className="mt-10 space-y-8 text-3xl font-black leading-tight tracking-[-0.04em] md:text-5xl">
                <p className="flex gap-4"><Check className="mt-1 h-7 w-7 shrink-0 text-[#169646] md:h-10 md:w-10" /> Objetivo antes que producto.</p>
                <p className="flex gap-4"><Check className="mt-1 h-7 w-7 shrink-0 text-[#169646] md:h-10 md:w-10" /> Fórmula antes que campaña.</p>
                <p className="flex gap-4"><Check className="mt-1 h-7 w-7 shrink-0 text-[#169646] md:h-10 md:w-10" /> Contexto antes que impulso.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="catalogo" className="bg-[#F8F8F5]">
        <div className="mx-auto max-w-[1500px] px-5 py-24 lg:px-9 lg:py-36">
          <div className="grid items-end gap-8 md:grid-cols-[1fr_auto]">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#169646]">Catálogo GHC Nutrition</p>
              <h2 className="mt-5 max-w-4xl text-5xl font-black leading-[0.9] tracking-[-0.065em] md:text-7xl lg:text-8xl">Producto por producto.<br /><span className="font-medium italic">Sin estantería infinita.</span></h2>
            </div>
            <p className="max-w-sm text-sm leading-7 text-black/48">Filtra por necesidad. Abre cada referencia para consultar su ficha técnica antes de añadirla.</p>
          </div>

          <div className="mt-14 flex gap-6 overflow-x-auto border-y border-black/10 py-5 scrollbar-none">
            {filters.map((filter) => {
              const count = filter === 'Todos' ? products.length : products.filter((product) => product.categories.includes(filter)).length
              const active = activeCategory === filter
              return (
                <button key={filter} type="button" onClick={() => setActiveCategory(filter)} className={`shrink-0 text-xs font-black uppercase tracking-[0.13em] transition ${active ? 'text-[#169646]' : 'text-black/38 hover:text-black'}`}>
                  {filter} <span className="ml-1 text-[9px]">{String(count).padStart(2, '0')}</span>
                </button>
              )
            })}
          </div>

          <div className="border-b border-black/12">
            {visibleProducts.map((product, index) => {
              const flavor = selectedFlavor(product)
              const expanded = openProductId === product.id
              return (
                <article key={product.id} className="border-t border-black/12">
                  <div className="grid min-h-[270px] gap-7 py-8 md:grid-cols-[62px_210px_1fr_auto] md:items-center md:gap-8 lg:grid-cols-[70px_260px_1fr_180px] lg:py-10">
                    <div className="flex items-start justify-between md:block">
                      <span className="text-[10px] font-black tracking-[0.18em] text-black/28">{String(index + 1).padStart(2, '0')}</span>
                      <span className="text-[9px] font-black uppercase tracking-[0.15em] text-[#169646] md:hidden">{product.category}</span>
                    </div>

                    <button type="button" onClick={() => setOpenProductId(expanded ? null : product.id)} className="group relative flex h-[230px] items-center justify-center overflow-hidden bg-[#EFEFEA] md:h-[210px] lg:h-[250px]" aria-label={`Ver ficha de ${product.name}`}>
                      {productImage(product, 'h-[185px] w-auto object-contain drop-shadow-[0_22px_20px_rgba(0,0,0,0.16)] transition duration-500 group-hover:scale-[1.055] group-hover:rotate-[1deg] md:h-[180px] lg:h-[210px]')}
                    </button>

                    <div>
                      <p className="hidden text-[9px] font-black uppercase tracking-[0.17em] text-[#169646] md:block">{product.category}</p>
                      <button type="button" onClick={() => setOpenProductId(expanded ? null : product.id)} className="mt-2 text-left">
                        <h3 className="text-3xl font-black leading-[0.95] tracking-[-0.045em] md:text-4xl">{product.name}</h3>
                      </button>
                      <p className="mt-4 max-w-2xl text-sm leading-6 text-black/50">{product.description}</p>
                      <div className="mt-5 flex flex-wrap items-center gap-4">
                        <label className="relative inline-flex items-center gap-2 text-xs font-bold text-black/55">
                          <span className="text-[9px] font-black uppercase tracking-[0.15em] text-black/30">Variante</span>
                          <select value={flavor} onChange={(event) => setRowFlavors((current) => ({ ...current, [product.id]: event.target.value }))} className="appearance-none border-0 border-b border-black/20 bg-transparent py-1 pr-6 text-xs font-black outline-none focus:border-[#169646]">
                            {product.flavors.map((option) => <option key={option} value={option}>{option}</option>)}
                          </select>
                          <ChevronDown className="pointer-events-none absolute right-0 h-3.5 w-3.5" />
                        </label>
                        <button type="button" onClick={() => setOpenProductId(expanded ? null : product.id)} className="text-[9px] font-black uppercase tracking-[0.16em] text-black/35 underline decoration-black/20 underline-offset-4 hover:text-[#169646]">{expanded ? 'Cerrar ficha' : 'Ficha técnica'}</button>
                      </div>
                    </div>

                    <div className="flex items-end justify-between gap-6 md:block md:text-right">
                      <div>
                        {product.regularPrice && <p className="text-xs font-semibold text-black/28 line-through">{formatPrice(product.regularPrice)}</p>}
                        <p className="text-3xl font-black tracking-[-0.045em]">{formatPrice(product.price)}</p>
                      </div>
                      <button type="button" onClick={() => addToCart(product, flavor)} className="mt-5 inline-flex items-center gap-2 border-b-2 border-[#0A0D0B] pb-1.5 text-[10px] font-black uppercase tracking-[0.14em] transition hover:border-[#169646] hover:text-[#169646]">
                        Añadir <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {expanded && (
                    <div className="grid gap-8 border-t border-black/8 bg-[#EEEFEA] px-5 py-8 md:grid-cols-[0.46fr_0.54fr] md:px-8 lg:px-12 lg:py-10">
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-[0.17em] text-[#169646]">Criterio de producto</p>
                        <p className="mt-4 max-w-xl text-base leading-7 text-black/62">{product.longDescription}</p>
                        <p className="mt-6 text-[9px] font-black uppercase tracking-[0.17em] text-black/30">Modo de empleo</p>
                        <p className="mt-2 max-w-xl text-sm leading-6 text-black/50">{product.use}</p>
                        {product.ingredients && <><p className="mt-6 text-[9px] font-black uppercase tracking-[0.17em] text-black/30">Ingredientes</p><p className="mt-2 max-w-xl text-sm leading-6 text-black/50">{product.ingredients}</p></>}
                      </div>
                      <div className="border-t border-black/10 md:border-l md:border-t-0 md:pl-8">
                        {product.technical.map((row) => (
                          <div key={`${product.id}-${row.label}`} className="flex items-start justify-between gap-5 border-b border-black/10 py-3 text-sm">
                            <span className="text-black/40">{row.label}</span>
                            <span className="max-w-[65%] text-right font-black">{row.value}</span>
                          </div>
                        ))}
                        <div className="mt-6 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.12em] text-black/34">
                          <PackageCheck className="h-4 w-4 text-[#169646]" /> Prevalece siempre el etiquetado físico recibido
                        </div>
                      </div>
                    </div>
                  )}
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#0A0D0B] text-white">
        <div className="mx-auto max-w-[1500px] px-5 py-24 lg:px-9 lg:py-36">
          <div className="grid gap-12 lg:grid-cols-[0.72fr_0.28fr] lg:items-end">
            <blockquote className="max-w-5xl text-4xl font-black leading-[0.98] tracking-[-0.055em] md:text-6xl lg:text-7xl">
              “Después de 30 años trabajando alrededor del deporte, esta es la selección que pondríamos en nuestro propio entrenamiento.”
            </blockquote>
            <div className="border-t border-white/15 pt-6 lg:border-t-0 lg:pt-0">
              <p className="text-[10px] font-black uppercase tracking-[0.23em] text-[#27D65F]">La firma GHC</p>
              <p className="mt-4 text-sm leading-6 text-white/45">No una colección diseñada para parecer grande. Una selección diseñada para ser útil.</p>
            </div>
          </div>

          <div className="mt-20 grid border-y border-white/12 md:grid-cols-3">
            <div className="flex items-center gap-4 border-b border-white/12 py-6 md:border-b-0 md:border-r md:px-7"><Truck className="h-5 w-5 text-[#27D65F]" /><div><p className="text-sm font-black">Entrega local</p><p className="mt-1 text-xs text-white/38">Madrid y municipios cercanos</p></div></div>
            <div className="flex items-center gap-4 border-b border-white/12 py-6 md:border-b-0 md:border-r md:px-7"><ShieldCheck className="h-5 w-5 text-[#27D65F]" /><div><p className="text-sm font-black">Pago seguro</p><p className="mt-1 text-xs text-white/38">Checkout protegido con SumUp</p></div></div>
            <div className="flex items-center gap-4 py-6 md:px-7"><PackageCheck className="h-5 w-5 text-[#27D65F]" /><div><p className="text-sm font-black">Envío gratis</p><p className="mt-1 text-xs text-white/38">A partir de {formatPrice(FREE_SHIPPING_THRESHOLD)}</p></div></div>
          </div>
        </div>
      </section>

      <footer className="border-t border-black/10 bg-[#ECEDE8]">
        <div className="mx-auto max-w-[1500px] px-5 py-14 lg:px-9">
          <div className="grid gap-10 md:grid-cols-[1.5fr_repeat(3,1fr)]">
            <div><GHCNutritionLogo size="md" /><p className="mt-5 max-w-sm text-sm leading-6 text-black/45">Suplementación deportiva seleccionada con criterio profesional.</p></div>
            <div><p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#169646]">Comprar</p><div className="mt-4 grid gap-2 text-sm text-black/50"><a href="#catalogo">Catálogo</a><Link href="/info/envios">Envíos</Link><Link href="/info/devoluciones">Devoluciones</Link></div></div>
            <div><p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#169646]">Ayuda</p><div className="mt-4 grid gap-2 text-sm text-black/50"><Link href="/info/faq">FAQ</Link><Link href="/info/contacto">Contacto</Link></div></div>
            <div><p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#169646]">Legal</p><div className="mt-4 grid gap-2 text-sm text-black/50"><Link href="/info/terminos">Términos</Link><Link href="/info/privacidad">Privacidad</Link><Link href="/info/cookies">Cookies</Link></div></div>
          </div>
          <div className="mt-12 flex flex-col gap-3 border-t border-black/10 pt-6 text-[10px] font-semibold uppercase tracking-[0.12em] text-black/30 sm:flex-row sm:justify-between"><p>© 2026 GHC Nutrition</p><p>Distribuidor oficial Beverly Nutrition</p></div>
        </div>
      </footer>

      {cartOpen && (
        <div className="fixed inset-0 z-[100] bg-black/45 backdrop-blur-sm" onMouseDown={() => setCartOpen(false)}>
          <aside className="absolute right-0 top-0 flex h-full w-full max-w-[520px] flex-col bg-[#F4F4F0] shadow-2xl" onMouseDown={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-black/10 px-6 py-5">
              <div><p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#169646]">Tu selección</p><h2 className="mt-1 text-2xl font-black tracking-[-0.04em]">{checkoutStep === 'cart' ? 'Carrito' : 'Datos de entrega'}</h2></div>
              <button type="button" onClick={() => setCartOpen(false)} className="grid h-10 w-10 place-items-center rounded-full border border-black/10"><X className="h-4 w-4" /></button>
            </div>

            {checkoutStep === 'cart' ? (
              <>
                <div className="flex-1 overflow-y-auto px-6 py-5">
                  {!cartDetailed.length ? (
                    <div className="grid h-full place-items-center text-center"><div><ShoppingBag className="mx-auto h-8 w-8 text-black/20" /><p className="mt-4 text-lg font-black">Tu carrito está vacío.</p><button type="button" onClick={() => setCartOpen(false)} className="mt-4 text-xs font-black uppercase tracking-[0.13em] text-[#169646]">Volver al catálogo</button></div></div>
                  ) : (
                    <div className="divide-y divide-black/10 border-y border-black/10">
                      {cartDetailed.map((item) => (
                        <div key={cartKey(item)} className="grid grid-cols-[74px_1fr] gap-4 py-5">
                          <div className="flex h-[82px] items-center justify-center bg-[#ECEDE8]">{productImage(item.product, 'h-[66px] w-auto object-contain')}</div>
                          <div>
                            <div className="flex items-start justify-between gap-3"><div><p className="text-sm font-black leading-tight">{item.product.name}</p><p className="mt-1 text-[10px] text-black/40">{item.flavor}</p></div><button type="button" onClick={() => removeItem(item)} className="text-black/28 hover:text-black"><Trash2 className="h-4 w-4" /></button></div>
                            <div className="mt-4 flex items-center justify-between"><div className="flex items-center border border-black/10"><button type="button" onClick={() => changeQuantity(item, -1)} className="grid h-8 w-8 place-items-center"><Minus className="h-3 w-3" /></button><span className="w-7 text-center text-xs font-black">{item.quantity}</span><button type="button" onClick={() => changeQuantity(item, 1)} className="grid h-8 w-8 place-items-center"><Plus className="h-3 w-3" /></button></div><span className="text-sm font-black">{formatPrice(item.product.price * item.quantity)}</span></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {!!cartDetailed.length && (
                  <div className="border-t border-black/10 bg-[#ECEDE8] px-6 py-6">
                    <div className="mb-5"><div className="mb-2 flex justify-between text-[10px] font-bold uppercase tracking-[0.1em] text-black/45"><span>{freeShippingRemaining > 0 ? `Te faltan ${formatPrice(freeShippingRemaining)} para envío gratis` : 'Envío gratis conseguido'}</span><span>{Math.round(shippingProgress)}%</span></div><div className="h-1 bg-black/10"><div className="h-full bg-[#27D65F] transition-all" style={{ width: `${shippingProgress}%` }} /></div></div>
                    <div className="space-y-2 text-sm"><div className="flex justify-between text-black/48"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div><div className="flex justify-between text-black/48"><span>Envío</span><span>{shipping === 0 ? 'Gratis' : formatPrice(shipping)}</span></div><div className="flex justify-between border-t border-black/10 pt-3 text-xl font-black"><span>Total</span><span>{formatPrice(displayTotal)}</span></div></div>
                    <button type="button" onClick={() => setCheckoutStep('details')} className="mt-6 inline-flex h-13 w-full items-center justify-center gap-3 bg-[#0A0D0B] px-5 text-xs font-black uppercase tracking-[0.14em] text-white transition hover:bg-[#169646]">Continuar <ArrowRight className="h-4 w-4" /></button>
                  </div>
                )}
              </>
            ) : (
              <form onSubmit={checkout} className="flex min-h-0 flex-1 flex-col">
                <div className="flex-1 overflow-y-auto px-6 py-6">
                  <button type="button" onClick={() => setCheckoutStep('cart')} className="mb-6 text-[10px] font-black uppercase tracking-[0.13em] text-black/40">← Volver al carrito</button>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="grid gap-2"><span className="text-[9px] font-black uppercase tracking-[0.14em] text-black/40">Nombre</span><input required value={customer.firstName} onChange={(e) => setCustomer({ ...customer, firstName: e.target.value })} className="h-12 border border-black/12 bg-white px-4 text-sm outline-none focus:border-[#169646]" /></label>
                    <label className="grid gap-2"><span className="text-[9px] font-black uppercase tracking-[0.14em] text-black/40">Apellidos</span><input required value={customer.lastName} onChange={(e) => setCustomer({ ...customer, lastName: e.target.value })} className="h-12 border border-black/12 bg-white px-4 text-sm outline-none focus:border-[#169646]" /></label>
                    <label className="grid gap-2 sm:col-span-2"><span className="text-[9px] font-black uppercase tracking-[0.14em] text-black/40">Email</span><input required type="email" value={customer.email} onChange={(e) => setCustomer({ ...customer, email: e.target.value })} className="h-12 border border-black/12 bg-white px-4 text-sm outline-none focus:border-[#169646]" /></label>
                    <label className="grid gap-2 sm:col-span-2"><span className="text-[9px] font-black uppercase tracking-[0.14em] text-black/40">Teléfono</span><input required value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} className="h-12 border border-black/12 bg-white px-4 text-sm outline-none focus:border-[#169646]" /></label>
                    <label className="grid gap-2 sm:col-span-2"><span className="text-[9px] font-black uppercase tracking-[0.14em] text-black/40">Dirección</span><input required value={customer.addressLine} onChange={(e) => setCustomer({ ...customer, addressLine: e.target.value })} className="h-12 border border-black/12 bg-white px-4 text-sm outline-none focus:border-[#169646]" /></label>
                    <label className="grid gap-2"><span className="text-[9px] font-black uppercase tracking-[0.14em] text-black/40">Ciudad</span><input required value={customer.city} onChange={(e) => setCustomer({ ...customer, city: e.target.value })} className="h-12 border border-black/12 bg-white px-4 text-sm outline-none focus:border-[#169646]" /></label>
                    <label className="grid gap-2"><span className="text-[9px] font-black uppercase tracking-[0.14em] text-black/40">Código postal</span><input required inputMode="numeric" maxLength={5} value={customer.postalCode} onChange={(e) => setCustomer({ ...customer, postalCode: e.target.value.replace(/\D/g, '').slice(0, 5) })} className="h-12 border border-black/12 bg-white px-4 text-sm outline-none focus:border-[#169646]" /></label>
                    <label className="grid gap-2 sm:col-span-2"><span className="text-[9px] font-black uppercase tracking-[0.14em] text-black/40">Cupón</span><input value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} placeholder="Opcional" className="h-12 border border-black/12 bg-white px-4 text-sm uppercase outline-none focus:border-[#169646]" /></label>
                  </div>
                  <div className="mt-6 border-l-2 border-[#27D65F] pl-4 text-xs leading-5 text-black/45">Por ahora entregamos en Madrid y municipios cercanos. El código postal se valida antes de iniciar el pago.</div>
                  {checkoutError && <p className="mt-5 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{checkoutError}</p>}
                </div>
                <div className="border-t border-black/10 bg-[#ECEDE8] px-6 py-6"><div className="mb-4 flex justify-between text-xl font-black"><span>Total estimado</span><span>{formatPrice(displayTotal)}</span></div><button disabled={checkingOut} className="inline-flex h-13 w-full items-center justify-center gap-3 bg-[#0A0D0B] px-5 text-xs font-black uppercase tracking-[0.14em] text-white transition hover:bg-[#169646] disabled:opacity-50">{checkingOut ? 'Preparando pago…' : 'Ir al pago seguro'} <ShieldCheck className="h-4 w-4" /></button></div>
              </form>
            )}
          </aside>
        </div>
      )}
    </main>
  )
}
