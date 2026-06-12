import React, { useState, useRef, useEffect } from 'react';
import { 
  Check, 
  FileText, 
  Play, 
  Pause, 
  MoreVertical, 
  Reply, 
  CornerUpRight, 
  Copy, 
  Trash, 
  Edit,
  Eye
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function ChatBubble({ message, onReply, onForward, onEditTrigger }) {
  const { currentUser, users, deleteMessage, activeChatId, messages, showToast } = useApp();
  const [showMenu, setShowMenu] = useState(false);
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });
  const menuRef = useRef(null);

  // Audio elements for voice messages
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState('0:00');
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(null);

  const isMe = message.senderId === currentUser?.id;
  const isSystem = message.senderId === 'system';

  // Find sender avatar
  const sender = users.find(u => u.id === message.senderId);
  const senderName = isMe ? 'You' : message.senderName || sender?.name || 'User';

  // Close context menu on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    if (showMenu) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [showMenu]);

  // Load and format audio duration
  useEffect(() => {
    if (message.type === 'voice' && message.mediaUrl) {
      const audio = new Audio(message.mediaUrl);
      audioRef.current = audio;
      
      const handleLoadedMetadata = () => {
        const min = Math.floor(audio.duration / 60);
        const sec = Math.floor(audio.duration % 60);
        setDuration(`${min}:${sec < 10 ? '0' : ''}${sec}`);
      };

      const handleTimeUpdate = () => {
        setProgress((audio.currentTime / audio.duration) * 100);
      };

      const handleEnded = () => {
        setIsPlaying(false);
        setProgress(0);
      };

      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('ended', handleEnded);

      return () => {
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('ended', handleEnded);
        audio.pause();
      };
    }
  }, [message]);

  const togglePlayAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    setMenuPos({ x: e.clientX, y: e.clientY });
    setShowMenu(true);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    showToast("Message copied to clipboard.");
    setShowMenu(false);
  };

  const handleDeleteForMe = () => {
    deleteMessage(message.id, false);
    setShowMenu(false);
  };

  const handleDeleteForEveryone = () => {
    deleteMessage(message.id, true);
    setShowMenu(false);
  };

  // Find parent reply message
  const repliedMessage = message.replyTo 
    ? messages.find(m => m.id === message.replyTo) 
    : null;

  if (message.deletedFor && message.deletedFor.includes(currentUser?.id)) {
    return null; // do not show deleted messages for this user
  }

  // System Announcement Styling
  if (isSystem) {
    return (
      <div className="messages-date-divider" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--text-primary)', borderLeft: '3px solid var(--warning-color)', borderRadius: '6px', maxWidth: '85%' }}>
        {message.text}
      </div>
    );
  }

  return (
    <div className={`message-bubble-wrapper ${isMe ? 'outbound' : 'inbound'}`}>
      <div 
        className={`message-bubble ${isMe ? 'outbound' : 'inbound'}`}
        onContextMenu={handleContextMenu}
      >
        {/* Reply Message Header inside bubble */}
        {repliedMessage && (
          <div className="bubble-reply-preview">
            <span className="bubble-reply-sender">
              {repliedMessage.senderId === currentUser?.id ? 'You' : repliedMessage.senderName}
            </span>
            <span className="bubble-reply-text">
              {repliedMessage.type === 'text' ? repliedMessage.text : `[${repliedMessage.type}]`}
            </span>
          </div>
        )}

        {/* Sender Name in Group Room */}
        {!isMe && message.senderName && (
          <span className="bubble-sender">{senderName}</span>
        )}

        {/* Media rendering */}
        {message.type === 'image' && message.mediaUrl && (
          <div className="bubble-media-container">
            <img src={message.mediaUrl} alt="Sent media" className="bubble-media-image" />
          </div>
        )}

        {message.type === 'video' && message.mediaUrl && (
          <div className="bubble-media-container">
            <video src={message.mediaUrl} controls className="bubble-media-video" />
          </div>
        )}

        {message.type === 'document' && message.mediaUrl && (
          <a href={message.mediaUrl} download={message.docName || 'document.pdf'} className="bubble-media-doc">
            <FileText className="doc-icon" size={32} />
            <div className="doc-info">
              <div className="doc-name">{message.docName || 'PDF Document'}</div>
              <div className="doc-size">{message.docSize || 'Unknown Size'}</div>
            </div>
          </a>
        )}

        {message.type === 'voice' && message.mediaUrl && (
          <div className="voice-message-player">
            <button className="voice-play-btn" onClick={togglePlayAudio}>
              {isPlaying ? <Pause size={16} fill="#fff" /> : <Play size={16} fill="#fff" style={{ marginLeft: '2px' }} />}
            </button>
            <div className="voice-waveform-container">
              {/* Simulate simple visual equalizer/waveform bars */}
              {Array.from({ length: 18 }).map((_, i) => {
                const heightVal = Math.sin(i * 0.5) * 40 + 50; // wavy shape
                const active = progress > (i / 18) * 100;
                return (
                  <div 
                    key={i} 
                    className={`voice-wave-bar ${active ? 'active' : ''}`}
                    style={{ height: `${heightVal}%` }}
                  />
                );
              })}
            </div>
            <div className="voice-duration">{duration}</div>
          </div>
        )}

        {/* Message Content */}
        {message.text && (
          <span className="bubble-text">{message.text}</span>
        )}

        {/* Timestamp & Seen status ticks */}
        <div className="bubble-meta">
          <span>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          {isMe && (
            <span className={`bubble-ticks ${message.status === 'seen' ? 'seen' : ''}`}>
              {message.status === 'sent' && <Check size={13} />}
              {(message.status === 'delivered' || message.status === 'seen') && (
                <div style={{ display: 'flex', position: 'relative', width: '13px' }}>
                  <Check size={13} style={{ position: 'absolute', left: 0 }} />
                  <Check size={13} style={{ position: 'absolute', left: '4px' }} />
                </div>
              )}
            </span>
          )}
        </div>

        {/* Options Dropdown trigger */}
        <button 
          onClick={(e) => { e.stopPropagation(); setMenuPos({ x: e.clientX, y: e.clientY }); setShowMenu(true); }}
          style={{ 
            position: 'absolute', 
            top: '4px', right: '4px', 
            background: 'none', border: 'none', 
            opacity: 0, 
            cursor: 'pointer',
            transition: 'opacity 0.2s'
          }}
          className="bubble-action-trigger"
        >
          <MoreVertical size={14} />
        </button>
      </div>

      {/* Options Dropdown list overlay */}
      {showMenu && (
        <>
          <div className="bubble-menu-overlay" onClick={() => setShowMenu(false)} />
          <div 
            ref={menuRef}
            className="bubble-menu-list"
            style={{ 
              top: `${menuPos.y}px`, 
              left: `${isMe ? menuPos.x - 150 : menuPos.x}px` 
            }}
          >
            <div className="bubble-menu-item" onClick={() => { onReply(message); setShowMenu(false); }}>
              <Reply size={15} /> Reply
            </div>
            <div className="bubble-menu-item" onClick={() => { onForward(message); setShowMenu(false); }}>
              <CornerUpRight size={15} /> Forward
            </div>
            <div className="bubble-menu-item" onClick={handleCopy}>
              <Copy size={15} /> Copy Text
            </div>
            {isMe && !message.isDeletedEveryone && (
              <div className="bubble-menu-item" onClick={() => { onEditTrigger(message); setShowMenu(false); }}>
                <Edit size={15} /> Edit message
              </div>
            )}
            <div className="bubble-menu-item danger" onClick={handleDeleteForMe}>
              <Trash size={15} /> Delete for me
            </div>
            {isMe && !message.isDeletedEveryone && (
              <div className="bubble-menu-item danger" onClick={handleDeleteForEveryone}>
                <Trash size={15} /> Delete for everyone
              </div>
            )}
          </div>
        </>
      )}

      {/* Hover visual styles helper */}
      <style>{`
        .message-bubble:hover .bubble-action-trigger {
          opacity: 0.6;
        }
        .bubble-action-trigger:hover {
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
}
