'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">

      {/* Video de fondo con zoom-in al cargar */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ scale: 0.3, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.4, ease: 'easeOut' }}
      >
        {/* Video horizontal (desktop) */}
        <video
          className="hidden md:block w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          src="/assets/multimedia/Vibra%20Bolivia%20after%20movie.mp4"
        />
        {/* Video vertical (mobile) */}
        <video
          className="block md:hidden w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          src="/assets/multimedia/vibra%20bolivia%20video%20vertical(1).mp4"
        />
        {/* Fallback texture background */}
        <div className="absolute inset-0 vibra-texture" />
      </motion.div>

      {/* Overlay con gradiente */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-vibra-purple/70 via-vibra-pink/40 to-vibra-purple/80" />

      {/* Nubes decorativas */}
      <Image
        src="/assets/branding/IMG_3495.png"
        alt=""
        width={200}
        height={120}
        className="absolute top-12 left-8 z-20 opacity-80 animate-float hidden md:block"
        aria-hidden="true"
      />
      <Image
        src="/assets/branding/IMG_3495.png"
        alt=""
        width={150}
        height={90}
        className="absolute top-20 right-12 z-20 opacity-70 animate-float_slow hidden md:block"
        aria-hidden="true"
      />

      {/* Contenido central */}
      <motion.div
        className="relative z-30 text-center px-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <Image
          src="/assets/multimedia/vibra%20png.png"
          alt="Vibra Bolivia"
          width={420}
          height={180}
          className="mx-auto mb-6 w-64 md:w-96 lg:w-[420px]"
          priority
        />
        <p className="font-display text-2xl md:text-4xl text-white tracking-wide drop-shadow-lg">
          El festival que le devolvió la música a Bolivia
        </p>
      </motion.div>

      {/* Flecha de scroll */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30">
        <div className="animate-bounce_slow text-white opacity-80">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      </div>

    </section>
  )
}
