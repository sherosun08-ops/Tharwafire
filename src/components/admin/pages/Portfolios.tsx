import { useState } from 'react'
import { ChevronDown, ChevronLeft } from 'lucide-react'
import { mockPortfolios } from '../adminData'

const s = {
  card: { background: '#0C1A2E', border: '1px solid #1A2E4A', borderRadius: 16, overflow: 'hidden' } as React.CSSProperties,
  th: { padding: '14px 16px', textAlign: 'right' as const, fontSize: '0.75rem', fontWeight: 600, color: '#6B84A8', borderBottom: '1px solid #1A2E4A', background: '#060E1A', whiteSpace: 'nowrap' as const },
  td: { padding: '14px 16px', fontSize: '0.875rem', color: '#E2E8F4', borderBottom: '1px solid rgba(26,46,74,0.5)' },
}

const assetColors: Record<string, string> = { stocks: '#3B82F6', crypto: '#F59E0B', metals: '#9CA3AF', oil: '#EF4444' }

export default function Portfolios() {
  const [expanded, setExpanded] = useState<number | null>(null)

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#E2E8F4' }}>إدارة المحافظ الاستثمارية</h1>
          <p style={{ fontSize: '0.85rem', color: '#6B84A8', marginTop: 4 }}>إجمالي {mockPortfolios.length} محفظة نشطة</p>
        </div>
        <button style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #C9A84C, #E8C96A)', color: '#060E1A', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer', fontFamily: "'Cairo', sans-serif" }}>
          + إضافة أصل جديد
        </button>
      </div>

      {/* Summary Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'إجمالي المحافظ', value: '4,890', icon: '📁' },
          { label: 'الأصول المُدارة (AUM)', value: '$2.4B', icon: '💰' },
          { label: 'متوسط العائد', value: '+16.4%', icon: '📈' },
        ].map((s, i) => (
          <div key={i} style={{ background: '#0C1A2E', border: '1px solid #1A2E4A', borderRadius: 14, padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(201,168,76,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: '0.78rem', color: '#6B84A8', marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#C9A84C', fontFamily: 'monospace' }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={s.card}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #1A2E4A', display: 'flex', gap: 10 }}>
          {['نوع الأصل', 'المستشار', 'العائد'].map(f => (
            <button key={f} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', background: '#060E1A', border: '1px solid #1A2E4A', borderRadius: 8, color: '#6B84A8', fontSize: '0.8rem', cursor: 'pointer', fontFamily: "'Cairo', sans-serif" }}>
              {f} <ChevronDown size={13} />
            </button>
          ))}
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ ...s.th, width: 40 }} />
                {['العميل', 'عدد الأصول', 'إجمالي القيمة', 'العائد', 'المستشار', ''].map(h => (
                  <th key={h} style={s.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockPortfolios.map(p => (
                <>
                  <tr key={p.clientId}
                    style={{ cursor: 'pointer', background: expanded === p.clientId ? 'rgba(201,168,76,0.04)' : 'transparent', transition: 'background 0.2s' }}
                    onClick={() => setExpanded(expanded === p.clientId ? null : p.clientId)}>
                    <td style={{ ...s.td, color: '#C9A84C', fontSize: '0.8rem' }}>
                      <ChevronLeft size={16} style={{ transition: 'transform 0.3s', transform: expanded === p.clientId ? 'rotate(-90deg)' : 'rotate(0)' }} />
                    </td>
                    <td style={s.td}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(201,168,76,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: '#C9A84C' }}>
                          {p.clientName.charAt(0)}
                        </div>
                        <span style={{ fontWeight: 600 }}>{p.clientName}</span>
                      </div>
                    </td>
                    <td style={s.td}>{p.assets.length} أصول</td>
                    <td style={{ ...s.td, fontFamily: 'monospace', color: '#C9A84C', fontWeight: 600 }}>${p.total.toLocaleString()}</td>
                    <td style={{ ...s.td, color: '#00D97E', fontWeight: 600 }}>▲ +{p.return}%</td>
                    <td style={s.td}>{p.advisor}</td>
                    <td style={s.td}>
                      <button style={{ padding: '5px 12px', background: 'transparent', border: '1px solid #1A2E4A', borderRadius: 6, color: '#6B84A8', fontSize: '0.78rem', cursor: 'pointer', fontFamily: "'Cairo', sans-serif" }}>تفاصيل</button>
                    </td>
                  </tr>

                  {expanded === p.clientId && p.assets.map((a, ai) => (
                    <tr key={ai} style={{ background: '#060E1A' }}>
                      <td style={{ ...s.td, borderBottom: ai === p.assets.length - 1 ? '2px solid #1A2E4A' : '1px solid rgba(26,46,74,0.3)' }} />
                      <td style={{ ...s.td, paddingRight: 40, color: '#6B84A8', borderBottom: ai === p.assets.length - 1 ? '2px solid #1A2E4A' : '1px solid rgba(26,46,74,0.3)' }} colSpan={1}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: assetColors[a.type] || '#6B84A8' }} />
                          {a.name}
                        </div>
                      </td>
                      <td style={{ ...s.td, fontSize: '0.82rem', color: '#6B84A8', borderBottom: ai === p.assets.length - 1 ? '2px solid #1A2E4A' : '1px solid rgba(26,46,74,0.3)' }}>الكمية: {a.qty}</td>
                      <td style={{ ...s.td, fontFamily: 'monospace', fontSize: '0.85rem', borderBottom: ai === p.assets.length - 1 ? '2px solid #1A2E4A' : '1px solid rgba(26,46,74,0.3)' }}>${a.value.toLocaleString()}</td>
                      <td style={{ ...s.td, color: a.change >= 0 ? '#00D97E' : '#FF4560', fontSize: '0.82rem', borderBottom: ai === p.assets.length - 1 ? '2px solid #1A2E4A' : '1px solid rgba(26,46,74,0.3)' }}>
                        {a.change >= 0 ? '▲' : '▼'} {Math.abs(a.change)}%
                      </td>
                      <td style={{ ...s.td, borderBottom: ai === p.assets.length - 1 ? '2px solid #1A2E4A' : '1px solid rgba(26,46,74,0.3)' }} />
                      <td style={{ ...s.td, borderBottom: ai === p.assets.length - 1 ? '2px solid #1A2E4A' : '1px solid rgba(26,46,74,0.3)' }} />
                    </tr>
                  ))}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
