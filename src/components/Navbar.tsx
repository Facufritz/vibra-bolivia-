'use client'

import { useState } from 'react'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import AuthModal from '@/components/AuthModal'

export default function Navbar() {
  const { user, loading } = useAuth()
  const [modalOpen, setModalOpen] = useState(false)

  async function handleSignOut() {
    await supabase.auth.signOut()
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 bg-gradient-to-b from-black/60 to-transparent pointer-events-none">
        <Image
          src="/assets/multimedia/vibra%20png.png"
          alt="Vibra Bolivia"
          width={100}
          height={43}
          className="w-20 opacity-90"
        />

        <div className="pointer-events-auto">
          {loading ? null : user ? (
            <div className="flex items-center gap-3">
              <span className="text-white/60 text-xs hidden sm:block truncate max-w-[160px]">
                {user.email}
              </span>
              <button
                onClick={handleSignOut}
                className="px-4 py-1.5 rounded-full border border-white/30 text-white/80 hover:text-white hover:border-white/60 text-sm font-display tracking-wider transition"
              >
                Salir
              </button>
            </div>
          ) : (
            <button
              onClick={() => setModalOpen(true)}
              className="px-5 py-1.5 rounded-full bg-vibra-orange text-white font-display tracking-wider text-sm hover:opacity-90 transition chunky-3d"
            >
              Entrar
            </button>
          )}
        </div>
      </nav>

      <AuthModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}
