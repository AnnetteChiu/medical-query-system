import { Article } from '../types';

interface Props {
  articles: Article[];
  onSelect: (article: Article) => void;
  selected: string | null;
}

export default function ArticleList({ articles, onSelect, selected }: Props) {
  if (!articles.length) return <p style={{ color: '#888' }}>查無結果</p>;

  return (
    <div>
      {articles.map(a => (
        <div key={a.uid} onClick={() => onSelect(a)}
          style={{
            padding: 14, marginBottom: 10, border: '1px solid #ddd', borderRadius: 8,
            cursor: 'pointer', background: selected === a.uid ? '#eef4ff' : '#fff',
            borderLeft: selected === a.uid ? '4px solid #1a56db' : '4px solid transparent',
          }}>
          <div style={{ fontWeight: 600, marginBottom: 4, fontSize: 15 }}>{a.title}</div>
          <div style={{ fontSize: 13, color: '#555' }}>
            {a.authors.slice(0, 3).join(', ')}{a.authors.length > 3 ? ' 等' : ''}
          </div>
          <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
            {a.source} · {a.pubdate}
          </div>
        </div>
      ))}
    </div>
  );
}
