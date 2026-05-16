import { render } from '@testing-library/react'
import SectionPill from '@/components/SectionPill'

describe('SectionPill', () => {
  it('renders children inside an orange pill', () => {
    const { getByText, container } = render(<SectionPill>★ TEST ★</SectionPill>)
    expect(getByText(/test/i)).toBeInTheDocument()
    const pill = container.firstChild as HTMLElement
    expect(pill.className).toMatch(/bg-vibra-orange/)
    expect(pill.className).toMatch(/rounded-full/)
  })

  it('appends extra className when provided', () => {
    const { container } = render(<SectionPill className="mx-auto">X</SectionPill>)
    const pill = container.firstChild as HTMLElement
    expect(pill.className).toMatch(/mx-auto/)
  })
})
