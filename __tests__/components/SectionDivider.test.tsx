import { render } from '@testing-library/react'
import SectionDivider from '@/components/SectionDivider'

describe('SectionDivider', () => {
  it('renders the star/sparkle pattern', () => {
    const { getByText } = render(<SectionDivider />)
    expect(getByText('★ ✦ ★ ✦ ★')).toBeInTheDocument()
  })

  it('has role=separator and aria-hidden', () => {
    const { container } = render(<SectionDivider />)
    const divider = container.firstChild as HTMLElement
    expect(divider.getAttribute('role')).toBe('separator')
    expect(divider.getAttribute('aria-hidden')).toBe('true')
  })
})
