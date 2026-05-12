import '@testing-library/jest-dom'

// Mock requestAnimationFrame for tests
global.requestAnimationFrame = (callback: FrameRequestCallback) => {
  return setTimeout(() => callback(Date.now()), 0) as unknown as number
}
global.cancelAnimationFrame = (id: number) => clearTimeout(id)
