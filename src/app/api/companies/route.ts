import { NextRequest, NextResponse } from 'next/server';
import { checkAccess } from '@/lib/auth';
import { sql } from '@/lib/db';

function guard(req: NextRequest): boolean {
  return checkAccess(req.nextUrl.searchParams.get('key'), process.env.APP_ACCESS_KEY);
}

export async function GET(req: NextRequest) {
  if (!guard(req)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const rows = await sql`
    SELECT c.*, l.subject, l.body
    FROM companies c
    LEFT JOIN LATERAL (
      SELECT subject, body FROM letters
      WHERE company_id = c.id ORDER BY created_at DESC LIMIT 1
    ) l ON true
    ORDER BY c.created_at DESC`;
  return NextResponse.json({ companies: rows });
}

export async function DELETE(req: NextRequest) {
  if (!guard(req)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const { id } = (await req.json()) as { id: number };
  await sql`DELETE FROM companies WHERE id = ${id}`;
  return NextResponse.json({ ok: true });
}
