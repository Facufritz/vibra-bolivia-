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
