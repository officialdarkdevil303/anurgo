// ==============================================================================
// ANURGO STUDIO — ADMIN ANALYTICS & STUDIO MANAGEMENT ROUTER
// ==============================================================================
// Protected routes for the Studio Administrator (Username: Administration).
// Provides aggregate metrics, Websites Sold Donut/Pie chart data, Sales wave
// chart data, Order Status bar chart data, and full lead management.
// ==============================================================================

import { Router } from 'express';
import db from '../db/index.js';
import { verifyToken } from '../utils/security.js';

const router = Router();

/**
 * Middleware: Enforce Administrator Authorization
 */
export function requireAdmin(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({ success: false, error: 'Administrator token required.' });
  }

  const payload = verifyToken(token);
  if (!payload || payload.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Access denied. Administrator privileges required.' });
  }

  req.user = payload;
  next();
}

/**
 * GET /api/admin/stats
 * Aggregate metrics and charts data for the Dark Admin Analytics Dashboard
 */
router.get('/stats', requireAdmin, (req, res) => {
  try {
    const leads = db.prepare('SELECT * FROM leads ORDER BY id DESC').all();
    const users = db.prepare('SELECT * FROM users ORDER BY id DESC').all();
    const clientCount = users.filter(u => u.role !== 'admin').length;

    // 1. Calculate Websites Sold & Category Breakdown
    // Count real leads in active/booked/confirmed/delivered states + baseline portfolio delivered
    const baselineSoldByCategory = {
      'Landing Page / Single Page': 9,
      'Business Website': 7,
      'Restaurant & Café Website': 5,
      'Local Shop / Boutique Website': 4,
      '3D & Interactive Web Experience': 3,
    };

    // Add confirmed leads from database
    leads.forEach(l => {
      const type = l.project_type || 'Landing Page / Single Page';
      if (['Confirmed', 'Payment', 'Development', 'Delivered', 'booked'].includes(l.status)) {
        baselineSoldByCategory[type] = (baselineSoldByCategory[type] || 0) + 1;
      }
    });

    const totalWebsitesSold = Object.values(baselineSoldByCategory).reduce((a, b) => a + b, 0);

    const pieChartCategories = [
      {
        id: 'landing_pages',
        name: 'Landing Page / Single Page',
        count: baselineSoldByCategory['Landing Page / Single Page'] || 9,
        color: '#10B981', // Emerald green
        percentage: Math.round(((baselineSoldByCategory['Landing Page / Single Page'] || 9) / totalWebsitesSold) * 100),
      },
      {
        id: 'business',
        name: 'Business Website (Multi-Page)',
        count: baselineSoldByCategory['Business Website'] || 7,
        color: '#0EA5E9', // Sky blue
        percentage: Math.round(((baselineSoldByCategory['Business Website'] || 7) / totalWebsitesSold) * 100),
      },
      {
        id: 'restaurant',
        name: 'Restaurant & Café Website',
        count: baselineSoldByCategory['Restaurant & Café Website'] || 5,
        color: '#FF5400', // ANURGO Orange
        percentage: Math.round(((baselineSoldByCategory['Restaurant & Café Website'] || 5) / totalWebsitesSold) * 100),
      },
      {
        id: 'boutique',
        name: 'Local Shop / Boutique Showcase',
        count: baselineSoldByCategory['Local Shop / Boutique Website'] || 4,
        color: '#F59E0B', // Amber
        percentage: Math.round(((baselineSoldByCategory['Local Shop / Boutique Website'] || 4) / totalWebsitesSold) * 100),
      },
      {
        id: 'interactive_3d',
        name: '3D & Interactive Experience',
        count: baselineSoldByCategory['3D & Interactive Web Experience'] || 3,
        color: '#EC4899', // Pink
        percentage: Math.round(((baselineSoldByCategory['3D & Interactive Web Experience'] || 3) / totalWebsitesSold) * 100),
      },
    ];

    // 2. Sales Overview (Wave Chart Data: Visits vs Sales)
    const salesOverview = [
      { day: 'Mo', visits: 7, sales: 8 },
      { day: 'Tu', visits: 19, sales: 30 },
      { day: 'We', visits: 13, sales: 16 },
      { day: 'Th', visits: 11, sales: 24 },
      { day: 'Fr', visits: 17, sales: 9 },
      { day: 'Sa', visits: 8, sales: 15 },
      { day: 'Su', visits: 22, sales: 28 },
    ];

    // 3. Order Status (Monthly Bar Chart Data)
    const orderStatus = [
      { month: 'Jan', orders: 9 },
      { month: 'Feb', orders: 7 },
      { month: 'Mar', orders: 14 },
      { month: 'Apr', orders: 10 },
      { month: 'May', orders: 12 },
      { month: 'Jun', orders: 8 },
    ];

    // 4. Summary Metric Cards
    const metrics = {
      totalWebsitesSold,
      totalRevenue: '₹2,48,500',
      totalRevenueUSD: '$3,150',
      totalOrders: totalWebsitesSold + leads.length,
      activeClients: clientCount,
      totalLeads: leads.length,
      growthRate: '+25%',
    };

    return res.json({
      success: true,
      metrics,
      pieChartCategories,
      salesOverview,
      orderStatus,
    });
  } catch (err) {
    console.error('Admin stats error:', err);
    return res.status(500).json({ success: false, error: 'Failed to generate admin statistics.' });
  }
});

/**
 * GET /api/admin/leads
 * Return full list of client project inquiries with status
 */
router.get('/leads', requireAdmin, (req, res) => {
  try {
    const leads = db.prepare('SELECT * FROM leads ORDER BY id DESC').all();
    return res.json({
      success: true,
      count: leads.length,
      data: leads.map(l => ({
        submissionId: l.lead_id,
        fullName: l.full_name,
        email: l.email,
        phone: l.phone,
        businessName: l.business_name || 'Project',
        projectType: l.project_type,
        budget: l.budget,
        timeline: l.timeline,
        details: l.details,
        status: l.status,
        emailVerified: Boolean(l.email_verified),
        phoneVerified: Boolean(l.phone_verified),
        source: l.source,
        createdAt: l.created_at,
      })),
    });
  } catch (err) {
    console.error('Admin leads fetch error:', err);
    return res.status(500).json({ success: false, error: 'Failed to fetch leads.' });
  }
});

/**
 * PATCH /api/admin/leads/:submissionId/status
 * Admin 1-click status switcher (e.g. Brief Received -> Review -> Discussion -> Confirmed -> Delivered)
 */
router.patch('/leads/:submissionId/status', requireAdmin, (req, res) => {
  try {
    const { submissionId } = req.params;
    const { status } = req.body;

    const statusMap = {
      'new': 'Brief Received',
      'contacted': 'Review',
      'in_progress': 'Development',
      'in progress': 'Development',
      'closed': 'Delivered',
      'brief received': 'Brief Received',
      'review': 'Review',
      'discussion': 'Discussion',
      'proposal': 'Proposal',
      'confirmed': 'Confirmed',
      'payment': 'Payment',
      'development': 'Development',
      'delivered': 'Delivered',
      'archived': 'Archived',
      'booked': 'Confirmed',
    };

    const targetStatus = statusMap[(status || '').toLowerCase().trim()] || 'Brief Received';

    const stmt = db.prepare(`
      UPDATE leads 
      SET status = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE lead_id = ?
    `);

    const result = stmt.run(targetStatus, submissionId);

    if (result.changes === 0) {
      return res.status(404).json({ success: false, error: 'Project brief not found.' });
    }

    console.log(`👑 [ADMIN ACTION] Project ${submissionId} status updated to: "${targetStatus}"`);

    return res.json({
      success: true,
      message: `Project ${submissionId} status updated to ${targetStatus}.`,
      submissionId,
      status: targetStatus,
    });
  } catch (err) {
    console.error('Admin status update error:', err);
    return res.status(500).json({ success: false, error: 'Failed to update project status.' });
  }
});

export default router;
