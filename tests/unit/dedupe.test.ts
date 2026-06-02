import { describe, it, expect } from 'vitest';
import { dedupeKey, dedupeBatch } from '@/lib/dedupe';

describe('dedupeKey', () => {
  it('有邮箱时按邮箱（小写）', () => {
    expect(dedupeKey({ email: 'A@B.com', companyName: 'X', region: '美国' })).toBe('email:a@b.com');
  });
  it('无邮箱时按公司名+地区（小写去空格）', () => {
    expect(dedupeKey({ email: null, companyName: ' Acme ', region: '美国' })).toBe('name:acme|美国');
  });
});

describe('dedupeBatch', () => {
  it('批内去重并排除已存在的键', () => {
    const items = [
      { email: 'a@x.com', companyName: 'A', region: '美国' },
      { email: 'a@x.com', companyName: 'A2', region: '美国' },
      { email: 'b@x.com', companyName: 'B', region: '美国' },
    ];
    const result = dedupeBatch(items, new Set(['email:b@x.com']));
    expect(result.map((r) => r.companyName)).toEqual(['A']);
  });
});
