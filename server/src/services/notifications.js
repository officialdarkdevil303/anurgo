// ==============================================================================
// ANURGO STUDIO — SERVER NOTIFICATION & DISPATCH SERVICE
// ==============================================================================
// Handles secure server-side email dispatch via Resend and WhatsApp notifications
// via Twilio / WhatsApp Cloud API without exposing credentials to the client.
// ==============================================================================

/**
 * Send an email via Resend API
 */
async function sendResendEmail({ to, subject, html, text }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.FROM_EMAIL || 'ANURGO Studio <onboarding@resend.dev>';

  if (!apiKey) {
    console.log(`\n[EMAIL DISPATCH - DEV PREVIEW MODE]`);
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body:\n${text}\n`);
    return { success: true, previewMode: true };
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to,
        subject,
        html,
        text,
      }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error('[RESEND ERROR]', data);
      return { success: false, error: data?.message || 'Failed to send email via Resend' };
    }
    return { success: true, id: data?.id };
  } catch (err) {
    console.error('[RESEND NETWORK ERROR]', err);
    return { success: false, error: err.message };
  }
}

/**
 * Send WhatsApp notification via Twilio WhatsApp API
 */
async function sendTwilioWhatsApp(body) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886';
  const to = process.env.WHATSAPP_TO || 'whatsapp:+917991192205';

  if (!accountSid || !authToken) {
    console.log(`\n[WHATSAPP DISPATCH - DEV PREVIEW MODE]`);
    console.log(`To: ${to}`);
    console.log(`Body:\n${body}\n`);
    return { success: true, previewMode: true };
  }

  try {
    const authHeader = `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`;
    const params = new URLSearchParams();
    params.append('From', from.startsWith('whatsapp:') ? from : `whatsapp:${from}`);
    params.append('To', to.startsWith('whatsapp:') ? to : `whatsapp:${to}`);
    params.append('Body', body);

    const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error('[TWILIO WHATSAPP ERROR]', data);
      return { success: false, error: data?.message || 'Failed to send WhatsApp message' };
    }
    return { success: true, sid: data?.sid };
  } catch (err) {
    console.error('[TWILIO NETWORK ERROR]', err);
    return { success: false, error: err.message };
  }
}

/**
 * Dispatch Email OTP to user
 */
export async function sendEmailOtp(email, code, purpose = 'Verification') {
  const subject = `Your ANURGO Verification Code: ${code}`;
  const text = `Hi,

Your ANURGO verification code is: ${code}

This code is valid for 10 minutes. If you did not request this code, please ignore this message.

Best regards,
ANURGO Studio
`;

  const html = `
<!DOCTYPE html>
<html>
<body style="margin:0; padding:20px; background-color:#080A0F; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color:#D7E2EA;">
  <div style="max-width:500px; margin:0 auto; background:#0E121C; border:1px solid rgba(255,84,0,0.3); border-radius:16px; padding:30px; box-shadow:0 15px 40px rgba(0,0,0,0.8);">
    <h2 style="color:#FFFFFF; margin-top:0; font-size:20px; font-weight:900; letter-spacing:1px;">ANURGO STUDIO</h2>
    <p style="color:#D7E2EA; font-size:14px; line-height:1.6;">
      Your security verification code is:
    </p>
    <div style="background:#151515; border:1px solid #FF5400; border-radius:12px; padding:18px; text-align:center; font-size:32px; font-family:monospace; font-weight:bold; letter-spacing:8px; color:#FF5400; margin:20px 0;">
      ${code}
    </div>
    <p style="color:rgba(215,226,234,0.6); font-size:12px;">
      This code is valid for <strong>10 minutes</strong>. Do not share this code with anyone.
    </p>
    <div style="margin-top:24px; padding-top:16px; border-top:1px solid rgba(215,226,234,0.1); font-size:11px; color:rgba(215,226,234,0.4);">
      ANURGO — Creative Digital Experiences
    </div>
  </div>
</body>
</html>
`;

  return sendResendEmail({ to: email, subject, html, text });
}

/**
 * Dispatch Phone OTP to user (via WhatsApp / SMS)
 */
export async function sendPhoneOtp(phone, code) {
  const body = `🔒 ANURGO STUDIO: Your verification code is ${code}. Valid for 10 minutes. Do not share this code.`;
  console.log(`\n[PHONE OTP DISPATCH] To: ${phone} | Code: ${code}\n`);

  // Attempt Twilio WhatsApp dispatch if credentials are ready
  return sendTwilioWhatsApp(body);
}

/**
 * Dispatch Owner Notifications & Client Confirmation upon Project Brief Submission
 */
export async function notifyNewProjectBrief(leadData) {
  const {
    leadId,
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
    createdAt,
  } = leadData;

  const timestamp = new Date(createdAt || Date.now()).toLocaleString('en-US', {
    dateStyle: 'full',
    timeStyle: 'medium',
    timeZone: 'Asia/Kolkata',
  });

  const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || 'workwithanuragchauhan@gmail.com';

  // 1. Owner Email Subject & Body
  const ownerSubject = `🚨 New Project Brief Received — ANURGO`;

  const ownerHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { margin:0; padding:0; background-color:#080A0F; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color:#D7E2EA; }
    .container { max-width:600px; margin:20px auto; background-color:#0E121C; border-radius:18px; border:1px solid rgba(255,84,0,0.3); overflow:hidden; }
    .header { background:linear-gradient(135deg, #180526 0%, #1B0C04 50%, #FF5400 100%); padding:28px 24px; text-align:center; }
    .header h1 { margin:0; font-size:22px; font-weight:900; color:#FFFFFF; text-transform:uppercase; letter-spacing:1px; }
    .header p { margin:4px 0 0 0; font-size:11px; color:rgba(255,255,255,0.85); font-family:monospace; letter-spacing:2px; }
    .content { padding:26px 24px; }
    .badge { display:inline-block; padding:4px 12px; background:rgba(255,84,0,0.15); border:1px solid rgba(255,84,0,0.4); border-radius:999px; font-size:11px; font-family:monospace; color:#FF7A00; font-weight:bold; margin-bottom:16px; }
    .table { width:100%; border-collapse:collapse; margin-bottom:20px; }
    .table td { padding:9px 12px; border-bottom:1px solid rgba(215,226,234,0.08); font-size:13px; }
    .table td.label { width:36%; color:rgba(215,226,234,0.6); font-family:monospace; font-size:11px; text-transform:uppercase; }
    .table td.value { color:#FFFFFF; font-weight:600; }
    .desc-box { background:#141A28; border-left:3px solid #FF5400; padding:16px; border-radius:8px; margin:16px 0; font-size:13px; line-height:1.6; color:#D7E2EA; white-space:pre-wrap; }
    .footer { padding:16px 24px; text-align:center; font-size:10px; color:rgba(215,226,234,0.4); font-family:monospace; border-top:1px solid rgba(215,226,234,0.06); }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>ANURGO STUDIO</h1>
      <p>NEW PROJECT BRIEF RECEIVED</p>
    </div>
    <div class="content">
      <div class="badge">Submission ID: ${leadId}</div>
      <table class="table">
        <tr><td class="label">Submission ID</td><td class="value">${leadId}</td></tr>
        <tr><td class="label">Name</td><td class="value">${fullName}</td></tr>
        <tr><td class="label">Email</td><td class="value"><a href="mailto:${email}" style="color:#FF7A00;">${email}</a> ${emailVerified ? '✅ (Verified)' : ''}</td></tr>
        <tr><td class="label">Business / Project</td><td class="value">${businessName}</td></tr>
        <tr><td class="label">Phone / WhatsApp</td><td class="value">${phone || 'Not provided'} ${phoneVerified ? '✅ (Verified)' : ''}</td></tr>
        <tr><td class="label">Project Type</td><td class="value">${projectType}</td></tr>
        <tr><td class="label">Budget Range</td><td class="value">${budget}</td></tr>
        <tr><td class="label">Preferred Timeline</td><td class="value">${timeline}</td></tr>
        <tr><td class="label">Submission Timestamp</td><td class="value">${timestamp} (IST)</td></tr>
        <tr><td class="label">Source</td><td class="value">ANURGO Website</td></tr>
      </table>

      <div style="font-size:11px; font-family:monospace; color:rgba(215,226,234,0.6); text-transform:uppercase;">
        Project Description:
      </div>
      <div class="desc-box">${details}</div>
    </div>
    <div class="footer">
      Sent from ANURGO Studio Automated Submission Pipeline
    </div>
  </div>
</body>
</html>
`;

  const ownerText = `
🚨 NEW PROJECT BRIEF RECEIVED — ANURGO

Submission ID:      ${leadId}
Name:               ${fullName}
Email:              ${email} ${emailVerified ? '(Verified)' : ''}
Business / Project: ${businessName}
Phone / WhatsApp:   ${phone || 'Not provided'} ${phoneVerified ? '(Verified)' : ''}
Project Type:       ${projectType}
Budget:             ${budget}
Preferred Timeline: ${timeline}
Submission Time:    ${timestamp} (IST)
Verification:       Email Verified: ${emailVerified ? 'YES' : 'NO'} | Phone Verified: ${phoneVerified ? 'YES' : 'NO'}
Source:             ANURGO Website

Project Description:
----------------------------------------
${details}
----------------------------------------
`;

  // 2. Owner WhatsApp Notification
  const ownerWhatsappBody = `🚨 NEW PROJECT BRIEF RECEIVED

Submission ID: ${leadId}
Name: ${fullName}
Email: ${email}
Business / Project: ${businessName}
Phone / WhatsApp: ${phone || 'Not provided'}
Project Type: ${projectType}
Budget: ${budget}
Timeline: ${timeline}

Project Details:
${details}

Source: ANURGO Website

Received: ${timestamp} (IST)`;

  // 3. Client Confirmation Email
  const clientSubject = `Project Brief Received — ANURGO (${leadId})`;
  const clientHtml = `
<!DOCTYPE html>
<html>
<body style="margin:0; padding:20px; background-color:#080A0F; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color:#D7E2EA;">
  <div style="max-width:550px; margin:0 auto; background:#0E121C; border:1px solid rgba(255,84,0,0.3); border-radius:16px; padding:28px; box-shadow:0 15px 40px rgba(0,0,0,0.8);">
    <h2 style="color:#FFFFFF; margin-top:0; font-size:20px; font-weight:900;">PROJECT BRIEF RECEIVED</h2>
    <p style="color:#D7E2EA; font-size:14px; line-height:1.6;">
      Hi <strong>${fullName}</strong>,
    </p>
    <p style="color:#D7E2EA; font-size:14px; line-height:1.6;">
      Your project details for <strong>${businessName}</strong> have been securely received by ANURGO Studio.
    </p>
    <div style="background:#151515; border-left:3px solid #FF5400; padding:12px 16px; margin:18px 0; font-family:monospace; font-size:13px; color:#FFFFFF;">
      <strong>Submission ID:</strong> ${leadId}<br>
      <strong>Current Status:</strong> Brief Received<br>
      <strong>Estimated Review:</strong> Within 24–48 hours
    </div>
    <p style="color:#D7E2EA; font-size:14px; line-height:1.6;">
      I will personally review your brief and get back to you with conceptual ideas and next steps.
    </p>
    <div style="margin-top:24px; padding-top:16px; border-top:1px solid rgba(215,226,234,0.1); font-size:12px; color:rgba(215,226,234,0.6);">
      Best regards,<br>
      <strong style="color:#FF5400;">Anurag Chauhan</strong><br>
      Founder & Creative Developer • ANURGO Studio<br>
      Email: workwithanuragchauhan@gmail.com
    </div>
  </div>
</body>
</html>
`;

  const clientText = `Hi ${fullName},

Your project details for "${businessName}" have been securely received by ANURGO Studio.

Submission ID: ${leadId}
Current Status: Brief Received

I will personally review your brief and get back to you shortly.

Best regards,
Anurag Chauhan
Founder & Creative Developer • ANURGO Studio
`;

  // Dispatch all notifications concurrently
  const [emailOwnerRes, waOwnerRes, emailClientRes] = await Promise.allSettled([
    sendResendEmail({ to: NOTIFICATION_EMAIL, subject: ownerSubject, html: ownerHtml, text: ownerText }),
    sendTwilioWhatsApp(ownerWhatsappBody),
    sendResendEmail({ to: email, subject: clientSubject, html: clientHtml, text: clientText }),
  ]);

  return {
    ownerEmail: emailOwnerRes.status === 'fulfilled' && emailOwnerRes.value?.success,
    ownerWhatsApp: waOwnerRes.status === 'fulfilled' && waOwnerRes.value?.success,
    clientEmail: emailClientRes.status === 'fulfilled' && emailClientRes.value?.success,
  };
}
