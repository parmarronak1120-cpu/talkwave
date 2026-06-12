require("dotenv").config();

const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.json());

// In-memory OTP storage: { email, otp, expiry, verified, resetToken }
let otpStore = [];
// In-memory Rate Limit storage: { email: lastRequestTime }
let rateLimitStore = {};

// Helper: Hash password using SHA-256
const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

// Create Nodemailer Transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Helper: Send OTP Email
const sendOTPEmail = async (email, otp) => {
  const transporter = createTransporter();
  const mailOptions = {
    from: process.env.EMAIL_FROM || `TalkWave <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'TalkWave Password Reset OTP',
    text: `Hello,

Your TalkWave password reset OTP is:

${otp}

This OTP is valid for 10 minutes.
If you did not request this, please ignore this email.

Thanks,
TalkWave Team`
  };

  await transporter.sendMail(mailOptions);
};

// Route: Request OTP for Forgot Password
app.post('/api/auth/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required.' });
  }

  const cleanEmail = email.trim().toLowerCase();

  // Rate Limiting: Max 1 request per 60 seconds
  const now = Date.now();
  if (rateLimitStore[cleanEmail] && (now - rateLimitStore[cleanEmail] < 60000)) {
    const secondsLeft = Math.ceil((60000 - (now - rateLimitStore[cleanEmail])) / 1000);
    return res.status(429).json({ error: `Please wait ${secondsLeft} seconds before requesting another OTP.` });
  }

  // Generate 4-digit OTP
  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  const expiry = Date.now() + 10 * 60 * 1000; // 10 minutes

  try {
    await sendOTPEmail(cleanEmail, otp);

    // Save to store, clear existing records for same email
    otpStore = otpStore.filter(record => record.email !== cleanEmail);
    otpStore.push({
      email: cleanEmail,
      otp,
      expiry,
      verified: false,
      resetToken: null
    });

    rateLimitStore[cleanEmail] = now;
    res.json({ message: 'OTP sent to your email. Please check inbox or spam folder.' });
  } catch (err) {
    console.error('Email sending failed:', err);
    res.status(500).json({ error: 'Failed to send OTP email. Please verify SMTP settings.' });
  }
});

// Route: Verify OTP
app.post('/api/auth/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ error: 'Email and OTP are required.' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const cleanOtp = otp.trim();

  const record = otpStore.find(r => r.email === cleanEmail);
  if (!record || record.otp !== cleanOtp) {
    return res.status(400).json({ error: 'Invalid OTP. Please try again.' });
  }

  if (Date.now() > record.expiry) {
    otpStore = otpStore.filter(r => r.email !== cleanEmail);
    return res.status(400).json({ error: 'OTP expired. Please request a new OTP.' });
  }

  // Generate secure reset token
  const resetToken = crypto.randomBytes(32).toString('hex');
  record.verified = true;
  record.resetToken = resetToken;

  res.json({ message: 'OTP verified successfully.', token: resetToken });
});

// Route: Resend OTP
app.post('/api/auth/resend-otp', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required.' });
  }

  const cleanEmail = email.trim().toLowerCase();

  // Rate Limiting: Max 1 request per 60 seconds
  const now = Date.now();
  if (rateLimitStore[cleanEmail] && (now - rateLimitStore[cleanEmail] < 60000)) {
    const secondsLeft = Math.ceil((60000 - (now - rateLimitStore[cleanEmail])) / 1000);
    return res.status(429).json({ error: `Please wait ${secondsLeft} seconds before requesting another OTP.` });
  }

  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  const expiry = Date.now() + 10 * 60 * 1000;

  try {
    await sendOTPEmail(cleanEmail, otp);

    otpStore = otpStore.filter(record => record.email !== cleanEmail);
    otpStore.push({
      email: cleanEmail,
      otp,
      expiry,
      verified: false,
      resetToken: null
    });

    rateLimitStore[cleanEmail] = now;
    res.json({ message: 'OTP resent successfully. Please check your inbox or spam folder.' });
  } catch (err) {
    console.error('Email resending failed:', err);
    res.status(500).json({ error: 'Failed to resend OTP email.' });
  }
});

// Route: Reset Password
app.post('/api/auth/reset-password', (req, res) => {
  const { email, token, password } = req.body;
  if (!email || !token || !password) {
    return res.status(400).json({ error: 'Email, verification token, and new password are required.' });
  }

  const cleanEmail = email.trim().toLowerCase();

  const record = otpStore.find(r => r.email === cleanEmail);
  if (!record || !record.verified || record.resetToken !== token) {
    return res.status(400).json({ error: 'Unauthorized. Please verify OTP first.' });
  }

  // Hash new password using SHA-256
  const hashedPassword = hashPassword(password);

  // Clear OTP record
  otpStore = otpStore.filter(r => r.email !== cleanEmail);

  res.json({ message: 'Password reset successfully.', hashedPassword });
});

// Start Server
app.listen(PORT, () => {
  console.log(`TalkWave Backend Server running on http://localhost:${PORT}`);
});
