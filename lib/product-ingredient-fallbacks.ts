export type IngredientFallback = {
  ingredients: string
  sourceName: string
  sourceUrl: string
  warnings?: string[]
  traces?: string
  flavors?: string[]
}

// Beverly's current Shopify product pages publish composition and directions for these references
// but omit the complete ingredient declaration. These fallbacks are limited to exact, current
// product references corroborated by specialist retailers or current industry listings. They are
// deliberately not used where the flavor/formula cannot be matched with sufficient confidence.
export const INGREDIENT_FALLBACKS: Record<string, IngredientFallback> = {
  'dynamite pre workout 375g': {
    ingredients: 'Arginina AKG, creatina monohidrato (Creapure®), beta-alanina (CarnoSyn®), L-citrulina malato, acidulante: ácido cítrico, L-tirosina, aroma, VitaCholine™: bitartrato de colina, NewCaff™ 75 microcápsulas (cafeína microencapsulada, emulgente: mono y diglicéridos de ácidos grasos), L-taurina, Astragin® (extracto de Panax notoginseng y Astragalus membranaceus) (1,5% saponinas), antiaglomerante: dióxido de silicio, BioPerine® [extracto seco de pimienta negra (Piper nigrum, fruto), 95% piperina], vitamina B6 (clorhidrato de piridoxina), niacina (niacinamida), edulcorante (sucralosa).',
    sourceName: 'Herbodietética El Puerto · ficha Fruit Punch de Beverly Dynamite',
    sourceUrl: 'https://herbodieteticaelpuerto.es/producto/dynamite-potente-pre-entreno-con-beta-alanina-375gr-25-servicios-sabor-fruit-punch/',
    flavors: ['fruit punch'],
  },
  'energy pro 90 caps': {
    ingredients: 'L-taurina, cafeína anhidra, agente de carga (celulosa microcristalina), agente antiaglomerante (estearato de magnesio), cápsula (hidroxipropilmetilcelulosa HPMC).',
    sourceName: 'PonteMASfuerte · Energy Pro 90 caps Beverly Nutrition',
    sourceUrl: 'https://www.pontemasfuerte.com/beverly-nutrition/energy-pro-xt',
  },
  'vitamin complex 90 caps': {
    ingredients: 'Agente de carga (celulosa microcristalina); carbonato de calcio (calcio); ácido ascórbico (vitamina C); óxido de magnesio (magnesio); agente de recubrimiento (polvo de recubrimiento HPMC marrón); nicotinamida (vitamina B3); fumarato ferroso (hierro); vitamina E; agentes antiaglomerantes (estearato de magnesio, dióxido de silicio coloidal); óxido de zinc; espesante (hidroxipropilmetilcelulosa); pantotenato de calcio (vitamina B5); estabilizador (croscarmelosa sódica); sulfato de manganeso monohidratado (manganeso); clorhidrato de piridoxina (vitamina B6); riboflavina; clorhidrato de tiamina (vitamina B1); vitamina A; sulfato de cobre pentahidratado (cobre); ácido fólico; tetraborato de sodio decahidratado (boro); yoduro de potasio (yodo); selenito de sodio (selenio); D-biotina (biotina); fitomenadiona (vitamina K1); molibdato de sodio dihidratado (molibdeno); picolinato de cromo (cromo); vitamina D3 vegana; cianocobalamina (vitamina B12).',
    sourceName: 'PonteMASfuerte · Vitamin Complex Beverly Nutrition',
    sourceUrl: 'https://www.pontemasfuerte.com/beverly-nutrition/vitam-complex',
  },
  'bisglicinato de magnesio b6 90 caps': {
    ingredients: 'Bisglicinato de magnesio, clorhidrato de piridoxina (vitamina B6), antiaglomerantes (estearato de magnesio vegetal, dióxido de silicio; maltodextrina de maíz), cápsula vegetal transparente [agente de recubrimiento (hidroxipropilmetilcelulosa)].',
    sourceName: 'PonteMASfuerte · Magnesium Bisglycinate Beverly Nutrition',
    sourceUrl: 'https://www.pontemasfuerte.com/beverly-nutrition/magnesium-bisglycinate-90',
  },
  'vitamina d3 k2 60 caps': {
    ingredients: 'Agente de carga (celulosa microcristalina), colecalciferol (vitamina D3), antiaglomerante (sales magnésicas de ácidos grasos) y menaquinona-7 (vitamina K2).',
    sourceName: 'PonteMASfuerte · Vitamin D3+K2 Beverly Nutrition',
    sourceUrl: 'https://www.pontemasfuerte.com/beverly-for-her/vitamin-d3-k2-60',
    traces: 'Puede contener trazas de leche, soja, pescado, huevos, crustáceos, frutos de cáscara y gluten.',
  },
  'ashwagandha ksm 66 60 caps': {
    ingredients: 'Extracto seco de ashwagandha KSM-66® (Withania somnifera, raíz) (5% withanólidos), bisglicinato de magnesio, extracto seco de té verde (Camellia sinensis L., hoja) (98% teanina, 1% EGCG), extracto seco de rhodiola (Rhodiola rosea L., raíz) (3% salidrósidos), agente de carga (celulosa microcristalina), antiaglomerante (sales magnésicas de ácidos grasos), clorhidrato de piridoxina (vitamina B6) y colecalciferol (vitamina D). Cápsula vegetal: agente de recubrimiento (hidroxipropilmetilcelulosa).',
    sourceName: 'PonteMASfuerte · Ashwagandha KSM-66 Beverly Nutrition',
    sourceUrl: 'https://www.pontemasfuerte.com/beverly-nutrition/ashwagandha-60-tabls',
    warnings: [
      'No debe consumirse una cantidad de 800 mg o superior de EGCG al día.',
      'No debe consumirse si ya se consumen en el mismo día otros productos que contengan té verde.',
      'No debe ser consumido por mujeres embarazadas o en periodo de lactancia ni por menores de 18 años.',
      'No debe tomarse con el estómago vacío.',
    ],
  },
  'b complex 60 caps': {
    ingredients: 'Agente de carga (celulosa microcristalina), vitamina B1 (mononitrato de tiamina), vitamina B5 (pantotenato de calcio), vitamina B2 (riboflavina), vitamina B3 (nicotinamida), bitartrato de L-colina, inositol, agente de recubrimiento (polvo de recubrimiento HPMC marrón: hipromelosa (E464), glicerol (E422), óxido de hierro (E172)), ácido p-aminobenzoico (PABA), espesante (hidroxipropilmetilcelulosa), vitamina B6 (clorhidrato de piridoxina), vitamina B12 (cianocobalamina), biotina, agente antiaglomerante (dióxido de silicio coloidal, estearato de magnesio), ácido fólico.',
    sourceName: 'Gym Factory · lanzamiento B-Complex 100 Beverly Nutrition',
    sourceUrl: 'https://gymfactory.net/2025/02/21/beverly-nutrition-lanza-b-complex-100-un-nuevo-producto-con-grandes-beneficios-para-el-entrenamiento/',
  },
  'burner extreme 90 caps': {
    ingredients: 'Sinetrol® XPUR (32% flavonoides, 2,3% cafeína) [extracto de pomelo (Citrus grandis Osbeck y Citrus paradisi Macfad), hesperidina cítrica (Citrus sinensis Osbeck), extracto de guaraná (Paullinia cupana Kunth) y naranja dulce (Citrus sinensis Osbeck)], acetil L-carnitina, agentes de carga (fosfato cálcico y celulosa microcristalina), extracto seco de coleus (10% forskolina), cafeína anhidra, extracto seco de jengibre (Zingiber officinale Roscoe, 5% gingeroles), extracto seco de naranja amarga (Citrus aurantium, 30% sinefrina), antiaglomerantes (sales magnésicas de ácidos grasos), extracto seco de pimienta negra (Piper nigrum, 95% piperina), picolinato de cromo y cápsula vegetal (hidroxipropilmetilcelulosa y carbonato de calcio).',
    sourceName: 'Boteprote · Burner Extreme Beverly Nutrition, fórmula actual 22 servicios',
    sourceUrl: 'https://www.boteprote.com/burner-extreme-tank-90-caps-beverly-nutrition.html',
    traces: 'Puede contener trazas de gluten, leche, soja, huevos, crustáceos y frutos de cáscara.',
  },
}

export const VARIANT_INGREDIENT_FALLBACKS: Record<string, IngredientFallback> = {
  'dynamite pre workout 375g::blue lollipop': {
    ingredients: 'Arginina AKG, creatina monohidrato (Creapure®), beta-alanina (CarnoSyn®), L-citrulina malato, aroma (maltodextrina, acidulantes: ácido cítrico y ácido málico, edulcorante: sucralosa, colorante: E-133), L-tirosina, VitaCholine™: bitartrato de colina, antiaglomerante: dióxido de silicio, NewCaff™ 75 microcápsulas (cafeína microencapsulada, emulgente: mono y diglicéridos de ácidos grasos), L-taurina, Astragin® (extracto de Panax notoginseng y Astragalus membranaceus) (1,5% saponinas), acidulante: ácido cítrico, niacina (niacinamida), vitamina B6 (clorhidrato de piridoxina), BioPerine® [extracto seco de pimienta negra (Piper nigrum, fruto), 95% piperina].',
    sourceName: 'PonteMASfuerte · Dynamite Beverly Nutrition, ficha Blue Lollipop',
    sourceUrl: 'https://www.pontemasfuerte.com/beverly-nutrition/dynamite',
  },
}
