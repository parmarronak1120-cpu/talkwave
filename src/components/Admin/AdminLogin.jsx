import React, { useState } from 'react';
import { MessageSquareCode, Mail, Lock, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function AdminLogin() {
  const { loginAdmin, navigate } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    setTimeout(() => {
      const success = loginAdmin(email, password);
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="auth-container" style={{ background: '#0b141a' }}>
      <div className="auth-card" style={{ border: '1px solid #222e35', background: '#111b21' }}>
        <button 
          className="header-action-btn" 
          onClick={() => navigate('#/')} 
          style={{ marginBottom: '16px', color: '#8696a0' }}
        >
          <ArrowLeft size={20} /> Back to Landing Page
        </button>

        <div className="auth-header">
          <div className="auth-logo" style={{ color: 'var(--wa-green)' }}>
            <div style={{ width: '42px', height: '42px', backgroundColor: 'var(--wa-green)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <ShieldCheck size={26} />
            </div>
            TalkWave Control
          </div>
          <h2 className="auth-title" style={{ color: '#fff' }}>Admin Terminal</h2>
          <p className="auth-subtitle" style={{ color: '#8696a0' }}>Log in to monitor and manage user accounts</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" style={{ color: '#8696a0' }}>Admin Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#8696a0' }} />
              <input 
                type="email" 
                className="form-input" 
                placeholder="admin@talkwave.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '40px', background: '#202c33', border: '1px solid #222e35', color: '#fff' }}
                required 
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label className="form-label" style={{ color: '#8696a0' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#8696a0' }} />
              <input 
                type="password" 
                className="form-input" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '40px', background: '#202c33', border: '1px solid #222e35', color: '#fff' }}
                required 
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="landing-btn" 
            style={{ width: '100%', padding: '12px', borderRadius: '8px', justifyContent: 'center' }}
            disabled={isLoading}
          >
            {isLoading ? "Authenticating..." : "Access Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
}
