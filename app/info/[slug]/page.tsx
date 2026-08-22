import Link from 'next/link'
import { notFound } from 'next/navigation'
import GHCNutritionLogo from '@/app/components/GHCNutritionLogo'

const pages = {
  faq: {
    title: 'Preguntas frecuentes',
    intro: 'Las respuestas básicas para comprar en GHC Nutrition sin incertidumbre.',
    sections: [
      ['¿Dónde entregáis?', 'En la fase inicial atendemos pedidos con código postal de la Comunidad de Madrid (28xxx). Antes de ampliar la zona revisaremos costes y operativa.'],
      ['¿Cuánto cuesta el envío?', '10 € para pedidos inferiores a 70 €. El envío es gratuito desde 70 €.'],
      ['¿Cómo se paga?', 'El pago se completa mediante el checkout seguro alojado por SumUp. GHC Nutrition no almacena los datos de tu tarjeta.'],
      ['¿Puedo comprar varios productos a la vez?', 'Sí. El carrito permite acumular productos, variantes y cantidades y realizar un único pago.'],
      ['¿Cómo funciona Recomienda GHC?', 'Tras una compra pagada obtienes un código personal. Cuando un amigo realiza una compra pagada usando tu código, se genera un cupón del 10% para tu siguiente pedido.'],
      ['¿La información de producto puede cambiar?', 'Sí. Las fórmulas, sabores y etiquetados pueden actualizarse. La unidad física y su etiqueta prevalecen siempre sobre la ficha mostrada en la web.'],
    ],
  },
  envios: {
    title: 'Envíos',
    intro: 'Una política inicial sencilla para mantener controlada la operación.',
    sections: [
      ['Zona actual', 'Comunidad de Madrid, validada mediante códigos postales 28xxx. La cobertura se podrá restringir por municipios antes del lanzamiento definitivo si la logística lo requiere.'],
      ['Tarifa', '10 € para pedidos inferiores a 70 €. Envío gratuito a partir de 70 €.'],
      ['Plazos', 'Los plazos concretos se confirmarán antes de producción en función del operador logístico y la zona de entrega. No mostramos una promesa de plazo que todavía no podamos garantizar.'],
      ['Dirección', 'El cliente debe facilitar nombre, apellidos, email, teléfono, dirección, municipio y código postal correctos antes de iniciar el pago.'],
    ],
  },
  devoluciones: {
    title: 'Devoluciones',
    intro: 'La política definitiva se cerrará antes de abrir la tienda al público.',
    sections: [
      ['Productos sin abrir', 'La versión final de la política especificará plazos, canal de solicitud y condiciones de devolución conforme a la normativa aplicable.'],
      ['Productos abiertos o manipulados', 'Por razones de higiene y seguridad alimentaria, determinadas excepciones al derecho de desistimiento pueden resultar aplicables cuando un producto precintado haya sido abierto. La redacción legal final se validará antes del lanzamiento.'],
      ['Producto dañado o incorrecto', 'Si un pedido llega dañado o no corresponde con lo comprado, se habilitará un canal de incidencia para revisarlo y resolverlo.'],
    ],
  },
  terminos: {
    title: 'Términos y condiciones',
    intro: 'Borrador estructural del checkout. La identificación legal completa del titular y las condiciones definitivas se incorporarán antes de producción.',
    sections: [
      ['Objeto', 'Estas condiciones regularán la compra de productos ofrecidos a través de GHC Nutrition.'],
      ['Precios', 'Los precios mostrados en la tienda se expresan en euros. Antes del lanzamiento se verificará el tratamiento fiscal, gastos y cualquier información obligatoria asociada a cada venta.'],
      ['Pago', 'El pago se procesa mediante SumUp. El pedido solo se considera pagado cuando el proveedor de pagos confirma el estado PAID.'],
      ['Disponibilidad', 'La incorporación de una referencia al catálogo no garantiza stock permanente. Antes de producción se añadirá la gestión de disponibilidad necesaria.'],
      ['Información legal pendiente', 'Esta página no sustituye todavía las condiciones comerciales definitivas. El titular, datos fiscales, contacto legal, desistimiento, garantías y jurisdicción se completarán antes de publicar la tienda.'],
    ],
  },
  privacidad: {
    title: 'Privacidad',
    intro: 'GHC Nutrition está diseñado para pedir únicamente los datos necesarios para gestionar la compra y la entrega.',
    sections: [
      ['Datos de pedido', 'Nombre, apellidos, email, teléfono, dirección, municipio y código postal. La tienda no necesita almacenar datos de tarjeta.'],
      ['Finalidad', 'Los datos de compra se utilizarán para gestionar el pedido, el pago, la entrega, incidencias y el programa de recomendación cuando corresponda.'],
      ['Infraestructura', 'Los pedidos se almacenarán en una base de datos dedicada a GHC Nutrition y separada de otras líneas GHC. La conexión se realizará desde backend, no exponiendo claves administrativas al navegador.'],
      ['Información legal pendiente', 'Antes de producción se incorporarán responsable del tratamiento, base jurídica, plazos de conservación, derechos, destinatarios y canal formal de ejercicio conforme a la normativa aplicable.'],
    ],
  },
  cookies: {
    title: 'Cookies',
    intro: 'La versión definitiva se ajustará a las tecnologías que permanezcan activas en producción.',
    sections: [
      ['Necesarias', 'La tienda puede utilizar almacenamiento local o de sesión para conservar el carrito y el código de recomendación durante la navegación.'],
      ['Analítica', 'La configuración definitiva de analítica y consentimiento se revisará antes del lanzamiento público.'],
      ['Preferencias', 'No añadiremos categorías de cookies o rastreadores que no estén realmente presentes en la versión publicada.'],
    ],
  },
  contacto: {
    title: 'Contacto',
    intro: 'El canal comercial definitivo se publicará antes de abrir pedidos reales.',
    sections: [
      ['Atención al cliente', 'Esta página está preparada para incorporar email, teléfono o WhatsApp comercial sin mezclar datos personales con la interfaz pública.'],
      ['Incidencias de pedido', 'El sistema conservará la referencia de pedido para facilitar cualquier consulta posterior.'],
    ],
  },
} as const

type InfoSlug = keyof typeof pages

export function generateStaticParams() {
  return Object.keys(pages).map((slug) => ({ slug }))
}

export default async function InfoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (!(slug in pages)) notFound()

  const page = pages[slug as InfoSlug]

  return (
    <main className="min-h-screen bg-[#F2F4F1] text-[#050706]">
      <header className="border-b border-black/[0.07] bg-white/70 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-5xl items-center justify-between px-5">
          <Link href="/"><GHCNutritionLogo size="md" /></Link>
          <Link href="/" className="rounded-full border border-black/10 bg-white px-5 py-2.5 text-sm font-black transition hover:border-[#22D65B]">Volver a la tienda</Link>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-5 py-16 md:py-24">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#159943]">GHC Nutrition · Información</p>
        <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-[-0.055em] md:text-6xl">{page.title}</h1>
        <p className="mt-6 max-w-3xl text-base leading-7 text-black/55 md:text-lg">{page.intro}</p>

        <div className="mt-12 grid gap-4">
          {page.sections.map(([title, text]) => (
            <article key={title} className="rounded-[26px] border border-black/[0.07] bg-white p-6 md:p-8">
              <h2 className="text-xl font-black tracking-[-0.025em]">{title}</h2>
              <p className="mt-3 max-w-4xl text-sm leading-7 text-black/58">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="bg-[#050706] text-white">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-5 py-8 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <GHCNutritionLogo size="sm" inverse />
          <p>Versión de preparación · La información legal definitiva se cerrará antes del lanzamiento.</p>
        </div>
      </footer>
    </main>
  )
}
