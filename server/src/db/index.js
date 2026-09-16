import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { DatabaseSync } from 'node:sqlite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = process.env.DATABASE_PATH
  ? path.resolve(__dirname, process.env.DATABASE_PATH)
  : path.resolve(__dirname, '../../../database/anurgo.db');

// Ensure parent directory exists
const parentDir = path.dirname(dbPath);
if (!fs.existsSync(parentDir)) {
  fs.mkdirSync(parentDir, { recursive: true });
}

console.log('📦 Connected to ANURGO SQLite Database at:', dbPath);

export const db = new DatabaseSync(dbPath);

// Auto-run schema on bootstrap if tables don't exist
const schemaPath = path.resolve(__dirname, '../../../database/schema.sql');
if (fs.existsSync(schemaPath)) {
  try {
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    db.exec(schemaSql);
  } catch (err) {
    console.warn('⚠️ Auto-schema check notice:', err.message);
  }
}

export default db;
