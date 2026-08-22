type GHCNutritionLogoProps = {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  inverse?: boolean
}

export default function GHCNutritionLogo({
  size = 'md',
  showText = true,
  inverse = false,
}: GHCNutritionLogoProps) {
  const sizes = {
    sm: { mark: 34, title: 14, label: 10, gap: 9 },
    md: { mark: 46, title: 18, label: 12, gap: 12 },
    lg: { mark: 64, title: 27, label: 17, gap: 16 },
  }
  const current = sizes[size]
  const text = inverse ? '#F2F4F1' : '#050706'
  const secondary = inverse ? 'rgba(242,244,241,.68)' : 'rgba(5,7,6,.56)'

  return (
    <div className="inline-flex items-center" style={{ gap: current.gap }} aria-label="GHC Nutrition">
      <div
        className="relative grid shrink-0 place-items-center overflow-hidden"
        style={{
          width: current.mark,
          height: current.mark,
          borderRadius: Math.round(current.mark * 0.28),
          background: 'linear-gradient(145deg, rgba(255,255,255,0.16), rgba(34,214,91,0.12)), #080B0A',
          border: '1px solid rgba(255,255,255,0.20)',
          boxShadow: '0 0 34px rgba(34,214,91,0.14)',
        }}
      >
        <svg
          width={Math.round(current.mark * 0.72)}
          height={Math.round(current.mark * 0.72)}
          viewBox="0 0 100 100"
          fill="none"
          aria-hidden="true"
        >
          <path d="M50 5L88.97 27.5V72.5L50 95L11.03 72.5V27.5L50 5Z" stroke="url(#ghcOuterGradient)" strokeWidth="9" strokeLinejoin="round" />
          <path d="M50 24L73 37.5V62.5L50 76L27 62.5V37.5L50 24Z" stroke="rgba(242,244,241,0.82)" strokeWidth="8" strokeLinejoin="round" />
          <path d="M50 24L73 37.5V62.5L50 76" stroke="#22D65B" strokeWidth="8" strokeLinejoin="round" />
          <path d="M50 50H72" stroke="#22D65B" strokeWidth="9" strokeLinecap="round" />
          <path d="M50 50H63" stroke="rgba(242,244,241,0.72)" strokeWidth="5" strokeLinecap="round" />
          <defs>
            <linearGradient id="ghcOuterGradient" x1="18" y1="10" x2="84" y2="92" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F2F4F1" stopOpacity="0.96" />
              <stop offset="0.48" stopColor="#8A8F98" stopOpacity="0.70" />
              <stop offset="1" stopColor="#22D65B" stopOpacity="0.95" />
            </linearGradient>
          </defs>
        </svg>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_72%,rgba(34,214,91,0.22),transparent_42%)]" />
      </div>

      {showText && (
        <div className="grid leading-none" style={{ gap: size === 'lg' ? 5 : 3 }}>
          <div className="flex items-baseline" style={{ gap: size === 'lg' ? 12 : 8 }}>
            <span style={{ fontSize: current.title, fontWeight: 950, letterSpacing: '.17em', color: text }}>GHC</span>
            <span style={{ fontSize: current.label, fontWeight: 750, letterSpacing: '.24em', color: secondary }}>NUTRITION</span>
          </div>
          <span className="h-px w-full bg-[#22D65B]/80" />
        </div>
      )}
    </div>
  )
}
