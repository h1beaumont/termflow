/**
 * SkipLink Component - Accessibility Enhancement
 * 
 * Provides a "Skip to main content" link that appears when focused via keyboard navigation.
 * This allows keyboard users to bypass repetitive navigation and jump directly to main content.
 * 
 * WCAG 2.1 Level A Requirement: Bypass Blocks (2.4.1)
 */

export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-tf-lime focus:text-tf-navy focus:font-bold focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-tf-navy focus:ring-offset-2"
      data-testid="link-skip-to-main"
    >
      Skip to main content
    </a>
  );
}
