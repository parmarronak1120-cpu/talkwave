import React, { useState, useEffect } from 'react';
import { useApp } from './context/AppContext';
import Splash from './components/Splash';
import LandingPage from './components/LandingPage';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ForgotPassword from './components/Auth/ForgotPassword';
import ResetPassword from './components/Auth/ResetPassword';
import VerifyOtp from './components/Auth/VerifyOtp';
import Sidebar from './components/Chat/Sidebar';
import ChatRoom from './components/Chat/ChatRoom';
import SettingsPanel from './components/Settings/SettingsPanel';
import AdminLogin from './components/Admin/AdminLogin';
import AdminDashboard from './components/Admin/AdminDashboard';
import { 
  MessageSquare, 
  Users, 
  Settings as SettingsIcon, 
  X, 
  AlertCircle, 
  CheckCircle2, 
  Info 
} from 'lucide-react';

export default function App() {
  const { 
    currentRoute, 
    currentUser, 
    toasts, 
    navigate, 
    sidebarTab, 
    setSidebarTab, 
    activeChatId,
    setActiveChatId,
    resetEmail,
    verificationToken
  } = useApp();

  const [showSplash, setShowSplash] = useState(true);

  // Parse tab parameter from hash path (e.g. #/app?tab=privacy)
  const getSubTab = () => {
    const parts = currentRoute.split('?');
    if (parts.length > 1) {
      const query = parts[1];
      const match = query.match(/tab=([^&]+)/);
      return match ? match[1] : null;
    }
    return null;
  };

  const activeSubTab = getSubTab();

  // Route guarding / protection
  useEffect(() => {
    // If user is trying to access user app but not logged in, redirect to login
    if (currentRoute.startsWith('#/app') && !currentUser) {
      navigate('#/login');
      return;
    }
    // If user is logged in and tries to access login/register/forgot password/verify otp/reset password, redirect to app
    if ((currentRoute === '#/login' || 
         currentRoute === '#/register' || 
         currentRoute === '#/forgot-password' || 
         currentRoute === '#/verify-otp' || 
         currentRoute.startsWith('#/reset-password')) && currentUser) {
      navigate('#/app');
      return;
    }
    // Protect OTP screen
    if (currentRoute === '#/verify-otp' && !resetEmail) {
      navigate('#/forgot-password');
      return;
    }
    // Protect Reset password screen
    if (currentRoute.startsWith('#/reset-password') && !verificationToken) {
      navigate('#/forgot-password');
      return;
    }
  }, [currentRoute, currentUser, resetEmail, verificationToken, navigate]);

  if (showSplash) {
    return <Splash onComplete={() => setShowSplash(false)} />;
  }

  // Toast icons mapping
  const renderToastIcon = (type) => {
    if (type === 'error') return <AlertCircle size={18} color="var(--danger-color)" />;
    if (type === 'warning') return <AlertCircle size={18} color="var(--warning-color)" />;
    if (type === 'info') return <Info size={18} color="var(--info-color)" />;
    return <CheckCircle2 size={18} color="var(--success-color)" />;
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Global Toast Notifications */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast ${toast.type || ''}`}>
            {renderToastIcon(toast.type)}
            <span>{toast.message}</span>
          </div>
        ))}
      </div>

      {/* Hash router rendering */}
      {currentRoute === '#/' && <LandingPage />}
      {currentRoute === '#/login' && <Login />}
      {currentRoute === '#/register' && <Register />}
      {currentRoute === '#/forgot-password' && <ForgotPassword />}
      {currentRoute === '#/verify-otp' && <VerifyOtp />}
      {currentRoute.startsWith('#/reset-password') && <ResetPassword />}
      {currentRoute === '#/admin-login' && <AdminLogin />}
      {currentRoute === '#/admin' && <AdminDashboard />}
      
      {currentRoute.startsWith('#/app') && currentUser && (
        <div className="app-container">
          {activeSubTab ? (
            /* Sub Tab (Settings detail) Viewport */
            <SettingsPanel 
              onBack={() => {
                // Return to settings sidebar list
                setSidebarTab('settings');
                navigate('#/app');
              }} 
            />
          ) : (
            /* Classic Side-by-Side Sidebar / Chat Feed layout */
            <>
              <Sidebar />
              <ChatRoom />

              {/* Mobile Bottom Navigation Bar (Visible only on mobile devices <= 768px) */}
              <nav className="mobile-bottom-nav">
                <div 
                  className={`mobile-nav-item ${sidebarTab === 'chats' ? 'active' : ''}`}
                  onClick={() => { setSidebarTab('chats'); setActiveChatId(null); }}
                >
                  <MessageSquare size={20} />
                  <span>Chats</span>
                </div>
                <div 
                  className={`mobile-nav-item ${sidebarTab === 'contacts' ? 'active' : ''}`}
                  onClick={() => { setSidebarTab('contacts'); setActiveChatId(null); }}
                >
                  <Users size={20} />
                  <span>Contacts</span>
                </div>
                <div 
                  className={`mobile-nav-item ${sidebarTab === 'groups' ? 'active' : ''}`}
                  onClick={() => { setSidebarTab('groups'); setActiveChatId(null); }}
                >
                  <Users size={20} style={{ opacity: 0.8 }} />
                  <span>Groups</span>
                </div>
                <div 
                  className={`mobile-nav-item ${sidebarTab === 'settings' ? 'active' : ''}`}
                  onClick={() => { setSidebarTab('settings'); setActiveChatId(null); }}
                >
                  <SettingsIcon size={20} />
                  <span>Settings</span>
                </div>
              </nav>
            </>
          )}
        </div>
      )}
    </div>
  );
}
