import { useEffect, useState, useRef } from 'react';
import { MessageSquare, Calendar, FileCheck, FileSignature, CreditCard, Check, Home } from 'lucide-react';
import { motion, useScroll } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

const STEPS = [
  {
    id: 'capture',
    title: 'Capture Leads',
    subtitle: 'From Every Channel',
    description: 'AI agent (Ava) responds to WhatsApp, email, portal enquiries 24/7. Creates lead profile automatically with preferences and budget.',
    icon: MessageSquare,
    color: 'from-blue-500 to-cyan-500',
    mockup: {
      type: 'chat',
      messages: [
        { from: 'student', text: 'Hi, looking for a room near Nottingham Uni' },
        { from: 'ai', text: 'Perfect! I have 3 properties within 10 minutes of campus. What\'s your budget?' },
        { from: 'student', text: '£150/week max' },
        { from: 'ai', text: 'Great! Stanley House has rooms from £145/week. When can you view?' },
      ],
    },
  },
  {
    id: 'book',
    title: 'Book Viewings',
    subtitle: 'Instantly Booked',
    description: 'Calendar syncs with landlord availability. Student picks slot, gets instant confirmation. Reminders sent automatically.',
    icon: Calendar,
    color: 'from-cyan-500 to-teal-500',
    mockup: {
      type: 'calendar',
      slots: [
        { date: 'Mon 15 Jan', time: '2:00 PM', available: true },
        { date: 'Mon 15 Jan', time: '3:00 PM', available: false },
        { date: 'Tue 16 Jan', time: '10:00 AM', available: true },
        { date: 'Tue 16 Jan', time: '2:00 PM', available: true, selected: true },
      ],
    },
  },
  {
    id: 'verify',
    title: 'Verify Documents',
    subtitle: 'Right-to-Rent Compliant',
    description: 'AI checks passport, visa, university letter. Instantly verifies Right-to-Rent. Landlord gets instant approval notification.',
    icon: FileCheck,
    color: 'from-teal-500 to-green-500',
    mockup: {
      type: 'verification',
      documents: [
        { name: 'Passport', status: 'verified', icon: Check },
        { name: 'Student Visa', status: 'verified', icon: Check },
        { name: 'Uni Acceptance', status: 'verified', icon: Check },
        { name: 'Right-to-Rent', status: 'verified', badge: true },
      ],
    },
  },
  {
    id: 'contract',
    title: 'Sign Contracts',
    subtitle: 'Digital & Legal',
    description: 'Tenancy agreement auto-generated with all details. Student e-signs on mobile. Legally binding contract completed in minutes.',
    icon: FileSignature,
    color: 'from-green-500 to-emerald-500',
    mockup: {
      type: 'signature',
      contract: {
        title: 'Tenancy Agreement',
        tenant: 'Sarah Thompson',
        property: 'Stanley House, Room 12',
        rent: '£145/week',
        signed: true,
      },
    },
  },
  {
    id: 'deposit',
    title: 'Take Deposits',
    subtitle: 'Secure & Protected',
    description: 'Instant payment via Stripe. Deposit protected in government scheme within 30 days. All compliance handled automatically.',
    icon: CreditCard,
    color: 'from-emerald-500 to-blue-500',
    mockup: {
      type: 'payment',
      steps: [
        { label: 'E-signature', status: 'complete', icon: Check },
        { label: 'Payment £500', status: 'complete', icon: Check },
        { label: 'Deposit protected', status: 'complete', icon: Check },
        { label: 'Confirmation sent', status: 'complete', icon: Check },
      ],
    },
  },
  {
    id: 'movein',
    title: 'Move-in Ready',
    subtitle: 'Fully Automated',
    description: 'Welcome pack sent automatically. Keys arranged. Move-in checklist completed digitally. Student ready to move in!',
    icon: Home,
    color: 'from-blue-500 to-purple-500',
    mockup: {
      type: 'movein',
      checklist: [
        { item: 'Welcome pack sent', status: 'complete' },
        { item: 'Key collection arranged', status: 'complete' },
        { item: 'Inventory signed', status: 'complete' },
        { item: 'Move-in complete', status: 'complete', highlight: true },
      ],
    },
  },
];

export function StickyHowItWorks() {
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentStep, setCurrentStep] = useState(0);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });
  
  useEffect(() => {
    if (isMobile) return;
    return scrollYProgress.on('change', (latest) => {
      const stepCount = STEPS.length;
      const stepThreshold = 1 / stepCount;
      
      for (let i = 0; i < stepCount; i++) {
        if (latest < (i + 1) * stepThreshold) {
          setCurrentStep(i);
          break;
        }
      }
    });
  }, [scrollYProgress, isMobile]);
  
  if (isMobile) {
    return <ScrollHowItWorks />;
  }
  
  const step = STEPS[currentStep];
  const Icon = step.icon;
  
  return (
    <section ref={containerRef} className="relative min-h-[600vh]">
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              data-testid={`sticky-content-${step.id}`}
            >
              <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center mb-6`}>
                <Icon className="w-8 h-8 text-white" />
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold mb-2" data-testid={`sticky-title-${step.id}`}>
                {step.title}
              </h2>
              
              <p className="text-xl text-muted-foreground mb-6" data-testid={`sticky-subtitle-${step.id}`}>
                {step.subtitle}
              </p>
              
              <p className="text-lg leading-relaxed" data-testid={`sticky-description-${step.id}`}>
                {step.description}
              </p>
            </motion.div>
            
            <motion.div
              key={`mockup-${step.id}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative"
              data-testid={`sticky-mockup-${step.id}`}
            >
              {step.mockup.type === 'chat' && (
                <ChatMockup messages={step.mockup.messages} />
              )}
              
              {step.mockup.type === 'calendar' && (
                <CalendarMockup slots={step.mockup.slots} />
              )}
              
              {step.mockup.type === 'verification' && (
                <VerificationMockup documents={step.mockup.documents} />
              )}
              
              {step.mockup.type === 'signature' && (
                <SignatureMockup contract={step.mockup.contract} />
              )}
              
              {step.mockup.type === 'payment' && (
                <PaymentMockup steps={step.mockup.steps} />
              )}
              
              {step.mockup.type === 'movein' && (
                <MoveInMockup checklist={step.mockup.checklist} />
              )}
            </motion.div>
          </div>
        </div>
        
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-5 -z-10`}
          animate={{ opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </div>
      
      <div className="fixed bottom-8 right-8 flex gap-2 z-50" data-testid="sticky-scroll-progress">
        {STEPS.map((s, index) => (
          <div
            key={s.id}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentStep ? `bg-gradient-to-r ${s.color}` : 'bg-border'
            }`}
            data-testid={`sticky-progress-${s.id}`}
          />
        ))}
      </div>
    </section>
  );
}

function ChatMockup({ messages }: { messages: Array<{ from: string; text: string }> }) {
  return (
    <div className="bg-card rounded-lg shadow-xl p-4 border" data-testid="mockup-chat">
      <div className="space-y-3">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            className={`flex ${msg.from === 'ai' ? 'justify-start' : 'justify-end'}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.3 }}
            data-testid={`chat-message-${i}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                msg.from === 'ai'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              }`}
            >
              {msg.text}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function CalendarMockup({ slots }: { slots: Array<{ date: string; time: string; available: boolean; selected?: boolean }> }) {
  return (
    <div className="bg-card rounded-lg shadow-xl p-6 border" data-testid="mockup-calendar">
      <h3 className="text-lg font-semibold mb-4">Select Viewing Time</h3>
      <div className="space-y-2">
        {slots.map((slot, i) => (
          <motion.div
            key={i}
            className={`p-3 rounded-lg border cursor-pointer transition-colors ${
              slot.selected
                ? 'border-primary bg-primary/10'
                : slot.available
                ? 'border-border hover:border-primary/50'
                : 'border-border opacity-50 cursor-not-allowed'
            }`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15 }}
            data-testid={`calendar-slot-${i}`}
          >
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">{slot.date}</div>
                <div className="text-sm text-muted-foreground">{slot.time}</div>
              </div>
              {slot.selected && <Check className="w-5 h-5 text-primary" />}
              {!slot.available && !slot.selected && (
                <span className="text-xs text-muted-foreground">Booked</span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function VerificationMockup({ documents }: { documents: Array<{ name: string; status: string; icon?: any; badge?: boolean }> }) {
  return (
    <div className="bg-card rounded-lg shadow-xl p-6 border" data-testid="mockup-verification">
      <h3 className="text-lg font-semibold mb-4">Document Verification</h3>
      <div className="space-y-3">
        {documents.map((doc, i) => {
          const Icon = doc.icon;
          return (
            <motion.div
              key={i}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.15 }}
              data-testid={`verification-doc-${i}`}
            >
              <div className="flex items-center gap-3">
                {Icon && (
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                )}
                <span className="font-medium">{doc.name}</span>
              </div>
              {doc.badge ? (
                <motion.div 
                  className="px-3 py-1 rounded-full bg-green-500 text-white text-sm font-semibold"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  ✓ Verified
                </motion.div>
              ) : (
                <span className="text-sm text-green-500 font-medium capitalize">{doc.status}</span>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function SignatureMockup({ contract }: { contract: { title: string; tenant: string; property: string; rent: string; signed: boolean } }) {
  return (
    <div className="bg-card rounded-lg shadow-xl p-6 border" data-testid="mockup-signature">
      <h3 className="text-lg font-semibold mb-4">{contract.title}</h3>
      <div className="space-y-3 mb-6">
        <div className="flex justify-between py-2 border-b">
          <span className="text-muted-foreground">Tenant</span>
          <span className="font-medium">{contract.tenant}</span>
        </div>
        <div className="flex justify-between py-2 border-b">
          <span className="text-muted-foreground">Property</span>
          <span className="font-medium">{contract.property}</span>
        </div>
        <div className="flex justify-between py-2 border-b">
          <span className="text-muted-foreground">Rent</span>
          <span className="font-medium">{contract.rent}</span>
        </div>
      </div>
      
      {contract.signed && (
        <motion.div
          className="p-4 bg-primary/10 rounded-lg border-2 border-primary/30"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          data-testid="signature-box"
        >
          <div className="text-center">
            <motion.div 
              className="text-3xl font-script mb-2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1 }}
            >
              {contract.tenant}
            </motion.div>
            <div className="text-sm text-muted-foreground">Digitally signed</div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function MoveInMockup({ checklist }: { checklist: Array<{ item: string; status: string; highlight?: boolean }> }) {
  return (
    <div className="bg-card rounded-lg shadow-xl p-6 border" data-testid="mockup-movein">
      <h3 className="text-lg font-semibold mb-4">Move-in Checklist</h3>
      <div className="space-y-3">
        {checklist.map((item, i) => (
          <motion.div
            key={i}
            className={`flex items-center gap-3 p-3 rounded-lg ${
              item.highlight ? 'bg-primary/10 border-2 border-primary' : 'bg-muted/30'
            }`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.2 }}
            data-testid={`movein-item-${i}`}
          >
            <motion.div
              className={`w-6 h-6 rounded-full flex items-center justify-center ${
                item.status === 'complete' ? 'bg-green-500' : 'bg-border'
              }`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.2 + 0.2 }}
            >
              {item.status === 'complete' && <Check className="w-4 h-4 text-white" />}
            </motion.div>
            <span className={`flex-1 ${item.highlight ? 'font-semibold' : ''}`}>{item.item}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function PaymentMockup({ steps }: { steps: Array<{ label: string; status: string; icon?: any }> }) {
  return (
    <div className="bg-card rounded-lg shadow-xl p-6 border" data-testid="mockup-payment">
      <h3 className="text-lg font-semibold mb-4">Payment Progress</h3>
      <div className="space-y-4">
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={i}
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.2 }}
              data-testid={`payment-step-${i}`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step.status === 'complete'
                    ? 'bg-green-500'
                    : step.status === 'processing'
                    ? 'bg-blue-500'
                    : 'bg-border'
                }`}
              >
                {Icon && <Icon className="w-5 h-5 text-white" />}
              </div>
              <div className="flex-1">
                <div className="font-medium">{step.label}</div>
                <div className="text-sm text-muted-foreground capitalize">{step.status}</div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function ScrollHowItWorks() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">How TermFlow Works</h2>
          <p className="text-xl text-muted-foreground">
            Complete automation from enquiry to move-in
          </p>
        </div>
        
        <div className="space-y-32">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.id}
                className={`grid md:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? 'md:grid-flow-dense' : ''
                }`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6 }}
                data-testid={`scroll-step-${step.id}`}
              >
                <div className={index % 2 === 1 ? 'md:col-start-2' : ''}>
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center mb-6`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold mb-4">{step.title}</h3>
                  <p className="text-lg text-muted-foreground mb-4">{step.subtitle}</p>
                  <p className="text-lg">{step.description}</p>
                </div>
                
                <div className={index % 2 === 1 ? 'md:col-start-1 md:row-start-1' : ''}>
                  {step.mockup.type === 'chat' && (
                    <ChatMockup messages={step.mockup.messages} />
                  )}
                  
                  {step.mockup.type === 'calendar' && (
                    <CalendarMockup slots={step.mockup.slots} />
                  )}
                  
                  {step.mockup.type === 'verification' && (
                    <VerificationMockup documents={step.mockup.documents} />
                  )}
                  
                  {step.mockup.type === 'signature' && (
                    <SignatureMockup contract={step.mockup.contract} />
                  )}
                  
                  {step.mockup.type === 'payment' && (
                    <PaymentMockup steps={step.mockup.steps} />
                  )}
                  
                  {step.mockup.type === 'movein' && (
                    <MoveInMockup checklist={step.mockup.checklist} />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
