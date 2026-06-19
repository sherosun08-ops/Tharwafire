import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { chartRevenue, chartNewClients, chartPortfolioAlloc } from '../adminData'

const s = { card: { background: '#0C1A2E', border: '1px solid #1A2E4A', borderRadius: 16, padding: 24 } as React.CSSProperties }

const topPerformers = [
  { rank: '🥇', name: 'محمد الأحمد', ret: 24.3, assets: 125000, pct: 90 },
  { rank: '🥈', name: 'عبدالله السالم', ret: 21.7, assets: 312000, pct: 80 },
  { rank: '🥉', name: 'طارق القحطاني', ret: 19.2, assets: 234000, pct: 72 },
  { rank: '4', name: 'سارة العمري', ret: 18.4, assets: 87200, pct: 68 },
  { rank: '5', name: 'فاطمة الزهراني', ret: 16.9, assets: 43200, pct: 63 },
]

const advisorPerf = [
  { name: 'أحمد العمري', aum: 450 }, { name: 'خالد محمد', aum: 380 }, { name: 'سارة الزهراني', aum: 290 },
]

export default function Reports() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#E2E8F4' }}>التقارير والإحصائيات</h1>
          <p style={{ fontSize: '0.85rem', color: '#6B84A8', marginTop: 4 }}>نظرة شاملة على أداء المنصة</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px', background: 'transparent', border: '1px solid #1A2E4A', borderRadius: 8, color: '#6B84A8', cursor: 'pointer', fontFamily: "'Cairo', sans-serif", fontSize: '0.875rem' }}>
            📅 هذا الشهر
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px', background: 'linear-gradient(135deg, #C9A84C, #E8C96A)', border: 'none', borderRadius: 8, color: '#060E1A', cursor: 'pointer', fontFamily: "'Cairo', sans-serif", fontWeight: 700, fontSize: '0.875rem' }}>
            📥 تصدير
          </button>
        </div>
      </div>

      {/* Date Range */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#0C1A2E', border: '1px solid #1A2E4A', borderRadius: 12, padding: '12px 16px', marginBottom: 24, flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.82rem', color: '#6B84A8' }}>من:</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#060E1A', border: '1px solid #1A2E4A', borderRadius: 8, padding: '7px 12px', cursor: 'pointer' }}>
          <span style={{ fontSize: '0.82rem', color: '#E2E8F4' }}>2025-01-01</span>
        </div>
        <span style={{ fontSize: '0.82rem', color: '#6B84A8' }}>إلى:</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#060E1A', border: '1px solid #1A2E4A', borderRadius: 8, padding: '7px 12px', cursor: 'pointer' }}>
          <span style={{ fontSize: '0.82rem', color: '#E2E8F4' }}>2025-01-09</span>
        </div>
        {['هذا الأسبوع', 'هذا الشهر', 'آخر 3 أشهر', 'هذا العام'].map(p => (
          <button key={p} style={{ padding: '6px 14px', background: p === 'هذا الشهر' ? 'rgba(201,168,76,0.12)' : 'transparent', border: '1px solid', borderColor: p === 'هذا الشهر' ? 'rgba(201,168,76,0.3)' : '#1A2E4A', borderRadius: 8, color: p === 'هذا الشهر' ? '#C9A84C' : '#6B84A8', fontSize: '0.78rem', cursor: 'pointer', fontFamily: "'Cairo', sans-serif" }}>{p}</button>
        ))}
        <button style={{ padding: '6px 20px', background: '#C9A84C', border: 'none', borderRadius: 8, color: '#060E1A', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer', fontFamily: "'Cairo', sans-serif" }}>تطبيق</button>
      </div>

      {/* Revenue Chart */}
      <div style={{ ...s.card, marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#E2E8F4' }}>الإيرادات والأرباح</div>
            <div style={{ fontSize: '0.8rem', color: '#6B84A8', marginTop: 2 }}>مقارنة شهرية — 2024</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {['Bar', 'Line'].map(t => (
              <button key={t} style={{ padding: '5px 14px', background: t === 'Bar' ? 'rgba(201,168,76,0.12)' : 'transparent', border: '1px solid', borderColor: t === 'Bar' ? 'rgba(201,168,76,0.3)' : '#1A2E4A', borderRadius: 6, color: t === 'Bar' ? '#C9A84C' : '#6B84A8', fontSize: '0.75rem', cursor: 'pointer', fontFamily: "'Cairo', sans-serif" }}>{t}</button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={chartRevenue} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(26,46,74,0.6)" vertical={false} />
            <XAxis dataKey="month" tick={{ fill: '#6B84A8', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#6B84A8', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}M`} />
            <Tooltip contentStyle={{ background: '#0C1A2E', border: '1px solid #1A2E4A', borderRadius: 8, color: '#E2E8F4' }} formatter={(v: number) => [`$${v}M`, '']} />
            <Bar dataKey="revenue" fill="#C9A84C" radius={[4, 4, 0, 0]} name="الإيرادات" />
            <Bar dataKey="profit" fill="#00D97E" radius={[4, 4, 0, 0]} name="الأرباح" />
          </BarChart>
        </ResponsiveContainer>
        <div style={{ display: 'flex', gap: 20, marginTop: 12 }}>
          {[['#C9A84C', 'الإيرادات'], ['#00D97E', 'الأرباح']].map(([color, label]) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: '#6B84A8' }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: color }} />
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* Three Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginBottom: 24 }}>
        {/* New Clients */}
        <div style={s.card}>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#E2E8F4', marginBottom: 4 }}>العملاء الجدد</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#00D97E', fontFamily: 'monospace', marginBottom: 16 }}>+67 <span style={{ fontSize: '0.8rem', fontWeight: 400 }}>هذا الشهر</span></div>
          <ResponsiveContainer width="100%" height={130}>
            <LineChart data={chartNewClients}>
              <Line type="monotone" dataKey="clients" stroke="#00D97E" strokeWidth={2.5} dot={false} />
              <XAxis dataKey="month" tick={{ fill: '#6B84A8', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#0C1A2E', border: '1px solid #1A2E4A', borderRadius: 8, color: '#E2E8F4' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Portfolio Distribution */}
        <div style={s.card}>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#E2E8F4', marginBottom: 16 }}>توزيع الجنسيات</div>
          <ResponsiveContainer width="100%" height={130}>
            <PieChart>
              <Pie data={[{ name: 'السعودية', value: 45 }, { name: 'الإمارات', value: 30 }, { name: 'الكويت', value: 15 }, { name: 'أخرى', value: 10 }]}
                cx="50%" cy="50%" outerRadius={55} dataKey="value">
                {['#C9A84C', '#3B82F6', '#00D97E', '#6B84A8'].map((c, i) => <Cell key={i} fill={c} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#0C1A2E', border: '1px solid #1A2E4A', borderRadius: 8, color: '#E2E8F4' }} formatter={(v: number) => [`${v}%`, '']} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
            {[['🇸🇦', 'السعودية', '45%'], ['🇦🇪', 'الإمارات', '30%'], ['🇰🇼', 'الكويت', '15%']].map(([flag, name, pct]) => (
              <span key={name} style={{ fontSize: '0.72rem', color: '#6B84A8' }}>{flag} {name} {pct}</span>
            ))}
          </div>
        </div>

        {/* Advisor Performance */}
        <div style={s.card}>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#E2E8F4', marginBottom: 16 }}>أداء المستشارين</div>
          <ResponsiveContainer width="100%" height={130}>
            <BarChart data={advisorPerf} layout="vertical">
              <XAxis type="number" tick={{ fill: '#6B84A8', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}M`} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#6B84A8', fontSize: 10 }} axisLine={false} tickLine={false} width={70} />
              <Tooltip contentStyle={{ background: '#0C1A2E', border: '1px solid #1A2E4A', borderRadius: 8, color: '#E2E8F4' }} formatter={(v: number) => [`$${v}M`, 'AUM']} />
              <Bar dataKey="aum" fill="#C9A84C" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Performers */}
      <div style={{ ...s.card }}>
        <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#E2E8F4', marginBottom: 20 }}>أفضل المحافظ أداءً هذا الشهر</div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['الترتيب', 'العميل', 'العائد', 'إجمالي الأصول', 'مؤشر الأداء'].map(h => (
                <th key={h} style={{ padding: '10px 16px', textAlign: 'right', fontSize: '0.75rem', color: '#6B84A8', fontWeight: 600, borderBottom: '1px solid #1A2E4A' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {topPerformers.map((p, i) => (
              <tr key={i}>
                <td style={{ padding: '14px 16px', borderBottom: '1px solid rgba(26,46,74,0.5)' }}>
                  <span style={{ fontSize: i < 3 ? '1.2rem' : '0.875rem', fontWeight: 700, color: '#6B84A8' }}>{p.rank}</span>
                </td>
                <td style={{ padding: '14px 16px', fontWeight: 600, color: '#E2E8F4', borderBottom: '1px solid rgba(26,46,74,0.5)' }}>{p.name}</td>
                <td style={{ padding: '14px 16px', color: '#00D97E', fontWeight: 700, fontFamily: 'monospace', borderBottom: '1px solid rgba(26,46,74,0.5)' }}>+{p.ret}%</td>
                <td style={{ padding: '14px 16px', color: '#C9A84C', fontFamily: 'monospace', borderBottom: '1px solid rgba(26,46,74,0.5)' }}>${p.assets.toLocaleString()}</td>
                <td style={{ padding: '14px 16px', borderBottom: '1px solid rgba(26,46,74,0.5)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ flex: 1, height: 6, background: '#1A2E4A', borderRadius: 6, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${p.pct}%`, background: 'linear-gradient(90deg, #C9A84C, #00D97E)', borderRadius: 6 }} />
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#6B84A8', fontFamily: 'monospace', flexShrink: 0 }}>{p.pct}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
