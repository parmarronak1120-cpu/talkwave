import React, { useState } from 'react';
import { Shield, UserMinus, UserPlus, X, LogOut, Save, Camera } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function GroupSettings({ isOpen, onClose, chat }) {
  const { 
    users, 
    currentUser, 
    updateGroupSettings, 
    leaveGroup, 
    showToast 
  } = useApp();

  const [groupName, setGroupName] = useState(chat?.name || '');
  const [groupDesc, setGroupDesc] = useState(chat?.description || '');
  const [groupPhoto, setGroupPhoto] = useState(chat?.avatar || '');
  const [showAddMembers, setShowAddMembers] = useState(false);

  if (!isOpen || !chat) return null;

  const isAdmin = chat.groupAdminIds.includes(currentUser?.id);

  // Group members profile lookup
  const memberProfiles = users.filter(u => chat.members.includes(u.id));

  // Contacts who are not currently in the group
  const nonMembers = users.filter(u => 
    u.id !== currentUser?.id && 
    u.role !== 'admin' && 
    !chat.members.includes(u.id)
  );

  const handlePhotoUpload = (e) => {
    if (!isAdmin) {
      showToast("Only group administrators can modify settings.", "error");
      return;
    }
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setGroupPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveInfo = (e) => {
    e.preventDefault();
    if (!isAdmin) {
      showToast("Only group administrators can modify settings.", "error");
      return;
    }
    updateGroupSettings(chat.id, {
      name: groupName,
      description: groupDesc,
      avatar: groupPhoto
    });
  };

  const handleAddMember = (userId) => {
    if (!isAdmin) {
      showToast("Only group administrators can add members.", "error");
      return;
    }
    const updatedMembers = [...chat.members, userId];
    updateGroupSettings(chat.id, {
      members: updatedMembers,
      lastMessage: `${currentUser.name} added a member.`
    });
  };

  const handleRemoveMember = (userId) => {
    if (!isAdmin) {
      showToast("Only group administrators can remove members.", "error");
      return;
    }
    const updatedMembers = chat.members.filter(m => m !== userId);
    // If we remove an admin, remove them from groupAdminIds too
    const updatedAdmins = chat.groupAdminIds.filter(a => a !== userId);
    updateGroupSettings(chat.id, {
      members: updatedMembers,
      groupAdminIds: updatedAdmins,
      lastMessage: `${currentUser.name} removed a member.`
    });
  };

  const handleMakeAdmin = (userId) => {
    if (!isAdmin) {
      showToast("Only group administrators can appoint admins.", "error");
      return;
    }
    if (chat.groupAdminIds.includes(userId)) return;
    const updatedAdmins = [...chat.groupAdminIds, userId];
    updateGroupSettings(chat.id, {
      groupAdminIds: updatedAdmins,
      lastMessage: `${currentUser.name} appointed a new admin.`
    });
  };

  const handleLeave = () => {
    if (window.confirm(`Are you sure you want to leave ${chat.name}?`)) {
      leaveGroup(chat.id);
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '500px' }}>
        <div className="modal-header">
          <h3 className="modal-title">Group Info & Settings</h3>
          <button className="modal-close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="modal-body">
          {/* Metadata Section */}
          <form onSubmit={handleSaveInfo} style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '20px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div 
                style={{ 
                  width: '64px', 
                  height: '64px', 
                  borderRadius: '50%', 
                  background: 'var(--bg-secondary)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  flexShrink: 0
                }}
              >
                {groupPhoto ? (
                  <img src={groupPhoto} alt="Group photo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontWeight: 'bold' }}>{chat.name.substring(0, 2).toUpperCase()}</span>
                )}
                {isAdmin && (
                  <>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                      <Camera size={16} />
                    </div>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handlePhotoUpload}
                      style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0, cursor: 'pointer' }}
                    />
                  </>
                )}
              </div>

              <div style={{ flex: 1 }}>
                <input 
                  type="text" 
                  className="form-input" 
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  disabled={!isAdmin}
                  placeholder="Group name"
                  style={{ marginBottom: '8px', fontWeight: 'bold' }}
                  required
                />
                <input 
                  type="text" 
                  className="form-input" 
                  value={groupDesc}
                  onChange={(e) => setGroupDesc(e.target.value)}
                  disabled={!isAdmin}
                  placeholder="Group description"
                  style={{ fontSize: '0.85rem' }}
                />
              </div>
            </div>
            
            {isAdmin && (
              <button 
                type="submit" 
                className="landing-btn" 
                style={{ marginTop: '12px', padding: '6px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px', marginLeft: 'auto' }}
              >
                <Save size={14} /> Save Group Info
              </button>
            )}
          </form>

          {/* Members list */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>Members ({chat.members.length})</span>
              {isAdmin && (
                <button 
                  onClick={() => setShowAddMembers(!showAddMembers)}
                  style={{ background: 'none', border: 'none', color: 'var(--wa-green)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <UserPlus size={14} /> Add Member
                </button>
              )}
            </div>

            {/* Add members sub-pane */}
            {showAddMembers && isAdmin && (
              <div 
                style={{ 
                  border: '1.5px solid var(--border-color)', 
                  borderRadius: '8px', 
                  padding: '8px', 
                  marginBottom: '16px',
                  maxHeight: '150px',
                  overflowY: 'auto' 
                }}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-secondary)', marginBottom: '8px' }}>Add Contacts to Group:</div>
                {nonMembers.length === 0 ? (
                  <div style={{ padding: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>All contacts are already in this group.</div>
                ) : (
                  nonMembers.map(user => (
                    <div 
                      key={user.id} 
                      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid var(--border-color)' }}
                    >
                      <span style={{ fontSize: '0.85rem' }}>{user.name}</span>
                      <button 
                        onClick={() => handleAddMember(user.id)}
                        style={{ border: 'none', background: 'var(--wa-green)', color: '#fff', borderRadius: '4px', padding: '2px 8px', fontSize: '0.75rem', cursor: 'pointer' }}
                      >
                        Add
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Render Members list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '200px', overflowY: 'auto' }}>
              {memberProfiles.map(user => {
                const isUserAdmin = chat.groupAdminIds.includes(user.id);
                const isMe = user.id === currentUser?.id;
                
                return (
                  <div key={user.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {user.photo ? (
                        <img src={user.photo} alt={user.name} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--wa-green-dark)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.8rem' }}>
                          {user.name.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <span style={{ fontSize: '0.9rem', fontWeight: isMe ? 'bold' : 'normal' }}>
                          {user.name} {isMe && ' (You)'}
                        </span>
                        {isUserAdmin && (
                          <span style={{ 
                            marginLeft: '8px', 
                            fontSize: '0.65rem', 
                            background: 'rgba(0, 168, 132, 0.1)', 
                            color: 'var(--wa-green)', 
                            padding: '2px 6px', 
                            borderRadius: '4px',
                            fontWeight: 'bold'
                          }}>
                            Group Admin
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Member actions (Only visible to Group Admin on other users) */}
                    {isAdmin && !isMe && (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {!isUserAdmin && (
                          <button 
                            onClick={() => handleMakeAdmin(user.id)}
                            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }}
                            title="Promote to Admin"
                          >
                            <Shield size={14} />
                          </button>
                        )}
                        <button 
                          onClick={() => handleRemoveMember(user.id)}
                          style={{ background: 'none', border: 'none', color: 'var(--danger-color)', cursor: 'pointer', padding: '4px' }}
                          title="Remove member"
                        >
                          <UserMinus size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Row */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
            <button 
              onClick={handleLeave}
              style={{ 
                border: 'none', 
                background: 'rgba(234, 0, 56, 0.1)', 
                color: 'var(--danger-color)', 
                padding: '10px 16px', 
                borderRadius: '8px', 
                fontWeight: '600', 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <LogOut size={16} /> Leave Group
            </button>
            <button 
              type="button" 
              className="landing-btn" 
              style={{ padding: '10px 20px' }} 
              onClick={onClose}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
