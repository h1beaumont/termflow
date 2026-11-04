/**
 * Template Helper Utilities
 * 
 * Utilities for working with message templates and Thompson Sampling
 */

/**
 * Replace variables in template text
 * 
 * Example:
 *   replaceVariables("Hi {name}, your viewing is at {time}", { name: "John", time: "4pm" })
 *   => "Hi John, your viewing is at 4pm"
 */
export function replaceVariables(text: string, vars: Record<string, string>): string {
  let result = text;
  for (const [key, value] of Object.entries(vars)) {
    // Replace all occurrences of {key} with value
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), value || '');
  }
  return result;
}

/**
 * Extract context from lead data for Thompson Sampling cohort selection
 */
export function extractLeadContext(lead: any): {
  source: string;
  nationality: string;
  groupSize: number;
  hour: number;
} {
  return {
    source: lead.source || 'whatsapp',
    nationality: lead.nationality || 'uk',
    groupSize: lead.groupSize || 1,
    hour: new Date().getHours(),
  };
}

/**
 * Format date/time for template variables
 */
export function formatViewingTime(date: Date): string {
  return date.toLocaleString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Generate viewing time slot variables for templates
 */
export function generateViewingSlotVars(slots: Date[]): Record<string, string> {
  const vars: Record<string, string> = {};
  slots.forEach((slot, index) => {
    vars[`s${index + 1}`] = formatViewingTime(slot);
  });
  return vars;
}
