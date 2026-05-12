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
 */

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)

  if (!body?.email) {
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
