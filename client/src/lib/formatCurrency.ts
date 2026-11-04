/**
 * Format currency with K/M notation for large numbers
 * Under £1,000: Preserves 2 decimal places (e.g., £999.60, £50.00, £0.75)
 * £1,000+: £1K, £1.5K, £25.5K  
 * £1,000,000+: £1M, £1.5M
 */
export function formatCurrency(value: number | string | null | undefined, showDecimals: boolean = true): string {
  const num = typeof value === 'string' ? parseFloat(value) : (value || 0);
  
  if (isNaN(num)) return '£0';
  
  // Under £1,000 - preserve 2 decimal precision
  if (num < 1000) {
    // Always show 2 decimal places for consistency (e.g., £999.60, £50.00)
    return `£${num.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  
  // £1,000,000+ - show as M
  if (num >= 1000000) {
    const millions = num / 1000000;
    if (showDecimals && millions % 1 !== 0) {
      return `£${millions.toFixed(1)}M`;
    }
    return `£${Math.round(millions)}M`;
  }
  
  // £1,000 - £999,999 - show as K
  const thousands = num / 1000;
  if (showDecimals && thousands % 1 !== 0) {
    return `£${thousands.toFixed(1)}K`;
  }
  return `£${Math.round(thousands)}K`;
}
