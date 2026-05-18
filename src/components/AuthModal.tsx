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

  async function handleGoogleSignIn() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
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

            {/* Google OAuth */}
            <button
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-3 py-3 rounded-full bg-white text-gray-700 font-medium hover:bg-gray-100 transition mb-5"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
                <path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 6.293C4.672 4.166 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
              Continuar con Google
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-white/15" />
              <span className="text-white/30 text-xs">o con email</span>
              <div className="flex-1 h-px bg-white/15" />
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
