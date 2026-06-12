import React, { useState } from 'react';
import { Users, Camera, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function CreateGroup({ isOpen, onClose }) {
  const { users, currentUser, createGroup, showToast } = useApp();
  const [groupName, setGroupName] = useState('');
  const [groupDesc, setGroupDesc] = useState('');
  const [groupPhoto, setGroupPhoto] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);

  if (!isOpen) return null;

  // Filter contacts (excluding current user and admin)
  const contacts = users.filter(u => u.id !== currentUser?.id && u.role !== 'admin');

  const handleToggleMember = (userId) => {
    if (selectedMembers.includes(userId)) {
      setSelectedMembers(prev => prev.filter(id => id !== userId));
    } else {
      setSelectedMembers(prev => [...prev, userId]);
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setGroupPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!groupName) {
      showToast("Group name is required.", "error");
      return;
    }

    // A group must have members (including current user)
    // We add current user automatically in AppContext.createGroup,
    // so here we need to select at least 1 other contact.
    if (selectedMembers.length === 0) {
      showToast("Please select at least one contact to join the group.", "error");
      return;
    }

    // Members list must include current user id
    const finalMembers = [currentUser.id, ...selectedMembers];
    const success = createGroup(groupName, finalMembers, groupDesc, groupPhoto);
    if (success) {
      setGroupName('');
      setGroupDesc('');
      setGroupPhoto('');
      setSelectedMembers([]);
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">Create Group Chat</h3>
          <button className="modal-close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Photo upload */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
              <div 
                style={{ 
                  width: '80px', 
                  height: '80px', 
                  borderRadius: '50%', 
                  background: 'var(--bg-secondary)', 
                  border: '2px dashed var(--border-color)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer'
                }}
              >
                {groupPhoto ? (
                  <img src={groupPhoto} alt="Group preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <Camera size={24} style={{ color: 'var(--text-secondary)' }} />
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handlePhotoUpload}
                  style={{ 
                    position: 'absolute', 
                    top: 0, left: 0, right: 0, bottom: 0, 
                    opacity: 0, 
                    cursor: 'pointer' 
                  }} 
                />
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
                Upload Group Avatar (Optional)
              </span>
            </div>

            {/* Group Name & Desc */}
            <div className="form-group">
              <label className="form-label">Group Name</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Enter group subject..." 
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Enter group description..." 
                value={groupDesc}
                onChange={(e) => setGroupDesc(e.target.value)}
              />
            </div>

            {/* Member selector */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Select Group Members ({selectedMembers.length} selected)</label>
              <div 
                style={{ 
                  maxHeight: '180px', 
                  overflowY: 'auto', 
                  border: '1.5px solid var(--border-color)', 
                  borderRadius: '8px',
                  padding: '4px 0'
                }}
              >
                {contacts.length === 0 ? (
                  <div style={{ padding: '16px', textAlignment: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    No contacts available to add.
                  </div>
                ) : (
                  contacts.map(user => {
                    const isChecked = selectedMembers.includes(user.id);
                    return (
                      <div 
                        key={user.id} 
                        onClick={() => handleToggleMember(user.id)}
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          padding: '8px 16px', 
                          gap: '12px', 
                          cursor: 'pointer',
                          backgroundColor: isChecked ? 'rgba(0,168,132,0.05)' : 'transparent',
                          transition: 'background-color 0.1s'
                        }}
                      >
                        <input 
                          type="checkbox" 
                          checked={isChecked}
                          onChange={() => {}} // handled by div click
                          style={{ accentColor: 'var(--wa-green)', cursor: 'pointer' }}
                        />
                        {user.photo ? (
                          <img src={user.photo} alt={user.name} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--wa-green-dark)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.8rem' }}>
                            {user.name.substring(0, 2).toUpperCase()}
                          </div>
                        )}
                        <span style={{ fontSize: '0.9rem' }}>{user.name}</span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="landing-btn landing-btn-secondary" style={{ padding: '8px 16px' }} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="landing-btn" style={{ padding: '8px 16px' }}>
              Create Group
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
