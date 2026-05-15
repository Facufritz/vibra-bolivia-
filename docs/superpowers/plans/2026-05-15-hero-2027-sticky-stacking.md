# Hero 2027 + Sticky Scroll Stacking — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Pivot the Hero copy to announce Vibra Bolivia 2027 and introduce a sticky scroll stacking effect across all sections, with mobile-specific layout refinements for Hero and Stats.

**Architecture:** Each top-level section becomes `position: sticky; top: 0; min-h-screen`. Sections after the Hero get `rounded-t-3xl` + a subtle shadow + a negative top margin so each one slides up over the previous with rounded corners. As the next section covers the previous, a `<motion.div>` overlay in the previous section fades from 0 to 0.35 opacity using `useScroll` + `useTransform`. The Hero is also sticky (without rounded corners — it's the first). `prefers-reduced-motion` disables the sticky and overlay. Backgrounds, palette, and section content stay untouched.

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind CSS, Framer Motion (`useScroll`, `useTransform`, `useReducedMotion`), Jest + React Testing Library.

**Spec:** `docs/superpowers/specs/2026-05-15-hero-2027-sticky-stacking-design.md`

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `src/components/SectionWrapper.tsx` | Modify | Add sticky + rounded top + shadow + progressive dark overlay; respect reduced-motion |
| `src/components/Hero.tsx` | Modify | New copy with 2027 highlighted; mobile layout to top-left; sticky + overlay (no rounded — first section) |
| `src/components/Stats.tsx` | Modify | Chiru responsive: desktop absolute (today), mobile centered below grid |
| `src/app/page.tsx` | Verify only | Confirm `<main>` has no `overflow-hidden` ancestor break |
| `__tests__/components/SectionWrapper.test.tsx` | Create | Smoke tests for sticky classes + overlay presence |
| `__tests__/components/Hero.test.tsx` | Create | Tests for new copy + 2027 highlight |
| `__tests__/components/Stats.test.tsx` | Create | Tests for Chiru responsive duplication |

---

## Task 1 — Hero copy + mobile layout (no sticky yet)

Isolate the copy and mobile-position changes from the sticky mechanic. This lets us verify the copy change in isolation before touching scroll behavior.

**Files:**
- Create: `__tests__/components/Hero.test.tsx`
- Modify: `src/components/Hero.tsx` (lines 55-72)

- [ ] **Step 1.1: Create the test file with failing copy tests**

Create `__tests__/components/Hero.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import Hero from '@/components/Hero'

// Mock framer-motion to avoid scroll-context complaints in jsdom
jest.mock('framer-motion', () => {
  const actual = jest.requireActual('framer-motion')
  return {
    ...actual,
    useScroll: () => ({ scrollYProgress: { get: () => 0, on: () => () => {} } }),
    useTransform: () => 0,
    useReducedMotion: () => false,
  }
})

describe('Hero', () => {
  it('renders the new 2027 copy with both lines', () => {
    render(<Hero />)
    expect(screen.getByText(/viene con todo/i)).toBeInTheDocument()
    expect(screen.getByText(/algo grande se está armando/i)).toBeInTheDocument()
  })

  it('highlights 2027 in vibra-orange', () => {
    render(<Hero />)
    const orange = screen.getByText('2027')
    expect(orange).toHaveClass('text-vibra-orange')
  })

  it('positions content top-left on mobile and centered-left on md+', () => {
    const { container } = render(<Hero />)
    // The content wrapper should have both responsive position classes
    const content = container.querySelector('[class*="top-24"]')
    expect(content).not.toBeNull()
    expect(content?.className).toMatch(/md:top-1\/2/)
    expect(content?.className).toMatch(/md:-translate-y-1\/2/)
  })
})
```

- [ ] **Step 1.2: Run the test to confirm it fails**

Run: `npx jest __tests__/components/Hero.test.tsx -v`
Expected: FAIL — the current copy is "El festival que le devolvió..." not the new one.

- [ ] **Step 1.3: Update Hero.tsx with the new copy and mobile position**

In `src/components/Hero.tsx`, replace lines 55-72 (the content `motion.div`):

```tsx
      {/* Contenido — mobile top-left, desktop centro-izquierda */}
      <motion.div
        className="absolute top-24 left-4 md:top-1/2 md:-translate-y-1/2 md:left-16 lg:left-24 z-40 max-w-xl"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.5 }}
      >
        <Image
          src="/assets/multimedia/vibra%20png.png"
          alt="Vibra Bolivia"
          width={320}
          height={138}
          className="mb-5 w-44 md:w-64 lg:w-80"
          priority
        />
        <p className="font-display text-2xl md:text-4xl lg:text-5xl text-white tracking-wide drop-shadow-lg leading-tight">
          <span className="text-vibra-orange">2027</span> viene con todo<br />
          Algo grande se está armando
        </p>
      </motion.div>
```

Three changes vs current:
1. Position: `top-24 left-4` for mobile, `md:top-1/2 md:-translate-y-1/2 md:left-16 lg:left-24` for desktop (was `top-1/2 -translate-y-1/2 left-8 md:left-16 lg:left-24`)
2. Copy: new 2027 teaser with `<span className="text-vibra-orange">2027</span>`
3. `<br />` is always visible (was `<br className="hidden md:block" />`)

- [ ] **Step 1.4: Run the test to confirm it passes**

Run: `npx jest __tests__/components/Hero.test.tsx -v`
Expected: PASS (3 tests).

- [ ] **Step 1.5: Commit**

```bash
git add __tests__/components/Hero.test.tsx src/components/Hero.tsx
git commit -m "feat(hero): pivot copy to 2027 teaser + mobile top-left layout

Hero copy changes from 2026 retrospective to 2027 teaser:
'2027 viene con todo / Algo grande se está armando'. 2027
highlighted in vibra-orange. On mobile the content block moves
from vertically-centered to top-left (top-24 left-4) so the
video's lower-half action stays visible. <br /> now always
renders (was desktop-only) so mobile keeps two short lines.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 2 — Stats Chiru responsive

Independent of sticky. Tackles the mobile overlap with "EDICIONES" first.

**Files:**
- Create: `__tests__/components/Stats.test.tsx`
- Modify: `src/components/Stats.tsx` (lines 57-65)

- [ ] **Step 2.1: Create the test file with failing tests**

Create `__tests__/components/Stats.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import Stats from '@/components/Stats'

jest.mock('framer-motion', () => {
  const actual = jest.requireActual('framer-motion')
  return {
    ...actual,
    useScroll: () => ({ scrollYProgress: { get: () => 0, on: () => () => {} } }),
    useTransform: () => 0,
    useReducedMotion: () => false,
  }
})

describe('Stats', () => {
  it('renders both desktop and mobile Chiru variants', () => {
    const { container } = render(<Stats />)
    const chirus = container.querySelectorAll('img[alt="Chiru"]')
    expect(chirus.length).toBe(2)
  })

  it('hides one Chiru on mobile and the other on desktop', () => {
    const { container } = render(<Stats />)
    const desktopWrapper = container.querySelector('[class*="hidden"][class*="md:block"]')
    const mobileWrapper = container.querySelector('[class*="md:hidden"]')
    expect(desktopWrapper).not.toBeNull()
    expect(mobileWrapper).not.toBeNull()
  })
})
```

- [ ] **Step 2.2: Run the test to confirm it fails**

Run: `npx jest __tests__/components/Stats.test.tsx -v`
Expected: FAIL — only one Chiru renders today.

- [ ] **Step 2.3: Update Stats.tsx with responsive Chiru**

In `src/components/Stats.tsx`, replace lines 57-65 (the Chiru block):

```tsx
      {/* Chiru desktop — md+ esquina inferior derecha */}
      <div className="hidden md:block absolute bottom-16 right-4 md:right-16 w-32 md:w-48 pointer-events-none z-40">
        <Image
          src="/assets/branding/Chiru%20png%20.png"
          alt="Chiru"
          width={192}
          height={192}
          className="animate-float"
        />
      </div>

      {/* Chiru mobile — centrado debajo de la grilla */}
      <div className="md:hidden flex justify-center mt-12 pointer-events-none">
        <Image
          src="/assets/branding/Chiru%20png%20.png"
          alt="Chiru"
          width={128}
          height={128}
          className="animate-float w-32"
        />
      </div>
```

Note: the mobile Chiru is a normal flow element (`flex justify-center mt-12`), not `absolute`. It renders inside the same `<SectionWrapper>` children after the grid div closes, so it sits below the stats.

- [ ] **Step 2.4: Run the test to confirm it passes**

Run: `npx jest __tests__/components/Stats.test.tsx -v`
Expected: PASS (2 tests).

- [ ] **Step 2.5: Run full test suite to confirm nothing else broke**

Run: `npm test`
Expected: All tests pass.

- [ ] **Step 2.6: Commit**

```bash
git add __tests__/components/Stats.test.tsx src/components/Stats.tsx
git commit -m "fix(stats): make Chiru responsive to avoid mobile overlap

On mobile Chiru was absolute bottom-right and overlapped the
EDICIONES label of the 4th stat. Now we render two Chirus with
responsive visibility: desktop (md+) keeps the current absolute
positioning, mobile shows Chiru centered in normal flow below
the stats grid.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 3 — SectionWrapper sticky + overlay

The foundation of the scroll effect. After this, all sections that use `SectionWrapper` (Stats, Aftermovie, Timeline, SpotifyPlayer, EmailRegister) automatically gain the sticky stacking behavior. Hero handles itself separately in Task 4.

**Files:**
- Create: `__tests__/components/SectionWrapper.test.tsx`
- Modify: `src/components/SectionWrapper.tsx` (full file)

- [ ] **Step 3.1: Create the test file with failing tests**

Create `__tests__/components/SectionWrapper.test.tsx`:

```tsx
import { render } from '@testing-library/react'
import SectionWrapper from '@/components/SectionWrapper'

// Mock framer-motion so jsdom doesn't choke on scroll context
jest.mock('framer-motion', () => {
  const actual = jest.requireActual('framer-motion')
  return {
    ...actual,
    useScroll: () => ({ scrollYProgress: { get: () => 0, on: () => () => {} } }),
    useTransform: () => 0,
    useReducedMotion: () => false,
  }
})

describe('SectionWrapper', () => {
  it('applies sticky + min-h-screen + rounded-t classes by default', () => {
    const { container } = render(<SectionWrapper>content</SectionWrapper>)
    const section = container.querySelector('section')
    expect(section?.className).toMatch(/sticky/)
    expect(section?.className).toMatch(/top-0/)
    expect(section?.className).toMatch(/min-h-screen/)
    expect(section?.className).toMatch(/rounded-t-3xl/)
  })

  it('omits rounded-t and negative margin when isFirst is true', () => {
    const { container } = render(<SectionWrapper isFirst>content</SectionWrapper>)
    const section = container.querySelector('section')
    expect(section?.className).not.toMatch(/rounded-t-3xl/)
    expect(section?.className).not.toMatch(/-mt-6/)
  })

  it('renders the dark overlay div', () => {
    const { container } = render(<SectionWrapper>content</SectionWrapper>)
    const overlay = container.querySelector('[data-testid="dark-overlay"]')
    expect(overlay).not.toBeNull()
  })

  it('disables sticky and overlay when reduced-motion is set', () => {
    // Re-mock useReducedMotion for this test
    jest.resetModules()
    jest.doMock('framer-motion', () => {
      const actual = jest.requireActual('framer-motion')
      return {
        ...actual,
        useScroll: () => ({ scrollYProgress: { get: () => 0, on: () => () => {} } }),
        useTransform: () => 0,
        useReducedMotion: () => true,
      }
    })
    const { default: SectionWrapperReduced } = require('@/components/SectionWrapper')
    const { container } = render(<SectionWrapperReduced>content</SectionWrapperReduced>)
    const section = container.querySelector('section')
    expect(section?.className).not.toMatch(/sticky/)
    const overlay = container.querySelector('[data-testid="dark-overlay"]')
    expect(overlay).toBeNull()
  })
})
```

- [ ] **Step 3.2: Run the test to confirm it fails**

Run: `npx jest __tests__/components/SectionWrapper.test.tsx -v`
Expected: FAIL — sticky classes don't exist yet.

- [ ] **Step 3.3: Rewrite SectionWrapper.tsx with sticky + overlay**

Replace the full file at `src/components/SectionWrapper.tsx`:

```tsx
'use client'

import React, { useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'

interface SectionWrapperProps {
  children: React.ReactNode
  className?: string
  clouds?: boolean
  grassBottom?: boolean
  mountainsBottom?: boolean
  parallax?: boolean
  isFirst?: boolean
}

export default function SectionWrapper({
  children,
  className,
  clouds = false,
  grassBottom = false,
  mountainsBottom = false,
  parallax = false,
  isFirst = false,
}: SectionWrapperProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  // Subtle vertical drift for parallax clouds
  const cloudY = useTransform(scrollYProgress, [0, 1], ['-15px', '15px'])

  // Dark overlay opacity ramps as the next section covers this one
  const darkOverlayOpacity = useTransform(scrollYProgress, [0, 1], [0, 0.35])

  // Extra bottom padding so children don't sit under decorative assets
  const contentPb = mountainsBottom ? 'pb-56 md:pb-48' : grassBottom ? 'pb-20 md:pb-28' : ''

  // Sticky stacking classes — disabled when user prefers reduced motion
  const stickyClasses = reduceMotion
    ? 'relative'
    : `sticky top-0 min-h-screen ${isFirst ? '' : 'rounded-t-3xl shadow-[0_-20px_40px_rgba(0,0,0,0.15)] -mt-6'}`

  return (
    <section ref={sectionRef} className={`${stickyClasses} relative overflow-hidden`}>
      {/* Brand texture base */}
      <div className="absolute inset-0 vibra-texture" />
      {/* Purple brand tint over texture */}
      <div className="absolute inset-0 bg-vibra-purple/30" />

      {/* Clouds — desktop only, positioned with % to survive any viewport width */}
      {clouds && (
        <>
          {parallax ? (
            <>
              <motion.div
                style={{ y: cloudY }}
                className="absolute left-[2%] top-[8%] z-10 hidden md:block pointer-events-none"
              >
                <Image
                  src="/assets/branding/IMG_3495.png"
                  alt=""
                  width={180}
                  height={108}
                  aria-hidden="true"
                />
              </motion.div>
              <motion.div
                style={{ y: cloudY }}
                className="absolute right-[2%] top-[12%] z-10 hidden md:block pointer-events-none"
              >
                <Image
                  src="/assets/branding/IMG_3495.png"
                  alt=""
                  width={140}
                  height={84}
                  aria-hidden="true"
                />
              </motion.div>
            </>
          ) : (
            <>
              <div className="absolute left-[2%] top-[8%] z-10 hidden md:block pointer-events-none">
                <Image
                  src="/assets/branding/IMG_3495.png"
                  alt=""
                  width={180}
                  height={108}
                  className="animate-float"
                  aria-hidden="true"
                />
              </div>
              <div className="absolute right-[2%] top-[12%] z-10 hidden md:block pointer-events-none">
                <Image
                  src="/assets/branding/IMG_3495.png"
                  alt=""
                  width={140}
                  height={84}
                  className="animate-float_slow"
                  aria-hidden="true"
                />
              </div>
            </>
          )}
        </>
      )}

      {/* Children sit above overlays and clouds */}
      <div className={`relative z-30 py-20 px-4 ${contentPb} ${className ?? ''}`}>
        {children}
      </div>

      {/* Bottom decorative assets — altura fija + overflow-hidden */}
      {mountainsBottom && (
        <div className="absolute bottom-0 left-0 w-full z-10 pointer-events-none overflow-hidden h-28 md:h-40 lg:h-52">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/branding/IMG_3496.png"
            alt=""
            aria-hidden="true"
            className="absolute bottom-0 left-0 w-full h-auto opacity-80"
          />
        </div>
      )}
      {grassBottom && (
        <div className="absolute bottom-0 left-0 w-full z-20 pointer-events-none overflow-hidden h-16 md:h-24 lg:h-28">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/branding/IMG_3494.png"
            alt=""
            aria-hidden="true"
            className="absolute bottom-0 left-0 w-full h-auto"
          />
        </div>
      )}

      {/* Progressive dark overlay — fades in as the next section covers this one */}
      {!reduceMotion && (
        <motion.div
          data-testid="dark-overlay"
          style={{ opacity: darkOverlayOpacity }}
          className="absolute inset-0 z-40 bg-black pointer-events-none"
          aria-hidden="true"
        />
      )}
    </section>
  )
}
```

Key changes vs current SectionWrapper:
1. New prop `isFirst?: boolean` (used by Hero or any caller that wants no rounded top).
2. New `useReducedMotion()` hook from framer-motion.
3. `stickyClasses` computed string: when reduced-motion is on, just `relative`; otherwise `sticky top-0 min-h-screen` plus (if not first) `rounded-t-3xl shadow-[...] -mt-6`.
4. New `darkOverlayOpacity` interpolation via `useTransform(scrollYProgress, [0, 1], [0, 0.35])`.
5. New `<motion.div data-testid="dark-overlay">` at the end, conditionally rendered when reduced-motion is OFF.

- [ ] **Step 3.4: Run the test to confirm it passes**

Run: `npx jest __tests__/components/SectionWrapper.test.tsx -v`
Expected: PASS (4 tests).

- [ ] **Step 3.5: Run full test suite — sanity check**

Run: `npm test`
Expected: All tests pass (Hero, Stats, SectionWrapper, plus pre-existing).

- [ ] **Step 3.6: Commit**

```bash
git add __tests__/components/SectionWrapper.test.tsx src/components/SectionWrapper.tsx
git commit -m "feat(sections): sticky scroll stacking with progressive overlay

SectionWrapper now applies position: sticky, top: 0, min-h-screen,
rounded-t-3xl, and a subtle shadow so each section slides up over
the previous one with rounded corners. As the next section covers,
a black overlay in the previous one fades from 0 to 0.35 opacity
via framer-motion useScroll/useTransform.

Adds isFirst prop to skip rounded top + negative margin on the
first sticky section (Hero will use it).

Respects prefers-reduced-motion: when enabled, sticky becomes
relative and the dark overlay is omitted — scroll falls back to
the original linear behavior.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 4 — Hero sticky + overlay

Hero is a standalone `<section>` (not via SectionWrapper). We mirror the sticky + overlay logic inline so it participates in the stack.

**Files:**
- Modify: `src/components/Hero.tsx` (whole file)
- Modify: `__tests__/components/Hero.test.tsx` (add sticky test)

- [ ] **Step 4.1: Add the sticky-presence test to Hero.test.tsx**

Append to `__tests__/components/Hero.test.tsx`:

```tsx
  it('applies sticky + min-h-screen classes to the section', () => {
    const { container } = render(<Hero />)
    const section = container.querySelector('section')
    expect(section?.className).toMatch(/sticky/)
    expect(section?.className).toMatch(/top-0/)
    expect(section?.className).toMatch(/min-h-screen/)
  })

  it('does not apply rounded-t (Hero is the first section)', () => {
    const { container } = render(<Hero />)
    const section = container.querySelector('section')
    expect(section?.className).not.toMatch(/rounded-t-3xl/)
  })

  it('renders the dark overlay div', () => {
    const { container } = render(<Hero />)
    const overlay = container.querySelector('[data-testid="dark-overlay"]')
    expect(overlay).not.toBeNull()
  })
```

- [ ] **Step 4.2: Run the test to confirm it fails**

Run: `npx jest __tests__/components/Hero.test.tsx -v`
Expected: 3 new tests FAIL — Hero is `h-screen overflow-hidden`, not sticky.

- [ ] **Step 4.3: Rewrite Hero.tsx with sticky + overlay**

Replace the full file at `src/components/Hero.tsx`:

```tsx
'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  const darkOverlayOpacity = useTransform(scrollYProgress, [0, 1], [0, 0.35])

  const stickyClasses = reduceMotion
    ? 'relative h-screen'
    : 'sticky top-0 min-h-screen'

  return (
    <section ref={sectionRef} className={`${stickyClasses} w-full overflow-hidden`}>

      {/* Fondo estático — visible mientras el video carga */}
      <div className="absolute inset-0 z-0 vibra-texture" />

      {/* Video — solo fade, sin zoom */}
      <motion.div
        className="absolute inset-0 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.8, ease: 'easeOut' }}
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

      {/* Overlay — oscurece lado izquierdo para legibilidad del texto */}
      <div className="absolute inset-0 z-20 bg-gradient-to-r from-black/65 via-black/25 to-transparent" />
      <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

      {/* Nubes flotantes — solo desktop, lado derecho y centro para no tapar el texto */}
      <Image src="/assets/branding/IMG_3495.png" alt="" width={220} height={132}
        className="absolute top-8 right-8 z-30 opacity-90 animate-float hidden md:block" aria-hidden="true" />
      <Image src="/assets/branding/IMG_3495.png" alt="" width={160} height={96}
        className="absolute top-6 left-6 z-30 opacity-70 animate-float_slow hidden md:block" aria-hidden="true" />
      <Image src="/assets/branding/IMG_3495.png" alt="" width={110} height={66}
        className="absolute top-[38%] right-4 z-30 opacity-50 animate-float hidden md:block" aria-hidden="true" />
      <Image src="/assets/branding/IMG_3495.png" alt="" width={130} height={78}
        className="absolute bottom-24 right-20 z-30 opacity-60 animate-float_slow hidden md:block" aria-hidden="true" />
      <Image src="/assets/branding/IMG_3495.png" alt="" width={90} height={54}
        className="absolute bottom-20 left-[45%] z-30 opacity-35 animate-float hidden md:block" aria-hidden="true" />

      {/* Contenido — mobile top-left, desktop centro-izquierda */}
      <motion.div
        className="absolute top-24 left-4 md:top-1/2 md:-translate-y-1/2 md:left-16 lg:left-24 z-40 max-w-xl"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.5 }}
      >
        <Image
          src="/assets/multimedia/vibra%20png.png"
          alt="Vibra Bolivia"
          width={320}
          height={138}
          className="mb-5 w-44 md:w-64 lg:w-80"
          priority
        />
        <p className="font-display text-2xl md:text-4xl lg:text-5xl text-white tracking-wide drop-shadow-lg leading-tight">
          <span className="text-vibra-orange">2027</span> viene con todo<br />
          Algo grande se está armando
        </p>
      </motion.div>

      {/* Flecha scroll */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40">
        <div className="animate-bounce_slow text-white opacity-70">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      </div>

      {/* Progressive dark overlay — fades in as the next section covers this one */}
      {!reduceMotion && (
        <motion.div
          data-testid="dark-overlay"
          style={{ opacity: darkOverlayOpacity }}
          className="absolute inset-0 z-50 bg-black pointer-events-none"
          aria-hidden="true"
        />
      )}

    </section>
  )
}
```

Key changes vs the previous version (which only had the copy/position change):
1. Add `useRef`, `useScroll`, `useTransform`, `useReducedMotion` imports.
2. Section className changes from `h-screen` to `sticky top-0 min-h-screen` (or `relative h-screen` if reduced-motion).
3. Dark overlay `<motion.div>` at the end with `z-50` (above the down-arrow chevron, which is `z-40`).
4. `ref={sectionRef}` on the section.

The copy and content position from Task 1 remain.

- [ ] **Step 4.4: Run the test to confirm it passes**

Run: `npx jest __tests__/components/Hero.test.tsx -v`
Expected: PASS (6 tests total — 3 from Task 1 + 3 new).

- [ ] **Step 4.5: Run the full test suite**

Run: `npm test`
Expected: All tests pass.

- [ ] **Step 4.6: Commit**

```bash
git add __tests__/components/Hero.test.tsx src/components/Hero.tsx
git commit -m "feat(hero): make Hero sticky with progressive dark overlay

Hero participates in the sticky scroll stacking effect: position
sticky, top 0, min-h-screen. As the next section covers it, a
black overlay fades in to 0.35 opacity via framer-motion. Skips
rounded-top corners since it's the first section in the stack.

Respects prefers-reduced-motion: falls back to relative h-screen
and omits the overlay.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 5 — Verify page.tsx and run full QA

Confirm the parent chain doesn't break sticky, then run build/lint/test/dev-server checks.

**Files:**
- Read: `src/app/page.tsx`
- Read: `src/app/globals.css`

- [ ] **Step 5.1: Confirm page.tsx and globals don't break sticky**

Read `src/app/page.tsx`. The `<main>` should not have `overflow-hidden`. Current content:

```tsx
return (
  <main>
    <Hero />
    <Stats />
    <Aftermovie />
    <Timeline />
    <SpotifyPlayer />
    <EmailRegister />
  </main>
)
```

No overflow class — OK.

Read `src/app/globals.css`. `body` has `overflow-x: hidden`. Only X-axis — does not break sticky-Y. OK.

No edits needed. Document the verification in the commit (Task 5.6).

- [ ] **Step 5.2: Run lint**

Run: `npm run lint`
Expected: No errors. If there are warnings about unused imports or types, fix them inline.

- [ ] **Step 5.3: Run the full test suite**

Run: `npm test`
Expected: All tests pass.

- [ ] **Step 5.4: Run the production build**

Run: `npm run build`
Expected: Builds successfully. No type errors. No webpack errors.

- [ ] **Step 5.5: Manual QA in dev server**

Run: `npm run dev`

Open `http://localhost:3000` and verify each item below. If anything fails, stop, file a bug, and fix before continuing.

  - [ ] Hero displays the new copy: "2027 viene con todo / Algo grande se está armando" with 2027 in orange.
  - [ ] Hero layout on desktop (≥768px): logo + text centered-left vertically.
  - [ ] Hero layout on mobile (<768px, use Chrome DevTools responsive mode): logo + text at top-left, not centered.
  - [ ] Scroll down slowly: each section becomes sticky at top while the next slides up over it with visibly rounded top corners and a soft shadow.
  - [ ] As Section N is being covered by Section N+1, Section N visibly darkens (overlay fades in).
  - [ ] Stats section on mobile: Chiru appears centered below the 4 stats, no longer overlapping "EDICIONES".
  - [ ] Stats section on desktop: Chiru appears in the bottom-right corner as before.
  - [ ] Stats count-up animation still triggers when scrolling into Stats.
  - [ ] Timeline: arrow keys ← → and dots still navigate the lineup.
  - [ ] Aftermovie YouTube iframe still plays.
  - [ ] Spotify iframe still loads and plays.
  - [ ] EmailRegister form: enter an email, submit, get a success or duplicate-email response (depending on test state).
  - [ ] In DevTools → Rendering tab, enable "Emulate CSS media feature prefers-reduced-motion: reduce". Reload. Confirm: sections are no longer sticky (page scrolls linearly), and no dark overlay covers anything.

- [ ] **Step 5.6: Commit any QA fixes (or empty doc-only commit if no fixes needed)**

If Step 5.5 surfaced bugs, fix them and commit. Otherwise commit a verification note:

```bash
# Only run this if there were no QA fixes — to document the verification
git commit --allow-empty -m "chore: verify sticky stacking + Hero 2027 ready

Manual QA on dev server (mobile + desktop + reduced-motion):
- Hero copy and layout correct
- Sticky stacking with rounded corners + shadow + progressive
  dark overlay works across all sections
- Stats Chiru responsive, no mobile overlap
- All section-internal features (count-up, slider, iframes, form)
  still functional
- prefers-reduced-motion fallback verified

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Self-Review Notes

**Spec coverage check:**
- Cambio 1 (Hero copy) → Task 1 ✓
- Cambio 1 (Hero mobile position) → Task 1 ✓
- Cambio 2 (Sticky on SectionWrapper) → Task 3 ✓
- Cambio 2 (Sticky on Hero, no rounded for first) → Task 4 ✓
- Cambio 2 (Progressive dark overlay) → Tasks 3 + 4 ✓
- Cambio 2 (Reduced motion fallback) → Tasks 3 + 4 ✓
- Cambio 3 (Stats Chiru responsive) → Task 2 ✓
- Verification of page.tsx no-overflow → Task 5.1 ✓
- Plan de verificación (10 manual steps from spec) → Task 5.5 ✓

**Type / signature consistency check:**
- New `isFirst?: boolean` prop on `SectionWrapperProps` used in Task 3, but no caller in current page.tsx passes it. Decision: Hero doesn't use SectionWrapper, so no caller of `isFirst` is needed. The prop exists for future flexibility and is tested in Task 3.2. OK.
- `useReducedMotion()` returns `boolean | null`. In Task 3 and Task 4 we use it in a truthy/falsy context — null is falsy, so animations run by default. OK.
- `data-testid="dark-overlay"` is consistent between SectionWrapper (Task 3) and Hero (Task 4). OK.

**Risks (from spec):**
- Performance with 6 useScroll instances: noted in spec, will revisit if jank observed in Step 5.5.
- Anchor scroll to `#registro`: noted in spec, monitor in Step 5.5.

Plan looks complete. No placeholder text. Every step has either exact code or exact command + expected output.
