import React, { useState } from 'react';
import { User, Shield, Bell, Key, Trash2, Camera, ArrowLeft, Ban, CheckCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function SettingsPanel({ onBack }) {
  const { 
    currentUser, 
    updateProfile, 
    deleteAccount, 
    blockedUsers, 
    users, 
    unblockUser,
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState('profile');

  // Profile fields state
  const [profileName, setProfileName] = useState(currentUser?.name || '');
  const [profileAbout, setProfileAbout] = useState(currentUser?.about || '');
  const [profilePhone, setProfilePhone] = useState(currentUser?.mobile || '');
  const [profilePhoto, setProfilePhoto] = useState(currentUser?.photo || '');

  // Privacy values state
  const [privacyLastSeen, setPrivacyLastSeen] = useState('Everyone');
  const [privacyOnline, setPrivacyOnline] = useState('Everyone');
  const [privacyPhoto, setPrivacyPhoto] = useState('Everyone');
  const [privacyAbout, setPrivacyAbout] = useState('Everyone');

  // Notification states
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [browserAlertsEnabled, setBrowserAlertsEnabled] = useState(false);

  // Security credentials state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    updateProfile({
      name: profileName,
      about: profileAbout,
      mobile: profilePhone,
      photo: profilePhoto
    });
  };

  const handlePrivacySubmit = (e) => {
    e.preventDefault();
    updateProfile({
      privacy: {
        lastSeen: privacyLastSeen,
        online: privacyOnline,
        photo: privacyPhoto,
        about: privacyAbout
      }
    });
    showToast("Privacy configurations updated successfully.");
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (currentUser.password !== oldPassword) {
      showToast("Incorrect current password.", "error");
      return;
    }
    if (newPassword.length < 6) {
      showToast("New password must be at least 6 characters.", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast("Passwords do not match.", "error");
      return;
    }
    updateProfile({ password: newPassword });
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    showToast("Password updated successfully.");
  };

  const handleDeleteTrigger = () => {
    if (window.confirm("WARNING: Are you sure you want to permanently delete your account? This action is irreversible and will erase all chats, groups, and contact lists.")) {
      deleteAccount();
    }
  };

  const requestBrowserNotification = async () => {
    if (!('Notification' in window)) {
      showToast("This browser does not support desktop notifications.", "error");
      return;
    }
    if (window.Notification.permission === 'granted') {
      setBrowserAlertsEnabled(true);
      showToast("Browser alerts enabled.");
    } else {
      const permission = await window.Notification.requestPermission();
      if (permission === 'granted') {
        setBrowserAlertsEnabled(true);
        showToast("Browser alerts enabled!");
      } else {
        showToast("Notification permission denied.", "error");
      }
    }
  };

  // Resolve blocked user profiles
  const blockedUserProfiles = users.filter(u => blockedUsers.includes(u.id));

  return (
    <div style={{ display: 'flex', flex: 1, backgroundColor: 'var(--bg-secondary)', height: '100%', overflow: 'hidden' }}>
      
      {/* Settings Navigation Menu */}
      <div 
        style={{ 
          width: '280px', 
          backgroundColor: 'var(--bg-primary)', 
          borderRight: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column'
        }}
        className="settings-menu-sidebar"
      >
        <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button className="header-action-btn" onClick={onBack} title="Back">
            <ArrowLeft size={20} />
          </button>
          <span style={{ fontWeight: '700', fontSize: '1.1rem' }}>Settings Panel</span>
        </div>

        <div style={{ flex: 1, padding: '12px 0' }}>
          <div 
            onClick={() => setActiveTab('profile')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '16px', padding: '12px 24px', cursor: 'pointer',
              backgroundColor: activeTab === 'profile' ? 'rgba(0,168,132,0.05)' : 'transparent',
              color: activeTab === 'profile' ? 'var(--wa-green)' : 'var(--text-primary)',
              fontWeight: activeTab === 'profile' ? '600' : 'normal',
              borderLeft: activeTab === 'profile' ? '4px solid var(--wa-green)' : '4px solid transparent'
            }}
          >
            <User size={18} /> My Profile
          </div>
          <div 
            onClick={() => setActiveTab('privacy')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '16px', padding: '12px 24px', cursor: 'pointer',
              backgroundColor: activeTab === 'privacy' ? 'rgba(0,168,132,0.05)' : 'transparent',
              color: activeTab === 'privacy' ? 'var(--wa-green)' : 'var(--text-primary)',
              fontWeight: activeTab === 'privacy' ? '600' : 'normal',
              borderLeft: activeTab === 'privacy' ? '4px solid var(--wa-green)' : '4px solid transparent'
            }}
          >
            <Shield size={18} /> Privacy Settings
          </div>
          <div 
            onClick={() => setActiveTab('notifications')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '16px', padding: '12px 24px', cursor: 'pointer',
              backgroundColor: activeTab === 'notifications' ? 'rgba(0,168,132,0.05)' : 'transparent',
              color: activeTab === 'notifications' ? 'var(--wa-green)' : 'var(--text-primary)',
              fontWeight: activeTab === 'notifications' ? '600' : 'normal',
              borderLeft: activeTab === 'notifications' ? '4px solid var(--wa-green)' : '4px solid transparent'
            }}
          >
            <Bell size={18} /> Notifications
          </div>
          <div 
            onClick={() => setActiveTab('account')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '16px', padding: '12px 24px', cursor: 'pointer',
              backgroundColor: activeTab === 'account' ? 'rgba(0,168,132,0.05)' : 'transparent',
              color: activeTab === 'account' ? 'var(--wa-green)' : 'var(--text-primary)',
              fontWeight: activeTab === 'account' ? '600' : 'normal',
              borderLeft: activeTab === 'account' ? '4px solid var(--wa-green)' : '4px solid transparent'
            }}
          >
            <Key size={18} /> Security & Account
          </div>
        </div>
      </div>

      {/* Settings Display Area */}
      <div style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
        
        {/* Profile Details Tab */}
        {activeTab === 'profile' && (
          <div style={{ maxWidth: '500px' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: '700', marginBottom: '24px' }}>Edit Profile Information</h2>
            
            <form onSubmit={handleProfileSubmit}>
              {/* Photo Upload */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '32px' }}>
                <div style={{ position: 'relative', width: '100px', height: '100px', borderRadius: '50%', overflow: 'hidden', background: 'var(--border-color)', border: '2px solid var(--wa-green)' }}>
                  {profilePhoto ? (
                    <img src={profilePhoto} alt="Profile preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--wa-green-dark)', color: '#fff', fontSize: '2.5rem', fontWeight: 'bold' }}>
                      {profileName.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer' }}>
                    <Camera size={20} />
                  </div>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handlePhotoUpload} 
                    style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0, cursor: 'pointer' }} 
                  />
                </div>
                <div>
                  <h4 style={{ fontWeight: 'bold' }}>Profile Photo</h4>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Accepts PNG, JPG or WEBP formats.</span>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={profileName} 
                  onChange={(e) => setProfileName(e.target.value)} 
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Mobile Phone Number</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={profilePhone} 
                  onChange={(e) => setProfilePhone(e.target.value)} 
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input 
                  type="email" 
                  className="form-input" 
                  value={currentUser?.email} 
                  disabled 
                  style={{ opacity: 0.6 }} 
                />
              </div>

              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label className="form-label">About / Status</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={profileAbout} 
                  onChange={(e) => setProfileAbout(e.target.value)} 
                />
              </div>

              <button type="submit" className="landing-btn" style={{ padding: '10px 24px' }}>
                Save Changes
              </button>
            </form>
          </div>
        )}

        {/* Privacy Settings Tab */}
        {activeTab === 'privacy' && (
          <div style={{ maxWidth: '500px' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: '700', marginBottom: '24px' }}>Privacy Regulations</h2>
            
            <form onSubmit={handlePrivacySubmit} style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '24px', marginBottom: '24px' }}>
              <div className="form-group">
                <label className="form-label">Who can see my Last Seen</label>
                <select className="form-input" value={privacyLastSeen} onChange={(e) => setPrivacyLastSeen(e.target.value)}>
                  <option value="Everyone">Everyone</option>
                  <option value="Contacts">My Contacts</option>
                  <option value="Nobody">Nobody</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Who can see when I am Online</label>
                <select className="form-input" value={privacyOnline} onChange={(e) => setPrivacyOnline(e.target.value)}>
                  <option value="Everyone">Everyone</option>
                  <option value="Same">Same as Last Seen</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Profile Photo Visibility</label>
                <select className="form-input" value={privacyPhoto} onChange={(e) => setPrivacyPhoto(e.target.value)}>
                  <option value="Everyone">Everyone</option>
                  <option value="Nobody">Nobody</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label className="form-label">About Status visibility</label>
                <select className="form-input" value={privacyAbout} onChange={(e) => setPrivacyAbout(e.target.value)}>
                  <option value="Everyone">Everyone</option>
                  <option value="Nobody">Nobody</option>
                </select>
              </div>

              <button type="submit" className="landing-btn" style={{ padding: '10px 24px' }}>
                Apply Privacy Settings
              </button>
            </form>

            {/* Blocked Users Sublist */}
            <div>
              <h3 style={{ fontWeight: 'bold', fontSize: '1rem', marginBottom: '12px' }}>Blocked Users List ({blockedUsers.length})</h3>
              <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '4px 0', backgroundColor: 'var(--bg-primary)' }}>
                {blockedUserProfiles.length === 0 ? (
                  <div style={{ padding: '16px', fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
                    No blocked users.
                  </div>
                ) : (
                  blockedUserProfiles.map(user => (
                    <div 
                      key={user.id} 
                      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', borderBottom: '1px solid var(--border-color)' }}
                    >
                      <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{user.name}</span>
                      <button 
                        onClick={() => unblockUser(user.id)}
                        style={{ border: 'none', background: 'none', color: 'var(--success-color)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: '600' }}
                      >
                        <CheckCircle size={14} /> Unblock
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div style={{ maxWidth: '500px' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: '700', marginBottom: '24px' }}>Notification Preferences</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-primary)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <div>
                  <h4 style={{ fontWeight: 'bold' }}>Notification Sounds</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Play alert sounds on incoming messages</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={soundEnabled} 
                  onChange={(e) => setSoundEnabled(e.target.checked)} 
                  style={{ width: '18px', height: '18px', accentColor: 'var(--wa-green)', cursor: 'pointer' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-primary)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <div>
                  <h4 style={{ fontWeight: 'bold' }}>Desktop Browser Notifications</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Receive notification banners when tab is inactive</p>
                </div>
                <button 
                  onClick={requestBrowserNotification} 
                  disabled={browserAlertsEnabled}
                  className={`landing-btn ${browserAlertsEnabled ? 'landing-btn-secondary' : ''}`}
                  style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                >
                  {browserAlertsEnabled ? "Enabled" : "Request"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Credentials and Account deletion tab */}
        {activeTab === 'account' && (
          <div style={{ maxWidth: '500px' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: '700', marginBottom: '24px' }}>Security & Account management</h2>
            
            <form onSubmit={handlePasswordSubmit} style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '24px', marginBottom: '24px' }}>
              <h3 style={{ fontWeight: 'bold', fontSize: '1rem', marginBottom: '16px' }}>Change Account Password</h3>
              
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <input 
                  type="password" 
                  className="form-input" 
                  value={oldPassword} 
                  onChange={(e) => setOldPassword(e.target.value)} 
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">New Password</label>
                <input 
                  type="password" 
                  className="form-input" 
                  value={newPassword} 
                  onChange={(e) => setNewPassword(e.target.value)} 
                  required 
                />
              </div>

              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label className="form-label">Confirm New Password</label>
                <input 
                  type="password" 
                  className="form-input" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  required 
                />
              </div>

              <button type="submit" className="landing-btn" style={{ padding: '10px 24px' }}>
                Update Password
              </button>
            </form>

            {/* Danger Zone */}
            <div style={{ padding: '20px', background: 'rgba(234, 0, 56, 0.05)', borderRadius: '12px', border: '1px solid rgba(234, 0, 56, 0.2)' }}>
              <h3 style={{ color: 'var(--danger-color)', fontWeight: 'bold', fontSize: '1rem', marginBottom: '8px' }}>Danger Zone</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                Deleting your account deletes all files, groups, messages, and configurations from our LocalStorage database.
              </p>
              <button 
                onClick={handleDeleteTrigger} 
                style={{ 
                  backgroundColor: 'var(--danger-color)', 
                  color: '#fff', 
                  border: 'none', 
                  padding: '10px 20px', 
                  borderRadius: '8px', 
                  fontWeight: '600', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Trash2 size={16} /> Delete My Account
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Small CSS responsive adjustments */}
      <style>{`
        @media (max-width: 768px) {
          .settings-menu-sidebar {
            width: 100% !important;
            border-right: none !important;
          }
          /* In mobile, hide display area unless tab is selected, or collapse */
        }
      `}</style>
    </div>
  );
}
