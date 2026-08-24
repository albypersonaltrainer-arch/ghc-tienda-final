const sites = [
  {
    label: 'GHC Training',
    href: 'https://www.ghctraining.com?utm_source=ghcnutrition&utm_medium=ecosystem&utm_campaign=ghc_ecosystem',
    current: false,
    role: 'Entrenamiento personal',
  },
  {
    label: 'GHC Academy',
    href: 'https://ghcacademy.net?utm_source=ghcnutrition&utm_medium=ecosystem&utm_campaign=ghc_ecosystem',
    current: false,
    role: 'Formación profesional',
  },
  { label: 'GHC Nutrition', href: 'https://www.ghcnutrition.com', current: true, role: 'Nutrición y suplementación' },
] as const

export default function GHCEcosystemLinks() {
  return (
    <nav aria-label="Ecosistema GHC" className="border-t border-white/10 bg-[#080B0A] text-[#F2F4F1]">
      <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-center gap-x-6 gap-y-3 px-5 py-6 lg:px-9">
        <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#22D65B]">Ecosistema GHC</span>
        {sites.map((site) => (
          <a
            key={site.label}
            href={site.href}
            aria-current={site.current ? 'page' : undefined}
            aria-label={`${site.label} · ${site.role}`}
            title={site.role}
            data-ghc-ecosystem-link={site.label}
            data-ghc-source="ghcnutrition"
            className={`border-b pb-1 text-xs font-bold transition hover:text-white ${site.current ? 'border-[#22D65B] text-white' : 'border-transparent text-white/60'}`}
          >
            {site.label}
          </a>
        ))}
      </div>
    </nav>
  )
}
