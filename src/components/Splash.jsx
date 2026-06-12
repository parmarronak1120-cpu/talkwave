import React, { useEffect, useState } from 'react';
import { MessageSquareCode, Lock } from 'lucide-react';

export default function Splash({ onComplete }) {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPercent((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            if (onComplete) onComplete();
          }, 300);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="splash-container">
      <div className="splash-logo-container">
        <div className="splash-logo">
          <div className="splash-logo-icon">
            <MessageSquareCode size={30} strokeWidth={2.5} />
          </div>
          <span>TalkWave</span>
        </div>
      </div>

      <div className="splash-progress-bar">
        <div 
          className="splash-progress-fill" 
          style={{ width: `${percent}%`, transition: 'width 0.15s ease' }} 
        />
      </div>

      <div className="splash-footer">
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}>
          <Lock size={12} /> End-to-end encrypted
        </span>
        <span style={{ fontSize: '0.75rem', opacity: 0.6, marginTop: '4px' }}>TalkWave Web & PWA v1.0</span>
      </div>
    </div>
  );
}
