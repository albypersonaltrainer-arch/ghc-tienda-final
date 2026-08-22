'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import {
  ArrowRight,
  Check,
  ChevronRight,
  Dumbbell,
  FlaskConical,
  HeartPulse,
  Info,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Ticket,
  Truck,
  X,
} from 'lucide-react'

type Product = {
  slug: string
  name: string
  shortName: string
  category: string
  price: number
  image: string
  description: string
  flavors: string[]
  badge?: string
  technical: {
    serving?: string
    primary?: string
    features: string[]
    usage: string
  }
}

type CartItem = {
  slug: string
  name: string
  variant: string
  price: number
  image: string
  quantity: number
}

const CHECKOUT_URL = 'https://oqlxvesnjdkxlxwxkikq.supabase.co/functions/v1/nutrition-checkout'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xbHh2ZXNuamRreGx4d3hraWtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3MTk5OTQsImV4cCI6MjA5MzI5NTk5NH0.zgpUgh2sGY_jlJOO6npn2BsbRWsRTe3SH7mDYS7H1tY'
const FREE_SHIPPING = 70
const SHIPPING = 4.95

const products: Product[] = [
  {
    slug: 'whey-pro-concentrate-2kg',
    name: 'Whey Pro Concentrate 2 kg',
    shortName: 'Whey Pro',
    category: 'Proteína',
    price: 72.9,
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Proteinas%20concentrada%20choco%20cookies-GhBTztcpWoxgoDWvXKyJQeKJJzZVNQ.webp',
    description: 'Concentrado de suero Lacprodan® SP8011 con DigeZyme® y Tolerase® L.',
    flavors: ['Choco Cookies', 'Belgian Choco', 'Vainilla Ice Cream', 'Strawberry', 'Butter Biscuit'],
    badge: 'BEST SELLER',
    technical: {
      serving: '35 g',
      primary: '26,8 g de proteína por servicio en Choco Cookies',
      features: ['Lacprodan® SP8011', 'DigeZyme®', 'Tolerase® L', 'Certificación GMP', 'Certificación Halal'],
      usage: 'Mezclar 35 g en agua, leche o bebida vegetal, preferentemente tras el entrenamiento o según pauta profesional.',
    },
  },
  {
    slug: 'micellar-casein-1kg',
    name: 'Caseína Micelar 1 kg',
    shortName: 'Caseína Micelar',
    category: 'Proteína',
    price: 32.5,
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Caseinato%201%20kg-pN6sFcRtHZk3eYSxhYQlGIGoNXrCfL.webp',
    description: 'Proteína de digestión lenta para un aporte sostenido de aminoácidos.',
    flavors: ['Chocolate', 'Strawberry', 'Vainilla', 'Butter Biscuit'],
    technical: {
      serving: '35 g',
      primary: '27,3 g de proteína por servicio en Butter Biscuit',
      features: ['Caseína micelar', 'DigeZyme®', 'Tolerase® L', 'Liberación prolongada'],
      usage: 'Mezclar 35 g en agua, leche o bebida vegetal. Especialmente útil en periodos largos entre ingestas.',
    },
  },
  {
    slug: 'vegan-protein-900g',
    name: 'Vegan Protein 900 g',
    shortName: 'Vegan Protein',
    category: 'Proteína',
    price: 27.9,
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Proteina%20vegana%20cookies-lil6MyacDTD1FnALpmXagZmkEShL61.webp',
    description: 'Proteína aislada de guisante y arroz enriquecida con superalimentos.',
    flavors: ['Choco Cookies', 'Strawberry White Choco', 'Petit Beurre'],
    badge: 'VEGAN',
    technical: {
      serving: '30 g',
      primary: '23 g de proteína por servicio en Choco Cookies',
      features: ['Guisante + arroz', 'Quinoa', 'Chlorella', 'Chía', 'Espirulina', 'Moringa', 'Psyllium', 'DigeZyme®'],
      usage: 'Mezclar una toma en agua o bebida vegetal y ajustar la cantidad diaria al objetivo de proteína total.',
    },
  },
  {
    slug: 'creatine-500g',
    name: 'Creatina Monohidrato 500 g',
    shortName: 'Creatina 500 g',
    category: 'Rendimiento',
    price: 39.9,
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/creatina%20500g-nt8PxaZscVo3qP4d4o80owqOaQ6ihY.webp',
    description: '100% creatina monohidrato en polvo. Fórmula simple y sin artificios.',
    flavors: ['Sin sabor'],
    badge: 'ESENCIAL',
    technical: {
      serving: '3 g',
      primary: '3 g de creatina monohidrato por servicio',
      features: ['100% creatina monohidrato', 'Sin azúcares', 'Sin grasas', '166 servicios aprox.'],
      usage: 'Mezclar 3 g en unos 200 ml de agua y consumir diariamente con regularidad.',
    },
  },
  {
    slug: 'bcaa-811-300g',
    name: 'BCAA 8:1:1 + L-Glutamina 300 g',
    shortName: 'BCAA 8:1:1',
    category: 'Aminoácidos',
    price: 26.9,
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/BCAA%208-1-1%20lollipop-T7kmttiXKgxlUMs3vWmQBxelE566CI.webp',
    description: 'BCAA en ratio 8:1:1 con L-Glutamina para acompañar sesiones exigentes.',
    flavors: ['Blue Lollipop', 'Watermelon'],
    technical: {
      features: ['BCAA 8:1:1', 'L-Glutamina', 'Formato 300 g'],
      usage: 'Usar conforme a la dosis indicada en el etiquetado del producto.',
    },
  },
  {
    slug: 'map-300g',
    name: 'MAP Aminoácidos Esenciales 300 g',
    shortName: 'MAP 300 g',
    category: 'Aminoácidos',
    price: 36.5,
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/MAP%20300%20blue%20lollipop-fBOTN6amSVgMUkF8ijSzUxaRZoAOew.webp',
    description: 'Mezcla de aminoácidos esenciales para complementar el aporte proteico diario.',
    flavors: ['Blue Lollipop', 'Watermelon'],
    technical: {
      features: ['Aminoácidos esenciales', 'Formato 300 g', 'Fácil disolución'],
      usage: 'Usar conforme a la dosis indicada en el etiquetado del producto.',
    },
  },
  {
    slug: 'dynamite-pre-workout',
    name: 'Dynamite Pre-Workout 375 g',
    shortName: 'Dynamite',
    category: 'Pre-entreno',
    price: 32.9,
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Pre-entreno%20fruit%20punch-jQDr8jqS1HvR35ROiC3Bkk8cPynNEV.webp',
    description: 'Pre-entreno de Beverly Nutrition para sesiones de alta intensidad.',
    flavors: ['Fruit Punch', 'Blue Lollipop'],
    technical: {
      serving: '25 servicios',
      primary: 'Formato 375 g',
      features: ['Fórmula pre-entreno', '25 servicios', 'Sabores intensos'],
      usage: 'Seguir estrictamente la dosis del etiquetado. No superar la cantidad diaria recomendada.',
    },
  },
  {
    slug: 'energy-pro-90',
    name: 'Energy Pro 90 caps',
    shortName: 'Energy Pro',
    category: 'Energía',
    price: 19.9,
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/energy%20pro%2090-0g8rFct95mlzm12kBYHJ6gbv7QhSne.webp',
    description: 'Complemento en cápsulas orientado a energía y concentración.',
    flavors: ['Cápsulas'],
    technical: {
      primary: 'Formato 90 cápsulas',
      features: ['Energía', 'Concentración', 'Formato cápsulas'],
      usage: 'Usar conforme a la dosis indicada en el etiquetado del producto.',
    },
  },
  {
    slug: 'vitamin-complex-90',
    name: 'Vitamin Complex 90 tabs',
    shortName: 'Vitamin Complex',
    category: 'Salud',
    price: 14.9,
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Vitamina%20Complex-aSmopLYLbOJhmDr7tdBUrpTf2sXpyW.webp',
    description: 'Complejo de vitaminas y minerales para complementar una dieta equilibrada.',
    flavors: ['Tabletas'],
    technical: {
      primary: 'Formato 90 tabletas',
      features: ['Vitaminas', 'Minerales', 'Uso diario'],
      usage: 'Usar conforme a la dosis indicada en el etiquetado del producto.',
    },
  },
]

const categories = ['Todos', 'Proteína', 'Rendimiento', 'Aminoácidos', 'Pre-entreno', 'Energía', 'Salud']
const money = (value: number) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value)

export default function Home() {
  const [category, setCategory] = useState('Todos')
  const [selection, setSelection] = useState<Record<string, string>>(() => Object.fromEntries(products.map((p) => [p.slug, p.flavors[0]])))
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [detail, setDetail] = useState<Product | null>(null)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [checkoutError, setCheckoutError] = useState('')
  const [orderResult, setOrderResult] = useState<{ orderReference: string; referral: string } | null>(null)
  const [referralCode, setReferralCode] = useState('')
  const [couponCode, setCouponCode] = useState('')
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', addressLine1: '', addressLine2: '', postalCode: '', city: '', province: '', country: 'ES',
  })

  useEffect(() => {
    try {
      const saved = localStorage.getItem('ghc-nutrition-cart-v1')
      if (saved) setCart(JSON.parse(saved))
      const params = new URLSearchParams(window.location.search)
      const ref = params.get('ref') || sessionStorage.getItem('ghc_ref') || ''
      if (ref) {
        setReferralCode(ref.toUpperCase())
        sessionStorage.setItem('ghc_ref', ref.toUpperCase())
      }
    } catch {}
  }, [])

  useEffect(() => {
    try { localStorage.setItem('ghc-nutrition-cart-v1', JSON.stringify(cart)) } catch {}
  }, [cart])

  const visibleProducts = useMemo(() => category === 'Todos' ? products : products.filter((p) => p.category === category), [category])
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal >= FREE_SHIPPING || subtotal === 0 ? 0 : SHIPPING
  const total = subtotal + shipping
  const shippingProgress = Math.min(100, (subtotal / FREE_SHIPPING) * 100)
  const remaining = Math.max(0, FREE_SHIPPING - subtotal)

  const addToCart = (product: Product) => {
    const variant = selection[product.slug] || product.flavors[0]
    setCart((current) => {
      const index = current.findIndex((item) => item.slug === product.slug && item.variant === variant)
      if (index >= 0) return current.map((item, i) => i === index ? { ...item, quantity: item.quantity + 1 } : item)
      return [...current, { slug: product.slug, name: product.name, variant, price: product.price, image: product.image, quantity: 1 }]
    })
    setCartOpen(true)
  }

  const updateQuantity = (index: number, delta: number) => {
    setCart((current) => current.flatMap((item, i) => {
      if (i !== index) return [item]
      const quantity = item.quantity + delta
      return quantity > 0 ? [{ ...item, quantity }] : []
    }))
  }

  const submitOrder = async (event: FormEvent) => {
    event.preventDefault()
    if (!cart.length) return
    setSubmitting(true)
    setCheckoutError('')
    try {
      const response = await fetch(CHECKOUT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          apikey: SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({
          action: 'create',
          customer: form,
          couponCode: couponCode.trim() || null,
          referralCode: referralCode.trim() || null,
          items: cart.map((item) => ({ slug: item.slug, variant: item.variant, quantity: item.quantity })),
        }),
      })
      const data = await response.json()
      if (!response.ok || !data.ok) {
        if (data.error === 'invalid_coupon') throw new Error('El cupón no es válido, ha caducado o ya se ha utilizado.')
        throw new Error('No hemos podido crear el pedido. Revisa los datos e inténtalo de nuevo.')
      }
      if (data.hostedCheckoutUrl) {
        localStorage.removeItem('ghc-nutrition-cart-v1')
        window.location.assign(data.hostedCheckoutUrl)
        return
      }
      setOrderResult({ orderReference: data.orderReference, referral: data.customerReferralCode })
      setCart([])
    } catch (error) {
      setCheckoutError(error instanceof Error ? error.message : 'Error inesperado al procesar el pedido.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f3ef] text-[#171717]">
      <div className="ghc-grain fixed inset-0 pointer-events-none z-[80] opacity-[0.12]" />

      <div className="bg-[#171717] text-[#f5f3ef] text-[11px] sm:text-xs tracking-[0.18em] uppercase text-center py-2.5 px-4">
        Envío gratis desde 70 € · Compra segura · Selección GHC
      </div>

      <header className="sticky top-0 z-50 border-b border-black/10 bg-[#f5f3ef]/92 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto h-20 px-5 lg:px-8 flex items-center justify-between gap-5">
          <a href="#top" className="flex items-center gap-3 min-w-0">
            <img src="/logo-limpio.png" alt="GHC Nutrition" className="h-14 w-14 object-contain" />
            <div className="leading-none hidden sm:block">
              <div className="font-black tracking-[0.18em] text-sm">GHC</div>
              <div className="text-[10px] tracking-[0.28em] text-[#8a5b3c] mt-1">NUTRITION</div>
            </div>
          </a>
          <nav className="hidden lg:flex items-center gap-8 text-xs font-semibold uppercase tracking-[0.13em]">
            <a href="#criterio" className="hover:text-[#8a5b3c] transition">Método</a>
            <a href="#catalogo" className="hover:text-[#8a5b3c] transition">Productos</a>
            <a href="#calidad" className="hover:text-[#8a5b3c] transition">Calidad</a>
          </nav>
          <button onClick={() => setCartOpen(true)} className="relative inline-flex items-center gap-2 rounded-full border border-black/15 bg-white px-4 py-2.5 text-sm font-bold hover:border-[#9f6742] transition shadow-sm">
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">Cesta</span>
            <span className="min-w-6 h-6 px-1.5 rounded-full bg-[#171717] text-white text-xs inline-flex items-center justify-center">{itemCount}</span>
          </button>
        </div>
      </header>

      <section id="top" className="relative overflow-hidden border-b border-black/10">
        <div className="hero-grid absolute inset-0 opacity-60" />
        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-16 md:py-24 lg:py-28 grid lg:grid-cols-[1.05fr_.95fr] gap-14 items-center relative">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#9f6742]/30 bg-white/60 px-3 py-1.5 text-[11px] font-bold tracking-[0.16em] uppercase text-[#7c4d30] mb-7">
              <Sparkles className="h-3.5 w-3.5" /> GHC · Health Through Strength
            </div>
            <h1 className="text-[clamp(3.2rem,7.4vw,7rem)] font-black leading-[0.84] tracking-[-0.065em] max-w-4xl">
              Suplementación<br />
              <span className="text-[#9a6240]">con criterio.</span>
            </h1>
            <p className="mt-8 text-lg md:text-xl text-black/62 max-w-xl leading-relaxed">
              Rendimiento, recuperación y salud activa. Una selección corta, útil y entendible para que compres por función, no por ruido.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href="#catalogo" className="inline-flex items-center gap-3 rounded-full bg-[#171717] text-white px-7 py-4 text-sm font-bold hover:bg-[#8a5b3c] transition">
                Ver selección <ArrowRight className="h-4 w-4" />
              </a>
              <a href="#criterio" className="inline-flex items-center gap-2 rounded-full border border-black/20 px-7 py-4 text-sm font-bold hover:bg-white transition">
                Por qué GHC
              </a>
            </div>
            <div className="mt-12 grid grid-cols-3 max-w-xl border-y border-black/10 py-5">
              <div><div className="font-black text-2xl">9</div><div className="text-[10px] uppercase tracking-[0.14em] text-black/45 mt-1">Productos clave</div></div>
              <div><div className="font-black text-2xl">70 €</div><div className="text-[10px] uppercase tracking-[0.14em] text-black/45 mt-1">Envío gratis</div></div>
              <div><div className="font-black text-2xl">15%</div><div className="text-[10px] uppercase tracking-[0.14em] text-black/45 mt-1">Premio referido</div></div>
            </div>
          </div>

          <div className="relative min-h-[510px] sm:min-h-[610px]">
            <div className="absolute inset-x-[7%] top-[8%] bottom-[6%] rounded-[42px] bg-[#181818] shadow-[0_40px_100px_rgba(0,0,0,.20)] overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(182,118,74,.38),transparent_35%)]" />
              <div className="absolute left-7 top-7 text-white/40 text-[10px] tracking-[0.25em] uppercase">GHC Selection / 01</div>
              <div className="absolute right-7 bottom-7 text-white/50 text-right">
                <div className="text-[10px] tracking-[0.2em] uppercase">No vendemos botes.</div>
                <div className="text-lg font-black text-white">Recomendamos herramientas.</div>
              </div>
            </div>
            <img src={products[0].image} alt="Whey Pro Concentrate" className="absolute w-[55%] max-w-[340px] left-[3%] bottom-[3%] drop-shadow-[0_35px_34px_rgba(0,0,0,.35)] rotate-[-5deg]" />
            <img src={products[3].image} alt="Creatina" className="absolute w-[46%] max-w-[285px] right-[3%] top-[4%] drop-shadow-[0_28px_30px_rgba(0,0,0,.30)] rotate-[6deg]" />
            <div className="absolute right-0 top-[43%] bg-[#f5f3ef] border border-black/10 rounded-2xl px-5 py-4 shadow-xl max-w-[190px]">
              <div className="text-[10px] uppercase tracking-[0.16em] text-[#8a5b3c] font-bold">Selección GHC</div>
              <div className="font-black mt-1 leading-tight">Menos catálogo.<br />Más criterio.</div>
            </div>
          </div>
        </div>
      </section>

      <section id="criterio" className="max-w-7xl mx-auto px-5 lg:px-8 py-20 md:py-28">
        <div className="grid lg:grid-cols-[.72fr_1.28fr] gap-10 lg:gap-20">
          <div>
            <div className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#8a5b3c]">Compra por objetivo</div>
            <h2 className="text-4xl md:text-5xl font-black tracking-[-0.045em] mt-4 leading-[.95]">Tres necesidades.<br />Cero humo.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { icon: Dumbbell, title: 'Rendimiento', text: 'Herramientas para fuerza, potencia y sesiones de alta demanda.' },
              { icon: FlaskConical, title: 'Recuperación', text: 'Proteína y aminoácidos para completar la estrategia nutricional.' },
              { icon: HeartPulse, title: 'Salud activa', text: 'Micronutrientes y soporte diario sin convertir el armario en una farmacia.' },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-[28px] border border-black/10 bg-white p-6 min-h-[245px] flex flex-col justify-between hover:-translate-y-1 hover:shadow-xl transition duration-300">
                <div className="h-11 w-11 rounded-full bg-[#efe9e2] text-[#8a5b3c] flex items-center justify-center"><Icon className="h-5 w-5" /></div>
                <div><h3 className="font-black text-xl">{title}</h3><p className="text-sm text-black/55 leading-relaxed mt-2">{text}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="catalogo" className="border-y border-black/10 bg-[#ece9e3] py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-7 mb-10">
            <div>
              <div className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#8a5b3c]">Catálogo esencial</div>
              <h2 className="text-4xl md:text-6xl font-black tracking-[-0.05em] mt-3">La selección GHC.</h2>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar max-w-full">
              {categories.map((item) => (
                <button key={item} onClick={() => setCategory(item)} className={`whitespace-nowrap rounded-full px-4 py-2.5 text-xs font-bold transition border ${category === item ? 'bg-[#171717] text-white border-[#171717]' : 'bg-white/70 border-black/10 hover:border-black/30'}`}>
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {visibleProducts.map((product) => (
              <article key={product.slug} className="group bg-[#f8f7f4] rounded-[30px] border border-black/10 overflow-hidden flex flex-col hover:shadow-[0_24px_60px_rgba(25,20,15,.12)] transition duration-300">
                <div className="relative aspect-[1.06/1] bg-[radial-gradient(circle_at_50%_42%,#fff_0%,#efede8_62%,#e2ded6_100%)] flex items-center justify-center overflow-hidden">
                  {product.badge && <div className="absolute top-5 left-5 z-10 rounded-full bg-[#171717] text-white text-[9px] tracking-[0.16em] font-black px-3 py-1.5">{product.badge}</div>}
                  <button onClick={() => setDetail(product)} className="absolute top-5 right-5 z-10 h-9 w-9 rounded-full bg-white/85 border border-black/10 flex items-center justify-center hover:bg-[#171717] hover:text-white transition" aria-label={`Ver ficha de ${product.name}`}><Info className="h-4 w-4" /></button>
                  <img src={product.image} alt={product.name} className="h-[76%] w-[76%] object-contain drop-shadow-[0_22px_18px_rgba(0,0,0,.16)] group-hover:scale-105 transition duration-500" />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="text-[10px] uppercase tracking-[0.16em] font-bold text-[#9a6240]">{product.category}</div>
                  <h3 className="text-xl font-black mt-2 tracking-[-0.02em]">{product.name}</h3>
                  <p className="text-sm text-black/55 leading-relaxed mt-2 min-h-[42px]">{product.description}</p>
                  <div className="mt-5">
                    <label className="text-[10px] uppercase tracking-[0.14em] font-bold text-black/45">Formato / sabor</label>
                    <select value={selection[product.slug]} onChange={(e) => setSelection((current) => ({ ...current, [product.slug]: e.target.value }))} className="mt-2 w-full bg-white border border-black/12 rounded-xl px-3.5 py-3 text-sm font-semibold outline-none focus:border-[#9a6240]">
                      {product.flavors.map((flavor) => <option key={flavor}>{flavor}</option>)}
                    </select>
                  </div>
                  <div className="mt-6 pt-5 border-t border-black/10 flex items-center justify-between gap-4">
                    <div className="text-2xl font-black">{money(product.price)}</div>
                    <button onClick={() => addToCart(product)} className="rounded-full bg-[#171717] text-white px-5 py-3 text-xs font-black inline-flex items-center gap-2 hover:bg-[#8a5b3c] transition">
                      Añadir <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="calidad" className="max-w-7xl mx-auto px-5 lg:px-8 py-20 md:py-28">
        <div className="rounded-[36px] bg-[#171717] text-white p-8 md:p-12 lg:p-16 overflow-hidden relative">
          <div className="absolute right-[-8%] top-[-40%] h-[520px] w-[520px] rounded-full bg-[#9a6240]/25 blur-3xl" />
          <div className="relative grid lg:grid-cols-[1.15fr_.85fr] gap-12 items-center">
            <div>
              <div className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#c28a62]">GHC estándar</div>
              <h2 className="text-4xl md:text-6xl font-black tracking-[-0.055em] mt-4 leading-[.95]">La etiqueta importa.<br />El contexto, más.</h2>
              <p className="text-white/58 max-w-xl mt-6 leading-relaxed">Priorizamos fórmulas comprensibles, marcas trazables y productos con una función clara dentro de un plan de nutrición y entrenamiento.</p>
            </div>
            <div className="space-y-3">
              {[
                { icon: ShieldCheck, text: 'Selección corta y revisada' },
                { icon: FlaskConical, text: 'Fichas técnicas accesibles' },
                { icon: Truck, text: 'Envío gratuito desde 70 €' },
                { icon: Ticket, text: '15% en tu próxima compra si un amigo compra con tu código' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.045] px-5 py-4">
                  <Icon className="h-5 w-5 text-[#c28a62] shrink-0" /><span className="text-sm font-semibold">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-black/10">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-16 md:py-20 grid md:grid-cols-[1fr_auto] gap-10 items-center">
          <div>
            <div className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#8a5b3c]">Programa de recomendación</div>
            <h2 className="text-3xl md:text-5xl font-black tracking-[-0.045em] mt-3">Tu criterio también tiene recompensa.</h2>
            <p className="text-black/55 mt-4 max-w-2xl">Comparte tu código personal. Cuando un amigo complete una compra con él, se genera un cupón del 15% para tu siguiente pedido.</p>
          </div>
          <button onClick={() => setCartOpen(true)} className="rounded-full bg-[#9a6240] text-white px-7 py-4 font-black text-sm inline-flex items-center justify-center gap-2 hover:bg-[#171717] transition">
            Empezar pedido <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      <footer className="bg-[#171717] text-white/55">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-12 flex flex-col md:flex-row gap-8 md:items-end justify-between">
          <div className="flex items-center gap-4"><img src="/logo-limpio.png" alt="GHC" className="h-16 w-16 object-contain brightness-0 invert" /><div><div className="font-black text-white tracking-[0.16em]">GHC NUTRITION</div><div className="text-xs mt-1">Health Through Strength</div></div></div>
          <div className="text-xs leading-relaxed md:text-right max-w-xl">Los complementos alimenticios no sustituyen una dieta variada y equilibrada ni un estilo de vida saludable. Respeta siempre el etiquetado y las dosis recomendadas.</div>
        </div>
      </footer>

      {cartOpen && (
        <div className="fixed inset-0 z-[100]">
          <button className="absolute inset-0 bg-black/45 backdrop-blur-[2px]" onClick={() => setCartOpen(false)} aria-label="Cerrar cesta" />
          <aside className="absolute right-0 top-0 h-full w-full max-w-[470px] bg-[#f7f5f1] shadow-2xl flex flex-col">
            <div className="px-6 py-5 border-b border-black/10 flex items-center justify-between">
              <div><div className="text-[10px] uppercase tracking-[0.16em] text-[#8a5b3c] font-bold">Tu selección</div><h2 className="text-2xl font-black mt-1">Cesta <span className="text-black/30">({itemCount})</span></h2></div>
              <button onClick={() => setCartOpen(false)} className="h-10 w-10 rounded-full border border-black/10 bg-white flex items-center justify-center"><X className="h-4 w-4" /></button>
            </div>

            <div className="px-6 py-5 border-b border-black/10">
              <div className="flex items-center justify-between text-xs font-semibold"><span>{subtotal >= FREE_SHIPPING ? 'Envío gratis conseguido' : `Te faltan ${money(remaining)} para envío gratis`}</span><Truck className="h-4 w-4 text-[#8a5b3c]" /></div>
              <div className="mt-3 h-1.5 rounded-full bg-black/10 overflow-hidden"><div className="h-full bg-[#9a6240] transition-all" style={{ width: `${shippingProgress}%` }} /></div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {!cart.length ? (
                <div className="h-full flex flex-col items-center justify-center text-center px-10"><ShoppingBag className="h-9 w-9 text-black/25" /><div className="font-black text-xl mt-4">Tu cesta está vacía</div><p className="text-sm text-black/50 mt-2">Añade productos y podrás pagarlos juntos en un único checkout.</p><button onClick={() => setCartOpen(false)} className="mt-6 text-sm font-black text-[#8a5b3c]">Volver al catálogo</button></div>
              ) : cart.map((item, index) => (
                <div key={`${item.slug}-${item.variant}`} className="py-4 border-b border-black/10 grid grid-cols-[76px_1fr] gap-4">
                  <div className="h-[76px] rounded-2xl bg-white flex items-center justify-center border border-black/8"><img src={item.image} alt="" className="h-[65px] w-[65px] object-contain" /></div>
                  <div>
                    <div className="flex justify-between gap-3"><div><div className="font-black text-sm leading-tight">{item.name}</div><div className="text-xs text-black/45 mt-1">{item.variant}</div></div><div className="font-black text-sm">{money(item.price * item.quantity)}</div></div>
                    <div className="mt-3 inline-flex items-center rounded-full border border-black/10 bg-white overflow-hidden"><button onClick={() => updateQuantity(index, -1)} className="h-8 w-8 flex items-center justify-center"><Minus className="h-3 w-3" /></button><span className="w-8 text-center text-xs font-black">{item.quantity}</span><button onClick={() => updateQuantity(index, 1)} className="h-8 w-8 flex items-center justify-center"><Plus className="h-3 w-3" /></button></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 border-t border-black/10 bg-white/60">
              <div className="space-y-2 text-sm"><div className="flex justify-between text-black/55"><span>Subtotal</span><span>{money(subtotal)}</span></div><div className="flex justify-between text-black/55"><span>Envío</span><span>{shipping === 0 ? 'Gratis' : money(shipping)}</span></div><div className="flex justify-between font-black text-lg pt-2"><span>Total</span><span>{money(total)}</span></div></div>
              <button disabled={!cart.length} onClick={() => { setCheckoutOpen(true); setCartOpen(false) }} className="mt-5 w-full rounded-full bg-[#171717] text-white h-14 font-black text-sm flex items-center justify-center gap-2 disabled:opacity-30 hover:bg-[#8a5b3c] transition">Finalizar pedido <ArrowRight className="h-4 w-4" /></button>
              <div className="text-center text-[10px] uppercase tracking-[0.12em] text-black/35 mt-3">Un solo pedido · Un solo pago</div>
            </div>
          </aside>
        </div>
      )}

      {detail && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-8">
          <button className="absolute inset-0 bg-black/55 backdrop-blur-sm" onClick={() => setDetail(null)} aria-label="Cerrar ficha" />
          <div className="relative bg-[#f7f5f1] rounded-[30px] w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <button onClick={() => setDetail(null)} className="absolute top-5 right-5 z-10 h-10 w-10 rounded-full bg-white border border-black/10 flex items-center justify-center"><X className="h-4 w-4" /></button>
            <div className="grid md:grid-cols-[.9fr_1.1fr]">
              <div className="min-h-[360px] md:min-h-[560px] bg-[radial-gradient(circle_at_50%_45%,#fff,#e9e5de)] flex items-center justify-center rounded-t-[30px] md:rounded-l-[30px] md:rounded-tr-none p-8"><img src={detail.image} alt={detail.name} className="max-h-[430px] w-[85%] object-contain drop-shadow-2xl" /></div>
              <div className="p-7 sm:p-10 md:p-12">
                <div className="text-[10px] uppercase tracking-[0.18em] text-[#8a5b3c] font-black">Ficha técnica · {detail.category}</div>
                <h2 className="text-3xl md:text-4xl font-black tracking-[-0.04em] mt-3">{detail.name}</h2>
                <p className="text-black/55 leading-relaxed mt-4">{detail.description}</p>
                <div className="mt-7 space-y-3">
                  {detail.technical.serving && <div className="flex justify-between gap-4 border-b border-black/10 pb-3 text-sm"><span className="text-black/45">Servicio</span><span className="font-bold text-right">{detail.technical.serving}</span></div>}
                  {detail.technical.primary && <div className="flex justify-between gap-4 border-b border-black/10 pb-3 text-sm"><span className="text-black/45">Dato principal</span><span className="font-bold text-right max-w-[65%]">{detail.technical.primary}</span></div>}
                </div>
                <div className="mt-7"><div className="text-[10px] uppercase tracking-[0.16em] font-black text-black/45">Claves de fórmula</div><div className="mt-3 flex flex-wrap gap-2">{detail.technical.features.map((feature) => <span key={feature} className="rounded-full border border-black/10 bg-white px-3 py-2 text-xs font-semibold">{feature}</span>)}</div></div>
                <div className="mt-7 rounded-2xl bg-[#ebe5dd] p-4"><div className="text-[10px] uppercase tracking-[0.16em] font-black text-[#8a5b3c]">Uso orientativo</div><p className="text-sm leading-relaxed mt-2 text-black/65">{detail.technical.usage}</p></div>
                <div className="mt-7 flex items-center justify-between gap-4"><div className="text-3xl font-black">{money(detail.price)}</div><button onClick={() => { addToCart(detail); setDetail(null) }} className="rounded-full bg-[#171717] text-white px-6 py-3.5 text-sm font-black hover:bg-[#8a5b3c] transition">Añadir a cesta</button></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {checkoutOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6">
          <button className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !submitting && setCheckoutOpen(false)} aria-label="Cerrar checkout" />
          <div className="relative w-full max-w-5xl max-h-[94vh] overflow-y-auto rounded-[30px] bg-[#f7f5f1] shadow-2xl">
            <button onClick={() => !submitting && setCheckoutOpen(false)} className="absolute top-5 right-5 z-20 h-10 w-10 rounded-full bg-white border border-black/10 flex items-center justify-center"><X className="h-4 w-4" /></button>
            {orderResult ? (
              <div className="min-h-[540px] flex items-center justify-center p-8 text-center">
                <div className="max-w-lg"><div className="mx-auto h-16 w-16 rounded-full bg-[#e5eee6] text-[#2b6b38] flex items-center justify-center"><Check className="h-7 w-7" /></div><h2 className="text-4xl font-black tracking-[-0.04em] mt-6">Pedido registrado.</h2><p className="text-black/55 mt-4">Referencia <strong className="text-black">{orderResult.orderReference}</strong>. El pedido está guardado correctamente.</p><div className="mt-7 rounded-2xl bg-[#eee8e0] p-5"><div className="text-[10px] uppercase tracking-[0.16em] text-[#8a5b3c] font-black">Tu código para recomendar GHC</div><div className="text-2xl font-black mt-2 tracking-[0.08em]">{orderResult.referral}</div><p className="text-xs text-black/50 mt-2">Cuando un amigo complete su compra con este código, se generará un 15% para tu siguiente pedido.</p></div><button onClick={() => { setCheckoutOpen(false); setOrderResult(null) }} className="mt-7 rounded-full bg-[#171717] text-white px-7 py-4 text-sm font-black">Volver a la tienda</button></div>
              </div>
            ) : (
              <div className="grid lg:grid-cols-[1fr_360px]">
                <form onSubmit={submitOrder} className="p-6 sm:p-9 lg:p-11">
                  <div className="text-[10px] uppercase tracking-[0.17em] text-[#8a5b3c] font-black">Checkout GHC</div><h2 className="text-3xl md:text-4xl font-black tracking-[-0.04em] mt-2">Datos de envío</h2><p className="text-sm text-black/50 mt-2">Completa los datos y pasaremos al pago seguro del pedido completo.</p>
                  <div className="grid sm:grid-cols-2 gap-4 mt-8">
                    {[
                      ['firstName','Nombre','text',true], ['lastName','Apellidos','text',true], ['email','Email','email',true], ['phone','Teléfono','tel',false], ['addressLine1','Dirección','text',true], ['addressLine2','Piso / puerta (opcional)','text',false], ['postalCode','Código postal','text',true], ['city','Ciudad','text',true], ['province','Provincia','text',false],
                    ].map(([key,label,type,required]) => <label key={String(key)} className={key === 'addressLine1' ? 'sm:col-span-2' : ''}><span className="text-[10px] uppercase tracking-[0.13em] font-black text-black/45">{label}</span><input required={Boolean(required)} type={String(type)} value={form[key as keyof typeof form]} onChange={(e) => setForm((current) => ({ ...current, [String(key)]: e.target.value }))} className="mt-2 w-full rounded-xl border border-black/12 bg-white px-4 py-3.5 text-sm outline-none focus:border-[#9a6240]" /></label>)}
                    <label><span className="text-[10px] uppercase tracking-[0.13em] font-black text-black/45">País</span><select value={form.country} onChange={(e) => setForm((current) => ({ ...current, country: e.target.value }))} className="mt-2 w-full rounded-xl border border-black/12 bg-white px-4 py-3.5 text-sm outline-none focus:border-[#9a6240]"><option value="ES">España</option><option value="PT">Portugal</option></select></label>
                  </div>
                  <div className="mt-7 grid sm:grid-cols-2 gap-4">
                    <label><span className="text-[10px] uppercase tracking-[0.13em] font-black text-black/45">Cupón</span><input value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} placeholder="Ej. FRIEND15-XXXX" className="mt-2 w-full rounded-xl border border-black/12 bg-white px-4 py-3.5 text-sm outline-none focus:border-[#9a6240] uppercase" /></label>
                    <label><span className="text-[10px] uppercase tracking-[0.13em] font-black text-black/45">Código de amigo</span><input value={referralCode} onChange={(e) => setReferralCode(e.target.value.toUpperCase())} placeholder="Código referido" className="mt-2 w-full rounded-xl border border-black/12 bg-white px-4 py-3.5 text-sm outline-none focus:border-[#9a6240] uppercase" /></label>
                  </div>
                  {checkoutError && <div className="mt-5 rounded-xl bg-red-50 border border-red-200 text-red-700 p-4 text-sm font-semibold">{checkoutError}</div>}
                  <button disabled={submitting} className="mt-7 w-full sm:w-auto rounded-full bg-[#171717] text-white px-8 h-14 font-black text-sm inline-flex items-center justify-center gap-2 hover:bg-[#8a5b3c] disabled:opacity-50 transition">{submitting ? 'Creando pedido…' : 'Continuar al pago'} <ArrowRight className="h-4 w-4" /></button>
                </form>
                <div className="bg-[#ece8e1] p-6 sm:p-9 lg:p-8 lg:pt-24 border-t lg:border-t-0 lg:border-l border-black/10">
                  <div className="text-[10px] uppercase tracking-[0.16em] font-black text-black/45">Resumen</div><div className="mt-5 space-y-3 max-h-[270px] overflow-y-auto pr-1">{cart.map((item) => <div key={`${item.slug}-${item.variant}`} className="flex justify-between gap-3 text-sm"><div><span className="font-bold">{item.quantity}× {item.name}</span><div className="text-xs text-black/45 mt-0.5">{item.variant}</div></div><span className="font-black whitespace-nowrap">{money(item.price * item.quantity)}</span></div>)}</div>
                  <div className="mt-6 pt-5 border-t border-black/10 space-y-2 text-sm"><div className="flex justify-between text-black/55"><span>Subtotal</span><span>{money(subtotal)}</span></div><div className="flex justify-between text-black/55"><span>Envío</span><span>{shipping === 0 ? 'Gratis' : money(shipping)}</span></div><div className="flex justify-between text-xl font-black pt-2"><span>Total</span><span>{money(total)}</span></div></div>
                  <div className="mt-6 flex items-start gap-3 text-xs text-black/50"><ShieldCheck className="h-4 w-4 text-[#8a5b3c] shrink-0 mt-0.5" /><span>El pago se procesa en entorno seguro. GHC no almacena los datos de tu tarjeta.</span></div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  )
}
