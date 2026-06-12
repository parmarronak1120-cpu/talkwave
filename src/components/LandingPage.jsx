import React, { useState } from 'react';
// INSTRUCTION: The APK download links point to '/talkwave.apk'.
// Make sure to place the actual 'talkwave.apk' file inside the 'public/' folder of the project.
import {
  MessageSquareCode,
  Download,
  ShieldCheck,
  Zap,
  Users,
  Smartphone,
  ArrowRight,
  CheckCircle,
  Volume2,
  Moon,
  Sun,
  Lock,
  Globe
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function LandingPage() {
  const { theme, setTheme, navigate } = useApp();
  const [activeSlide, setActiveSlide] = useState(0);

  const mockScreens = [
    {
      title: "Real-time Messaging",
      subtitle: "Instant message delivery with seen ticks, auto-scroll and emoji support.",
      bg: "var(--bg-chat)",
      element: (
        <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px', height: '100%' }}>
          <div style={{ alignSelf: 'flex-start', background: 'var(--bg-bubble-in)', padding: '8px 12px', borderRadius: '8px', borderTopLeftRadius: 0, fontSize: '0.8rem', maxWidth: '80%' }}>
            Hey, did you download the TalkWave PWA?
            <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', textAlign: 'right', marginTop: '2px' }}>10:42 AM</div>
          </div>
          <div style={{ alignSelf: 'flex-end', background: 'var(--bg-bubble-out)', padding: '8px 12px', borderRadius: '8px', borderTopRightRadius: 0, fontSize: '0.8rem', maxWidth: '80%' }}>
            Yes! It works offline and loads instantly. 🚀
            <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', textAlign: 'right', marginTop: '2px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '2px' }}>
              10:43 AM <span style={{ color: '#53bdeb' }}>✓✓</span>
            </div>
          </div>
          <div style={{ alignSelf: 'flex-start', background: 'var(--bg-bubble-in)', padding: '8px 12px', borderRadius: '8px', borderTopLeftRadius: 0, fontSize: '0.8rem', maxWidth: '80%' }}>
            Awesome! The Admin Panel stats are also super useful.
            <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', textAlign: 'right', marginTop: '2px' }}>10:44 AM</div>
          </div>
        </div>
      )
    },
    {
      title: "Group Collaborations",
      subtitle: "Create dynamic groups, manage member roles, and collaborate effortlessly.",
      bg: "var(--bg-chat)",
      element: (
        <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px', height: '100%' }}>
          <div style={{ alignSelf: 'center', background: 'rgba(0,0,0,0.05)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
            Sarah created group "TalkWave Devs"
          </div>
          <div style={{ alignSelf: 'flex-start', background: 'var(--bg-bubble-in)', padding: '8px 12px', borderRadius: '8px', borderTopLeftRadius: 0, fontSize: '0.8rem', maxWidth: '80%' }}>
            <div style={{ fontWeight: 'bold', color: 'var(--wa-green-dark)', fontSize: '0.7rem', marginBottom: '2px' }}>Sarah Connor</div>
            Should we merge the master branch today?
            <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', textAlign: 'right', marginTop: '2px' }}>11:15 AM</div>
          </div>
          <div style={{ alignSelf: 'flex-end', background: 'var(--bg-bubble-out)', padding: '8px 12px', borderRadius: '8px', borderTopRightRadius: 0, fontSize: '0.8rem', maxWidth: '80%' }}>
            <div style={{ fontWeight: 'bold', color: 'var(--wa-green-dark)', fontSize: '0.7rem', marginBottom: '2px' }}>Me</div>
            Yes, testing is 100% complete!
            <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', textAlign: 'right', marginTop: '2px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '2px' }}>
              11:16 AM <span style={{ color: '#53bdeb' }}>✓✓</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Admin Dashboard Control",
      subtitle: "Powerful dashboard tracking total users, logs, statistics, announcements, and reports.",
      bg: "var(--bg-secondary)",
      element: (
        <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px', height: '100%', fontSize: '0.75rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
            <div style={{ background: 'var(--bg-primary)', padding: '6px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)' }}>Total Users</div>
              <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>1,280</div>
            </div>
            <div style={{ background: 'var(--bg-primary)', padding: '6px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)' }}>Online Now</div>
              <div style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--wa-green)' }}>342</div>
            </div>
          </div>
          <div style={{ background: 'var(--bg-primary)', padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)', flex: 1 }}>
            <div style={{ fontWeight: '600', marginBottom: '4px' }}>System Alert Logs</div>
            <div style={{ fontSize: '0.65rem', borderBottom: '1px solid var(--border-color)', padding: '2px 0', color: 'var(--danger-color)' }}>Report: usr-4 was reported by usr-2</div>
            <div style={{ fontSize: '0.65rem', padding: '2px 0', color: 'var(--success-color)' }}>Broadcast: Version 1.0.4 update completed</div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="landing-container">
      {/* Floating Download Button (requires public/talkwave.apk to exist) */}
      <a href="/talkwave.apk" className="floating-download-btn" title="Download Android APK" download>
        <Download size={24} />
      </a>

      {/* Navbar */}
      <header className="landing-nav">
        <div className="landing-nav-content">
          <a href="#" className="landing-logo">
            <div style={{ width: '38px', height: '38px', backgroundColor: 'var(--wa-green)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContents: 'center', color: '#fff', justifyContent: 'center' }}>
              <MessageSquareCode size={22} />
            </div>
            TalkWave
          </a>
          <nav className="landing-nav-links">
            <a href="#features">Features</a>
            <a href="#security">Security</a>
            <a href="#how-it-works">How It Works</a>
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="header-action-btn"
              style={{ color: 'var(--text-primary)', marginRight: '8px' }}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <a href="/talkwave.apk" className="landing-btn" style={{ padding: '8px 16px', fontSize: '0.9rem' }} download>
              <Download size={16} /> Download App
            </a>
            <button
              onClick={() => navigate('#/login')}
              className="landing-btn landing-btn-secondary"
              style={{ padding: '8px 16px', fontSize: '0.9rem' }}
            >
              Launch Web App
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="landing-hero">
        <div className="hero-left">
          <h1>Connect Instantly.<br /><span>Chat Freely.</span></h1>
          <p>
            Experience a premium, WhatsApp-style real-time messaging application. Complete with file sharing, audio messages, group channels, user privacy, and full offline support.
          </p>
          <div className="hero-btns">
            <a href="/talkwave.apk" className="landing-btn" download>
              <Download size={20} /> Download APK
            </a>
            <button onClick={() => navigate('#/login')} className="landing-btn landing-btn-secondary">
              Open TalkWave Web
            </button>
          </div>
          <div style={{ marginTop: '16px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Note: After downloading the APK, allow ‘Install Unknown Apps’ permission if asked.
          </div>
        </div>

        <div className="hero-right">
          <div className="mockup-container">
            {/* Top status bar mock */}
            <div style={{ height: '24px', background: 'var(--bg-secondary)', padding: '0 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.65rem', color: 'var(--text-secondary)' }}>
              <span>9:41 AM</span>
              <div style={{ display: 'flex', gap: '4px' }}>
                <span>📶</span><span>🔋 99%</span>
              </div>
            </div>
            {/* Header mock */}
            <div style={{ height: '48px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', padding: '0 12px', gap: '8px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--wa-green)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.8rem' }}>JD</div>
              <div>
                <div style={{ fontWeight: '600', fontSize: '0.85rem' }}>John Doe</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--wa-green)' }}>Online</div>
              </div>
            </div>
            {/* Active view mock screen */}
            <div className="mockup-screen">
              <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ alignSelf: 'flex-start', background: 'var(--bg-bubble-in)', padding: '8px 12px', borderRadius: '8px', fontSize: '0.75rem', maxWidth: '80%' }}>
                  Hello! Welcome to TalkWave Chat.
                </div>
                <div style={{ alignSelf: 'flex-end', background: 'var(--bg-bubble-out)', padding: '8px 12px', borderRadius: '8px', fontSize: '0.75rem', maxWidth: '80%' }}>
                  Wow, the layout is gorgeous! And it supports dark mode too?
                </div>
                <div style={{ alignSelf: 'flex-start', background: 'var(--bg-bubble-in)', padding: '8px 12px', borderRadius: '8px', fontSize: '0.75rem', maxWidth: '80%' }}>
                  Absolutely. Complete with real-time sync, PWA loading, and an admin statistics panel.
                </div>
              </div>
            </div>
            {/* Input mock */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 48, background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', padding: '0 12px', gap: '8px' }}>
              <div style={{ flex: 1, background: 'var(--bg-primary)', height: '32px', borderRadius: '16px', border: '1px solid var(--border-color)' }}></div>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--wa-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.8rem' }}>🎙️</div>
            </div>
          </div>
          <div className="mockup-badge">
            <Smartphone size={32} />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="landing-features" id="features">
        <div className="section-title">
          <h2>Packed with Premium Features</h2>
          <p>Everything you expect from a professional chat client, running seamlessly on desktop, mobile and tablet viewports.</p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon"><Zap size={24} /></div>
            <h3>Real-Time Exchange</h3>
            <p>Send text, voice, PDF documents, videos, and images. Your communications are synced and auto-scrolled in real-time.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><ShieldCheck size={24} /></div>
            <h3>Privacy Controlled</h3>
            <p>Configure custom settings for online activity visibility, profile photo exposures, blocked contact filters, and encryption.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><Users size={24} /></div>
            <h3>Group Channels</h3>
            <p>Coordinate group channels. Appoint multiple administrators, assign info update capabilities, and regulate membership lists.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><Globe size={24} /></div>
            <h3>Offline Ready PWA</h3>
            <p>Install the app as a Progressive Web Application. Cache core assets for fast loads and access conversation history offline.</p>
          </div>
        </div>
      </section>

      {/* Interactive Screenshots & Features Mockups Carousel */}
      <section className="landing-how-works">
        <div className="how-works-image">
          <div className="mockup-container" style={{ height: '400px', width: '320px', border: '8px solid #202c33', borderRadius: '24px' }}>
            <div style={{ background: 'var(--bg-secondary)', height: '40px', padding: '0 12px', display: 'flex', alignItems: 'center', borderBottom: '1px solid var(--border-color)', fontWeight: 'bold', fontSize: '0.8rem' }}>
              {mockScreens[activeSlide].title}
            </div>
            <div style={{ background: mockScreens[activeSlide].bg, height: '344px', position: 'relative' }}>
              {mockScreens[activeSlide].element}
            </div>
          </div>
        </div>
        <div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 700, marginBottom: '24px' }}>Interactive App Walkthrough</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
            Click the tabs below to explore the visual design and capabilities of TalkWave before opening the client.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {mockScreens.map((screen, idx) => (
              <div
                key={idx}
                onClick={() => setActiveSlide(idx)}
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  border: '1.5px solid',
                  borderColor: activeSlide === idx ? 'var(--wa-green)' : 'var(--border-color)',
                  cursor: 'pointer',
                  backgroundColor: activeSlide === idx ? 'rgba(0,168,132,0.02)' : 'transparent',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ fontWeight: '700', color: activeSlide === idx ? 'var(--wa-green)' : 'var(--text-primary)', marginBottom: '4px' }}>
                  {screen.title}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {screen.subtitle}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Info */}
      <section className="landing-security" id="security">
        <div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 700, marginBottom: '24px' }}>Privacy is Our Priority</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
            We implement industry-standard practices to protect your chat session history. Manage your digital footprint with granular settings.
          </p>
          <div className="steps-list">
            <div className="step-item">
              <div className="step-num"><Lock size={16} /></div>
              <div className="step-content">
                <h3>End-to-End Visual Encrypt</h3>
                <p>Chat details, reports, and sessions are encrypted and stored inside safe local buffers, away from commercial index engines.</p>
              </div>
            </div>
            <div className="step-item">
              <div className="step-num"><ShieldCheck size={16} /></div>
              <div className="step-content">
                <h3>Admin Moderation Logs</h3>
                <p>A separate secure admin portal reviews user reports, suspends violating accounts, and broadcasts system-wide notifications.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="security-image">
          <div style={{ padding: '40px', background: 'var(--bg-secondary)', borderRadius: '24px', border: '1px solid var(--border-color)', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
            <ShieldCheck size={72} color="var(--wa-green)" style={{ margin: '0 auto 24px auto' }} />
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', marginBottom: '12px' }}>Security Verified</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              TalkWave does not distribute database logs to third parties. All text transcripts, media arrays, and credentials stay inside your secure workspace.
            </p>
          </div>
        </div>
      </section>

      {/* How it Works / Steps */}
      <section className="landing-features" id="how-it-works" style={{ background: 'var(--bg-primary)' }}>
        <div className="section-title">
          <h2>Getting Started is Simple</h2>
          <p>Follow three simple steps to start chatting with friends and managing groups on TalkWave.</p>
        </div>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '40px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '48px', height: '48px', backgroundColor: 'var(--bg-secondary)', color: 'var(--wa-green)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', margin: '0 auto 16px auto', fontSize: '1.2rem' }}>1</div>
            <h3 style={{ marginBottom: '8px' }}>Launch or Download</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Launch on browser directly or download the custom Android APK package.</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '48px', height: '48px', backgroundColor: 'var(--bg-secondary)', color: 'var(--wa-green)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', margin: '0 auto 16px auto', fontSize: '1.2rem' }}>2</div>
            <h3 style={{ marginBottom: '8px' }}>Create an Account</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Register your profile with mobile number and email. Customize your profile picture and status.</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '48px', height: '48px', backgroundColor: 'var(--bg-secondary)', color: 'var(--wa-green)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', margin: '0 auto 16px auto', fontSize: '1.2rem' }}>3</div>
            <h3 style={{ marginBottom: '8px' }}>Start Conversation</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Add your contacts, set up custom groups, and experience lightning-fast chats.</p>
          </div>
        </div>
      </section>

      {/* Download Block */}
      <section className="landing-download">
        <div className="download-content">
          <h2>Ready to Ride the Wave?</h2>
          <p>Get the TalkWave application for your Android device today. Standard PWAs can also be installed on iOS & desktop browsers.</p>
          <a href="/talkwave.apk" className="landing-btn download-btn" download>
            <Download size={22} /> Download Android App
          </a>
          <div className="download-note">
            Note: After downloading the APK, allow ‘Install Unknown Apps’ permission if asked.
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <div style={{ width: '32px', height: '32px', backgroundColor: 'var(--wa-green)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <MessageSquareCode size={18} />
            </div>
            TalkWave
          </div>
          <div>© {new Date().getFullYear()} TalkWave. All rights reserved. Built as a high-performance web PWA.</div>
          <div className="footer-links">
            <a href="/talkwave.apk" download>Android App Download</a>
            <a href="#/admin-login">Admin Portal</a>
            <a href="#/login">Client Web</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
