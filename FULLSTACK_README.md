# ANURGO Studio — Complete Full-Stack Web Application

Welcome to the complete full-stack codebase of **ANURGO Studio** — handcrafted digital experiences, modern 3D interactions, conversational AI assistant, and a production-ready backend API with an embedded SQLite database.

Founder & Developer: **Anurag Chauhan**  
Tech Stack: **React 19 + TypeScript + Vite + Tailwind CSS + Framer Motion + Express.js + SQLite**

---

## 📁 Repository & Project Structure

```text
anurgo-fullstack/
├── src/                          # 🎨 Frontend React + TypeScript Application
│   ├── components/
│   │   ├── common/               # Reusable UI, ANURGO AI Chatbot, Demo Caution Barrier, Modals
│   │   ├── layout/               # Navbar, Footer
│   │   └── sections/             # Hero, About, Services, Process, Work, Terms, Contact
│   ├── data/
│   │   └── anurgoData.ts         # Portfolio concepts, studio copy, services data
│   ├── App.tsx                   # Main layout assembly & navigation router
│   └── main.tsx                  # React DOM root mounting
├── public/                       # Static assets (images, logos, 3D icons, and ZIP download)
├── server/                       # 🚀 Dedicated Node.js + Express REST API Backend
│   ├── src/
│   │   ├── db/
│   │   │   └── index.js          # SQLite connection manager & auto-migrator
│   │   ├── routes/
│   │   │   ├── leads.js          # Project Brief submissions (POST/GET/PATCH)
│   │   │   ├── feedback.js       # Visitor feedback submissions & testimonials
│   │   │   ├── chat.js           # Chatbot turn-by-turn conversation logs
│   │   │   └── analytics.js      # Page views & studio stats dashboard
│   │   └── server.js             # Express application entry point (Port 5000)
│   ├── package.json              # Server dependencies & scripts
│   └── .env.example              # Server environment template
├── database/                     # 💾 Zero-Config SQLite Database
│   ├── anurgo.db                 # Pre-initialized SQLite database
│   ├── schema.sql                # Complete SQL table definitions
│   ├── seed.sql                  # Realistic sample leads, feedback & chats
│   └── init-db.js                # One-step database bootstrap script
├── package.json                  # Root scripts to run Frontend & Backend
├── vite.config.ts                # Vite build and dev configuration
└── FULLSTACK_README.md           # This comprehensive documentation
```

---

## ⚡ Quick Start (Run Locally in 2 Minutes)

### Prerequisites
- **Node.js**: v20 or v22+ installed (Tested and optimized on Node v24)
- **npm**: v9+

### 1. Install Dependencies
```bash
npm install
```

### 2. Initialize the Database (One-time setup)
The repository includes a ready-to-use `database/anurgo.db`. If you ever want to re-create or reset it with fresh tables and seed data, simply run:
```bash
node database/init-db.js
```

### 3. Start the Backend API Server
In a terminal, start the Express API:
```bash
node server/src/server.js
```
The server will run on:
- **API URL:** `http://localhost:5000`
- **Health Check:** `http://localhost:5000/api/health`

### 4. Start the Frontend Application
In a separate terminal, launch Vite dev server:
```bash
npm run dev
```
Open **`http://localhost:5173`** in your browser to view the live studio!

---

## 📡 REST API Reference

All endpoints return standard JSON responses with `{ success: true, ... }`.

### 1. Project Briefs & Leads (`/api/leads`)
- **`POST /api/leads`**: Submit a new project inquiry from the contact form.
  - **Payload:**
    ```json
    {
      "fullName": "Aisha Sharma",
      "email": "aisha@example.com",
      "businessName": "Aura Luxe",
      "phone": "+91 9876543210",
      "projectType": "Clothing Shop Showcase",
      "budget": "₹7,000 – ₹15,000",
      "timeline": "2 Weeks",
      "details": "WhatsApp catalog lookbook with fast edge CDN."
    }
    ```
- **`GET /api/leads`**: Retrieve all saved inquiries (sorted by newest first).
- **`PATCH /api/leads/:leadId/status`**: Update inquiry status (`new`, `contacted`, `in_discussion`, `proposal_sent`, `booked`, `archived`).

### 2. Client & Visitor Feedback (`/api/feedback`)
- **`POST /api/feedback`**: Submit feedback from the floating feedback modal.
  - **Payload:**
    ```json
    {
      "rating": 5,
      "category": "design",
      "message": "The interactive 3D physics and dark aesthetics look stunning!",
      "userName": "Karan M.",
      "userRole": "Founder"
    }
    ```
- **`GET /api/feedback`**: Retrieve all feedback entries (pass `?testimonialsOnly=true` to get approved testimonials).

### 3. ANURGO AI Chatbot Sessions (`/api/chat`)
- **`POST /api/chat/sync-session`**: Syncs turn-by-turn conversation messages from the browser to the database.
- **`GET /api/chat/sessions`**: Lists recent conversation sessions.
- **`GET /api/chat/session/:sessionId/messages`**: Retrieves full message history for a specific chat.

### 4. Site Analytics & Stats (`/api/analytics`)
- **`POST /api/analytics/hit`**: Logs page visits and device metadata.
- **`GET /api/analytics/stats`**: Returns summary metrics (Total Inquiries, New Leads, Feedback Count, Total Views, Active Chats).

---

## 💾 Database Schema

The database uses SQLite via Node.js native engine with zero native build compile requirements:

1. **`leads`**:
   - `id`, `lead_id`, `full_name`, `email`, `business_name`, `phone`, `project_type`, `budget`, `timeline`, `details`, `status`, `created_at`, `updated_at`.
2. **`feedback`**:
   - `id`, `rating`, `category`, `message`, `user_name`, `user_role`, `is_approved_testimonial`, `created_at`.
3. **`chat_sessions`**:
   - `id`, `session_id`, `title`, `language`, `business_type`, `detected_budget`, `message_count`, `created_at`, `updated_at`.
4. **`chat_messages`**:
   - `id`, `session_id`, `sender` ('user' | 'ai'), `text`, `timestamp`.
5. **`site_analytics`**:
   - `id`, `page_path`, `referrer`, `user_agent`, `screen_resolution`, `created_at`.

---

## 🚀 Production Deployment Guide

### Deploying the Frontend:
1. Build production bundle:
   ```bash
   npm run build
   ```
2. Deploy the `dist/` directory to **Vercel**, **Netlify**, or **Cloudflare Pages**.
3. Set environment variable: `VITE_API_URL=https://your-backend-api.com`.

### Deploying the Backend:
1. Deploy the `server/` directory to **Render**, **Railway**, **Fly.io**, or any Ubuntu/VPS server.
2. Set environment variables:
   - `PORT=5000`
   - `CLIENT_URL=https://your-portfolio-domain.com`
   - `DATABASE_PATH=../database/anurgo.db` (or mount a persistent volume).

---

## 🔒 Security & Best Practices
- CORS enabled with configurable origin security.
- Input sanitation and SQL parameterized queries to prevent injection.
- Zero client-side exposure of secret API keys.
- Lightweight SQLite embedded database requires zero separate database server processes.

---

Crafted with passion by **Anurag Chauhan** • Founder of **ANURGO Studio**.
