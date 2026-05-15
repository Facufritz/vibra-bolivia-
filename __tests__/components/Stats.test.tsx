import { render, screen } from '@testing-library/react'
import Stats from '@/components/Stats'

// jsdom doesn't implement IntersectionObserver; Stats uses it to trigger count-up.
class MockIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() { return [] }
}
;(global as unknown as { IntersectionObserver: typeof MockIntersectionObserver }).IntersectionObserver =
  MockIntersectionObserver

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
