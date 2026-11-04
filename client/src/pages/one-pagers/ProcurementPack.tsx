import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { TermFlowWordmark } from "@/components/TermFlowLogo";
import { Download, Mail, Phone, CheckCircle, TrendingUp, CreditCard, FileText } from "lucide-react";

export default function ProcurementPack() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <SEOHead
        title="TermFlow Procurement Pack | Pricing & Contract Terms"
        description="Comprehensive procurement information for TermFlow: pricing tiers, ROI analysis, contract terms, and payment options"
        canonical="https://termflow.co.uk/one-pagers/procurement-pack"
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
            <span className="text-sm text-gray-600">Procurement Pack</span>
          </div>

          {/* Hero Section */}
          <div className="mb-4 print:mb-3">
            <h1 className="text-2xl font-bold text-gray-900 mb-2 print:text-xl">
              Pricing, ROI & Contract Terms
            </h1>
            <p className="text-gray-700 leading-relaxed text-sm">
              Transparent pricing designed for PBSA operators of all sizes. Our subscription model includes implementation, 
              training, and ongoing support. All plans include a 14-day free trial with no credit card required.
            </p>
          </div>

          {/* Pricing Tiers */}
          <div className="mb-4 print:mb-3">
            <h2 className="text-lg font-semibold text-gray-900 mb-2 print:text-base flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              Pricing Tiers
            </h2>
            <div className="grid grid-cols-3 gap-2">
              <div className="border rounded-md p-3 print:p-2">
                <div className="text-sm font-semibold text-gray-900 mb-1">Core Plan</div>
                <div className="text-xl font-bold text-primary mb-2 print:text-lg">£99<span className="text-sm text-gray-600">/mo</span></div>
                <div className="text-xs text-gray-600 mb-2">Per property (up to 50 beds)</div>
                <ul className="text-xs space-y-0.5 text-gray-600">
                  <li>• AI enquiry handling</li>
                  <li>• Viewing automation</li>
                  <li>• Digital contracts</li>
                  <li>• Basic analytics</li>
                  <li>• Email support</li>
                </ul>
              </div>
              <div className="border-2 border-primary rounded-md p-3 print:p-2 print:border">
                <div className="text-xs font-semibold text-primary mb-1">MOST POPULAR</div>
                <div className="text-sm font-semibold text-gray-900 mb-1">Operator Bundle</div>
                <div className="text-xl font-bold text-primary mb-2 print:text-lg">£399<span className="text-sm text-gray-600">/mo</span></div>
                <div className="text-xs text-gray-600 mb-2">Multi-property (unlimited beds)</div>
                <ul className="text-xs space-y-0.5 text-gray-600">
                  <li>• All Core features</li>
                  <li>• Multi-property dashboard</li>
                  <li>• Advanced analytics</li>
                  <li>• Priority support (24/7)</li>
                  <li>• Dedicated CSM</li>
                </ul>
              </div>
              <div className="border rounded-md p-3 print:p-2">
                <div className="text-sm font-semibold text-gray-900 mb-1">Add-Ons</div>
                <div className="text-xs text-gray-600 mb-2 font-semibold">Optional extras:</div>
                <ul className="text-xs space-y-0.5 text-gray-600">
                  <li>• WhatsApp Business: £49/mo</li>
                  <li>• SMS credits: £0.05/message</li>
                  <li>• Voice calls: £0.10/min</li>
                  <li>• Custom integrations: POA</li>
                  <li>• API access: Included</li>
                </ul>
              </div>
            </div>
          </div>

          {/* ROI Calculator Example */}
          <div className="mb-4 print:mb-3 border rounded-md p-3 bg-gray-50 print:bg-white print:p-2">
            <h2 className="text-base font-semibold text-gray-900 mb-2 print:text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              ROI Example: 200-Bed Property
            </h2>
            <div className="grid grid-cols-4 gap-3 text-xs">
              <div>
                <div className="font-semibold text-gray-900 mb-1">Annual Cost</div>
                <div className="text-gray-600">Core Plan: £1,188/year</div>
                <div className="text-gray-600 text-[10px]">(£99/mo × 12 months)</div>
              </div>
              <div>
                <div className="font-semibold text-gray-900 mb-1">Admin Savings</div>
                <div className="text-gray-600">40% reduction</div>
                <div className="text-gray-600 text-[10px]">~£15,000/year saved</div>
              </div>
              <div>
                <div className="font-semibold text-gray-900 mb-1">Occupancy Gain</div>
                <div className="text-gray-600">+3% occupancy</div>
                <div className="text-gray-600 text-[10px]">~£36,000/year extra</div>
              </div>
              <div className="bg-primary text-white rounded-md p-2 print:bg-gray-900">
                <div className="font-semibold mb-1">Net ROI</div>
                <div className="text-lg font-bold">43x</div>
                <div className="text-[10px]">£51k return on £1.2k</div>
              </div>
            </div>
          </div>

          {/* Contract Terms */}
          <div className="mb-4 print:mb-3">
            <h2 className="text-lg font-semibold text-gray-900 mb-2 print:text-base flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Contract Terms & Payment
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="font-semibold text-sm text-gray-900 mb-1">Contract Options</div>
                <ul className="text-xs space-y-1 text-gray-600">
                  <li className="flex items-start gap-1">
                    <CheckCircle className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                    <div><strong>Monthly rolling:</strong> No long-term commitment, 30-day notice</div>
                  </li>
                  <li className="flex items-start gap-1">
                    <CheckCircle className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                    <div><strong>Annual contract:</strong> 10% discount (pay upfront or monthly)</div>
                  </li>
                  <li className="flex items-start gap-1">
                    <CheckCircle className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                    <div><strong>Free trial:</strong> 14 days, full feature access, no credit card</div>
                  </li>
                </ul>
              </div>
              <div>
                <div className="font-semibold text-sm text-gray-900 mb-1">Payment Terms</div>
                <ul className="text-xs space-y-1 text-gray-600">
                  <li className="flex items-start gap-1">
                    <CheckCircle className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                    <div><strong>Payment methods:</strong> Direct Debit, credit/debit card, invoice (annual)</div>
                  </li>
                  <li className="flex items-start gap-1">
                    <CheckCircle className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                    <div><strong>Billing cycle:</strong> Monthly in advance (auto-renewal)</div>
                  </li>
                  <li className="flex items-start gap-1">
                    <CheckCircle className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                    <div><strong>Invoice terms:</strong> Net 30 days for annual contracts (£3k+ only)</div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Implementation & Ongoing Costs */}
          <div className="mb-4 print:mb-3">
            <h2 className="text-base font-semibold text-gray-900 mb-2 print:text-sm">Implementation & Ongoing Costs</h2>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="border rounded-md p-2 bg-green-50 print:bg-white">
                <div className="font-semibold text-gray-900 mb-1">Setup Cost</div>
                <div className="text-2xl font-bold text-green-700 print:text-gray-900">£0</div>
                <div className="text-gray-600 mt-1">Included in subscription</div>
              </div>
              <div className="border rounded-md p-2">
                <div className="font-semibold text-gray-900 mb-1">Implementation</div>
                <div className="text-gray-600">4-6 weeks onboarding</div>
                <div className="text-gray-600">Training & support included</div>
              </div>
              <div className="border rounded-md p-2">
                <div className="font-semibold text-gray-900 mb-1">Ongoing</div>
                <div className="text-gray-600">Monthly subscription only</div>
                <div className="text-gray-600">No hidden fees</div>
              </div>
            </div>
          </div>

          {/* Volume Discounts & Cancellation */}
          <div className="mb-4 print:mb-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="border rounded-md p-2 bg-gray-50 print:bg-white">
                <div className="font-semibold text-sm text-gray-900 mb-1">Volume Discounts</div>
                <ul className="text-xs space-y-0.5 text-gray-600">
                  <li>• 10-25 properties: 15% discount</li>
                  <li>• 26-50 properties: 25% discount</li>
                  <li>• 51+ properties: Custom pricing (contact us)</li>
                  <li>• Portfolio-wide license available</li>
                </ul>
              </div>
              <div className="border rounded-md p-2 bg-gray-50 print:bg-white">
                <div className="font-semibold text-sm text-gray-900 mb-1">Cancellation Policy</div>
                <ul className="text-xs space-y-0.5 text-gray-600">
                  <li>• 30-day notice required for monthly plans</li>
                  <li>• Annual contracts: cancel anytime, no refund for unused period</li>
                  <li>• Data export provided within 7 days</li>
                  <li>• No termination fees</li>
                </ul>
              </div>
            </div>
          </div>

          {/* What's Included */}
          <div className="mb-4 print:mb-3 border rounded-md p-3 bg-blue-50 print:bg-white print:p-2">
            <h2 className="text-base font-semibold text-gray-900 mb-2 print:text-sm">What's Included in All Plans</h2>
            <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
              <div className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-primary flex-shrink-0" />
                <span>Implementation & training</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-primary flex-shrink-0" />
                <span>Unlimited users</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-primary flex-shrink-0" />
                <span>Regular platform updates</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-primary flex-shrink-0" />
                <span>99.9% uptime SLA</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-primary flex-shrink-0" />
                <span>UK data residency</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-primary flex-shrink-0" />
                <span>GDPR compliance</span>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mb-4 text-center print:mb-3">
            <div className="inline-block border-2 border-primary rounded-md px-6 py-2 print:border print:px-4 print:py-1">
              <div className="font-semibold text-primary text-base print:text-sm">Start your 14-day free trial today</div>
              <div className="text-sm text-gray-600 print:text-xs">No credit card required | termflow.co.uk/book-demo</div>
            </div>
          </div>

          {/* Footer with contact */}
          <div className="pt-3 border-t text-xs text-gray-600">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Mail className="w-3 h-3 flex-shrink-0" />
                <span>Procurement: procurement@termflow.co.uk</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3 h-3 flex-shrink-0" />
                <span>Sales: hello@termflow.co.uk</span>
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
