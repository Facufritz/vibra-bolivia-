'use client'

import { useState } from 'react'
import Image from 'next/image'
import SectionWrapper from '@/components/SectionWrapper'
import SectionPill from '@/components/SectionPill'
import Sparkles from '@/components/Sparkles'

export default function EmailRegister() {
  const [email, setEmail]   = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (honeypot) return
    setStatus('loading')

    const res = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, website: honeypot }),
    })

    const data = await res.json()

    if (res.ok) {
      setStatus('success')
      setMessage('¡Ya estás en la lista! Te avisamos cuando abramos.')
      setEmail('')
    } else {
      setStatus('error')
      setMessage(data.error || 'Algo salió mal, intentá de nuevo.')
    }
  }

  return (
    <div id="registro">
      <SectionWrapper clouds grassBottom mountainsBottom parallax className="py-28">
        <div className="relative max-w-lg mx-auto text-center">
          {/* Chiru desktop — al lado izquierdo del form */}
          <div className="hidden lg:block absolute -left-72 top-1/2 -translate-y-1/2 w-52 pointer-events-none">
            <Image
              src="/assets/branding/Chiru%20png%20.png"
              alt=""
              width={208}
              height={208}
              className="animate-float"
              aria-hidden="true"
            />
          </div>

          {/* Chiru mobile — arriba del logo */}
          <div className="lg:hidden flex justify-center mb-6 pointer-events-none">
            <Image
              src="/assets/branding/Chiru%20png%20.png"
              alt=""
              width={128}
              height={128}
              className="w-32 animate-float"
              aria-hidden="true"
            />
          </div>

          <Image
            src="/assets/multimedia/vibra%20png.png"
            alt="Vibra Bolivia"
            width={280}
            height={120}
            className="mx-auto mb-8 w-48 md:w-72"
          />

          <SectionPill className="mx-auto">★ PREVENTA 2027 ★</SectionPill>

          <div className="relative inline-block mt-2">
            <Sparkles />
            <h2 className="font-display text-4xl md:text-6xl text-white tracking-wider section-title">
              Quiero enterarme primero
            </h2>
          </div>

          <p className="text-white/70 text-lg mt-6 mb-10">
            Dejá tu mail y te avisamos cuando abramos la preventa del 2027.
          </p>

          {status === 'success' ? (
            <div className="bg-white/10 border border-white/30 rounded-2xl p-8">
              <p className="font-display text-2xl text-vibra-orange tracking-wide">{message}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              {/* honeypot — invisible para humanos, los bots lo completan */}
              <input
                type="text"
                name="website"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                className="flex-1 px-6 py-4 rounded-full bg-white/10 border-2 border-vibra-orange/60 text-white placeholder-white/40 focus:outline-none focus:border-vibra-orange focus:shadow-[0_0_20px_rgba(245,160,32,0.4)] text-lg transition-all"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="px-8 py-4 bg-vibra-orange text-white font-display text-xl tracking-wider rounded-full hover:opacity-90 disabled:opacity-60 transition whitespace-nowrap chunky-3d"
              >
                {status === 'loading' ? 'Enviando...' : 'Me anoto'}
              </button>
            </form>
          )}

          {status === 'error' && (
            <p className="text-red-300 mt-4 text-sm">{message}</p>
          )}

          <p className="text-white/30 text-xs mt-6">Sin spam. Solo Vibra.</p>
        </div>
      </SectionWrapper>
    </div>
  )
}
