import { ANURGO_BRAND } from '../../data/anurgoData';

// ==============================================================================
// ANURGO AI CONVERSATIONAL ASSISTANT BRAIN
// ==============================================================================
// Architecture:
// Message -> Language -> Normalization -> Entity Extraction ->
// Intent & Anaphora Resolution -> Dialogue State Machine -> Natural Response
// ==============================================================================

export type SupportedLang = 'en' | 'hi' | 'hinglish' | 'fr' | 'es' | 'de';

export interface ExtractedEntities {
  businessType?: string; // 'clothing shop', 'restaurant', 'cafe', 'salon', 'hotel', 'clinic', 'gym', 'portfolio', 'local shop', 'general'
  serviceType?: string; // 'website', 'landing_page', 'redesign', 'catalog', 'custom_app'
  scopeFeatures: {
    whatsappOrdering?: boolean;
    onlineCheckout?: boolean;
    tableBooking?: boolean;
    appointmentBooking?: boolean;
    roomBooking?: boolean;
    menuCatalog?: boolean;
    animations3D?: boolean;
  };
  budget?: {
    amount: number;
    currency: 'INR' | 'USD' | 'EUR';
    rawString: string;
  };
  timeline?: string;
  hasExistingSite?: boolean;
  hasDomain?: boolean;
  stylePreference?: string;
}

export interface ConversationContext {
  language: SupportedLang;
  entities: ExtractedEntities;
  lastBotQuestion?:
    | 'catalog_vs_ecommerce'
    | 'business_type'
    | 'restaurant_features'
    | 'booking_type_clarification'
    | 'has_existing_site'
    | 'budget_ask'
    | 'assets_ready'
    | 'timeline_ask'
    | 'next_step_action'
    | 'general';
  dialogStage: 'greeting' | 'discovery' | 'scope_clarification' | 'pricing' | 'feasibility' | 'closing';
  turnsCount: number;
  discussedTopics: string[];
}

export interface BrainResponse {
  text: string;
  actionButtons?: {
    label: string;
    action: () => void;
    icon?: 'arrow' | 'whatsapp' | 'mail' | 'external';
  }[];
  suggestions?: string[];
  updatedContext: ConversationContext;
}

export const createInitialContext = (lang: SupportedLang = 'en'): ConversationContext => ({
  language: lang,
  entities: {
    scopeFeatures: {},
  },
  dialogStage: 'greeting',
  turnsCount: 0,
  discussedTopics: [],
});

// ==============================================================================
// 1. LANGUAGE DETECTION
// ==============================================================================

export function detectLanguage(text: string, prevLang: SupportedLang = 'en'): SupportedLang {
  const lower = text.toLowerCase().trim();

  // Devanagari script (Hindi)
  if (/[\u0900-\u097F]/.test(text)) {
    return 'hi';
  }

  // French
  if (
    lower.includes('bonjour') ||
    lower.includes('salut') ||
    lower.includes('comment') ||
    lower.includes('merci') ||
    lower.includes('combien') ||
    lower.includes('site web') ||
    lower.includes('tarifs') ||
    lower.includes('ça va') ||
    lower.includes('ca va') ||
    lower.includes('boutique') ||
    lower.includes('vêtements') ||
    lower.includes('vêtement')
  ) {
    return 'fr';
  }

  // Spanish
  if (
    lower.includes('hola') ||
    lower.includes('buenos dias') ||
    lower.includes('buenas') ||
    lower.includes('gracias') ||
    lower.includes('cuanto') ||
    lower.includes('sitio web') ||
    lower.includes('como estas') ||
    lower.includes('tienda de ropa') ||
    lower.includes('precio')
  ) {
    return 'es';
  }

  // German
  if (
    lower.includes('hallo') ||
    lower.includes('guten tag') ||
    lower.includes('wie geht') ||
    lower.includes('danke') ||
    lower.includes('webseite') ||
    lower.includes('kosten')
  ) {
    return 'de';
  }

  // Hinglish
  if (
    lower.includes('kaise ho') ||
    lower.includes('kya haal') ||
    lower.includes('bhai') ||
    lower.includes('banwana') ||
    lower.includes('banani') ||
    lower.includes('banana hai') ||
    lower.includes('kitna') ||
    lower.includes('kharcha') ||
    lower.includes('paisa') ||
    lower.includes('rupaye') ||
    lower.includes('sasta') ||
    lower.includes('chahiye') ||
    lower.includes('shukriya') ||
    lower.includes('dhanyawad') ||
    lower.includes('namaste') ||
    lower.includes('dukaan') ||
    lower.includes('kapde') ||
    lower.includes('ho jayega') ||
    lower.includes('theek hai') ||
    lower.includes('badhiya') ||
    lower.includes('karna hai') ||
    lower.includes('batao')
  ) {
    return 'hinglish';
  }

  return prevLang || 'en';
}

// ==============================================================================
// 2. ENTITY EXTRACTION
// ==============================================================================

export function extractEntities(message: string, currentContext: ConversationContext): ExtractedEntities {
  const lower = message.toLowerCase();
  const entities: ExtractedEntities = {
    ...currentContext.entities,
    scopeFeatures: { ...currentContext.entities.scopeFeatures },
  };

  // --- A. Business Types ---
  if (
    lower.includes('clothing') ||
    lower.includes('clothes') ||
    lower.includes('apparel') ||
    lower.includes('boutique') ||
    lower.includes('fashion') ||
    lower.includes('garments') ||
    lower.includes('kapde') ||
    lower.includes('kapda') ||
    lower.includes('vêtements') ||
    lower.includes('tienda de ropa')
  ) {
    entities.businessType = 'clothing shop';
  } else if (
    lower.includes('restaurant') ||
    lower.includes('dhaba') ||
    lower.includes('eatery') ||
    lower.includes('bistro') ||
    lower.includes('dining')
  ) {
    entities.businessType = 'restaurant';
  } else if (
    lower.includes('cafe') ||
    lower.includes('café') ||
    lower.includes('coffee') ||
    lower.includes('bakery') ||
    lower.includes('tea') ||
    lower.includes('chai')
  ) {
    entities.businessType = 'cafe';
  } else if (
    lower.includes('salon') ||
    lower.includes('spa') ||
    lower.includes('parlour') ||
    lower.includes('parlor') ||
    lower.includes('beauty') ||
    lower.includes('hair')
  ) {
    entities.businessType = 'salon';
  } else if (
    lower.includes('hotel') ||
    lower.includes('resort') ||
    lower.includes('lodge') ||
    lower.includes('homestay') ||
    lower.includes('chalet')
  ) {
    entities.businessType = 'hotel';
  } else if (
    lower.includes('clinic') ||
    lower.includes('doctor') ||
    lower.includes('hospital') ||
    lower.includes('dental') ||
    lower.includes('dentist')
  ) {
    entities.businessType = 'clinic';
  } else if (
    lower.includes('gym') ||
    lower.includes('fitness') ||
    lower.includes('trainer') ||
    lower.includes('crossfit') ||
    lower.includes('workout')
  ) {
    entities.businessType = 'gym';
  } else if (
    lower.includes('portfolio') ||
    lower.includes('photographer') ||
    lower.includes('designer') ||
    lower.includes('resume')
  ) {
    entities.businessType = 'portfolio';
  } else if (
    lower.includes('shop') ||
    lower.includes('store') ||
    lower.includes('dukaan') ||
    lower.includes('retail')
  ) {
    if (!entities.businessType) entities.businessType = 'local shop';
  }

  // --- B. Service Types ---
  if (lower.includes('landing page') || lower.includes('single page')) {
    entities.serviceType = 'landing_page';
  } else if (lower.includes('redesign') || lower.includes('revamp') || lower.includes('purani website')) {
    entities.serviceType = 'redesign';
  } else if (lower.includes('ecommerce') || lower.includes('e-commerce') || lower.includes('online store')) {
    entities.serviceType = 'ecommerce';
  } else if (lower.includes('website') || lower.includes('site') || lower.includes('online le jana') || lower.includes('get it online')) {
    if (!entities.serviceType) entities.serviceType = 'website';
  }

  // --- C. Scope Features ---
  if (lower.includes('whatsapp') || lower.includes('wa') || lower.includes('catalog') || lower.includes('lookbook')) {
    entities.scopeFeatures.whatsappOrdering = true;
  }
  if (lower.includes('online order') || lower.includes('online payment') || lower.includes('checkout') || lower.includes('cart') || lower.includes('full ordering')) {
    entities.scopeFeatures.onlineCheckout = true;
  }
  if (lower.includes('table booking') || lower.includes('table reservation') || (lower.includes('booking') && entities.businessType === 'restaurant')) {
    entities.scopeFeatures.tableBooking = true;
  }
  if (lower.includes('appointment') || (lower.includes('booking') && (entities.businessType === 'salon' || entities.businessType === 'clinic'))) {
    entities.scopeFeatures.appointmentBooking = true;
  }
  if (lower.includes('room booking') || (lower.includes('booking') && entities.businessType === 'hotel')) {
    entities.scopeFeatures.roomBooking = true;
  }
  if (lower.includes('3d') || lower.includes('interactive') || lower.includes('three.js') || lower.includes('animation')) {
    entities.scopeFeatures.animations3D = true;
  }

  // --- D. Budget Extraction ---
  // Matches expressions like "8k", "8000", "around 8k", "under 5000", "5 hazar", "$60"
  const budgetMatch = lower.match(/(?:budget|cost|around|under|about|lagbhag|near)?\s*(?:is|h|hai)?\s*(?:₹|rs\.?|inr|\$|€)?\s*(\d+(?:\.\d+)?)\s*(k|thousand|hazar)?\b/);
  if (budgetMatch && budgetMatch[1]) {
    let num = parseFloat(budgetMatch[1]);
    const multiplier = budgetMatch[2];
    if (multiplier === 'k' || multiplier === 'thousand' || multiplier === 'hazar') {
      num = num * 1000;
    } else if (num < 100 && (lower.includes('$') || lower.includes('dollar') || lower.includes('usd'))) {
      num = num; // USD
    } else if (num < 100 && !lower.includes('page') && !lower.includes('day')) {
      num = num * 1000; // e.g. "my budget is 8" usually means 8k
    }

    if (num >= 500) {
      entities.budget = {
        amount: Math.round(num),
        currency: lower.includes('$') || lower.includes('dollar') ? 'USD' : 'INR',
        rawString: budgetMatch[0].trim(),
      };
    }
  }

  // --- E. Style Preference ---
  if (lower.includes('modern') || lower.includes('sleek') || lower.includes('dark') || lower.includes('minimal') || lower.includes('clean')) {
    entities.stylePreference = 'modern';
  }

  return entities;
}

// ==============================================================================
// 3. DIALOG POLICY & NATURAL RESPONSE GENERATION
// ==============================================================================

export function generateConversationalBrainResponse(
  rawMessage: string,
  history: { sender: 'ai' | 'user'; text: string }[],
  context: ConversationContext,
  navigationCallback?: (section: string) => void
): BrainResponse {
  const query = rawMessage.trim();
  const lower = query.toLowerCase();
  // Strip punctuation for accurate intent & single-word matching (e.g. "Restaurant.", "Booking!", "No.")
  const cleanLower = lower
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  const lang = detectLanguage(query, context.language);

  // Update entity understanding
  const entities = extractEntities(query, context);
  const nextContext: ConversationContext = {
    ...context,
    language: lang,
    entities,
    turnsCount: context.turnsCount + 1,
  };

  const hasBusiness = !!entities.businessType;
  const bizLabel = entities.businessType || 'business';

  // Helper affirmations & negations
  const isAffirmation = /^(yes|yeah|yep|sure|ok|okay|definitely|haan|ha|hanji|bilkul|sahi hai|oui|si|ja|done)\b/i.test(cleanLower);
  const isNegation = /^(no|nope|nah|not really|not yet|nahi|na|nahin|non|nein|nhi)\b/i.test(cleanLower);

  // ============================================================================
  // HONESTY & CAPABILITY BOUNDARIES (NEVER CLAIM LIVE WEB BROWSING OR SEARCH)
  // ============================================================================
  if (
    cleanLower.includes('search google') ||
    cleanLower.includes('browse the web') ||
    cleanLower.includes('live stock') ||
    cleanLower.includes('bitcoin price') ||
    cleanLower.includes('crypto price') ||
    cleanLower.includes('private files') ||
    cleanLower.includes('access my data') ||
    cleanLower.includes('live internet')
  ) {
    return {
      text: `I don't have live internet browsing, real-time web search, or access to private system data.
      
I'm dedicated specifically to **ANURGO Studio** — helping you explore web project architectures, review transparent pricing, test live demo concepts, and connect directly with developer Anurag Chauhan. How can I help with your website?`,
      suggestions: ['💰 What are your prices?', '🚀 Show demo websites', '📱 WhatsApp Anurag'],
      updatedContext: nextContext,
    };
  }

  // ============================================================================
  // SPECIFIC GENERAL QUESTIONS (PREVENT ENTITY HIJACKING)
  // ============================================================================

  // Question: "Is a website useful for a local shop?"
  if (
    cleanLower.includes('useful for a local shop') ||
    (cleanLower.includes('local shop') && (cleanLower.includes('useful') || cleanLower.includes('fayda') || cleanLower.includes('zaruri') || cleanLower.includes('need'))) ||
    cleanLower === 'is a website useful for a local shop'
  ) {
    return {
      text: `Yes, absolutely. Most local customers search on Google Maps or Instagram before visiting a shop in person.

With a website:
• People in your area can browse your current items and new arrivals anytime.
• You avoid answering "Send photos" 20 times a day on WhatsApp — you just send them one clean link.
• It builds trust: customers know your physical address, timings, and prices beforehand.
• You look established and professional compared to nearby competitors.`,
      suggestions: ['How much does a shop website cost?', 'Can I just use WhatsApp instead?', 'Start project on WhatsApp'],
      updatedContext: nextContext,
    };
  }

  // Question: "What's the difference between a simple website and ecommerce?"
  if (
    cleanLower.includes('difference between a simple website and ecommerce') ||
    cleanLower.includes('simple website and ecommerce') ||
    cleanLower.includes('difference between simple and ecommerce') ||
    cleanLower.includes('ecommerce vs')
  ) {
    return {
      text: `Here is the practical difference:

• **Simple / Catalog Website:** Displays your brand, services, photos, and products. When a customer wants to buy, they tap a button to order directly on **WhatsApp** or call. It's fast, low-cost (₹3k–₹7k), easy to maintain, and has **0% transaction fees**.
• **Full E-commerce:** Has customer accounts, shopping cart, automated payment gateways (Razorpay/Stripe), inventory tracking, and shipping integrations. It has higher setup costs (₹15k+) and 2–3% transaction fees per sale.

For most growing local shops, a **WhatsApp catalog website** is much more profitable to start with!`,
      suggestions: ['I want a WhatsApp catalog', 'How much will it cost?', 'Can we add payment gateway later?'],
      updatedContext: nextContext,
    };
  }

  // Question: "Why should I get a website?"
  if (cleanLower.includes('why should i get a website') || cleanLower.includes('why website') || cleanLower.includes('website kyu') || cleanLower.includes('fayda kya')) {
    return {
      text: `A website gives your business three big advantages:

1. **24/7 Discovery on Google:** When local customers search for your products or food, they find your official site rather than competitors.
2. **Instant Credibility:** A custom-designed site immediately separates you from fly-by-night sellers and builds buyer trust.
3. **Zero Commission Orders:** Instead of paying 20–30% cuts to aggregator platforms, customers order and book directly with you on WhatsApp!`,
      suggestions: ['How much does a starter site cost?', 'Can I just use WhatsApp?', 'See demo projects'],
      updatedContext: nextContext,
    };
  }

  // Question: "Can I just use WhatsApp instead?"
  if (cleanLower.includes('just use whatsapp') || cleanLower.includes('sirf whatsapp') || cleanLower.includes('only whatsapp')) {
    return {
      text: `WhatsApp is fantastic for chatting and closing sales, but it doesn't solve discovery — people can't find your WhatsApp through Google search, and sending 50 photos in chat overwhelms customers.

The most effective setup is **both working together**: a clean website that showcases your collections in high fidelity, with 1-tap buttons sending eager customers straight into your WhatsApp!`,
      suggestions: ['What would a WhatsApp catalog site cost?', 'I want this for my shop', 'How fast can we launch?'],
      updatedContext: nextContext,
    };
  }

  // Question: "Can you help me decide what website I need?"
  if (cleanLower.includes('help me decide') || cleanLower.includes('what website i need') || cleanLower.includes('which website should i get') || cleanLower.includes('kaunsi website chahiye')) {
    return {
      text: `Definitely! To recommend the ideal setup without unnecessary complexity:

1. **What type of business or project is it?**
2. **What do you most want visitors to do** (e.g., message on WhatsApp, book an appointment, or place an order)?

Tell me a little about what you do, and I'll lay out the cleanest, most cost-effective approach!`,
      suggestions: ['I have a local shop', 'I have a restaurant / cafe', 'I need a portfolio'],
      updatedContext: nextContext,
    };
  }

  // Question: "What kind of websites do you make?"
  if (cleanLower.includes('what kind of website') || cleanLower.includes('types of website') || cleanLower.includes('kis tarah ki website') || cleanLower.includes('what sites do you build')) {
    return {
      text: `ANURGO specializes in custom, handcrafted digital experiences:

• **Local Business & Shop Showcases:** Fast catalog sites with 1-tap WhatsApp ordering.
• **Restaurants, Cafes & Dining:** Interactive digital menus, ambiance galleries, and table reservations.
• **Portfolios & Personal Brands:** Modern interactive showcases for creators and professionals.
• **High-Converting Landing Pages:** Sub-second loading speed designed for conversion.
• **Custom 3D / WebGL Experiences:** Engaging interactive elements using Three.js and Framer Motion.

Every project is hand-coded in modern React and TypeScript — zero bloated WordPress templates.`,
      suggestions: ['Show demo websites', 'How much does a starter site cost?', 'Discuss my business'],
      updatedContext: nextContext,
    };
  }

  // Question: "What can you do?"
  if (cleanLower.includes('what can you do') || cleanLower.includes('kya kar sakte ho') || cleanLower.includes('que peux-tu faire') || cleanLower.includes('que puedes hacer')) {
    return {
      text: `I can help you explore website options, recommend the right technical architecture for your business (from simple single-page showcases to full web portals), calculate realistic budget estimates, walk you through our design process, demonstrate live concepts, and connect you directly with Anurag to bring your project to life.

Are you thinking about a website for your business, or just exploring?`,
      suggestions: ['I need a website for my business', 'What are your prices?', 'Show live demo websites'],
      updatedContext: nextContext,
    };
  }

  // Question: "Who are you?" / "Who made you?" / "What is ANURGO?" / "Are you a real person?"
  if (
    cleanLower.includes('who are you') ||
    cleanLower.includes('who made you') ||
    cleanLower.includes('who created you') ||
    cleanLower.includes('what is anurgo') ||
    cleanLower.includes('are you a real person') ||
    cleanLower.includes('anurag kaun hai') ||
    cleanLower.includes('who is anurag')
  ) {
    return {
      text: `I'm **ANURGO AI**, the virtual assistant for **ANURGO Studio**.

ANURGO is the creative digital studio founded by **Anurag Chauhan** — a 2nd-year B.Tech Computer Science student at Amity University Jharkhand. Anurag writes 100% custom handcrafted code (no bloated WordPress templates) to build memorable, fast websites for real businesses.

While I'm an AI assistant, you can talk to Anurag directly on WhatsApp anytime!`,
      actionButtons: [
        {
          label: '📖 Read Studio Story',
          action: () => navigationCallback?.('about'),
        },
        {
          label: '📱 WhatsApp Anurag Directly',
          action: () => window.open(ANURGO_BRAND.whatsappLink, '_blank'),
          icon: 'whatsapp',
        },
      ],
      suggestions: ['What kind of websites do you make?', 'What are the prices?', 'Show live demos'],
      updatedContext: nextContext,
    };
  }

  // Question: "Do I need a domain?"
  if (cleanLower.includes('domain') || cleanLower.includes('hosting')) {
    return {
      text: `If you already have a domain (like yourname.com), Anurag can connect it directly.

If you don't have one yet, no worries! You can start on a free global edge link (like yourbrand.vercel.app), and Anurag will guide you on registering your own custom domain in your name whenever you're ready. You keep 100% ownership!`,
      suggestions: ['How much does hosting cost?', 'How do we start?', 'Check pricing'],
      updatedContext: nextContext,
    };
  }

  // Question: "What happens after I contact you?" / "How do we start?"
  if (cleanLower.includes('after i contact') || cleanLower.includes('how do we start') || cleanLower.includes('shuruat kaise kare') || cleanLower.includes('what happens after')) {
    return {
      text: `The collaboration process is straightforward and transparent:

1. **Quick Chat (1–2 Days):** You and Anurag discuss your goals, products, and preferred style on WhatsApp.
2. **Design Approval (3–5 Days):** You review a custom visual mockup before any final code is written.
3. **Build & Test (1–2 Weeks):** Clean React/TypeScript coding with lightning-fast speeds.
4. **Launch & Handoff:** Deployment, Google SEO setup, and 100% source code handoff to you.

Payment is divided into 50% upfront to reserve the slot, and 50% only upon your final approval!`,
      actionButtons: [
        {
          label: '📱 Message Anurag on WhatsApp',
          action: () => window.open(ANURGO_BRAND.whatsappLink, '_blank'),
          icon: 'whatsapp',
        },
        {
          label: '📝 Fill Project Brief Form',
          action: () => navigationCallback?.('contact'),
        },
      ],
      suggestions: ['What are the rates?', 'Do you have demos?', 'Can we do it in 1 week?'],
      updatedContext: nextContext,
    };
  }

  // ============================================================================
  // AMBIGUITY HANDLING (ONE USEFUL CLARIFICATION)
  // ============================================================================
  if (cleanLower === 'i want booking' || cleanLower === 'booking' || cleanLower === 'booking chahiye' || cleanLower === 'need booking') {
    if (!context.entities.businessType) {
      nextContext.lastBotQuestion = 'booking_type_clarification';
      return {
        text: `What kind of booking do you need — restaurant tables, appointments, or something else?`,
        suggestions: ['Restaurant tables', 'Appointments', 'Hotel rooms'],
        updatedContext: nextContext,
      };
    }
  }

  // User says "I need a website" or "I want a website" without specifying business
  if (
    !context.entities.businessType &&
    (cleanLower === 'i need a website' ||
      cleanLower === 'i want a website' ||
      cleanLower === 'need a website' ||
      cleanLower === 'website chahiye' ||
      cleanLower === 'website banwani hai' ||
      cleanLower === 'je veux un site web' ||
      cleanLower === 'quiero un sitio web' ||
      cleanLower === 'ich brauche eine webseite')
  ) {
    nextContext.lastBotQuestion = 'business_type';
    nextContext.dialogStage = 'discovery';
    return {
      text: `What kind of business is it for?`,
      suggestions: ['Clothing shop', 'Restaurant', 'Café', 'Personal Portfolio', 'Local Store'],
      updatedContext: nextContext,
    };
  }

  // ============================================================================
  // MULTI-TURN CONTINUITY & REFERENCE (ANAPHORA) RESOLUTION
  // ============================================================================

  // Turn: Bot asked 'business_type' (e.g., user previously said "I need a website")
  if (context.lastBotQuestion === 'business_type') {
    if (entities.businessType === 'restaurant' || entities.businessType === 'cafe' || cleanLower === 'restaurant' || cleanLower === 'cafe' || cleanLower === 'café') {
      nextContext.entities.businessType = entities.businessType || 'restaurant';
      nextContext.lastBotQuestion = 'restaurant_features';
      return {
        text: `Nice. Do you mainly need a menu and enquiries, or would you like table booking too?`,
        suggestions: ['Menu and enquiries', 'Table booking', 'Both'],
        updatedContext: nextContext,
      };
    }
    if (entities.businessType === 'clothing shop' || entities.businessType === 'local shop') {
      nextContext.lastBotQuestion = 'catalog_vs_ecommerce';
      return {
        text: `Absolutely. A website could work really well for a clothing shop. Do you mainly want customers to browse your products and contact you on WhatsApp, or are you looking for full online ordering as well?`,
        suggestions: ['WhatsApp is enough for now', 'Full online ordering', 'How much will it cost?'],
        updatedContext: nextContext,
      };
    }
    if (entities.businessType === 'salon' || entities.businessType === 'clinic') {
      nextContext.lastBotQuestion = 'scope_clarification' as any;
      return {
        text: `Great choice. For a ${entities.businessType}, do you need an online appointment booking calendar, or is a direct WhatsApp/phone booking button preferred?`,
        suggestions: ['WhatsApp booking is enough', 'Online appointment booking', 'What are your rates?'],
        updatedContext: nextContext,
      };
    }
    // Generic business answer
    nextContext.lastBotQuestion = 'budget_ask';
    return {
      text: `Got it — a website for your **${bizLabel}**! Do you already have photos and content ready, or are you looking for complete design and setup from scratch?`,
      suggestions: ['From scratch', 'I have photos ready', 'How much will it cost?'],
      updatedContext: nextContext,
    };
  }

  // Turn: Bot asked 'restaurant_features' (e.g., "Menu or table booking?")
  if (
    context.lastBotQuestion === 'restaurant_features' ||
    (context.entities.businessType === 'restaurant' && (cleanLower === 'booking' || cleanLower === 'table booking' || cleanLower === 'menu' || cleanLower === 'both'))
  ) {
    if (cleanLower.includes('booking') || cleanLower.includes('table') || cleanLower.includes('both')) {
      nextContext.entities.scopeFeatures.tableBooking = true;
    }
    nextContext.lastBotQuestion = 'has_existing_site';
    return {
      text: `Got it — table booking. Do you already have a website, or would this be a completely new one?`,
      suggestions: ['No', 'Yes, redesign existing site', 'How much will it cost?'],
      updatedContext: nextContext,
    };
  }

  // Turn: Bot asked 'has_existing_site' (e.g. user replies "No" or "Yes")
  if (context.lastBotQuestion === 'has_existing_site') {
    nextContext.lastBotQuestion = 'budget_ask';
    nextContext.dialogStage = 'pricing';

    if (isNegation || cleanLower === 'no' || cleanLower === 'new' || cleanLower === 'nhi' || cleanLower === 'fresh' || cleanLower.includes('new website')) {
      nextContext.entities.hasExistingSite = false;
      const bookingMention = nextContext.entities.scopeFeatures.tableBooking ? ' with table booking' : '';
      return {
        text: `Perfect. So we're looking at a new ${bizLabel} website${bookingMention}.
        
To give you a precise recommendation and quote, what kind of budget or launch timeline do you have in mind?`,
        suggestions: ['How much will it cost?', 'My budget is around 5k', 'My budget is around 8k'],
        updatedContext: nextContext,
      };
    } else {
      nextContext.entities.hasExistingSite = true;
      return {
        text: `Understood — redesigning and upgrading your existing site with high-performance code and modern visuals! What budget do you have in mind for this?`,
        suggestions: ['How much will it cost?', 'Around 5k', 'Around 8k'],
        updatedContext: nextContext,
      };
    }
  }

  // Turn: Bot asked 'catalog_vs_ecommerce' and user chose WhatsApp (Exact clothing shop flow)
  if (
    context.lastBotQuestion === 'catalog_vs_ecommerce' ||
    (cleanLower.includes('whatsapp') && (cleanLower.includes('enough') || cleanLower.includes('kaafi') || cleanLower.includes('only') || cleanLower.includes('for now') || cleanLower.includes('sahi hai')))
  ) {
    nextContext.entities.scopeFeatures.whatsappOrdering = true;
    nextContext.entities.scopeFeatures.onlineCheckout = false;
    nextContext.lastBotQuestion = 'budget_ask';
    nextContext.dialogStage = 'pricing';

    if (lang === 'hinglish') {
      return {
        text: `Samajh gaya! Direct **WhatsApp ordering** bilkul sahi decision hai — website fast load hogi, customers ke liye browse karna simple rahega, aur aapko koi payment gateway ke extra 2–3% transaction charges bhi nahi dene padenge.

Is project ke liye aapka kitna budget planned hai?`,
        suggestions: ['How much will it cost?', 'My budget is around 8k', 'My budget is around 5k'],
        updatedContext: nextContext,
      };
    }

    return {
      text: `Got it — a digital lookbook showcase with direct **WhatsApp ordering**! That keeps the website fast, frictionless for mobile shoppers, and saves you from paying heavy payment gateway transaction fees.

Do you have a specific budget in mind for this, or would you like a price estimate first?`,
      suggestions: ['How much will it cost?', 'My budget is around 8k', 'My budget is around 5k'],
      updatedContext: nextContext,
    };
  }

  // Turn: Bot asked about booking type clarification (Ambiguity resolved)
  if (context.lastBotQuestion === 'booking_type_clarification') {
    nextContext.lastBotQuestion = 'has_existing_site';
    if (cleanLower.includes('table') || cleanLower.includes('restaurant')) {
      nextContext.entities.businessType = 'restaurant';
      nextContext.entities.scopeFeatures.tableBooking = true;
      return {
        text: `Got it — zero-commission **table reservations** for a restaurant! Do you already have an existing website we should add this to, or would this be a completely new one?`,
        suggestions: ['No, completely new', 'Yes, existing website', 'How much will it cost?'],
        updatedContext: nextContext,
      };
    }
    if (cleanLower.includes('appointment') || cleanLower.includes('salon') || cleanLower.includes('clinic')) {
      nextContext.entities.scopeFeatures.appointmentBooking = true;
      return {
        text: `Understood — **appointment booking** with date and time slot selection! Do you already have an existing website, or are we building a fresh new platform?`,
        suggestions: ['Fresh new website', 'Existing website redesign', 'How much will it cost?'],
        updatedContext: nextContext,
      };
    }
  }

  // Turn: User states budget (e.g., "My budget is around 8k")
  const justGaveBudget = !!entities.budget?.amount && (cleanLower.includes('budget') || cleanLower.includes('around') || cleanLower.includes('8k') || cleanLower.includes('5k') || cleanLower.includes('10k') || cleanLower.includes('hazar') || cleanLower.includes('k') || cleanLower.includes('₹'));
  if (justGaveBudget && entities.budget) {
    nextContext.dialogStage = 'feasibility';
    nextContext.lastBotQuestion = 'next_step_action';

    const amt = entities.budget.amount;
    const formattedAmt = `₹${amt.toLocaleString('en-IN')}`;

    if (amt <= 4000) {
      if (lang === 'hinglish') {
        return {
          text: `**${formattedAmt}** bilkul doable hai! Is budget me Anurag aapke liye ek fast, mobile-first single-page website ya starter showcase taiyar kar sakte hain jisme direct WhatsApp contact aur Google Map location rahega.

Aapka kya thought hai, aage proceed karein?`,
          actionButtons: [
            {
              label: '📱 WhatsApp Par Discuss Karein',
              action: () => window.open(ANURGO_BRAND.whatsappLink, '_blank'),
              icon: 'whatsapp',
            },
            {
              label: '📝 Brief Form Bharein',
              action: () => navigationCallback?.('contact'),
            },
          ],
          suggestions: ['Can you do it?', 'Kitne din me banega?', 'Kya kya details chahiye?'],
          updatedContext: nextContext,
        };
      }
      return {
        text: `**${formattedAmt}** is a great starting budget! Within this range, Anurag can craft a focused, lightning-fast single-page website with smooth mobile touch navigation, direct WhatsApp inquiry routing, and Google Maps integration.

Would you like to discuss the next steps with Anurag on WhatsApp?`,
        actionButtons: [
          {
            label: '📱 Discuss on WhatsApp',
            action: () => window.open(ANURGO_BRAND.whatsappLink, '_blank'),
            icon: 'whatsapp',
          },
          {
            label: '📝 Fill Project Brief Form',
            action: () => navigationCallback?.('contact'),
          },
        ],
        suggestions: ['Can you do it?', 'How long will it take?', 'What assets do you need?'],
        updatedContext: nextContext,
      };
    }

    if (amt <= 12000) {
      if (lang === 'hinglish') {
        return {
          text: `**${formattedAmt}** ek bahut achha budget hai! Is budget me Anurag aapki **${bizLabel}** ke liye ek professional, mobile-friendly website bana sakte hain — high-res images, category tabs aur seamless WhatsApp conversion funnel ke sath.

Kya aap isko build karwana chahenge?`,
          actionButtons: [
            {
              label: '📱 WhatsApp Pe Baat Karein',
              action: () => window.open(ANURGO_BRAND.whatsappLink, '_blank'),
              icon: 'whatsapp',
            },
            {
              label: '📝 Project Brief Form',
              action: () => navigationCallback?.('contact'),
            },
          ],
          suggestions: ['Can you do it?', 'Timeline kitni hogi?', 'Process kya hai?'],
          updatedContext: nextContext,
        };
      }
      return {
        text: `**${formattedAmt}** is a solid budget for this! For around ${formattedAmt}, Anurag can engineer a razor-sharp, mobile-first ${bizLabel} website with category filtering, high-resolution product showcases, and one-tap WhatsApp checkout.

Are you ready to bring this to life?`,
        actionButtons: [
          {
            label: '📱 Chat on WhatsApp',
            action: () => window.open(ANURGO_BRAND.whatsappLink, '_blank'),
            icon: 'whatsapp',
          },
          {
            label: '📝 Open Project Brief Form',
            action: () => navigationCallback?.('contact'),
          },
        ],
        suggestions: ['Can you do it?', 'How long will it take?', 'What do I need to provide?'],
        updatedContext: nextContext,
      };
    }

    // Higher budget (15k+)
    return {
      text: `**${formattedAmt}** gives us plenty of room to build something truly distinctive! We can integrate bespoke modern interactions, multi-page layout architecture, local SEO schema, and ultra-fast edge hosting. Would you like to connect with Anurag?`,
      actionButtons: [
        {
          label: '📱 Connect with Anurag',
          action: () => window.open(ANURGO_BRAND.whatsappLink, '_blank'),
          icon: 'whatsapp',
        },
      ],
      suggestions: ['Can you do it?', 'Review project terms', 'See live demos'],
      updatedContext: nextContext,
    };
  }

  // Turn: User asks "Can you do it?" / "Ho jayega?" (Feasibility with established context)
  if (
    cleanLower.includes('can you do it') ||
    cleanLower.includes('can you build it') ||
    cleanLower.includes('can you make it') ||
    cleanLower.includes('ho jayega') ||
    cleanLower.includes('kar doge') ||
    cleanLower.includes('ban jayega') ||
    cleanLower.includes('possible hai') ||
    cleanLower.includes('is it possible') ||
    cleanLower.includes("cest faisable") ||
    cleanLower.includes('es posible')
  ) {
    const budgetMention = entities.budget?.amount ? `within your **₹${entities.budget.amount.toLocaleString('en-IN')}** budget` : 'within your budget';
    const bizMention = entities.businessType ? `for your **${entities.businessType}**` : 'for your project';

    if (lang === 'hinglish') {
      return {
        text: `**Haan, bilkul 100% ho jayega!** Anurag aapki ${bizMention} ki website ${budgetMention} asaani se deliver kar sakte hain.

Aage ka step bahut simple hai — aap WhatsApp par direct Anurag se baat karke apne details share kar sakte hain, ya niche ka quick brief form submit kar sakte hain!`,
        actionButtons: [
          {
            label: '📱 WhatsApp Par Baat Karein',
            action: () => window.open(ANURGO_BRAND.whatsappLink, '_blank'),
            icon: 'whatsapp',
          },
          {
            label: '📝 Brief Form Submit Karein',
            action: () => navigationCallback?.('contact'),
          },
        ],
        suggestions: ['Payment process kya hai?', 'Timeline kitni lagegi?', 'Domain chahiye kya?'],
        updatedContext: nextContext,
      };
    }

    return {
      text: `**Yes, absolutely!** Anurag can definitely build the website ${bizMention} ${budgetMention}.

The next step is straightforward — you can message Anurag directly on WhatsApp to share your photos and ideas, or submit your project brief right here to get started!`,
      actionButtons: [
        {
          label: '📱 Chat on WhatsApp',
          action: () => window.open(ANURGO_BRAND.whatsappLink, '_blank'),
          icon: 'whatsapp',
        },
        {
          label: '📝 Fill Project Brief Form',
          action: () => navigationCallback?.('contact'),
        },
      ],
      suggestions: ['How does payment work?', 'How long will it take?', 'Do I need to buy a domain?'],
      updatedContext: nextContext,
    };
  }

  // Turn: User asks "How much will it cost?" / Pricing with reference to context
  if (
    cleanLower.includes('how much') ||
    cleanLower.includes('cost') ||
    cleanLower.includes('pricing') ||
    cleanLower.includes('price') ||
    cleanLower.includes('rate') ||
    cleanLower.includes('kitna kharcha') ||
    cleanLower.includes('kitna lagega') ||
    cleanLower.includes('combien') ||
    cleanLower.includes('cuanto') ||
    cleanLower.includes('kosten')
  ) {
    nextContext.dialogStage = 'pricing';
    nextContext.lastBotQuestion = 'budget_ask';

    const styleQualifier = entities.stylePreference ? ` modern` : '';

    if (entities.businessType === 'clothing shop' || entities.businessType === 'local shop') {
      return {
        text: `For a${styleQualifier} **clothing shop showcase** with WhatsApp ordering, ANURGO typically builds this in the **₹3,000 to ₹7,000** range, depending on how many collections and items you want to feature.

What kind of budget are you working with?`,
        suggestions: ['My budget is around 5k', 'My budget is around 8k', 'Flexible budget'],
        updatedContext: nextContext,
      };
    }

    if (entities.businessType === 'restaurant' || entities.businessType === 'cafe') {
      return {
        text: `For a${styleQualifier} **${entities.businessType} website** with interactive menu showcase, location details, and direct enquiry/table routing, pricing typically ranges between **₹4,000 and ₹8,000**.

What kind of budget range do you have in mind?`,
        suggestions: ['Around 5k', 'Around 8k', 'Can you do it within 6k?'],
        updatedContext: nextContext,
      };
    }

    if (entities.serviceType === 'landing_page') {
      return {
        text: `A laser-focused **landing page** designed for high conversion and sub-second load speeds typically costs **₹2,500 to ₹5,000**. What budget are you targeting?`,
        suggestions: ['Under ₹3,000', 'Around ₹5,000', 'How fast can it launch?'],
        updatedContext: nextContext,
      };
    }

    // General pricing
    return {
      text: `ANURGO has transparent, accessible pricing tailored for early businesses and student budgets:

• **Under ₹3,000:** Quick single-page site, mini landing page, or UI edits
• **₹3,000 – ₹7,000:** Full starter website or personal portfolio
• **₹7,000 – ₹15,000:** Multi-page business, shop, or restaurant portal
• **Custom Budget:** We tailor the scope to match what you can afford!

What kind of project or business are you planning?`,
      suggestions: ['I have a small shop', 'I need a portfolio', 'I need a restaurant site'],
      updatedContext: nextContext,
    };
  }

  // Turn: User introduces a new project (e.g., "Bro I have a small clothing shop and I want to get it online")
  if (hasBusiness && (cleanLower.includes('want to get it online') || cleanLower.includes('online') || cleanLower.includes('website') || cleanLower.includes('dukaan') || cleanLower.includes('have a') || cleanLower.includes('meri ek') || cleanLower.includes('i own'))) {
    nextContext.dialogStage = 'discovery';

    if (entities.businessType === 'clothing shop') {
      nextContext.lastBotQuestion = 'catalog_vs_ecommerce';
      if (lang === 'hinglish') {
        return {
          text: `Aapki clothing shop ke liye website ek behtareen move hai! 👗

Kya aap chahte hain ki customers pehle aapke kapde browse karein aur direct **WhatsApp** par order karein, ya fir aapko **full online payment/cart** bhi chahiye?`,
          suggestions: ['WhatsApp is enough for now', 'Full online ordering', 'How much will it cost?'],
          updatedContext: nextContext,
        };
      }
      return {
        text: `Absolutely. A website could work really well for a clothing shop. Do you mainly want customers to browse your products and contact you on WhatsApp, or are you looking for full online ordering as well?`,
        suggestions: ['WhatsApp is enough for now', 'Full online ordering', 'How much will it cost?'],
        updatedContext: nextContext,
      };
    }

    if (entities.businessType === 'cafe' || entities.businessType === 'restaurant') {
      nextContext.lastBotQuestion = 'restaurant_features';
      return {
        text: `Nice. Do you mainly need a menu and enquiries, or would you like table booking too?`,
        suggestions: ['Menu and enquiries', 'Table booking', 'Both'],
        updatedContext: nextContext,
      };
    }

    if (entities.businessType === 'salon' || entities.businessType === 'clinic') {
      return {
        text: `A website works wonders for a ${entities.businessType} — showcasing treatments and letting clients schedule consultations directly. Do you currently take bookings on phone/WhatsApp, or need an appointment scheduler?`,
        suggestions: ['WhatsApp booking is good', 'Need appointment scheduler', 'What are the rates?'],
        updatedContext: nextContext,
      };
    }

    return {
      text: `Building a website for your **${entities.businessType}** is a great step! It establishes credibility and drives local discovery. Do you already have content and images ready, or would you like to discuss scope and pricing first?`,
      suggestions: ['How much will it cost?', 'I have photos ready', 'How long will it take?'],
      updatedContext: nextContext,
    };
  }

  // Question: Demos / Showcase / Previous Work
  if (cleanLower.includes('demo') || cleanLower.includes('showcase') || cleanLower.includes('portfolio') || cleanLower.includes('previous work') || cleanLower.includes('sample')) {
    return {
      text: `You can test our live interactive demo concepts right in the portfolio:

• **Savoria Trattoria** — Italian dining portal with digital menu & table booking (<0.58s load)
• **Aura Coffee Roasters** — Specialty cafe with flavor wheel & subscription builder
• **Solstice Alpine Resort** — Boutique mountain chalet with 360 tour simulation
• **Velvet & Vine** — Curated fashion lookbook with store pickup inventory

Would you like to explore them or build a custom concept for your brand?`,
      actionButtons: [
        {
          label: '🚀 Explore Live Projects',
          action: () => navigationCallback?.('work'),
        },
        {
          label: '📝 Request A Custom Concept',
          action: () => navigationCallback?.('contact'),
        },
      ],
      suggestions: ['How much does a site like this cost?', 'I want something for my cafe', "Let's talk on WhatsApp"],
      updatedContext: nextContext,
    };
  }

  // ============================================================================
  // CASUAL SOCIAL GREETINGS, COMPLIMENTS, THANKS, BYE
  // ============================================================================

  // Casual Greeting
  if (/^(hi|hii|hiii|hello|hey|heyy|hlo|helo|yo|namaste|pranam|hola|bonjour|salut)\b/i.test(cleanLower)) {
    if (lang === 'hinglish') {
      return {
        text: `Namaste! Kaise hain aap? Main aapki kya madad kar sakta hoon? 😊`,
        suggestions: ['Mujhe ek website banwani hai', 'Rates kya hain?', 'Demos dikhao'],
        updatedContext: nextContext,
      };
    }
    if (lang === 'hi') {
      return {
        text: `नमस्ते! आप कैसे हैं? मैं आपकी क्या सहायता कर सकता हूँ? 😊`,
        suggestions: ['मुझे एक वेबसाइट चाहिए', 'कीमत क्या है?', 'डेमो दिखाएं'],
        updatedContext: nextContext,
      };
    }
    if (lang === 'fr') {
      return {
        text: `Bonjour ! Comment puis-je vous aider aujourd'hui ? 😊`,
        suggestions: ['Quels sont vos tarifs ?', 'Voir les démos', 'Services proposés'],
        updatedContext: nextContext,
      };
    }
    if (lang === 'es') {
      return {
        text: `¡Hola! ¿Cómo puedo ayudarte hoy? 😊`,
        suggestions: ['¿Cuáles son los precios?', 'Ver proyectos demo', 'Servicios'],
        updatedContext: nextContext,
      };
    }
    if (lang === 'de') {
      return {
        text: `Hallo! Wie kann ich Ihnen heute helfen? 😊`,
        suggestions: ['Was sind die Preise?', 'Demo ansehen', 'Dienste'],
        updatedContext: nextContext,
      };
    }
    return {
      text: `Hi! How can I help you today? 😊`,
      suggestions: ['💰 What are your prices?', '🚀 Show demo websites', '💼 What services do you offer?'],
      updatedContext: nextContext,
    };
  }

  // Well-being
  if (cleanLower.includes('how are you') || cleanLower.includes('kaise ho') || cleanLower.includes('kya haal') || cleanLower.includes('ça va') || cleanLower.includes('como estas')) {
    if (lang === 'hinglish') {
      return {
        text: `Main bilkul badhiya hoon, poochne ke liye shukriya! Aap bataiye, sab kaisa chal raha hai? 😊`,
        suggestions: ['Sab badhiya!', 'Website banwani hai', 'Bas check kar raha tha'],
        updatedContext: nextContext,
      };
    }
    return {
      text: `I'm doing great, thank you for asking! How are you doing today? 😊`,
      suggestions: ['I need a website', 'Just exploring ANURGO', 'What are your prices?'],
      updatedContext: nextContext,
    };
  }

  // Compliments
  if (cleanLower.includes('awesome') || cleanLower.includes('great') || cleanLower.includes('cool') || cleanLower.includes('nice') || cleanLower.includes('mast') || cleanLower.includes('badhiya') || cleanLower.includes('superb')) {
    return {
      text: `Aww, thank you so much! Anurag put his heart into hand-coding this studio. If there's any project you'd like to build, we'd be thrilled to team up!`,
      actionButtons: [
        {
          label: "✨ Let's Build Together",
          action: () => navigationCallback?.('contact'),
        },
      ],
      suggestions: ['What are your rates?', 'See demo projects', 'Chat on WhatsApp'],
      updatedContext: nextContext,
    };
  }

  // Thanks
  if (cleanLower.includes('thank') || cleanLower.includes('thanks') || cleanLower.includes('dhanyawad') || cleanLower.includes('shukriya') || cleanLower.includes('merci') || cleanLower.includes('gracias') || cleanLower.includes('danke')) {
    return {
      text: `You're very welcome! Always happy to help. Feel free to reach out to Anurag on WhatsApp whenever you're ready to create something memorable!`,
      suggestions: ['Keep WhatsApp handy', 'See services', 'Have a great day!'],
      updatedContext: nextContext,
    };
  }

  // Goodbye
  if (cleanLower.includes('bye') || cleanLower.includes('see you') || cleanLower.includes('alvida') || cleanLower.includes('tata') || cleanLower.includes('adios') || cleanLower.includes('au revoir')) {
    return {
      text: `Goodbye for now! 👋 Whenever you're ready to build a digital experience people remember, our door is always open. Take care! ✨`,
      updatedContext: nextContext,
    };
  }

  // ============================================================================
  // CONTEXTUAL DIALOGUE FALLBACK (NEVER KEYWORD-BLIND)
  // ============================================================================
  if (entities.businessType) {
    return {
      text: `Got it. For your **${entities.businessType}**, we can tailor the site around your exact needs. Are you looking to launch soon, or would you like to discuss the scope and pricing with Anurag first?`,
      actionButtons: [
        {
          label: '📱 Discuss on WhatsApp',
          action: () => window.open(ANURGO_BRAND.whatsappLink, '_blank'),
          icon: 'whatsapp',
        },
        {
          label: '📝 Fill Project Brief Form',
          action: () => navigationCallback?.('contact'),
        },
      ],
      suggestions: ['How much will it cost?', 'How long does it take?', 'Can you do it?'],
      updatedContext: nextContext,
    };
  }

  if (lang === 'hinglish') {
    return {
      text: `Samajh gaya! ANURGO me hum businesses, shops aur students ke liye custom websites banate hain. Aap kis tarah ke project ke baare me sochna chahenge?`,
      suggestions: ['Clothing shop website', 'Restaurant / Cafe site', 'Portfolio / Personal site'],
      updatedContext: nextContext,
    };
  }

  return {
    text: `I'd be glad to help with that. Whether you have a specific business in mind or are just exploring ideas, what kind of project are you thinking of creating?`,
    suggestions: ['I have a local shop', 'I need a business website', 'What are your prices?'],
    updatedContext: nextContext,
  };
}
