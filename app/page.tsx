'use client'

import { useState, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'

const products = [
  { 
    id: 1, 
    name: "Whey Pro Concentrate 2kg", 
    price: 72.90, 
    sumupLink: "https://pay.sumup.com/b2c/QMMQRGOQ",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Proteinas%20concentrada%20choco%20cookies-GhBTztcpWoxgoDWvXKyJQeKJJzZVNQ.webp", 
    flavors: ["Choco Cookies", "Belgian Choco", "Vainilla", "Strawberry"], 
    description: "Proteina de suero concentrada" 
  },
  { 
    id: 2, 
    name: "Micellar Caseina 1kg", 
    price: 32.50, 
    sumupLink: "https://pay.sumup.com/b2c/Q9Y55JKC",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Caseinato%201%20kg-pN6sFcRtHZk3eYSxhYQlGIGoNXrCfL.webp", 
    flavors: ["Chocolate", "Strawberry", "Vainilla"], 
    description: "Liberacion lenta 8 horas" 
  },
  { 
    id: 3, 
    name: "Vegan Protein 900g", 
    price: 27.90, 
    sumupLink: "https://pay.sumup.com/b2c/Q6XSWWTQ",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Proteina%20vegana%20cookies-lil6MyacDTD1FnALpmXagZmkEShL61.webp", 
    flavors: ["Choco Cookies", "Strawberry White Choco"], 
    description: "Proteina vegetal de guisante y arroz" 
  },
  { 
    id: 4, 
    name: "Creatina 500g", 
    price: 39.90, 
    sumupLink: "https://pay.sumup.com/b2c/QEYKCSD6",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/creatina%20500g-nt8PxaZscVo3qP4d4o80owqOaQ6ihY.webp", 
    flavors: ["Sin Sabor"], 
    description: "100% Monohidrato - Maxima pureza" 
  },
  { 
    id: 5, 
    name: "BCAA 8:1:1 300g", 
    price: 26.90, 
    sumupLink: "https://pay.sumup.com/b2c/QP3A1QLX",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/BCAA%208-1-1%20lollipop-T7kmttiXKgxlUMs3vWmQBxelE566CI.webp", 
    flavors: ["Blue Lollipop", "Watermelon"], 
    description: "Con L-Glutamina Kyowa" 
  },
  { 
    id: 6, 
    name: "M.A.P. 300g", 
    price: 36.50, 
    sumupLink: "https://pay.sumup.com/b2c/Q8HESM99",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/MAP%20300%20blue%20lollipop-fBOTN6amSVgMUkF8ijSzUxaRZoAOew.webp", 
    flavors: ["Blue Lollipop", "Watermelon"], 
    description: "Aminoacidos esenciales" 
  },
  { 
    id: 7, 
    name: "Dynamite Pre-Workout", 
    price: 32.90, 
    sumupLink: "https://pay.sumup.com/b2c/QNRD1XYD",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Pre-entreno%20fruit%20punch-jQDr8jqS1HvR35ROiC3Bkk8cPynNEV.webp", 
    flavors: ["Fruit Punch", "Blue Lollipop"], 
    description: "El pre-entreno definitivo" 
  },
  { 
    id: 8, 
    name: "Energy Pro 90 caps", 
    price: 19.90, 
    sumupLink: "https://pay.sumup.com/b2c/QT076WNE",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/energy%20pro%2090-0g8rFct95mlzm12kBYHJ6gbv7QhSne.webp", 
    flavors: ["Capsulas"], 
    description: "Energia y concentracion" 
  },
  { 
    id: 9, 
    name: "Vitamin Complex 90 tabs", 
    price: 14.90, 
    sumupLink: "https://pay.sumup.com/b2c/Q6KCXQJS",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Vitamina%20Complex-aSmopLYLbOJhmDr7tdBUrpTf2sXpyW.webp", 
    flavors: ["Tabletas"], 
    description: "Vitaminas y minerales esenciales" 
  },
]

// Promo Colageno link
const PROMO_COLAGENO_LINK = "https://pay.sumup.com/b2c/QIVU97RR"

// Hook para capturar y gestionar el parametro ref de referidos
function useReferralCode() {
  const [refCode, setRefCode] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const ref = urlParams.get('ref')
      if (ref) {
        setRefCode(ref)
        // Guardar en sessionStorage para persistir durante la sesion
        sessionStorage.setItem('ghc_ref', ref)
      } else {
        // Recuperar de sessionStorage si existe
        const storedRef = sessionStorage.getItem('ghc_ref')
        if (storedRef) {
          setRefCode(storedRef)
        }
      }
    }
  }, [])

  // Funcion para añadir el ref al enlace de SumUp
  const addRefToLink = (baseLink: string): string => {
    if (!refCode) return baseLink
    const separator = baseLink.includes('?') ? '&' : '?'
    return `${baseLink}${separator}ref=${encodeURIComponent(refCode)}`
  }

  return { refCode, addRefToLink }
}

function FlavorSelector({ 
  flavors, 
  selectedFlavor, 
  onChange 
}: { 
  flavors: string[]
  selectedFlavor: string
  onChange: (flavor: string) => void 
}) {
  return (
    <div className="relative">
      <select 
        value={selectedFlavor}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-11 bg-gradient-to-b from-gray-100 to-gray-200 border border-gray-300 rounded-lg pl-4 pr-10 text-sm font-medium text-gray-800 appearance-none cursor-pointer hover:border-orange-500/50 focus:border-orange-500 focus:outline-none transition-colors shadow-inner"
      >
        {flavors.map(flavor => (
          <option key={flavor} value={flavor} className="bg-white text-gray-800">
            {flavor}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
    </div>
  )
}

function ProductCard({ 
  product, 
  selectedFlavor, 
  onFlavorChange,
  addRefToLink
}: { 
  product: typeof products[0]
  selectedFlavor: string
  onFlavorChange: (flavor: string) => void
  addRefToLink: (link: string) => string
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col h-full transition-all hover:border-orange-500/60 hover:shadow-xl group relative overflow-hidden">
      {/* Metallic shine effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      
      {/* Imagen - altura fija */}
      <div className="relative h-52 w-full mb-5 flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 rounded-xl overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className="h-44 object-contain transition-transform duration-300 group-hover:scale-110 drop-shadow-md" 
        />
      </div>

      {/* Contenido - flex-1 para ocupar espacio disponible */}
      <div className="flex-1 flex flex-col relative">
        {/* Nombre y descripcion - altura minima fija */}
        <div className="min-h-[60px] mb-4">
          <h3 className="text-lg font-bold leading-tight uppercase text-gray-900">{product.name}</h3>
          <p className="text-xs text-gray-500 mt-1">{product.description}</p>
        </div>
        
        {/* Selector de sabor - identico para todos */}
        <div className="mb-5">
          <FlavorSelector 
            flavors={product.flavors}
            selectedFlavor={selectedFlavor}
            onChange={onFlavorChange}
          />
        </div>
      </div>

      {/* Precio y boton - siempre al fondo, mt-auto empuja hacia abajo */}
      <div className="border-t border-gray-200 pt-5 flex items-center justify-between gap-4 mt-auto relative">
        <span className="text-2xl font-black text-gray-900">{product.price.toFixed(2)}€</span>
        <Button 
          asChild
          className="bg-gradient-to-b from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-black text-xs px-5 h-10 transition-all rounded-lg flex-1 shadow-md hover:shadow-lg border border-orange-400/50"
        >
          <a href={addRefToLink(product.sumupLink)} target="_blank" rel="noopener noreferrer">
            COMPRAR
          </a>
        </Button>
      </div>
    </div>
  )
}

export default function LandingPage() {
  const [selectedFlavors, setSelectedFlavors] = useState<Record<number, string>>(
    Object.fromEntries(products.map(p => [p.id, p.flavors[0]]))
  )
  const { refCode, addRefToLink } = useReferralCode()

  const handleFlavorChange = (productId: number, flavor: string) => {
    setSelectedFlavors(prev => ({ ...prev, [productId]: flavor }))
  }

  return (
    <main className="min-h-screen bg-gray-100 text-gray-900 font-sans selection:bg-orange-500/30">
      {/* Brushed Metal Background Pattern */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `repeating-linear-gradient(
            90deg,
            transparent,
            transparent 1px,
            rgba(180,180,180,0.2) 1px,
            rgba(180,180,180,0.2) 2px
          )`,
          backgroundSize: '3px 100%'
        }}
      />

      {/* Header con Logo Centrado */}
      <header className="relative py-8 flex flex-col items-center border-b border-gray-300 bg-gradient-to-b from-white via-gray-50 to-gray-100 shadow-sm">
        <div className="relative h-32 w-56 overflow-hidden">
          <img 
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo.png.png-KWwScWu3qmacEqCxKxqLy8rprgcMHU.jpeg" 
            alt="GHC Nutrition Logo" 
            className="h-full w-full object-contain drop-shadow-lg" 
          />
        </div>
        <p className="mt-3 text-orange-600 uppercase tracking-[0.25em] text-xs font-bold">
          Distribuidor Oficial Beverly Nutrition
        </p>
        {refCode && (
          <span className="mt-2 text-[10px] text-gray-400 bg-gray-200 px-2 py-0.5 rounded-full">
            Referido: {refCode}
          </span>
        )}
      </header>

      {/* Banner Oferta del Dia - Colageno */}
      <section className="relative container mx-auto px-4 py-12">
        <div className="bg-gradient-to-br from-white via-white to-gray-50 border border-gray-200 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8 shadow-xl relative overflow-hidden">
          {/* Metallic accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-400" />
          
          <div className="relative">
            <img 
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/colageno-rQhEmCHoRZ4qFSOEisJ4NnnMLfiqdG.webp" 
              alt="Colageno Beverly"
              className="w-56 h-56 object-contain drop-shadow-xl" 
            />
          </div>
          <div className="flex-1 text-center md:text-left">
            <span className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase mb-4 inline-block shadow-md">
              Oferta Especial
            </span>
            <h2 className="text-3xl md:text-4xl font-black mb-2 tracking-tight text-balance text-gray-900">
              PROMO COLAGENO: 2 CAJAS
            </h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto md:mx-0">
              Pack exclusivo de salud articular y belleza. 40 viales con Colageno Peptan, Vitamina C y Acido Hialuronico.
            </p>
            <div className="flex items-center justify-center md:justify-start gap-4 mb-8">
              <span className="text-5xl font-black text-orange-500">65€</span>
              <span className="text-xl line-through text-gray-400">73.80€</span>
              <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">-12%</span>
            </div>
            <Button 
              asChild
              className="bg-gradient-to-b from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold h-14 px-10 rounded-xl transition-all hover:scale-105 shadow-lg border border-orange-400/50"
            >
              <a href={addRefToLink(PROMO_COLAGENO_LINK)} target="_blank" rel="noopener noreferrer">
                COMPRAR PACK AHORA
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Titulo Catalogo */}
      <section className="relative container mx-auto px-4 pb-4">
        <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight text-center md:text-left">
          Catalogo de Productos
        </h2>
        <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-orange-400 mt-2 mx-auto md:mx-0 rounded-full" />
      </section>

      {/* Catalogo de Productos - Grid 3x3 */}
      <section className="relative container mx-auto px-4 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              selectedFlavor={selectedFlavors[product.id]}
              onFlavorChange={(flavor) => handleFlavorChange(product.id, flavor)}
              addRefToLink={addRefToLink}
            />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-gradient-to-b from-white to-gray-50 border-t border-gray-200 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm">
            GHC Nutrition - Distribuidor Oficial Beverly Nutrition
          </p>
          <p className="text-gray-400 text-xs mt-2">
            Suplementos deportivos de maxima calidad
          </p>
        </div>
      </footer>
    </main>
  )
}
