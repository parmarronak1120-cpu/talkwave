import React, { useState } from 'react';
import { 
  MessageSquare, 
  Users, 
  Settings, 
  User, 
  LogOut, 
  Search, 
  MessageSquarePlus, 
  ShieldAlert, 
  Menu 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import CreateGroup from '../Groups/CreateGroup';
import ContactList from '../Contacts/ContactList';

export default function Sidebar() {
  const { 
    currentUser, 
    chats, 
    users, 
    messages, 
    activeChatId, 
    setActiveChatId, 
    logoutUser, 
    navigate,
    sidebarTab,
    setSidebarTab,
    isTypingState
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);

  // Filter chats based on tab and search
  const filteredChats = chats.filter(chat => {
    // Tab filtering
    if (sidebarTab === 'groups' && chat.type !== 'group') return false;
    if (sidebarTab === 'chats' && chat.type === 'group') return true; // show groups too in main chats like WhatsApp

    // Search query filtering
    if (chat.type === 'group') {
      return chat.name.toLowerCase().includes(searchQuery.toLowerCase());
    } else {
      // Direct chat: search by contact name
      const contactId = chat.members.find(m => m !== currentUser?.id);
      const contact = users.find(u => u.id === contactId);
      return contact?.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
  });

  // Calculate global unread count
  const totalUnread = chats.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

  const handleChatSelect = (chatId) => {
    setActiveChatId(chatId);
    
    // Clear unread count for this chat
    useApp().setChats(prev => prev.map(c => 
      c.id === chatId ? { ...c, unreadCount: 0 } : c
    ));
  };

  return (
    <div className={`app-sidebar ${activeChatId ? 'mobile-hidden' : ''}`}>
      {/* Top Header */}
      <div className="app-sidebar-header">
        <div 
          className="sidebar-avatar" 
          onClick={() => setSidebarTab('profile')}
          title="View Profile"
        >
          {currentUser?.photo ? (
            <img src={currentUser.photo} alt="My avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div className="sidebar-avatar-fallback">
              {currentUser?.name.substring(0, 2).toUpperCase()}
            </div>
          )}
        </div>

        <div className="sidebar-header-actions">
          <button 
            className="header-action-btn" 
            onClick={() => setIsGroupModalOpen(true)}
            title="Create Group"
          >
            <MessageSquarePlus size={20} />
          </button>
          
          <button 
            className="header-action-btn" 
            onClick={() => navigate('#/admin-login')}
            title="Admin Dashboard"
            style={{ color: 'var(--warning-color)' }}
          >
            <ShieldAlert size={20} />
          </button>

          <button 
            className="header-action-btn" 
            onClick={logoutUser}
            title="Logout"
            style={{ color: 'var(--danger-color)' }}
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="sidebar-tabs">
        <div 
          className={`sidebar-tab ${sidebarTab === 'chats' ? 'active' : ''}`}
          onClick={() => setSidebarTab('chats')}
        >
          Chats {totalUnread > 0 && <span className="chat-item-badge" style={{ display: 'inline-flex', marginLeft: '4px', verticalAlign: 'middle' }}>{totalUnread}</span>}
        </div>
        <div 
          className={`sidebar-tab ${sidebarTab === 'contacts' ? 'active' : ''}`}
          onClick={() => setSidebarTab('contacts')}
        >
          Contacts
        </div>
        <div 
          className={`sidebar-tab ${sidebarTab === 'groups' ? 'active' : ''}`}
          onClick={() => setSidebarTab('groups')}
        >
          Groups
        </div>
        <div 
          className={`sidebar-tab ${sidebarTab === 'settings' ? 'active' : ''}`}
          onClick={() => setSidebarTab('settings')}
        >
          Settings
        </div>
      </div>

      {/* Conditional Sidebar Content Rendering */}
      {sidebarTab === 'contacts' ? (
        <ContactList />
      ) : sidebarTab === 'settings' ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Handled by direct routing or subview in main screen */}
          <div style={{ padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <span style={{ fontWeight: '700', fontSize: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>Settings</span>
            <button className="landing-btn landing-btn-secondary" style={{ textAlign: 'left', padding: '12px' }} onClick={() => setSidebarTab('profile')}>
              ⚙️ Profile Settings
            </button>
            <button className="landing-btn landing-btn-secondary" style={{ textAlign: 'left', padding: '12px' }} onClick={() => navigate('#/app?tab=privacy')}>
              🔒 Privacy settings
            </button>
            <button className="landing-btn landing-btn-secondary" style={{ textAlign: 'left', padding: '12px' }} onClick={() => navigate('#/app?tab=notifications')}>
              🔔 Notification settings
            </button>
          </div>
        </div>
      ) : sidebarTab === 'profile' ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '16px' }}>
          <span style={{ fontWeight: '700', fontSize: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '16px' }}>My Profile</span>
          <button className="landing-btn landing-btn-secondary" style={{ marginBottom: '16px' }} onClick={() => setSidebarTab('chats')}>
            ← Back to Chats
          </button>
          {/* Profile form */}
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--wa-green-dark)', color: '#fff', margin: '0 auto 12px auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold' }}>
              {currentUser?.photo ? (
                <img src={currentUser.photo} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                currentUser?.name.substring(0, 2).toUpperCase()
              )}
            </div>
            <h3 style={{ fontWeight: 'bold' }}>{currentUser?.name}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{currentUser?.email}</p>
          </div>
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input className="form-input" value={currentUser?.mobile || ''} disabled />
          </div>
          <div className="form-group">
            <label className="form-label">About Status</label>
            <input className="form-input" value={currentUser?.about || ''} disabled />
          </div>
          <button className="landing-btn" style={{ width: '100%' }} onClick={() => navigate('#/app?tab=profile')}>
            Edit Profile details
          </button>
        </div>
      ) : (
        /* Chats list tab */
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
          {/* Search bar */}
          <div className="sidebar-search-container">
            <div className="sidebar-search-wrapper">
              <Search size={18} style={{ color: 'var(--text-secondary)' }} />
              <input 
                type="text" 
                className="sidebar-search-input" 
                placeholder="Search or start new chat..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* List Wrapper */}
          <div className="sidebar-list-container">
            {filteredChats.length === 0 ? (
              <div className="empty-state">
                <MessageSquare className="empty-state-icon" size={40} />
                <p>No active conversations found</p>
                <button 
                  onClick={() => setSidebarTab('contacts')}
                  style={{ background: 'var(--wa-green)', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', marginTop: '12px', cursor: 'pointer', fontSize: '0.85rem' }}
                >
                  View Contacts
                </button>
              </div>
            ) : (
              filteredChats.map(chat => {
                let name = chat.name;
                let avatar = chat.avatar;
                let isOnline = false;
                let subtext = chat.lastMessage;
                let timeText = chat.lastMessageTime 
                  ? new Date(chat.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                  : '';

                // If Direct Chat, lookup contact details
                if (chat.type === 'direct') {
                  const contactId = chat.members.find(m => m !== currentUser?.id);
                  const contact = users.find(u => u.id === contactId);
                  name = contact?.name || 'Unknown User';
                  avatar = contact?.photo || '';
                  isOnline = contact?.online || false;
                }

                // If currently typing
                const isTyping = isTypingState[chat.id];

                return (
                  <div 
                    key={chat.id} 
                    className={`chat-item ${activeChatId === chat.id ? 'active' : ''}`}
                    onClick={() => handleChatSelect(chat.id)}
                  >
                    {/* Avatar */}
                    <div style={{ position: 'relative' }}>
                      {avatar ? (
                        <img src={avatar} alt={name} className="chat-item-avatar" />
                      ) : (
                        <div className="chat-item-avatar" style={{ background: 'var(--wa-green-dark)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                          {name.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                      {isOnline && chat.type === 'direct' && <div className="online-indicator"></div>}
                    </div>

                    {/* Meta/Text */}
                    <div className="chat-item-content">
                      <div className="chat-item-header">
                        <span className="chat-item-name">{name}</span>
                        <span className="chat-item-time">{timeText}</span>
                      </div>

                      <div className="chat-item-body">
                        {isTyping ? (
                          <span style={{ color: 'var(--wa-green)', fontSize: '0.85rem', fontWeight: '600' }}>typing...</span>
                        ) : (
                          <span className={`chat-item-preview ${chat.unreadCount > 0 ? 'unread' : ''}`}>
                            {subtext}
                          </span>
                        )}
                        
                        {chat.unreadCount > 0 && (
                          <span className="chat-item-badge">{chat.unreadCount}</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Add Group Modal */}
      <CreateGroup 
        isOpen={isGroupModalOpen} 
        onClose={() => setIsGroupModalOpen(false)} 
      />
    </div>
  );
}
