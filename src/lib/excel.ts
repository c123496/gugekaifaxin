import ExcelJS from 'exceljs';

export const EXPORT_HEADERS = [
  'No', 'Company', 'Contact', 'Email', 'Region/Country', 'CustomerType', 'Source', 'Subject', 'Body',
] as const;

export interface ExportRow {
  no: number;
  companyName: string;
  contact: string;
  email: string;
  region: string;
  customerType: string;
  source: string;
  subject: string;
  body: string;
}

export async function buildExcel(rows: ExportRow[]): Promise<Buffer> {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('开发信');
  ws.addRow([...EXPORT_HEADERS]);
  ws.getRow(1).font = { bold: true };
  for (const r of rows) {
    ws.addRow([r.no, r.companyName, r.contact, r.email, r.region, r.customerType, r.source, r.subject, r.body]);
  }
  ws.columns.forEach((col) => { col.width = 20; });
  const arrayBuffer = await wb.xlsx.writeBuffer();
  return Buffer.from(arrayBuffer);
}
