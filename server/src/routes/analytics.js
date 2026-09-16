import { Router } from 'express';
import db from '../db/index.js';

const router = Router();

/**
 * POST /api/analytics/hit
 * Log a page view or interaction
 */
router.post('/hit', (req, res) => {
  try {
    const { path: pagePath, referrer, resolution } = req.body;
    const userAgent = req.headers['user-agent'] || 'Unknown';

    db.prepare(`
      INSERT INTO site_analytics (page_path, referrer, user_agent, screen_resolution)
      VALUES (?, ?, ?, ?)
    `).run(
      pagePath || '/',
      referrer || req.headers.referer || 'direct',
      userAgent.slice(0, 255),
      resolution || 'unknown'
    );

    return res.status(201).json({ success: true });
  } catch (err) {
    console.error('Error logging analytics hit:', err);
    return res.status(500).json({ success: false });
  }
});

/**
 * GET /api/analytics/stats
 * Aggregate dashboard stats for ANURGO
 */
router.get('/stats', (req, res) => {
  try {
    const totalLeads = db.prepare('SELECT COUNT(*) as count FROM leads').get().count;
    const newLeads = db.prepare("SELECT COUNT(*) as count FROM leads WHERE status = 'new'").get().count;
    const totalFeedback = db.prepare('SELECT COUNT(*) as count FROM feedback').get().count;
    const totalViews = db.prepare('SELECT COUNT(*) as count FROM site_analytics').get().count;
    const totalChats = db.prepare('SELECT COUNT(*) as count FROM chat_sessions').get().count;

    return res.json({
      success: true,
      data: {
        totalLeads,
        newLeads,
        totalFeedback,
        totalViews,
        totalChats,
      },
    });
  } catch (err) {
    console.error('Error fetching analytics stats:', err);
    return res.status(500).json({ success: false, error: 'Failed to fetch stats.' });
  }
});

export default router;
