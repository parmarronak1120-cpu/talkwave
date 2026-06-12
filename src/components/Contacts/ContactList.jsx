import React, { useState } from 'react';
import { UserPlus, Search, User, ShieldAlert, Ban, CheckCircle, MessageSquare } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function ContactList() {
  const { 
    users, 
    currentUser, 
    blockedUsers, 
    blockUser, 
    unblockUser, 
    reportUser, 
    addContact,
    chats,
    setActiveChatId,
    setSidebarTab,
    showToast
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newContactInput, setNewContactInput] = useState('');
  const [reportModalUser, setReportModalUser] = useState(null);
  const [reportReason, setReportReason] = useState('');

  // Filter contacts (excluding current user and admin)
  const contactsList = users.filter(u => 
    u.id !== currentUser?.id && 
    u.role !== 'admin' &&
    u.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStartChat = (user) => {
    // Check if direct chat already exists
    const existing = chats.find(c => c.type === 'direct' && c.members.includes(user.id));
    if (existing) {
      setActiveChatId(existing.id);
      setSidebarTab('chats');
    } else {
      // If not, add contact will automatically create direct chat
      addContact(user.email);
    }
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newContactInput) return;
    const success = addContact(newContactInput);
    if (success) {
      setNewContactInput('');
      setShowAddModal(false);
    }
  };

  const handleReportSubmit = (e) => {
    e.preventDefault();
    if (!reportReason || !reportModalUser) return;
    reportUser(reportModalUser.id, reportReason);
    setReportReason('');
    setReportModalUser(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Search Header */}
      <div className="sidebar-search-container">
        <div className="sidebar-search-wrapper">
          <Search size={18} style={{ color: 'var(--text-secondary)' }} />
          <input 
            type="text" 
            className="sidebar-search-input" 
            placeholder="Search contacts..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Floating Action Header inside list */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>Contact Directory</span>
        <button 
          onClick={() => setShowAddModal(true)}
          style={{ 
            background: 'var(--wa-green)', 
            color: '#fff', 
            border: 'none', 
            padding: '6px 12px', 
            borderRadius: '6px', 
            fontSize: '0.8rem', 
            fontWeight: '600', 
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <UserPlus size={14} /> Add Contact
        </button>
      </div>

      {/* Contacts Scroll list */}
      <div className="sidebar-list-container">
        {contactsList.length === 0 ? (
          <div className="empty-state">
            <User className="empty-state-icon" size={40} />
            <p>No contacts found matching search</p>
          </div>
        ) : (
          contactsList.map(user => {
            const isBlocked = blockedUsers.includes(user.id);
            return (
              <div 
                key={user.id} 
                className="chat-item" 
                style={{ borderBottom: '1px solid var(--border-color)', position: 'relative' }}
              >
                {/* Avatar */}
                <div style={{ position: 'relative' }}>
                  {user.photo ? (
                    <img src={user.photo} alt={user.name} className="chat-item-avatar" />
                  ) : (
                    <div className="chat-item-avatar" style={{ background: 'var(--wa-green-dark)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                      {user.name.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                  {user.online && !isBlocked && <div className="online-indicator"></div>}
                </div>

                {/* Content */}
                <div className="chat-item-content">
                  <div className="chat-item-header">
                    <span className="chat-item-name">{user.name}</span>
                    <span style={{ fontSize: '0.7rem', color: user.online && !isBlocked ? 'var(--wa-green)' : 'var(--text-secondary)', fontWeight: user.online ? '600' : 'normal' }}>
                      {isBlocked ? 'Blocked' : user.online ? 'Online' : user.lastSeen || 'Offline'}
                    </span>
                  </div>
                  
                  <div className="chat-item-body">
                    <span className="chat-item-preview">{user.about || 'Available'}</span>
                    
                    {/* Action buttons */}
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        onClick={() => handleStartChat(user)}
                        className="header-action-btn"
                        title="Chat"
                        style={{ color: 'var(--wa-green)' }}
                      >
                        <MessageSquare size={16} />
                      </button>

                      {isBlocked ? (
                        <button 
                          onClick={() => unblockUser(user.id)}
                          className="header-action-btn"
                          title="Unblock User"
                          style={{ color: 'var(--success-color)' }}
                        >
                          <CheckCircle size={16} />
                        </button>
                      ) : (
                        <button 
                          onClick={() => blockUser(user.id)}
                          className="header-action-btn"
                          title="Block User"
                          style={{ color: 'var(--danger-color)' }}
                        >
                          <Ban size={16} />
                        </button>
                      )}

                      <button 
                        onClick={() => setReportModalUser(user)}
                        className="header-action-btn"
                        title="Report User"
                        style={{ color: 'var(--warning-color)' }}
                      >
                        <ShieldAlert size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Contact Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Add New Contact</h3>
              <button className="modal-close-btn" onClick={() => setShowAddModal(false)}>✕</button>
            </div>
            <form onSubmit={handleAddSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Email or Phone Number</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="john@talkwave.com or +1 555-0199" 
                    value={newContactInput}
                    onChange={(e) => setNewContactInput(e.target.value)}
                    required
                  />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginTop: '6px' }}>
                    Tip: Enter any mock user's email (e.g. <strong>john@talkwave.com</strong>, <strong>jane@talkwave.com</strong>, <strong>sarah@talkwave.com</strong>, or <strong>mike@talkwave.com</strong>) to immediately simulate chats!
                  </span>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="landing-btn landing-btn-secondary" style={{ padding: '8px 16px' }} onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="landing-btn" style={{ padding: '8px 16px' }}>
                  Add Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Report User Modal */}
      {reportModalUser && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Report User: {reportModalUser.name}</h3>
              <button className="modal-close-btn" onClick={() => setReportModalUser(null)}>✕</button>
            </div>
            <form onSubmit={handleReportSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Reason for reporting</label>
                  <textarea 
                    className="form-input" 
                    rows="4"
                    placeholder="Please specify why you are reporting this user (e.g. spam, abusive language, threat)..." 
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    style={{ resize: 'vertical' }}
                    required
                  />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginTop: '6px' }}>
                    Note: Submitting this report sends user logs to the admin database for dashboard monitoring.
                  </span>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="landing-btn landing-btn-secondary" style={{ padding: '8px 16px' }} onClick={() => setReportModalUser(null)}>
                  Cancel
                </button>
                <button type="submit" className="landing-btn" style={{ padding: '8px 16px', backgroundColor: 'var(--warning-color)' }}>
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
