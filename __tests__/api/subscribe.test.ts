/**
 * @jest-environment node
 */

import { POST } from '@/app/api/subscribe/route'
import { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'

jest.mock('@/lib/supabase', () => ({
  supabase: { from: jest.fn() },
}))

const mockFrom = jest.mocked(supabase.from)

function makeRequest(body: unknown) {
  return new NextRequest('http://localhost/api/subscribe', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })
}

function mockInsert(result: { error: null | { code: string } }) {
  mockFrom.mockReturnValue({ insert: jest.fn().mockResolvedValue(result) } as any)
}

describe('POST /api/subscribe', () => {
  beforeEach(() => mockInsert({ error: null }))

  it('returns 400 when email is missing', async () => {
    const res = await POST(makeRequest({}))
    expect(res.status).toBe(400)
    expect((await res.json()).error).toBe('Email requerido')
  })

  it('returns 400 when email format is invalid', async () => {
    const res = await POST(makeRequest({ email: 'not-an-email' }))
    expect(res.status).toBe(400)
    expect((await res.json()).error).toBe('Email inválido')
  })

  it('returns 200 with ok:true for valid email', async () => {
    const res = await POST(makeRequest({ email: 'test@example.com' }))
    expect(res.status).toBe(200)
    expect((await res.json()).ok).toBe(true)
  })

  it('returns 409 when email is already registered', async () => {
    mockInsert({ error: { code: '23505' } })
    const res = await POST(makeRequest({ email: 'existing@example.com' }))
    expect(res.status).toBe(409)
    expect((await res.json()).error).toBe('Este email ya está registrado')
  })

  it('returns 500 on unexpected database error', async () => {
    mockInsert({ error: { code: '42501' } })
    const res = await POST(makeRequest({ email: 'test2@example.com' }))
    expect(res.status).toBe(500)
    expect((await res.json()).error).toBe('Error al guardar')
  })
})
