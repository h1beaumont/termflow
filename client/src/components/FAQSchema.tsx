import { Helmet } from "react-helmet-async";

export interface FAQSchemaItem {
  question: string;
  answer: string;
}

interface FAQSchemaProps {
  items: FAQSchemaItem[];
}

export function FAQSchema({ items }: FAQSchemaProps) {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": items.map((item) => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(faqSchema)}
      </script>
    </Helmet>
  );
}