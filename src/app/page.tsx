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

  return (
    <main style={{ maxWidth: 1100, margin: '0 auto', padding: 24 }}>
      <h1>金达外贸开发信工具</h1>
      {msg && <p style={{ color: '#0a6' }}>{msg}</p>}
      <SearchPanel regionId={regionId} setRegionId={setRegionId} onSearch={onSearch} loading={loading} />
      <div style={{ margin: '12px 0', display: 'flex', gap: 8 }}>
        <button onClick={onGenerate}>为选中生成开发信</button>
        <button onClick={onExport}>导出 Excel</button>
        <button onClick={() => {
          const first = rows.find((r) => selected.has(r.id) && r.subject);
          setPreview(first ? { subject: first.subject!, body: first.body! } : null);
        }}>预览选中第一封</button>
      </div>
      <CompanyTable rows={rows} selected={selected} toggle={toggle} toggleAll={toggleAll} />
      {preview && <LetterPreview subject={preview.subject} body={preview.body} />}
    </main>
  );
}
