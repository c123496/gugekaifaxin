import { describe, it, expect } from 'vitest';
import { extractDomain, companyNameFromResult } from '@/lib/parseResult';

describe('extractDomain', () => {
  it('去掉协议与 www', () => {
    expect(extractDomain('https://www.acme.com/contact')).toBe('acme.com');
  });
  it('非法 URL 返回空串', () => {
    expect(extractDomain('not a url')).toBe('');
  });
});

describe('companyNameFromResult', () => {
  it('优先用标题，去掉常见后缀', () => {
    expect(companyNameFromResult('Acme Safety | Home', 'https://acme.com')).toBe('Acme Safety');
  });
  it('标题为空时回退到域名主体', () => {
    expect(companyNameFromResult('', 'https://acme-safety.com')).toBe('Acme-safety');
  });
});
