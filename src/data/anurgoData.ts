export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  category: string;
  tagline: string;
  description: string;
  features: string[];
  deliverables: string[];
  timeline: string;
  icon: string;
  badge?: string;
  popular?: boolean;
}

export interface PortfolioProject {
  id: string;
  projectNumber: string;
  title: string;
  businessType: string;
  category: 'restaurant' | 'cafe' | 'salon' | 'shop' | 'hotel' | 'service' | 'startup';
  tagline: string;
  summary: string;
  isDemoConcept: true;
  badgeText: string;
  accentColor: string;
  heroImage: string;
  mockupImages: {
    desktop: string;
    tablet: string;
    mobile: string;
  };
  features: string[];
  techStack: string[];
  livePreviewData: {
    heroHeadline: string;
    heroSubtitle: string;
    ctaLabel: string;
    stats: { label: string; value: string }[];
    sampleMenuOrOfferings?: { name: string; desc: string; price: string }[];
    colorPalette: { name: string; hex: string }[];
    typography: string;
  };
  caseStudy: {
    projectGoal: string;
    designApproach: string;
    keyFeatures: string[];
    technicalArchitecture: string[];
    designOutcome: string;
    performanceMetrics: {
      lighthouse: number;
      loadTime: string;
      mobileScore: number;
      seoScore: number;
    };
  };
}

export interface ShowcaseConcept {
  id: string;
  title: string;
  conceptNumber: string;
  category: string;
  tagline: string;
  image: string;
  accentColor: string;
  metrics: string;
  tech: string[];
  demoBadge: string;
}

export interface WhyAnurgoPoint {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  badge: string;
}

export interface ProcessStep {
  step: string;
  number: string;
  title: string;
  duration: string;
  description: string;
  deliverables: string[];
  details: string;
  icon: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export const ANURGO_BRAND = {
  name: 'ANURGO',
  founderName: 'Anurag Chauhan',
  role: 'B.Tech CSE • 2nd Year',
  primaryHeadline: "HI, I'M ANURAG CHAUHAN",
  subHeadline: 'B.Tech CSE Student & Creative Developer crafting digital experiences people remember.',
  educationDetail: 'B.Tech CSE • 2nd Year\nAmity University Jharkhand',
  university: 'Amity University Jharkhand',
  educationBalanceNote: 'Balancing my studies with hands-on web development and real-world projects.',
  missionStatement: 'ANURGO is built to turn web development and design skills into real-world commercial impact for local shops, restaurants, cafés, malls, and growing brands.',
  availabilityStatus: 'AVAILABLE FOR SELECT PROJECTS',
  bio: 'ANURGO is the personal portfolio and creative web studio of Anurag Chauhan — a 2nd Year B.Tech Computer Science and Engineering student at Amity University Jharkhand dedicated to building distinctive, responsive, and purposeful websites for real businesses.',
  story: 'ANURGO is my personal portfolio and creative web studio, built to turn my web development and design skills into real-world projects. I focus on creating distinctive, responsive, and purposeful websites for businesses such as local shops, restaurants, cafés, malls and growing brands.',
  transparencyManifesto: 'As I’m starting out, I believe in building trust through transparency rather than fake social proof. I will never fill ANURGO with fabricated projects or testimonials. Instead, the portfolio will grow with my real client work, showing the websites I actually create and deliver, along with relevant project details and delivery history.',
  purposeSummary: 'The purpose of ANURGO is simple: create memorable websites, build a genuine track record through real projects, and give future clients confidence in the person behind the work.',
  trustPillars: [
    {
      title: '100% Real Work Only',
      tag: 'Zero Fake Social Proof',
      desc: 'No fabricated project screenshots or fake client reviews. The studio grows strictly through real client deliverables and verified project history.',
      icon: 'ShieldCheck',
    },
    {
      title: 'Built For Real Businesses',
      tag: 'Thoughtful Digital Craft',
      desc: 'I focus on creating distinctive, responsive and purposeful websites for real businesses.',
      icon: 'Palette',
    },
    {
      title: 'Direct Creator Access',
      tag: '1-on-1 Collaboration',
      desc: 'Work directly with me (Anurag). Zero account managers, zero bloated agency markups, and complete transparency on timelines and deliverables.',
      icon: 'HeartHandshake',
    },
    {
      title: 'Engineered For Real Brands',
      tag: 'Local & Commercial Impact',
      desc: 'Tailored for restaurants, cafés, retail shops, malls, salons, and ambitious founders who need distinctive websites that convert visitors into revenue.',
      icon: 'Store',
    },
  ],
  email: 'workwithanuragchauhan@gmail.com',
  whatsapp: 'Contact via WhatsApp',
  whatsappLink: 'https://wa.me/917991192205?text=Hi%20Anurag!%20I%20would%20like%20to%20discuss%20a%20project%20with%20ANURGO.',
  github: 'https://github.com/officialdarkdevil303',
  linkedin: 'https://www.linkedin.com/in/anurag-chauhan-903b29380',
  fiverr: 'https://www.fiverr.com/s/Q2Y0NpP',
  location: 'Global Creative Studio & Engineering',
};

export const SERVICES: ServiceItem[] = [
  {
    id: 'business-websites',
    number: '01',
    title: 'BUSINESS WEBSITES',
    category: 'Corporate & Professional',
    tagline: 'Modern websites designed around your business, audience, and commercial goals.',
    description: 'Bespoke multi-page architectures built for clinics, law practices, agencies, consultancies, and service brands. Turn local searchers into high-intent inquiries with zero friction.',
    features: [
      'Bespoke visual identity tailored to your exact industry and audience',
      'High-conversion lead qualification funnels & contact routing',
      'Local Schema.org & Google Map Pack SEO optimization',
      'Global edge CDN hosting with ultra-fast sub-second load times'
    ],
    deliverables: [
      'Custom Multi-Page Architecture',
      'Interactive Quote / Lead Engine',
      '100% Mobile & Touch Optimization',
      'Complete Source Code Handoff'
    ],
    timeline: '2 – 3 Weeks',
    icon: 'Building2',
    popular: true,
  },
  {
    id: 'restaurant-cafe',
    number: '02',
    title: 'RESTAURANT & CAFÉ WEBSITES',
    category: 'Dining & Hospitality',
    tagline: 'Visually rich websites for restaurants, cafés, and food businesses.',
    description: 'Engineered specifically for trattorias, cocktail lounges, coffee roasteries, and bistros. Showcase dishes in rich high-fidelity and allow patrons to reserve tables without paying high commissions.',
    features: [
      'Interactive digital menus with instant dietary & allergen filters',
      'Zero-commission table reservation engine integration',
      '1-Tap WhatsApp order link & direct Google Maps navigation',
      'Instagram visual feed sync & review highlight showcase'
    ],
    deliverables: [
      'Sensory Food & Drink Showcase',
      'Interactive Digital Menu System',
      'Direct Table Booking Integration',
      'Local Foodie Search Optimization'
    ],
    timeline: '1.5 – 2.5 Weeks',
    icon: 'UtensilsCrossed',
    popular: true,
  },
  {
    id: 'local-business',
    number: '03',
    title: 'LOCAL BUSINESS WEBSITES',
    category: 'Shops, Salons & Hotels',
    tagline: 'Professional online presence for shops, salons, hotels, and local services.',
    description: 'For fashion boutiques, artisan gift shops, salons, and neighborhood businesses that need a clean digital home connecting in-person foot traffic with online discovery.',
    features: [
      'Interactive service & treatment menus with clear transparent pricing',
      'In-store inventory & appointment booking flow',
      'Click-and-collect and direct inquiry routing',
      'Neighborhood map integration and verified business credentials'
    ],
    deliverables: [
      'Local Storefront Experience',
      'Appointment & Inquiry Funnel',
      'Product & Service Lookbook',
      'Local Business Schema Setup'
    ],
    timeline: '2 – 3 Weeks',
    icon: 'ShoppingBag',
  },
  {
    id: 'landing-pages',
    number: '04',
    title: 'LANDING PAGES',
    category: 'Campaigns & Products',
    tagline: 'Focused landing pages designed to clearly communicate a product, service, or offer.',
    description: 'Single-page powerhouses engineered around one clear call-to-action. Loads in under 0.6 seconds so you never lose ad clicks or social visitors to blank loading screens.',
    features: [
      'Psychology-driven visual hierarchy that eliminates exit distractions',
      'Sub-second load times (< 0.6s) to minimize mobile ad bounce rates',
      'A/B test ready layout with tracking & pixel integrations',
      'Direct CRM sync with Mailchimp, ConvertKit, or WhatsApp'
    ],
    deliverables: [
      'High-Conversion Single Page',
      'Subtle Micro-Animations',
      'Lead Capture Pipeline',
      'Analytics & Pixel Setup'
    ],
    timeline: '5 – 8 Days',
    icon: 'Flame',
  },
  {
    id: 'website-redesign',
    number: '05',
    title: 'WEBSITE REDESIGN',
    category: 'Modernization & Speed',
    tagline: 'Modernizing outdated websites with better UI, responsiveness, and user experience.',
    description: 'If your current site looks like an ancient template, crawls on mobile phones, or fails to generate inquiries, we rebuild it from the ground up with clean code and modern aesthetics.',
    features: [
      'Modern, razor-sharp dark UI aesthetic matching top-tier brands',
      'Preservation of all existing Google search ranking equity & URLs',
      'Massive speed upgrade (targeting 95+ Google Lighthouse scores)',
      'Frictionless user flow guiding visitors straight to the contact CTA'
    ],
    deliverables: [
      'Complete Visual & Code Revamp',
      '301 SEO Migration Mapping',
      'Mobile-First Touch Overhaul',
      'WebP/AVIF Asset Optimization'
    ],
    timeline: '2 – 3 Weeks',
    icon: 'RefreshCw',
  },
  {
    id: 'custom-web-experiences',
    number: '06',
    title: 'CUSTOM WEB EXPERIENCES',
    category: 'Bespoke Interactions',
    tagline: 'Unique websites with custom interactions, animations, and visual systems.',
    description: 'When template page builders fall short, we write clean, custom React/TypeScript applications with custom price estimators, live appointment selectors, and interactive portals.',
    features: [
      'Custom interactive calculators and real-time estimators',
      'Multi-step booking funnels with email/SMS confirmation hooks',
      'Smooth GPU-accelerated micro-animations without sluggishness',
      'Scalable cloud edge architecture that never crashes under traffic spikes'
    ],
    deliverables: [
      'Custom Interactive Web Architecture',
      'Bespoke User Workflows',
      'API & Database Integrations',
      'Cloud Edge Deployment'
    ],
    timeline: '3 – 5 Weeks',
    icon: 'Code2',
  }
];

export const SHOWCASE_CONCEPTS: ShowcaseConcept[] = [
  {
    id: 'sc-restaurant',
    title: 'Savoria Trattoria & Cellar',
    conceptNumber: '01',
    category: 'Restaurant',
    tagline: 'Old-world Italian culinary heritage meets modern digital table reservation.',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80',
    accentColor: '#FF5400',
    metrics: '0.58s Load • 100 SEO',
    tech: ['React 19', 'Tailwind', 'Digital Menu'],
    demoBadge: 'DEMO CONCEPT',
  },
  {
    id: 'sc-cafe',
    title: 'Aura Artisan Coffee Roasters',
    conceptNumber: '02',
    category: 'Café & Roastery',
    tagline: 'Single-origin micro-lots, tasting notes wheel & bean subscription builder.',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1000&q=80',
    accentColor: '#F59E0B',
    metrics: '0.52s Load • 100 Mobile',
    tech: ['TypeScript', 'Subscription UI', 'Google Maps'],
    demoBadge: 'DEMO CONCEPT',
  },
  {
    id: 'sc-hotel',
    title: 'Solstice Alpine Resort & Spa',
    conceptNumber: '03',
    category: 'Hotel & Lodge',
    tagline: 'Panoramic chalet suites, hot spring tub guides & direct room booking.',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80',
    accentColor: '#06B6D4',
    metrics: '0.61s Load • 99 Performance',
    tech: ['Vite', 'Room Matrix', 'Direct Booking'],
    demoBadge: 'DEMO CONCEPT',
  },
  {
    id: 'sc-salon',
    title: 'Lumière Aesthetics & Hair',
    conceptNumber: '04',
    category: 'Salon & Spa',
    tagline: 'Precision color transformations, stylist portfolios & 1-tap booking.',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1000&q=80',
    accentColor: '#F43F5E',
    metrics: '0.62s Load • 100 Accessibility',
    tech: ['React 19', 'Lookbook UI', 'Stylist Selector'],
    demoBadge: 'DEMO CONCEPT',
  },
  {
    id: 'sc-shop',
    title: 'Velvet & Vine Boutique',
    conceptNumber: '05',
    category: 'Local Shop',
    tagline: 'Curated fashion lookbooks, local store pickup & friction-free checkout.',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1000&q=80',
    accentColor: '#10B981',
    metrics: '0.54s Load • 100 Best Practices',
    tech: ['E-Commerce UI', 'Stock Checker', 'Click & Collect'],
    demoBadge: 'DEMO CONCEPT',
  },
  {
    id: 'sc-startup',
    title: 'Nexus Intelligence SaaS',
    conceptNumber: '06',
    category: 'Startup',
    tagline: 'High-conversion product landing page for next-generation developer tooling.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80',
    accentColor: '#A855F7',
    metrics: '0.49s Load • 100/100 Vitals',
    tech: ['React 19', 'Interactive Graphs', 'Waitlist Sync'],
    demoBadge: 'DEMO CONCEPT',
  },
  {
    id: 'sc-portfolio',
    title: 'Kroma Creative Studio',
    conceptNumber: '07',
    category: 'Portfolio',
    tagline: 'Visual portfolio experience for an independent architectural photographer.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
    accentColor: '#FF7824',
    metrics: '0.55s Load • Zero Layout Shift',
    tech: ['Grid Masonry', 'Lightbox', 'WebP Assets'],
    demoBadge: 'DEMO CONCEPT',
  },
  {
    id: 'sc-service',
    title: 'Apex Performance Clinic',
    conceptNumber: '08',
    category: 'Service Business',
    tagline: 'Bespoke client onboarding, transparent pricing tiers & consultation scheduler.',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1000&q=80',
    accentColor: '#F59E0B',
    metrics: '0.59s Load • 100 SEO',
    tech: ['TypeScript', 'Form Validation', 'SMS Webhooks'],
    demoBadge: 'DEMO CONCEPT',
  }
];

export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    id: 'savoria-trattoria',
    projectNumber: '01',
    title: 'Savoria Trattoria & Wine Bar',
    businessType: 'Artisanal Italian Trattoria',
    category: 'restaurant',
    tagline: 'Handmade heritage pasta, wood-fired Florentine cuts, and an interactive sommelier cellar.',
    summary: 'A warm, atmospheric dining portal engineered for a premier Italian trattoria. Features high-res macro culinary visuals, real-time table booking, seasonal antipasti menus, and curated cellar vintages.',
    isDemoConcept: true,
    badgeText: 'DEMO CONCEPT',
    accentColor: '#FF5400',
    heroImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
    mockupImages: {
      desktop: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
      tablet: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80',
      mobile: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
    },
    features: [
      'Interactive culinary menu with dietary toggles (Gluten-Free, Vegan, Chef Special)',
      'Zero-commission table reservation engine with instant SMS confirmation simulation',
      'Interactive Sommelier tasting guide with regional pairing notes',
      'Private dining & event booking inquiry pipeline'
    ],
    techStack: ['React 19', 'TypeScript', 'Tailwind CSS', 'Schema.org Restaurant JSON-LD'],
    livePreviewData: {
      heroHeadline: 'Old-World Italian Heritage. Unapologetically Modern Craft.',
      heroSubtitle: 'Hand-rolled egg pasta, wood-fired heritage recipes, and a private cellar of 180+ rare Tuscan vintages in the heart of downtown.',
      ctaLabel: 'Reserve Your Evening Table',
      stats: [
        { label: 'Cellar Vintages', value: '180+' },
        { label: 'Heritage Recipes', value: '45' },
        { label: 'Table Booking Time', value: '< 18s' }
      ],
      sampleMenuOrOfferings: [
        { name: 'Tagliolini al Tartufo Nero', desc: 'Handmade egg ribbon pasta, shaved Umbrian black truffle, 24-month Parmigiano butter', price: '$34' },
        { name: 'Bistecca alla Fiorentina', desc: '45-day dry-aged Chianina beef, rosemary sea salt, wood-fired olive oil embers', price: '$68' },
        { name: 'Brunello di Montalcino Riserva 2017', desc: 'Velvety tannins, dark wild cherry, tobacco leaf, dry French oak finish', price: '$135' }
      ],
      colorPalette: [
        { name: 'Florentine Ember', hex: '#FF5400' },
        { name: 'Charcoal Noir', hex: '#0B0D14' },
        { name: 'Tuscan Gold', hex: '#FBBF24' }
      ],
      typography: 'Anton + Inter'
    },
    caseStudy: {
      projectGoal: 'Engineer an evocative, candlelit digital atmosphere that captures the romance of artisanal Italian dining while slashing reliance on costly third-party booking apps.',
      designApproach: 'Deep dark obsidian backdrops paired with glowing terracotta embers and warm gold accents. High-resolution food photography guides visitors directly into a 2-click table reservation flow.',
      keyFeatures: [
        'Interactive Food & Wine Category Tabs with smooth transitions',
        'Zero-Friction Table Reservation Modal with date/time pickers',
        'Local Schema JSON-LD metadata for Google Map Pack ranking'
      ],
      technicalArchitecture: [
        'Vite + React component architecture for sub-second page transitions',
        'WebP image compression pipeline ensuring < 0.6s First Contentful Paint',
        'Semantic HTML5 structure optimized for local search engines'
      ],
      designOutcome: 'A visually rich digital experience that communicates culinary craftsmanship, eliminates booking friction, and looks stunning on any device.',
      performanceMetrics: {
        lighthouse: 100,
        loadTime: '0.58s',
        mobileScore: 100,
        seoScore: 100
      }
    }
  },
  {
    id: 'aura-coffee',
    projectNumber: '02',
    title: 'Aura Artisan Coffee & Roastery',
    businessType: 'Specialty Coffee Bar & Roastery',
    category: 'cafe',
    tagline: 'Single-origin micro-lots, sensory flavor notes, and recurring bean drops.',
    summary: 'A minimalist, warm modern web presence built for an independent specialty café. Features origin flavor wheel notes, café location finder, weekly bean drop countdowns, and a seamless bean subscription builder.',
    isDemoConcept: true,
    badgeText: 'DEMO CONCEPT',
    accentColor: '#F59E0B',
    heroImage: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80',
    mockupImages: {
      desktop: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80',
      tablet: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
      mobile: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=600&q=80',
    },
    features: [
      'Interactive Tasting Note Wheel (Citrus, Floral, Honey, Chocolate)',
      'Monthly Coffee Subscription Builder with grind preference selector',
      'Daily Fresh Pastry & Brew Schedule update panel',
      'One-tap Google Maps café navigation for morning commuters'
    ],
    techStack: ['React 19', 'TypeScript', 'Tailwind CSS', 'Lucide Icons'],
    livePreviewData: {
      heroHeadline: 'Direct-Trade Micro Lots. Roasted Fresh Every Tuesday.',
      heroSubtitle: 'Ethically sourced from high-altitude Ethiopian and Colombian cooperatives, roasted fresh in small 5kg batches every Tuesday.',
      ctaLabel: 'Shop Fresh Roasts & Subscriptions',
      stats: [
        { label: 'Elevation', value: '2,100m' },
        { label: 'Cup Score', value: '89.5+' },
        { label: 'Roast Cycle', value: 'Weekly' }
      ],
      sampleMenuOrOfferings: [
        { name: 'Ethiopia Yirgacheffe G1', desc: 'Washed heirloom variety. Notes of bergamot, jasmine blossom, and lemon curd', price: '$22' },
        { name: 'Colombia Pink Bourbon', desc: 'Anaerobic natural fermentation. Notes of wild strawberry, cacao nibs, and guava', price: '$26' },
        { name: 'Oat Flat White & Cardamom Bun', desc: 'Double ristretto with silky steamed oat milk and fresh Swedish cardamom bun', price: '$9.50' }
      ],
      colorPalette: [
        { name: 'Espresso Crema', hex: '#F59E0B' },
        { name: 'Dark Roast', hex: '#120D08' },
        { name: 'Oat Milk', hex: '#FDF6ED' }
      ],
      typography: 'Anton + JetBrains Mono'
    },
    caseStudy: {
      projectGoal: 'Create a stylish, lifestyle-driven website for a boutique roastery that drives morning foot-traffic and recurring high-margin coffee subscriptions.',
      designApproach: 'Warm espresso gradients, tactile typography, and sensory cues like roast elevation counters and flavor wheel notes.',
      keyFeatures: [
        'Interactive Flavor Profile visualizer',
        'Subscription Frequency Selector (Every 2 Weeks / Monthly)',
        'Click-and-Collect coffee counter pickup flow'
      ],
      technicalArchitecture: [
        'React state management for customizable subscription bundles',
        'Lightweight CSS grid layout with crisp SVG micro-illustrations',
        'Mobile touch-optimized bottom action bar for on-the-go orders'
      ],
      designOutcome: 'A modern, community-centered digital hub that elevates the roastery into an aspirational lifestyle brand.',
      performanceMetrics: {
        lighthouse: 100,
        loadTime: '0.52s',
        mobileScore: 100,
        seoScore: 100
      }
    }
  },
  {
    id: 'lumiere-salon',
    projectNumber: '03',
    title: 'Lumière Aesthetics & Hair Studio',
    businessType: 'Luxury Salon, Hair & MedSpa',
    category: 'salon',
    tagline: 'Precision color transformations, Japanese scalp therapies, and couture styling.',
    summary: 'A luxurious, serene web platform designed for an upscale salon and aesthetic lounge. Includes stylist lookbook portfolios, treatment pricing tiers, and an intuitive appointment reservation flow.',
    isDemoConcept: true,
    badgeText: 'DEMO CONCEPT',
    accentColor: '#F43F5E',
    heroImage: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80',
    mockupImages: {
      desktop: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80',
      tablet: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
      mobile: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=600&q=80',
    },
    features: [
      'Interactive treatment menu with duration and transparent pricing',
      'Stylist spotlight portfolios with before-and-after transformation galleries',
      'Step-by-step treatment booking modal with stylist selection',
      'Gift card purchase and client consultation quiz'
    ],
    techStack: ['React 19', 'TypeScript', 'Tailwind CSS', 'Framer Motion Principles'],
    livePreviewData: {
      heroHeadline: 'Where Modern Couture Meets Restorative Luxury',
      heroSubtitle: 'Custom balayage, precision couture cuts, and botanical scalp therapies tailored to your unique personal aesthetic.',
      ctaLabel: 'Book Your Salon Experience',
      stats: [
        { label: 'Master Stylists', value: '8' },
        { label: 'Client Rating', value: '4.9 ★' },
        { label: 'Organic Products', value: '100%' }
      ],
      sampleMenuOrOfferings: [
        { name: 'Signature French Balayage', desc: 'Hand-painted dimensional highlights, gloss toner, Olaplex bond rebuild & blowout', price: '$280' },
        { name: 'Botanical Scalp & Hair Ritual', desc: 'Japanese head spa wash, eucalyptus steam therapy, lymphatic scalp massage', price: '$145' },
        { name: 'Couture Precision Cut & Style', desc: 'Consultation, customized dry texturizing cut, luxury conditioning glaze', price: '$110' }
      ],
      colorPalette: [
        { name: 'Champagne Rose', hex: '#F43F5E' },
        { name: 'Midnight Velvet', hex: '#0D0E15' },
        { name: 'Pearl Mist', hex: '#F8FAFC' }
      ],
      typography: 'Anton + Inter'
    },
    caseStudy: {
      projectGoal: 'Develop a high-converting, elegant digital home for an upscale salon that allows clients to browse stylists, view before/after results, and book appointments without calling.',
      designApproach: 'We implemented subtle glassmorphic cards, delicate champagne accents, and soft photographic transitions to radiate an immediate feeling of relaxation and luxury.',
      keyFeatures: [
        'Before & After Interactive Photo Reveal Sliders',
        'Stylist Selection & Service Duration Matrix',
        'Mobile-friendly instant appointment request flow'
      ],
      technicalArchitecture: [
        'Componentized service catalog with smooth client-side filtering',
        'Optimized responsive image loading with WebP/AVIF formats',
        'Zero-layout shift (CLS = 0.00) for flawless luxury browsing'
      ],
      designOutcome: 'A high-end salon portal that elevates brand perception and increases high-ticket service bookings.',
      performanceMetrics: {
        lighthouse: 99,
        loadTime: '0.62s',
        mobileScore: 100,
        seoScore: 100
      }
    }
  },
  {
    id: 'velvet-vine',
    projectNumber: '04',
    title: 'Velvet & Vine Boutique',
    businessType: 'Curated Fashion & Lifestyle Store',
    category: 'shop',
    tagline: 'Independent designer apparel, handcrafted leather accessories, and sustainable goods.',
    summary: 'A contemporary e-commerce and local boutique storefront showcasing seasonal lookbooks, real-time store inventory, click-and-collect pickup, and local designer spotlights.',
    isDemoConcept: true,
    badgeText: 'DEMO CONCEPT',
    accentColor: '#10B981',
    heroImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
    mockupImages: {
      desktop: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
      tablet: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=800&q=80',
      mobile: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=600&q=80',
    },
    features: [
      'Dynamic seasonal lookbook gallery with "Shop This Look" hotspots',
      'In-store stock availability checker for local shoppers',
      'Express click-and-collect checkout simulation with Apple Pay',
      'VIP member early-access drop countdown'
    ],
    techStack: ['React 19', 'TypeScript', 'Tailwind CSS', 'Stripe UI Simulator'],
    livePreviewData: {
      heroHeadline: 'Conscious Luxury & Timeless Wardrobe Staples',
      heroSubtitle: 'Carefully curated independent European labels, sustainable linen garments, and artisanal leather goods crafted to last a lifetime.',
      ctaLabel: 'Explore the Autumn Collection',
      stats: [
        { label: 'Independent Labels', value: '24' },
        { label: 'Sustainable Materials', value: '100%' },
        { label: 'Store Pickup', value: 'Same Day' }
      ],
      sampleMenuOrOfferings: [
        { name: 'Oversized Structured Wool Coat', desc: 'Double-faced Italian virgin wool in Camel with horn buttons', price: '$420' },
        { name: 'Artisan Vegetable-Tanned Tote', desc: 'Hand-stitched Tuscan leather with brass hardware and cotton lining', price: '$310' },
        { name: 'Amber & Smoked Cedar Candle', desc: 'Hand-poured coconut soy wax with 60-hour clean burn time', price: '$48' }
      ],
      colorPalette: [
        { name: 'Forest Emerald', hex: '#10B981' },
        { name: 'Warm Ecru', hex: '#F1EFEA' },
        { name: 'Noir Base', hex: '#0B0E14' }
      ],
      typography: 'Anton + Inter'
    },
    caseStudy: {
      projectGoal: 'Build a boutique retail platform that connects physical neighborhood foot traffic with online digital sales, providing a seamless shopping experience.',
      designApproach: 'Clean editorial fashion layout with ample whitespace, refined typography, and interactive lookbook features that emulate high-fashion print magazines.',
      keyFeatures: [
        'Interactive Lookbook with shoppable product pins',
        'Same-day in-store pickup selector at checkout',
        'Instant variant switching (Sizes, Colors, Fabric Swatches)'
      ],
      technicalArchitecture: [
        'Instant client-side product filtering without page reloads',
        'Fluid image galleries with progressive blur-up placeholders',
        'Schema.org Product & LocalBusiness structured data for rich snippets'
      ],
      designOutcome: 'A stunning retail showcase that drives in-person store visits while facilitating effortless online purchases.',
      performanceMetrics: {
        lighthouse: 100,
        loadTime: '0.54s',
        mobileScore: 99,
        seoScore: 100
      }
    }
  },
  {
    id: 'solstice-hotel',
    projectNumber: '05',
    title: 'Solstice Haven Alpine Resort',
    businessType: 'Boutique Alpine Lodge & Chalets',
    category: 'hotel',
    tagline: 'Panoramic mountain chalets, private hot spring cedar tubs, and farm-to-table dining.',
    summary: 'A breathtaking hospitality website built for a boutique mountain lodge. Features immersive suite tours, winter/summer seasonal experience guides, and a direct room booking engine.',
    isDemoConcept: true,
    badgeText: 'DEMO CONCEPT',
    accentColor: '#06B6D4',
    heroImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    mockupImages: {
      desktop: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
      tablet: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
      mobile: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80',
    },
    features: [
      'Interactive Chalet & Suite tour with 360 view simulation',
      'Direct date-range availability & room rate calculator',
      'Seasonal activity guides (Skiing, Guided Hikes, Hot Springs)',
      'Direct booking guarantee with complimentary welcome aperitivo'
    ],
    techStack: ['React 19', 'TypeScript', 'Tailwind CSS', 'Vite'],
    livePreviewData: {
      heroHeadline: 'Secluded Alpine Luxury Above the Cloudline',
      heroSubtitle: 'Private cedar chalets with floor-to-ceiling peak views, open wood-burning hearths, and natural geothermal mineral baths.',
      ctaLabel: 'Check Room Rates & Availability',
      stats: [
        { label: 'Alpine Chalets', value: '14' },
        { label: 'Geothermal Tubs', value: 'Private' },
        { label: 'Direct Booking Perk', value: 'Free Spa Pass' }
      ],
      sampleMenuOrOfferings: [
        { name: 'The Summit Panorama Suite', desc: 'King canopy bed, freestanding copper tub, private wrap-around terrace, stone fireplace', price: '$580 / night' },
        { name: 'Cedar Forest Chalet', desc: 'Two-bedroom private timber cabin, personal outdoor cedar hot tub, fully equipped kitchen', price: '$820 / night' },
        { name: 'Four-Course Alpine Tasting', desc: 'Locally foraged mushrooms, braised venison, aged mountain gruyère fondue', price: '$95 / guest' }
      ],
      colorPalette: [
        { name: 'Glacier Cyan', hex: '#06B6D4' },
        { name: 'Alpine Void', hex: '#0B0F19' },
        { name: 'Snow Mist', hex: '#F0F9FF' }
      ],
      typography: 'Anton + Inter'
    },
    caseStudy: {
      projectGoal: 'Create an enchanting digital resort experience that drives direct, zero-commission room reservations while showcasing luxury chalet amenities.',
      designApproach: 'Dramatic alpine photography paired with cool glacier cyan lighting, subtle card elevation, and an effortless 3-step room availability flow.',
      keyFeatures: [
        'Chalet Amenities Breakdown & High-Res Gallery',
        'Seasonal Experience Planner (Winter Powder vs. Summer Alpine)',
        'Direct Booking Guarantee with exclusive guest perks'
      ],
      technicalArchitecture: [
        'Vite React SPA with smooth client-side routing',
        'Mobile-first responsive booking bar fixed at bottom on phones',
        'Microdata for hotel rooms, star ratings, and geographical coords'
      ],
      designOutcome: 'A majestic resort showcase that elevates brand prestige and captures high-value guest stays directly.',
      performanceMetrics: {
        lighthouse: 99,
        loadTime: '0.61s',
        mobileScore: 100,
        seoScore: 100
      }
    }
  },
  {
    id: 'apex-performance',
    projectNumber: '06',
    title: 'Apex Athletic Performance & Recovery',
    businessType: 'Private Fitness & Recovery Club',
    category: 'service',
    tagline: 'Biometric conditioning, contrast hydrotherapy, and elite athlete coaching.',
    summary: 'A high-impact, dark athletic portal engineered for a private fitness and longevity club. Includes coach profiles, membership tier comparisons, and a free trial pass request system.',
    isDemoConcept: true,
    badgeText: 'DEMO CONCEPT',
    accentColor: '#FF3366',
    heroImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
    mockupImages: {
      desktop: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
      tablet: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
      mobile: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=600&q=80',
    },
    features: [
      'Interactive Tiered Membership Matrix (Foundation, Athlete, Executive)',
      'Free 1-Day Trial Pass & Biometric Assessment Request Form',
      'Daily Recovery Schedule (Cold Plunge, Infrared Sauna, Normatec)',
      'Private training coach selector with specialty filters'
    ],
    techStack: ['React 19', 'TypeScript', 'Tailwind CSS', 'Lucide Icons'],
    livePreviewData: {
      heroHeadline: 'Train with Intention. Recover with Precision.',
      heroSubtitle: 'State-of-the-art strength facility, contrast hydrotherapy circuits, and private coaching tailored for high-performers.',
      ctaLabel: 'Claim Your Complimentary Guest Pass',
      stats: [
        { label: 'Coaching Roster', value: '12 Elite' },
        { label: 'Cold Plunge Temp', value: '38°F' },
        { label: 'Member Cap', value: '150 Only' }
      ],
      sampleMenuOrOfferings: [
        { name: 'Executive Performance Tier', desc: 'Unlimited club access, 4 monthly 1-on-1 coaching sessions, unlimited contrast therapy', price: '$290 / mo' },
        { name: 'Contrast Recovery Pass', desc: 'Daily access to cold plunge tubs, 200°F dry Finnish cedar saunas, and compression lounge', price: '$140 / mo' },
        { name: 'Biometric VO2 Max Screening', desc: 'Comprehensive lactate threshold, metabolic rate, and body composition analysis', price: '$180' }
      ],
      colorPalette: [
        { name: 'Crimson Surge', hex: '#FF3366' },
        { name: 'Obsidian Void', hex: '#080A10' },
        { name: 'Pure Titanium', hex: '#F8FAFC' }
      ],
      typography: 'Anton + Inter'
    },
    caseStudy: {
      projectGoal: 'Engineer a powerful, high-energy membership acquisition website that positions the club as the premier athletic facility in the metro area.',
      designApproach: 'High-contrast typography, electric neon red accents, and immediate social proof through clear membership deliverables and instant guest pass onboarding.',
      keyFeatures: [
        'Interactive Membership Comparison Matrix with toggleable billing',
        'Lead capture funnel for guest day passes with instant SMS routing',
        'Coach bio popups highlighting certifications and specialties'
      ],
      technicalArchitecture: [
        'React form state with live client-side validation',
        'High-density imagery with adaptive srcset attributes for retina screens',
        'Sub-second load times (< 0.59s) ensuring zero friction for mobile ad visitors'
      ],
      designOutcome: 'A commanding athletic brand that drives premium membership applications and positions the club above generic gyms.',
      performanceMetrics: {
        lighthouse: 100,
        loadTime: '0.59s',
        mobileScore: 100,
        seoScore: 100
      }
    }
  }
];

export const WHY_ANURGO_POINTS: WhyAnurgoPoint[] = [
  {
    id: 'custom-design',
    number: '01',
    title: 'Custom Design',
    subtitle: 'Zero Cookie-Cutter Templates',
    description: 'Every layout, typography pairing, color system, and interaction is designed from scratch around your brand and target audience.',
    icon: 'Palette',
    badge: '100% Bespoke'
  },
  {
    id: 'mobile-responsive',
    number: '02',
    title: 'Mobile Responsive',
    subtitle: 'Flawless Touch Experience',
    description: 'Over 70% of local customers browse on phones. Your website is meticulously tailored for iPhones, Androids, tablets, and desktop displays.',
    icon: 'Smartphone',
    badge: 'Touch-Optimized'
  },
  {
    id: 'modern-ui',
    number: '03',
    title: 'Modern UI',
    subtitle: 'Sophisticated Dark-First Aesthetic',
    description: 'Clean typography, subtle glassmorphism, fine borders, and refined ambient lighting that make your business look like an industry leader.',
    icon: 'Sparkles',
    badge: 'Editorial Polish'
  },
  {
    id: 'performance-focused',
    number: '04',
    title: 'Performance Focused',
    subtitle: 'Sub-Second Load Speeds',
    description: 'Built with React 19 and Vite for lightning-fast speeds (< 0.6s LCP). 95+ Google Lighthouse scores guaranteed for superior SEO.',
    icon: 'Zap',
    badge: '< 0.6s LCP'
  },
  {
    id: 'clear-communication',
    number: '05',
    title: 'Clear Communication',
    subtitle: 'Direct 1-on-1 with Anurag',
    description: 'No account managers, no ticket queues, no confusing jargon. Direct communication on WhatsApp and email throughout the build.',
    icon: 'MessageSquare',
    badge: 'Direct Access'
  },
  {
    id: 'business-focused-design',
    number: '06',
    title: 'Business-Focused Design',
    subtitle: 'Engineered for Inquiries & Sales',
    description: 'Websites structured specifically to convert visitors into reservations, phone calls, walk-in customers, and quote requests.',
    icon: 'Target',
    badge: 'Conversion-Driven'
  },
  {
    id: 'unique-visual-identity',
    number: '07',
    title: 'Unique Visual Identity',
    subtitle: 'Stand Out from Competitors',
    description: 'Your local competitors use generic WordPress themes from 2014. We give your business a distinctive, memorable digital presence.',
    icon: 'ShieldCheck',
    badge: 'Distinctive Brand'
  },
  {
    id: 'smooth-interactions',
    number: '08',
    title: 'Smooth Interactions',
    subtitle: 'GPU-Accelerated Micro-Motion',
    description: 'Carefully controlled animations that enhance user experience and feel fluid without ever slowing down the device.',
    icon: 'Flame',
    badge: '60 FPS Smooth'
  }
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    step: '01',
    number: 'PHASE 01',
    title: 'TELL ME ABOUT YOUR BUSINESS',
    duration: '1 – 3 Days',
    description: 'Understand the business, audience and website goals. We discuss your offerings, unique advantages, local competition, and target customers.',
    deliverables: [
      'Discovery Questionnaire & Strategy Brief',
      'Target Audience & Customer Persona Mapping',
      'Content & Asset Collection Guide',
      'Sitemap & Core Action Definition'
    ],
    details: 'We begin with a focused conversation to dissect what makes your business special. We establish clear goals: whether that means more table bookings, qualified quote requests, direct product purchases, or foot-traffic to your physical shop.',
    icon: 'MessageSquareText'
  },
  {
    step: '02',
    number: 'PHASE 02',
    title: 'PLAN & DESIGN',
    duration: '4 – 7 Days',
    description: 'Create the visual direction and structure. We craft bespoke typography, color systems, component hierarchies, and interactive layouts.',
    deliverables: [
      'High-Fidelity Visual Design Mockups',
      'Bespoke Color Palette & Typography Tokens',
      'Mobile-First Layout Wireframes',
      'Client Review & Design Approval Gate'
    ],
    details: 'No generic pre-made themes. We compose an original visual identity for your website with refined dark-first aesthetics, warm lighting, and clear call-to-action pathways for maximum conversion.',
    icon: 'Palette'
  },
  {
    step: '03',
    number: 'PHASE 03',
    title: 'BUILD & REFINE',
    duration: '1 – 2 Weeks',
    description: 'Develop the website and refine the details. Clean React & TypeScript code, responsive touch optimization, and lightning-fast edge performance.',
    deliverables: [
      'Full React/TypeScript Codebase',
      'Responsive Touch Optimization (Mobile/Tablet/Desktop)',
      'Sub-0.6s Performance Tuning',
      'Local Schema.org & SEO Integration'
    ],
    details: 'We write clean, modular frontend code. We optimize high-resolution imagery into modern WebP formats, ensure sub-second First Contentful Paint, and connect interactive forms, WhatsApp triggers, and booking systems.',
    icon: 'Sliders'
  },
  {
    step: '04',
    number: 'PHASE 04',
    title: 'LAUNCH',
    duration: '2 – 3 Days',
    description: 'Make the website ready for the real world. Domain connection, SSL encryption, Google Map Pack sync, analytics, and full source code handoff.',
    deliverables: [
      'Production Global Edge Deployment',
      'Bank-Grade SSL Certificate Setup',
      'Google Search Console & Map Pack Indexing',
      '100% Code & Asset Handoff to Client'
    ],
    details: 'We deploy your site to global edge CDNs, connect your custom domain, test all forms and booking buttons, and hand over complete ownership of your code with zero ongoing platform lock-in fees.',
    icon: 'Rocket'
  }
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'What type of websites do you build?',
    answer: 'ANURGO builds modern, responsive, and high-performance websites for businesses of all sizes — specializing in restaurants, cafés, boutique hotels, salons, local retail shops, startups, and service providers. Whether you need a high-converting landing page, an interactive culinary menu with table booking, or a complete multi-page business website, we craft it from scratch with custom code.',
    category: 'Services & Scope',
  },
  {
    id: 'faq-2',
    question: 'How long does a website take?',
    answer: 'Typical turnaround times range from 1 to 3 weeks depending on the scope: focused landing pages take 5 to 8 days, while complete multi-page business websites with custom menus or booking flows take 2 to 3 weeks. We provide clear milestone updates throughout the build.',
    category: 'Timeline',
  },
  {
    id: 'faq-3',
    question: 'Will my website work on mobile?',
    answer: 'Absolutely. Every ANURGO website is built mobile-first. Over 70% of local customers discover businesses on smartphones, so we test across iPhones, Android devices, tablets, and ultra-wide desktop monitors to ensure seamless touch navigation, readable typography, and instant load speeds on cellular connections.',
    category: 'Technical',
  },
  {
    id: 'faq-4',
    question: 'Can you redesign my existing website?',
    answer: 'Yes! Our Website Redesign service takes slow, outdated, or poorly converting websites and rebuilds them with modern dark UI aesthetics, clean code, and sub-second speeds. We preserve all of your existing Google search rankings and URL structures while significantly upgrading visual appeal and conversion rates.',
    category: 'Redesigns',
  },
  {
    id: 'faq-5',
    question: 'Can I request revisions?',
    answer: 'Yes. We include structured revision rounds at both the visual design phase and the staging build phase. You review the design before coding begins, and review the live interactive build before launch to ensure every detail matches your vision.',
    category: 'Collaboration',
  },
  {
    id: 'faq-6',
    question: 'Do I need to provide hosting and a domain?',
    answer: 'If you already have a domain, we connect it seamlessly. If you do not have one, we will guide you on registering it under your own name so you retain 100% ownership. For hosting, we deploy on lightning-fast global edge CDNs (such as Vercel or Cloudflare) with free SSL encryption and 99.99% uptime.',
    category: 'Hosting & Setup',
  },
  {
    id: 'faq-7',
    question: 'How do I start a project?',
    answer: 'Getting started is simple: click "Book a Website" or send a direct message on WhatsApp or Email with a quick summary of your business. We will respond within 24 hours with ideas, a clear project plan, and a transparent fixed price proposal.',
    category: 'Getting Started',
  }
];

export const SKILLS_LIST = [
  'React 19',
  'TypeScript',
  'Tailwind CSS',
  'Next.js',
  'Vite',
  'Figma Prototyping',
  'Local SEO & Schema.org',
  'Google Lighthouse 100/100',
  'Mobile-First Touch Architecture',
  'WebP / AVIF Optimization',
  'WhatsApp CRM Integrations',
  'Stripe Checkout Funnels'
];

export const TERMINAL_COMMANDS: Record<string, string> = {
  help: `Available ANURGO://IDENTITY discovery commands:
--------------------------------------------------
whoami      - Discover the person behind ANURGO
role        - Founder focus & academic background
brand       - Brand manifesto, mission & standards
stack       - Complete engineering & frontend tech stack
services    - Core website solutions built for businesses
process     - The 4-step bespoke launch playbook
socials     - Official verified links & coordinates
contact     - Direct WhatsApp & email contact channels
easter-egg  - Launch celebratory studio confetti burst
clear       - Clear the terminal console screen`,

  whoami: `>> FOUNDER: Anurag
>> CS Student & Web Designer
>> Dedicated to building high-performance, modern websites for businesses.
>> Honest engineering, zero template bloat, relentless focus on customer conversion.`,

  role: `>> FOUNDER ROLE & BACKGROUND:
Anurag is a Computer Science student and technology enthusiast with a deep passion for modern frontend web design, cybersecurity, and digital experiences. ANURGO was founded to give local and medium businesses a premium digital presence that rivals top global tech brands.`,

  brand: `>> BRAND: ANURGO
>> MISSION: "ANURGO helps businesses build a powerful digital presence through modern websites."
>> CORE PROMISE:
- 100% Custom Handcrafted Code (Zero generic bloated templates)
- Sub-Second Load Speeds (< 0.6s LCP)
- Mobile-First Touch Optimization
- 100% Client Ownership of Code & Assets`,

  stack: `>> TECHNICAL STACK:
- Core Engine: React 19, TypeScript, Vite
- Styling: Tailwind CSS, Vanilla CSS Glassmorphism
- Icons & UI: Lucide React, Canvas Confetti
- Deployment: Global Edge CDNs (Vercel / Netlify / Cloudflare)
- Performance: 100/100 Google Lighthouse Core Web Vitals, WebP Compression`,

  services: `>> WHAT I BUILD:
01 | BUSINESS WEBSITES          - Modern multi-page corporate portals
02 | RESTAURANT & CAFÉ WEBSITES - Rich visual menus & zero-commission reservations
03 | LOCAL BUSINESS WEBSITES    - Local shops, salons, hotels & boutique storefronts
04 | LANDING PAGES              - Laser-focused high-conversion campaign pages
05 | WEBSITE REDESIGN           - Modernizing outdated websites with speed & UI
06 | CUSTOM WEB EXPERIENCES     - Bespoke calculators, schedulers & interactive funnels`,

  process: `>> 4-STEP LAUNCH PLAYBOOK:
01 | TELL ME ABOUT YOUR BUSINESS (1-3 Days) -> Strategy, goals & audience brief
02 | PLAN & DESIGN (4-7 Days)              -> Bespoke UI, tokens & layout approval
03 | BUILD & REFINE (1-2 Weeks)            -> React/TypeScript build & speed tuning
04 | LAUNCH (2-3 Days)                     -> Edge deployment & complete code handoff`,

  socials: `>> OFFICIAL VERIFIED COORDINATES:
- GitHub:   https://github.com/officialdarkdevil303
- LinkedIn: https://www.linkedin.com/in/anurag-chauhan-903b29380
- Fiverr:   https://www.fiverr.com/s/Q2Y0NpP
- Email:    workwithanuragchauhan@gmail.com
- WhatsApp: Contact via WhatsApp`,

  contact: `>> DIRECT BOOKING CHANNELS:
- Email:    workwithanuragchauhan@gmail.com
- WhatsApp: Contact via WhatsApp (click button in Contact section)
- Project:  Use the interactive 'Project Brief' form below to book
- LinkedIn: https://www.linkedin.com/in/anurag-chauhan-903b29380
- Fiverr:   https://www.fiverr.com/s/Q2Y0NpP
- Website:  Scroll down to the 'Initiate Project' section to submit your project brief!`,
};
