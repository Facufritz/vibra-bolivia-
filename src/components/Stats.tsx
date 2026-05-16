'use client'

import Image from 'next/image'
import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useCountUp } from '@/hooks/useCountUp'
import SectionWrapper from '@/components/SectionWrapper'
import SectionPill from '@/components/SectionPill'
import Sparkles from '@/components/Sparkles'

const STATS = [
  { value: 15000, suffix: '+', label: 'Personas' },
  { value: 10,    suffix: '',  label: 'Artistas en vivo' },
  { value: 12,    suffix: '',  label: 'Horas de música' },
  { value: 2,     suffix: '',  label: 'Ediciones' },
]

function StatItem({ value, suffix, label, trigger }: {
  value: number; suffix: string; label: string; trigger: boolean
}) {
  const count = useCountUp(value, 2000, trigger)
  return (
    <div className="text-center">
      <p className="font-display text-5xl md:text-7xl text-vibra-orange chunky-3d">
        {value >= 1000 ? count.toLocaleString('es-AR') : count}{suffix}
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
      <div ref={ref} className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <SectionPill>★ 2DA EDICIÓN ★</SectionPill>
          <div className="relative inline-block">
            <Sparkles />
            <h2 className="font-display text-4xl md:text-5xl text-white tracking-wider section-title">
              Lo que fue Vibra Bolivia 2026
            </h2>
          </div>
          <p className="font-display text-sm md:text-base text-white/70 tracking-[0.3em] mt-6">
            ★ ★ ★ SEGUNDA EDICIÓN ★ ★ ★
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
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
      </div>

      {/* Chiru desktop — md+ esquina inferior derecha */}
      <div className="hidden md:block absolute bottom-16 right-4 md:right-16 w-32 md:w-48 pointer-events-none z-40">
        <Image
          src="/assets/branding/Chiru%20png%20.png"
          alt="Chiru"
          width={192}
          height={192}
          className="animate-float"
        />
      </div>

      {/* Chiru mobile — centrado debajo de la grilla */}
      <div className="md:hidden flex justify-center mt-12 pointer-events-none">
        <Image
          src="/assets/branding/Chiru%20png%20.png"
          alt="Chiru"
          width={128}
          height={128}
          className="animate-float w-32"
        />
      </div>
    </SectionWrapper>
  )
}
