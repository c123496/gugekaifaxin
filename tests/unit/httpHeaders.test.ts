import { describe, it, expect } from 'vitest';
import { attachmentDisposition } from '@/lib/httpHeaders';

describe('attachmentDisposition', () => {
  it('对非 ASCII 文件名做 RFC 5987 编码，且整串可放入 HTTP 头（全为 Latin-1 字节）', () => {
    const header = attachmentDisposition('开发信客户邮箱.xlsx', 'kaifaxin.xlsx');
    expect(header).toContain('filename="kaifaxin.xlsx"');
    expect(header).toContain("filename*=UTF-8''");
    expect(header).toContain(encodeURIComponent('开发信客户邮箱.xlsx'));
    // 关键回归点：整串不含 >255 的字符，否则放入响应头会抛 ByteString 错误
    expect([...header].every((ch) => ch.charCodeAt(0) <= 255)).toBe(true);
  });
});
