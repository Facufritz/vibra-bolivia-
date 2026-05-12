import { renderHook, act } from '@testing-library/react'
import { useCountUp } from '@/hooks/useCountUp'

describe('useCountUp', () => {
  beforeEach(() => jest.useFakeTimers())
  afterEach(() => jest.useRealTimers())

  it('starts at 0 when trigger is false', () => {
    const { result } = renderHook(() => useCountUp(100, 1000, false))
    expect(result.current).toBe(0)
  })

  it('reaches target value when trigger is true and animation completes', async () => {
    const { result } = renderHook(() => useCountUp(100, 100, true))
    act(() => jest.advanceTimersByTime(200))
    expect(result.current).toBe(100)
  })
})
