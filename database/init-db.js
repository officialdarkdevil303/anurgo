// ==============================================================================
// ANURGO STUDIO — DATABASE INITIALIZER & MIGRATION SCRIPT
// ==============================================================================
// Runs natively on Node 22+ using node:sqlite with zero compile dependencies!
// Seeds default data and the studio Administration account.
// ==============================================================================

import fs from 'fs';
import path from 'path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'url';
import { DatabaseSync } from 'node:sqlite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'anurgo.db');
const schemaPath = path.join(__dirname, 'schema.sql');
const seedPath = path.join(__dirname, 'seed.sql');

console.log('🔄 Initializing ANURGO SQLite Database at:', dbPath);

const db = new DatabaseSync(dbPath);

/**
 * Hash password helper matching server/src/utils/security.js
 */
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return `${salt}:${derivedKey.toString('hex')}`;
}

try {
  // 1. Check if leads table exists and has old status check constraint
  const tableCheck = db.prepare(`SELECT sql FROM sqlite_master WHERE type='table' AND name='leads'`).get();
  
  if (tableCheck && !tableCheck.sql.includes('Brief Received')) {
    console.log('🔄 Migrating leads table with updated lifecycle status constraints...');
    db.exec(`
      CREATE TABLE IF NOT EXISTS leads_new (
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
        status TEXT NOT NULL DEFAULT 'Brief Received' CHECK(status IN ('Brief Received', 'Review', 'Discussion', 'Proposal', 'Confirmed', 'Payment', 'Development', 'Delivered', 'Archived', 'new', 'contacted', 'in_discussion', 'proposal_sent', 'booked')),
        source TEXT DEFAULT 'ANURGO Website',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
      );

      INSERT OR IGNORE INTO leads_new (lead_id, full_name, email, business_name, phone, project_type, budget, timeline, details, status, source)
      SELECT lead_id, full_name, email, business_name, phone, project_type, budget, timeline, details, 'Brief Received', COALESCE(source, 'ANURGO Website')
      FROM leads;

      DROP TABLE leads;
      ALTER TABLE leads_new RENAME TO leads;
    `);
    console.log('✅ Leads table migrated successfully.');
  }

  // 2. Execute full schema safely
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');
  db.exec(schemaSql);
  console.log('✅ Base schema tables verified/created.');

  // 3. Seed Studio Administration Account
  const ADMIN_USERNAME = 'Administration';
  const ADMIN_EMAIL = 'admin@anurgo.com';
  const ADMIN_PASSWORD = 'Nehanurag__0308';

  const existingAdmin = db.prepare(`SELECT * FROM users WHERE email = ? OR full_name = ?`).get(ADMIN_EMAIL, ADMIN_USERNAME);
  if (!existingAdmin) {
    const adminHash = hashPassword(ADMIN_PASSWORD);
    db.prepare(`
      INSERT INTO users (user_id, full_name, email, password_hash, is_email_verified, role)
      VALUES (?, ?, ?, ?, 1, 'admin')
    `).run('admin_anurgo_master', ADMIN_USERNAME, ADMIN_EMAIL, adminHash);
    console.log('👑 Studio Administrator account created (Username: Administration).');
  } else {
    // Update password to ensure it matches Nehanurag__0308
    const adminHash = hashPassword(ADMIN_PASSWORD);
    db.prepare(`
      UPDATE users 
      SET full_name = ?, password_hash = ?, is_email_verified = 1, role = 'admin', updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(ADMIN_USERNAME, adminHash, existingAdmin.id);
    console.log('👑 Studio Administrator account credentials verified.');
  }

  // 4. Seed sample leads data if empty
  const countRow = db.prepare('SELECT COUNT(*) as count FROM leads').get();
  if (countRow && countRow.count === 0) {
    if (fs.existsSync(seedPath)) {
      const seedSql = fs.readFileSync(seedPath, 'utf8');
      db.exec(seedSql);
      console.log('🌱 Seed data populated successfully.');
    }
  } else {
    console.log(`ℹ️ Database contains ${countRow.count} leads.`);
  }

  console.log('🎉 ANURGO Database ready to use!');
} catch (err) {
  console.error('❌ Database initialization error:', err);
  process.exit(1);
} finally {
  db.close();
}
