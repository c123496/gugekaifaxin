'use client';
import { CATEGORIES, REGIONS, type CategoryId } from '@/lib/searchQueries';

const ICONS: Record<CategoryId, string> = {
  hiviz: '🦺',
  ppe: '🛡️',
  roadwork: '🚧',
  workwear: '🧥',
  industrial: '⚙️',
  contractor: '🏗️',
  police: '🚓',
};

export function SearchPanel({
  regionId, setRegionId, onSearch, loading,
}: {
  regionId: string;
  setRegionId: (id: string) => void;
  onSearch: (categoryId: string) => void;
  loading: string | null;
}) {
  return (
    <section className="panel search">
      <div className="search__head">
        <span className="search__label">地区</span>
        <select
          className="select"
          value={regionId}
          onChange={(e) => setRegionId(e.target.value)}
          disabled={loading !== null}
        >
          {REGIONS.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
        </select>
        <span className="search__hint">点击下方分类卡片，自动联网搜索 + 抓取官网邮箱</span>
      </div>
      <div className="cards">
        {CATEGORIES.map((c, i) => {
          const isLoading = loading === c.id;
          return (
            <button
              key={c.id}
              className={`card${isLoading ? ' card--loading' : ''}`}
              style={{ animationDelay: `${i * 45}ms` }}
              disabled={loading !== null}
              onClick={() => onSearch(c.id)}
            >
              <span className="card__icon">{ICONS[c.id]}</span>
              <span className="card__label">{c.label}</span>
              {isLoading
                ? <span className="spinner" aria-label="搜索中" />
                : <span className="card__arrow">→</span>}
            </button>
          );
        })}
      </div>
    </section>
  );
}
