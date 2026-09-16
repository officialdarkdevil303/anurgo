// ==============================================================================
// ANURGO STUDIO — VERIFICATION ROUTER (Email & Phone OTP)
// ==============================================================================
// Implements secure OTP dispatch, cooldowns, attempt limits, and verification
// for both Email addresses and Phone numbers.
// ==============================================================================

import { Router } from 'express';
import db from '../db/index.js';
import { generateOtpCode } from '../utils/security.js';
import { validateEmail, validatePhone } from '../utils/validators.js';
import { sendEmailOtp, sendPhoneOtp } from '../services/notifications.js';

const router = Router();

// Track cooldown timestamps: target -> lastSentTimestamp
const cooldownMap = new Map();
const COOLDOWN_MS = 60 * 1000; // 60 seconds cooldown

function checkCooldown(target) {
  const now = Date.now();
  const lastSent = cooldownMap.get(target);
  if (lastSent && now - lastSent < COOLDOWN_MS) {
    const remainingSec = Math.ceil((COOLDOWN_MS - (now - lastSent)) / 1000);
    return { allowed: false, remainingSec };
  }
  cooldownMap.set(target, now);
  return { allowed: true };
}

// ------------------------------------------------------------------------------
// EMAIL VERIFICATION ENDPOINTS
// ------------------------------------------------------------------------------

/**
 * POST /api/verify/email/send
 * Dispatch 6-digit OTP to email
 */
router.post('/email/send', async (req, res) => {
  try {
    const { email } = req.body;
    const emailCheck = validateEmail(email);
    if (!emailCheck.valid) {
      return res.status(400).json({ success: false, error: emailCheck.error });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check resend cooldown
    const cooldown = checkCooldown(`email_${cleanEmail}`);
    if (!cooldown.allowed) {
      return res.status(429).json({
        success: false,
        error: `Please wait ${cooldown.remainingSec} seconds before requesting a new code.`,
        remainingSec: cooldown.remainingSec,
      });
    }

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
    return res.json({
      success: true,
      message: isPreview
        ? `Verification code generated! (Testing Code: ${otpCode})`
        : 'A 6-digit verification code has been sent to your email.',
      email: cleanEmail,
      devCode: isPreview ? otpCode : undefined,
    });
  } catch (err) {
    console.error('Email OTP send error:', err);
    return res.status(500).json({ success: false, error: 'Failed to send verification code.' });
  }
});

/**
 * POST /api/verify/email/confirm
 * Validate 6-digit email OTP
 */
router.post('/email/confirm', (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) {
      return res.status(400).json({ success: false, error: 'Email and verification code are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();

    const otpRecord = db.prepare(`
      SELECT * FROM otps 
      WHERE target = ? AND type = 'email_verify' AND verified = 0 
      ORDER BY id DESC LIMIT 1
    `).get(cleanEmail);

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        error: 'No active verification code found. Please request a new code.',
      });
    }

    if (new Date() > new Date(otpRecord.expires_at)) {
      return res.status(400).json({
        success: false,
        error: 'Verification code has expired. Please request a new one.',
      });
    }

    if (otpRecord.attempts >= 5) {
      return res.status(429).json({
        success: false,
        error: 'Maximum verification attempts exceeded. Please request a new code.',
      });
    }

    if (otpRecord.code !== code.trim()) {
      db.prepare('UPDATE otps SET attempts = attempts + 1 WHERE id = ?').run(otpRecord.id);
      const remaining = 4 - otpRecord.attempts;
      return res.status(400).json({
        success: false,
        error: `Incorrect code. ${remaining > 0 ? `${remaining} attempts remaining.` : 'Code invalidated.'}`,
      });
    }

    // Mark OTP as verified
    db.prepare('UPDATE otps SET verified = 1 WHERE id = ?').run(otpRecord.id);

    // If user exists, activate user email
    db.prepare('UPDATE users SET is_email_verified = 1, updated_at = CURRENT_TIMESTAMP WHERE email = ?').run(cleanEmail);

    return res.json({
      success: true,
      verified: true,
      message: 'Email address verified successfully.',
      email: cleanEmail,
    });
  } catch (err) {
    console.error('Email OTP confirm error:', err);
    return res.status(500).json({ success: false, error: 'Failed to verify code.' });
  }
});

// ------------------------------------------------------------------------------
// PHONE VERIFICATION ENDPOINTS
// ------------------------------------------------------------------------------

/**
 * POST /api/verify/phone/send
 * Dispatch 6-digit OTP to phone number
 */
router.post('/phone/send', async (req, res) => {
  try {
    const { phone } = req.body;
    const phoneCheck = validatePhone(phone);
    if (!phoneCheck.valid) {
      return res.status(400).json({ success: false, error: phoneCheck.error });
    }

    const cleanPhone = phoneCheck.formattedPhone;

    // Check resend cooldown
    const cooldown = checkCooldown(`phone_${cleanPhone}`);
    if (!cooldown.allowed) {
      return res.status(429).json({
        success: false,
        error: `Please wait ${cooldown.remainingSec} seconds before requesting a new code.`,
        remainingSec: cooldown.remainingSec,
      });
    }

    const otpCode = generateOtpCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    db.prepare('INSERT INTO otps (target, type, code, expires_at) VALUES (?, ?, ?, ?)').run(
      cleanPhone,
      'phone_verify',
      otpCode,
      expiresAt
    );

    await sendPhoneOtp(cleanPhone, otpCode);

    const isPreview = !process.env.TWILIO_ACCOUNT_SID || process.env.TWILIO_ACCOUNT_SID.includes('your_twilio_account_sid');
    return res.json({
      success: true,
      message: isPreview
        ? `Phone verification code generated! (Testing Code: ${otpCode})`
        : `A 6-digit verification code has been sent to ${cleanPhone}.`,
      phone: cleanPhone,
      devCode: isPreview ? otpCode : undefined,
    });
  } catch (err) {
    console.error('Phone OTP send error:', err);
    return res.status(500).json({ success: false, error: 'Failed to send phone verification code.' });
  }
});

/**
 * POST /api/verify/phone/confirm
 * Validate 6-digit phone OTP
 */
router.post('/phone/confirm', (req, res) => {
  try {
    const { phone, code } = req.body;
    if (!phone || !code) {
      return res.status(400).json({ success: false, error: 'Phone number and verification code are required.' });
    }

    const cleanPhone = phone.replace(/[^0-9+]/g, '');

    const otpRecord = db.prepare(`
      SELECT * FROM otps 
      WHERE target = ? AND type = 'phone_verify' AND verified = 0 
      ORDER BY id DESC LIMIT 1
    `).get(cleanPhone);

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        error: 'No active verification code found for this phone number.',
      });
    }

    if (new Date() > new Date(otpRecord.expires_at)) {
      return res.status(400).json({
        success: false,
        error: 'Phone verification code has expired. Please request a new one.',
      });
    }

    if (otpRecord.attempts >= 5) {
      return res.status(429).json({
        success: false,
        error: 'Maximum verification attempts exceeded. Please request a new code.',
      });
    }

    if (otpRecord.code !== code.trim()) {
      db.prepare('UPDATE otps SET attempts = attempts + 1 WHERE id = ?').run(otpRecord.id);
      const remaining = 4 - otpRecord.attempts;
      return res.status(400).json({
        success: false,
        error: `Incorrect code. ${remaining > 0 ? `${remaining} attempts remaining.` : 'Code invalidated.'}`,
      });
    }

    // Mark OTP as verified
    db.prepare('UPDATE otps SET verified = 1 WHERE id = ?').run(otpRecord.id);

    return res.json({
      success: true,
      verified: true,
      message: 'Phone number verified successfully.',
      phone: cleanPhone,
    });
  } catch (err) {
    console.error('Phone OTP confirm error:', err);
    return res.status(500).json({ success: false, error: 'Failed to verify phone code.' });
  }
});

export default router;
