export type Product = {
  id: string
  name: string
  price: number
  regularPrice?: number
  image: string
  flavors: string[]
  description: string
  category: 'Proteína' | 'Rendimiento' | 'Salud'
  badge?: string
}

export const products: Product[] = [
  {
    id: 'whey-pro-concentrate-2kg',
    name: 'Whey Pro Concentrate 2kg',
    price: 72.9,
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Proteinas%20concentrada%20choco%20cookies-GhBTztcpWoxgoDWvXKyJQeKJJzZVNQ.webp',
    flavors: ['Choco Cookies', 'Belgian Choco', 'Vainilla', 'Strawberry'],
    description: 'Proteína de suero concentrada',
    category: 'Proteína',
    badge: '2 kg',
  },
  {
    id: 'micellar-caseina-1kg',
    name: 'Micellar Caseína 1kg',
    price: 32.5,
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Caseinato%201%20kg-pN6sFcRtHZk3eYSxhYQlGIGoNXrCfL.webp',
    flavors: ['Chocolate', 'Strawberry', 'Vainilla'],
    description: 'Proteína de liberación lenta',
    category: 'Proteína',
  },
  {
    id: 'vegan-protein-900g',
    name: 'Vegan Protein 900g',
    price: 27.9,
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Proteina%20vegana%20cookies-lil6MyacDTD1FnALpmXagZmkEShL61.webp',
    flavors: ['Choco Cookies', 'Strawberry White Choco'],
    description: 'Proteína vegetal de guisante y arroz',
    category: 'Proteína',
  },
  {
    id: 'creatina-500g',
    name: 'Creatina 500g',
    price: 39.9,
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/creatina%20500g-nt8PxaZscVo3qP4d4o80owqOaQ6ihY.webp',
    flavors: ['Sin sabor'],
    description: '100% monohidrato · máxima pureza',
    category: 'Rendimiento',
    badge: '500 g',
  },
  {
    id: 'bcaa-811-300g',
    name: 'BCAA 8:1:1 300g',
    price: 26.9,
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/BCAA%208-1-1%20lollipop-T7kmttiXKgxlUMs3vWmQBxelE566CI.webp',
    flavors: ['Blue Lollipop', 'Watermelon'],
    description: 'Con L-Glutamina Kyowa',
    category: 'Rendimiento',
  },
  {
    id: 'map-300g',
    name: 'M.A.P. 300g',
    price: 36.5,
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/MAP%20300%20blue%20lollipop-fBOTN6amSVgMUkF8ijSzUxaRZoAOew',
    flavors: ['Blue Lollipop', 'Watermelon'],
    description: 'Aminoácidos esenciales',
    category: 'Rendimiento',
  },
  {
    id: 'dynamite-pre-workout',
    name: 'Dynamite Pre-Workout',
    price: 32.9,
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Pre-entreno%20fruit%20punch-jQDr8jqS1HvR35ROiC3Bkk8cPynNEV.webp',
    flavors: ['Fruit Punch', 'Blue Lollipop'],
    description: 'Pre-entreno para sesiones exigentes',
    category: 'Rendimiento',
  },
  {
    id: 'energy-pro-90',
    name: 'Energy Pro 90 caps',
    price: 19.9,
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/energy%20pro%2090-0g8rFct95mlzm12kBYHJ6gbv7QhSne.webp',
    flavors: ['Cápsulas'],
    description: 'Energía y concentración',
    category: 'Rendimiento',
  },
  {
    id: 'vitamin-complex-90',
    name: 'Vitamin Complex 90 tabs',
    price: 14.9,
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Vitamina%20Complex-aSmopLYLbOJhmDr7tdBUrpTf2sXpyW.webp',
    flavors: ['Tabletas'],
    description: 'Vitaminas y minerales esenciales',
    category: 'Salud',
  },
]

export const collagenPromo: Product = {
  id: 'promo-colageno-2-cajas',
  name: 'Promo Colágeno · 2 cajas',
  price: 65,
  regularPrice: 73.8,
  image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/colageno-rQhEmCHoRZ4qFSOEisJ4NnnMLfiqdG.webp',
  flavors: ['40 viales'],
  description: 'Colágeno Peptan, vitamina C y ácido hialurónico',
  category: 'Salud',
  badge: '-12%',
}

export const catalog = [collagenPromo, ...products]

export function getProduct(productId: string) {
  return catalog.find((product) => product.id === productId)
}

export function formatPrice(value: number) {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(value)
}
