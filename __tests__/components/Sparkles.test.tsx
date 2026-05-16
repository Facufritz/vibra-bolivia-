import { render } from '@testing-library/react'
import Sparkles from '@/components/Sparkles'

jest.mock('framer-motion', () => {
  const actual = jest.requireActual('framer-motion')
  return {
    ...actual,
    useReducedMotion: () => false,
  }
})

describe('Sparkles', () => {
  it('renders 5 sparkle SVGs', () => {
    const { getAllByTestId } = render(<Sparkles />)
    expect(getAllByTestId('sparkle')).toHaveLength(5)
  })

  it('each sparkle has fill #FFD700 (yellow)', () => {
    const { getAllByTestId } = render(<Sparkles />)
    const sparkles = getAllByTestId('sparkle')
    sparkles.forEach(s => {
      expect(s.getAttribute('fill')).toBe('#FFD700')
    })
  })
})
