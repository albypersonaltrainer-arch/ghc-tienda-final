export const productCategories = [
  'Proteínas',
  'Creatina & Fuerza',
  'Pre-entreno & Energía',
  'Recuperación & Aminoácidos',
  'Vitaminas & Minerales',
  'Salud & Bienestar',
  'Control de peso',
  'For Her',
] as const

export type ProductCategory = (typeof productCategories)[number]

export type Product = {
  id: string
  tariffRef?: string
  name: string
  price: number
  regularPrice?: number
  image: string
  flavors: string[]
  description: string
  longDescription: string
  category: ProductCategory
  categories: ProductCategory[]
  badge?: string
  format: string
  serving?: string
  use: string
  ingredients?: string
  technical: Array<{ label: string; value: string }>
  officialUrl?: string
  note?: string
}

type ProductSeed = Omit<Product, 'longDescription' | 'use' | 'technical'> & {
  longDescription?: string
  use?: string
  technical?: Array<{ label: string; value: string }>
}

const officialImage = (name: string) => `/api/product-image?name=${encodeURIComponent(name)}`

function makeProduct(seed: ProductSeed): Product {
  return {
    ...seed,
    longDescription: seed.longDescription || seed.description,
    use: seed.use || 'Seguir la dosis, modo de empleo y advertencias indicadas en el envase.',
    technical: seed.technical || [
      { label: 'Formato', value: seed.format },
      { label: 'Tarifa GHC 2026', value: formatPrice(seed.price) },
    ],
  }
}

export const products: Product[] = [
  makeProduct({
    id: 'whey-pro-concentrate-2kg', tariffRef: 'BEVWPCHC', name: 'Whey Pro Concentrate 2kg', price: 75,
    image: officialImage('Whey Pro Concentrate - 2 Kg - Choco Cookies'),
    flavors: ['Banana', 'Belgian Choco', 'Butter Biscuit', 'Choco Cookies', 'Natillas', 'Strawberry', 'Strawberry White Choco', 'Vainilla Ice Cream'],
    description: 'Proteína de suero concentrada Lacprodan® con enzimas digestivas.', category: 'Proteínas', categories: ['Proteínas', 'Recuperación & Aminoácidos'],
    badge: 'Producto estrella', format: '2 kg en polvo', serving: '35 g',
    officialUrl: 'https://beverly.es/products/whey-pro-concentrate-2kg-choco-cookies',
  }),
  makeProduct({
    id: 'casein-professional-1kg', tariffRef: 'BEVCASC', name: 'Caseína Micelar 1kg', price: 45,
    image: officialImage('Caseína Micelar - 1 Kg - Butter Biscuit'),
    flavors: ['Butter Biscuit', 'Choco Cookies', 'Salted Caramel', 'Strawberry White Chocolate'],
    description: 'Caseína micelar de digestión sostenida con DigeZyme® y Tolerase® L.', category: 'Proteínas', categories: ['Proteínas', 'Recuperación & Aminoácidos'],
    format: '1 kg en polvo', serving: '35 g', officialUrl: 'https://beverly.es/products/casein-professional-1-kg-butter-biscuit',
  }),
  makeProduct({
    id: 'vegan-protein-900g', tariffRef: 'BEVVGCHC', name: 'Vegan Protein 900g', price: 30,
    image: officialImage('Vegan Protein - 900 g - Choco Cookies'),
    flavors: ['Choco Cookies', 'Petit Beurre', 'Strawberry White Chocolate'],
    description: 'Proteína vegetal de guisante y arroz enriquecida con superalimentos.', category: 'Proteínas', categories: ['Proteínas', 'Salud & Bienestar'],
    format: '900 g en polvo', officialUrl: 'https://beverly.es/products/vegan-protein-900-g-choco-cookies',
  }),
  makeProduct({
    id: 'creatina-500g', tariffRef: 'BEVCR500', name: 'Creatina Monohidrato 500g', price: 43,
    image: officialImage('Creatina Monohidrato - 500 g - Unflavored'), flavors: ['Unflavored'],
    description: 'Creatina monohidrato sin sabor en formato grande.', category: 'Creatina & Fuerza', categories: ['Creatina & Fuerza'],
    badge: '500 g', format: '500 g en polvo', ingredients: 'Creatina monohidrato.', officialUrl: 'https://beverly.es/products/creatina-monohidrato-500-g-unflavored',
  }),
  makeProduct({
    id: 'bcaa-811-300g', tariffRef: 'BEV811T', name: 'BCAA 8:1:1 + L-Glutamina 300g', price: 32.82,
    image: officialImage('BCAA 8:1:1 + L-Glutamina - 300 g - Blue Lollipop'), flavors: ['Blue Lollipop'],
    description: 'BCAA 8:1:1 con L-glutamina y vitamina B6.', category: 'Recuperación & Aminoácidos', categories: ['Recuperación & Aminoácidos'],
    format: '300 g en polvo',
  }),
  makeProduct({
    id: 'map-300g', tariffRef: 'BEVMAP', name: 'M.A.P. Essential Amino Acids 300g', price: 38.5,
    image: officialImage('MAP - Aminoácidos esenciales - 300 g - Blue Lollipop'), flavors: ['Blue Lollipop', 'Watermelon'],
    description: 'Fórmula con los nueve aminoácidos esenciales.', category: 'Recuperación & Aminoácidos', categories: ['Recuperación & Aminoácidos'], format: '300 g en polvo',
  }),
  makeProduct({
    id: 'dynamite-pre-workout', tariffRef: 'BEVDYFP', name: 'Dynamite Pre-Workout 375g', price: 33.9,
    image: officialImage('Dynamite Pre Workout - 375 g - 25 Servings - Fruit Punch'), flavors: ['Fruit Punch', 'Blue Lollipop'],
    description: 'Pre-entreno con creatina, beta-alanina, citrulina y cafeína.', category: 'Pre-entreno & Energía', categories: ['Pre-entreno & Energía', 'Creatina & Fuerza'],
    format: '375 g en polvo', note: 'Contiene cafeína y otros estimulantes. Revisar las advertencias del envase.',
  }),
  makeProduct({
    id: 'energy-pro-90', tariffRef: 'BEVEPRO', name: 'Energy Pro 90 caps', price: 15.97,
    image: officialImage('Energy Pro - Cafeína + Taurina - 90 Caps - 90 Servings'), flavors: ['Cápsulas'],
    description: 'Cafeína y taurina en cápsulas.', category: 'Pre-entreno & Energía', categories: ['Pre-entreno & Energía'], format: '90 cápsulas', note: 'Contiene cafeína.',
  }),
  makeProduct({
    id: 'vitamin-complex-90', tariffRef: 'BEVVC', name: 'Vitamin Complex 90 caps', price: 19.9,
    image: officialImage('Vitamin Complex multivitamínico y mineral - 90 Caps - 90 Servicios'), flavors: ['Cápsulas'],
    description: 'Complejo diario de vitaminas y minerales.', category: 'Vitaminas & Minerales', categories: ['Vitaminas & Minerales', 'Salud & Bienestar'], format: '90 cápsulas',
  }),
  makeProduct({
    id: 'isolate-cfm-1kg', tariffRef: 'BEVICFMCHC1', name: 'Isolate CFM Professional 1kg', price: 52,
    image: officialImage('Isolate CFM Professional - 1 Kg - Choco Cookies'),
    flavors: ['Butter Biscuit', 'Choco Cookies', 'Choco Hazelnut', 'Strawberry', 'Banana', 'Vainilla Ice Cream'],
    description: 'Aislado de suero CFM Lacprodan®.', category: 'Proteínas', categories: ['Proteínas', 'Recuperación & Aminoácidos'], badge: 'Aislado', format: '1 kg en polvo',
  }),
  makeProduct({
    id: 'isolate-cfm-2kg', tariffRef: 'BEVICFMCHC', name: 'Isolate CFM Professional 2kg', price: 94.9,
    image: officialImage('Isolate CFM Professional - 2 Kg - Butter Biscuit'),
    flavors: ['Butter Biscuit', 'Choco Cookies', 'Choco Hazelnut', 'Strawberry', 'Strawberry Cheesecake', 'Vainilla Ice Cream'],
    description: 'Formato grande del aislado CFM Professional.', category: 'Proteínas', categories: ['Proteínas', 'Recuperación & Aminoácidos'], badge: 'Formato ahorro', format: '2 kg en polvo',
  }),
  makeProduct({
    id: 'hydro-protein-1kg', tariffRef: 'BEVDLCHC', name: 'Hydro Protein 1kg', price: 47,
    image: officialImage('Hydro Protein - 1 Kg - Banana'),
    flavors: ['Banana', 'Choco Cookies', 'Petit Beurre', 'Strawberry Cheesecake', 'Strawberry White Chocolate', 'Choco Orange', 'Yogurt Peach', 'Sweet Pineapple', 'Choco Raspberry', 'Choco Hazelnut', 'Lemon Cheesecake', 'Custard Ice Cream'],
    description: 'Proteína hidrolizada en formato 1 kg.', category: 'Proteínas', categories: ['Proteínas', 'Recuperación & Aminoácidos'], format: '1 kg en polvo',
  }),
  makeProduct({
    id: 'hydro-protein-2kg', tariffRef: 'BEVHCH', name: 'Hydro Protein Professional 2kg', price: 85,
    image: officialImage('Hydro Protein Professional - 2 Kg - Cookies and Cream'), flavors: ['Chocolate', 'Strawberry', 'Cookies and Cream'],
    description: 'Proteína hidrolizada profesional en formato 2 kg.', category: 'Proteínas', categories: ['Proteínas', 'Recuperación & Aminoácidos'], format: '2 kg en polvo',
  }),
  makeProduct({
    id: 'clear-isolate-500g', tariffRef: 'BEVCLCC', name: 'Clear Isolate Protein 500g', price: 31.9,
    image: officialImage('Clear Isolate Protein - 500 g - Orange Mango'), flavors: ['Orange Mango', 'Strawberry Kiwi'],
    description: 'Aislado de suero tipo clear, ligero y refrescante.', category: 'Proteínas', categories: ['Proteínas', 'Recuperación & Aminoácidos'], badge: 'Clear', format: '500 g en polvo',
  }),
  makeProduct({
    id: 'pure-whey-1kg', tariffRef: 'BEVPURE', name: 'Pure Whey 1kg', price: 49,
    image: officialImage('Pure Whey - 1 Kg'), flavors: ['Unflavored'], description: 'Whey Lacprodan® sin sabor añadido.',
    category: 'Proteínas', categories: ['Proteínas'], format: '1 kg en polvo',
  }),
  makeProduct({
    id: 'whey-pro-concentrate-1kg', tariffRef: 'BEVWPCHC1', name: 'Whey Pro Concentrate 1kg', price: 41.65,
    image: officialImage('Whey Pro Concentrate - 1 Kg - Choco Cookies'),
    flavors: ['Butter Biscuit', 'Choco Cookies', 'Natillas', 'Strawberry Cheesecake', 'Strawberry', 'Vainilla Ice Cream'],
    description: 'Formato 1 kg del concentrado de suero Lacprodan®.', category: 'Proteínas', categories: ['Proteínas', 'Recuperación & Aminoácidos'], format: '1 kg en polvo',
  }),
  makeProduct({
    id: 'creapure-300g', tariffRef: 'BVCRP300', name: 'Creatina Monohidrato Creapure® 300g', price: 32.95,
    image: officialImage('Creatina Monohidrato Creapure® - 300 g - Unflavored'), flavors: ['Unflavored', 'Cherry', 'Orange Mango'],
    description: 'Creatina monohidrato Creapure® en tres variantes publicadas por Beverly.', category: 'Creatina & Fuerza', categories: ['Creatina & Fuerza'], badge: 'Creapure®', format: '300 g en polvo',
  }),
  makeProduct({
    id: 'creapure-q10-300g', tariffRef: 'BVCRW', name: 'Creatina Creapure® + Q10 300g', price: 33.9,
    image: officialImage('Creatina Monohidrato Creapure® + Coenzima Q10 - 300 g - Sandía'), flavors: ['Sandía'],
    description: 'Creatina Creapure® combinada con coenzima Q10.', category: 'Creatina & Fuerza', categories: ['Creatina & Fuerza', 'For Her'], format: '300 g en polvo',
  }),
  makeProduct({
    id: 'nac-90', tariffRef: 'BEVNAC', name: 'NAC + Vitamina C + Zinc', price: 15.5,
    image: officialImage('NAC + Vitamina C + Zinc - 60 Caps - 30 Servicios'), flavors: ['Cápsulas'],
    description: 'N-acetil L-cisteína combinada con vitamina C y zinc.', category: 'Salud & Bienestar', categories: ['Salud & Bienestar', 'Vitaminas & Minerales'], format: '60 cápsulas · 30 servicios',
  }),
  makeProduct({
    id: 'l-glutamina-kyowa-300g', tariffRef: 'BEVGMN', name: 'L-Glutamina Kyowa® 300g', price: 19.2,
    image: officialImage('L-Glutamina Kyowa® - 300 g - Unflavored'), flavors: ['Unflavored', 'Cherry', 'Blue Lollipop'],
    description: 'L-glutamina Kyowa® en polvo.', category: 'Recuperación & Aminoácidos', categories: ['Recuperación & Aminoácidos', 'Salud & Bienestar'], format: '300 g en polvo',
  }),
  makeProduct({
    id: 'magnesium-bisglycinate-b6', tariffRef: 'BEVMAG', name: 'Bisglicinato de Magnesio + B6 90 caps', price: 12.95,
    image: officialImage('Bisglicinato de Magnesio + Vitamin B6 - 90 Caps - 90 Servicios'), flavors: ['Cápsulas'],
    description: 'Bisglicinato de magnesio con vitamina B6.', category: 'Vitaminas & Minerales', categories: ['Vitaminas & Minerales', 'Salud & Bienestar'], format: '90 cápsulas · 90 servicios',
  }),
  makeProduct({
    id: 'vitamin-d3-k2', tariffRef: 'BEVVITDK', name: 'Vitamina D3 + K2 60 caps', price: 12.9,
    image: officialImage('Vitamina D3 + K2 - 60 Caps - 60 Servicios'), flavors: ['Cápsulas'], description: 'Combinación de vitamina D3 y vitamina K2.',
    category: 'Vitaminas & Minerales', categories: ['Vitaminas & Minerales', 'Salud & Bienestar', 'For Her'], format: '60 cápsulas · 60 servicios', officialUrl: 'https://beverly.es/products/vitamin-d3-k2-60-caps',
  }),
  makeProduct({
    id: 'ashwagandha-ksm66', tariffRef: 'BEVASH', name: 'Ashwagandha KSM-66® 60 caps', price: 29.5,
    image: officialImage('Ashwagandha KSM-66 + Magnesio, L-Teanina & Rhodiola - 60 Caps - 60 Servicios'), flavors: ['Cápsulas'],
    description: 'KSM-66® con magnesio, L-teanina y rhodiola.', category: 'Salud & Bienestar', categories: ['Salud & Bienestar', 'For Her'], format: '60 cápsulas · 60 servicios', officialUrl: 'https://beverly.es/products/ashwagandha-ksm66-60-caps',
  }),
  makeProduct({
    id: 'b-complex-60', tariffRef: 'BEVBCOM', name: 'B-Complex 60 caps', price: 28,
    image: officialImage('B-Complex - 60 Caps - 60 Servicios'), flavors: ['Cápsulas'], description: 'Complejo de vitaminas del grupo B.',
    category: 'Vitaminas & Minerales', categories: ['Vitaminas & Minerales', 'Salud & Bienestar'], format: '60 cápsulas · 60 servicios', officialUrl: 'https://beverly.es/products/b-complex-60-caps',
  }),
  makeProduct({
    id: 'women-protein-1kg', tariffRef: 'BEVWPSCH', name: 'Women Protein Shake 1kg', price: 49,
    image: officialImage('Women Protein Shake - 1 Kg - Capuccino'), flavors: ['Capuccino'],
    description: 'Protein shake de la colección For Her. Beverly publica actualmente el formato de 1 kg en Capuccino.',
    longDescription: 'Beverly también mantiene sabores de Women Protein Shake en formato 500 g; no los mezclamos con la referencia de 1 kg para evitar vender un formato distinto al seleccionado.',
    category: 'For Her', categories: ['For Her', 'Proteínas', 'Recuperación & Aminoácidos'], badge: 'For Her', format: '1 kg en polvo',
  }),
  makeProduct({
    id: 'collagen-for-her-20', tariffRef: 'BEVCOL', name: 'Collagen For Her 20 viales', price: 37,
    image: officialImage('Collagen For Her + Biotina, Vitamina C y Ácido hialurónico - Frutos del bosque - 20 Viales'), flavors: ['Frutos del bosque'],
    description: 'Colágeno con biotina, vitamina C, zinc y ácido hialurónico.', category: 'For Her', categories: ['For Her', 'Salud & Bienestar'], format: '20 viales',
  }),
  makeProduct({
    id: 'burner-extreme-90', tariffRef: 'BEVBE', name: 'Burner Extreme 90 caps', price: 37.15,
    image: officialImage('Burner Extreme - Quemador de grasa - 90 Caps - 22 Servicios'), flavors: ['Cápsulas'],
    description: 'Fórmula de control de peso con Sinetrol®, carnitina, extractos vegetales y cafeína.', category: 'Control de peso', categories: ['Control de peso', 'Pre-entreno & Energía'], format: '90 cápsulas · 22 servicios',
    officialUrl: 'https://beverly.es/products/burner-extreme-quemador-de-grasa-90-caps-22-servicios', note: 'Contiene estimulantes. Revisar contraindicaciones y advertencias del envase.',
  }),
  makeProduct({
    id: 'carni-xtreme-20', tariffRef: 'BEVCX4000', name: 'Carni Xtreme 20 viales', price: 31,
    image: officialImage('Carni Xtreme - Carnitina líquida Carnipure® - 20 viales - Frutos rojos'), flavors: ['Frutos rojos'],
    description: 'L-carnitina líquida Carnipure® en formato individual.', category: 'Control de peso', categories: ['Control de peso', 'Pre-entreno & Energía'], format: '20 viales',
  }),
  makeProduct({
    id: 'energy-go-gel-12', tariffRef: 'BEVEGA', name: 'Energy Go Gel · 12 sticks', price: 23.75,
    image: officialImage('Energy Go Gel energético - 12 Sticks Gel - 73,2 g - Apple'), flavors: ['Apple'],
    description: 'Gel energético en formato individual para actividad física.', category: 'Pre-entreno & Energía', categories: ['Pre-entreno & Energía'], format: '12 sticks', serving: '1 stick',
  }),
]

export const collagenPromo: Product = makeProduct({
  id: 'promo-colageno-2-cajas', tariffRef: 'BEVCOL', name: 'Pack Collagen For Her · 2 cajas', price: 65, regularPrice: 74,
  image: officialImage('Collagen For Her + Biotina, Vitamina C y Ácido hialurónico - Frutos del bosque - 20 Viales'), flavors: ['Frutos del bosque · 40 viales'],
  description: 'Dos cajas de Collagen For Her. El PVP conjunto de referencia es 74 €.', category: 'For Her', categories: ['For Her', 'Salud & Bienestar'],
  badge: 'Pack ahorro', format: '2 × 20 viales',
})

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
