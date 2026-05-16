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
    const { getAllByText } = render(<Aftermovie />)
    expect(getAllByText(/AFTERMOVIE OFICIAL/i).length).toBeGreaterThan(0)
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
