import { Helmet } from "react-helmet-async";

export function EnhancedStructuredData() {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://termflow.com';

  // Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "TermFlow",
    "description": "AI-powered lettings automation platform for student accommodation landlords. Automate enquiries, viewings, contracts, and payments with 95% accuracy.",
    "url": baseUrl,
    "logo": `${baseUrl}/logo.png`,
    "foundingDate": "2024",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "GB",
      "addressRegion": "England"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Sales",
      "email": "hello@termflow.com",
      "availableLanguage": ["en"]
    },
    "sameAs": [
      "https://linkedin.com/company/termflow",
      "https://twitter.com/termflow"
    ]
  };

  // WebSite Schema with SearchAction
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "TermFlow",
    "url": baseUrl,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${baseUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  // SoftwareApplication Schema (for the product)
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "TermFlow",
    "applicationCategory": "Property Management Software",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "GBP",
      "priceValidUntil": "2026-12-31",
      "description": "14-day free trial, then from £99/month"
    },
    "author": {
      "@type": "Organization",
      "name": "TermFlow"
    },
    "featureList": [
      "AI-powered chat assistant (Ava)",
      "24/7 multilingual support",
      "Automated viewing scheduling",
      "Digital contract management",
      "Secure payment processing",
      "Real-time analytics dashboard",
      "WhatsApp integration",
      "Email automation",
      "Right-to-Rent compliance"
    ]
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(softwareSchema)}
      </script>
    </Helmet>
  );
}
