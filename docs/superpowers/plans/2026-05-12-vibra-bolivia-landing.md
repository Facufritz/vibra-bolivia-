# Vibra Bolivia Landing Page — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a landing page de hype para Vibra Bolivia 2027 con video hero, secciones de estadísticas, timeline interactivo, embeds de YouTube/Spotify/RRSS, y captura de emails conectada a Supabase.

**Architecture:** Next.js 14 App Router con un componente por sección. Los assets estáticos (videos, imágenes, personajes) viven en `public/assets/`. El registro de email usa una API Route de Next.js que escribe en Supabase.

**Tech Stack:** Next.js 14, Tailwind CSS, framer-motion, @supabase/supabase-js, TypeScript

---

## Mapa de Archivos

| Archivo | Responsabilidad |
|---------|----------------|
| `src/app/layout.tsx` | Root layout, fuentes Google, metadata SEO |
| `src/app/page.tsx` | Ensambla todos los componentes en orden |
| `src/app/globals.css` | Variables CSS de marca, utilidades globales |
| `src/app/api/subscribe/route.ts` | POST handler: valida email y escribe en Supabase |
| `src/components/Hero.tsx` | Video fullscreen con animación de zoom-in |
| `src/components/Stats.tsx` | 4 métricas con count-up al entrar en viewport |
| `src/components/Timeline.tsx` | Timeline de horarios navegable con teclado |
| `src/components/Aftermovie.tsx` | Embed YouTube del aftermovie 2026 |
| `src/components/SpotifyPlayer.tsx` | Embed Spotify de la playlist oficial |
| `src/components/SocialMedia.tsx` | Embeds de 2 reels de IG + 2 videos TikTok |
| `src/components/Teaser2027.tsx` | Sección "2027 se viene" con Chiru animado |
| `src/components/EmailRegister.tsx` | Formulario de captura de email |
| `src/lib/supabase.ts` | Cliente Supabase singleton |
| `src/lib/timeline-data.ts` | Array de datos del horario 2026 |
| `tailwind.config.ts` | Tokens de color y animaciones de la marca |
| `__tests__/api/subscribe.test.ts` | Tests del API route |
| `__tests__/lib/timeline-data.test.ts` | Tests de los datos del timeline |

---

## Task 1: Setup del Proyecto

**Files:**
- Create: `vibra-bolivia/` (proyecto Next.js)
- Modify: `tailwind.config.ts`
- Modify: `package.json`

- [ ] **Step 1: Crear el proyecto Next.js con Tailwind**

Ejecutar en `C:\Users\Principal\`:
```bash
npx create-next-app@latest vibra-bolivia --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --no-turbopack
```
Cuando pregunte, responder con las opciones por defecto (Enter en todo).

- [ ] **Step 2: Instalar dependencias**

```bash
cd vibra-bolivia
npm install framer-motion @supabase/supabase-js
npm install -D jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom @types/jest
```

- [ ] **Step 3: Configurar Jest**

Crear `jest.config.ts`:
```typescript
import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({ dir: './' })

const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testMatch: ['**/__tests__/**/*.test.ts', '**/__tests__/**/*.test.tsx'],
}

export default createJestConfig(config)
```

Crear `jest.setup.ts`:
```typescript
import '@testing-library/jest-dom'
```

- [ ] **Step 4: Configurar Tailwind con los colores de marca**

Reemplazar `tailwind.config.ts` con:
```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        vibra: {
          orange:  '#F5A020',
          pink:    '#E8498A',
          purple:  '#5B2D8E',
          blue:    '#4FC3F7',
        },
      },
      backgroundImage: {
        'vibra-gradient': 'linear-gradient(to bottom, #F5A020, #E8498A, #5B2D8E)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':       { transform: 'translateY(-12px)' },
        },
        bounce_slow: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':       { transform: 'translateY(8px)' },
        },
      },
      animation: {
        float:        'float 4s ease-in-out infinite',
        float_slow:   'float 6s ease-in-out infinite',
        bounce_slow:  'bounce_slow 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

export default config
```

- [ ] **Step 5: Crear archivo de variables de entorno**

Crear `.env.local` en la raíz del proyecto:
```
NEXT_PUBLIC_SUPABASE_URL=TU_URL_AQUI
NEXT_PUBLIC_SUPABASE_ANON_KEY=TU_KEY_AQUI
```
> Obtener estos valores en supabase.com → nuevo proyecto → Settings → API. No commitear este archivo (ya está en .gitignore de Next.js).

- [ ] **Step 6: Copiar los assets al proyecto**

En PowerShell:
```powershell
# Branding
Copy-Item "D:\Diseño\Documents\Vibra-Bolivia\assets\Branding\*" -Destination "public\assets\branding\" -Recurse -Force

# Multimedia (ya están en Public/assets/Multimedia del repo, moverlos a public/)
# Los archivos ya están en C:\Users\Principal\vibra-bolivia\Public\assets\Multimedia\
# Copiarlos a public\assets\multimedia\
Copy-Item "Public\assets\Multimedia\*" -Destination "public\assets\multimedia\" -Recurse -Force
```

- [ ] **Step 7: Limpiar el boilerplate de Next.js**

Reemplazar el contenido de `src/app/globals.css` con:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    scroll-behavior: smooth;
  }
  body {
    background-color: #5B2D8E;
    color: white;
    overflow-x: hidden;
  }
}

@layer utilities {
  .vibra-texture {
    background-image: url('/assets/branding/fondo.jpg');
    background-size: cover;
    background-position: center;
  }
}
```

Reemplazar `src/app/page.tsx` con:
```tsx
export default function Home() {
  return (
    <main>
      <p className="text-white text-center p-8">Vibra Bolivia — en construcción</p>
    </main>
  )
}
```

- [ ] **Step 8: Verificar que el proyecto levanta**

```bash
npm run dev
```
Abrir `http://localhost:3000` — debe mostrar "Vibra Bolivia — en construcción" sobre fondo oscuro.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: setup Next.js project with Tailwind brand tokens and assets"
```

---

## Task 2: Layout y Fuentes

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Configurar el layout con fuentes y metadata**

Reemplazar `src/app/layout.tsx` con:
```tsx
import type { Metadata } from 'next'
import { Bebas_Neue, Inter } from 'next/font/google'
import './globals.css'

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
})

export const metadata: Metadata = {
  title: 'Vibra Bolivia 2027 — El festival se viene',
  description: '15.000 personas. 10 artistas. 12 horas de música. Vibra Bolivia vuelve en 2027.',
  openGraph: {
    title: 'Vibra Bolivia 2027',
    description: 'El festival más grande de Bolivia vuelve en 2027.',
    images: ['/assets/branding/preventa 1440.jpg'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={`${bebasNeue.variable} ${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
```

- [ ] **Step 2: Agregar la fuente display a Tailwind**

En `tailwind.config.ts`, dentro de `theme.extend`, agregar:
```typescript
fontFamily: {
  display: ['var(--font-display)', 'sans-serif'],
  sans:    ['var(--font-body)', 'sans-serif'],
},
```

- [ ] **Step 3: Verificar fuentes en el navegador**

```bash
npm run dev
```
Actualizar `http://localhost:3000`. La tipografía debe haberse actualizado.

- [ ] **Step 4: Commit**

```bash
git add src/app/layout.tsx tailwind.config.ts
git commit -m "feat: add Google Fonts (Bebas Neue + Inter) and SEO metadata"
```

---

## Task 3: Componente Hero

**Files:**
- Create: `src/components/Hero.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Crear el componente Hero**

Crear `src/components/Hero.tsx`:
```tsx
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
          src="/assets/multimedia/Vibra Bolivia after movie.mp4"
        />
        {/* Video vertical (mobile) */}
        <video
          className="block md:hidden w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          src="/assets/multimedia/vibra bolivia video vertical(1).mp4"
        />
        {/* Fallback: si el video no carga */}
        <div className="absolute inset-0 vibra-texture" />
      </motion.div>

      {/* Overlay con gradiente */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-vibra-purple/70 via-vibra-pink/40 to-vibra-purple/80" />

      {/* Nubes decorativas */}
      <Image
        src="/assets/branding/IMG_3495.PNG"
        alt=""
        width={200}
        height={120}
        className="absolute top-12 left-8 z-20 opacity-80 animate-float hidden md:block"
        aria-hidden="true"
      />
      <Image
        src="/assets/branding/IMG_3495.PNG"
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
          src="/assets/multimedia/vibra png.png"
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
```

- [ ] **Step 2: Agregar Hero a la página**

Reemplazar `src/app/page.tsx` con:
```tsx
import Hero from '@/components/Hero'

export default function Home() {
  return (
    <main>
      <Hero />
    </main>
  )
}
```

- [ ] **Step 3: Verificar en el navegador**

```bash
npm run dev
```
Ir a `http://localhost:3000`. El video debe aparecer con zoom-in, el logo centrado, y la flecha rebotando abajo. En mobile debe usar el video vertical.

- [ ] **Step 4: Commit**

```bash
git add src/components/Hero.tsx src/app/page.tsx
git commit -m "feat: add Hero section with video zoom-in animation and floating clouds"
```

---

## Task 4: Componente Stats

**Files:**
- Create: `src/components/Stats.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Crear un hook de count-up**

Crear `src/hooks/useCountUp.ts`:
```typescript
'use client'

import { useState, useEffect, useRef } from 'react'

export function useCountUp(target: number, duration = 2000, trigger: boolean) {
  const [count, setCount] = useState(0)
  const startTime = useRef<number | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (!trigger) return
    startTime.current = null

    const step = (timestamp: number) => {
      if (!startTime.current) startTime.current = timestamp
      const elapsed = timestamp - startTime.current
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress < 1) rafRef.current = requestAnimationFrame(step)
    }

    rafRef.current = requestAnimationFrame(step)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [target, duration, trigger])

  return count
}
```

- [ ] **Step 2: Escribir el test del hook**

Crear `__tests__/hooks/useCountUp.test.ts`:
```typescript
import { renderHook, act } from '@testing-library/react'
import { useCountUp } from '@/hooks/useCountUp'

describe('useCountUp', () => {
  beforeEach(() => jest.useFakeTimers())
  afterEach(() => jest.useRealTimers())

  it('starts at 0 when trigger is false', () => {
    const { result } = renderHook(() => useCountUp(100, 1000, false))
    expect(result.current).toBe(0)
  })

  it('reaches target value when trigger is true and animation completes', async () => {
    const { result } = renderHook(() => useCountUp(100, 100, true))
    act(() => jest.advanceTimersByTime(200))
    expect(result.current).toBe(100)
  })
})
```

- [ ] **Step 3: Ejecutar el test**

```bash
npx jest __tests__/hooks/useCountUp.test.ts -v
```
Esperado: PASS

- [ ] **Step 4: Crear el componente Stats**

Crear `src/components/Stats.tsx`:
```tsx
'use client'

import Image from 'next/image'
import { useRef, useState, useEffect } from 'react'
import { useCountUp } from '@/hooks/useCountUp'

const STATS = [
  { value: 15000, suffix: '+', label: 'Personas', icon: '🎉' },
  { value: 10,    suffix: '',  label: 'Artistas en vivo', icon: '🎸' },
  { value: 12,    suffix: '',  label: 'Horas de música', icon: '🎵' },
  { value: 2,     suffix: '',  label: 'Ediciones', icon: '⭐' },
]

function StatItem({ value, suffix, label, trigger }: {
  value: number; suffix: string; label: string; trigger: boolean
}) {
  const count = useCountUp(value, 2000, trigger)
  return (
    <div className="text-center">
      <p className="font-display text-5xl md:text-7xl text-vibra-orange drop-shadow-lg">
        {value >= 1000 ? count.toLocaleString('es-AR') : count}{suffix}
      </p>
      <p className="font-sans text-white/90 text-lg md:text-xl mt-2 tracking-wide uppercase">
        {label}
      </p>
    </div>
  )
}

export default function Stats() {
  const ref = useRef<HTMLDivElement>(null)
  const [triggered, setTriggered] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setTriggered(true) },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} className="relative vibra-texture py-24 px-4 overflow-hidden">
      <div className="max-w-5xl mx-auto">

        <h2 className="font-display text-4xl md:text-5xl text-center text-white mb-16 tracking-wider">
          Lo que fue Vibra Bolivia 2026
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {STATS.map((stat) => (
            <StatItem key={stat.label} {...stat} trigger={triggered} />
          ))}
        </div>
      </div>

      {/* Chiru decorativo */}
      <div className="absolute -bottom-4 right-4 md:right-16 w-32 md:w-48 pointer-events-none">
        <Image
          src="/assets/branding/Chiru png .png"
          alt="Chiru"
          width={192}
          height={192}
          className="animate-float"
        />
      </div>

      {/* Pasto */}
      <div className="absolute bottom-0 left-0 w-full pointer-events-none">
        <Image
          src="/assets/branding/IMG_3494.PNG"
          alt=""
          width={1440}
          height={80}
          className="w-full object-cover"
          aria-hidden="true"
        />
      </div>
    </section>
  )
}
```

- [ ] **Step 5: Agregar Stats a la página**

En `src/app/page.tsx`:
```tsx
import Hero from '@/components/Hero'
import Stats from '@/components/Stats'

export default function Home() {
  return (
    <main>
      <Hero />
      <Stats />
    </main>
  )
}
```

- [ ] **Step 6: Verificar en el navegador**

Ir a `http://localhost:3000` y hacer scroll hasta la sección de stats. Los números deben animarse al entrar en pantalla. Chiru aparece flotando en el borde inferior derecho.

- [ ] **Step 7: Commit**

```bash
git add src/components/Stats.tsx src/hooks/useCountUp.ts __tests__/hooks/useCountUp.test.ts src/app/page.tsx
git commit -m "feat: add Stats section with count-up animation on viewport entry"
```

---

## Task 5: Timeline de Artistas

**Files:**
- Create: `src/lib/timeline-data.ts`
- Create: `src/components/Timeline.tsx`
- Create: `__tests__/lib/timeline-data.test.ts`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Crear los datos del timeline**

Crear `src/lib/timeline-data.ts`:
```typescript
export interface TimelineEntry {
  time: string
  artist: string
  photoFolder: string
}

export const TIMELINE_2026: TimelineEntry[] = [
  { time: '15:00', artist: 'DJ Leo Balderrama',                       photoFolder: 'Dj y Animador' },
  { time: '15:20', artist: 'Adrián Deborah y los Dados Negros',       photoFolder: 'publico' },
  { time: '15:55', artist: 'Munay Llajta',                            photoFolder: 'Munay' },
  { time: '16:25', artist: 'Protección – Folklore de Bolivia',        photoFolder: 'publico' },
  { time: '17:25', artist: 'Los Capos',                               photoFolder: 'Los Capos' },
  { time: '18:30', artist: 'Grupo Femenino Bolivia',                  photoFolder: 'Grupo Femenino Bolivia' },
  { time: '19:30', artist: 'Turbo Mantikos',                          photoFolder: 'Turromanticos' },
  { time: '20:45', artist: 'Bonanza',                                 photoFolder: 'bonanza' },
  { time: '21:50', artist: 'Eclipse',                                 photoFolder: 'Eclipse' },
  { time: '23:05', artist: 'Los Chila Jatun',                         photoFolder: 'Chila Jatun' },
  { time: '00:20', artist: 'Los Ronisch',                             photoFolder: 'Los Ronish' },
]
```

- [ ] **Step 2: Escribir tests de los datos**

Crear `__tests__/lib/timeline-data.test.ts`:
```typescript
import { TIMELINE_2026 } from '@/lib/timeline-data'

describe('TIMELINE_2026', () => {
  it('has 11 entries', () => {
    expect(TIMELINE_2026).toHaveLength(11)
  })

  it('first entry is at 15:00', () => {
    expect(TIMELINE_2026[0].time).toBe('15:00')
  })

  it('last entry is at 00:20', () => {
    expect(TIMELINE_2026[TIMELINE_2026.length - 1].time).toBe('00:20')
  })

  it('every entry has time, artist and photoFolder', () => {
    TIMELINE_2026.forEach((entry) => {
      expect(entry.time).toBeTruthy()
      expect(entry.artist).toBeTruthy()
      expect(entry.photoFolder).toBeTruthy()
    })
  })
})
```

- [ ] **Step 3: Ejecutar los tests**

```bash
npx jest __tests__/lib/timeline-data.test.ts -v
```
Esperado: 4 tests en PASS

- [ ] **Step 4: Crear covers en cada carpeta de fotos**

Antes de crear el componente, asegurarse de que cada carpeta tiene un `cover.jpg`. Ejecutar desde PowerShell en la raíz del proyecto:
```powershell
$base = "public\assets\multimedia\Fotos-Vibra-Bolivia-2026"
$folders = Get-ChildItem $base -Directory
foreach ($folder in $folders) {
  $cover = Join-Path $folder.FullName 'cover.jpg'
  if (-not (Test-Path $cover)) {
    $first = Get-ChildItem $folder.FullName -File | Select-Object -First 1
    if ($first) { Copy-Item $first.FullName $cover }
  }
}
Write-Host "Covers creados en: $($folders.Count) carpetas"
```
Esperado: "Covers creados en: 12 carpetas"

- [ ] **Step 5: Crear el componente Timeline**

Crear `src/components/Timeline.tsx`:
```tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { TIMELINE_2026 } from '@/lib/timeline-data'

export default function Timeline() {
  const [active, setActive] = useState(0)

  const goNext = useCallback(() => {
    setActive((i) => Math.min(i + 1, TIMELINE_2026.length - 1))
  }, [])

  const goPrev = useCallback(() => {
    setActive((i) => Math.max(i - 1, 0))
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft')  goPrev()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [goNext, goPrev])

  const entry = TIMELINE_2026[active]

  return (
    <section className="bg-black/90 py-20 px-4">
      <div className="max-w-5xl mx-auto">

        <h2 className="font-display text-4xl md:text-5xl text-center text-white mb-4 tracking-wider">
          El Horario del 2026
        </h2>
        <p className="text-center text-white/50 text-sm mb-12">
          Usá ← → o tocá los puntos para navegar
        </p>

        {/* Foto del artista activo */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            className="relative w-full aspect-video rounded-2xl overflow-hidden mb-10 border border-white/10"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.35 }}
          >
            <Image
              src={`/assets/multimedia/Fotos-Vibra-Bolivia-2026/${entry.photoFolder}/cover.jpg`}
              alt={entry.artist}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute bottom-6 left-6">
              <span className="font-display text-vibra-orange text-3xl">{entry.time}</span>
              <p className="font-display text-white text-2xl mt-1">{entry.artist}</p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Botones de navegación */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={goPrev}
            disabled={active === 0}
            className="px-6 py-2 rounded-full border border-white/30 text-white disabled:opacity-30 hover:bg-white/10 transition font-display tracking-wider"
          >
            ← Anterior
          </button>
          <span className="text-white/50 text-sm">
            {active + 1} / {TIMELINE_2026.length}
          </span>
          <button
            onClick={goNext}
            disabled={active === TIMELINE_2026.length - 1}
            className="px-6 py-2 rounded-full border border-white/30 text-white disabled:opacity-30 hover:bg-white/10 transition font-display tracking-wider"
          >
            Siguiente →
          </button>
        </div>

        {/* Puntos del timeline */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 justify-start md:justify-center">
          {TIMELINE_2026.map((item, i) => (
            <button
              key={item.time}
              onClick={() => setActive(i)}
              className="flex flex-col items-center gap-1 min-w-[52px] group"
              aria-label={`${item.time} - ${item.artist}`}
            >
              <div className={`w-3 h-3 rounded-full transition-all ${
                i === active
                  ? 'bg-vibra-orange scale-150'
                  : 'bg-white/30 group-hover:bg-white/60'
              }`} />
              <span className={`text-[10px] font-mono transition-colors ${
                i === active ? 'text-vibra-orange' : 'text-white/40'
              }`}>
                {item.time}
              </span>
            </button>
          ))}
        </div>

      </div>
    </section>
  )
}
```

- [ ] **Step 6: Agregar Timeline a la página**

En `src/app/page.tsx`:
```tsx
import Hero from '@/components/Hero'
import Stats from '@/components/Stats'
import Timeline from '@/components/Timeline'

export default function Home() {
  return (
    <main>
      <Hero />
      <Stats />
      <Timeline />
    </main>
  )
}
```

- [ ] **Step 7: Verificar navegación**

En el navegador: hacer scroll al timeline, usar ← → del teclado y los botones. Las fotos deben cambiar con transición. Verificar en mobile que los botones funcionan con touch.

- [ ] **Step 8: Commit**

```bash
git add src/components/Timeline.tsx src/lib/timeline-data.ts __tests__/lib/timeline-data.test.ts src/app/page.tsx
git commit -m "feat: add interactive timeline with keyboard navigation and artist photos"
```

---

## Task 6: Aftermovie YouTube + Spotify

**Files:**
- Create: `src/components/Aftermovie.tsx`
- Create: `src/components/SpotifyPlayer.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Crear el componente Aftermovie**

Crear `src/components/Aftermovie.tsx`:
```tsx
export default function Aftermovie() {
  return (
    <section className="bg-black py-20 px-4">
      <div className="max-w-4xl mx-auto">

        <h2 className="font-display text-4xl md:text-5xl text-center text-white mb-4 tracking-wider">
          Reviví la 2da Edición
        </h2>
        <p className="text-center text-white/60 mb-10 text-lg">
          Vibra Bolivia 2026 — Aftermovie Oficial
        </p>

        {/* Ventana tipo cine */}
        <div className="rounded-2xl overflow-hidden border-2 border-vibra-orange/60 shadow-[0_0_40px_rgba(245,160,32,0.25)]">
          <div className="relative aspect-video w-full">
            <iframe
              src="https://www.youtube.com/embed/FHAXjtf_iOA?rel=0&modestbranding=1"
              title="Vibra Bolivia 2026 Aftermovie"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
        </div>

      </div>
    </section>
  )
}
```

- [ ] **Step 2: Crear el componente SpotifyPlayer**

Crear `src/components/SpotifyPlayer.tsx`:
```tsx
export default function SpotifyPlayer() {
  return (
    <section className="vibra-texture py-20 px-4">
      <div className="max-w-4xl mx-auto">

        <h2 className="font-display text-4xl md:text-5xl text-center text-white mb-4 tracking-wider">
          La Música del Festival
        </h2>
        <p className="text-center text-white/70 mb-10 text-lg">
          Escuchá la playlist oficial de Vibra Bolivia
        </p>

        <div className="rounded-2xl overflow-hidden border-2 border-vibra-blue/50 shadow-[0_0_40px_rgba(79,195,247,0.2)]">
          <iframe
            src="https://open.spotify.com/embed/playlist/5HIpNO8FbzDDGhHdyRLvib?utm_source=generator&theme=0"
            width="100%"
            height="380"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="block"
            title="Playlist oficial Vibra Bolivia"
          />
        </div>

      </div>
    </section>
  )
}
```

- [ ] **Step 3: Agregar ambas secciones a la página**

En `src/app/page.tsx`:
```tsx
import Hero from '@/components/Hero'
import Stats from '@/components/Stats'
import Timeline from '@/components/Timeline'
import Aftermovie from '@/components/Aftermovie'
import SpotifyPlayer from '@/components/SpotifyPlayer'

export default function Home() {
  return (
    <main>
      <Hero />
      <Stats />
      <Timeline />
      <Aftermovie />
      <SpotifyPlayer />
    </main>
  )
}
```

- [ ] **Step 4: Verificar embeds en el navegador**

El video de YouTube debe reproducirse al hacer click. La playlist de Spotify debe mostrar los tracks y permitir reproducir previews. Ambos deben tener el borde con brillo de color de marca.

- [ ] **Step 5: Commit**

```bash
git add src/components/Aftermovie.tsx src/components/SpotifyPlayer.tsx src/app/page.tsx
git commit -m "feat: add YouTube aftermovie and Spotify playlist sections"
```

---

## Task 7: Redes Sociales

**Files:**
- Create: `src/components/SocialMedia.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Crear el componente SocialMedia**

Crear `src/components/SocialMedia.tsx`:
```tsx
'use client'

import { useEffect } from 'react'

const IG_REELS = [
  'https://www.instagram.com/reel/DWKREqyEfF3/',
  'https://www.instagram.com/reel/DWLPeq4jGrN/',
]

const TIKTOK_VIDEOS = [
  { id: '7620189048388193557', url: 'https://www.tiktok.com/@vibra.bolivia/video/7620189048388193557' },
  { id: '7619917081307286805', url: 'https://www.tiktok.com/@vibra.bolivia/video/7619917081307286805' },
]

function InstagramEmbed({ url }: { url: string }) {
  useEffect(() => {
    // Carga el script de Instagram para procesar los embeds
    if (typeof window !== 'undefined' && !(window as any).instgrm) {
      const script = document.createElement('script')
      script.src = 'https://www.instagram.com/embed.js'
      script.async = true
      document.body.appendChild(script)
    } else if ((window as any).instgrm) {
      (window as any).instgrm.Embeds.process()
    }
  }, [url])

  return (
    <blockquote
      className="instagram-media w-full max-w-full"
      data-instgrm-captioned
      data-instgrm-permalink={url}
      data-instgrm-version="14"
      style={{ minWidth: '260px', width: '100%' }}
    />
  )
}

function TikTokEmbed({ id }: { id: string }) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const script = document.createElement('script')
      script.src = 'https://www.tiktok.com/embed.js'
      script.async = true
      document.body.appendChild(script)
    }
  }, [id])

  return (
    <blockquote
      className="tiktok-embed w-full"
      cite={`https://www.tiktok.com/@vibra.bolivia/video/${id}`}
      data-video-id={id}
      style={{ minWidth: '260px', width: '100%' }}
    >
      <section />
    </blockquote>
  )
}

export default function SocialMedia() {
  return (
    <section className="bg-black/95 py-20 px-4">
      <div className="max-w-5xl mx-auto">

        <h2 className="font-display text-4xl md:text-5xl text-center text-white mb-4 tracking-wider">
          Seguinos en Redes
        </h2>
        <p className="text-center text-white/50 mb-12 text-lg">
          El festival también pasa online
        </p>

        <div className="grid md:grid-cols-2 gap-12">

          {/* Instagram */}
          <div>
            <h3 className="font-display text-2xl text-white mb-6 text-center tracking-wide">
              Instagram
            </h3>
            <div className="space-y-4">
              {IG_REELS.map((url) => (
                <InstagramEmbed key={url} url={url} />
              ))}
            </div>
            <div className="text-center mt-6">
              <a
                href="https://www.instagram.com/vibra.bolivia"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-3 bg-vibra-pink text-white font-display text-xl tracking-wider rounded-full hover:opacity-90 transition"
              >
                Seguinos en Instagram
              </a>
            </div>
          </div>

          {/* TikTok */}
          <div>
            <h3 className="font-display text-2xl text-white mb-6 text-center tracking-wide">
              TikTok
            </h3>
            <div className="space-y-4">
              {TIKTOK_VIDEOS.map(({ id }) => (
                <TikTokEmbed key={id} id={id} />
              ))}
            </div>
            <div className="text-center mt-6">
              <a
                href="https://www.tiktok.com/@vibra.bolivia"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-3 bg-black border-2 border-white text-white font-display text-xl tracking-wider rounded-full hover:bg-white hover:text-black transition"
              >
                Seguinos en TikTok
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Agregar SocialMedia a la página**

En `src/app/page.tsx`:
```tsx
import Hero from '@/components/Hero'
import Stats from '@/components/Stats'
import Timeline from '@/components/Timeline'
import Aftermovie from '@/components/Aftermovie'
import SpotifyPlayer from '@/components/SpotifyPlayer'
import SocialMedia from '@/components/SocialMedia'

export default function Home() {
  return (
    <main>
      <Hero />
      <Stats />
      <Timeline />
      <Aftermovie />
      <SpotifyPlayer />
      <SocialMedia />
    </main>
  )
}
```

- [ ] **Step 3: Verificar en el navegador**

Los reels de Instagram y los videos de TikTok deben cargarse. Si los embeds de Instagram no aparecen (Meta requiere aprobación de dominio), los blockquotes van a estar vacíos — esto es esperado en localhost. En producción con dominio propio funcionan bien.

- [ ] **Step 4: Commit**

```bash
git add src/components/SocialMedia.tsx src/app/page.tsx
git commit -m "feat: add social media section with Instagram and TikTok embeds"
```

---

## Task 8: Teaser 2027

**Files:**
- Create: `src/components/Teaser2027.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Crear el componente Teaser2027**

Crear `src/components/Teaser2027.tsx`:
```tsx
'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

export default function Teaser2027() {
  return (
    <section className="relative vibra-texture py-28 px-4 overflow-hidden">

      {/* Fondo con overlay */}
      <div className="absolute inset-0 bg-vibra-purple/40" />

      {/* Nubes */}
      <Image
        src="/assets/branding/IMG_3495.PNG"
        alt=""
        width={180}
        height={110}
        className="absolute top-8 left-6 opacity-70 animate-float hidden md:block"
        aria-hidden="true"
      />
      <Image
        src="/assets/branding/IMG_3495.PNG"
        alt=""
        width={140}
        height={85}
        className="absolute top-16 right-8 opacity-60 animate-float_slow hidden md:block"
        aria-hidden="true"
      />

      {/* Montañas */}
      <div className="absolute bottom-0 left-0 w-full pointer-events-none">
        <Image
          src="/assets/branding/IMG_3496.PNG"
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
          src="/assets/branding/IMG_3494.PNG"
          alt=""
          width={1440}
          height={80}
          className="w-full object-cover"
          aria-hidden="true"
        />
      </div>

      {/* Contenido */}
      <div className="relative z-10 flex flex-col items-center text-center">

        {/* Chiru animado — si hay mp4 se usa, sino el PNG */}
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
```

- [ ] **Step 2: Agregar Teaser2027 a la página**

En `src/app/page.tsx`:
```tsx
import Hero from '@/components/Hero'
import Stats from '@/components/Stats'
import Timeline from '@/components/Timeline'
import Aftermovie from '@/components/Aftermovie'
import SpotifyPlayer from '@/components/SpotifyPlayer'
import SocialMedia from '@/components/SocialMedia'
import Teaser2027 from '@/components/Teaser2027'

export default function Home() {
  return (
    <main>
      <Hero />
      <Stats />
      <Timeline />
      <Aftermovie />
      <SpotifyPlayer />
      <SocialMedia />
      <Teaser2027 />
    </main>
  )
}
```

- [ ] **Step 3: Verificar en el navegador**

Chiru debe flotar animado. El "2027 Se viene" debe aparecer con animación al entrar en viewport. Las montañas y pasto deben decorar el fondo.

- [ ] **Step 4: Commit**

```bash
git add src/components/Teaser2027.tsx src/app/page.tsx
git commit -m "feat: add Teaser 2027 section with animated Chiru and scroll reveal"
```

---

## Task 9: Registro de Email + Supabase

**Files:**
- Create: `src/lib/supabase.ts`
- Create: `src/app/api/subscribe/route.ts`
- Create: `src/components/EmailRegister.tsx`
- Create: `__tests__/api/subscribe.test.ts`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Crear el cliente Supabase**

Crear `src/lib/supabase.ts`:
```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)
```

- [ ] **Step 2: Crear la tabla en Supabase**

En el dashboard de Supabase (supabase.com → tu proyecto → Table Editor), ejecutar en el SQL Editor:
```sql
create table if not exists subscribers (
  id          uuid primary key default gen_random_uuid(),
  email       text not null unique,
  source      text default 'landing',
  created_at  timestamptz default now()
);
```

- [ ] **Step 3: Crear el API route**

Crear `src/app/api/subscribe/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)

  if (!body?.email) {
    return NextResponse.json({ error: 'Email requerido' }, { status: 400 })
  }

  if (!isValidEmail(body.email)) {
    return NextResponse.json({ error: 'Email inválido' }, { status: 400 })
  }

  const { error } = await supabase
    .from('subscribers')
    .insert({ email: body.email.toLowerCase().trim(), source: 'landing' })

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Este email ya está registrado' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Error al guardar' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
```

- [ ] **Step 4: Escribir tests del API route**

Crear `__tests__/api/subscribe.test.ts`:
```typescript
import { POST } from '@/app/api/subscribe/route'
import { NextRequest } from 'next/server'

// Mock de Supabase
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn().mockReturnValue({
      insert: jest.fn().mockResolvedValue({ error: null }),
    }),
  },
}))

function makeRequest(body: unknown) {
  return new NextRequest('http://localhost/api/subscribe', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })
}

describe('POST /api/subscribe', () => {
  it('returns 400 when email is missing', async () => {
    const res = await POST(makeRequest({}))
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toBe('Email requerido')
  })

  it('returns 400 when email format is invalid', async () => {
    const res = await POST(makeRequest({ email: 'not-an-email' }))
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toBe('Email inválido')
  })

  it('returns 200 with ok:true for valid email', async () => {
    const res = await POST(makeRequest({ email: 'test@example.com' }))
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.ok).toBe(true)
  })
})
```

- [ ] **Step 5: Ejecutar los tests**

```bash
npx jest __tests__/api/subscribe.test.ts -v
```
Esperado: 3 tests en PASS

- [ ] **Step 6: Crear el componente EmailRegister**

Crear `src/components/EmailRegister.tsx`:
```tsx
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

      {/* Pasto al fondo */}
      <div className="absolute bottom-0 left-0 w-full pointer-events-none">
        <Image
          src="/assets/branding/IMG_3494.PNG"
          alt=""
          width={1440}
          height={80}
          className="w-full object-cover"
          aria-hidden="true"
        />
      </div>

      <div className="relative z-10 max-w-lg mx-auto text-center">

        <Image
          src="/assets/multimedia/vibra png.png"
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
```

- [ ] **Step 7: Agregar EmailRegister a la página (ensamble final)**

Reemplazar `src/app/page.tsx` con la versión final:
```tsx
import Hero from '@/components/Hero'
import Stats from '@/components/Stats'
import Timeline from '@/components/Timeline'
import Aftermovie from '@/components/Aftermovie'
import SpotifyPlayer from '@/components/SpotifyPlayer'
import SocialMedia from '@/components/SocialMedia'
import Teaser2027 from '@/components/Teaser2027'
import EmailRegister from '@/components/EmailRegister'

export default function Home() {
  return (
    <main>
      <Hero />
      <Stats />
      <Timeline />
      <Aftermovie />
      <SpotifyPlayer />
      <SocialMedia />
      <Teaser2027 />
      <EmailRegister />
    </main>
  )
}
```

- [ ] **Step 8: Probar el formulario completo**

1. Ir a `http://localhost:3000`, hacer scroll al final
2. Ingresar un email válido y enviar — debe aparecer el mensaje de éxito
3. Verificar en Supabase → Table Editor → `subscribers` que el registro existe
4. Intentar enviar el mismo email — debe aparecer "Este email ya está registrado"
5. Intentar enviar sin email o con formato inválido — debe mostrar el error

- [ ] **Step 9: Commit**

```bash
git add src/lib/supabase.ts src/app/api/subscribe/route.ts src/components/EmailRegister.tsx __tests__/api/subscribe.test.ts src/app/page.tsx
git commit -m "feat: add email registration with Supabase integration and validation"
```

---

## Task 10: Deploy a Vercel

**Files:** Solo configuración externa, no hay archivos nuevos.

- [ ] **Step 1: Crear repositorio en GitHub**

En github.com → New repository → nombre: `vibra-bolivia` → privado → Create.

- [ ] **Step 2: Subir el código**

```bash
git remote add origin https://github.com/TU_USUARIO/vibra-bolivia.git
git push -u origin master
```

- [ ] **Step 3: Conectar Vercel**

1. Ir a vercel.com → New Project → Import Git Repository → seleccionar `vibra-bolivia`
2. Framework Preset: **Next.js** (lo detecta automáticamente)
3. En **Environment Variables**, agregar:
   - `NEXT_PUBLIC_SUPABASE_URL` = (el valor de tu .env.local)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (el valor de tu .env.local)
4. Click en **Deploy**

- [ ] **Step 4: Verificar el deploy**

Una vez desplegado, Vercel da una URL del tipo `vibra-bolivia-xxx.vercel.app`. Abrir en el navegador y verificar:
- El video hero carga y hace zoom-in
- Las estadísticas se animan al scrollear
- El timeline navega con teclado
- Los embeds de YouTube y Spotify funcionan
- El formulario de email funciona (probar con un email real)

- [ ] **Step 5: Commit final**

```bash
git add .
git commit -m "chore: production-ready — all sections working on Vercel"
git push
```

---

## Orden de Implementación Recomendado

```
Task 1 → Task 2 → Task 3 → Task 4 → Task 5 → Task 6 → Task 7 → Task 8 → Task 9 → Task 10
```

Cada task produce código funcional visible en el navegador. No avanzar al siguiente hasta que el anterior se vea bien en `localhost:3000`.
