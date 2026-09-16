-- ==============================================================================
-- ANURGO STUDIO — SAMPLE SEED DATA
-- ==============================================================================

-- Sample Leads
INSERT OR IGNORE INTO leads (lead_id, full_name, email, business_name, phone, project_type, budget, timeline, details, status)
VALUES 
  ('ANR-1011', 'Vikram Malhotra', 'vikram@urbanroast.in', 'Urban Roast Café', '+91 98765 43210', 'Restaurant & Café Website', '₹7,000 – ₹15,000', '1–2 Weeks', 'Need an aesthetic digital menu, Google Map location, and direct WhatsApp order button.', 'Brief Received'),
  ('ANR-1022', 'Aisha Khan', 'aisha.boutique@gmail.com', 'Velvet Loom Apparel', '+91 91234 56789', 'Local Shop / Boutique Website', '₹3,000 – ₹7,000', '2–4 Weeks', 'Small clothing boutique in Ranchi. Want customers to browse new collections and ping on WhatsApp to buy.', 'Discussion'),
  ('ANR-1033', 'Dr. Rajiv Sen', 'dr.rajivsen@cliniccare.org', 'Sen Dental Clinic', '+91 99887 76655', 'Business Website', '₹7,000 – ₹15,000', 'Flexible', 'Simple patient booking and showcase of treatments.', 'Review');

-- Sample Feedback
INSERT OR IGNORE INTO feedback (rating, category, message, user_name, user_role, is_approved_testimonial)
VALUES
  (5, 'speed', 'Insane performance! Everything loaded sub-second and the animations are silky smooth.', 'Karan Mehta', 'Founder @ TechNest', 1),
  (5, 'design', 'The dark aesthetics and 3D interactions look like an award-winning Awwwards site. Handcrafted quality is obvious.', 'Priya Sharma', 'Brand Strategist', 1),
  (5, 'copilot', 'The ANURGO AI chatbot is surprisingly conversational. It understood my clothing shop idea immediately!', 'Rohit Verma', 'Local Business Owner', 1);

-- Sample Chat Session
INSERT OR IGNORE INTO chat_sessions (session_id, title, language, business_type, detected_budget, message_count)
VALUES 
  ('session-demo-01', 'Clothing shop showcase inquiry', 'en', 'clothing shop', '₹8,000', 4);

-- Sample Chat Messages
INSERT OR IGNORE INTO chat_messages (session_id, sender, text)
VALUES
  ('session-demo-01', 'user', 'Bro I have a small clothing shop and I want to get it online.'),
  ('session-demo-01', 'ai', 'Absolutely. A website could work really well for a clothing shop. Do you mainly want customers to browse your products and contact you on WhatsApp, or are you looking for full online ordering as well?'),
  ('session-demo-01', 'user', 'WhatsApp is enough for now.'),
  ('session-demo-01', 'ai', 'Got it — a digital lookbook showcase with direct WhatsApp ordering! What kind of budget are you working with?');

-- Sample Analytics
INSERT OR IGNORE INTO site_analytics (page_path, referrer, user_agent, screen_resolution)
VALUES
  ('/', 'https://google.com', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', '1920x1080'),
  ('/#work', 'https://github.com', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', '1440x900'),
  ('/#contact', 'direct', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)', '390x844');
