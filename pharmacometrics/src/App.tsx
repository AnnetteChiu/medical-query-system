import { useState, useCallback } from 'react';
import SearchBar from './components/SearchBar';
import ArticleList from './components/ArticleList';
import ArticleDetail from './components/ArticleDetail';
import DosageMining from './components/DosageMining';
import { Article } from './types';

const ESEARCH = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi';
const ESUMMARY = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi';
const EFETCH = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi';

async function fetchArticles(query: string): Promise<Article[]> {
  // 1. 搜尋 ID 清單
  const searchRes = await fetch(`${ESEARCH}?db=pubmed&term=${encodeURIComponent(query)}&retmax=20&retmode=json&sort=relevance`);
  const searchData = await searchRes.json();
  const ids: string[] = searchData.esearchresult?.idlist || [];
  if (!ids.length) return [];

  // 2. 取得摘要資訊
  const summaryRes = await fetch(`${ESUMMARY}?db=pubmed&id=${ids.join(',')}&retmode=json`);
  const summaryData = await summaryRes.json();
  const uids: string[] = summaryData.result?.uids || [];

  // 3. 取得 abstract
  const fetchRes = await fetch(`${EFETCH}?db=pubmed&id=${ids.join(',')}&retmode=xml&rettype=abstract`);
  const xml = await fetchRes.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'text/xml');
  const abstractMap: Record<string, string> = {};
  doc.querySelectorAll('PubmedArticle').forEach(article => {
    const pmid = article.querySelector('PMID')?.textContent || '';
    const texts = Array.from(article.querySelectorAll('AbstractText')).map(n => n.textContent).join(' ');
    if (pmid) abstractMap[pmid] = texts;
  });

  return uids.map((uid: string) => {
    const r = summaryData.result[uid];
    return {
      uid,
      title: r.title || '(無標題)',
      authors: (r.authors || []).map((a: { name: string }) => a.name),
      source: r.source || '',
      pubdate: r.pubdate || '',
      abstract: abstractMap[uid] || '',
      doi: r.elocationid?.replace('doi: ', '') || '',
    };
  });
}

export default function App() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selected, setSelected] = useState<Article | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [tab, setTab] = useState<'search' | 'mining'>('search');

  const handleSearch = useCallback(async (query: string) => {
    setLoading(true);
    setSelected(null);
    setStatus('搜尋中...');
    try {
      const results = await fetchArticles(query);
      setArticles(results);
      setStatus(`找到 ${results.length} 篇研究`);
    } catch {
      setStatus('查詢失敗，請稍後再試');
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6', fontFamily: 'sans-serif' }}>
      <div style={{ background: '#1a56db', color: '#fff', padding: '20px 32px' }}>
        <h1 style={{ fontSize: 22, margin: 0 }}>📊 Pharmacometrics 研究查詢</h1>
        <p style={{ margin: '4px 0 12px', fontSize: 14, opacity: 0.85 }}>串接 PubMed 資料庫，查詢計量藥理學相關研究</p>
        <div style={{ display: 'flex', gap: 8 }}>
          {(['search', 'mining'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{ padding: '6px 18px', borderRadius: 6, border: '2px solid rgba(255,255,255,0.5)', background: tab === t ? 'rgba(255,255,255,0.2)' : 'transparent', color: '#fff', cursor: 'pointer', fontSize: 14 }}>
              {t === 'search' ? '🔍 文獻搜尋' : '⛏️ 劑量探勘'}
            </button>
          ))}
        </div>
      </div>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: 24 }}>
        {tab === 'search' ? (
          <>
            <SearchBar onSearch={handleSearch} loading={loading} />
            {status && <p style={{ color: '#555', marginBottom: 12, fontSize: 14 }}>{status}</p>}
            <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr', gap: 20 }}>
              <ArticleList articles={articles} onSelect={setSelected} selected={selected?.uid || null} />
              {selected && <ArticleDetail article={selected} />}
            </div>
          </>
        ) : (
          <DosageMining />
        )}
      </div>
    </div>
  );
}
