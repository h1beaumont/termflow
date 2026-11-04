export const DATA_RESIDENCY_CONFIG = {
  // Primary database region
  database: {
    provider: 'Neon PostgreSQL',
    region: 'eu-west-2', // London, UK
    jurisdiction: 'UK/EU',
    encryption: 'AES-256 at rest, TLS 1.3 in transit',
  },
  
  // Object storage region
  objectStorage: {
    provider: 'Google Cloud Storage',
    region: 'europe-west2', // London, UK
    jurisdiction: 'UK/EU',
    encryption: 'AES-256 at rest',
  },
  
  // Third-party data processors
  processors: [
    {
      name: 'Stripe',
      purpose: 'Payment processing',
      region: 'UK entity',
      dpa: true,
      sccs: true, // Standard Contractual Clauses
    },
    {
      name: 'Twilio',
      purpose: 'WhatsApp messaging',
      region: 'EU (Dublin)',
      dpa: true,
      sccs: true,
    },
    {
      name: 'OpenAI',
      purpose: 'AI conversation',
      region: 'US (with EU endpoints where available)',
      dpa: true,
      sccs: true,
      dataRetention: 'Zero retention (enterprise agreement)',
    },
  ],
  
  // Compliance certifications
  compliance: {
    gdpr: true,
    dataProtectionAct2018: true,
    iso27001: false, // TODO: Get certification
    soc2: false, // TODO: Get certification
  },
};
