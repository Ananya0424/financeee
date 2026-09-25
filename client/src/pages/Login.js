import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password: password.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Login failed');
      } else {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Server error: ' + err.message);
    }
    setLoading(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .lg-root {
          min-height: 100vh; display: flex; align-items: center; justify-content: center;
          background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%);
          font-family: 'Outfit', sans-serif; padding: 20px;
        }
        .lg-card {
          background: rgba(255,255,255,0.97); border-radius: 20px;
          padding: 36px 32px; width: 100%; max-width: 380px;
          box-shadow: 0 25px 60px rgba(0,0,0,0.35);
        }
        .lg-brand { display: flex; align-items: center; gap: 10px; margin-bottom: 22px; }
        .lg-brand-icon {
          width: 38px; height: 38px; border-radius: 10px;
          background: linear-gradient(135deg,#3b82f6,#1d4ed8);
          display: flex; align-items: center; justify-content: center; font-size: 18px;
        }
        .lg-brand-name { font-size: 16px; font-weight: 700; color: #0f172a; }
        .lg-heading { font-size: 22px; font-weight: 800; color: #0f172a; margin-bottom: 4px; }
        .lg-sub { font-size: 13px; color: #64748b; margin-bottom: 20px; }
        .lg-err {
          padding: 9px 12px; border-radius: 8px; margin-bottom: 14px;
          background: #fef2f2; border: 1px solid #fecaca;
          font-size: 12px; color: #dc2626;
        }
        .lg-field { margin-bottom: 12px; }
        .lg-label { display: block; font-size: 11px; font-weight: 600; color: #64748b; margin-bottom: 5px; }
        .lg-wrap { position: relative; }
        .lg-input {
          width: 100%; padding: 10px 13px;
          background: #f8fafc; border: 1.5px solid #e2e8f0;
          border-radius: 10px; font-size: 13px; font-family: 'Outfit', sans-serif;
          color: #0f172a; outline: none;
          transition: border-color .2s, box-shadow .2s;
        }
        .lg-input::placeholder { color: #c0cce0; }
        .lg-input:focus { border-color: #3b82f6; background: #fff; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
        .lg-eye {
          position: absolute; right: 11px; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer; font-size: 13px; color: #94a3b8;
        }
        .lg-forgot-row { text-align: right; margin-bottom: 4px; }
        .lg-forgot { font-size: 11px; color: #3b82f6; cursor: pointer; }
        .lg-btn {
          width: 100%; padding: 12px; margin-top: 6px;
          background: linear-gradient(135deg,#3b82f6,#1d4ed8); border: none; border-radius: 25px;
          font-size: 13px; font-weight: 700; font-family: 'Outfit', sans-serif;
          color: #fff; cursor: pointer; box-shadow: 0 4px 15px rgba(59,130,246,0.4);
          transition: opacity .15s, transform .15s;
        }
        .lg-btn:hover:not(:disabled) { opacity: 0.92; transform: translateY(-1px); }
        .lg-btn:disabled { opacity: .6; cursor: not-allowed; }
        .lg-foot { text-align: center; font-size: 12px; color: #94a3b8; margin-top: 20px; }
        .lg-foot a { color: #3b82f6; font-weight: 600; cursor: pointer; text-decoration: none; }
        .lg-foot a:hover { text-decoration: underline; }
      `}</style>

      <div className="lg-root">
        <div className="lg-card">
          <div className="lg-brand">
            <div className="lg-brand-icon">💰</div>
            <div className="lg-brand-name">FinanceTracker</div>
          </div>
          <div className="lg-heading">Welcome back</div>
          <div className="lg-sub">Sign in to manage your finances</div>

          {error && <div className="lg-err">⚠️ {error}</div>}

          <form onSubmit={handleLogin}>
            <div className="lg-field">
              <label className="lg-label">Email</label>
              <input className="lg-input" type="email" placeholder="you@example.com"
                value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="lg-field">
              <label className="lg-label">Password</label>
              <div className="lg-wrap">
                <input className="lg-input" type={showPass ? 'text' : 'password'}
                  placeholder="Enter your password" style={{ paddingRight: 40 }}
                  value={password} onChange={e => setPassword(e.target.value)} required />
                <button type="button" className="lg-eye" onClick={() => setShowPass(!showPass)}>
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
            <div className="lg-forgot-row"><span className="lg-forgot">Forgot password?</span></div>
            <button className="lg-btn" type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="lg-foot">
            Don't have an account? <a onClick={() => navigate('/signup')}>Sign up free</a>
          </div>
        </div>
      </div>
    </>
  );
}
