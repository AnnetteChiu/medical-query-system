import { useState } from 'react';
import { Article } from '../types';
import DosageCalculator from './DosageCalculator';

// 從摘要文字中擷取劑量相關數據
function extractDosageData(abstract: string, title: string): string[] {
  const results: string[] = [];
  // 匹配常見劑量格式：數字 + 單位
  const patterns = [
    /(\d+(?:\.\d+)?)\s*(?:mg\/kg|mg\/mL|mg\/L|%\s*\(w\/v\)|%\s*w\/v|%)/gi,
    /(\d+(?:\.\d+)?)\s*(?:g\/kg|g\/L|μg\/mL|μg\/kg)/gi,
    /dose[s]?\s+of\s+(\d+(?:\.\d+)?)\s*\w+/gi,
    /concentration[s]?\s+of\s+(\d+(?:\.\d+)?)\s*\w+/gi,
    /(\d+(?:\.\d+)?)\s*(?:mg|g|mL)\s+(?:per|\/)\s*(?:kg|mL|L)/gi,
  ];
  const text = `${title} ${abstract}`;
  patterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) results.push(...matches);
  });
  return [...new Set(results)].slice(0, 8);
}

interface MiningResult {
  article: Article;
  dosages: string[];
}

const ESEARCH = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi';
const ESUMMARY = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi';
const EFETCH = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi';

export default function DosageMining() {
  const [results, setResults] = useState<MiningResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [query, setQuery] = useState('Polysorbate 80 dosage');

  async function mine() {
    setLoading(true);
    setResults([]);
    setStatus('從 PubMed 抓取資料中...');

    try {
      const searchRes = await fetch(
        `${ESEARCH}?db=pubmed&term=${encodeURIComponent(query)}&retmax=30&retmode=json&sort=relevance`
      );
      const searchData = await searchRes.json();
      const ids: string[] = searchData.esearchresult?.idlist || [];
      if (!ids.length) { setStatus('查無相關文獻'); setLoading(false); return; }

      setStatus(`找到 ${ids.length} 篇文獻，解析劑量數據中...`);

      const summaryRes = await fetch(`${ESUMMARY}?db=pubmed&id=${ids.join(',')}&retmode=json`);
      const summaryData = await summaryRes.json();

      const fetchRes = await fetch(`${EFETCH}?db=pubmed&id=${ids.join(',')}&retmode=xml&rettype=abstract`);
      const xml = await fetchRes.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(xml, 'text/xml');
      const abstractMap: Record<string, string> = {};
      doc.querySelectorAll('PubmedArticle').forEach(a => {
        const pmid = a.querySelector('PMID')?.textContent || '';
        const texts = Array.from(a.querySelectorAll('AbstractText')).map(n => n.textContent).join(' ');
        if (pmid) abstractMap[pmid] = texts;
      });

      const mined: MiningResult[] = (summaryData.result?.uids || [])
        .map((uid: string) => {
          const r = summaryData.result[uid];
          const article: Article = {
            uid,
            title: r.title || '',
            authors: (r.authors || []).map((a: { name: string }) => a.name),
            source: r.source || '',
            pubdate: r.pubdate || '',
            abstract: abstractMap[uid] || '',
          };
          const dosages = extractDosageData(article.abstract || '', article.title);
          return { article, dosages };
        })
        .filter((r: MiningResult) => r.dosages.length > 0);

      setResults(mined);
      setStatus(`完成：從 ${ids.length} 篇文獻中找到 ${mined.length} 篇含劑量數據`);
    } catch {
      setStatus('資料抓取失敗，請稍後再試');
    } finally {
      setLoading(false);
    }
  }

  // 彙整所有劑量數據
  const allDosages = results.flatMap(r => r.dosages);
  const dosageFreq: Record<string, number> = {};
  allDosages.forEach(d => { dosageFreq[d] = (dosageFreq[d] || 0) + 1; });
  const sortedDosages = Object.entries(dosageFreq).sort((a, b) => b[1] - a[1]);

  return (
    <div>
      <h2 style={{ fontSize: 18, marginBottom: 16 }}>📊 劑量數據探勘</h2>
      <DosageCalculator />

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && mine()}
          style={{ flex: 1, padding: '10px 14px', fontSize: 15, border: '1px solid #ccc', borderRadius: 6 }}
        />
        <button onClick={mine} disabled={loading}
          style={{ padding: '10px 24px', background: '#1a56db', color: '#fff', border: 'none', borderRadius: 6, fontSize: 15, cursor: 'pointer' }}>
          {loading ? '分析中...' : '開始探勘'}
        </button>
      </div>

      {status && <p style={{ color: '#555', marginBottom: 16, fontSize: 14 }}>{status}</p>}

      {sortedDosages.length > 0 && (
        <div style={{ background: '#fff', border: '1px solid #ddd', borderRadius: 8, padding: 16, marginBottom: 20 }}>
          <h3 style={{ fontSize: 15, marginBottom: 12 }}>彙整劑量數據（出現頻率排序）</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {sortedDosages.map(([dose, count]) => (
              <span key={dose} style={{
                padding: '4px 12px', borderRadius: 20, fontSize: 13,
                background: count > 1 ? '#dbeafe' : '#f3f4f6',
                color: count > 1 ? '#1e40af' : '#374151',
                border: `1px solid ${count > 1 ? '#93c5fd' : '#d1d5db'}`
              }}>
                {dose} {count > 1 && <strong>×{count}</strong>}
              </span>
            ))}
          </div>
        </div>
      )}

      {results.map(({ article, dosages }) => (
        <div key={article.uid} style={{ background: '#fff', border: '1px solid #ddd', borderRadius: 8, padding: 14, marginBottom: 10 }}>
          <a href={`https://pubmed.ncbi.nlm.nih.gov/${article.uid}`} target="_blank" rel="noreferrer"
            style={{ fontWeight: 600, fontSize: 14, color: '#1a56db', textDecoration: 'none' }}>
            {article.title}
          </a>
          <p style={{ fontSize: 12, color: '#888', margin: '4px 0 8px' }}>{article.source} · {article.pubdate}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {dosages.map((d, i) => (
              <span key={i} style={{ padding: '2px 10px', background: '#fef3c7', color: '#92400e', borderRadius: 12, fontSize: 13, border: '1px solid #fcd34d' }}>
                {d}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
