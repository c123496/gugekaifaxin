import { describe, it, expect, vi } from 'vitest';
import { runSearchPipeline } from '@/lib/searchPipeline';

describe('runSearchPipeline', () => {
  it('从搜索结果抽取公司与邮箱并去重', async () => {
    const fakeSearch = vi.fn().mockResolvedValue([
      { title: 'Acme Safety | Home', url: 'https://acme.com', content: '', rawContent: 'Contact sales@acme.com' },
      { title: 'Beta PPE', url: 'https://beta.com', content: '', rawContent: 'no email here' },
    ]);

    const companies = await runSearchPipeline({
      categoryId: 'ppe',
      categoryLabel: 'PPE / 劳保安全用品分销商',
      regionLabel: '美国',
      query: 'q',
      search: fakeSearch,
      existingKeys: new Set<string>(),
    });

    expect(companies).toHaveLength(2);
    expect(companies[0]).toMatchObject({
      company_name: 'Acme Safety',
      email: 'sales@acme.com',
      region: '美国',
      customer_type: 'PPE / 劳保安全用品分销商',
      search_category: 'ppe',
      source: 'https://acme.com',
    });
    expect(companies[1].email).toBeNull();
  });

  it('排除已存在键', async () => {
    const fakeSearch = vi.fn().mockResolvedValue([
      { title: 'Acme', url: 'https://acme.com', content: '', rawContent: 'sales@acme.com' },
    ]);
    const companies = await runSearchPipeline({
      categoryId: 'ppe', categoryLabel: 'PPE', regionLabel: '美国', query: 'q',
      search: fakeSearch, existingKeys: new Set(['email:sales@acme.com']),
    });
    expect(companies).toHaveLength(0);
  });
});
