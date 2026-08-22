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
      { label: 'Variantes', value: seed.flavors.join(' · ') },
      { label: 'Referencia GHC', value: seed.tariffRef || seed.id },
    ],
  }
}

export const products: Product[] = [
  makeProduct({
    id: 'whey-pro-concentrate-2kg', tariffRef: 'BEVWPCHC', name: 'Whey Pro Concentrate 2kg', price: 75,
    image: officialImage('Whey Pro Concentrate - 2 Kg - Choco Cookies'),
    flavors: ['Banana', 'Belgian Choco', 'Butter Biscuit', 'Choco Cookies', 'Natillas', 'Strawberry', 'Strawberry White Choco', 'Vainilla Ice Cream'],
    description: 'Proteína de suero concentrada Lacprodan® con enzimas digestivas.',
    longDescription: 'Concentrado de proteína de suero Lacprodan® SP8011 con DigeZyme® y Tolerase® L. Beverly publica el formato de 2 kg en ocho sabores.',
    category: 'Proteínas', categories: ['Proteínas', 'Recuperación & Aminoácidos'], badge: 'Producto estrella', format: '2 kg en polvo', serving: '35 g',
    ingredients: 'Base de concentrado de proteína de suero Lacprodan® SP8011, DigeZyme® y Tolerase® L. Aromas, colorantes y edulcorantes varían según el sabor; prevalece siempre la etiqueta de la unidad recibida.',
    technical: [
      { label: 'Servicio', value: '35 g' },
      { label: 'Proteína', value: '27,4 g por servicio (Banana)' },
      { label: 'Energía', value: '139,3 kcal por servicio (Banana)' },
      { label: 'DigeZyme®', value: '35 mg' },
      { label: 'Tolerase® L', value: '17,5 mg' },
      { label: 'Sabores publicados', value: '8' },
    ],
    use: 'Mezclar 35 g en agua, leche o bebida vegetal. Ajustar la toma a las necesidades diarias de proteína.',
    officialUrl: 'https://beverly.es/products/whey-pro-concentrate-2kg-choco-cookies',
  }),
  makeProduct({
    id: 'casein-professional-1kg', tariffRef: 'BEVCASC', name: 'Caseína Micelar 1kg', price: 45,
    image: officialImage('Caseína Micelar - 1 Kg - Butter Biscuit'),
    flavors: ['Butter Biscuit', 'Choco Cookies', 'Salted Caramel', 'Strawberry White Chocolate'],
    description: 'Caseína micelar de digestión sostenida con DigeZyme® y Tolerase® L.',
    longDescription: 'Caseína micelar aislada de liberación sostenida, con complejo enzimático DigeZyme® y lactasa Tolerase® L.',
    category: 'Proteínas', categories: ['Proteínas', 'Recuperación & Aminoácidos'], format: '1 kg en polvo', serving: '35 g',
    ingredients: 'Caseína micelar aislada, aroma y componentes de sabor, DigeZyme® y Tolerase® L. La composición secundaria puede variar entre sabores.',
    technical: [
      { label: 'Servicio', value: '35 g' },
      { label: 'Proteína', value: '27,3 g (Butter Biscuit)' },
      { label: 'Energía', value: '120 kcal (Butter Biscuit)' },
      { label: 'Hidratos', value: '2 g (Butter Biscuit)' },
      { label: 'DigeZyme®', value: '35 mg' },
      { label: 'Tolerase® L', value: '17,5 mg' },
    ],
    use: 'Mezclar 35 g en agua, leche o bebida vegetal. Puede encajar especialmente en periodos largos entre ingestas.',
    officialUrl: 'https://beverly.es/products/casein-professional-1-kg-butter-biscuit',
  }),
  makeProduct({
    id: 'vegan-protein-900g', tariffRef: 'BEVVGCHC', name: 'Vegan Protein 900g', price: 30,
    image: officialImage('Vegan Protein - 900 g - Choco Cookies'),
    flavors: ['Choco Cookies', 'Petit Beurre', 'Strawberry White Chocolate'],
    description: 'Proteína vegetal de guisante y arroz enriquecida con superalimentos.',
    longDescription: 'Mezcla proteica vegetal de guisante y arroz con quinoa, chlorella, chía, espirulina, moringa, psyllium y DigeZyme®.',
    category: 'Proteínas', categories: ['Proteínas', 'Salud & Bienestar'], format: '900 g en polvo', serving: '30 g',
    technical: [
      { label: 'Servicio nutricional', value: '30 g' },
      { label: 'Proteína', value: '23 g (Choco Cookies)' },
      { label: 'Energía', value: '108,8 kcal (Choco Cookies)' },
      { label: 'DigeZyme®', value: '30 mg' },
      { label: 'Base', value: 'Guisante + arroz' },
      { label: 'Superalimentos', value: 'Quinoa, chlorella, chía, espirulina, moringa y psyllium' },
    ],
    use: 'Seguir el modo de empleo del envase y ajustar la cantidad a la ingesta proteica diaria.',
    officialUrl: 'https://beverly.es/products/vegan-protein-900-g-choco-cookies',
  }),
  makeProduct({
    id: 'creatina-500g', tariffRef: 'BEVCR500', name: 'Creatina Monohidrato 500g', price: 43,
    image: officialImage('Creatina Monohidrato - 500 g - Unflavored'), flavors: ['Unflavored'],
    description: 'Creatina monohidrato sin sabor en formato grande.',
    longDescription: 'Fórmula directa de creatina monohidrato en polvo, sin sabor, pensada para una pauta diaria sencilla.',
    category: 'Creatina & Fuerza', categories: ['Creatina & Fuerza'], badge: '500 g', format: '500 g en polvo', serving: '3 g',
    ingredients: 'Creatina monohidrato.',
    technical: [
      { label: 'Servicio', value: '3 g' },
      { label: 'Creatina monohidrato', value: '3 g por servicio' },
      { label: 'Formato', value: '500 g' },
      { label: 'Sabor', value: 'Sin sabor' },
    ],
    use: 'Mezclar 3 g en unos 200 ml de agua y consumir diariamente con regularidad.',
    officialUrl: 'https://beverly.es/products/creatina-monohidrato-500-g-unflavored',
  }),
  makeProduct({
    id: 'bcaa-811-300g', tariffRef: 'BEV811T', name: 'BCAA 8:1:1 + L-Glutamina 300g', price: 32.82,
    image: officialImage('BCAA 8:1:1 + L-Glutamina - 300 g - Blue Lollipop'), flavors: ['Blue Lollipop'],
    description: 'BCAA 8:1:1 con L-glutamina y vitamina B6.',
    longDescription: 'Fórmula de aminoácidos ramificados en proporción 8:1:1, combinada con L-glutamina y vitamina B6.',
    category: 'Recuperación & Aminoácidos', categories: ['Recuperación & Aminoácidos'], format: '300 g en polvo',
    technical: [
      { label: 'Ratio BCAA', value: '8:1:1' },
      { label: 'Incluye', value: 'L-glutamina + vitamina B6' },
      { label: 'Formato', value: '300 g en polvo' },
      { label: 'Variante', value: 'Blue Lollipop' },
    ],
  }),
  makeProduct({
    id: 'map-300g', tariffRef: 'BEVMAP', name: 'M.A.P. Essential Amino Acids 300g', price: 38.5,
    image: officialImage('MAP - Aminoácidos esenciales - 300 g - Blue Lollipop'), flavors: ['Blue Lollipop', 'Watermelon'],
    description: 'Fórmula con los nueve aminoácidos esenciales.',
    longDescription: 'Mezcla en polvo que agrupa los nueve aminoácidos esenciales en un formato de fácil preparación.',
    category: 'Recuperación & Aminoácidos', categories: ['Recuperación & Aminoácidos'], format: '300 g en polvo',
    technical: [
      { label: 'Perfil', value: '9 aminoácidos esenciales' },
      { label: 'Formato', value: '300 g en polvo' },
      { label: 'Sabores', value: 'Blue Lollipop · Watermelon' },
    ],
  }),
  makeProduct({
    id: 'dynamite-pre-workout', tariffRef: 'BEVDYFP', name: 'Dynamite Pre-Workout 375g', price: 33.9,
    image: officialImage('Dynamite Pre Workout - 375 g - 25 Servings - Fruit Punch'), flavors: ['Fruit Punch', 'Blue Lollipop'],
    description: 'Pre-entreno con creatina, beta-alanina, citrulina y cafeína.',
    longDescription: 'Fórmula pre-entreno multicomponente con creatina, beta-alanina, citrulina y cafeína. Producto destinado a sesiones de alta demanda.',
    category: 'Pre-entreno & Energía', categories: ['Pre-entreno & Energía', 'Creatina & Fuerza'], format: '375 g en polvo', serving: '25 servicios',
    technical: [
      { label: 'Servicios', value: '25' },
      { label: 'Incluye', value: 'Creatina, beta-alanina, citrulina y cafeína' },
      { label: 'Formato', value: '375 g' },
      { label: 'Sabores', value: 'Fruit Punch · Blue Lollipop' },
    ],
    note: 'Contiene cafeína y otros estimulantes. Revisar las advertencias del envase antes de usarlo.',
  }),
  makeProduct({
    id: 'energy-pro-90', tariffRef: 'BEVEPRO', name: 'Energy Pro 90 caps', price: 15.97,
    image: officialImage('Energy Pro - Cafeína + Taurina - 90 Caps - 90 Servings'), flavors: ['Cápsulas'],
    description: 'Cafeína y taurina en cápsulas.',
    longDescription: 'Formato de cápsulas con cafeína y taurina para quienes prefieren una dosificación sin bebida pre-entreno.',
    category: 'Pre-entreno & Energía', categories: ['Pre-entreno & Energía'], format: '90 cápsulas · 90 servicios',
    technical: [
      { label: 'Formato', value: '90 cápsulas' },
      { label: 'Servicios', value: '90' },
      { label: 'Activos principales', value: 'Cafeína + taurina' },
    ],
    note: 'Contiene cafeína. Revisar advertencias y tolerancia individual.',
  }),
  makeProduct({
    id: 'vitamin-complex-90', tariffRef: 'BEVVC', name: 'Vitamin Complex 90 caps', price: 19.9,
    image: officialImage('Vitamin Complex multivitamínico y mineral - 90 Caps - 90 Servicios'), flavors: ['Cápsulas'],
    description: 'Complejo diario de vitaminas y minerales.',
    longDescription: 'Multivitamínico y mineral de una cápsula diaria con vitaminas A, C, D3, E, K1, grupo B y una selección amplia de minerales.',
    category: 'Vitaminas & Minerales', categories: ['Vitaminas & Minerales', 'Salud & Bienestar'], format: '90 cápsulas · 90 servicios', serving: '1 cápsula',
    technical: [
      { label: 'Servicio', value: '1 cápsula' },
      { label: 'Vitamina C', value: '80 mg' },
      { label: 'Vitamina D3', value: '5 µg' },
      { label: 'Vitamina E', value: '12 mg' },
      { label: 'Magnesio', value: '75 mg' },
      { label: 'Zinc', value: '10 mg' },
      { label: 'Calcio', value: '200 mg' },
      { label: 'Hierro', value: '14 mg' },
    ],
    use: 'Tomar 1 cápsula al día con una comida principal, respetando el etiquetado.',
  }),
  makeProduct({
    id: 'isolate-cfm-1kg', tariffRef: 'BEVICFMCHC1', name: 'Isolate CFM Professional 1kg', price: 52,
    image: officialImage('Isolate CFM Professional - 1 Kg - Choco Cookies'),
    flavors: ['Butter Biscuit', 'Choco Cookies', 'Choco Hazelnut', 'Strawberry', 'Banana', 'Vainilla Ice Cream'],
    description: 'Aislado de suero CFM Lacprodan®.',
    longDescription: 'Aislado de proteína de suero Lacprodan® obtenido mediante CFM, con apoyo enzimático DigeZyme® y Tolerase® L.',
    category: 'Proteínas', categories: ['Proteínas', 'Recuperación & Aminoácidos'], badge: 'Aislado', format: '1 kg en polvo', serving: '35 g',
    technical: [
      { label: 'Servicio', value: '35 g' },
      { label: 'Proteína', value: '30,8 g por servicio (referencia publicada)' },
      { label: 'Energía', value: '129,2 kcal por servicio' },
      { label: 'DigeZyme®', value: '35 mg' },
      { label: 'Tolerase® L', value: '17,5 mg' },
    ],
    use: 'Mezclar 35 g en agua, leche o bebida vegetal y ajustar la toma al objetivo diario de proteína.',
  }),
  makeProduct({
    id: 'isolate-cfm-2kg', tariffRef: 'BEVICFMCHC', name: 'Isolate CFM Professional 2kg', price: 94.9,
    image: officialImage('Isolate CFM Professional - 2 Kg - Butter Biscuit'),
    flavors: ['Butter Biscuit', 'Choco Cookies', 'Choco Hazelnut', 'Strawberry', 'Strawberry Cheesecake', 'Vainilla Ice Cream'],
    description: 'Formato grande del aislado CFM Professional.',
    longDescription: 'Formato de 2 kg del aislado CFM Professional Lacprodan®, pensado para uso recurrente.',
    category: 'Proteínas', categories: ['Proteínas', 'Recuperación & Aminoácidos'], badge: 'Formato ahorro', format: '2 kg en polvo', serving: '35 g',
    technical: [
      { label: 'Servicio', value: '35 g' },
      { label: 'Familia', value: 'Aislado CFM Lacprodan®' },
      { label: 'Enzimas', value: 'DigeZyme® + Tolerase® L' },
      { label: 'Formato', value: '2 kg' },
    ],
    use: 'Mezclar una toma conforme al etiquetado y ajustar la ingesta a las necesidades individuales.',
  }),
  makeProduct({
    id: 'hydro-protein-1kg', tariffRef: 'BEVDLCHC', name: 'Hydro Protein 1kg', price: 47,
    image: officialImage('Hydro Protein - 1 Kg - Banana'),
    flavors: ['Banana', 'Choco Cookies', 'Petit Beurre', 'Strawberry Cheesecake', 'Strawberry White Chocolate', 'Choco Orange', 'Yogurt Peach', 'Sweet Pineapple', 'Choco Raspberry', 'Choco Hazelnut', 'Lemon Cheesecake', 'Custard Ice Cream'],
    description: 'Proteína hidrolizada en formato 1 kg.',
    longDescription: 'Proteína de suero hidrolizada orientada a una digestión rápida, disponible en una gama amplia de sabores.',
    category: 'Proteínas', categories: ['Proteínas', 'Recuperación & Aminoácidos'], format: '1 kg en polvo',
  }),
  makeProduct({
    id: 'hydro-protein-2kg', tariffRef: 'BEVHCH', name: 'Hydro Protein Professional 2kg', price: 85,
    image: officialImage('Hydro Protein Professional - 2 Kg - Cookies and Cream'), flavors: ['Chocolate', 'Strawberry', 'Cookies and Cream'],
    description: 'Proteína hidrolizada profesional en formato 2 kg.',
    longDescription: 'Formato profesional de proteína de suero hidrolizada con enzimas digestivas para uso continuado.',
    category: 'Proteínas', categories: ['Proteínas', 'Recuperación & Aminoácidos'], format: '2 kg en polvo', serving: '35 g',
    technical: [
      { label: 'Servicio', value: '35 g' },
      { label: 'Proteína', value: '28,4 g (Cookies and Cream)' },
      { label: 'Energía', value: '135 kcal (Cookies and Cream)' },
      { label: 'DigeZyme®', value: '35 mg' },
      { label: 'Tolerase® L', value: '17,5 mg' },
    ],
  }),
  makeProduct({
    id: 'clear-isolate-500g', tariffRef: 'BEVCLCC', name: 'Clear Isolate Protein 500g', price: 31.9,
    image: officialImage('Clear Isolate Protein - 500 g - Orange Mango'), flavors: ['Orange Mango', 'Strawberry Kiwi', 'Caribbean Cooler'],
    description: 'Aislado de suero tipo clear, ligero y refrescante.',
    longDescription: 'Aislado de proteína de suero tipo clear con textura de bebida ligera y apoyo enzimático DigeZyme® y Tolerase® L.',
    category: 'Proteínas', categories: ['Proteínas', 'Recuperación & Aminoácidos'], badge: 'Clear', format: '500 g en polvo', serving: '30 g',
    technical: [
      { label: 'Servicio nutricional', value: '30 g' },
      { label: 'Proteína', value: '25,5 g por servicio' },
      { label: 'Energía', value: '105 kcal por servicio' },
      { label: 'Grasas', value: '0,05 g' },
      { label: 'DigeZyme®', value: '21 mg' },
      { label: 'Tolerase® L', value: '21 mg' },
    ],
  }),
  makeProduct({
    id: 'pure-whey-1kg', tariffRef: 'BEVPURE', name: 'Pure Whey 1kg', price: 49,
    image: officialImage('Pure Whey - 1 Kg'), flavors: ['Unflavored'],
    description: 'Whey Lacprodan® sin sabor añadido.',
    longDescription: 'Concentrado de suero Lacprodan® sin aromas, edulcorantes ni colorantes añadidos, con DigeZyme® y Tolerase® L.',
    category: 'Proteínas', categories: ['Proteínas'], format: '1 kg en polvo', serving: '35 g',
    ingredients: 'Concentrado de proteína de suero Lacprodan®, DigeZyme® y Tolerase® L.',
    technical: [
      { label: 'Servicio', value: '35 g' },
      { label: 'Proteína', value: '28 g' },
      { label: 'Energía', value: '138,9 kcal' },
      { label: 'DigeZyme®', value: '35 mg' },
      { label: 'Tolerase® L', value: '17,5 mg' },
    ],
    use: 'Mezclar 35 g en agua, leche o bebida vegetal.',
  }),
  makeProduct({
    id: 'whey-pro-concentrate-1kg', tariffRef: 'BEVWPCHC1', name: 'Whey Pro Concentrate 1kg', price: 41.65,
    image: officialImage('Whey Pro Concentrate - 1 Kg - Choco Cookies'),
    flavors: ['Butter Biscuit', 'Choco Cookies', 'Natillas', 'Strawberry Cheesecake', 'Strawberry', 'Vainilla Ice Cream'],
    description: 'Formato 1 kg del concentrado de suero Lacprodan®.',
    longDescription: 'La misma familia Whey Pro Concentrate Lacprodan® en formato de 1 kg, con DigeZyme® y Tolerase® L.',
    category: 'Proteínas', categories: ['Proteínas', 'Recuperación & Aminoácidos'], format: '1 kg en polvo', serving: '35 g',
    technical: [
      { label: 'Servicio', value: '35 g' },
      { label: 'Base', value: 'Lacprodan® SP8011' },
      { label: 'Enzimas', value: 'DigeZyme® + Tolerase® L' },
      { label: 'Formato', value: '1 kg' },
    ],
  }),
  makeProduct({
    id: 'creapure-300g', tariffRef: 'BVCRP300', name: 'Creatina Monohidrato Creapure® 300g', price: 32.95,
    image: officialImage('Creatina Monohidrato Creapure® - 300 g - Unflavored'), flavors: ['Unflavored', 'Cherry', 'Orange Mango'],
    description: 'Creatina monohidrato Creapure® en tres variantes publicadas por Beverly.',
    longDescription: 'Creatina monohidrato Creapure® en polvo, disponible sin sabor y en dos variantes saborizadas.',
    category: 'Creatina & Fuerza', categories: ['Creatina & Fuerza'], badge: 'Creapure®', format: '300 g en polvo', serving: '3 g',
    technical: [
      { label: 'Servicio', value: '3 g' },
      { label: 'Creapure®', value: '3 g por servicio (Unflavored)' },
      { label: 'Formato', value: '300 g' },
      { label: 'Variantes', value: 'Unflavored · Cherry · Orange Mango' },
    ],
    use: 'Mezclar 3 g en unos 200 ml de agua y consumir diariamente.',
  }),
  makeProduct({
    id: 'creapure-q10-300g', tariffRef: 'BVCRW', name: 'Creatina Creapure® + Q10 300g', price: 33.9,
    image: officialImage('Creatina Monohidrato Creapure® + Coenzima Q10 - 300 g - Sandía'), flavors: ['Sandía'],
    description: 'Creatina Creapure® combinada con coenzima Q10.',
    longDescription: 'Fórmula de creatina monohidrato Creapure® con coenzima Q10 en sabor sandía.',
    category: 'Creatina & Fuerza', categories: ['Creatina & Fuerza', 'For Her'], format: '300 g en polvo', serving: '3 g',
    technical: [
      { label: 'Servicio', value: '3 g' },
      { label: 'Creatina Creapure®', value: '2.900 mg' },
      { label: 'Coenzima Q10', value: '100 mg' },
      { label: 'Sabor', value: 'Sandía' },
    ],
    use: 'Mezclar 3 g en unos 200 ml de agua y seguir la pauta indicada en el etiquetado.',
  }),
  makeProduct({
    id: 'nac-90', tariffRef: 'BEVNAC', name: 'NAC + Vitamina C + Zinc', price: 15.5,
    image: officialImage('NAC + Vitamina C + Zinc - 60 Caps - 30 Servicios'), flavors: ['Cápsulas'],
    description: 'N-acetil L-cisteína combinada con vitamina C y zinc.',
    longDescription: 'Complejo de 60 cápsulas con NAC, vitamina C, zinc, artemisia y cardo mariano.',
    category: 'Salud & Bienestar', categories: ['Salud & Bienestar', 'Vitaminas & Minerales'], format: '60 cápsulas · 30 servicios', serving: '2 cápsulas',
    technical: [
      { label: 'Servicio', value: '2 cápsulas' },
      { label: 'NAC', value: '280 mg' },
      { label: 'Vitamina C', value: '200 mg' },
      { label: 'Zinc', value: '10 mg' },
      { label: 'Artemisia', value: '500 mg' },
      { label: 'Cardo mariano', value: '250 mg' },
    ],
    use: 'Tomar 2 cápsulas al día con una comida, respetando el etiquetado.',
  }),
  makeProduct({
    id: 'l-glutamina-kyowa-300g', tariffRef: 'BEVGMN', name: 'L-Glutamina Kyowa® 300g', price: 19.2,
    image: officialImage('L-Glutamina Kyowa® - 300 g - Unflavored'), flavors: ['Unflavored', 'Cherry', 'Blue Lollipop'],
    description: 'L-glutamina Kyowa® en polvo.',
    longDescription: 'L-glutamina Kyowa® en formato de 300 g, disponible sin sabor y en variantes saborizadas.',
    category: 'Recuperación & Aminoácidos', categories: ['Recuperación & Aminoácidos', 'Salud & Bienestar'], format: '300 g en polvo',
    technical: [
      { label: 'Materia prima', value: 'L-Glutamina Kyowa®' },
      { label: 'Formato', value: '300 g en polvo' },
      { label: 'Variantes', value: 'Unflavored · Cherry · Blue Lollipop' },
    ],
  }),
  makeProduct({
    id: 'magnesium-bisglycinate-b6', tariffRef: 'BEVMAG', name: 'Bisglicinato de Magnesio + B6 90 caps', price: 12.95,
    image: officialImage('Bisglicinato de Magnesio + Vitamin B6 - 90 Caps - 90 Servicios'), flavors: ['Cápsulas'],
    description: 'Bisglicinato de magnesio con vitamina B6.',
    longDescription: 'Complemento diario en cápsulas que combina bisglicinato de magnesio con vitamina B6.',
    category: 'Vitaminas & Minerales', categories: ['Vitaminas & Minerales', 'Salud & Bienestar'], format: '90 cápsulas · 90 servicios', serving: '1 cápsula',
    technical: [
      { label: 'Servicio', value: '1 cápsula' },
      { label: 'Bisglicinato de magnesio', value: '450 mg' },
      { label: 'Vitamina B6', value: '1,4 mg' },
      { label: 'Servicios', value: '90' },
    ],
    use: 'Tomar 1 cápsula al día conforme al etiquetado; el fabricante la sitúa habitualmente en la rutina nocturna.',
  }),
  makeProduct({
    id: 'vitamin-d3-k2', tariffRef: 'BEVVITDK', name: 'Vitamina D3 + K2 60 caps', price: 12.9,
    image: officialImage('Vitamina D3 + K2 - 60 Caps - 60 Servicios'), flavors: ['Cápsulas'],
    description: 'Combinación de vitamina D3 y vitamina K2.',
    longDescription: 'Una cápsula combina vitamina D3 con vitamina K2 en forma MK-7.',
    category: 'Vitaminas & Minerales', categories: ['Vitaminas & Minerales', 'Salud & Bienestar', 'For Her'], format: '60 cápsulas · 60 servicios', serving: '1 cápsula',
    technical: [
      { label: 'Servicio', value: '1 cápsula' },
      { label: 'Vitamina D3', value: '100 µg · 4.000 UI' },
      { label: 'Vitamina K2 MK-7', value: '100 µg' },
      { label: 'Servicios', value: '60' },
    ],
    use: 'Tomar 1 cápsula al día con una comida, según el etiquetado.',
    officialUrl: 'https://beverly.es/products/vitamin-d3-k2-60-caps',
  }),
  makeProduct({
    id: 'ashwagandha-ksm66', tariffRef: 'BEVASH', name: 'Ashwagandha KSM-66® 60 caps', price: 29.5,
    image: officialImage('Ashwagandha KSM-66 + Magnesio, L-Teanina & Rhodiola - 60 Caps - 60 Servicios'), flavors: ['Cápsulas'],
    description: 'KSM-66® con magnesio, L-teanina y rhodiola.',
    longDescription: 'Fórmula diaria de ashwagandha KSM-66® combinada con L-teanina, rhodiola, magnesio, vitamina B6 y vitamina D.',
    category: 'Salud & Bienestar', categories: ['Salud & Bienestar', 'For Her'], format: '60 cápsulas · 60 servicios', serving: '1 cápsula',
    technical: [
      { label: 'Ashwagandha KSM-66®', value: '300 mg' },
      { label: 'Withanólidos', value: '15 mg' },
      { label: 'L-teanina', value: '100 mg' },
      { label: 'Rhodiola', value: '100 mg' },
      { label: 'Magnesio', value: '30 mg' },
      { label: 'Vitamina B6', value: '2 mg' },
      { label: 'Vitamina D', value: '25 µg' },
    ],
    use: 'Tomar 1 cápsula al día conforme al etiquetado.',
    officialUrl: 'https://beverly.es/products/ashwagandha-ksm66-60-caps',
  }),
  makeProduct({
    id: 'b-complex-60', tariffRef: 'BEVBCOM', name: 'B-Complex 60 caps', price: 28,
    image: officialImage('B-Complex - 60 Caps - 60 Servicios'), flavors: ['Cápsulas'],
    description: 'Complejo de vitaminas del grupo B.',
    longDescription: 'Complejo B de una cápsula diaria con vitaminas del grupo B, colina, inositol y PABA.',
    category: 'Vitaminas & Minerales', categories: ['Vitaminas & Minerales', 'Salud & Bienestar'], format: '60 cápsulas · 60 servicios', serving: '1 cápsula',
    technical: [
      { label: 'Vitamina B1', value: '100 mg' },
      { label: 'Vitamina B2', value: '100 mg' },
      { label: 'Vitamina B3', value: '100 mg' },
      { label: 'Vitamina B5', value: '100 mg' },
      { label: 'Vitamina B6', value: '10 mg' },
      { label: 'Vitamina B12', value: '100 µg' },
      { label: 'Ácido fólico', value: '400 µg' },
      { label: 'Biotina', value: '100 µg' },
    ],
    use: 'Tomar 1 cápsula al día conforme al etiquetado.',
    officialUrl: 'https://beverly.es/products/b-complex-60-caps',
  }),
  makeProduct({
    id: 'women-protein-1kg', tariffRef: 'BEVWPSCH', name: 'Women Protein Shake 1kg', price: 49,
    image: officialImage('Women Protein Shake - 1 Kg - Capuccino'),
    flavors: ['Capuccino', 'Chocolate', 'Petit Beurre', 'Strawberry White Chocolate'],
    description: 'Protein shake con colágeno marino Peptan®, magnesio y vitamina E.',
    longDescription: 'Proteína en polvo con colágeno marino Peptan®, magnesio, vitamina E, DigeZyme® y Tolerase® L. Beverly publica cuatro sabores.',
    category: 'For Her', categories: ['For Her', 'Proteínas', 'Recuperación & Aminoácidos'], badge: 'For Her', format: '1 kg en polvo', serving: '30 g',
    technical: [
      { label: 'Servicio nutricional', value: '30 g' },
      { label: 'Proteína', value: '26,8 g (Capuccino)' },
      { label: 'Colágeno Peptan®', value: '5 g' },
      { label: 'Magnesio', value: '160 mg' },
      { label: 'Vitamina E', value: '7,5 mg' },
      { label: 'DigeZyme®', value: '30 mg' },
      { label: 'Tolerase® L', value: '15 mg' },
    ],
    use: 'Seguir la dosis del envase y ajustar la toma a la estrategia nutricional diaria.',
    officialUrl: 'https://beverly.es/products/women-protein-shake-1-kg-capuccino',
  }),
  makeProduct({
    id: 'collagen-for-her-20', tariffRef: 'BEVCOL', name: 'Collagen For Her 20 viales', price: 37,
    image: officialImage('Collagen For Her + Biotina, Vitamina C y Ácido hialurónico - Frutos del bosque - 20 Viales'), flavors: ['Frutos del bosque'],
    description: 'Colágeno con biotina, vitamina C, zinc y ácido hialurónico.',
    longDescription: 'Formato líquido individual con colágeno marino Peptan®, vitamina C, zinc, biotina y ácido hialurónico.',
    category: 'For Her', categories: ['For Her', 'Salud & Bienestar'], format: '20 viales', serving: '1 vial',
    technical: [
      { label: 'Colágeno Peptan®', value: '5.000 mg por vial' },
      { label: 'Vitamina C', value: '102,5 mg' },
      { label: 'Ácido hialurónico', value: '17,5 mg' },
      { label: 'Zinc', value: '10,5 mg' },
      { label: 'Biotina', value: '55 µg' },
    ],
    use: 'Agitar el vial y tomar 1 al día conforme al etiquetado.',
  }),
  makeProduct({
    id: 'burner-extreme-90', tariffRef: 'BEVBE', name: 'Burner Extreme 90 caps', price: 37.15,
    image: officialImage('Burner Extreme - Quemador de grasa - 90 Caps - 22 Servicios'), flavors: ['Cápsulas'],
    description: 'Fórmula de control de peso con Sinetrol®, carnitina, extractos vegetales y cafeína.',
    longDescription: 'Fórmula estimulante de control de peso con Sinetrol® XPUR, acetil-L-carnitina, extractos vegetales, cafeína y cromo.',
    category: 'Control de peso', categories: ['Control de peso', 'Pre-entreno & Energía'], format: '90 cápsulas · 22 servicios', serving: '4 cápsulas',
    technical: [
      { label: 'Sinetrol® XPUR', value: '500 mg' },
      { label: 'Acetil-L-carnitina', value: '500 mg' },
      { label: 'Cafeína anhidra', value: '175 mg' },
      { label: 'Té verde', value: '200 mg' },
      { label: 'Coleus', value: '200 mg' },
      { label: 'Sinefrina', value: '30 mg' },
      { label: 'Cromo', value: '45 µg' },
    ],
    use: 'Seguir estrictamente la pauta del fabricante y las advertencias del envase.',
    officialUrl: 'https://beverly.es/products/burner-extreme-quemador-de-grasa-90-caps-22-servicios',
    note: 'Contiene varios estimulantes. No es un sustituto de una dieta adecuada ni de la actividad física. Revisar contraindicaciones y advertencias.',
  }),
  makeProduct({
    id: 'carni-xtreme-20', tariffRef: 'BEVCX4000', name: 'Carni Xtreme 20 viales', price: 31,
    image: officialImage('Carni Xtreme - Carnitina líquida Carnipure® - 20 viales - Frutos rojos'), flavors: ['Frutos rojos'],
    description: 'L-carnitina líquida Carnipure® en formato individual.',
    longDescription: 'L-carnitina líquida Carnipure® en viales monodosis para una utilización cómoda.',
    category: 'Control de peso', categories: ['Control de peso', 'Pre-entreno & Energía'], format: '20 viales',
    technical: [
      { label: 'Materia prima', value: 'Carnipure®' },
      { label: 'Formato', value: '20 viales' },
      { label: 'Sabor', value: 'Frutos rojos' },
    ],
  }),
  makeProduct({
    id: 'energy-go-gel-12', tariffRef: 'BEVEGA', name: 'Energy Go Gel · 12 sticks', price: 23.75,
    image: officialImage('Energy Go Gel energético - 12 Sticks Gel - 73,2 g - Apple'), flavors: ['Apple'],
    description: 'Gel energético en formato individual para actividad física.',
    longDescription: 'Gel energético de carbohidratos con cafeína, taurina, inosina, beta-alanina, L-arginina y micronutrientes.',
    category: 'Pre-entreno & Energía', categories: ['Pre-entreno & Energía'], format: '12 sticks', serving: '1 stick · 73,2 g',
    technical: [
      { label: 'Energía', value: '129 kcal por stick' },
      { label: 'Hidratos', value: '32 g' },
      { label: 'Azúcares', value: '20 g' },
      { label: 'Cafeína', value: '130 mg' },
      { label: 'Taurina', value: '500 mg' },
      { label: 'Inosina', value: '300 mg' },
      { label: 'Magnesio', value: '70 mg' },
      { label: 'Sodio', value: '150 mg' },
    ],
    use: 'Tomar conforme al etiquetado antes o durante la actividad física.',
    note: 'Contiene cafeína. No superar la cantidad diaria indicada en el envase.',
  }),
]

export const collagenPromo: Product = makeProduct({
  id: 'promo-colageno-2-cajas', tariffRef: 'BEVCOL', name: 'Pack Collagen For Her · 2 cajas', price: 65, regularPrice: 74,
  image: officialImage('Collagen For Her + Biotina, Vitamina C y Ácido hialurónico - Frutos del bosque - 20 Viales'), flavors: ['Frutos del bosque · 40 viales'],
  description: 'Dos cajas de Collagen For Her. El PVP conjunto de referencia es 74 €.',
  longDescription: 'Pack de dos cajas: 40 viales en total, con la misma fórmula de Collagen For Her y un precio conjunto especial.',
  category: 'For Her', categories: ['For Her', 'Salud & Bienestar'], badge: 'Pack ahorro', format: '2 × 20 viales', serving: '1 vial',
  technical: [
    { label: 'Unidades', value: '40 viales' },
    { label: 'Colágeno Peptan®', value: '5.000 mg por vial' },
    { label: 'Vitamina C', value: '102,5 mg por vial' },
    { label: 'Ácido hialurónico', value: '17,5 mg por vial' },
    { label: 'Zinc', value: '10,5 mg por vial' },
    { label: 'Biotina', value: '55 µg por vial' },
  ],
  use: 'Agitar y tomar 1 vial al día conforme al etiquetado.',
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
