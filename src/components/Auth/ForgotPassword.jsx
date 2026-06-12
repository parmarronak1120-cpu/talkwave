import React, { useState } from 'react';
import { MessageSquareCode, Mail, ArrowLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function ForgotPassword() {
  const { navigate, showToast, apiForgotPassword } = useApp();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      showToast("Please enter an email address.", "error");
      return;
    }

    setIsLoading(true);
    const res = await apiForgotPassword(email);
    setIsLoading(false);

    if (res.success) {
      showToast(res.message || "OTP sent to your email. Please check inbox or spam folder.", "success");
      navigate('#/verify-otp');
    } else {
      showToast(res.error, "error");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <button className="header-action-btn" onClick={() => navigate('#/login')} style={{ marginBottom: '16px' }}>
          <ArrowLeft size={20} /> Back to Login
        </button>

        <div className="auth-header">
          <div className="auth-logo">
            <div style={{ width: '42px', height: '42px', backgroundColor: 'var(--wa-green)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <MessageSquareCode size={26} />
            </div>
            TalkWave
          </div>
          <h2 className="auth-title">Reset Password</h2>
          <p className="auth-subtitle">Enter your email to receive a 4-digit verification OTP code</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '24px' }}>
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

          <button 
            type="submit" 
            className="landing-btn" 
            style={{ width: '100%', padding: '12px', borderRadius: '8px', justifyContent: 'center' }}
            disabled={isLoading}
          >
            {isLoading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>

        <div className="auth-footer">
          Remembered your password? <a href="#/login">Sign in</a>
        </div>
      </div>
    </div>
  );
}

