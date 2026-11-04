import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { TermFlowWordmark } from "@/components/TermFlowLogo";
import { Check, Download, Mail, Phone, Building2, TrendingUp, Clock, Shield, Zap, Users } from "lucide-react";

export default function ExecutiveSummary() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <SEOHead
        title="TermFlow Executive Summary | One-Page Overview"
        description="Comprehensive one-page executive summary of TermFlow's AI automation platform for student lettings"
        canonical="https://termflow.co.uk/one-pagers/executive-summary"
      />
      
      {/* Print button (hidden when printing) */}
      <div className="print:hidden fixed top-4 right-4 z-50">
        <Button onClick={handlePrint} data-testid="button-print">
          <Download className="w-4 h-4 mr-2" />
          Save as PDF
        </Button>
      </div>

      {/* One-pager content - optimized for A4/Letter printing */}
      <div className="min-h-screen bg-white print:min-h-0">
        <div className="max-w-4xl mx-auto p-8 print:p-6">
          {/* Header with logo */}
          <div className="flex items-center justify-between mb-4 border-b pb-3 print:mb-3">
            <TermFlowWordmark />
            <span className="text-sm text-gray-600">Executive Summary</span>
          </div>

          {/* Hero Section */}
          <div className="mb-4 print:mb-3">
            <h1 className="text-2xl font-bold text-gray-900 mb-2 print:text-xl">
              TermFlow: AI Automation for Student Lettings
            </h1>
            <p className="text-gray-700 leading-relaxed text-sm">
              TermFlow is a purpose-built AI automation platform that reduces admin workload by 40% for PBSA operators. 
              Our intelligent workflows handle enquiries, viewings, contracts, and tenant communications—delivering 95%+ occupancy 
              rates while cutting operational costs by £23 per bed per month.
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-3 mb-4 print:mb-3">
            <div className="border rounded-md p-3 print:p-2">
              <div className="text-2xl font-bold text-primary mb-1 print:text-xl">40%</div>
              <div className="text-xs text-gray-600">Admin Reduction</div>
            </div>
            <div className="border rounded-md p-3 print:p-2">
              <div className="text-2xl font-bold text-primary mb-1 print:text-xl">95%+</div>
              <div className="text-xs text-gray-600">Occupancy Rate</div>
            </div>
            <div className="border rounded-md p-3 print:p-2">
              <div className="text-2xl font-bold text-primary mb-1 print:text-xl">£23/bed</div>
              <div className="text-xs text-gray-600">Monthly Savings</div>
            </div>
          </div>

          {/* Key Features */}
          <div className="mb-4 print:mb-3">
            <h2 className="text-lg font-semibold text-gray-900 mb-2 print:text-base">Key Features</h2>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-start gap-2">
                <Zap className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="text-gray-900">AI-Powered Enquiry Handling</strong>
                  <p className="text-xs text-gray-600">24/7 instant responses via WhatsApp, SMS, and email</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Building2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="text-gray-900">Automated Viewing Coordination</strong>
                  <p className="text-xs text-gray-600">Self-service booking with calendar sync and reminders</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="text-gray-900">Digital Contract Workflows</strong>
                  <p className="text-xs text-gray-600">E-signatures, deposit collection, and ID verification</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <TrendingUp className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="text-gray-900">Real-Time Analytics</strong>
                  <p className="text-xs text-gray-600">Occupancy tracking, conversion metrics, and forecasting</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Users className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="text-gray-900">Tenant Lifecycle Management</strong>
                  <p className="text-xs text-gray-600">Automated rent reminders, maintenance triage, inspections</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="text-gray-900">GDPR & Security Compliance</strong>
                  <p className="text-xs text-gray-600">UK data residency, AES-256 encryption, SOC 2 aligned</p>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing & Implementation */}
          <div className="grid grid-cols-2 gap-4 mb-4 print:mb-3">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2 print:text-base">Pricing</h2>
              <ul className="text-sm space-y-1">
                <li className="flex items-center gap-2">
                  <Check className="w-3 h-3 text-primary flex-shrink-0" />
                  <span>Starting from <strong>£99/month</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3 h-3 text-primary flex-shrink-0" />
                  <span>14-day free trial (no credit card)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3 h-3 text-primary flex-shrink-0" />
                  <span>Volume discounts for 10+ properties</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3 h-3 text-primary flex-shrink-0" />
                  <span>Implementation included</span>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2 print:text-base">Implementation Timeline</h2>
              <ul className="text-sm space-y-1">
                <li className="flex items-center gap-2">
                  <Clock className="w-3 h-3 text-primary flex-shrink-0" />
                  <span><strong>Week 1-2:</strong> Setup & integration</span>
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="w-3 h-3 text-primary flex-shrink-0" />
                  <span><strong>Week 3-4:</strong> Testing & training</span>
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="w-3 h-3 text-primary flex-shrink-0" />
                  <span><strong>Week 5-6:</strong> Go-live & optimization</span>
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="w-3 h-3 text-primary flex-shrink-0" />
                  <span>Full onboarding: <strong>4-6 weeks</strong></span>
                </li>
              </ul>
            </div>
          </div>

          {/* Security & Compliance */}
          <div className="mb-4 print:mb-3 border rounded-md p-3 bg-gray-50 print:bg-white print:p-2">
            <h2 className="text-base font-semibold text-gray-900 mb-2 print:text-sm">Security & Compliance</h2>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="flex items-center gap-1">
                <Shield className="w-3 h-3 text-primary flex-shrink-0" />
                <span>UK Data Residency</span>
              </div>
              <div className="flex items-center gap-1">
                <Shield className="w-3 h-3 text-primary flex-shrink-0" />
                <span>GDPR Compliant</span>
              </div>
              <div className="flex items-center gap-1">
                <Shield className="w-3 h-3 text-primary flex-shrink-0" />
                <span>AES-256 Encryption</span>
              </div>
              <div className="flex items-center gap-1">
                <Shield className="w-3 h-3 text-primary flex-shrink-0" />
                <span>SOC 2 Aligned</span>
              </div>
              <div className="flex items-center gap-1">
                <Shield className="w-3 h-3 text-primary flex-shrink-0" />
                <span>ISO 27001 Roadmap</span>
              </div>
              <div className="flex items-center gap-1">
                <Shield className="w-3 h-3 text-primary flex-shrink-0" />
                <span>Regular Penetration Testing</span>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mb-4 text-center print:mb-3">
            <div className="inline-block border-2 border-primary rounded-md px-6 py-2 print:border print:px-4 print:py-1">
              <div className="font-semibold text-primary text-base print:text-sm">Ready to reduce admin by 40%?</div>
              <div className="text-sm text-gray-600 print:text-xs">Book a personalized demo at termflow.co.uk/book-demo</div>
            </div>
          </div>

          {/* Footer with contact */}
          <div className="pt-3 border-t text-xs text-gray-600">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Mail className="w-3 h-3 flex-shrink-0" />
                <span>hello@termflow.co.uk</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3 h-3 flex-shrink-0" />
                <span>termflow.co.uk/book-demo</span>
              </div>
            </div>
            <div className="mt-2 text-center text-gray-500">
              TermFlow Limited | UK Company | GDPR Compliant | termflow.co.uk
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
