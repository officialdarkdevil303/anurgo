// ==============================================================================
// ANURGO STUDIO — LEADS ROUTER (PROJECT BRIEF SUBMISSION PIPELINE)
// ==============================================================================
// Handles Project Brief validations, verification enforcement, spam heuristics,
// database persistence, and automated Email + WhatsApp notifications.
// ==============================================================================

import { Router } from 'express';
import db from '../db/index.js';
import { generateSubmissionId, verifyToken } from '../utils/security.js';
import { validateEmail, validatePhone, validateProjectDescription } from '../utils/validators.js';
import { notifyNewProjectBrief } from '../services/notifications.js';

const router = Router();

// In-memory duplicate protection: email:hash -> timestamp
const submissionThrottleMap = new Map();

/**
 * POST /api/leads
 * Submit a verified Project Brief to ANURGO backend
 */
router.post('/', async (req, res) => {
  try {
    const {
      fullName,
      email,
      businessName,
      phone,
      projectType,
      budget,
      timeline,
      details,
      emailVerified,
      phoneVerified,
    } = req.body;

    // Optional user token from Authorization header if logged in
    let userId = null;
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const tokenPayload = verifyToken(authHeader.split(' ')[1]);
      if (tokenPayload) {
        userId = tokenPayload.userId;
      }
    }

    // 1. Full Name check
    if (!fullName || !fullName.trim()) {
      return res.status(400).json({ success: false, error: 'Full name is required.' });
    }

    // 2. Email Validation & Disposable Email rejection
    const emailCheck = validateEmail(email);
    if (!emailCheck.valid) {
      return res.status(400).json({ success: false, error: emailCheck.error });
    }
    const cleanEmail = email.trim().toLowerCase();

    // 3. Business / Project Name check
    if (!businessName || !businessName.trim()) {
      return res.status(400).json({ success: false, error: 'Business or project name is required.' });
    }

    // 4. Phone Validation
    const phoneCheck = validatePhone(phone);
    if (!phoneCheck.valid) {
      return res.status(400).json({ success: false, error: phoneCheck.error });
    }
    const cleanPhone = phoneCheck.formattedPhone;

    // 5. Project Description Validation & Gibberish Heuristics
    const descCheck = validateProjectDescription(details);
    if (!descCheck.valid) {
      return res.status(400).json({
        success: false,
        error: descCheck.error,
        needsMoreDetail: descCheck.needsMoreDetail,
      });
    }

    // 6. Verification Status Enforcement
    // Check if email is verified either via logged-in user record or recent OTP
    const isEmailVerified = Boolean(emailVerified);
    const isPhoneVerified = Boolean(phoneVerified);

    if (!isEmailVerified) {
      // Check database to see if email was verified in otps or users table
      const verifiedOtp = db.prepare(`
        SELECT id FROM otps 
        WHERE target = ? AND type = 'email_verify' AND verified = 1 
        ORDER BY id DESC LIMIT 1
      `).get(cleanEmail);

      const verifiedUser = db.prepare(`
        SELECT id FROM users WHERE email = ? AND is_email_verified = 1
      `).get(cleanEmail);

      if (!verifiedOtp && !verifiedUser) {
        return res.status(400).json({
          success: false,
          error: 'Please verify your email address before submitting the project brief.',
          requiresEmailVerification: true,
        });
      }
    }

    if (!isPhoneVerified) {
      // Check if phone was verified in otps table
      const verifiedPhoneOtp = db.prepare(`
        SELECT id FROM otps 
        WHERE target = ? AND type = 'phone_verify' AND verified = 1 
        ORDER BY id DESC LIMIT 1
      `).get(cleanPhone);

      if (!verifiedPhoneOtp) {
        return res.status(400).json({
          success: false,
          error: 'Please verify your phone number with the SMS/WhatsApp OTP before submitting.',
          requiresPhoneVerification: true,
        });
      }
    }

    // 7. Duplicate Submission Prevention (60-second window)
    const throttleKey = `${cleanEmail}:${businessName.trim().toLowerCase()}`;
    const now = Date.now();
    const lastSubmission = submissionThrottleMap.get(throttleKey);
    if (lastSubmission && now - lastSubmission < 60 * 1000) {
      return res.status(429).json({
        success: false,
        error: 'Your project brief has already been received! Please wait a moment before sending another.',
      });
    }
    submissionThrottleMap.set(throttleKey, now);

    // 8. Generate unique submission ID: ANR-XXXX
    let leadId = generateSubmissionId();
    // Ensure uniqueness
    while (db.prepare('SELECT id FROM leads WHERE lead_id = ?').get(leadId)) {
      leadId = generateSubmissionId();
    }

    const cleanProjectType = projectType || 'Landing Page / Single Page';
    const cleanBudget = budget || "Flexible / Let's Discuss";
    const cleanTimeline = timeline || '1–2 Weeks';
    const cleanDetails = details.trim();

    // 9. Save to SQLite database with status 'Brief Received'
    const stmt = db.prepare(`
      INSERT INTO leads (
        lead_id,
        user_id,
        full_name,
        email,
        phone,
        business_name,
        project_type,
        budget,
        timeline,
        details,
        email_verified,
        phone_verified,
        status,
        source
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 1, 'Brief Received', 'ANURGO Website')
    `);

    stmt.run(
      leadId,
      userId,
      fullName.trim(),
      cleanEmail,
      cleanPhone,
      businessName.trim(),
      cleanProjectType,
      cleanBudget,
      cleanTimeline,
      cleanDetails
    );

    console.log(`\n🎉 [NEW BRIEF RECEIVED] ID: ${leadId} | Client: ${fullName} (${cleanEmail}) | Business: ${businessName}`);

    // 10. Automated Email & WhatsApp Notifications
    const leadPayload = {
      leadId,
      fullName: fullName.trim(),
      email: cleanEmail,
      businessName: businessName.trim(),
      phone: cleanPhone,
      projectType: cleanProjectType,
      budget: cleanBudget,
      timeline: cleanTimeline,
      details: cleanDetails,
      emailVerified: true,
      phoneVerified: true,
      createdAt: new Date().toISOString(),
    };

    // Run notifications asynchronously
    notifyNewProjectBrief(leadPayload).catch(err => {
      console.error('[NOTIFICATIONS ERROR]', err);
    });

    return res.status(201).json({
      success: true,
      message: 'Your project brief has been securely received by ANURGO.',
      submissionId: leadId,
      project: {
        submissionId: leadId,
        fullName: fullName.trim(),
        email: cleanEmail,
        businessName: businessName.trim(),
        phone: cleanPhone,
        projectType: cleanProjectType,
        budget: cleanBudget,
        timeline: cleanTimeline,
        details: cleanDetails,
        status: 'Brief Received',
      },
    });
  } catch (err) {
    console.error('Error submitting project brief:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to process project brief submission.',
    });
  }
});

/**
 * GET /api/leads
 * Admin/Studio lead retrieval
 */
router.get('/', (req, res) => {
  try {
    const leads = db.prepare('SELECT * FROM leads ORDER BY id DESC').all();
    return res.json({
      success: true,
      count: leads.length,
      data: leads,
    });
  } catch (err) {
    console.error('Error fetching leads:', err);
    return res.status(500).json({ success: false, error: 'Failed to fetch leads.' });
  }
});

export default router;
