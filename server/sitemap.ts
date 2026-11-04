// Sitemap generation for TermFlow
// Public pages that should be indexed by search engines

export function generateSitemap(): string {
  const baseUrl = 'https://termflow.co.uk';
  const currentDate = new Date().toISOString().split('T')[0];

  const urls = [
    // Main pages - highest priority
    { loc: '/', priority: '1.0', changefreq: 'weekly' },
    { loc: '/pricing', priority: '0.9', changefreq: 'monthly' },
    { loc: '/how-it-works', priority: '0.9', changefreq: 'monthly' },
    { loc: '/book-demo', priority: '0.8', changefreq: 'monthly' },
    { loc: '/book-demo/confirmation', priority: '0.6', changefreq: 'yearly' },
    { loc: '/contact', priority: '0.7', changefreq: 'monthly' },
    
    // Blog & Content
    { loc: '/blog', priority: '0.9', changefreq: 'weekly' },
    { loc: '/blog/ai-automation-reduces-lettings-admin-20-hours-per-week', priority: '0.8', changefreq: 'monthly' },
    { loc: '/blog/pbsa-operations-guide-2025', priority: '0.8', changefreq: 'monthly' },
    { loc: '/blog/clearing-season-survival-guide-400-enquiries-per-week', priority: '0.8', changefreq: 'monthly' },
    { loc: '/blog/student-letting-software-uk-complete-guide-2025', priority: '0.8', changefreq: 'monthly' },
    { loc: '/blog/whatsapp-automation-student-lettings-guide-2025', priority: '0.8', changefreq: 'monthly' },
    { loc: '/blog/digital-contracts-student-accommodation-legal-guide-2025', priority: '0.8', changefreq: 'monthly' },
    { loc: '/case-studies', priority: '0.7', changefreq: 'monthly' },
    
    // Location Pages (SEO targeting)
    { loc: '/london-student-accommodation-automation', priority: '0.8', changefreq: 'monthly' },
    { loc: '/manchester-student-accommodation-automation', priority: '0.8', changefreq: 'monthly' },
    { loc: '/bristol-student-accommodation-automation', priority: '0.8', changefreq: 'monthly' },
    { loc: '/edinburgh-student-accommodation-automation', priority: '0.8', changefreq: 'monthly' },
    { loc: '/newcastle-student-accommodation-automation', priority: '0.8', changefreq: 'monthly' },
    { loc: '/birmingham-student-accommodation-automation', priority: '0.8', changefreq: 'monthly' },
    { loc: '/leeds-student-accommodation-automation', priority: '0.8', changefreq: 'monthly' },
    { loc: '/glasgow-student-accommodation-automation', priority: '0.8', changefreq: 'monthly' },
    { loc: '/sheffield-student-accommodation-automation', priority: '0.8', changefreq: 'monthly' },
    { loc: '/liverpool-student-accommodation-automation', priority: '0.8', changefreq: 'monthly' },
    
    // Feature pages
    { loc: '/security-privacy', priority: '0.6', changefreq: 'yearly' },
    { loc: '/operator-bundle', priority: '0.6', changefreq: 'monthly' },
    { loc: '/clearing-mode', priority: '0.6', changefreq: 'yearly' },
    
    // Buyer Persona Pages
    { loc: '/personas/pbsa-operators', priority: '0.8', changefreq: 'monthly' },
    { loc: '/personas/on-site-managers', priority: '0.8', changefreq: 'monthly' },
    { loc: '/personas/central-operations', priority: '0.8', changefreq: 'monthly' },
    
    // Strategic Pages
    { loc: '/why-termflow', priority: '0.8', changefreq: 'monthly' },
    { loc: '/security/student-data-privacy', priority: '0.7', changefreq: 'yearly' },
    { loc: '/outcomes', priority: '0.9', changefreq: 'monthly' },
    { loc: '/start-here', priority: '0.8', changefreq: 'monthly' },
    { loc: '/procurement/due-diligence', priority: '0.7', changefreq: 'yearly' },
    { loc: '/service-areas', priority: '0.7', changefreq: 'monthly' },
    
    // Tools & Resources
    { loc: '/roi-calculator', priority: '0.8', changefreq: 'monthly' },
    { loc: '/resources/pbsa-automation-guide-2025', priority: '0.8', changefreq: 'monthly' },
    { loc: '/resources/glossary', priority: '0.7', changefreq: 'monthly' },
    { loc: '/resources/sales-deck', priority: '0.7', changefreq: 'monthly' },
    { loc: '/automation-ideas', priority: '0.8', changefreq: 'monthly' },
    
    // Playbooks
    { loc: '/playbooks', priority: '0.9', changefreq: 'monthly' },
    { loc: '/playbooks/tenant-onboarding-automation', priority: '0.8', changefreq: 'monthly' },
    { loc: '/playbooks/id-document-collection', priority: '0.8', changefreq: 'monthly' },
    { loc: '/playbooks/maintenance-triage-automation', priority: '0.8', changefreq: 'monthly' },
    { loc: '/playbooks/arrears-nudging-automation', priority: '0.8', changefreq: 'monthly' },
    { loc: '/playbooks/inspection-scheduling-automation', priority: '0.8', changefreq: 'monthly' },
    { loc: '/playbooks/room-allocation-optimization', priority: '0.8', changefreq: 'monthly' },
    
    // Sector Pages
    { loc: '/sectors/university-operators', priority: '0.8', changefreq: 'monthly' },
    { loc: '/sectors/pbsa-reits', priority: '0.8', changefreq: 'monthly' },
    { loc: '/sectors/boutique-student-houses', priority: '0.8', changefreq: 'monthly' },
    { loc: '/sectors/build-to-rent-crossover', priority: '0.8', changefreq: 'monthly' },
    { loc: '/sectors/crm-heavy-teams', priority: '0.8', changefreq: 'monthly' },
    { loc: '/sectors/international-intakes', priority: '0.8', changefreq: 'monthly' },
    
    // Comparison Guides
    { loc: '/comparisons/ai-vs-manual-workflows', priority: '0.8', changefreq: 'monthly' },
    { loc: '/comparisons/rpa-vs-api-integration', priority: '0.8', changefreq: 'monthly' },
    { loc: '/comparisons/zapier-vs-make-vs-n8n', priority: '0.8', changefreq: 'monthly' },
    
    // Additional Resource Guides
    { loc: '/resources/pbsa-metrics-guide', priority: '0.8', changefreq: 'monthly' },
    { loc: '/resources/pbsa-calendar-2025', priority: '0.8', changefreq: 'monthly' },
    
    // One-Pagers (Downloadable)
    { loc: '/one-pagers/executive-summary', priority: '0.7', changefreq: 'monthly' },
    { loc: '/one-pagers/technical-overview', priority: '0.7', changefreq: 'monthly' },
    { loc: '/one-pagers/procurement-pack', priority: '0.7', changefreq: 'monthly' },
    
    // Universities & Operators Index
    { loc: '/universities', priority: '0.7', changefreq: 'monthly' },
    
    // Legal pages
    { loc: '/legal/terms', priority: '0.3', changefreq: 'yearly' },
    { loc: '/legal/privacy', priority: '0.3', changefreq: 'yearly' },
    { loc: '/legal/dpa', priority: '0.3', changefreq: 'yearly' },
    { loc: '/legal/gdpr', priority: '0.3', changefreq: 'yearly' },
    { loc: '/legal/cookies', priority: '0.3', changefreq: 'yearly' },
    { loc: '/legal/aup', priority: '0.3', changefreq: 'yearly' },
  ];

  const urlEntries = urls.map(({ loc, priority, changefreq }) => `
  <url>
    <loc>${baseUrl}${loc}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urlEntries}
</urlset>`;
}
