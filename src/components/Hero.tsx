'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  const darkOverlayOpacity = useTransform(scrollYProgress, [0, 1], [0, 0.35])

  const stickyClasses = reduceMotion
    ? 'relative h-screen'
    : 'sticky top-0 min-h-screen'

  return (
    <section ref={sectionRef} className={`${stickyClasses} w-full overflow-hidden`}>

      {/* Fondo estático — visible mientras el video carga */}
      <div className="absolute inset-0 z-0 vibra-texture" />

      {/* Video — solo fade, sin zoom */}
      <motion.div
        className="absolute inset-0 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.8, ease: 'easeOut' }}
      >
        <video
          className="hidden md:block w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          src="/assets/multimedia/Vibra%20Bolivia%20after%20movie.mp4"
        />
        <video
          className="block md:hidden w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          src="/assets/multimedia/vibra%20bolivia%20video%20vertical(1).mp4"
        />
      </motion.div>

      {/* Overlay — oscurece lado izquierdo para legibilidad del texto */}
      <div className="absolute inset-0 z-20 bg-gradient-to-r from-black/65 via-black/25 to-transparent" />
      <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

      {/* Nubes flotantes — solo desktop, lado derecho y centro para no tapar el texto */}
      <Image src="/assets/branding/IMG_3495.png" alt="" width={220} height={132}
        className="absolute top-8 right-8 z-30 opacity-90 animate-float hidden md:block" aria-hidden="true" />
      <Image src="/assets/branding/IMG_3495.png" alt="" width={160} height={96}
        className="absolute top-6 left-6 z-30 opacity-70 animate-float_slow hidden md:block" aria-hidden="true" />
      <Image src="/assets/branding/IMG_3495.png" alt="" width={110} height={66}
        className="absolute top-[38%] right-4 z-30 opacity-50 animate-float hidden md:block" aria-hidden="true" />
      <Image src="/assets/branding/IMG_3495.png" alt="" width={130} height={78}
        className="absolute bottom-24 right-20 z-30 opacity-60 animate-float_slow hidden md:block" aria-hidden="true" />
      <Image src="/assets/branding/IMG_3495.png" alt="" width={90} height={54}
        className="absolute bottom-20 left-[45%] z-30 opacity-35 animate-float hidden md:block" aria-hidden="true" />

      {/* Contenido — mobile top-left, desktop centro-izquierda */}
      <motion.div
        className="absolute top-24 left-4 md:top-1/2 md:-translate-y-1/2 md:left-16 lg:left-24 z-40 max-w-xl"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.5 }}
      >
        <Image
          src="/assets/multimedia/vibra%20png.png"
          alt="Vibra Bolivia"
          width={320}
          height={138}
          className="mb-5 w-44 md:w-64 lg:w-80"
          priority
        />
        <p className="font-display text-2xl md:text-4xl lg:text-5xl text-white tracking-wide drop-shadow-lg leading-tight">
          <span className="text-vibra-orange">2027</span> viene con todo<br />
          Algo grande se está armando
        </p>
      </motion.div>

      {/* Flecha scroll */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40">
        <div className="animate-bounce_slow text-white opacity-70">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      </div>

      {/* Progressive dark overlay — fades in as the next section covers this one */}
      {!reduceMotion && (
        <motion.div
          data-testid="dark-overlay"
          style={{ opacity: darkOverlayOpacity }}
          className="absolute inset-0 z-50 bg-black pointer-events-none"
          aria-hidden="true"
        />
      )}

    </section>
  )
}
