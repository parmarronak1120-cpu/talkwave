import React, { createContext, useState, useEffect, useContext } from 'react';

const AppContext = createContext();

export const EMAIL_SERVICE_ENABLED = false;

// Synchronous SHA-256 implementation in pure JS
export const hashPassword = (ascii) => {
  function rightRotate(value, amount) {
    return (value >>> amount) | (value << (32 - amount));
  }
  var mathPow = Math.pow;
  var maxWord = mathPow(2, 32);
  var lengthProperty = 'length';
  var i, j;
  var result = '';
  var words = [];
  var asciiLength = ascii[lengthProperty];
  var hash = [];
  var k = [];
  var primeCounter = 0;
  var isComposite = {};
  for (var candidate = 2; primeCounter < 64; candidate++) {
    if (!isComposite[candidate]) {
      for (i = 0; i < 313; i += candidate) {
        isComposite[i] = i;
      }
      hash[primeCounter] = (mathPow(candidate, .5) * maxWord) | 0;
      k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
    }
  }
  ascii += '\x80';
  while (ascii[lengthProperty] % 64 - 56) ascii += '\x00';
  for (i = 0; i < ascii[lengthProperty]; i++) {
    j = ascii.charCodeAt(i);
    if (j >> 8) return '';
    words[i >> 2] |= j << ((3 - i % 4) * 8);
  }
  words[words[lengthProperty]] = ((asciiLength * 8) / maxWord) | 0;
  words[words[lengthProperty]] = (asciiLength * 8) | 0;

  for (j = 0; j < words[lengthProperty]; j += 16) {
    var w = words.slice(j, j + 16);
    var oldHash = hash.slice(0);
    hash = hash.slice(0);
    for (i = 0; i < 64; i++) {
      var wItem = w[i];
      if (i >= 16) {
        var s0 = rightRotate(w[i - 15], 7) ^ rightRotate(w[i - 15], 18) ^ (w[i - 15] >>> 3);
        var s1 = rightRotate(w[i - 2], 17) ^ rightRotate(w[i - 2], 19) ^ (w[i - 2] >>> 10);
        wItem = w[i] = (w[i - 16] + s0 + w[i - 7] + s1) | 0;
      }
      var ch = (hash[4] & hash[5]) ^ (~hash[4] & hash[6]);
      var maj = (hash[0] & hash[1]) ^ (hash[0] & hash[2]) ^ (hash[1] & hash[2]);
      var temp1 = (hash[7] + (rightRotate(hash[4], 6) ^ rightRotate(hash[4], 11) ^ rightRotate(hash[4], 25)) + ch + k[i] + (wItem || 0)) | 0;
      var temp2 = ((rightRotate(hash[0], 2) ^ rightRotate(hash[0], 13) ^ rightRotate(hash[0], 22)) + maj) | 0;
      hash = [(temp1 + temp2) | 0].concat(hash);
      hash[4] = (hash[4] + temp1) | 0;
    }
    for (i = 0; i < 8; i++) {
      hash[i] = (hash[i] + oldHash[i]) | 0;
    }
  }
  for (i = 0; i < 8; i++) {
    var v = hash[i];
    if (v < 0) v += maxWord;
    result += ('00000000' + v.toString(16)).slice(-8);
  }
  return result;
};


// Default Mock Users
const INITIAL_USERS = [
  { id: 'usr-admin', name: 'TalkWave Admin', email: 'admin@talkwave.com', mobile: '+1 800-555-0100', password: 'admin123', photo: '', about: 'TalkWave Management', role: 'admin' },
  { id: 'usr-1', name: 'John Doe', email: 'john@talkwave.com', mobile: '+1 555-0199', password: 'password123', photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop', about: 'Hey there! I am using TalkWave.', role: 'user', online: true, lastSeen: '' },
  { id: 'usr-2', name: 'Jane Smith', email: 'jane@talkwave.com', mobile: '+1 555-0200', password: 'password123', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', about: 'Busy or sleeping.', role: 'user', online: false, lastSeen: 'Today at 3:45 PM' },
  { id: 'usr-3', name: 'Sarah Connor', email: 'sarah@talkwave.com', mobile: '+1 555-0201', password: 'password123', photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop', about: 'No fate but what we make.', role: 'user', online: true, lastSeen: '' },
  { id: 'usr-4', name: 'Mike Miller', email: 'mike@talkwave.com', mobile: '+1 555-0202', password: 'password123', photo: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop', about: 'At work, text only.', role: 'user', online: false, lastSeen: 'Yesterday at 9:15 AM' },
];

const INITIAL_CHATS = [
  {
    id: 'chat-1',
    type: 'direct',
    members: ['usr-1'], // user with current user
    lastMessage: 'Hey! Are you free for a call?',
    lastMessageTime: new Date(Date.now() - 3600000).toISOString(),
    unreadCount: 0,
    typing: false,
  },
  {
    id: 'chat-2',
    type: 'direct',
    members: ['usr-2'],
    lastMessage: 'I sent you the document yesterday.',
    lastMessageTime: new Date(Date.now() - 86400000).toISOString(),
    unreadCount: 1,
    typing: false,
  },
  {
    id: 'chat-3',
    type: 'group',
    name: 'Development Team',
    description: 'Core discussion for TalkWave app architecture',
    avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=100&h=100&fit=crop',
    members: ['usr-1', 'usr-2', 'usr-3'],
    groupAdminIds: ['usr-1'], // John is group admin
    lastMessage: 'John: Let\'s use Vanilla CSS for layouts.',
    lastMessageTime: new Date(Date.now() - 7200000).toISOString(),
    unreadCount: 0,
    typing: false,
  }
];

const INITIAL_MESSAGES = [
  { id: 'msg-1', chatId: 'chat-1', senderId: 'usr-1', senderName: 'John Doe', text: 'Hey there! How is everything going?', type: 'text', timestamp: new Date(Date.now() - 7200000).toISOString(), status: 'seen' },
  { id: 'msg-2', chatId: 'chat-1', senderId: 'current', senderName: 'Me', text: 'Going great! Working on the new designs.', type: 'text', timestamp: new Date(Date.now() - 5400000).toISOString(), status: 'seen' },
  { id: 'msg-3', chatId: 'chat-1', senderId: 'usr-1', senderName: 'John Doe', text: 'Hey! Are you free for a call?', type: 'text', timestamp: new Date(Date.now() - 3600000).toISOString(), status: 'seen' },
  
  { id: 'msg-4', chatId: 'chat-2', senderId: 'usr-2', senderName: 'Jane Smith', text: 'Hello! I uploaded the PDF copy.', type: 'text', timestamp: new Date(Date.now() - 90000000).toISOString(), status: 'seen' },
  { id: 'msg-5', chatId: 'chat-2', senderId: 'usr-2', senderName: 'Jane Smith', text: 'I sent you the document yesterday.', type: 'text', timestamp: new Date(Date.now() - 86400000).toISOString(), status: 'delivered' },

  { id: 'msg-6', chatId: 'chat-3', senderId: 'usr-3', senderName: 'Sarah Connor', text: 'Welcome to the team room!', type: 'text', timestamp: new Date(Date.now() - 10800000).toISOString(), status: 'seen' },
  { id: 'msg-7', chatId: 'chat-3', senderId: 'usr-1', senderName: 'John Doe', text: 'Let\'s use Vanilla CSS for layouts.', type: 'text', timestamp: new Date(Date.now() - 7200000).toISOString(), status: 'seen' }
];

export const AppProvider = ({ children }) => {
  // Routing State
  const [currentRoute, setCurrentRoute] = useState(window.location.hash || '#/');

  // Dark/Light Theme
  const [theme, setTheme] = useState(localStorage.getItem('tw-theme') || 'dark');

  // Load from LocalStorage or Fallback
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('tw-users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('tw-current-user');
    return saved ? JSON.parse(saved) : null;
  });

  const [currentAdmin, setCurrentAdmin] = useState(() => {
    const saved = localStorage.getItem('tw-current-admin');
    return saved ? JSON.parse(saved) : null;
  });

  const [chats, setChats] = useState(() => {
    const saved = localStorage.getItem('tw-chats');
    return saved ? JSON.parse(saved) : INITIAL_CHATS;
  });

  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('tw-messages');
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  const [reports, setReports] = useState(() => {
    const saved = localStorage.getItem('tw-reports');
    return saved ? JSON.parse(saved) : [];
  });

  const [announcements, setAnnouncements] = useState(() => {
    const saved = localStorage.getItem('tw-announcements');
    return saved ? JSON.parse(saved) : [];
  });

  const [blockedUsers, setBlockedUsers] = useState(() => {
    const saved = localStorage.getItem('tw-blocked-users');
    return saved ? JSON.parse(saved) : []; // stores user IDs blocked by current user
  });

  const [appSettings, setAppSettings] = useState(() => {
    const saved = localStorage.getItem('tw-app-settings');
    return saved ? JSON.parse(saved) : { allowRegistration: true, maintenanceMode: false, allowMediaUpload: true };
  });

  const [resetEmail, setResetEmail] = useState(() => {
    return localStorage.getItem('tw-reset-email') || '';
  });

  const [verificationToken, setVerificationToken] = useState(() => {
    return localStorage.getItem('tw-verification-token') || '';
  });

  useEffect(() => {
    localStorage.setItem('tw-reset-email', resetEmail);
  }, [resetEmail]);

  useEffect(() => {
    localStorage.setItem('tw-verification-token', verificationToken);
  }, [verificationToken]);

  // UI States
  const [activeChatId, setActiveChatId] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [sidebarTab, setSidebarTab] = useState('chats'); // chats, contacts, groups, settings, profile
  const [isTypingState, setIsTypingState] = useState({}); // chat-id -> boolean
  const [searchQuery, setSearchQuery] = useState('');

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('tw-users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('tw-current-user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('tw-current-user');
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentAdmin) {
      localStorage.setItem('tw-current-admin', JSON.stringify(currentAdmin));
    } else {
      localStorage.removeItem('tw-current-admin');
    }
  }, [currentAdmin]);

  useEffect(() => {
    localStorage.setItem('tw-chats', JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    localStorage.setItem('tw-messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('tw-reports', JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem('tw-announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('tw-blocked-users', JSON.stringify(blockedUsers));
  }, [blockedUsers]);

  useEffect(() => {
    localStorage.setItem('tw-app-settings', JSON.stringify(appSettings));
  }, [appSettings]);

  // Sync hash routing
  useEffect(() => {
    const handleHashChange = () => {
      setCurrentRoute(window.location.hash || '#/');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Set Theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('tw-theme', theme);
  }, [theme]);

  // Routing navigate helper
  const navigate = (hash) => {
    window.location.hash = hash;
    setCurrentRoute(hash);
  };

  // Toast Helpers
  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substr(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Audio Playback trigger for alerts
  const playNotificationSound = () => {
    try {
      // Create Web Audio Synth for notification chime (no external dependency file required)
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.12); // A5
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch (e) {
      console.warn("Audio Context failed to play notification sound", e);
    }
  };

  // Auth Operations
  const registerUser = (name, email, mobile, password) => {
    if (!appSettings.allowRegistration) {
      showToast("User registration is currently disabled by Admin.", "error");
      return false;
    }
    const exists = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      showToast("Email address already registered.", "error");
      return false;
    }
    const newUser = {
      id: 'usr-' + Date.now(),
      name,
      email,
      mobile,
      password: hashPassword(password), // Store secure hashed password
      photo: '',
      about: 'Hey! I am using TalkWave.',
      role: 'user',
      online: true,
      lastSeen: ''
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    showToast("Registration successful! Welcome to TalkWave.");
    navigate('#/app');
    return true;
  };

  const loginUser = (email, password) => {
    const hashedPassword = hashPassword(password);
    // Support comparing both plain-text (old mock data) and SHA-256 hashed password (new/reset accounts)
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && (u.password === password || u.password === hashedPassword));
    if (!user) {
      showToast("Invalid email or password.", "error");
      return false;
    }
    if (user.role === 'admin') {
      showToast("Please use Admin login portal.", "error");
      return false;
    }
    // Check if user is blocked by admin
    if (user.blockedByAdmin) {
      showToast("Your account has been suspended by the Admin.", "error");
      return false;
    }

    // Set online
    const updatedUsers = users.map(u => u.id === user.id ? { ...u, online: true, lastSeen: '' } : u);
    setUsers(updatedUsers);
    
    setCurrentUser({ ...user, online: true });
    showToast(`Logged in successfully as ${user.name}`);
    navigate('#/app');
    return true;
  };

  const loginAdmin = (email, password) => {
    const hashedPassword = hashPassword(password);
    const admin = users.find(u => u.email.toLowerCase() === email.toLowerCase() && (u.password === password || u.password === hashedPassword) && u.role === 'admin');
    if (!admin) {
      showToast("Invalid Admin credentials.", "error");
      return false;
    }
    setCurrentAdmin(admin);
    showToast("Logged in as Administrator.");
    navigate('#/admin');
    return true;
  };

  const logoutUser = () => {
    if (currentUser) {
      // Set offline
      const updatedUsers = users.map(u => u.id === currentUser.id ? { ...u, online: false, lastSeen: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) } : u);
      setUsers(updatedUsers);
    }
    setCurrentUser(null);
    setActiveChatId(null);
    showToast("Logged out successfully.");
    navigate('#/login');
  };

  const logoutAdmin = () => {
    setCurrentAdmin(null);
    showToast("Admin session ended.");
    navigate('#/admin-login');
  };

  const updateProfile = (fields) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...fields };
    setCurrentUser(updated);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, ...fields } : u));
    showToast("Profile updated successfully!");
  };

  const deleteAccount = () => {
    if (!currentUser) return;
    setUsers(prev => prev.filter(u => u.id !== currentUser.id));
    setChats(prev => prev.filter(c => !c.members.includes(currentUser.id)));
    setCurrentUser(null);
    setActiveChatId(null);
    showToast("Your account has been deleted.", "warning");
    navigate('#/register');
  };

  // Contacts Actions
  const addContact = (emailOrPhone) => {
    if (!currentUser) return;
    const clean = emailOrPhone.trim().toLowerCase();
    const match = users.find(u => (u.email.toLowerCase() === clean || u.mobile === clean) && u.id !== currentUser.id && u.role !== 'admin');
    
    if (!match) {
      showToast("User not found with matching email or mobile number.", "error");
      return false;
    }

    // Check if chat already exists
    const existingChat = chats.find(c => c.type === 'direct' && c.members.includes(match.id));
    if (existingChat) {
      showToast("Contact already in chats.");
      setActiveChatId(existingChat.id);
      setSidebarTab('chats');
      return true;
    }

    // Create new direct chat
    const newChat = {
      id: 'chat-' + Date.now(),
      type: 'direct',
      members: [match.id],
      lastMessage: 'Start a conversation!',
      lastMessageTime: new Date().toISOString(),
      unreadCount: 0,
    };
    setChats(prev => [newChat, ...prev]);
    setActiveChatId(newChat.id);
    setSidebarTab('chats');
    showToast(`Added ${match.name} to chats.`);
    return true;
  };

  const blockUser = (userId) => {
    if (!blockedUsers.includes(userId)) {
      setBlockedUsers(prev => [...prev, userId]);
      showToast("User blocked successfully.");
    }
  };

  const unblockUser = (userId) => {
    setBlockedUsers(prev => prev.filter(id => id !== userId));
    showToast("User unblocked successfully.");
  };

  const reportUser = (reportedUserId, reasonText) => {
    if (!currentUser) return;
    const newReport = {
      id: 'rep-' + Date.now(),
      reporterId: currentUser.id,
      reporterName: currentUser.name,
      reportedId: reportedUserId,
      reportedName: users.find(u => u.id === reportedUserId)?.name || 'Unknown User',
      reason: reasonText,
      timestamp: new Date().toISOString(),
      status: 'pending'
    };
    setReports(prev => [newReport, ...prev]);
    showToast("User reported. Admin will review the chat logs.", "warning");
  };

  // Groups Actions
  const createGroup = (name, memberIds, description, groupPhoto) => {
    if (!currentUser) return;
    const newGroup = {
      id: 'chat-' + Date.now(),
      type: 'group',
      name,
      description: description || 'Group chat',
      avatar: groupPhoto || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=100&h=100&fit=crop',
      members: [...memberIds], // members excludes current user in selector
      groupAdminIds: [currentUser.id],
      lastMessage: `${currentUser.name} created the group.`,
      lastMessageTime: new Date().toISOString(),
      unreadCount: 0,
    };
    setChats(prev => [newGroup, ...prev]);
    setActiveChatId(newGroup.id);
    showToast(`Group "${name}" created successfully.`);
    return true;
  };

  const leaveGroup = (groupId) => {
    if (!currentUser) return;
    setChats(prev => prev.map(c => {
      if (c.id === groupId) {
        const remaining = c.members.filter(m => m !== currentUser.id);
        const remainingAdmins = c.groupAdminIds.filter(a => a !== currentUser.id);
        // If no members, or admin left and we need to nominate a new admin
        let updatedAdmins = [...remainingAdmins];
        if (remaining.length > 0 && updatedAdmins.length === 0) {
          updatedAdmins.push(remaining[0]); // Nominate next user
        }
        return {
          ...c,
          members: remaining,
          groupAdminIds: updatedAdmins,
          lastMessage: `${currentUser.name} left the group.`
        };
      }
      return c;
    }));
    setActiveChatId(null);
    showToast("You left the group.");
  };

  const updateGroupSettings = (groupId, updateFields) => {
    setChats(prev => prev.map(c => {
      if (c.id === groupId) {
        return { ...c, ...updateFields };
      }
      return c;
    }));
    showToast("Group settings updated.");
  };

  // Message Operations
  const sendMessage = (chatId, text, type = 'text', mediaOptions = {}) => {
    if (!currentUser) return;
    const chat = chats.find(c => c.id === chatId);
    if (!chat) return;

    const newMsg = {
      id: 'msg-' + Date.now(),
      chatId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      text,
      type,
      timestamp: new Date().toISOString(),
      status: 'sent',
      ...mediaOptions
    };

    setMessages(prev => [...prev, newMsg]);

    // Update last message in chat list
    setChats(prev => prev.map(c => {
      if (c.id === chatId) {
        let msgPreview = text;
        if (type === 'image') msgPreview = '📷 Image';
        if (type === 'video') msgPreview = '🎥 Video';
        if (type === 'document') msgPreview = '📄 Document: ' + (mediaOptions.docName || 'PDF');
        if (type === 'voice') msgPreview = '🎵 Voice message';
        return {
          ...c,
          lastMessage: msgPreview,
          lastMessageTime: newMsg.timestamp
        };
      }
      return c;
    }));

    // Trigger simulation if it's a direct chat (and receiver is NOT admin)
    if (chat.type === 'direct') {
      const receiverId = chat.members.find(m => m !== currentUser.id);
      const receiver = users.find(u => u.id === receiverId);
      
      if (receiver && !blockedUsers.includes(receiverId)) {
        simulateBotResponse(chatId, receiver, text);
      }
    }
  };

  // Bot Reply Simulation
  const simulateBotResponse = (chatId, receiver, userText) => {
    // Set typing indicator after 1 second
    setTimeout(() => {
      setIsTypingState(prev => ({ ...prev, [chatId]: true }));
      // Set receiver online in DB
      setUsers(prev => prev.map(u => u.id === receiver.id ? { ...u, online: true, lastSeen: '' } : u));
    }, 1000);

    // Reply after 2.5 seconds total
    setTimeout(() => {
      setIsTypingState(prev => ({ ...prev, [chatId]: false }));

      // Pick reply text based on content
      let replyText = "Hey there! I received your message. I'm a bit busy but will get back to you shortly!";
      const q = userText.toLowerCase();
      if (q.includes('hello') || q.includes('hi') || q.includes('hey')) {
        replyText = `Hello! Hope you are doing great. How can I help you today?`;
      } else if (q.includes('meeting') || q.includes('call')) {
        replyText = `Sounds good! Let's arrange a meeting tomorrow afternoon. Does 3 PM work for you?`;
      } else if (q.includes('help') || q.includes('support')) {
        replyText = `Sure thing. Can you explain the issue? I'll do my best to troubleshoot it.`;
      } else if (q.includes('admin')) {
        replyText = `You can log in to the admin panel with email 'admin@talkwave.com' and password 'admin123'.`;
      } else if (q.includes('apk') || q.includes('download')) {
        replyText = `You can download the TalkWave Android APK on our homepage! Use the link in the navbar.`;
      }

      const botMsg = {
        id: 'msg-bot-' + Date.now(),
        chatId,
        senderId: receiver.id,
        senderName: receiver.name,
        text: replyText,
        type: 'text',
        timestamp: new Date().toISOString(),
        status: 'delivered'
      };

      setMessages(prev => [...prev, botMsg]);

      // Play alert chime
      playNotificationSound();

      // Update chat last message & increment unread if chat is not currently open
      setChats(prev => prev.map(c => {
        if (c.id === chatId) {
          const isOpen = activeChatId === chatId;
          return {
            ...c,
            lastMessage: replyText,
            lastMessageTime: botMsg.timestamp,
            unreadCount: isOpen ? 0 : (c.unreadCount || 0) + 1
          };
        }
        return c;
      }));

      // Simulate seen tick on user side after 1s
      setTimeout(() => {
        setMessages(prev => prev.map(m => m.id === botMsg.id ? { ...m, status: 'seen' } : m));
      }, 1000);

      // Randomly make bot go offline after 10s
      setTimeout(() => {
        setUsers(prev => prev.map(u => {
          if (u.id === receiver.id) {
            return {
              ...u,
              online: false,
              lastSeen: 'Last seen today at ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
          }
          return u;
        }));
      }, 10000);

    }, 3000);
  };

  const deleteMessage = (msgId, forEveryone = false) => {
    if (!currentUser) return;
    if (forEveryone) {
      setMessages(prev => prev.map(m => {
        if (m.id === msgId && m.senderId === currentUser.id) {
          return { ...m, text: "🚫 This message was deleted.", type: 'text', mediaUrl: null, replyTo: null, isDeletedEveryone: true };
        }
        return m;
      }));
      showToast("Message deleted for everyone.");
    } else {
      // deleted for me
      setMessages(prev => prev.map(m => {
        if (m.id === msgId) {
          const deletedFor = m.deletedFor || [];
          return { ...m, deletedFor: [...deletedFor, currentUser.id] };
        }
        return m;
      }));
      showToast("Message deleted for you.");
    }
  };

  const editMessage = (msgId, newText) => {
    setMessages(prev => prev.map(m => {
      if (m.id === msgId && m.senderId === currentUser.id) {
        return { ...m, text: newText + " (edited)", isEdited: true };
      }
      return m;
    }));
    showToast("Message edited.");
  };

  // Admin Operations
  const adminBlockUser = (userId) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, blockedByAdmin: true } : u));
    showToast("User session blocked in DB.", "warning");
  };

  const adminUnblockUser = (userId) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, blockedByAdmin: false } : u));
    showToast("User session restored.");
  };

  const adminDeleteUser = (userId) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
    setChats(prev => prev.filter(c => !c.members.includes(userId)));
    showToast("User deleted from system.", "danger");
  };

  const adminSendAnnouncement = (text) => {
    const notice = {
      id: 'ann-' + Date.now(),
      text,
      timestamp: new Date().toISOString()
    };
    setAnnouncements(prev => [notice, ...prev]);

    // Push into active user message threads as System alerts
    chats.forEach(c => {
      const systemMsg = {
        id: 'msg-sys-' + Date.now() + Math.random().toString(36).substr(2, 5),
        chatId: c.id,
        senderId: 'system',
        senderName: 'System Broadcast',
        text: `📢 Announcement: ${text}`,
        type: 'text',
        timestamp: new Date().toISOString(),
        status: 'seen'
      };
      setMessages(prev => [...prev, systemMsg]);
    });

    showToast("Global announcement broadcasted to all channels!");
  };

  const apiForgotPassword = async (email) => {
    const cleanEmail = email.trim().toLowerCase();
    
    // Check user registration on frontend before calling server
    const userExists = users.some(u => u.email.toLowerCase() === cleanEmail);
    if (!userExists) {
      return { success: false, error: "Email address not found." };
    }

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail })
      });
      const data = await response.json();
      if (response.ok) {
        setResetEmail(cleanEmail);
        setVerificationToken(''); // Clear any previous token
        return { success: true, message: data.message };
      } else {
        return { success: false, error: data.error || 'Request failed.' };
      }
    } catch (err) {
      return { success: false, error: 'Cannot connect to backend server. Please verify it is running on port 5000.' };
    }
  };

  const apiVerifyOtp = async (otp) => {
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail, otp })
      });
      const data = await response.json();
      if (response.ok) {
        setVerificationToken(data.token);
        return { success: true, message: data.message };
      } else {
        return { success: false, error: data.error || 'OTP verification failed.' };
      }
    } catch (err) {
      return { success: false, error: 'Cannot connect to backend server.' };
    }
  };

  const apiResendOtp = async () => {
    try {
      const response = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail })
      });
      const data = await response.json();
      if (response.ok) {
        return { success: true, message: data.message };
      } else {
        return { success: false, error: data.error || 'Failed to resend OTP.' };
      }
    } catch (err) {
      return { success: false, error: 'Cannot connect to backend server.' };
    }
  };

  const apiResetPassword = async (password) => {
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail, token: verificationToken, password })
      });
      const data = await response.json();
      if (response.ok) {
        // Update user password in local users state
        const updatedUsers = users.map(u => {
          if (u.email.toLowerCase() === resetEmail.toLowerCase()) {
            return { ...u, password: data.hashedPassword };
          }
          return u;
        });
        setUsers(updatedUsers);

        // Clear reset states
        setResetEmail('');
        setVerificationToken('');
        showToast("Password reset successfully. Please login with your new password.", "success");
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Password reset failed.' };
      }
    } catch (err) {
      return { success: false, error: 'Cannot connect to backend server.' };
    }
  };

  return (
    <AppContext.Provider value={{
      currentRoute,
      theme,
      setTheme,
      navigate,
      currentUser,
      setCurrentUser,
      currentAdmin,
      setCurrentAdmin,
      users,
      setUsers,
      chats,
      setChats,
      messages,
      setMessages,
      reports,
      setReports,
      announcements,
      blockedUsers,
      appSettings,
      setAppSettings,
      activeChatId,
      setActiveChatId,
      toasts,
      showToast,
      sidebarTab,
      setSidebarTab,
      isTypingState,
      searchQuery,
      setSearchQuery,
      
      // Methods
      registerUser,
      loginUser,
      loginAdmin,
      logoutUser,
      logoutAdmin,
      updateProfile,
      deleteAccount,
      addContact,
      blockUser,
      unblockUser,
      reportUser,
      createGroup,
      leaveGroup,
      updateGroupSettings,
      sendMessage,
      deleteMessage,
      editMessage,
      
      // Admin methods
      adminBlockUser,
      adminUnblockUser,
      adminDeleteUser,
      adminSendAnnouncement,

      // Forgot Password Methods
      EMAIL_SERVICE_ENABLED,
      resetEmail,
      setResetEmail,
      verificationToken,
      setVerificationToken,
      apiForgotPassword,
      apiVerifyOtp,
      apiResendOtp,
      apiResetPassword
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
