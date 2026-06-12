import React, { useState, useEffect, useRef } from 'react';
import { MessageSquareCode, ShieldAlert, ArrowLeft, RotateCcw } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function VerifyOtp() {
  const { navigate, showToast, resetEmail, apiVerifyOtp, apiResendOtp } = useApp();
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timer, setTimer] = useState(60);

  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  // Timer countdown logic
  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer]);

  // Focus the first input box on load
  useEffect(() => {
    if (inputRefs[0].current) {
      inputRefs[0].current.focus();
    }
  }, []);

  const handleChange = (index, value) => {
    // Only allow numeric input
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // If character is entered, shift focus to next box
    if (value && index < 3) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace key to shift focus to previous box
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs[index - 1].current.focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').trim();
    if (!/^\d{4}$/.test(pasteData)) return;

    const digits = pasteData.split('');
    setOtp(digits);
    inputRefs[3].current.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length !== 4) {
      showToast("Please enter the complete 4-digit OTP.", "error");
      return;
    }

    setIsLoading(true);
    const res = await apiVerifyOtp(otpCode);
    setIsLoading(false);

    if (res.success) {
      showToast(res.message || "OTP verified. Set your new password.", "success");
      navigate('#/reset-password');
    } else {
      showToast(res.error, "error");
    }
  };

  const handleResend = async () => {
    if (timer > 0 || isResending) return;

    setIsResending(true);
    const res = await apiResendOtp();
    setIsResending(false);

    if (res.success) {
      showToast(res.message || "A new 4-digit OTP code was sent to your email.", "success");
      setTimer(60);
      setOtp(['', '', '', '']);
      if (inputRefs[0].current) {
        inputRefs[0].current.focus();
      }
    } else {
      showToast(res.error, "error");
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
          <h2 className="auth-title">Verify OTP</h2>
          <p className="auth-subtitle" style={{ fontSize: '0.85rem' }}>
            We've sent a 4-digit verification code to<br />
            <strong style={{ color: 'var(--text-primary)' }}>{resetEmail}</strong>
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', marginBottom: '28px' }}>
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                ref={inputRefs[index]}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                maxLength={1}
                inputMode="numeric"
                style={{
                  width: '56px',
                  height: '56px',
                  textAlign: 'center',
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  borderRadius: '12px',
                  border: '2px solid var(--border-color)',
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  outline: 'none',
                  transition: 'all 0.2s',
                }}
                className="otp-input-box"
                autoComplete="one-time-code"
              />
            ))}
          </div>

          <button 
            type="submit" 
            className="landing-btn" 
            style={{ width: '100%', padding: '12px', borderRadius: '8px', justifyContent: 'center', marginBottom: '16px' }}
            disabled={isLoading}
          >
            {isLoading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
          {timer > 0 ? (
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Resend OTP in <strong>{timer}</strong> seconds
            </span>
          ) : (
            <button
              onClick={handleResend}
              disabled={isResending}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--wa-green)',
                fontWeight: '600',
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 8px',
              }}
            >
              <RotateCcw size={14} /> Resend OTP Code
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
