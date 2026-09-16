// ==============================================================================
// ANURGO STUDIO — END-TO-END AUTOMATED TEST SUITE
// ==============================================================================
// Tests Authentication, OTP Verifications, Disposable Email Filtering,
// Gibberish Description Heuristics, Project Brief Pipeline, and Client Dashboard.
// ==============================================================================

import db from '../server/src/db/index.js';

const API_BASE = 'http://localhost:5000/api';

async function runTests() {
  console.log('🚀 Starting ANURGO Client System Test Suite...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  // TEST 1: Disposable Email Rejection
  console.log('\n--- Test 1: Disposable Email Protection ---');
  const dispRes = await fetch(`${API_BASE}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: 'Fake User',
      email: 'spammer@tempmail.com',
      password: 'password123',
      confirmPassword: 'password123',
    }),
  });
  const dispData = await dispRes.json();
  assert(
    dispRes.status === 400 && dispData.error.includes('Temporary or disposable email addresses are not accepted'),
    'Reject disposable email (tempmail.com) with required message'
  );

  // TEST 2: Genuine Client Signup
  console.log('\n--- Test 2: Client Signup Flow ---');
  const testEmail = `client_${Date.now()}@anurgostudio.com`;
  const signupRes = await fetch(`${API_BASE}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: 'Siddharth Roy',
      email: testEmail,
      password: 'SecurePassword123!',
      confirmPassword: 'SecurePassword123!',
    }),
  });
  const signupData = await signupRes.json();
  assert(signupRes.status === 201 && signupData.success, 'New user registered and verification OTP generated');

  // Query OTP directly from DB for automated test verification
  const emailOtpRecord = db.prepare(`SELECT code FROM otps WHERE target = ? AND type = 'email_verify' ORDER BY id DESC LIMIT 1`).get(testEmail);
  assert(emailOtpRecord && emailOtpRecord.code.length === 6, '6-digit OTP stored in database');

  // TEST 3: Login before verification should be rejected
  console.log('\n--- Test 3: Unverified Account Login Protection ---');
  const unverifiedLoginRes = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testEmail,
      password: 'SecurePassword123!',
    }),
  });
  const unverifiedLoginData = await unverifiedLoginRes.json();
  assert(unverifiedLoginRes.status === 403 && unverifiedLoginData.unverified, 'Reject login for unverified account');

  // TEST 4: Email OTP Verification
  console.log('\n--- Test 4: Email Verification ---');
  const verifyRes = await fetch(`${API_BASE}/verify/email/confirm`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testEmail,
      code: emailOtpRecord.code,
    }),
  });
  const verifyData = await verifyRes.json();
  assert(verifyRes.status === 200 && verifyData.verified, 'Email successfully verified with 6-digit OTP');

  // TEST 5: Login with Verified Email
  console.log('\n--- Test 5: Client Login & JWT Generation ---');
  const loginRes = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testEmail,
      password: 'SecurePassword123!',
    }),
  });
  const loginData = await loginRes.json();
  assert(loginRes.status === 200 && loginData.token, 'Client logged in, received JWT session token');
  const clientToken = loginData.token;

  // TEST 6: Authenticated /me endpoint
  console.log('\n--- Test 6: Session Verification (/api/auth/me) ---');
  const meRes = await fetch(`${API_BASE}/auth/me`, {
    headers: { Authorization: `Bearer ${clientToken}` },
  });
  const meData = await meRes.json();
  assert(meRes.status === 200 && meData.user.email === testEmail, 'Current session valid and returns user profile');

  // TEST 7: Phone Verification
  console.log('\n--- Test 7: Phone Verification ---');
  const testPhone = '+919835198274';
  const sendPhoneRes = await fetch(`${API_BASE}/verify/phone/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone: testPhone }),
  });
  const sendPhoneData = await sendPhoneRes.json();
  assert(sendPhoneRes.status === 200 && sendPhoneData.success, 'Phone OTP dispatched');

  const phoneOtpRecord = db.prepare(`SELECT code FROM otps WHERE target = ? AND type = 'phone_verify' ORDER BY id DESC LIMIT 1`).get(testPhone);
  const confirmPhoneRes = await fetch(`${API_BASE}/verify/phone/confirm`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone: testPhone, code: phoneOtpRecord.code }),
  });
  const confirmPhoneData = await confirmPhoneRes.json();
  assert(confirmPhoneRes.status === 200 && confirmPhoneData.verified, 'Phone verified with OTP');

  // TEST 8: Gibberish Rejection Heuristics
  console.log('\n--- Test 8: Project Description Gibberish Rejection ---');
  const gibberishCases = [
    { text: 'aaaaaaaaaaaa', desc: 'Repeated character spam' },
    { text: 'asdfghjkl;qwerty', desc: 'Keyboard smash spam' },
    { text: 'Xhjlfkjddof random', desc: 'Random consonant cluster' },
  ];

  for (const tc of gibberishCases) {
    const gRes = await fetch(`${API_BASE}/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Test User',
        email: testEmail,
        businessName: 'Spam Brand',
        phone: testPhone,
        projectType: 'Landing Page',
        budget: 'Flexible',
        timeline: '1-2 Weeks',
        details: tc.text,
        emailVerified: true,
        phoneVerified: true,
      }),
    });
    assert(gRes.status === 400, `Successfully rejected gibberish: "${tc.text}" (${tc.desc})`);
  }

  // TEST 9: Legitimate Short Description Acceptance
  console.log('\n--- Test 9: Legitimate Description Acceptance ---');
  const validBriefRes = await fetch(`${API_BASE}/leads`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${clientToken}`,
    },
    body: JSON.stringify({
      fullName: 'Siddharth Roy',
      email: testEmail,
      businessName: 'The Artisan Bakery',
      phone: testPhone,
      projectType: 'Restaurant & Café Website',
      budget: '₹7,000 – ₹15,000',
      timeline: '1–2 Weeks',
      details: 'I need a website for my cafe with online menu and WhatsApp table reservation.',
      emailVerified: true,
      phoneVerified: true,
    }),
  });
  const validBriefData = await validBriefRes.json();
  console.log('validBrief status:', validBriefRes.status, 'data:', validBriefData);
  assert(
    validBriefRes.status === 201 &&
      validBriefData.success &&
      validBriefData.submissionId.startsWith('ANR-'),
    `Legitimate brief accepted, generated submission ID: ${validBriefData?.submissionId}`
  );

  // TEST 10: Client Dashboard Projects Retrieval
  console.log('\n--- Test 10: Client Dashboard API ---');
  const clientDashRes = await fetch(`${API_BASE}/client/projects`, {
    headers: { Authorization: `Bearer ${clientToken}` },
  });
  const clientDashData = await clientDashRes.json();
  assert(
    clientDashRes.status === 200 &&
      clientDashData.data.length >= 1 &&
      clientDashData.data[0].submissionId === validBriefData.submissionId &&
      clientDashData.data[0].status === 'Brief Received',
    'Client dashboard retrieved project inquiry with status "Brief Received"'
  );

  console.log(`\n======================================================`);
  console.log(`🎯 Test Results: ${passed} PASSED | ${failed} FAILED`);
  console.log(`======================================================\n`);

  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
