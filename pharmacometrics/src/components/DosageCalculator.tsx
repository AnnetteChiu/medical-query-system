import { useState } from 'react';

// 從文獻整理的 Polysorbate 80 參考劑量數據
const REFERENCE_DOSES = [
  { source: 'FDA GRAS (食品添加)', value: 25, unit: 'mg/kg/day', type: 'ADI', note: '每日可接受攝取量上限' },
  { source: 'EMA 藥品賦形劑指引', value: 4.8, unit: 'mg/kg/day', type: 'oral', note: '口服藥品賦形劑建議上限' },
  { source: 'ICH Q3C 殘留溶劑指引', value: 25, unit: 'mg/kg/day', type: 'parenteral', note: '注射劑型參考值' },
  { source: 'WHO 食品添加劑標準', value: 10, unit: 'mg/kg/day', type: 'food', note: 'WHO 食品用途建議值' },
];

export default function DosageCalculator() {
  const [weight, setWeight] = useState<string>('70');
  const [amount, setAmount] = useState<string>('');
  const [mode, setMode] = useState<'weight' | 'amount'>('weight');

  const w = parseFloat(weight) || 0;
  const a = parseFloat(amount) || 0;

  return (
    <div style={{ background: '#fff', border: '1px solid #ddd', borderRadius: 8, padding: 20, marginBottom: 20 }}>
      <h3 style={{ fontSize: 16, marginBottom: 16 }}>💊 Polysorbate 80 劑量換算（依文獻數據）</h3>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button onClick={() => setMode('weight')}
          style={{ padding: '6px 16px', borderRadius: 6, border: '1px solid #ccc', background: mode === 'weight' ? '#1a56db' : '#f3f4f6', color: mode === 'weight' ? '#fff' : '#333', cursor: 'pointer' }}>
          依體重換算
        </button>
        <button onClick={() => setMode('amount')}
          style={{ padding: '6px 16px', borderRadius: 6, border: '1px solid #ccc', background: mode === 'amount' ? '#1a56db' : '#f3f4f6', color: mode === 'amount' ? '#fff' : '#333', cursor: 'pointer' }}>
          依用量反推
        </button>
      </div>

      {mode === 'weight' ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
          <label style={{ fontSize: 14 }}>體重</label>
          <input type="number" value={weight} onChange={e => setWeight(e.target.value)} min="1"
            style={{ width: 100, padding: '8px 10px', border: '1px solid #ccc', borderRadius: 6, fontSize: 15 }} />
          <span style={{ fontSize: 14 }}>kg</span>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
          <label style={{ fontSize: 14 }}>實際用量</label>
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)} min="0"
            style={{ width: 100, padding: '8px 10px', border: '1px solid #ccc', borderRadius: 6, fontSize: 15 }} />
          <span style={{ fontSize: 14 }}>mg/day</span>
        </div>
      )}

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
        <thead>
          <tr style={{ background: '#f3f4f6' }}>
            <th style={{ padding: '8px 12px', textAlign: 'left', border: '1px solid #e5e7eb' }}>來源</th>
            <th style={{ padding: '8px 12px', textAlign: 'left', border: '1px solid #e5e7eb' }}>類型</th>
            <th style={{ padding: '8px 12px', textAlign: 'right', border: '1px solid #e5e7eb' }}>參考劑量</th>
            {mode === 'weight' && <th style={{ padding: '8px 12px', textAlign: 'right', border: '1px solid #e5e7eb' }}>換算結果</th>}
            {mode === 'amount' && <th style={{ padding: '8px 12px', textAlign: 'right', border: '1px solid #e5e7eb' }}>佔上限 %</th>}
            <th style={{ padding: '8px 12px', textAlign: 'left', border: '1px solid #e5e7eb' }}>備註</th>
          </tr>
        </thead>
        <tbody>
          {REFERENCE_DOSES.map((d, i) => {
            const calculated = w * d.value;
            const percent = a > 0 ? ((a / (w * d.value)) * 100) : null;
            const isOver = percent !== null && percent > 100;
            return (
              <tr key={i} style={{ background: isOver ? '#fef2f2' : 'white' }}>
                <td style={{ padding: '8px 12px', border: '1px solid #e5e7eb' }}>{d.source}</td>
                <td style={{ padding: '8px 12px', border: '1px solid #e5e7eb' }}>
                  <span style={{ padding: '2px 8px', borderRadius: 12, fontSize: 12, background: '#dbeafe', color: '#1e40af' }}>{d.type}</span>
                </td>
                <td style={{ padding: '8px 12px', border: '1px solid #e5e7eb', textAlign: 'right' }}>
                  {d.value} {d.unit}
                </td>
                {mode === 'weight' && (
                  <td style={{ padding: '8px 12px', border: '1px solid #e5e7eb', textAlign: 'right', fontWeight: 600, color: '#1a56db' }}>
                    {w > 0 ? `${calculated.toFixed(1)} mg/day` : '—'}
                  </td>
                )}
                {mode === 'amount' && (
                  <td style={{ padding: '8px 12px', border: '1px solid #e5e7eb', textAlign: 'right', fontWeight: 600, color: isOver ? '#dc2626' : '#16a34a' }}>
                    {percent !== null && w > 0 ? `${percent.toFixed(1)}%${isOver ? ' ⚠️ 超標' : ''}` : '—'}
                  </td>
                )}
                <td style={{ padding: '8px 12px', border: '1px solid #e5e7eb', color: '#6b7280', fontSize: 13 }}>{d.note}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 10 }}>
        ※ 數據來源：FDA、EMA、ICH、WHO 公開文件。僅供研究參考，實際用量請依產品規格與法規規定。
      </p>
    </div>
  );
}
