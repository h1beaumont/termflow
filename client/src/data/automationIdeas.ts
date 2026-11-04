export interface AutomationIdea {
  id: string;
  title: string;
  description: string;
  category: 'enquiries' | 'viewings' | 'applications' | 'contracts' | 'maintenance' | 'payments' | 'communications' | 'onboarding' | 'retention';
  complexity: 'low' | 'medium' | 'high';
  roiImpact: 'low' | 'medium' | 'high';
  timeToImplement: string;
  potentialSavings: string;
  prerequisites?: string[];
  relatedPlaybook?: string;
}

export const automationIdeas: AutomationIdea[] = [
  // ENQUIRIES (5 ideas)
  {
    id: 'auto-enquiry-response',
    title: 'Automated Enquiry Acknowledgment',
    description: 'Send instant acknowledgment emails to new enquiries with property details, viewing availability, and next steps. Reduces response time from hours to seconds.',
    category: 'enquiries',
    complexity: 'low',
    roiImpact: 'medium',
    timeToImplement: '1-2 weeks',
    potentialSavings: '3-5 hours/week',
    prerequisites: ['Email integration', 'Property data'],
    relatedPlaybook: '/playbooks/tenant-onboarding-automation'
  },
  {
    id: 'whatsapp-auto-reply',
    title: 'WhatsApp Auto-Reply System',
    description: 'Instantly respond to WhatsApp enquiries with property info, FAQs, and booking links. Works 24/7 to capture leads outside office hours.',
    category: 'enquiries',
    complexity: 'medium',
    roiImpact: 'high',
    timeToImplement: '2-3 weeks',
    potentialSavings: '8-12 hours/week',
    prerequisites: ['WhatsApp Business API', 'CRM integration']
  },
  {
    id: 'lead-qualification-bot',
    title: 'Automated Lead Qualification',
    description: 'AI chatbot asks qualifying questions (budget, move-in date, preferences) and scores leads automatically. Routes high-priority leads to your team immediately.',
    category: 'enquiries',
    complexity: 'medium',
    roiImpact: 'high',
    timeToImplement: '2-4 weeks',
    potentialSavings: '5-8 hours/week',
    prerequisites: ['Chatbot platform', 'CRM integration', 'Lead scoring rules']
  },
  {
    id: 'portal-enquiry-routing',
    title: 'Portal Enquiry Auto-Routing',
    description: 'Automatically route enquiries from Rightmove, Zoopla, and other portals to the right team member based on property, location, or workload.',
    category: 'enquiries',
    complexity: 'low',
    roiImpact: 'medium',
    timeToImplement: '1-2 weeks',
    potentialSavings: '2-4 hours/week',
    prerequisites: ['Portal integrations', 'Team assignment rules']
  },
  {
    id: 'enquiry-follow-up-sequence',
    title: 'Smart Enquiry Follow-Up Sequences',
    description: 'Automatically send personalized follow-up messages at optimal times (24h, 48h, 1 week) until prospect responds or books a viewing.',
    category: 'enquiries',
    complexity: 'medium',
    roiImpact: 'high',
    timeToImplement: '2-3 weeks',
    potentialSavings: '6-10 hours/week',
    prerequisites: ['Email/SMS integration', 'CRM', 'Engagement tracking']
  },

  // VIEWINGS (4 ideas)
  {
    id: 'self-service-viewing-booking',
    title: 'Self-Service Viewing Booking',
    description: 'Let prospects book viewings directly via your website with real-time availability. Syncs with Google Calendar and sends automated confirmations.',
    category: 'viewings',
    complexity: 'medium',
    roiImpact: 'high',
    timeToImplement: '2-3 weeks',
    potentialSavings: '10-15 hours/week',
    prerequisites: ['Calendar integration', 'Online booking system', 'Property availability data'],
    relatedPlaybook: '/playbooks/tenant-onboarding-automation'
  },
  {
    id: 'viewing-reminder-automation',
    title: 'Automated Viewing Reminders',
    description: 'Send WhatsApp/SMS reminders 24 hours and 2 hours before viewings. Reduces no-shows by 60% and includes directions, parking info, and contact details.',
    category: 'viewings',
    complexity: 'low',
    roiImpact: 'medium',
    timeToImplement: '1-2 weeks',
    potentialSavings: '3-5 hours/week',
    prerequisites: ['WhatsApp/SMS integration', 'Calendar system']
  },
  {
    id: 'post-viewing-follow-up',
    title: 'Post-Viewing Follow-Up Automation',
    description: 'Automatically send follow-up within 2 hours of viewing with property details, pricing, and application link. Track responses and trigger alerts for hot leads.',
    category: 'viewings',
    complexity: 'low',
    roiImpact: 'high',
    timeToImplement: '1-2 weeks',
    potentialSavings: '4-6 hours/week',
    prerequisites: ['Email/SMS integration', 'CRM', 'Calendar system']
  },
  {
    id: 'virtual-tour-scheduling',
    title: 'Virtual Tour Auto-Scheduling',
    description: 'Automatically send virtual tour links to enquirers, schedule video viewings, and send Zoom/Teams invites with property brochures attached.',
    category: 'viewings',
    complexity: 'low',
    roiImpact: 'medium',
    timeToImplement: '1-2 weeks',
    potentialSavings: '3-5 hours/week',
    prerequisites: ['Video conferencing platform', 'Virtual tour assets', 'Calendar integration']
  },

  // APPLICATIONS (4 ideas)
  {
    id: 'document-request-automation',
    title: 'Automated Document Requests',
    description: 'Trigger personalized document requests immediately after application submission. Send reminders every 48 hours until all documents are received.',
    category: 'applications',
    complexity: 'low',
    roiImpact: 'high',
    timeToImplement: '1-2 weeks',
    potentialSavings: '5-8 hours/week',
    prerequisites: ['Document management system', 'Email integration'],
    relatedPlaybook: '/playbooks/id-document-collection'
  },
  {
    id: 'application-status-updates',
    title: 'Application Progress Auto-Updates',
    description: 'Automatically notify applicants when their application status changes (received, under review, approved, declined). Reduces "where\'s my application" queries by 80%.',
    category: 'applications',
    complexity: 'low',
    roiImpact: 'medium',
    timeToImplement: '1-2 weeks',
    potentialSavings: '4-6 hours/week',
    prerequisites: ['CRM/Application system', 'Email/SMS integration']
  },
  {
    id: 'id-verification-triggers',
    title: 'Automated ID Verification Workflow',
    description: 'Trigger Right-to-Rent checks and ID verification automatically when passport/visa documents are uploaded. OCR extracts data and flags issues.',
    category: 'applications',
    complexity: 'high',
    roiImpact: 'high',
    timeToImplement: '3-4 weeks',
    potentialSavings: '8-12 hours/week',
    prerequisites: ['OCR technology', 'ID verification service', 'Document storage'],
    relatedPlaybook: '/playbooks/id-document-collection'
  },
  {
    id: 'guarantor-chase-automation',
    title: 'Guarantor Form Chase Automation',
    description: 'Automatically send guarantor forms and chase for completion with escalating reminders. Track completion rates and alert staff when forms are overdue.',
    category: 'applications',
    complexity: 'medium',
    roiImpact: 'medium',
    timeToImplement: '2-3 weeks',
    potentialSavings: '4-7 hours/week',
    prerequisites: ['Form platform', 'Email integration', 'Tracking system']
  },

  // CONTRACTS (4 ideas)
  {
    id: 'contract-generation-automation',
    title: 'Automated Contract Generation',
    description: 'Generate tenancy agreements automatically from CRM data. Pre-fills tenant details, property info, rent, and deposit amounts. Reduces errors by 95%.',
    category: 'contracts',
    complexity: 'medium',
    roiImpact: 'high',
    timeToImplement: '3-4 weeks',
    potentialSavings: '10-15 hours/week',
    prerequisites: ['Contract templates', 'CRM integration', 'Document generation tool'],
    relatedPlaybook: '/playbooks/tenant-onboarding-automation'
  },
  {
    id: 'esignature-workflow',
    title: 'E-Signature Workflow Automation',
    description: 'Send contracts for e-signature via DocuSign/Signable, track signing progress, send reminders, and auto-file completed contracts. Reduces signing time from 7 days to 24 hours.',
    category: 'contracts',
    complexity: 'medium',
    roiImpact: 'high',
    timeToImplement: '2-3 weeks',
    potentialSavings: '6-10 hours/week',
    prerequisites: ['E-signature platform', 'Document storage', 'CRM integration']
  },
  {
    id: 'contract-reminder-sequences',
    title: 'Contract Signing Reminder Sequences',
    description: 'Automatically remind tenants to sign contracts with escalating urgency (24h, 48h, 72h). Alerts staff if unsigned after deadline.',
    category: 'contracts',
    complexity: 'low',
    roiImpact: 'medium',
    timeToImplement: '1-2 weeks',
    potentialSavings: '3-5 hours/week',
    prerequisites: ['E-signature platform', 'Email/SMS integration']
  },
  {
    id: 'lease-renewal-automation',
    title: 'Lease Renewal Automation',
    description: 'Trigger renewal offers 90 days before lease end. Track responses, auto-generate renewal contracts, and alert team of non-renewals for re-marketing.',
    category: 'contracts',
    complexity: 'medium',
    roiImpact: 'high',
    timeToImplement: '2-4 weeks',
    potentialSavings: '8-12 hours/week',
    prerequisites: ['Lease database', 'Contract generation', 'Email automation']
  },

  // PAYMENTS (4 ideas)
  {
    id: 'payment-reminder-automation',
    title: 'Automated Payment Reminders',
    description: 'Send rent reminders 7 days before due date via email and WhatsApp. Includes payment link and amount due. Reduces late payments by 40%.',
    category: 'payments',
    complexity: 'low',
    roiImpact: 'high',
    timeToImplement: '1-2 weeks',
    potentialSavings: '4-6 hours/week',
    prerequisites: ['Payment system', 'Email/WhatsApp integration', 'Rent schedule data'],
    relatedPlaybook: '/playbooks/arrears-nudging-automation'
  },
  {
    id: 'arrears-escalation-workflow',
    title: 'Arrears Escalation Workflow',
    description: 'Automatically escalate overdue payments with tiered communications (friendly reminder → formal notice → escalation to manager). Tracks payment promises.',
    category: 'payments',
    complexity: 'medium',
    roiImpact: 'high',
    timeToImplement: '2-3 weeks',
    potentialSavings: '6-10 hours/week',
    prerequisites: ['Payment tracking', 'Multi-channel messaging', 'Escalation rules'],
    relatedPlaybook: '/playbooks/arrears-nudging-automation'
  },
  {
    id: 'direct-debit-setup',
    title: 'Direct Debit Setup Automation',
    description: 'Send automated Direct Debit mandate links after contract signing. Chase for setup completion and alert finance team when complete.',
    category: 'payments',
    complexity: 'medium',
    roiImpact: 'medium',
    timeToImplement: '2-3 weeks',
    potentialSavings: '3-5 hours/week',
    prerequisites: ['Direct Debit provider', 'Payment integration', 'Email automation']
  },
  {
    id: 'receipt-generation',
    title: 'Automated Receipt Generation',
    description: 'Generate and email payment receipts automatically when rent is received. Includes payment history and next payment due date.',
    category: 'payments',
    complexity: 'low',
    roiImpact: 'low',
    timeToImplement: '1-2 weeks',
    potentialSavings: '2-3 hours/week',
    prerequisites: ['Payment system', 'Email integration', 'Receipt templates']
  },

  // MAINTENANCE (4 ideas)
  {
    id: 'maintenance-triage-automation',
    title: 'AI-Powered Maintenance Triage',
    description: 'AI categorizes maintenance requests by urgency and type, assigns to the right contractor, and sets SLA deadlines. Reduces triage time by 90%.',
    category: 'maintenance',
    complexity: 'high',
    roiImpact: 'high',
    timeToImplement: '3-4 weeks',
    potentialSavings: '10-15 hours/week',
    prerequisites: ['AI/NLP platform', 'Contractor database', 'Maintenance system'],
    relatedPlaybook: '/playbooks/maintenance-triage-automation'
  },
  {
    id: 'contractor-assignment',
    title: 'Automated Contractor Assignment',
    description: 'Auto-assign jobs to contractors based on trade, location, availability, and performance ratings. Sends job details and tenant contact info instantly.',
    category: 'maintenance',
    complexity: 'medium',
    roiImpact: 'high',
    timeToImplement: '2-3 weeks',
    potentialSavings: '5-8 hours/week',
    prerequisites: ['Contractor database', 'Assignment rules', 'Communication platform']
  },
  {
    id: 'maintenance-status-updates',
    title: 'Maintenance Status Auto-Updates',
    description: 'Automatically update tenants on maintenance progress (request received → contractor assigned → scheduled → completed). Reduces "when will it be fixed" queries by 70%.',
    category: 'maintenance',
    complexity: 'low',
    roiImpact: 'medium',
    timeToImplement: '1-2 weeks',
    potentialSavings: '4-6 hours/week',
    prerequisites: ['Maintenance tracking', 'Email/SMS integration']
  },
  {
    id: 'emergency-escalation',
    title: 'Emergency Maintenance Escalation',
    description: 'Automatically detect emergency keywords (flood, fire, gas leak) and trigger urgent escalation to on-call staff via SMS and phone call.',
    category: 'maintenance',
    complexity: 'medium',
    roiImpact: 'high',
    timeToImplement: '2-3 weeks',
    potentialSavings: '3-5 hours/week',
    prerequisites: ['Keyword detection', 'SMS/call integration', 'On-call rota']
  },

  // COMMUNICATIONS (3 ideas)
  {
    id: 'move-in-day-sequence',
    title: 'Move-In Day Welcome Sequence',
    description: 'Send automated welcome messages on move-in day with WiFi details, emergency contacts, local info, and check-in instructions. Creates great first impression.',
    category: 'communications',
    complexity: 'low',
    roiImpact: 'medium',
    timeToImplement: '1-2 weeks',
    potentialSavings: '2-4 hours/week',
    prerequisites: ['Email/SMS integration', 'Tenant database', 'Move-in date tracking'],
    relatedPlaybook: '/playbooks/tenant-onboarding-automation'
  },
  {
    id: 'seasonal-reminders',
    title: 'Seasonal Reminder Broadcasts',
    description: 'Send automated seasonal messages (winter heating tips, fire safety, exam period quiet hours). Reduces preventable maintenance issues.',
    category: 'communications',
    complexity: 'low',
    roiImpact: 'low',
    timeToImplement: '1 week',
    potentialSavings: '1-2 hours/week',
    prerequisites: ['Email/SMS platform', 'Template library']
  },
  {
    id: 'policy-update-broadcasts',
    title: 'Policy Update Notifications',
    description: 'Automatically notify all tenants of policy changes, rent increases, or building updates. Track who has read the message.',
    category: 'communications',
    complexity: 'low',
    roiImpact: 'low',
    timeToImplement: '1-2 weeks',
    potentialSavings: '2-3 hours/week',
    prerequisites: ['Bulk messaging platform', 'Read receipt tracking']
  },

  // ONBOARDING (3 ideas)
  {
    id: 'welcome-sequence-automation',
    title: 'Tenant Welcome Sequence',
    description: 'Multi-step email sequence from contract signing to move-in: contract confirmation → payment instructions → move-in guide → WiFi setup → portal access. Fully automated.',
    category: 'onboarding',
    complexity: 'medium',
    roiImpact: 'high',
    timeToImplement: '2-3 weeks',
    potentialSavings: '8-12 hours/week',
    prerequisites: ['Email automation', 'CRM', 'Content templates'],
    relatedPlaybook: '/playbooks/tenant-onboarding-automation'
  },
  {
    id: 'key-collection-scheduling',
    title: 'Key Collection Scheduling',
    description: 'Tenants book key collection slots online, receive confirmation and reminders, and get auto-generated access codes for keyless entry buildings.',
    category: 'onboarding',
    complexity: 'medium',
    roiImpact: 'medium',
    timeToImplement: '2-3 weeks',
    potentialSavings: '4-6 hours/week',
    prerequisites: ['Booking system', 'Calendar integration', 'Access control system']
  },
  {
    id: 'inventory-check-reminders',
    title: 'Inventory Check Reminders',
    description: 'Automatically remind tenants to complete and sign inventory reports within 7 days of move-in. Escalate to property manager if overdue.',
    category: 'onboarding',
    complexity: 'low',
    roiImpact: 'medium',
    timeToImplement: '1-2 weeks',
    potentialSavings: '3-4 hours/week',
    prerequisites: ['Inventory system', 'Email automation', 'Move-in tracking']
  },

  // RETENTION (3 ideas)
  {
    id: 'renewal-reminder-sequence',
    title: 'Renewal Reminder Sequence',
    description: 'Start renewal conversations 120 days before lease end. Send 3-4 reminders with incentives, track responses, and flag non-renewals for re-marketing.',
    category: 'retention',
    complexity: 'medium',
    roiImpact: 'high',
    timeToImplement: '2-3 weeks',
    potentialSavings: '6-10 hours/week',
    prerequisites: ['Lease database', 'Email automation', 'Response tracking']
  },
  {
    id: 'satisfaction-surveys',
    title: 'Automated Satisfaction Surveys',
    description: 'Send NPS surveys at key touchpoints (30 days, 90 days, pre-renewal). Trigger alerts for low scores and automatically request reviews from promoters.',
    category: 'retention',
    complexity: 'low',
    roiImpact: 'medium',
    timeToImplement: '1-2 weeks',
    potentialSavings: '2-4 hours/week',
    prerequisites: ['Survey platform', 'Email integration', 'Response tracking']
  },
  {
    id: 'move-out-coordination',
    title: 'Move-Out Coordination Automation',
    description: 'Trigger move-out checklist 30 days before lease end: inspection booking, deposit return process, final meter readings, forwarding address collection.',
    category: 'retention',
    complexity: 'medium',
    roiImpact: 'medium',
    timeToImplement: '2-3 weeks',
    potentialSavings: '5-8 hours/week',
    prerequisites: ['Lease database', 'Checklist automation', 'Inspection booking system']
  }
];

export const categoryLabels: Record<AutomationIdea['category'], string> = {
  enquiries: 'Enquiries & Leads',
  viewings: 'Viewings & Tours',
  applications: 'Applications & References',
  contracts: 'Contracts & Signing',
  maintenance: 'Maintenance & Repairs',
  payments: 'Payments & Arrears',
  communications: 'Communications',
  onboarding: 'Move-In & Onboarding',
  retention: 'Retention & Move-Out'
};

export const complexityLabels: Record<AutomationIdea['complexity'], string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High'
};

export const roiImpactLabels: Record<AutomationIdea['roiImpact'], string> = {
  low: 'Low Impact',
  medium: 'Medium Impact',
  high: 'High Impact'
};
