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
