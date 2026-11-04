import { Helmet } from "react-helmet-async";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  items: FAQItem[];
  title?: string;
  description?: string;
}

export function FAQ({ items, title = "Frequently Asked Questions", description }: FAQProps) {
  // Generate JSON-LD structured data for FAQPage
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": items.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      </Helmet>

      {/* FAQ Section */}
      <div className="w-full" data-testid="faq-section">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <HelpCircle className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-bold" data-testid="faq-title">{title}</h2>
          </div>
          {description && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="faq-description">
              {description}
            </p>
          )}
        </div>

        <Accordion type="single" collapsible className="w-full">
          {items.map((item, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`} 
              data-testid={`faq-item-${index}`}
            >
              <AccordionTrigger className="text-left hover:no-underline" data-testid={`faq-question-${index}`}>
                <span className="font-semibold">{item.question}</span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground" data-testid={`faq-answer-${index}`}>
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </>
  );
}
