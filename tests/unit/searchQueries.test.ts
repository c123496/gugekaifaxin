import { describe, it, expect } from 'vitest';
import { CATEGORIES, REGIONS, buildQuery } from '@/lib/searchQueries';

describe('searchQueries', () => {
  it('恰好 7 个分类', () => {
    expect(CATEGORIES).toHaveLength(7);
  });
  it('每个分类有 id/label/queryTemplate', () => {
    for (const c of CATEGORIES) {
      expect(c.id).toBeTruthy();
      expect(c.label).toBeTruthy();
      expect(c.queryTemplate).toContain('{region}');
    }
  });
  it('地区包含美国且为默认第一项', () => {
    expect(REGIONS[0].label).toBe('美国');
  });
  it('buildQuery 注入地区英文名', () => {
    const q = buildQuery('hiviz', 'us');
    expect(q).toContain('United States');
    expect(q).not.toContain('{region}');
  });
  it('未知分类抛错', () => {
    expect(() => buildQuery('nope' as any, 'us')).toThrow();
  });
});
