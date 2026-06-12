import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Search, 
  Paperclip, 
  Smile, 
  Send, 
  Mic, 
  MoreVertical, 
  Trash, 
  ShieldAlert, 
  Ban, 
  UserPlus, 
  Info,
  X,
  File,
  Image,
  Video,
  MessageSquareCode
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import ChatBubble from './ChatBubble';
import GroupSettings from '../Groups/GroupSettings';

const EMOJIS = ['😀', '😂', '😍', '👍', '🙏', '🔥', '👏', '🎉', '❤️', '🤔', '🚀', '⭐', '✨', '💻', '💡', '✅', '🚫', '📞', '💬', '👥', '🎵', '📄', '📷', '🎥'];

export default function ChatRoom() {
  const { 
    currentUser, 
    activeChatId, 
    setActiveChatId, 
    chats, 
    messages, 
    users, 
    blockedUsers, 
    blockUser, 
    reportUser, 
    sendMessage,
    isTypingState
  } = useApp();

  const [inputVal, setInputVal] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [showChatActions, setShowChatActions] = useState(false);
  
  // Group settings modal state
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  
  // Search messages state
  const [showSearchPanel, setShowSearchPanel] = useState(false);
  const [searchMsgQuery, setSearchMsgQuery] = useState('');

  // Reply state
  const [replyingToMessage, setReplyingToMessage] = useState(null);
  
  // Editing state
  const [editingMessage, setEditingMessage] = useState(null);

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingTimerRef = useRef(null);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const [fileTypeToUpload, setFileTypeToUpload] = useState('image'); // image, video, document

  // Find active chat details
  const chat = chats.find(c => c.id === activeChatId);
  const isGroup = chat?.type === 'group';

  let chatName = chat?.name || '';
  let chatAvatar = chat?.avatar || '';
  let chatSub = '';
  let isOnline = false;
  let isBlocked = false;

  if (chat && !isGroup) {
    const contactId = chat.members.find(m => m !== currentUser?.id);
    const contact = users.find(u => u.id === contactId);
    chatName = contact?.name || 'Unknown User';
    chatAvatar = contact?.photo || '';
    isOnline = contact?.online || false;
    isBlocked = blockedUsers.includes(contactId);
    chatSub = isBlocked ? 'Blocked' : isOnline ? 'Online' : contact?.lastSeen || 'Offline';
  } else if (chat && isGroup) {
    chatSub = `${chat.members.length} members`;
  }

  const chatMessages = messages.filter(m => m.chatId === activeChatId);
  const isTyping = chat ? isTypingState[chat.id] : false;

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  // Voice Recording timer
  useEffect(() => {
    if (isRecording) {
      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(recordingTimerRef.current);
      setRecordingDuration(0);
    }
    return () => clearInterval(recordingTimerRef.current);
  }, [isRecording]);

  const handleSend = () => {
    if (editingMessage) {
      if (inputVal.trim()) {
        useApp().editMessage(editingMessage.id, inputVal);
        setEditingMessage(null);
        setInputVal('');
      }
      return;
    }

    if (!inputVal.trim()) return;
    
    const mediaOptions = {};
    if (replyingToMessage) {
      mediaOptions.replyTo = replyingToMessage.id;
    }

    sendMessage(activeChatId, inputVal, 'text', mediaOptions);
    setInputVal('');
    setReplyingToMessage(null);
    setShowEmojiPicker(false);
  };

  const handleEmojiClick = (emoji) => {
    setInputVal(prev => prev + emoji);
  };

  const triggerUpload = (type) => {
    setFileTypeToUpload(type);
    setShowAttachmentMenu(false);
    fileInputRef.current.click();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const mediaOptions = {
        mediaUrl: reader.result
      };

      if (replyingToMessage) {
        mediaOptions.replyTo = replyingToMessage.id;
      }

      if (fileTypeToUpload === 'document') {
        mediaOptions.docName = file.name;
        mediaOptions.docSize = (file.size / 1024).toFixed(1) + ' KB';
      }

      sendMessage(activeChatId, '', fileTypeToUpload, mediaOptions);
      setReplyingToMessage(null);
    };
    reader.readAsDataURL(file);
  };

  // Audio Recording Methods
  const startRecording = async () => {
    if (isBlocked) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const reader = new FileReader();
        reader.onloadend = () => {
          const mediaOptions = {
            mediaUrl: reader.result
          };
          if (replyingToMessage) {
            mediaOptions.replyTo = replyingToMessage.id;
          }
          sendMessage(activeChatId, '', 'voice', mediaOptions);
          setReplyingToMessage(null);
        };
        reader.readAsDataURL(audioBlob);
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Microphone capture failed", err);
      alert("Microphone permission denied. Cannot record voice messages.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      // Clear data and stop recorder without saving
      mediaRecorderRef.current.ondataavailable = null;
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      // Stop all tracks
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleClearChat = () => {
    if (window.confirm("Are you sure you want to clear chat history?")) {
      useApp().setMessages(prev => prev.filter(m => m.chatId !== activeChatId));
      setShowChatActions(false);
    }
  };

  const handleBlockToggle = () => {
    if (!isGroup) {
      const contactId = chat.members.find(m => m !== currentUser?.id);
      if (isBlocked) {
        useApp().unblockUser(contactId);
      } else {
        useApp().blockUser(contactId);
      }
      setShowChatActions(false);
    }
  };

  const handleReportContact = () => {
    if (!isGroup) {
      const contactId = chat.members.find(m => m !== currentUser?.id);
      const reason = window.prompt("Please state the reason for reporting this user:");
      if (reason) {
        reportUser(contactId, reason);
      }
      setShowChatActions(false);
    }
  };

  // Filter messages for search panel
  const searchedMessages = chatMessages.filter(m => 
    m.text && m.text.toLowerCase().includes(searchMsgQuery.toLowerCase())
  );

  if (!chat) {
    return (
      <div className={`app-chat-room ${activeChatId ? '' : 'mobile-hidden'}`}>
        <div className="chat-room-welcome">
          <div className="welcome-logo">
            <div style={{ width: '60px', height: '60px', backgroundColor: 'var(--wa-green)', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <MessageSquareCode size={38} />
            </div>
            <span>TalkWave</span>
          </div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: '700', marginBottom: '8px' }}>TalkWave for Web & PWA</h2>
          <p className="welcome-desc">
            Select a contact or a group to start messaging. Your chats are synchronized and saved inside your secure sandbox space.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`app-chat-room ${activeChatId ? '' : 'mobile-hidden'}`}>
      
      {/* Hidden File Upload input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload}
        style={{ display: 'none' }}
        accept={
          fileTypeToUpload === 'image' ? 'image/*' : 
          fileTypeToUpload === 'video' ? 'video/*' : 
          fileTypeToUpload === 'document' ? 'application/pdf,application/msword,text/plain' : '*/*'
        }
      />

      {/* Header */}
      <div className="chat-room-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
          <button 
            className="header-action-btn" 
            onClick={() => setActiveChatId(null)}
            style={{ display: 'none' }}
            id="mobile-back-btn"
          >
            <ArrowLeft size={20} />
          </button>
          
          <div className="chat-header-user" onClick={() => isGroup ? setIsGroupModalOpen(true) : setShowChatActions(true)}>
            {chatAvatar ? (
              <img src={chatAvatar} alt={chatName} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--wa-green-dark)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                {chatName.substring(0, 2).toUpperCase()}
              </div>
            )}
            <div className="chat-header-info">
              <div className="chat-header-name">{chatName}</div>
              <div className={`chat-header-status ${isOnline && !isBlocked ? 'online' : ''}`}>{chatSub}</div>
            </div>
          </div>
        </div>

        <div className="chat-header-actions">
          <button className="header-action-btn" title="Search Messages" onClick={() => setShowSearchPanel(!showSearchPanel)}>
            <Search size={20} />
          </button>
          {isGroup ? (
            <button className="header-action-btn" title="Group Settings" onClick={() => setIsGroupModalOpen(true)}>
              <Info size={20} />
            </button>
          ) : (
            <div style={{ position: 'relative' }}>
              <button className="header-action-btn" title="Actions" onClick={() => setShowChatActions(!showChatActions)}>
                <MoreVertical size={20} />
              </button>
              
              {showChatActions && (
                <>
                  <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9 }} onClick={() => setShowChatActions(false)} />
                  <div 
                    className="bubble-menu-list"
                    style={{ position: 'absolute', right: 0, top: '40px', zIndex: 10, minWidth: '160px' }}
                  >
                    <div className="bubble-menu-item" onClick={handleBlockToggle}>
                      <Ban size={15} /> {isBlocked ? 'Unblock user' : 'Block user'}
                    </div>
                    <div className="bubble-menu-item" onClick={handleReportContact}>
                      <ShieldAlert size={15} /> Report User
                    </div>
                    <div className="bubble-menu-item danger" onClick={handleClearChat}>
                      <Trash size={15} /> Clear History
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
        
        {/* Main Feed Container */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, height: '100%' }}>
          <div className="chat-messages-container">
            {chatMessages.length === 0 ? (
              <div className="empty-state" style={{ height: 'auto', margin: 'auto' }}>
                <span style={{ fontSize: '2rem', marginBottom: '8px' }}>👋</span>
                <h3>Start of Chat</h3>
                <p>Say hello to start the conversation! Emojis, voice files, and image attachments are fully supported.</p>
              </div>
            ) : (
              chatMessages.map(msg => (
                <ChatBubble 
                  key={msg.id} 
                  message={msg}
                  onReply={(m) => setReplyingToMessage(m)}
                  onForward={(m) => {
                    const targetChat = chats.find(c => c.id !== activeChatId);
                    if (targetChat) {
                      sendMessage(targetChat.id, `Forwarded: ${m.text || '[Media]'}`, m.type, m.mediaUrl ? { mediaUrl: m.mediaUrl } : {});
                      useApp().showToast(`Message forwarded to ${targetChat.name || 'other contact'}`);
                    } else {
                      useApp().showToast("No other active chats to forward to.", "error");
                    }
                  }}
                  onEditTrigger={(m) => {
                    setEditingMessage(m);
                    setInputVal(m.text.replace(' (edited)', ''));
                  }}
                />
              ))
            )}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="message-bubble-wrapper inbound" style={{ marginTop: '4px' }}>
                <div className="message-bubble inbound" style={{ padding: '10px 14px' }}>
                  <div className="typing-indicator">
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Reply Preview Bar */}
          {replyingToMessage && (
            <div 
              style={{ 
                background: 'var(--bg-secondary)', 
                padding: '8px 16px', 
                borderLeft: '4px solid var(--wa-green)', 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div style={{ fontSize: '0.8rem', minWidth: 0 }}>
                <div style={{ color: 'var(--wa-green)', fontWeight: 'bold' }}>Replying to {replyingToMessage.senderName}</div>
                <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text-secondary)' }}>
                  {replyingToMessage.text || `[${replyingToMessage.type}]`}
                </div>
              </div>
              <button className="header-action-btn" onClick={() => setReplyingToMessage(null)}>
                <X size={16} />
              </button>
            </div>
          )}

          {/* Editing Preview Bar */}
          {editingMessage && (
            <div 
              style={{ 
                background: 'var(--bg-secondary)', 
                padding: '8px 16px', 
                borderLeft: '4px solid var(--warning-color)', 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div style={{ fontSize: '0.8rem' }}>
                <div style={{ color: 'var(--warning-color)', fontWeight: 'bold' }}>Editing Message</div>
                <div style={{ color: 'var(--text-secondary)' }}>{editingMessage.text}</div>
              </div>
              <button className="header-action-btn" onClick={() => { setEditingMessage(null); setInputVal(''); }}>
                <X size={16} />
              </button>
            </div>
          )}

          {/* Input Toolbar */}
          <div className="chat-room-input-bar">
            {isRecording ? (
              /* Voice Recording UI dashboard */
              <div className="voice-recorder-overlay">
                <div className="recording-pulse"></div>
                <div className="recording-timer">
                  Recording: {Math.floor(recordingDuration / 60)}:{(recordingDuration % 60) < 10 ? '0' : ''}{recordingDuration % 60}
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px' }}>
                  <button 
                    onClick={cancelRecording} 
                    style={{ border: 'none', background: 'none', color: 'var(--danger-color)', fontWeight: '600', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={stopRecording} 
                    style={{ border: 'none', background: 'var(--wa-green)', color: '#fff', borderRadius: '20px', padding: '6px 16px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Send size={14} /> Send Voice
                  </button>
                </div>
              </div>
            ) : (
              /* Regular Input UI */
              <>
                <button className="input-action-btn" title="Emoji" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                  <Smile size={22} />
                </button>
                
                {/* Emoji Tray */}
                {showEmojiPicker && (
                  <div className="emoji-picker-container">
                    <div className="emoji-picker-header">Select Emoji</div>
                    <div className="emoji-grid">
                      {EMOJIS.map(emoji => (
                        <span key={emoji} className="emoji-item" onClick={() => handleEmojiClick(emoji)}>{emoji}</span>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{ position: 'relative' }}>
                  <button className="input-action-btn" title="Attach Files" onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}>
                    <Paperclip size={22} />
                  </button>
                  
                  {showAttachmentMenu && (
                    <>
                      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9 }} onClick={() => setShowAttachmentMenu(false)} />
                      <div 
                        className="bubble-menu-list"
                        style={{ position: 'absolute', left: 0, bottom: '45px', zIndex: 10, minWidth: '150px' }}
                      >
                        <div className="bubble-menu-item" onClick={() => triggerUpload('image')}>
                          <Image size={15} color="var(--wa-green)" /> Image message
                        </div>
                        <div className="bubble-menu-item" onClick={() => triggerUpload('video')}>
                          <Video size={15} color="var(--info-color)" /> Video message
                        </div>
                        <div className="bubble-menu-item" onClick={() => triggerUpload('document')}>
                          <File size={15} color="var(--warning-color)" /> Document PDF
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="chat-input-wrapper">
                  <textarea 
                    className="chat-input"
                    placeholder={isBlocked ? "You cannot message a blocked contact" : "Type a message..."}
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    disabled={isBlocked}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    rows="1"
                  />
                </div>

                {inputVal.trim() ? (
                  <button className="input-action-btn" title="Send" onClick={handleSend} style={{ color: 'var(--wa-green)' }}>
                    <Send size={22} />
                  </button>
                ) : (
                  <button 
                    className="input-action-btn" 
                    title="Record Voice" 
                    onClick={startRecording}
                    disabled={isBlocked}
                  >
                    <Mic size={22} />
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Search Messages Side Overlay Panel */}
        {showSearchPanel && (
          <div className="chat-search-panel">
            <div className="chat-search-header">
              <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>Search chat logs</span>
              <button className="header-action-btn" onClick={() => { setShowSearchPanel(false); setSearchMsgQuery(''); }}>
                <X size={16} />
              </button>
            </div>
            
            <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-color)' }}>
              <div className="sidebar-search-wrapper" style={{ padding: '4px 8px' }}>
                <Search size={14} style={{ color: 'var(--text-secondary)' }} />
                <input 
                  type="text" 
                  className="sidebar-search-input" 
                  placeholder="Enter keyword..." 
                  value={searchMsgQuery}
                  onChange={(e) => setSearchMsgQuery(e.target.value)}
                  style={{ fontSize: '0.8rem' }}
                />
              </div>
            </div>

            <div className="chat-search-body">
              {searchMsgQuery ? (
                searchedMessages.length === 0 ? (
                  <div style={{ textAlignment: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)', padding: '20px 0', textAlign: 'center' }}>
                    No matching messages.
                  </div>
                ) : (
                  searchedMessages.map(msg => (
                    <div 
                      key={msg.id} 
                      className="search-match-item"
                      onClick={() => {
                        // Scroll element into view
                        const el = document.getElementById(msg.id);
                        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }}
                    >
                      <div className="search-match-time">
                        {msg.senderName} • {new Date(msg.timestamp).toLocaleDateString()}
                      </div>
                      <div style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{msg.text}</div>
                    </div>
                  ))
                )
              ) : (
                <div style={{ textAlignment: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)', padding: '20px 0', textAlign: 'center' }}>
                  Type keywords to search logs.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Group Info Modal */}
      {isGroup && (
        <GroupSettings 
          isOpen={isGroupModalOpen} 
          onClose={() => setIsGroupModalOpen(false)} 
          chat={chat} 
        />
      )}

      {/* Small CSS responsive injection for back-btn display on mobile */}
      <style>{`
        @media (max-width: 768px) {
          #mobile-back-btn {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  );
}
