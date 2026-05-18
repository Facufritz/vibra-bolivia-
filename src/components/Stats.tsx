'use client'

import Image from 'next/image'
import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useCountUp } from '@/hooks/useCountUp'
import SectionWrapper from '@/components/SectionWrapper'
import SectionPill from '@/components/SectionPill'
import Sparkles from '@/components/Sparkles'

const STATS = [
  { value: 15000, suffix: '+', compactValue: '15K', label: 'Personas' },
  { value: 10,    suffix: '',  label: 'Artistas en vivo' },
  { value: 12,    suffix: '',  label: 'Horas de música' },
  { value: 2,     suffix: '',  label: 'Ediciones' },
]

function StatItem({ value, suffix, compactValue, label, trigger }: {
  value: number; suffix: string; compactValue?: string; label: string; trigger: boolean
}) {
  const count = useCountUp(value, 2000, trigger)
  const fullValue = value >= 1000 ? count.toLocaleString('es-AR') : count
  return (
    <div className="text-center">
      <p className="font-display text-5xl sm:text-6xl md:text-7xl text-vibra-orange chunky-3d">
        {compactValue ? (
          <>
            <span className="hidden lg:inline">{fullValue}{suffix}</span>
            <span className="lg:hidden">{compactValue}{suffix}</span>
          </>
        ) : (
          <>{fullValue}{suffix}</>
        )}
      </p>
      <p className="font-sans text-white/90 text-lg md:text-xl mt-2 tracking-wide uppercase">
        {label}
      </p>
    </div>
  )
}

export default function Stats() {
  const ref = useRef<HTMLDivElement>(null)
  const [triggered, setTriggered] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setTriggered(true) },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <SectionWrapper clouds grassBottom parallax className="py-24">
      <div ref={ref} className="max-w-7xl mx-auto px-4">
        
        {/* CABECERA ALINEADA Y CORREGIDA */}
        <div className="text-center mb-16">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
            <div className="transform md:translate-y-[6px]">
              <SectionPill>★ 2DA EDICIÓN ★</SectionPill>
            </div>
            
            <div className="relative inline-block">
              <Sparkles />
              <h2 className="font-display text-4xl md:text-5xl text-white tracking-wider section-title">
                Lo que fue el Vibra 2026
              </h2>
            </div>
          </div>

          <p className="font-display text-sm md:text-base text-white/70 tracking-[0.3em] mt-6">
            ★ ★ ★ SEGUNDA EDICIÓN ★ ★ ★
          </p>
        </div>

        {/* GRILLA CON CHIRU CORREGIDO (Sin pisar estadísticas) */}
        <div className="relative grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-4 items-center">
          
          {/* Columna vacía a la izquierda (Ocupa espacio equivalente a la nube) */}
          <div className="hidden md:block md:col-span-2" />

          {/* Estadísticas (Centradas en el medio) */}
          <div className="col-span-1 md:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 z-10">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={triggered ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <StatItem {...stat} trigger={triggered} />
              </motion.div>
            ))}
          </div>

          {/* Contenedor de Chiru en Desktop — más grande, alineado arriba para "flotar más arriba" */}
          <div className="hidden md:flex md:col-span-2 justify-end self-start md:-mt-8 lg:-mt-12 pointer-events-none z-40">
            <Image
              src="/assets/branding/Chiru%20png%20.png"
              alt="Chiru"
              width={220}
              height={220}
              className="animate-float w-40 lg:w-56"
            />
          </div>
        </div>

        {/* Chiru en Mobile (Se renderiza limpio abajo de todo) */}
        <div className="md:hidden flex justify-center mt-12 pointer-events-none z-40">
          <Image
            src="/assets/branding/Chiru%20png%20.png"
            alt="Chiru"
            width={144}
            height={144}
            className="animate-float w-36"
          />
        </div>

      </div>
    </SectionWrapper>
  )
}