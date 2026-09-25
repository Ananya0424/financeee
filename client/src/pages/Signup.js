import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), password: password.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Signup failed');
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
        .pg-root {
          min-height: 100vh; display: flex; align-items: center; justify-content: center;
          background: linear-gradient(135deg, #fdfbfb 0%, #e2ebf0 100%);
          font-family: 'Outfit', sans-serif; padding: 20px;
        }
        .pg-card { position: relative; z-index: 2; background: rgba(255,255,255,0.97); border-radius: 20px;
          padding: 36px 32px; width: 100%; max-width: 380px;
          box-shadow: 0 25px 60px rgba(0,0,0,0.35);
        }
        .pg-brand { display: flex; align-items: center; gap: 10px; margin-bottom: 22px; }
        .pg-brand-icon {
          width: 38px; height: 38px; border-radius: 10px;
          background: linear-gradient(135deg,#3b82f6,#1d4ed8);
          display: flex; align-items: center; justify-content: center; font-size: 18px;
        }
        .pg-brand-name { font-size: 16px; font-weight: 700; color: #0f172a; }
        .pg-heading { font-size: 22px; font-weight: 800; color: #0f172a; margin-bottom: 4px; }
        .pg-sub { font-size: 13px; color: #64748b; margin-bottom: 20px; }
        .pg-err {
          padding: 9px 12px; border-radius: 8px; margin-bottom: 14px;
          background: #fef2f2; border: 1px solid #fecaca;
          font-size: 12px; color: #dc2626;
        }
        .pg-field { margin-bottom: 12px; }
        .pg-label { display: block; font-size: 11px; font-weight: 600; color: #64748b; margin-bottom: 5px; }
        .pg-wrap { position: relative; }
        .pg-input {
          width: 100%; padding: 10px 13px;
          background: #f8fafc; border: 1.5px solid #e2e8f0;
          border-radius: 10px; font-size: 13px; font-family: 'Outfit', sans-serif;
          color: #0f172a; outline: none;
          transition: border-color .2s, box-shadow .2s;
        }
        .pg-input::placeholder { color: #c0cce0; }
        .pg-input:focus { border-color: #3b82f6; background: #fff; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
        .pg-eye {
          position: absolute; right: 11px; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer; font-size: 13px; color: #94a3b8;
        }
        .pg-btn {
          width: 100%; padding: 12px; margin-top: 10px;
          background: linear-gradient(135deg,#3b82f6,#1d4ed8); border: none; border-radius: 25px;
          font-size: 13px; font-weight: 700; font-family: 'Outfit', sans-serif;
          color: #fff; cursor: pointer; box-shadow: 0 4px 15px rgba(59,130,246,0.4);
          transition: opacity .15s, transform .15s;
        }
        .pg-btn:hover:not(:disabled) { opacity: 0.92; transform: translateY(-1px); }
        .pg-btn:disabled { opacity: .6; cursor: not-allowed; }
        .pg-foot { text-align: center; font-size: 12px; color: #94a3b8; margin-top: 20px; }
        .pg-foot a { color: #3b82f6; font-weight: 600; cursor: pointer; text-decoration: none; }
        .pg-foot a:hover { text-decoration: underline; }
      `}
        .floating-icon {
          position: absolute;
          filter: drop-shadow(0 15px 20px rgba(0,0,0,0.15));
          animation: float 6s ease-in-out infinite;
          pointer-events: none;
          z-index: 1;
          opacity: 0.8;
        }
        .f-1 { top: 15%; left: 10%; animation-delay: 0s; font-size: 65px; }
        .f-2 { bottom: 20%; left: 15%; animation-delay: 2s; font-size: 55px; }
        .f-3 { top: 20%; right: 12%; animation-delay: 1.5s; font-size: 70px; }
        .f-4 { bottom: 25%; right: 18%; animation-delay: 3.5s; font-size: 60px; }
        .f-5 { top: 5%; right: 40%; animation-delay: 1s; font-size: 45px; }
        .f-6 { bottom: 8%; left: 40%; animation-delay: 2.5s; font-size: 50px; }
        
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-25px) rotate(10deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }

      </style>

      <div className="pg-root">

        <div className="floating-icon f-1">💰</div>
        <div className="floating-icon f-2">📈</div>
        <div className="floating-icon f-3">💳</div>
        <div className="floating-icon f-4">🏦</div>
        <div className="floating-icon f-5">💸</div>
        <div className="floating-icon f-6">🪙</div>

        <div className="pg-card">
          <div className="pg-brand">
            <div className="pg-brand-icon">💰</div>
            <div className="pg-brand-name">FinanceTracker</div>
          </div>
          <div className="pg-heading">Create Account</div>
          <div className="pg-sub">Join us to manage your expenses</div>

          {error && <div className="pg-err">⚠️ {error}</div>}

          <form onSubmit={handleSignup}>
            <div className="pg-field">
              <label className="pg-label">Full Name</label>
              <input className="pg-input" type="text" placeholder="John Doe"
                value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div className="pg-field">
              <label className="pg-label">Email</label>
              <input className="pg-input" type="email" placeholder="you@example.com"
                value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="pg-field">
              <label className="pg-label">Password</label>
              <div className="pg-wrap">
                <input className="pg-input" type={showPass ? 'text' : 'password'}
                  placeholder="Create a password" style={{ paddingRight: 40 }}
                  value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
                <button type="button" className="pg-eye" onClick={() => setShowPass(!showPass)}>
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
            <button className="pg-btn" type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Sign Up'}
            </button>
          </form>

          <div className="pg-foot">
            Already have an account? <a onClick={() => navigate('/login')}>Sign in</a>
          </div>
        </div>
      </div>
    </>
  );
}