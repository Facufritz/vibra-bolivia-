'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { TIMELINE_2026 } from '@/lib/timeline-data'
import SectionWrapper from '@/components/SectionWrapper'
import SectionPill from '@/components/SectionPill'
import Sparkles from '@/components/Sparkles'

export default function Timeline() {
  const [active, setActive] = useState(0)

  const goNext = useCallback(() => {
    setActive((i) => Math.min(i + 1, TIMELINE_2026.length - 1))
  }, [])

  const goPrev = useCallback(() => {
    setActive((i) => Math.max(i - 1, 0))
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft')  goPrev()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [goNext, goPrev])

  const entry = TIMELINE_2026[active]

  return (
    <SectionWrapper grassBottom className="py-24 overflow-hidden w-full relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 relative w-full">
        
        {/* CABECERA — pill + título lado a lado (mismo patrón que Stats) */}
        <div className="text-center mb-16 relative z-20 px-4">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
            <div className="transform md:translate-y-[6px]">
              <SectionPill>★ LINE UP 2026 ★</SectionPill>
            </div>
            <div className="relative inline-block">
              <Sparkles />
              <h2 className="font-display text-4xl md:text-5xl text-white tracking-wider section-title">
                El line up del 2026
              </h2>
            </div>
          </div>

          <p className="font-display text-xs sm:text-sm text-white/60 tracking-[0.15em] sm:tracking-[0.2em] mt-6 uppercase">
            Usá ← → o tocá los puntos para navegar
          </p>
        </div>

        {/* CONTENEDOR DEL SLIDER */}
        <div className="max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              className="relative w-full aspect-video rounded-2xl overflow-hidden mb-6 border-2 border-vibra-orange/40"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35 }}
            >
              <Image
                src={`/assets/multimedia/Fotos-Vibra-Bolivia-2026/${entry.photoFolder}/cover.jpg`}
                alt={entry.artist}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-6 left-6">
                <p className="font-display text-white text-2xl drop-shadow">{entry.artist}</p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* BOTONES DE NAVEGACIÓN */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={goPrev}
              disabled={active === 0}
              className="px-6 py-2 rounded-full border border-white/30 text-white disabled:opacity-30 hover:bg-white/10 transition font-display tracking-wider"
            >
              ← Anterior
            </button>
            <button
              onClick={goNext}
              disabled={active === TIMELINE_2026.length - 1}
              className="px-6 py-2 rounded-full border border-white/30 text-white disabled:opacity-30 hover:bg-white/10 transition font-display tracking-wider"
            >
              Siguiente →
            </button>
          </div>

          {/* PAGINACIÓN DE PUNTOS */}
          <div className="flex items-center gap-3 overflow-x-auto py-3 justify-start md:justify-center">
            {TIMELINE_2026.map((item, i) => (
              <motion.button
                key={item.time}
                onClick={() => setActive(i)}
                className="flex-shrink-0 group"
                aria-label={item.artist}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <div className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  i === active
                    ? 'bg-vibra-orange scale-125'
                    : 'bg-white/30 group-hover:bg-white/60'
                }`} />
              </motion.button>
            ))}
          </div>
        </div>

      </div>
    </SectionWrapper>
  )
}