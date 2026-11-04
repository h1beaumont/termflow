import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { TermFlowWordmark } from "@/components/TermFlowLogo";
import { Download, Mail, Phone, Shield, Database, Cloud, Lock, Server, Zap, CheckCircle } from "lucide-react";

export default function TechnicalOverview() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <SEOHead
        title="TermFlow Technical Overview | IT & Security Specifications"
        description="Technical architecture, security, and integration specifications for TermFlow's PBSA automation platform"
        canonical="https://termflow.co.uk/one-pagers/technical-overview"
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
            <span className="text-sm text-gray-600">Technical Overview</span>
          </div>

          {/* Hero Section */}
          <div className="mb-4 print:mb-3">
            <h1 className="text-2xl font-bold text-gray-900 mb-2 print:text-xl">
              Technical Architecture & Security Specifications
            </h1>
            <p className="text-gray-700 leading-relaxed text-sm">
              TermFlow is built on a modern, cloud-native architecture with UK-based data residency. 
              Our platform uses PostgreSQL (Neon), Google Cloud infrastructure, and enterprise-grade security 
              controls to ensure data protection, scalability, and compliance with UK/EU regulations.
            </p>
          </div>

          {/* Security & Compliance */}
          <div className="mb-4 print:mb-3">
            <h2 className="text-lg font-semibold text-gray-900 mb-2 print:text-base flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Security & Compliance
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="border rounded-md p-2">
                <div className="font-semibold text-sm text-gray-900 mb-1">Data Residency</div>
                <ul className="text-xs space-y-0.5 text-gray-600">
                  <li>• UK/EU data centers only</li>
                  <li>• No data transfer outside UK/EU</li>
                  <li>• Google Cloud London (europe-west2)</li>
                </ul>
              </div>
              <div className="border rounded-md p-2">
                <div className="font-semibold text-sm text-gray-900 mb-1">Encryption</div>
                <ul className="text-xs space-y-0.5 text-gray-600">
                  <li>• AES-256 encryption at rest</li>
                  <li>• TLS 1.3 in transit</li>
                  <li>• End-to-end encrypted webhooks</li>
                </ul>
              </div>
              <div className="border rounded-md p-2">
                <div className="font-semibold text-sm text-gray-900 mb-1">Compliance</div>
                <ul className="text-xs space-y-0.5 text-gray-600">
                  <li>• GDPR compliant (UK GDPR & EU GDPR)</li>
                  <li>• SOC 2 Type II aligned</li>
                  <li>• ISO 27001 roadmap (Q3 2025)</li>
                </ul>
              </div>
              <div className="border rounded-md p-2">
                <div className="font-semibold text-sm text-gray-900 mb-1">Access Control</div>
                <ul className="text-xs space-y-0.5 text-gray-600">
                  <li>• Role-based access control (RBAC)</li>
                  <li>• Multi-factor authentication (MFA)</li>
                  <li>• Audit logging for all actions</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Infrastructure */}
          <div className="mb-4 print:mb-3">
            <h2 className="text-lg font-semibold text-gray-900 mb-2 print:text-base flex items-center gap-2">
              <Cloud className="w-5 h-5 text-primary" />
              Infrastructure & Architecture
            </h2>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="border rounded-md p-2 bg-gray-50 print:bg-white">
                <div className="flex items-center gap-1 mb-1">
                  <Database className="w-3 h-3 text-primary" />
                  <span className="font-semibold text-gray-900">Database</span>
                </div>
                <div className="text-gray-600">Neon PostgreSQL (serverless)</div>
              </div>
              <div className="border rounded-md p-2 bg-gray-50 print:bg-white">
                <div className="flex items-center gap-1 mb-1">
                  <Server className="w-3 h-3 text-primary" />
                  <span className="font-semibold text-gray-900">Hosting</span>
                </div>
                <div className="text-gray-600">Google Cloud (UK)</div>
              </div>
              <div className="border rounded-md p-2 bg-gray-50 print:bg-white">
                <div className="flex items-center gap-1 mb-1">
                  <Lock className="w-3 h-3 text-primary" />
                  <span className="font-semibold text-gray-900">Storage</span>
                </div>
                <div className="text-gray-600">GCS (UK region)</div>
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-600 border-l-2 border-primary pl-2">
              <strong>Uptime SLA:</strong> 99.9% guaranteed | <strong>Backup:</strong> Automated daily backups with 30-day retention | <strong>Disaster Recovery:</strong> Multi-region failover capability
            </div>
          </div>

          {/* Integrations */}
          <div className="mb-4 print:mb-3">
            <h2 className="text-lg font-semibold text-gray-900 mb-2 print:text-base flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Integrations & API
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="font-semibold text-sm text-gray-900 mb-1">Supported Integrations</div>
                <div className="grid grid-cols-2 gap-1 text-xs text-gray-600">
                  <div>• StarRez PMS</div>
                  <div>• Stripe Payments</div>
                  <div>• Kinetic PMS</div>
                  <div>• Twilio (SMS/Voice)</div>
                  <div>• Yardi Voyager</div>
                  <div>• WhatsApp Business</div>
                  <div>• Google Calendar</div>
                  <div>• DocuSign</div>
                  <div>• Google Sheets</div>
                  <div>• n8n Workflows</div>
                </div>
              </div>
              <div>
                <div className="font-semibold text-sm text-gray-900 mb-1">API Capabilities</div>
                <ul className="text-xs space-y-0.5 text-gray-600">
                  <li>• RESTful API (OAuth 2.0)</li>
                  <li>• Webhooks for real-time events</li>
                  <li>• Rate limiting: 1000 req/min</li>
                  <li>• Comprehensive API documentation</li>
                  <li>• Test environment (sandbox)</li>
                  <li>• Postman collections provided</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Data Protection */}
          <div className="mb-4 print:mb-3">
            <h2 className="text-lg font-semibold text-gray-900 mb-2 print:text-base">Data Protection Measures</h2>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="flex items-start gap-1">
                <CheckCircle className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <strong>PII Sanitization:</strong> Automatic redaction in logs
                </div>
              </div>
              <div className="flex items-start gap-1">
                <CheckCircle className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Data Retention:</strong> Configurable retention policies
                </div>
              </div>
              <div className="flex items-start gap-1">
                <CheckCircle className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Right to Erasure:</strong> GDPR deletion within 30 days
                </div>
              </div>
              <div className="flex items-start gap-1">
                <CheckCircle className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Data Portability:</strong> Export in JSON/CSV format
                </div>
              </div>
              <div className="flex items-start gap-1">
                <CheckCircle className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Breach Notification:</strong> Within 72 hours
                </div>
              </div>
              <div className="flex items-start gap-1">
                <CheckCircle className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Penetration Testing:</strong> Annual third-party audits
                </div>
              </div>
            </div>
          </div>

          {/* Support & SLA */}
          <div className="mb-4 print:mb-3 border rounded-md p-3 bg-gray-50 print:bg-white print:p-2">
            <h2 className="text-base font-semibold text-gray-900 mb-2 print:text-sm">Support & SLA</h2>
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div>
                <div className="font-semibold text-gray-900 mb-1">Standard Support</div>
                <div className="text-gray-600">Mon-Fri 9am-6pm GMT</div>
                <div className="text-gray-600">Response: 4 hours</div>
              </div>
              <div>
                <div className="font-semibold text-gray-900 mb-1">Priority Support</div>
                <div className="text-gray-600">24/7 coverage</div>
                <div className="text-gray-600">Response: 1 hour</div>
              </div>
              <div>
                <div className="font-semibold text-gray-900 mb-1">Dedicated CSM</div>
                <div className="text-gray-600">For Operator Bundle</div>
                <div className="text-gray-600">Quarterly reviews</div>
              </div>
            </div>
          </div>

          {/* Technical Requirements */}
          <div className="mb-4 print:mb-3">
            <h2 className="text-base font-semibold text-gray-900 mb-2 print:text-sm">Technical Requirements</h2>
            <div className="text-xs text-gray-600 space-y-1">
              <div>• <strong>Browser:</strong> Modern browsers (Chrome, Firefox, Safari, Edge - latest 2 versions)</div>
              <div>• <strong>Network:</strong> Standard internet connection (no special firewall rules required)</div>
              <div>• <strong>Client Infrastructure:</strong> None - fully cloud-based SaaS</div>
              <div>• <strong>Integration Setup:</strong> API keys or OAuth 2.0 (provided during onboarding)</div>
            </div>
          </div>

          {/* Footer with contact */}
          <div className="pt-3 border-t text-xs text-gray-600">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Mail className="w-3 h-3 flex-shrink-0" />
                <span>Technical queries: tech@termflow.co.uk</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3 h-3 flex-shrink-0" />
                <span>Security questions: security@termflow.co.uk</span>
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
