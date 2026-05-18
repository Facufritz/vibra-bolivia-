import React from 'react'

interface SectionPillProps {
  children: React.ReactNode
  className?: string
}

export default function SectionPill({ children, className = '' }: SectionPillProps) {
  return (
    <div
      className={`inline-block bg-vibra-orange text-black font-display text-xs md:text-sm tracking-[0.2em] uppercase px-4 py-1.5 rounded-full mb-4 whitespace-nowrap ${className}`}
    >
      {children}
    </div>
  )
}
