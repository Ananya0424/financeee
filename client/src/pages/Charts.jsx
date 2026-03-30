import React from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  AreaChart, Area
} from 'recharts';

const PIE_COLORS = ['#2563eb', '#0ea5e9', '#6366f1', '#8b5cf6', '#ec4899', '#f59e0b'];
const BAR_INCOME = '#10b981';
const BAR_EXPENSE = '#ef4444';
const AREA_COLOR = '#2563eb';

/* ── Custom tooltip shared by all charts ── */
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 10, padding: '10px 14px',
      boxShadow: '0 8px 30px rgba(0,0,0,0.4)', fontFamily: 'DM Sans, sans-serif'
    }}>
      {label && <div style={{ color: '#94a3b8', fontSize: 11, fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>}
      {payload.map((p, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: i < payload.length - 1 ? 4 : 0 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.color || p.fill }} />
          <span style={{ color: '#94a3b8', fontSize: 12 }}>{p.name}:</span>
          <span style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>₹{Number(p.value).toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
};

function Charts({ transactions }) {
  /* ── Data processing ── */
  const categoryData = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      const found = acc.find(item => item.name === t.category);
      if (found) found.value += t.amount;
      else acc.push({ name: t.category || 'General', value: t.amount });
      return acc;
    }, [])
    .sort((a, b) => b.value - a.value);

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

  const barData = [
    { name: 'Income', amount: totalIncome, fill: BAR_INCOME },
    { name: 'Expense', amount: totalExpense, fill: BAR_EXPENSE },
  ];

  const lineData = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      const date = new Date(t.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
      const found = acc.find(item => item.date === date);
      if (found) found.amount += t.amount;
      else acc.push({ date, amount: t.amount });
      return acc;
    }, [])
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        .ch-wrap { display: flex; flex-direction: column; gap: 20px; font-family: 'DM Sans', sans-serif; }
        .ch-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }

        .ch-card {
          background: #fff; border-radius: 16px; padding: 24px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04);
        }
        .ch-hdr { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px; }
        .ch-title { font-size: 15px; font-weight: 700; color: #0f172a; }
        .ch-sub { font-size: 12px; color: #94a3b8; margin-bottom: 20px; }
        .ch-badge {
          font-size: 11px; font-weight: 600; padding: 4px 12px;
          border-radius: 100px; white-space: nowrap;
        }

        .ch-empty {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          padding: 60px 0; color: #94a3b8; text-align: center;
        }
        .ch-empty-icon { font-size: 40px; margin-bottom: 12px; }
        .ch-empty-text { font-size: 13px; }

        /* Pie legend */
        .ch-legend { display: flex; flex-direction: column; gap: 10px; margin-top: 20px; }
        .ch-leg-row { display: flex; align-items: center; gap: 10px; }
        .ch-leg-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
        .ch-leg-name { font-size: 13px; color: #475569; flex: 1; font-weight: 500; }
        .ch-leg-track { flex: 2; height: 5px; background: #f1f5f9; border-radius: 100px; overflow: hidden; }
        .ch-leg-fill { height: 100%; border-radius: 100px; }
        .ch-leg-val { font-size: 13px; font-weight: 700; color: #1e293b; min-width: 80px; text-align: right; }

        /* Bar summary */
        .ch-bar-summary { display: flex; gap: 20px; margin-bottom: 16px; }
        .ch-bar-stat { flex: 1; }
        .ch-bar-stat-label { font-size: 10px; font-weight: 700; color: #94a3b8; letter-spacing: 0.8px; text-transform: uppercase; margin-bottom: 4px; }
        .ch-bar-stat-val { font-size: 20px; font-weight: 700; }

        /* Area chart info */
        .ch-area-meta { display: flex; gap: 16px; margin-bottom: 16px; }
        .ch-area-item { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #64748b; }
        .ch-area-dot { width: 8px; height: 8px; border-radius: 50%; background: #2563eb; }
      `}</style>

      <div className="ch-wrap">

        {/* ROW 1: Pie + Bar side by side */}
        <div className="ch-row">

          {/* ── PIE CHART ── */}
          <div className="ch-card">
            <div className="ch-hdr">
              <div>
                <div className="ch-title">Expense by Category</div>
                <div className="ch-sub">Where your money goes</div>
              </div>
              {categoryData.length > 0 && (
                <span className="ch-badge" style={{ background: '#eff6ff', color: '#1d4ed8' }}>
                  {categoryData.length} categories
                </span>
              )}
            </div>

            {categoryData.length === 0 ? (
              <div className="ch-empty">
                <div className="ch-empty-icon">🍩</div>
                <div className="ch-empty-text">No expense data yet</div>
              </div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%" cy="50%"
                      outerRadius={88} innerRadius={52}
                      dataKey="value" paddingAngle={3}
                      startAngle={90} endAngle={-270}
                    >
                      {categoryData.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke="#fff" strokeWidth={2} />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltip />} />
                  </PieChart>
                </ResponsiveContainer>

                {/* Custom legend with progress bars */}
                <div className="ch-legend">
                  {categoryData.slice(0, 5).map((item, i) => (
                    <div key={i} className="ch-leg-row">
                      <div className="ch-leg-dot" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                      <span className="ch-leg-name">{item.name}</span>
                      <div className="ch-leg-track">
                        <div className="ch-leg-fill" style={{
                          width: `${(item.value / totalExpense * 100).toFixed(0)}%`,
                          background: PIE_COLORS[i % PIE_COLORS.length]
                        }} />
                      </div>
                      <span className="ch-leg-val">₹{item.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* ── BAR CHART ── */}
          <div className="ch-card">
            <div className="ch-hdr">
              <div>
                <div className="ch-title">Income vs Expense</div>
                <div className="ch-sub">Financial overview</div>
              </div>
              <span className="ch-badge" style={{
                background: totalIncome >= totalExpense ? '#f0fdf4' : '#fef2f2',
                color: totalIncome >= totalExpense ? '#16a34a' : '#dc2626'
              }}>
                {totalIncome >= totalExpense ? '✓ Surplus' : '↓ Deficit'}
              </span>
            </div>

            {/* Summary numbers */}
            <div className="ch-bar-summary">
              <div className="ch-bar-stat">
                <div className="ch-bar-stat-label">Total Income</div>
                <div className="ch-bar-stat-val" style={{ color: BAR_INCOME }}>₹{totalIncome.toLocaleString()}</div>
              </div>
              <div className="ch-bar-stat">
                <div className="ch-bar-stat-label">Total Expense</div>
                <div className="ch-bar-stat-val" style={{ color: BAR_EXPENSE }}>₹{totalExpense.toLocaleString()}</div>
              </div>
              <div className="ch-bar-stat">
                <div className="ch-bar-stat-label">Net</div>
                <div className="ch-bar-stat-val" style={{ color: totalIncome - totalExpense >= 0 ? '#10b981' : '#ef4444' }}>
                  ₹{Math.abs(totalIncome - totalExpense).toLocaleString()}
                </div>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={barData} margin={{ top: 0, right: 0, left: -10, bottom: 0 }} barSize={64}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 13, fill: '#64748b', fontFamily: 'DM Sans', fontWeight: 600 }}
                  axisLine={false} tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#94a3b8', fontFamily: 'DM Sans' }}
                  axisLine={false} tickLine={false}
                  tickFormatter={v => v >= 1000 ? `₹${(v / 1000).toFixed(0)}k` : `₹${v}`}
                  width={55}
                />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(0,0,0,0.04)', radius: 8 }} />
                <Bar dataKey="amount" radius={[10, 10, 0, 0]} maxBarSize={80}>
                  {barData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ROW 2: Area chart full width */}
        <div className="ch-card">
          <div className="ch-hdr">
            <div>
              <div className="ch-title">Spending Over Time</div>
              <div className="ch-sub">Daily expense trend — track how your spending changes day by day</div>
            </div>
            {lineData.length > 0 && (
              <span className="ch-badge" style={{ background: '#eff6ff', color: '#1d4ed8' }}>
                {lineData.length} days
              </span>
            )}
          </div>

          {lineData.length === 0 ? (
            <div className="ch-empty" style={{ paddingTop: 40 }}>
              <div className="ch-empty-icon">📈</div>
              <div className="ch-empty-text">Add expense transactions to see your spending trend</div>
            </div>
          ) : (
            <>
              <div className="ch-area-meta">
                <div className="ch-area-item"><div className="ch-area-dot" /> Daily spend</div>
                <div className="ch-area-item" style={{ color: '#94a3b8' }}>
                  Avg: ₹{Math.round(lineData.reduce((s, d) => s + d.amount, 0) / lineData.length).toLocaleString()} / day
                </div>
                <div className="ch-area-item" style={{ color: '#94a3b8' }}>
                  Peak: ₹{Math.max(...lineData.map(d => d.amount)).toLocaleString()}
                </div>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={lineData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={AREA_COLOR} stopOpacity={0.18} />
                      <stop offset="95%" stopColor={AREA_COLOR} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: '#94a3b8', fontFamily: 'DM Sans' }}
                    axisLine={false} tickLine={false}
                    interval={lineData.length > 10 ? Math.floor(lineData.length / 6) : 0}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#94a3b8', fontFamily: 'DM Sans' }}
                    axisLine={false} tickLine={false} width={55}
                    tickFormatter={v => v >= 1000 ? `₹${(v / 1000).toFixed(0)}k` : `₹${v}`}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Area
                    type="monotone" dataKey="amount"
                    stroke={AREA_COLOR} strokeWidth={2.5}
                    fill="url(#areaGrad)"
                    dot={{ fill: AREA_COLOR, r: 4, strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ fill: AREA_COLOR, r: 6, strokeWidth: 2, stroke: '#fff' }}
                    name="Expenses"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </>
          )}
        </div>

      </div>
    </>
  );
}

export default Charts;

