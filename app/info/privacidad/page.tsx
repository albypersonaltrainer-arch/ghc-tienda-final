import Link from 'next/link'
import GHCNutritionLogo from '@/app/components/GHCNutritionLogo'

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#F2F4F1] text-[#050706]">
      <header className="border-b border-black/[0.07] bg-white/75 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-5xl items-center justify-between px-5">
          <Link href="/"><GHCNutritionLogo size="md" /></Link>
          <Link href="/" className="rounded-full border border-black/10 bg-white px-5 py-2.5 text-sm font-black transition hover:border-[#22D65B]">Volver a la tienda</Link>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-5 py-16 md:py-24">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#159943]">GHC Nutrition · Privacidad</p>
        <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-[-0.055em] md:text-6xl">Datos mínimos. Acceso restringido.</h1>
        <p className="mt-6 max-w-3xl text-base leading-7 text-black/55 md:text-lg">La tienda solicita únicamente la información necesaria para preparar, cobrar, entregar y atender un pedido.</p>

        <div className="mt-12 grid gap-4">
          {[
            ['Datos de pedido', 'Nombre, apellidos, email, teléfono, dirección, municipio, provincia y código postal. GHC Nutrition no necesita almacenar los datos de la tarjeta.'],
            ['Finalidad', 'Los datos comerciales se utilizan para gestionar el pedido, el pago, la entrega, las incidencias y, cuando corresponda, el programa de recomendación.'],
            ['Arquitectura', 'Los datos de GHC Nutrition se guardan en tablas comerciales identificadas para esta línea de negocio. El acceso anónimo y de usuarios autenticados está revocado y las operaciones de comercio se realizan exclusivamente desde backend.'],
            ['Seguridad', 'Las tablas de clientes, pedidos, líneas de pedido, cupones, referidos y comisiones tienen Row Level Security activado y permisos restringidos a la capa de servicio.'],
            ['Pago', 'El diseño del checkout deriva el cobro al proveedor de pago. Los datos sensibles de tarjeta no forman parte de la base de datos comercial de GHC Nutrition.'],
            ['Derechos y conservación', 'Los datos se conservarán durante los plazos necesarios para la relación comercial y las obligaciones aplicables. Las solicitudes relativas a datos personales se atenderán por el canal de contacto comercial publicado por GHC Nutrition.'],
          ].map(([title, text]) => (
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
          <p>Privacidad y arquitectura comercial · GHC Nutrition</p>
        </div>
      </footer>
    </main>
  )
}
