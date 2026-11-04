/**
 * Central Content Registry for TermFlow
 * Tracks all pages, guides, playbooks, and resources for search, breadcrumbs, and navigation
 */

export interface ContentMeta {
  slug: string;
  title: string;
  description: string;
  category: 'strategic' | 'playbook' | 'sector' | 'comparison' | 'guide' | 'resource' | 'location' | 'author';
  path: string;
  keywords: string[];
  lastUpdated: string; // ISO date format
  readingTime?: number; // minutes
  author?: string;
  downloadable?: boolean;
}

export const contentRegistry: ContentMeta[] = [
  // Existing pages
  {
    slug: 'landing',
    title: 'AI Automation for Student Lettings',
    description: 'Cut admin by 40% in one month with TermFlow',
    category: 'strategic',
    path: '/',
    keywords: ['AI automation', 'student lettings', 'PBSA', 'property management'],
    lastUpdated: '2025-01-20',
    author: 'TermFlow Team'
  },
  {
    slug: 'how-it-works',
    title: 'How TermFlow Works',
    description: 'See how AI automation transforms your lettings process',
    category: 'strategic',
    path: '/how-it-works',
    keywords: ['AI workflow', 'automation process', 'student accommodation'],
    lastUpdated: '2025-01-20',
    author: 'Harry Beaumont'
  },
  {
    slug: 'pricing',
    title: 'Pricing - TermFlow',
    description: 'Transparent pricing for PBSA automation from £99/month',
    category: 'strategic',
    path: '/pricing',
    keywords: ['pricing', 'plans', 'subscription', 'cost'],
    lastUpdated: '2025-01-20',
    author: 'TermFlow Team'
  },
  {
    slug: 'roi-calculator',
    title: 'ROI Calculator',
    description: 'Calculate your potential savings with AI automation',
    category: 'resource',
    path: '/roi-calculator',
    keywords: ['ROI', 'calculator', 'savings', 'cost benefit'],
    lastUpdated: '2025-01-20',
    author: 'TermFlow Team'
  },
  {
    slug: 'pbsa-guide-2025',
    title: 'Complete Guide to PBSA Automation',
    description: 'Free comprehensive guide to student accommodation automation',
    category: 'guide',
    path: '/resources/pbsa-automation-guide-2025',
    keywords: ['PBSA guide', 'automation guide', 'best practices'],
    lastUpdated: '2025-01-20',
    author: 'Harry Beaumont',
    readingTime: 25,
    downloadable: true
  },
  {
    slug: 'glossary',
    title: 'PBSA & Automation Glossary',
    description: 'Complete glossary of PBSA and automation terms',
    category: 'resource',
    path: '/resources/glossary',
    keywords: ['glossary', 'definitions', 'terminology', 'PBSA terms'],
    lastUpdated: '2025-01-20',
    author: 'TermFlow Team'
  },
  {
    slug: 'automation-ideas',
    title: 'PBSA Automation Ideas Library',
    description: 'Browse 30+ practical automation ideas for student accommodation providers with filters by category, complexity, and ROI impact',
    category: 'resource',
    path: '/automation-ideas',
    keywords: ['automation ideas', 'PBSA automation', 'lettings automation', 'workflow automation'],
    lastUpdated: '2025-01-20',
    author: 'TermFlow Team',
    readingTime: 15
  },
  // Location pages
  {
    slug: 'london-pbsa',
    title: 'London Student Accommodation Automation',
    description: 'AI automation for London PBSA operators',
    category: 'location',
    path: '/london-student-accommodation-automation',
    keywords: ['London PBSA', 'London student accommodation', 'London automation'],
    lastUpdated: '2025-01-20',
    author: 'TermFlow Team'
  },
  {
    slug: 'manchester-pbsa',
    title: 'Manchester Student Accommodation Automation',
    description: 'AI automation for Manchester PBSA operators',
    category: 'location',
    path: '/manchester-student-accommodation-automation',
    keywords: ['Manchester PBSA', 'Manchester student accommodation'],
    lastUpdated: '2025-01-20',
    author: 'TermFlow Team'
  },
  // Blog posts (dynamically loaded, but register them here for search)
  {
    slug: 'blog',
    title: 'Blog - TermFlow',
    description: 'Insights, guides, and best practices for PBSA automation',
    category: 'resource',
    path: '/blog',
    keywords: ['blog', 'articles', 'insights', 'guides'],
    lastUpdated: '2025-01-20',
    author: 'Multiple Authors'
  },
  // Author profiles
  {
    slug: 'author-alex-thompson',
    title: 'Harry Beaumont - Head of Product',
    description: 'Alex leads TermFlow\'s product strategy with 12+ years in PropTech and PBSA operations. Former VP of Operations at a top-10 UK student accommodation provider.',
    category: 'author',
    path: '/author/alex-thompson',
    keywords: ['Harry Beaumont', 'Head of Product', 'PropTech expert', 'PBSA operations', 'TermFlow team'],
    lastUpdated: '2025-01-20',
    author: 'Harry Beaumont'
  },
  {
    slug: 'author-sarah-chen',
    title: 'Sarah Chen - PBSA Operations Lead',
    description: 'Sarah specializes in operational excellence for purpose-built student accommodation with 8+ years experience in PBSA operations and process optimization.',
    category: 'author',
    path: '/author/sarah-chen',
    keywords: ['Sarah Chen', 'PBSA Operations Lead', 'student lettings', 'operations expert', 'TermFlow team'],
    lastUpdated: '2025-01-20',
    author: 'Sarah Chen'
  },
  {
    slug: 'author-james-mckenzie',
    title: 'James McKenzie - PropTech Analyst',
    description: 'James analyzes emerging trends in property technology and student accommodation markets. Former PropTech strategy consultant advising REITs and institutional investors.',
    category: 'author',
    path: '/author/james-mckenzie',
    keywords: ['James McKenzie', 'PropTech Analyst', 'market research', 'PBSA trends', 'TermFlow team'],
    lastUpdated: '2025-01-20',
    author: 'James McKenzie'
  },
  {
    slug: 'author-rachel-foster',
    title: 'Rachel Foster - Customer Success Manager',
    description: 'Rachel ensures TermFlow clients achieve maximum value from their automation investments with 5+ years in PBSA customer success and operations.',
    category: 'author',
    path: '/author/rachel-foster',
    keywords: ['Rachel Foster', 'Customer Success Manager', 'automation implementation', 'PBSA operations', 'TermFlow team'],
    lastUpdated: '2025-01-20',
    author: 'Rachel Foster'
  },
  // Buyer Persona Pages
  {
    slug: 'persona-pbsa-operators',
    title: 'For PBSA Operators (100-500 Beds)',
    description: 'How TermFlow helps PBSA operators scale without hiring, achieve 95%+ occupancy, and reduce admin by 40%',
    category: 'strategic',
    path: '/personas/pbsa-operators',
    keywords: ['PBSA operators', 'student accommodation automation', 'property management', 'clearing season', 'occupancy optimization'],
    lastUpdated: '2025-01-20',
    author: 'TermFlow Team',
    readingTime: 8
  },
  {
    slug: 'persona-on-site-managers',
    title: 'For On-Site Accommodation Managers',
    description: 'How TermFlow helps on-site managers reduce repetitive queries, improve tenant satisfaction, and reclaim time',
    category: 'strategic',
    path: '/personas/on-site-managers',
    keywords: ['accommodation manager', 'on-site property management', 'tenant satisfaction', 'maintenance coordination'],
    lastUpdated: '2025-01-20',
    author: 'TermFlow Team',
    readingTime: 7
  },
  {
    slug: 'persona-central-operations',
    title: 'For Central Operations Teams',
    description: 'How TermFlow helps operations teams achieve portfolio-wide standardisation, real-time visibility, and data-driven decisions',
    category: 'strategic',
    path: '/personas/central-operations',
    keywords: ['central operations', 'portfolio management', 'PBSA operations', 'multi-property management', 'standardisation'],
    lastUpdated: '2025-01-20',
    author: 'TermFlow Team',
    readingTime: 8
  },
  // Strategic Pages
  {
    slug: 'why-termflow',
    title: 'Why TermFlow vs Generic Automation?',
    description: 'Purpose-built PBSA automation vs Zapier, Make, and generic RPA tools. See the difference in features, integrations, and outcomes.',
    category: 'comparison',
    path: '/why-termflow',
    keywords: ['TermFlow vs Zapier', 'PBSA automation comparison', 'Make vs TermFlow', 'purpose-built automation'],
    lastUpdated: '2025-01-20',
    author: 'TermFlow Team',
    readingTime: 12
  },
  {
    slug: 'student-data-privacy',
    title: 'Student Data Privacy & Security',
    description: 'How TermFlow protects student data with GDPR compliance, UK data residency, AES-256 encryption, and transparent privacy practices',
    category: 'strategic',
    path: '/security/student-data-privacy',
    keywords: ['student data privacy', 'GDPR compliance', 'UK data residency', 'student accommodation security', 'Right-to-Rent data protection'],
    lastUpdated: '2025-01-20',
    author: 'TermFlow Team',
    readingTime: 15
  },
  {
    slug: 'outcomes',
    title: 'PBSA Outcomes & Results',
    description: 'Quantifiable outcomes from PBSA operators using TermFlow: 98% occupancy, 6-day lead-to-contract time, £23 saved per bed per month',
    category: 'strategic',
    path: '/outcomes',
    keywords: ['PBSA outcomes', 'student accommodation ROI', 'lettings automation results', 'occupancy improvement'],
    lastUpdated: '2025-01-20',
    author: 'TermFlow Team',
    readingTime: 10
  },
  {
    slug: 'start-here',
    title: 'Getting Started with TermFlow',
    description: 'Step-by-step onboarding guide: what to expect, what to prepare, timeline, and KPIs to track for PBSA automation success',
    category: 'guide',
    path: '/start-here',
    keywords: ['TermFlow onboarding', 'PBSA implementation', 'automation onboarding', 'getting started guide'],
    lastUpdated: '2025-01-20',
    author: 'TermFlow Team',
    readingTime: 14
  },
  {
    slug: 'vendor-due-diligence',
    title: 'Vendor Due Diligence Pack',
    description: 'Complete vendor assessment information for procurement teams: security posture, DPA templates, compliance certifications, SLA commitments',
    category: 'resource',
    path: '/procurement/due-diligence',
    keywords: ['vendor due diligence', 'PBSA security compliance', 'software procurement', 'DPA template', 'security questionnaire'],
    lastUpdated: '2025-01-20',
    author: 'TermFlow Team',
    readingTime: 12,
    downloadable: true
  },
  {
    slug: 'service-areas',
    title: 'Service Areas - UK & Ireland Coverage',
    description: 'TermFlow serves PBSA operators across the UK & Ireland with AI automation, GDPR compliance, and UK data residency',
    category: 'strategic',
    path: '/service-areas',
    keywords: ['PBSA service areas', 'UK student accommodation automation', 'GDPR compliant automation', 'UK data residency'],
    lastUpdated: '2025-01-20',
    author: 'TermFlow Team',
    readingTime: 6
  },
  {
    slug: 'sales-deck',
    title: 'Sales Deck Download',
    description: 'Download the TermFlow sales deck: one-page overview of PBSA automation, key results, case studies, and pricing',
    category: 'resource',
    path: '/resources/sales-deck',
    keywords: ['TermFlow sales deck', 'PBSA automation overview', 'student accommodation pitch deck', 'ROI one-pager'],
    lastUpdated: '2025-01-20',
    author: 'TermFlow Team',
    downloadable: true
  },
  // Playbooks
  {
    slug: 'tenant-onboarding-automation',
    title: 'Tenant Onboarding Automation Playbook',
    description: 'Complete automation from first enquiry to move-in. Reduce 8 hours of manual work to 90 minutes with automated viewings, contracts, and ID checks.',
    category: 'playbook',
    path: '/playbooks/tenant-onboarding-automation',
    keywords: ['tenant onboarding automation', 'PBSA onboarding', 'student letting automation', 'automated contracts', 'viewing automation'],
    lastUpdated: '2025-01-20',
    author: 'TermFlow Team',
    readingTime: 15
  },
  {
    slug: 'id-document-collection',
    title: 'ID & Document Collection Automation Playbook',
    description: 'Automate passport, visa, and ID document collection with 98% OCR accuracy. Reduce manual work from 4 hours to 15 minutes per tenant.',
    category: 'playbook',
    path: '/playbooks/id-document-collection',
    keywords: ['ID document collection', 'passport OCR', 'visa verification automation', 'Right-to-Rent automation', 'GDPR document storage'],
    lastUpdated: '2025-01-20',
    author: 'TermFlow Team',
    readingTime: 14
  },
  {
    slug: 'maintenance-triage-automation',
    title: 'Maintenance Triage Automation Playbook',
    description: 'AI-powered maintenance triage with smart routing and SLA tracking. Reduce daily work from 2 hours to 20 minutes.',
    category: 'playbook',
    path: '/playbooks/maintenance-triage-automation',
    keywords: ['maintenance triage automation', 'property maintenance automation', 'AI maintenance categorization', 'SLA tracking', 'contractor management'],
    lastUpdated: '2025-01-20',
    author: 'TermFlow Team',
    readingTime: 13
  },
  {
    slug: 'arrears-nudging-automation',
    title: 'Arrears Management Automation Playbook',
    description: 'Automated rent collection with pre-due reminders, payment links, and escalation workflows. Reduce arrears by £18k/year per 100 beds.',
    category: 'playbook',
    path: '/playbooks/arrears-nudging-automation',
    keywords: ['arrears management automation', 'rent collection automation', 'automated rent reminders', 'payment link generation', 'student rent collection'],
    lastUpdated: '2025-01-20',
    author: 'TermFlow Team',
    readingTime: 14
  },
  {
    slug: 'inspection-scheduling-automation',
    title: 'Inspection Scheduling Automation Playbook',
    description: 'Automate property inspections from scheduling to reporting. Achieve 95% completion rate with 2-day report turnaround.',
    category: 'playbook',
    path: '/playbooks/inspection-scheduling-automation',
    keywords: ['property inspection automation', 'inspection scheduling software', 'automated inspection reports', 'digital inspection checklist', 'PBSA compliance'],
    lastUpdated: '2025-01-20',
    author: 'TermFlow Team',
    readingTime: 15
  },
  {
    slug: 'room-allocation-optimization',
    title: 'Room Allocation Optimization Playbook',
    description: 'AI-powered room matching based on preferences, group requests, and fairness. Achieve 87% first-choice allocation satisfaction.',
    category: 'playbook',
    path: '/playbooks/room-allocation-optimization',
    keywords: ['room allocation automation', 'student room matching', 'AI room assignment', 'group booking allocation', 'PBSA room optimization'],
    lastUpdated: '2025-01-20',
    author: 'TermFlow Team',
    readingTime: 14
  },
  {
    slug: 'playbooks-hub',
    title: 'PBSA Automation Playbooks',
    description: '6 battle-tested workflows to automate your PBSA operations: onboarding, ID collection, maintenance, arrears, inspections, and room allocation',
    category: 'strategic',
    path: '/playbooks',
    keywords: ['PBSA playbooks', 'automation workflows', 'student accommodation playbooks', 'PBSA operational guides'],
    lastUpdated: '2025-01-20',
    author: 'TermFlow Team',
    readingTime: 8
  },
  // Sector Pages
  {
    slug: 'sector-university-operators',
    title: 'TermFlow for University-Managed Accommodation',
    description: 'AI automation for in-house university accommodation teams. Handle clearing season, RTR compliance, and budget constraints efficiently.',
    category: 'sector',
    path: '/sectors/university-operators',
    keywords: ['university accommodation automation', 'halls of residence automation', 'clearing season automation', 'university PBSA', 'RTR compliance'],
    lastUpdated: '2025-01-20',
    author: 'TermFlow Team',
    readingTime: 11
  },
  {
    slug: 'sector-pbsa-reits',
    title: 'TermFlow for PBSA REITs & Institutional Investors',
    description: 'Portfolio-wide automation for large-scale PBSA portfolios (1,000+ beds). Standardization, analytics, and enterprise features.',
    category: 'sector',
    path: '/sectors/pbsa-reits',
    keywords: ['PBSA REIT automation', 'institutional student accommodation', 'portfolio automation', 'multi-property management', 'enterprise PBSA'],
    lastUpdated: '2025-01-20',
    author: 'TermFlow Team',
    readingTime: 12
  },
  {
    slug: 'sector-boutique-student-houses',
    title: 'TermFlow for Boutique Student Housing Providers',
    description: 'Affordable automation for small-to-medium independent providers (10-100 beds). Simple setup, no tech team needed.',
    category: 'sector',
    path: '/sectors/boutique-student-houses',
    keywords: ['boutique student accommodation', 'independent landlord automation', 'small PBSA automation', 'affordable lettings automation'],
    lastUpdated: '2025-01-20',
    author: 'TermFlow Team',
    readingTime: 10
  },
  {
    slug: 'sector-build-to-rent-crossover',
    title: 'TermFlow for Build-to-Rent Operators with Student Tenants',
    description: 'Student-specific automation layered on BTR operations. Handle student intake cycles, guarantor management, and academic calendars.',
    category: 'sector',
    path: '/sectors/build-to-rent-crossover',
    keywords: ['BTR student accommodation', 'build-to-rent automation', 'co-living automation', 'student BTR', 'mixed-use automation'],
    lastUpdated: '2025-01-20',
    author: 'TermFlow Team',
    readingTime: 11
  },
  {
    slug: 'sector-crm-heavy-teams',
    title: 'TermFlow for StarRez, Kinetic & Student CRM Users',
    description: 'Automation that sits on top of your existing CRM. StarRez/Kinetic integration, automated data entry, workflow orchestration.',
    category: 'sector',
    path: '/sectors/crm-heavy-teams',
    keywords: ['StarRez integration', 'Kinetic CRM automation', 'student CRM automation', 'PBSA CRM integration', 'workflow orchestration'],
    lastUpdated: '2025-01-20',
    author: 'TermFlow Team',
    readingTime: 12
  },
  {
    slug: 'sector-international-intakes',
    title: 'TermFlow for Operators with High International Student Volumes',
    description: 'Multilingual AI (10+ languages), visa workflow automation, BRP tracking, and sponsor license compliance for international students.',
    category: 'sector',
    path: '/sectors/international-intakes',
    keywords: ['international student automation', 'multilingual PBSA', 'visa automation', 'BRP tracking', 'sponsor license compliance'],
    lastUpdated: '2025-01-20',
    author: 'TermFlow Team',
    readingTime: 13
  },
  // Comparison Guides
  {
    slug: 'comparison-ai-vs-manual',
    title: 'AI Automation vs Manual PBSA Workflows: Complete Comparison',
    description: 'Side-by-side comparison of 10 PBSA workflows: manual process vs AI automation. See time savings, cost reduction, and accuracy improvements.',
    category: 'comparison',
    path: '/comparisons/ai-vs-manual-workflows',
    keywords: ['AI vs manual workflows', 'PBSA automation ROI', 'manual lettings cost', 'automation time savings'],
    lastUpdated: '2025-01-20',
    author: 'TermFlow Team',
    readingTime: 14
  },
  {
    slug: 'comparison-rpa-vs-api',
    title: 'RPA vs API Integration for PBSA: Which Approach is Right?',
    description: 'Understand RPA (Robotic Process Automation) vs API-first integration for student accommodation. Pros, cons, and when to use each.',
    category: 'comparison',
    path: '/comparisons/rpa-vs-api-integration',
    keywords: ['RPA vs API', 'robotic process automation', 'API integration', 'PBSA integration strategy', 'automation architecture'],
    lastUpdated: '2025-01-20',
    author: 'TermFlow Team',
    readingTime: 13
  },
  {
    slug: 'comparison-zapier-make-n8n',
    title: 'Zapier vs Make vs n8n for PBSA Automation: Honest Comparison',
    description: 'Feature, cost, and reliability comparison of Zapier, Make, n8n, and TermFlow for PBSA automation. See which fits your needs.',
    category: 'comparison',
    path: '/comparisons/zapier-vs-make-vs-n8n',
    keywords: ['Zapier vs Make', 'n8n PBSA', 'automation platform comparison', 'no-code automation', 'PBSA workflow tools'],
    lastUpdated: '2025-01-20',
    author: 'TermFlow Team',
    readingTime: 15
  },
  // Resource Guides
  {
    slug: 'pbsa-metrics-guide',
    title: 'Complete Guide to PBSA Metrics & KPIs',
    description: 'Track occupancy, financial, operational, and satisfaction metrics for student accommodation. Includes downloadable spreadsheet template.',
    category: 'guide',
    path: '/resources/pbsa-metrics-guide',
    keywords: ['PBSA metrics', 'student accommodation KPIs', 'occupancy metrics', 'RevPAB', 'PBSA benchmarks', 'lettings KPIs'],
    lastUpdated: '2025-01-20',
    author: 'TermFlow Team',
    readingTime: 18,
    downloadable: true
  },
  {
    slug: 'pbsa-calendar-2025',
    title: 'The PBSA Automation Calendar: When to Implement What in 2025-26',
    description: 'Month-by-month automation guide for the PBSA academic year. Clearing season strategy, implementation timelines, and preparation checklists.',
    category: 'guide',
    path: '/resources/pbsa-calendar-2025',
    keywords: ['PBSA calendar', 'clearing season timing', 'student accommodation season', 'PBSA implementation timeline', 'academic year automation'],
    lastUpdated: '2025-01-20',
    author: 'TermFlow Team',
    readingTime: 16
  },
  // Universities Index
  {
    slug: 'universities-index',
    title: 'UK Universities & PBSA Operators We Work With',
    description: 'See which UK universities and PBSA operators use TermFlow across 12 cities. Search by city or university name.',
    category: 'resource',
    path: '/universities',
    keywords: ['UK universities', 'PBSA operators', 'university accommodation', 'student housing providers', 'TermFlow customers'],
    lastUpdated: '2025-01-20',
    author: 'TermFlow Team',
    readingTime: 8
  },
  // One-Pagers (Downloadable)
  {
    slug: 'executive-summary',
    title: 'Executive Summary - TermFlow One-Pager',
    description: 'One-page executive summary of TermFlow for decision makers. Download as PDF for internal sharing.',
    category: 'resource',
    path: '/one-pagers/executive-summary',
    keywords: ['executive summary', 'one pager', 'overview', 'decision makers', 'PDF download'],
    lastUpdated: '2025-01-20',
    author: 'TermFlow Team',
    downloadable: true
  },
  {
    slug: 'technical-overview',
    title: 'Technical Overview - TermFlow One-Pager',
    description: 'Technical architecture, security, and integration specifications for IT and security teams. Download as PDF.',
    category: 'resource',
    path: '/one-pagers/technical-overview',
    keywords: ['technical overview', 'security specifications', 'IT documentation', 'architecture', 'PDF download'],
    lastUpdated: '2025-01-20',
    author: 'TermFlow Team',
    downloadable: true
  },
  {
    slug: 'procurement-pack',
    title: 'Procurement Pack - TermFlow One-Pager',
    description: 'Pricing tiers, ROI analysis, contract terms, and payment options for procurement and finance teams. Download as PDF.',
    category: 'resource',
    path: '/one-pagers/procurement-pack',
    keywords: ['procurement', 'pricing', 'contract terms', 'ROI', 'finance', 'PDF download'],
    lastUpdated: '2025-01-20',
    author: 'TermFlow Team',
    downloadable: true
  },
];

// Helper functions
export function getContentBySlug(slug: string): ContentMeta | undefined {
  return contentRegistry.find(c => c.slug === slug);
}

export function getContentByCategory(category: ContentMeta['category']): ContentMeta[] {
  return contentRegistry.filter(c => c.category === category);
}

export function searchContent(query: string): ContentMeta[] {
  const lowerQuery = query.toLowerCase();
  return contentRegistry.filter(c => 
    c.title.toLowerCase().includes(lowerQuery) ||
    c.description.toLowerCase().includes(lowerQuery) ||
    c.keywords.some(k => k.toLowerCase().includes(lowerQuery))
  );
}

export function getAllPaths(): string[] {
  return contentRegistry.map(c => c.path);
}
