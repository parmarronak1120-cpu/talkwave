import React, { useState } from 'react';
import { MessageSquareCode, Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function Login() {
  const { loginUser, navigate } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setIsLoading(true);
    setTimeout(() => {
      const success = loginUser(email, password);
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <button className="header-action-btn" onClick={() => navigate('#/')} style={{ marginBottom: '16px' }}>
          <ArrowLeft size={20} /> Back to Home
        </button>

        <div className="auth-header">
          <div className="auth-logo">
            <div style={{ width: '42px', height: '42px', backgroundColor: 'var(--wa-green)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <MessageSquareCode size={26} />
            </div>
            TalkWave
          </div>
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">Sign in to continue to your chats</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input 
                type="email" 
                className="form-input" 
                placeholder="you@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '40px' }}
                required 
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '8px' }}>
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input 
                type={showPassword ? "text" : "password"} 
                className="form-input" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '40px', paddingRight: '40px' }}
                required 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
            <a href="#/forgot-password" style={{ fontSize: '0.85rem', color: 'var(--wa-green)', textDecoration: 'none', fontWeight: '500' }}>
              Forgot password?
            </a>
          </div>

          <button 
            type="submit" 
            className="landing-btn" 
            style={{ width: '100%', padding: '12px', borderRadius: '8px', justifyContent: 'center' }}
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? <a href="#/register">Create one now</a>
        </div>
      </div>
    </div>
  );
}
