import React, { useState } from 'react';
import { 
  Users as UsersIcon, 
  MessageSquare, 
  Layers, 
  AlertTriangle, 
  Megaphone, 
  Sliders, 
  ShieldCheck, 
  LogOut, 
  Search, 
  Check, 
  X,
  FileText,
  UserCheck,
  UserMinus
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function AdminDashboard() {
  const { 
    currentUser, 
    currentAdmin, 
    users, 
    chats, 
    messages, 
    reports, 
    announcements, 
    appSettings, 
    setAppSettings, 
    logoutAdmin,
    adminBlockUser,
    adminUnblockUser,
    adminDeleteUser,
    adminSendAnnouncement,
    showToast,
    navigate
  } = useApp();

  const [activeTab, setActiveTab] = useState('stats');
  const [userSearch, setUserSearch] = useState('');
  const [announcementText, setAnnouncementText] = useState('');

  // Protect Admin Dashboard
  if (!currentAdmin) {
    return (
      <div className="auth-container" style={{ background: '#0b141a', color: '#fff' }}>
        <div className="auth-card" style={{ border: '1px solid #222e35', background: '#111b21', textAlignment: 'center', textAlign: 'center' }}>
          <AlertTriangle size={48} color="var(--danger-color)" style={{ margin: '0 auto 16px auto' }} />
          <h2 style={{ fontWeight: 'bold', marginBottom: '8px' }}>Unauthorized Access</h2>
          <p style={{ color: '#8696a0', fontSize: '0.9rem', marginBottom: '24px' }}>Please log in to the admin terminal first.</p>
          <a href="#/admin-login" className="landing-btn" style={{ textDecoration: 'none' }}>Go to Admin Login</a>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const totalUsers = users.filter(u => u.role !== 'admin').length;
  const onlineUsersCount = users.filter(u => u.role !== 'admin' && u.online).length;
  const activeUsersCount = users.filter(u => u.role !== 'admin' && !u.blockedByAdmin).length;
  const totalChats = chats.length;
  const totalGroups = chats.filter(c => c.type === 'group').length;
  const totalMessages = messages.length;

  // Filter users based on query
  const filteredUsers = users.filter(u => 
    u.role !== 'admin' && 
    (u.name.toLowerCase().includes(userSearch.toLowerCase()) || 
     u.email.toLowerCase().includes(userSearch.toLowerCase()) || 
     u.mobile.includes(userSearch))
  );

  const handleBroadcast = (e) => {
    e.preventDefault();
    if (!announcementText.trim()) return;
    adminSendAnnouncement(announcementText);
    setAnnouncementText('');
  };

  const handleToggleSetting = (key) => {
    setAppSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    showToast("Application setting updated.");
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      
      {/* Sidebar Panel */}
      <div className="admin-sidebar">
        <div className="admin-sidebar-header">
          <ShieldCheck size={24} color="var(--wa-green)" />
          <span>TalkWave Admin</span>
        </div>

        <ul className="admin-menu-list">
          <li 
            className={`admin-menu-item ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            <Layers size={18} /> Overview Stats
          </li>
          <li 
            className={`admin-menu-item ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <UsersIcon size={18} /> User Records
          </li>
          <li 
            className={`admin-menu-item ${activeTab === 'chats' ? 'active' : ''}`}
            onClick={() => setActiveTab('chats')}
          >
            <MessageSquare size={18} /> Chat Logs Overview
          </li>
          <li 
            className={`admin-menu-item ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            <AlertTriangle size={18} /> Abuse Reports {reports.length > 0 && <span className="chat-item-badge" style={{ backgroundColor: 'var(--danger-color)', fontSize: '0.65rem', padding: '0 4px', height: '16px', minWidth: '16px', marginLeft: 'auto' }}>{reports.length}</span>}
          </li>
          <li 
            className={`admin-menu-item ${activeTab === 'announcements' ? 'active' : ''}`}
            onClick={() => setActiveTab('announcements')}
          >
            <Megaphone size={18} /> Broadcast notices
          </li>
          <li 
            className={`admin-menu-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <Sliders size={18} /> App Settings
          </li>
        </ul>

        {/* Admin Meta Profile */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid #222e35', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--wa-green)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>AD</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: '#fff', fontWeight: 'bold', fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentAdmin.name}</div>
            <div style={{ fontSize: '0.75rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>System Admin</div>
          </div>
          <button className="header-action-btn" title="End Session" onClick={logoutAdmin} style={{ color: 'var(--danger-color)' }}>
            <LogOut size={16} />
          </button>
        </div>
      </div>

      {/* Primary Dashboard Content Area */}
      <div className="admin-content-area">
        
        {/* Header bar */}
        <header className="admin-header">
          <div className="admin-page-title">
            {activeTab === 'stats' && "Dashboard Overview"}
            {activeTab === 'users' && "Registered User Records"}
            {activeTab === 'chats' && "Channels & Chats Overview"}
            {activeTab === 'reports' && "User-Submitted Abuse Reports"}
            {activeTab === 'announcements' && "Global Announcements Broadcast"}
            {activeTab === 'settings' && "System Configuration Settings"}
          </div>
          
          <button 
            className="landing-btn landing-btn-secondary" 
            onClick={() => navigate('#/app')}
            style={{ padding: '6px 12px', fontSize: '0.8rem' }}
          >
            Go to User Chat
          </button>
        </header>

        {/* Dashboard Body */}
        <main className="admin-body">
          
          {/* Stats cards overview tab */}
          {activeTab === 'stats' && (
            <div>
              <div className="admin-stats-grid">
                <div className="admin-stat-card">
                  <div className="stat-card-icon"><UsersIcon size={24} /></div>
                  <div className="stat-card-info">
                    <h3>Total Users</h3>
                    <p>{totalUsers}</p>
                  </div>
                </div>
                <div className="admin-stat-card">
                  <div className="stat-card-icon" style={{ backgroundColor: 'rgba(16,185,129,0.1)', color: 'var(--success-color)' }}><UserCheck size={24} /></div>
                  <div className="stat-card-info">
                    <h3>Online Users</h3>
                    <p>{onlineUsersCount}</p>
                  </div>
                </div>
                <div className="admin-stat-card">
                  <div className="stat-card-icon" style={{ backgroundColor: 'rgba(59,130,246,0.1)', color: 'var(--info-color)' }}><MessageSquare size={24} /></div>
                  <div className="stat-card-info">
                    <h3>Total Chats</h3>
                    <p>{totalChats}</p>
                  </div>
                </div>
                <div className="admin-stat-card">
                  <div className="stat-card-icon" style={{ backgroundColor: 'rgba(245,158,11,0.1)', color: 'var(--warning-color)' }}><Layers size={24} /></div>
                  <div className="stat-card-info">
                    <h3>Group Channels</h3>
                    <p>{totalGroups}</p>
                  </div>
                </div>
              </div>

              {/* Database Quick Summary Logs */}
              <div className="admin-table-container">
                <div style={{ padding: '16px 20px', fontWeight: 'bold', fontSize: '1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Quick system statistics</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Total Database messages: <strong>{totalMessages}</strong></span>
                </div>
                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-color)' }}>
                    <span>Active accounts in sandbox buffer:</span>
                    <strong>{activeUsersCount} users</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-color)' }}>
                    <span>Blocked users in database:</span>
                    <strong style={{ color: 'var(--danger-color)' }}>{totalUsers - activeUsersCount} accounts</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                    <span>Pending abuse logs:</span>
                    <strong style={{ color: 'var(--warning-color)' }}>{reports.filter(r => r.status === 'pending').length} reports</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* User Records Table tab */}
          {activeTab === 'users' && (
            <div>
              {/* Search Bar */}
              <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                <div className="sidebar-search-wrapper" style={{ flex: 1, backgroundColor: 'var(--bg-primary)', border: '1.5px solid var(--border-color)' }}>
                  <Search size={18} style={{ color: 'var(--text-secondary)' }} />
                  <input 
                    type="text" 
                    className="sidebar-search-input" 
                    placeholder="Search users by name, email or phone..." 
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                  />
                </div>
              </div>

              {/* Users table */}
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>User Details</th>
                      <th>Email Address</th>
                      <th>Phone Number</th>
                      <th>Account Status</th>
                      <th>Online Activity</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan="6" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-secondary)' }}>No registered users found.</td>
                      </tr>
                    ) : (
                      filteredUsers.map(user => (
                        <tr key={user.id}>
                          <td>
                            <div className="admin-user-row">
                              {user.photo ? (
                                <img src={user.photo} alt={user.name} className="admin-user-avatar" />
                              ) : (
                                <div className="admin-user-avatar" style={{ background: 'var(--wa-green-dark)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.8rem' }}>
                                  {user.name.substring(0, 2).toUpperCase()}
                                </div>
                              )}
                              <div>
                                <div style={{ fontWeight: 'bold' }}>{user.name}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Status: {user.about || 'No status'}</div>
                              </div>
                            </div>
                          </td>
                          <td>{user.email}</td>
                          <td>{user.mobile}</td>
                          <td>
                            {user.blockedByAdmin ? (
                              <span className="admin-badge danger">Suspended</span>
                            ) : (
                              <span className="admin-badge success">Active</span>
                            )}
                          </td>
                          <td>
                            {user.online ? (
                              <span className="admin-badge success">Online</span>
                            ) : (
                              <span className="admin-badge warning">{user.lastSeen || 'Offline'}</span>
                            )}
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              {user.blockedByAdmin ? (
                                <button 
                                  onClick={() => adminUnblockUser(user.id)}
                                  className="landing-btn"
                                  style={{ padding: '4px 8px', fontSize: '0.75rem', backgroundColor: 'var(--success-color)' }}
                                >
                                  Activate
                                </button>
                              ) : (
                                <button 
                                  onClick={() => adminBlockUser(user.id)}
                                  className="landing-btn"
                                  style={{ padding: '4px 8px', fontSize: '0.75rem', backgroundColor: 'var(--danger-color)' }}
                                >
                                  Suspend
                                </button>
                              )}
                              <button 
                                onClick={() => { if(window.confirm(`Delete ${user.name}? This removes their profile.`)) adminDeleteUser(user.id); }}
                                className="landing-btn landing-btn-secondary"
                                style={{ padding: '4px 8px', fontSize: '0.75rem', borderColor: 'var(--danger-color)', color: 'var(--danger-color)' }}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Chats table tab */}
          {activeTab === 'chats' && (
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Chat Details</th>
                    <th>Type</th>
                    <th>Participants Count</th>
                    <th>Last active message preview</th>
                  </tr>
                </thead>
                <tbody>
                  {chats.length === 0 ? (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-secondary)' }}>No active chat channels.</td>
                    </tr>
                  ) : (
                    chats.map(chat => {
                      let displayName = chat.name || 'Group Chat';
                      if (chat.type === 'direct') {
                        const directUsers = chat.members.map(mId => users.find(u => u.id === mId)?.name || 'Deleted User');
                        displayName = `Direct chat: ${directUsers.join(' & ')}`;
                      }
                      
                      return (
                        <tr key={chat.id}>
                          <td style={{ fontWeight: 'bold' }}>{displayName}</td>
                          <td>
                            <span className={`admin-badge ${chat.type === 'group' ? 'info' : 'success'}`}>
                              {chat.type.toUpperCase()}
                            </span>
                          </td>
                          <td>{chat.members.length} members</td>
                          <td>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {chat.lastMessage}
                            </div>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                              {chat.lastMessageTime ? new Date(chat.lastMessageTime).toLocaleString() : ''}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Abuse Reports tab */}
          {activeTab === 'reports' && (
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Reporting User</th>
                    <th>Offending User</th>
                    <th>Reason / Accusation</th>
                    <th>Timestamp</th>
                    <th>Operations</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-secondary)' }}>No reports submitted.</td>
                    </tr>
                  ) : (
                    reports.map(rep => {
                      const offender = users.find(u => u.id === rep.reportedId);
                      const isOffenderSuspended = offender?.blockedByAdmin;
                      
                      return (
                        <tr key={rep.id}>
                          <td style={{ fontWeight: '600' }}>{rep.reporterName} (ID: {rep.reporterId})</td>
                          <td style={{ fontWeight: '600', color: 'var(--danger-color)' }}>
                            {rep.reportedName} (ID: {rep.reportedId})
                          </td>
                          <td>
                            <div style={{ background: 'var(--bg-secondary)', padding: '6px 10px', borderRadius: '6px', fontSize: '0.85rem' }}>
                              {rep.reason}
                            </div>
                          </td>
                          <td>{new Date(rep.timestamp).toLocaleString()}</td>
                          <td>
                            {isOffenderSuspended ? (
                              <span className="admin-badge danger">Suspended</span>
                            ) : (
                              <button 
                                onClick={() => adminBlockUser(rep.reportedId)}
                                className="landing-btn"
                                style={{ padding: '4px 8px', fontSize: '0.75rem', backgroundColor: 'var(--danger-color)' }}
                              >
                                Suspend Account
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Announcements tab */}
          {activeTab === 'announcements' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              
              {/* Send pane */}
              <div style={{ background: 'var(--bg-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', height: 'fit-content' }}>
                <h3 style={{ fontWeight: 'bold', marginBottom: '16px', fontSize: '1rem' }}>Broadcast New Notice</h3>
                <form onSubmit={handleBroadcast}>
                  <div className="form-group" style={{ marginBottom: '20px' }}>
                    <label className="form-label">Announcement Text</label>
                    <textarea 
                      className="form-input" 
                      rows="5"
                      placeholder="Type a notice to broadcast to all conversation threads..." 
                      value={announcementText}
                      onChange={(e) => setAnnouncementText(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="landing-btn" style={{ width: '100%', padding: '10px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <Megaphone size={16} /> Broadcast to Network
                  </button>
                </form>
              </div>

              {/* Past announcements list */}
              <div style={{ background: 'var(--bg-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', maxHeight: '450px', overflowY: 'auto' }}>
                <h3 style={{ fontWeight: 'bold', marginBottom: '16px', fontSize: '1rem' }}>Broadcast History ({announcements.length})</h3>
                {announcements.length === 0 ? (
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textAlign: 'center', padding: '40px 0' }}>No broadcasts sent yet.</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {announcements.map(notice => (
                      <div 
                        key={notice.id} 
                        style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}
                      >
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                          Broadcasted: {new Date(notice.timestamp).toLocaleString()}
                        </div>
                        <div style={{ fontSize: '0.9rem', fontWeight: '500' }}>📢 {notice.text}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* System configurations tab */}
          {activeTab === 'settings' && (
            <div style={{ maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-primary)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div>
                  <h4 style={{ fontWeight: 'bold' }}>Allow Public Registrations</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Toggle if users can register new accounts</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={appSettings.allowRegistration}
                  onChange={() => handleToggleSetting('allowRegistration')}
                  style={{ width: '20px', height: '20px', accentColor: 'var(--wa-green)', cursor: 'pointer' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-primary)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div>
                  <h4 style={{ fontWeight: 'bold' }}>Allow Media Upload Sharing</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Allow upload attachment parameters (voice files, images, PDF)</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={appSettings.allowMediaUpload}
                  onChange={() => handleToggleSetting('allowMediaUpload')}
                  style={{ width: '20px', height: '20px', accentColor: 'var(--wa-green)', cursor: 'pointer' }}
                />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
