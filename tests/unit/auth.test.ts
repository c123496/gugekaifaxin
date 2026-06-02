import { describe, it, expect } from 'vitest';
import { checkAccess } from '@/lib/auth';

describe('checkAccess', () => {
  it('密码匹配返回 true', () => {
    expect(checkAccess('jinda2026', 'jinda2026')).toBe(true);
  });
  it('不匹配返回 false', () => {
    expect(checkAccess('wrong', 'jinda2026')).toBe(false);
  });
  it('未配置期望密码时一律拒绝', () => {
    expect(checkAccess('anything', undefined)).toBe(false);
  });
  it('null 输入返回 false', () => {
    expect(checkAccess(null, 'jinda2026')).toBe(false);
  });
});
