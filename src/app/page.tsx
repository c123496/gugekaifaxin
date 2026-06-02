'use client';
import { useEffect, useState, useCallback } from 'react';
import { SearchPanel } from '@/components/SearchPanel';
import { CompanyTable, type CompanyRow } from '@/components/CompanyTable';
import { LetterPreview } from '@/components/LetterPreview';

export default function Page() {
  const [accessKey, setAccessKey] = useState('');
  const [regionId, setRegionId] = useState('us');
  const [rows, setRows] = useState<CompanyRow[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState<string | null>(null);
  const [msg, setMsg] = useState('');
  const [preview, setPreview] = useState<{ subject: string; body: string } | null>(null);

  useEffect(() => {
    const k = new URLSearchParams(window.location.search).get('key') ?? '';
    setAccessKey(k);
  }, []);

  const qs = `?key=${encodeURIComponent(accessKey)}`;

  const refresh = useCallback(async () => {
    const res = await fetch(`/api/companies${qs}`);
    if (!res.ok) { setMsg('鉴权失败，请检查网址 key 参数'); return; }
    const data = await res.json();
    setRows(data.companies);
  }, [qs]);

  useEffect(() => { if (accessKey) refresh(); }, [accessKey, refresh]);

  async function onSearch(categoryId: string) {
    setLoading(categoryId); setMsg('');
    try {
      const res = await fetch(`/api/search${qs}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryId, regionId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMsg(`搜索完成：新增 ${data.inserted} 家（命中 ${data.found}）`);
      await refresh();
    } catch (e) { setMsg(`搜索失败：${e}`); }
    finally { setLoading(null); }
  }

  function toggle(id: number) {
    setSelected((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }
  function toggleAll() {
    setSelected((s) => s.size === rows.length ? new Set() : new Set(rows.map((r) => r.id)));
  }

  async function onGenerate() {
    const ids = [...selected];
    if (ids.length === 0) { setMsg('请先勾选公司'); return; }
    setMsg('生成中…');
    const res = await fetch(`/api/generate${qs}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids }),
    });
    const data = await res.json();
    if (!res.ok) { setMsg(`生成失败：${data.error}`); return; }
    setMsg(`已生成 ${data.generated} 封`);
    await refresh();
  }

  async function onExport() {
    const ids = [...selected];
    if (ids.length === 0) { setMsg('请先勾选公司'); return; }
    const res = await fetch(`/api/export${qs}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids }),
    });
    if (!res.ok) { setMsg('导出失败'); return; }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = '开发信客户邮箱.xlsx'; a.click();
    URL.revokeObjectURL(url);
    await refresh();
  }

  function onPreview() {
    const first = rows.find((r) => selected.has(r.id) && r.subject);
    setPreview(first ? { subject: first.subject!, body: first.body! } : null);
    if (!first) setMsg('选中的公司里没有已生成的开发信');
  }

  const withEmail = rows.filter((r) => r.email).length;
  const generated = rows.filter((r) => r.subject).length;
  const bannerClass = msg.includes('失败') || msg.includes('鉴权') || msg.includes('没有')
    ? 'banner banner--err'
    : (msg.includes('完成') || msg.includes('已生成') ? 'banner banner--ok' : 'banner');

  return (
    <>
      <header className="masthead">
        <div className="masthead__inner">
          <div className="brand">
            <span className="brand__mark">JD</span>
            <div>
              <h1 className="brand__title">金达外贸开发信工具</h1>
              <p className="brand__sub">Hi-Vis 客户开发 · 搜索 → 抓邮箱 → AI 开发信 → 导出 Excel</p>
            </div>
          </div>
          <div className="masthead__meta"><span className="dot" />新乡金达反光制品</div>
        </div>
        <div className="hazard-strip" />
      </header>

      <main className="container">
        {msg && <div className={bannerClass}>{msg}</div>}

        <SearchPanel regionId={regionId} setRegionId={setRegionId} onSearch={onSearch} loading={loading} />

        <section className="panel worktable">
          <div className="toolbar">
            <div className="stats">
              <div className="stat">
                <span className="stat__num">{rows.length}</span>
                <span className="stat__label">客户总数</span>
              </div>
              <div className="stat__sep" />
              <div className="stat">
                <span className="stat__num stat__num--hivis">{withEmail}</span>
                <span className="stat__label">有邮箱</span>
              </div>
              <div className="stat__sep" />
              <div className="stat">
                <span className="stat__num stat__num--blue">{generated}</span>
                <span className="stat__label">已生成信</span>
              </div>
            </div>
            <div className="actions">
              <span className="sel-count">已选 <b>{selected.size}</b> 家</span>
              <button className="btn" onClick={onPreview}>预览选中第一封</button>
              <button className="btn btn--primary" onClick={onGenerate}>为选中生成开发信</button>
              <button className="btn btn--hivis" onClick={onExport}>导出 Excel</button>
            </div>
          </div>
          <CompanyTable rows={rows} selected={selected} toggle={toggle} toggleAll={toggleAll} />
        </section>

        {preview && (
          <LetterPreview subject={preview.subject} body={preview.body} onClose={() => setPreview(null)} />
        )}
      </main>
    </>
  );
}
