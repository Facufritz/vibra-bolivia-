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
    // The content wrapper is identified by max-w-xl (unique to it)
    const content = container.querySelector('[class*="max-w-xl"]')
    expect(content).not.toBeNull()
    expect(content?.className).toMatch(/top-8/)
    expect(content?.className).toMatch(/left-4/)
    expect(content?.className).toMatch(/md:top-1\/2/)
    expect(content?.className).toMatch(/md:-translate-y-1\/2/)
  })

  it('renders Chiru between the clouds (desktop only)', () => {
    const { container } = render(<Hero />)
    const chiru = container.querySelector('img[src*="Chiru"]')
    expect(chiru).not.toBeNull()
    expect(chiru?.className).toMatch(/hidden/)
    expect(chiru?.className).toMatch(/md:block/)
  })
})
