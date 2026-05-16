# Redesign — Revert sticky + brand-faithful polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Revert the sticky scroll stacking that caused overlap, then apply a brand-faithful polish layer with non-overlapping motion (reveal/parallax/stagger), poster-style typography (cyan stroke + chunky 3D), yellow sparkles around section headers, orange pill badges, recurring Chiru, and visual density across all sections.

**Architecture:** Each section keeps its current standalone structure with `vibra-texture` + purple overlay background. `SectionWrapper` reverts to `relative` positioning (no sticky) and wraps children in a reveal-on-scroll `motion.div`. New shared components (`Sparkles`, `SectionPill`, `SectionDivider`) provide brand decoration. Each section component gets pill + sparkles + cyan-stroke H2 + section-specific accents (chunky numbers, eyebrow subtitle, reinforced borders, Chiru placements, form branding).

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind CSS, Framer Motion (`useInView`, `useScroll`, `useTransform`, `useReducedMotion`), Jest + React Testing Library.

**Spec:** `docs/superpowers/specs/2026-05-16-redesign-revert-sticky-brand-polish.md`

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `src/components/SectionWrapper.tsx` | Modify | Revert sticky/overlay; add reveal-on-scroll wrapper for children |
| `src/components/Hero.tsx` | Modify | Revert sticky/overlay; add Chiru between clouds (desktop only) |
| `src/components/Stats.tsx` | Modify | Add pill + sparkles + cyan stroke H2 + chunky-3d numbers + stagger + optional frame |
| `src/components/Aftermovie.tsx` | Modify | Add pill + sparkles + cyan stroke H2 + replace subtitle with star eyebrow + reinforced border |
| `src/components/Timeline.tsx` | Modify | Add pill + sparkles + cyan stroke H2 + border on cover + stagger on dots |
| `src/components/SpotifyPlayer.tsx` | Modify | Add pill + sparkles + cyan stroke H2 + reinforced border |
| `src/components/EmailRegister.tsx` | Modify | Add pill + sparkles + cyan stroke H2 + Chiru responsive + branded form |
| `src/components/Sparkles.tsx` | **Create** | 5 yellow SVG sparkles with staggered twinkle animation |
| `src/components/SectionPill.tsx` | **Create** | Orange pill badge with star text, rendered before H2s |
| `src/components/SectionDivider.tsx` | **Create** | `★ ✦ ★ ✦ ★` divider between sections |
| `src/app/globals.css` | Modify | Add `.section-title` (cyan stroke) and `.chunky-3d` (3D text shadow) utilities |
| `src/app/page.tsx` | Modify | Insert `<SectionDivider />` between each pair of sections |
| `__tests__/components/Hero.test.tsx` | Modify | Remove 3 sticky-related tests; keep 3 copy/position tests |
| `__tests__/components/SectionWrapper.test.tsx` | Modify | Replace sticky tests with reveal-wrapper tests |
| `__tests__/components/Stats.test.tsx` | Keep | Unchanged (still validates Chiru responsive) |
| `__tests__/components/Sparkles.test.tsx` | **Create** | Validates 5 sparkles render |
| `__tests__/components/SectionPill.test.tsx` | **Create** | Validates pill renders with given children |
| `__tests__/components/SectionDivider.test.tsx` | **Create** | Validates divider renders |

---

## Task 1 — Revert sticky scroll stacking

Remove sticky behavior from both `SectionWrapper` and `Hero`, plus all related tests, restoring linear scroll. No reveal-on-scroll yet — that's Task 2.

**Files:**
- Modify: `src/components/SectionWrapper.tsx`
- Modify: `src/components/Hero.tsx`
- Delete tests: `__tests__/components/SectionWrapper.test.tsx`
- Modify tests: `__tests__/components/Hero.test.tsx` (drop sticky tests)

- [ ] **Step 1.1: Delete SectionWrapper.test.tsx**

```bash
cd /c/Users/Principal/vibra-bolivia
rm __tests__/components/SectionWrapper.test.tsx
```

(Task 2 will recreate it with reveal-wrapper tests.)

- [ ] **Step 1.2: Drop 3 sticky-related tests from Hero.test.tsx**

Edit `__tests__/components/Hero.test.tsx`. Remove these 3 tests (added in the prior Task 4):

```tsx
  it('applies sticky + min-h-screen classes to the section', () => { ... })
  it('does not apply rounded-t (Hero is the first section)', () => { ... })
  it('renders the dark overlay div', () => { ... })
```

Keep the 3 tests from Task 1 (copy lines, 2027 orange class, top-24 + md:top-1/2 positioning) and the framer-motion mock at the top.

- [ ] **Step 1.3: Run remaining Hero tests to confirm 3 pass**

Run: `npx jest __tests__/components/Hero.test.tsx -v`
Expected: 3 tests passing (the original copy/position tests). If the implementation still has sticky code, the tests pass anyway because they only check copy/position.

- [ ] **Step 1.4: Revert Hero.tsx to pre-Task-4 state (keep Task 1 copy)**

Replace `src/components/Hero.tsx` with:

```tsx
'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden">

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

    </section>
  )
}
```

Changes vs current (post `3606385`):
- Drop `useRef`, `useScroll`, `useTransform`, `useReducedMotion` imports
- Drop `sectionRef`, `reduceMotion`, `scrollYProgress`, `darkOverlayOpacity`
- Section className back to `relative h-screen w-full overflow-hidden`
- Drop the `<motion.div data-testid="dark-overlay">` block
- Drop `ref={sectionRef}` from `<section>`
- Hero copy from Task 1 stays unchanged

- [ ] **Step 1.5: Revert SectionWrapper.tsx to pre-Task-3 state**

Replace `src/components/SectionWrapper.tsx` with:

```tsx
'use client'

import React, { useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'

interface SectionWrapperProps {
  children: React.ReactNode
  className?: string
  clouds?: boolean
  grassBottom?: boolean
  mountainsBottom?: boolean
  parallax?: boolean
}

export default function SectionWrapper({
  children,
  className,
  clouds = false,
  grassBottom = false,
  mountainsBottom = false,
  parallax = false,
}: SectionWrapperProps) {
  const sectionRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const cloudY = useTransform(scrollYProgress, [0, 1], ['-15px', '15px'])

  const contentPb = mountainsBottom ? 'pb-56 md:pb-48' : grassBottom ? 'pb-20 md:pb-28' : ''

  return (
    <section ref={sectionRef} className="relative overflow-hidden">
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
    </section>
  )
}
```

Changes vs current (post `7697d7c`):
- Drop `useReducedMotion` import and call
- Drop `isFirst` prop
- Drop `darkOverlayOpacity` and `stickyClasses` logic
- Restore the original offset `['start end', 'end start']` for cloudY (the sticky version used `['start start', 'end start']`)
- Section className back to `relative overflow-hidden`
- Drop the `<motion.div data-testid="dark-overlay">` block at the end

- [ ] **Step 1.6: Run full test suite to confirm sticky tests are gone and nothing else broke**

Run: `npm test`
Expected: All tests pass. Total count drops by ~7 (3 from Hero + 4 from SectionWrapper file deletion).

- [ ] **Step 1.7: Commit**

```bash
git add src/components/Hero.tsx src/components/SectionWrapper.tsx __tests__/components/Hero.test.tsx
git rm __tests__/components/SectionWrapper.test.tsx
git commit -m "revert(motion): undo sticky scroll stacking

Sticky stacking caused sections to overlap on scroll, making the
page feel jammed. Reverts SectionWrapper to relative + Hero to
h-screen, restoring linear scroll. Drops sticky-related tests.

Hero copy '2027 viene con todo' (99c9344) and Stats Chiru
responsive (8abce07) are conserved.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 2 — Reveal-on-scroll wrapper in SectionWrapper

Add a `<motion.div>` around children that fades up when the section enters the viewport. Respects reduced-motion.

**Files:**
- Modify: `src/components/SectionWrapper.tsx`
- Create: `__tests__/components/SectionWrapper.test.tsx`

- [ ] **Step 2.1: Create the test file with failing tests**

Create `__tests__/components/SectionWrapper.test.tsx`:

```tsx
import { render } from '@testing-library/react'
import SectionWrapper from '@/components/SectionWrapper'

let mockReduceMotion = false

jest.mock('framer-motion', () => {
  const actual = jest.requireActual('framer-motion')
  return {
    ...actual,
    useScroll: () => ({ scrollYProgress: { get: () => 0, on: () => () => {} } }),
    useTransform: () => 0,
    useInView: () => true,
    useReducedMotion: () => mockReduceMotion,
  }
})

beforeEach(() => {
  mockReduceMotion = false
})

describe('SectionWrapper', () => {
  it('renders children inside a reveal-wrapper motion.div', () => {
    const { container } = render(
      <SectionWrapper><span data-testid="child">hello</span></SectionWrapper>
    )
    const wrapper = container.querySelector('[data-testid="reveal-wrapper"]')
    expect(wrapper).not.toBeNull()
    expect(wrapper?.querySelector('[data-testid="child"]')).not.toBeNull()
  })

  it('section uses relative positioning (no sticky)', () => {
    const { container } = render(<SectionWrapper>x</SectionWrapper>)
    const section = container.querySelector('section')
    expect(section?.className).toMatch(/relative/)
    expect(section?.className).not.toMatch(/sticky/)
  })

  it('still renders clouds when clouds prop is set', () => {
    const { container } = render(<SectionWrapper clouds>x</SectionWrapper>)
    const cloudImages = container.querySelectorAll('img[src*="IMG_3495"]')
    expect(cloudImages.length).toBeGreaterThanOrEqual(2)
  })
})
```

- [ ] **Step 2.2: Run tests to confirm they fail**

Run: `npx jest __tests__/components/SectionWrapper.test.tsx -v`
Expected: First two tests FAIL because the `data-testid="reveal-wrapper"` doesn't exist yet. Third test should pass (clouds already work).

- [ ] **Step 2.3: Update SectionWrapper to add the reveal wrapper**

Edit `src/components/SectionWrapper.tsx`. Change the imports and the children-wrapping div.

Imports change from:
```tsx
import { motion, useScroll, useTransform } from 'framer-motion'
```
to:
```tsx
import { motion, useScroll, useTransform, useInView, useReducedMotion } from 'framer-motion'
```

Inside the component, after `cloudY` declaration, add:

```tsx
  const inViewRef = useRef(null)
  const isInView = useInView(inViewRef, { once: true, amount: 0.2 })
  const reduceMotion = useReducedMotion()
```

Replace the children-wrapping div:

```tsx
      {/* Children sit above overlays and clouds */}
      <div className={`relative z-30 py-20 px-4 ${contentPb} ${className ?? ''}`}>
        {children}
      </div>
```

with:

```tsx
      {/* Children sit above overlays and clouds — reveal on scroll */}
      <motion.div
        ref={inViewRef}
        data-testid="reveal-wrapper"
        initial={reduceMotion ? false : { opacity: 0, y: 30 }}
        animate={reduceMotion || isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`relative z-30 py-20 px-4 ${contentPb} ${className ?? ''}`}
      >
        {children}
      </motion.div>
```

Notes:
- `once: true` so the reveal only animates the first time
- `amount: 0.2` triggers when 20% of the section is visible
- If `reduceMotion` is true, `initial={false}` skips the initial state entirely (no fade-up)
- The wrapper element is now a `<motion.div>` but keeps the same className for layout

- [ ] **Step 2.4: Run tests to confirm they pass**

Run: `npx jest __tests__/components/SectionWrapper.test.tsx -v`
Expected: All 3 tests PASS.

- [ ] **Step 2.5: Run full test suite**

Run: `npm test`
Expected: All suites pass.

- [ ] **Step 2.6: Commit**

```bash
git add src/components/SectionWrapper.tsx __tests__/components/SectionWrapper.test.tsx
git commit -m "feat(sections): add reveal-on-scroll wrapper to SectionWrapper

Each section now fades up (opacity 0->1, y 30px->0) when 20% of it
enters the viewport, using framer-motion useInView. Reveals once
per section per pageview (once: true). Respects prefers-reduced-
motion: skips the initial transformed state and renders content
already in place.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 3 — CSS utilities + 3 brand decoration components

Add `.section-title` and `.chunky-3d` to globals.css, plus 3 new components: `Sparkles`, `SectionPill`, `SectionDivider`.

**Files:**
- Modify: `src/app/globals.css`
- Create: `src/components/Sparkles.tsx`
- Create: `src/components/SectionPill.tsx`
- Create: `src/components/SectionDivider.tsx`
- Create: `__tests__/components/Sparkles.test.tsx`
- Create: `__tests__/components/SectionPill.test.tsx`
- Create: `__tests__/components/SectionDivider.test.tsx`

- [ ] **Step 3.1: Add CSS utilities to globals.css**

Edit `src/app/globals.css`. Inside the existing `@layer utilities` block (after `.vibra-texture`), add:

```css
  .section-title {
    -webkit-text-stroke: 1.5px #4FC3F7;
    text-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
    paint-order: stroke fill;
  }

  .chunky-3d {
    text-shadow: 3px 3px 0 #000, 4px 4px 12px rgba(0, 0, 0, 0.3);
  }
```

The `paint-order: stroke fill` ensures the cyan stroke renders behind the white fill (otherwise the stroke half-covers letterforms).

- [ ] **Step 3.2: Create SectionPill component**

Create `src/components/SectionPill.tsx`:

```tsx
import React from 'react'

interface SectionPillProps {
  children: React.ReactNode
  className?: string
}

export default function SectionPill({ children, className = '' }: SectionPillProps) {
  return (
    <div
      className={`inline-block bg-vibra-orange text-black font-display text-xs md:text-sm tracking-[0.2em] uppercase px-4 py-1.5 rounded-full mb-4 ${className}`}
    >
      {children}
    </div>
  )
}
```

- [ ] **Step 3.3: Create SectionPill test**

Create `__tests__/components/SectionPill.test.tsx`:

```tsx
import { render } from '@testing-library/react'
import SectionPill from '@/components/SectionPill'

describe('SectionPill', () => {
  it('renders children inside an orange pill', () => {
    const { getByText, container } = render(<SectionPill>★ TEST ★</SectionPill>)
    expect(getByText(/test/i)).toBeInTheDocument()
    const pill = container.firstChild as HTMLElement
    expect(pill.className).toMatch(/bg-vibra-orange/)
    expect(pill.className).toMatch(/rounded-full/)
  })

  it('appends extra className when provided', () => {
    const { container } = render(<SectionPill className="mx-auto">X</SectionPill>)
    const pill = container.firstChild as HTMLElement
    expect(pill.className).toMatch(/mx-auto/)
  })
})
```

Run: `npx jest __tests__/components/SectionPill.test.tsx -v`
Expected: Both tests PASS (component already created).

- [ ] **Step 3.4: Create SectionDivider component**

Create `src/components/SectionDivider.tsx`:

```tsx
export default function SectionDivider() {
  return (
    <div
      role="separator"
      aria-hidden="true"
      className="flex items-center justify-center py-6 text-white/30 text-sm tracking-[0.5em] bg-vibra-purple"
    >
      ★ ✦ ★ ✦ ★
    </div>
  )
}
```

The `bg-vibra-purple` matches the body background so the divider sits flush against adjacent sections (which use the vibra-texture).

- [ ] **Step 3.5: Create SectionDivider test**

Create `__tests__/components/SectionDivider.test.tsx`:

```tsx
import { render } from '@testing-library/react'
import SectionDivider from '@/components/SectionDivider'

describe('SectionDivider', () => {
  it('renders the star/sparkle pattern', () => {
    const { getByText } = render(<SectionDivider />)
    expect(getByText('★ ✦ ★ ✦ ★')).toBeInTheDocument()
  })

  it('has role=separator and aria-hidden', () => {
    const { container } = render(<SectionDivider />)
    const divider = container.firstChild as HTMLElement
    expect(divider.getAttribute('role')).toBe('separator')
    expect(divider.getAttribute('aria-hidden')).toBe('true')
  })
})
```

Run: `npx jest __tests__/components/SectionDivider.test.tsx -v`
Expected: Both tests PASS.

- [ ] **Step 3.6: Create Sparkles component**

Create `src/components/Sparkles.tsx`:

```tsx
'use client'

import { motion, useReducedMotion } from 'framer-motion'

interface SparkleSpec {
  size: number
  top?: string
  bottom?: string
  left?: string
  right?: string
  delay: number
}

const SPARKLES: SparkleSpec[] = [
  { size: 14, top: '-10%',  left: '5%',   delay: 0 },
  { size: 10, top: '20%',   right: '8%',  delay: 0.4 },
  { size: 16, bottom: '-10%', left: '15%', delay: 0.8 },
  { size: 8,  bottom: '0%',  right: '20%', delay: 1.2 },
  { size: 12, top: '50%',   left: '92%',  delay: 1.6 },
]

export default function Sparkles() {
  const reduceMotion = useReducedMotion()

  return (
    <>
      {SPARKLES.map((s, i) => (
        <motion.svg
          key={i}
          data-testid="sparkle"
          viewBox="0 0 24 24"
          width={s.size}
          height={s.size}
          fill="#FFD700"
          style={{
            position: 'absolute',
            top: s.top,
            bottom: s.bottom,
            left: s.left,
            right: s.right,
            pointerEvents: 'none',
          }}
          animate={
            reduceMotion
              ? { scale: 1, opacity: 1 }
              : { scale: [0.8, 1.2, 0.8], opacity: [0.5, 1, 0.5] }
          }
          transition={{
            duration: 2,
            repeat: reduceMotion ? 0 : Infinity,
            delay: s.delay,
            ease: 'easeInOut',
          }}
          aria-hidden="true"
        >
          <path d="M12 2l1.5 6.5L20 10l-6.5 1.5L12 18l-1.5-6.5L4 10l6.5-1.5L12 2z" />
        </motion.svg>
      ))}
    </>
  )
}
```

- [ ] **Step 3.7: Create Sparkles test**

Create `__tests__/components/Sparkles.test.tsx`:

```tsx
import { render } from '@testing-library/react'
import Sparkles from '@/components/Sparkles'

jest.mock('framer-motion', () => {
  const actual = jest.requireActual('framer-motion')
  return {
    ...actual,
    useReducedMotion: () => false,
  }
})

describe('Sparkles', () => {
  it('renders 5 sparkle SVGs', () => {
    const { getAllByTestId } = render(<Sparkles />)
    expect(getAllByTestId('sparkle')).toHaveLength(5)
  })

  it('each sparkle has fill #FFD700 (yellow)', () => {
    const { getAllByTestId } = render(<Sparkles />)
    const sparkles = getAllByTestId('sparkle')
    sparkles.forEach(s => {
      expect(s.getAttribute('fill')).toBe('#FFD700')
    })
  })
})
```

Run: `npx jest __tests__/components/Sparkles.test.tsx -v`
Expected: Both tests PASS.

- [ ] **Step 3.8: Run full test suite**

Run: `npm test`
Expected: All suites pass.

- [ ] **Step 3.9: Commit**

```bash
git add src/app/globals.css src/components/Sparkles.tsx src/components/SectionPill.tsx src/components/SectionDivider.tsx __tests__/components/Sparkles.test.tsx __tests__/components/SectionPill.test.tsx __tests__/components/SectionDivider.test.tsx
git commit -m "feat(brand): add Sparkles, SectionPill, SectionDivider components

Three reusable brand-decoration components plus two CSS utilities
(.section-title with cyan stroke, .chunky-3d with 3D shadow) that
the section components will compose in subsequent tasks. Sparkles
respects prefers-reduced-motion (static when enabled).

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 4 — Apply brand polish to Stats

Pill, sparkles, cyan-stroke H2, chunky-3d numbers, stagger animation.

**Files:**
- Modify: `src/components/Stats.tsx`
- Modify: `__tests__/components/Stats.test.tsx` (add brand polish tests)

- [ ] **Step 4.1: Add 3 new tests to Stats.test.tsx**

Append to the `describe('Stats', () => { ... })` block in `__tests__/components/Stats.test.tsx`:

```tsx
  it('renders the section pill with 2DA EDICIÓN text', () => {
    const { getByText } = render(<Stats />)
    expect(getByText(/2DA EDICIÓN/i)).toBeInTheDocument()
  })

  it('applies the section-title class to the h2', () => {
    const { container } = render(<Stats />)
    const h2 = container.querySelector('h2')
    expect(h2?.className).toMatch(/section-title/)
  })

  it('renders 5 sparkles in the header area', () => {
    const { getAllByTestId } = render(<Stats />)
    expect(getAllByTestId('sparkle').length).toBe(5)
  })
```

Run: `npx jest __tests__/components/Stats.test.tsx -v`
Expected: 3 new tests FAIL.

- [ ] **Step 4.2: Update Stats.tsx with brand polish**

Replace the contents of `src/components/Stats.tsx`:

```tsx
'use client'

import Image from 'next/image'
import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useCountUp } from '@/hooks/useCountUp'
import SectionWrapper from '@/components/SectionWrapper'
import SectionPill from '@/components/SectionPill'
import Sparkles from '@/components/Sparkles'

const STATS = [
  { value: 15000, suffix: '+', label: 'Personas' },
  { value: 10,    suffix: '',  label: 'Artistas en vivo' },
  { value: 12,    suffix: '',  label: 'Horas de música' },
  { value: 2,     suffix: '',  label: 'Ediciones' },
]

function StatItem({ value, suffix, label, trigger }: {
  value: number; suffix: string; label: string; trigger: boolean
}) {
  const count = useCountUp(value, 2000, trigger)
  return (
    <div className="text-center">
      <p className="font-display text-5xl md:text-7xl text-vibra-orange chunky-3d">
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
    <SectionWrapper clouds grassBottom parallax className="py-24">
      <div ref={ref} className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <SectionPill>★ 2DA EDICIÓN ★</SectionPill>
          <div className="relative inline-block">
            <Sparkles />
            <h2 className="font-display text-4xl md:text-5xl text-white tracking-wider section-title">
              Lo que fue Vibra Bolivia 2026
            </h2>
          </div>
          <p className="font-display text-sm md:text-base text-white/70 tracking-[0.3em] mt-6">
            ★ ★ ★ SEGUNDA EDICIÓN ★ ★ ★
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={triggered ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <StatItem {...stat} trigger={triggered} />
            </motion.div>
          ))}
        </div>
      </div>

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
    </SectionWrapper>
  )
}
```

Changes:
1. Imports: add `motion` from framer-motion, `SectionPill`, `Sparkles`
2. Title block is wrapped in a `text-center mb-16` div containing pill + h2 (with sparkles) + star eyebrow
3. H2 gets `section-title` class
4. Numbers `p` gets `chunky-3d` class (replaced `drop-shadow-lg`)
5. Stats grid items wrapped in `motion.div` for stagger (delay i*0.1)
6. Chirus unchanged from prior Task 2 state

- [ ] **Step 4.3: Run Stats tests to confirm they pass**

Run: `npx jest __tests__/components/Stats.test.tsx -v`
Expected: All 5 tests PASS (2 original Chiru + 3 new brand).

- [ ] **Step 4.4: Run full test suite**

Run: `npm test`
Expected: All suites pass.

- [ ] **Step 4.5: Commit**

```bash
git add src/components/Stats.tsx __tests__/components/Stats.test.tsx
git commit -m "feat(stats): apply brand polish — pill, sparkles, chunky numbers, stagger

Stats now leads with an orange '★ 2DA EDICIÓN ★' pill, a cyan-stroked
H2, 5 yellow twinkling sparkles around the heading, and a '★ ★ ★
SEGUNDA EDICIÓN ★ ★ ★' star eyebrow below. The 4 numbers get the
chunky-3d shadow treatment matching the poster aesthetic. Each stat
item fades-up staggered (0/100/200/300ms) when the count-up triggers.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 5 — Apply brand polish to Aftermovie

Pill, sparkles, cyan H2, replace generic subtitle with star eyebrow, reinforce orange border.

**Files:**
- Modify: `src/components/Aftermovie.tsx`
- Create: `__tests__/components/Aftermovie.test.tsx`

- [ ] **Step 5.1: Create Aftermovie test**

Create `__tests__/components/Aftermovie.test.tsx`:

```tsx
import { render } from '@testing-library/react'
import Aftermovie from '@/components/Aftermovie'

jest.mock('framer-motion', () => {
  const actual = jest.requireActual('framer-motion')
  return {
    ...actual,
    useScroll: () => ({ scrollYProgress: { get: () => 0, on: () => () => {} } }),
    useTransform: () => 0,
    useInView: () => true,
    useReducedMotion: () => false,
  }
})

class MockIntersectionObserver {
  observe() {} unobserve() {} disconnect() {} takeRecords() { return [] }
}
;(global as unknown as { IntersectionObserver: typeof MockIntersectionObserver }).IntersectionObserver = MockIntersectionObserver

describe('Aftermovie', () => {
  it('renders the AFTERMOVIE OFICIAL pill', () => {
    const { getByText } = render(<Aftermovie />)
    expect(getByText(/AFTERMOVIE OFICIAL/i)).toBeInTheDocument()
  })

  it('applies section-title class to the h2', () => {
    const { container } = render(<Aftermovie />)
    const h2 = container.querySelector('h2')
    expect(h2?.className).toMatch(/section-title/)
  })

  it('renders 5 sparkles', () => {
    const { getAllByTestId } = render(<Aftermovie />)
    expect(getAllByTestId('sparkle').length).toBe(5)
  })

  it('reinforces border on iframe wrapper', () => {
    const { container } = render(<Aftermovie />)
    const wrapper = container.querySelector('.border-vibra-orange\\/80')
    expect(wrapper).not.toBeNull()
  })
})
```

Run: `npx jest __tests__/components/Aftermovie.test.tsx -v`
Expected: 4 tests FAIL.

- [ ] **Step 5.2: Update Aftermovie.tsx with brand polish**

Replace `src/components/Aftermovie.tsx`:

```tsx
import SectionWrapper from '@/components/SectionWrapper'
import SectionPill from '@/components/SectionPill'
import Sparkles from '@/components/Sparkles'

export default function Aftermovie() {
  return (
    <SectionWrapper clouds mountainsBottom parallax>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <SectionPill>★ AFTERMOVIE OFICIAL ★</SectionPill>
          <div className="relative inline-block">
            <Sparkles />
            <h2 className="font-display text-4xl md:text-5xl text-white tracking-wider section-title">
              Reviví la 2da Edición
            </h2>
          </div>
          <p className="font-display text-sm md:text-base text-white/70 tracking-[0.3em] mt-6">
            ★ ★ ★ AFTERMOVIE OFICIAL ★ ★ ★
          </p>
        </div>
        <div className="rounded-2xl overflow-hidden border-2 border-vibra-orange/80 shadow-[0_0_50px_rgba(245,160,32,0.3)]">
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
    </SectionWrapper>
  )
}
```

Changes:
- Imports: `SectionPill`, `Sparkles`
- Header block: pill + h2 with sparkles + star eyebrow (replaces old `<p className="text-center text-white/60 mb-10 text-lg">Vibra Bolivia 2026 — Aftermovie Oficial</p>`)
- H2 gets `section-title` class
- Iframe border: `border-vibra-orange/60` → `border-vibra-orange/80`
- Shadow: `shadow-[0_0_40px_rgba(245,160,32,0.25)]` → `shadow-[0_0_50px_rgba(245,160,32,0.3)]`

- [ ] **Step 5.3: Run Aftermovie tests to confirm they pass**

Run: `npx jest __tests__/components/Aftermovie.test.tsx -v`
Expected: All 4 tests PASS.

- [ ] **Step 5.4: Run full test suite**

Run: `npm test`
Expected: All suites pass.

- [ ] **Step 5.5: Commit**

```bash
git add src/components/Aftermovie.tsx __tests__/components/Aftermovie.test.tsx
git commit -m "feat(aftermovie): apply brand polish — pill, sparkles, star eyebrow, border

Aftermovie section now opens with orange '★ AFTERMOVIE OFICIAL ★'
pill, cyan-stroked H2 with twinkling sparkles, and replaces the
generic 'Vibra Bolivia 2026 — Aftermovie Oficial' subtitle with a
poster-style star eyebrow. iframe border bumps to /80 opacity with
a stronger orange glow.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 6 — Apply brand polish to Timeline

Pill, sparkles, cyan H2, border on artist cover, stagger on dots.

**Files:**
- Modify: `src/components/Timeline.tsx`
- Create: `__tests__/components/Timeline.test.tsx`

- [ ] **Step 6.1: Create Timeline test**

Create `__tests__/components/Timeline.test.tsx`:

```tsx
import { render } from '@testing-library/react'
import Timeline from '@/components/Timeline'

jest.mock('framer-motion', () => {
  const actual = jest.requireActual('framer-motion')
  return {
    ...actual,
    useScroll: () => ({ scrollYProgress: { get: () => 0, on: () => () => {} } }),
    useTransform: () => 0,
    useInView: () => true,
    useReducedMotion: () => false,
  }
})

class MockIntersectionObserver {
  observe() {} unobserve() {} disconnect() {} takeRecords() { return [] }
}
;(global as unknown as { IntersectionObserver: typeof MockIntersectionObserver }).IntersectionObserver = MockIntersectionObserver

describe('Timeline', () => {
  it('renders the LINE UP 2026 pill', () => {
    const { getByText } = render(<Timeline />)
    expect(getByText(/LINE UP 2026/i)).toBeInTheDocument()
  })

  it('applies section-title class to the h2', () => {
    const { container } = render(<Timeline />)
    const h2 = container.querySelector('h2')
    expect(h2?.className).toMatch(/section-title/)
  })

  it('renders 5 sparkles', () => {
    const { getAllByTestId } = render(<Timeline />)
    expect(getAllByTestId('sparkle').length).toBe(5)
  })

  it('reinforces border on artist cover image wrapper', () => {
    const { container } = render(<Timeline />)
    const cover = container.querySelector('.border-vibra-orange\\/40')
    expect(cover).not.toBeNull()
  })
})
```

Run: `npx jest __tests__/components/Timeline.test.tsx -v`
Expected: 4 tests FAIL.

- [ ] **Step 6.2: Update Timeline.tsx with brand polish**

Replace `src/components/Timeline.tsx`:

```tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { TIMELINE_2026 } from '@/lib/timeline-data'
import SectionWrapper from '@/components/SectionWrapper'
import SectionPill from '@/components/SectionPill'
import Sparkles from '@/components/Sparkles'

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
    <SectionWrapper grassBottom>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <SectionPill>★ LINE UP 2026 ★</SectionPill>
          <div className="relative inline-block">
            <Sparkles />
            <h2 className="font-display text-4xl md:text-5xl text-white tracking-wider section-title">
              El line up del 2026
            </h2>
          </div>
          <p className="text-white/50 text-sm mt-6">
            Usá ← → o tocá los puntos para navegar
          </p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            className="relative w-full aspect-video rounded-2xl overflow-hidden mb-6 border-2 border-vibra-orange/40"
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
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-6 left-6">
              <p className="font-display text-white text-2xl drop-shadow">{entry.artist}</p>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-between mb-4">
          <button
            onClick={goPrev}
            disabled={active === 0}
            className="px-6 py-2 rounded-full border border-white/30 text-white disabled:opacity-30 hover:bg-white/10 transition font-display tracking-wider"
          >
            ← Anterior
          </button>
          <button
            onClick={goNext}
            disabled={active === TIMELINE_2026.length - 1}
            className="px-6 py-2 rounded-full border border-white/30 text-white disabled:opacity-30 hover:bg-white/10 transition font-display tracking-wider"
          >
            Siguiente →
          </button>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto py-3 justify-start md:justify-center">
          {TIMELINE_2026.map((item, i) => (
            <motion.button
              key={item.time}
              onClick={() => setActive(i)}
              className="flex-shrink-0 group"
              aria-label={item.artist}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <div className={`w-3 h-3 rounded-full transition-all duration-200 ${
                i === active
                  ? 'bg-vibra-orange scale-125'
                  : 'bg-white/30 group-hover:bg-white/60'
              }`} />
            </motion.button>
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}
```

Changes:
- Imports: `SectionPill`, `Sparkles`
- Header block: pill + h2 with sparkles + existing hint as subtitle
- H2 gets `section-title` class
- Artist cover wrapper: `border border-white/10` → `border-2 border-vibra-orange/40`
- Dots wrapped in `motion.button` with stagger (delay i*0.05)

- [ ] **Step 6.3: Run Timeline tests to confirm they pass**

Run: `npx jest __tests__/components/Timeline.test.tsx -v`
Expected: All 4 tests PASS.

- [ ] **Step 6.4: Run full test suite**

Run: `npm test`
Expected: All suites pass.

- [ ] **Step 6.5: Commit**

```bash
git add src/components/Timeline.tsx __tests__/components/Timeline.test.tsx
git commit -m "feat(timeline): apply brand polish — pill, sparkles, border, stagger

Timeline opens with orange '★ LINE UP 2026 ★' pill, cyan-stroked
H2, and twinkling sparkles. Artist cover image gets a border-2
orange/40 frame matching the rest of the brand. Navigation dots
stagger in (50ms apart) on first mount.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 7 — Apply brand polish to SpotifyPlayer

Pill, sparkles, cyan H2, reinforce blue border.

**Files:**
- Modify: `src/components/SpotifyPlayer.tsx`
- Create: `__tests__/components/SpotifyPlayer.test.tsx`

- [ ] **Step 7.1: Create SpotifyPlayer test**

Create `__tests__/components/SpotifyPlayer.test.tsx`:

```tsx
import { render } from '@testing-library/react'
import SpotifyPlayer from '@/components/SpotifyPlayer'

jest.mock('framer-motion', () => {
  const actual = jest.requireActual('framer-motion')
  return {
    ...actual,
    useScroll: () => ({ scrollYProgress: { get: () => 0, on: () => () => {} } }),
    useTransform: () => 0,
    useInView: () => true,
    useReducedMotion: () => false,
  }
})

class MockIntersectionObserver {
  observe() {} unobserve() {} disconnect() {} takeRecords() { return [] }
}
;(global as unknown as { IntersectionObserver: typeof MockIntersectionObserver }).IntersectionObserver = MockIntersectionObserver

describe('SpotifyPlayer', () => {
  it('renders the PLAYLIST OFICIAL pill', () => {
    const { getByText } = render(<SpotifyPlayer />)
    expect(getByText(/PLAYLIST OFICIAL/i)).toBeInTheDocument()
  })

  it('applies section-title class to the h2', () => {
    const { container } = render(<SpotifyPlayer />)
    const h2 = container.querySelector('h2')
    expect(h2?.className).toMatch(/section-title/)
  })

  it('renders 5 sparkles', () => {
    const { getAllByTestId } = render(<SpotifyPlayer />)
    expect(getAllByTestId('sparkle').length).toBe(5)
  })

  it('reinforces border on iframe wrapper', () => {
    const { container } = render(<SpotifyPlayer />)
    const wrapper = container.querySelector('.border-vibra-blue\\/70')
    expect(wrapper).not.toBeNull()
  })
})
```

Run: `npx jest __tests__/components/SpotifyPlayer.test.tsx -v`
Expected: 4 tests FAIL.

- [ ] **Step 7.2: Update SpotifyPlayer.tsx with brand polish**

Replace `src/components/SpotifyPlayer.tsx`:

```tsx
import SectionWrapper from '@/components/SectionWrapper'
import SectionPill from '@/components/SectionPill'
import Sparkles from '@/components/Sparkles'

export default function SpotifyPlayer() {
  return (
    <SectionWrapper clouds grassBottom parallax>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <SectionPill>★ PLAYLIST OFICIAL ★</SectionPill>
          <div className="relative inline-block">
            <Sparkles />
            <h2 className="font-display text-4xl md:text-5xl text-white tracking-wider section-title">
              La Música del Festival
            </h2>
          </div>
          <p className="text-white/70 text-lg mt-6">
            Escuchá la playlist oficial de Vibra Bolivia
          </p>
        </div>
        <div className="rounded-2xl overflow-hidden border-2 border-vibra-blue/70 shadow-[0_0_50px_rgba(79,195,247,0.25)]">
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
    </SectionWrapper>
  )
}
```

Changes:
- Imports: `SectionPill`, `Sparkles`
- Header block: pill + h2 with sparkles + existing descriptive subtitle below (moved out of `<h2>` siblings into the new header block)
- H2 gets `section-title` class
- Iframe border: `border-vibra-blue/50` → `border-vibra-blue/70`
- Shadow: `shadow-[0_0_40px_rgba(79,195,247,0.2)]` → `shadow-[0_0_50px_rgba(79,195,247,0.25)]`

- [ ] **Step 7.3: Run SpotifyPlayer tests to confirm they pass**

Run: `npx jest __tests__/components/SpotifyPlayer.test.tsx -v`
Expected: All 4 tests PASS.

- [ ] **Step 7.4: Run full test suite**

Run: `npm test`
Expected: All suites pass.

- [ ] **Step 7.5: Commit**

```bash
git add src/components/SpotifyPlayer.tsx __tests__/components/SpotifyPlayer.test.tsx
git commit -m "feat(spotify): apply brand polish — pill, sparkles, cyan H2, border

SpotifyPlayer section gets orange '★ PLAYLIST OFICIAL ★' pill,
cyan-stroked H2 with twinkling sparkles, and a stronger blue
border (70 opacity) plus glow on the iframe. Descriptive subtitle
preserved (it adds info beyond the pill).

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 8 — Apply brand polish to EmailRegister

Pill, sparkles, cyan H2, Chiru responsive, branded form input + button.

**Files:**
- Modify: `src/components/EmailRegister.tsx`
- Create: `__tests__/components/EmailRegister.test.tsx`

- [ ] **Step 8.1: Create EmailRegister test**

Create `__tests__/components/EmailRegister.test.tsx`:

```tsx
import { render } from '@testing-library/react'
import EmailRegister from '@/components/EmailRegister'

jest.mock('framer-motion', () => {
  const actual = jest.requireActual('framer-motion')
  return {
    ...actual,
    useScroll: () => ({ scrollYProgress: { get: () => 0, on: () => () => {} } }),
    useTransform: () => 0,
    useInView: () => true,
    useReducedMotion: () => false,
  }
})

class MockIntersectionObserver {
  observe() {} unobserve() {} disconnect() {} takeRecords() { return [] }
}
;(global as unknown as { IntersectionObserver: typeof MockIntersectionObserver }).IntersectionObserver = MockIntersectionObserver

describe('EmailRegister', () => {
  it('renders the PREVENTA 2027 pill', () => {
    const { getByText } = render(<EmailRegister />)
    expect(getByText(/PREVENTA 2027/i)).toBeInTheDocument()
  })

  it('applies section-title class to the h2', () => {
    const { container } = render(<EmailRegister />)
    const h2 = container.querySelector('h2')
    expect(h2?.className).toMatch(/section-title/)
  })

  it('renders 5 sparkles', () => {
    const { getAllByTestId } = render(<EmailRegister />)
    expect(getAllByTestId('sparkle').length).toBe(5)
  })

  it('renders both desktop and mobile Chiru images', () => {
    const { container } = render(<EmailRegister />)
    const chirus = container.querySelectorAll('img[src*="Chiru"]')
    expect(chirus.length).toBe(2)
  })

  it('input has orange branded border class', () => {
    const { container } = render(<EmailRegister />)
    const input = container.querySelector('input[type="email"]')
    expect(input?.className).toMatch(/border-vibra-orange/)
  })
})
```

Run: `npx jest __tests__/components/EmailRegister.test.tsx -v`
Expected: 5 tests FAIL.

- [ ] **Step 8.2: Update EmailRegister.tsx with brand polish**

Replace `src/components/EmailRegister.tsx`:

```tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'
import SectionWrapper from '@/components/SectionWrapper'
import SectionPill from '@/components/SectionPill'
import Sparkles from '@/components/Sparkles'

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
```

Changes:
- Imports: `SectionPill`, `Sparkles`
- Outer container becomes `relative` so the desktop Chiru can be `absolute`
- Chiru desktop: `hidden lg:block absolute -left-72 top-1/2 -translate-y-1/2 w-52`
- Chiru mobile: `lg:hidden flex justify-center mb-6` (above the Vibra logo)
- Pill `★ PREVENTA 2027 ★` (with `mx-auto` className passed in)
- H2 with sparkles wrapped in `relative inline-block` and `section-title` class
- Existing descriptive subtitle preserved
- Input: `border-white/30` → `border-2 border-vibra-orange/60` + `focus:shadow-[...]` orange glow
- Button: add `chunky-3d` class
- Form section unchanged in logic, only styling

- [ ] **Step 8.3: Run EmailRegister tests to confirm they pass**

Run: `npx jest __tests__/components/EmailRegister.test.tsx -v`
Expected: All 5 tests PASS.

- [ ] **Step 8.4: Run full test suite**

Run: `npm test`
Expected: All suites pass.

- [ ] **Step 8.5: Commit**

```bash
git add src/components/EmailRegister.tsx __tests__/components/EmailRegister.test.tsx
git commit -m "feat(email-register): apply brand polish — pill, sparkles, Chiru, branded form

EmailRegister now opens with the Vibra logo, an orange '★ PREVENTA
2027 ★' pill, a cyan-stroked H2 with twinkling sparkles, and a
Chiru flanking the form (left on lg+, above the logo on smaller
screens). The email input gets a stronger orange border with focus
glow; the submit button gets the chunky-3d shadow treatment.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 9 — Add Chiru between clouds in Hero

Only change to Hero in this redesign: add a Chiru floating among the clouds on desktop.

**Files:**
- Modify: `src/components/Hero.tsx`
- Modify: `__tests__/components/Hero.test.tsx` (add test for Chiru)

- [ ] **Step 9.1: Add a test for the Chiru in Hero**

Append to `describe('Hero', () => { ... })` in `__tests__/components/Hero.test.tsx`:

```tsx
  it('renders Chiru between the clouds (desktop only)', () => {
    const { container } = render(<Hero />)
    const chiru = container.querySelector('img[src*="Chiru"]')
    expect(chiru).not.toBeNull()
    expect(chiru?.className).toMatch(/hidden/)
    expect(chiru?.className).toMatch(/md:block/)
  })
```

Run: `npx jest __tests__/components/Hero.test.tsx -v`
Expected: New test FAILS (no Chiru in current Hero).

- [ ] **Step 9.2: Add Chiru image to Hero.tsx**

Edit `src/components/Hero.tsx`. After the 5 cloud `<Image>` elements (right before `{/* Contenido — mobile top-left, desktop centro-izquierda */}`), add:

```tsx
      {/* Chiru entre las nubes — solo desktop */}
      <Image
        src="/assets/branding/Chiru%20png%20.png"
        alt=""
        width={144}
        height={144}
        className="absolute top-12 right-12 md:right-24 z-35 w-24 md:w-36 opacity-85 animate-float hidden md:block"
        aria-hidden="true"
      />
```

Note on z-index: existing nubes use `z-30`, content uses `z-40`. Chiru gets `z-35` (between them). Tailwind doesn't have `z-35` by default — verify the JIT picks it up. If not, use arbitrary value `z-[35]`.

**If `z-35` doesn't compile** (Tailwind JIT may reject), change to `z-[35]`:

```tsx
className="absolute top-12 right-12 md:right-24 z-[35] w-24 md:w-36 opacity-85 animate-float hidden md:block"
```

- [ ] **Step 9.3: Run Hero tests to confirm they pass**

Run: `npx jest __tests__/components/Hero.test.tsx -v`
Expected: All 4 tests pass (3 original + 1 new Chiru).

- [ ] **Step 9.4: Run full test suite**

Run: `npm test`
Expected: All suites pass.

- [ ] **Step 9.5: Commit**

```bash
git add src/components/Hero.tsx __tests__/components/Hero.test.tsx
git commit -m "feat(hero): add Chiru floating between the clouds (desktop)

Chiru appears at top-right of the Hero, w-36 on desktop only,
opacity 85, floating with the existing animate-float keyframe.
z-index 35 sits between clouds (z-30) and the content motion.div
(z-40), so the text overlay still wins.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 10 — Insert SectionDividers in page.tsx

Add 5 `<SectionDivider />` between each pair of sections.

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 10.1: Update page.tsx with dividers**

Replace `src/app/page.tsx`:

```tsx
import Hero from '@/components/Hero'
import Stats from '@/components/Stats'
import Aftermovie from '@/components/Aftermovie'
import Timeline from '@/components/Timeline'
import SpotifyPlayer from '@/components/SpotifyPlayer'
import EmailRegister from '@/components/EmailRegister'
import SectionDivider from '@/components/SectionDivider'

export default function Home() {
  return (
    <main>
      <Hero />
      <SectionDivider />
      <Stats />
      <SectionDivider />
      <Aftermovie />
      <SectionDivider />
      <Timeline />
      <SectionDivider />
      <SpotifyPlayer />
      <SectionDivider />
      <EmailRegister />
    </main>
  )
}
```

- [ ] **Step 10.2: Run full test suite**

Run: `npm test`
Expected: All suites pass (no test for page.tsx — it's pure composition).

- [ ] **Step 10.3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat(page): insert SectionDivider between every pair of sections

Adds the brand '★ ✦ ★ ✦ ★' divider strip between Hero/Stats,
Stats/Aftermovie, Aftermovie/Timeline, Timeline/SpotifyPlayer, and
SpotifyPlayer/EmailRegister. Five dividers total. Each is a
self-contained role=separator block on vibra-purple background.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 11 — Final verification

Run lint, full test suite, production build, document manual QA.

**Files:**
- Read: all modified source files

- [ ] **Step 11.1: Run lint**

Run: `cd /c/Users/Principal/vibra-bolivia && npm run lint`

If it fails with the same pre-existing Next.js 16 CLI infra bug ("Invalid project directory provided, no such directory: ...\lint"), document that this is a pre-existing infra issue and continue.

- [ ] **Step 11.2: Run the full test suite**

Run: `cd /c/Users/Principal/vibra-bolivia && npm test`
Expected: All tests pass.

- [ ] **Step 11.3: Run the production build**

Run: `cd /c/Users/Principal/vibra-bolivia && npm run build`
Expected: Builds successfully. No type errors. No webpack errors.

- [ ] **Step 11.4: Manual QA checklist (skip execution, just document)**

Document this checklist for the human to run on `npm run dev` afterwards. Don't try to run the dev server visually yourself.

  - [ ] Scroll feels linear — no sticky stacking, no overlap between sections
  - [ ] Each section fades-up (opacity + 30px translate) when entering viewport (about 20% threshold)
  - [ ] Nubes drift sutilmente at different speed than content when scrolling (parallax)
  - [ ] Stats: 4 numbers stagger in (0/100/200/300ms) when section enters viewport
  - [ ] Timeline navigation dots stagger in (50ms apart) on initial mount
  - [ ] Each section (Stats, Aftermovie, Timeline, Spotify, EmailRegister) shows:
    - Orange pill with "★ [LABEL] ★" text above the H2
    - H2 with cyan outline stroke (1.5px #4FC3F7)
    - 5 yellow sparkles around the H2 area, twinkling on loop
  - [ ] Stats: numbers have chunky 3D shadow (orange + black drop)
  - [ ] Stats: "★ ★ ★ SEGUNDA EDICIÓN ★ ★ ★" eyebrow below H2
  - [ ] Aftermovie: "★ ★ ★ AFTERMOVIE OFICIAL ★ ★ ★" eyebrow replaces old subtitle
  - [ ] Aftermovie iframe: stronger orange border (/80) + glow
  - [ ] Timeline cover image: orange border-2 frame
  - [ ] Spotify iframe: stronger blue border (/70) + glow
  - [ ] EmailRegister: Chiru on the left side (≥1024px width) or above the logo (<1024px)
  - [ ] EmailRegister input: orange border, focus shows orange glow
  - [ ] EmailRegister button "Me anoto": chunky-3d shadow
  - [ ] Hero: Chiru floating in top-right area among the clouds (desktop only, w-36)
  - [ ] Hero copy unchanged: "2027 viene con todo / Algo grande se está armando"
  - [ ] Page has 5 ★ ✦ ★ ✦ ★ dividers between sections
  - [ ] Stats section-internal interactions still work (count-up triggers, Chiru responsive)
  - [ ] Timeline ← → and dots navigate
  - [ ] Aftermovie YouTube plays
  - [ ] Spotify iframe loads
  - [ ] EmailRegister form submits (idle → loading → success/error)
  - [ ] In DevTools → Rendering tab, enable "Emulate CSS prefers-reduced-motion: reduce". Reload. Confirm:
    - No fade-up reveal on section entry — content appears immediately
    - Sparkles do not animate (stay static at scale 1, opacity 1)
    - Cloud parallax still slides (it's tied to scroll, not the reduced-motion preference)
    - Stats count-up still triggers normally
    - Stagger animations are skipped or instant

- [ ] **Step 11.5: Commit empty verification note**

```bash
cd /c/Users/Principal/vibra-bolivia
git commit --allow-empty -m "chore: verify redesign — revert sticky + brand-faithful polish

Verified:
- npm test: all suites pass (count grows after Tasks 4-8 add new
  component tests)
- npm run build: successful
- npm run lint: blocked by pre-existing Next.js 16 CLI infra bug

Manual QA checklist documented in
docs/superpowers/plans/2026-05-16-redesign-revert-sticky-brand-polish.md
Step 11.4.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Self-Review Notes

**Spec coverage check:**
- Spec Bloque 1 (revert + reveal/parallax/stagger) → Tasks 1 + 2 (revert + reveal wrapper), Stats stagger in Task 4, Timeline stagger in Task 6. Parallax already exists in SectionWrapper, preserved across revert in Task 1. ✓
- Spec Bloque 2 (typography + sparkles) → Task 3 (CSS + Sparkles component), applied per section in Tasks 4-8. ✓
- Spec Bloque 3 (Chiru placements) → Stats unchanged (preserved in Task 1), Hero Task 9, EmailRegister Task 8. ✓
- Spec Bloque 4 (visual density) → Task 3 (SectionPill, SectionDivider), pills applied per section in Tasks 4-8, dividers in Task 10, borders in Tasks 5/6/7, EmailRegister form branding in Task 8, Stats optional frame omitted (kept simple — can revisit in QA). ✓
- Spec "Lo que NO cambia" → Hero copy preserved through Task 1 revert. Tests verify it. ✓
- Reduced-motion handling → Task 2 (reveal wrapper), Task 3 (Sparkles component). ✓

**Placeholder scan:** All steps have actual code or actual commands. No TBD/TODO/fill-later. The `z-35` vs `z-[35]` decision in Step 9.2 is documented inline so the engineer can decide.

**Type consistency:**
- `SectionPill` interface uses `children: React.ReactNode` and optional `className?: string`. Consistent across consumers. ✓
- `Sparkles` has no props. ✓
- `SectionDivider` has no props. ✓
- All test files import from `@/components/X` matching production paths. ✓
- `data-testid="sparkle"` defined in Sparkles.tsx, used in tests across multiple sections. ✓
- `data-testid="reveal-wrapper"` defined in SectionWrapper.tsx (Task 2), used in test (same task). ✓
- `Stats` optional frame was mentioned in the spec but deferred — engineer can add `rounded-3xl bg-black/10 backdrop-blur-sm p-8` around the grid in Step 4.2 if desired, but not required.

**Risks flagged in spec are addressed:**
- Sparkles performance — 5×5 = 25 animations. Mitigation: framer-motion is efficient; if jank in QA, easy to reduce sparkle count in Sparkles.tsx.
- SectionDivider may feel noisy — easy revert by removing from page.tsx (Task 10).
- Stats frame opcional — left out by default, engineer can add if desired.
- Chiru between clouds Hero — z-index documented; tests verify class presence.

Plan looks complete.
