import { Router } from 'express';
import db from '../db/index.js';

const router = Router();

/**
 * POST /api/chat/sync-session
 * Sync or upsert a chat session from localStorage
 */
router.post('/sync-session', (req, res) => {
  try {
    const { sessionId, title, language, businessType, budget, messages } = req.body;

    if (!sessionId) {
      return res.status(400).json({ success: false, error: 'sessionId is required.' });
    }

    const count = Array.isArray(messages) ? messages.length : 0;

    // Check if session exists
    const existing = db.prepare('SELECT id FROM chat_sessions WHERE session_id = ?').get(sessionId);

    if (existing) {
      db.prepare(`
        UPDATE chat_sessions 
        SET title = COALESCE(?, title),
            language = COALESCE(?, language),
            business_type = COALESCE(?, business_type),
            detected_budget = COALESCE(?, detected_budget),
            message_count = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE session_id = ?
      `).run(title, language, businessType, budget, count, sessionId);
    } else {
      db.prepare(`
        INSERT INTO chat_sessions (session_id, title, language, business_type, detected_budget, message_count)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(sessionId, title || 'New Conversation', language || 'en', businessType, budget, count);
    }

    // Insert latest messages if provided
    if (Array.isArray(messages) && messages.length > 0) {
      const insertMsg = db.prepare(`
        INSERT INTO chat_messages (session_id, sender, text)
        VALUES (?, ?, ?)
      `);

      // Delete existing messages for clean sync
      db.prepare('DELETE FROM chat_messages WHERE session_id = ?').run(sessionId);

      for (const msg of messages) {
        if (msg.sender && msg.text) {
          insertMsg.run(sessionId, msg.sender, msg.text);
        }
      }
    }

    return res.json({ success: true, message: 'Chat session synced.' });
  } catch (err) {
    console.error('Error syncing chat session:', err);
    return res.status(500).json({ success: false, error: 'Failed to sync chat session.' });
  }
});

/**
 * GET /api/chat/sessions
 * List recent chat sessions
 */
router.get('/sessions', (req, res) => {
  try {
    const sessions = db.prepare('SELECT * FROM chat_sessions ORDER BY updated_at DESC LIMIT 50').all();
    return res.json({ success: true, count: sessions.length, data: sessions });
  } catch (err) {
    console.error('Error fetching sessions:', err);
    return res.status(500).json({ success: false, error: 'Failed to fetch sessions.' });
  }
});

/**
 * GET /api/chat/session/:sessionId/messages
 * Retrieve messages for a session
 */
router.get('/session/:sessionId/messages', (req, res) => {
  try {
    const { sessionId } = req.params;
    const messages = db.prepare('SELECT * FROM chat_messages WHERE session_id = ? ORDER BY id ASC').all(sessionId);
    return res.json({ success: true, count: messages.length, data: messages });
  } catch (err) {
    console.error('Error fetching messages:', err);
    return res.status(500).json({ success: false, error: 'Failed to fetch messages.' });
  }
});

export default router;
