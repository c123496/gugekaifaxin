import { describe, it, expect } from 'vitest';
import ExcelJS from 'exceljs';
import { buildExcel, EXPORT_HEADERS } from '@/lib/excel';

describe('buildExcel', () => {
  it('表头与现有样本一致并追加开发信两列', () => {
    expect(EXPORT_HEADERS).toEqual([
      'No', 'Company', 'Contact', 'Email', 'Region/Country', 'CustomerType', 'Source', 'Subject', 'Body',
    ]);
  });

  it('生成可被解析的 xlsx，含数据行', async () => {
    const buf = await buildExcel([
      {
        no: 1, companyName: 'Acme', contact: 'Sales', email: 'a@acme.com',
        region: '美国', customerType: 'PPE', source: 'https://acme.com',
        subject: 'Hi', body: 'Dear Acme',
      },
    ]);
    const wb = new ExcelJS.Workbook();
    await wb.xlsx.load(buf as any);
    const ws = wb.worksheets[0];
    expect(ws.getRow(1).getCell(2).value).toBe('Company');
    expect(ws.getRow(2).getCell(2).value).toBe('Acme');
    expect(ws.getRow(2).getCell(9).value).toBe('Dear Acme');
  });
});
