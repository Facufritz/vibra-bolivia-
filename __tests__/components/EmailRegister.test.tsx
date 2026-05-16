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
    const { container } = render(<EmailRegister />)
    const found = Array.from(container.querySelectorAll('div')).find(el => /PREVENTA 2027/i.test(el.textContent || ''))
    expect(found).toBeTruthy()
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
