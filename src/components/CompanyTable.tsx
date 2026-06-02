'use client';
import type { Company, Status } from '@/lib/types';

export interface CompanyRow extends Company { subject?: string | null; body?: string | null; }

const BADGE_CLASS: Record<Status, string> = {
  '待联系': 'badge badge--pending',
  '已生成': 'badge badge--done',
  '已导出': 'badge badge--exported',
};

export function CompanyTable({
  rows, selected, toggle, toggleAll,
}: {
  rows: CompanyRow[];
  selected: Set<number>;
  toggle: (id: number) => void;
  toggleAll: () => void;
}) {
  if (rows.length === 0) {
    return (
      <div className="empty">
        <div className="empty__mark">🦺</div>
        <div className="empty__title">还没有客户线索</div>
        <div className="empty__text">在上方选择地区，点一个分类卡片，系统会自动联网搜索并抓取官网邮箱。</div>
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th className="col-check">
              <input
                type="checkbox"
                checked={rows.length > 0 && selected.size === rows.length}
                onChange={toggleAll}
                aria-label="全选"
              />
            </th>
            <th>公司</th>
            <th>邮箱</th>
            <th>地区</th>
            <th>类型</th>
            <th>状态</th>
            <th>开发信</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className={selected.has(r.id) ? 'is-selected' : undefined}>
              <td className="col-check">
                <input
                  type="checkbox"
                  checked={selected.has(r.id)}
                  onChange={() => toggle(r.id)}
                  aria-label={`选择 ${r.company_name}`}
                />
              </td>
              <td>
                <div className="company">{r.company_name}</div>
                {r.source && (
                  <a className="company__src" href={r.source} target="_blank" rel="noreferrer">
                    {r.source.replace(/^https?:\/\/(www\.)?/, '')}
                  </a>
                )}
              </td>
              <td>
                {r.email
                  ? <span className="email">{r.email}</span>
                  : <span className="no-email">⚠ 无邮箱</span>}
              </td>
              <td>{r.region}</td>
              <td><span className="type">{r.customer_type}</span></td>
              <td><span className={BADGE_CLASS[r.status]}>{r.status}</span></td>
              <td>
                {r.subject
                  ? <span className="letter-cell letter-cell--has" title={r.subject}>{r.subject}</span>
                  : <span className="dash">—</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
