-- ==============================================================================
-- ANURGO STUDIO — DATABASE SCHEMA (SQLite / PostgreSQL Compatible)
-- ==============================================================================

-- 1. Users Table: Client Accounts & Authentication
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  is_email_verified INTEGER DEFAULT 0,
  role TEXT DEFAULT 'client' CHECK(role IN ('client', 'admin')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. OTPs Table: Email & Phone Verification Codes
CREATE TABLE IF NOT EXISTS otps (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  target TEXT NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('email_verify', 'phone_verify', 'password_reset')),
  code TEXT NOT NULL,
  expires_at DATETIME NOT NULL,
  attempts INTEGER DEFAULT 0,
  verified INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. Leads Table: Project Briefs and Client Inquiries
CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lead_id TEXT UNIQUE NOT NULL,
  user_id TEXT,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  business_name TEXT,
  project_type TEXT NOT NULL DEFAULT 'Landing Page / Single Page',
  budget TEXT NOT NULL DEFAULT 'Flexible / Let''s Discuss',
  timeline TEXT NOT NULL DEFAULT '1–2 Weeks',
  details TEXT NOT NULL,
  email_verified INTEGER DEFAULT 1,
  phone_verified INTEGER DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'Brief Received' CHECK(status IN ('Brief Received', 'Review', 'Discussion', 'Proposal', 'Confirmed', 'Payment', 'Development', 'Delivered', 'Archived')),
  source TEXT DEFAULT 'ANURGO Website',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
);

-- 4. Feedback Table: Creator Feedback Submissions
CREATE TABLE IF NOT EXISTS feedback (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
  category TEXT NOT NULL CHECK(category IN ('design', 'speed', 'pricing', 'copilot', 'other')),
  message TEXT NOT NULL,
  user_name TEXT,
  user_role TEXT,
  is_approved_testimonial INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 5. Chat Sessions Table: ANURGO AI Chatbot Conversations
CREATE TABLE IF NOT EXISTS chat_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT UNIQUE NOT NULL,
  title TEXT,
  language TEXT DEFAULT 'en',
  business_type TEXT,
  detected_budget TEXT,
  message_count INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 6. Chat Messages Table: Turn-by-Turn Dialog History
CREATE TABLE IF NOT EXISTS chat_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL,
  sender TEXT NOT NULL CHECK(sender IN ('user', 'ai', 'system')),
  text TEXT NOT NULL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES chat_sessions(session_id) ON DELETE CASCADE
);

-- 7. Site Analytics Table: Page Views and Visitor Counter
CREATE TABLE IF NOT EXISTS site_analytics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  page_path TEXT NOT NULL DEFAULT '/',
  referrer TEXT,
  user_agent TEXT,
  screen_resolution TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance & security lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_id ON users(user_id);
CREATE INDEX IF NOT EXISTS idx_otps_target ON otps(target, type);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_user ON leads(user_id);
CREATE INDEX IF NOT EXISTS idx_leads_lead_id ON leads(lead_id);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON chat_messages(session_id);
