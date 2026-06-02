import { NextRequest, NextResponse } from 'next/server';
import { checkAccess } from '@/lib/auth';
import { sql } from '@/lib/db';
import { tavilySearch } from '@/lib/tavily';
import { buildQuery, CATEGORIES, REGIONS, type CategoryId } from '@/lib/searchQueries';
import { runSearchPipeline } from '@/lib/searchPipeline';

export async function POST(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key');
  if (!checkAccess(key, process.env.APP_ACCESS_KEY)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const { categoryId, regionId } = (await req.json()) as { categoryId: CategoryId; regionId: string };
  const category = CATEGORIES.find((c) => c.id === categoryId);
  const region = REGIONS.find((r) => r.id === regionId);
  if (!category || !region) {
    return NextResponse.json({ error: 'invalid category or region' }, { status: 400 });
  }

  try {
    const rows = await sql`SELECT dedupe_key FROM companies`;
    const existingKeys = new Set(rows.map((r: any) => r.dedupe_key as string));
    const companies = await runSearchPipeline({
      categoryId,
      categoryLabel: category.label,
      regionLabel: region.label,
      query: buildQuery(categoryId, regionId),
      search: (q) => tavilySearch(q, process.env.TAVILY_API_KEY!),
      existingKeys,
    });

    let inserted = 0;
    for (const c of companies) {
      await sql`INSERT INTO companies
        (company_name, contact, email, region, customer_type, source, search_category, dedupe_key)
        VALUES (${c.company_name}, ${c.contact}, ${c.email}, ${c.region},
                ${c.customer_type}, ${c.source}, ${c.search_category}, ${c.dedupe_key})
        ON CONFLICT (dedupe_key) DO NOTHING`;
      inserted += 1;
    }
    return NextResponse.json({ found: companies.length, inserted });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
