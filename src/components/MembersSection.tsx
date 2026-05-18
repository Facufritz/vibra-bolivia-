'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import SectionWrapper from '@/components/SectionWrapper'
import SectionPill from '@/components/SectionPill'
import AuthModal from '@/components/AuthModal'
import { useAuth } from '@/hooks/useAuth'

export default function MembersSection() {
  const { user, loading } = useAuth()
  const [modalOpen, setModalOpen] = useState(false)

  if (loading) return null

  return (
    <>
      <SectionWrapper clouds parallax className="py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <SectionPill className="mx-auto">★ ZONA MIEMBROS ★</SectionPill>

          <h2 className="font-display text-4xl md:text-5xl text-white tracking-wider mt-4 mb-4 section-title">
            Contenido Exclusivo
          </h2>

          {user ? (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mt-10 grid gap-4 sm:grid-cols-3"
            >
              {/* Badge */}
              <div className="sm:col-span-3 flex justify-center mb-2">
                <span className="px-4 py-1 rounded-full bg-vibra-orange/20 border border-vibra-orange/50 text-vibra-orange font-display tracking-widest text-sm">
                  ★ VIBRA MEMBER ★
                </span>
              </div>

              <div className="bg-white/10 border border-vibra-orange/30 rounded-2xl p-6">
                <p className="text-3xl mb-3">🎟️</p>
                <p className="font-display text-white text-lg tracking-wide">Preventa anticipada</p>
                <p className="text-white/60 text-sm mt-2">
                  Acceso 48hs antes que el público general cuando abramos la venta de entradas 2027.
                </p>
              </div>

              <div className="bg-white/10 border border-vibra-orange/30 rounded-2xl p-6">
                <p className="text-3xl mb-3">💜</p>
                <p className="font-display text-white text-lg tracking-wide">Descuento exclusivo</p>
                <p className="text-white/60 text-sm mt-2">
                  10% OFF en tu entrada. El código te llega por email cuando abramos la venta.
                </p>
              </div>

              <div className="bg-white/10 border border-vibra-orange/30 rounded-2xl p-6">
                <p className="text-3xl mb-3">🎬</p>
                <p className="font-display text-white text-lg tracking-wide">Detrás de cámaras</p>
                <p className="text-white/60 text-sm mt-2">
                  Contenido exclusivo del armado del festival que no publicamos en ninguna red.
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mt-10"
            >
              <p className="text-white/70 text-lg mb-8">
                Creá tu cuenta y accedé a preventa anticipada, descuentos y contenido exclusivo.
              </p>

              {/* Blurred preview cards */}
              <div className="relative">
                <div className="grid sm:grid-cols-3 gap-4 blur-sm select-none pointer-events-none" aria-hidden="true">
                  {['🎟️', '💜', '🎬'].map((emoji) => (
                    <div key={emoji} className="bg-white/10 border border-white/20 rounded-2xl p-6">
                      <p className="text-3xl mb-3">{emoji}</p>
                      <div className="h-4 bg-white/20 rounded-full mb-2 w-3/4" />
                      <div className="h-3 bg-white/10 rounded-full w-full mb-1" />
                      <div className="h-3 bg-white/10 rounded-full w-2/3" />
                    </div>
                  ))}
                </div>

                {/* CTA overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                  <button
                    onClick={() => setModalOpen(true)}
                    className="px-8 py-4 bg-vibra-orange text-white font-display text-xl tracking-wider rounded-full hover:opacity-90 transition chunky-3d"
                  >
                    Crear cuenta gratis
                  </button>
                  <button
                    onClick={() => setModalOpen(true)}
                    className="text-white/50 hover:text-white/80 text-sm transition underline underline-offset-4"
                  >
                    Ya tengo cuenta — entrar
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </SectionWrapper>

      <AuthModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialMode="signup"
      />
    </>
  )
}
