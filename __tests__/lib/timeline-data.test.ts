import { TIMELINE_2026 } from '@/lib/timeline-data'

describe('TIMELINE_2026', () => {
  it('has 11 entries', () => {
    expect(TIMELINE_2026).toHaveLength(11)
  })

  it('first entry is at 15:00', () => {
    expect(TIMELINE_2026[0].time).toBe('15:00')
  })

  it('last entry is at 00:20', () => {
    expect(TIMELINE_2026[TIMELINE_2026.length - 1].time).toBe('00:20')
  })

  it('every entry has time, artist and photoFolder', () => {
    TIMELINE_2026.forEach((entry) => {
      expect(entry.time).toBeTruthy()
      expect(entry.artist).toBeTruthy()
      expect(entry.photoFolder).toBeTruthy()
    })
  })
})
