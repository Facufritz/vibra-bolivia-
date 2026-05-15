'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">

      <div className="absolute inset-0 z-0 vibra-texture" />

      <motion.div
        className="absolute inset-0 z-10"
        initial={{ scale: 0.3, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.6, ease: 'easeOut' }}
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

      <div className="absolute inset-0 z-20 bg-gradient-to-b from-black/20 via-transparent to-black/40" />

      <Image
        src="/assets/branding/IMG_3495.png"
        alt=""
        width={220}
        height={132}
        className="absolute top-8 left-6 z-30 opacity-90 animate-float hidden md:block"
        aria-hidden="true"
      />
      <Image
        src="/assets/branding/IMG_3495.png"
        alt=""
        width={160}
        height={96}
        className="absolute top-12 right-8 z-30 opacity-80 animate-float_slow hidden md:block"
        aria-hidden="true"
      />
      <Image
        src="/assets/branding/IMG_3495.png"
        alt=""
        width={120}
        height={72}
        className="absolute top-[38%] left-0 z-30 opacity-60 animate-float scale-75 hidden md:block"
        aria-hidden="true"
      />
      <Image
        src="/assets/branding/IMG_3495.png"
        alt=""
        width={100}
        height={60}
        className="absolute top-[45%] right-2 z-30 opacity-50 animate-float_slow hidden md:block"
        aria-hidden="true"
      />
      <Image
        src="/assets/branding/IMG_3495.png"
        alt=""
        width={140}
        height={84}
        className="absolute bottom-20 left-10 z-30 opacity-70 animate-float hidden md:block"
        aria-hidden="true"
      />

      <motion.div
        className="relative z-40 text-center px-4"
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

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40">
        <div className="animate-bounce_slow text-white opacity-80">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      </div>

    </section>
  )
}
