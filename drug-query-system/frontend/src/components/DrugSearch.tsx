import { useState } from 'react';

const API = 'http://localhost:3001/api/drugs';

interface Drug {
  id: number;
  name: string;
  description: string;
  side_effects: string[];
}

interface Interaction {
  drug_name: string;
  description: string;
}

export default function DrugSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Drug[]>([]);
  const [selected, setSelected] = useState<Drug | null>(null);
  const [interactions, setInteractions] = useState<Interaction[]>([]);

  async function search() {
    if (!query.trim()) return;
    const res = await fetch(`${API}/search?q=${encodeURIComponent(query)}`);
    setResults(await res.json());
    setSelected(null);
    setInteractions([]);
  }

  async function selectDrug(drug: Drug) {
    setSelected(drug);
    const res = await fetch(`${API}/${drug.id}/interactions`);
    setInteractions(await res.json());
  }

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', fontFamily: 'sans-serif', padding: '0 16px' }}>
      <h1>藥物查詢系統</h1>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && search()}
          placeholder="輸入藥名搜尋..."
          style={{ flex: 1, padding: '8px 12px', fontSize: 16, border: '1px solid #ccc', borderRadius: 4 }}
        />
        <button onClick={search} style={{ padding: '8px 20px', fontSize: 16, cursor: 'pointer' }}>
          搜尋
        </button>
      </div>

      {results.map(drug => (
        <div
          key={drug.id}
          onClick={() => selectDrug(drug)}
          style={{
            padding: 12, marginBottom: 8, border: '1px solid #ddd', borderRadius: 4,
            cursor: 'pointer', background: selected?.id === drug.id ? '#f0f7ff' : '#fff'
          }}
        >
          <strong>{drug.name}</strong>
          <p style={{ margin: '4px 0 0', color: '#555' }}>{drug.description}</p>
        </div>
      ))}

      {selected && (
        <div style={{ marginTop: 24, padding: 16, border: '1px solid #aaa', borderRadius: 4 }}>
          <h2>{selected.name}</h2>
          <p>{selected.description}</p>

          <h3>副作用</h3>
          <ul>
            {selected.side_effects.map((e, i) => <li key={i}>{e}</li>)}
          </ul>

          <h3>藥物交互作用</h3>
          {interactions.length === 0
            ? <p>無已知交互作用</p>
            : interactions.map((i, idx) => (
              <div key={idx} style={{ padding: 8, background: '#fff3cd', borderRadius: 4, marginBottom: 6 }}>
                <strong>{i.drug_name}</strong>：{i.description}
              </div>
            ))
          }
        </div>
      )}
    </div>
  );
}
