// ==============================================================================
// ANURGO STUDIO — AUTHENTICATION ROUTER
// ==============================================================================
// Provides Signup, Login, Email Verification, Session Persistence,
// Forgot/Reset Password with secure password hashing and rate limiting.
// ==============================================================================

import { Router } from 'express';
import crypto from 'node:crypto';
import db from '../db/index.js';
import { hashPassword, verifyPassword, generateToken, verifyToken, generateOtpCode } from '../utils/security.js';
import { validateEmail } from '../utils/validators.js';
import { sendEmailOtp } from '../services/notifications.js';

const router = Router();

// In-memory rate limiting map for auth attempts: key -> { count, resetAt }
const rateLimitMap = new Map();

function checkRateLimit(key, maxRequests = 5, windowMs = 15 * 60 * 1000) {
  const now = Date.now();
  const record = rateLimitMap.get(key);
  if (!record || now > record.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (record.count >= maxRequests) {
    return false;
  }
  record.count += 1;
  return true;
}

/**
 * Authentication Middleware to protect client endpoints
 */
export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({ success: false, error: 'Access token required.' });
  }

  const payload = verifyToken(token);
  if (!payload) {
    return res.status(403).json({ success: false, error: 'Invalid or expired session token.' });
  }

  req.user = payload;
  next();
}

/**
 * POST /api/auth/signup
 * Create a new client account and trigger email verification code
 */
router.post('/signup', async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword } = req.body;

    if (!fullName || !fullName.trim()) {
      return res.status(400).json({ success: false, error: 'Full name is required.' });
    }

    // 1. Email format & disposable email rejection
    const emailCheck = validateEmail(email);
    if (!emailCheck.valid) {
      return res.status(400).json({ success: false, error: emailCheck.error });
    }

    const cleanEmail = email.trim().toLowerCase();

    // 2. Password validation
    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters long.' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, error: 'Passwords do not match.' });
    }

    // 3. Rate limiting check
    if (!checkRateLimit(`signup_${cleanEmail}`, 5, 15 * 60 * 1000)) {
      return res.status(429).json({
        success: false,
        error: 'Too many signup attempts. Please try again in 15 minutes.',
      });
    }

    // 4. Check if email already registered
    const existing = db.prepare('SELECT id, user_id, is_email_verified FROM users WHERE email = ?').get(cleanEmail);
    if (existing) {
      if (existing.is_email_verified) {
        return res.status(400).json({
          success: false,
          error: 'An account with this email already exists. Please log in.',
        });
      }
      // If registered but not yet verified, resend verification code
      const otpCode = generateOtpCode();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

      db.prepare('INSERT INTO otps (target, type, code, expires_at) VALUES (?, ?, ?, ?)').run(
        cleanEmail,
        'email_verify',
        otpCode,
        expiresAt
      );

      await sendEmailOtp(cleanEmail, otpCode, 'Email Verification');

      const isPreview = !process.env.RESEND_API_KEY || process.env.RESEND_API_KEY.includes('your_resend_api_key');
      return res.status(200).json({
        success: true,
        message: isPreview
          ? `Verification code generated! (Code: ${otpCode})`
          : 'A verification code has been resent to your email.',
        unverified: true,
        email: cleanEmail,
        devCode: isPreview ? otpCode : undefined,
      });
    }

    // 5. Create new user record
    const userId = `usr_${crypto.randomBytes(8).toString('hex')}`;
    const passwordHash = hashPassword(password);

    db.prepare(`
      INSERT INTO users (user_id, full_name, email, password_hash, is_email_verified)
      VALUES (?, ?, ?, ?, 0)
    `).run(userId, fullName.trim(), cleanEmail, passwordHash);

    // 6. Generate 6-digit OTP code (valid for 10 minutes)
    const otpCode = generateOtpCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    db.prepare('INSERT INTO otps (target, type, code, expires_at) VALUES (?, ?, ?, ?)').run(
      cleanEmail,
      'email_verify',
      otpCode,
      expiresAt
    );

    // 7. Dispatch verification email
    await sendEmailOtp(cleanEmail, otpCode, 'Email Verification');

    const isPreview = !process.env.RESEND_API_KEY || process.env.RESEND_API_KEY.includes('your_resend_api_key');
    return res.status(201).json({
      success: true,
      message: isPreview
        ? `Account created! (Verification Code: ${otpCode})`
        : 'Account created! Please enter the 6-digit code sent to your email.',
      email: cleanEmail,
      requiresVerification: true,
      devCode: isPreview ? otpCode : undefined,
    });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ success: false, error: 'Internal server error during signup.' });
  }
});

/**
 * POST /api/auth/login
 * Log in using email or Administration username and password
 */
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email/Username and password are required.' });
    }

    const cleanInput = email.trim();

    // Check rate limit on login attempts
    if (!checkRateLimit(`login_${cleanInput.toLowerCase()}`, 10, 10 * 60 * 1000)) {
      return res.status(429).json({
        success: false,
        error: 'Too many failed login attempts. Please try again after 10 minutes.',
      });
    }

    // Match by email OR by full_name (supports 'Administration' username)
    const user = db.prepare(`
      SELECT * FROM users 
      WHERE lower(email) = lower(?) OR lower(full_name) = lower(?)
    `).get(cleanInput, cleanInput);

    if (!user || !verifyPassword(password, user.password_hash)) {
      return res.status(401).json({ success: false, error: 'Invalid username/email or password.' });
    }

    // Require email verification before full access (admin is always verified)
    if (!user.is_email_verified && user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        unverified: true,
        error: 'Please verify your email address before logging in.',
        email: user.email,
      });
    }

    // Issue JWT token with role
    const token = generateToken({
      userId: user.user_id,
      email: user.email,
      name: user.full_name,
      role: user.role || 'client',
    });

    return res.json({
      success: true,
      message: user.role === 'admin' ? 'Welcome, Studio Administrator.' : 'Logged in successfully.',
      token,
      user: {
        userId: user.user_id,
        email: user.email,
        fullName: user.full_name,
        role: user.role || 'client',
        isEmailVerified: true,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, error: 'Internal server error during login.' });
  }
});

/**
 * GET /api/auth/me
 * Return currently authenticated user profile
 */
router.get('/me', authenticateToken, (req, res) => {
  try {
    const user = db
      .prepare('SELECT user_id, full_name, email, role, is_email_verified, created_at FROM users WHERE user_id = ?')
      .get(req.user.userId);

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found.' });
    }

    return res.json({
      success: true,
      user: {
        userId: user.user_id,
        fullName: user.full_name,
        email: user.email,
        role: user.role,
        isEmailVerified: Boolean(user.is_email_verified),
        createdAt: user.created_at,
      },
    });
  } catch (err) {
    console.error('Auth /me error:', err);
    return res.status(500).json({ success: false, error: 'Failed to verify session.' });
  }
});

/**
 * POST /api/auth/forgot-password
 * Send password reset OTP code to registered email
 */
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, error: 'Email address is required.' });
    }

    const cleanEmail = email.trim().toLowerCase();

    if (!checkRateLimit(`forgot_${cleanEmail}`, 3, 15 * 60 * 1000)) {
      return res.status(429).json({
        success: false,
        error: 'Too many reset requests. Please wait a few minutes before trying again.',
      });
    }

    const user = db.prepare('SELECT id, email FROM users WHERE email = ?').get(cleanEmail);
    // Even if user not found, do not leak user enumeration; return generic success
    if (user) {
      const otpCode = generateOtpCode();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

      db.prepare('INSERT INTO otps (target, type, code, expires_at) VALUES (?, ?, ?, ?)').run(
        cleanEmail,
        'password_reset',
        otpCode,
        expiresAt
      );

      await sendEmailOtp(cleanEmail, otpCode, 'Password Reset');
    }

    return res.json({
      success: true,
      message: 'If an account exists with this email, a 6-digit reset code has been sent.',
      email: cleanEmail,
    });
  } catch (err) {
    console.error('Forgot password error:', err);
    return res.status(500).json({ success: false, error: 'Failed to process password reset request.' });
  }
});

/**
 * POST /api/auth/reset-password
 * Reset password using OTP code
 */
router.post('/reset-password', (req, res) => {
  try {
    const { email, code, newPassword, confirmPassword } = req.body;

    if (!email || !code || !newPassword) {
      return res.status(400).json({ success: false, error: 'Email, verification code, and new password are required.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, error: 'New password must be at least 6 characters long.' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, error: 'Passwords do not match.' });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Find latest valid OTP for password reset
    const otpRecord = db.prepare(`
      SELECT * FROM otps 
      WHERE target = ? AND type = 'password_reset' AND verified = 0 
      ORDER BY id DESC LIMIT 1
    `).get(cleanEmail);

    if (!otpRecord) {
      return res.status(400).json({ success: false, error: 'No active reset code found. Please request a new one.' });
    }

    if (new Date() > new Date(otpRecord.expires_at)) {
      return res.status(400).json({ success: false, error: 'The verification code has expired. Please request a new one.' });
    }

    if (otpRecord.attempts >= 5) {
      return res.status(429).json({ success: false, error: 'Maximum attempts exceeded. Please request a new reset code.' });
    }

    if (otpRecord.code !== code.trim()) {
      db.prepare('UPDATE otps SET attempts = attempts + 1 WHERE id = ?').run(otpRecord.id);
      const remaining = 4 - otpRecord.attempts;
      return res.status(400).json({
        success: false,
        error: `Incorrect verification code. ${remaining > 0 ? `${remaining} attempts remaining.` : 'Code invalidated.'}`,
      });
    }

    // Mark OTP as verified
    db.prepare('UPDATE otps SET verified = 1 WHERE id = ?').run(otpRecord.id);

    // Update user password
    const newHash = hashPassword(newPassword);
    db.prepare('UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE email = ?').run(newHash, cleanEmail);

    return res.json({
      success: true,
      message: 'Password reset successfully! You can now log in with your new password.',
    });
  } catch (err) {
    console.error('Reset password error:', err);
    return res.status(500).json({ success: false, error: 'Failed to reset password.' });
  }
});

export default router;
