import React, { useState } from 'react';
import { MessageSquareCode, Lock, Key, ArrowLeft, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function ResetPassword() {
  const { apiResetPassword, resetEmail, verificationToken, navigate } = useApp();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!password) {
      setErrorMsg("Please enter a new password.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    const res = await apiResetPassword(password);
    setIsLoading(false);

    if (res.success) {
      // Redirect to login (apiResetPassword shows the success Toast)
      navigate('#/login');
    } else {
      setErrorMsg(res.error || "Failed to reset password. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <button className="header-action-btn" onClick={() => navigate('#/forgot-password')} style={{ marginBottom: '16px' }}>
          <ArrowLeft size={20} /> Back
        </button>

        <div className="auth-header">
          <div className="auth-logo">
            <div style={{ width: '42px', height: '42px', backgroundColor: 'var(--wa-green)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <MessageSquareCode size={26} />
            </div>
            TalkWave
          </div>
          <h2 className="auth-title">Reset Password</h2>
          <p className="auth-subtitle">
            Setup a new password for <strong style={{ color: 'var(--text-primary)' }}>{resetEmail}</strong>
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {errorMsg && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '6px', color: 'var(--danger-color)', fontSize: '0.85rem', marginBottom: '16px' }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label className="form-label">New Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input 
                type="password" 
                className="form-input" 
                placeholder="At least 6 characters" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '40px' }}
                required 
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label className="form-label">Confirm New Password</label>
            <div style={{ position: 'relative' }}>
              <Key size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input 
                type="password" 
                className="form-input" 
                placeholder="Verify password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
            {isLoading ? "Saving password..." : "Reset Password"}
          </button>
        </form>

        <div className="auth-footer">
          Remembered your password? <a href="#/login">Sign in</a>
        </div>
      </div>
    </div>
  );
}
