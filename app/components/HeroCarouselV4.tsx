'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { ArrowDownRight, ChevronLeft, ChevronRight } from 'lucide-react'

const slides = [
  {
    eyebrow: 'RESISTENCIA · ENERGÍA · CONSTANCIA',
    title: 'Rendimiento que sale del gimnasio.',
    accent: 'También cuando toca sumar kilómetros.',
    text: 'Correr, entrenar y recuperar forman parte del mismo sistema. La suplementación tiene que acompañarlo sin complicarlo.',
    image: 'https://images.openai.com/static-rsc-4/CIj2U5QHeTttZZjFZUxrJT6bq4IyzeIJuKrtTbfni8zbsZxZjLmmcQTKgShlPDdYhIDgm6fSbNwFgcHG-QpIoYuTXc7vPJ0V_TsgOPE3RuwTNl0Rpaa0H6D5KawGO5l_DXMSghMEhELN0T-eAeEE9LEqno3GFnpYFBF3uKQjcEdVt1mXsortpgiTtQcr3SPH?purpose=fullsize',
    position: '57% 48%',
  },
  {
    eyebrow: 'INTENSIDAD · POTENCIA · RENDIMIENTO',
    title: 'Cuando el entrenamiento aprieta.',
    accent: 'La elección tiene que estar a la altura.',
    text: 'Fuerza, potencia y capacidad de trabajo exigen contexto. Aquí cada referencia tiene una razón concreta para estar.',
    image: 'https://images.openai.com/static-rsc-4/SfqIyTC1p_XURFZmhcTjwm_tBgRa02vriPB1995RiLqHDRvPlIyLU8VdXC75QPleHq6ath3f5YkU5_X2HFXL7dVtlAu4qC3n0Ql_jOkSGQRgwYLaEBsjwdI6Mk0a35oQWcezZ696UoqS1yfEN7M46Nx-4d27KQvtxNtVlmZdSffn34i-1VnMDWgHIkI3sOn4?purpose=fullsize',
    position: '50% 48%',
  },
  {
    eyebrow: 'RECUPERACIÓN · MOVILIDAD · CONTINUIDAD',
    title: 'Recuperar también es entrenar.',
    accent: 'El progreso no termina en la última serie.',
    text: 'La recuperación forma parte del rendimiento. Elegimos herramientas que encajen en una estrategia completa, no productos aislados.',
    image: 'https://images.openai.com/static-rsc-4/JeStftgMnxAcXA4uXgHLu7R5liTqf0BSzrIBdYkLmiVjBIOrFaT2Sro1ti8RI0PvJKbjA8L96qKuWkcdlHPyQx6JCV2Xpcf9O_-_xuSttwI2Occ990ciOzJRmyOZxJ3jZHAs9kHMGf953AmcTsdWyJLCL1gll_R17nEMYDEWU3zJea89JUdTgeDZzS-aHH8x?purpose=fullsize',
    position: '50% 50%',
  },
  {
    eyebrow: 'FUERZA · CONTROL · CRITERIO',
    title: 'El esfuerzo ya lo pones tú.',
    accent: 'Nosotros afinamos lo demás.',
    text: 'Suplementación deportiva seleccionada con criterio profesional. Sin ruido, sin promesas vacías, sin catálogo infinito.',
    image: 'https://images.openai.com/static-rsc-4/047iXp76I1Umq1KckGf42e_FVQcHkgfGnstyst6wNjJcBzJJKxKCSjt2zt5yBEyCdsmM8Fwra5r3OJk8434HxjVKDggXNVK9F8cMmbsUR_Re17-2kdh__o6Vm_vWYlccH0c93HouaXcwSkfNz6B913efxstlLh74z09MgQgUjb6U5FqyiysK5D0SQP0W3kQ6?purpose=fullsize',
    position: '48% 50%',
  },
] as const

export default function HeroCarouselV4() {
  const [target, setTarget] = useState<HTMLElement | null>(null)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const node = document.getElementById('inicio')
    if (!node) return

    setTarget(node)
    const frame = window.requestAnimationFrame(() => node.classList.add('ghc-v4-mounted'))

    return () => {
      window.cancelAnimationFrame(frame)
      node.classList.remove('ghc-v4-mounted')
    }
  }, [])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length)
    }, 8500)

    return () => window.clearInterval(timer)
  }, [])

  if (!target) return null

  const current = slides[index]

  return createPortal(
    <div className="ghc-hero-v4 absolute inset-0 overflow-hidden bg-[#F4F4F0]">
      <div className="ghc-hero-v4__layout absolute inset-0">
        <div className="ghc-hero-v4__copy-bg" />
        <div className="ghc-hero-v4__visual relative overflow-hidden bg-[#0A0D0B]">
          {slides.map((slide, slideIndex) => (
            <div
              key={slide.image}
              aria-hidden={slideIndex !== index}
              className={`ghc-hero-v4__photo absolute inset-0 ${slideIndex === index ? 'is-active' : ''}`}
              style={{
                backgroundImage: `url(${slide.image})`,
                backgroundPosition: slide.position,
              }}
            />
          ))}
          <div className="ghc-hero-v4__shade absolute inset-0" />
        </div>
      </div>

      <div className="relative mx-auto grid min-h-[760px] max-w-[1500px] items-center px-5 py-16 lg:min-h-[820px] lg:grid-cols-[0.52fr_0.48fr] lg:px-9">
        <div className="relative z-10 max-w-[760px] pb-[330px] pt-10 lg:pb-0 lg:pt-0">
          <p className="mb-8 text-[10px] font-black uppercase tracking-[0.28em] text-[#169646]">{current.eyebrow}</p>
          <h1 className="max-w-[760px] text-[clamp(3.35rem,6.3vw,7.5rem)] font-black leading-[0.84] tracking-[-0.075em]">
            {current.title}
            <span className="mt-2 block font-medium italic text-[#169646]">{current.accent}</span>
          </h1>
          <p className="mt-9 max-w-[560px] text-base leading-7 text-black/62 md:text-lg md:leading-8">{current.text}</p>
          <div className="mt-10 flex flex-wrap items-center gap-5">
            <a href="#seleccion" className="inline-flex items-center gap-3 border-b-2 border-[#0A0D0B] pb-2 text-xs font-black uppercase tracking-[0.15em] transition hover:border-[#169646] hover:text-[#169646]">
              Descubrir la selección <ArrowDownRight className="h-4 w-4" />
            </a>
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-black/42">29 referencias seleccionadas</span>
          </div>
        </div>

        <div className="absolute bottom-5 left-5 z-30 flex items-center gap-2 lg:bottom-8 lg:left-9">
          <button
            type="button"
            onClick={() => setIndex((index + slides.length - 1) % slides.length)}
            className="grid h-9 w-9 place-items-center border border-black/18 bg-[#F4F4F0] transition hover:bg-white"
            aria-label="Anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="min-w-16 text-center text-[10px] font-black tracking-[0.18em]">0{index + 1} / 0{slides.length}</span>
          <button
            type="button"
            onClick={() => setIndex((index + 1) % slides.length)}
            className="grid h-9 w-9 place-items-center border border-black/18 bg-[#F4F4F0] transition hover:bg-white"
            aria-label="Siguiente"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>,
    target,
  )
}
