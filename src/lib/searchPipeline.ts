import type { TavilyResult } from './tavily';
import { extractEmails } from './emailExtract';
import { companyNameFromResult } from './parseResult';
import { dedupeBatch, dedupeKey } from './dedupe';
import type { CategoryId } from './searchQueries';

export interface PipelineCompany {
  company_name: string;
  contact: string | null;
  email: string | null;
  region: string;
  customer_type: string;
  source: string;
  search_category: string;
  dedupe_key: string;
}

export interface PipelineArgs {
  categoryId: CategoryId;
  categoryLabel: string;
  regionLabel: string;
  query: string;
  search: (query: string) => Promise<TavilyResult[]>;
  existingKeys: Set<string>;
}

export async function runSearchPipeline(args: PipelineArgs): Promise<PipelineCompany[]> {
  const results = await args.search(args.query);
  const raw: PipelineCompany[] = results.map((r) => {
    const text = `${r.rawContent}\n${r.content}`;
    const email = extractEmails(text)[0] ?? null;
    const companyName = companyNameFromResult(r.title, r.url);
    const base = { email, companyName, region: args.regionLabel };
    return {
      company_name: companyName,
      contact: null,
      email,
      region: args.regionLabel,
      customer_type: args.categoryLabel,
      source: r.url,
      search_category: args.categoryId,
      dedupe_key: dedupeKey(base),
    };
  }).filter((c) => c.company_name.length > 0);

  return dedupeBatch(
    raw.map((c) => ({ ...c, companyName: c.company_name })),
    args.existingKeys,
  ).map(({ companyName, ...rest }) => rest);
}
