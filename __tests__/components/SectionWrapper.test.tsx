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
