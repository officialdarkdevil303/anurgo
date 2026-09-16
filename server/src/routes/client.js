// ==============================================================================
// ANURGO STUDIO — CLIENT DASHBOARD ROUTER
// ==============================================================================
// Protected routes for authenticated clients to view submitted project briefs,
// track real-time project lifecycle status, and view project summaries.
// ==============================================================================

import { Router } from 'express';
import db from '../db/index.js';
import { authenticateToken } from './auth.js';

const router = Router();

/**
 * GET /api/client/projects
 * Retrieve all project briefs associated with the authenticated client
 */
router.get('/projects', authenticateToken, (req, res) => {
  try {
    const { userId, email } = req.user;

    // Fetch projects matched either by authenticated user_id or client email
    const stmt = db.prepare(`
      SELECT 
        lead_id,
        full_name,
        email,
        business_name,
        phone,
        project_type,
        budget,
        timeline,
        details,
        status,
        email_verified,
        phone_verified,
        created_at,
        updated_at
      FROM leads
      WHERE user_id = ? OR email = ?
      ORDER BY id DESC
    `);

    const projects = stmt.all(userId, email.toLowerCase());

    return res.json({
      success: true,
      count: projects.length,
      data: projects.map(p => ({
        submissionId: p.lead_id,
        fullName: p.full_name,
        email: p.email,
        businessName: p.business_name || 'Project',
        phone: p.phone,
        projectType: p.project_type,
        budget: p.budget,
        timeline: p.timeline,
        details: p.details,
        status: p.status || 'Brief Received',
        emailVerified: Boolean(p.email_verified),
        phoneVerified: Boolean(p.phone_verified),
        createdAt: p.created_at,
        updatedAt: p.updated_at,
      })),
    });
  } catch (err) {
    console.error('Error fetching client projects:', err);
    return res.status(500).json({ success: false, error: 'Failed to retrieve project briefs.' });
  }
});

/**
 * GET /api/client/projects/:submissionId
 * Retrieve detailed status of a single project brief
 */
router.get('/projects/:submissionId', authenticateToken, (req, res) => {
  try {
    const { submissionId } = req.params;
    const { userId, email } = req.user;

    const project = db.prepare(`
      SELECT * FROM leads 
      WHERE lead_id = ? AND (user_id = ? OR email = ?)
    `).get(submissionId, userId, email.toLowerCase());

    if (!project) {
      return res.status(404).json({ success: false, error: 'Project brief not found or access denied.' });
    }

    return res.json({
      success: true,
      data: {
        submissionId: project.lead_id,
        fullName: project.full_name,
        email: project.email,
        businessName: project.business_name,
        phone: project.phone,
        projectType: project.project_type,
        budget: project.budget,
        timeline: project.timeline,
        details: project.details,
        status: project.status,
        emailVerified: Boolean(project.email_verified),
        phoneVerified: Boolean(project.phone_verified),
        createdAt: project.created_at,
      },
    });
  } catch (err) {
    console.error('Error fetching project detail:', err);
    return res.status(500).json({ success: false, error: 'Failed to retrieve project.' });
  }
});

export default router;
