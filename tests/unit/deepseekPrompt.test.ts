import { describe, it, expect, vi, afterEach } from 'vitest';
import { buildLetterPrompt, generateLetter } from '@/lib/deepseek';

afterEach(() => vi.restoreAllMocks());

describe('buildLetterPrompt', () => {
  it('包含对方公司信息与金达卖点，并要求 JSON', () => {
    const { system, user } = buildLetterPrompt({
      companyName: 'Acme Safety',
      customerType: 'PPE / 劳保安全用品分销商',
      region: '美国',
      companyProfile: 'Jinda 13 years',
    });
    expect(system).toMatch(/JSON/i);
    expect(user).toContain('Acme Safety');
    expect(user).toContain('PPE');
    expect(user).toContain('Jinda 13 years');
  });
});

describe('generateLetter', () => {
  it('解析 DeepSeek 返回的 JSON', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: '{"subject":"Hello","body":"Dear Acme"}' } }],
      }),
    }));
    const letter = await generateLetter(
      { companyName: 'Acme', customerType: 'PPE', region: '美国', companyProfile: 'p' },
      'key',
    );
    expect(letter).toEqual({ subject: 'Hello', body: 'Dear Acme' });
  });

  it('API 失败时抛错', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 401, text: async () => 'bad' }));
    await expect(
      generateLetter({ companyName: 'A', customerType: 'B', region: 'C', companyProfile: 'p' }, 'key'),
    ).rejects.toThrow(/DeepSeek/);
  });
});
