import { NextRequest, NextResponse } from 'next/server';
import { checkAccess } from '@/lib/auth';
import { sql } from '@/lib/db';

function guard(req: NextRequest): boolean {
  return checkAccess(req.nextUrl.searchParams.get('key'), process.env.APP_ACCESS_KEY);
}

export async function GET(req: NextRequest) {
  if (!guard(req)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const rows = await sql`SELECT company_profile FROM settings WHERE id = 1`;
  return NextResponse.json({ companyProfile: rows[0]?.company_profile ?? '' });
}

export async function PUT(req: NextRequest) {
  if (!guard(req)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const { companyProfile } = (await req.json()) as { companyProfile: string };
  await sql`UPDATE settings SET company_profile = ${companyProfile}, updated_at = now() WHERE id = 1`;
  return NextResponse.json({ ok: true });
}
