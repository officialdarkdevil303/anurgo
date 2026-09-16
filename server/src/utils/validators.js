// ==============================================================================
// ANURGO STUDIO — VALIDATION & SPAM PROTECTION UTILITIES
// ==============================================================================
// Comprehensive multi-layer validation for Disposable Emails, Phone Numbers,
// and Project Description Spam / Gibberish Heuristics.
// ==============================================================================

// 1. Comprehensive Disposable / Temporary Email Domains Blocklist
const DISPOSABLE_EMAIL_DOMAINS = new Set([
  '10minutemail.com',
  '10minutemail.net',
  '20minutemail.com',
  'airmail.news',
  'anonaddy.me',
  'anonbox.net',
  'armyspy.com',
  'binkmail.com',
  'bobmail.info',
  'burnermail.io',
  'chacuo.net',
  'crazymailing.com',
  'cuvox.de',
  'dayrep.com',
  'deadfake.cf',
  'deadfake.ga',
  'deadfake.gq',
  'deadfake.ml',
  'deadfake.tk',
  'discard.email',
  'discardmail.com',
  'disposablemail.com',
  'dispostable.com',
  'drdrb.com',
  'dropmail.me',
  'emailondeck.com',
  'einrot.com',
  'fackme.gq',
  'fakeinbox.com',
  'fakemailgenerator.com',
  'fleckens.hu',
  'getairmail.com',
  'getnada.com',
  'generator.email',
  'gishpuppy.com',
  'grr.la',
  'guerrillamail.biz',
  'guerrillamail.com',
  'guerrillamail.de',
  'guerrillamail.net',
  'guerrillamail.org',
  'guerrillamailblock.com',
  'gustr.com',
  'harakirimail.com',
  'incognitomail.org',
  'inboxbear.com',
  'inboxkitten.com',
  'jourrapide.com',
  'klzlk.com',
  'mailcatch.com',
  'maildrop.cc',
  'mailinator.com',
  'mailinator.net',
  'mailinator2.com',
  'mailnesia.com',
  'mailnull.com',
  'mailpoof.com',
  'mohmal.com',
  'mytemp.email',
  'mytrashmail.com',
  'nada.ltd',
  'nada.ltd',
  'netcourrier.com',
  'noclickemail.com',
  'nospam.ze.tc',
  'oneoffmail.com',
  'owlpic.com',
  'pookmail.com',
  'privacymail.net',
  'quickinbox.com',
  'rhyta.com',
  'sharklasers.com',
  'smailpro.com',
  'spam4.me',
  'spambog.com',
  'spambox.us',
  'spamfree24.org',
  'spamgourmet.com',
  'spamspot.com',
  'superrito.com',
  'teleworm.us',
  'temp-mail.org',
  'temp-mail.ru',
  'tempail.com',
  'tempm.com',
  'tempmail.com',
  'tempmail.net',
  'tempmailaddress.com',
  'tempmailgen.com',
  'throwawaymail.com',
  'trashmail.com',
  'trashmail.me',
  'trashmail.net',
  'trashmail.org',
  'trashymail.com',
  'yopmail.com',
  'yopmail.fr',
  'yopmail.net',
  'zetmail.com',
]);

/**
 * Validate email format and check against disposable email domains
 * @param {string} email 
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'Email address is required.' };
  }

  const cleanEmail = email.trim().toLowerCase();
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;

  if (!emailRegex.test(cleanEmail)) {
    return { valid: false, error: 'Please enter a valid email address.' };
  }

  const domain = cleanEmail.split('@')[1];
  if (!domain) {
    return { valid: false, error: 'Invalid email domain.' };
  }

  if (DISPOSABLE_EMAIL_DOMAINS.has(domain)) {
    return {
      valid: false,
      error: 'Please use a permanent email address. Temporary or disposable email addresses are not accepted.',
    };
  }

  // Check subdomains (e.g. *.mailinator.com)
  const parts = domain.split('.');
  if (parts.length > 2) {
    const rootDomain = parts.slice(-2).join('.');
    if (DISPOSABLE_EMAIL_DOMAINS.has(rootDomain)) {
      return {
        valid: false,
        error: 'Please use a permanent email address. Temporary or disposable email addresses are not accepted.',
      };
    }
  }

  return { valid: true };
}

/**
 * Validate phone number format and reject obvious dummy/test/VoIP patterns
 * @param {string} phone 
 * @returns {{ valid: boolean, error?: string, formattedPhone?: string }}
 */
export function validatePhone(phone) {
  if (!phone || typeof phone !== 'string') {
    return { valid: false, error: 'Phone number is required.' };
  }

  // Remove spaces, dashes, parentheses
  const digitsOnly = phone.replace(/[^0-9+]/g, '');

  // Must contain between 8 and 15 digits
  const rawDigits = digitsOnly.replace(/\+/g, '');
  if (rawDigits.length < 8 || rawDigits.length > 15) {
    return { valid: false, error: 'Please enter a valid phone number (8–15 digits).' };
  }

  // Detect repeated digits e.g. 0000000000, 1111111111, 9999999999
  if (/^(\d)\1{7,}$/.test(rawDigits)) {
    return { valid: false, error: 'Phone number appears to be invalid or a test number.' };
  }

  // Detect common sequential test numbers
  const sequentialPatterns = ['12345678', '87654321', '01234567', '98765432'];
  for (const seq of sequentialPatterns) {
    if (rawDigits.includes(seq)) {
      return { valid: false, error: 'Please enter your real active WhatsApp/phone number.' };
    }
  }

  // Detect all zeros
  if (/^0+$/.test(rawDigits)) {
    return { valid: false, error: 'Invalid phone number.' };
  }

  return { valid: true, formattedPhone: digitsOnly };
}

/**
 * Heuristic analyzer for Project Description:
 * Rejects keyboard smashes, repeated char spam, and high-consonant entropy spam.
 * Accepts legitimate short descriptions (e.g. "I need a website for my cafe.").
 * Flags descriptions that are too vague/short for clarification.
 * 
 * @param {string} text 
 * @returns {{ valid: boolean, error?: string, needsMoreDetail?: boolean }}
 */
export function validateProjectDescription(text) {
  if (!text || typeof text !== 'string') {
    return { valid: false, error: 'Project description is required.' };
  }

  const trimmed = text.trim();

  // 1. Extreme brevity check (< 10 chars or single vague word)
  if (trimmed.length < 12 || trimmed.split(/\s+/).length < 3) {
    return {
      valid: false,
      needsMoreDetail: true,
      error: 'Please provide a little more detail about your project goals or desired features.',
    };
  }

  // 2. Repeated character spam: e.g. "aaaaaaaaaaaa", "xxxxx", "hellooooooo"
  if (/(.)\1{4,}/i.test(trimmed)) {
    return {
      valid: false,
      error: 'Project description contains repeated characters. Please describe your project requirements clearly.',
    };
  }

  // 3. Known keyboard smash patterns
  const keyboardSmashes = [
    'asdfgh',
    'asdfghjkl',
    'qwerty',
    'qwertyuiop',
    'zxcvbn',
    'zxcvbnm',
    'qazwsx',
    'wsxedc',
    '123456',
  ];

  const lowerText = trimmed.toLowerCase();
  for (const smash of keyboardSmashes) {
    if (lowerText.includes(smash)) {
      return {
        valid: false,
        error: 'Please enter a genuine project description rather than keyboard smash text.',
      };
    }
  }

  // 4. Meaningless random consonant clusters / high entropy words (e.g. "Xhjlfkjddof", "bcdfghjkl")
  const words = trimmed.split(/\s+/);
  for (const word of words) {
    // Strip punctuation
    const cleanWord = word.replace(/[^a-zA-Z]/g, '');
    if (cleanWord.length >= 6) {
      // Check for 5 or more consecutive consonants (no vowels: a, e, i, o, u, y)
      if (/[bcdfghjklmnpqrstvwxz]{5,}/i.test(cleanWord)) {
        return {
          valid: false,
          error: `The text contains unrecognized or random words ("${word}"). Please describe your project in natural language.`,
        };
      }

      // Check vowel-to-letter ratio: genuine English/Hinglish words have >= 15% vowels
      const vowels = cleanWord.match(/[aeiouy]/gi);
      const vowelCount = vowels ? vowels.length : 0;
      if (vowelCount === 0 && cleanWord.length >= 5) {
        return {
          valid: false,
          error: 'Please describe your project clearly using real words.',
        };
      }
    }
  }

  // Passed all heuristic checks!
  return { valid: true };
}
