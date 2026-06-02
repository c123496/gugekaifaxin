export interface TavilyResult {
  title: string;
  url: string;
  content: string;
  rawContent: string;
}

export async function tavilySearch(
  query: string,
  apiKey: string,
  maxResults = 10,
): Promise<TavilyResult[]> {
  const res = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      query,
      max_results: maxResults,
      search_depth: 'basic',
      include_raw_content: true,
    }),
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Tavily 请求失败 (${res.status}): ${detail}`);
  }
  const data = (await res.json()) as { results?: any[] };
  return (data.results ?? []).map((r) => ({
    title: r.title ?? '',
    url: r.url ?? '',
    content: r.content ?? '',
    rawContent: r.raw_content ?? '',
  }));
}
