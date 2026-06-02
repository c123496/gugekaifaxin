'use client';
import type { Company } from '@/lib/types';

export interface CompanyRow extends Company { subject?: string | null; body?: string | null; }

export function CompanyTable({
  rows, selected, toggle, toggleAll,
}: {
  rows: CompanyRow[];
  selected: Set<number>;
  toggle: (id: number) => void;
  toggleAll: () => void;
}) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
      <thead>
        <tr style={{ textAlign: 'left', borderBottom: '2px solid #eee' }}>
          <th><input type="checkbox" checked={rows.length > 0 && selected.size === rows.length} onChange={toggleAll} /></th>
          <th>公司</th><th>邮箱</th><th>地区</th><th>类型</th><th>状态</th><th>开发信</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
            <td><input type="checkbox" checked={selected.has(r.id)} onChange={() => toggle(r.id)} /></td>
            <td>{r.company_name}</td>
            <td>{r.email ?? <span style={{ color: '#c00' }}>无邮箱</span>}</td>
            <td>{r.region}</td>
            <td style={{ fontSize: 12 }}>{r.customer_type}</td>
            <td>{r.status}</td>
            <td style={{ maxWidth: 280, fontSize: 12, color: '#555' }}>
              {r.subject ? r.subject : '—'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
