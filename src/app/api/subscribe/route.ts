import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

/**
 * Supabase table required (create manually in the Supabase dashboard):
 *
 * CREATE TABLE subscribers (
 *   id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 *   email      text UNIQUE NOT NULL,
 *   source     text NOT NULL DEFAULT 'landing',
 *   created_at timestamptz NOT NULL DEFAULT now()
 * );
 *
 * The UNIQUE constraint on `email` produces error code 23505 on duplicate inserts.
 *
 * IMPORTANT — enable RLS on the subscribers table in Supabase:
 *   ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
 * Then add an INSERT-only policy for the anon role (no SELECT policy = no public reads):
 *   CREATE POLICY "anon insert only"
 *     ON subscribers FOR INSERT TO anon
 *     WITH CHECK (true);
 */

// In-memory rate limit: max 5 requests per IP per minute
const rateLimitMap = new Map<string, { count: number; reset: number }>()
const RATE_WINDOW_MS = 60_000
const RATE_MAX = 5

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || now > entry.reset) {
    rateLimitMap.set(ip, { count: 1, reset: now + RATE_WINDOW_MS })
    return true
  }
  if (entry.count >= RATE_MAX) return false
  entry.count++
  return true
}

function isValidEmail(email: string): boolean {
  if (email.length > 254) return false
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'

  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Demasiados intentos. Esperá un momento.' }, { status: 429 })
  }

  const body = await req.json().catch(() => null)

  if (typeof body?.website === 'string' && body.website.length > 0) {
    return NextResponse.json({ ok: true })
  }

  if (!body?.email || typeof body.email !== 'string') {
    return NextResponse.json({ error: 'Email requerido' }, { status: 400 })
  }

  if (!isValidEmail(body.email)) {
    return NextResponse.json({ error: 'Email inválido' }, { status: 400 })
  }

  const { error } = await supabase
    .from('subscribers')
    .insert({ email: body.email.toLowerCase().trim(), source: 'landing' })

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Este email ya está registrado' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Error al guardar' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
