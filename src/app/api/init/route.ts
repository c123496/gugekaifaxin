import { NextRequest, NextResponse } from 'next/server';
import { checkAccess } from '@/lib/auth';
import { initDb } from '@/lib/initDb';

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key');
  if (!checkAccess(key, process.env.APP_ACCESS_KEY)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  await initDb();
  return NextResponse.json({ ok: true });
}
