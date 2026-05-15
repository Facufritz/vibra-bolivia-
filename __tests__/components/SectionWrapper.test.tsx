import { render } from '@testing-library/react'
import SectionWrapper from '@/components/SectionWrapper'

let mockReduceMotion = false

// Mock framer-motion so jsdom doesn't choke on scroll context
jest.mock('framer-motion', () => {
  const actual = jest.requireActual('framer-motion')
  return {
    ...actual,
    useScroll: () => ({ scrollYProgress: { get: () => 0, on: () => () => {} } }),
    useTransform: () => 0,
    useReducedMotion: () => mockReduceMotion,
  }
})

beforeEach(() => {
  mockReduceMotion = false
})

describe('SectionWrapper', () => {
  it('applies sticky + min-h-screen + rounded-t classes by default', () => {
    const { container } = render(<SectionWrapper>content</SectionWrapper>)
    const section = container.querySelector('section')
    expect(section?.className).toMatch(/sticky/)
    expect(section?.className).toMatch(/top-0/)
    expect(section?.className).toMatch(/min-h-screen/)
    expect(section?.className).toMatch(/rounded-t-3xl/)
  })

  it('omits rounded-t and negative margin when isFirst is true', () => {
    const { container } = render(<SectionWrapper isFirst>content</SectionWrapper>)
    const section = container.querySelector('section')
    expect(section?.className).not.toMatch(/rounded-t-3xl/)
    expect(section?.className).not.toMatch(/-mt-6/)
  })

  it('renders the dark overlay div', () => {
    const { container } = render(<SectionWrapper>content</SectionWrapper>)
    const overlay = container.querySelector('[data-testid="dark-overlay"]')
    expect(overlay).not.toBeNull()
  })

  it('disables sticky and overlay when reduced-motion is set', () => {
    mockReduceMotion = true
    const { container } = render(<SectionWrapper>content</SectionWrapper>)
    const section = container.querySelector('section')
    expect(section?.className).not.toMatch(/sticky/)
    const overlay = container.querySelector('[data-testid="dark-overlay"]')
    expect(overlay).toBeNull()
  })
})
