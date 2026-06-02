import { describe, it, expect, vi, afterEach } from 'vitest';
import { tavilySearch } from '@/lib/tavily';

afterEach(() => vi.restoreAllMocks());

describe('tavilySearch', () => {
  it('调用 Tavily 并映射结果', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        results: [
          { title: 'Acme', url: 'https://acme.com', content: 'c1', raw_content: 'info@acme.com' },
        ],
      }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const results = await tavilySearch('q', 'key', 5);

    expect(results).toEqual([
      { title: 'Acme', url: 'https://acme.com', content: 'c1', rawContent: 'info@acme.com' },
    ]);
    const [, init] = fetchMock.mock.calls[0];
    expect(init.headers.Authorization).toBe('Bearer key');
    expect(JSON.parse(init.body).query).toBe('q');
  });

  it('HTTP 失败时抛错', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 429, text: async () => 'limit' }));
    await expect(tavilySearch('q', 'key')).rejects.toThrow(/Tavily/);
  });
});
