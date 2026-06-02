import { NextRequest, NextResponse } from 'next/server';
import { checkAccess } from '@/lib/auth';
import { sql } from '@/lib/db';
import { generateLetter } from '@/lib/deepseek';
import { buildLetterInput } from '@/lib/generatePipeline';

export async function POST(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key');
  if (!checkAccess(key, process.env.APP_ACCESS_KEY)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const { ids } = (await req.json()) as { ids: number[] };
  if (!Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ error: 'no ids' }, { status: 400 });
  }

  try {
    const settingsRows = await sql`SELECT company_profile FROM settings WHERE id = 1`;
    const profile = (settingsRows[0]?.company_profile as string) ?? '';

    let generated = 0;
    for (const id of ids) {
      const rows = await sql`SELECT company_name, customer_type, region FROM companies WHERE id = ${id}`;
      const row = rows[0] as any;
      if (!row) continue;
      const letter = await generateLetter(
        buildLetterInput(row, profile),
        process.env.DEEPSEEK_API_KEY!,
      );
      await sql`INSERT INTO letters (company_id, subject, body)
                VALUES (${id}, ${letter.subject}, ${letter.body})`;
      await sql`UPDATE companies SET status = '已生成' WHERE id = ${id}`;
      generated += 1;
    }
    return NextResponse.json({ generated });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
