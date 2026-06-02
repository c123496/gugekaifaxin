'use client';
import { CATEGORIES, REGIONS } from '@/lib/searchQueries';

export function SearchPanel({
  regionId, setRegionId, onSearch, loading,
}: {
  regionId: string;
  setRegionId: (id: string) => void;
  onSearch: (categoryId: string) => void;
  loading: string | null;
}) {
  return (
    <section style={{ background: '#fff', padding: 16, borderRadius: 8, marginBottom: 16 }}>
      <div style={{ marginBottom: 12 }}>
        <label style={{ fontWeight: 600, marginRight: 8 }}>地区：</label>
        <select value={regionId} onChange={(e) => setRegionId(e.target.value)}>
          {REGIONS.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
        </select>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 8 }}>
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            disabled={loading !== null}
            onClick={() => onSearch(c.id)}
            style={{ padding: 12, cursor: 'pointer', border: '1px solid #d0d0d0', borderRadius: 6, background: loading === c.id ? '#eee' : '#fafafa' }}
          >
            {loading === c.id ? '搜索中…' : c.label}
          </button>
        ))}
      </div>
    </section>
  );
}
