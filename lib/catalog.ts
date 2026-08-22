export type Product = {
  id: string
  name: string
  price: number
  regularPrice?: number
  image: string
  flavors: string[]
  officialFlavors?: string[]
  description: string
  longDescription: string
  category: 'Proteína' | 'Rendimiento' | 'Salud'
  badge?: string
  format: string
  serving?: string
  use: string
  ingredients?: string
  technical: Array<{ label: string; value: string }>
  officialUrl?: string
  note?: string
}

export const products: Product[] = [
  {
    id: 'whey-pro-concentrate-2kg',
    name: 'Whey Pro Concentrate 2kg',
    price: 72.9,
    image: 'https://beverly.es/cdn/shop/files/web-mockup-wheypro-2kg-choco-cookies_a436f12f-8bc6-4d16-b9ad-478c0773f092.jpg?v=1759142591&width=1200',
    flavors: ['Choco Cookies', 'Strawberry', 'Vainilla Ice Cream', 'Banana'],
    officialFlavors: ['Choco Cookies', 'Strawberry', 'Vainilla Ice Cream', 'Banana', 'Beverly indica 8 sabores en total'],
    description: 'Proteína de suero concentrada Lacprodan® con enzimas digestivas.',
    longDescription: 'Whey concentrada para completar el aporte diario de proteína. Beverly formula esta gama con Lacprodan® SP-8011, DigeZyme® y Tolerase® L. Los valores cambian ligeramente según el sabor.',
    category: 'Proteína',
    badge: 'Producto estrella',
    format: '2 kg en polvo',
    serving: '35 g',
    use: 'Mezclar 35 g con agua, leche o bebida vegetal. Beverly propone su uso tras el entrenamiento o según indicación profesional.',
    ingredients: 'Base de concentrado de proteína de suero Lacprodan® SP-8011, lecitina de soja, aromas, sal, sucralosa, DigeZyme® y Tolerase® L. Colorantes/cacao varían según sabor.',
    technical: [
      { label: 'Proteína por toma', value: '26,8–27,4 g según sabor' },
      { label: 'DigeZyme®', value: '35 mg' },
      { label: 'Tolerase® L', value: '17,5 mg' },
      { label: 'Formato', value: '2 kg' },
    ],
    officialUrl: 'https://beverly.es/products/whey-pro-concentrate-2kg-choco-cookies',
  },
  {
    id: 'micellar-caseina-1kg',
    name: 'Caseína Micelar 1kg',
    price: 32.5,
    image: 'https://beverly.es/cdn/shop/files/web-mockup-casein-1kg-butter-biscuit.jpg?v=1776768693&width=1200',
    flavors: ['Butter Biscuit', 'Salted Caramel', 'Choco Cookies'],
    officialFlavors: ['Butter Biscuit', 'Salted Caramel', 'Choco Cookies', 'Beverly indica 4 sabores en total'],
    description: 'Caseína micelar de digestión lenta con DigeZyme® y Tolerase® L.',
    longDescription: 'Proteína de liberación sostenida pensada para periodos largos entre tomas. La ficha oficial de Butter Biscuit declara 27,3 g de proteína por servicio de 35 g.',
    category: 'Proteína',
    format: '1 kg en polvo',
    serving: '35 g',
    use: 'Mezclar 35 g con agua, leche o bebida vegetal. Puede utilizarse entre comidas o en el momento del día que encaje en el plan nutricional.',
    ingredients: 'Caseína micelar aislada, lecitina de girasol, aroma, sal, sucralosa, DigeZyme® y Tolerase® L. La formulación de aroma/color varía por sabor.',
    technical: [
      { label: 'Proteína por toma', value: '27,3 g (Butter Biscuit)' },
      { label: 'Hidratos', value: '2 g por 35 g (Butter Biscuit)' },
      { label: 'DigeZyme®', value: '35 mg' },
      { label: 'Tolerase® L', value: '17,5 mg' },
    ],
    officialUrl: 'https://beverly.es/products/casein-professional-1-kg-butter-biscuit',
  },
  {
    id: 'vegan-protein-900g',
    name: 'Vegan Protein 900g',
    price: 27.9,
    image: 'https://beverly.es/cdn/shop/files/web-mockup-vegan-1kg-choco-cookies_822cc546-a926-4b5a-8829-572608dc62c9.jpg?v=1760689860&width=1200',
    flavors: ['Choco Cookies', 'Strawberry White Choco', 'Petit Beurre'],
    officialFlavors: ['Choco Cookies', 'Strawberry White Choco', 'Petit Beurre'],
    description: 'Proteína vegetal de guisante y arroz enriquecida con mezcla botánica.',
    longDescription: 'Combina aislado de proteína de guisante y arroz con quinoa, chlorella, chía, espirulina, moringa, psyllium y el complejo enzimático DigeZyme®.',
    category: 'Proteína',
    format: '900 g en polvo',
    serving: '30 g en la tabla oficial',
    use: 'Mezclar una toma con agua o bebida vegetal. La ficha nutricional oficial expresa valores por 30 g, mientras el texto de uso del fabricante menciona 35 g; prevalece la etiqueta física del envase.',
    ingredients: 'Aislado de proteína de guisante, aislado de proteína de arroz, mezcla botánica (quinoa, chlorella, chía, espirulina, moringa y psyllium), DigeZyme®, aromas y sucralosa.',
    technical: [
      { label: 'Proteína', value: '23 g por 30 g' },
      { label: 'Grasas', value: '2,2 g por 30 g (Choco Cookies)' },
      { label: 'Hidratos', value: '1,9 g por 30 g (Choco Cookies)' },
      { label: 'DigeZyme®', value: '30 mg' },
    ],
    officialUrl: 'https://beverly.es/products/vegan-protein-900-g-choco-cookies',
  },
  {
    id: 'creatina-500g',
    name: 'Creatina Monohidrato 500g',
    price: 39.9,
    image: 'https://beverly.es/cdn/shop/files/web-mockup-creatina-unflavored-500g.jpg?v=1769684310&width=1200',
    flavors: ['Sin sabor'],
    officialFlavors: ['Unflavored / neutro'],
    description: 'Creatina monohidrato sin sabor y sin mezclas.',
    longDescription: 'Formato simple de creatina monohidrato. La ficha oficial de Beverly declara 3 g de creatina monohidrato por servicio de 3 g.',
    category: 'Rendimiento',
    badge: '100% creatina',
    format: '500 g en polvo',
    serving: '3 g',
    use: 'Mezclar 3 g en aproximadamente 200 ml de agua y seguir las indicaciones del etiquetado o del profesional que lleve tu pauta.',
    ingredients: 'Creatina monohidrato.',
    technical: [
      { label: 'Creatina monohidrato', value: '3 g por servicio' },
      { label: 'Servicio', value: '3 g' },
      { label: 'Sabor', value: 'Neutro' },
      { label: 'Formato', value: '500 g' },
    ],
    officialUrl: 'https://beverly.es/products/creatina-monohidrato-500-g-unflavored',
  },
  {
    id: 'bcaa-811-300g',
    name: 'BCAA 8:1:1 + L-Glutamina 300g',
    price: 26.9,
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/BCAA%208-1-1%20lollipop-T7kmttiXKgxlUMs3vWmQBxelE566CI.webp',
    flavors: ['Blue Lollipop', 'Watermelon'],
    officialFlavors: ['Blue Lollipop', 'Watermelon / Sandía'],
    description: 'BCAA en ratio 8:1:1 con L-glutamina y vitamina B6.',
    longDescription: 'Fórmula de aminoácidos ramificados con predominio de leucina, complementada con L-glutamina y vitamina B6.',
    category: 'Rendimiento',
    format: '300 g en polvo',
    serving: '10 g',
    use: 'Mezclar 10 g en unos 200 ml de agua y tomar según la pauta deportiva elegida. Comprobar el dosificador de la unidad física.',
    ingredients: 'L-leucina, maltodextrina, L-glutamina, aroma, L-isoleucina, L-valina, colorante según sabor, sucralosa y vitamina B6.',
    technical: [
      { label: 'L-Leucina', value: '4.000 mg' },
      { label: 'L-Glutamina', value: '1.500 mg' },
      { label: 'L-Isoleucina', value: '500 mg' },
      { label: 'L-Valina', value: '500 mg' },
      { label: 'Vitamina B6', value: '1,4 mg' },
    ],
    officialUrl: 'https://beverly.es/collections/aminoacidos',
    note: 'Producto y variantes contrastados con el catálogo Beverly; comprobar siempre el envase ante cambios de formulación.',
  },
  {
    id: 'map-300g',
    name: 'M.A.P. Essential Amino Acids 300g',
    price: 36.5,
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/MAP%20300%20blue%20lollipop-fBOTN6amSVgMUkF8ijSzUxaRZoAOew.webp',
    flavors: ['Blue Lollipop', 'Watermelon'],
    officialFlavors: ['Blue Lollipop', 'Watermelon'],
    description: 'Los nueve aminoácidos esenciales más vitamina B6.',
    longDescription: 'Fórmula de aminoácidos esenciales en polvo. La ficha oficial declara 15 g por servicio con leucina, lisina, isoleucina, valina y el resto de aminoácidos esenciales.',
    category: 'Rendimiento',
    format: '300 g en polvo',
    serving: '15 g',
    use: 'Mezclar 15 g (3 cazos) en 200 ml de agua. Beverly propone tomarlo después del entrenamiento o según indicación profesional.',
    ingredients: 'L-leucina, L-lisina, L-isoleucina, L-valina, L-fenilalanina, L-treonina, L-histidina, L-metionina, L-triptófano, aroma y vitamina B6.',
    technical: [
      { label: 'L-Leucina', value: '3.400 mg' },
      { label: 'L-Lisina', value: '2.200 mg' },
      { label: 'L-Isoleucina', value: '1.800 mg' },
      { label: 'L-Valina', value: '1.800 mg' },
      { label: 'Vitamina B6', value: '1,4 mg' },
    ],
    officialUrl: 'https://beverly.es/products/map-300-g-blue-lollipop',
  },
  {
    id: 'dynamite-pre-workout',
    name: 'Dynamite Pre-Workout 375g',
    price: 32.9,
    image: 'https://beverly.es/cdn/shop/files/OLD-web-mockup-dynamite-fruit-punch.jpg?v=1757926024&width=1200',
    flavors: ['Fruit Punch', 'Blue Lollipop'],
    officialFlavors: ['Fruit Punch', 'Blue Lollipop'],
    description: 'Pre-entreno con creatina Creapure®, beta-alanina, citrulina y cafeína.',
    longDescription: 'Fórmula pre-entreno de 25 servicios. Contiene cafeína; no es un producto apropiado para menores ni para personas sensibles a estimulantes.',
    category: 'Rendimiento',
    badge: '25 servicios',
    format: '375 g en polvo',
    serving: '15 g',
    use: 'Tomar 15 g (3 cazos según la ficha oficial) aproximadamente 30 minutos antes del entrenamiento. Contiene cafeína.',
    technical: [
      { label: 'Arginina AKG', value: '3.000 mg' },
      { label: 'Creatina Creapure®', value: '3.000 mg' },
      { label: 'Beta-Alanina CarnoSyn®', value: '2.000 mg' },
      { label: 'L-Citrulina Malato', value: '2.000 mg' },
      { label: 'NewCaff®', value: '300 mg de ingrediente microencapsulado' },
    ],
    officialUrl: 'https://beverly.es/products/dynamite-pre-workout-375-g-25-servings-fruit-punch',
    note: 'Producto con cafeína. Revisar advertencias completas del envase antes de consumir.',
  },
  {
    id: 'energy-pro-90',
    name: 'Energy Pro 90 caps',
    price: 19.9,
    image: 'https://beverly.es/cdn/shop/files/web-mockup-energy-pro.jpg?v=1754980864&width=1200',
    flavors: ['Cápsulas'],
    description: 'Cafeína y taurina en cápsula.',
    longDescription: 'Complemento concentrado para adultos que combina cafeína anhidra y taurina. Contiene una dosis alta de cafeína por cápsula.',
    category: 'Rendimiento',
    format: '90 cápsulas · 90 servicios',
    serving: '1 cápsula',
    use: 'La ficha oficial propone 1 cápsula aproximadamente 30 minutos antes del entrenamiento. Evitar combinar con otras fuentes altas de cafeína.',
    technical: [
      { label: 'L-Taurina', value: '400 mg' },
      { label: 'Cafeína', value: '200 mg' },
      { label: 'Servicio', value: '1 cápsula' },
      { label: 'Servicios', value: '90' },
    ],
    officialUrl: 'https://beverly.es/products/energy-pro-caffeine-taurine-90-caps',
    note: 'Contiene cafeína. No recomendado para niños, embarazo/lactancia ni personas sensibles a estimulantes.',
  },
  {
    id: 'vitamin-complex-90',
    name: 'Vitamin Complex 90 caps',
    price: 14.9,
    image: 'https://beverly.es/cdn/shop/files/web-mockup-vitamin-complex_7662aab8-3b3d-47af-92f6-6810962fa273.jpg?v=1754910638&width=1200',
    flavors: ['Cápsulas'],
    description: 'Complejo diario de vitaminas y minerales.',
    longDescription: 'Multivitamínico y mineral de 90 servicios con vitaminas A, C, D3, E, K1, grupo B y minerales como calcio, magnesio, hierro y zinc.',
    category: 'Salud',
    format: '90 comprimidos veganos · 90 servicios',
    serving: '1 comprimido',
    use: 'Tomar 1 al día, preferiblemente con una de las comidas principales, según la ficha oficial.',
    technical: [
      { label: 'Vitamina C', value: '80 mg' },
      { label: 'Calcio', value: '200 mg' },
      { label: 'Magnesio', value: '75 mg' },
      { label: 'Zinc', value: '10 mg' },
      { label: 'Vitamina D3', value: '5 µg' },
    ],
    officialUrl: 'https://beverly.es/products/vitamin-complex-multivitaminico-y-mineral-90-caps',
  },
]

export const collagenPromo: Product = {
  id: 'promo-colageno-2-cajas',
  name: 'Pack Colágeno Marino · 2 cajas',
  price: 65,
  regularPrice: 73.8,
  image: 'https://beverly.es/cdn/shop/files/pruebaweb_d64f1683-bf88-47a7-bc17-828215d4d053.jpg?v=1766496350&width=1200',
  flavors: ['Frutos del bosque · 40 viales'],
  description: 'Dos cajas de colágeno marino Peptan® con vitamina C, biotina, zinc y ácido hialurónico.',
  longDescription: 'Pack de 40 viales líquidos. Cada vial de la formulación actual de Beverly aporta 5 g de colágeno marino Peptan® más vitamina C, zinc, biotina y ácido hialurónico.',
  category: 'Salud',
  badge: 'Pack ahorro',
  format: '2 × 20 viales de 25 ml',
  serving: '1 vial',
  use: 'Tomar 1 vial al día, preferiblemente en el desayuno. Agitar durante unos 10 segundos antes de tomar.',
  ingredients: 'Agua, colágeno marino Peptan® (pescado), concentrado de manzana, fructosa, vitamina C, zinc, hialuronato de sodio, biotina y otros ingredientes tecnológicos de la formulación.',
  technical: [
    { label: 'Colágeno marino Peptan®', value: '5.000 mg por vial' },
    { label: 'Vitamina C', value: '102,5 mg' },
    { label: 'Ácido hialurónico', value: '17,5 mg' },
    { label: 'Zinc', value: '10,5 mg' },
    { label: 'Biotina', value: '55 µg' },
  ],
  officialUrl: 'https://beverly.es/products/collagen-for-her-biotine-vitamin-c-20-viales',
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
