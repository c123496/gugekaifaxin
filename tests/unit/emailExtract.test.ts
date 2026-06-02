import { describe, it, expect } from 'vitest';
import { extractEmails } from '@/lib/emailExtract';

describe('extractEmails', () => {
  it('提取并小写化、去重邮箱', () => {
    const html = `<a href="mailto:Sales@Acme.com">Sales@Acme.com</a> info@acme.com`;
    expect(extractEmails(html)).toEqual(['sales@acme.com', 'info@acme.com']);
  });

  it('过滤图片/示例/占位等垃圾邮箱', () => {
    const html = `logo@2x.png a@example.com real@company.com u@sentry.io name@domain`;
    expect(extractEmails(html)).toEqual(['real@company.com']);
  });

  it('没有邮箱时返回空数组', () => {
    expect(extractEmails('<p>no contact here</p>')).toEqual([]);
  });
});
