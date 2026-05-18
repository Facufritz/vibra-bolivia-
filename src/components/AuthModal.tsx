'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'

interface Props {
  isOpen: boolean
  onClose: () => void
  initialMode?: 'signin' | 'signup'
}

export default function AuthModal({ isOpen, onClose, initialMode = 'signin' }: Props) {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  function reset() {
    setEmail('')
    setPassword('')
    setStatus('idle')
    setMessage('')
  }

  function switchMode(next: 'signin' | 'signup') {
    setMode(next)
    reset()
  }

  function handleClose() {
    reset()
    onClose()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setMessage('')

    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) {
        setStatus('error')
        setMessage(error.message)
      } else {
        setStatus('success')
        setMessage('¡Cuenta creada! Revisá tu email para confirmar.')
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setStatus('error')
        setMessage('Email o contraseña incorrectos.')
      } else {
        handleClose()
      }
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-md bg-[#3a1a6e] border border-vibra-orange/30 rounded-2xl p-8 shadow-[0_0_60px_rgba(245,160,32,0.2)]"
            initial={{ scale: 0.95, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 16 }}
            transition={{ duration: 0.2 }}
          >
            {/* Close */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-white/40 hover:text-white transition text-xl leading-none"
              aria-label="Cerrar"
            >
              ✕
            </button>

            {/* Tabs */}
            <div className="flex gap-1 bg-black/30 rounded-full p-1 mb-8">
              {(['signin', 'signup'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => switchMode(m)}
                  className={`flex-1 py-2 rounded-full font-display tracking-wider text-sm transition ${
                    mode === m
                      ? 'bg-vibra-orange text-white'
                      : 'text-white/50 hover:text-white/80'
                  }`}
                >
                  {m === 'signin' ? 'Entrar' : 'Crear cuenta'}
                </button>
              ))}
            </div>

            {status === 'success' ? (
              <div className="text-center py-4">
                <p className="font-display text-vibra-orange text-xl tracking-wide">{message}</p>
                <button
                  onClick={handleClose}
                  className="mt-6 px-6 py-2 rounded-full border border-white/30 text-white/70 hover:text-white transition text-sm"
                >
                  Cerrar
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  className="px-5 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/30 focus:outline-none focus:border-vibra-orange transition"
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Contraseña"
                  required
                  minLength={6}
                  className="px-5 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/30 focus:outline-none focus:border-vibra-orange transition"
                />

                {status === 'error' && (
                  <p className="text-red-300 text-sm text-center">{message}</p>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="mt-2 py-3 bg-vibra-orange text-white font-display text-lg tracking-wider rounded-full hover:opacity-90 disabled:opacity-60 transition chunky-3d"
                >
                  {status === 'loading'
                    ? 'Cargando...'
                    : mode === 'signin'
                    ? 'Entrar'
                    : 'Crear cuenta'}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
