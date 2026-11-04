export interface CaseStudy {
  slug: string;
  title: string;
  propertyName: string;
  location: string;
  units: number;
  propertyType: string;
  challenge: string;
  solution: string;
  implementation: string;
  results: CaseStudyResult[];
  timeline: string;
  testimonial: {
    quote: string;
    author: string;
    role: string;
    company: string;
  };
  keyTakeaways: string[];
  featured: boolean;
  metaDescription: string;
  publishDate: string;
}

export interface CaseStudyResult {
  metric: string;
  before: string | number;
  after: string | number;
  improvement: string;
  chartData?: any[];
}

export const caseStudies: CaseStudy[] = [
  {
    slug: 'manchester-student-village',
    title: 'How Manchester Student Village Increased Conversions by 50% with AI',
    propertyName: 'Manchester Student Village',
    location: 'Manchester City Centre',
    units: 850,
    propertyType: 'Purpose-Built Student Accommodation',
    featured: true,
    publishDate: '2025-10-12',
    metaDescription: 'Case study: How Manchester Student Village used TermFlow AI to increase enquiry-to-contract conversion by 50% and reduce void rates by 67%.',
    
    challenge: `
Manchester Student Village, an 850-unit PBSA property near Manchester Metropolitan University, was struggling with their lettings process during peak season. Despite their prime location and quality accommodation, they faced several critical challenges:

**Key Challenges:**

1. **Low Conversion Rates**
   - Only 40% of enquiries converted to signed contracts
   - Competitors with inferior properties were outperforming them
   - Losing quality applicants to faster-responding landlords

2. **High Void Rates**
   - 18% of rooms remained vacant during the academic year
   - Particularly struggled with late bookings (July-August)
   - Missed revenue: approximately £250,000 annually

3. **Delayed Response Times**
   - Average enquiry response time: 4 hours
   - International students (35% of enquiries) often waited 8-12 hours due to time zones
   - Weekend and evening enquiries went unanswered for 24+ hours

4. **Overwhelmed Staff**
   - Peak season (March-June): 400-500 enquiries per week
   - 3 lettings agents spending 25 hours/week just on enquiries
   - High stress, burnout, and seasonal hiring challenges

5. **International Student Barriers**
   - Language barriers with non-English speakers
   - Complex visa verification processes
   - Parental involvement requiring additional communication

**Business Impact:**
- Lost revenue from voids: £250,000/year
- High operational costs: £90,000/year for lettings team
- Poor Google reviews citing "slow responses"
- Competitive disadvantage in the market
    `,

    solution: `
Manchester Student Village partnered with TermFlow to implement an AI-powered lettings automation system focused on:

**1. 24/7 AI Enquiry Assistant**
- Instant responses to all enquiries (<30 seconds)
- Multilingual support in 25+ languages
- Answered common questions automatically:
  - Room availability and pricing
  - Amenities and location details
  - Application process and requirements
  - Contract terms and move-in dates

**2. Automated Viewing Scheduling**
- Real-time calendar integration
- Students book viewings instantly via chatbot
- Automated confirmations and reminders
- Reduced no-shows with SMS/email reminders

**3. Intelligent Lead Qualification**
- AI pre-qualifies leads based on:
  - Budget and room preferences
  - Move-in timeline
  - Student status (undergrad/postgrad/international)
- Prioritizes high-quality leads for human follow-up
- Escalates complex queries to human agents

**4. WhatsApp Integration**
- Students engage via their preferred channel
- Conversation history maintained across channels
- Parents can join conversations for transparency

**5. Automated Document Verification**
- International student visa checks
- Right-to-Rent compliance automation
- Digital contract generation and e-signatures
    `,

    implementation: `
**Implementation Timeline: 4 Weeks**

**Week 1: Discovery & Setup**
- Analyzed historical enquiry data and conversion patterns
- Identified top 50 frequently asked questions
- Uploaded property details, room inventory, and pricing
- Configured AI knowledge base with property-specific information

**Week 2: Integration & Training**
- Integrated with existing calendar system (Google Calendar)
- Connected WhatsApp Business API
- Trained AI on brand voice and response templates
- Set up automated workflows for viewing bookings

**Week 3: Testing & Refinement**
- Ran AI in parallel with existing manual process
- Tested 100+ scenarios and edge cases
- Refined responses based on team feedback
- Conducted training session for 3 lettings agents

**Week 4: Full Launch**
- Switched all enquiries to AI-first response
- Enabled 24/7 operation
- Monitored performance and made real-time adjustments
- Celebrated quick wins with the team

**Key Success Factors:**
- Strong buy-in from leadership and lettings team
- Comprehensive FAQ documentation
- Phased rollout reducing change management resistance
- Continuous optimization based on data
    `,

    results: [
      {
        metric: 'Enquiry-to-Contract Conversion Rate',
        before: '40%',
        after: '60%',
        improvement: '+50%',
        chartData: [
          { name: 'Before TermFlow', value: 40, fill: 'hsl(var(--tf-slate))' },
          { name: 'After TermFlow', value: 60, fill: 'hsl(var(--tf-lime))' },
        ],
      },
      {
        metric: 'Void Rate',
        before: '18%',
        after: '6%',
        improvement: '-67%',
        chartData: [
          { name: 'Before', value: 18 },
          { name: 'After', value: 6 },
        ],
      },
      {
        metric: 'Enquiry Response Time',
        before: '4 hours',
        after: '30 seconds',
        improvement: '-99%',
        chartData: [
          { month: 'Jan', beforeTermFlow: 240, afterTermFlow: 0.5 },
          { month: 'Feb', beforeTermFlow: 250, afterTermFlow: 0.5 },
          { month: 'Mar', beforeTermFlow: 280, afterTermFlow: 0.5 },
          { month: 'Apr', beforeTermFlow: 300, afterTermFlow: 0.5 },
          { month: 'May', beforeTermFlow: 270, afterTermFlow: 0.5 },
          { month: 'Jun', beforeTermFlow: 260, afterTermFlow: 0.5 },
        ],
      },
      {
        metric: 'Staff Time on Enquiries',
        before: '25 hours/week',
        after: '2 hours/week',
        improvement: '-92%',
        chartData: [
          { name: 'Before TermFlow', hours: 25, fill: 'hsl(var(--destructive))' },
          { name: 'After TermFlow', hours: 2, fill: 'hsl(var(--chart-3))' },
        ],
      },
      {
        metric: 'Additional Annual Revenue',
        before: '£0',
        after: '+£180,000',
        improvement: 'New revenue stream',
      },
      {
        metric: 'Operational Cost Savings',
        before: '£90,000/year',
        after: '£32,000/year',
        improvement: '-£58,000 saved',
      },
    ],

    timeline: '4-week implementation, measurable results within 8 weeks, full ROI achieved in 3 months',

    testimonial: {
      quote: "TermFlow completely transformed our lettings operation. We went from overwhelmed and reactive to proactive and scalable. The 24/7 AI assistant handles the volume we could never manage manually, and our conversion rates speak for themselves. Best investment we've made.",
      author: 'Sarah Thompson',
      role: 'Lettings Director',
      company: 'Manchester Student Village',
    },

    keyTakeaways: [
      'Instant response times are critical - 50% of students choose the first landlord who replies comprehensively',
      '24/7 availability captures international student enquiries across all time zones',
      'AI automation allows small teams to manage large portfolios efficiently',
      'Multilingual support opens doors to diverse student demographics',
      'Data-driven insights from AI conversations improve overall strategy',
      'ROI positive within 3 months through increased revenue and reduced costs',
    ],
  },

  {
    slug: 'nottingham-city-apartments',
    title: 'Nottingham City Apartments Increased International Bookings by 85%',
    propertyName: 'Nottingham City Apartments',
    location: 'Nottingham City Centre',
    units: 450,
    propertyType: 'Mixed PBSA & Professional Housing',
    featured: true,
    publishDate: '2025-10-08',
    metaDescription: 'Case study: How Nottingham City Apartments used multilingual AI and automated compliance to increase international student bookings by 85%.',

    challenge: `
Nottingham City Apartments operated a 450-unit PBSA property near the University of Nottingham, one of the UK's top destinations for international students. Despite this advantage, they were struggling to effectively serve this lucrative market segment.

**Key Challenges:**

1. **Language Barriers**
   - 60% of enquiries from non-English speakers
   - Only 2 staff members spoke additional languages (Mandarin, Spanish)
   - Arabic, Hindi, French, and other language enquiries often lost

2. **Complex Document Verification**
   - International student visa checks taking 2-3 days per applicant
   - Right-to-Rent compliance errors leading to anxiety
   - Manual tracking of visa expiry dates (often missed)
   - High risk of compliance penalties

3. **Limited International Reach**
   - Marketing efforts only in English
   - Poor engagement with international student forums
   - Competitors with multilingual support winning students

4. **Delayed Booking Cycle**
   - International students booking late (July-August)
   - Missing early-bird period (January-March)
   - Higher void rates in premium rooms

5. **Parent Communication Gap**
   - Parents (often non-English speakers) involved in decision
   - Unable to address parental concerns effectively
   - Lost bookings due to parent hesitation

**Business Impact:**
- Underperformance in international student segment (35% vs market average 55%)
- Premium rooms (higher rent) sitting vacant
- Compliance anxiety and near-misses on Right-to-Rent
- Missing £200,000+ in annual revenue from international students
    `,

    solution: `
Nottingham City Apartments implemented TermFlow's multilingual AI assistant and automated compliance system:

**1. Multilingual AI Assistant (25 Languages)**
- Real-time translation and response in student's native language
- Languages supported:
  - Chinese (Simplified & Traditional)
  - Arabic
  - Hindi
  - Spanish
  - French
  - German
  - Portuguese
  - And 18 more

**2. Automated Document Verification**
- AI-powered passport and visa scanning
- Automatic extraction of key information:
  - Visa start and end dates
  - Student status confirmation
  - University enrollment verification
- Compliance dashboard with expiry alerts

**3. International Student-Focused Features**
- Currency conversion (show rent in home currency)
- International payment options
- Cultural customization (prayer rooms, dietary considerations)
- Parent portal for involvement in process

**4. Early Booking Campaigns**
- Targeted outreach to international student offices
- Multilingual marketing materials
- Early-bird discounts for overseas students
- Virtual tours with multilingual voiceover

**5. Visa Expiry Management**
- Automatic reminders 60/30/7 days before visa expiry
- Follow-up requests for renewed visas
- Compliance audit trail for inspections
    `,

    implementation: `
**Implementation Timeline: 6 Weeks**

**Week 1-2: Multilingual Setup**
- Configured AI for 25 language support
- Translated property information and FAQs
- Set up currency conversion and international payment
- Created multilingual welcome packs

**Week 3-4: Compliance Automation**
- Integrated document verification AI
- Set up visa tracking dashboard
- Configured automated expiry alerts
- Trained team on compliance workflows

**Week 5: Marketing Launch**
- Created multilingual social media campaigns
- Reached out to international student societies
- Launched early-bird discount program
- Promoted virtual tours

**Week 6: Monitoring & Optimization**
- Tracked language-specific conversion rates
- Refined translations based on feedback
- Optimized verification workflows
- Celebrated early wins

**Key Success Factors:**
- Deep understanding of international student needs
- Cultural sensitivity in communications
- Robust compliance processes reducing risk
- Proactive early-season marketing
    `,

    results: [
      {
        metric: 'International Student Bookings',
        before: '35% of total',
        after: '65% of total',
        improvement: '+85% increase',
        chartData: [
          { name: 'UK/EU Students', before: 65, after: 35, fill: 'hsl(var(--tf-navy))' },
          { name: 'International Students', before: 35, after: 65, fill: 'hsl(var(--tf-lime))' },
        ],
      },
      {
        metric: 'Document Verification Time',
        before: '3 days per student',
        after: '4 hours per student',
        improvement: '-95%',
        chartData: [
          { task: 'Manual Check', hours: 72 },
          { task: 'AI Verification', hours: 4 },
        ],
      },
      {
        metric: 'Language Support',
        before: '2 languages',
        after: '25 languages',
        improvement: '+1,150%',
      },
      {
        metric: 'Early Booking Rate (Jan-Mar)',
        before: '20%',
        after: '55%',
        improvement: '+175%',
        chartData: [
          { month: 'Jan', before: 15, after: 48 },
          { month: 'Feb', before: 22, after: 58 },
          { month: 'Mar', before: 25, after: 60 },
          { month: 'Apr', before: 35, after: 68 },
          { month: 'May', before: 45, after: 72 },
          { month: 'Jun', before: 55, after: 75 },
        ],
      },
      {
        metric: 'Compliance Violations',
        before: '3 near-misses/year',
        after: '0 violations',
        improvement: '-100%',
      },
      {
        metric: 'Additional Revenue from International Students',
        before: '£0',
        after: '+£220,000/year',
        improvement: 'New revenue',
      },
    ],

    timeline: '6-week implementation, 85% increase in international bookings within first semester',

    testimonial: {
      quote: "Our international student conversion was transformed overnight. Students from China, India, Nigeria - they can all engage in their native language and receive instant, accurate responses. The automated compliance tracking gives us peace of mind, and our early booking rates have skyrocketed. TermFlow unlocked a market we were previously underserving.",
      author: 'David Chen',
      role: 'Operations Manager',
      company: 'Nottingham City Apartments',
    },

    keyTakeaways: [
      'Language support is non-negotiable for capturing international student market',
      'Automated compliance reduces risk and administrative burden',
      'Early engagement (January-March) with international students dramatically reduces voids',
      'Parent involvement is critical - provide communication channels in their language',
      'Cultural sensitivity in marketing and operations builds trust',
      'International students often prefer premium accommodations - capture this higher-value segment',
    ],
  },

  {
    slug: 'birmingham-student-hub',
    title: 'Birmingham Student Hub Cut Operational Costs by £45K with Automation',
    propertyName: 'Birmingham Student Hub',
    location: 'Birmingham City Centre',
    units: 320,
    propertyType: 'Purpose-Built Student Accommodation',
    featured: true,
    publishDate: '2025-10-05',
    metaDescription: 'Case study: How Birmingham Student Hub used automated viewings and virtual tours to reduce no-shows by 77% and cut costs by £45,000 annually.',

    challenge: `
Birmingham Student Hub, a 320-unit PBSA property near Birmingham City University, faced significant operational inefficiencies despite strong market demand.

**Key Challenges:**

1. **High Viewing No-Show Rates**
   - 35% of booked viewings resulted in no-shows
   - Wasted staff time: 20+ hours/week on no-show appointments
   - Opportunity cost: Other students couldn't book those slots

2. **Inefficient Viewing Process**
   - Manual scheduling via phone/email: 2-3 days to book a viewing
   - Back-and-forth coordination for timing
   - No automated reminders leading to forgotten appointments
   - Difficult to accommodate students in other cities/countries

3. **High Operational Costs**
   - 4 full-time lettings agents: £120,000/year
   - Property manager: £35,000/year
   - Seasonal staff during peak: £18,000/year
   - **Total: £173,000/year in staffing**

4. **Limited Virtual Offering**
   - Only static photos on website
   - No virtual tour options
   - International students forced to book without seeing property
   - Lost bookings to competitors with better digital experiences

5. **Scalability Constraints**
   - Manual processes limited growth potential
   - Couldn't manage more properties without proportional staff increase
   - High turnover in lettings team due to repetitive work

**Business Impact:**
- Wasted staff time on no-shows: £15,000/year
- Operational inefficiency: £45,000/year in excess costs
- Lost bookings due to poor virtual experience: £80,000/year
- Inability to scale portfolio
    `,

    solution: `
Birmingham Student Hub partnered with TermFlow to implement a comprehensive automation and virtual viewing solution:

**1. Automated Viewing Scheduling**
- AI-powered calendar integration
- Students book viewings instantly via chatbot (any time, any channel)
- Automated confirmation emails with calendar invites
- SMS reminders 24 hours before viewing
- Easy rescheduling and cancellation with instant availability

**2. Interactive Virtual Tours**
- 360° virtual tours of all room types
- Clickable hotspots with information overlays
- Amenity showcases (gym, study rooms, common areas)
- Neighborhood virtual tour
- Available 24/7 in 25+ languages

**3. Self-Service Viewing Options**
- Smart lock integration for unattended viewings
- Students book time slots online
- Receive access code via SMS
- Property tour guide available via mobile app
- AI assistant answers questions in real-time during tour

**4. Digital Application & Contracts**
- Online application forms (5 minutes to complete)
- Automated reference checks
- E-signature contracts (DocuSign integration)
- Digital deposit payment
- Entire process from viewing to contract: 48 hours

**5. Staff Productivity Tools**
- Centralized dashboard for all enquiries and viewings
- Automated task assignment
- Performance analytics and reporting
- Focus on high-value activities (relationship building, property quality)
    `,

    implementation: `
**Implementation Timeline: 5 Weeks**

**Week 1: Virtual Tour Creation**
- Professional 360° photography of all room types
- Created interactive virtual tour with hotspots
- Recorded multilingual voiceover narration
- Embedded tours on website and booking system

**Week 2: Automation Setup**
- Integrated TermFlow with Google Calendar
- Configured viewing scheduling workflows
- Set up automated confirmation and reminder system
- Created self-service viewing process

**Week 3: Smart Lock Installation**
- Installed smart locks on sample rooms
- Configured access code generation
- Set up safety protocols and monitoring
- Trained staff on emergency procedures

**Week 4: Digital Process Implementation**
- Implemented e-signature contracts
- Set up automated application workflows
- Configured digital payment processing
- Created online onboarding portal

**Week 5: Training & Launch**
- Trained lettings team on new systems (reduced from 4 to 2 agents)
- Soft launch with monitoring
- Gathered feedback and refined
- Full launch and marketing push

**Key Success Factors:**
- High-quality virtual tours creating confidence
- Frictionless booking process
- Staff redeployment to value-add activities
- Continuous optimization based on data
    `,

    results: [
      {
        metric: 'Viewing No-Show Rate',
        before: '35%',
        after: '8%',
        improvement: '-77%',
        chartData: [
          { stage: 'Enquiry', before: 100, after: 100 },
          { stage: 'Viewing Booked', before: 60, after: 75 },
          { stage: 'Viewing Attended', before: 39, after: 69 },
          { stage: 'Application', before: 28, after: 55 },
          { stage: 'Contract Signed', before: 22, after: 48 },
        ],
      },
      {
        metric: 'Time to Book Viewing',
        before: '2.5 days',
        after: '4 minutes',
        improvement: '-99%',
      },
      {
        metric: 'Annual Operational Costs',
        before: '£173,000',
        after: '£128,000',
        improvement: '-£45,000 saved',
        chartData: [
          { category: 'Staffing', before: 173, after: 115 },
          { category: 'Technology', before: 5, after: 13 },
          { category: 'Marketing', before: 15, after: 12 },
          { category: 'Total', before: 193, after: 140 },
        ],
      },
      {
        metric: 'Staff Productivity',
        before: '100%',
        after: '220%',
        improvement: '+120%',
        chartData: [
          { metric: 'Enquiries Handled/Week', before: 150, after: 380 },
          { metric: 'Viewings Conducted/Week', before: 45, after: 95 },
          { metric: 'Contracts Processed/Week', before: 18, after: 42 },
        ],
      },
      {
        metric: 'Application-to-Contract Time',
        before: '7-10 days',
        after: '2-3 days',
        improvement: '-70%',
      },
      {
        metric: 'Virtual Tour Engagement',
        before: '0 users',
        after: '2,400 tours/month',
        improvement: 'New capability',
      },
    ],

    timeline: '5-week implementation, operational cost savings of £45,000 annually, 77% reduction in no-shows',

    testimonial: {
      quote: "Automation didn't just cut costs - it transformed our entire operation. Our team went from spending 80% of their time on admin to focusing on delivering exceptional experiences. Virtual tours mean international students can confidently book without visiting, and our automated scheduling eliminated the no-show problem. We're now managing more properties with fewer people and better results.",
      author: 'Emma Richardson',
      role: 'Property Director',
      company: 'Birmingham Student Hub',
    },

    keyTakeaways: [
      'Automated scheduling + reminders dramatically reduces no-shows',
      'Virtual tours are essential for international student conversions',
      'Self-service viewings increase availability and reduce staffing needs',
      'Digital processes (applications, contracts) accelerate deal closure',
      'Technology investments pay for themselves through operational efficiency',
      'Freed staff time enables better tenant relationships and portfolio growth',
    ],
  },
];

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return caseStudies.find(cs => cs.slug === slug);
}

export function getFeaturedCaseStudies(): CaseStudy[] {
  return caseStudies.filter(cs => cs.featured);
}
