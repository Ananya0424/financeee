import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';

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

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      setError('');
      try {
        const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const googleUser = await userInfo.json();
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/google-token`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: googleUser.email,
            name: googleUser.name,
            googleId: googleUser.sub,
            avatar: googleUser.picture,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.message || 'Google login failed');
        } else {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          navigate('/dashboard');
        }
      } catch (err) {
        setError('Google login failed: ' + err.message);
      }
      setLoading(false);
    },
    onError: () => setError('Google login was cancelled or failed'),
  });

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
        .lg-divider { display: flex; align-items: center; gap: 10px; margin: 16px 0; }
        .lg-divider::before, .lg-divider::after { content: ''; flex: 1; height: 1px; background: #e2e8f0; }
        .lg-divider span { font-size: 11px; color: #94a3b8; }
        .lg-social { display: flex; gap: 8px; }
        .lg-sbtn {
          flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px;
          padding: 9px; background: #fff; border: 1.5px solid #e2e8f0;
          border-radius: 25px; font-size: 12px; font-weight: 600; font-family: 'Outfit', sans-serif;
          color: #0f172a; cursor: pointer; transition: border-color .15s, background .15s;
        }
        .lg-sbtn:hover:not(:disabled) { border-color: #3b82f6; background: #f8fafc; }
        .lg-sbtn:disabled { opacity: 0.45; cursor: not-allowed; }
        .lg-foot { text-align: center; font-size: 12px; color: #94a3b8; margin-top: 16px; }
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

          <div className="lg-divider"><span>or continue with</span></div>
          <div className="lg-social">
            <button className="lg-sbtn" disabled title="Coming soon">🍎 Apple</button>
            <button className="lg-sbtn" onClick={() => googleLogin()} disabled={loading}>
              <svg width="14" height="14" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>
          </div>
          <div className="lg-foot">
            Don't have an account? <a onClick={() => navigate('/signup')}>Sign up free</a>
          </div>
        </div>
      </div>
    </>
  );
}
