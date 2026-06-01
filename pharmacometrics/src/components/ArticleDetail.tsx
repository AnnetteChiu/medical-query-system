import { Article } from '../types';

interface Props { article: Article; }

export default function ArticleDetail({ article }: Props) {
  return (
    <div style={{ background: '#fff', border: '1px solid #ddd', borderRadius: 8, padding: 20, position: 'sticky', top: 20 }}>
      <h2 style={{ fontSize: 17, marginBottom: 12, lineHeight: 1.4 }}>{article.title}</h2>
      <p style={{ fontSize: 13, color: '#555', marginBottom: 8 }}>
        <strong>作者：</strong>{article.authors.join(', ') || '—'}
      </p>
      <p style={{ fontSize: 13, color: '#555', marginBottom: 8 }}>
        <strong>期刊：</strong>{article.source} · {article.pubdate}
      </p>
      {article.doi && (
        <p style={{ fontSize: 13, marginBottom: 12 }}>
          <strong>DOI：</strong>
          <a href={`https://doi.org/${article.doi}`} target="_blank" rel="noreferrer" style={{ color: '#1a56db' }}>
            {article.doi}
          </a>
        </p>
      )}
      <a href={`https://pubmed.ncbi.nlm.nih.gov/${article.uid}`} target="_blank" rel="noreferrer"
        style={{ display: 'inline-block', padding: '8px 16px', background: '#1a56db', color: '#fff', borderRadius: 6, fontSize: 14, textDecoration: 'none', marginBottom: 16 }}>
        在 PubMed 查看全文 →
      </a>
      {article.abstract && (
        <>
          <h3 style={{ fontSize: 14, marginBottom: 8 }}>摘要</h3>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: '#333' }}>{article.abstract}</p>
        </>
      )}
    </div>
  );
}
