// ==============================================================================
// ANURGO STUDIO — SERVERLESS LEAD NOTIFICATION API HANDLER
// ==============================================================================
// Supports Vercel Serverless Functions, Netlify Functions, and Node.js Runtimes.
// Securely processes Project Brief submissions and dispatches Email + WhatsApp
// notifications to Anurag without exposing private API keys to the client.
// ==============================================================================

export interface ProjectBriefPayload {
  fullName: string;
  email: string;
  businessName: string;
  phone?: string;
  projectType: string;
  budget: string;
  timeline: string;
  details: string;
}

export interface NotificationResult {
  success: boolean;
  message: string;
  dispatched?: {
    email: boolean;
    clientConfirmation: boolean;
    whatsapp: boolean;
  };
  errors?: string[];
  previewMode?: boolean;
}

/**
 * Send transactional email notification via Resend API
 */
async function sendResendEmail(
  apiKey: string,
  from: string,
  to: string,
  subject: string,
  html: string,
  text: string
): Promise<{ success: boolean; id?: string; error?: string }> {
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

    const data = (await res.json()) as Record<string, any>;
    if (!res.ok) {
      return { success: false, error: data?.message || 'Failed to send email via Resend' };
    }
    return { success: true, id: data?.id };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Network error connecting to Resend' };
  }
}

/**
 * Send WhatsApp notification via official Twilio WhatsApp API
 */
async function sendTwilioWhatsApp(
  accountSid: string,
  authToken: string,
  from: string,
  to: string,
  body: string
): Promise<{ success: boolean; sid?: string; error?: string }> {
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

    const data = (await res.json()) as Record<string, any>;
    if (!res.ok) {
      return { success: false, error: data?.message || 'Failed to send WhatsApp message via Twilio' };
    }
    return { success: true, sid: data?.sid };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Network error connecting to Twilio' };
  }
}

/**
 * Core processor for handling project brief lead notifications
 */
export async function processProjectBrief(data: ProjectBriefPayload): Promise<NotificationResult> {
  const errors: string[] = [];

  // 1. Validation
  const fullName = (data.fullName || '').trim();
  const email = (data.email || '').trim();
  const businessName = (data.businessName || '').trim();
  const phone = (data.phone || '').trim();
  const projectType = data.projectType || '3D Website';
  const budget = data.budget || 'Not decided yet';
  const timeline = data.timeline || '2–4 Weeks';
  const details = (data.details || '').trim();

  if (!fullName) errors.push('Full name is required.');
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) errors.push('A valid email address is required.');
  if (!businessName) errors.push('Business or project name is required.');
  if (!details) errors.push('Project description is required.');

  if (errors.length > 0) {
    return {
      success: false,
      message: 'Validation failed on submitted fields.',
      errors,
    };
  }

  // 2. Read Server Environment Variables
  const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
  const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || 'workwithanuragchauhan@gmail.com';
  const FROM_EMAIL = process.env.FROM_EMAIL || 'ANURGO Studio <onboarding@resend.dev>';
  
  const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || '';
  const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || '';
  const TWILIO_WHATSAPP_FROM = process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886';
  const WHATSAPP_TO = process.env.WHATSAPP_TO || '';

  const timestamp = new Date().toLocaleString('en-US', {
    dateStyle: 'full',
    timeStyle: 'medium',
    timeZone: 'Asia/Kolkata',
  });

  const dispatched = {
    email: false,
    clientConfirmation: false,
    whatsapp: false,
  };

  // Preview Mode check: If neither Resend nor Twilio keys are configured, return preview success
  const isPreviewMode = !RESEND_API_KEY && (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN);

  if (isPreviewMode) {
    console.log('\n[ANURGO NOTIFICATION] ⚠️  Preview Mode Active: No RESEND_API_KEY or TWILIO credentials configured in environment.');
    console.log('[ANURGO NOTIFICATION] Received Project Lead:\n', {
      fullName,
      email,
      businessName,
      phone,
      projectType,
      budget,
      timeline,
      details,
      timestamp: `${timestamp} (IST)`,
    });
    return {
      success: true,
      message: 'Project brief received in local preview mode. Configure .env credentials to enable real email/WhatsApp dispatch.',
      previewMode: true,
      dispatched,
    };
  }

  // 3. Email Notification Construction
  const emailSubject = `🚀 New ANURGO Project Brief Received: ${businessName} (${fullName})`;

  const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { margin:0; padding:0; background-color:#080A0F; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color:#D7E2EA; }
    .container { max-width:600px; margin:20px auto; background-color:#0E121C; border-radius:18px; border:1px solid rgba(255,84,0,0.3); overflow:hidden; box-shadow:0 20px 50px rgba(0,0,0,0.8); }
    .header { background:linear-gradient(135deg, #180526 0%, #1B0C04 50%, #FF5400 100%); padding:30px 24px; text-align:center; }
    .header h1 { margin:0; font-size:24px; font-weight:900; letter-spacing:1px; color:#FFFFFF; text-transform:uppercase; }
    .header p { margin:6px 0 0 0; font-size:12px; color:rgba(255,255,255,0.8); font-family:monospace; letter-spacing:2px; text-transform:uppercase; }
    .content { padding:28px 24px; }
    .lead-badge { display:inline-block; padding:4px 12px; background:rgba(255,84,0,0.15); border:1px solid rgba(255,84,0,0.4); border-radius:999px; font-size:11px; font-family:monospace; color:#FF7A00; font-weight:bold; letter-spacing:1px; text-transform:uppercase; margin-bottom:16px; }
    .table { width:100%; border-collapse:collapse; margin-bottom:20px; }
    .table td { padding:10px 12px; border-bottom:1px solid rgba(215,226,234,0.08); font-size:13px; }
    .table td.label { width:35%; color:rgba(215,226,234,0.6); font-family:monospace; font-size:11px; text-transform:uppercase; letter-spacing:1px; }
    .table td.value { color:#FFFFFF; font-weight:600; }
    .desc-box { background:#141A28; border-left:3px solid #FF5400; padding:16px; border-radius:8px; margin:16px 0 24px 0; font-size:14px; line-height:1.6; color:#D7E2EA; white-space:pre-wrap; }
    .cta-row { text-align:center; margin-top:24px; padding-top:20px; border-top:1px solid rgba(215,226,234,0.1); }
    .button { display:inline-block; padding:12px 24px; background:#FF5400; color:#000000 !important; text-decoration:none; font-weight:bold; font-size:12px; font-family:monospace; letter-spacing:1px; text-transform:uppercase; border-radius:999px; margin:0 6px 10px 6px; }
    .button-sec { display:inline-block; padding:12px 24px; background:#1C2438; color:#D7E2EA !important; text-decoration:none; font-weight:bold; font-size:12px; font-family:monospace; letter-spacing:1px; text-transform:uppercase; border-radius:999px; border:1px solid rgba(215,226,234,0.2); margin:0 6px 10px 6px; }
    .footer { padding:18px 24px; text-align:center; font-size:10px; color:rgba(215,226,234,0.4); font-family:monospace; border-top:1px solid rgba(215,226,234,0.06); }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>ANURGO STUDIO</h1>
      <p>New Client Project Lead</p>
    </div>
    <div class="content">
      <div class="lead-badge">🚀 New Client Lead Received</div>
      <table class="table">
        <tr>
          <td class="label">Client Name</td>
          <td class="value">${fullName}</td>
        </tr>
        <tr>
          <td class="label">Client Email</td>
          <td class="value"><a href="mailto:${email}" style="color:#FF7A00; text-decoration:none;">${email}</a></td>
        </tr>
        <tr>
          <td class="label">Business / Project</td>
          <td class="value">${businessName}</td>
        </tr>
        <tr>
          <td class="label">Phone / WhatsApp</td>
          <td class="value">${phone || 'Not provided'}</td>
        </tr>
        <tr>
          <td class="label">Project Type</td>
          <td class="value">${projectType}</td>
        </tr>
        <tr>
          <td class="label">Budget Range</td>
          <td class="value">${budget}</td>
        </tr>
        <tr>
          <td class="label">Preferred Timeline</td>
          <td class="value">${timeline}</td>
        </tr>
        <tr>
          <td class="label">Submission Date</td>
          <td class="value">${timestamp} (IST)</td>
        </tr>
      </table>

      <div style="font-size:12px; font-family:monospace; color:rgba(215,226,234,0.6); text-transform:uppercase; letter-spacing:1px; margin-bottom:6px;">
        📝 Complete Project Description:
      </div>
      <div class="desc-box">${details}</div>

      <div class="cta-row">
        <a href="mailto:${email}?subject=Re:%20ANURGO%20Project%20Inquiry%20%E2%80%94%20${encodeURIComponent(businessName)}" class="button">Reply to Client →</a>
        ${phone ? `<a href="https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(fullName)}!%20This%20is%20Anurag%20from%20ANURGO." class="button-sec">WhatsApp Client →</a>` : ''}
      </div>
    </div>
    <div class="footer">
      Sent securely from ANURGO Studio Website Lead Dispatch Engine • ${timestamp}
    </div>
  </div>
</body>
</html>
`;

  const emailText = `
NEW ANURGO CLIENT LEAD
========================================
Client Name:        ${fullName}
Client Email:       ${email}
Business / Project: ${businessName}
Phone / WhatsApp:   ${phone || 'Not provided'}
Project Type:       ${projectType}
Budget Range:       ${budget}
Preferred Timeline: ${timeline}
Submission Time:    ${timestamp} (IST)

PROJECT DESCRIPTION:
----------------------------------------
${details}

========================================
ANURGO Studio Website Lead Dispatcher
`;

  // 4. Dispatch Email to Anurag (if RESEND_API_KEY is configured)
  if (RESEND_API_KEY) {
    const emailRes = await sendResendEmail(
      RESEND_API_KEY,
      FROM_EMAIL,
      NOTIFICATION_EMAIL,
      emailSubject,
      emailHtml,
      emailText
    );

    if (emailRes.success) {
      dispatched.email = true;
    } else {
      errors.push(`Resend Email Error: ${emailRes.error}`);
    }

    // Optional confirmation email to the client
    try {
      const clientConfirmationSubject = `Project Brief Received — ANURGO Studio`;
      const clientConfirmationHtml = `
<!DOCTYPE html>
<html>
<body style="margin:0; padding:20px; background-color:#080A0F; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color:#D7E2EA;">
  <div style="max-width:550px; margin:0 auto; background:#0E121C; border:1px solid rgba(255,84,0,0.3); border-radius:16px; padding:30px; box-shadow:0 15px 40px rgba(0,0,0,0.8);">
    <h2 style="color:#FFFFFF; margin-top:0; font-size:22px; font-weight:900;">PROJECT BRIEF RECEIVED</h2>
    <p style="color:#D7E2EA; font-size:14px; line-height:1.6;">
      Hi <strong>${fullName}</strong>,
    </p>
    <p style="color:#D7E2EA; font-size:14px; line-height:1.6;">
      Thanks for sharing your project idea for <strong>${businessName}</strong> with ANURGO. Your brief has been successfully received.
    </p>
    <p style="color:#D7E2EA; font-size:14px; line-height:1.6;">
      I will review your requirements and get back to you shortly with concept ideas and next steps.
    </p>
    <div style="margin-top:24px; padding-top:16px; border-top:1px solid rgba(215,226,234,0.1); font-size:12px; color:rgba(215,226,234,0.6);">
      Best regards,<br>
      <strong style="color:#FF5400;">Anurag Chauhan</strong><br>
      Founder & Creative Developer • ANURGO Studio<br>
      <span style="color:#FF7A00;">Email: workwithanuragchauhan@gmail.com</span>
    </div>
  </div>
</body>
</html>
`;
      const clientConfirmationText = `
Hi ${fullName},

Thanks for sharing your project idea for "${businessName}" with ANURGO.
Your project brief has been received successfully. I'll review your requirements and get back to you shortly.

Best regards,
Anurag Chauhan
Founder & Creative Developer • ANURGO Studio
Email: workwithanuragchauhan@gmail.com
`;

      const clientRes = await sendResendEmail(
        RESEND_API_KEY,
        FROM_EMAIL,
        email,
        clientConfirmationSubject,
        clientConfirmationHtml,
        clientConfirmationText
      );

      if (clientRes.success) {
        dispatched.clientConfirmation = true;
      }
    } catch {
      // Non-critical client confirmation failure
    }
  }

  // 5. WhatsApp Notification Construction & Dispatch
  const whatsappBody = `🚀 NEW ANURGO PROJECT LEAD

👤 Client: ${fullName}
📧 Email: ${email}
📱 WhatsApp: ${phone || 'Not provided'}
🏢 Project: ${businessName}
💻 Project Type: ${projectType}
💰 Budget: ${budget}
⏱ Timeline: ${timeline}

📝 Requirements:
${details}`;

  if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN) {
    const waRes = await sendTwilioWhatsApp(
      TWILIO_ACCOUNT_SID,
      TWILIO_AUTH_TOKEN,
      TWILIO_WHATSAPP_FROM,
      WHATSAPP_TO,
      whatsappBody
    );

    if (waRes.success) {
      dispatched.whatsapp = true;
    } else {
      errors.push(`Twilio WhatsApp Error: ${waRes.error}`);
    }
  }

  return {
    success: dispatched.email || dispatched.whatsapp || errors.length === 0,
    message: 'Your project brief has been received successfully.',
    dispatched,
    errors: errors.length > 0 ? errors : undefined,
  };
}

/**
 * Standard HTTP handler for Vercel / Node serverless environments
 */
export default async function handler(req: any, res?: any) {
  // CORS configuration
  if (res) {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );
  }

  if (req.method === 'OPTIONS') {
    if (res) {
      res.status(200).end();
    }
    return new Response(null, { status: 200 });
  }

  if (req.method !== 'POST') {
    const msg = { success: false, message: 'Method Not Allowed. Use POST.' };
    if (res) {
      return res.status(405).json(msg);
    }
    return new Response(JSON.stringify(msg), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    let bodyData: ProjectBriefPayload;
    if (typeof req.body === 'string') {
      bodyData = JSON.parse(req.body);
    } else if (req.body && typeof req.body === 'object') {
      bodyData = req.body;
    } else if (typeof req.json === 'function') {
      bodyData = await req.json();
    } else {
      throw new Error('Unable to parse request body');
    }

    const result = await processProjectBrief(bodyData);
    const statusCode = result.success ? 200 : 400;

    if (res) {
      return res.status(statusCode).json(result);
    }
    return new Response(JSON.stringify(result), {
      status: statusCode,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    const errorResponse = {
      success: false,
      message: err?.message || 'Internal Server Error',
    };
    if (res) {
      return res.status(500).json(errorResponse);
    }
    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
