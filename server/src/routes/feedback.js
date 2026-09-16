import { Router } from 'express';
import db from '../db/index.js';

const router = Router();

/**
 * POST /api/feedback
 * Submit visitor/client feedback from the floating feedback modal
 */
router.post('/', (req, res) => {
  try {
    const { rating, category, message, userName, userRole } = req.body;

    if (!rating || !category || !message) {
      return res.status(400).json({
        success: false,
        error: 'Rating, category, and message are required.',
      });
    }

    const stmt = db.prepare(`
      INSERT INTO feedback (rating, category, message, user_name, user_role, is_approved_testimonial)
      VALUES (?, ?, ?, ?, ?, 0)
    `);

    stmt.run(
      Number(rating),
      category,
      message.trim(),
      userName ? userName.trim() : 'Anonymous Visitor',
      userRole ? userRole.trim() : null
    );

    console.log(`💬 New Feedback [${rating}★ - ${category}]: "${message.slice(0, 40)}..."`);

    return res.status(201).json({
      success: true,
      message: 'Thank you for your feedback! It helps improve ANURGO Studio.',
    });
  } catch (err) {
    console.error('Error saving feedback:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to save feedback.',
    });
  }
});

/**
 * GET /api/feedback
 * Retrieve all feedback entries (optionally filter by testimonials)
 */
router.get('/', (req, res) => {
  try {
    const { testimonialsOnly } = req.query;

    let query = 'SELECT * FROM feedback';
    if (testimonialsOnly === 'true') {
      query += ' WHERE is_approved_testimonial = 1';
    }
    query += ' ORDER BY id DESC';

    const stmt = db.prepare(query);
    const feedbackList = stmt.all();

    return res.json({
      success: true,
      count: feedbackList.length,
      data: feedbackList,
    });
  } catch (err) {
    console.error('Error fetching feedback:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve feedback.',
    });
  }
});

export default router;
