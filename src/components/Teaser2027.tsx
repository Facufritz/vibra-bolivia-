'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

export default function Teaser2027() {
  return (
    <section className="relative vibra-texture py-28 px-4 overflow-hidden">

      {/* Overlay */}
      <div className="absolute inset-0 bg-vibra-purple/40" />

      {/* Nubes */}
      <Image
        src="/assets/branding/IMG_3495.png"
        alt=""
        width={180}
        height={110}
        className="absolute top-8 left-6 opacity-70 animate-float hidden md:block"
        aria-hidden="true"
      />
      <Image
        src="/assets/branding/IMG_3495.png"
        alt=""
        width={140}
        height={85}
        className="absolute top-16 right-8 opacity-60 animate-float_slow hidden md:block"
        aria-hidden="true"
      />

      {/* Montañas */}
      <div className="absolute bottom-0 left-0 w-full pointer-events-none">
        <Image
          src="/assets/branding/IMG_3496.png"
          alt=""
          width={1440}
          height={160}
          className="w-full object-cover opacity-50"
          aria-hidden="true"
        />
      </div>

      {/* Pasto */}
      <div className="absolute bottom-0 left-0 w-full pointer-events-none">
        <Image
          src="/assets/branding/IMG_3494.png"
          alt=""
          width={1440}
          height={80}
          className="w-full object-cover"
          aria-hidden="true"
        />
      </div>

      {/* Contenido */}
      <div className="relative z-10 flex flex-col items-center text-center">

        {/* Chiru animado */}
        <motion.div
          className="w-48 md:w-72 mb-8"
          animate={{ y: [0, -16, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <video
            src="/assets/multimedia/Chiru_v02.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="w-full"
          />
        </motion.div>

        <motion.h2
          className="font-display text-6xl md:text-9xl text-white tracking-widest drop-shadow-2xl"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          2027
        </motion.h2>

        <motion.p
          className="font-display text-3xl md:text-5xl text-vibra-orange mt-4 tracking-wider"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          Se viene
        </motion.p>

        <motion.p
          className="font-sans text-white/70 text-xl mt-6 mb-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
        >
          Sé el primero en enterarte
        </motion.p>

        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" opacity={0.6}>
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </motion.div>

      </div>
    </section>
  )
}
