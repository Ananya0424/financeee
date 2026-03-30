import React, { useState } from 'react';

const CATEGORY_ICONS = {
  food: '🍔', rent: '🏠', travel: '✈️', shopping: '🛍️',
  healthcare: '💊', entertainment: '🎬', education: '📚',
  utilities: '💡', gym: '💪', grocery: '🛒', fuel: '⛽',
  emi: '🏦', clothing: '👗', savings: '💰',
};

// FIX: case-insensitive icon lookup
const getIcon = (cat) => CATEGORY_ICONS[cat?.trim().toLowerCase()] || '📦';

// FIX: normalize category for matching (lowercase + trim)
const normalize = (str) => str?.trim().toLowerCase() || '';

// Defined OUTSIDE component so useState lazy init can access it
function getBudgetKey() {
  try {
    const u = JSON.parse(localStorage.getItem('user') || '{}');
    const id = u._id || u.id || u.email || 'default';
    return 'budgets_' + id;
  } catch {
    return 'budgets_default';
  }
}

export default function Budget({ transactions }) {
  const [budgets, setBudgets] = useState(() => {
    try {
      const saved = localStorage.getItem(getBudgetKey());
      return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
  });
  const [category, setCategory] = useState('');
  const [budgetAmount, setBudgetAmount] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [activeFilter, setActiveFilter] = useState('all');

  // Re-sync on mount — so after login the correct user's budgets load
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(getBudgetKey());
      setBudgets(saved ? JSON.parse(saved) : {});
    } catch {}
  }, []);

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  // FIX 2: Build expense map with NORMALIZED lowercase keys
  // so "Food" budget correctly matches "food" / "FOOD" transactions
  const monthlyExpenses = transactions
    .filter(t => {
      const d = new Date(t.date);
      return t.type === 'expense' && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    })
    .reduce((acc, t) => {
      const key = normalize(t.category);
      acc[key] = (acc[key] || 0) + Number(t.amount);
      return acc;
    }, {});

  // FIX 3: Always use normalize() for lookup — never direct key access
  const getSpent = (cat) => monthlyExpenses[normalize(cat)] || 0;

  const handleSetBudget = (e) => {
    e.preventDefault();
    if (!category.trim() || !budgetAmount) return;
    const newBudgets = { ...budgets, [category.trim()]: Number(budgetAmount) };
    setBudgets(newBudgets);
    localStorage.setItem(getBudgetKey(), JSON.stringify(newBudgets));
    setMessage({ text: `Budget set for "${category.trim()}"!`, type: 'success' });
    setCategory(''); setBudgetAmount('');
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const handleDelete = (cat) => {
    const nb = { ...budgets }; delete nb[cat];
    setBudgets(nb); localStorage.setItem(getBudgetKey(), JSON.stringify(nb));
  };

  const getStatus = (spent, budget) => {
    const pct = (spent / budget) * 100;
    if (pct >= 100) return { label: 'Over Budget', color: '#dc2626', bg: '#fff5f5', border: '#fecaca', bar: '#ef4444', icon: '🚨', tagBg: '#fef2f2', tagText: '#dc2626' };
    if (pct >= 80)  return { label: 'Near Limit',  color: '#d97706', bg: '#fffdf0', border: '#fde68a', bar: '#f59e0b', icon: '⚠️', tagBg: '#fefce8', tagText: '#b45309' };
    return              { label: 'On Track',   color: '#2563eb', bg: '#f0f6ff', border: '#bfdbfe', bar: '#3b82f6', icon: '✅', tagBg: '#eff6ff', tagText: '#1d4ed8' };
  };

  const totalBudget = Object.values(budgets).reduce((s, v) => s + v, 0);
  const totalSpent  = Object.keys(budgets).reduce((s, cat) => s + getSpent(cat), 0);
  const overallPct  = totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 100, 100) : 0;

  const allCats   = Object.keys(budgets);
  const overCats  = allCats.filter(cat => getSpent(cat) >= budgets[cat]);
  const warnCats  = allCats.filter(cat => { const p = getSpent(cat) / budgets[cat] * 100; return p >= 80 && p < 100; });
  const safeCats  = allCats.filter(cat => getSpent(cat) / budgets[cat] * 100 < 80);
  const filteredCats = activeFilter === 'over' ? overCats : activeFilter === 'warn' ? warnCats : activeFilter === 'safe' ? safeCats : allCats;
  const monthLabel = new Date().toLocaleString('en-IN', { month: 'long', year: 'numeric' });
  const remaining = totalBudget - totalSpent;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');
        .bg-wrap { display: flex; flex-direction: column; gap: 18px; font-family: 'Outfit', sans-serif; }

        /* STAT CARDS */
        .bg-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
        .bg-stat {
          background: #fff; border-radius: 14px; padding: 18px 20px;
          border: 1.5px solid #e8edf5;
          border-top: 3px solid var(--ac);
        }
        .bg-stat-lbl { font-size: 10px; font-weight: 700; color: #94a3b8; letter-spacing: 0.8px; text-transform: uppercase; margin-bottom: 10px; }
        .bg-stat-val { font-size: 22px; font-weight: 800; color: #0f172a; line-height: 1; }
        .bg-stat-sub { font-size: 11px; color: #94a3b8; margin-top: 5px; }

        /* BANNER */
        .bg-banner {
          border-radius: 16px; padding: 22px 26px;
          background: linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%);
          border: 1.5px solid #bfdbfe;
        }
        .bg-banner-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
        .bg-banner-lbl { font-size: 11px; font-weight: 700; color: #3b82f6; letter-spacing: 0.8px; text-transform: uppercase; }
        .bg-banner-pct { font-size: 13px; font-weight: 700; color: #1d4ed8; background: #fff; padding: 3px 12px; border-radius: 20px; }
        .bg-banner-amounts { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 12px; }
        .bg-banner-spent { font-size: 30px; font-weight: 800; color: #0f172a; }
        .bg-banner-of { font-size: 14px; color: #64748b; padding-bottom: 4px; }
        .bg-banner-bar { height: 8px; background: #bfdbfe; border-radius: 100px; overflow: hidden; }
        .bg-banner-fill { height: 100%; border-radius: 100px; transition: width .6s ease; }
        .bg-banner-meta { display: flex; justify-content: space-between; margin-top: 10px; font-size: 12px; color: #64748b; }
        .bg-banner-meta .good { color: #16a34a; font-weight: 600; }
        .bg-banner-meta .bad  { color: #dc2626; font-weight: 600; }

        /* FORM CARD */
        .bg-form-card {
          background: #fff; border-radius: 16px; padding: 20px 22px;
          border: 1.5px solid #e8edf5;
        }
        .bg-card-title {
          font-size: 11px; font-weight: 700; color: #94a3b8;
          letter-spacing: 0.8px; text-transform: uppercase; margin-bottom: 16px;
          display: flex; align-items: center; gap: 8px;
        }
        .bg-card-title::after { content: ''; flex: 1; height: 1px; background: #f0f4ff; }

        .bg-msg-ok  { display:flex;align-items:center;gap:8px;padding:10px 14px;border-radius:9px;margin-bottom:14px;background:#f0f9ff;border:1px solid #bae6fd;font-size:13px;color:#0369a1; }
        .bg-msg-err { display:flex;align-items:center;gap:8px;padding:10px 14px;border-radius:9px;margin-bottom:14px;background:#fef2f2;border:1px solid #fecaca;font-size:13px;color:#dc2626; }

        .bg-form-row { display: flex; gap: 10px; }
        .bg-form-field { flex: 1; }
        .bg-form-field label { display:block;font-size:12px;font-weight:600;color:#64748b;margin-bottom:7px; }
        .bg-form-input {
          width: 100%; padding: 11px 14px;
          background: #f8fafc; border: 1.5px solid #e8edf5;
          border-radius: 11px; font-size: 14px; font-family: 'Outfit', sans-serif;
          color: #0f172a; outline: none;
          transition: border-color .2s, box-shadow .2s, background .2s;
        }
        .bg-form-input:focus { border-color: #3b82f6; background: #fff; box-shadow: 0 0 0 4px rgba(59,130,246,0.1); }
        .bg-form-input::placeholder { color: #bfcce0; }

        .bg-add-btn {
          padding: 11px 20px; align-self: flex-end;
          background: #3b82f6;
          color: #fff; border: none; border-radius: 11px; cursor: pointer;
          font-size: 13px; font-weight: 700; font-family: 'Outfit', sans-serif;
          white-space: nowrap;
          box-shadow: 0 4px 14px rgba(59,130,246,0.3);
          transition: background .15s, transform .15s;
        }
        .bg-add-btn:hover { background: #2563eb; transform: translateY(-1px); }

        /* LIST CARD */
        .bg-list-card {
          background: #fff; border-radius: 16px; padding: 20px 22px;
          border: 1.5px solid #e8edf5;
        }
        .bg-list-hdr { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px; }

        .bg-filters { display: flex; gap: 6px; flex-wrap: wrap; }
        .bg-fbtn {
          padding: 5px 13px; border-radius: 20px; cursor: pointer;
          font-size: 12px; font-weight: 600; font-family: 'Outfit', sans-serif;
          border: 1.5px solid transparent; transition: all .15s;
        }
        .bg-fbtn.f-all  { background: #3b82f6; color: #fff; }
        .bg-fbtn.f-over { background: #fef2f2; color: #dc2626; border-color: #fecaca; }
        .bg-fbtn.f-warn { background: #fefce8; color: #d97706; border-color: #fde68a; }
        .bg-fbtn.f-safe { background: #eff6ff; color: #2563eb; border-color: #bfdbfe; }
        .bg-fbtn.f-idle { background: #f8fafc; color: #94a3b8; border-color: #e8edf5; }

        .bg-empty { text-align: center; padding: 52px 0; }
        .bg-empty-icon { font-size: 44px; margin-bottom: 12px; }
        .bg-empty-text { font-size: 14px; color: #94a3b8; font-weight: 600; }
        .bg-empty-sub  { font-size: 13px; color: #bfcce0; margin-top: 6px; }

        .bg-item {
          border-radius: 12px; padding: 16px 18px; margin-bottom: 10px;
          border: 1.5px solid; transition: box-shadow .15s, transform .15s;
        }
        .bg-item:last-child { margin-bottom: 0; }
        .bg-item:hover { transform: translateY(-1px); box-shadow: 0 4px 14px rgba(59,130,246,0.1); }

        .bg-item-hdr { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
        .bg-item-left { display: flex; align-items: center; gap: 11px; }
        .bg-item-icon {
          width: 40px; height: 40px; border-radius: 11px;
          display: flex; align-items: center; justify-content: center;
          font-size: 19px; flex-shrink: 0; background: rgba(0,0,0,0.04);
        }
        .bg-item-name { font-size: 14px; font-weight: 700; color: #1e293b; }
        .bg-item-tag {
          font-size: 10px; font-weight: 700; padding: 3px 10px;
          border-radius: 20px; margin-top: 4px; display: inline-block;
        }
        .bg-item-right { display: flex; align-items: center; gap: 12px; }
        .bg-item-amounts { text-align: right; }
        .bg-item-spent  { font-size: 15px; font-weight: 700; color: #0f172a; }
        .bg-item-budget { font-size: 12px; color: #94a3b8; }

        .bg-del-btn {
          padding: 5px 12px; background: #f8fafc;
          border: 1.5px solid #e8edf5; border-radius: 8px; cursor: pointer;
          font-size: 11px; font-weight: 600; color: #94a3b8;
          font-family: 'Outfit', sans-serif; transition: all .15s;
        }
        .bg-del-btn:hover { border-color: #fecaca; color: #ef4444; background: #fef2f2; }

        .bg-bar-bg   { height: 6px; border-radius: 100px; overflow: hidden; background: rgba(0,0,0,0.06); }
        .bg-bar-fill { height: 100%; border-radius: 100px; transition: width .5s ease; }
        .bg-bar-meta { display: flex; justify-content: space-between; margin-top: 7px; font-size: 11px; color: #64748b; font-weight: 500; }
        .bg-bar-meta .pct { font-weight: 700; }
      `}</style>

      <div className="bg-wrap">
        {/* STAT CARDS */}
        <div className="bg-stats">
          <div className="bg-stat" style={{ '--ac': '#3b82f6' }}>
            <div className="bg-stat-lbl">Total Budget</div>
            <div className="bg-stat-val">₹{totalBudget.toLocaleString()}</div>
            <div className="bg-stat-sub">{allCats.length} categories</div>
          </div>
          <div className="bg-stat" style={{ '--ac': '#ef4444' }}>
            <div className="bg-stat-lbl">Total Spent</div>
            <div className="bg-stat-val">₹{totalSpent.toLocaleString()}</div>
            <div className="bg-stat-sub">This month</div>
          </div>
          <div className="bg-stat" style={{ '--ac': '#10b981' }}>
            <div className="bg-stat-lbl">Remaining</div>
            <div className="bg-stat-val">₹{Math.max(remaining, 0).toLocaleString()}</div>
            <div className="bg-stat-sub">{(100 - overallPct).toFixed(0)}% left</div>
          </div>
          <div className="bg-stat" style={{ '--ac': overCats.length > 0 ? '#ef4444' : '#f59e0b' }}>
            <div className="bg-stat-lbl">Over Budget</div>
            <div className="bg-stat-val">{overCats.length}</div>
            <div className="bg-stat-sub">{warnCats.length} near limit</div>
          </div>
        </div>

        {/* BANNER */}
        {totalBudget > 0 && (
          <div className="bg-banner">
            <div className="bg-banner-top">
              <span className="bg-banner-lbl">Monthly Budget — {monthLabel}</span>
              <span className="bg-banner-pct">{overallPct.toFixed(1)}% used</span>
            </div>
            <div className="bg-banner-amounts">
              <span className="bg-banner-spent">₹{totalSpent.toLocaleString()}</span>
              <span className="bg-banner-of">of ₹{totalBudget.toLocaleString()}</span>
            </div>
            <div className="bg-banner-bar">
              <div className="bg-banner-fill" style={{
                width: `${overallPct}%`,
                background: overallPct >= 100 ? '#ef4444' : overallPct >= 80 ? '#f59e0b' : '#3b82f6'
              }} />
            </div>
            <div className="bg-banner-meta">
              <span>{overCats.length > 0 ? `⚠ ${overCats.length} categories over budget` : '✓ Spending within limits'}</span>
              <span className={remaining >= 0 ? 'good' : 'bad'}>
                ₹{Math.abs(remaining).toLocaleString()} {remaining >= 0 ? 'remaining' : 'over budget'}
              </span>
            </div>
          </div>
        )}

        {/* FORM */}
        <div className="bg-form-card">
          <div className="bg-card-title">Set Monthly Budget</div>
          {message.text && (
            <div className={message.type === 'success' ? 'bg-msg-ok' : 'bg-msg-err'}>
              {message.type === 'success' ? '✓' : '⚠'} {message.text}
            </div>
          )}
          <form onSubmit={handleSetBudget}>
            <div className="bg-form-row">
              <div className="bg-form-field">
                <label>Category Name</label>
                <input className="bg-form-input" type="text" placeholder="e.g. Food, Rent, Travel..."
                  value={category} onChange={e => setCategory(e.target.value)} />
              </div>
              <div className="bg-form-field">
                <label>Monthly Limit</label>
                <input className="bg-form-input" type="number" placeholder="₹ Amount"
                  value={budgetAmount} onChange={e => setBudgetAmount(e.target.value)} min="1" />
              </div>
              <button className="bg-add-btn" type="submit">+ Set Budget</button>
            </div>
          </form>
        </div>

        {/* LIST */}
        <div className="bg-list-card">
          <div className="bg-list-hdr">
            <div className="bg-card-title" style={{ margin: 0, flex: 1, marginRight: 14 }}>
              Budget Tracker — {monthLabel}
            </div>
            {allCats.length > 0 && (
              <div className="bg-filters">
                {[
                  { key: 'all',  label: `All (${allCats.length})`,        cls: 'f-all' },
                  { key: 'over', label: `🚨 Over (${overCats.length})`,   cls: 'f-over' },
                  { key: 'warn', label: `⚠️ Warn (${warnCats.length})`,   cls: 'f-warn' },
                  { key: 'safe', label: `✅ Safe (${safeCats.length})`,    cls: 'f-safe' },
                ].map(f => (
                  <button key={f.key}
                    className={`bg-fbtn ${activeFilter === f.key ? f.cls : 'f-idle'}`}
                    onClick={() => setActiveFilter(f.key)}>
                    {f.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {allCats.length === 0 ? (
            <div className="bg-empty">
              <div className="bg-empty-icon">🎯</div>
              <div className="bg-empty-text">No budgets set yet</div>
              <div className="bg-empty-sub">Add a category above to start tracking</div>
            </div>
          ) : filteredCats.length === 0 ? (
            <div className="bg-empty">
              <div className="bg-empty-icon">🔍</div>
              <div className="bg-empty-text">No categories in this filter</div>
            </div>
          ) : filteredCats.map(cat => {
            const spent  = getSpent(cat);
            const budget = budgets[cat];
            const percent = Math.min((spent / budget) * 100, 100);
            const s = getStatus(spent, budget);
            return (
              <div key={cat} className="bg-item" style={{ background: s.bg, borderColor: s.border }}>
                <div className="bg-item-hdr">
                  <div className="bg-item-left">
                    <div className="bg-item-icon">{getIcon(cat)}</div>
                    <div>
                      <div className="bg-item-name">{cat}</div>
                      <span className="bg-item-tag" style={{ background: s.tagBg, color: s.tagText }}>
                        {s.icon} {s.label}
                      </span>
                    </div>
                  </div>
                  <div className="bg-item-right">
                    <div className="bg-item-amounts">
                      <div className="bg-item-spent">₹{spent.toLocaleString()}</div>
                      <div className="bg-item-budget">of ₹{budget.toLocaleString()}</div>
                    </div>
                    <button className="bg-del-btn" onClick={() => handleDelete(cat)}>Remove</button>
                  </div>
                </div>
                <div className="bg-bar-bg">
                  <div className="bg-bar-fill" style={{ width: `${percent}%`, background: s.bar }} />
                </div>
                <div className="bg-bar-meta">
                  <span className="pct" style={{ color: s.color }}>{percent.toFixed(1)}% used</span>
                  <span>₹{Math.max(budget - spent, 0).toLocaleString()} remaining</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
