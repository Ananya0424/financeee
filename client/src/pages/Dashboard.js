import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Charts from './Charts';
import Budget from './Budget';

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; }

  .db-root {
    display: flex; height: 100vh; width: 100vw; overflow: hidden;
    font-family: 'Outfit', sans-serif; background: #f0f4ff;
  }

  /* ── SIDEBAR — medium blue ── */
  .db-sidebar {
    width: 224px; flex-shrink: 0;
    background: linear-gradient(180deg, #1e5db8 0%, #2563eb 100%);
    display: flex; flex-direction: column;
    overflow-y: auto; overflow-x: hidden;
  }
  .db-logo {
    padding: 22px 20px 18px;
    border-bottom: 1px solid rgba(255,255,255,0.12);
    display: flex; align-items: center; gap: 10px;
  }
  .db-logo-mark {
    width: 34px; height: 34px; border-radius: 10px;
    background: rgba(255,255,255,0.2);
    display: flex; align-items: center; justify-content: center;
    font-size: 17px; flex-shrink: 0;
  }
  .db-logo-name { font-size: 15px; font-weight: 800; color: #fff; line-height: 1; }
  .db-logo-sub  { font-size: 10px; color: rgba(255,255,255,0.5); margin-top: 2px; }

  .db-nav { flex: 1; padding: 12px 0; }
  .db-nav-label {
    color: rgba(255,255,255,0.45); font-size: 9px; font-weight: 700;
    letter-spacing: 1.5px; text-transform: uppercase;
    padding: 10px 18px 6px;
  }
  .db-nav-item {
    display: flex; align-items: center; gap: 9px;
    padding: 10px 18px; cursor: pointer;
    color: rgba(255,255,255,0.65); font-size: 13px; font-weight: 500;
    border-left: 3px solid transparent;
    transition: all 0.15s;
  }
  .db-nav-item:hover { color: #fff; background: rgba(255,255,255,0.1); }
  .db-nav-item.active {
    color: #fff; font-weight: 700;
    background: rgba(255,255,255,0.15);
    border-left-color: #fff;
  }
  .db-nav-icon { font-size: 15px; width: 18px; text-align: center; flex-shrink: 0; }

  .db-user {
    padding: 14px 18px;
    border-top: 1px solid rgba(255,255,255,0.12);
    display: flex; align-items: center; gap: 10px;
  }
  .db-avatar {
    width: 32px; height: 32px; border-radius: 8px;
    background: rgba(255,255,255,0.2);
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 700; color: #fff; flex-shrink: 0;
  }
  .db-user-name { font-size: 12px; font-weight: 700; color: #fff; line-height: 1.2; }
  .db-user-plan { font-size: 10px; color: rgba(255,255,255,0.45); }

  /* ── MAIN ── */
  .db-main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }

  .db-topbar {
    background: #fff; padding: 14px 26px;
    display: flex; justify-content: space-between; align-items: center;
    border-bottom: 1.5px solid #e8edf5;
  }
  .db-topbar-title { font-size: 16px; font-weight: 800; color: #0f172a; }
  .db-topbar-date  { font-size: 11px; color: #94a3b8; margin-top: 2px; }
  .db-topbar-right { display: flex; align-items: center; gap: 12px; }
  .db-welcome { font-size: 13px; color: #64748b; }
  .db-logout-btn {
    padding: 7px 16px; background: #fff;
    border: 1.5px solid #e8edf5; border-radius: 8px;
    color: #64748b; font-size: 12px; font-weight: 600;
    font-family: 'Outfit', sans-serif; cursor: pointer; transition: all .15s;
  }
  .db-logout-btn:hover { border-color: #fecaca; color: #ef4444; background: #fff5f5; }

  .db-content {
    flex: 1; overflow-y: auto; padding: 22px 24px;
    display: flex; flex-direction: column; gap: 16px;
  }

  /* STAT CARDS */
  .db-stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
  .db-stat-card {
    background: #fff; border-radius: 14px; padding: 18px 20px;
    border: 1.5px solid #e8edf5;
    border-top: 3px solid transparent;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .db-stat-card:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(59,130,246,0.1); }
  .db-stat-label { font-size: 10px; font-weight: 700; color: #94a3b8; letter-spacing: 0.8px; text-transform: uppercase; margin-bottom: 10px; }
  .db-stat-icon  { font-size: 20px; margin-bottom: 6px; }
  .db-stat-value { font-size: 22px; font-weight: 800; color: #0f172a; }
  .db-stat-sub   { font-size: 11px; color: #94a3b8; margin-top: 4px; }

  /* CARD */
  .db-card {
    background: #fff; border-radius: 14px; padding: 20px 22px;
    border: 1.5px solid #e8edf5;
  }
  .db-card-title {
    font-size: 11px; font-weight: 700; color: #94a3b8;
    letter-spacing: 0.8px; text-transform: uppercase; margin-bottom: 16px;
    display: flex; align-items: center; gap: 8px;
  }
  .db-card-title::after { content: ''; flex: 1; height: 1px; background: #f0f4ff; }
  .db-two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

  /* TRANSACTIONS */
  .db-txn-row {
    display: flex; align-items: center; gap: 12px;
    padding: 10px 0; border-bottom: 1px solid #f8fafc;
  }
  .db-txn-row:last-child { border-bottom: none; }
  .db-txn-icon {
    width: 36px; height: 36px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px; flex-shrink: 0;
  }
  .db-txn-title { font-size: 13px; font-weight: 600; color: #1e293b; }
  .db-txn-meta  { font-size: 11px; color: #94a3b8; margin-top: 2px; }
  .db-txn-amount { font-size: 14px; font-weight: 700; }
  .db-txn-btns   { display: flex; gap: 6px; }
  .db-btn-ghost {
    padding: 5px 10px; background: #f8fafc;
    border-radius: 7px; cursor: pointer; font-size: 11px; font-weight: 600;
    font-family: 'Outfit', sans-serif; border: 1.5px solid #e8edf5; transition: all .15s;
  }

  /* FORM */
  .db-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .db-input, .db-select {
    width: 100%; padding: 11px 14px;
    border-radius: 10px; font-size: 13px; font-family: 'Outfit', sans-serif;
    color: #0f172a; background: #f8fafc; border: 1.5px solid #e8edf5;
    outline: none; transition: border-color .2s, box-shadow .2s, background .2s;
  }
  .db-input:focus, .db-select:focus {
    border-color: #2563eb; background: #fff;
    box-shadow: 0 0 0 4px rgba(37,99,235,0.08);
  }
  .db-btn-primary {
    padding: 11px 20px; background: #2563eb;
    color: #fff; border: none; border-radius: 10px; cursor: pointer;
    font-size: 13px; font-weight: 700; font-family: 'Outfit', sans-serif;
    box-shadow: 0 4px 14px rgba(37,99,235,0.3); transition: background .15s, transform .15s;
  }
  .db-btn-primary:hover { background: #1d4ed8; transform: translateY(-1px); }
  .db-btn-danger {
    padding: 11px 16px; background: #fff5f5;
    border: 1.5px solid #fecaca; border-radius: 10px; cursor: pointer;
    color: #dc2626; font-size: 13px; font-weight: 700; font-family: 'Outfit', sans-serif;
  }

  /* FILTERS */
  .db-filters { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr auto; gap: 8px; margin-bottom: 16px; }
  .db-filter-clear {
    padding: 11px 14px; background: #f8fafc; border: 1.5px solid #e8edf5;
    border-radius: 10px; cursor: pointer; color: #94a3b8;
    font-size: 12px; font-weight: 700; font-family: 'Outfit', sans-serif; white-space: nowrap; transition: all .15s;
  }
  .db-filter-clear:hover { color: #ef4444; border-color: #fecaca; background: #fff5f5; }

  /* PAYMENT BADGES */
  .db-payment-badge {
    display: inline-flex; align-items: center; gap: 6px;
    background: #eff6ff; color: #2563eb; padding: 5px 14px;
    border-radius: 20px; font-size: 12px; font-weight: 600; border: 1px solid #bfdbfe;
  }

  /* INSIGHTS */
  .db-insight-card {
    display: flex; gap: 14px; padding: 15px 17px;
    background: #f8fafc; border-radius: 11px; margin-bottom: 10px;
    border-left: 3px solid #2563eb; transition: transform 0.15s;
  }
  .db-insight-card:hover { transform: translateX(3px); }
  .db-insight-card:last-child { margin-bottom: 0; }
  .db-insight-icon {
    width: 34px; height: 34px; border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    font-size: 17px; flex-shrink: 0; background: #eff6ff;
  }
  .db-insight-text  { font-size: 13px; color: #334155; line-height: 1.65; margin: 0; }
  .db-insight-label { font-size: 10px; font-weight: 700; color: #2563eb; letter-spacing: 0.8px; text-transform: uppercase; margin-bottom: 4px; }

  .db-loading-wave { display: flex; gap: 6px; align-items: center; justify-content: center; padding: 30px; }
  .db-dot { width: 8px; height: 8px; border-radius: 50%; background: #2563eb; animation: dbBounce 1.2s infinite ease-in-out; }
  .db-dot:nth-child(2) { animation-delay: 0.2s; }
  .db-dot:nth-child(3) { animation-delay: 0.4s; }
  @keyframes dbBounce { 0%,80%,100% { transform: scale(0.6); opacity: 0.4; } 40% { transform: scale(1); opacity: 1; } }

  .db-msg { padding: 10px 14px; border-radius: 8px; margin-bottom: 12px; font-size: 13px; }
  .db-msg-success { background: #eff6ff; border: 1px solid #bfdbfe; color: #1d4ed8; }
  .db-msg-error   { background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; }

  .db-view-all {
    padding: 6px 14px; background: #f8fafc; border: 1.5px solid #e8edf5;
    border-radius: 8px; cursor: pointer; font-size: 12px; font-weight: 600;
    color: #64748b; font-family: 'Outfit', sans-serif; transition: all .15s;
  }
  .db-view-all:hover { border-color: #2563eb; color: #2563eb; background: #eff6ff; }

  .db-empty { text-align: center; padding: 32px 0; color: #94a3b8; font-size: 13px; }

  .db-refresh-btn {
    display: flex; align-items: center; gap: 6px;
    padding: 7px 14px; background: #eff6ff; border: 1.5px solid #bfdbfe;
    border-radius: 8px; cursor: pointer; font-size: 12px; font-weight: 600;
    color: #2563eb; font-family: 'Outfit', sans-serif; transition: background .15s;
  }
  .db-refresh-btn:hover:not(:disabled) { background: #dbeafe; }
  .db-refresh-btn:disabled { opacity: 0.6; cursor: not-allowed; }

  .db-insight-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
  .db-insight-count {
    font-size: 11px; font-weight: 600; padding: 4px 12px;
    border-radius: 20px; background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe;
  }
`;

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  const [activeTab, setActiveTab] = useState('dashboard');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('income');
  const [category, setCategory] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [insights, setInsights] = useState([]);
  const [insightLoading, setInsightLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterPayment, setFilterPayment] = useState('');
  const [filterType, setFilterType] = useState('');

  useEffect(() => { fetchTransactions(); }, []);

  const fetchInsights = async (txns) => {
    if (!Array.isArray(txns) || txns.length === 0) { setInsights([]); return; }
    setInsightLoading(true); setInsights([]);
    try {
      const res = await fetch(`${process.env.REACT_APP_AI_URL}/analyze`, { method: 'POST',headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ transactions: txns }) });
      if (res.ok) { const data = await res.json(); if (data.insights?.length > 0) { setInsights(data.insights); setInsightLoading(false); return; } }
    } catch (_) {}
    try {
      const expenses = txns.filter(t => t.type === 'expense');
      const totalSpent = expenses.reduce((s, t) => s + t.amount, 0);
      const byCategory = expenses.reduce((acc, t) => { acc[t.category] = (acc[t.category] || 0) + t.amount; return acc; }, {});
      const byPayment  = expenses.reduce((acc, t) => { acc[t.paymentMethod] = (acc[t.paymentMethod] || 0) + 1; return acc; }, {});
      const prompt = `You are a smart personal finance advisor. Give 4 short, practical, friendly financial insights based on:\nTotal spent: ₹${totalSpent.toLocaleString()}\nTransactions: ${expenses.length}\nBy category: ${JSON.stringify(byCategory)}\nBy payment: ${JSON.stringify(byPayment)}\nDo NOT use markdown. Return ONLY a JSON array of strings: ["insight 1","insight 2","insight 3","insight 4"]`;
      const apiRes = await fetch('https://api.anthropic.com/v1/messages', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 1000, messages: [{ role: 'user', content: prompt }] }) });
      if (apiRes.ok) { const d = await apiRes.json(); const raw = d.content?.map(c => c.text || '').join('') || ''; const parsed = JSON.parse(raw.replace(/```json|```/g, '').trim()); if (Array.isArray(parsed)) setInsights(parsed); }
      else generateLocalInsights(txns);
    } catch { generateLocalInsights(txns); }
    setInsightLoading(false);
  };

  const generateLocalInsights = (txns) => {
    const expenses = txns.filter(t => t.type === 'expense');
    const income = txns.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const totalSpent = expenses.reduce((s, t) => s + t.amount, 0);
    if (!expenses.length) { setInsights([]); return; }
    const byCategory = expenses.reduce((acc, t) => { acc[t.category] = (acc[t.category] || 0) + t.amount; return acc; }, {});
    const topCat = Object.keys(byCategory).sort((a, b) => byCategory[b] - byCategory[a])[0];
    const savingsRate = income > 0 ? ((income - totalSpent) / income * 100).toFixed(0) : 0;
    setInsights([
      `You've spent ₹${totalSpent.toLocaleString()} across ${expenses.length} transactions. ${totalSpent > income * 0.8 ? 'Consider reviewing your budget.' : 'Your spending looks manageable.'}`,
      topCat ? `Your highest spending category is "${topCat}" at ₹${byCategory[topCat].toLocaleString()}.` : null,
      income > 0 ? `Your savings rate is ${savingsRate}%. ${savingsRate < 20 ? 'Try to save at least 20% of your income.' : 'Great job!'}` : null,
      `You have ${expenses.length} expense transactions. Review them regularly to identify savings opportunities.`,
    ].filter(Boolean));
  };

  const fetchTransactions = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/transactions/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      const list = Array.isArray(data) ? data : [];
      setTransactions(list);
      fetchInsights(list);
    } catch {
      console.error('Fetch error');
      setTransactions([]);
    }
  };

  const generateReport = async () => {
    try {
      const now = new Date();
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/reports/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ month: now.getMonth() + 1, year: now.getFullYear() })
      });

      if (!res.ok) {
        alert('Failed to generate report or no transactions this month.');
        return;
      }
      
      const csvText = await res.text();
      const rows = csvText.trim().split('\\n').map(r => {
        // Simple CSV parse handling quotes roughly
        let row = []; let inQuote = false; let curr = '';
        for (let i=0; i<r.length; i++) {
          if (r[i] === '"') inQuote = !inQuote;
          else if (r[i] === ',' && !inQuote) { row.push(curr); curr = ''; }
          else curr += r[i];
        }
        row.push(curr);
        return row;
      });

      let tableHtml = '<table class="report-table">';
      rows.forEach((row, index) => {
        if (index === 0) {
          tableHtml += '<thead><tr>' + row.map(c => `<th>${c}</th>`).join('') + '</tr></thead><tbody>';
        } else {
          tableHtml += '<tr>' + row.map(c => `<td>${c}</td>`).join('') + '</tr>';
        }
      });
      tableHtml += '</tbody></table>';

      const newWin = window.open('', '_blank');
      if (newWin) {
        newWin.document.write(`
          <html>
            <head>
              <title>Finance Report</title>
              <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700&display=swap" rel="stylesheet">
              <style>
                body { font-family: 'Outfit', sans-serif; background: #f8fafc; color: #1e293b; padding: 40px; margin: 0; }
                .report-container { max-width: 900px; margin: 0 auto; background: #fff; padding: 40px; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
                .header { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #e2e8f0; }
                .header h1 { font-weight: 700; font-size: 28px; color: #0f172a; margin: 0 0 5px 0; }
                .header p { color: #64748b; font-size: 14px; margin: 0; }
                .report-table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 14px; }
                .report-table th { background: #2563eb; color: #fff; font-weight: 600; padding: 14px; text-align: left; }
                .report-table th:first-child { border-top-left-radius: 8px; }
                .report-table th:last-child { border-top-right-radius: 8px; }
                .report-table td { padding: 14px; border-bottom: 1px solid #e2e8f0; }
                .report-table tr:last-child td { border-bottom: none; }
                .report-table tr:hover { background: #f1f5f9; }
                td:nth-child(6) { font-weight: 700; }
                .print-btn { display: block; width: fit-content; margin: 30px auto 0; padding: 12px 24px; background: #10b981; color: #fff; border: none; border-radius: 8px; font-weight: 600; font-size: 15px; cursor: pointer; transition: background 0.2s; font-family: inherit; }
                .print-btn:hover { background: #059669; }
                @media print { body { background: #fff; padding: 0; } .report-container { box-shadow: none; padding: 0; } .print-btn { display: none; } }
              </style>
            </head>
            <body>
              <div class="report-container">
                <div class="header">
                  <h1>Personal Finance Report</h1>
                  <p>Transactions for ${now.toLocaleString('default', { month: 'long' })} ${now.getFullYear()}</p>
                </div>
                ${tableHtml}
                <button class="print-btn" onclick="window.print()">🖨️ Print / Save as PDF</button>
              </div>
            </body>
          </html>
        `);
        newWin.document.close();
      } else {
        alert('Report generated! Please allow popups to see it.');
      }
    } catch {
      alert('Server error');
    }
  };

  const handleAddTransaction = async () => {
    setMessage('');
    try {
      const url = editId ? `${process.env.REACT_APP_BACKEND_URL}/api/transactions/edit/${editId}` : `${process.env.REACT_APP_BACKEND_URL}/api/transactions/add`;
      const res = await fetch(url, { method: editId ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ title, amount: Number(amount), type, category, paymentMethod, notes }) });
      const data = await res.json();
      if (!res.ok) { setMessage('error:' + (data.message || 'Error')); }
      else { setMessage('success:' + (editId ? 'Updated!' : 'Added!')); setTitle(''); setAmount(''); setCategory(''); setType('income'); setPaymentMethod('Cash'); setNotes(''); setEditId(null); fetchTransactions(); setTimeout(() => setMessage(''), 3000); }
    } catch (err) { setMessage('error:' + err.message); }
  };

  const handleEdit = (t) => { setEditId(t._id); setTitle(t.title); setAmount(t.amount); setType(t.type); setCategory(t.category); setPaymentMethod(t.paymentMethod || 'Cash'); setNotes(t.notes || ''); setActiveTab('transactions'); window.scrollTo(0, 0); };
  
  const handleDelete = async (id) => { 
    // Removed window.confirm() because some browsers silently block popups and break the delete button!
    try { 
      setMessage('success:Deleting...');
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/transactions/delete/${id}`, { 
        method: 'DELETE', 
        headers: { 'Authorization': `Bearer ${token}` } 
      }); 
      if (res.ok) {
        setMessage('success:Transaction deleted successfully!');
        fetchTransactions();
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('error:Failed to delete transaction.');
      }
    } catch (e) { 
      setMessage('error:Server error while deleting.');
    } 
  };
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const totalIncome  = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const balance = totalIncome - totalExpense;
  const expenseByCategory = transactions.filter(t => t.type === 'expense').reduce((acc, t) => { acc[t.category] = (acc[t.category] || 0) + t.amount; return acc; }, {});
  const topCategory = Object.keys(expenseByCategory).sort((a, b) => expenseByCategory[b] - expenseByCategory[a])[0] || null;
  const paymentCount = transactions.filter(t => t.type === 'expense').reduce((acc, t) => { acc[t.paymentMethod] = (acc[t.paymentMethod] || 0) + 1; return acc; }, {});
  const topPayments = Object.keys(paymentCount).sort((a, b) => paymentCount[b] - paymentCount[a]).slice(0, 3);
  const categories = [...new Set(transactions.map(t => t.category).filter(Boolean))];
  const filteredTransactions = transactions.filter(t => {
    const q = searchQuery.toLowerCase();
    return (t.title?.toLowerCase().includes(q) || t.category?.toLowerCase().includes(q))
      && (filterCategory ? t.category === filterCategory : true)
      && (filterPayment ? t.paymentMethod === filterPayment : true)
      && (filterType ? t.type === filterType : true);
  });
  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '⊞' },
    { id: 'transactions', label: 'Transactions', icon: '↕' },
    { id: 'budget', label: 'Budget', icon: '◎' },
    { id: 'charts', label: 'Charts', icon: '◈' },
    { id: 'insights', label: 'AI Insights', icon: '✦' },
  ];
  const msgIsError = message.startsWith('error:');
  const msgText = message.replace(/^(error:|success:)/, '');
  const catIcon = (cat) => ({ Food:'🍔',Rent:'🏠',Travel:'✈️',Shopping:'🛍️',Healthcare:'💊',Entertainment:'🎬',Education:'📚',Utilities:'💡',Gym:'💪' })[cat] || '📦';

  return (
    <>
      <style>{css}</style>
      <div className="db-root">
        <div className="db-sidebar">
          <div className="db-logo">
            <div className="db-logo-mark">💰</div>
            <div>
              <div className="db-logo-name">FinanceTracker</div>
              <div className="db-logo-sub">Personal Finance Pro</div>
            </div>
          </div>
          <div className="db-nav">
            <div className="db-nav-label">Menu</div>
            {navItems.map(item => (
              <div key={item.id} className={`db-nav-item ${activeTab === item.id ? 'active' : ''}`} onClick={() => setActiveTab(item.id)}>
                <span className="db-nav-icon">{item.icon}</span>{item.label}
              </div>
            ))}
            <div className="db-nav-label" style={{ marginTop: 14 }}>Reports</div>
            <div className="db-nav-item" onClick={generateReport}>
              <span className="db-nav-icon">📊</span>Generate Report
            </div>
          </div>
          <div className="db-user">
            <div className="db-avatar">{initials}</div>
            <div>
              <div className="db-user-name">{user?.name}</div>
              <div className="db-user-plan">Personal Plan</div>
            </div>
          </div>
        </div>

        <div className="db-main">
          <div className="db-topbar">
            <div>
              <div className="db-topbar-title">{navItems.find(n => n.id === activeTab)?.label || 'Dashboard'}</div>
              <div className="db-topbar-date">{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>
            <div className="db-topbar-right">
              <span className="db-welcome">Welcome back, {user?.name?.split(' ')[0]} 👋</span>
              <button className="db-logout-btn" onClick={handleLogout}>Logout</button>
            </div>
          </div>

          <div className="db-content">
            {activeTab === 'dashboard' && (
              <>
                <div className="db-stat-grid">
                  {[
                    { label: 'Total Income',  icon: '💹', value: `₹${totalIncome.toLocaleString()}`,  sub: 'All time', color: '#10b981' },
                    { label: 'Total Expense', icon: '💸', value: `₹${totalExpense.toLocaleString()}`, sub: 'All time', color: '#ef4444' },
                    { label: 'Net Balance',   icon: '🏦', value: `₹${balance.toLocaleString()}`,      sub: balance >= 0 ? 'Positive' : 'Negative', color: balance >= 0 ? '#2563eb' : '#ef4444' },
                    { label: 'Transactions',  icon: '🔄', value: transactions.length,                  sub: 'Total records', color: '#f59e0b' },
                  ].map((s, i) => (
                    <div key={i} className="db-stat-card" style={{ borderTopColor: s.color }}>
                      <div className="db-stat-label">{s.label}</div>
                      <div className="db-stat-icon">{s.icon}</div>
                      <div className="db-stat-value" style={{ color: s.color }}>{s.value}</div>
                      <div className="db-stat-sub">{s.sub}</div>
                    </div>
                  ))}
                </div>
                <div className="db-two-col">
                  <div className="db-card">
                    <div className="db-card-title">Top Expense Category</div>
                    {topCategory ? (
                      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                        <div style={{ width:44,height:44,borderRadius:12,background:'#eff6ff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22 }}>{catIcon(topCategory)}</div>
                        <div>
                          <div style={{ fontSize:17,fontWeight:700,color:'#0f172a' }}>{topCategory}</div>
                          <div style={{ fontSize:12,color:'#94a3b8' }}>₹{(expenseByCategory[topCategory]||0).toLocaleString()} spent</div>
                        </div>
                      </div>
                    ) : <div className="db-empty">No expense data yet</div>}
                  </div>
                  <div className="db-card">
                    <div className="db-card-title">Top Payment Methods</div>
                    <div style={{ display:'flex',gap:8,flexWrap:'wrap' }}>
                      {topPayments.length > 0 ? topPayments.map((p,i) => (
                        <span key={i} className="db-payment-badge">
                          {p==='UPI'?'📱':p==='Cash'?'💵':p==='Credit Card'?'💳':'🏧'} {p}
                          <span style={{ background:'#2563eb',color:'#fff',borderRadius:'20px',padding:'1px 7px',fontSize:10,fontWeight:700,marginLeft:2 }}>×{paymentCount[p]}</span>
                        </span>
                      )) : <span style={{ color:'#94a3b8',fontSize:13 }}>No payment data yet</span>}
                    </div>
                  </div>
                </div>
                <div className="db-card">
                  <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16 }}>
                    <div className="db-card-title" style={{ margin:0,flex:1 }}>Recent Transactions</div>
                    <button className="db-view-all" onClick={() => setActiveTab('transactions')}>View All →</button>
                  </div>
                  {transactions.length === 0 ? <div className="db-empty">No transactions yet!</div>
                  : transactions.slice(0,5).map(t => (
                    <div key={t._id} className="db-txn-row">
                      <div className="db-txn-icon" style={{ background:t.type==='income'?'#f0fdf4':'#fff7ed' }}>{t.type==='income'?'💰':'💸'}</div>
                      <div style={{ flex:1 }}>
                        <div className="db-txn-title">{t.title}</div>
                        <div className="db-txn-meta">{t.category} · {t.paymentMethod} · {new Date(t.date).toLocaleDateString('en-IN')}</div>
                      </div>
                      <div className="db-txn-amount" style={{ color:t.type==='income'?'#10b981':'#ef4444' }}>{t.type==='income'?'+':'-'}₹{t.amount.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {activeTab === 'transactions' && (
              <>
                <div className="db-card">
                  <div className="db-card-title">{editId ? 'Edit Transaction' : 'Add New Transaction'}</div>
                  {message && <div className={`db-msg ${msgIsError?'db-msg-error':'db-msg-success'}`}>{msgIsError?'⚠️':'✅'} {msgText}</div>}
                  <div className="db-form-grid">
                    <input className="db-input" placeholder="Transaction title" value={title} onChange={e => setTitle(e.target.value)} />
                    <input className="db-input" type="number" placeholder="Amount (₹)" value={amount} onChange={e => setAmount(e.target.value)} />
                    <select className="db-select" value={type} onChange={e => setType(e.target.value)}>
                      <option value="income">💰 Income</option><option value="expense">💸 Expense</option>
                    </select>
                    <input className="db-input" placeholder="Category (Food, Rent...)" value={category} onChange={e => setCategory(e.target.value)} />
                    <select className="db-select" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
                      <option value="Cash">💵 Cash</option><option value="UPI">📱 UPI</option>
                      <option value="Credit Card">💳 Credit Card</option><option value="Debit Card">🏧 Debit Card</option>
                      <option value="Net Banking">🏦 Net Banking</option>
                    </select>
                    <input className="db-input" placeholder="Notes (optional)" value={notes} onChange={e => setNotes(e.target.value)} />
                  </div>
                  <div style={{ display:'flex',gap:10,marginTop:14 }}>
                    <button className="db-btn-primary" style={{ flex:1 }} onClick={handleAddTransaction}>{editId?'✏️ Update':'+ Add Transaction'}</button>
                    {editId && <button className="db-btn-danger" onClick={() => { setEditId(null);setTitle('');setAmount('');setCategory('');setType('income');setPaymentMethod('Cash');setNotes(''); }}>Cancel</button>}
                  </div>
                </div>
                <div className="db-card">
                  <div className="db-card-title">Transaction History ({filteredTransactions.length})</div>
                  <div className="db-filters">
                    <input className="db-input" placeholder="🔍 Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                    <select className="db-select" value={filterType} onChange={e => setFilterType(e.target.value)}><option value="">All Types</option><option value="income">Income</option><option value="expense">Expense</option></select>
                    <select className="db-select" value={filterCategory} onChange={e => setFilterCategory(e.target.value)}><option value="">All Categories</option>{categories.map(c=><option key={c} value={c}>{c}</option>)}</select>
                    <select className="db-select" value={filterPayment} onChange={e => setFilterPayment(e.target.value)}><option value="">All Payments</option><option value="Cash">Cash</option><option value="UPI">UPI</option><option value="Credit Card">Credit Card</option><option value="Debit Card">Debit Card</option><option value="Net Banking">Net Banking</option></select>
                    <button className="db-filter-clear" onClick={() => { setSearchQuery('');setFilterCategory('');setFilterPayment('');setFilterType(''); }}>Clear</button>
                  </div>
                  {filteredTransactions.length === 0 ? <div className="db-empty">No transactions found</div>
                  : filteredTransactions.map(t => (
                    <div key={t._id} className="db-txn-row">
                      <div style={{ width:4,height:38,borderRadius:3,background:t.type==='income'?'#10b981':'#ef4444',flexShrink:0 }} />
                      <div className="db-txn-icon" style={{ background:t.type==='income'?'#f0fdf4':'#fff7ed' }}>{t.type==='income'?'💰':'💸'}</div>
                      <div style={{ flex:1 }}>
                        <div className="db-txn-title">{t.title}</div>
                        <div className="db-txn-meta">{t.category} · {t.paymentMethod} · {new Date(t.date).toLocaleDateString('en-IN')}{t.notes && ` · ${t.notes}`}</div>
                      </div>
                      <div className="db-txn-amount" style={{ color:t.type==='income'?'#10b981':'#ef4444',marginRight:8 }}>{t.type==='income'?'+':'-'}₹{t.amount.toLocaleString()}</div>
                      <div className="db-txn-btns">
                        <button className="db-btn-ghost" style={{ color:'#2563eb',borderColor:'#bfdbfe' }} onClick={() => handleEdit(t)}>Edit</button>
                        <button className="db-btn-ghost" style={{ color:'#ef4444',borderColor:'#fecaca' }} onClick={() => handleDelete(t._id)}>Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {activeTab === 'budget' && <Budget transactions={transactions} />}
            {activeTab === 'charts' && <Charts transactions={transactions} />}

            {activeTab === 'insights' && (
              <div className="db-card">
                <div className="db-insight-header">
                  <div className="db-card-title" style={{ margin:0,flex:1 }}>AI Financial Insights</div>
                  <div style={{ display:'flex',alignItems:'center',gap:10 }}>
                    {insights.length > 0 && <span className="db-insight-count">{insights.length} insights</span>}
                    <button className="db-refresh-btn" disabled={insightLoading} onClick={() => fetchInsights(transactions)}>
                      {insightLoading ? '⏳ Analyzing...' : '🔄 Refresh'}
                    </button>
                  </div>
                </div>
                {insightLoading ? (
                  <div style={{ textAlign:'center',padding:'40px 0' }}>
                    <div className="db-loading-wave"><div className="db-dot"/><div className="db-dot"/><div className="db-dot"/></div>
                    <div style={{ color:'#94a3b8',fontSize:13,marginTop:8 }}>Analyzing your spending patterns...</div>
                  </div>
                ) : insights.length === 0 ? (
                  <div className="db-empty" style={{ padding:'48px 0' }}>
                    <div style={{ fontSize:38,marginBottom:12 }}>🤖</div>
                    <div style={{ fontSize:14,color:'#94a3b8' }}>No insights yet</div>
                    <div style={{ fontSize:12,color:'#bfcce0',marginTop:6 }}>Add transactions to get AI suggestions</div>
                  </div>
                ) : insights.map((insight,i) => {
                  const colors=['#2563eb','#10b981','#8b5cf6','#f59e0b','#ef4444','#06b6d4'];
                  const icons=['💡','📊','🎯','💰','📈','⚠️'];
                  return (
                    <div key={i} className="db-insight-card" style={{ borderLeftColor:colors[i%colors.length] }}>
                      <div className="db-insight-icon" style={{ background:`${colors[i%colors.length]}18` }}>{icons[i%icons.length]}</div>
                      <div>
                        <div className="db-insight-label" style={{ color:colors[i%colors.length] }}>Insight {i+1}</div>
                        <p className="db-insight-text">{insight}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
