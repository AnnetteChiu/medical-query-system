import { useState } from 'react';

const PRESETS = [
  'pharmacometrics PK/PD',
  'population pharmacokinetics',
  'NONMEM modeling',
  'physiologically based pharmacokinetic',
  'drug dosing optimization',
];

interface Props {
  onSearch: (query: string) => void;
  loading: boolean;
}

export default function SearchBar({ onSearch, loading }: Props) {
  const [query, setQuery] = useState('pharmacometrics');

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && onSearch(query)}
          placeholder="搜尋研究主題..."
          style={{ flex: 1, padding: '10px 14px', fontSize: 15, border: '1px solid #ccc', borderRadius: 6 }}
        />
        <button
          onClick={() => onSearch(query)}
          disabled={loading}
          style={{ padding: '10px 24px', background: '#1a56db', color: '#fff', border: 'none', borderRadius: 6, fontSize: 15, cursor: 'pointer' }}
        >
          {loading ? '搜尋中...' : '搜尋'}
        </button>
      </div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {PRESETS.map(p => (
          <button key={p} onClick={() => { setQuery(p); onSearch(p); }}
            style={{ padding: '4px 10px', fontSize: 12, background: '#e8f0fe', color: '#1a56db', border: '1px solid #c7d7fc', borderRadius: 20, cursor: 'pointer' }}>
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}
