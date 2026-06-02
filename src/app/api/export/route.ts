import { NextRequest, NextResponse } from 'next/server';
import { checkAccess } from '@/lib/auth';
import { sql } from '@/lib/db';
import { buildExcel, type ExportRow } from '@/lib/excel';
import { attachmentDisposition } from '@/lib/httpHeaders';

export async function POST(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key');
  if (!checkAccess(key, process.env.APP_ACCESS_KEY)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const { ids } = (await req.json()) as { ids: number[] };
  if (!Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ error: 'no ids' }, { status: 400 });
  }

  const rows = await sql`
    SELECT c.id, c.company_name, c.contact, c.email, c.region, c.customer_type, c.source,
           l.subject, l.body
    FROM companies c
    LEFT JOIN LATERAL (
      SELECT subject, body FROM letters WHERE company_id = c.id ORDER BY created_at DESC LIMIT 1
    ) l ON true
    WHERE c.id = ANY(${ids})
    ORDER BY c.id`;

  const exportRows: ExportRow[] = rows.map((r: any, i: number) => ({
    no: i + 1,
    companyName: r.company_name ?? '',
    contact: r.contact ?? '',
    email: r.email ?? '',
    region: r.region ?? '',
    customerType: r.customer_type ?? '',
    source: r.source ?? '',
    subject: r.subject ?? '',
    body: r.body ?? '',
  }));

  const buf = await buildExcel(exportRows);
  await sql`UPDATE companies SET status = '已导出' WHERE id = ANY(${ids})`;

  return new NextResponse(buf as any, {
    status: 200,
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': attachmentDisposition('开发信客户邮箱.xlsx', 'kaifaxin.xlsx'),
    },
  });
}
