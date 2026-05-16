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
    const { container } = render(<Timeline />)
    // 'LINE UP 2026' appears in the pill — use querySelector to find it
    const pillText = Array.from(container.querySelectorAll('div')).find(el => /LINE UP 2026/i.test(el.textContent || ''))
    expect(pillText).toBeTruthy()
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
