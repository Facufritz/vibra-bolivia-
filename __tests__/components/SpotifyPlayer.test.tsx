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
    const { container } = render(<SpotifyPlayer />)
    const found = Array.from(container.querySelectorAll('div')).find(el => /PLAYLIST OFICIAL/i.test(el.textContent || ''))
    expect(found).toBeTruthy()
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
