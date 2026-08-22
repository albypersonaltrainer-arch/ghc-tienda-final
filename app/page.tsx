'use client'

import Image from 'next/image'
import Link from 'next/link'
import { FormEvent, useEffect, useMemo, useState } from 'react'
import {
  ArrowRight,
  Check,
  ChevronDown,
  CircleCheck,
  Gift,
  Info,
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
  collagenPromo,
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

const categoryCopy: Record<ProductCategory, { kicker: string; text: string }> = {
  'Proteínas': {
    kicker: 'Base nutricional',
    text: 'Whey, aislados, hidrolizadas, caseína y opciones vegetales.',
  },
  'Creatina & Fuerza': {
    kicker: 'Rendimiento',
    text: 'Creatina y fórmulas orientadas a fuerza y trabajo de alta intensidad.',
  },
  'Pre-entreno & Energía': {
    kicker: 'Antes y durante',
    text: 'Pre-entrenos, cafeína, citrulina y formatos energéticos.',
  },
  'Recuperación & Aminoácidos': {
    kicker: 'Post-entreno',
    text: 'Aminoácidos, glutamina y referencias para completar la recuperación.',
  },
  'Vitaminas & Minerales': {
    kicker: 'Micronutrición',
    text: 'Magnesio, D3 + K2, complejo B y multivitamínicos.',
  },
  'Salud & Bienestar': {
    kicker: 'Rutina diaria',
    text: 'Complementos para integrar en una estrategia global de hábitos y nutrición.',
  },
  'Control de peso': {
    kicker: 'Sin atajos',
    text: 'Complementos específicos que nunca sustituyen alimentación, entrenamiento y descanso.',
  },
  'For Her': {
    kicker: 'Colección Beverly',
    text: 'Selección de referencias que el fabricante agrupa dentro de su línea For Her.',
  },
}

function cartKey(item: Pick<CartItem, 'productId' | 'flavor'>) {
  return `${item.productId}::${item.flavor}`
}

function ProductImage({ product, className, priority = false }: { product: Product; className: string; priority?: boolean }) {
  return (
    <Image
      src={product.image}
      alt={product.name}
      width={620}
      height={620}
      priority={priority}
      unoptimized
      className={className}
    />
  )
}

function ProductCard({
  product,
  onAdd,
  onDetails,
}: {
  product: Product
  onAdd: (product: Product, flavor: string) => void
  onDetails: (product: Product) => void
}) {
  const [flavor, setFlavor] = useState(product.flavors[0])

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[30px] border border-black/[0.07] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_70px_rgba(5,7,6,0.10)]">
      <button
        type="button"
        onClick={() => onDetails(product)}
        className="relative flex h-72 w-full items-center justify-center overflow-hidden bg-[#F6F7F4] p-7 text-left"
        aria-label={`Ver ficha de ${product.name}`}
      >
        {product.badge && (
          <span className="absolute left-5 top-5 z-10 rounded-full bg-[#050706] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-white">
            {product.badge}
          </span>
        )}
        <div className="absolute -bottom-24 -right-20 h-52 w-52 rounded-full bg-[#22D65B]/10 blur-2xl" />
        <ProductImage
          product={product}
          className="relative z-[1] h-56 w-auto object-contain drop-shadow-[0_24px_22px_rgba(0,0,0,0.16)] transition duration-500 group-hover:scale-[1.06]"
        />
        <span className="absolute bottom-5 left-5 inline-flex items-center gap-1.5 text-xs font-bold text-black/55 opacity-0 transition group-hover:opacity-100">
          <Info className="h-3.5 w-3.5" /> Ficha técnica
        </span>
      </button>

      <div className="flex flex-1 flex-col p-6">
        <p className="mb-2 text-[10px] font-black uppercase tracking-[0.19em] text-[#159943]">
          {product.category}
        </p>
        <button type="button" onClick={() => onDetails(product)} className="text-left">
          <h3 className="text-xl font-black leading-tight tracking-[-0.02em] text-[#050706]">{product.name}</h3>
        </button>
        <p className="mt-2 min-h-11 text-sm leading-5 text-black/55">{product.description}</p>

        <label className="mt-5 block">
          <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.16em] text-black/45">Sabor / variante</span>
          <div className="relative">
            <select
              value={flavor}
              onChange={(event) => setFlavor(event.target.value)}
              className="h-12 w-full appearance-none rounded-xl border border-black/10 bg-[#F6F7F4] px-4 pr-10 text-sm font-bold text-[#050706] outline-none transition focus:border-[#22D65B] focus:ring-2 focus:ring-[#22D65B]/15"
            >
              {product.flavors.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-black/45" />
          </div>
        </label>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-black/[0.07] pt-5">
          <div>
            {product.regularPrice && <span className="mr-2 text-xs font-semibold text-black/35 line-through">{formatPrice(product.regularPrice)}</span>}
            <span className="text-2xl font-black tracking-[-0.04em] text-[#050706]">{formatPrice(product.price)}</span>
          </div>
          <button
            type="button"
            onClick={() => onAdd(product, flavor)}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#050706] px-4 text-sm font-black text-white transition hover:bg-[#159943] active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" /> Añadir
          </button>
        </div>
      </div>
    </article>
  )
}

function ProductDetails({
  product,
  onClose,
  onAdd,
}: {
  product: Product
  onClose: () => void
  onAdd: (product: Product, flavor: string) => void
}) {
  const [flavor, setFlavor] = useState(product.flavors[0])

  useEffect(() => setFlavor(product.flavors[0]), [product])

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/45 p-0 backdrop-blur-sm md:items-center md:p-6" onMouseDown={onClose}>
      <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-t-[32px] bg-[#F2F4F1] shadow-2xl md:rounded-[36px]" onMouseDown={(event) => event.stopPropagation()}>
        <div className="sticky top-0 z-10 flex justify-end bg-[#F2F4F1]/90 p-4 backdrop-blur md:rounded-t-[36px]">
          <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full bg-white text-black shadow-sm"><X className="h-5 w-5" /></button>
        </div>
        <div className="grid gap-8 px-5 pb-8 md:grid-cols-[0.82fr_1.18fr] md:px-10 md:pb-12">
          <div className="relative flex min-h-[340px] items-center justify-center overflow-hidden rounded-[28px] bg-white p-8">
            <div className="absolute -bottom-10 -right-10 h-44 w-44 rounded-full bg-[#22D65B]/12 blur-2xl" />
            <ProductImage product={product} className="relative h-72 w-auto object-contain drop-shadow-2xl" />
          </div>
          <div>
            <div className="flex flex-wrap gap-2">
              {product.categories.map((category) => (
                <span key={category} className="rounded-full border border-black/10 bg-white px-3 py-1 text-[9px] font-black uppercase tracking-[0.15em] text-[#159943]">{category}</span>
              ))}
            </div>
            <h2 className="mt-4 text-3xl font-black tracking-[-0.04em] text-[#050706] md:text-4xl">{product.name}</h2>
            <p className="mt-4 text-base leading-7 text-black/65">{product.longDescription}</p>

            <div className="mt-7 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-white p-4"><p className="text-[10px] font-black uppercase tracking-[0.18em] text-black/40">Formato</p><p className="mt-1 font-black text-[#050706]">{product.format}</p></div>
              <div className="rounded-2xl bg-white p-4"><p className="text-[10px] font-black uppercase tracking-[0.18em] text-black/40">Servicio</p><p className="mt-1 font-black text-[#050706]">{product.serving || 'Ver etiqueta'}</p></div>
            </div>

            <h3 className="mt-8 text-sm font-black uppercase tracking-[0.16em] text-[#050706]">Ficha técnica</h3>
            <div className="mt-3 overflow-hidden rounded-2xl border border-black/[0.07] bg-white">
              {product.technical.map((row, index) => (
                <div key={`${row.label}-${index}`} className="flex items-center justify-between gap-4 border-b border-black/[0.06] px-4 py-3 last:border-0">
                  <span className="text-sm text-black/55">{row.label}</span>
                  <span className="text-right text-sm font-black text-[#050706]">{row.value}</span>
                </div>
              ))}
            </div>

            {product.ingredients && (
              <details className="mt-4 rounded-2xl border border-black/[0.07] bg-white p-4">
                <summary className="cursor-pointer text-sm font-black">Ingredientes</summary>
                <p className="mt-3 text-sm leading-6 text-black/60">{product.ingredients}</p>
              </details>
            )}
            <details className="mt-3 rounded-2xl border border-black/[0.07] bg-white p-4">
              <summary className="cursor-pointer text-sm font-black">Modo de empleo</summary>
              <p className="mt-3 text-sm leading-6 text-black/60">{product.use}</p>
            </details>
            {product.note && <p className="mt-3 text-xs leading-5 text-black/45">{product.note}</p>}

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-end">
              <label className="flex-1">
                <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.16em] text-black/40">Sabor / variante</span>
                <div className="relative">
                  <select value={flavor} onChange={(e) => setFlavor(e.target.value)} className="h-12 w-full appearance-none rounded-xl border border-black/10 bg-white px-4 pr-10 text-sm font-bold outline-none focus:border-[#22D65B]">
                    {product.flavors.map((item) => <option key={item}>{item}</option>)}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2" />
                </div>
              </label>
              <button type="button" onClick={() => { onAdd(product, flavor); onClose() }} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#050706] px-6 text-sm font-black text-white hover:bg-[#159943]">
                <ShoppingBag className="h-4 w-4" /> Añadir · {formatPrice(product.price)}
              </button>
            </div>
            <p className="mt-5 text-[11px] leading-5 text-black/40">Información basada en la ficha del fabricante consultada para esta referencia. Si la fórmula o el etiquetado cambian, prevalece siempre la unidad física recibida.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LandingPage() {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('Todos')
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'details'>('cart')
  const [customer, setCustomer] = useState<CustomerForm>(EMPTY_CUSTOMER)
  const [referral, setReferral] = useState<string | null>(null)
  const [couponCode, setCouponCode] = useState('')
  const [checkoutError, setCheckoutError] = useState('')
  const [checkingOut, setCheckingOut] = useState(false)
  const [hydrated, setHydrated] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

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
    if (hydrated) window.localStorage.setItem('ghc_cart', JSON.stringify(cart))
  }, [cart, hydrated])

  useEffect(() => {
    document.body.style.overflow = cartOpen || selectedProduct ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [cartOpen, selectedProduct])

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'Todos') return products
    return products.filter((product) => product.categories.includes(activeCategory))
  }, [activeCategory])

  const categoryCounts = useMemo(() => Object.fromEntries(productCategories.map((category) => [
    category,
    products.filter((product) => product.categories.includes(category)).length,
  ])) as Record<ProductCategory, number>, [])

  const detailedCart = useMemo(() => cart.map((item) => {
    const product = item.productId === collagenPromo.id
      ? collagenPromo
      : products.find((candidate) => candidate.id === item.productId)
    return product ? { ...item, product } : null
  }).filter(Boolean) as Array<CartItem & { product: Product }>, [cart])

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = detailedCart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const shipping = subtotal > 0 ? getShippingCost(subtotal) : 0
  const amountForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)

  const addToCart = (product: Product, flavor: string) => {
    setCart((current) => {
      const key = cartKey({ productId: product.id, flavor })
      const existing = current.find((item) => cartKey(item) === key)
      if (existing) {
        return current.map((item) => cartKey(item) === key
          ? { ...item, quantity: Math.min(10, item.quantity + 1) }
          : item)
      }
      return [...current, { productId: product.id, flavor, quantity: 1 }]
    })
    setCheckoutStep('cart')
    setCartOpen(true)
  }

  const changeQuantity = (target: CartItem, delta: number) => {
    setCart((current) => current
      .map((item) => cartKey(item) === cartKey(target)
        ? { ...item, quantity: Math.max(0, Math.min(10, item.quantity + delta)) }
        : item)
      .filter((item) => item.quantity > 0))
  }

  const removeItem = (target: CartItem) => setCart((current) => current.filter((item) => cartKey(item) !== cartKey(target)))

  const handleCheckout = async (event: FormEvent) => {
    event.preventDefault()
    setCheckoutError('')
    if (cart.length === 0) return
    setCheckingOut(true)

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          customer: { ...customer, state: 'Madrid', country: 'ES' },
          referral,
          couponCode: couponCode || null,
        }),
      })
      const data = (await response.json()) as { checkoutUrl?: string; error?: string }
      if (!response.ok || !data.checkoutUrl) throw new Error(data.error || 'No se ha podido iniciar el pago.')
      window.location.href = data.checkoutUrl
    } catch (error) {
      setCheckoutError(error instanceof Error ? error.message : 'No se ha podido iniciar el pago.')
      setCheckingOut(false)
    }
  }

  const chooseCategory = (category: ProductCategory) => {
    setActiveCategory(category)
    document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <main className="min-h-screen bg-[#F2F4F1] text-[#050706] selection:bg-[#22D65B] selection:text-black">
      <div className="bg-[#050706] px-4 py-2.5 text-center text-[11px] font-black uppercase tracking-[0.16em] text-white">
        Entrega en Madrid y municipios cercanos · <span className="text-[#22D65B]">Envío gratis desde 70 €</span>
      </div>

      <header className="sticky top-0 z-40 border-b border-black/[0.06] bg-[#F2F4F1]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
          <a href="#inicio" aria-label="GHC Nutrition - Inicio"><GHCNutritionLogo size="md" /></a>
          <nav className="hidden items-center gap-8 text-sm font-bold lg:flex">
            <a href="#categorias" className="hover:text-[#159943]">Categorías</a>
            <a href="#catalogo" className="hover:text-[#159943]">Productos</a>
            <a href="#como-comprar" className="hover:text-[#159943]">Envíos</a>
          </nav>
          <button type="button" onClick={() => setCartOpen(true)} className="relative inline-flex h-12 items-center gap-2 rounded-full bg-[#050706] px-5 text-sm font-black text-white transition hover:bg-[#159943]">
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">Carrito</span>
            {itemCount > 0 && <span className="grid h-6 min-w-6 place-items-center rounded-full bg-[#22D65B] px-1.5 text-[11px] font-black text-black">{itemCount}</span>}
          </button>
        </div>
      </header>

      <section id="inicio" className="relative overflow-hidden border-b border-black/[0.06]">
        <div className="absolute left-[-12rem] top-[-12rem] h-[32rem] w-[32rem] rounded-full bg-[#22D65B]/10 blur-3xl" />
        <div className="mx-auto grid min-h-[670px] max-w-7xl items-center gap-10 px-5 py-12 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-20">
          <div className="relative z-10 max-w-2xl">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-[#22D65B]" /> Selección GHC Nutrition
            </div>
            <h1 className="max-w-[720px] text-[clamp(3.4rem,7vw,6.8rem)] font-black leading-[0.86] tracking-[-0.075em]">
              Lo que tomas <span className="text-[#159943]">importa.</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-black/60 md:text-xl">Suplementación seleccionada con criterio. Producto real, ficha clara y compra sin ruido.</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href="#catalogo" className="inline-flex h-13 items-center gap-2 rounded-full bg-[#050706] px-6 text-sm font-black text-white transition hover:bg-[#159943]">Ver catálogo <ArrowRight className="h-4 w-4" /></a>
              <a href="#categorias" className="inline-flex h-13 items-center rounded-full border border-black/10 bg-white px-6 text-sm font-black transition hover:border-[#22D65B]">Comprar por objetivo</a>
            </div>
            <div className="mt-10 grid max-w-xl grid-cols-3 gap-3 border-t border-black/10 pt-6">
              <div><p className="text-2xl font-black">{products.length}</p><p className="mt-1 text-xs text-black/45">Referencias</p></div>
              <div><p className="text-2xl font-black">70 €</p><p className="mt-1 text-xs text-black/45">Envío gratis</p></div>
              <div><p className="text-2xl font-black">Madrid</p><p className="mt-1 text-xs text-black/45">Zona inicial</p></div>
            </div>
          </div>

          <div className="relative min-h-[520px] lg:min-h-[600px]">
            <div className="absolute inset-x-6 bottom-8 top-8 rotate-[-2deg] rounded-[46px] bg-[#050706] shadow-[0_45px_110px_rgba(5,7,6,0.22)]" />
            <div className="absolute right-0 top-0 h-36 w-36 rounded-full bg-[#22D65B] opacity-90" />
            <div className="absolute inset-0 z-10 flex items-center justify-center px-8 pb-12 pt-8">
              <ProductImage product={products[0]} priority className="h-[390px] w-auto object-contain drop-shadow-[0_35px_34px_rgba(0,0,0,0.45)] md:h-[500px] lg:h-[530px]" />
            </div>
            <div className="absolute bottom-0 left-0 z-20 max-w-[250px] rounded-[24px] bg-white p-5 shadow-xl">
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#159943]">GHC Select · Producto estrella</p>
              <p className="mt-2 text-lg font-black leading-tight">{products[0].name}</p>
              <div className="mt-3 flex items-end justify-between"><span className="text-2xl font-black">{formatPrice(products[0].price)}</span><button type="button" onClick={() => addToCart(products[0], products[0].flavors[0])} className="grid h-10 w-10 place-items-center rounded-full bg-[#22D65B] transition hover:scale-105"><Plus className="h-5 w-5" /></button></div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-black/[0.06] bg-white">
        <div className="mx-auto grid max-w-7xl px-5 py-5 md:grid-cols-3 lg:px-8">
          {[
            [Truck, 'Entrega local', 'Madrid y municipios cercanos'],
            [ShieldCheck, 'Pago seguro', 'Checkout protegido con SumUp'],
            [PackageCheck, 'Ficha clara', 'Composición y uso antes de comprar'],
          ].map(([Icon, title, copy]) => {
            const Cmp = Icon as typeof Truck
            return <div key={String(title)} className="flex items-center gap-4 border-black/10 px-2 py-4 md:border-r md:px-7 md:last:border-r-0"><Cmp className="h-5 w-5 text-[#159943]" /><div><p className="text-sm font-black">{String(title)}</p><p className="text-xs text-black/45">{String(copy)}</p></div></div>
          })}
        </div>
      </section>

      <section id="categorias" className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
        <div className="max-w-3xl">
          <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#159943]">Compra con criterio</p>
          <h2 className="mt-4 text-4xl font-black tracking-[-0.05em] md:text-6xl">Empieza por lo que buscas.</h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-black/55">Un producto puede aparecer en más de una categoría cuando tiene sentido. Así no obligamos al catálogo a encajar en cajas artificiales de “pre” o “post”.</p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {productCategories.map((category, index) => (
            <button key={category} type="button" onClick={() => chooseCategory(category)} className={`group min-h-56 rounded-[28px] border p-6 text-left transition hover:-translate-y-1 ${index === 0 || index === 3 ? 'border-[#050706] bg-[#050706] text-white' : 'border-black/[0.07] bg-white text-[#050706]'}`}>
              <div className="flex items-start justify-between gap-3"><span className={`text-[9px] font-black uppercase tracking-[0.18em] ${index === 0 || index === 3 ? 'text-[#22D65B]' : 'text-[#159943]'}`}>{categoryCopy[category].kicker}</span><span className={`grid h-8 min-w-8 place-items-center rounded-full text-xs font-black ${index === 0 || index === 3 ? 'bg-white/10 text-white' : 'bg-[#F2F4F1] text-black/50'}`}>{categoryCounts[category]}</span></div>
              <h3 className="mt-8 text-2xl font-black leading-tight tracking-[-0.035em]">{category}</h3>
              <p className={`mt-3 text-sm leading-6 ${index === 0 || index === 3 ? 'text-white/55' : 'text-black/50'}`}>{categoryCopy[category].text}</p>
              <span className={`mt-6 inline-flex items-center gap-2 text-xs font-black ${index === 0 || index === 3 ? 'text-[#22D65B]' : 'text-[#159943]'}`}>Ver productos <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" /></span>
            </button>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20 lg:px-8">
        <div className="relative overflow-hidden rounded-[38px] bg-[#050706] px-6 py-10 text-white md:px-10 md:py-12">
          <div className="absolute -right-14 -top-20 h-64 w-64 rounded-full bg-[#22D65B]/20 blur-2xl" />
          <div className="relative z-10 grid items-center gap-8 md:grid-cols-[1.15fr_0.85fr]">
            <div>
              <span className="inline-flex rounded-full bg-[#22D65B] px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-black">Pack destacado</span>
              <h2 className="mt-5 text-3xl font-black tracking-[-0.04em] md:text-5xl">40 viales. Una rutina.<br />{formatPrice(collagenPromo.price)}</h2>
              <p className="mt-4 max-w-xl text-sm leading-6 text-white/60">Pack de dos cajas de colágeno Peptan® con vitamina C, biotina, zinc y ácido hialurónico.</p>
              <div className="mt-6 flex flex-wrap gap-3"><button type="button" onClick={() => addToCart(collagenPromo, collagenPromo.flavors[0])} className="inline-flex h-12 items-center gap-2 rounded-full bg-[#22D65B] px-6 text-sm font-black text-black">Añadir pack <Plus className="h-4 w-4" /></button><button type="button" onClick={() => setSelectedProduct(collagenPromo)} className="inline-flex h-12 items-center rounded-full border border-white/20 px-6 text-sm font-black">Ver ficha</button></div>
            </div>
            <div className="flex justify-center"><Image src={collagenPromo.image} alt={collagenPromo.name} width={560} height={420} unoptimized className="max-h-72 w-auto object-contain drop-shadow-2xl" /></div>
          </div>
        </div>
      </section>

      <section id="catalogo" className="scroll-mt-24 border-y border-black/[0.06] bg-[#ECEFEA] py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div><p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#159943]">Catálogo GHC Nutrition</p><h2 className="mt-3 text-4xl font-black tracking-[-0.05em] md:text-6xl">Elige por necesidad,<br />no por ruido.</h2></div>
            <p className="max-w-md text-sm leading-6 text-black/55">Cada tarjeta abre su ficha técnica. Las referencias nuevas están preparadas para incorporar más detalle a medida que cerremos stock y variantes reales.</p>
          </div>

          <div className="mt-10 flex flex-wrap gap-2">
            {filters.map((category) => (
              <button key={category} type="button" onClick={() => setActiveCategory(category)} className={`rounded-full px-4 py-2.5 text-sm font-black transition ${activeCategory === category ? 'bg-[#050706] text-white' : 'border border-black/10 bg-white text-black hover:border-[#22D65B]'}`}>
                {category}{category !== 'Todos' ? ` · ${categoryCounts[category]}` : ` · ${products.length}`}
              </button>
            ))}
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => <ProductCard key={product.id} product={product} onAdd={addToCart} onDetails={setSelectedProduct} />)}
          </div>
        </div>
      </section>

      <section id="como-comprar" className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[34px] bg-white p-8 md:p-10">
            <Truck className="h-7 w-7 text-[#159943]" />
            <p className="mt-8 text-[10px] font-black uppercase tracking-[0.2em] text-black/40">Entrega actual</p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] md:text-4xl">Madrid primero.<br />España después.</h2>
            <p className="mt-4 max-w-lg text-sm leading-6 text-black/55">Por ahora aceptamos pedidos para Madrid y municipios de la Comunidad de Madrid. El checkout valida el código postal antes de cobrar.</p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2"><div className="rounded-2xl bg-[#F2F4F1] p-5"><p className="text-2xl font-black">5,90 €</p><p className="mt-1 text-xs text-black/45">Pedidos inferiores a 70 €</p></div><div className="rounded-2xl bg-[#22D65B] p-5"><p className="text-2xl font-black">Gratis</p><p className="mt-1 text-xs text-black/60">Desde 70 €</p></div></div>
          </div>
          <div className="rounded-[34px] bg-[#050706] p-8 text-white md:p-10">
            <Gift className="h-7 w-7 text-[#22D65B]" />
            <p className="mt-8 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Programa Recomienda GHC</p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] md:text-4xl">Tu amigo compra.<br /><span className="text-[#22D65B]">Tú ganas 10%.</span></h2>
            <p className="mt-4 max-w-lg text-sm leading-6 text-white/55">Después de comprar recibirás un código personal para compartir. Cuando un amigo haga una compra pagada con tu código, se genera un cupón del 10% para tu siguiente pedido.</p>
            <div className="mt-7 space-y-3 text-sm">{['Solo se premian compras pagadas', 'Cupón personal de un solo uso', 'Validez prevista: 90 días'].map((item) => <div key={item} className="flex items-center gap-3"><CircleCheck className="h-4 w-4 text-[#22D65B]" /><span className="text-white/75">{item}</span></div>)}</div>
          </div>
        </div>
      </section>

      <footer className="bg-[#050706] text-white">
        <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
          <div className="grid gap-10 border-b border-white/10 pb-12 md:grid-cols-[1.35fr_repeat(3,1fr)]">
            <div><GHCNutritionLogo size="lg" inverse /><p className="mt-5 max-w-sm text-sm leading-6 text-white/48">Suplementación seleccionada con criterio, ficha clara y una experiencia de compra pensada para crecer sin perder orden.</p></div>
            <div><p className="text-xs font-black uppercase tracking-[0.18em] text-[#22D65B]">Comprar</p><div className="mt-4 grid gap-2 text-sm text-white/60"><a href="#catalogo" className="hover:text-white">Catálogo</a><Link href="/info/envios" className="hover:text-white">Envíos</Link><Link href="/info/devoluciones" className="hover:text-white">Devoluciones</Link></div></div>
            <div><p className="text-xs font-black uppercase tracking-[0.18em] text-[#22D65B]">Ayuda</p><div className="mt-4 grid gap-2 text-sm text-white/60"><Link href="/info/faq" className="hover:text-white">FAQ</Link><a href="#como-comprar" className="hover:text-white">Cómo comprar</a><Link href="/info/contacto" className="hover:text-white">Contacto</Link></div></div>
            <div><p className="text-xs font-black uppercase tracking-[0.18em] text-[#22D65B]">Legal</p><div className="mt-4 grid gap-2 text-sm text-white/60"><Link href="/info/terminos" className="hover:text-white">Términos y condiciones</Link><Link href="/info/privacidad" className="hover:text-white">Privacidad</Link><Link href="/info/cookies" className="hover:text-white">Cookies</Link></div></div>
          </div>
          <div className="flex flex-col gap-3 pt-6 text-[11px] text-white/38 sm:flex-row sm:items-center sm:justify-between"><p>© 2026 GHC Nutrition</p><p>Distribuidor oficial Beverly Nutrition · Pago seguro con SumUp</p></div>
        </div>
      </footer>

      {selectedProduct && <ProductDetails product={selectedProduct} onClose={() => setSelectedProduct(null)} onAdd={addToCart} />}

      {cartOpen && (
        <div className="fixed inset-0 z-[70] bg-black/45 backdrop-blur-sm" onMouseDown={() => setCartOpen(false)}>
          <aside className="ml-auto flex h-full w-full max-w-[500px] flex-col bg-[#F2F4F1] shadow-2xl" onMouseDown={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-black/[0.07] px-5 py-5">
              <div><p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#159943]">GHC Nutrition</p><h2 className="text-2xl font-black tracking-[-0.04em]">{checkoutStep === 'cart' ? 'Tu carrito' : 'Datos de entrega'}</h2></div>
              <button type="button" onClick={() => setCartOpen(false)} className="grid h-10 w-10 place-items-center rounded-full bg-white"><X className="h-5 w-5" /></button>
            </div>

            {checkoutStep === 'cart' ? (
              <>
                <div className="flex-1 overflow-y-auto p-5">
                  {detailedCart.length === 0 ? (
                    <div className="grid min-h-72 place-items-center text-center"><div><ShoppingBag className="mx-auto h-8 w-8 text-black/25" /><p className="mt-4 font-black">El carrito está vacío</p><p className="mt-1 text-sm text-black/45">Añade productos y volverán a aparecer aquí.</p></div></div>
                  ) : (
                    <div className="space-y-3">
                      {detailedCart.map((item) => (
                        <div key={cartKey(item)} className="flex gap-4 rounded-2xl bg-white p-3">
                          <div className="grid h-24 w-24 shrink-0 place-items-center rounded-xl bg-[#F6F7F4] p-2"><ProductImage product={item.product} className="h-20 w-auto object-contain" /></div>
                          <div className="min-w-0 flex-1"><p className="font-black leading-tight">{item.product.name}</p><p className="mt-1 truncate text-xs text-black/45">{item.flavor}</p><div className="mt-3 flex items-center justify-between gap-2"><div className="flex items-center rounded-full border border-black/10"><button type="button" onClick={() => changeQuantity(item, -1)} className="grid h-8 w-8 place-items-center"><Minus className="h-3 w-3" /></button><span className="w-6 text-center text-xs font-black">{item.quantity}</span><button type="button" onClick={() => changeQuantity(item, 1)} className="grid h-8 w-8 place-items-center"><Plus className="h-3 w-3" /></button></div><div className="flex items-center gap-2"><span className="font-black">{formatPrice(item.product.price * item.quantity)}</span><button type="button" onClick={() => removeItem(item)} className="text-black/30 hover:text-red-500"><Trash2 className="h-4 w-4" /></button></div></div></div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {detailedCart.length > 0 && <div className="border-t border-black/[0.07] bg-white p-5">
                  {amountForFreeShipping > 0 ? <div className="mb-4 rounded-xl bg-[#F2F4F1] p-3 text-xs font-semibold text-black/60">Te faltan <strong className="text-black">{formatPrice(amountForFreeShipping)}</strong> para el envío gratis.</div> : <div className="mb-4 flex items-center gap-2 rounded-xl bg-[#22D65B]/15 p-3 text-xs font-black text-[#0d7d34]"><Check className="h-4 w-4" /> Tienes envío gratis.</div>}
                  <div className="space-y-2 text-sm"><div className="flex justify-between"><span className="text-black/50">Productos</span><span className="font-bold">{formatPrice(subtotal)}</span></div><div className="flex justify-between"><span className="text-black/50">Envío</span><span className="font-bold">{shipping === 0 ? 'Gratis' : formatPrice(shipping)}</span></div><div className="flex justify-between border-t border-black/[0.07] pt-3 text-lg"><span className="font-black">Total previo</span><span className="font-black">{formatPrice(subtotal + shipping)}</span></div></div>
                  <button type="button" onClick={() => setCheckoutStep('details')} className="mt-5 inline-flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-[#050706] text-sm font-black text-white hover:bg-[#159943]">Continuar <ArrowRight className="h-4 w-4" /></button>
                </div>}
              </>
            ) : (
              <form onSubmit={handleCheckout} className="flex flex-1 flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto p-5">
                  <button type="button" onClick={() => setCheckoutStep('cart')} className="mb-5 text-xs font-black text-black/50 hover:text-black">← Volver al carrito</button>
                  <div className="mb-5 rounded-2xl border border-[#22D65B]/25 bg-[#22D65B]/10 p-4"><p className="text-xs font-black text-[#0d7d34]">Zona de entrega actual</p><p className="mt-1 text-xs leading-5 text-black/55">Madrid y municipios de la Comunidad de Madrid. Validaremos el código postal antes de crear el pago.</p></div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {([['firstName','Nombre'],['lastName','Apellidos'],['email','Email'],['phone','Teléfono'],['addressLine','Dirección'],['city','Municipio'],['postalCode','Código postal']] as Array<[keyof CustomerForm, string]>).map(([key,label]) => (
                      <label key={key} className={(key === 'addressLine' || key === 'city') ? 'sm:col-span-2' : ''}><span className="mb-1.5 block text-[10px] font-black uppercase tracking-[0.14em] text-black/40">{label}</span><input required type={key === 'email' ? 'email' : key === 'phone' ? 'tel' : 'text'} inputMode={key === 'postalCode' ? 'numeric' : undefined} maxLength={key === 'postalCode' ? 5 : undefined} value={customer[key]} onChange={(e) => setCustomer((current) => ({ ...current, [key]: e.target.value }))} className="h-12 w-full rounded-xl border border-black/10 bg-white px-4 text-sm font-semibold outline-none transition focus:border-[#22D65B] focus:ring-2 focus:ring-[#22D65B]/10" /></label>
                    ))}
                  </div>
                  <label className="mt-5 block"><span className="mb-1.5 block text-[10px] font-black uppercase tracking-[0.14em] text-black/40">Cupón de descuento</span><input value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} placeholder="Ej. GHC10-XXXXXXXX" className="h-12 w-full rounded-xl border border-black/10 bg-white px-4 text-sm font-bold uppercase outline-none focus:border-[#22D65B]" /><p className="mt-1.5 text-[11px] leading-4 text-black/40">Los cupones por recomendación están vinculados al email que los ha ganado.</p></label>
                  {referral && <div className="mt-4 flex items-start gap-2 rounded-xl bg-white p-3 text-xs text-black/55"><Gift className="mt-0.5 h-4 w-4 shrink-0 text-[#159943]" /><span>Compra asociada al código de recomendación <strong>{referral}</strong>. Si el pedido se paga, premiaremos a quien te lo compartió.</span></div>}
                  {checkoutError && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">{checkoutError}</p>}
                </div>
                <div className="border-t border-black/[0.07] bg-white p-5"><div className="mb-4 flex items-center justify-between"><div><p className="text-xs text-black/45">Total antes de cupón</p><p className="text-xl font-black">{formatPrice(subtotal + shipping)}</p></div><div className="flex items-center gap-2 text-xs font-bold text-black/45"><ShieldCheck className="h-4 w-4 text-[#159943]" /> SumUp</div></div><button disabled={checkingOut} type="submit" className="inline-flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-[#050706] text-sm font-black text-white transition hover:bg-[#159943] disabled:cursor-wait disabled:opacity-60">{checkingOut ? 'Preparando pago…' : 'Ir al pago seguro'} <ArrowRight className="h-4 w-4" /></button></div>
              </form>
            )}
          </aside>
        </div>
      )}
    </main>
  )
}
