import { createHash } from 'crypto';

// PII patterns to redact from logs
const PII_PATTERNS = {
  email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
  phone: /\b(\+44|0)\d{10}\b/g, // UK phone numbers
  postcode: /\b[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}\b/gi, // UK postcodes
  
  // Common PII field names in objects
  piiFields: ['password', 'ssn', 'national_insurance', 'passport', 'dateofbirth', 'dob'],
};

/**
 * Sanitize PII from any value (string, object, array)
 */
export function sanitizePII(value: any): any {
  if (typeof value === 'string') {
    return sanitizeString(value);
  }
  
  if (Array.isArray(value)) {
    return value.map(item => sanitizePII(item));
  }
  
  if (value && typeof value === 'object') {
    return sanitizeObject(value);
  }
  
  return value;
}

/**
 * Sanitize PII from strings
 */
function sanitizeString(str: string): string {
  let sanitized = str;
  
  // Redact emails
  sanitized = sanitized.replace(PII_PATTERNS.email, (match) => {
    const [localPart, domain] = match.split('@');
    return `${localPart.substring(0, 2)}***@${domain}`;
  });
  
  // Redact phone numbers
  sanitized = sanitized.replace(PII_PATTERNS.phone, (match) => {
    return match.substring(0, 5) + '******';
  });
  
  // Redact postcodes
  sanitized = sanitized.replace(PII_PATTERNS.postcode, () => '****** (postcode redacted)');
  
  return sanitized;
}

/**
 * Sanitize PII from objects
 */
function sanitizeObject(obj: any): any {
  const sanitized: any = {};
  
  for (const [key, value] of Object.entries(obj)) {
    // Check if key is a known PII field
    if (PII_PATTERNS.piiFields.includes(key.toLowerCase())) {
      sanitized[key] = '[REDACTED]';
    } else {
      sanitized[key] = sanitizePII(value);
    }
  }
  
  return sanitized;
}

/**
 * Create a safe hash of PII for logging/tracking without exposing raw data
 */
export function hashPII(value: string): string {
  return createHash('sha256').update(value).digest('hex').substring(0, 12);
}

/**
 * Safe console.log that automatically sanitizes PII
 */
export function safeLog(message: string, data?: any) {
  const sanitizedData = data ? sanitizePII(data) : undefined;
  console.log(`[SAFE] ${message}`, sanitizedData);
}

/**
 * Safe error logging that redacts PII from error messages
 */
export function safeError(message: string, error: any) {
  const sanitizedError = {
    message: sanitizeString(error.message || String(error)),
    stack: error.stack ? sanitizeString(error.stack) : undefined,
    ...sanitizePII(error),
  };
  console.error(`[SAFE ERROR] ${message}`, sanitizedError);
}
