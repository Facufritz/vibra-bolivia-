'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { TIMELINE_2026 } from '@/lib/timeline-data'
import SectionWrapper from '@/components/SectionWrapper'

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
    <SectionWrapper grassBottom>
      <div className="max-w-5xl mx-auto">
        <h2 className="font-display text-4xl md:text-5xl text-center text-white mb-4 tracking-wider">
          El Horario del 2026
        </h2>
        <p className="text-center text-white/50 text-sm mb-12">
          Usá ← → o tocá los puntos para navegar
        </p>
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            className="relative w-full aspect-video rounded-2xl overflow-hidden mb-10 border border-white/10"
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
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute bottom-6 left-6">
              <span className="font-display text-vibra-orange text-3xl">{entry.time}</span>
              <p className="font-display text-white text-2xl mt-1">{entry.artist}</p>
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={goPrev}
            disabled={active === 0}
            className="px-6 py-2 rounded-full border border-white/30 text-white disabled:opacity-30 hover:bg-white/10 transition font-display tracking-wider"
          >
            ← Anterior
          </button>
          <span className="text-white/50 text-sm">
            {active + 1} / {TIMELINE_2026.length}
          </span>
          <button
            onClick={goNext}
            disabled={active === TIMELINE_2026.length - 1}
            className="px-6 py-2 rounded-full border border-white/30 text-white disabled:opacity-30 hover:bg-white/10 transition font-display tracking-wider"
          >
            Siguiente →
          </button>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 justify-start md:justify-center">
          {TIMELINE_2026.map((item, i) => (
            <button
              key={item.time}
              onClick={() => setActive(i)}
              className="flex flex-col items-center gap-1 min-w-[52px] group"
              aria-label={`${item.time} - ${item.artist}`}
            >
              <div className={`w-3 h-3 rounded-full transition-all ${
                i === active
                  ? 'bg-vibra-orange scale-150'
                  : 'bg-white/30 group-hover:bg-white/60'
              }`} />
              <span className={`text-[10px] font-mono transition-colors ${
                i === active ? 'text-vibra-orange' : 'text-white/40'
              }`}>
                {item.time}
              </span>
            </button>
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}
