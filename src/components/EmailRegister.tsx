'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function EmailRegister() {
  const [email, setEmail]   = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    const res = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
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
    <section id="registro" className="relative vibra-texture py-28 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-vibra-purple/50" />

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

      <div className="relative z-10 max-w-lg mx-auto text-center">

        <Image
          src="/assets/multimedia/vibra%20png.png"
          alt="Vibra Bolivia"
          width={280}
          height={120}
          className="mx-auto mb-8 w-48 md:w-72"
        />

        <h2 className="font-display text-4xl md:text-6xl text-white tracking-wider mb-4">
          Quiero enterarme primero
        </h2>
        <p className="text-white/70 text-lg mb-10">
          Dejá tu mail y te avisamos cuando abramos la preventa del 2027.
        </p>

        {status === 'success' ? (
          <div className="bg-white/10 border border-white/30 rounded-2xl p-8">
            <p className="font-display text-2xl text-vibra-orange tracking-wide">{message}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              className="flex-1 px-6 py-4 rounded-full bg-white/10 border border-white/30 text-white placeholder-white/40 focus:outline-none focus:border-vibra-orange text-lg"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-8 py-4 bg-vibra-orange text-white font-display text-xl tracking-wider rounded-full hover:opacity-90 disabled:opacity-60 transition whitespace-nowrap"
            >
              {status === 'loading' ? 'Enviando...' : 'Me anoto'}
            </button>
          </form>
        )}

        {status === 'error' && (
          <p className="text-red-300 mt-4 text-sm">{message}</p>
        )}

        <p className="text-white/30 text-xs mt-6">
          Sin spam. Solo Vibra.
        </p>

      </div>
    </section>
  )
}
